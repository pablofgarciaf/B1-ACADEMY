#!/usr/bin/env python3
"""
Validador normativo de Mi Aula: impuestos y retenciones según la normativa vigente del SRI (Ecuador).

El generador de clases usa un LLM; aunque recibe la fuente verificada (scripts/aula/fuentes/sri_2026.md),
puede equivocarse. Este script revisa lo que escribió ANTES de publicarlo:
  1. Porcentajes según su contexto: tarifa de IVA, retención de renta o retención de IVA.
     También reconoce números escritos con palabras ("quince por ciento"), porque la narración los pronuncia.
  2. Aritmética de las prácticas: IVA = 15 % de la base, total = base + IVA, retenciones = porcentaje legal.
  3. Asientos contables cuadrados (debe = haber).
  4. Resoluciones citadas: solo las que figuran en la fuente verificada.

Cuando el SRI publique nuevas tablas, actualizar las constantes de abajo y la fuente.

  py -3 scripts/aula/validar_normativa.py               # borradores de scratch/aula_es + clases publicadas
  py -3 scripts/aula/validar_normativa.py --only mod19-c2
Sale con código 1 si encuentra errores (para usarlo antes de publicar).
"""
import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[2]
BORRADORES = ROOT / "scratch" / "aula_es"
PUBLICADAS = ROOT / "src" / "content" / "aula" / "lecciones.json"
FUENTE = Path(__file__).parent / "fuentes" / "sri_2026.md"

# ── Normativa vigente (octubre 2026) ──
TARIFAS_IVA = {0, 5, 8, 15}                                   # Circular NAC-DGECCGC25-00000006 y tarifas especiales
IVA_GENERAL = 0.15
RETENCION_RENTA = {0, 1, 1.75, 2, 3, 5, 10}                   # NAC-DGERCGC26-00000009, desde el 1-mar-2026
RETENCION_IVA = {10, 20, 30, 70, 100}                         # NAC-DGERCGC20-00000061
RESOLUCIONES = set(re.findall(r"NAC-[A-Z]+\d{2}-\d{8}", FUENTE.read_text(encoding="utf-8")))
# Derogadas: solo pueden mencionarse como tales (en la misma frase debe aparecer "derog…").
DEROGADAS = {"NAC-DGERCGC24-00000008"}
RESOLUCIONES -= DEROGADAS

PALABRAS = {
    "cero": 0, "uno": 1, "un": 1, "dos": 2, "tres": 3, "cuatro": 4, "cinco": 5, "seis": 6, "siete": 7, "ocho": 8,
    "nueve": 9, "diez": 10, "once": 11, "doce": 12, "catorce": 14, "quince": 15, "dieciseis": 16, "veinte": 20,
    "veinticinco": 25, "treinta": 30, "cuarenta": 40, "cincuenta": 50, "sesenta": 60, "setenta": 70, "ochenta": 80,
    "noventa": 90, "cien": 100, "ciento": 100,
    "uno coma setenta y cinco": 1.75, "uno coma siete cinco": 1.75, "dos coma setenta y cinco": 2.75,
}
_ALT = "|".join(sorted(map(re.escape, PALABRAS), key=len, reverse=True))
RE_PCT = re.compile(rf"(?<![\w.,])(\d+(?:[.,]\d+)?)\s*(?:%|por\s*ciento)|\b({_ALT})\s+por\s*ciento")


def plano(t):
    t = unicodedata.normalize("NFD", str(t).lower())
    return "".join(c for c in t if unicodedata.category(c) != "Mn")


def numero(texto):
    """Convierte '1.150,50', '$ 1,150.50', '45' en float; None si no es un monto."""
    v = re.sub(r"(usd|us\$|\$|\s)", "", plano(texto))
    v = v.rstrip("%")
    if not re.fullmatch(r"-?[\d.,]+", v or "x") or not re.search(r"\d", v):  # "." o "," solos no son montos
        return None
    ultimo = max(v.rfind("."), v.rfind(","))
    if ultimo == -1:
        return float(v)
    decimales = len(v) - ultimo - 1
    if ("." in v and "," in v) or decimales != 3:
        return float(v[:ultimo].replace(".", "").replace(",", "") + "." + v[ultimo + 1:])
    return float(v.replace(".", "").replace(",", ""))


