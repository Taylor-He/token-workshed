const SETTINGS_KEY = "vllm_mlx_css_svg_ui_settings_v1";
const CHAT_MEMORY_KEY = "vllm_mlx_css_svg_chat_memory_v1";
const CHAT_SESSIONS_KEY = "vllm_mlx_css_svg_chat_sessions_v1";
const CHAT_ACTIVE_ID_KEY = "vllm_mlx_css_svg_chat_active_id_v1";
const MODEL_PREF_KEY = "vllm_mlx_css_svg_model_pref_v1";
const EMPTY_RESPONSE_SENTINEL = "__VLLM_MLX_EMPTY_RESPONSE__";
const MAX_MEDIA_ITEMS = 4;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 35 * 1024 * 1024;
const MAX_CONVERSATIONS = 60;
const THINKING_HEADER_RE =
  /^\s{0,3}(?:#{1,6}\s*)?(?:thinking process|reasoning|思考过程|推理过程|思考)\s*:?\s*/i;
const FINAL_ANSWER_HEADER_RE =
  /^\s{0,3}(?:#{1,6}\s*)?(?:final answer|answer|最终答案|最终回答|答案)\s*:?\s*/i;
const FINAL_ANSWER_MARKER_RE =
  /(?:^|\n)\s{0,3}(?:#{1,6}\s*)?(?:final answer|answer|最终答案|最终回答|答案)\s*:?\s*/i;
const LANG_KEY = "ui.language";
const LANG_CODES = ["en", "zh", "fr", "es", "de", "it", "ja", "ar"];
const LANG_SHORT = { en: "EN", zh: "中文", fr: "FR", es: "ES", de: "DE", it: "IT", ja: "日", ar: "AR" };
const LANG_FULL = {
  en: "English",
  zh: "中文",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
  it: "Italiano",
  ja: "日本語",
  ar: "العربية",
};
const I18N_BASE = (
  typeof window !== "undefined"
  && window.NG_I18N_TABLES
  && typeof window.NG_I18N_TABLES === "object"
) ? window.NG_I18N_TABLES : {};
const I18N_EXTRA = {
  zh: {
    "Model Settings": "模型设置",
    "App Settings": "应用设置",
    "Community": "社区",
    "Search": "搜索",
    "Deploy Job": "部署任务",
    "Search models from Hugging Face and deploy with one click.": "搜索 Hugging Face 模型并一键下载部署。",
    "No active job.": "当前无任务。",
    "Waiting for progress...": "等待进度信息...",
    "Community page requires desktop manager mode and network access.": "Community 页面需要桌面管理模式和网络连接。",
    "Community API is currently unavailable.": "Community API 当前不可用。",
    "Found": "找到",
    "models on Hugging Face.": "个 Hugging Face 模型。",
    "Community search failed:": "社区搜索失败：",
    "Desktop manager mode is required for deploy.": "部署功能需要桌面管理模式。",
    "Downloading": "正在下载",
    "and preparing deployment...": "并准备部署...",
    "Started download:": "已开始下载：",
    "Deploy request failed:": "部署请求失败：",
    "Continuous Batching": "连续批处理",
    "Paged Cache": "分页缓存",
    "KV Cache Quantization": "KV 缓存量化",
    "Chunked Prefill Tokens": "分块预填充 Tokens",
    "MTP Draft Tokens": "MTP 草稿 Tokens",
    "Apply & Restart": "应用并重启",
    "Changing runtime options restarts the active model process.": "修改运行参数会重启当前模型进程。",
    "Request Settings": "请求设置",
    "Server URL": "服务器地址",
    "Max Tokens": "最大 Tokens",
    "Temperature": "温度",
    "System Prompt": "系统提示词",
    "Request settings are stored in your browser localStorage for this UI.": "请求设置会保存在浏览器 localStorage 中。",
    "Language": "语言",
    "Model and request controls are now under Model Settings.": "模型与请求控制项已移动到 Model Settings。",
    "Use this page for UI-level actions.": "此页面用于应用级操作。",
    "Open Model Settings": "打开模型设置",
    "Clear UI Storage": "清空 UI 存储",
    "Clearing UI storage resets chat memory, model preferences, and request settings.": "清空 UI 存储会重置聊天记忆、模型偏好和请求设置。",
    "Download & Deploy": "下载并部署",
    "Downloads": "下载量",
    "Likes": "点赞",
    "Local": "本地",
    "Gated": "受限",
    "Deep": "深度",
    "Searching Hugging Face models...": "正在搜索 Hugging Face 模型...",
    "No models found. Try another keyword.": "未找到模型，请换个关键词。",
    "Type your message... (Enter to send, Shift+Enter newline)": "输入消息...（Enter 发送，Shift+Enter 换行）",
    "Optional system instruction sent before user history.": "可选系统指令，会在用户历史前发送。",
    "Search Hugging Face models (e.g. qwen, llama, granite)": "搜索 Hugging Face 模型（如 qwen、llama、granite）",
    "Models": "模型",
    "Settings": "设置",
    "Delete": "删除",
    "Pause": "暂停",
    "Resume": "继续",
    "Cancel": "取消",
    "Size": "大小",
    "History Conversations": "历史会话",
    "No conversation history yet.": "暂无历史会话。",
    "Delete conversation": "删除会话",
    "Rename conversation": "重命名会话",
    "Enter new conversation title:": "输入新的会话标题：",
    "Conversation renamed": "会话已重命名",
    "New conversation title cannot be empty.": "新会话标题不能为空。",
    "New Conversation": "新会话",
    "Started a new conversation": "已开始新会话",
    "Conversation deleted": "会话已删除",
  },
  fr: {
    "Model Settings": "Paramètres du modèle",
    "App Settings": "Paramètres de l’application",
    "Community": "Communauté",
    "Search": "Rechercher",
    "Deploy Job": "Tâche de déploiement",
    "Search models from Hugging Face and deploy with one click.": "Recherchez des modèles sur Hugging Face et déployez-les en un clic.",
    "No active job.": "Aucune tâche active.",
    "Waiting for progress...": "En attente de progression...",
    "Continuous Batching": "Batching continu",
    "Paged Cache": "Cache paginé",
    "KV Cache Quantization": "Quantification du cache KV",
    "Chunked Prefill Tokens": "Tokens de pré-remplissage par blocs",
    "MTP Draft Tokens": "Tokens brouillon MTP",
    "Apply & Restart": "Appliquer et redémarrer",
    "Request Settings": "Paramètres de requête",
    "Server URL": "URL du serveur",
    "Max Tokens": "Tokens max",
    "Temperature": "Température",
    "System Prompt": "Prompt système",
    "Models": "Modèles",
    "Settings": "Paramètres",
    "Delete": "Supprimer",
    "Pause": "Pause",
    "Resume": "Reprendre",
    "Cancel": "Annuler",
    "Size": "Taille",
    "History Conversations": "Conversations historiques",
    "No conversation history yet.": "Aucun historique de conversation.",
    "Delete conversation": "Supprimer la conversation",
    "Rename conversation": "Renommer la conversation",
    "Enter new conversation title:": "Entrez un nouveau titre de conversation :",
    "Conversation renamed": "Conversation renommée",
    "New conversation title cannot be empty.": "Le nouveau titre de conversation ne peut pas être vide.",
    "New Conversation": "Nouvelle conversation",
    "Started a new conversation": "Nouvelle conversation créée",
    "Conversation deleted": "Conversation supprimée",
  },
  es: {
    "Model Settings": "Configuración del modelo",
    "App Settings": "Configuración de la aplicación",
    "Community": "Comunidad",
    "Search": "Buscar",
    "Deploy Job": "Tarea de despliegue",
    "Search models from Hugging Face and deploy with one click.": "Busca modelos en Hugging Face y despliega con un clic.",
    "No active job.": "No hay tareas activas.",
    "Waiting for progress...": "Esperando progreso...",
    "Continuous Batching": "Batching continuo",
    "Paged Cache": "Caché paginada",
    "KV Cache Quantization": "Cuantización de caché KV",
    "Chunked Prefill Tokens": "Tokens de prefill por bloques",
    "MTP Draft Tokens": "Tokens borrador de MTP",
    "Apply & Restart": "Aplicar y reiniciar",
    "Request Settings": "Configuración de solicitud",
    "Server URL": "URL del servidor",
    "Max Tokens": "Tokens máximos",
    "Temperature": "Temperatura",
    "System Prompt": "Prompt del sistema",
    "Models": "Modelos",
    "Settings": "Configuración",
    "Delete": "Eliminar",
    "Pause": "Pausar",
    "Resume": "Reanudar",
    "Cancel": "Cancelar",
    "Size": "Tamaño",
    "History Conversations": "Conversaciones históricas",
    "No conversation history yet.": "Aún no hay historial de conversaciones.",
    "Delete conversation": "Eliminar conversación",
    "Rename conversation": "Renombrar conversación",
    "Enter new conversation title:": "Introduce un nuevo título de conversación:",
    "Conversation renamed": "Conversación renombrada",
    "New conversation title cannot be empty.": "El nuevo título de conversación no puede estar vacío.",
    "New Conversation": "Nueva conversación",
    "Started a new conversation": "Nueva conversación iniciada",
    "Conversation deleted": "Conversación eliminada",
  },
  de: {
    "Model Settings": "Modelleinstellungen",
    "App Settings": "App-Einstellungen",
    "Community": "Community",
    "Search": "Suchen",
    "Deploy Job": "Bereitstellungsauftrag",
    "Search models from Hugging Face and deploy with one click.": "Modelle auf Hugging Face suchen und mit einem Klick bereitstellen.",
    "No active job.": "Kein aktiver Auftrag.",
    "Waiting for progress...": "Warte auf Fortschritt...",
    "Continuous Batching": "Kontinuierliches Batching",
    "Paged Cache": "Paged Cache",
    "KV Cache Quantization": "KV-Cache-Quantisierung",
    "Chunked Prefill Tokens": "Chunked-Prefill-Tokens",
    "MTP Draft Tokens": "MTP-Entwurfs-Tokens",
    "Apply & Restart": "Anwenden und neu starten",
    "Request Settings": "Anfrageeinstellungen",
    "Server URL": "Server-URL",
    "Max Tokens": "Max. Tokens",
    "Temperature": "Temperatur",
    "System Prompt": "System-Prompt",
    "Models": "Modelle",
    "Settings": "Einstellungen",
    "Delete": "Löschen",
    "Pause": "Pausieren",
    "Resume": "Fortsetzen",
    "Cancel": "Abbrechen",
    "Size": "Größe",
    "History Conversations": "Konversationsverlauf",
    "No conversation history yet.": "Noch kein Konversationsverlauf.",
    "Delete conversation": "Konversation löschen",
    "Rename conversation": "Konversation umbenennen",
    "Enter new conversation title:": "Neuen Konversationstitel eingeben:",
    "Conversation renamed": "Konversation umbenannt",
    "New conversation title cannot be empty.": "Der neue Konversationstitel darf nicht leer sein.",
    "New Conversation": "Neue Konversation",
    "Started a new conversation": "Neue Konversation gestartet",
    "Conversation deleted": "Konversation gelöscht",
  },
  it: {
    "Model Settings": "Impostazioni modello",
    "App Settings": "Impostazioni app",
    "Community": "Community",
    "Search": "Cerca",
    "Deploy Job": "Job di deploy",
    "Search models from Hugging Face and deploy with one click.": "Cerca modelli su Hugging Face e distribuiscili con un clic.",
    "No active job.": "Nessun job attivo.",
    "Waiting for progress...": "In attesa dei progressi...",
    "Continuous Batching": "Batching continuo",
    "Paged Cache": "Cache paginata",
    "KV Cache Quantization": "Quantizzazione cache KV",
    "Chunked Prefill Tokens": "Token di prefill a blocchi",
    "MTP Draft Tokens": "Token bozza MTP",
    "Apply & Restart": "Applica e riavvia",
    "Request Settings": "Impostazioni richiesta",
    "Server URL": "URL server",
    "Max Tokens": "Token massimi",
    "Temperature": "Temperatura",
    "System Prompt": "Prompt di sistema",
    "Models": "Modelli",
    "Settings": "Impostazioni",
    "Delete": "Elimina",
    "Pause": "Pausa",
    "Resume": "Riprendi",
    "Cancel": "Annulla",
    "Size": "Dimensione",
    "History Conversations": "Cronologia conversazioni",
    "No conversation history yet.": "Nessuna cronologia conversazioni.",
    "Delete conversation": "Elimina conversazione",
    "Rename conversation": "Rinomina conversazione",
    "Enter new conversation title:": "Inserisci un nuovo titolo conversazione:",
    "Conversation renamed": "Conversazione rinominata",
    "New conversation title cannot be empty.": "Il nuovo titolo conversazione non può essere vuoto.",
    "New Conversation": "Nuova conversazione",
    "Started a new conversation": "Nuova conversazione avviata",
    "Conversation deleted": "Conversazione eliminata",
  },
  ja: {
    "Model Settings": "モデル設定",
    "App Settings": "アプリ設定",
    "Community": "コミュニティ",
    "Search": "検索",
    "Deploy Job": "デプロイジョブ",
    "Search models from Hugging Face and deploy with one click.": "Hugging Face のモデルを検索してワンクリックでデプロイします。",
    "No active job.": "実行中のジョブはありません。",
    "Waiting for progress...": "進捗待機中...",
    "Continuous Batching": "連続バッチ処理",
    "Paged Cache": "ページドキャッシュ",
    "KV Cache Quantization": "KV キャッシュ量子化",
    "Chunked Prefill Tokens": "チャンクプリフィル Tokens",
    "MTP Draft Tokens": "MTP ドラフト Tokens",
    "Apply & Restart": "適用して再起動",
    "Request Settings": "リクエスト設定",
    "Server URL": "サーバー URL",
    "Max Tokens": "最大 Tokens",
    "Temperature": "温度",
    "System Prompt": "システムプロンプト",
    "Models": "モデル",
    "Settings": "設定",
    "Delete": "削除",
    "Pause": "一時停止",
    "Resume": "再開",
    "Cancel": "キャンセル",
    "Size": "サイズ",
    "History Conversations": "履歴会話",
    "No conversation history yet.": "会話履歴はまだありません。",
    "Delete conversation": "会話を削除",
    "Rename conversation": "会話名を変更",
    "Enter new conversation title:": "新しい会話タイトルを入力してください:",
    "Conversation renamed": "会話名を変更しました",
    "New conversation title cannot be empty.": "新しい会話タイトルは空にできません。",
    "New Conversation": "新しい会話",
    "Started a new conversation": "新しい会話を開始しました",
    "Conversation deleted": "会話を削除しました",
  },
  ar: {
    "Model Settings": "إعدادات النموذج",
    "App Settings": "إعدادات التطبيق",
    "Community": "المجتمع",
    "Search": "بحث",
    "Deploy Job": "مهمة النشر",
    "Search models from Hugging Face and deploy with one click.": "ابحث عن نماذج Hugging Face وانشرها بنقرة واحدة.",
    "No active job.": "لا توجد مهمة نشطة.",
    "Waiting for progress...": "جاري انتظار التقدم...",
    "Continuous Batching": "التجميع المستمر",
    "Paged Cache": "ذاكرة مخبأة مُقسّمة",
    "KV Cache Quantization": "تكميم ذاكرة KV",
    "Chunked Prefill Tokens": "رموز التحميل المسبق المقطّعة",
    "MTP Draft Tokens": "رموز مسودة MTP",
    "Apply & Restart": "تطبيق وإعادة التشغيل",
    "Request Settings": "إعدادات الطلب",
    "Server URL": "رابط الخادم",
    "Max Tokens": "الحد الأقصى للرموز",
    "Temperature": "درجة الحرارة",
    "System Prompt": "توجيه النظام",
    "Models": "النماذج",
    "Settings": "الإعدادات",
    "Delete": "حذف",
    "Pause": "إيقاف مؤقت",
    "Resume": "استئناف",
    "Cancel": "إلغاء",
    "Size": "الحجم",
    "History Conversations": "سجل المحادثات",
    "No conversation history yet.": "لا يوجد سجل محادثات بعد.",
    "Delete conversation": "حذف المحادثة",
    "Rename conversation": "إعادة تسمية المحادثة",
    "Enter new conversation title:": "أدخل عنوان محادثة جديد:",
    "Conversation renamed": "تمت إعادة تسمية المحادثة",
    "New conversation title cannot be empty.": "لا يمكن أن يكون عنوان المحادثة الجديد فارغًا.",
    "New Conversation": "محادثة جديدة",
    "Started a new conversation": "تم بدء محادثة جديدة",
    "Conversation deleted": "تم حذف المحادثة",
  },
};
const I18N_TABLES = (() => {
  const merged = { ...I18N_BASE };
  for (const [lang, table] of Object.entries(I18N_EXTRA)) {
    merged[lang] = {
      ...(merged[lang] || {}),
      ...table,
    };
  }
  return merged;
})();

const COMMUNITY_DEV_BRAND = {
  openai: { short: "AI", colorA: "#d5f7ec", colorB: "#b7efe0" },
  google: { short: "G", colorA: "#fef3c7", colorB: "#dbeafe" },
  "deepseek-ai": { short: "DS", colorA: "#dbeafe", colorB: "#c7d2fe" },
  deepseek: { short: "DS", colorA: "#dbeafe", colorB: "#c7d2fe" },
  mistralai: { short: "M", colorA: "#ffe4d6", colorB: "#fed7aa" },
  "mistral-ai": { short: "M", colorA: "#ffe4d6", colorB: "#fed7aa" },
  "mlx-community": { short: "MLX", colorA: "#d1fae5", colorB: "#99f6e4" },
  "meta-llama": { short: "L", colorA: "#e0e7ff", colorB: "#bfdbfe" },
  qwen: { short: "QW", colorA: "#ede9fe", colorB: "#ddd6fe" },
  "ibm-granite": { short: "IBM", colorA: "#e2e8f0", colorB: "#cbd5e1" },
};

const SIZE_LABEL_RE = /^(\d+(?:\.\d+)?)([bkm])$/i;
const SIZE_WORD_RANK = {
  nano: 1,
  tiny: 2,
  mini: 3,
  micro: 4,
  small: 5,
  medium: 6,
  med: 6,
  large: 7,
  xl: 8,
  xxl: 9,
};

function normalizeDeveloperSlug(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeLangCode(code) {
  const c = String(code || "en").toLowerCase();
  for (const prefix of LANG_CODES.slice(1)) {
    if (c.startsWith(prefix)) {
      return prefix;
    }
  }
  return "en";
}

function createDashboardState() {
  return {
    startedAt: Date.now(),
    requestCount: 0,
    successCount: 0,
    errorCount: 0,
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
    totalTokens: 0,
    totalLatencyMs: 0,
    latencySamples: 0,
    totalTps: 0,
    tpsSamples: 0,
    lastLatencyMs: null,
    lastTps: null,
    lastPromptTokens: null,
    lastCompletionTokens: null,
    lastTotalTokens: null,
    memoryUsageGb: null,
    memoryPressurePct: null,
    lastModel: "-",
    serverOnline: null,
    lastError: "-",
  };
}

const state = {
  page: "chat",
  lang: normalizeLangCode(localStorage.getItem(LANG_KEY) || "en"),
  sending: false,
  clearingChat: false,
  messages: [],
  conversations: [],
  activeConversationId: "",
  models: [],
  modelCapabilities: {},
  selectedModel: "",
  selectedLocalModel: "",
  activeModel: "",
  managerEnabled: false,
  switchingModel: false,
  statusRefreshing: false,
  modelIntegrityReport: null,
  modelIntegrityNoticeKey: "",
  pendingMedia: [],
  modelRuntime: {
    available: false,
    loading: false,
    config: {
      continuous_batching: false,
      use_paged_cache: false,
      kv_cache_quantization: false,
      chunked_prefill_tokens: 0,
      enable_mtp: false,
      mtp_num_draft_tokens: 1,
    },
  },
  community: {
    initialized: false,
    searching: false,
    query: "",
    results: [],
    sizePrefByFamily: {},
    currentJob: null,
    pollingTimer: null,
    lastNotifiedJobKey: "",
  },
  dashboard: createDashboardState(),
  hfBinding: {
    loaded: false,
    seen: true,
    username: "",
    hasToken: false,
  },
  noModelBannerShown: false,
  titleGenSeqByConversation: {},
  titleGenTimerByConversation: {},
  titleGenAbortByConversation: {},
  defaults: {
    server_url: "http://localhost:8000",
    max_tokens: 1024,
    temperature: 0.7,
  },
  settings: {
    server_url: "http://localhost:8000",
    max_tokens: 1024,
    temperature: 0.7,
    system_prompt: "",
  },
};

const sideButtons = Array.from(document.querySelectorAll(".side-btn"));
const sidebar = document.getElementById("sidebar");
const pages = Array.from(document.querySelectorAll(".page"));
const hoverPill = document.getElementById("hoverPill");
const chatFeed = document.getElementById("chatFeed");
const messageInput = document.getElementById("messageInput");
const btnSend = document.getElementById("btnSend");
const btnClear = document.getElementById("btnClear");
const btnPing = document.getElementById("btnPing");
const btnNewConversation = document.getElementById("btnNewConversation");
const btnAttachMedia = document.getElementById("btnAttachMedia");
const btnClearMedia = document.getElementById("btnClearMedia");
const mediaInput = document.getElementById("mediaInput");
const mediaPreview = document.getElementById("mediaPreview");
const serverBadge = document.getElementById("serverBadge");
const modelSelect = document.getElementById("modelSelect");
const noModelBanner = document.getElementById("noModelBanner");
const toast = document.getElementById("toast");
const historyConversations = document.getElementById("historyConversations");
const hfBindModal = document.getElementById("hfBindModal");
const hfUsernameInput = document.getElementById("hfUsernameInput");
const hfTokenInput = document.getElementById("hfTokenInput");
const btnHfBindSave = document.getElementById("btnHfBindSave");
const btnHfBindSkip = document.getElementById("btnHfBindSkip");

const serverUrlInput = document.getElementById("serverUrlInput");
const maxTokensInput = document.getElementById("maxTokensInput");
const temperatureRange = document.getElementById("temperatureRange");
const temperatureInput = document.getElementById("temperatureInput");
const systemPromptInput = document.getElementById("systemPromptInput");
const btnSaveSettings = document.getElementById("btnSaveSettings");
const btnResetSettings = document.getElementById("btnResetSettings");
const btnGoModelSettings = document.getElementById("btnGoModelSettings");
const btnClearUiStorage = document.getElementById("btnClearUiStorage");
const langToggle = document.getElementById("langToggle");
const cfgContinuousBatching = document.getElementById("cfgContinuousBatching");
const cfgUsePagedCache = document.getElementById("cfgUsePagedCache");
const cfgKvCacheQuantization = document.getElementById("cfgKvCacheQuantization");
const cfgChunkedPrefillTokens = document.getElementById("cfgChunkedPrefillTokens");
const cfgEnableMtp = document.getElementById("cfgEnableMtp");
const cfgMtpDraftTokens = document.getElementById("cfgMtpDraftTokens");
const btnSaveModelRuntime = document.getElementById("btnSaveModelRuntime");
const btnResetModelRuntime = document.getElementById("btnResetModelRuntime");
const modelsHint = document.getElementById("modelsHint");
const modelsList = document.getElementById("modelsList");
const modelsListCount = document.getElementById("modelsListCount");
const btnDeleteModel = document.getElementById("btnDeleteModel");
const modelsDeleteHint = document.getElementById("modelsDeleteHint");
const communityQueryInput = document.getElementById("communityQueryInput");
const btnCommunitySearch = document.getElementById("btnCommunitySearch");
const communityResults = document.getElementById("communityResults");
const communityHint = document.getElementById("communityHint");
const communityJobText = document.getElementById("communityJobText");
const communityJobProgress = document.getElementById("communityJobProgress");
const communityJobProgressFill = document.getElementById("communityJobProgressFill");
const communityJobProgressMeta = document.getElementById("communityJobProgressMeta");
const btnCommunityPause = document.getElementById("btnCommunityPause");
const btnCommunityResume = document.getElementById("btnCommunityResume");
const btnCommunityCancel = document.getElementById("btnCommunityCancel");

const dashUptime = document.getElementById("dashUptime");
const dashRequests = document.getElementById("dashRequests");
const dashSuccessRate = document.getElementById("dashSuccessRate");
const dashAvgLatency = document.getElementById("dashAvgLatency");
const dashAvgTps = document.getElementById("dashAvgTps");
const dashMemoryUsage = document.getElementById("dashMemoryUsage");
const dashMemoryPressure = document.getElementById("dashMemoryPressure");
const dashLastUsage = document.getElementById("dashLastUsage");
const dashTotalTokens = document.getElementById("dashTotalTokens");
const dashModel = document.getElementById("dashModel");

let toastTimer = null;
let dashboardTimer = null;
let statusPollTimer = null;
let pillTargetBtn = null;
let hidePillTimer = null;
let pressPillTimer = null;
let noModelBannerTimer = null;
const langAnim = {
  from: state.lang,
  to: state.lang,
  t: 1.0,
  duration: 360,
  running: false,
  raf: 0,
};
let langMeasureCtx = null;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function showToast(text, ms = 2200) {
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add("show");
  if (toastTimer) {
    clearTimeout(toastTimer);
  }
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, ms);
}

function hideNoModelBanner(options = {}) {
  if (!noModelBanner) return;
  if (noModelBannerTimer) {
    clearTimeout(noModelBannerTimer);
    noModelBannerTimer = null;
  }
  noModelBanner.classList.remove("show");
  if (options && options.resetState === true) {
    state.noModelBannerShown = false;
  }
}

function showNoModelBannerOnce() {
  if (!noModelBanner || state.noModelBannerShown) return;
  state.noModelBannerShown = true;
  noModelBanner.classList.add("show");
  if (noModelBannerTimer) {
    clearTimeout(noModelBannerTimer);
  }
  noModelBannerTimer = setTimeout(() => {
    noModelBanner.classList.remove("show");
    noModelBannerTimer = null;
  }, 5000);
}

function syncNoModelBanner(noLocalModel) {
  if (noLocalModel) {
    showNoModelBannerOnce();
  } else {
    hideNoModelBanner({ resetState: true });
  }
}

function showHfBindModal() {
  if (!hfBindModal) return;
  if (hfUsernameInput) {
    hfUsernameInput.value = state.hfBinding.username || "";
  }
  if (hfTokenInput) {
    hfTokenInput.value = "";
  }
  hfBindModal.classList.remove("hidden");
}

function hideHfBindModal() {
  if (!hfBindModal) return;
  hfBindModal.classList.add("hidden");
}

async function fetchHfBindingStatus() {
  try {
    const response = await fetch("/api/manager/hf-binding");
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    if (!data || data.ok !== true) {
      return null;
    }
    state.hfBinding.loaded = true;
    state.hfBinding.seen = Boolean(data.seen);
    state.hfBinding.username = typeof data.username === "string" ? data.username.trim() : "";
    state.hfBinding.hasToken = Boolean(data.has_token);
    return data;
  } catch {
    return null;
  }
}

async function saveHfBinding(options = {}) {
  if (!btnHfBindSave || !btnHfBindSkip) return false;
  const seen = options && Object.prototype.hasOwnProperty.call(options, "seen")
    ? Boolean(options.seen)
    : true;
  const showSavedToast = !(options && options.silent === true);
  const closeOnSuccess = !(options && options.closeOnSuccess === false);

  const payload = {
    username: hfUsernameInput ? hfUsernameInput.value.trim() : "",
    token: hfTokenInput ? hfTokenInput.value.trim() : "",
    seen,
  };

  btnHfBindSave.disabled = true;
  btnHfBindSkip.disabled = true;
  try {
    const response = await fetch("/api/manager/hf-binding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data || data.ok !== true) {
      const detail = (data && (data.detail || data.error || data.message)) || "Failed to save account binding.";
      throw new Error(String(detail));
    }
    state.hfBinding.loaded = true;
    state.hfBinding.seen = Boolean(data.seen);
    state.hfBinding.username = typeof data.username === "string" ? data.username.trim() : "";
    state.hfBinding.hasToken = Boolean(data.has_token);
    if (closeOnSuccess) {
      hideHfBindModal();
    }
    if (showSavedToast) {
      showToast("Hugging Face account saved", 1600);
    }
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    showToast(message, 2600);
    return false;
  } finally {
    btnHfBindSave.disabled = false;
    btnHfBindSkip.disabled = false;
  }
}

async function maybeShowFirstRunHfBinding() {
  const data = await fetchHfBindingStatus();
  if (!data) return;
  if (!state.hfBinding.seen) {
    showHfBindModal();
  }
}

function t(s) {
  const table = I18N_TABLES[state.lang];
  if (table && Object.prototype.hasOwnProperty.call(table, s)) {
    return table[s];
  }
  return s;
}

function easeOutCubic(x) {
  const v = Math.max(0, Math.min(1, x));
  return 1 - ((1 - v) ** 3);
}

function stopLangAnimation() {
  if (langAnim.raf) {
    cancelAnimationFrame(langAnim.raf);
    langAnim.raf = 0;
  }
  langAnim.running = false;
}

function startLangAnimation() {
  stopLangAnimation();
  langAnim.running = true;
  const start = performance.now();

  const tick = (now) => {
    const p = Math.max(0, Math.min(1, (now - start) / langAnim.duration));
    langAnim.t = easeOutCubic(p);
    renderLangToggle();
    if (p < 1) {
      langAnim.raf = requestAnimationFrame(tick);
    } else {
      langAnim.t = 1.0;
      langAnim.running = false;
      langAnim.raf = 0;
      renderLangToggle();
    }
  };

  langAnim.raf = requestAnimationFrame(tick);
}

function measureLangTextWidth(text) {
  if (!langToggle) return String(text || "").length * 9;
  if (!langMeasureCtx) {
    const canvas = document.createElement("canvas");
    langMeasureCtx = canvas.getContext("2d");
  }
  if (!langMeasureCtx) {
    return String(text || "").length * 9;
  }
  const family = getComputedStyle(langToggle).fontFamily || "sans-serif";
  langMeasureCtx.font = `600 15px ${family}`;
  return Math.ceil(langMeasureCtx.measureText(String(text || "")).width);
}

function computeLangWidths(selectedCode, totalWidth) {
  const n = LANG_CODES.length;
  const base = totalWidth / n;
  const extra = base * 0.55;
  const widths = LANG_CODES.map((code) => base + (code === selectedCode ? extra : 0));
  const sum = widths.reduce((a, b) => a + b, 0);
  const scale = sum > 0 ? (totalWidth / sum) : 1.0;
  return widths.map((w) => w * scale);
}

function renderLangToggle() {
  if (!langToggle) return;
  const rect = langToggle.getBoundingClientRect();
  const totalWidth = (rect.width && rect.width >= 300) ? rect.width : 480;
  const totalHeight = (rect.height && rect.height >= 30) ? rect.height : 38;
  const fromWidths = computeLangWidths(langAnim.from, totalWidth);
  const toWidths = computeLangWidths(langAnim.to, totalWidth);
  const mixed = fromWidths.map((w, i) => ((1.0 - langAnim.t) * w) + (langAnim.t * toWidths[i]));
  const totalMixed = mixed.reduce((a, b) => a + b, 0);
  const fixed = totalMixed > 0 ? mixed.map((w) => w * (totalWidth / totalMixed)) : mixed;

  langToggle.classList.toggle("hovered", langToggle.matches(":hover"));
  langToggle.innerHTML = "";

  let x = 0;
  for (let i = 0; i < LANG_CODES.length; i += 1) {
    const code = LANG_CODES[i];
    let segW;
    if (i === LANG_CODES.length - 1) {
      segW = Math.max(1, totalWidth - x);
    } else {
      const remaining = LANG_CODES.length - i - 1;
      const maxW = Math.max(1, totalWidth - x - remaining);
      segW = Math.max(1, Math.min(maxW, Math.round(fixed[i])));
    }
    if (segW < 1) {
      segW = 1;
    }

    const seg = document.createElement("button");
    seg.type = "button";
    seg.className = "lang-seg";
    seg.style.left = `${x}px`;
    seg.style.width = `${segW}px`;
    seg.addEventListener("click", () => {
      setLanguage(code);
    });

    if (code === state.lang) {
      const shortLabel = LANG_SHORT[code] || code.toUpperCase();
      const fullLabel = LANG_FULL[code] || shortLabel;
      const fullW = measureLangTextWidth(fullLabel);
      const maxIndW = Math.max(8, segW - 10);
      const indW = Math.max(8, Math.min(maxIndW, fullW + 44));
      const maxIndH = Math.max(8, totalHeight - 10);
      const indH = Math.max(8, Math.min(maxIndH, 27));
      const indLeft = (segW - indW) / 2;
      const indTop = (totalHeight - indH) / 2;

      const ind = document.createElement("div");
      ind.className = "lang-ind";
      ind.style.left = `${indLeft}px`;
      ind.style.top = `${indTop}px`;
      ind.style.width = `${indW}px`;
      ind.style.height = `${indH}px`;

      const shortText = document.createElement("span");
      shortText.className = "lang-ind-label";
      shortText.textContent = shortLabel;
      shortText.style.opacity = String(1.0 - langAnim.t);

      const fullText = document.createElement("span");
      fullText.className = "lang-ind-label";
      fullText.textContent = fullLabel;
      fullText.style.opacity = String(langAnim.t);

      ind.appendChild(shortText);
      ind.appendChild(fullText);
      seg.appendChild(ind);
    } else {
      const shortNode = document.createElement("span");
      shortNode.className = "lang-seg-short";
      shortNode.textContent = LANG_SHORT[code] || code.toUpperCase();
      seg.appendChild(shortNode);
    }

    langToggle.appendChild(seg);
    x += segW;
  }
}

function applyLanguage() {
  document.documentElement.setAttribute("lang", state.lang);

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n") || "";
    node.textContent = t(key);
  });

  if (messageInput) {
    messageInput.placeholder = t("Type your message... (Enter to send, Shift+Enter newline)");
  }
  if (systemPromptInput) {
    systemPromptInput.placeholder = t("Optional system instruction sent before user history.");
  }
  if (communityQueryInput) {
    communityQueryInput.placeholder = t("Search Hugging Face models (e.g. qwen, llama, granite)");
  }

  renderLangToggle();
  renderCommunityJob(state.community.currentJob);
  renderCommunityResults();
  renderModelsList();
}

function setLanguage(code) {
  const c = normalizeLangCode(code);
  if (c === state.lang) {
    return;
  }
  langAnim.from = state.lang;
  langAnim.to = c;
  langAnim.t = 0.0;
  state.lang = c;
  localStorage.setItem(LANG_KEY, state.lang);
  applyLanguage();
  startLangAnimation();
}

function normalizeServerUrl(raw) {
  let value = (raw || "").trim();
  if (!value) {
    value = state.defaults.server_url;
  }
  if (!/^https?:\/\//i.test(value)) {
    value = `http://${value}`;
  }
  return value.replace(/\/+$/, "");
}

function normalizeSettings(input) {
  const maxTokens = Number.parseInt(String(input.max_tokens ?? state.defaults.max_tokens), 10);
  const temperature = Number.parseFloat(String(input.temperature ?? state.defaults.temperature));

  return {
    server_url: normalizeServerUrl(input.server_url ?? state.defaults.server_url),
    max_tokens: Number.isFinite(maxTokens) ? clamp(maxTokens, 1, 16384) : state.defaults.max_tokens,
    temperature: Number.isFinite(temperature) ? clamp(temperature, 0, 2) : state.defaults.temperature,
    system_prompt: (input.system_prompt || "").trim(),
  };
}

function loadStoredSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return normalizeSettings(parsed);
  } catch {
    return null;
  }
}

function saveStoredSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
}

function sanitizeStoredMessages(input) {
  if (!Array.isArray(input)) return [];

  const out = [];
  for (const item of input) {
    if (!item || typeof item !== "object") continue;

    const role = typeof item.role === "string" ? item.role.trim() : "";
    if (!["user", "assistant", "system"].includes(role)) continue;

    const content = typeof item.content === "string" ? item.content : "";
    if (!content.trim()) continue;

    const entry = { role, content };
    if (role === "assistant" && item.thinking_complete === true) {
      entry.thinking_complete = true;
    }

    out.push(entry);
  }
  return out;
}

function trimMessagesForStorage(messages) {
  const maxMessages = 80;
  const maxChars = 48000;
  const trimmed = messages.slice(-maxMessages);

  let totalChars = trimmed.reduce(
    (sum, msg) => sum + String(msg && msg.content ? msg.content : "").length,
    0,
  );
  while (trimmed.length > 0 && totalChars > maxChars) {
    const removed = trimmed.shift();
    if (removed) totalChars -= String(removed.content || "").length;
  }
  return trimmed;
}

function createConversationId() {
  return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function deriveConversationTitle(messages) {
  const source = Array.isArray(messages) ? messages : [];
  for (const item of source) {
    if (!item || item.role !== "user") continue;
    const content = String(item.content || "");
    const lines = content.split(/\n+/g);
    for (const rawLine of lines) {
      const line = String(rawLine || "").trim();
      if (!line) continue;
      if (/^\[(image|video)\]/i.test(line)) continue;
      const cleaned = line
        .replace(/https?:\/\/\S+/g, "")
        .replace(/[`*_#>\[\]\(\)]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (!cleaned) continue;
      return cleaned.length > 64 ? `${cleaned.slice(0, 64)}...` : cleaned;
    }
  }
  return t("New Conversation");
}

function normalizeConversationTitle(value, fallback = t("New Conversation")) {
  const normalized = String(value || "")
    .replace(/\r\n?/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[`*_#>\[\]\(\)]/g, " ")
    .replace(/^(?:title|conversation title|topic)\s*[:\-]\s*/i, "")
    .replace(/^["'“”‘’]+|["'“”‘’]+$/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.,;:!?-]+$/g, "")
    .trim();

  if (!normalized) return String(fallback || "").trim();
  return normalized.length > 64 ? `${normalized.slice(0, 64)}...` : normalized;
}

function buildTitleMessagesForApi(messages) {
  const source = sanitizeStoredMessages(messages).slice(-14);
  const out = [];
  for (const item of source) {
    if (!item || !["user", "assistant"].includes(item.role)) continue;
    const lines = String(item.content || "")
      .split(/\n+/g)
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line) => !/^\[(image|video)\]/i.test(line));
    if (!lines.length) continue;
    const compact = lines.join(" ").replace(/\s+/g, " ").trim();
    if (!compact) continue;
    out.push({
      role: item.role,
      content: compact.length > 360 ? `${compact.slice(0, 360)}...` : compact,
    });
  }
  return out.slice(-10);
}

function nextConversationTitleSeq(conversationId) {
  const key = String(conversationId || "").trim();
  if (!key) return 0;
  const next = Number(state.titleGenSeqByConversation[key] || 0) + 1;
  state.titleGenSeqByConversation[key] = next;
  return next;
}

function cancelPendingTitleGeneration() {
  for (const key of Object.keys(state.titleGenTimerByConversation)) {
    try {
      clearTimeout(state.titleGenTimerByConversation[key]);
    } catch {
      // ignore
    }
    delete state.titleGenTimerByConversation[key];
  }
  for (const key of Object.keys(state.titleGenAbortByConversation)) {
    const controller = state.titleGenAbortByConversation[key];
    try {
      if (controller && typeof controller.abort === "function") {
        controller.abort();
      }
    } catch {
      // ignore
    }
    delete state.titleGenAbortByConversation[key];
  }
}

async function refreshConversationTitleWithModel(conversationId, seq) {
  const id = String(conversationId || "").trim();
  if (!id) return;
  if (Number(state.titleGenSeqByConversation[id] || 0) !== Number(seq || 0)) return;

  const conv = state.conversations.find((item) => item.id === id);
  if (!conv || conv.auto_title === false) return;

  const payloadMessages = buildTitleMessagesForApi(conv.messages);
  if (!payloadMessages.some((item) => item.role === "user")) return;

  const fallback = normalizeConversationTitle(deriveConversationTitle(conv.messages), t("New Conversation"));
  let nextTitle = fallback;

  const oldCtrl = state.titleGenAbortByConversation[id];
  if (oldCtrl && typeof oldCtrl.abort === "function") {
    try {
      oldCtrl.abort();
    } catch {
      // ignore
    }
  }
  const controller = new AbortController();
  state.titleGenAbortByConversation[id] = controller;
  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, 7000);
  try {
    const response = await fetch("/api/chat/title", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        messages: payloadMessages,
        fallback,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      nextTitle = normalizeConversationTitle(data && data.title, fallback);
    }
  } catch {
    // Silent fallback to heuristic title.
  } finally {
    if (state.titleGenAbortByConversation[id] === controller) {
      delete state.titleGenAbortByConversation[id];
    }
    clearTimeout(timeoutId);
  }

  if (Number(state.titleGenSeqByConversation[id] || 0) !== Number(seq || 0)) return;

  const current = state.conversations.find((item) => item.id === id);
  if (!current || current.auto_title === false) return;

  if (String(current.title || "") !== nextTitle) {
    current.title = nextTitle;
    persistConversations();
    renderConversationHistory();
  }
}

function scheduleConversationTitleRefresh(conversationId, options = {}) {
  const id = String(conversationId || "").trim();
  if (!id) return;

  const conv = state.conversations.find((item) => item.id === id);
  if (!conv || conv.auto_title === false) return;
  const safeMessages = sanitizeStoredMessages(conv.messages);
  const hasUser = safeMessages.some((item) => item.role === "user");
  const hasAssistant = safeMessages.some((item) => item.role === "assistant");
  if (!hasUser || !hasAssistant) return;

  const oldTimer = state.titleGenTimerByConversation[id];
  if (oldTimer) {
    clearTimeout(oldTimer);
  }

  const seq = nextConversationTitleSeq(id);
  const delayMs = Number.isFinite(options.delayMs) ? Math.max(0, Number(options.delayMs)) : 700;
  state.titleGenTimerByConversation[id] = window.setTimeout(() => {
    delete state.titleGenTimerByConversation[id];
    refreshConversationTitleWithModel(id, seq);
  }, delayMs);
}

function buildConversation(messages = [], options = {}) {
  const now = Date.now();
  const safeMessages = sanitizeStoredMessages(messages);
  const autoTitle = options.autoTitle !== false;
  const inferredTitle = String(options.title || "").trim()
    || deriveConversationTitle(safeMessages);
  const title = normalizeConversationTitle(inferredTitle, t("New Conversation"));
  return {
    id: String(options.id || "").trim() || createConversationId(),
    title,
    auto_title: autoTitle,
    created_at: Number.isFinite(options.createdAt) ? Number(options.createdAt) : now,
    updated_at: Number.isFinite(options.updatedAt) ? Number(options.updatedAt) : now,
    messages: safeMessages,
  };
}

function normalizeStoredConversation(raw) {
  if (!raw || typeof raw !== "object") return null;
  const id = String(raw.id || "").trim();
  if (!id) return null;

  return buildConversation(raw.messages, {
    id,
    title: String(raw.title || "").trim(),
    autoTitle: raw.auto_title !== false,
    createdAt: Number(raw.created_at),
    updatedAt: Number(raw.updated_at),
  });
}

function sortConversationsByUpdated(list) {
  return list.slice().sort((a, b) => {
    const aTs = Number.isFinite(a.updated_at) ? a.updated_at : 0;
    const bTs = Number.isFinite(b.updated_at) ? b.updated_at : 0;
    if (aTs !== bTs) return bTs - aTs;
    return String(a.id || "").localeCompare(String(b.id || ""));
  });
}

function ensureActiveConversation() {
  const current = state.conversations.find((item) => item.id === state.activeConversationId);
  if (current) return current;

  const fallback = state.conversations[0];
  if (fallback) {
    state.activeConversationId = fallback.id;
    return fallback;
  }

  const created = buildConversation([]);
  state.conversations = [created];
  state.activeConversationId = created.id;
  return created;
}

function syncActiveConversationFromState(options = {}) {
  const touchUpdated = options.touchUpdated !== false;
  const conv = ensureActiveConversation();
  conv.messages = trimMessagesForStorage(sanitizeStoredMessages(state.messages));
  if (conv.auto_title !== false) {
    conv.title = normalizeConversationTitle(
      deriveConversationTitle(conv.messages),
      t("New Conversation"),
    );
  }
  if (touchUpdated) {
    conv.updated_at = Date.now();
  }
}

function limitConversations(list, activeId) {
  if (list.length <= MAX_CONVERSATIONS) return list;
  const sorted = sortConversationsByUpdated(list);
  const kept = [];
  const keepSet = new Set();

  if (activeId) {
    const active = sorted.find((item) => item.id === activeId);
    if (active) {
      kept.push(active);
      keepSet.add(active.id);
    }
  }

  for (const conv of sorted) {
    if (keepSet.has(conv.id)) continue;
    kept.push(conv);
    keepSet.add(conv.id);
    if (kept.length >= MAX_CONVERSATIONS) break;
  }
  return kept;
}

function persistConversations() {
  try {
    const activeId = state.activeConversationId;
    const seen = new Set();
    let normalized = state.conversations
      .map((item) => normalizeStoredConversation(item))
      .filter((item) => {
        if (!item) return false;
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });

    normalized = normalized.filter((item) => item.messages.length > 0 || item.id === activeId);
    if (!normalized.length) {
      const created = buildConversation([]);
      normalized = [created];
      state.activeConversationId = created.id;
      state.messages = [];
    }

    normalized = limitConversations(normalized, state.activeConversationId);
    normalized = sortConversationsByUpdated(normalized);
    state.conversations = normalized;

    if (!state.conversations.some((item) => item.id === state.activeConversationId)) {
      state.activeConversationId = state.conversations[0].id;
    }

    const active = state.conversations.find((item) => item.id === state.activeConversationId);
    if (active) {
      state.messages = sanitizeStoredMessages(active.messages);
    }

    let payload = state.conversations.map((item) => ({
      id: item.id,
      title: item.title,
      auto_title: item.auto_title !== false,
      created_at: item.created_at,
      updated_at: item.updated_at,
      messages: item.messages,
    }));

    let saveOk = false;
    while (!saveOk) {
      try {
        localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(payload));
        localStorage.setItem(CHAT_ACTIVE_ID_KEY, state.activeConversationId);
        localStorage.setItem(CHAT_MEMORY_KEY, JSON.stringify(active ? active.messages : []));
        saveOk = true;
      } catch {
        if (payload.length <= 1) {
          const only = payload[0] || {
            id: state.activeConversationId || createConversationId(),
            title: t("New Conversation"),
            auto_title: true,
            created_at: Date.now(),
            updated_at: Date.now(),
            messages: [],
          };
          const compactMessages = trimMessagesForStorage(sanitizeStoredMessages(only.messages || [])).slice(-24);
          const compactPayload = [{ ...only, messages: compactMessages }];
          try {
            localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(compactPayload));
            localStorage.setItem(CHAT_ACTIVE_ID_KEY, compactPayload[0].id);
            localStorage.setItem(CHAT_MEMORY_KEY, JSON.stringify(compactMessages));
          } catch {
            // Ignore storage errors when browser storage is unavailable.
          }
          state.conversations = compactPayload
            .map((item) => normalizeStoredConversation(item))
            .filter(Boolean);
          state.activeConversationId = compactPayload[0].id;
          state.messages = compactMessages;
          break;
        }

        const activeNow = state.activeConversationId;
        let dropIndex = -1;
        for (let i = payload.length - 1; i >= 0; i -= 1) {
          if (payload[i].id !== activeNow) {
            dropIndex = i;
            break;
          }
        }
        if (dropIndex >= 0) {
          payload.splice(dropIndex, 1);
        } else {
          payload = payload.slice(0, 1).map((item) => ({
            ...item,
            messages: trimMessagesForStorage(sanitizeStoredMessages(item.messages || [])).slice(-24),
          }));
        }
      }
    }
  } catch {
    // Ignore storage errors.
  }
}

function loadStoredConversations() {
  const now = Date.now();
  let conversations = [];

  try {
    const raw = localStorage.getItem(CHAT_SESSIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        conversations = parsed
          .map((item) => normalizeStoredConversation(item))
          .filter(Boolean);
      }
    }
  } catch {
    conversations = [];
  }

  if (!conversations.length) {
    const legacy = loadStoredMessages();
    if (legacy.length) {
      conversations = [buildConversation(legacy, { updatedAt: now, createdAt: now })];
    }
  }

  if (!conversations.length) {
    conversations = [buildConversation([], { updatedAt: now, createdAt: now })];
  }

  const activeStored = (() => {
    try {
      return String(localStorage.getItem(CHAT_ACTIVE_ID_KEY) || "").trim();
    } catch {
      return "";
    }
  })();

  const sorted = sortConversationsByUpdated(conversations);
  const active = sorted.find((item) => item.id === activeStored);
  const activeId = active ? active.id : sorted[0].id;
  return { conversations: sorted, activeId };
}

function loadStoredMessages() {
  try {
    const raw = localStorage.getItem(CHAT_MEMORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return sanitizeStoredMessages(parsed);
  } catch {
    return [];
  }
}

function saveStoredMessages() {
  try {
    localStorage.setItem(
      CHAT_MEMORY_KEY,
      JSON.stringify(trimMessagesForStorage(sanitizeStoredMessages(state.messages))),
    );
    localStorage.removeItem(CHAT_SESSIONS_KEY);
    localStorage.removeItem(CHAT_ACTIVE_ID_KEY);
  } catch {
    // Ignore storage errors.
  }
}

function persistCurrentConversationSnapshot() {
  saveStoredMessages();
}

function clearStoredMessages() {
  try {
    localStorage.removeItem(CHAT_MEMORY_KEY);
    localStorage.removeItem(CHAT_SESSIONS_KEY);
    localStorage.removeItem(CHAT_ACTIVE_ID_KEY);
  } catch {
    // Ignore storage errors.
  }
}

function loadModelPrefMap() {
  try {
    const raw = localStorage.getItem(MODEL_PREF_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function saveModelPrefMap(prefMap) {
  try {
    localStorage.setItem(MODEL_PREF_KEY, JSON.stringify(prefMap));
  } catch {
    // Ignore storage errors.
  }
}

function getModelPrefForServer(serverUrl) {
  const key = normalizeServerUrl(serverUrl);
  const prefMap = loadModelPrefMap();
  const value = prefMap[key];
  return typeof value === "string" ? value.trim() : "";
}

function setModelPrefForServer(serverUrl, modelId) {
  const key = normalizeServerUrl(serverUrl);
  const value = (modelId || "").trim();
  if (!value) return;

  const prefMap = loadModelPrefMap();
  prefMap[key] = value;
  saveModelPrefMap(prefMap);
}

function normalizeModelList(modelsInput) {
  if (!Array.isArray(modelsInput)) return [];

  const seen = new Set();
  const models = [];
  for (const item of modelsInput) {
    if (typeof item !== "string") continue;
    const value = item.trim();
    if (!value || seen.has(value)) continue;
    seen.add(value);
    models.push(value);
  }

  return models;
}

function inferModelCapability(modelId) {
  const normalized = String(modelId || "").trim().toLowerCase();
  if (!normalized) {
    return { deepThinking: false, reasoningParser: null };
  }

  let reasoningParser = null;
  if (normalized.includes("qwen3") || normalized.includes("qwq")) {
    reasoningParser = "qwen3";
  } else if (normalized.includes("deepseek") && normalized.includes("r1")) {
    reasoningParser = "deepseek_r1";
  } else if (normalized.includes("gpt-oss")) {
    reasoningParser = "gpt_oss";
  } else if (normalized.includes("harmony")) {
    reasoningParser = "harmony";
  }

  const deepThinking =
    Boolean(reasoningParser) ||
    normalized.includes("nemotron") ||
    normalized.includes("reasoner") ||
    normalized.includes("thinking");

  return {
    deepThinking,
    reasoningParser,
  };
}

function normalizeModelCapabilities(models, capabilitiesInput) {
  const rawMap = capabilitiesInput && typeof capabilitiesInput === "object" ? capabilitiesInput : {};
  const out = {};

  models.forEach((modelId) => {
    const inferred = inferModelCapability(modelId);
    const raw = rawMap[modelId];
    if (!raw || typeof raw !== "object") {
      out[modelId] = inferred;
      return;
    }

    const parser =
      typeof raw.reasoning_parser === "string" && raw.reasoning_parser.trim()
        ? raw.reasoning_parser.trim()
        : inferred.reasoningParser;
    const deepThinking = typeof raw.deep_thinking === "boolean"
      ? raw.deep_thinking
      : inferred.deepThinking || Boolean(parser);

    out[modelId] = {
      deepThinking: deepThinking || Boolean(parser),
      reasoningParser: parser || null,
    };
  });

  return out;
}

function getModelCapability(modelId) {
  const key = String(modelId || "").trim();
  if (!key) {
    return { deepThinking: false, reasoningParser: null };
  }
  if (state.modelCapabilities[key]) {
    return state.modelCapabilities[key];
  }
  return inferModelCapability(key);
}

function normalizeRuntimeConfig(input) {
  const raw = input && typeof input === "object" ? input : {};
  const parsedChunked = Number.parseInt(String(raw.chunked_prefill_tokens ?? 0), 10);
  const parsedDraft = Number.parseInt(String(raw.mtp_num_draft_tokens ?? 1), 10);

  const config = {
    continuous_batching: Boolean(raw.continuous_batching),
    use_paged_cache: Boolean(raw.use_paged_cache),
    kv_cache_quantization: Boolean(raw.kv_cache_quantization),
    chunked_prefill_tokens: Number.isFinite(parsedChunked) ? clamp(parsedChunked, 0, 8192) : 0,
    enable_mtp: Boolean(raw.enable_mtp),
    mtp_num_draft_tokens: Number.isFinite(parsedDraft) ? clamp(parsedDraft, 1, 8) : 1,
  };

  if (
    config.use_paged_cache ||
    config.kv_cache_quantization ||
    config.chunked_prefill_tokens > 0 ||
    config.enable_mtp
  ) {
    config.continuous_batching = true;
  }

  return config;
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "--";
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / (1024 ** 2)).toFixed(1)} MB`;
  if (bytes < 1024 ** 4) return `${(bytes / (1024 ** 3)).toFixed(2)} GB`;
  return `${(bytes / (1024 ** 4)).toFixed(2)} TB`;
}

function formatEta(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "--";
  const sec = Math.max(0, Math.round(seconds));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function mediaKindFromMime(mime) {
  const normalized = String(mime || "").toLowerCase();
  if (normalized.startsWith("image/")) return "image";
  if (normalized.startsWith("video/")) return "video";
  return null;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
    reader.readAsDataURL(file);
  });
}

function renderPendingMedia() {
  if (!mediaPreview) return;

  mediaPreview.innerHTML = "";
  if (!state.pendingMedia.length) {
    const empty = document.createElement("div");
    empty.className = "media-empty";
    empty.textContent = "No media attached.";
    mediaPreview.appendChild(empty);
    if (btnClearMedia) btnClearMedia.disabled = true;
    return;
  }

  state.pendingMedia.forEach((item) => {
    const chip = document.createElement("div");
    chip.className = "media-chip";

    if (item.kind === "image") {
      const img = document.createElement("img");
      img.className = "media-thumb";
      img.src = item.data_url;
      img.alt = item.name || "image";
      chip.appendChild(img);
    } else {
      const video = document.createElement("video");
      video.className = "media-thumb";
      video.src = item.data_url;
      video.muted = true;
      video.playsInline = true;
      video.preload = "metadata";
      chip.appendChild(video);
    }

    const meta = document.createElement("div");
    meta.className = "media-meta";

    const name = document.createElement("div");
    name.className = "media-name";
    name.textContent = item.name;
    meta.appendChild(name);

    const detail = document.createElement("div");
    detail.className = "media-detail";
    detail.textContent = `${item.kind.toUpperCase()} · ${formatBytes(item.size)}`;
    meta.appendChild(detail);

    chip.appendChild(meta);

    const removeBtn = document.createElement("button");
    removeBtn.className = "media-remove";
    removeBtn.type = "button";
    removeBtn.textContent = "x";
    removeBtn.title = "Remove attachment";
    removeBtn.addEventListener("click", () => {
      state.pendingMedia = state.pendingMedia.filter((entry) => entry.id !== item.id);
      renderPendingMedia();
    });
    chip.appendChild(removeBtn);

    mediaPreview.appendChild(chip);
  });

  if (btnClearMedia) btnClearMedia.disabled = false;
}

function buildUserApiContent(text, mediaItems) {
  const cleanedText = String(text || "").trim();
  const parts = [];

  if (cleanedText) {
    parts.push({ type: "text", text: cleanedText });
  }

  mediaItems.forEach((item) => {
    if (item.kind === "image") {
      parts.push({
        type: "image_url",
        image_url: { url: item.data_url },
      });
    } else if (item.kind === "video") {
      parts.push({
        type: "video_url",
        video_url: { url: item.data_url },
      });
    }
  });

  if (!parts.length) return "";
  if (!parts.some((part) => part.type === "text")) {
    parts.unshift({ type: "text", text: "Please analyze the attached media." });
  }

  return parts.length === 1 && parts[0].type === "text" ? parts[0].text : parts;
}

function buildUserDisplayText(text, mediaItems) {
  const lines = [];
  const cleanedText = String(text || "").trim();
  if (cleanedText) {
    lines.push(cleanedText);
  }
  if (mediaItems.length > 0) {
    if (lines.length > 0) {
      lines.push("");
    }
    mediaItems.forEach((item) => {
      const tag = item.kind === "image" ? "Image" : "Video";
      lines.push(`[${tag}] ${item.name}`);
    });
  }
  return lines.join("\n");
}

async function refreshManagerRuntimeConfig(options = {}) {
  const silent = Boolean(options.silent);
  if (state.modelRuntime.loading) return;
  state.modelRuntime.loading = true;

  try {
    const response = await fetch("/api/manager/runtime-config");
    if (!response.ok) {
      state.modelRuntime.available = false;
      if (!silent && modelsHint) {
        modelsHint.textContent = "Runtime options are available only in desktop manager mode.";
      }
      return;
    }

    const data = await response.json();
    if (!data || data.ok !== true) {
      state.modelRuntime.available = false;
      if (!silent && modelsHint) {
        modelsHint.textContent = "Cannot read runtime options from manager.";
      }
      return;
    }

    state.modelRuntime.available = true;
    state.modelRuntime.config = normalizeRuntimeConfig(data.runtime_config);
    applyRuntimeConfigToInputs();

    if (!silent && modelsHint) {
      modelsHint.textContent = "Changing runtime options restarts the active model process.";
    }
  } catch {
    state.modelRuntime.available = false;
    if (!silent && modelsHint) {
      modelsHint.textContent = "Runtime options are currently unavailable.";
    }
  } finally {
    setRuntimeControlsDisabled(
      state.sending || state.clearingChat || state.switchingModel || !state.modelRuntime.available,
    );
    state.modelRuntime.loading = false;
  }
}

function applyRuntimeConfigToInputs() {
  const cfg = state.modelRuntime.config;
  if (cfgContinuousBatching) cfgContinuousBatching.checked = Boolean(cfg.continuous_batching);
  if (cfgUsePagedCache) cfgUsePagedCache.checked = Boolean(cfg.use_paged_cache);
  if (cfgKvCacheQuantization) cfgKvCacheQuantization.checked = Boolean(cfg.kv_cache_quantization);
  if (cfgChunkedPrefillTokens) cfgChunkedPrefillTokens.value = String(cfg.chunked_prefill_tokens || 0);
  if (cfgEnableMtp) cfgEnableMtp.checked = Boolean(cfg.enable_mtp);
  if (cfgMtpDraftTokens) cfgMtpDraftTokens.value = String(cfg.mtp_num_draft_tokens || 1);
}

function readRuntimeConfigFromInputs() {
  const parsedChunked = Number.parseInt(String(cfgChunkedPrefillTokens?.value || "0"), 10);
  const parsedDraft = Number.parseInt(String(cfgMtpDraftTokens?.value || "1"), 10);

  return normalizeRuntimeConfig({
    continuous_batching: Boolean(cfgContinuousBatching?.checked),
    use_paged_cache: Boolean(cfgUsePagedCache?.checked),
    kv_cache_quantization: Boolean(cfgKvCacheQuantization?.checked),
    chunked_prefill_tokens: Number.isFinite(parsedChunked) ? parsedChunked : 0,
    enable_mtp: Boolean(cfgEnableMtp?.checked),
    mtp_num_draft_tokens: Number.isFinite(parsedDraft) ? parsedDraft : 1,
  });
}

function enforceRuntimeDependencies() {
  if (!cfgContinuousBatching) return;
  const requiresBatching =
    Boolean(cfgUsePagedCache?.checked) ||
    Boolean(cfgKvCacheQuantization?.checked) ||
    (Number.parseInt(String(cfgChunkedPrefillTokens?.value || "0"), 10) > 0) ||
    Boolean(cfgEnableMtp?.checked);

  if (requiresBatching) {
    cfgContinuousBatching.checked = true;
  }
}

function setRuntimeControlsDisabled(disabled) {
  const controls = [
    cfgContinuousBatching,
    cfgUsePagedCache,
    cfgKvCacheQuantization,
    cfgChunkedPrefillTokens,
    cfgEnableMtp,
    cfgMtpDraftTokens,
    btnSaveModelRuntime,
    btnResetModelRuntime,
  ];
  controls.forEach((el) => {
    if (!el) return;
    el.disabled = Boolean(disabled);
  });
}

function selectLocalModel(modelId) {
  const id = String(modelId || "").trim();
  if (!id || !state.models.includes(id)) {
    state.selectedLocalModel = "";
  } else {
    state.selectedLocalModel = id;
  }
  updateDeleteModelButtonState();
  renderModelsList();
}

function updateDeleteModelButtonState() {
  if (!btnDeleteModel) return;
  const hasSelection = Boolean(state.selectedLocalModel);
  const disabled =
    !hasSelection ||
    state.selectedLocalModel === state.activeModel ||
    state.sending ||
    state.clearingChat ||
    state.switchingModel ||
    !state.managerEnabled;
  btnDeleteModel.disabled = disabled;
}

function renderModelsList() {
  if (!modelsList) return;
  modelsList.innerHTML = "";

  const list = Array.isArray(state.models)
    ? state.models
      .map((item) => String(item || "").trim())
      .filter((item, idx, arr) => item && arr.indexOf(item) === idx)
    : [];
  if (modelsListCount) {
    modelsListCount.textContent = String(list.length);
  }

  if (!list.length) {
    state.selectedLocalModel = "";
    const empty = document.createElement("div");
    empty.className = "models-list-empty";
    empty.textContent = "No models found.";
    modelsList.appendChild(empty);
    updateDeleteModelButtonState();
    return;
  }

  if (!state.selectedLocalModel || !list.includes(state.selectedLocalModel)) {
    state.selectedLocalModel = list.includes(state.selectedModel)
      ? state.selectedModel
      : list[0];
  }

  list.forEach((modelId) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "models-list-item";
    row.classList.toggle("selected", modelId === state.selectedLocalModel);
    row.classList.toggle("active", modelId === state.activeModel);

    const main = document.createElement("div");
    main.className = "models-list-main";
    main.textContent = modelId;
    row.appendChild(main);

    const sub = document.createElement("div");
    sub.className = "models-list-sub";
    if (modelId === state.activeModel) {
      sub.textContent = "Active model";
    } else {
      sub.textContent = "Local cache";
    }
    row.appendChild(sub);

    row.addEventListener("click", () => {
      selectLocalModel(modelId);
    });
    modelsList.appendChild(row);
  });

  if (modelsDeleteHint && state.selectedLocalModel === state.activeModel) {
    modelsDeleteHint.textContent = "Cannot delete the currently active model.";
  } else if (modelsDeleteHint && !state.modelIntegrityReport) {
    modelsDeleteHint.textContent =
      "Select a local model on the left, then click Delete to remove its local cache.";
  }

  updateDeleteModelButtonState();
}

function applyIntegrityReport(report, options = {}) {
  const silent = Boolean(options.silent);
  if (!report || typeof report !== "object") {
    state.modelIntegrityReport = null;
    if (modelsDeleteHint && state.selectedLocalModel !== state.activeModel) {
      modelsDeleteHint.textContent =
        "Select a local model on the left, then click Delete to remove its local cache.";
    }
    return;
  }
  state.modelIntegrityReport = report;

  const removed = Array.isArray(report.removed) ? report.removed : [];
  const errors = Array.isArray(report.errors) ? report.errors : [];
  const checked = Boolean(report.checked);

  if (modelsDeleteHint) {
    if (removed.length > 0) {
      modelsDeleteHint.textContent =
        `Startup integrity check removed ${removed.length} incomplete model cache entr${removed.length > 1 ? "ies" : "y"}.`;
    } else if (errors.length > 0) {
      modelsDeleteHint.textContent =
        `Integrity check finished with ${errors.length} warning${errors.length > 1 ? "s" : ""}.`;
    } else if (checked) {
      modelsDeleteHint.textContent =
        "Integrity check complete. Select a model on the left and click Delete to remove local cache.";
    } else {
      modelsDeleteHint.textContent =
        "Select a local model on the left, then click Delete to remove its local cache.";
    }
  }

  if (!silent && removed.length > 0) {
    const key = `${removed.length}:${String(report.checked_at || "")}`;
    if (state.modelIntegrityNoticeKey !== key) {
      state.modelIntegrityNoticeKey = key;
      showToast(
        `Integrity check removed ${removed.length} incomplete model cache entr${removed.length > 1 ? "ies" : "y"}.`,
        2800,
      );
    }
  }
}

function parseSizeRank(label) {
  const raw = String(label || "").trim();
  const match = SIZE_LABEL_RE.exec(raw);
  if (match) {
    const value = Number.parseFloat(match[1]);
    const unit = String(match[2] || "").toUpperCase();
    if (!Number.isFinite(value)) return Number.POSITIVE_INFINITY;
    if (unit === "B") return value * 1_000_000_000;
    if (unit === "M") return value * 1_000_000;
    if (unit === "K") return value * 1_000;
  }

  const wordRank = SIZE_WORD_RANK[raw.toLowerCase()];
  if (Number.isFinite(wordRank)) {
    return wordRank;
  }
  return Number.POSITIVE_INFINITY;
}

function getVariantParamLabel(variant) {
  const label = String(variant && variant.param_size_label ? variant.param_size_label : "").trim();
  return label || "-";
}

function getVariantSizeLabel(variant) {
  const primary = String(variant && variant.variant_size_label ? variant.variant_size_label : "").trim();
  if (primary) return primary;
  const fallback = String(variant && variant.size_label ? variant.size_label : "").trim();
  return fallback || "-";
}

function getVariantQuantLabel(variant) {
  const label = String(variant && variant.quantization_label ? variant.quantization_label : "").trim();
  return label || "-";
}

function buildVariantOptionLabel(variant) {
  const param = getVariantParamLabel(variant);
  const size = getVariantSizeLabel(variant);
  const quant = getVariantQuantLabel(variant);

  const parts = [];
  if (param !== "-") {
    parts.push(param);
  } else if (size !== "-") {
    parts.push(size);
  }
  if (quant !== "-") {
    parts.push(quant);
  }

  const title = String(variant && variant.id ? variant.id : "").trim();
  const tail = title ? (title.split("/").pop() || title) : "";
  if (!parts.length) {
    return tail || "default";
  }
  if (tail && parts.every((p) => !tail.toLowerCase().includes(String(p).toLowerCase()))) {
    parts.push(tail);
  }
  return parts.join(" · ");
}

function inferFamilyDisplayName(modelId) {
  const full = String(modelId || "").trim();
  if (!full) return "unknown";
  const idx = full.indexOf("/");
  if (idx < 0) return full;
  const owner = full.slice(0, idx);
  const repo = full.slice(idx + 1);
  const family = repo
    .replace(/(^|[-_])(\d+(?:\.\d+)?)([bkm])(?=$|[-_])/ig, "$1")
    .replace(/(^|[-_])(nano|tiny|mini|micro|small|medium|med|large|xl|xxl)(?=$|[-_])/ig, "$1")
    .replace(/(^|[-_])((?:q\d(?:_[a-z0-9]+)*)|(?:int\d+)|(?:fp\d+)|(?:bf16)|(?:f16)|(?:\d+bit)|(?:gptq)|(?:awq)|(?:gguf))(?=$|[-_])/ig, "$1")
    .replace(/[-_]{2,}/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "");
  return `${owner}/${family || repo}`;
}

function buildCommunityGroups(items) {
  const source = Array.isArray(items) ? items : [];
  const groups = new Map();

  source.forEach((item) => {
    const modelId = String(item && item.id ? item.id : "").trim();
    if (!modelId) return;
    const familyKey = String(item.family_key || modelId).trim() || modelId;
    const existing = groups.get(familyKey);
    if (existing) {
      existing.variants.push(item);
      if (Number(item.downloads || 0) > Number(existing.downloads || 0)) {
        existing.downloads = Number(item.downloads || 0);
      }
      if (Number(item.likes || 0) > Number(existing.likes || 0)) {
        existing.likes = Number(item.likes || 0);
      }
      existing.local = existing.local || Boolean(item.local);
      existing.gated = existing.gated || Boolean(item.gated);
      existing.deep_thinking = existing.deep_thinking || Boolean(item.deep_thinking);
      return;
    }

    groups.set(familyKey, {
      family_key: familyKey,
      family_name: String(item.family_name || "").trim(),
      display_name: inferFamilyDisplayName(modelId),
      developer: String(item.developer || "").trim() || "Unknown",
      developer_slug: normalizeDeveloperSlug(item.developer_slug),
      pipeline_tag: item.pipeline_tag || null,
      downloads: Number(item.downloads || 0),
      likes: Number(item.likes || 0),
      local: Boolean(item.local),
      gated: Boolean(item.gated),
      deep_thinking: Boolean(item.deep_thinking),
      variants: [item],
    });
  });

  const grouped = Array.from(groups.values());
  grouped.forEach((group) => {
    group.variants.sort((a, b) => {
      const rankA = parseSizeRank(getVariantSizeLabel(a));
      const rankB = parseSizeRank(getVariantSizeLabel(b));
      if (rankA !== rankB) return rankA - rankB;
      return String(a.id || "").localeCompare(String(b.id || ""));
    });
  });

  grouped.sort((a, b) => {
    const byDownloads = Number(b.downloads || 0) - Number(a.downloads || 0);
    if (byDownloads !== 0) return byDownloads;
    return String(a.display_name || "").localeCompare(String(b.display_name || ""));
  });

  return grouped;
}

function pickCommunityVariant(group) {
  const variants = Array.isArray(group.variants) ? group.variants : [];
  if (!variants.length) return null;

  const pref = state.community.sizePrefByFamily[group.family_key];
  if (pref) {
    const byPref = variants.find((v) => String(v.id || "") === pref);
    if (byPref) return byPref;
  }

  const bySelected = variants.find((v) => String(v.id || "") === state.selectedModel);
  if (bySelected) return bySelected;

  const local = variants.find((v) => v.local === true);
  if (local) return local;

  return variants[0];
}

function createCommunityBrandNode(group) {
  const brand = COMMUNITY_DEV_BRAND[group.developer_slug] || null;
  const wrap = document.createElement("div");
  wrap.className = "community-brand";

  const logo = document.createElement("div");
  logo.className = "community-logo";
  logo.textContent = brand ? brand.short : String(group.developer || "?").slice(0, 2).toUpperCase();
  if (brand) {
    logo.style.background = `linear-gradient(170deg, ${brand.colorA} 0%, ${brand.colorB} 100%)`;
  }
  wrap.appendChild(logo);

  const dev = document.createElement("div");
  dev.className = "community-dev";
  dev.textContent = String(group.developer || "Unknown");
  wrap.appendChild(dev);

  return wrap;
}

function stopCommunityJobPolling() {
  if (state.community.pollingTimer) {
    clearInterval(state.community.pollingTimer);
    state.community.pollingTimer = null;
  }
}

function setCommunityJobActionButtons(job) {
  const controls = [btnCommunityPause, btnCommunityResume, btnCommunityCancel];
  controls.forEach((el) => {
    if (!el) return;
    el.disabled = true;
  });

  if (!state.managerEnabled || state.sending || state.clearingChat || state.switchingModel) {
    return;
  }
  if (!job || job.done === true) {
    return;
  }

  const status = String(job.status || "").trim().toLowerCase();
  if (btnCommunityPause) {
    btnCommunityPause.disabled = !(status === "queued" || status === "downloading");
  }
  if (btnCommunityResume) {
    btnCommunityResume.disabled = status !== "paused";
  }
  if (btnCommunityCancel) {
    btnCommunityCancel.disabled = !(status === "queued" || status === "downloading" || status === "paused");
  }
}

function renderCommunityJob(job) {
  if (!communityJobText) return;
  setCommunityJobActionButtons(job);
  if (!job) {
    communityJobText.textContent = t("No active job.");
    if (communityJobProgress) {
      communityJobProgress.classList.add("hidden");
    }
    if (communityJobProgressFill) {
      communityJobProgressFill.style.width = "0%";
    }
    if (communityJobProgressMeta) {
      communityJobProgressMeta.textContent = "-";
    }
    return;
  }

  const model = String(job.model || "").trim() || "unknown model";
  const status = String(job.status || "unknown");
  const message = String(job.message || "").trim() || `${status}: ${model}`;
  communityJobText.textContent = `[${status}] ${message}`;

  if (!communityJobProgress || !communityJobProgressFill || !communityJobProgressMeta) {
    return;
  }

  const downloadedRaw = Number(job.progress_downloaded_bytes);
  const totalRaw = Number(job.progress_total_bytes);
  const pctRaw = Number(job.progress_percent);
  const etaRaw = Number(job.progress_eta_seconds);
  const downloadedBytes = Number.isFinite(downloadedRaw) ? Math.max(0, downloadedRaw) : 0;
  const totalBytes = Number.isFinite(totalRaw) ? Math.max(0, totalRaw) : 0;
  const hasTotal = totalBytes > 0;

  let percent = 0;
  if (hasTotal) {
    percent = clamp((downloadedBytes * 100) / totalBytes, 0, 100);
  } else if (Number.isFinite(pctRaw)) {
    percent = clamp(pctRaw, 0, 100);
  } else if (status === "completed") {
    percent = 100;
  }
  if (Number.isFinite(pctRaw)) {
    percent = clamp(pctRaw, 0, 100);
  }

  const showProgress =
    status === "queued" ||
    status === "downloading" ||
    status === "paused" ||
    status === "deploying" ||
    status === "completed" ||
    (downloadedBytes > 0 || totalBytes > 0);

  if (!showProgress) {
    communityJobProgress.classList.add("hidden");
    communityJobProgressFill.style.width = "0%";
    communityJobProgressMeta.textContent = "-";
    return;
  }

  communityJobProgress.classList.remove("hidden");
  communityJobProgressFill.style.width = `${percent.toFixed(1)}%`;

  if (hasTotal) {
    let meta = `${formatBytes(downloadedBytes)} / ${formatBytes(totalBytes)} (${percent.toFixed(1)}%)`;
    if (status === "downloading") {
      meta += ` • ETA ${formatEta(etaRaw)}`;
    }
    communityJobProgressMeta.textContent = meta;
  } else if (downloadedBytes > 0) {
    communityJobProgressMeta.textContent = `${formatBytes(downloadedBytes)} • ${t("Waiting for progress...")}`;
  } else {
    communityJobProgressMeta.textContent = t("Waiting for progress...");
  }
}

function renderCommunityResults() {
  if (!communityResults) return;

  communityResults.innerHTML = "";
  if (state.community.searching) {
    const loading = document.createElement("div");
    loading.className = "community-empty";
    loading.textContent = t("Searching Hugging Face models...");
    communityResults.appendChild(loading);
    return;
  }

  if (!state.community.results.length) {
    const empty = document.createElement("div");
    empty.className = "community-empty";
    empty.textContent = t("No models found. Try another keyword.");
    communityResults.appendChild(empty);
    return;
  }

  const groups = buildCommunityGroups(state.community.results);
  groups.forEach((group) => {
    const selectedVariant = pickCommunityVariant(group);
    if (!selectedVariant) return;

    const card = document.createElement("div");
    card.className = "community-card";

    const head = document.createElement("div");
    head.className = "community-card-head";
    head.appendChild(createCommunityBrandNode(group));

    const idNode = document.createElement("div");
    idNode.className = "community-model-id";
    idNode.textContent = String(group.display_name || selectedVariant.id || "");
    head.appendChild(idNode);
    card.appendChild(head);

    const metrics = document.createElement("div");
    metrics.className = "community-metrics";

    const downloadChip = document.createElement("div");
    downloadChip.className = "community-chip";
    downloadChip.textContent = `${t("Downloads")} ${Number(group.downloads || 0).toLocaleString()}`;
    metrics.appendChild(downloadChip);

    const likesChip = document.createElement("div");
    likesChip.className = "community-chip";
    likesChip.textContent = `${t("Likes")} ${Number(group.likes || 0).toLocaleString()}`;
    metrics.appendChild(likesChip);

    if (group.pipeline_tag) {
      const pipelineChip = document.createElement("div");
      pipelineChip.className = "community-chip";
      pipelineChip.textContent = String(group.pipeline_tag);
      metrics.appendChild(pipelineChip);
    }

    if (group.local === true) {
      const localChip = document.createElement("div");
      localChip.className = "community-chip";
      localChip.textContent = t("Local");
      metrics.appendChild(localChip);
    }

    if (group.deep_thinking === true) {
      const deepChip = document.createElement("div");
      deepChip.className = "community-chip";
      deepChip.textContent = t("Deep");
      metrics.appendChild(deepChip);
    }

    if (group.gated === true) {
      const gatedChip = document.createElement("div");
      gatedChip.className = "community-chip";
      gatedChip.textContent = t("Gated");
      metrics.appendChild(gatedChip);
    }

    const paramLabel = getVariantParamLabel(selectedVariant);
    if (paramLabel !== "-") {
      const paramChip = document.createElement("div");
      paramChip.className = "community-chip";
      paramChip.textContent = `Params ${paramLabel}`;
      metrics.appendChild(paramChip);
    } else {
      const variantLabel = getVariantSizeLabel(selectedVariant);
      if (variantLabel !== "-") {
        const variantChip = document.createElement("div");
        variantChip.className = "community-chip";
        variantChip.textContent = `Variant ${variantLabel}`;
        metrics.appendChild(variantChip);
      }
    }

    const quantLabel = getVariantQuantLabel(selectedVariant);
    if (quantLabel !== "-") {
      const quantChip = document.createElement("div");
      quantChip.className = "community-chip";
      quantChip.textContent = `Quant ${quantLabel}`;
      metrics.appendChild(quantChip);
    }

    card.appendChild(metrics);

    const actions = document.createElement("div");
    actions.className = "community-card-actions";

    const sizeWrap = document.createElement("div");
    sizeWrap.className = "community-size-wrap";
    const sizeLabel = document.createElement("label");
    sizeLabel.className = "community-size-label";
    sizeLabel.textContent = t("Size");
    const sizeSelect = document.createElement("select");
    sizeSelect.className = "community-size-select";

    group.variants.forEach((variant) => {
      const option = document.createElement("option");
      option.value = String(variant.id || "");
      option.textContent = buildVariantOptionLabel(variant);
      sizeSelect.appendChild(option);
    });

    sizeSelect.value = String(selectedVariant.id || "");
    sizeSelect.addEventListener("change", () => {
      const picked = String(sizeSelect.value || "").trim();
      if (!picked) return;
      state.community.sizePrefByFamily[group.family_key] = picked;
      renderCommunityResults();
    });
    sizeWrap.appendChild(sizeLabel);
    sizeWrap.appendChild(sizeSelect);
    actions.appendChild(sizeWrap);

    const deployBtn = document.createElement("button");
    deployBtn.type = "button";
    deployBtn.className = "community-deploy-btn";
    deployBtn.textContent = t("Download & Deploy");
    deployBtn.disabled =
      state.sending ||
      state.switchingModel ||
      state.clearingChat ||
      !state.managerEnabled ||
      (state.community.currentJob && state.community.currentJob.done === false);
    deployBtn.addEventListener("click", () => {
      const chosen = String(sizeSelect.value || "").trim();
      startCommunityDownloadDeploy(chosen, {
        gated: selectedVariant.gated === true,
      });
    });
    actions.appendChild(deployBtn);
    card.appendChild(actions);

    communityResults.appendChild(card);
  });
}

async function refreshCommunityJobStatus(options = {}) {
  const silent = Boolean(options.silent);
  try {
    const response = await fetch("/api/manager/community/job");
    if (!response.ok) {
      if (!silent && communityHint) {
        communityHint.textContent =
          t("Community page requires desktop manager mode and network access.");
      }
      state.community.currentJob = null;
      renderCommunityJob(null);
      return null;
    }

    const data = await response.json();
    const job = data && data.job ? data.job : null;
    state.community.currentJob = job;
    renderCommunityJob(job);

    if (communityHint && job) {
      const model = String(job.model || "").trim();
      const status = String(job.status || "").trim().toLowerCase();
      if (status === "downloading") {
        communityHint.textContent = `${t("Downloading")} ${model} ${t("and preparing deployment...")}`;
      } else if (status === "paused") {
        communityHint.textContent = `Paused: ${model}`;
      } else if (status === "deploying") {
        communityHint.textContent = `Deploying: ${model}`;
      } else if (status === "completed") {
        communityHint.textContent = `Deployed: ${model}`;
      } else if (status === "failed" || status === "canceled") {
        communityHint.textContent = String(job.message || `${status}: ${model}`);
      }
    }

    if (job && job.done === false) {
      if (!state.community.pollingTimer) {
        state.community.pollingTimer = setInterval(() => {
          refreshCommunityJobStatus({ silent: true });
        }, 1800);
      }
    } else {
      stopCommunityJobPolling();
      if (job) {
        const notifyKey = `${String(job.id || "")}:${String(job.status || "")}`;
        if (state.community.lastNotifiedJobKey !== notifyKey) {
          state.community.lastNotifiedJobKey = notifyKey;
          if (job.status === "completed") {
            await refreshStatus({ silent: true });
            showToast(`Deployed: ${job.model}`, 2000);
          } else if (job.status === "failed") {
            showToast(`Deploy failed: ${job.message || "unknown error"}`, 2600);
          }
        }
      }
    }

    renderCommunityResults();
    return job;
  } catch {
    state.community.currentJob = null;
    renderCommunityJob(null);
    if (!silent && communityHint) {
      communityHint.textContent = t("Community API is currently unavailable.");
    }
    return null;
  }
}

async function searchCommunityModels(options = {}) {
  if (state.community.searching) return;

  const silent = Boolean(options.silent);
  const query = String((communityQueryInput && communityQueryInput.value) || "").trim();
  state.community.query = query;
  state.community.searching = true;
  if (btnCommunitySearch) btnCommunitySearch.disabled = true;
  if (communityQueryInput) communityQueryInput.disabled = true;
  renderCommunityResults();

  try {
    const params = new URLSearchParams();
    params.set("q", query);
    params.set("limit", "60");
    const response = await fetch(`/api/manager/community/search?${params.toString()}`);
    const data = await response.json();

    if (!response.ok || !data || data.ok !== true || !Array.isArray(data.results)) {
      const detail =
        (data && (data.detail || data.error || data.message)) || "Community search failed";
      throw new Error(String(detail));
    }

    state.community.results = data.results;
    if (communityHint) {
      const count = Number(data.count || state.community.results.length);
      communityHint.textContent = `${t("Found")} ${count} ${t("models on Hugging Face.")}`;
    }
  } catch (error) {
    state.community.results = [];
    const message = error instanceof Error ? error.message : String(error);
    if (!silent && communityHint) {
      communityHint.textContent = `${t("Community search failed:")} ${message}`;
    }
    if (!silent) {
      showToast(`${t("Community search failed:")} ${message}`, 2600);
    }
  } finally {
    state.community.searching = false;
    if (btnCommunitySearch) {
      btnCommunitySearch.disabled =
        state.sending || state.clearingChat || state.switchingModel;
    }
    if (communityQueryInput) {
      communityQueryInput.disabled =
        state.sending || state.clearingChat || state.switchingModel;
    }
    renderCommunityResults();
  }
}

async function controlCommunityJob(action) {
  const normalized = String(action || "").trim().toLowerCase();
  if (!normalized) return;
  if (!state.managerEnabled) {
    showToast("Desktop manager mode is required for this action.", 2000);
    return;
  }

  try {
    const response = await fetch("/api/manager/community/job/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: normalized }),
    });
    const data = await response.json();
    if (!response.ok || !data || data.ok !== true) {
      const detail =
        (data && (data.detail || data.error || data.message)) ||
        "Failed to control community job";
      throw new Error(String(detail));
    }

    state.community.currentJob = data.job || null;
    renderCommunityJob(state.community.currentJob);
    renderCommunityResults();
    showToast(String(data.message || "Community job updated"), 1800);
    await refreshCommunityJobStatus({ silent: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    showToast(`Job action failed: ${message}`, 2600);
  }
}

async function startCommunityDownloadDeploy(modelId, options = {}) {
  const model = String(modelId || "").trim();
  if (!model) return;

  // Open Hugging Face page only for gated models so user can accept terms.
  if (options && options.gated === true) {
    const hfUrl = `https://huggingface.co/${model}`;
    try {
      window.open(hfUrl, "_blank", "noopener,noreferrer");
    } catch {
      // Ignore popup/open failures; deployment flow should still continue.
    }
  }

  if (!state.managerEnabled) {
    showToast(t("Desktop manager mode is required for deploy."), 2200);
    return;
  }

  try {
    const response = await fetch("/api/manager/community/download-deploy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model }),
    });
    const data = await response.json();
    if (!response.ok || !data || data.ok !== true) {
      const detail =
        (data && (data.detail || data.error || data.message)) ||
        "Cannot start download/deploy job";
      throw new Error(String(detail));
    }

    state.community.currentJob = data.job || null;
    renderCommunityJob(state.community.currentJob);
    if (communityHint) {
      communityHint.textContent = `${t("Downloading")} ${model} ${t("and preparing deployment...")}`;
    }
    showToast(`${t("Started download:")} ${model}`, 1700);
    await refreshCommunityJobStatus({ silent: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    showToast(`${t("Deploy request failed:")} ${message}`, 2600);
  }
}

async function ensureCommunityInitialized() {
  if (state.community.initialized) return;
  state.community.initialized = true;
  renderCommunityResults();
  await refreshCommunityJobStatus({ silent: true });
  await searchCommunityModels({ silent: true });
}

function formatModelOptionLabel(modelId) {
  const capability = getModelCapability(modelId);
  if (capability.deepThinking) {
    return `${modelId} [Deep]`;
  }
  return modelId;
}

function setModelSelectOptions(models, selectedModel, disabled = false) {
  if (!modelSelect) return;

  const safeModels = normalizeModelList(models);
  if (!safeModels.length) {
    setModelSelectLoading("(No local model)");
    return;
  }
  modelSelect.innerHTML = "";

  safeModels.forEach((modelId) => {
    const option = document.createElement("option");
    option.value = modelId;
    option.textContent = formatModelOptionLabel(modelId);
    modelSelect.appendChild(option);
  });

  const fallback = safeModels[0] || "default";
  const nextModel = safeModels.includes(selectedModel) ? selectedModel : fallback;
  modelSelect.value = nextModel;
  modelSelect.disabled = disabled;
}

function setModelSelectLoading(text = "(Detecting...)") {
  if (!modelSelect) return;
  modelSelect.innerHTML = "";
  const option = document.createElement("option");
  option.value = "";
  option.textContent = text;
  modelSelect.appendChild(option);
  modelSelect.disabled = true;
}

function syncSelectedModel(serverUrl, modelsFromServer, defaultModelFromServer, modelCapabilitiesInput = null) {
  const models = normalizeModelList(modelsFromServer);
  if (!models.length) {
    state.models = [];
    state.modelCapabilities = {};
    state.selectedModel = "";
    state.selectedLocalModel = "";
    setModelSelectLoading("(No local model)");
    renderModelsList();
    return;
  }

  const preferred = getModelPrefForServer(serverUrl);
  const serverDefault =
    typeof defaultModelFromServer === "string" && defaultModelFromServer.trim()
      ? defaultModelFromServer.trim()
      : "";

  let selected = "";
  if (preferred && models.includes(preferred)) {
    selected = preferred;
  } else if (state.selectedModel && models.includes(state.selectedModel)) {
    selected = state.selectedModel;
  } else if (serverDefault && models.includes(serverDefault)) {
    selected = serverDefault;
  } else {
    selected = models[0] || "default";
  }

  state.models = models;
  state.modelCapabilities = normalizeModelCapabilities(models, modelCapabilitiesInput);
  state.selectedModel = selected;
  if (!state.selectedLocalModel || !models.includes(state.selectedLocalModel)) {
    state.selectedLocalModel = selected;
  }
  setModelPrefForServer(serverUrl, selected);
  setModelSelectOptions(models, selected, false);
  renderModelsList();
}

async function fetchManagerModels() {
  try {
    const response = await fetch("/api/manager/models");
    if (!response.ok) {
      state.managerEnabled = false;
      return null;
    }

    const data = await response.json();
    if (!data || data.ok !== true || !Array.isArray(data.available_models)) {
      return null;
    }

    state.managerEnabled = true;
    return data;
  } catch {
    state.managerEnabled = false;
    return null;
  }
}

async function switchManagedModel(nextModel) {
  if (!state.managerEnabled || !nextModel) return true;

  const previousModel = state.selectedModel;
  cancelPendingTitleGeneration();
  state.switchingModel = true;
  setSending(state.sending);
  showToast(`Switching to ${nextModel}...`, 1600);

  try {
    const response = await fetch("/api/manager/switch-model", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: nextModel }),
    });
    const data = await response.json();

    if (!response.ok || !data || data.ok !== true) {
      const detail =
        (data && (data.detail || data.error || data.message)) || "Model switch failed";
      throw new Error(String(detail));
    }

    const activeModel =
      typeof data.active_model === "string" && data.active_model.trim()
        ? data.active_model.trim()
        : nextModel;

    if (Array.isArray(data.available_models)) {
      const nextModels = normalizeModelList(data.available_models);
      state.models = nextModels;
      state.modelCapabilities = normalizeModelCapabilities(
        nextModels,
        data.model_capabilities,
      );
      setModelSelectOptions(nextModels, activeModel, false);
      state.selectedLocalModel = nextModels.includes(activeModel)
        ? activeModel
        : (nextModels[0] || "");
      renderModelsList();
    }

    state.activeModel = activeModel;
    state.selectedModel = activeModel;
    setModelPrefForServer(state.settings.server_url, activeModel);

    if (data.runtime_config) {
      state.modelRuntime.available = true;
      state.modelRuntime.config = normalizeRuntimeConfig(data.runtime_config);
      applyRuntimeConfigToInputs();
    }

    showToast(`Model switched: ${activeModel}`, 1600);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    state.selectedModel = previousModel;
    if (modelSelect && previousModel) {
      modelSelect.value = previousModel;
    }
    showToast(`Switch failed: ${message}`, 2600);
    return false;
  } finally {
    state.switchingModel = false;
    setSending(state.sending);
  }
}

