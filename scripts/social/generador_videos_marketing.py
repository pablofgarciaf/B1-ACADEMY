#!/usr/bin/env python3
"""
🎬 SAP ACADEMY - GENERADOR AUTOMATIZADO DE VIDEOS PARA MARKETING & REDES SOCIALES
Produce videos de alta conversión para YouTube (16:9) y TikTok/Shorts/Reels (9:16)
utilizando las diapositivas HD, guiones en español y la voz neural de Jorge (edge-tts).

Uso:
  py -3 scripts/social/generador_videos_marketing.py --manual 1.1 --format both --max-slides 2
  py -3 scripts/social/generador_videos_marketing.py --manual 1.1 --format youtube
  py -3 scripts/social/generador_videos_marketing.py --manual 1.1 --format tiktok
"""

import argparse
import asyncio
import hashlib
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# Forzar codificación UTF-8 en consola de Windows
try:
    if sys.stdout:
        sys.stdout.reconfigure(encoding='utf-8')
    if sys.stderr:
        sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    pass

# Rutas base
ROOT = Path(__file__).resolve().parent.parent.parent
CACHE_AUDIO = ROOT / "scratch" / "marketing_audio_cache"
EXPORTS_DIR = ROOT / "exports" / "marketing"
VOZ_DEFAULT = "es-MX-JorgeNeural"
PAUSA_SLIDE = 0.5  # Pausa entre láminas (segundos)

