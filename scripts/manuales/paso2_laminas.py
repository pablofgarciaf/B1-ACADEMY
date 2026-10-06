#!/usr/bin/env python3
"""
Paso 2 — Láminas 1920x1080 con HTML + SVG + CSS, renderizadas con Playwright (Chromium) a WebP.
Entrada: scratch/manuales_es/<manual>/guion_es.json   Salida: scratch/manuales_es/<manual>/laminas/Slide_NNN.webp

  py -3 scripts/manuales/paso2_laminas.py --only 3.3
"""
import argparse
import html
import io
import json

from PIL import Image
from playwright.sync_api import sync_playwright

from comun import DATA, TRABAJO, manuales

ICON_SVG = json.loads((DATA / "lucide_icons.json").read_text(encoding="utf-8"))
NAVY, SKY, AMBER, BG, INK, MUTED = "#0B3D91", "#4C9BE8", "#F5A623", "#F4F6FA", "#1F2937", "#64748B"


def e(t):
    return html.escape(str(t or ""))


def icon(name, size=48, color=NAVY, stroke=2):
    inner = ICON_SVG.get(name) or ICON_SVG["lightbulb"]
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="{stroke}" '
            f'stroke-linecap="round" stroke-linejoin="round">{inner}</svg>')


CSS = f"""
*{{margin:0;padding:0;box-sizing:border-box}}
body{{width:1920px;height:1080px;overflow:hidden;font-family:"Segoe UI Variable Display","Segoe UI",Inter,Arial,sans-serif;color:{INK};background:{BG}}}
.slide{{position:relative;width:1920px;height:1080px;padding:84px 110px 0 110px;overflow:hidden}}
.deco-a{{position:absolute;right:-220px;top:-260px;width:760px;height:760px;border-radius:50%;background:radial-gradient(circle,{SKY}26,{SKY}05 70%)}}
.deco-b{{position:absolute;left:-60px;bottom:120px;width:340px;height:220px;opacity:.35}}
.main{{position:absolute;left:110px;right:110px;top:260px;bottom:100px;display:flex;flex-direction:column;justify-content:center}}
.tag{{display:inline-flex;align-items:center;gap:12px;font-size:22px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:{SKY}}}
.tag::before{{content:"";width:46px;height:6px;border-radius:3px;background:{AMBER}}}
h1{{font-size:70px;line-height:1.08;font-weight:800;color:{NAVY};margin-top:18px;letter-spacing:-.01em;max-width:1500px}}
.footer{{position:absolute;left:110px;right:110px;bottom:34px;display:flex;justify-content:space-between;font-size:22px;color:{MUTED};font-weight:600}}
.footer b{{color:{NAVY}}}
.row{{display:flex;gap:70px;align-items:center}}
.claves{{list-style:none;display:flex;flex-direction:column;gap:30px}}
.claves li{{display:flex;align-items:center;gap:26px;font-size:46px;font-weight:600;line-height:1.15}}
.dot{{flex:none;width:22px;height:22px;border-radius:50%;background:{AMBER};box-shadow:0 0 0 8px {AMBER}33}}
.hero{{position:relative;flex:none;width:640px;height:640px;display:flex;align-items:center;justify-content:center}}
.hero .ring{{position:absolute;inset:0;border-radius:50%;border:3px dashed {SKY}66}}
.hero .core{{width:440px;height:440px;border-radius:50%;background:linear-gradient(145deg,#ffffff,#E3ECFA);box-shadow:0 40px 90px #0B3D9126,inset 0 0 0 14px #ffffff;display:flex;align-items:center;justify-content:center}}
.sat{{position:absolute;width:118px;height:118px;border-radius:30px;background:#fff;box-shadow:0 18px 40px #0B3D911f;display:flex;align-items:center;justify-content:center}}
.card{{background:#fff;border-radius:28px;box-shadow:0 22px 60px #0B3D9114}}
.chip{{display:inline-flex;align-items:center;gap:12px;padding:14px 26px;border-radius:999px;background:#fff;box-shadow:0 10px 26px #0B3D9112;font-size:32px;font-weight:600;color:{NAVY}}}
"""

DOTS = (f'<svg class="deco-b" viewBox="0 0 340 220">' +
        "".join(f'<circle cx="{10 + c * 28}" cy="{10 + r * 28}" r="4" fill="{SKY}"/>' for r in range(8) for c in range(12)) + "</svg>")