function applySettingsToInputs() {
  serverUrlInput.value = state.settings.server_url;
  maxTokensInput.value = String(state.settings.max_tokens);
  temperatureRange.value = String(state.settings.temperature);
  temperatureInput.value = state.settings.temperature.toFixed(2);
  systemPromptInput.value = state.settings.system_prompt;
}

function readSettingsFromInputs() {
  return normalizeSettings({
    server_url: serverUrlInput.value,
    max_tokens: maxTokensInput.value,
    temperature: temperatureInput.value,
    system_prompt: systemPromptInput.value,
  });
}

function hoverModeClass(mode) {
  return `mode-${mode}`;
}

function getBtnIconColor(btn) {
  if (!btn) {
    return "#111111";
  }
  return btn.classList.contains("active") ? "#111111" : "#c7cfdb";
}

function refreshHoverPillColor() {
  if (!hoverPill) return;
  const hovered = sideButtons.find((btn) => btn.matches(":hover"));
  const target = hovered || sideButtons.find((btn) => btn.classList.contains("active"));
  const color = getBtnIconColor(target);
  hoverPill.querySelectorAll(".pill-icon").forEach((icon) => {
    icon.style.color = color;
  });
}

function setPillTarget(btn) {
  if (pillTargetBtn && pillTargetBtn !== btn) {
    pillTargetBtn.classList.remove("pill-target");
  }
  pillTargetBtn = btn || null;
  if (pillTargetBtn) {
    pillTargetBtn.classList.add("pill-target");
  }
}