# Intentar cargar fuentes del sistema
def get_font(size, bold=False):
    font_paths = [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return ImageFont.load_default()


# ==============================================================================
# 1. GENERACIÓN DE AUDIO NEURAL (Jorge TTS)
# ==============================================================================
async def generar_audio(texto: str, voz: str = VOZ_DEFAULT) -> Path:
    CACHE_AUDIO.mkdir(parents=True, exist_ok=True)
    h = hashlib.sha1(f"{voz}|{texto}".encode("utf-8")).hexdigest()[:16]
    mp3_path = CACHE_AUDIO / f"{h}.mp3"

    if not mp3_path.exists() or mp3_path.stat().st_size == 0:
        import edge_tts
        communicate = edge_tts.Communicate(texto, voz)
        await communicate.save(str(mp3_path))

    return mp3_path


def obtener_duracion_audio(audio_path: Path) -> float:
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "csv=p=0",
        str(audio_path)
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(res.stdout.strip())


# ==============================================================================
# 2. GENERACIÓN DE OVERLAYS GRÁFICOS (Luxury UI con Pillow)
# ==============================================================================
def crear_overlay_youtube(width=1920, height=1080) -> Path:
    """Crea una capa PNG transparente con marca de agua y banner inferior para YouTube."""
    CACHE_AUDIO.mkdir(parents=True, exist_ok=True)
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Badge superior derecho (Marca de agua moderna)
    badge_x, badge_y = width - 420, 35
    draw.rounded_rectangle(
        [badge_x, badge_y, badge_x + 380, badge_y + 55],
        radius=12,
        fill=(13, 22, 32, 220),
        outline=(234, 179, 8, 160), # Amber glow
        width=2
    )
    font_badge_bold = get_font(22, bold=True)
    font_badge_norm = get_font(20, bold=False)
    draw.text((badge_x + 20, badge_y + 14), "SAP ACADEMY", fill=(255, 255, 255, 255), font=font_badge_bold)
    draw.text((badge_x + 190, badge_y + 16), "•  sapacademy.es", fill=(234, 179, 8, 255), font=font_badge_norm)

    # 2. Banner inferior Call-To-Action
    bar_y = height - 90
    draw.rectangle([0, bar_y, width, height], fill=(11, 16, 22, 230))
    draw.line([0, bar_y, width, bar_y], fill=(234, 179, 8, 200), width=3)

    font_cta_bold = get_font(26, bold=True)
    font_cta_norm = get_font(24, bold=False)
    
    draw.text((50, bar_y + 26), "🎓 SIMULADOR INTERACTIVO GRATIS", fill=(234, 179, 8, 255), font=font_cta_bold)
    draw.text((540, bar_y + 28), "|  Aprende y practica en vivo sin instalaciones en:", fill=(220, 225, 230, 255), font=font_cta_norm)
    draw.text((1140, bar_y + 26), "https://sapacademy.es", fill=(56, 189, 248, 255), font=font_cta_bold)

    temp_path = CACHE_AUDIO / "overlay_youtube_16x9.png"
    img.save(temp_path, "PNG")
    return temp_path


def crear_frame_tiktok(slide_img_path: Path, manual_title: str, slide_num: int, total_slides: int) -> Path:
    """Compone una lámina vertical (1080x1920) estilo TikTok / Shorts."""
    canvas = Image.new("RGBA", (1080, 1920), (11, 16, 22, 255))
    draw = ImageDraw.Draw(canvas)

    # 1. Gradiente superior o Header
    draw.rectangle([0, 0, 1080, 360], fill=(15, 23, 34, 255))
    draw.line([0, 360, 1080, 360], fill=(234, 179, 8, 220), width=4)

    # Logo / Tag superior
    font_top = get_font(32, bold=True)
    draw.rounded_rectangle([320, 50, 760, 115], radius=16, fill=(234, 179, 8, 255))
    draw.text((360, 62), "SAP BUSINESS ONE", fill=(11, 16, 22, 255), font=font_top)

    # Título del módulo
    font_title = get_font(38, bold=True)
    # Acortar título si es largo
    short_title = manual_title if len(manual_title) <= 45 else manual_title[:42] + "..."
    # Centrar texto
    bbox = draw.textbbox((0, 0), short_title, font=font_title)
    w_text = bbox[2] - bbox[0]
    draw.text(((1080 - w_text) // 2, 160), short_title, fill=(255, 255, 255, 255), font=font_title)

    font_sub = get_font(26, bold=False)
    sub_text = f"Lección Práctica • Diapositiva {slide_num} de {total_slides}"
    bbox_sub = draw.textbbox((0, 0), sub_text, font=font_sub)
    w_sub = bbox_sub[2] - bbox_sub[0]
    draw.text(((1080 - w_sub) // 2, 235), sub_text, fill=(156, 163, 175, 255), font=font_sub)

    # 2. Pegar la diapositiva en el centro (con borde elegante)
    slide = Image.open(slide_img_path).convert("RGBA")
    # Redimensionar la diapositiva a 1000px de ancho manteniendo proporción
    target_w = 1000
    target_h = int(slide.height * (target_w / slide.width))
    slide_resized = slide.resize((target_w, target_h), Image.Resampling.LANCZOS)

    # Marco centrado
    pos_x = (1080 - target_w) // 2
    pos_y = 440 + (800 - target_h) // 2

    # Sombra/Borde
    draw.rounded_rectangle(
        [pos_x - 6, pos_y - 6, pos_x + target_w + 6, pos_y + target_h + 6],
        radius=14,
        fill=(234, 179, 8, 120)
    )
    canvas.paste(slide_resized, (pos_x, pos_y), slide_resized)

    # 3. Call-To-Action Inferior de Alto Impacto
    draw.rectangle([0, 1400, 1080, 1920], fill=(13, 20, 30, 255))
    draw.line([0, 1400, 1080, 1400], fill=(234, 179, 8, 180), width=3)

    # Botón brillante de llamada a la acción
    btn_box = [90, 1500, 990, 1630]
    draw.rounded_rectangle(btn_box, radius=30, fill=(234, 179, 8, 255))
    font_btn = get_font(38, bold=True)
    draw.text((150, 1540), "🚀 PRACTICA EN EL SIMULADOR", fill=(11, 16, 22, 255), font=font_btn)

    # URL destacada
    font_url = get_font(42, bold=True)
    draw.text((290, 1675), "🌐 sapacademy.es", fill=(255, 255, 255, 255), font=font_url)

    font_note = get_font(26, bold=False)
    draw.text((270, 1750), "Acceso gratuito • Clases interactivas", fill=(148, 163, 184, 255), font=font_note)

    out_path = CACHE_AUDIO / f"tiktok_frame_{slide_num}.png"
    canvas.save(out_path, "PNG")
    return out_path


def crear_outro_card(width=1920, height=1080, is_vertical=False) -> Path:
    """Pantalla final de cierre con llamada a registrarse."""
    img = Image.new("RGBA", (width, height), (10, 14, 20, 255))
    draw = ImageDraw.Draw(img)

    if not is_vertical:
        # YouTube 16:9 Outro
        font_main = get_font(56, bold=True)
        font_sub = get_font(34, bold=False)
        font_link = get_font(48, bold=True)

        draw.text((width // 2 - 400, 280), "SAP ACADEMY EN ESPAÑOL", fill=(234, 179, 8, 255), font=font_main)
        draw.text((width // 2 - 460, 390), "Domina SAP Business One 10.0 con clases y simulador real", fill=(255, 255, 255, 255), font=font_sub)
        
        # Botón central
        draw.rounded_rectangle([width // 2 - 380, 520, width // 2 + 380, 640], radius=24, fill=(234, 179, 8, 255))
        draw.text((width // 2 - 320, 555), "👉 ENTRA A: sapacademy.es", fill=(11, 16, 22, 255), font=font_link)
        
        draw.text((width // 2 - 340, 720), "• Certificación Profesional  •  120 Manuales  •  Acceso 24/7", fill=(148, 163, 184, 255), font=get_font(28))
    else:
        # TikTok 9:16 Outro
        font_main = get_font(46, bold=True)
        draw.text((150, 500), "🎓 ¿QUIERES APRENDER MÁS?", fill=(234, 179, 8, 255), font=font_main)
        draw.text((120, 620), "Entra al simulador completo de", fill=(255, 255, 255, 255), font=get_font(36))
        draw.text((220, 690), "SAP Business One en:", fill=(255, 255, 255, 255), font=get_font(36))

        draw.rounded_rectangle([100, 850, 980, 1000], radius=30, fill=(234, 179, 8, 255))
        draw.text((220, 900), "🌐 sapacademy.es", fill=(11, 16, 22, 255), font=get_font(48, bold=True))

        draw.text((240, 1120), "Regístrate gratis hoy mismo", fill=(148, 163, 184, 255), font=get_font(32))

    out_path = CACHE_AUDIO / f"outro_{'vertical' if is_vertical else 'horizontal'}.png"
    img.save(out_path, "PNG")
    return out_path


# ==============================================================================
# 3. COMPILACIÓN DE CLIPS Y RENDERIZADO CON FFMPEG
# ==============================================================================
def render_clip_horizontal(img_path: Path, overlay_path: Path, audio_path: Path, salida_path: Path):
    """Renderiza un clip 16:9 1920x1080 combinando imagen, overlay y audio."""
    dur = obtener_duracion_audio(audio_path) + PAUSA_SLIDE
    cmd = [
        "ffmpeg", "-y", "-v", "error",
        "-loop", "1", "-framerate", "25", "-i", str(img_path),
        "-loop", "1", "-framerate", "25", "-i", str(overlay_path),
        "-i", str(audio_path),
        "-filter_complex",
        f"[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black[bg];"
        f"[bg][1:v]overlay=0:0[v]",
        "-map", "[v]", "-map", "2:a",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "22", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "128k", "-ar", "44100", "-ac", "1",
        "-t", f"{dur:.3f}",
        str(salida_path)
    ]
    subprocess.run(cmd, check=True)


def render_clip_vertical(frame_path: Path, audio_path: Path, salida_path: Path):
    """Renderiza un clip 9:16 1080x1920."""
    dur = obtener_duracion_audio(audio_path) + PAUSA_SLIDE
    cmd = [
        "ffmpeg", "-y", "-v", "error",
        "-loop", "1", "-framerate", "25", "-i", str(frame_path),
        "-i", str(audio_path),
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "23", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "128k", "-ar", "44100", "-ac", "1",
        "-t", f"{dur:.3f}",
        str(salida_path)
    ]
    subprocess.run(cmd, check=True)


def concatenar_videos(lista_clips: list[Path], salida_final: Path):
    """Concatena múltiples clips MP4 en uno solo usando ffmpeg."""
    list_file = CACHE_AUDIO / "concat_list.txt"
    with open(list_file, "w", encoding="utf-8") as f:
        for clip in lista_clips:
            # ffmpeg concat demuxer usa barras normales
            p_str = str(clip).replace("\\", "/")
            f.write(f"file '{p_str}'\n")

    cmd = [
        "ffmpeg", "-y", "-v", "error",
        "-f", "concat", "-safe", "0",
        "-i", str(list_file),
        "-c", "copy",
        str(salida_final)
    ]
    subprocess.run(cmd, check=True)


# ==============================================================================
# 4. ORQUESTADOR PRINCIPAL
# ==============================================================================
async def procesar_manual(manual_id_query: str, formato: str, max_slides: int = None):
    print(f"\n======================================================================")
    print(f"🎬 PROCESANDO MANUAL: {manual_id_query} (Formato: {formato})")
    print(f"======================================================================")

    # 1. Localizar la carpeta del manual
    cap_dir = ROOT / "public" / "Capacitacion SAP"
    matched_dirs = [
        d for d in cap_dir.iterdir()
        if d.is_dir() and (manual_id_query in d.name or d.name.startswith(f"{manual_id_query}_"))
    ]

    if not matched_dirs:
        print(f"❌ Error: No se encontró ningún manual que coincida con '{manual_id_query}'.")
        return

    manual_dir = matched_dirs[0]
    manual_id = manual_dir.name
    manual_title = manual_id.replace("_", " ")
    print(f"📁 Directorio identificado: {manual_dir.name}")

    # 2. Leer clase_sync.json y diapositivas
    sync_file = manual_dir / "clase_sync.json"
    if not sync_file.exists():
        print(f"❌ Error: {sync_file} no existe.")
        return

    slides_data = json.loads(sync_file.read_text(encoding="utf-8"))
    if max_slides:
        slides_data = slides_data[:max_slides]
        print(f"ℹ️ Limitando renderizado a las primeras {len(slides_data)} diapositivas.")

    img_dir = manual_dir / "Imagenes_Diapositivas"
    total_slides = len(slides_data)

    EXPORTS_DIR.mkdir(parents=True, exist_ok=True)
    slug = manual_id.split("_")[0].replace(".", "-")

    # A. Renderizado Horizontal (YouTube 16:9)
    if formato in ["youtube", "both"]:
        print(f"\n📺 Generando versión YOUTUBE (16:9 1920x1080)...")
        overlay_yt = crear_overlay_youtube()
        clips_yt = []

        for idx, slide in enumerate(slides_data, start=1):
            img_name = slide.get("image_file", f"Slide_{idx:03d}.webp")
            img_path = img_dir / img_name
            if not img_path.exists():
                # Fallback al primer archivo encontrado
                posibles = list(img_dir.glob(f"*{idx:02d}*")) or list(img_dir.glob("*.webp"))
                img_path = posibles[0] if posibles else None

            if not img_path or not img_path.exists():
                print(f"⚠️ Saltando slide {idx}: no se encontró imagen.")
                continue

            texto = slide.get("script_text", "").strip()
            if not texto:
                texto = f"En esta diapositiva repasamos {manual_title}."

            print(f"  • [Slide {idx}/{total_slides}] Generando audio de Jorge...")
            audio_path = await generar_audio(texto)

            clip_out = CACHE_AUDIO / f"yt_clip_{idx}.mp4"
            print(f"  • [Slide {idx}/{total_slides}] Renderizando clip 16:9...")
            render_clip_horizontal(img_path, overlay_yt, audio_path, clip_out)
            clips_yt.append(clip_out)

        # Outro YouTube
        outro_img = crear_outro_card(1920, 1080, is_vertical=False)
        outro_audio = await generar_audio("Visita sapacademy.es y domina SAP Business One con nuestro simulador interactivo gratuito. ¡Te esperamos!")
        clip_outro = CACHE_AUDIO / "yt_clip_outro.mp4"
        render_clip_horizontal(outro_img, overlay_yt, outro_audio, clip_outro)
        clips_yt.append(clip_outro)

        # Concatenar
        salida_yt = EXPORTS_DIR / f"youtube_{slug}_{manual_id[:30]}.mp4"
        print(f"  🔗 Concatenando video final de YouTube...")
        concatenar_videos(clips_yt, salida_yt)
        print(f"  ✅ Video YouTube generado exitosamente: {salida_yt.name} ({(salida_yt.stat().st_size / (1024*1024)):.2f} MB)")

    # B. Renderizado Vertical (TikTok / Shorts / Reels 9:16)
    if formato in ["tiktok", "both"]:
        print(f"\n📱 Generando versión TIKTOK / SHORTS (9:16 1080x1920)...")
        clips_tt = []

        # Para Shorts/TikTok tomamos máximo 2 o 3 láminas para mantenerlo dinámico (< 60s)
        tt_slides = slides_data[:3] if len(slides_data) > 3 else slides_data

        for idx, slide in enumerate(tt_slides, start=1):
            img_name = slide.get("image_file", f"Slide_{idx:03d}.webp")
            img_path = img_dir / img_name
            if not img_path.exists():
                posibles = list(img_dir.glob(f"*{idx:02d}*")) or list(img_dir.glob("*.webp"))
                img_path = posibles[0] if posibles else None

            if not img_path:
                continue

            texto = slide.get("script_text", "").strip()
            print(f"  • [Short {idx}/{len(tt_slides)}] Generando audio de Jorge...")
            audio_path = await generar_audio(texto)

            print(f"  • [Short {idx}/{len(tt_slides)}] Componiendo frame 9:16...")
            frame_tt = crear_frame_tiktok(img_path, manual_title, idx, len(tt_slides))

            clip_tt_out = CACHE_AUDIO / f"tt_clip_{idx}.mp4"
            print(f"  • [Short {idx}/{len(tt_slides)}] Renderizando clip vertical...")
            render_clip_vertical(frame_tt, audio_path, clip_tt_out)
            clips_tt.append(clip_tt_out)

        # Outro Vertical
        outro_tt_img = crear_outro_card(1080, 1920, is_vertical=True)
        outro_tt_audio = await generar_audio("Enlace en la descripción. Practica gratis en sapacademy.es")
        clip_outro_tt = CACHE_AUDIO / "tt_clip_outro.mp4"
        render_clip_vertical(outro_tt_img, outro_tt_audio, clip_outro_tt)
        clips_tt.append(clip_outro_tt)

        # Concatenar
        salida_tt = EXPORTS_DIR / f"tiktok_shorts_{slug}_{manual_id[:30]}.mp4"
        print(f"  🔗 Concatenando video vertical final...")
        concatenar_videos(clips_tt, salida_tt)
        print(f"  ✅ Video TikTok / Shorts generado exitosamente: {salida_tt.name} ({(salida_tt.stat().st_size / (1024*1024)):.2f} MB)")

    # 3. Generar archivo de metadatos (Títulos, Copys, Hashtags y WhatsApp)
    meta_path = EXPORTS_DIR / f"copy_redes_{slug}.txt"
    copy_content = f"""========================================================================
📢 METADATOS Y COPYS DE PUBLICACIÓN — SAP ACADEMY
Manual: {manual_title}
Enlace oficial: https://sapacademy.es/manuales/{manual_id}
========================================================================

🔴 1. PARA YOUTUBE:
------------------------------------------------------------------------
TÍTULO:
{manual_title} | Curso Completo SAP Business One 10.0 (Simulador Gratis)

DESCRIPCIÓN:
Aprende {manual_title} paso a paso en SAP Business One versión 10.0.
🎯 Practica este proceso en vivo en nuestro simulador interactivo gratuito:
👉 https://sapacademy.es/manuales/{manual_id}

Temas cubiertos:
• Navegación y conceptos clave de SAP Business One.
• Procedimiento operativo paso a paso.
• Simulador sin necesidad de instalar software en tu ordenador.
• Examen técnico de validación.

🌐 Visita la academia oficial: https://sapacademy.es
#SAP #SAPBusinessOne #ERP #SAPB1 #ConsultorSAP #Contabilidad #Logistica

------------------------------------------------------------------------
📱 2. PARA TIKTOK / YOUTUBE SHORTS / INSTAGRAM REELS:
------------------------------------------------------------------------
HOOK / PRIMERA FRASE:
"¿Cómo funciona {manual_title} en SAP Business One?"

COPY:
Domina este proceso en SAP B1 en menos de 1 minuto 🚀 
¿Quieres practicarlo tú mismo? Entra a nuestro simulador interactivo 100% GRATIS en:
👉 https://sapacademy.es

#sap #sapbusinessone #erp #consultoria #aprendeentiktok #trabajo #educacion

------------------------------------------------------------------------
💬 3. PARA ESTADOS DE WHATSAPP / CANALES DE DIFUSIÓN:
------------------------------------------------------------------------
"Hola a todos 👋 Les comparto este tutorial rápido sobre {manual_title} en SAP Business One. 
Pueden probar el simulador interactivo y hacer la práctica gratis desde el navegador aquí:
https://sapacademy.es/manuales/{manual_id}"
========================================================================
"""
    meta_path.write_text(copy_content, encoding="utf-8")
    print(f"\n📝 Copys y metadatos guardados en: {meta_path.name}")
    print(f"✨ ¡Todo el paquete de marketing ha sido generado con éxito en exports/marketing/!")


# ==============================================================================
# CLI Entrypoint
# ==============================================================================
def main():
    parser = argparse.ArgumentParser(description="Generador de videos de marketing para SAP Academy")
    parser.add_argument("--manual", help="Identificador del manual (ej: 1.1 o 1.1_Introduccion_a_SAP_Business_One)")
    parser.add_argument("--all", action="store_true", help="Procesar todos los manuales de la academia en lote")
    parser.add_argument("--limit", type=int, default=None, help="Límite de manuales a procesar cuando se usa --all")
    parser.add_argument("--format", choices=["youtube", "tiktok", "both"], default="both", help="Formato de salida")
    parser.add_argument("--max-slides", type=int, default=None, help="Máximo de diapositivas a incluir por video")
    args = parser.parse_args()

    if args.all:
        cap_dir = ROOT / "public" / "Capacitacion SAP"
        manual_dirs = sorted([d for d in cap_dir.iterdir() if d.is_dir() and (d / "clase_sync.json").exists()])
        if args.limit:
            manual_dirs = manual_dirs[:args.limit]
        print(f"🚀 Iniciando procesamiento masivo de {len(manual_dirs)} manuales...")
        for d in manual_dirs:
            asyncio.run(procesar_manual(d.name, args.format, args.max_slides))
    elif args.manual:
        asyncio.run(procesar_manual(args.manual, args.format, args.max_slides))
    else:
        parser.print_help()


if __name__ == "__main__":
    main()

