#!/usr/bin/env python3
"""Auditoría de FIDELIDAD de /mi_aula contra los manuales oficiales.

A diferencia de audit_25_modules.js (que solo cuenta clases y prácticas),
este script compara el CONTENIDO:
  1. Cobertura de términos: qué fracción de los términos distintivos del manual
     aparece en la clase (guion + guías de práctica + preguntas).
  2. Cobertura de cifras: números/porcentajes/códigos del manual presentes en la clase.
  3. Consistencia normativa: busca valores fiscales/laborales obsoletos o dudosos
     en toda la clase (IVA 12 %, aportes IESS antiguos, etc.).
  4. Integridad estructural: clase sin guion, sin práctica, sin preguntas.

Uso:  python3 scripts/audit_fidelidad.py [--min-terminos 0.35] [--json docs/AUDITORIA_FIDELIDAD.json]
Salida: resumen por módulo + JSON detallado + código de salida 1 si hay clases bajo el umbral.
"""
import argparse
import json
import math
import re
import sys
import unicodedata
from collections import Counter
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
MANUALES = RAIZ / "public" / "Capacitacion SAP"
FUENTES = RAIZ / "scripts" / "aula" / "fuentes"  # ids "fuente:<nombre>" de la malla

STOP = set(
    """de la el en y a los las del se que por un una con para es al lo como mas
    o pero sus le ya este si porque esta entre cuando muy sin sobre tambien me hasta
    hay donde quien desde todo nos durante todos uno les ni contra otros ese eso ante
    ellos e esto mi antes algunos que unos yo otro otras otra el tanto esa estos mucho
    quienes nada muchos cual poco ella estar estas algunas algo nosotros puede pueden
    cada sap business one sistema usted debe ser son fue han hacer haga cuenta paso
    pantalla clic haga seleccione ejemplo siguiente primer segunda tercera diapositiva""".split()
)

# Valores normativos Ecuador 2026 que NO deberían aparecer como vigentes.
# (patrón, mensaje). Se revisan en la clase completa; requieren validación humana.
NORMATIVA_SOSPECHOSA = [
    (r"iva\s*(del|de)?\s*12\s*%", "IVA 12 % (la tarifa vigente de referencia en el programa es 15 %)"),
    (r"iva\s*(del|de)?\s*14\s*%", "IVA 14 % (tarifa histórica 2016-2017)"),
    (r"(9[,.]35)\s*%", "Aporte personal 9,35 % (verificar vs 9,45 %)"),
    (r"\bformulario\s*(103|104)\b.*\b(2019|2020|2021)\b", "Formulario SRI con año antiguo"),
]


def plano(texto: str) -> str:
    t = unicodedata.normalize("NFD", (texto or "").lower())
    return "".join(c for c in t if unicodedata.category(c) != "Mn")


def tokens(texto: str):
    return [w for w in re.findall(r"[a-z0-9]{4,}", plano(texto)) if w not in STOP]


def cifras(texto: str):
    # porcentajes, importes y códigos (ej. 15%, 9,45, 104, 2026, IR-303)
    t = plano(texto)
    return set(re.findall(r"\b\d{1,3}(?:[.,]\d+)?\s?%|\b\d{3,4}\b", t))


def leer_manual(carpeta: Path) -> str:
    partes = []
    for md in sorted(carpeta.glob("*.md")):
        partes.append(md.read_text(encoding="utf-8", errors="ignore"))
    return "\n".join(partes)


def texto_clase(leccion: dict) -> str:
    out = []
    for s in leccion.get("syncData", []):
        out.append(s.get("script_text") or "")
        g = s.get("step_guide") or {}
        out.append(g.get("title") or "")
        out.append(g.get("menu_path") or "")
        for c in g.get("campos", []) or []:
            out.append(str(c.get("etiqueta") or ""))
    for q in leccion.get("quizQuestions", []) or []:
        out.append(json.dumps(q, ensure_ascii=False))
    return "\n".join(out)


