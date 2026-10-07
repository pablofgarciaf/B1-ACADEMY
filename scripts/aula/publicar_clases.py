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


def _plano(texto):
    import unicodedata
    t = unicodedata.normalize("NFD", str(texto).lower())
    return "".join(c for c in t if unicodedata.category(c) != "Mn" and c.isalnum())


def _etiquetas_unicas(campos):
    """Documentos con varias líneas (asientos, grupos de UdM): 'Debe', 'Debe (línea 2)'..."""
    vistos = {}
    for c in campos:
        k = _plano(c["etiqueta"])
        vistos[k] = vistos.get(k, 0) + 1
        if vistos[k] > 1:
            c["etiqueta"] = f"{c['etiqueta']} (línea {vistos[k]})"
    return campos


def step_guide(practica, narracion=""):
    """Toda práctica debe poder resolverse: si un valor a escribir no aparece en las instrucciones
    ni en la narración, se agrega en una línea 'Datos a registrar'."""
    instrucciones = [str(i) for i in practica.get("instrucciones", [])]
    visible = _plano(" ".join(instrucciones) + " " + narracion)
    faltan = [c for c in practica.get("campos", []) if _plano(c["valor"]) and _plano(c["valor"]) not in visible]
    if faltan:
        instrucciones.append("Datos a registrar: " + "; ".join(f"{c['etiqueta']} = {c['valor']}" for c in faltan) + ".")
    return {
        "action_type": "practica",
        "title": practica.get("titulo", "Práctica"),
        "menu_path": practica.get("menu_path", ""),
        "instructions": instrucciones,
        "campos": _etiquetas_unicas([{"etiqueta": c["etiqueta"], "valor": str(c["valor"]), "pista": c.get("pista", "")}
                                     for c in practica.get("campos", [])]),
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--only", nargs="*", help="Rehace solo estas clases aunque ya estén publicadas")
    a = ap.parse_args()
    # Lo ya publicado se conserva tal cual: una clase publicada solo se reemplaza si se pide con --only.
    # (Antes el archivo se reconstruía solo desde scratch/ y se perdían las clases sin borrador.)
    previas = json.loads((CONTENIDO / "lecciones.json").read_text(encoding="utf-8")) if (CONTENIDO / "lecciones.json").exists() else {}
    temario_previo = json.loads((CONTENIDO / "clases.json").read_text(encoding="utf-8")) if (CONTENIDO / "clases.json").exists() else {}
    duracion_previa = {c["id"]: c["durationMinutes"] for cs in temario_previo.values() for c in cs}
    lecciones, temario, faltan = {}, {}, []
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        for modulo in PLAN["modulos"]:
            temario[modulo["id"]] = []
            for n, clase in enumerate(modulo["clases"], 1):
                fuente = ORIGEN / clase["id"] / "clase.json"
                if clase["id"] in previas and not (a.only and clase["id"] in a.only):
                    lecciones[clase["id"]] = previas[clase["id"]]
                    temario[modulo["id"]].append({"id": clase["id"], "number": n, "title": clase["titulo"], "description": "",
                                                  "durationMinutes": duracion_previa.get(clase["id"], 20)})
                    continue
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
                    # Una clase rehecha con --only también rehace sus láminas: si no, quedaría la imagen vieja con la narración nueva.
                    if a.force or not archivo.exists() or (a.only and clase["id"] in a.only):
                        page.set_content(html_lamina(L, {"n": i, "total": len(lam), "manual": modulo["titulo"]}))
                        Image.open(io.BytesIO(page.screenshot(type="png"))).convert("RGB").save(archivo, "WEBP", quality=86, method=6)
                    imagenes.append(f"/aula/{clase['id']}/{archivo.name}")
                    item = {"slide_index": i, "script_text": L["narracion"].strip(),
                            "step_guide": step_guide(L["practica"], L.get("narracion", "")) if isinstance(L.get("practica"), dict) else None}
                    sync.append(item)
                    palabras += len(L["narracion"].split())
                # Si la clase rehecha tiene menos láminas que antes, se borran las sobrantes de la versión anterior.
                for sobrante in carpeta.glob("Slide_*.webp"):
                    if sobrante.name not in {Path(u).name for u in imagenes}:
                        sobrante.unlink()
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
