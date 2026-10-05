#!/usr/bin/env python3
import json
import base64
import io
import re
import time
import urllib.request
import urllib.error
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
API = "https://generativelanguage.googleapis.com/v1beta"
DEFAULT_MODEL = "gemini-3.1-flash-image"

STYLE = (
    "Flat 2D vector illustration, minimal corporate editorial style, solid flat colors, "
    "clean geometric shapes, soft light-gray background (#F4F6FA), palette of navy blue (#0B3D91), "
    "sky blue (#4C9BE8), amber (#F5A623) and white, subtle drop shadows only, generous white space, "
    "wide 16:9 composition, centered subject. STRICTLY NO TEXT: no letters, no words, no numbers, "
    "no logos, no watermark. Not 3D, not photorealistic, no gradients-heavy rendering."
)

def load_key() -> str:
    env = ROOT / ".env.local"
    if not env.exists():
        raise RuntimeError("No existe .env.local")
    for line in env.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^GEMINI_API_KEY=(.*)$", line.strip())
        if m:
            key = m.group(1).strip().strip('"').strip("'")
            if key:
                return key
    raise RuntimeError("GEMINI_API_KEY no está definida en .env.local")

def http_json(url: str, payload=None, timeout=120):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.load(r)

def generate(key: str, model: str, prompt: str, retries=5) -> bytes:
    url = f"{API}/models/{model}:generateContent?key={key}"
    base = {
        "contents": [{"parts": [{"text": f"{prompt}\n\n{STYLE}"}]}],
        "generationConfig": {"responseModalities": ["IMAGE"]},
    }
    with_ratio = json.loads(json.dumps(base))
    with_ratio["generationConfig"]["imageConfig"] = {"aspectRatio": "16:9"}
    payload = with_ratio
    for attempt in range(1, retries + 1):
        try:
            d = http_json(url, payload)
            for cand in d.get("candidates", []):
                for part in cand.get("content", {}).get("parts", []):
                    inline = part.get("inlineData") or part.get("inline_data")
                    if inline and inline.get("data"):
                        return base64.b64decode(inline["data"])
            raise RuntimeError("La respuesta no trajo imagen")
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", "ignore")[:300]
            if e.code == 400 and payload is with_ratio and "imageConfig" in body:
                payload = base
                continue
            if e.code in (429, 500, 503) and attempt < retries:
                time.sleep(2 ** attempt * 3)
                continue
            raise RuntimeError(f"HTTP {e.code}: {body}")
    raise RuntimeError("Sin respuesta tras reintentos")

def to_webp(raw: bytes, path: Path):
    img = Image.open(io.BytesIO(raw)).convert("RGB")
    # Redimensionamos a un tamaño amigable para inyectar, 1920 es el maximo de slide
    img.save(path, "WEBP", quality=85, method=6)

def main():
    try:
        key = load_key()
    except Exception as e:
        print(f"ERROR: {e}")
        return

    aula_dir = ROOT / "public" / "Aula_SAP"
    
    # Busca todos los leccion.json
    for leccion_path in aula_dir.rglob("leccion.json"):
        leccion_dir = leccion_path.parent
        data = json.loads(leccion_path.read_text(encoding="utf-8"))
        
        for bloque in data.get("bloques", []):
            for diap in bloque.get("diapositivas", []):
                ilu_path_rel = diap.get("ilustracion")
                if ilu_path_rel:
                    ilu_path = leccion_dir / ilu_path_rel
                    if ilu_path.exists():
                        continue
                    
                    print(f"Generando {ilu_path.name}...")
                    prompt = f"Abstract illustration for SAP concept: {diap.get('titulo_en_pantalla')}. " + " ".join(diap.get("puntos_en_pantalla", []))
                    try:
                        raw = generate(key, DEFAULT_MODEL, prompt)
                        ilu_path.parent.mkdir(parents=True, exist_ok=True)
                        to_webp(raw, ilu_path)
                        print(f" -> OK")
                    except Exception as e:
                        print(f" -> ERROR: {e}")
                    
                    time.sleep(4)

if __name__ == "__main__":
    main()
