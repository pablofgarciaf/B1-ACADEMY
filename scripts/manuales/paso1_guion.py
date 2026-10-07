#!/usr/bin/env python3
"""
Paso 1 — Guion en español de cada manual (una entrada por lámina original).
Fuente: <manual>/*_slides.md (transcripción por diapositiva) o, si no existe, clase_sync.json.
Salida: scratch/manuales_es/<manual>/guion_es.json  (reanudable; --force para rehacer)

  py -3 scripts/manuales/paso1_guion.py --only 3.3
  py -3 scripts/manuales/paso1_guion.py            # los 120
"""
import argparse
import json
import re
from concurrent.futures import ThreadPoolExecutor, as_completed

from comun import ICONOS, LAYOUTS, TRABAJO, cargar_env, llm_json, manuales

LOTE = 6  # láminas por llamada: respuestas cortas = JSON completo y fiable

SYSTEM = f"""Eres diseñador instruccional senior de SAP Academy Ecuador (SAP Business One 10.0).
Conviertes cada diapositiva de un manual oficial en una lámina de video educativo en ESPAÑOL neutro latinoamericano.

Para CADA diapositiva de entrada devuelves un objeto con:
- "n": número de la diapositiva de entrada (igual al recibido).
- "layout": uno de {LAYOUTS}. Elige el que mejor EXPLIQUE el contenido:
  portada (solo la primera), objetivos (lista de objetivos), concepto (definición/idea),
  flujo (proceso o secuencia de pasos/documentos), comparacion (dos opciones, antes/después, A vs B),
  pantalla (cuando habla de una ventana/campos de SAP), asiento (impacto contable débito/crédito),
  tabla (datos tabulares, parámetros), kpi (cifras, informes, indicadores), resumen (cierre/conclusiones).
- "titulo": máximo 6 palabras, en español.
- "claves": 3 a 5 PALABRAS CLAVE de 1 a 4 palabras cada una. NUNCA oraciones.
- "icono": un ícono de esta lista exacta: {ICONOS}.
- Datos del diagrama SOLO según el layout (cadenas cortas, máx. 4 palabras cada una):
  flujo → "pasos": [{{"texto": "...", "icono": "..."}}] (3 a 6)
  comparacion → "columnas": [{{"titulo": "...", "icono": "...", "puntos": ["...", "..."]}}, {{...}}] (exactamente 2, 2-3 puntos)
  pantalla → "ventana": "nombre de la ventana SAP", "campos": [{{"etiqueta": "...", "valor": "..."}}] (4 a 7, valores realistas de la empresa ficticia B1 Center, Quito, USD, fechas de 2026), "resaltar": índice del campo clave
  asiento → "lineas": [{{"cuenta": "...", "debe": "1.150,00" o "", "haber": "" o "1.150,00"}}] (2 a 5, debe=haber)
  tabla → "tabla": {{"encabezados": [...], "filas": [[...], ...]}} (máx. 4 columnas, 5 filas)
  kpi → "kpis": [{{"valor": "...", "etiqueta": "...", "icono": "..."}}] (3)
  objetivos / resumen → usan "claves" como los puntos.
- "narracion": 60 a 110 palabras en español, tuteo cercano y profesional, que EXPLICA la lámina: qué es, para qué sirve en una empresa real y cómo se hace en SAP. Basada SOLO en el contenido de la diapositiva (no inventes funciones de SAP). Sin decir "en esta diapositiva". Números y siglas como se pronuncian ("quince por ciento", "IVA"). Si la fuente está en inglés, tradúcela.

- Si la diapositiva es un aviso legal, copyright, marcas registradas o "gracias", devuelve SOLO {{"n": ..., "omitir": true}}.

Responde SOLO con JSON: {{"laminas": [ ... ]}}"""

LEGAL = re.compile(r"aviso legal|copyright|derechos reservados|marcas registradas|trademark|all rights reserved", re.I)


