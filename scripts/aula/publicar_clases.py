#!/usr/bin/env python3
"""
Publica las clases de Mi Aula generadas en scratch/aula_es/<id>/clase.json:
- Láminas 1920x1080 (mismo diseño que los manuales) → public/aula/<id>/Slide_NNN.webp
- src/content/aula/lecciones.json → contenido que sirve /api/lesson-data (narración + prácticas evaluadas)
- src/content/aula/clases.json    → temario por módulo que usa curriculum-data

  py -3 scripts/aula/publicar_clases.py            # renderiza solo lo nuevo
  py -3 scripts/aula/publicar_clases.py --force    # vuelve a renderizar todo
"""
import argparse
import io
import json
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "manuales"))
from comun import ROOT  # noqa: E402
from paso2_laminas import html_lamina  # noqa: E402

PLAN = json.loads((Path(__file__).parent / "plan.json").read_text(encoding="utf-8"))
ORIGEN = ROOT / "scratch" / "aula_es"
DESTINO = ROOT / "public" / "aula"
CONTENIDO = ROOT / "src" / "content" / "aula"


def step_guide(practica):
    return {
        "action_type": "practica",
        "title": practica.get("titulo", "Práctica"),
        "menu_path": practica.get("menu_path", ""),
        "instructions": practica.get("instrucciones", []),
        "campos": [{"etiqueta": c["etiqueta"], "valor": str(c["valor"]), "pista": c.get("pista", "")}
                   for c in practica.get("campos", [])],
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true")
    a = ap.parse_args()
    lecciones, temario, faltan = {}, {}, []
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        for modulo in PLAN["modulos"]:
            temario[modulo["id"]] = []
            for n, clase in enumerate(modulo["clases"], 1):
                fuente = ORIGEN / clase["id"] / "clase.json"
                if not fuente.exists():
                    faltan.append(clase["id"])
                    continue
                datos = json.loads(fuente.read_text(encoding="utf-8"))
                lam = datos["laminas"]
                carpeta = DESTINO / clase["id"]
                carpeta.mkdir(parents=True, exist_ok=True)
                imagenes, sync, palabras = [], [], 0
                for i, L in enumerate(lam, 1):
                    archivo = carpeta / f"Slide_{i:03d}.webp"
                    if a.force or not archivo.exists():
                        page.set_content(html_lamina(L, {"n": i, "total": len(lam), "manual": modulo["titulo"]}))
                        Image.open(io.BytesIO(page.screenshot(type="png"))).convert("RGB").save(archivo, "WEBP", quality=86, method=6)
                    imagenes.append(f"/aula/{clase['id']}/{archivo.name}")
                    item = {"slide_index": i, "script_text": L["narracion"].strip(),
                            "step_guide": step_guide(L["practica"]) if isinstance(L.get("practica"), dict) else None}
                    sync.append(item)
                    palabras += len(L["narracion"].split())
                practicas = sum(1 for s in sync if s["step_guide"])
                lecciones[clase["id"]] = {"images": imagenes, "syncData": sync, "quizQuestions": []}
                temario[modulo["id"]].append({
                    "id": clase["id"], "number": n, "title": clase["titulo"], "description": "",
                    # ~150 palabras por minuto de narración + ~4 min por práctica en el simulador
                    "durationMinutes": round(palabras / 150 + practicas * 4),
                })
                print(f"✓ {clase['id']}: {len(lam)} láminas, {practicas} prácticas", flush=True)
        browser.close()
    CONTENIDO.mkdir(parents=True, exist_ok=True)
    (CONTENIDO / "lecciones.json").write_text(json.dumps(lecciones, ensure_ascii=False), encoding="utf-8")
    (CONTENIDO / "clases.json").write_text(json.dumps(temario, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\nPublicadas: {len(lecciones)} clases · Pendientes: {faltan}")


if __name__ == "__main__":
    main()