def terminos_distintivos(texto_manual: str, idf: dict, n: int = 60):
    cnt = Counter(tokens(texto_manual))
    puntuado = {w: c * idf.get(w, 1.0) for w, c in cnt.items() if c >= 2}
    return [w for w, _ in sorted(puntuado.items(), key=lambda kv: -kv[1])[:n]]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--min-terminos", type=float, default=0.35)
    ap.add_argument("--json", default=str(RAIZ / "docs" / "AUDITORIA_FIDELIDAD.json"))
    args = ap.parse_args()

    clases = json.loads((RAIZ / "src/content/aula/clases.json").read_text(encoding="utf-8"))
    lecciones = json.loads((RAIZ / "src/content/aula/lecciones.json").read_text(encoding="utf-8"))
    malla = json.loads((RAIZ / "src/content/malla/malla.json").read_text(encoding="utf-8"))

    # IDF sobre todos los manuales
    textos_manual = {}
    df = Counter()
    for carpeta in MANUALES.iterdir():
        if carpeta.is_dir():
            t = leer_manual(carpeta)
            textos_manual[carpeta.name] = t
            df.update(set(tokens(t)))
    for md in FUENTES.glob("*.md"):
        t = md.read_text(encoding="utf-8", errors="ignore")
        textos_manual["fuente:" + md.stem] = t
        df.update(set(tokens(t)))
    N = max(len(textos_manual), 1)
    idf = {w: math.log((N + 1) / (c + 1)) + 1 for w, c in df.items()}

    reporte, problemas = [], 0
    for mod in malla["modulos"]:
        key = mod["modKey"]
        cls = clases.get(key, [])
        mans = [m for m in mod.get("manuals", []) if m["id"] in textos_manual]
        fila = {"modulo": key, "nombre": mod["name"], "clases": [], "manuales": []}
        textos_cls = {}
        for c in cls:
            lec = lecciones.get(c["id"])
            item = {"id": c["id"], "titulo": c["title"], "hallazgos": []}
            if not lec:
                item["hallazgos"].append("Clase sin lección en lecciones.json")
                problemas += 1
            else:
                tc = texto_clase(lec)
                textos_cls[c["id"]] = tc
                if not any((s.get("script_text") or "").strip() for s in lec.get("syncData", [])):
                    item["hallazgos"].append("Sin guion de audio")
                if not any((s.get("step_guide") or {}).get("campos") for s in lec.get("syncData", [])):
                    item["hallazgos"].append("Sin práctica con campos")
                pl = plano(tc)
                for patron, msg in NORMATIVA_SOSPECHOSA:
                    if re.search(patron, pl):
                        item["hallazgos"].append("NORMATIVA: " + msg)
                # manual mejor emparejado dentro del módulo
                pres = set(tokens(tc))
                mejor, mejor_cob = None, 0.0
                for m in mans:
                    dist = terminos_distintivos(textos_manual[m["id"]], idf)
                    cob = sum(1 for w in dist if w in pres) / max(len(dist), 1)
                    if cob > mejor_cob:
                        mejor, mejor_cob = m["id"], cob
                item["manual_mas_cercano"] = mejor
                item["cobertura_terminos"] = round(mejor_cob, 3)
                if mans and mejor_cob < args.min_terminos:
                    item["hallazgos"].append(
                        f"La clase cubre solo {mejor_cob:.0%} de los términos de su manual más cercano ({mejor})"
                    )
            if item["hallazgos"]:
                problemas += 1
            fila["clases"].append(item)
        union = " ".join(textos_cls.values())
        pres_mod = set(tokens(union))
        cif_mod = cifras(union)
        for m in mans:
            tm = textos_manual[m["id"]]
            dist = terminos_distintivos(tm, idf)
            cob = sum(1 for w in dist if w in pres_mod) / max(len(dist), 1)
            cm = cifras(tm)
            cc = len(cm & cif_mod) / max(len(cm), 1) if cm else 1.0
            fila["manuales"].append({
                "manual": m["id"],
                "cobertura_terminos": round(cob, 3),
                "cobertura_cifras": round(cc, 3),
                "terminos_faltantes": [w for w in dist if w not in pres_mod][:15],
                "estado": "OK" if cob >= args.min_terminos else "CONOCIMIENTO FALTANTE",
            })
        reporte.append(fila)

    Path(args.json).write_text(json.dumps(reporte, ensure_ascii=False, indent=2), encoding="utf-8")

    total = sum(len(f["clases"]) for f in reporte)
    print("=== AUDITORÍA DE FIDELIDAD (contenido vs manuales) ===")
    print("Cobertura de manual = % de términos distintivos del manual presentes en las clases del módulo.\n")
    faltantes = 0
    for f in reporte:
        cobs = [m["cobertura_terminos"] for m in f["manuales"]]
        prom = sum(cobs) / len(cobs) if cobs else 0
        malos = [m for m in f["manuales"] if m["estado"] != "OK"]
        faltantes += len(malos)
        mal = sum(1 for c in f["clases"] if c["hallazgos"])
        print(f"[{f['modulo']:6}] {f['nombre'][:44]:44} manuales {prom:4.0%} | bajo umbral: {len(malos)}/{len(f['manuales'])} | clases con hallazgos: {mal}/{len(f['clases'])}")
        for m in malos:
            print(f"         - {m['manual']}: {m['cobertura_terminos']:.0%}  faltan: {', '.join(m['terminos_faltantes'][:6])}")
    print(f"\nManuales con conocimiento faltante: {faltantes}. Clases con hallazgos: {problemas}/{total}. Detalle: {args.json}")
    sys.exit(1 if problemas else 0)


if __name__ == "__main__":
    main()
