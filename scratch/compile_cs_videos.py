# -*- coding: utf-8 -*-
"""
Compilador de Videos 1080p y Sincronizador de Teleprompter para Manuales CS
"""

import os
import sys
import json
import subprocess
import glob

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

BASE_DIR = r"C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP"
TEMP_DIR = r"C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\scratch\temp_vid_build"

def get_audio_duration(audio_path):
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        audio_path
    ]
    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        return float(res.stdout.strip())
    except Exception as e:
        print(f"Error obteniendo duracion con ffprobe: {e}")
        return 5.0

def compile_manual_video(folder_name):
    manual_dir = os.path.join(BASE_DIR, folder_name)
    sync_file = os.path.join(manual_dir, "clase_sync.json")
    img_dir = os.path.join(manual_dir, "Imagenes_Diapositivas")
    output_video = os.path.join(manual_dir, "clase_video.mp4")

    if not os.path.exists(sync_file):
        print(f"[!] No existe {sync_file}")
        return False

    with open(sync_file, "r", encoding="utf-8") as f:
        sync_data = json.load(f)

    os.makedirs(TEMP_DIR, exist_ok=True)
    clips_list_path = os.path.join(TEMP_DIR, f"clips_{folder_name[:10]}.txt")

    print(f"\n=======================================================")
    print(f"🎬 Compilando Video 1080p para {folder_name} ({len(sync_data)} diapositivas)...")
    print(f"=======================================================")

    clip_files = []
    current_time = 0.0

    for idx, slide in enumerate(sync_data):
        slide_idx = slide["slide_index"]
        image_name = slide["image_file"]
        image_path = os.path.join(img_dir, image_name)
        
        if not os.path.exists(image_path):
            # Buscar cualquier webp correspondiente
            cand = [f for f in os.listdir(img_dir) if f.endswith(".webp") and f"Slide_{slide_idx:02d}_" in f]
            if cand:
                image_path = os.path.join(img_dir, cand[0])
            else:
                print(f"[!] No se encontro imagen para slide {slide_idx}: {image_name}")
                continue

        script_text = slide.get("script_text", "").strip()
        if not script_text:
            script_text = f"Paso {slide_idx} del caso práctico de SAP Business One."

        # Limpiar texto para edge-tts
        safe_text = script_text.replace('"', '').replace('$', '').replace('\n', ' ')

        audio_file = os.path.join(TEMP_DIR, f"aud_{slide_idx:02d}.mp3")
        clip_file = os.path.join(TEMP_DIR, f"clip_{slide_idx:02d}.mp4")

        # 1. Generar Audio con edge-tts
        cmd_tts = f'edge-tts --text "{safe_text}" --voice es-MX-JorgeNeural --write-media "{audio_file}"'
        try:
            subprocess.run(cmd_tts, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception as e:
            print(f"Error generando TTS para slide {slide_idx}: {e}")
            continue

        # 2. Medir duración real con ffprobe
        dur = get_audio_duration(audio_file)
        pad_pause = 0.6  # Pausa pedagógica entre diapositivas
        clip_duration = dur + pad_pause

        # Actualizar sincronización para el teleprompter
        slide["start_time"] = round(current_time, 3)
        current_time += clip_duration
        slide["end_time"] = round(current_time, 3)

        # 3. Compilar clip 1080p con ffmpeg
        cmd_ffmpeg = (
            f'ffmpeg -y -loop 1 -framerate 25 -i "{image_path}" -i "{audio_file}" '
            f'-vf "scale=1920:1080" '
            f'-c:v libx264 -preset veryfast -crf 24 '
            f'-af "apad=pad_dur={pad_pause}" -c:a aac -b:a 128k -ar 44100 -pix_fmt yuv420p '
            f'-t {clip_duration} "{clip_file}"'
        )
        try:
            subprocess.run(cmd_ffmpeg, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            clip_files.append(clip_file)
            print(f"  [OK] Diapositiva {slide_idx:02d}: {dur:.1f}s locución -> Clip listo.")
        except Exception as e:
            print(f"Error renderizando clip {slide_idx}: {e}")

    if not clip_files:
        print("[!] No se generaron clips.")
        return False

    # 4. Concatenar clips con ffmpeg concat demuxer
    with open(clips_list_path, "w", encoding="utf-8") as f:
        for c in clip_files:
            # ffmpeg concat espera rutas con barras normales o escapadas
            escaped_path = c.replace('\\', '/')
            f.write(f"file '{escaped_path}'\n")

    cmd_concat = f'ffmpeg -y -f concat -safe 0 -i "{clips_list_path}" -c copy "{output_video}"'
    try:
        subprocess.run(cmd_concat, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print(f"🎉 ¡Video final generado con éxito!: {output_video}")
    except Exception as e:
        print(f"Error concatenando video: {e}")
        return False

    # 5. Guardar clase_sync.json actualizado con marcas de tiempo reales
    with open(sync_file, "w", encoding="utf-8") as f:
        json.dump(sync_data, f, indent=2, ensure_ascii=False)
    print(f"💾 clase_sync.json actualizado con sincronización milimétrica para teleprompter.")

    # 6. Limpiar archivos temporales
    for f in glob.glob(os.path.join(TEMP_DIR, "*")):
        try:
            os.remove(f)
        except Exception:
            pass

    return True

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "CSI08_Query_Practice"
    compile_manual_video(target)
