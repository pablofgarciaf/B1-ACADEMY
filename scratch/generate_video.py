import os
import re
import asyncio
import subprocess

MANUAL_DIR = r"public\Capacitacion SAP\10_Intro_11_Overview_IntroSAPB1_ES"
MD_PATH = os.path.join(MANUAL_DIR, "10_Intro_11_Overview_IntroSAPB1_ES_slides.md")
IMG_DIR = os.path.join(MANUAL_DIR, "Imagenes_Diapositivas")
OUTPUT_VIDEO = os.path.join(MANUAL_DIR, "clase_video.mp4")

async def main():
    # Read markdown
    with open(MD_PATH, "r", encoding="utf-8", errors="ignore") as f:
        md = f.read()
    
    slides = re.split(r'## Diapositiva \d+', md)[1:]
    
    # Get images (sorted)
    images = sorted([f for f in os.listdir(IMG_DIR) if f.endswith(('.png', '.jpg', '.webp'))])
    
    video_clips = []
    
    # Vamos a crear el video con las diapositivas 1, 2, 3, 4 y 6 (para evitar las muy largas de texto puro en el demo)
    slides_to_process = [0, 1, 2, 3, 5]
    
    temp_files = []
    
    for i in slides_to_process:
        if i >= len(slides) or i >= len(images):
            continue
            
        text = slides[i].replace('---', '').strip()
        # Limpiar un poco el texto para el locutor
        text = re.sub(r'PUBLIC.*?:', '', text)
        text = text.replace('\n', ' ').replace('"', "'")
        
        audio_file = f"temp_audio_{i}.mp3"
        img_file = os.path.join(IMG_DIR, images[i])
        video_file = f"temp_video_{i}.mp4"
        
        print(f"Generando audio para diapositiva {i+1}...")
        # Generar TTS
        cmd_tts = f'edge-tts --text "{text}" --voice es-MX-JorgeNeural --write-media {audio_file}'
        subprocess.run(cmd_tts, shell=True, check=True)
        
        print(f"Generando video para diapositiva {i+1}...")
        # Generar video uniendo imagen y audio
        cmd_ffmpeg = (
            f'ffmpeg -y -loop 1 -framerate 1 -i "{img_file}" -i {audio_file} '
            f'-c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p '
            f'-shortest {video_file}'
        )
        # Ocultar salida de ffmpeg para no saturar consola
        subprocess.run(cmd_ffmpeg, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        temp_files.append(video_file)
        temp_files.append(audio_file)
        video_clips.append(video_file)
    
    # Concatenar
    with open("concat_list.txt", "w", encoding="utf-8") as f:
        for vf in video_clips:
            f.write(f"file '{vf}'\n")
            
    print("Concatenando en video final...")
    cmd_concat = f'ffmpeg -y -f concat -safe 0 -i concat_list.txt -c copy "{OUTPUT_VIDEO}"'
    subprocess.run(cmd_concat, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Limpiar temporales
    for f in temp_files:
        if os.path.exists(f):
            os.remove(f)
    if os.path.exists("concat_list.txt"):
        os.remove("concat_list.txt")
        
    print(f"Video final generado exitosamente en: {OUTPUT_VIDEO}")

if __name__ == "__main__":
    asyncio.run(main())