def en(conj, valor):
    return any(abs(valor - x) < 1e-6 for x in conj)


def contexto_fiscal(antes):
    """Clasifica un porcentaje por las palabras que lo preceden en la misma frase."""
    a = plano(antes)
    if re.search(r"retenc|reten(er|ga|ido|ida)|retien", a):
        p_iva, p_renta = a.rfind("iva"), max(a.rfind("renta"), a.rfind("fuente del impuesto"), a.rfind("impuesto a la"))
        if p_iva > p_renta:
            return "retencion_iva"
        if p_renta > p_iva:
            return "retencion_renta"
        return "retencion"
    if re.search(r"\biva\b", a[-60:]):
        return "tarifa_iva"
    return None


def es_renta_despues(despues, antes=""):
    """
    '2 % de renta', '2 % del impuesto a la renta' → retención de renta.
    '5 % de retención en la fuente' también, salvo que el IVA aparezca cerca (antes o hasta 60 caracteres después):
    'el 30 % de retención sobre el valor del IVA' es retención de IVA.
    """
    d, a = plano(despues), plano(antes)[-60:]
    if re.match(r"\s*(de|del)\s+(la\s+)?(impuesto\s+a\s+la\s+)?renta\b", d):
        return True
    return bool(re.match(r"\s*de\s+retencion\b", d) and not re.search(r"\biva\b", d[:60] + " " + a))


def revisar_texto(texto, donde, errores):
    for frase in re.split(r"(?<=[.;!?])\s+|\n", str(texto)):
        anterior = None  # en una enumeración ("el 10 % del IVA en bienes y el 20 % en servicios") se hereda el contexto
        for m in RE_PCT.finditer(frase):
            valor = numero(m.group(1)) if m.group(1) else PALABRAS[m.group(2)]
            if valor is None:
                continue
            despues = plano(frase[m.end(): m.end() + 25])
            # "el 30 % del IVA" es siempre una retención (un porcentaje del impuesto, no una tarifa).
            # "2 % de renta" o "2 % del impuesto a la renta" es retención de renta aunque antes se hable del IVA.
            if es_renta_despues(frase[m.end(): m.end() + 80], frase[: m.start()]):
                tipo = "retencion_renta"
                anterior = tipo
                if not en(RETENCION_RENTA, valor):
                    errores.append(f"{donde}: {valor:g} % no es válido como retencion renta → «{frase.strip()[:140]}»")
                continue
            # El contexto se toma de lo que precede; lo que sigue solo se usa si antes no hay ninguna pista
            # (si no, en "renta (1 %, 2 %) y del IVA (30 %)" el 2 % se leería como retención de IVA).
            # "30 % del IVA" (una parte del impuesto) o "30 % de retención … del IVA" es retención de IVA; "15 % de IVA" es la tarifa.
            tipo = "retencion_iva" if re.match(r"\s*del\s+(valor\s+del\s+)?iva\b|\s*de\s+valor\s+del\s+iva\b|\s*de\s+retencion\b", despues) \
                else (contexto_fiscal(frase[: m.start()]) or contexto_fiscal(frase[: m.start()] + " " + frase[m.end(): m.end() + 25]))
            if anterior and anterior.startswith("retencion") and tipo == "tarifa_iva":
                tipo = anterior
            anterior = tipo or anterior
            # Mencionar un porcentaje derogado como historia ("eliminó el 2,75 %") es correcto.
            if re.search(r"elimin|derog|antes|anterior|ya no|reemplaz|sustitu|dejo de", plano(frase)):
                tipo = None
            permitido = {"tarifa_iva": TARIFAS_IVA, "retencion_renta": RETENCION_RENTA,
                         "retencion_iva": RETENCION_IVA, "retencion": RETENCION_RENTA | RETENCION_IVA}.get(tipo)
            if permitido is not None and not en(permitido, valor):
                errores.append(f"{donde}: {valor:g} % no es válido como {tipo.replace('_', ' ')} → «{frase.strip()[:140]}»")
            if tipo == "retencion_renta" and abs(valor - 1.75) < 1e-6 and re.search(r"bienes muebles", plano(frase)):
                errores.append(f"{donde}: bienes muebles retienen 2 % desde marzo 2026 (no 1,75 %) → «{frase.strip()[:140]}»")
        for r in re.findall(r"NAC-[A-Z]+\d{2}-\d{8}", frase):
            if r in DEROGADAS and "derog" not in plano(frase):
                errores.append(f"{donde}: cita como vigente la resolución {r}, que está derogada")
            elif r not in RESOLUCIONES | DEROGADAS:
                errores.append(f"{donde}: resolución {r} no está en la fuente verificada")
        if re.search(r"\biva\b[^.]{0,30}\b12\s*(%|por ciento)|\bdoce por ciento\b[^.]{0,20}\biva", plano(frase)):
            errores.append(f"{donde}: menciona IVA 12 % (tarifa derogada; desde abril 2024 es 15 %) → «{frase.strip()[:140]}»")