function clearPillTarget() {
  if (pillTargetBtn) {
    pillTargetBtn.classList.remove("pill-target");
    pillTargetBtn = null;
  }
}

function moveHoverPillTo(btn) {
  if (!hoverPill || !btn) return;
  const top = btn.offsetTop + (btn.offsetHeight - hoverPill.offsetHeight) / 2;
  hoverPill.style.top = `${Math.max(6, top)}px`;
  hoverPill.classList.remove(
    "mode-chat",
    "mode-models",
    "mode-community",
    "mode-settings",
    "mode-about",
  );
  hoverPill.classList.add(hoverModeClass(btn.dataset.mode || "chat"));
  refreshHoverPillColor();
}

function showHoverPill(btn) {
  if (!hoverPill || !btn) return;
  if (hidePillTimer) {
    clearTimeout(hidePillTimer);
    hidePillTimer = null;
  }
  setPillTarget(btn);
  moveHoverPillTo(btn);
  hoverPill.classList.add("show", "hover");
}

function hideHoverPill() {
  if (!hoverPill) return;
  if (hidePillTimer) {
    clearTimeout(hidePillTimer);
  }
  hidePillTimer = window.setTimeout(() => {
    hoverPill.classList.remove("hover", "pressed", "show");
    clearPillTarget();
    hidePillTimer = null;
  }, 160);
}

