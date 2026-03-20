# SPDX-License-Identifier: Apache-2.0
"""Custom CSS+SVG web UI for token-workshed.

This app serves a handcrafted UI inspired by NumberGenerator 2.0.0 and
forwards chat requests to a running vllm-mlx OpenAI-compatible server.
"""

from __future__ import annotations

import argparse
import json
import math
import re
import threading
import time
import webbrowser
from pathlib import Path
from typing import Any

import requests
import uvicorn
from fastapi import FastAPI, HTTPException, Query
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

UI_DIR = Path(__file__).resolve().parent / "ui_css_svg"
DEEP_THINKING_HINT = (
    "Auto Thinking Mode: decide whether deep reasoning is necessary. "
    "For simple requests, answer directly with `Final Answer`. "
    "For complex requests, use two sections in order: `Thinking Process` then `Final Answer`. "
    "Keep section titles in English exactly as written when you use them. "
    "The section CONTENT language must match the user's latest message language. "
    "Keep `Thinking Process` concise (max 8 short bullet points)."
)
THINKING_HEADER_RE = re.compile(
    r"(?is)^\s{0,3}(?:#{1,6}\s*)?(?:thinking process|reasoning|思考过程|推理过程|思考)\s*:?\s*"
)
FINAL_ANSWER_MARKER_RE = re.compile(
    r"(?is)(?:^|\n)\s{0,3}(?:#{1,6}\s*)?(?:final answer|answer|最终答案|最终回答|答案)\s*:?\s*"
)
LEADING_FINAL_ANSWER_RE = re.compile(
    r"(?is)^\s{0,3}(?:#{1,6}\s*)?(?:final answer|answer|最终答案|最终回答|答案)\s*:?\s*"
)
THINK_OPEN_TAG_RE = re.compile(r"(?is)<think>")
THINK_CLOSE_TAG_RE = re.compile(r"(?is)</think>")
TITLE_MODEL_CANDIDATES = (
    # User-requested title model: functiongemma-270m-INT4 (MLX repo naming is *-it-4bit)
    "mlx-community/functiongemma-270m-it-4bit",
    "mlx-community/functiongemma-270m-it-8bit",
)
_TITLE_MODEL_LOCK = threading.Lock()
_TITLE_MODEL: Any | None = None
_TITLE_TOKENIZER: Any | None = None
_TITLE_MODEL_ID = ""
_TITLE_MODEL_DISABLED = False


class ChatRequest(BaseModel):
    """Payload sent by the frontend chat page."""

    message: str = Field(default="")
    user_content: Any | None = None
    history: list[dict[str, Any]] = Field(default_factory=list)
    server_url: str | None = None
    max_tokens: int | None = None
    temperature: float | None = None
    system_prompt: str | None = None
    model: str | None = None


class TitleRequest(BaseModel):
    """Payload sent by frontend to generate a concise conversation title."""

    messages: list[dict[str, Any]] = Field(default_factory=list)
    fallback: str = Field(default="New Conversation")


class UIConfig(BaseModel):
    """Default settings exposed to the frontend on load."""

    server_url: str
    max_tokens: int
    temperature: float


def _normalize_title_text(raw: str, fallback: str = "New Conversation") -> str:
    """Normalize generated conversation title for stable UI rendering."""
    text = str(raw or "")
    text = re.sub(r"[\r\n]+", " ", text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"`+|[*_#>\[\]\(\)]", " ", text)
    text = re.sub(
        r"^\s*(?:title|conversation title|topic)\s*[:\-]\s*",
        "",
        text,
        flags=re.IGNORECASE,
    )
    text = re.sub(r"^[\"'“”‘’]+|[\"'“”‘’]+$", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"[.,;:!?-]+$", "", text).strip()
    if not text:
        text = str(fallback or "").strip() or "New Conversation"
    if len(text) > 64:
        text = f"{text[:64]}..."
    return text


def _heuristic_title_from_messages(
    messages: list[dict[str, Any]],
    fallback: str = "New Conversation",
) -> str:
    """Build a readable fallback title from first meaningful user line."""
    for item in messages:
        if not isinstance(item, dict):
            continue
        if str(item.get("role", "")).strip().lower() != "user":
            continue
        raw = str(item.get("content", ""))
        for line in re.split(r"\n+", raw):
            candidate = line.strip()
            if not candidate:
                continue
            if re.match(r"^\[(image|video)\]", candidate, flags=re.IGNORECASE):
                continue
            candidate = re.sub(r"https?://\S+", "", candidate)
            candidate = re.sub(r"\s+", " ", candidate).strip()
            if candidate:
                return _normalize_title_text(candidate, fallback)
    return _normalize_title_text("", fallback)