MONTO = r"\$?\s*([\d][\d.,]*)\s*(?:dolares|usd)?"


def revisar_cadena(texto, donde, errores):
    """
    Aritmética de una narración del tipo «factura por 1700 dólares … IVA (255 dólares) … 2 % de renta (34 dólares)
    … 30 % del IVA (76.50 dólares) … neto a pagar 1844.50»: cada cifra derivada debe cuadrar con las anteriores.
    """
    t = plano(texto)
    def primero(patron):
        m = re.search(patron, t)
        return numero(m.group(1).rstrip(".,")) if m else None
    base = primero(r"(?:por un total de|por un valor de|por|base imponible de|subtotal de)\s+" + MONTO + r"\s*(?:dolares|usd)")
    iva = primero(r"\biva\s*(?:\(|de\s|es de\s|:\s*)" + MONTO)
    ret_renta = primero(r"de (?:la )?renta\s*\(\s*" + MONTO)
    ret_iva = primero(r"del iva\s*\(\s*" + MONTO)
    neto = primero(r"neto a pagar[^\d$]{0,30}" + MONTO)
    # El IVA debe ser el 15 % de alguno de los montos mencionados (la narración puede citar también costos u otros valores).
    montos = [n for n in (numero(x.rstrip(".,")) for x in re.findall(r"(\d[\d.,]*)\s*(?:dolares|usd)", t)) if n]
    if base and iva and not any(abs(iva - m * IVA_GENERAL) <= 0.02 for m in montos) and not re.search(r"tarifa 0|0 ?%|exent", t):
        errores.append(f"{donde}: la narración dice IVA {iva:g}, que no es el 15 % de ningún monto mencionado")
    # Naturaleza del IVA en la narración: una compra registra IVA crédito tributario, nunca "IVA débito".
    if re.search(r"factura de (compra|proveedor)|compra de|al recibir una factura|proveedor", t) and not re.search(r"\bventa|cliente", t):
        if re.search(r"(registra|debita|debito en|carga)[^.]{0,60}\biva debito|\biva debito( fiscal)?[^.]{0,30}(al debe|en el debe|de \d)", t):
            errores.append(f"{donde}: la narración registra «IVA débito» en una compra; en compras es IVA crédito tributario")
    # SAP Business One: la entrega solo mueve inventario y costo de ventas; ingresos e IVA se registran con la factura.
    if re.search(r"(guardar|registrar|contabilizar|crear|anadir) la entrega", t) and re.search(r"(reconoce|registra)\w*[^.]{0,40}(ingreso|iva)", t):
        errores.append(f"{donde}: en SAP B1 la entrega no registra ingresos ni IVA (se registran con la factura de clientes)")
    if base and iva and neto is not None and (ret_renta is not None or ret_iva is not None):
        esperado = base + iva - (ret_renta or 0) - (ret_iva or 0)
        if abs(neto - esperado) > 0.02:
            errores.append(f"{donde}: neto a pagar {neto:g} no cuadra: {base:g} + {iva:g} − {(ret_renta or 0):g} − {(ret_iva or 0):g} = {esperado:.2f}")


