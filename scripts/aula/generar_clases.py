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
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "manuales"))
from comun import ICONOS, ROOT, cargar_env, llm_json  # noqa: E402
sys.path.insert(0, str(Path(__file__).parent))
from validar_normativa import revisar_borrador  # noqa: E402

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
  "menu_path": "COPIADA EXACTAMENTE de la lista 'rutas_reales_del_menu' de la entrada (son rutas reales de los manuales; no inventes ninguna)",
  "instrucciones": [3 a 5 pasos cortos y concretos],
  "campos": [3 a 6 objetos {{"etiqueta": "nombre del campo en SAP", "valor": "valor EXACTO a escribir", "pista": "ayuda breve sin dar la respuesta"}}]
}}
- Los valores son datos cortos y verificables (códigos, cantidades, precios, fechas DD/MM/2026, nombres de la empresa ficticia), máximo 40 caracteres.
- Usa SOLO clientes, proveedores, artículos, bodegas y bancos de la empresa ficticia (abajo). IVA 15 %.
- Los "campos" de la lámina pantalla muestran los mismos valores que la práctica.
- La "narracion" de una práctica presenta la misión (qué vas a hacer y por qué), 50 a 90 palabras.
- Cada práctica ejercita el tema de ESTA clase en la ventana de SAP que corresponde a ese tema
  (por ejemplo, una clase de ubicaciones practica en ventanas de ubicaciones, no una factura de ventas).
- Los "campos" son campos reales de esa ventana de SAP; nunca "Resultado", "Confirmar" u otras acciones disfrazadas de campo.

NORMATIVA (Ecuador, obligatoria; un validador rechaza la clase si no se cumple):
- IVA general 15 % (tarifas posibles: 0 %, 5 %, 8 %, 15 %). Nunca 12 %: está derogado.
- Retención en la fuente del Impuesto a la Renta: solo 0 %, 1 %, 1,75 %, 2 %, 3 %, 5 % o 10 %, se calcula sobre la base imponible.
- Retención del IVA: solo 10 %, 20 %, 30 %, 70 % o 100 %, se calcula sobre el valor del IVA (no sobre la base).
- Si el contenido técnico trae porcentajes o resoluciones del SRI, usa EXACTAMENTE esos; no cites resoluciones que no aparezcan ahí.
- El layout "asiento" es SOLO para asientos contables reales de partida doble: mínimo dos líneas y suma del debe = suma del haber.
  Para capacidades, pesos, horas o cantidades usa "tabla" o "kpi", nunca "asiento".
- Toda cifra derivada debe cuadrar: IVA = 15 % de la base, total = base + IVA.
- Naturaleza del IVA: en COMPRAS la cuenta es "IVA crédito tributario" (o "IVA en compras") y va al DEBE;
  en VENTAS la cuenta es "IVA débito fiscal" (o "IVA cobrado") y va al HABER. Nunca uses "IVA débito" en una compra.
- La factura de proveedores acredita la cuenta "Proveedores" (cuenta por pagar) por el neto; el banco solo se mueve en el pago.
- La entrega a clientes no registra ingresos ni IVA (eso ocurre en la factura de clientes).

EMPRESA FICTICIA: {EMPRESA}