def _build_title_seed(messages: list[dict[str, Any]]) -> str:
    """Build compact dialogue snippet for lightweight title generation."""
    snippets: list[str] = []
    for item in messages[-14:]:
        if not isinstance(item, dict):
            continue
        role = str(item.get("role", "")).strip().lower()
        if role not in {"user", "assistant"}:
            continue
        content = str(item.get("content", ""))
        if not content.strip():
            continue
        content = re.sub(r"\[(?:image|video)\]\s*[^\n]*", "", content, flags=re.IGNORECASE)
        content = re.sub(r"\s+", " ", content).strip()
        if not content:
            continue
        if len(content) > 320:
            content = f"{content[:320]}..."
        prefix = "User" if role == "user" else "Assistant"
        snippets.append(f"{prefix}: {content}")
    return "\n".join(snippets[-10:])[:2200]


def _load_title_model() -> tuple[Any, Any, str] | None:
    """Lazy-load ultra-light title model (auto-download on first use)."""
    global _TITLE_MODEL, _TITLE_TOKENIZER, _TITLE_MODEL_ID, _TITLE_MODEL_DISABLED
    with _TITLE_MODEL_LOCK:
        if (
            _TITLE_MODEL is not None
            and _TITLE_TOKENIZER is not None
            and _TITLE_MODEL_ID in TITLE_MODEL_CANDIDATES
        ):
            return _TITLE_MODEL, _TITLE_TOKENIZER, _TITLE_MODEL_ID
        if _TITLE_MODEL is not None and _TITLE_MODEL_ID not in TITLE_MODEL_CANDIDATES:
            _TITLE_MODEL = None
            _TITLE_TOKENIZER = None
            _TITLE_MODEL_ID = ""
        if _TITLE_MODEL_DISABLED:
            return None

        try:
            from mlx_lm import load
        except Exception:
            _TITLE_MODEL_DISABLED = True
            return None

        for model_id in TITLE_MODEL_CANDIDATES:
            try:
                model, tokenizer = load(model_id)
                _TITLE_MODEL = model
                _TITLE_TOKENIZER = tokenizer
                _TITLE_MODEL_ID = model_id
                return model, tokenizer, model_id
            except Exception:
                continue

        _TITLE_MODEL_DISABLED = True
        return None


def _release_title_model() -> None:
    """Release title model weights to reduce memory interference with main model."""
    global _TITLE_MODEL, _TITLE_TOKENIZER, _TITLE_MODEL_ID
    with _TITLE_MODEL_LOCK:
        _TITLE_MODEL = None
        _TITLE_TOKENIZER = None
        _TITLE_MODEL_ID = ""
    try:
        import gc

        gc.collect()
    except Exception:
        pass
    try:
        import mlx.core as mx

        clear_fn = getattr(mx, "clear_cache", None)
        if callable(clear_fn):
            clear_fn()
        else:
            mx.metal.clear_cache()
    except Exception:
        pass


def _generate_title_with_light_model(seed_text: str) -> tuple[str | None, str]:
    """Generate title with configured lightweight title model, fallback on error."""
    loaded = _load_title_model()
    if loaded is None:
        return None, "fallback"

    model, tokenizer, model_id = loaded
    try:
        from mlx_lm import generate
        from mlx_lm.sample_utils import make_sampler

        prompt = (
            "You write concise conversation titles.\n"
            "Rules:\n"
            "- 3 to 8 words.\n"
            "- Keep same language as the user's conversation.\n"
            "- No markdown.\n"
            "- Output only the title text.\n\n"
            f"Conversation:\n{seed_text}\n\n"
            "Title:"
        )

        sampler = make_sampler(temp=0.1, top_p=0.9)
        generated = generate(
            model,
            tokenizer,
            prompt=prompt,
            max_tokens=20,
            sampler=sampler,
            verbose=False,
        )
        return _normalize_title_text(generated, ""), model_id
    except Exception:
        return None, "fallback"
    finally:
        _release_title_model()


def _generate_conversation_title(
    messages: list[dict[str, Any]],
    fallback: str = "New Conversation",
) -> tuple[str, str]:
    """Generate robust title: lightweight model first, heuristic fallback second."""
    safe_fallback = _normalize_title_text("", fallback)
    seed_text = _build_title_seed(messages)
    if not seed_text.strip():
        return safe_fallback, "fallback"

    generated, source = _generate_title_with_light_model(seed_text)
    if generated:
        return _normalize_title_text(generated, safe_fallback), source

    return _heuristic_title_from_messages(messages, safe_fallback), "fallback"


def _normalize_server_url(raw_url: str) -> str:
    """Normalize user-supplied server URL to a safe http(s) URL."""
    value = raw_url.strip()
    if not value:
        raise ValueError("Server URL cannot be empty.")

    if not value.startswith(("http://", "https://")):
        value = f"http://{value}"

    return value.rstrip("/")


def _clamp_max_tokens(value: int | None, default: int) -> int:
    if value is None:
        return default
    return max(1, min(16384, int(value)))


def _clamp_temperature(value: float | None, default: float) -> float:
    if value is None:
        return default
    return max(0.0, min(2.0, float(value)))