BIENES = r"\ba0000\d\b|laptop|monitor|servidor|teclado|mouse|disco duro|memoria ram|mercader"
SERVICIOS = r"mantenimiento|instalac|consultor|honorario|asesor|transporte|arrend|arriendo|publicidad|capacitac|soporte|auditor"


def revisar_clasificacion(texto, donde, errores):
    """
    Clasificación tributaria: los artículos del inventario de la empresa ficticia (A00001…A00008) son bienes muebles
    y retienen 2 % de renta. Aplicarles un porcentaje de servicios (3 %, 5 %, 10 %) sin que haya un servicio real
    en la operación es un error de normativa, aunque el porcentaje exista en la tabla.
    """
    t = plano(texto)
    if not re.search(BIENES, t) or re.search(SERVICIOS, t):
        return
    for frase in re.split(r"(?<=[.;!?])\s+", t):
        for m in RE_PCT.finditer(frase):
            valor = numero(m.group(1)) if m.group(1) else PALABRAS[m.group(2)]
            antes, despues = frase[: m.start()], frase[m.end(): m.end() + 25]
            es_renta = es_renta_despues(frase[m.end(): m.end() + 80], antes) or contexto_fiscal(antes) == "retencion_renta" \
                or (re.search(r"reten", antes) and not re.search(r"\biva\b", antes + despues))
            if es_renta and valor in (3, 5, 10):
                errores.append(f"{donde}: aplica {valor:g} % de renta a artículos del inventario (bienes muebles retienen 2 %) → «{frase.strip()[:140]}»")


def revisar_campos(campos, donde, errores):
    """Coherencia aritmética de los valores de una práctica."""
    def buscar(patron, excluir=None):
        for c in campos:
            et = plano(c.get("etiqueta", ""))
            if re.search(patron, et) and not (excluir and re.search(excluir, et)):
                n = numero(c.get("valor", ""))
                if n is not None:
                    return et, n
        return None, None

    _, base = buscar(r"base|subtotal|valor neto|precio total|importe neto", r"reten|iva")
    et_iva, iva = buscar(r"\biva\b|impuesto", r"reten|base|porcentaje|tarifa|codigo")
    _, total = buscar(r"^total|total (factura|documento|a pagar|del documento)", r"reten")
    # "Retención IVA" o "IVA retenido": las etiquetas aparecen en cualquier orden.
    _, ret_renta = buscar(r"reten.*(renta|fuente|\bir\b)|(renta|\bir\b).*reten", r"iva|%|porcentaje|codigo")
    _, ret_iva = buscar(r"reten.*iva|iva.*reten", r"%|porcentaje|codigo")
    for c in campos:
        et, val = plano(c.get("etiqueta", "")), numero(c.get("valor", ""))
        # Campo de porcentaje: el valor lleva % o la etiqueta lo dice ("Porcentaje…", "Tarifa…").
        # Una etiqueta como "IVA 15%" con valor 150 es un monto, no un porcentaje.
        es_pct = "%" in str(c.get("valor", "")) or re.search(r"porcentaje|tarifa|\(%\)|^%", et)
        if val is None or not es_pct:
            continue
        if "reten" in et:
            conj = RETENCION_IVA if "iva" in et else RETENCION_RENTA
            if not en(conj, val):
                errores.append(f"{donde}: campo «{c['etiqueta']}» = {val:g} % no es un porcentaje de retención vigente")
        elif "iva" in et and not en(TARIFAS_IVA, val):
            errores.append(f"{donde}: campo «{c['etiqueta']}» = {val:g} % no es una tarifa de IVA vigente")

    tarifa_cero = bool(et_iva and re.search(r"\b0\s*%|tarifa 0|exent", et_iva))
    if base and iva is not None and et_iva and not tarifa_cero and iva > 0 and abs(iva - round(base * IVA_GENERAL, 2)) > 0.02:
        errores.append(f"{donde}: IVA {iva:g} no es el 15 % de la base {base:g} (esperado {base * IVA_GENERAL:.2f})")
    if base and iva is not None and total and abs(total - (base + iva)) > 0.02:
        errores.append(f"{donde}: total {total:g} ≠ base {base:g} + IVA {iva:g}")
    if base and ret_renta is not None and not en(RETENCION_RENTA, round(ret_renta / base * 100, 2)):
        errores.append(f"{donde}: retención renta {ret_renta:g} = {ret_renta / base * 100:.2f} % de la base: no es un porcentaje vigente")
    if iva and ret_iva is not None and not en(RETENCION_IVA, round(ret_iva / iva * 100, 2)):
        errores.append(f"{donde}: retención IVA {ret_iva:g} = {ret_iva / iva * 100:.2f} % del IVA: no es un porcentaje vigente")


