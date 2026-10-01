import os
import sys
import json
import argparse
import subprocess
from mutagen.mp3 import MP3

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

BASE_DIR = os.path.join("public", "Capacitacion SAP")
DOC_PLAN = os.path.join("docs", "PLAN_MAESTRO_LECCIONES_PEDAGOGICAS.md")

def log(msg):
    print(msg, flush=True)

def render_manual(d_name):
    manual_dir = os.path.join(BASE_DIR, d_name)
    sync_file = os.path.join(manual_dir, "clase_sync.json")
    output_video = os.path.join(manual_dir, "clase_video.mp4")
    img_dir = os.path.join(manual_dir, "Imagenes_Diapositivas")

    if not os.path.exists(sync_file):
        log(f"[ERROR] No existe {sync_file}. Primero debes generar el guion pedagogico.")
        return False

    with open(sync_file, "r", encoding="utf-8") as f:
        sync_data = json.load(f)

    if not sync_data:
        log(f"[ERROR] {sync_file} está vacío.")
        return False

    log(f"\n=======================================================")
    log(f"🎬 Renderizando Clase Pedagógica: {d_name} ({len(sync_data)} diapositivas)")
    log(f"=======================================================")

    prefix = d_name[:15].replace(" ", "_").replace("-", "_")
    video_clips = []
    temp_files = []
    current_time = 0.0

    updated_sync = []

    for idx, item in enumerate(sync_data):
        slide_idx = item.get("slide_index", idx + 1)
        img_name = item.get("image_file")
        script_text = item.get("script_text", "").strip()

        img_path = os.path.join(img_dir, img_name)
        if not os.path.exists(img_path):
            log(f"[WARN] Imagen {img_name} no encontrada. Buscando alternativa en {img_dir}...")
            all_imgs = sorted([f for f in os.listdir(img_dir) if f.endswith(('.webp', '.png', '.jpg'))])
            if all_imgs:
                alt_idx = min(idx, len(all_imgs) - 1)
                img_path = os.path.join(img_dir, all_imgs[alt_idx])
                img_name = all_imgs[alt_idx]
            else:
                log(f"[ERROR] No hay imágenes disponibles para la slide {slide_idx}.")
                continue

        audio_file = f"temp_aud_{prefix}_{idx}.mp3"
        video_clip = f"temp_vid_{prefix}_{idx}.mp4"

        # Generar TTS
        safe_text = script_text.replace('"', '\\"').replace('$', '')
        cmd_tts = f'edge-tts --text "{safe_text}" --voice es-MX-JorgeNeural --write-media {audio_file}'
        
        try:
            subprocess.run(cmd_tts, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            audio_length = MP3(audio_file).info.length
        except Exception as e:
            log(f"  [ERROR] Falló generación TTS en slide {slide_idx}: {e}")
            continue

        clip_duration = audio_length + 0.6  # Pausa natural docente al final de cada lámina

        # Renderizar clip en 1080p con paddings
        cmd_ffmpeg = (
            f'ffmpeg -y -loop 1 -framerate 25 -i "{img_path}" -i {audio_file} '
            f'-vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black" '
            f'-c:v libx264 -preset veryfast -crf 26 '
            f'-af "apad=pad_dur=0.6" -c:a aac -b:a 128k -ar 44100 -pix_fmt yuv420p '
            f'-t {clip_duration} {video_clip}'
        )

        try:
            subprocess.run(cmd_ffmpeg, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception as e:
            log(f"  [ERROR] Falló FFmpeg en slide {slide_idx}: {e}")
            if os.path.exists(audio_file): os.remove(audio_file)
            continue

        start_t = round(current_time, 2)
        end_t = round(current_time + clip_duration, 2)
        current_time += clip_duration

        updated_sync.append({
            "slide_index": slide_idx,
            "image_file": img_name,
            "script_text": script_text,
            "start_time": start_t,
            "end_time": end_t
        })

        temp_files.extend([audio_file, video_clip])
        video_clips.append(video_clip)
        log(f"  ✓ Slide {slide_idx} lista ({audio_length:.1f}s | {start_t}s -> {end_t}s)")

    if not video_clips:
        log(f"[ERROR] No se pudo generar ningún clip para {d_name}.")
        return False

    # Concatenar video final
    concat_txt = f"concat_{prefix}.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        for vf in video_clips:
            f.write(f"file '{vf}'\n")

    cmd_concat = f'ffmpeg -y -f concat -safe 0 -i {concat_txt} -c copy "{output_video}"'
    try:
        subprocess.run(cmd_concat, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception as e:
        log(f"[ERROR] Error al concatenar video final: {e}")
        return False

    # Limpiar temporales
    for f in temp_files:
        if os.path.exists(f): os.remove(f)
    if os.path.exists(concat_txt): os.remove(concat_txt)

    # Guardar clase_sync.json actualizado con timestamps exactos
    with open(sync_file, "w", encoding="utf-8") as f:
        json.dump(updated_sync, f, indent=2, ensure_ascii=False)

    log(f"✅ ¡Video y Sincronización Completados!: {output_video} (Duración total: {current_time:.1f}s)")

    # Actualizar estado en docs/PLAN_MAESTRO_LECCIONES_PEDAGOGICAS.md
    mark_plan_complete(d_name)
    return True

def mark_plan_complete(d_name):
    if not os.path.exists(DOC_PLAN):
        return
    with open(DOC_PLAN, "r", encoding="utf-8") as f:
        content = f.read()

    target_old = f"`{d_name}`"
    if target_old in content:
        lines = content.splitlines()
        new_lines = []
        for line in lines:
            if f"`{d_name}`" in line:
                line = line.replace("[ ] Pendiente", "[x] Completado (Clase Pedagógica)")
            new_lines.append(line)
        with open(DOC_PLAN, "w", encoding="utf-8") as f:
            f.write("\n".join(new_lines) + "\n")
        log(f"📝 Actualizado checklist en {DOC_PLAN} para {d_name}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Renderizador de Clases Magistrales Pedagógicas")
    parser.add_argument("--manual", required=True, help="Nombre del directorio del manual")
    args = parser.parse_args()
    render_manual(args.manual)
