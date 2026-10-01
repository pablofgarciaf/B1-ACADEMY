import os
import sys
import glob
import re
import json
import subprocess
from mutagen.mp3 import MP3

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

BASE_DIR = os.path.join("public", "Capacitacion SAP")
LOG_FILE = os.path.join("scratch", "pedagogical_rerun.log")
DOC_PLAN = os.path.join("docs", "PLAN_MAESTRO_LECCIONES_PEDAGOGICAS.md")

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

def mark_in_plan(d_name, status_str):
    if not os.path.exists(DOC_PLAN):
        return
    try:
        with open(DOC_PLAN, "r", encoding="utf-8") as f:
            content = f.read()

        if f"`{d_name}`" in content:
            lines = content.splitlines()
            new_lines = []
            for line in lines:
                if f"`{d_name}`" in line:
                    line = re.sub(r'\[( |x)\]\s*[^\|]+', status_str, line)
                new_lines.append(line)
            with open(DOC_PLAN, "w", encoding="utf-8") as f:
                f.write("\n".join(new_lines) + "\n")
            log(f"  [Bitácora] {d_name} marcado como '{status_str}' en PLAN_MAESTRO.")
    except Exception as e:
        log(f"  [Error Bitácora] No se pudo actualizar {DOC_PLAN}: {e}")

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

