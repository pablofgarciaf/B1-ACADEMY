import os
import json
import asyncio
import subprocess
from mutagen.mp3 import MP3
import sys

async def process_manual(manual_dir):
    sync_file = os.path.join(manual_dir, "clase_sync.json")
    img_dir = os.path.join(manual_dir, "Imagenes_Diapositivas")
    output_video = os.path.join(manual_dir, "clase_video.mp4")

    if not os.path.exists(sync_file):
        print(f"No se encontró {sync_file}")
        return

    with open(sync_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    video_clips = []
    temp_files = []
    current_time = 0.0

    print(f"Procesando {len(data)} diapositivas para {os.path.basename(manual_dir)}...")

    for i, slide in enumerate(data):
        text = slide["script_text"]
        img_file = os.path.join(img_dir, slide["image_file"])
        
        audio_file = f"temp_audio_{i}.mp3"
        video_file = f"temp_video_{i}.mp4"
        
        print(f"  [{i+1}/{len(data)}] Generando TTS...")
        cmd_tts = f'edge-tts --text "{text}" --voice es-MX-JorgeNeural --write-media {audio_file}'
        subprocess.run(cmd_tts, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        # Obtener duración exacta
        audio_length = MP3(audio_file).info.length
        
        # Añadir un pequeño padding de silencio (0.5s) para transiciones fluidas
        total_duration = audio_length + 0.5
        
        print(f"  [{i+1}/{len(data)}] Audio dura {audio_length:.2f}s. Generando clip de video ({total_duration:.2f}s)...")
        # El padding de audio (0.5s) lo añadiremos con apad de ffmpeg para asegurar que no se corte
        cmd_ffmpeg = (
            f'ffmpeg -y -loop 1 -framerate 1 -i "{img_file}" -i {audio_file} '
            f'-c:v libx264 -tune stillimage '
            f'-af "apad=pad_dur=0.5" -c:a aac -b:a 192k -pix_fmt yuv420p '
            f'-t {total_duration} {video_file}'
        )
        subprocess.run(cmd_ffmpeg, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        slide["start_time"] = current_time
        slide["end_time"] = current_time + total_duration
        current_time += total_duration
        
        temp_files.extend([audio_file, video_file])
        video_clips.append(video_file)

    print("Concatenando clips...")
    with open("concat_list.txt", "w", encoding="utf-8") as f:
        for vf in video_clips:
            f.write(f"file '{vf}'\n")
            
    cmd_concat = f'ffmpeg -y -f concat -safe 0 -i concat_list.txt -c copy "{output_video}"'
    subprocess.run(cmd_concat, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    print("Limpiando archivos temporales...")
    for f in temp_files:
        if os.path.exists(f):
            os.remove(f)
    if os.path.exists("concat_list.txt"):
        os.remove("concat_list.txt")

    print("Guardando metadatos de sincronización...")
    with open(sync_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"¡Éxito! Video guardado en {output_video}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("manual_path", help="Ruta de la carpeta del manual")
    args = parser.parse_args()
    
    asyncio.run(process_manual(args.manual_path))
