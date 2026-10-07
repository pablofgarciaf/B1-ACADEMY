#!/usr/bin/env python3
"""
Catálogo de rutas REALES del menú de SAP Business One, extraídas de los 120 manuales del curso
(traducciones de los cursos oficiales). El generador de clases solo puede usar estas rutas en las prácticas:
antes el modelo inventaba menús que no existen ("Maestros de datos > Artículos > A00003").

Salida: scripts/aula/fuentes/menu_sap.json  →  { "por_manual": {manual: [rutas]}, "todas": [rutas] }
  py -3 scripts/aula/construir_menu_sap.py
"""
import glob
import json
import re
import sys
import unicodedata
from collections import Counter
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[2]
SALIDA = Path(__file__).parent / "fuentes" / "menu_sap.json"

# Primer nivel del menú principal de SAP Business One 10.0 (y sus nombres alternativos en los manuales).
MODULOS = [
    "Gestión", "Administración", "Finanzas", "Oportunidades", "CRM", "Ventas - Clientes", "Ventas", "Compras - Proveedores",
    "Compras", "Socios de negocios", "Interlocutores comerciales", "Gestión de bancos", "Inventario", "Recursos",
    "Producción", "Planificación de necesidades", "MRP", "Servicio", "Recursos humanos", "Proyectos", "Informes", "Herramientas",
]
SEP = r"\s*(?:→|>|›|➔|->|- >)\s*"
# Un segmento llega hasta el siguiente separador o el final de la frase (puntuación o salto de línea).
SEGMENTO = r"[A-ZÁÉÍÓÚÑa-záéíóúñ][^\n>→›➔.;:,()\"'“”]{1,60}"


def plano(t):
    return "".join(c for c in unicodedata.normalize("NFD", t.lower()) if unicodedata.category(c) != "Mn").strip()


MOD_PLANO = {plano(m) for m in MODULOS}


def limpiar(ruta):
    partes = [p.strip(" .,:;)(\"'") for p in re.split(SEP, ruta)]
    partes = [p for p in partes if p]
    # La ruta debe empezar en un módulo del menú principal y tener al menos "Módulo > Ventana".
    while partes and plano(partes[0]) not in MOD_PLANO:
        partes.pop(0)
    if len(partes) < 2 or any(len(p) > 60 or len(p.split()) > 7 for p in partes):
        return None
    # "MRP > Compras > Producción" describe un flujo entre módulos, no un menú: una ruta real tiene un solo módulo raíz.
    if sum(plano(p) in MOD_PLANO for p in partes[1:]) and plano(partes[0]) not in {"gestion", "administracion"}:
        return None
    return " > ".join(partes)


def main():
    por_manual, todas = {}, Counter()
    patron = re.compile(rf"((?:{SEGMENTO}{SEP}){{1,5}}{SEGMENTO})")
    for carpeta in sorted(glob.glob(str(ROOT / "public" / "Capacitacion SAP" / "*"))):
        rutas = Counter()
        for f in glob.glob(f"{carpeta}/*.md") + glob.glob(f"{carpeta}/clase_sync.json"):
            texto = Path(f).read_text(encoding="utf-8", errors="ignore")
            for m in patron.finditer(texto):
                r = limpiar(m.group(1))
                if r:
                    rutas[r] += 1
        if rutas:
            por_manual[Path(carpeta).name] = sorted(rutas)
            todas.update(rutas)
    SALIDA.write_text(json.dumps({"por_manual": por_manual, "todas": sorted(todas)}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"Rutas reales: {len(todas)} · manuales con rutas: {len(por_manual)}/120 → {SALIDA.name}")
    for r, n in todas.most_common(12):
        print(f"  {n:>2} · {r}")


if __name__ == "__main__":
    main()
