#!/usr/bin/env python3
"""
Paso 4 — Control de calidad + publicación en public/Capacitacion SAP (modo narrado, sin necesidad de video).

Por manual: valida guion y láminas; reemplaza Imagenes_Diapositivas; escribe clase_sync.json (conserva step_guide);
si hay video nuevo en scratch lo copia, y si no, mueve el video viejo (inglés) a un respaldo para que local y
producción muestren lo mismo (modo narrado con la voz de Jorge).

  py -3 scripts/manuales/paso4_publicar.py --dry-run   # solo control de calidad
  py -3 scripts/manuales/paso4_publicar.py
"""
import argparse
import json
import re
import shutil

from comun import ROOT, TRABAJO, manuales

RESPALDO = ROOT / "scratch" / "videos_originales_respaldo"
INGLES = re.compile(r"\b(the|and|of|with|you|this|your|will|which|purchase|order)\b", re.I)


def revisar(d):
    base = TRABAJO / d.name
    g = base / "guion_es.json"
    if not g.exists():
        return None, "sin guion"
    lam = json.loads(g.read_text(encoding="utf-8"))["laminas"]
    imgs = sorted((base / "laminas").glob("Slide_*.webp")) if (base / "laminas").exists() else []
    if len(imgs) != len(lam):
        return None, f"láminas {len(imgs)} ≠ guion {len(lam)}"
    original = json.loads((d / "clase_sync.json").read_text(encoding="utf-8")) if (d / "clase_sync.json").exists() else []
    if original and len(lam) < len(original) - 3:
        return None, f"guion corto: {len(lam)} de {len(original)}"
    for i, L in enumerate(lam, 1):
        n = (L.get("narracion") or "").split()
        if len(n) < 30:
            return None, f"narración corta en lámina {i}"
        if len(INGLES.findall(L["narracion"])) > 4:
            return None, f"narración en inglés en lámina {i}"
    return lam, "ok"


def sync_desde_guion(d, lam):
    """clase_sync.json: usa el de paso3 (con tiempos reales) si existe; si no, tiempos estimados por palabras."""
    hecho = TRABAJO / d.name / "clase_sync.json"
    if hecho.exists():
        return json.loads(hecho.read_text(encoding="utf-8"))
    original = {s["slide_index"]: s for s in json.loads((d / "clase_sync.json").read_text(encoding="utf-8"))} \
        if (d / "clase_sync.json").exists() else {}
    sync, t = [], 0.0
    for i, L in enumerate(lam, 1):
        dur = round(len(L["narracion"].split()) / 2.5 + 0.6, 2)
        item = {"slide_index": i, "image_file": f"Slide_{i:03d}.webp", "script_text": L["narracion"].strip(),
                "start_time": round(t, 2), "end_time": round(t + dur, 2)}
        if original.get(L.get("n", i), {}).get("step_guide"):
            item["step_guide"] = original[L.get("n", i)]["step_guide"]
        sync.append(item)
        t += dur
    return sync


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="*")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    ok, malos = 0, []
    for d in manuales(a.only):
        lam, estado = revisar(d)
        if lam is None:
            malos.append(f"{d.name}: {estado}")
            continue
        ok += 1
        if a.dry_run:
            continue
        base = TRABAJO / d.name
        destino = d / "Imagenes_Diapositivas"
        if destino.exists():
            shutil.rmtree(destino)
        shutil.copytree(base / "laminas", destino)
        sync = sync_desde_guion(d, lam)
        (d / "clase_sync.json").write_text(json.dumps(sync, ensure_ascii=False, indent=2), encoding="utf-8")
        video_nuevo = base / "clase_video.mp4"
        video_pub = d / "clase_video.mp4"
        if video_nuevo.exists():
            shutil.copy2(video_nuevo, video_pub)
        elif video_pub.exists():
            RESPALDO.mkdir(parents=True, exist_ok=True)
            shutil.move(str(video_pub), str(RESPALDO / f"{d.name}.mp4"))  # video viejo (inglés): respaldo, no se borra
    print(f"Aptos {'(simulación)' if a.dry_run else 'publicados'}: {ok}")
    print(f"Con problemas: {len(malos)}")
    for m in malos:
        print("  -", m)


if __name__ == "__main__":
    main()
