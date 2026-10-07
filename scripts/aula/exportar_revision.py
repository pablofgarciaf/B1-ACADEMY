#!/usr/bin/env python3
"""
Exporta lo que debe revisar un consultor SAP y un contador (sin gastar tokens):
  docs/revision/practicas_sap.csv      una fila por práctica: clase, título, ruta de menú de SAP, campos y valores
  docs/revision/rutas_unicas.csv       cada ruta de menú distinta, con cuántas prácticas la usan
  docs/revision/asientos_y_cifras.csv  cada asiento contable publicado con sus líneas y totales

  py scripts/aula/exportar_revision.py
Los CSV llevan BOM UTF-8 para abrirse bien en Excel.
"""
import csv
import json
import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SALIDA = ROOT / "docs" / "revision"
LECCIONES = json.loads((ROOT / "src" / "content" / "aula" / "lecciones.json").read_text(encoding="utf-8"))
CLASES = json.loads((ROOT / "src" / "content" / "aula" / "clases.json").read_text(encoding="utf-8"))
BORRADORES = ROOT / "scratch" / "aula_es"

titulo_clase = {c["id"]: c.get("title") or c.get("titulo", "") for mod in CLASES.values() for c in mod}


def escribir(nombre, cabecera, filas):
    SALIDA.mkdir(parents=True, exist_ok=True)
    with open(SALIDA / nombre, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(cabecera)
        w.writerows(filas)
    print(f"{nombre}: {len(filas)} filas")


def clave_orden(cid):
    m = re.match(r"mod(\d+)-c(\d+)", cid)
    return (int(m.group(1)), int(m.group(2))) if m else (999, 0)


practicas, rutas, por_ruta = [], Counter(), defaultdict(set)
for cid in sorted(LECCIONES, key=clave_orden):
    for i, s in enumerate(LECCIONES[cid]["syncData"], 1):
        g = s.get("step_guide")
        if not g:
            continue
        campos = "; ".join(f"{c['etiqueta']} = {c['valor']}" for c in g.get("campos", []))
        practicas.append([cid, titulo_clase.get(cid, ""), i, g.get("title", ""), g.get("menu_path", ""), campos, "", ""])
        rutas[g.get("menu_path", "")] += 1
        por_ruta[g.get("menu_path", "")].add(cid)

escribir("practicas_sap.csv", ["Clase", "Título de la clase", "Lámina", "Práctica", "Ruta de menú en SAP B1", "Campos y valores", "¿Existe la ruta y el campo? (SAP)", "Observación"], practicas)
escribir("rutas_unicas.csv", ["Ruta de menú en SAP B1", "Prácticas que la usan", "Clases", "¿Existe en tu versión? (SAP)", "Observación"],
         [[r, n, ", ".join(sorted(por_ruta[r], key=clave_orden)), "", ""] for r, n in sorted(rutas.items())])

asientos = []
for f in sorted(BORRADORES.glob("*/clase.json"), key=lambda p: clave_orden(p.parent.name)):
    d = json.loads(f.read_text(encoding="utf-8"))
    for i, x in enumerate(d["laminas"], 1):
        a = x.get("asiento")
        lineas = x.get("lineas") or (a.get("lineas") if isinstance(a, dict) else a if isinstance(a, list) else None)
        if not lineas:
            continue
        def n(v):
            try:
                return float(str(v).replace(",", ""))
            except ValueError:
                return 0.0
        debe = sum(n(l.get("debe")) for l in lineas)
        haber = sum(n(l.get("haber")) for l in lineas)
        detalle = " | ".join(f"{l.get('cuenta')}: D {l.get('debe')} / H {l.get('haber')}" for l in lineas)
        asientos.append([f.parent.name, i, x.get("titulo", ""), detalle, f"{debe:.2f}", f"{haber:.2f}", "SÍ" if abs(debe - haber) < 0.01 else "NO", "", ""])
escribir("asientos_y_cifras.csv", ["Clase", "Lámina", "Asiento", "Líneas", "Total debe", "Total haber", "¿Cuadra?", "¿Correcto? (contador)", "Observación"], asientos)
