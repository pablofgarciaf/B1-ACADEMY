#!/usr/bin/env python3
"""
Genera las clases de Mi Aula (escuela con práctica integrada) a partir de plan.json y los manuales en español.
Cada clase alterna teoría breve y 3 a 5 prácticas encadenadas (toda ventana de SAP mostrada es práctica).
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

La clase alterna teoría breve y PRÁCTICA (entre 12 y 16 láminas): se aprende haciendo.
1. portada  2. objetivos  3-4. teoría esencial (concepto / flujo): qué es y para qué sirve en una empresa real
Luego, por cada ventana de SAP que enseña la clase: una PRÁCTICA seguida de 1 lámina que explica qué ocurrió en el
sistema (impacto, asiento o informe resultante). Una PRÁCTICA por cada ventana que la clase enseña, de menor a mayor dificultad,
encadenadas como un proceso real (por ejemplo: crear el socio → registrar el pedido → facturar).
Penúltima: errores comunes / buenas prácticas. Última: resumen.
REGLA: toda lámina que muestre una ventana de SAP (layout "pantalla") ES una práctica; no muestres ventanas solo para mirarlas.

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

LAS PRÁCTICAS usan layout "pantalla" y además llevan:
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
    # Clases basadas en una fuente investigada (p. ej. normativa SRI) no tienen manual propio: se les dan las rutas
    # reales de los manuales relacionadas con documentos tributarios, impuestos y socios de negocios.
    if any(m.startswith("fuente:") for m in clase["manuales"]):
        rutas += [r for r in MENU_SAP["todas"]
                  if re.search(r"factura de (proveedores|clientes|deudores|acreedores)|nota de cr[eé]dito|datos maestros (de socio|interlocutor)|impuesto|retenci", r, re.I)]
    # Filtro opcional por clase (plan.json "rutas_regex"): rutas reales adicionales que sí aplican a su tema.
    if clase.get("rutas_regex"):
        rutas += [r for r in MENU_SAP["todas"] if re.search(clase["rutas_regex"], r, re.I)]
    if len(rutas) < 4:
        rutas += de([m for c in modulo["clases"] for m in c["manuales"]])
    if len(rutas) < 4:
        rutas = MENU_SAP["todas"]
    return list(dict.fromkeys(rutas))


_DINERO = re.compile(r"\d{1,3}(?:[.,]\d{3})*[.,]\d{2}(?!\d)|\d+[.,]\d{2}(?!\d)")


def _importe(t):
    """'1.311,82' / '1,311.82' / '845.57' -> 1311.82 / 1311.82 / 845.57"""
    u = max(t.rfind("."), t.rfind(","))
    return round(float(re.sub(r"[.,]", "", t[:u]) + "." + t[u + 1:]), 2)


def importes(texto):
    return {_importe(m.group(0)) for m in _DINERO.finditer(str(texto))}


def cifras_clase(clase):
    """Clases de nómina: los únicos importes con decimales permitidos son los de su fuente (calculados por el motor)."""
    if "fuente:nomina_ec_2026" not in clase.get("manuales", []):
        return None
    return importes((FUENTES / "nomina_ec_2026.md").read_text(encoding="utf-8"))


def valida(datos, permitidas=None, cifras=None):
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
        falsos = re.compile(r"^(acci[oó]n|estado|confirmaci[oó]n|resultado|modo|paso|segundo|tercer|primer|elemento|operaci[oó]n realizada|icono|bot[oó]n|marca|transacci[oó]n \d|opci[oó]n \d|clic)", re.I)
        if any(falsos.match(str(c.get("etiqueta", "")).strip()) for c in campos):
            return False
        return (3 <= len(campos) <= 6 and p["practica"].get("instrucciones") and len(ruta) >= 2 and ruta_real
                and all(str(c.get("valor", "")).strip() and len(str(c["valor"])) <= 40 for c in campos))

    practicas = [x for x in lam if isinstance(x.get("practica"), dict)]
    validas = [x for x in practicas if evaluable(x)]
    # REGLA ÚNICA: toda lámina que muestra una ventana de SAP es una práctica, sin tope de cantidad.
    # Una ventana que no se puede practicar con datos reales (menú inventado, campo falso…) no se muestra:
    # la lámina pasa a ser una explicación sin ventana. Así, si el estudiante ve una ventana, la practica.
    for x in lam:
        es_ventana = x.get("layout") == "pantalla" or isinstance(x.get("practica"), dict)
        if es_ventana and x not in validas:
            x.pop("practica", None)
            for k in ("campos", "ventana", "resaltar"):
                x.pop(k, None)
            x["layout"] = "concepto"
    if not validas:  # toda clase enseña al menos una ventana de SAP
        return None, "0 prácticas evaluables"
    for x in lam:
        narr = x.get("narracion") or ""
        if len(narr.split()) < 30:
            return None, "narración corta"
        n = narr.lower()
        # Una lámina sin práctica no puede invitar a practicar (el estudiante buscaría un ejercicio que no existe).
        if not isinstance(x.get("practica"), dict) and re.search(r"en esta pr[aá]ctica|esta pr[aá]ctica|ahora t[uú]|vas a practicar", n):
            return None, f"lámina sin práctica que invita a practicar: «{x.get('titulo')}»"
        # Ventanas que NO existen en SAP Business One estándar (el modelo las inventaba).
        if re.search(r"ventana (de )?(gu[ií]as? de remisi[oó]n|liquidaci[oó]n de compra|notas? de d[eé]bito)|tipo de documento: nota de d[eé]bito", n):
            return None, "ventana inventada que no existe en SAP B1 estándar"
        # En una compra el IVA es crédito tributario (debe), nunca débito fiscal.
        if "débito fiscal" in n and ("compra" in n or "proveedor" in n):
            return None, "IVA 'débito fiscal' en una compra"
    if cifras is not None:
        # Cada cuenta de nómina solo admite los importes que el motor calcula para ella.
        POR_CUENTA = [
            ("sueldos por pagar", "haber", {845.57, 516.79, 724.40, 1483.25, 543.30}),
            ("iess por pagar", "haber", {206.55, 104.11, 172.80, 324.00, 129.60}),
            ("gasto de nomina", "debe", {1035.94, 562.34, 800.00, 1625.00, 600.00}),
            ("iess patronal", "debe", {116.18, 58.56, 97.20, 182.25, 72.90}),
            ("anticipos al personal", "haber", {100.00, 0.0}),
        ]
        for x in lam:
            a_ = x.get("asiento")
            lineas = x.get("lineas") or (a_.get("lineas") if isinstance(a_, dict) else a_ if isinstance(a_, list) else None) or []
            for l in lineas:
                cuenta = re.sub(r"[^a-z ]", "", str(l.get("cuenta", "")).lower().translate(str.maketrans("áéíóú", "aeiou"))).strip()
                for nombre, lado, ok in POR_CUENTA:
                    if cuenta.endswith(nombre) or nombre in cuenta:
                        vals = importes(l.get(lado, ""))
                        if vals and not vals <= ok:
                            return None, f"importe {sorted(vals)} no corresponde a «{l.get('cuenta')}» ({lado}) en «{x.get('titulo')}»"
            if "210001" in json.dumps(x, ensure_ascii=False):
                return None, "número de cuenta bancaria inexistente en el simulador (usa Banco Pichincha · Cta. corriente 2100000001)"
        for x in lam:
            desconocidas = sorted(v for v in importes(json.dumps(x, ensure_ascii=False)) if v >= 10 and v not in cifras)
            if desconocidas:
                return None, f"cifra no calculada por el motor {desconocidas[:3]} en «{x.get('titulo')}»"
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
        lam, motivo = valida(datos, permitidas, cifras_clase(clase))
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