def _extract_content_text(content: Any) -> str:
    """Extract plain text from OpenAI-style text or multimodal content."""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        text_parts: list[str] = []
        for part in content:
            if isinstance(part, dict) and part.get("type") == "text":
                text = part.get("text")
                if isinstance(text, str):
                    text_parts.append(text)
        return "\n".join(part for part in text_parts if part)
    if isinstance(content, dict):
        text = content.get("text")
        if isinstance(text, str):
            return text
    return str(content)


def _extract_url_like(value: Any) -> str | None:
    """Extract URL/base64 payload from common multimodal fields."""
    if isinstance(value, str):
        url = value.strip()
        return url if url else None
    if isinstance(value, dict):
        raw_url = value.get("url")
        if isinstance(raw_url, str) and raw_url.strip():
            return raw_url.strip()
    return None


def _normalize_content_for_api(content: Any) -> str | list[dict[str, Any]] | None:
    """Normalize message content into OpenAI-compatible text or content-part list."""
    if isinstance(content, str):
        text = content.strip()
        return text if text else None

    if isinstance(content, dict):
        content = [content]

    if isinstance(content, list):
        parts: list[dict[str, Any]] = []
        for raw_part in content:
            part = raw_part
            if hasattr(part, "model_dump"):
                part = part.model_dump()
            elif hasattr(part, "dict"):
                part = part.dict()

            if not isinstance(part, dict):
                continue

            part_type = str(part.get("type", "")).strip().lower()
            if part_type == "text":
                text = part.get("text")
                if isinstance(text, str) and text.strip():
                    parts.append({"type": "text", "text": text})
                continue

            if part_type == "image_url":
                image_url = _extract_url_like(part.get("image_url"))
                if image_url is None:
                    image_url = _extract_url_like(part.get("url"))
                if image_url:
                    parts.append({"type": "image_url", "image_url": {"url": image_url}})
                continue

            if part_type == "video_url":
                video_url = _extract_url_like(part.get("video_url"))
                if video_url is None:
                    video_url = _extract_url_like(part.get("url"))
                if video_url:
                    parts.append({"type": "video_url", "video_url": {"url": video_url}})
                continue

            if part_type == "image":
                image_url = _extract_url_like(part.get("image"))
                if image_url is None:
                    image_url = _extract_url_like(part.get("url"))
                if image_url:
                    parts.append({"type": "image", "image": image_url})
                continue

            if part_type == "video":
                video_url = _extract_url_like(part.get("video"))
                if video_url is None:
                    video_url = _extract_url_like(part.get("url"))
                if video_url:
                    parts.append({"type": "video", "video": video_url})
                continue

        return parts or None

    if content is None:
        return None

    # Fallback for unknown content types.
    text = str(content).strip()
    return text if text else None


def _extract_token_usage(data: dict[str, Any]) -> tuple[int | None, int | None, int | None]:
    """Extract token usage counters from OpenAI-compatible response payload."""
    usage = data.get("usage")
    if not isinstance(usage, dict):
        return None, None, None

    prompt_tokens_raw = usage.get("prompt_tokens")
    completion_tokens_raw = usage.get("completion_tokens")
    total_tokens_raw = usage.get("total_tokens")

    prompt_tokens = (
        int(prompt_tokens_raw) if isinstance(prompt_tokens_raw, (int, float)) else None
    )
    completion_tokens = (
        int(completion_tokens_raw)
        if isinstance(completion_tokens_raw, (int, float))
        else None
    )
    total_tokens = (
        int(total_tokens_raw) if isinstance(total_tokens_raw, (int, float)) else None
    )
    return prompt_tokens, completion_tokens, total_tokens


def _fetch_models(target: str, timeout: float = 8.0) -> tuple[list[str], str]:
    """Fetch model list from OpenAI-compatible /v1/models."""
    response = requests.get(f"{target}/v1/models", timeout=timeout)
    response.raise_for_status()
    data = response.json()

    models_raw = data.get("data") if isinstance(data, dict) else None
    models: list[str] = []
    if isinstance(models_raw, list):
        for item in models_raw:
            if isinstance(item, dict):
                model_id = item.get("id")
                if isinstance(model_id, str) and model_id.strip():
                    models.append(model_id.strip())

    if not models:
        models = ["default"]

    default_model = models[0]
    return models, default_model


def _coerce_float(value: Any) -> float | None:
    """Convert numeric payload values to finite floats."""
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        result = float(value)
        if math.isfinite(result):
            return result
    return None


def _detect_reasoning_parser(model_id: str) -> str | None:
    """Infer best reasoning parser for a model ID."""
    normalized = model_id.strip().lower()
    if not normalized:
        return None

    if "qwen3" in normalized or "qwq" in normalized:
        return "qwen3"
    if "deepseek" in normalized and "r1" in normalized:
        return "deepseek_r1"
    if "gpt-oss" in normalized:
        return "gpt_oss"
    if "harmony" in normalized:
        return "harmony"
    return None