def shell(L, ctx, body, dark=False):
    footer = (f'<div class="footer"><span>SAP Academy Ecuador · SAP Business One</span>'
              f'<span><b>{ctx["n"]}</b> / {ctx["total"]}</span></div>')
    deco = "" if dark else f'<div class="deco-a"></div>{DOTS}'
    return f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="slide">{deco}{body}{footer}</div></body></html>'


def head(L, ctx):
    return f'<div class="tag">{e(ctx["manual"])}</div><h1>{e(L.get("titulo"))}</h1>'


def lista(claves):
    return '<ul class="claves">' + "".join(f'<li><span class="dot"></span>{e(c)}</li>' for c in claves[:5]) + "</ul>"


def hero(name, sats=("sparkles", "circle-check", "chart-line")):
    pos = [("left:-10px;top:90px", sats[0]), ("right:-6px;top:200px", sats[1]), ("left:70px;bottom:20px", sats[2])]
    s = "".join(f'<div class="sat" style="{p}">{icon(n, 58, SKY)}</div>' for p, n in pos)
    return f'<div class="hero"><div class="ring"></div><div class="core">{icon(name, 230, NAVY, 1.6)}</div>{s}</div>'


# ───────────────────────── layouts ─────────────────────────

def portada(L, ctx):
    claves = " · ".join(e(c) for c in L.get("claves", [])[:4])
    body = f"""
<div style="position:absolute;inset:0;background:linear-gradient(125deg,#071F4E 0%,{NAVY} 55%,#1E5BB8 100%)"></div>
<div style="position:absolute;right:-180px;top:-120px;width:900px;height:900px;border-radius:50%;background:radial-gradient(circle,#4C9BE855,#4C9BE800 70%)"></div>
<div style="position:absolute;right:190px;top:250px;width:520px;height:520px;border-radius:50%;background:#ffffff12;border:2px solid #ffffff22;display:flex;align-items:center;justify-content:center">{icon(L.get('icono'), 250, AMBER, 1.5)}</div>
<div style="position:absolute;right:120px;top:230px;width:110px;height:110px;border-radius:28px;background:#ffffff1c;display:flex;align-items:center;justify-content:center">{icon('graduation-cap', 56, '#fff')}</div>
<div style="position:absolute;right:640px;top:690px;width:96px;height:96px;border-radius:26px;background:#ffffff1c;display:flex;align-items:center;justify-content:center">{icon('book-open', 50, '#fff')}</div>
<div style="position:relative;margin-top:150px;max-width:1050px">
  <div style="display:inline-block;padding:12px 28px;border-radius:999px;background:{AMBER};color:#071F4E;font-weight:800;font-size:26px;letter-spacing:.12em;text-transform:uppercase">Manual de formación</div>
  <div style="font-size:92px;line-height:1.04;font-weight:800;color:#fff;margin-top:40px">{e(L.get('titulo'))}</div>
  <div style="font-size:38px;color:#BFD6F6;margin-top:36px;font-weight:600">{claves}</div>
</div>"""
    return shell(L, ctx, body.replace("</div>\n<div style=\"position:relative", "</div><div style=\"position:relative"), dark=True).replace(
        f'color:{MUTED}', 'color:#9DB8E6').replace(f'b{{color:{NAVY}}}', 'b{color:#fff}')


def concepto(L, ctx):
    return shell(L, ctx, f'{head(L, ctx)}<div class="main"><div class="row" style="justify-content:space-between">'
                         f'<div style="flex:1">{lista(L.get("claves", []))}</div>{hero(L.get("icono"))}</div></div>')


def objetivos(L, ctx, icono_item="circle-check", rotulo=None):
    items = "".join(
        f'<div class="card" style="display:flex;align-items:center;gap:30px;padding:30px 40px">'
        f'<div style="flex:none;width:78px;height:78px;border-radius:22px;background:{NAVY};display:flex;align-items:center;justify-content:center">{icon(icono_item, 44, "#fff")}</div>'
        f'<div style="font-size:42px;font-weight:600">{e(c)}</div></div>' for c in L.get("claves", [])[:5])
    return shell(L, ctx, f'{head(L, ctx)}<div class="main"><div class="row" style="justify-content:space-between">'
                         f'<div style="flex:1;display:flex;flex-direction:column;gap:24px">{items}</div>{hero(L.get("icono"))}</div></div>')


