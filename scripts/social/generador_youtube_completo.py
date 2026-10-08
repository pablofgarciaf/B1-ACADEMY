import os
import glob
import json
import subprocess
import shutil
import sys
from PIL import Image, ImageDraw, ImageFont

# ==============================================================================
# GENERADOR AUTOMÁTICO DE MASTERCLASS PARA YOUTUBE
# ==============================================================================
# Este script toma TODOS los manuales, narra cada lámina, las une y agrega
# una pantalla final de "Próximamente" para llevar a la gente a tu futura web.
# ==============================================================================

# Directorios
BASE_DIR = os.path.abspath("public/Capacitacion SAP")
EXPORT_DIR = os.path.abspath("exports/youtube")
TEMP_DIR = os.path.abspath("scratch/youtube_temp")

os.makedirs(EXPORT_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

# Configuración de Outro (Cierre)
OUTRO_TEXT_AUDIO = "¡Gracias por acompañarnos en esta clase! Muy pronto lanzaremos nuestra plataforma oficial donde podrás practicar en un simulador real de SAP. Suscríbete al canal para enterarte del lanzamiento oficial."
OUTRO_IMG_PATH = os.path.join(TEMP_DIR, "outro_base.webp")

def generar_imagen_cierre():
    # Crea una imagen de cierre si no existe
    if not os.path.exists(OUTRO_IMG_PATH):
        img = Image.new('RGB', (1920, 1080), color=(10, 25, 47)) # Azul oscuro elegante
        draw = ImageDraw.Draw(img)
        
        try:
            font_title = ImageFont.truetype("arial.ttf", 80)
            font_sub = ImageFont.truetype("arial.ttf", 50)
        except IOError:
            font_title = ImageFont.load_default()
            font_sub = ImageFont.load_default()
            
        texto_principal = "¡PRÓXIMAMENTE!"
        texto_secundario = "La primera academia interactiva de SAP\nSuscríbete para no perderte el lanzamiento"
        
        # Centrar textos (Lógica básica)
        w, h = img.size
        # Usar bounding box para centrar
        t_box = draw.textbbox((0,0), texto_principal, font=font_title)
        draw.text(((w - (t_box[2]-t_box[0]))/2, 350), texto_principal, font=font_title, fill=(255, 204, 0)) # Amarillo SAP
        
        s_box = draw.textbbox((0,0), texto_secundario, font=font_sub)
        draw.text(((w - (s_box[2]-s_box[0]))/2, 500), texto_secundario, font=font_sub, fill=(255, 255, 255), align="center")
        
        img.save(OUTRO_IMG_PATH, "WEBP", quality=95)
        print("Imagen de cierre generica creada.")

def generar_clip_ffmpeg(imagen_path, audio_path, output_path):
    # Genera un video estático de 1920x1080 a partir de una imagen y un audio
    # Forzamos los fps y pixel format para que todos los videos sean concatenables
    cmd = [
        "ffmpeg", "-y", "-loop", "1", "-framerate", "30",
        "-i", imagen_path, "-i", audio_path,
        "-c:v", "libx264", "-tune", "stillimage", "-c:a", "aac", "-b:a", "192k",
        "-pix_fmt", "yuv420p", "-shortest", output_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def procesar_manual(carpeta_manual):
    nombre_manual = os.path.basename(carpeta_manual)
    json_path = os.path.join(carpeta_manual, "clase_sync.json")
    imagenes_dir = os.path.join(carpeta_manual, "Imagenes_Diapositivas")
    
    if not os.path.exists(json_path) or not os.path.exists(imagenes_dir):
        return
        
    output_final = os.path.join(EXPORT_DIR, f"{nombre_manual}.mp4")
    if os.path.exists(output_final):
        print(f"Saltando (ya existe): {nombre_manual}")
        return
        
    print(f"\nProcesando Masterclass: {nombre_manual}")
    
    with open(json_path, 'r', encoding='utf-8') as f:
        datos_sync = json.load(f)
        
    clips_generados = []
    
    # 1. Generar clip por cada diapositiva
    for item in datos_sync:
        img_name = item['image_file']
        texto = item['script_text']
        
        img_path = os.path.join(imagenes_dir, img_name)
        if not os.path.exists(img_path):
            continue
            
        audio_tmp = os.path.join(TEMP_DIR, f"audio_{img_name}.mp3")
        video_tmp = os.path.join(TEMP_DIR, f"video_{img_name}.mp4")
        
        # Generar TTS
        print(f"   Grabando voz para {img_name}...")
        subprocess.run([sys.executable, "-m", "edge_tts", "--voice", "es-CO-GonzaloNeural", "--text", texto, "--write-media", audio_tmp], check=True)
        
        # Renderizar Video
        print(f"   Renderizando video para {img_name}...")
        generar_clip_ffmpeg(img_path, audio_tmp, video_tmp)
        clips_generados.append(video_tmp)

    # 2. Generar el Outro
    outro_audio = os.path.join(TEMP_DIR, "outro.mp3")
    outro_video = os.path.join(TEMP_DIR, "outro.mp4")
    
    if not os.path.exists(outro_audio):
        print("   Grabando voz de cierre...")
        subprocess.run([sys.executable, "-m", "edge_tts", "--voice", "es-CO-GonzaloNeural", "--text", OUTRO_TEXT_AUDIO, "--write-media", outro_audio], check=True)

    
    if not os.path.exists(outro_video):
        print("   Renderizando Cierre...")
        generar_clip_ffmpeg(OUTRO_IMG_PATH, outro_audio, outro_video)
        
    clips_generados.append(outro_video)
    
    # 3. Unir todo con FFmpeg (Concatenación rápida)
    lista_path = os.path.join(TEMP_DIR, "lista_concat.txt")
    
    # Necesitamos usar rutas absolutas y escapar las barras invertidas en Windows para FFmpeg
    with open(lista_path, 'w', encoding='utf-8') as f:
        for clip in clips_generados:
            clip_format = clip.replace('\\', '/')
            f.write(f"file '{clip_format}'\n")
            
    print(f"   Uniendo {len(clips_generados)} clips en video final...")
    cmd_concat = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", lista_path,
        "-c", "copy", output_final
    ]
    subprocess.run(cmd_concat, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # 4. Limpieza de temporales
    for clip in clips_generados:
        if os.path.exists(clip) and clip != outro_video:
            os.remove(clip)
        # Limpiar audios también
        audio_name = clip.replace("video_", "audio_").replace(".mp4", ".mp3")
        if os.path.exists(audio_name) and audio_name != outro_audio:
            os.remove(audio_name)
            
    print(f"Masterclass completada: {output_final}")

def iniciar_proceso():
    generar_imagen_cierre()
    
    carpetas = glob.glob(os.path.join(BASE_DIR, "*"))
    carpetas = [c for c in carpetas if os.path.isdir(c)]
    carpetas.sort()
    
    # Para la prueba, iteramos solo el primero.
    for carpeta in carpetas[0:1]: 
        procesar_manual(carpeta)
        
    print("\nPROCESO TERMINADO. Revisa la carpeta exports/youtube/")

if __name__ == "__main__":
    iniciar_proceso()
