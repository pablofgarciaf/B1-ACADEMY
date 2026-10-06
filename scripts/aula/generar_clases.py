#!/usr/bin/env python3
"""
Genera las clases de Mi Aula (escuela con práctica integrada) a partir de plan.json y los manuales en español.
Cada clase: portada → objetivos → teoría → PRÁCTICA 1 → explicación → PRÁCTICA 2 → resumen.
Las prácticas traen los campos y valores exactos que el simulador evaluará.

Salida: scratch/aula_es/<claseId>/clase.json (reanudable; --force para rehacer)
  py -3 scripts/aula/generar_clases.py --only mod10-c1
  py -3 scripts/aula/generar_clases.py --workers 4
"""
import argparse
import json
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "manuales"))
from comun import ICONOS, ROOT, cargar_env, llm_json  # noqa: E402

PLAN = json.loads((Path(__file__).parent / "plan.json").read_text(encoding="utf-8"))
SALIDA = ROOT / "scratch" / "aula_es"
MANUALES = ROOT / "public" / "Capacitacion SAP"
EMPRESA = (ROOT / "public" / "Aula_SAP" / "_global" / "empresa_ficticia.json").read_text(encoding="utf-8")

LAYOUTS = ["portada", "objetivos", "concepto", "flujo", "comparacion", "pantalla", "asiento", "tabla", "kpi", "resumen"]

SYSTEM = f"""Eres el diseñador instruccional jefe de SAP Academy Ecuador. Diseñas UNA clase de una escuela de SAP Business One
con práctica integrada en un simulador. Español neutro latinoamericano, tuteo cercano y profesional.

La clase sigue SIEMPRE este orden (entre 12 y 16 láminas):
1. portada  2. objetivos  3-6. teoría (concepto / flujo / comparacion / tabla / asiento / kpi): qué es y para qué sirve en una empresa real
7. PRÁCTICA 1   8-9. explicación de lo que ocurrió en el sistema (impacto, asiento o informe resultante)
10. PRÁCTICA 2 (un paso más difícil o el documento siguiente del proceso)   11-12. errores comunes / buenas prácticas   13. resumen

Cada lámina es un objeto con:
- "layout": uno de {LAYOUTS}
- "titulo": máximo 6 palabras.
- "claves": 3 a 5 palabras clave (1 a 4 palabras cada una). Nunca oraciones.
- "icono": uno de esta lista exacta: {ICONOS}
- datos del diagrama según layout (cadenas cortas):
  flujo → "pasos": [{{"texto","icono"}}] (3-6) · comparacion → "columnas": 2 x {{"titulo","icono","puntos":[2-3]}}
  pantalla → "ventana", "campos": [{{"etiqueta","valor"}}] (4-6), "resaltar": índice
  asiento → "lineas": [{{"cuenta","debe","haber"}}] cuadrado · tabla → "tabla": {{"encabezados","filas"}} · kpi → "kpis": 3 x {{"valor","etiqueta","icono"}}
- "narracion": 60 a 110 palabras que EXPLICAN la lámina (qué es, para qué sirve, cómo se hace en SAP). Sin "en esta diapositiva".
  Números como se pronuncian. Basada en el contenido técnico recibido: no inventes funciones de SAP.

LAS DOS PRÁCTICAS usan layout "pantalla" y además llevan:
"practica": {{
  "titulo": "verbo + objeto, máx 6 palabras",
  "menu_path": "Módulo > Submenú > Ventana (ruta real de SAP Business One)",
  "instrucciones": [3 a 5 pasos cortos y concretos],
  "campos": [3 a 6 objetos {{"etiqueta": "nombre del campo en SAP", "valor": "valor EXACTO a escribir", "pista": "ayuda breve sin dar la respuesta"}}]
}}
- Los valores son datos cortos y verificables (códigos, cantidades, precios, fechas DD/MM/2026, nombres de la empresa ficticia), máximo 40 caracteres.
- Usa SOLO clientes, proveedores, artículos, bodegas y bancos de la empresa ficticia (abajo). IVA 15 %.
- Los "campos" de la lámina pantalla muestran los mismos valores que la práctica.
- La "narracion" de una práctica presenta la misión (qué vas a hacer y por qué), 50 a 90 palabras.

EMPRESA FICTICIA: {EMPRESA}

Responde SOLO con JSON: {{"laminas": [ ... ]}}"""


def conocimiento(clase):
    partes = []
    for m in clase["manuales"]:
        p = MANUALES / m / "clase_sync.json"
        sync = json.loads(p.read_text(encoding="utf-8"))
        partes.append(f"## Manual {m}\n" + "\n".join(f"- {s['script_text']}" for s in sync))
    return "\n\n".join(partes)[:16000]


def valida(datos):
    lam = [x for x in datos.get("laminas", []) if isinstance(x, dict)]
    if not 11 <= len(lam) <= 18:
        return None, f"{len(lam)} láminas"
    practicas = [x for x in lam if isinstance(x.get("practica"), dict)]
    if not 2 <= len(practicas) <= 4:  # mínimo 2 prácticas; hasta 4 es bienvenido (más práctica)
        return None, f"{len(practicas)} prácticas"
    for p in practicas:
        campos = p["practica"].get("campos") or []
        if not 3 <= len(campos) <= 6 or any(not str(c.get("valor", "")).strip() or len(str(c["valor"])) > 40 for c in campos):
            return None, "campos de práctica inválidos"
        if not p["practica"].get("instrucciones"):
            return None, "práctica sin instrucciones"
    for x in lam:
        if len((x.get("narracion") or "").split()) < 30:
            return None, "narración corta"
    return lam, "ok"


def generar(modulo, clase, env):
    out = SALIDA / clase["id"] / "clase.json"
    entrada = json.dumps({"modulo": modulo["titulo"], "clase": clase["titulo"], "contenido_tecnico": conocimiento(clase)}, ensure_ascii=False)
    motivo = ""
    for _ in range(3):
        datos, prov = llm_json(SYSTEM, entrada, env, max_tokens=14000)
        lam, motivo = valida(datos)
        if lam:
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(json.dumps({"id": clase["id"], "modulo": modulo["id"], "titulo": clase["titulo"],
                                       "laminas": lam}, ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"✓ {clase['id']} {clase['titulo']}: {len(lam)} láminas ({prov})", flush=True)
            return
    raise RuntimeError(f"{clase['id']}: {motivo}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="*")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--workers", type=int, default=4)
    a = ap.parse_args()
    env = cargar_env()
    tareas = [(m, c) for m in PLAN["modulos"] for c in m["clases"]
              if (not a.only or c["id"] in a.only) and (a.force or not (SALIDA / c["id"] / "clase.json").exists())]
    print(f"Clases por generar: {len(tareas)}", flush=True)
    fallos = []
    with ThreadPoolExecutor(max_workers=a.workers) as pool:
        fut = {pool.submit(generar, m, c, env): c["id"] for m, c in tareas}
        for f in as_completed(fut):
            try:
                f.result()
            except Exception as e:  # noqa: BLE001
                fallos.append(fut[f])
                print(f"✗ {fut[f]}: {e}", flush=True)
    print(f"Listo. Fallidas: {fallos}", flush=True)


if __name__ == "__main__":
    main()