def resumen(L, ctx):
    return objetivos(L, ctx, icono_item="lightbulb")


def flujo(L, ctx):
    pasos = (L.get("pasos") or [])[:6] or [{"texto": c, "icono": L.get("icono")} for c in L.get("claves", [])[:4]]
    n = len(pasos)
    w = min(300, int((1700 - (n - 1) * 70) / n))
    circ = min(170, w - 40)
    partes = []
    for i, p in enumerate(pasos):
        partes.append(
            f'<div style="width:{w}px;display:flex;flex-direction:column;align-items:center;text-align:center">'
            f'<div style="position:relative;width:{circ}px;height:{circ}px;border-radius:50%;background:linear-gradient(145deg,{NAVY},#1E5BB8);'
            f'box-shadow:0 24px 50px #0B3D9140;display:flex;align-items:center;justify-content:center">{icon(p.get("icono"), int(circ * .46), "#fff", 1.8)}'
            f'<div style="position:absolute;top:-8px;right:-8px;width:56px;height:56px;border-radius:50%;background:{AMBER};color:#071F4E;'
            f'font-weight:800;font-size:28px;display:flex;align-items:center;justify-content:center;border:5px solid {BG}">{i + 1}</div></div>'
            f'<div style="margin-top:30px;font-size:{36 if n <= 4 else 30}px;font-weight:700;line-height:1.15;color:{INK}">{e(p.get("texto"))}</div></div>')
        if i < n - 1:
            partes.append(f'<div style="flex:none;margin-top:{circ // 2 - 30}px">{icon("chevron-right", 60, AMBER, 3)}</div>')
    chips = "".join(f'<span class="chip">{icon("tag", 30, SKY)}{e(c)}</span>' for c in L.get("claves", [])[:4])
    return shell(L, ctx, f'{head(L, ctx)}<div class="main"><div style="display:flex;align-items:flex-start;justify-content:center;gap:10px">{"".join(partes)}</div>'
                         f'<div style="margin-top:70px;display:flex;gap:22px;justify-content:center;flex-wrap:wrap">{chips}</div></div>')


def comparacion(L, ctx):
    cols = (L.get("columnas") or [])[:2]
    while len(cols) < 2:
        cols.append({"titulo": "", "icono": L.get("icono"), "puntos": []})
    colores = [NAVY, "#C97A00"]
    cards = []
    for c, col in zip(cols, colores):
        pts = "".join(f'<li style="display:flex;gap:18px;align-items:center;font-size:36px;font-weight:600">{icon("circle-check", 40, col)}{e(p)}</li>'
                      for p in (c.get("puntos") or [])[:3])
        cards.append(f'<div class="card" style="flex:1;overflow:hidden"><div style="background:{col};padding:34px 44px;display:flex;align-items:center;gap:24px">'
                     f'{icon(c.get("icono"), 64, "#fff")}<div style="font-size:46px;font-weight:800;color:#fff">{e(c.get("titulo"))}</div></div>'
                     f'<ul style="list-style:none;padding:40px 44px;display:flex;flex-direction:column;gap:28px">{pts}</ul></div>')
    vs = (f'<div style="flex:none;align-self:center;width:110px;height:110px;border-radius:50%;background:#fff;box-shadow:0 18px 40px #0B3D9126;'
          f'display:flex;align-items:center;justify-content:center;font-size:38px;font-weight:900;color:{NAVY}">VS</div>')
    return shell(L, ctx, f'{head(L, ctx)}<div class="main"><div style="display:flex;gap:36px;align-items:stretch">{cards[0]}{vs}{cards[1]}</div></div>')