def fuentes(manual_dir):
    """Texto fuente por lámina. El _slides.md (transcripción en español) solo se usa si cubre
    exactamente las mismas láminas que el video; si no (p. ej. es un resumen), se usa la narración original."""
    sync_p = manual_dir / "clase_sync.json"
    sync = json.loads(sync_p.read_text(encoding="utf-8")) if sync_p.exists() else []
    desde_sync = {s["slide_index"]: s.get("script_text", "") for s in sync}
    slides_md = next(manual_dir.glob("*_slides.md"), None)
    if slides_md:
        texto = slides_md.read_text(encoding="utf-8", errors="replace")
        partes = re.split(r"^##\s*Diapositiva\s+(\d+)\s*$", texto, flags=re.M)
        res = {int(partes[i]): partes[i + 1].replace("---", "").strip() for i in range(1, len(partes) - 1, 2)}
        if res and (not desde_sync or set(res) == set(desde_sync)):
            return res
    return desde_sync


def titulo_manual(nombre):
    return re.sub(r"^[\d\.]+_", "", nombre).replace("_", " ")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="*")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--workers", type=int, default=4)
    a = ap.parse_args()
    env = cargar_env()
    pendientes = [d for d in manuales(a.only) if a.force or not (TRABAJO / d.name / "guion_es.json").exists()]
    print(f"Manuales por procesar: {len(pendientes)}", flush=True)
    fallos = []
    with ThreadPoolExecutor(max_workers=a.workers) as pool:
        futuros = {pool.submit(procesar, d, env): d for d in pendientes}
        for f in as_completed(futuros):
            try:
                f.result()
            except Exception as e:  # noqa: BLE001 — un manual con error no detiene a los demás
                fallos.append(futuros[f].name)
                print(f"✗ {futuros[f].name}: {e}", flush=True)
    print(f"\nListo. Fallidos: {len(fallos)} {fallos}", flush=True)


def valida(L):
    """Una lámina usable: omitida explícitamente, o con título, claves y narración suficiente."""
    if L.get("omitir"):
        return True
    narr = (L.get("narracion") or "").split()
    return bool(L.get("titulo")) and bool(L.get("claves")) and len(narr) >= 35


def generar_lote(d, src, lote, env):
    entrada = {"manual": titulo_manual(d.name),
               "diapositivas": [{"n": n, "contenido": (src.get(n) or "")[:2500]} for n in lote]}
    ultimo = None
    for _ in range(3):
        datos, prov = llm_json(SYSTEM, json.dumps(entrada, ensure_ascii=False), env)
        recibidas = {x.get("n"): x for x in datos.get("laminas", []) if isinstance(x, dict)}
        faltan = [n for n in lote if n not in recibidas or not valida(recibidas[n])]
        if not faltan:
            return recibidas, prov
        ultimo = f"láminas incompletas {faltan}"
    raise RuntimeError(f"{d.name}: {ultimo}")


def procesar(d, env):
    out = TRABAJO / d.name / "guion_es.json"
    src = fuentes(d)
    sync = json.loads((d / "clase_sync.json").read_text(encoding="utf-8")) if (d / "clase_sync.json").exists() else []
    numeros = [s["slide_index"] for s in sync] or sorted(src)
    print(f"▶ {d.name}: {len(numeros)} láminas", flush=True)
    laminas = []
    for i in range(0, len(numeros), LOTE):
        lote = numeros[i:i + LOTE]
        recibidas, prov = generar_lote(d, src, lote, env)
        for n in lote:
            L = recibidas[n]
            # Avisos legales de SAP: no se narran ni se muestran.
            if L.get("omitir") or LEGAL.search(f"{L.get('titulo', '')} {' '.join(L.get('claves') or [])}") or LEGAL.search(src.get(n, "")[:200]):
                continue
            laminas.append(L)
    # Protección: solo se omiten avisos legales (1-3 láminas). Si faltan más, algo salió mal: no se guarda.
    if len(laminas) < len(numeros) - 3:
        raise RuntimeError(f"solo {len(laminas)} de {len(numeros)} láminas utilizables")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({"manual": d.name, "titulo": titulo_manual(d.name), "laminas": laminas},
                              ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✓ {d.name}: {len(laminas)} láminas ({prov})", flush=True)


if __name__ == "__main__":
    main()
