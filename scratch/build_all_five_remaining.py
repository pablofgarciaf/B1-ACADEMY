# -*- coding: utf-8 -*-
"""
Generador Maestro A+ de Clases Magistrales para los 5 manuales CS restantes:
1. CSI08_Query_Practice
2. CSL01_Introduction_Solution_ES
3. CSL01_Introduction_ES
4. CSL02_Procurement_Process_Solution_ES
5. CSL02_Procurement_Process_ES
"""

import os
import sys
import json
import subprocess
from PIL import Image, ImageDraw, ImageFont

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

BASE_DIR = r"C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP"
TEMP_BASE = r"C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\scratch\temp_build_all"
os.makedirs(TEMP_BASE, exist_ok=True)

FONT_BOLD = r"C:\Windows\Fonts\arialbd.ttf"
FONT_REGULAR = r"C:\Windows\Fonts\arial.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

font_title = get_font(FONT_BOLD, 22)
font_badge = get_font(FONT_BOLD, 17)

def render_slide_image(capture_path, badge_text, out_path):
    W, H = 1920, 1080
    canvas = Image.new('RGB', (W, H), (11, 16, 27))
    draw = ImageDraw.Draw(canvas)

    # Top Header Bar
    draw.rectangle([0, 0, W, 72], fill=(15, 23, 42))
    draw.line([0, 72, W, 72], fill=(217, 119, 6), width=3)

    # Academy Branding
    draw.text((45, 24), "B1 ACADEMY • LABORATORIO OFICIAL SAP BUSINESS ONE 10.0 (HANA)", font=font_title, fill=(248, 250, 252))

    # Right Badge
    bbox = font_badge.getbbox(badge_text)
    bw = bbox[2] - bbox[0] + 32
    bx = W - bw - 45
    draw.rounded_rectangle([bx, 15, W - 45, 57], radius=6, fill=(30, 58, 138), outline=(59, 130, 246))
    draw.text((bx + 16, 24), badge_text, font=font_badge, fill=(224, 231, 255))

    # Cargar captura real
    if not os.path.exists(capture_path):
        print(f"[!] No existe captura: {capture_path}")
        return False

    screenshot = Image.open(capture_path).convert("RGB")
    sw, sh = screenshot.size

    max_w = W - 120 # 1800
    max_h = H - 95 - 45 # 940

    ratio = min(max_w / sw, max_h / sh)
    target_w = int(sw * ratio)
    target_h = int(sh * ratio)

    scaled_shot = screenshot.resize((target_w, target_h), Image.Resampling.LANCZOS)

    pos_x = (W - target_w) // 2
    pos_y = 95 + (max_h - target_h) // 2

    pad = 3
    draw.rounded_rectangle([pos_x - pad, pos_y - pad, pos_x + target_w + pad, pos_y + target_h + pad], radius=6, outline=(51, 65, 85), width=2)
    canvas.paste(scaled_shot, (pos_x, pos_y))
    canvas.save(out_path, "WEBP", quality=95)
    return True

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
        print(f"Error ffprobe {audio_path}: {e}")
        return 5.0

def process_manual(manual_name, steps_data):
    manual_dir = os.path.join(BASE_DIR, manual_name)
    slides_dir = os.path.join(manual_dir, "Imagenes_Diapositivas")
    os.makedirs(slides_dir, exist_ok=True)
    temp_dir = os.path.join(TEMP_BASE, manual_name[:12])
    os.makedirs(temp_dir, exist_ok=True)

    print(f"\n==================================================================")
    print(f"🚀 INICIANDO: {manual_name} ({len(steps_data)} pasos útiles)")
    print(f"==================================================================")

    # Limpiar diapositivas previas
    for f in os.listdir(slides_dir):
        if f.endswith(".webp") or f.endswith(".png"):
            try:
                os.remove(os.path.join(slides_dir, f))
            except Exception:
                pass

    clips_list = []
    current_time = 0.0
    sync_records = []
    total_steps = len(steps_data)

    for step in steps_data:
        idx = step["slide_index"]
        capture_path = step["capture_path"]
        badge_text = step["badge_title"]
        script_text = step["script_text"]
        step_guide = step["step_guide"]

        out_img_name = f"Slide_{idx:02d}.webp"
        out_img_path = os.path.join(slides_dir, out_img_name)

        # 1. Renderizar lámina 1080p
        render_slide_image(capture_path, badge_text, out_img_path)

        # 2. Generar locución
        audio_file = os.path.join(temp_dir, f"aud_{idx:02d}.mp3")
        clip_file = os.path.join(temp_dir, f"clip_{idx:02d}.mp4")
        clean_text = script_text.replace('"', '').replace('$', '').replace('\n', ' ')

        cmd_tts = f'edge-tts --text "{clean_text}" --voice es-MX-JorgeNeural --write-media "{audio_file}"'
        subprocess.run(cmd_tts, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        dur = get_audio_duration(audio_file)
        pad_pause = 0.6
        clip_dur = dur + pad_pause

        start_t = round(current_time, 3)
        current_time += clip_dur
        end_t = round(current_time, 3)

        sync_records.append({
            "slide_index": idx,
            "image_file": out_img_name,
            "script_text": script_text,
            "step_guide": step_guide,
            "start_time": start_t,
            "end_time": end_t
        })

        # 3. Compilar clip 1080p
        cmd_ffmpeg = (
            f'ffmpeg -y -loop 1 -framerate 25 -i "{out_img_path}" -i "{audio_file}" '
            f'-vf "scale=1920:1080" -c:v libx264 -preset veryfast -crf 23 '
            f'-af "apad=pad_dur={pad_pause}" -c:a aac -b:a 128k -ar 44100 -pix_fmt yuv420p '
            f'-t {clip_dur} "{clip_file}"'
        )
        subprocess.run(cmd_ffmpeg, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        clips_list.append(clip_file)
        print(f"  [OK] Paso {idx:02d}/{total_steps:02d}: {dur:.1f}s locución -> Clip listo.")

    # 4. Guardar clase_sync.json
    sync_path = os.path.join(manual_dir, "clase_sync.json")
    with open(sync_path, "w", encoding="utf-8") as f:
        json.dump(sync_records, f, indent=2, ensure_ascii=False)

    # 5. Concatenar video final
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
    print(f"🎉 COMPLETADO: {manual_name} -> {final_video} ({current_time/60.0:.1f} min)")

print("Script maestro de compilación preparado.")
