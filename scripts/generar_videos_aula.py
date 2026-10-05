#!/usr/bin/env python3
"""
Genera los videos del Aula SAP a partir de public/Aula_SAP/**/leccion.json.

Misma receta que el video del manual 1.1 (scratch/fix_intro11_masterclass.py):
  voz edge-tts es-MX-JorgeNeural, 0.6 s de pausa por lámina, 1920x1080, H.264 + AAC.

Por cada lección produce:
  B01_video/M01-L01_B01.mp4            ← video del bloque (una lámina por narración)
  B01_video/M01-L01_B01_sync.json      ← mismo formato que clase_sync.json
  B02_simulador/M01-L02_B02_mision.mp4 ← tarjeta de misión narrada
  B02_simulador/M01-L02_B02_logrado.mp4← tarjeta de logro narrada
  videos.json                          ← secuencia video → simulador → video para el reproductor

Limpieza automática: elimina de las narraciones las oraciones de relleno que se repiten
en 5 o más láminas (con 8+ palabras), p. ej. "Además, ten en cuenta que este concepto…".

Uso (desde la raíz del repo):
  py -3 scripts/generar_videos_aula.py                 # todo, salta lo ya generado
  py -3 scripts/generar_videos_aula.py --only M01      # solo un módulo (o M01-L02)
  py -3 scripts/generar_videos_aula.py --force         # regenera aunque exista
"""
import argparse
import asyncio
import hashlib
import json
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path

import edge_tts

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
AULA = ROOT / "public" / "Aula_SAP"
CACHE = ROOT / "scratch" / "aula_audio_cache"
TMP = ROOT / "scratch" / "aula_tmp"
VOICE = "es-MX-JorgeNeural"
PAUSA = 0.6
VF = "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0xF4F6FA"

SENT_SPLIT = re.compile(r"(?<=[\.\!\?])\s+")


def oraciones(texto: str) -> list[str]:
    return [s.strip() for s in SENT_SPLIT.split(texto or "") if s.strip()]


def detectar_relleno(lecciones: list[dict]) -> set[str]:
    cuenta: Counter[str] = Counter()
    for lec in lecciones:
        for b in lec["bloques"]:
            textos = [d.get("narracion", "") for d in b.get("diapositivas", [])]
            textos += [b.get("narracion_mision", ""), b.get("narracion_logrado", "")]
            for t in textos:
                for s in set(oraciones(t)):
                    cuenta[s] += 1
    return {s for s, n in cuenta.items() if n >= 5 and len(s.split()) >= 8}


def limpiar(texto: str, relleno: set[str]) -> str:
    return " ".join(s for s in oraciones(texto) if s not in relleno).strip()


def duracion(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


async def tts(texto: str) -> Path:
    """Audio cacheado por hash del texto: regenerar solo cuando la narración cambia."""
    CACHE.mkdir(parents=True, exist_ok=True)
    key = hashlib.sha1(f"{VOICE}|{texto}".encode("utf-8")).hexdigest()[:16]
    mp3 = CACHE / f"{key}.mp3"
    if not mp3.exists() or mp3.stat().st_size == 0:
        for intento in range(1, 4):
            try:
                await edge_tts.Communicate(texto, VOICE).save(str(mp3))
                break
            except Exception as e:  # red inestable: reintentar
                if intento == 3:
                    raise
                print(f"      TTS reintento {intento}: {e}")
                await asyncio.sleep(3 * intento)
    return mp3


def clip(imagen: Path, audio: Path, salida: Path) -> float:
    dur = duracion(audio) + PAUSA
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-loop", "1", "-framerate", "25", "-i", str(imagen), "-i", str(audio),
         "-vf", VF, "-c:v", "libx264", "-preset", "veryfast", "-tune", "stillimage", "-crf", "24",
         "-af", f"apad=pad_dur={PAUSA}", "-c:a", "aac", "-b:a", "128k", "-ar", "44100", "-ac", "1",
         "-pix_fmt", "yuv420p", "-t", f"{dur:.3f}", str(salida)],
        check=True,
    )
    return dur


def concatenar(clips: list[Path], salida: Path):
    lista = TMP / "concat.txt"
    lista.write_text("".join(f"file '{c.as_posix()}'\n" for c in clips), encoding="utf-8")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", str(lista),
                    "-c", "copy", "-movflags", "+faststart", str(salida)], check=True)


async def video_bloque(lec_dir: Path, lec_id: str, bloque: dict, relleno: set[str], force: bool, rep: dict):
    bdir = lec_dir / f"{bloque['id']}_video"
    mp4 = bdir / f"{lec_id}_{bloque['id']}.mp4"
    sync_path = bdir / f"{lec_id}_{bloque['id']}_sync.json"
    if mp4.exists() and sync_path.exists() and not force:
        rep["saltados"] += 1
        return {"bloque": bloque["id"], "tipo": "video", "titulo": bloque.get("titulo", ""),
                "video": rel(mp4), "sync": rel(sync_path), "duracion_s": json.loads(sync_path.read_text("utf-8"))[-1]["end_time"]}

    clips, sync, t = [], [], 0.0
    for i, d in enumerate(bloque.get("diapositivas", []), 1):
        img = lec_dir / d["archivo"]
        texto = limpiar(d.get("narracion", ""), relleno)
        if not img.exists() or not texto:
            rep["errores"].append(f"{lec_id} {bloque['id']} D{i:02d}: {'sin imagen' if not img.exists() else 'sin narración'}")
            continue
        audio = await tts(texto)
        c = TMP / f"{lec_id}_{bloque['id']}_{i:02d}.mp4"
        dur = clip(img, audio, c)
        sync.append({"slide_index": i, "image_file": Path(d["archivo"]).name, "script_text": texto,
                     "start_time": round(t, 2), "end_time": round(t + dur, 2)})
        t += dur
        clips.append(c)
    if not clips:
        return None
    concatenar(clips, mp4)
    sync_path.write_text(json.dumps(sync, ensure_ascii=False, indent=2), encoding="utf-8")
    for c in clips:
        c.unlink(missing_ok=True)
    rep["videos"] += 1
    rep["segundos"] += t
    print(f"    ✓ {mp4.name}  {len(clips)} láminas  {t/60:.1f} min")
    return {"bloque": bloque["id"], "tipo": "video", "titulo": bloque.get("titulo", ""),
            "video": rel(mp4), "sync": rel(sync_path), "duracion_s": round(t, 2)}