function pulseHoverPill() {
  if (!hoverPill) return;
  if (pressPillTimer) {
    clearTimeout(pressPillTimer);
    pressPillTimer = null;
  }
  hoverPill.classList.remove("hover");
  hoverPill.classList.add("pressed", "show");
  pressPillTimer = window.setTimeout(() => {
    hoverPill.classList.remove("pressed");
    hoverPill.classList.add("hover");
    pressPillTimer = null;
  }, 80);
}

function triggerSideBtnBounce(btn) {
  if (!btn) return;
  btn.classList.remove("tap");
  void btn.offsetWidth;
  btn.classList.add("tap");
}

function setActiveButton(page) {
  sideButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });
  refreshHoverPillColor();
}

function setPage(page) {
  state.page = page;
  pages.forEach((section) => {
    section.classList.toggle("active", section.dataset.page === page);
  });

  setActiveButton(page);

  if (page === "community") {
    ensureCommunityInitialized();
  }
  if (page === "models") {
    renderModelsList();
  }
  if (page === "settings") {
    renderLangToggle();
  }
}

function initSidebar() {
  sideButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setPage(btn.dataset.page);
      triggerSideBtnBounce(btn);
    });

    btn.addEventListener("mouseenter", () => {
      showHoverPill(btn);
    });

    btn.addEventListener("mouseleave", () => {
      hideHoverPill();
    });

    btn.addEventListener("mousedown", (event) => {
      if (event.button !== 0) return;
      showHoverPill(btn);
      pulseHoverPill();
    });
  });

  if (sidebar) {
    sidebar.addEventListener("mouseleave", () => {
      hideHoverPill();
    });
  }

  setPage(state.page);
  refreshHoverPillColor();
}