def pantalla(L, ctx):
    campos = (L.get("campos") or [])[:7]
    res = L.get("resaltar") if isinstance(L.get("resaltar"), int) else 0
    filas = "".join(
        f'<div style="display:flex;align-items:center;gap:20px;padding:12px 0">'
        f'<div style="width:300px;text-align:right;font-size:28px;color:#4B5563">{e(c.get("etiqueta"))}</div>'
        f'<div style="flex:1;height:58px;border:2px solid {AMBER if i == res else "#9CA3AF"};background:{"#FFF7E6" if i == res else "#fff"};'
        f'border-radius:6px;display:flex;align-items:center;padding:0 18px;font-size:28px;font-weight:600;'
        f'{"box-shadow:0 0 0 6px #F5A62340;" if i == res else ""}">{e(c.get("valor"))}</div></div>' for i, c in enumerate(campos))
    ventana = (f'<div style="flex:none;width:1080px;border-radius:14px;overflow:hidden;box-shadow:0 30px 80px #0B3D9133;background:#ECE9D8">'
               f'<div style="background:linear-gradient(90deg,#003366,#0055A5);color:#fff;padding:16px 26px;font-size:28px;font-weight:700;display:flex;justify-content:space-between">'
               f'<span>{e(L.get("ventana") or L.get("titulo"))}</span><span style="letter-spacing:8px;opacity:.8">▁ ▢ ✕</span></div>'
               f'<div style="background:#D4D0C8;height:46px;display:flex;align-items:center;gap:14px;padding:0 20px">'
               + "".join(f'<span style="width:30px;height:24px;border-radius:4px;background:#F5F4EE;border:1px solid #9CA3AF"></span>' for _ in range(7))
               + f'</div><div style="padding:26px 40px 34px">{filas}</div></div>')
    return shell(L, ctx, f'{head(L, ctx)}<div class="main"><div class="row" style="gap:80px">{ventana}'
                         f'<div style="flex:1">{lista(L.get("claves", [])[:4])}</div></div></div>')


def asiento(L, ctx):
    lineas = (L.get("lineas") or [])[:5]
    filas = "".join(
        f'<tr style="border-bottom:2px solid #E5E7EB"><td style="padding:20px 26px;font-size:32px;font-weight:600">{e(x.get("cuenta"))}</td>'
        f'<td style="padding:20px 26px;font-size:32px;text-align:right;color:{NAVY};font-weight:700">{e(x.get("debe"))}</td>'
        f'<td style="padding:20px 26px;font-size:32px;text-align:right;color:#B45309;font-weight:700">{e(x.get("haber"))}</td></tr>' for x in lineas)
    tabla = (f'<div class="card" style="flex:none;width:1120px;overflow:hidden"><div style="background:{NAVY};color:#fff;padding:24px 30px;display:flex;'
             f'align-items:center;gap:18px;font-size:32px;font-weight:800">{icon("calculator", 44, "#fff")}Asiento contable</div>'
             f'<table style="width:100%;border-collapse:collapse"><tr style="background:#EEF3FB">'
             f'<th style="text-align:left;padding:18px 26px;font-size:26px;color:{MUTED}">Cuenta</th>'
             f'<th style="text-align:right;padding:18px 26px;font-size:26px;color:{MUTED}">Debe</th>'
             f'<th style="text-align:right;padding:18px 26px;font-size:26px;color:{MUTED}">Haber</th></tr>{filas}</table>'
             f'<div style="padding:20px 30px;display:flex;align-items:center;gap:14px;font-size:28px;font-weight:700;color:#047857">{icon("scale", 36, "#047857")}Debe = Haber · asiento cuadrado</div></div>')
    return shell(L, ctx, f'{head(L, ctx)}<div class="main"><div class="row" style="gap:80px">{tabla}'
                         f'<div style="flex:1">{lista(L.get("claves", [])[:4])}</div></div></div>')


def tabla(L, ctx):
    t = L.get("tabla") or {}
    enc = (t.get("encabezados") or [])[:4]
    filas = [f[:4] for f in (t.get("filas") or [])[:5]]
    th = "".join(f'<th style="text-align:left;padding:22px 30px;font-size:30px;color:#fff">{e(h)}</th>' for h in enc)
    trs = "".join(f'<tr style="background:{"#fff" if i % 2 == 0 else "#F7F9FD"}">' +
                  "".join(f'<td style="padding:22px 30px;font-size:32px;font-weight:{700 if j == 0 else 500}">{e(c)}</td>' for j, c in enumerate(f)) + "</tr>"
                  for i, f in enumerate(filas))
    return shell(L, ctx, f'{head(L, ctx)}<div class="main"><div class="card" style="overflow:hidden"><table style="width:100%;border-collapse:collapse">'
                         f'<tr style="background:{NAVY}">{th}</tr>{trs}</table></div></div>')