def revisar_asiento(lineas, donde, errores, contexto=""):
    """`contexto` = título y narración de la lámina: dice si el asiento es de una compra o de una venta."""
    ctx = plano(contexto)
    es_compra_ctx = bool(re.search(r"factura de (compra|proveedor)|compra de|proveedor", ctx))
    es_factura_compra = bool(re.search(r"factura de (compra|proveedor)", ctx)) and not re.search(r"\bpago\b|pagar al proveedor|desembolso", ctx)
    if es_factura_compra:
        for l in lineas:
            c = plano(l.get("cuenta", ""))
            if re.search(r"\bbanco|\bcaja\b", c) and (numero(str(l.get("haber") or 0)) or 0) > 0:
                errores.append(f"{donde}: la factura de proveedores acredita al proveedor (cuenta por pagar), no «{l.get('cuenta')}»; el banco se mueve con el pago")
    _revisar_asiento(lineas, donde, errores, es_compra_ctx)


def _revisar_asiento(lineas, donde, errores, es_compra_ctx=False):
    if len(lineas) < 2:
        errores.append(f"{donde}: un asiento necesita al menos dos líneas (partida doble)")
        return
    debe = sum(numero(str(l.get("debe") or 0)) or 0 for l in lineas)
    haber = sum(numero(str(l.get("haber") or 0)) or 0 for l in lineas)
    if abs(debe - haber) > 0.02:
        errores.append(f"{donde}: asiento descuadrado (debe {debe:.2f} ≠ haber {haber:.2f})")
    # IVA dentro del asiento: debe ser una tarifa vigente sobre la venta/compra que lo origina.
    monto = lambda l: (numero(str(l.get("debe") or 0)) or 0) + (numero(str(l.get("haber") or 0)) or 0)
    ivas = [l for l in lineas if re.search(r"\biva\b", plano(l.get("cuenta", ""))) and "reten" not in plano(l.get("cuenta", ""))]
    bases = [l for l in lineas if re.search(r"venta|ingreso|compra|inventario|mercader|gasto|servicio", plano(l.get("cuenta", "")))
             and not re.search(r"\biva\b|reten|costo de venta", plano(l.get("cuenta", "")))]
    # Naturaleza del IVA: en compras es crédito tributario (al debe); en ventas es IVA cobrado/débito fiscal (al haber).
    cuentas = " ".join(plano(l.get("cuenta", "")) for l in lineas)
    for l in ivas:
        c, al_debe = plano(l.get("cuenta", "")), (numero(str(l.get("debe") or 0)) or 0) > 0
        compra = "proveedor" in cuentas or es_compra_ctx or re.search(r"\bcompras?\b|inventario|mercader", cuentas)
        if compra and "cliente" not in cuentas and al_debe and "debito" in c:
            errores.append(f"{donde}: en una compra el IVA es crédito tributario, no «{l.get('cuenta')}»")
        if "cliente" in cuentas and not al_debe and re.search(r"credito tributario|iva (en )?compras|iva pagado", c):
            errores.append(f"{donde}: en una venta el IVA es débito fiscal (IVA cobrado), no «{l.get('cuenta')}»")
    if len(ivas) == 1 and len(bases) == 1 and monto(bases[0]) > 0 and monto(ivas[0]) > 0:
        tasa = monto(ivas[0]) / monto(bases[0]) * 100
        if not any(abs(tasa - t) < 0.1 for t in TARIFAS_IVA if t):
            errores.append(f"{donde}: el IVA del asiento es {tasa:.2f} % de la base ({monto(ivas[0]):g} sobre {monto(bases[0]):g}); debe ser 15 %")