async def tarjeta(lec_dir: Path, img_rel: str, texto: str, relleno: set[str], force: bool, rep: dict, etiqueta: str):
    if not img_rel or not texto:
        return None
    img = lec_dir / img_rel
    mp4 = img.with_suffix(".mp4")
    if not img.exists():
        rep["errores"].append(f"{etiqueta}: falta {img_rel}")
        return None
    if mp4.exists() and not force:
        return rel(mp4)
    texto = limpiar(texto, relleno)
    if not texto:
        return None
    audio = await tts(texto)
    tmp = TMP / f"tarjeta_{mp4.stem}.mp4"
    dur = clip(img, audio, tmp)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(tmp), "-c", "copy", "-movflags", "+faststart", str(mp4)], check=True)
    tmp.unlink(missing_ok=True)
    rep["segundos"] += dur
    print(f"    ✓ {mp4.name}  {dur:.0f} s")
    return rel(mp4)


def rel(p: Path) -> str:
    return "/" + p.relative_to(ROOT / "public").as_posix()


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="M01 o M01-L02")
    ap.add_argument("--force", action="store_true")
    a = ap.parse_args()

    TMP.mkdir(parents=True, exist_ok=True)
    archivos = sorted(AULA.rglob("leccion.json"))
    lecciones = [json.loads(f.read_text(encoding="utf-8")) for f in archivos]
    relleno = detectar_relleno(lecciones)
    print(f"Lecciones: {len(archivos)} | oraciones de relleno detectadas y eliminadas: {len(relleno)}")
    for s in sorted(relleno):
        print(f"   - {s[:110]}")

    rep = {"videos": 0, "saltados": 0, "segundos": 0.0, "errores": []}
    for f, lec in zip(archivos, lecciones):
        lec_id = lec.get("id") or f.parent.name.split("_")[0]
        if a.only and not lec_id.startswith(a.only):
            continue
        print(f"\n▶ {lec_id}  {lec.get('titulo', '')}")
        secuencia = []
        for b in lec["bloques"]:
            try:
                if b["tipo"] == "video":
                    item = await video_bloque(f.parent, lec_id, b, relleno, a.force, rep)
                    if item:
                        secuencia.append(item)
                elif b["tipo"] == "simulador":
                    secuencia.append({
                        "bloque": b["id"], "tipo": "simulador", "titulo": b.get("titulo", ""),
                        "screenId": b.get("screenId"), "mision": b.get("mision", ""),
                        "pasos_esperados": b.get("pasos_esperados", []),
                        "criterios_validacion": b.get("criterios_validacion", []),
                        "pistas_ia": b.get("pistas_ia", []),
                        "video_mision": await tarjeta(f.parent, b.get("tarjeta_mision"), b.get("narracion_mision"), relleno, a.force, rep, f"{lec_id} {b['id']} misión"),
                        "video_logrado": await tarjeta(f.parent, b.get("tarjeta_logrado"), b.get("narracion_logrado"), relleno, a.force, rep, f"{lec_id} {b['id']} logrado"),
                    })
            except subprocess.CalledProcessError as e:
                rep["errores"].append(f"{lec_id} {b['id']}: ffmpeg falló ({e.returncode})")
            except Exception as e:
                rep["errores"].append(f"{lec_id} {b['id']}: {e}")
        (f.parent / "videos.json").write_text(json.dumps(
            {"id": lec_id, "titulo": lec.get("titulo", ""), "voz": VOICE, "secuencia": secuencia,
             "quiz": lec.get("quiz", [])}, ensure_ascii=False, indent=2), encoding="utf-8")

    informe = AULA / "_reportes" / "reporte_videos.md"
    informe.parent.mkdir(parents=True, exist_ok=True)
    informe.write_text(
        "# Reporte de videos del Aula SAP\n\n"
        f"- Voz: `{VOICE}` (misma del manual 1.1)\n"
        f"- Videos de bloque generados en esta corrida: {rep['videos']} (ya existían: {rep['saltados']})\n"
        f"- Minutos de audio generados en esta corrida: {rep['segundos']/60:.1f}\n"
        f"- Oraciones de relleno eliminadas: {len(relleno)}\n\n"
        "## Errores\n\n" + ("\n".join(f"- {e}" for e in rep["errores"]) or "Ninguno") + "\n",
        encoding="utf-8")
    print(f"\nListo: {rep['videos']} videos nuevos, {rep['saltados']} ya existían, "
          f"{rep['segundos']/60:.1f} min, {len(rep['errores'])} errores. Reporte: {informe}")


if __name__ == "__main__":
    asyncio.run(main())
