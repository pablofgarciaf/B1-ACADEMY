"""Control de calidad de Mi Aula: cada clase y cada práctica deben ser completas y resolubles."""
import json
import sys
import unicodedata
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[2]
lecciones = json.loads((ROOT / "src/content/aula/lecciones.json").read_text(encoding="utf-8"))
temario = json.loads((ROOT / "src/content/aula/clases.json").read_text(encoding="utf-8"))


def plano(t):
    t = unicodedata.normalize("NFD", str(t).lower())
    return "".join(c for c in t if unicodedata.category(c) != "Mn" and c.isalnum())


problemas, practicas, campos_total = [], 0, 0
for cid, lec in lecciones.items():
    if len(lec["images"]) != len(lec["syncData"]):
        problemas.append(f"{cid}: {len(lec['images'])} imágenes ≠ {len(lec['syncData'])} narraciones")
    for img in lec["images"]:
        if not (ROOT / "public" / img.lstrip("/")).exists():
            problemas.append(f"{cid}: falta {img}")
    for s in lec["syncData"]:
        if len(s["script_text"].split()) < 30:
            problemas.append(f"{cid} lámina {s['slide_index']}: narración corta")
        g = s.get("step_guide")
        if not g:
            continue
        practicas += 1
        ruta = [p for p in g["menu_path"].split(">") if p.strip()]
        if len(ruta) < 2:
            problemas.append(f"{cid} '{g['title']}': ruta de menú corta ({g['menu_path']!r})")
        etiquetas = [c["etiqueta"] for c in g["campos"]]
        if len(set(map(plano, etiquetas))) != len(etiquetas):
            problemas.append(f"{cid} '{g['title']}': campos repetidos {etiquetas}")
        visible = plano(" ".join(g["instructions"]) + s["script_text"])
        for c in g["campos"]:
            campos_total += 1
            if plano(c["valor"]) not in visible:
                problemas.append(f"{cid} '{g['title']}': el valor de '{c['etiqueta']}' no se le indica al estudiante")
    if not any(s.get("step_guide") for s in lec["syncData"]):
        problemas.append(f"{cid}: sin prácticas")

clases = sum(len(v) for v in temario.values())
print(f"Módulos: {len(temario)} · Clases: {clases} · Prácticas evaluadas: {practicas} · Campos a validar: {campos_total}")
print(f"Problemas: {len(problemas)}")
for p in problemas[:40]:
    print("  -", p)