def _detect_model_capability(model_id: str) -> dict[str, Any]:
    """Infer model capability metadata for UI hints."""
    normalized = model_id.strip().lower()
    reasoning_parser = _detect_reasoning_parser(model_id)
    deep_thinking = bool(reasoning_parser) or any(
        token in normalized for token in ("nemotron", "reasoner", "thinking")
    )
    return {
        "deep_thinking": deep_thinking,
        "reasoning_parser": reasoning_parser,
    }


def _build_model_capabilities(models: list[str]) -> dict[str, dict[str, Any]]:
    """Build capability map keyed by model id."""
    return {model_id: _detect_model_capability(model_id) for model_id in models}


def _compose_system_prompt_for_model(
    system_prompt: str,
    selected_model: str,
) -> tuple[str, dict[str, Any]]:
    """Inject deep-thinking instruction for capable models when user did not set one."""
    capability = _detect_model_capability(selected_model)
    prompt = system_prompt.strip()

    if not capability.get("deep_thinking"):
        return prompt, capability

    language_guard = (
        "For `Thinking Process` and `Final Answer`, keep titles in English, "
        "but write content in the same language as the user's latest message."
    )

    original_lowered = prompt.lower()
    has_structure_instruction = any(
        token in original_lowered
        for token in (
            "thinking process",
            "final answer",
            "deep thinking mode",
            "step-by-step",
            "深度思考",
            "逐步推理",
            "最终答案",
            "reasoning",
            "答案",
        )
    )

    has_language_guard = (
        "same language as the user's latest message" in original_lowered
        or "content language must match the user's latest message language"
        in original_lowered
    )
    if not has_language_guard:
        prompt = f"{prompt}\n\n{language_guard}" if prompt else language_guard

    if has_structure_instruction:
        return prompt, capability

    if prompt:
        return f"{prompt}\n\n{DEEP_THINKING_HINT}", capability
    return DEEP_THINKING_HINT, capability


def _tune_generation_for_model(
    *,
    max_tokens: int,
    temperature: float,
    model_capability: dict[str, Any],
) -> tuple[int, float]:
    """Apply conservative generation tuning for deep-thinking models."""
    tuned_max_tokens = max_tokens
    tuned_temperature = temperature

    if bool(model_capability.get("deep_thinking")):
        # Deep-thinking responses need room for reasoning + final answer.
        tuned_max_tokens = max(max_tokens, 320)
        # Lower temperature improves reasoning stability.
        tuned_temperature = min(temperature, 0.3)

    return tuned_max_tokens, tuned_temperature


def _stream_json_line(payload: dict[str, Any]) -> str:
    """Encode a streaming JSON event line."""
    return json.dumps(payload, ensure_ascii=False) + "\n"


def _fetch_runtime_metrics(target: str, timeout: float = 8.0) -> dict[str, Any]:
    """Fetch runtime + memory metrics from /v1/status and local system stats."""
    response = requests.get(f"{target}/v1/status", timeout=timeout)
    response.raise_for_status()
    data = response.json()

    if not isinstance(data, dict):
        return {}

    metal = data.get("metal")
    metal_data = metal if isinstance(metal, dict) else {}

    metal_active_gb = _coerce_float(metal_data.get("active_memory_gb"))
    metal_peak_gb = _coerce_float(metal_data.get("peak_memory_gb"))
    metal_cache_gb = _coerce_float(metal_data.get("cache_memory_gb"))

    system_total_gb: float | None = None
    system_used_gb: float | None = None
    system_pressure_pct: float | None = None
    try:
        import psutil

        vm = psutil.virtual_memory()
        system_total_gb = float(vm.total) / (1024.0**3)
        system_used_gb = float(vm.used) / (1024.0**3)
        system_pressure_pct = _coerce_float(vm.percent)
    except Exception:
        # Optional best-effort metric source.
        pass

    memory_usage_gb = metal_active_gb if metal_active_gb is not None else system_used_gb

    memory_pressure_pct: float | None = None
    if (
        memory_usage_gb is not None
        and system_total_gb is not None
        and system_total_gb > 0
    ):
        memory_pressure_pct = (memory_usage_gb / system_total_gb) * 100.0
    elif system_pressure_pct is not None:
        memory_pressure_pct = system_pressure_pct

    if memory_pressure_pct is not None:
        memory_pressure_pct = min(100.0, max(0.0, memory_pressure_pct))

    return {
        "status": data.get("status"),
        "memory_usage_gb": (
            round(memory_usage_gb, 2) if isinstance(memory_usage_gb, float) else None
        ),
        "memory_pressure_pct": (
            round(memory_pressure_pct, 1)
            if isinstance(memory_pressure_pct, float)
            else None
        ),
        "metal_active_memory_gb": (
            round(metal_active_gb, 2) if isinstance(metal_active_gb, float) else None
        ),
        "metal_peak_memory_gb": (
            round(metal_peak_gb, 2) if isinstance(metal_peak_gb, float) else None
        ),
        "metal_cache_memory_gb": (
            round(metal_cache_gb, 2) if isinstance(metal_cache_gb, float) else None
        ),
        "system_total_memory_gb": (
            round(system_total_gb, 2) if isinstance(system_total_gb, float) else None
        ),
    }