def revisar_borrador(cid, datos, errores):
    for i, L in enumerate(datos.get("laminas", []), 1):
        donde = f"{cid} lámina {i}"
        for campo in ("titulo", "narracion"):
            revisar_texto(L.get(campo, ""), donde, errores)
        revisar_cadena(L.get("narracion", ""), donde, errores)
        practica = L.get("practica") if isinstance(L.get("practica"), dict) else {}
        codigos = " ".join(str(c.get("valor", "")) for c in practica.get("campos", []) + (L.get("campos") or []))
        revisar_clasificacion(f"{L.get('narracion', '')} {codigos}", donde, errores)
        revisar_texto(" ".join(map(str, L.get("claves", []))), donde, errores)
        tabla = L.get("tabla") or {}
        for fila in [tabla.get("encabezados", [])] + tabla.get("filas", []):
            revisar_texto(" ".join(map(str, fila)), donde, errores)
        if L.get("lineas"):
            revisar_asiento(L["lineas"], donde, errores, f"{L.get('titulo', '')}. {L.get('narracion', '')}")
        practica = L.get("practica")
        if isinstance(practica, dict):
            revisar_texto(" ".join(practica.get("instrucciones", [])), donde, errores)
            revisar_campos(practica.get("campos", []), donde, errores)
        elif L.get("campos"):
            revisar_campos(L["campos"], donde, errores)


def revisar_publicada(cid, leccion, errores):
    for s in leccion.get("syncData", []):
        donde = f"{cid} lámina {s['slide_index']} (publicada)"
        revisar_texto(s.get("script_text", ""), donde, errores)
        revisar_cadena(s.get("script_text", ""), donde, errores)
        guia = s.get("step_guide") or {}
        revisar_texto(" ".join(guia.get("instructions", [])), donde, errores)
        revisar_campos(guia.get("campos", []), donde, errores)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="*")
    a = ap.parse_args()
    errores = []
    borradores = {p.parent.name: p for p in BORRADORES.glob("*/clase.json")} if BORRADORES.exists() else {}
    for cid, p in sorted(borradores.items()):
        if not a.only or cid in a.only:
            revisar_borrador(cid, json.loads(p.read_text(encoding="utf-8")), errores)
    if PUBLICADAS.exists():
        for cid, leccion in json.loads(PUBLICADAS.read_text(encoding="utf-8")).items():
            if cid not in borradores and (not a.only or cid in a.only):
                revisar_publicada(cid, leccion, errores)
    for e in errores:
        print("✗", e)
    print(f"\nRevisadas: {len(borradores)} en borrador + publicadas · Errores normativos: {len(errores)}")
    print(f"Resoluciones reconocidas: {', '.join(sorted(RESOLUCIONES))}")
    sys.exit(1 if errores else 0)


if __name__ == "__main__":
    main()