function formatDuration(ms) {
  const sec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatMs(msValue) {
  return Number.isFinite(msValue) ? `${msValue.toFixed(1)} ms` : "-";
}

function formatTps(tpsValue) {
  return Number.isFinite(tpsValue) ? `${tpsValue.toFixed(2)} tok/s` : "-";
}

function formatGb(gbValue) {
  return Number.isFinite(gbValue) ? `${gbValue.toFixed(2)} GB` : "-";
}

function formatMemoryPressure(pressureValue) {
  if (!Number.isFinite(pressureValue)) return "-";

  let level = "low";
  if (pressureValue >= 85) {
    level = "high";
  } else if (pressureValue >= 70) {
    level = "medium";
  }
  return `${pressureValue.toFixed(1)}% (${level})`;
}

function escapeHtml(input) {
  return String(input || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderEmptyResponseHtml() {
  return [
    '<span class="empty-ellipsis" aria-label="Empty response">',
    '<span class="dot dot-1">.</span>',
    '<span class="dot dot-2">.</span>',
    '<span class="dot dot-3">.</span>',
    "</span>",
  ].join("");
}

function renderMarkdown(content) {
  const source = escapeHtml(content).replace(/\r\n?/g, "\n");
  const codeBlocks = [];

  let text = source.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_m, lang, code) => {
    const language = String(lang || "").trim();
    const className = language ? ` language-${language}` : "";
    const blockHtml = `<pre class="md-pre"><code class="md-code${className}">${code.replace(/\n+$/g, "")}</code></pre>`;
    const token = `@@MD_BLOCK_${codeBlocks.length}@@`;
    codeBlocks.push(blockHtml);
    return token;
  });

  text = text
    .replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*([^\n*][\s\S]*?)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^\n_][\s\S]*?)__/g, "<strong>$1</strong>")
    .replace(/`([^`\n]+)`/g, "<code>$1</code>");

  const blocks = text.split(/\n{2,}/).filter((item) => item.trim().length > 0);
  let html = blocks
    .map((block) => {
      const trimmed = block.trim();
      if (/^@@MD_BLOCK_\d+@@$/.test(trimmed)) {
        return trimmed;
      }
      if (/^###\s+/.test(trimmed)) {
        return `<h3>${trimmed.replace(/^###\s+/, "")}</h3>`;
      }
      if (/^##\s+/.test(trimmed)) {
        return `<h2>${trimmed.replace(/^##\s+/, "")}</h2>`;
      }
      if (/^#\s+/.test(trimmed)) {
        return `<h1>${trimmed.replace(/^#\s+/, "")}</h1>`;
      }
      return `<p>${block.replace(/\n/g, "<br>")}</p>`;
    })
    .join("");

  html = html.replace(/@@MD_BLOCK_(\d+)@@/g, (_match, indexText) => {
    const index = Number.parseInt(indexText, 10);
    return codeBlocks[index] || "";
  });

  return html || "<p></p>";
}

function renderMessageContent(content) {
  const text = String(content || "");
  if (text === EMPTY_RESPONSE_SENTINEL) {
    return renderEmptyResponseHtml();
  }
  return renderMarkdown(text);
}

function sanitizeFinalAnswerText(rawText) {
  let cleaned = String(rawText || "");
  if (!cleaned) return "";

  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "");
  cleaned = cleaned.replace(/<think>[\s\S]*$/gi, "");

  const markerMatch = FINAL_ANSWER_MARKER_RE.exec(cleaned);
  if (markerMatch && Number.isInteger(markerMatch.index)) {
    cleaned = cleaned.slice(markerMatch.index + markerMatch[0].length);
  }

  cleaned = cleaned.replace(FINAL_ANSWER_HEADER_RE, "");
  cleaned = cleaned.replace(THINKING_HEADER_RE, "");
  return cleaned;
}

function extractFinalAnswerFromDone(donePayload) {
  if (!donePayload || typeof donePayload !== "object") return "";
  const candidates = [
    donePayload.answer,
    donePayload.final_answer,
    donePayload.reply,
    donePayload.text,
    donePayload.output,
    donePayload.content,
    donePayload.message,
    donePayload.result && donePayload.result.answer,
    donePayload.result && donePayload.result.final_answer,
    donePayload.result && donePayload.result.reply,
    donePayload.result && donePayload.result.text,
    donePayload.data && donePayload.data.answer,
    donePayload.data && donePayload.data.final_answer,
    donePayload.data && donePayload.data.reply,
    donePayload.data && donePayload.data.text,
  ];
  for (const item of candidates) {
    const text = String(item || "").trim();
    if (text) {
      return text;
    }
  }
  return "";
}

function renderDashboard() {
  const d = state.dashboard;

  if (dashUptime) {
    dashUptime.textContent = formatDuration(Date.now() - d.startedAt);
  }

  if (dashRequests) {
    dashRequests.textContent = `${d.requestCount} (ok ${d.successCount} / err ${d.errorCount})`;
  }

  if (dashSuccessRate) {
    dashSuccessRate.textContent = d.requestCount > 0
      ? `${((d.successCount / d.requestCount) * 100).toFixed(1)}%`
      : "-";
  }

  if (dashAvgLatency) {
    const avgLatency = d.latencySamples > 0 ? d.totalLatencyMs / d.latencySamples : null;
    dashAvgLatency.textContent = formatMs(avgLatency);
  }

  if (dashAvgTps) {
    const avgTps = d.tpsSamples > 0 ? d.totalTps / d.tpsSamples : null;
    dashAvgTps.textContent = formatTps(avgTps);
  }

  if (dashMemoryUsage) {
    dashMemoryUsage.textContent = formatGb(d.memoryUsageGb);
  }

  if (dashMemoryPressure) {
    dashMemoryPressure.textContent = formatMemoryPressure(d.memoryPressurePct);
  }

  if (dashLastUsage) {
    if (Number.isFinite(d.lastPromptTokens) || Number.isFinite(d.lastCompletionTokens) || Number.isFinite(d.lastTotalTokens)) {
      const p = Number.isFinite(d.lastPromptTokens) ? d.lastPromptTokens : "?";
      const c = Number.isFinite(d.lastCompletionTokens) ? d.lastCompletionTokens : "?";
      const t = Number.isFinite(d.lastTotalTokens) ? d.lastTotalTokens : "?";
      dashLastUsage.textContent = `p ${p} / c ${c} / t ${t}`;
    } else {
      dashLastUsage.textContent = "-";
    }
  }

  if (dashTotalTokens) {
    dashTotalTokens.textContent = `${d.totalTokens} (p ${d.totalPromptTokens} / c ${d.totalCompletionTokens})`;
  }

  if (dashModel) {
    const capability = getModelCapability(d.lastModel);
    const deepTag = capability.deepThinking ? " [Deep]" : "";
    const suffix = d.serverOnline === false ? " (offline)" : "";
    dashModel.textContent = `${d.lastModel || "-"}${deepTag}${suffix}`;
  }
}

function renderChat(options = {}) {
  const animateLast = options.animateLast === true;

  chatFeed.innerHTML = "";

  if (!state.messages.length) {
    const placeholder = document.createElement("div");
    placeholder.className = "chat-placeholder";
    placeholder.textContent = "Start a conversation with token-workshed.\nYou can tune settings in the Settings page.";
    chatFeed.appendChild(placeholder);
    return;
  }

  state.messages.forEach((msg, index) => {
    if (msg.role === "assistant" && msg.thinking_complete === true) {
      const statusRow = document.createElement("div");
      statusRow.className = "thinking-status-row assistant";

      const statusBox = document.createElement("div");
      statusBox.className = "thinking-status-box";
      statusBox.textContent = "Thinking Completed";

      statusRow.appendChild(statusBox);
      chatFeed.appendChild(statusRow);
    }

    const row = document.createElement("div");
    row.className = `bubble-row ${msg.role}`;

    const bubble = document.createElement("div");
    bubble.className = `bubble ${msg.role}`;
    bubble.innerHTML = renderMessageContent(msg.content);

    if (animateLast && index === state.messages.length - 1) {
      row.classList.add("bubble-row-enter");
      bubble.classList.add("bubble-text-fade-in");
    }

    row.appendChild(bubble);
    chatFeed.appendChild(row);
  });

  chatFeed.scrollTop = chatFeed.scrollHeight;
}

function formatConversationTimestamp(ts) {
  if (!Number.isFinite(ts)) return "-";
  try {
    return new Date(ts).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

function renderConversationHistory() {
  if (!historyConversations) return;
  historyConversations.innerHTML = "";

  const conversations = sortConversationsByUpdated(state.conversations || []);
  if (!conversations.length) {
    const empty = document.createElement("div");
    empty.className = "history-conv-empty";
    empty.textContent = t("No conversation history yet.");
    historyConversations.appendChild(empty);
    return;
  }

  conversations.forEach((conv) => {
    const row = document.createElement("div");
    row.className = "history-conv-item";
    if (conv.id === state.activeConversationId) {
      row.classList.add("active");
    }
    row.tabIndex = 0;

    const body = document.createElement("div");
    body.className = "history-conv-body";

    const title = document.createElement("div");
    title.className = "history-conv-title";
    const dynamicTitle = (
      conv.auto_title !== false
      && Array.isArray(conv.messages)
      && conv.messages.length === 0
    )
      ? t("New Conversation")
      : normalizeConversationTitle(conv.title, t("New Conversation"));
    title.textContent = dynamicTitle;
    body.appendChild(title);

    const meta = document.createElement("div");
    meta.className = "history-conv-meta";
    meta.textContent = formatConversationTimestamp(Number(conv.updated_at));
    body.appendChild(meta);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "history-conv-delete";
    removeBtn.title = t("Delete conversation");
    removeBtn.setAttribute("aria-label", t("Delete conversation"));
    removeBtn.textContent = "x";
    removeBtn.disabled = state.sending || state.clearingChat || state.switchingModel;
    removeBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteConversationById(conv.id);
    });
    removeBtn.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });

    row.addEventListener("click", () => {
      setActiveConversation(conv.id);
    });
    row.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      renameConversationById(conv.id);
    });
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setActiveConversation(conv.id);
      }
    });

    row.appendChild(body);
    row.appendChild(removeBtn);
    historyConversations.appendChild(row);
  });
}

function setActiveConversation(conversationId) {
  if (state.sending || state.clearingChat || state.switchingModel) return;
  const id = String(conversationId || "").trim();
  if (!id) return;

  const target = state.conversations.find((item) => item.id === id);
  if (!target) return;

  syncActiveConversationFromState({ touchUpdated: false });
  state.activeConversationId = id;
  state.messages = sanitizeStoredMessages(target.messages);
  persistConversations();
  renderChat();
  renderConversationHistory();
}

function startNewConversation(options = {}) {
  const showNotice = options.showNotice === true;
  const current = ensureActiveConversation();
  if (!current.messages.length) {
    state.activeConversationId = current.id;
    state.messages = [];
    persistConversations();
    renderChat();
    renderConversationHistory();
    if (showNotice) {
      showToast(t("Started a new conversation"), 1500);
    }
    return;
  }

  syncActiveConversationFromState();
  persistConversations();

  const created = buildConversation([]);
  state.conversations.push(created);
  state.activeConversationId = created.id;
  state.messages = [];
  persistConversations();
  renderChat();
  renderConversationHistory();

  if (showNotice) {
    showToast(t("Started a new conversation"), 1500);
  }
}

function deleteConversationById(conversationId) {
  const id = String(conversationId || "").trim();
  if (!id) return;
  if (state.sending || state.clearingChat || state.switchingModel) return;

  if (state.conversations.length <= 1) {
    const current = ensureActiveConversation();
    current.messages = [];
    current.auto_title = true;
    current.title = t("New Conversation");
    current.updated_at = Date.now();
    state.messages = [];
    persistConversations();
    renderChat();
    renderConversationHistory();
    showToast(t("Conversation deleted"), 1400);
    return;
  }

  const wasActive = id === state.activeConversationId;
  state.conversations = state.conversations.filter((item) => item.id !== id);

  if (wasActive) {
    const next = sortConversationsByUpdated(state.conversations)[0];
    if (next) {
      state.activeConversationId = next.id;
      state.messages = sanitizeStoredMessages(next.messages);
    } else {
      const created = buildConversation([]);
      state.conversations = [created];
      state.activeConversationId = created.id;
      state.messages = [];
    }
  }

  persistConversations();
  renderChat();
  renderConversationHistory();
  showToast(t("Conversation deleted"), 1400);
}

