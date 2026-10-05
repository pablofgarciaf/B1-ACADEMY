#!/usr/bin/env python3
"""
Genera las ilustraciones 2D de un módulo de Mi Aula con la API de Gemini.

- Lee los prompts de scripts/imagenes_mi_aula/<modulo>.json
- Lee GEMINI_API_KEY de .env.local (la clave nunca se imprime)
- Guarda WebP en public/images/mi-aula/<modulo>/ + manifest.json (ancho, alto, alt)
- Es reanudable: salta las imágenes ya generadas (usa --force para rehacerlas)

Uso (desde la raíz del repo):
  py -3 scripts/generar_imagenes_mi_aula.py --module m01 --list-models
  py -3 scripts/generar_imagenes_mi_aula.py --module m01 --only m01c01_01_islas_vs_integrado
  py -3 scripts/generar_imagenes_mi_aula.py --module m01
"""
import argparse
import base64
import io
import json
import re
import sys
import time
import urllib.error
import urllib.request
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
        sys.exit("No existe .env.local")
    for line in env.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^GEMINI_API_KEY=(.*)$", line.strip())
        if m:
            key = m.group(1).strip().strip('"').strip("'")
            if key:
                return key
    sys.exit("GEMINI_API_KEY no está definida en .env.local")


def http_json(url: str, payload=None, timeout=120):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.load(r)


def list_models(key: str):
    d = http_json(f"{API}/models?pageSize=200&key={key}")
    for m in d.get("models", []):
        if "image" in m["name"] or "imagen" in m["name"]:
            print(m["name"], m.get("supportedGenerationMethods"))


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
            raise RuntimeError("La respuesta no trajo imagen (¿filtro de seguridad?)")
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", "ignore")[:300]
            if e.code == 400 and payload is with_ratio and "imageConfig" in body:
                payload = base  # el modelo no acepta aspectRatio: reintentar sin él
                continue
            if e.code in (429, 500, 503) and attempt < retries:
                wait = 2 ** attempt * 3
                print(f"    HTTP {e.code}, reintento {attempt}/{retries} en {wait}s")
                time.sleep(wait)
                continue
            raise RuntimeError(f"HTTP {e.code}: {body}")
    raise RuntimeError("Sin respuesta tras reintentos")


def to_webp(raw: bytes, path: Path, max_w=1600):
    img = Image.open(io.BytesIO(raw)).convert("RGB")
    if img.width > max_w:
        img = img.resize((max_w, round(img.height * max_w / img.width)), Image.LANCZOS)
    img.save(path, "WEBP", quality=82, method=6)
    return img.width, img.height


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--module", default="m01")
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--only", help="id de una sola imagen")
    ap.add_argument("--delay", type=float, default=4.0, help="segundos entre llamadas")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--list-models", action="store_true")
    a = ap.parse_args()

    key = load_key()
    if a.list_models:
        return list_models(key)

    spec = json.loads((ROOT / f"scripts/imagenes_mi_aula/{a.module}.json").read_text(encoding="utf-8"))
    out_dir = ROOT / f"public/images/mi-aula/{a.module}"
    out_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = out_dir / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.exists() else {}

    items = [i for i in spec["images"] if not a.only or i["id"] == a.only]
    ok = fail = skip = 0
    for n, it in enumerate(items, 1):
        dest = out_dir / f"{it['id']}.webp"
        if dest.exists() and not a.force:
            skip += 1
            continue
        print(f"[{n}/{len(items)}] {it['id']} ...", flush=True)
        try:
            raw = generate(key, a.model, it["prompt"])
            w, h = to_webp(raw, dest)
            manifest[it["id"]] = {"file": f"/images/mi-aula/{a.module}/{it['id']}.webp",
                                  "width": w, "height": h, "alt": it["alt"], "class": it["class"],
                                  "model": a.model}
            manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
            ok += 1
            print(f"    OK {w}x{h}")
        except Exception as e:
            fail += 1
            print(f"    FALLÓ: {e}")
        time.sleep(a.delay)
    print(f"\nResumen: {ok} generadas, {skip} ya existían, {fail} fallaron. Carpeta: {out_dir}")


if __name__ == "__main__":
    main()