def _build_messages(
    history: list[dict[str, Any]],
    system_prompt: str,
    user_message: str,
    user_content: Any | None = None,
) -> list[dict[str, Any]]:
    """Build OpenAI-compatible message history."""
    messages: list[dict[str, Any]] = []

    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})

    for item in history:
        if not isinstance(item, dict):
            continue

        role = str(item.get("role", "")).strip().lower()
        if role not in {"system", "user", "assistant"}:
            continue

        content = _normalize_content_for_api(item.get("content", ""))
        if content is not None:
            messages.append({"role": role, "content": content})

    normalized_user_content = _normalize_content_for_api(
        user_content if user_content is not None else user_message
    )
    if normalized_user_content is None:
        raise ValueError("Message cannot be empty.")

    messages.append({"role": "user", "content": normalized_user_content})
    return messages


def create_app(
    default_server_url: str,
    default_max_tokens: int,
    default_temperature: float,
) -> FastAPI:
    """Create a FastAPI app serving static UI + chat proxy API."""
    app = FastAPI(title="token-workshed CSS+SVG UI", version="0.1.0")
    app.state.server_url = _normalize_server_url(default_server_url)
    app.state.max_tokens = _clamp_max_tokens(default_max_tokens, 512)
    app.state.temperature = _clamp_temperature(default_temperature, 0.7)

    app.mount("/assets", StaticFiles(directory=UI_DIR), name="assets")

    @app.get("/")
    async def index() -> FileResponse:
        return FileResponse(UI_DIR / "index.html")

    @app.get("/api/config")
    async def config() -> UIConfig:
        return UIConfig(
            server_url=app.state.server_url,
            max_tokens=app.state.max_tokens,
            temperature=app.state.temperature,
        )

    @app.get("/api/status")
    async def status(server_url: str | None = Query(default=None)) -> dict[str, Any]:
        raw_url = server_url if server_url is not None else app.state.server_url

        try:
            target = _normalize_server_url(raw_url)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

        try:
            models, model_name = _fetch_models(target)
            model_capabilities = _build_model_capabilities(models)

            runtime_metrics: dict[str, Any] | None = None
            runtime_error: str | None = None
            try:
                runtime_metrics = _fetch_runtime_metrics(target)
            except requests.RequestException as exc:
                runtime_error = str(exc)

            return {
                "ok": True,
                "server_url": target,
                "model": model_name,
                "models": models,
                "model_count": len(models),
                "model_capabilities": model_capabilities,
                "deep_thinking_models": [
                    model_id
                    for model_id, cap in model_capabilities.items()
                    if bool(cap.get("deep_thinking"))
                ],
                "runtime": runtime_metrics or {},
                "runtime_error": runtime_error,
            }
        except requests.RequestException as exc:
            return {
                "ok": False,
                "server_url": target,
                "error": f"Cannot reach {target}/v1/models: {exc}",
                "models": [],
                "model_count": 0,
                "model_capabilities": {},
                "deep_thinking_models": [],
                "runtime": {},
            }

    @app.post("/api/chat/title")
    async def chat_title(payload: TitleRequest) -> dict[str, Any]:
        fallback = str(payload.fallback or "").strip() or "New Conversation"
        title, source = await run_in_threadpool(
            _generate_conversation_title,
            payload.messages,
            fallback,
        )
        return {
            "ok": True,
            "title": _normalize_title_text(title, fallback),
            "source": source,
        }

    @app.post("/api/chat")
    async def chat(payload: ChatRequest) -> dict[str, Any]:
        user_message = payload.message.strip()
        user_content = payload.user_content

        raw_url = payload.server_url if payload.server_url is not None else app.state.server_url
        try:
            target = _normalize_server_url(raw_url)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

        max_tokens = _clamp_max_tokens(payload.max_tokens, app.state.max_tokens)
        temperature = _clamp_temperature(payload.temperature, app.state.temperature)
        system_prompt = (payload.system_prompt or "").strip()

        selected_model = (payload.model or "").strip() or "default"
        system_prompt, model_capability = _compose_system_prompt_for_model(
            system_prompt,
            selected_model,
        )
        max_tokens, temperature = _tune_generation_for_model(
            max_tokens=max_tokens,
            temperature=temperature,
            model_capability=model_capability,
        )

        try:
            messages = _build_messages(
                payload.history,
                system_prompt,
                user_message,
                user_content=user_content,
            )
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

        try:
            request_start = time.perf_counter()
            response = requests.post(
                f"{target}/v1/chat/completions",
                json={
                    "model": selected_model,
                    "messages": messages,
                    "max_tokens": max_tokens,
                    "temperature": temperature,
                },
                timeout=300,
            )
            response.raise_for_status()
            data = response.json()
            latency_ms = (time.perf_counter() - request_start) * 1000.0
        except requests.exceptions.ConnectionError as exc:
            raise HTTPException(
                status_code=502,
                detail=(
                    "Cannot connect to token-workshed backend server. "
                    "Make sure it is running and reachable."
                ),
            ) from exc
        except requests.exceptions.Timeout as exc:
            raise HTTPException(
                status_code=504,
                detail="Model response timed out.",
            ) from exc
        except requests.exceptions.HTTPError as exc:
            detail = f"Upstream error: {exc}"
            try:
                body = response.text
                if body:
                    detail = f"{detail} | {body[:500]}"
            except Exception:
                pass
            raise HTTPException(status_code=502, detail=detail) from exc
        except requests.RequestException as exc:
            raise HTTPException(status_code=502, detail=str(exc)) from exc

        choices = data.get("choices") if isinstance(data, dict) else None
        if not isinstance(choices, list) or not choices:
            raise HTTPException(status_code=502, detail="Invalid response: missing choices.")

        first = choices[0]
        if not isinstance(first, dict):
            raise HTTPException(status_code=502, detail="Invalid response: malformed choice.")

        message_payload = first.get("message")
        if not isinstance(message_payload, dict):
            raise HTTPException(status_code=502, detail="Invalid response: missing message.")

        assistant_text = _extract_content_text(message_payload.get("content", "")).strip()
        if not assistant_text:
            assistant_text = "(empty response)"

        prompt_tokens, completion_tokens, total_tokens = _extract_token_usage(data)
        tokens_per_second: float | None = None
        if completion_tokens is not None and latency_ms > 0:
            tokens_per_second = completion_tokens / (latency_ms / 1000.0)

        return {
            "ok": True,
            "reply": assistant_text,
            "model": data.get("model", "default"),
            "request_model": selected_model,
            "model_capability": model_capability,
            "effective_params": {
                "max_tokens": max_tokens,
                "temperature": temperature,
            },
            "metrics": {
                "latency_ms": round(latency_ms, 2),
                "prompt_tokens": prompt_tokens,
                "completion_tokens": completion_tokens,
                "total_tokens": total_tokens,
                "tokens_per_second": (
                    round(tokens_per_second, 2)
                    if isinstance(tokens_per_second, float)
                    else None
                ),
            },
        }

    @app.post("/api/chat/stream")
    async def chat_stream(payload: ChatRequest) -> StreamingResponse:
        """Stream chat response with separate thinking and answer deltas."""
        user_message = payload.message.strip()
        user_content = payload.user_content

        raw_url = payload.server_url if payload.server_url is not None else app.state.server_url
        try:
            target = _normalize_server_url(raw_url)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

        max_tokens = _clamp_max_tokens(payload.max_tokens, app.state.max_tokens)
        temperature = _clamp_temperature(payload.temperature, app.state.temperature)
        selected_model = (payload.model or "").strip() or "default"
        system_prompt = (payload.system_prompt or "").strip()
        system_prompt, model_capability = _compose_system_prompt_for_model(
            system_prompt,
            selected_model,
        )
        max_tokens, temperature = _tune_generation_for_model(
            max_tokens=max_tokens,
            temperature=temperature,
            model_capability=model_capability,
        )

        try:
            messages = _build_messages(
                payload.history,
                system_prompt,
                user_message,
                user_content=user_content,
            )
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

        def stream_events():
            request_start = time.perf_counter()
            prompt_tokens: int | None = None
            completion_tokens: int | None = None
            total_tokens: int | None = None

            deep_thinking = bool(model_capability.get("deep_thinking"))
            section_mode = "auto" if deep_thinking else "answer"
            pending_content = ""
            explicit_reasoning_seen = False
            thinking_header_stripped = False
            answer_header_stripped = False

            yield _stream_json_line(
                {
                    "type": "start",
                    "request_model": selected_model,
                    "model_capability": model_capability,
                    "effective_params": {
                        "max_tokens": max_tokens,
                        "temperature": temperature,
                    },
                }
            )

            try:
                with requests.post(
                    f"{target}/v1/chat/completions",
                    json={
                        "model": selected_model,
                        "messages": messages,
                        "max_tokens": max_tokens,
                        "temperature": temperature,
                        "stream": True,
                        "stream_options": {"include_usage": True},
                    },
                    timeout=(15, 600),
                    stream=True,
                ) as response:
                    if not response.ok:
                        detail = f"Upstream error: HTTP {response.status_code}"
                        try:
                            body = response.text
                            if body:
                                detail = f"{detail} | {body[:500]}"
                        except Exception:
                            pass
                        yield _stream_json_line({"type": "error", "message": detail})
                        return

                    for raw_line in response.iter_lines(decode_unicode=True):
                        if raw_line is None:
                            continue
                        line = raw_line.strip()
                        if not line or not line.startswith("data:"):
                            continue

                        data_line = line[5:].strip()
                        if not data_line:
                            continue
                        if data_line == "[DONE]":
                            break

                        try:
                            chunk = json.loads(data_line)
                        except json.JSONDecodeError:
                            continue

                        c_prompt, c_completion, c_total = _extract_token_usage(chunk)
                        if c_prompt is not None:
                            prompt_tokens = c_prompt
                        if c_completion is not None:
                            completion_tokens = c_completion
                        if c_total is not None:
                            total_tokens = c_total

                        choices = chunk.get("choices") if isinstance(chunk, dict) else None
                        if not isinstance(choices, list) or not choices:
                            continue
                        first = choices[0]
                        if not isinstance(first, dict):
                            continue
                        delta = first.get("delta")
                        if not isinstance(delta, dict):
                            continue

                        reasoning_delta = delta.get("reasoning")
                        if isinstance(reasoning_delta, str) and reasoning_delta:
                            explicit_reasoning_seen = True
                            section_mode = "answer"
                            emit = reasoning_delta
                            if not thinking_header_stripped:
                                cleaned = THINKING_HEADER_RE.sub("", emit, count=1)
                                if cleaned != emit:
                                    thinking_header_stripped = True
                                emit = cleaned
                            if emit:
                                yield _stream_json_line(
                                    {"type": "thinking_delta", "text": emit}
                                )

                        content_delta = delta.get("content")
                        if not isinstance(content_delta, str) or not content_delta:
                            continue

                        if deep_thinking and not explicit_reasoning_seen:
                            pending_content += content_delta

                            if section_mode == "auto":
                                probe = pending_content.lstrip()
                                has_think_open = bool(THINK_OPEN_TAG_RE.search(pending_content))
                                has_thinking_header = bool(THINKING_HEADER_RE.match(probe))
                                has_final_header = bool(
                                    FINAL_ANSWER_MARKER_RE.search(pending_content)
                                )

                                if has_think_open or has_thinking_header:
                                    section_mode = "thinking"
                                elif has_final_header or len(pending_content) >= 56:
                                    # Auto mode fallback: when no explicit reasoning markers
                                    # appear, treat the output as final answer stream.
                                    section_mode = "answer"

                            if section_mode == "thinking":
                                # Handle Qwen/Reasoner style think tags first.
                                pending_content = THINK_OPEN_TAG_RE.sub(
                                    "",
                                    pending_content,
                                )
                                close_tag = THINK_CLOSE_TAG_RE.search(pending_content)
                                if close_tag:
                                    thinking_part = pending_content[: close_tag.start()]
                                    answer_part = pending_content[close_tag.end() :]
                                    pending_content = ""

                                    if thinking_part:
                                        emit = thinking_part
                                        if not thinking_header_stripped:
                                            cleaned = THINKING_HEADER_RE.sub(
                                                "",
                                                emit,
                                                count=1,
                                            )
                                            if cleaned != emit:
                                                thinking_header_stripped = True
                                            emit = cleaned
                                        if emit:
                                            yield _stream_json_line(
                                                {"type": "thinking_delta", "text": emit}
                                            )

                                    section_mode = "answer"
                                    if answer_part:
                                        emit = answer_part
                                        if not answer_header_stripped:
                                            cleaned = LEADING_FINAL_ANSWER_RE.sub(
                                                "",
                                                emit,
                                                count=1,
                                            )
                                            if cleaned != emit:
                                                answer_header_stripped = True
                                            emit = cleaned
                                        if emit:
                                            yield _stream_json_line(
                                                {"type": "answer_delta", "text": emit}
                                            )
                                    continue

                                marker = FINAL_ANSWER_MARKER_RE.search(pending_content)
                                if marker:
                                    thinking_part = pending_content[: marker.start()]
                                    answer_part = pending_content[marker.end() :]
                                    pending_content = ""

                                    if thinking_part:
                                        emit = thinking_part
                                        if not thinking_header_stripped:
                                            cleaned = THINKING_HEADER_RE.sub(
                                                "", emit, count=1
                                            )
                                            if cleaned != emit:
                                                thinking_header_stripped = True
                                            emit = cleaned
                                        if emit:
                                            yield _stream_json_line(
                                                {"type": "thinking_delta", "text": emit}
                                            )

                                    section_mode = "answer"

                                    if answer_part:
                                        emit = answer_part
                                        if not answer_header_stripped:
                                            cleaned = LEADING_FINAL_ANSWER_RE.sub(
                                                "", emit, count=1
                                            )
                                            if cleaned != emit:
                                                answer_header_stripped = True
                                            emit = cleaned
                                        if emit:
                                            yield _stream_json_line(
                                                {"type": "answer_delta", "text": emit}
                                            )
                                else:
                                    # Keep a small tail so split markers across chunks are handled.
                                    tail_len = 72
                                    if len(pending_content) > tail_len:
                                        emit = pending_content[:-tail_len]
                                        pending_content = pending_content[-tail_len:]
                                        if not thinking_header_stripped:
                                            cleaned = THINKING_HEADER_RE.sub(
                                                "", emit, count=1
                                            )
                                            if cleaned != emit:
                                                thinking_header_stripped = True
                                            emit = cleaned
                                        if emit:
                                            yield _stream_json_line(
                                                {"type": "thinking_delta", "text": emit}
                                            )
                            else:
                                emit = pending_content
                                pending_content = ""
                                if not answer_header_stripped:
                                    cleaned = LEADING_FINAL_ANSWER_RE.sub("", emit, count=1)
                                    if cleaned != emit:
                                        answer_header_stripped = True
                                    emit = cleaned
                                if emit:
                                    yield _stream_json_line(
                                        {"type": "answer_delta", "text": emit}
                                    )
                        else:
                            emit = content_delta
                            if deep_thinking and not answer_header_stripped:
                                cleaned = LEADING_FINAL_ANSWER_RE.sub("", emit, count=1)
                                if cleaned != emit:
                                    answer_header_stripped = True
                                emit = cleaned
                            if emit:
                                yield _stream_json_line(
                                    {"type": "answer_delta", "text": emit}
                                )

                    if pending_content:
                        if section_mode == "thinking":
                            emit = pending_content
                            if not thinking_header_stripped:
                                cleaned = THINKING_HEADER_RE.sub("", emit, count=1)
                                if cleaned != emit:
                                    thinking_header_stripped = True
                                emit = cleaned
                            if emit:
                                yield _stream_json_line(
                                    {"type": "thinking_delta", "text": emit}
                                )
                        else:
                            emit = pending_content
                            if not answer_header_stripped:
                                cleaned = LEADING_FINAL_ANSWER_RE.sub("", emit, count=1)
                                if cleaned != emit:
                                    answer_header_stripped = True
                                emit = cleaned
                            if emit:
                                yield _stream_json_line(
                                    {"type": "answer_delta", "text": emit}
                                )

            except requests.exceptions.ConnectionError:
                yield _stream_json_line(
                    {
                        "type": "error",
                        "message": (
                            "Cannot connect to token-workshed backend server. "
                            "Make sure it is running and reachable."
                        ),
                    }
                )
                return
            except requests.exceptions.Timeout:
                yield _stream_json_line(
                    {
                        "type": "error",
                        "message": "Model response timed out.",
                    }
                )
                return
            except requests.RequestException as exc:
                yield _stream_json_line({"type": "error", "message": str(exc)})
                return
            except Exception as exc:
                yield _stream_json_line({"type": "error", "message": str(exc)})
                return

            latency_ms = (time.perf_counter() - request_start) * 1000.0
            tokens_per_second: float | None = None
            if completion_tokens is not None and latency_ms > 0:
                tokens_per_second = completion_tokens / (latency_ms / 1000.0)

            if total_tokens is None and (
                prompt_tokens is not None or completion_tokens is not None
            ):
                total_tokens = (prompt_tokens or 0) + (completion_tokens or 0)

            yield _stream_json_line(
                {
                    "type": "done",
                    "ok": True,
                    "model": selected_model,
                    "request_model": selected_model,
                    "model_capability": model_capability,
                    "effective_params": {
                        "max_tokens": max_tokens,
                        "temperature": temperature,
                    },
                    "metrics": {
                        "latency_ms": round(latency_ms, 2),
                        "prompt_tokens": prompt_tokens,
                        "completion_tokens": completion_tokens,
                        "total_tokens": total_tokens,
                        "tokens_per_second": (
                            round(tokens_per_second, 2)
                            if isinstance(tokens_per_second, float)
                            else None
                        ),
                    },
                }
            )

        return StreamingResponse(stream_events(), media_type="application/x-ndjson")

    return app