def kpi(L, ctx):
    ks = (L.get("kpis") or [])[:3]
    cards = "".join(
        f'<div class="card" style="flex:1;padding:50px 44px;display:flex;flex-direction:column;gap:26px">'
        f'<div style="width:110px;height:110px;border-radius:30px;background:linear-gradient(145deg,{NAVY},#1E5BB8);display:flex;align-items:center;justify-content:center">{icon(k.get("icono"), 60, "#fff")}</div>'
        f'<div style="font-size:76px;font-weight:800;color:{NAVY};line-height:1">{e(k.get("valor"))}</div>'
        f'<div style="font-size:34px;font-weight:600;color:{MUTED}">{e(k.get("etiqueta"))}</div></div>' for k in ks)
    chips = "".join(f'<span class="chip">{icon("tag", 30, SKY)}{e(c)}</span>' for c in L.get("claves", [])[:4])
    return shell(L, ctx, f'{head(L, ctx)}<div class="main"><div style="display:flex;gap:40px">{cards}</div>'
                         f'<div style="margin-top:56px;display:flex;gap:22px;flex-wrap:wrap">{chips}</div></div>')


RENDER = {"portada": portada, "objetivos": objetivos, "concepto": concepto, "flujo": flujo, "comparacion": comparacion,
          "pantalla": pantalla, "asiento": asiento, "tabla": tabla, "kpi": kpi, "resumen": resumen}


def _como_lista(x):
    """La IA a veces devuelve una fila como objeto o un texto suelto: se normaliza a lista de celdas."""
    if isinstance(x, dict):
        return [str(v) for v in x.values()]
    if isinstance(x, (list, tuple)):
        return [str(v) if not isinstance(v, (dict, list)) else " ".join(map(str, v.values() if isinstance(v, dict) else v)) for v in x]
    return [str(x)]


def _normalizar(L):
    """Tolera variaciones de formato de la IA sin que se caiga el render (nunca una lámina rota)."""
    L = dict(L)
    if isinstance(L.get("tabla"), dict):
        t = dict(L["tabla"])
        t["encabezados"] = _como_lista(t.get("encabezados") or [])
        t["filas"] = [_como_lista(f) for f in (t.get("filas") or [])]
        L["tabla"] = t
    for clave, campo_texto in (("pasos", "texto"), ("kpis", "etiqueta"), ("campos", "etiqueta")):
        if isinstance(L.get(clave), list):
            L[clave] = [x if isinstance(x, dict) else {campo_texto: str(x)} for x in L[clave]]
    if isinstance(L.get("claves"), list):
        L["claves"] = [str(c) for c in L["claves"]]
    if isinstance(L.get("columnas"), list):
        L["columnas"] = [c if isinstance(c, dict) else {"titulo": str(c), "puntos": []} for c in L["columnas"]]
    return L


def html_lamina(L, ctx):
    L = _normalizar(L)
    layout = L.get("layout") if L.get("layout") in RENDER else "concepto"
    # Sin datos para el diagrama elegido → concepto (nunca una lámina vacía).
    requisitos = {"flujo": "pasos", "comparacion": "columnas", "pantalla": "campos", "asiento": "lineas", "tabla": "tabla", "kpi": "kpis"}
    if layout in requisitos and not L.get(requisitos[layout]):
        layout = "concepto"
    return RENDER[layout](L, ctx)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="*")
    ap.add_argument("--force", action="store_true")
    a = ap.parse_args()
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        for d in manuales(a.only):
            g = TRABAJO / d.name / "guion_es.json"
            if not g.exists():
                continue
            guion = json.loads(g.read_text(encoding="utf-8"))
            out = TRABAJO / d.name / "laminas"
            out.mkdir(parents=True, exist_ok=True)
            total = len(guion["laminas"])
            hechas = 0
            # Etiqueta superior: el título limpio de la portada (el nombre de carpeta viene truncado).
            primera = guion["laminas"][0] if guion["laminas"] else {}
            guion["titulo"] = primera.get("titulo") if primera.get("layout") == "portada" and primera.get("titulo") else guion["titulo"]
            for i, L in enumerate(guion["laminas"], 1):
                dest = out / f"Slide_{i:03d}.webp"
                if dest.exists() and not a.force:
                    continue
                page.set_content(html_lamina(L, {"n": i, "total": total, "manual": guion["titulo"]}))
                png = page.screenshot(type="png")
                Image.open(io.BytesIO(png)).convert("RGB").save(dest, "WEBP", quality=88, method=6)
                hechas += 1
            print(f"✓ {d.name}: {hechas} láminas nuevas ({total} en total)")
        browser.close()


if __name__ == "__main__":
    main()