function renameConversationById(conversationId) {
  const id = String(conversationId || "").trim();
  if (!id) return;
  if (state.sending || state.clearingChat || state.switchingModel) return;

  const conv = state.conversations.find((item) => item.id === id);
  if (!conv) return;

  const currentTitle = normalizeConversationTitle(
    String(conv.title || "").trim() || deriveConversationTitle(conv.messages),
    t("New Conversation"),
  );
  const nextRaw = window.prompt(t("Enter new conversation title:"), currentTitle);
  if (nextRaw === null) return;

  const nextTitle = normalizeConversationTitle(nextRaw, "");
  if (!nextTitle) {
    showToast(t("New conversation title cannot be empty."), 1800);
    return;
  }

  conv.title = nextTitle;
  conv.auto_title = false;
  conv.updated_at = Date.now();

  const timerId = state.titleGenTimerByConversation[id];
  if (timerId) {
    clearTimeout(timerId);
    delete state.titleGenTimerByConversation[id];
  }
  nextConversationTitleSeq(id);

  persistConversations();
  renderConversationHistory();
  showToast(t("Conversation renamed"), 1400);
}

function pushMessage(role, content, options = {}) {
  const entry = { role, content };
  if (role === "assistant" && options.thinkingComplete === true) {
    entry.thinking_complete = true;
  }
  if (Object.prototype.hasOwnProperty.call(options, "apiContent")) {
    entry.api_content = options.apiContent;
  }
  state.messages.push(entry);
  saveStoredMessages();
  renderChat({ animateLast: options.animate !== false });
}

function setSending(isSending) {
  state.sending = isSending;
  const disabled = isSending || state.clearingChat || state.switchingModel;
  btnSend.disabled = disabled;
  btnClear.disabled = disabled;
  btnPing.disabled = disabled;
  messageInput.disabled = disabled;
  if (btnAttachMedia) {
    btnAttachMedia.disabled = disabled;
  }
  if (mediaInput) {
    mediaInput.disabled = disabled;
  }
  if (btnClearMedia) {
    btnClearMedia.disabled = disabled || state.pendingMedia.length === 0;
  }
  if (modelSelect) {
    modelSelect.disabled = disabled || state.models.length === 0;
  }
  if (btnCommunitySearch) {
    btnCommunitySearch.disabled = disabled || state.community.searching;
  }
  if (communityQueryInput) {
    communityQueryInput.disabled = disabled || state.community.searching;
  }
  setRuntimeControlsDisabled(disabled || !state.modelRuntime.available);

  if (isSending) {
    btnSend.textContent = "Sending...";
  } else {
    btnSend.textContent = "Send";
    messageInput.focus();
  }
  updateDeleteModelButtonState();
  setCommunityJobActionButtons(state.community.currentJob);
}

function createLiveResponseView() {
  const container = document.createElement("div");
  container.className = "live-response";

  const thinkingRow = document.createElement("div");
  thinkingRow.className = "thinking-live-row hidden";
  const thinkingTitle = document.createElement("div");
  thinkingTitle.className = "thinking-live-title";
  thinkingTitle.textContent = "Thinking Process";
  const thinkingBody = document.createElement("div");
  thinkingBody.className = "thinking-live-body";
  thinkingRow.appendChild(thinkingTitle);
  thinkingRow.appendChild(thinkingBody);

  const thinkingDone = document.createElement("div");
  thinkingDone.className = "thinking-done-row hidden";
  thinkingDone.textContent = "Thinking Completed";

  const answerRow = document.createElement("div");
  answerRow.className = "bubble-row assistant";
  const answerBubble = document.createElement("div");
  answerBubble.className = "bubble assistant";
  const answerStream = document.createElement("div");
  answerStream.className = "stream-answer";
  answerBubble.appendChild(answerStream);
  answerRow.appendChild(answerBubble);

  container.appendChild(thinkingRow);
  container.appendChild(thinkingDone);
  container.appendChild(answerRow);
  chatFeed.appendChild(container);
  chatFeed.scrollTop = chatFeed.scrollHeight;

  let thinkingText = "";
  let answerText = "";
  let answerQueue = "";
  let renderedAnswer = "";
  let hadThinking = false;
  let thinkingClosed = false;
  let typingTimer = 0;
  let answerAnimated = false;
  const TYPE_DELAY_MS = 22;
  const idleWaiters = [];

  function closeThinkingBox() {
    if (thinkingClosed) return;
    thinkingClosed = true;
    if (hadThinking) {
      thinkingRow.classList.add("hidden");
      thinkingDone.classList.remove("hidden");
    } else {
      thinkingRow.classList.add("hidden");
      thinkingDone.classList.add("hidden");
    }
  }

  function getTypingStep(remaining) {
    if (remaining > 640) return 6;
    if (remaining > 320) return 4;
    if (remaining > 160) return 3;
    if (remaining > 80) return 2;
    return 1;
  }

  function renderTypedAnswer() {
    const liveAnswer = sanitizeFinalAnswerText(renderedAnswer);
    if (liveAnswer.trim()) {
      answerStream.innerHTML = renderMarkdown(liveAnswer);
    } else {
      answerStream.innerHTML = renderEmptyResponseHtml();
    }
    if (liveAnswer.trim() && !answerAnimated) {
      answerAnimated = true;
      answerBubble.classList.add("bubble-text-fade-in");
    }
    chatFeed.scrollTop = chatFeed.scrollHeight;
  }

  function notifyIdleIfNeeded() {
    if (typingTimer || answerQueue.length > 0) return;
    if (!idleWaiters.length) return;
    const waiters = idleWaiters.splice(0, idleWaiters.length);
    waiters.forEach((resolve) => {
      try {
        resolve();
      } catch {
        // ignore
      }
    });
  }

  function stopTyping() {
    if (typingTimer) {
      clearTimeout(typingTimer);
      typingTimer = 0;
    }
  }

  function runTypingTick() {
    typingTimer = 0;
    closeThinkingBox();
    if (!answerQueue.length) {
      return;
    }

    const step = getTypingStep(answerQueue.length);
    renderedAnswer += answerQueue.slice(0, step);
    answerQueue = answerQueue.slice(step);
    renderTypedAnswer();

    if (answerQueue.length) {
      typingTimer = window.setTimeout(runTypingTick, TYPE_DELAY_MS);
    } else {
      notifyIdleIfNeeded();
    }
  }

  function scheduleTyping() {
    if (typingTimer) return;
    typingTimer = window.setTimeout(runTypingTick, TYPE_DELAY_MS);
  }

  function flushAllTyping() {
    stopTyping();
    if (answerQueue.length) {
      renderedAnswer += answerQueue;
      answerQueue = "";
      renderTypedAnswer();
    }
    notifyIdleIfNeeded();
  }

  function waitForIdle() {
    if (!typingTimer && answerQueue.length === 0) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      idleWaiters.push(resolve);
    });
  }

  return {
    appendThinking(delta) {
      if (!delta) return;
      thinkingText += delta;
      if (thinkingText.trim().length > 0) {
        if (!hadThinking) {
          thinkingRow.classList.remove("hidden");
          thinkingDone.classList.add("hidden");
        }
        hadThinking = true;
      }
      thinkingBody.innerHTML = renderMarkdown(thinkingText);
      thinkingBody.scrollTop = thinkingBody.scrollHeight;
      chatFeed.scrollTop = chatFeed.scrollHeight;
    },
    appendAnswer(delta) {
      if (!delta) return;
      answerText += delta;
      answerQueue += delta;
      scheduleTyping();
    },
    hasAnswer() {
      return sanitizeFinalAnswerText(answerText).trim().length > 0;
    },
    getAnswer() {
      return sanitizeFinalAnswerText(answerText).trim();
    },
    hasThinking() {
      return hadThinking;
    },
    getThinking() {
      return thinkingText.trim();
    },
    waitForIdle,
    finalize() {
      flushAllTyping();
      closeThinkingBox();
      const visibleAnswer = sanitizeFinalAnswerText(answerText).trim();
      if (!visibleAnswer) {
        answerBubble.innerHTML = renderEmptyResponseHtml();
      } else {
        answerBubble.innerHTML = renderMarkdown(visibleAnswer);
      }
      return {
        thinking: thinkingText.trim(),
        answer: visibleAnswer,
        hadThinking,
      };
    },
    remove() {
      stopTyping();
      container.remove();
    },
  };
}

async function streamChatResponse(payload, handlers = {}) {
  const response = await fetch("/api/chat/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const err = await response.json();
      message = err.detail || err.error || message;
    } catch {
      // keep default message
    }
    throw new Error(message);
  }

  if (!response.body) {
    throw new Error("Streaming response is not supported in this browser.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let doneEvent = null;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let newlineIndex = buffer.indexOf("\n");
    while (newlineIndex >= 0) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);

      if (line) {
        let eventData = null;
        try {
          eventData = JSON.parse(line);
        } catch {
          eventData = null;
        }

        if (eventData && typeof eventData === "object") {
          const eventType = eventData.type;
          if (eventType === "thinking_delta") {
            handlers.onThinking?.(String(eventData.text || ""));
          } else if (eventType === "answer_delta") {
            handlers.onAnswer?.(String(eventData.text || ""));
          } else if (eventType === "done") {
            doneEvent = eventData;
            handlers.onDone?.(eventData);
          } else if (eventType === "error") {
            throw new Error(String(eventData.message || "Stream error"));
          }
        }
      }

      newlineIndex = buffer.indexOf("\n");
    }
  }

  const tail = buffer.trim();
  if (tail) {
    try {
      const eventData = JSON.parse(tail);
      if (eventData && eventData.type === "done") {
        doneEvent = eventData;
        handlers.onDone?.(eventData);
      } else if (eventData && eventData.type === "error") {
        throw new Error(String(eventData.message || "Stream error"));
      }
    } catch {
      // Ignore trailing parse errors.
    }
  }

  return doneEvent;
}

async function recoverFinalAnswer(userText, thinkingText) {
  const reasoningText = String(thinkingText || "").trim();
  const compactReasoning = reasoningText.slice(-6000);

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: [
        "User question:",
        userText,
        "",
        "Reasoning transcript:",
        compactReasoning,
        "",
        "Return only one concise section:",
        "Final Answer: <answer>",
      ].join("\n"),
      history: [],
      server_url: state.settings.server_url,
      max_tokens: Math.max(96, Math.min(256, state.settings.max_tokens || 256)),
      temperature: 0.2,
      system_prompt:
        "You are an answer synthesizer. Use the provided reasoning transcript and output only the final answer. Do not include thinking process.",
      model: state.selectedModel,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const message = data.detail || data.error || "Final answer recovery failed";
    throw new Error(message);
  }

  return String(data.reply || "").trim();
}

function toFiniteNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function applyRuntimeMetrics(runtimeData) {
  const d = state.dashboard;
  if (!runtimeData || typeof runtimeData !== "object") {
    d.memoryUsageGb = null;
    d.memoryPressurePct = null;
    return;
  }

  d.memoryUsageGb = toFiniteNumber(runtimeData.memory_usage_gb);
  d.memoryPressurePct = toFiniteNumber(runtimeData.memory_pressure_pct);
}

async function refreshStatus(options = {}) {
  if (state.statusRefreshing) return;
  state.statusRefreshing = true;

  try {
    const silent = options && options.silent === true;
    const target = normalizeServerUrl(serverUrlInput.value || state.settings.server_url);

    if (!silent) {
      serverBadge.textContent = `Server: checking ${target}`;
      setModelSelectLoading("(Detecting...)");
    }

    const managerData = await fetchManagerModels();
    if (managerData) {
      const managerServer = normalizeServerUrl(managerData.server_url || target);
      const managerModels = Array.isArray(managerData.available_models)
        ? managerData.available_models
        : [];
      const managerActive = (
        typeof managerData.active_model === "string" && managerData.active_model.trim()
      ) ? managerData.active_model.trim() : "";
      syncSelectedModel(
        managerServer,
        managerModels,
        managerActive || managerData.default_model || "",
        managerData.model_capabilities,
      );
      syncNoModelBanner(managerModels.length === 0);
      if (managerActive) {
        state.activeModel = managerActive;
        state.selectedModel = managerActive;
        if (modelSelect && state.models.includes(managerActive)) {
          modelSelect.value = managerActive;
        }
        setModelPrefForServer(managerServer, managerActive);
      } else {
        state.activeModel = state.selectedModel;
      }
      if (managerData.runtime_config) {
        state.modelRuntime.available = true;
        state.modelRuntime.config = normalizeRuntimeConfig(managerData.runtime_config);
        applyRuntimeConfigToInputs();
        setRuntimeControlsDisabled(
          state.sending || state.clearingChat || state.switchingModel || !state.modelRuntime.available,
        );
      } else {
        await refreshManagerRuntimeConfig({ silent: true });
      }
      if (modelsHint) {
        modelsHint.textContent = "Changing runtime options restarts the active model process.";
      }
      if (Object.prototype.hasOwnProperty.call(managerData, "integrity_report")) {
        applyIntegrityReport(managerData.integrity_report, { silent });
      }
      if (Object.prototype.hasOwnProperty.call(managerData, "community_job")) {
        state.community.currentJob = managerData.community_job || null;
        renderCommunityJob(state.community.currentJob);
      }
    } else {
      state.modelRuntime.available = false;
      setRuntimeControlsDisabled(true);
      if (modelsHint) {
        modelsHint.textContent = "Runtime options are available only in desktop manager mode.";
      }
      state.community.currentJob = null;
      renderCommunityJob(null);
      applyIntegrityReport(null, { silent: true });
      hideNoModelBanner({ resetState: true });
    }

    try {
      const response = await fetch(`/api/status?server_url=${encodeURIComponent(target)}`);
      const data = await response.json();

      if (!response.ok || !data.ok) {
        serverBadge.textContent = `Server: offline (${target})`;
        if (!managerData) {
          state.models = [];
          state.modelCapabilities = {};
          state.selectedLocalModel = "";
          renderModelsList();
          setModelSelectLoading("(Server offline)");
        }
        state.dashboard.serverOnline = false;
        applyRuntimeMetrics(null);
        renderDashboard();
        return;
      }

      const serverUrl = normalizeServerUrl(data.server_url || target);
      if (!managerData) {
        const models = normalizeModelList(data.models);
        syncSelectedModel(serverUrl, models, data.model, data.model_capabilities);
        state.activeModel = state.selectedModel;
      } else if (!state.activeModel && typeof data.model === "string" && data.model.trim()) {
        state.activeModel = data.model.trim();
      }

      serverBadge.textContent = `Server: online (${serverUrl})`;
      state.dashboard.serverOnline = true;
      applyRuntimeMetrics(data.runtime);
      state.dashboard.lastModel =
        state.activeModel || state.selectedModel || data.model || state.dashboard.lastModel;
      renderDashboard();
    } catch (error) {
      serverBadge.textContent = `Server: offline (${target})`;
      if (!managerData) {
        state.models = [];
        state.modelCapabilities = {};
        state.selectedLocalModel = "";
        renderModelsList();
        setModelSelectLoading("(Network error)");
      }
      state.dashboard.serverOnline = false;
      applyRuntimeMetrics(null);
      renderDashboard();
    }
  } finally {
    state.statusRefreshing = false;
  }
}

function applyChatMetrics(data) {
  const d = state.dashboard;
  const metrics = data && typeof data === "object" ? data.metrics : null;

  d.successCount += 1;
  d.lastError = "-";

  const resultModel = typeof data.model === "string" ? data.model.trim() : "";
  const requestModel = typeof data.request_model === "string" ? data.request_model.trim() : "";
  if (resultModel) {
    d.lastModel = resultModel;
    state.activeModel = resultModel;
    state.selectedModel = resultModel;
    if (modelSelect && state.models.includes(resultModel)) {
      modelSelect.value = resultModel;
    }
    setModelPrefForServer(state.settings.server_url, resultModel);
  } else if (requestModel) {
    d.lastModel = requestModel;
    state.activeModel = requestModel;
  }

  if (!metrics || typeof metrics !== "object") {
    renderDashboard();
    return;
  }

  const promptTokens = Number.isFinite(metrics.prompt_tokens) ? Number(metrics.prompt_tokens) : null;
  const completionTokens = Number.isFinite(metrics.completion_tokens) ? Number(metrics.completion_tokens) : null;
  const totalTokensRaw = Number.isFinite(metrics.total_tokens) ? Number(metrics.total_tokens) : null;
  const latencyMs = Number.isFinite(metrics.latency_ms) ? Number(metrics.latency_ms) : null;
  const tps = Number.isFinite(metrics.tokens_per_second) ? Number(metrics.tokens_per_second) : null;

  const totalTokens = totalTokensRaw !== null
    ? totalTokensRaw
    : (promptTokens !== null && completionTokens !== null ? promptTokens + completionTokens : null);

  if (promptTokens !== null) {
    d.lastPromptTokens = promptTokens;
    d.totalPromptTokens += promptTokens;
  }

  if (completionTokens !== null) {
    d.lastCompletionTokens = completionTokens;
    d.totalCompletionTokens += completionTokens;
  }

  if (totalTokens !== null) {
    d.lastTotalTokens = totalTokens;
    d.totalTokens += totalTokens;
  }

  if (latencyMs !== null) {
    d.lastLatencyMs = latencyMs;
    d.totalLatencyMs += latencyMs;
    d.latencySamples += 1;
  }

  if (tps !== null) {
    d.lastTps = tps;
    d.totalTps += tps;
    d.tpsSamples += 1;
  }

  renderDashboard();
}

