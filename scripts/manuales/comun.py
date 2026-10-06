"""Utilidades compartidas del pipeline de manuales (guion → láminas → video)."""
import json
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parents[2]
MANUALES = ROOT / "public" / "Capacitacion SAP"
DATA = Path(__file__).resolve().parent / "data"
TRABAJO = ROOT / "scratch" / "manuales_es"  # temporales fuera de public/

LAYOUTS = ["portada", "objetivos", "concepto", "flujo", "comparacion", "pantalla", "asiento", "tabla", "kpi", "resumen"]

# Íconos permitidos (todos existen en lucide 0.475). El modelo solo puede elegir de esta lista.
ICONOS = [
    "building-2", "warehouse", "package", "boxes", "truck", "shopping-cart", "shopping-bag", "receipt", "file-text",
    "file-check", "files", "clipboard-list", "clipboard-check", "calculator", "coins", "banknote", "credit-card",
    "wallet", "landmark", "piggy-bank", "chart-bar", "chart-line", "chart-pie", "trending-up", "trending-down", "users",
    "user", "user-check", "handshake", "briefcase", "factory", "cog", "settings", "sliders-horizontal", "wrench",
    "database", "server", "cloud", "monitor", "laptop", "smartphone", "search", "filter", "list-checks", "circle-check",
    "triangle-alert", "bell", "mail", "calendar", "clock", "timer", "scale", "layers", "layout-dashboard", "git-branch",
    "workflow", "arrow-left-right", "refresh-cw", "repeat", "tag", "tags", "percent", "barcode", "scan-line", "map-pin",
    "globe", "lock", "shield-check", "key-round", "book-open", "graduation-cap", "lightbulb", "target", "award",
    "printer", "upload", "download", "file-spreadsheet", "network", "hammer", "package-check", "package-open",
    "clipboard-pen", "notebook-pen", "badge-dollar-sign", "hand-coins", "receipt-text", "archive", "folder-open",
]


def cargar_env():
    env = {}
    for line in (ROOT / ".env.local").read_text(encoding="utf-8-sig").splitlines():
        m = re.match(r"^([A-Z0-9_]+)=(.*)$", line.strip())
        if m:
            env[m.group(1)] = m.group(2).strip().strip('"').strip("'")
    return env


def _post(url, payload, headers, timeout):
    req = urllib.request.Request(url, data=json.dumps(payload).encode(), headers={"Content-Type": "application/json", **headers})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.load(r)


def extraer_json(texto):
    texto = re.sub(r"<think>[\s\S]*?</think>", "", texto)
    m = re.search(r"\{[\s\S]*\}", texto)
    if not m:
        raise ValueError("respuesta sin JSON")
    return json.loads(m.group(0))


def llm_json(system, user, env, max_tokens=8000):
    """NVIDIA (Nemotron) primero; si falla, Gemini. Devuelve (dict, proveedor)."""
    fallas = []
    if env.get("NVIDIA_API_KEY"):
        modelo = env.get("NVIDIA_EXAM_MODEL") or "nvidia/nemotron-3-super-120b-a12b"
        for intento in range(2):
            try:
                d = _post("https://integrate.api.nvidia.com/v1/chat/completions", {
                    "model": modelo, "temperature": 0.3, "max_tokens": max_tokens,
                    # Sin razonamiento: con él, Nemotron agota los tokens pensando y devuelve contenido vacío.
                    "chat_template_kwargs": {"enable_thinking": False},
                    "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
                }, {"Authorization": f"Bearer {env['NVIDIA_API_KEY']}"}, 240)
                return extraer_json(d["choices"][0]["message"]["content"]), f"nvidia:{modelo}"
            except Exception as e:  # noqa: BLE001
                fallas.append(f"nvidia#{intento + 1}: {e}")
                time.sleep(4)
    if env.get("GEMINI_API_KEY"):
        for intento in range(3):
            try:
                d = _post(f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={env['GEMINI_API_KEY']}", {
                    "systemInstruction": {"parts": [{"text": system}]},
                    "contents": [{"role": "user", "parts": [{"text": user}]}],
                    "generationConfig": {"temperature": 0.3, "responseMimeType": "application/json", "maxOutputTokens": max_tokens * 2},
                }, {}, 240)
                return extraer_json("".join(p.get("text", "") for p in d["candidates"][0]["content"]["parts"])), "gemini"
            except urllib.error.HTTPError as e:
                fallas.append(f"gemini#{intento + 1}: HTTP {e.code}")
                time.sleep(10 * (intento + 1))
            except Exception as e:  # noqa: BLE001
                fallas.append(f"gemini#{intento + 1}: {e}")
                time.sleep(5)
    raise RuntimeError(" | ".join(fallas) or "sin llaves de IA")


def manuales(filtro=None):
    def clave(p):
        return [int(x) if x.isdigit() else x for x in re.split(r"(\d+)", p.name)]
    for d in sorted((p for p in MANUALES.iterdir() if p.is_dir()), key=clave):
        if filtro and not any(d.name.startswith(f) for f in filtro):
            continue
        yield d
