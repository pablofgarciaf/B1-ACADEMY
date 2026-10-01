import os
import sys
import glob
import re
import json
import subprocess
from mutagen.mp3 import MP3

# Asegurar compatibilidad en consolas de Windows
try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

BASE_DIR = os.path.join("public", "Capacitacion SAP")
LOG_FILE = os.path.join("scratch", "batch_progress.log")

def log(msg):
    try:
        print(msg, flush=True)
    except Exception:
        print(msg.encode('ascii', 'replace').decode('ascii'), flush=True)
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(msg + "\n")
    except Exception:
        pass

def clean_script_text(raw_text, slide_num=1):
    # Eliminar encabezados y marcas
    text = re.sub(r'PUBLIC', '', raw_text, flags=re.IGNORECASE)
    text = re.sub(r'Diapositiva\s*\d+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'[•\*\-\#_\|]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Extraer oraciones completas y con sentido
    sentences = re.split(r'(?<=[.!?])\s+', text)
    cleaned = []
    total_chars = 0
    for s in sentences:
        s = s.strip()
        if not s or len(s) < 10:
            continue
        words = s.split()
        if len(words) < 3:
            continue
        cleaned.append(s)
        total_chars += len(s)
        if total_chars >= 320:
            break
            
    res = " ".join(cleaned)
    if len(res) < 20:
        if slide_num == 1:
            res = "Bienvenidos a esta clase práctica de SAP Business One. A continuación analizaremos los conceptos, pantallas operativas y configuraciones de este módulo."
        else:
            res = "En esta diapositiva examinamos la arquitectura de datos, flujos de trabajo y parámetros aplicables en el sistema."
    return res

def parse_slides_file(md_path):
    with open(md_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    
    parts = re.split(r'##\s*Diapositiva\s*(\d+)', content)
    slides = {}
    if len(parts) >= 3:
        for i in range(1, len(parts), 2):
            idx = int(parts[i])
            text = parts[i+1].replace('---', '').strip()
            slides[idx] = text
    return slides

def process_manual(d_name):
    manual_dir = os.path.join(BASE_DIR, d_name)
    output_video = os.path.join(manual_dir, "clase_video.mp4")
    sync_file = os.path.join(manual_dir, "clase_sync.json")
    img_dir = os.path.join(manual_dir, "Imagenes_Diapositivas")
    
    if os.path.exists(output_video) and os.path.getsize(output_video) > 100000:
        log(f"[*] {d_name} ya tiene video. Saltando.")
        return True

    # 1. Obtener imágenes
    if not os.path.exists(img_dir):
        log(f"[!] {d_name} no tiene carpeta de imagenes.")
        return False
        
    images = sorted([f for f in os.listdir(img_dir) if f.endswith(('.webp', '.png', '.jpg'))])
    if not images:
        log(f"[!] {d_name} no tiene archivos de imagen.")
        return False

    # 2. Obtener texto de diapositivas
    slides_files = glob.glob(os.path.join(manual_dir, "*_slides.md"))
    if not slides_files:
        log(f"[!] {d_name} no tiene slides.md.")
        return False
        
    slides_dict = parse_slides_file(slides_files[0])
    
    # 3. Selección completa de todas las diapositivas
    total_imgs = len(images)
    selected_indices = list(range(1, total_imgs + 1))

    log(f"--- Procesando {d_name}: TODAS las {len(selected_indices)} diapositivas disponibles ---")

    # 4. Generación de clips TTS + Video
    video_clips = []
    temp_files = []
    sync_data = []
    current_time = 0.0

    prefix = d_name[:15].replace(" ", "_")

    for order, slide_num in enumerate(selected_indices):
        img_idx = slide_num - 1
        if img_idx >= len(images):
            img_idx = len(images) - 1
        img_file_name = images[img_idx]
        img_path = os.path.join(img_dir, img_file_name)
        
        raw_text = slides_dict.get(slide_num, "")
        script_text = clean_script_text(raw_text, slide_num)
        
        audio_file = f"temp_aud_{prefix}_{order}.mp3"
        video_file = f"temp_vid_{prefix}_{order}.mp4"
        
        # Generar TTS con edge-tts
        safe_text = script_text.replace('"', '\\"').replace('$', '')
        cmd_tts = f'edge-tts --text "{safe_text}" --voice es-MX-JorgeNeural --write-media {audio_file}'
        
        try:
            subprocess.run(cmd_tts, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            audio_length = MP3(audio_file).info.length
        except Exception as e:
            log(f"    Error en TTS slide {slide_num}: {e}")
            continue

        total_duration = audio_length + 0.5

        # Renderizar clip de video en 1080p con paddings
        cmd_ffmpeg = (
            f'ffmpeg -y -loop 1 -framerate 25 -i "{img_path}" -i {audio_file} '
            f'-vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black" '
            f'-c:v libx264 -preset veryfast -crf 26 '
            f'-af "apad=pad_dur=0.5" -c:a aac -b:a 128k -ar 44100 -pix_fmt yuv420p '
            f'-t {total_duration} {video_file}'
        )
        
        try:
            subprocess.run(cmd_ffmpeg, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception as e:
            log(f"    Error en ffmpeg slide {slide_num}: {e}")
            if os.path.exists(audio_file): os.remove(audio_file)
            continue

        sync_data.append({
            "slide_index": order + 1,
            "image_file": img_file_name,
            "script_text": script_text,
            "start_time": round(current_time, 2),
            "end_time": round(current_time + total_duration, 2)
        })
        current_time += total_duration
        
        temp_files.extend([audio_file, video_file])
        video_clips.append(video_file)

    if not video_clips:
        log(f"[X] No se pudo generar ningún clip para {d_name}")
        return False

    # 5. Concatenar clips en el video final
    concat_txt = f"concat_{prefix}.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        for vf in video_clips:
            f.write(f"file '{vf}'\n")

    cmd_concat = f'ffmpeg -y -f concat -safe 0 -i {concat_txt} -c copy "{output_video}"'
    try:
        subprocess.run(cmd_concat, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception as e:
        log(f"[X] Error al concatenar {d_name}: {e}")
        return False

    # 6. Limpieza de archivos temporales
    for f in temp_files:
        if os.path.exists(f): os.remove(f)
    if os.path.exists(concat_txt): os.remove(concat_txt)

    # 7. Guardar clase_sync.json
    with open(sync_file, "w", encoding="utf-8") as f:
        json.dump(sync_data, f, indent=2, ensure_ascii=False)

    log(f"[OK] Exito: {d_name} completado ({len(sync_data)} slides, {current_time:.1f}s, video guardado).")
    return True

def main():
    skip = ["01_Revision_BUENAS", "02_Revision_MALAS_CUARENTENA", "para corregir"]
    dirs = [d for d in os.listdir(BASE_DIR) if os.path.isdir(os.path.join(BASE_DIR, d)) and d not in skip]
    dirs.sort()

    log(f"=== INICIANDO GENERACIÓN BATCH DE VIDEOS EDUCATIVOS ({len(dirs)} MANUALES) ===")
    
    total = len(dirs)
    for idx, d in enumerate(dirs, 1):
        log(f"\n[{idx}/{total}] Procesando: {d}")
        try:
            process_manual(d)
        except Exception as e:
            log(f"[ERROR FATAL] en {d}: {e}")

    log("\n=== PROCESO BATCH FINALIZADO AL 100% ===")

if __name__ == "__main__":
    main()
