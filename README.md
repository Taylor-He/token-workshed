[README.md](https://github.com/user-attachments/files/26143061/README.md)
# Token Workshed(for Apple Sillicon)

Token Workshed(mlx) is a custom desktop-focused fork of `vllm-mlx` for Apple Silicon Macs.
It combines:

- a local `vllm-mlx` runtime
- a custom CSS+SVG chat UI
- a desktop model manager (model switching, community search/deploy, runtime options)
- macOS `.app` / `.pkg` packaging workflow

Current desktop release line in this repo:

- `token-workshed`: `0.0.1`
- `vllm-mlx`: `0.2.6`

## Highlights

- Native Apple Silicon local inference (text + multimodal support from `vllm-mlx`)
- Desktop manager mode (`token-workshed-desktop`) with local model lifecycle control
- Community page with Hugging Face model search and one-click download/deploy
- One-time Hugging Face account binding popup (saved locally for authenticated search/download)
- Startup model integrity check and cleanup for incomplete local caches
- If no model is installed, UI still opens and shows:
  - `To start using Token Workshed, please install a model.`

## Requirements

- mac with Apple Silicon(Essential)
- Python `>= 3.10`
- Network access (for Hugging Face search/download)

## Install From Source

```bash
git clone https://github.com/<your-account>/token-workshed.git
cd token-workshed

python3 -m venv .venv
source .venv/bin/activate

python -m pip install -U pip setuptools wheel
python -m pip install -e .
```

## Run Modes

### 1) Runtime only (OpenAI-compatible server)

```bash
vllm-mlx serve your model --host 127.0.0.1 --port 8000
```

### 2) Web UI only (connect to an existing backend)

```bash
token-workshed-ui \
  --server-url http://127.0.0.1:8000 \
  --host 127.0.0.1 \
  --port 7862 \
  --open-browser
```

### 3) Desktop all-in-one manager (recommended)

```bash
token-workshed-desktop
```

Optional explicit model:

```bash
token-workshed-desktop your model
```

Useful options:

```bash
token-workshed-desktop --server-port 8000 --ui-port 7862 --browser
```

## First Launch Behavior

- On first open, a one-time Hugging Face binding modal is shown.
- Binding info is stored in local desktop state:
  - macOS: `~/Library/Application Support/token-workshed/desktop_state.json`
- If no local model exists, the app still opens in no-active-model mode.

## Build macOS App and Installer

### Build `.app` with PyInstaller

```bash
source .venv/bin/activate
pyinstaller --noconfirm token-workshed.spec
```

Output:

- `dist/token-workshed.app`

### Build `.pkg` installer

```bash
bash scripts/build_pkg_installer.sh 0.0.1 0.2.6 3.12.8
```

Output:

- `dist/token-workshed-0.0.1-installer.pkg`

### Install generated `.pkg`

```bash
sudo installer -pkg "dist/token-workshed-0.0.1-installer.pkg" -target /
open "/Applications/token-workshed.app"
```

## Project Layout

```text
vllm_mlx/
  desktop_ui.py              # desktop manager + manager API endpoints
  css_svg_ui.py              # web UI backend (FastAPI)
  ui_css_svg/                # frontend assets (HTML/CSS/JS)
scripts/
  token_workshed_app_entry.py
  build_pkg_installer.sh
token-workshed.spec          # PyInstaller spec
```

## Troubleshooting

### App closes on startup

Reset desktop state and retry:

```bash
rm -f "$HOME/Library/Application Support/token-workshed/desktop_state.json"
```

Then start again:

```bash
open "/Applications/token-workshed.app"
```

### `ModuleNotFoundError` (for local source run)

Activate venv and install dependencies:

```bash
source .venv/bin/activate
python -m pip install -U pip setuptools wheel
python -m pip install -e .
```

### Hugging Face 401 / gated model errors

- Bind a valid Hugging Face token in the app popup (or rebind later through app flow)
- Ensure you accepted model terms on the model’s Hugging Face page

## License

This project remains under Apache-2.0, following the upstream license.

## Acknowledgements

- Upstream: [`waybarrios/vllm-mlx`](https://github.com/waybarrios/vllm-mlx)
- Apple ML stack: MLX / mlx-lm / mlx-vlm
