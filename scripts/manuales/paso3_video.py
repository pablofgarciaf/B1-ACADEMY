#!/usr/bin/env python3
"""
Paso 3 — Video con la voz de Jorge (es-MX-JorgeNeural, la del manual 1.1) + clase_sync.json.
Conserva los step_guide (prácticas del simulador) de cada lámina original.

  py -3 scripts/manuales/paso3_video.py --only 3.3              # arma el video en scratch/
  py -3 scripts/manuales/paso3_video.py --only 3.3 --publicar   # además reemplaza lo publicado en public/
"""
import argparse
import asyncio
import hashlib
import json
import shutil
import subprocess
from concurrent.futures import ThreadPoolExecutor

import edge_tts

from comun import ROOT, TRABAJO, manuales

VOZ = "es-MX-JorgeNeural"
PAUSA = 0.6
CACHE = ROOT / "scratch" / "aula_audio_cache"


def duracion(p):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)],
                         capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


async def tts(texto):
    CACHE.mkdir(parents=True, exist_ok=True)
    mp3 = CACHE / (hashlib.sha1(f"{VOZ}|{texto}".encode()).hexdigest()[:16] + ".mp3")
    if not mp3.exists() or mp3.stat().st_size == 0:
        for intento in range(4):
            try:
                await edge_tts.Communicate(texto, VOZ).save(str(mp3))
                break
            except Exception:  # noqa: BLE001
                if intento == 3:
                    raise
                await asyncio.sleep(3 * (intento + 1))
    return mp3


def clip(img, audio, salida):
    dur = duracion(audio) + PAUSA
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-loop", "1", "-framerate", "25", "-i", str(img), "-i", str(audio),
                    "-vf", "scale=1920:1080", "-c:v", "libx264", "-preset", "veryfast", "-tune", "stillimage", "-crf", "24",
                    "-af", f"apad=pad_dur={PAUSA}", "-c:a", "aac", "-b:a", "128k", "-ar", "44100", "-ac", "1",
                    "-pix_fmt", "yuv420p", "-t", f"{dur:.3f}", str(salida)], check=True)
    return dur


async def armar(d, force):
    base = TRABAJO / d.name
    guion = json.loads((base / "guion_es.json").read_text(encoding="utf-8"))
    video, sync_path = base / "clase_video.mp4", base / "clase_sync.json"
    if video.exists() and sync_path.exists() and not force:
        return True
    original = {s["slide_index"]: s for s in json.loads((d / "clase_sync.json").read_text(encoding="utf-8"))} \
        if (d / "clase_sync.json").exists() else {}
    tmp = base / "_clips"
    tmp.mkdir(exist_ok=True)
    clips, sync, t = [], [], 0.0
    for i, L in enumerate(guion["laminas"], 1):
        img = base / "laminas" / f"Slide_{i:03d}.webp"
        texto = (L.get("narracion") or "").strip()
        if not img.exists() or not texto:
            print(f"   ✗ lámina {i}: {'sin imagen' if not img.exists() else 'sin narración'}")
            return False
        c = tmp / f"{i:03d}.mp4"
        dur = clip(img, await tts(texto), c)
        item = {"slide_index": i, "image_file": img.name, "script_text": texto,
                "start_time": round(t, 2), "end_time": round(t + dur, 2)}
        n_original = L.get("n", i)
        if original.get(n_original, {}).get("step_guide"):
            item["step_guide"] = original[n_original]["step_guide"]
        sync.append(item)
        clips.append(c)
        t += dur
    lista = tmp / "lista.txt"
    lista.write_text("".join(f"file '{c.as_posix()}'\n" for c in clips), encoding="utf-8")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", str(lista), "-c", "copy",
                    "-movflags", "+faststart", str(video)], check=True)
    sync_path.write_text(json.dumps(sync, ensure_ascii=False, indent=2), encoding="utf-8")
    shutil.rmtree(tmp, ignore_errors=True)
    print(f"   🎬 {d.name}: {len(clips)} láminas, {t / 60:.1f} min")
    return True


def publicar(d):
    base = TRABAJO / d.name
    destino = d / "Imagenes_Diapositivas"
    if destino.exists():
        shutil.rmtree(destino)  # las láminas originales de SAP quedan en el historial de git
    shutil.copytree(base / "laminas", destino)
    shutil.copy2(base / "clase_sync.json", d / "clase_sync.json")
    shutil.copy2(base / "clase_video.mp4", d / "clase_video.mp4")
    print(f"   ✅ publicado {d.name}")


def un_manual(d, force, publicar_al_final):
    """Cada manual en su propio hilo con su propio bucle asyncio (voz) y sus procesos ffmpeg."""
    print(f"▶ {d.name}", flush=True)
    try:
        if asyncio.run(armar(d, force)) and publicar_al_final:
            publicar(d)
    except Exception as e:  # noqa: BLE001 — un manual con error no detiene a los demás
        print(f"   ✗ {d.name}: {e}", flush=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="*")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--publicar", action="store_true")
    ap.add_argument("--workers", type=int, default=4)
    a = ap.parse_args()
    pendientes = [d for d in manuales(a.only) if (TRABAJO / d.name / "laminas").exists()]
    with ThreadPoolExecutor(max_workers=a.workers) as pool:
        list(pool.map(lambda d: un_manual(d, a.force, a.publicar), pendientes))


if __name__ == "__main__":
    main()