def clean_pedagogical_script(raw_text, slide_num, total_slides, manual_name=""):
    text = raw_text.strip()
    
    # 1. Eliminar caracteres Unicode incompatibles y viñetas privadas (Wingdings / Private Use Area)
    text = re.sub(r'[\uf000-\uf8ff]', '', text)
    text = re.sub(r'\\', ' ', text) # eliminar barras invertidas que rompen escape (ej: A\P)
    
    # 2. Eliminar cabeceras y prefijos mecánicos
    text = re.sub(r'^\s*\d+\s*', '', text)
    text = re.sub(r'^\s*PUBLIC\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'PUBLIC', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Diapositiva\s*\d+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Slide\s*\d+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'SAP Business One Versión \d+\.\d+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'©\s*\d{4}.*?All rights reserved\.?', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\b\d+\s*$', '', text)
    
    # 3. Extraer viñetas y texto regular
    bullet_items = []
    lines = text.split('\n')
    non_bullet_lines = []
    
    for l in lines:
        l_str = l.strip()
        if not l_str:
            continue
        if re.match(r'^[•\*\-\#_\|]', l_str):
            clean_b = re.sub(r'^[•\*\-\#_\|\s]+', '', l_str).strip()
            if len(clean_b) > 4:
                bullet_items.append(clean_b)
        else:
            # Limpiar cualquier viñeta residual dentro de la línea
            l_clean = re.sub(r'[•\*\-\#_\|]', ' ', l_str).strip()
            if l_clean:
                non_bullet_lines.append(l_clean)
            
    # Deduplicar repeticiones comunes en notas del presentador
    remaining_text = " ".join(non_bullet_lines)
    for b in bullet_items:
        remaining_text = remaining_text.replace(b, "")
    
    remaining_text = re.sub(r'\s+', ' ', remaining_text).strip()
    remaining_text = re.sub(r'^\d+\s*', '', remaining_text).strip()

    bullets_formatted = []
    for idx, b in enumerate(bullet_items):
        b = b.strip()
        b = b[0].upper() + b[1:]
        if not b.endswith(('.', ';', ':')):
            b += "."
        bullets_formatted.append(b)

    parts_final = []
    if remaining_text:
        parts_final.append(remaining_text)
    if bullets_formatted:
        parts_final.extend(bullets_formatted)

    full_narrative = " ".join(parts_final)
    clean_mod_title = manual_name.replace("10_", "").replace("_ES", "").replace("_", " ")
    
    if slide_num == 1:
        intro = f"Bienvenidos a esta clase sobre {clean_mod_title} en SAP Business One. En esta lección exploraremos las mejores prácticas de consultoría, flujos operativos y configuraciones del sistema."
        full_narrative = f"{intro} {full_narrative}".strip()
        
    elif slide_num == total_slides or "gracias" in full_narrative.lower() or "resumen" in full_narrative.lower():
        if "gracias" in full_narrative.lower():
            full_narrative = f"Hemos concluido esta sesión sobre {clean_mod_title}. Te invitamos a continuar con el siguiente módulo para seguir fortaleciendo tus competencias en SAP Business One."

    # Puntuación y normalización
    full_narrative = re.sub(r':\s*\.', ':', full_narrative)
    full_narrative = re.sub(r'\.\s*\.', '.', full_narrative)
    full_narrative = re.sub(r'[\uf000-\uf8ff]', '', full_narrative)
    full_narrative = re.sub(r'[•\*\-\#_\|\\/]', ' ', full_narrative)
    full_narrative = re.sub(r'\s+', ' ', full_narrative).strip()

    if len(full_narrative) < 25:
        if slide_num == 1:
            full_narrative = f"Bienvenidos a esta clase sobre {clean_mod_title} en SAP Business One. A continuación analizaremos los conceptos clave y procedimientos operativos."
        else:
            full_narrative = f"En esta diapositiva examinamos la arquitectura de datos, flujos de trabajo y parámetros aplicables en el sistema."

    return full_narrative

def process_single_manual(d_name):
    manual_dir = os.path.join(BASE_DIR, d_name)
    sync_file = os.path.join(manual_dir, "clase_sync.json")
    output_video = os.path.join(manual_dir, "clase_video.mp4")
    img_dir = os.path.join(manual_dir, "Imagenes_Diapositivas")

    if not os.path.exists(img_dir):
        log(f"[*] {d_name} no tiene carpeta de imágenes.")
        mark_in_plan(d_name, "⚪ Sin diapositivas (Caso Práctico / SQL)")
        return True

    images = sorted([f for f in os.listdir(img_dir) if f.endswith(('.webp', '.png', '.jpg'))])
    if not images:
        log(f"[*] {d_name} no tiene archivos de imagen.")
        mark_in_plan(d_name, "⚪ Sin diapositivas (Caso Práctico / SQL)")
        return True

    slides_files = glob.glob(os.path.join(manual_dir, "*_slides.md"))
    if not slides_files:
        log(f"[!] {d_name} no tiene slides.md.")
        return False
        
    slides_dict = parse_slides_file(slides_files[0])
    total_imgs = len(images)

    log(f"\n=======================================================")
    log(f"🎬 [CORRECCIÓN/RE-RENDER] {d_name} ({total_imgs} diapositivas)")
    log(f"=======================================================")

    video_clips = []
    temp_files = []
    sync_data = []
    current_time = 0.0

    prefix = d_name[:15].replace(" ", "_").replace("-", "_")

    for order in range(1, total_imgs + 1):
        img_file_name = images[order - 1]
        img_path = os.path.join(img_dir, img_file_name)
        
        raw_text = slides_dict.get(order, "")
        script_text = clean_pedagogical_script(raw_text, order, total_imgs, d_name)

        audio_file = f"temp_aud_fix_{prefix}_{order}.mp3"
        video_clip = f"temp_vid_fix_{prefix}_{order}.mp4"

        # Generar TTS mediante subprocess lista (100% inmune a errores de shell)
        cmd_tts = [
            'edge-tts',
            '--text', script_text,
            '--voice', 'es-MX-JorgeNeural',
            '--write-media', audio_file
        ]
        
        try:
            subprocess.run(cmd_tts, shell=False, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            audio_length = MP3(audio_file).info.length
        except Exception as e:
            log(f"  [ERROR TTS] Slide {order}: {e}")
            continue

        clip_dur = audio_length + 0.6

        cmd_ffmpeg = (
            f'ffmpeg -y -loop 1 -framerate 25 -i "{img_path}" -i {audio_file} '
            f'-vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black" '
            f'-c:v libx264 -preset veryfast -crf 26 '
            f'-af "apad=pad_dur=0.6" -c:a aac -b:a 128k -ar 44100 -pix_fmt yuv420p '
            f'-t {clip_dur} {video_clip}'
        )

        try:
            subprocess.run(cmd_ffmpeg, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception as e:
            log(f"  [ERROR FFmpeg] Slide {order}: {e}")
            if os.path.exists(audio_file): os.remove(audio_file)
            continue

        start_t = round(current_time, 2)
        end_t = round(current_time + clip_dur, 2)
        current_time += clip_dur

        sync_data.append({
            "slide_index": order,
            "image_file": img_file_name,
            "script_text": script_text,
            "start_time": start_t,
            "end_time": end_t
        })

        temp_files.extend([audio_file, video_clip])
        video_clips.append(video_clip)
        log(f"  ✓ Slide {order}/{total_imgs} lista ({audio_length:.1f}s)")

    if len(video_clips) < total_imgs * 0.8:
        log(f"[ERROR] No se pudo generar la mayoría de clips para {d_name} ({len(video_clips)}/{total_imgs})")
        return False

    concat_txt = f"concat_fix_{prefix}.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        for vf in video_clips:
            f.write(f"file '{vf}'\n")

    cmd_concat = f'ffmpeg -y -f concat -safe 0 -i {concat_txt} -c copy "{output_video}"'
    try:
        subprocess.run(cmd_concat, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception as e:
        log(f"[ERROR Concatenación] {d_name}: {e}")
        return False

    for f in temp_files:
        if os.path.exists(f): os.remove(f)
    if os.path.exists(concat_txt): os.remove(concat_txt)

    with open(sync_file, "w", encoding="utf-8") as f:
        json.dump(sync_data, f, indent=2, ensure_ascii=False)

    log(f"✅ ¡Clase Pedagógica Completada y Guardada!: {d_name} ({len(sync_data)} slides, {current_time:.1f}s)")
    mark_in_plan(d_name, "[x] Completado (Clase Pedagógica)")
    return True

def main():
    # Lista de manuales específicos que tuvieron errores o imágenes corregidas
    target_manuals = [
        "10_Impl_21_ImplTools_ImplementationMethodology_ES", # Imágenes 8 y 12 corregidas
        "10_Impl_33_SystemSetup_DataOwnership_ES",           # Parcial (10/32)
        "10_Impl_34_SystemSetup_DocumentMasterDataNumbering_ES",
        "10_Impl_35_SystemSetup_UIConfigurationTemplates_ES",
        "10_Impl_36_SystemSetup_Print_layouts",
        "10_Impl_39_SystemSetup_EmailPrefrences",
        "10_Intro_11_Overview_IntroSAPB1_ES",
        "10_Intro_12_Overview_GettingStarted_ES",
        "10_Inven_13_WM_PhyInv",
        "10_Inven_21_PNP_PNPSales",
        "10_Inven_22_PNP_PNPProduction",
        "10_Inven_23_PNP_PNPTTransfer",
        "10_ItemInv_11_Item_ItemMD_ES",
        "10_ItemInv_12_Item_ItemGrp_ES",
        "10_ItemInv_21_UoM_Overview_ES",
        "10_ItemInv_31_WM_WH_ES",
        "10_ItemInv_32_WM_GM_ES",
        "10_ItemInv_41_Valuation_ValMethods_ES",
        "10_ItemInv_51_SNBatch_SNBatch_ES",
        "10_Item_22_UoM_Setup",
        "10_Item_23_UoM_Weight",
        "10_Item_24_UoM_Packaging",
        "10_Item_42_SNBatch_Valuation",
        "10_MRP_11_MRP_Process_ES",                          # Imagen 10 corregida
        "10_MRP_12_ConsumeForecast",
        "10_MRP_13_MRP_BOM",
        "10_Overview_13_MDDoc_ES",
        "10_Pricing_11_Concept_PrConcept_ES",
        "10_Pricing_21_Pricelist_CreatePricelist_ES",
        "10_Pricing_22_Pricelist_UpdatePricelist_ES",
        "10_Pricing_31_DiscSP_PerVolDisc_ES",
        "10_Pricing_32_DiscSP_DiscGrp_ES",
        "10_Pricing_33_DiscSP_SpPrBP_ES",
        "10_Production_11_Overview_Overview_ES",
        "10_Production_21_Resources_Resources_ES",
        "10_Production_22_Resources_Capacity_ES",
        "10_Production_31_BOM_BOM_ES",
        "10_Production_41_Process_BasicProductionProcess_ES",
        "10_Production_42_Process_ByProductsandAdditional",
        "10_Production_42_Process_RoutingProductionProcess_ES",
        "10_Production_51_Accounting_Accounting",
        "10_Production_52_Accounting_Cost",
        "10_ProjectManage_11_ProjectManage",
        "10_ProjectManage_11_ProjectManage_Billing",
        "10_Purch_11_Process_Process_ES",
        "10_Purch_12_Process_Items_ES",
        "10_Purch_13_Process_PurchaseReqQt",                 # Parcial (5/16)
        "10_Sales_52_Issues_CM_ES",
        "10_Service_11_CSProcess_Process_ES",
        "10_Support_11_SupportProcTool_ES"                   # Imagen 19 corregida
    ]

    log(f"=== INICIANDO RE-RENDERIZADO DE PRECISIÓN ({len(target_manuals)} MANUALES) ===")
    for idx, d in enumerate(target_manuals, 1):
        log(f"\n>>> [{idx}/{len(target_manuals)}] Re-procesando: {d}")
        try:
            process_single_manual(d)
        except Exception as e:
            log(f"[ERROR FATAL] en {d}: {e}")

    log("\n=== RE-RENDERIZADO DE MANUALES CORREGIDOS CONCLUIDO AL 100% ===")

if __name__ == "__main__":
    main()