def main() -> None:
    """Run the CSS+SVG UI web app."""
    parser = argparse.ArgumentParser(
        description="token-workshed custom CSS+SVG UI (NumberGenerator 2.0.0 inspired)",
    )
    parser.add_argument(
        "--server-url",
        type=str,
        default="http://localhost:8000",
        help="vllm-mlx server URL (default: http://localhost:8000)",
    )
    parser.add_argument(
        "--host",
        type=str,
        default="127.0.0.1",
        help="Host for this UI server (default: 127.0.0.1)",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=7862,
        help="Port for this UI server (default: 7862)",
    )
    parser.add_argument(
        "--max-tokens",
        type=int,
        default=1024,
        help="Default max tokens in UI (default: 1024)",
    )
    parser.add_argument(
        "--temperature",
        type=float,
        default=0.7,
        help="Default temperature in UI (default: 0.7)",
    )
    parser.add_argument(
        "--open-browser",
        action="store_true",
        help="Open browser automatically after startup",
    )
    args = parser.parse_args()

    app = create_app(
        default_server_url=args.server_url,
        default_max_tokens=args.max_tokens,
        default_temperature=args.temperature,
    )

    if args.open_browser:
        url = f"http://{args.host}:{args.port}"
        threading.Timer(0.9, lambda: webbrowser.open(url)).start()

    uvicorn.run(app, host=args.host, port=args.port, log_level="info")


if __name__ == "__main__":
    main()