async function sendMessage() {
  if (state.sending || state.clearingChat || state.switchingModel) return;

  const text = messageInput.value.trim();
  const mediaItems = state.pendingMedia.slice();
  if (!text && mediaItems.length === 0) return;

  state.settings = readSettingsFromInputs();
  saveStoredSettings();

  const selectedFromUi =
    modelSelect && typeof modelSelect.value === "string" ? modelSelect.value.trim() : "";
  state.selectedModel = selectedFromUi || state.selectedModel || "";
  if (!state.selectedModel) {
    showToast("No model is available. Install one from Community first.", 2400);
    return;
  }
  setModelPrefForServer(state.settings.server_url, state.selectedModel);

  if (
    state.managerEnabled &&
    state.selectedModel &&
    state.selectedModel !== state.activeModel
  ) {
    const switched = await switchManagedModel(state.selectedModel);
    if (!switched) {
      return;
    }
    await refreshStatus();
  }

  const userApiContent = buildUserApiContent(text, mediaItems);
  const userDisplayText = buildUserDisplayText(text, mediaItems) || "...";

  const historyForRequest = state.messages.map((item) => ({
    role: item.role,
    content: Object.prototype.hasOwnProperty.call(item, "api_content")
      ? item.api_content
      : (item.content === EMPTY_RESPONSE_SENTINEL ? "..." : item.content),
  }));

  state.dashboard.requestCount += 1;
  renderDashboard();

  pushMessage("user", userDisplayText, { apiContent: userApiContent });
  state.pendingMedia = [];
  renderPendingMedia();
  if (mediaInput) {
    mediaInput.value = "";
  }
  messageInput.value = "";
  setSending(true);

  const liveView = createLiveResponseView();
  let donePayload = null;

  try {
    donePayload = await streamChatResponse(
      {
        message: text || "Please analyze the attached media.",
        user_content: userApiContent,
        history: historyForRequest,
        server_url: state.settings.server_url,
        max_tokens: state.settings.max_tokens,
        temperature: state.settings.temperature,
        system_prompt: state.settings.system_prompt,
        model: state.selectedModel,
      },
      {
        onThinking: (delta) => {
          liveView.appendThinking(delta);
        },
        onAnswer: (delta) => {
          liveView.appendAnswer(delta);
        },
      },
    );

    const doneAnswer = extractFinalAnswerFromDone(donePayload);
    if (doneAnswer && !liveView.hasAnswer()) {
      liveView.appendAnswer(doneAnswer);
    }

    let recoveredAnswer = "";
    if (!liveView.hasAnswer() && liveView.hasThinking() && liveView.getThinking()) {
      showToast("Synthesizing final answer...", 1400);
      try {
        recoveredAnswer = await recoverFinalAnswer(
          text || userDisplayText,
          liveView.getThinking(),
        );
      } catch (recoverError) {
        const recoverMessage =
          recoverError instanceof Error ? recoverError.message : String(recoverError);
        showToast(`Final answer recovery failed: ${recoverMessage}`, 2400);
      }
    }

    if (recoveredAnswer && !liveView.hasAnswer()) {
      liveView.appendAnswer(recoveredAnswer);
    }

    await liveView.waitForIdle();

    const liveResult = liveView.finalize();
    let finalAnswer = liveResult.answer;
    if (finalAnswer && finalAnswer !== EMPTY_RESPONSE_SENTINEL) {
      finalAnswer = sanitizeFinalAnswerText(finalAnswer).trim();
    }
    if (!finalAnswer) {
      finalAnswer = liveResult.hadThinking
        ? "No final answer was generated. Try increasing max tokens or ask for a shorter thinking process."
        : EMPTY_RESPONSE_SENTINEL;
    }
    pushMessage("assistant", finalAnswer, { thinkingComplete: liveResult.hadThinking });

    if (donePayload && typeof donePayload === "object") {
      applyChatMetrics(donePayload);
    } else {
      applyChatMetrics({
        model: state.selectedModel,
        request_model: state.selectedModel,
        metrics: {},
      });
    }
    refreshStatus({ silent: true });
  } catch (error) {
    liveView.remove();
    const message = error instanceof Error ? error.message : String(error);
    state.dashboard.errorCount += 1;
    state.dashboard.lastError = message;
    renderDashboard();

    pushMessage("assistant", `[Error] ${message}`);
    showToast(`Send failed: ${message}`, 2800);
  } finally {
    setSending(false);
  }
}

function bindSettingsActions() {
  if (!temperatureRange || !temperatureInput || !btnSaveSettings || !btnResetSettings) {
    return;
  }

  temperatureRange.addEventListener("input", () => {
    temperatureInput.value = Number.parseFloat(temperatureRange.value).toFixed(2);
  });

  temperatureInput.addEventListener("change", () => {
    const value = clamp(Number.parseFloat(temperatureInput.value) || state.defaults.temperature, 0, 2);
    temperatureInput.value = value.toFixed(2);
    temperatureRange.value = String(value);
  });

  btnSaveSettings.addEventListener("click", async () => {
    state.settings = readSettingsFromInputs();
    applySettingsToInputs();
    saveStoredSettings();
    showToast("Settings saved");
    await refreshStatus();
  });

  btnResetSettings.addEventListener("click", () => {
    state.settings = normalizeSettings({
      ...state.defaults,
      system_prompt: "",
    });
    applySettingsToInputs();
    saveStoredSettings();
    showToast("Settings reset");
  });
}

function bindAppSettingsActions() {
  if (langToggle) {
    langToggle.addEventListener("mouseenter", () => {
      langToggle.classList.add("hovered");
    });
    langToggle.addEventListener("mouseleave", () => {
      langToggle.classList.remove("hovered");
    });
  }

  if (btnGoModelSettings) {
    btnGoModelSettings.addEventListener("click", () => {
      setPage("models");
    });
  }

  if (btnClearUiStorage) {
    btnClearUiStorage.addEventListener("click", () => {
      localStorage.removeItem(SETTINGS_KEY);
      localStorage.removeItem(CHAT_MEMORY_KEY);
      localStorage.removeItem(CHAT_SESSIONS_KEY);
      localStorage.removeItem(CHAT_ACTIVE_ID_KEY);
      localStorage.removeItem(MODEL_PREF_KEY);
      localStorage.removeItem(LANG_KEY);
      showToast("UI storage cleared. Reloading...", 1200);
      window.setTimeout(() => {
        window.location.reload();
      }, 500);
    });
  }
}

async function deleteSelectedLocalModel() {
  if (!state.managerEnabled) {
    showToast("Desktop manager mode is required for model deletion.", 2200);
    return;
  }

  const model = String(state.selectedLocalModel || "").trim();
  if (!model) {
    showToast("Select a model in the left panel first.", 1800);
    return;
  }

  if (model === state.activeModel) {
    showToast("Cannot delete currently active model.", 2200);
    return;
  }

  const confirmed = window.confirm(`Delete local cache for model?\n\n${model}`);
  if (!confirmed) return;

  btnDeleteModel.disabled = true;
  showToast(`Deleting ${model}...`, 1400);

  try {
    const response = await fetch("/api/manager/delete-model", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model }),
    });
    const data = await response.json();
    if (!response.ok || !data || data.ok !== true) {
      const detail =
        (data && (data.detail || data.error || data.message)) ||
        "Failed to delete model";
      throw new Error(String(detail));
    }

    const nextModels = Array.isArray(data.available_models)
      ? data.available_models
        .map((item) => String(item || "").trim())
        .filter((item, idx, arr) => item && arr.indexOf(item) === idx)
      : [];
    state.models = nextModels;
    state.modelCapabilities = normalizeModelCapabilities(
      nextModels,
      data.model_capabilities,
    );

    const activeModel = typeof data.active_model === "string" ? data.active_model.trim() : "";
    if (activeModel) {
      state.activeModel = activeModel;
    }

    let nextSelected = state.selectedModel;
    if (!nextSelected || !nextModels.includes(nextSelected)) {
      nextSelected = activeModel && nextModels.includes(activeModel)
        ? activeModel
        : (nextModels[0] || "");
      state.selectedModel = nextSelected;
    }
    setModelSelectOptions(nextModels, nextSelected, false);

    if (!state.selectedLocalModel || !nextModels.includes(state.selectedLocalModel)) {
      state.selectedLocalModel = nextModels.includes(nextSelected)
        ? nextSelected
        : (nextModels[0] || "");
    }
    applyIntegrityReport(data.integrity_report, { silent: true });
    renderModelsList();
    renderDashboard();
    showToast(String(data.message || `Deleted ${model}`), 2000);
    await refreshStatus({ silent: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    showToast(`Delete failed: ${message}`, 2600);
  } finally {
    updateDeleteModelButtonState();
  }
}

function bindModelsActions() {
  if (btnDeleteModel) {
    btnDeleteModel.addEventListener("click", () => {
      deleteSelectedLocalModel();
    });
  }

  const dependentControls = [
    cfgUsePagedCache,
    cfgKvCacheQuantization,
    cfgChunkedPrefillTokens,
    cfgEnableMtp,
  ].filter(Boolean);

  dependentControls.forEach((control) => {
    control.addEventListener("change", enforceRuntimeDependencies);
  });

  if (cfgChunkedPrefillTokens) {
    cfgChunkedPrefillTokens.addEventListener("input", enforceRuntimeDependencies);
  }

  if (btnResetModelRuntime) {
    btnResetModelRuntime.addEventListener("click", () => {
      state.modelRuntime.config = normalizeRuntimeConfig({
        continuous_batching: false,
        use_paged_cache: false,
        kv_cache_quantization: false,
        chunked_prefill_tokens: 0,
        enable_mtp: false,
        mtp_num_draft_tokens: 1,
      });
      applyRuntimeConfigToInputs();
      showToast("Runtime options reset (not yet applied)", 1500);
    });
  }

  if (btnSaveModelRuntime) {
    btnSaveModelRuntime.addEventListener("click", async () => {
      if (!state.managerEnabled) {
        showToast("Desktop manager mode is required for runtime options.", 2200);
        return;
      }

      const nextConfig = readRuntimeConfigFromInputs();
      setRuntimeControlsDisabled(true);
      showToast("Applying runtime options...", 1500);

      try {
        const response = await fetch("/api/manager/runtime-config", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nextConfig),
        });
        const data = await response.json();
        if (!response.ok || !data || data.ok !== true) {
          const detail =
            (data && (data.detail || data.error || data.message)) ||
            "Failed to apply runtime options";
          throw new Error(String(detail));
        }

        state.modelRuntime.available = true;
        state.modelRuntime.config = normalizeRuntimeConfig(data.runtime_config);
        applyRuntimeConfigToInputs();
        showToast("Runtime options applied. Model restarted.", 1800);
        await refreshStatus({ silent: true });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        showToast(`Apply failed: ${message}`, 2600);
      } finally {
        setRuntimeControlsDisabled(
          state.sending || state.clearingChat || state.switchingModel || !state.modelRuntime.available,
        );
      }
    });
  }
}

function bindCommunityActions() {
  if (btnCommunityPause) {
    btnCommunityPause.addEventListener("click", () => {
      controlCommunityJob("pause");
    });
  }
  if (btnCommunityResume) {
    btnCommunityResume.addEventListener("click", () => {
      controlCommunityJob("resume");
    });
  }
  if (btnCommunityCancel) {
    btnCommunityCancel.addEventListener("click", () => {
      controlCommunityJob("cancel");
    });
  }

  if (btnCommunitySearch) {
    btnCommunitySearch.addEventListener("click", () => {
      searchCommunityModels();
    });
  }

  if (communityQueryInput) {
    communityQueryInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        searchCommunityModels();
      }
    });
  }
}

function bindHfBindingActions() {
  if (btnHfBindSave) {
    btnHfBindSave.addEventListener("click", async () => {
      await saveHfBinding({ seen: true, closeOnSuccess: true });
    });
  }
  if (btnHfBindSkip) {
    btnHfBindSkip.addEventListener("click", async () => {
      const ok = await saveHfBinding({ seen: true, closeOnSuccess: true, silent: true });
      if (ok) {
        showToast("Skipped Hugging Face binding.", 1600);
      }
    });
  }
}

function bindChatActions() {
  btnSend.addEventListener("click", sendMessage);

  if (btnAttachMedia && mediaInput) {
    btnAttachMedia.addEventListener("click", () => {
      if (state.sending || state.clearingChat || state.switchingModel) return;
      mediaInput.click();
    });
  }

  if (btnClearMedia) {
    btnClearMedia.addEventListener("click", () => {
      if (state.sending || state.clearingChat || state.switchingModel) return;
      state.pendingMedia = [];
      if (mediaInput) {
        mediaInput.value = "";
      }
      renderPendingMedia();
      showToast("Media attachments cleared", 1400);
    });
  }

  if (mediaInput) {
    mediaInput.addEventListener("change", async (event) => {
      const input = event.target;
      const files = Array.from(input && input.files ? input.files : []);
      if (!files.length) return;

      let added = 0;
      for (const file of files) {
        if (state.pendingMedia.length >= MAX_MEDIA_ITEMS) {
          showToast(`You can attach up to ${MAX_MEDIA_ITEMS} files.`, 2200);
          break;
        }

        const kind = mediaKindFromMime(file.type);
        if (!kind) {
          showToast(`Skipped unsupported file: ${file.name}`, 1800);
          continue;
        }

        const maxBytes = kind === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
        if (file.size > maxBytes) {
          const sizeLabel = kind === "image" ? "10MB" : "35MB";
          showToast(`Skipped ${file.name}: over ${sizeLabel}`, 2200);
          continue;
        }

        try {
          const dataUrl = await fileToDataUrl(file);
          state.pendingMedia.push({
            id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            kind,
            name: file.name,
            size: file.size,
            mime: file.type || "",
            data_url: dataUrl,
          });
          added += 1;
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          showToast(message, 2200);
        }
      }

      if (input) {
        input.value = "";
      }
      renderPendingMedia();
      if (added > 0) {
        showToast(`Attached ${added} media file${added > 1 ? "s" : ""}.`, 1400);
      }
    });
  }

  btnClear.addEventListener("click", () => {
    if (state.sending || state.clearingChat) return;

    const rows = Array.from(chatFeed.querySelectorAll(".bubble-row"));
    if (!rows.length) {
      state.pendingMedia = [];
      if (mediaInput) {
        mediaInput.value = "";
      }
      renderPendingMedia();
      state.messages = [];
      saveStoredMessages();
      renderChat();
      showToast("Chat cleared", 1400);
      return;
    }

    state.clearingChat = true;
    setSending(state.sending);

    rows.forEach((row, index) => {
      const delay = Math.min(index * 18, 180);
      row.style.animationDelay = `${delay}ms`;
      row.classList.add("bubble-row-exit");
    });

    const clearDelayMs = 280 + Math.min(rows.length * 18, 180);
    window.setTimeout(() => {
      state.pendingMedia = [];
      if (mediaInput) {
        mediaInput.value = "";
      }
      renderPendingMedia();
      state.messages = [];
      saveStoredMessages();
      renderChat();
      state.clearingChat = false;
      setSending(state.sending);
      showToast("Chat cleared", 1400);
    }, clearDelayMs);
  });

  btnPing.addEventListener("click", async () => {
    await refreshStatus();
    showToast("Server status refreshed", 1400);
  });

  messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });

  if (modelSelect) {
    modelSelect.addEventListener("change", async () => {
      if (state.sending || state.clearingChat || state.switchingModel) return;

      const nextModel = (modelSelect.value || "").trim();
      if (!nextModel) return;

      const previousModel = state.selectedModel;
      state.selectedModel = nextModel;
      if (state.models.includes(nextModel)) {
        state.selectedLocalModel = nextModel;
      }
      state.dashboard.lastModel = nextModel;
      const serverUrlForPref = normalizeServerUrl(
        serverUrlInput.value || state.settings.server_url,
      );
      setModelPrefForServer(serverUrlForPref, nextModel);

      if (
        state.managerEnabled &&
        nextModel &&
        nextModel !== state.activeModel
      ) {
        const ok = await switchManagedModel(nextModel);
        if (!ok) {
          state.selectedModel = previousModel;
          renderDashboard();
          return;
        }
        await refreshStatus();
      }

      renderDashboard();
      renderModelsList();
    });
  }
}

async function init() {
  initSidebar();
  bindChatActions();
  bindSettingsActions();
  bindAppSettingsActions();
  bindModelsActions();
  bindCommunityActions();
  bindHfBindingActions();
  window.addEventListener("beforeunload", () => {
    persistCurrentConversationSnapshot();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      persistCurrentConversationSnapshot();
    }
  });

  if (!dashboardTimer) {
    dashboardTimer = window.setInterval(renderDashboard, 1000);
  }
  if (!statusPollTimer) {
    statusPollTimer = window.setInterval(() => {
      if (state.switchingModel) return;
      refreshStatus({ silent: true });
    }, 6000);
  }

  try {
    const response = await fetch("/api/config");
    const config = await response.json();
    state.defaults = {
      server_url: normalizeServerUrl(config.server_url || state.defaults.server_url),
      max_tokens: Number.isFinite(config.max_tokens) ? clamp(config.max_tokens, 1, 16384) : state.defaults.max_tokens,
      temperature: Number.isFinite(config.temperature) ? clamp(config.temperature, 0, 2) : state.defaults.temperature,
    };
  } catch {
    // Keep local defaults when server config endpoint is unavailable.
  }

  const stored = loadStoredSettings();
  state.settings = stored || normalizeSettings({
    ...state.defaults,
    system_prompt: "",
  });

  state.messages = loadStoredMessages();
  try {
    localStorage.removeItem(CHAT_SESSIONS_KEY);
    localStorage.removeItem(CHAT_ACTIVE_ID_KEY);
  } catch {
    // Ignore storage errors.
  }
  langAnim.from = state.lang;
  langAnim.to = state.lang;
  langAnim.t = 1.0;
  applyLanguage();

  renderChat();
  renderPendingMedia();
  renderCommunityJob(null);
  renderCommunityResults();
  renderModelsList();
  renderDashboard();
  applySettingsToInputs();
  applyRuntimeConfigToInputs();
  setRuntimeControlsDisabled(true);
  updateDeleteModelButtonState();
  setCommunityJobActionButtons(null);
  setModelSelectLoading("(Detecting...)");
  await refreshStatus();
  await maybeShowFirstRunHfBinding();
  await refreshManagerRuntimeConfig({ silent: true });
  messageInput.focus();
}

init();
