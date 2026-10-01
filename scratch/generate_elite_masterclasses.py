# -*- coding: utf-8 -*-
"""
Generador de Clases Magistrales Pedagógicas de Élite para SAP Business One
Aplica las 5 Reglas de Oro de B1 Academy:
1. Rol: Consultor Senior y Docente de Élite de SAP B1.
2. CERO lectura de clics o menús como un loro.
3. CERO frases robóticas ('En este paso revisamos', 'Diapositiva X').
4. Explicación profunda del POR QUÉ empresarial, impacto contable y trucos de consultoría.
5. Puntuación y cadencia humana para la voz neuronal.
"""

import os
import sys
import json
import subprocess
import shutil

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

BASE_DIR = r"C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP"
TEMP_BASE = r"C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\scratch\temp_elite_build"
os.makedirs(TEMP_BASE, exist_ok=True)

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
    except Exception:
        return 20.0

def build_masterclass(manual_name, lessons_data):
    manual_dir = os.path.join(BASE_DIR, manual_name)
    slides_dir = os.path.join(manual_dir, "Imagenes_Diapositivas")
    temp_dir = os.path.join(TEMP_BASE, manual_name.replace(" ", "_").replace("-", "_"))
    os.makedirs(temp_dir, exist_ok=True)

    print(f"\n==================================================================")
    print(f"🎓 GENERANDO CLASE PEDAGÓGICA MAGISTRAL: {manual_name}")
    print(f"==================================================================")

    sync_records = []
    clips_list = []
    current_time = 0.0
    total_steps = len(lessons_data)

    for item in lessons_data:
        idx = item["slide_index"]
        img_file = item["image_file"]
        script_text = item["script_text"].strip()
        step_guide = item["step_guide"]

        img_path = os.path.join(slides_dir, img_file)
        if not os.path.exists(img_path):
            print(f"[!] No existe imagen: {img_path}")
            continue

        audio_file = os.path.join(temp_dir, f"aud_{idx:02d}.mp3")
        clip_file = os.path.join(temp_dir, f"clip_{idx:02d}.mp4")

        # Generar locución neuronal docente
        clean_text = script_text.replace('"', '').replace('$', '').replace('\n', ' ')
        cmd_tts = f'edge-tts --text "{clean_text}" --voice es-MX-JorgeNeural --write-media "{audio_file}"'
        subprocess.run(cmd_tts, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        dur = get_audio_duration(audio_file)
        pad_pause = 0.8  # Pausa pedagógica al cambiar de concepto
        clip_dur = dur + pad_pause

        start_t = round(current_time, 3)
        current_time += clip_dur
        end_t = round(current_time, 3)

        sync_records.append({
            "slide_index": idx,
            "image_file": img_file,
            "script_text": script_text,
            "step_guide": step_guide,
            "start_time": start_t,
            "end_time": end_t
        })

        # Compilar clip en Full HD 1080p
        cmd_ffmpeg = (
            f'ffmpeg -y -loop 1 -framerate 25 -i "{img_path}" -i "{audio_file}" '
            f'-vf "scale=1920:1080" -c:v libx264 -preset veryfast -crf 23 '
            f'-af "apad=pad_dur={pad_pause}" -c:a aac -b:a 128k -ar 44100 -pix_fmt yuv420p '
            f'-t {clip_dur} "{clip_file}"'
        )
        subprocess.run(cmd_ffmpeg, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        clips_list.append(clip_file)
        print(f"  [OK] Lección {idx:02d}/{total_steps:02d}: {dur:.1f}s locución didáctica -> Clip generado.")

    # Guardar clase_sync.json
    sync_path = os.path.join(manual_dir, "clase_sync.json")
    with open(sync_path, "w", encoding="utf-8") as f:
        json.dump(sync_records, f, indent=2, ensure_ascii=False)

    # Concatenar video final de la masterclass
    concat_txt = os.path.join(temp_dir, "concat_list.txt")
    with open(concat_txt, "w", encoding="utf-8") as f:
        for c in clips_list:
            clean_p = c.replace('\\', '/')
            f.write(f"file '{clean_p}'\n")

    final_video = os.path.join(manual_dir, "clase_video.mp4")
    cmd_concat = (
        f'ffmpeg -y -f concat -safe 0 -i "{concat_txt}" '
        f'-c copy "{final_video}"'
    )
    subprocess.run(cmd_concat, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"🎉 MASTERCLASS COMPLETADA: {manual_name} -> {final_video} ({current_time/60.0:.1f} min)")