Responde SOLO con JSON: {{"laminas": [ ... ]}}"""


FUENTES = Path(__file__).parent / "fuentes"


def conocimiento(clase):
    partes = []
    for m in clase["manuales"]:
        # "fuente:<nombre>" = documento investigado fuera de la biblioteca de manuales (p. ej. normativa SRI del año).
        if m.startswith("fuente:"):
            partes.append(f"## Fuente {m[7:]}\n" + (FUENTES / f"{m[7:]}.md").read_text(encoding="utf-8"))
            continue
        p = MANUALES / m / "clase_sync.json"
        sync = json.loads(p.read_text(encoding="utf-8"))
        partes.append(f"## Manual {m}\n" + "\n".join(f"- {s['script_text']}" for s in sync))
    return "\n\n".join(partes)[:16000]


MENU_SAP = json.loads((FUENTES / "menu_sap.json").read_text(encoding="utf-8"))


def _plano_ruta(r):
    import unicodedata
    t = unicodedata.normalize("NFD", str(r).lower())
    return " > ".join(s.strip() for s in "".join(c for c in t if unicodedata.category(c) != "Mn").split(">") if s.strip())


def rutas_permitidas(modulo, clase):
    """Rutas reales del menú (extraídas de los manuales) para una clase: las de sus manuales y, si son pocas, las del módulo."""
    def de(manuales):
        return [r for m in manuales if not m.startswith("fuente:") for r in MENU_SAP["por_manual"].get(m, [])]
    rutas = de(clase["manuales"])
    if len(rutas) < 4:
        rutas += de([m for c in modulo["clases"] for m in c["manuales"]])
    if len(rutas) < 4:
        rutas = MENU_SAP["todas"]
    return list(dict.fromkeys(rutas))


def valida(datos, permitidas=None):
    lam = [x for x in datos.get("laminas", []) if isinstance(x, dict)]
    if not 10 <= len(lam) <= 20:
        return None, f"{len(lam)} láminas"
    rutas_ok = {_plano_ruta(r) for r in (permitidas or [])}

    def evaluable(p):
        campos = p["practica"].get("campos") or []
        # La práctica se abre navegando el menú real de SAP: necesita al menos "Módulo > Ventana" (revisar_aula.py lo exige)
        # y, si hay catálogo, una ruta que exista de verdad en los manuales (antes el modelo inventaba menús).
        ruta = [s for s in str(p["practica"].get("menu_path", "")).split(">") if s.strip()]
        ruta_real = not rutas_ok or _plano_ruta(p["practica"].get("menu_path", "")) in rutas_ok
        # Campos falsos: acciones o estados disfrazados de campo ("Acción: Agregar", "Estado: Guardado"…) no existen en SAP
        # y el estudiante no sabe qué escribir. Se aceptan solo campos de datos reales.
        falsos = re.compile(r"^(acci[oó]n|estado|confirmaci[oó]n|resultado|modo|paso|segundo|tercer|primer|elemento|operaci[oó]n realizada)", re.I)
        if any(falsos.match(str(c.get("etiqueta", "")).strip()) for c in campos):
            return False
        return (3 <= len(campos) <= 6 and p["practica"].get("instrucciones") and len(ruta) >= 2 and ruta_real
                and all(str(c.get("valor", "")).strip() and len(str(c["valor"])) <= 40 for c in campos))

    practicas = [x for x in lam if isinstance(x.get("practica"), dict)]
    # Una práctica que no se puede evaluar con exactitud (valores largos, sin instrucciones) queda como lámina
    # de pantalla explicativa; las que se evalúan conservan la misma exigencia. Más de 4: las extra también.
    validas = [x for x in practicas if evaluable(x)]
    for x in practicas:
        if x not in validas[:4]:
            x.pop("practica", None)
    if len(validas) < 2:
        return None, f"{len(validas)} prácticas evaluables"
    for x in lam:
        if len((x.get("narracion") or "").split()) < 30:
            return None, "narración corta"
    # Normativa: impuestos, retenciones, asientos y resoluciones se validan antes de aceptar la clase;
    # si algo no cumple, la clase se rechaza y se vuelve a pedir al modelo.
    errores = []
    revisar_borrador("clase", {"laminas": lam}, errores)
    if errores:
        return None, f"normativa: {errores[0]}"
    return lam, "ok"


def generar(modulo, clase, env):
    out = SALIDA / clase["id"] / "clase.json"
    permitidas = rutas_permitidas(modulo, clase)
    entrada = json.dumps({"modulo": modulo["titulo"], "clase": clase["titulo"], "contenido_tecnico": conocimiento(clase),
                          "rutas_reales_del_menu": permitidas[:60]}, ensure_ascii=False)
    motivo = ""
    for _ in range(5):  # con el validador normativo hay más rechazos legítimos: se dan más oportunidades
        datos, prov = llm_json(SYSTEM, entrada, env, max_tokens=14000)
        lam, motivo = valida(datos, permitidas)
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
    # Las clases ya publicadas en src/content/aula/lecciones.json no se regeneran (aunque su borrador
    # en scratch/ ya no exista): solo se rehacen si se piden explícitamente con --only ... --force.
    publicadas = set(json.loads((ROOT / "src" / "content" / "aula" / "lecciones.json").read_text(encoding="utf-8")))
    tareas = [(m, c) for m in PLAN["modulos"] for c in m["clases"]
              if (not a.only or c["id"] in a.only)
              and (a.force and a.only or (c["id"] not in publicadas and not (SALIDA / c["id"] / "clase.json").exists()))]
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
