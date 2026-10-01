# -*- coding: utf-8 -*-
"""
Generador Maestro de Láminas Widescreen 16:9 (1920x1080) para los 6 manuales CS
"""

import os
import json
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = r"C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP"
FONT_BOLD = r"C:\Windows\Fonts\arialbd.ttf"
FONT_REGULAR = r"C:\Windows\Fonts\arial.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

font_title = get_font(FONT_BOLD, 34)
font_subtitle = get_font(FONT_BOLD, 22)
font_body = get_font(FONT_REGULAR, 19)
font_bold_sm = get_font(FONT_BOLD, 17)
font_tag = get_font(FONT_BOLD, 15)
font_path = get_font(FONT_REGULAR, 16)

def create_widescreen_slide(manual_folder, slide_num, total_slides, title, subtitle, menu_path, bullets, expected, capture_path, output_filename, badge_name):
    w, h = 1920, 1080
    im = Image.new("RGB", (w, h), (11, 16, 29))
    draw = ImageDraw.Draw(im)

    # 1. Barra superior corporativa
    draw.rectangle([0, 0, w, 65], fill=(15, 23, 42))
    draw.line([0, 65, w, 65], fill=(30, 41, 59), width=2)
    draw.text((60, 22), "B1 ACADEMY • LABORATORIO PRÁCTICO OFICIAL SAP BUSINESS ONE 10.0 (HANA)", font=font_tag, fill=(217, 119, 6))
    
    badge_w = 380
    draw.rounded_rectangle([w - badge_w - 60, 16, w - 60, 48], radius=6, fill=(30, 58, 138))
    draw.text((w - badge_w - 40, 24), badge_name[:36], font=font_tag, fill=(191, 219, 254))

    # 2. Panel Izquierdo: Contenido Pedagógico
    left_x = 60
    top_y = 100
    
    # Badge de Paso
    step_str = f"PASO {slide_num:02d} DE {total_slides:02d}"
    draw.rounded_rectangle([left_x, top_y, left_x + 160, top_y + 32], radius=6, fill=(217, 119, 6))
    draw.text((left_x + 14, top_y + 7), step_str, font=font_bold_sm, fill=(0, 0, 0))

    # Ruta de Menú
    draw.rounded_rectangle([left_x + 175, top_y, left_x + 700, top_y + 32], radius=6, fill=(15, 23, 42), outline=(51, 65, 85))
    clean_menu = menu_path[:52] if menu_path else "Menú Principal"
    draw.text((left_x + 190, top_y + 7), f"RUTA: {clean_menu}", font=font_path, fill=(148, 163, 184))

    # Título Principal (wrap si es largo)
    title_words = title.split(' ')
    t_lines = []
    curr = []
    for w_item in title_words:
        if len(" ".join(curr + [w_item])) <= 34:
            curr.append(w_item)
        else:
            t_lines.append(" ".join(curr))
            curr = [w_item]
    if curr:
        t_lines.append(" ".join(curr))
        
    t_y = top_y + 50
    for tl in t_lines[:2]:
        draw.text((left_x, t_y), tl, font=font_title, fill=(255, 255, 255))
        t_y += 40

    draw.text((left_x, t_y + 5), subtitle[:45], font=font_subtitle, fill=(56, 189, 248))

    # Separador
    sep_y = t_y + 45
    draw.line([left_x, sep_y, left_x + 680, sep_y], fill=(30, 41, 59), width=2)

    # Viñetas pedagógicas
    bullet_y = sep_y + 25
    for b in bullets[:4]:
        draw.ellipse([left_x + 5, bullet_y + 6, left_x + 15, bullet_y + 16], fill=(217, 119, 6))
        words = b.split(' ')
        lines = []
        curr_line = []
        for word in words:
            if len(" ".join(curr_line + [word])) <= 44:
                curr_line.append(word)
            else:
                lines.append(" ".join(curr_line))
                curr_line = [word]
        if curr_line:
            lines.append(" ".join(curr_line))
            
        for line in lines:
            draw.text((left_x + 28, bullet_y), line, font=font_body, fill=(226, 232, 240))
            bullet_y += 26
        bullet_y += 16

    # Tarjeta de Resultado Esperado al Pie
    card_y = 900
    draw.rounded_rectangle([left_x, card_y, left_x + 680, card_y + 110], radius=10, fill=(6, 78, 59), outline=(16, 185, 129), width=1)
    draw.text((left_x + 20, card_y + 15), "RESULTADO TÉCNICO ESPERADO:", font=font_bold_sm, fill=(167, 243, 208))
    
    exp_words = expected.split(' ')
    exp_lines = []
    c_exp = []
    for ew in exp_words:
        if len(" ".join(c_exp + [ew])) <= 50:
            c_exp.append(ew)
        else:
            exp_lines.append(" ".join(c_exp))
            c_exp = [ew]
    if c_exp:
        exp_lines.append(" ".join(c_exp))
        
    ey = card_y + 42
    for el in exp_lines[:2]:
        draw.text((left_x + 20, ey), el, font=font_body, fill=(255, 255, 255))
        ey += 25

    # 3. Panel Derecho: Captura Real de SAP B1 Ampliada
    right_x = 780
    right_w = 1080
    right_h = 920
    panel_y = 90

    # Ventana Fiori Dark
    draw.rounded_rectangle([right_x, panel_y, right_x + right_w, panel_y + right_h], radius=12, fill=(15, 23, 42), outline=(59, 130, 246), width=2)
    draw.rounded_rectangle([right_x, panel_y, right_x + right_w, panel_y + 42], radius=12, fill=(30, 41, 59))
    draw.rectangle([right_x, panel_y + 30, right_x + right_w, panel_y + 42], fill=(30, 41, 59))
    
    # Controles de ventana
    draw.ellipse([right_x + 18, panel_y + 14, right_x + 30, panel_y + 26], fill=(239, 68, 68))
    draw.ellipse([right_x + 38, panel_y + 14, right_x + 50, panel_y + 26], fill=(245, 158, 11))
    draw.ellipse([right_x + 58, panel_y + 14, right_x + 70, panel_y + 26], fill=(16, 185, 129))
    draw.text((right_x + 85, panel_y + 11), f"SAP Business One 10.0 — {title[:45]}", font=font_bold_sm, fill=(203, 213, 225))

    # Cargar y pegar la captura
    if capture_path and os.path.exists(capture_path):
        try:
            cap_img = Image.open(capture_path).convert("RGBA")
            max_cap_w = right_w - 40
            max_cap_h = right_h - 75
            
            cap_ratio = cap_img.width / cap_img.height
            target_ratio = max_cap_w / max_cap_h
            
            if cap_ratio > target_ratio:
                new_w = max_cap_w
                new_h = int(max_cap_w / cap_ratio)
            else:
                new_h = max_cap_h
                new_w = int(max_cap_h * cap_ratio)
                
            cap_resized = cap_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            paste_x = right_x + 20 + (max_cap_w - new_w) // 2
            paste_y = panel_y + 55 + (max_cap_h - new_h) // 2
            
            im.paste(cap_resized, (paste_x, paste_y), cap_resized if cap_resized.mode == 'RGBA' else None)
        except Exception as e:
            print(f"Error pegando imagen {capture_path}: {e}")

    # Guardar en WebP
    target_img_dir = os.path.join(BASE_DIR, manual_folder, "Imagenes_Diapositivas")
    os.makedirs(target_img_dir, exist_ok=True)
    out_path = os.path.join(target_img_dir, output_filename)
    im.save(out_path, "WEBP", quality=95)

def process_manual(folder_name, manual_num, badge_name):
    sync_file = os.path.join(BASE_DIR, folder_name, "clase_sync.json")
    if not os.path.exists(sync_file):
        print(f"[!] No existe clase_sync.json para {folder_name}")
        return

    with open(sync_file, "r", encoding="utf-8") as f:
        sync_data = json.load(f)

    captures_dir = os.path.join(BASE_DIR, "Recursos_Audiovisuales", folder_name, "Capturas_Originales_PDF")
    available_captures = []
    if os.path.exists(captures_dir):
        available_captures = sorted([f for f in os.listdir(captures_dir) if f.endswith(('.png', '.jpeg', '.jpg'))])

    total = len(sync_data)
    print(f"\nGenerando {total} láminas 16:9 para {folder_name}...")

    clean_name = folder_name.replace(" ", "_").replace("-", "_")

    for idx, slide in enumerate(sync_data):
        slide_num = slide["slide_index"]
        sg = slide.get("step_guide", {})
        title = sg.get("title", f"Paso {slide_num}")
        subtitle = "Instrucciones de Laboratorio SAP B1"
        menu_path = sg.get("menu_path", "Menú Principal")
        bullets = sg.get("instructions", [slide.get("script_text", "")[:120]])
        expected = sg.get("expected_output", "Acción completada y validada en el sistema.")
        
        # Seleccionar la captura más relevante
        cap_file = None
        if available_captures:
            # Buscar captura que coincida con el número de slide o usar cíclica
            matched = [c for c in available_captures if f"slide_{slide_num}_" in c]
            if matched:
                cap_file = os.path.join(captures_dir, matched[0])
            else:
                cap_file = os.path.join(captures_dir, available_captures[(slide_num - 1) % len(available_captures)])

        out_name = f"{manual_num:03d}_Slide_{slide_num:02d}_{clean_name}.webp"
        create_widescreen_slide(
            manual_folder=folder_name,
            slide_num=slide_num,
            total_slides=total,
            title=title,
            subtitle=subtitle,
            menu_path=menu_path,
            bullets=bullets,
            expected=expected,
            capture_path=cap_file,
            output_filename=out_name,
            badge_name=badge_name
        )

    print(f"[OK] 100% de láminas 16:9 generadas para {folder_name}.")

def main():
    manuals = [
        ("CSI08_Query Practice_Solutions", 115, "SOLUCIONES: CONSULTAS SQL"),
        ("CSL01_Introduction_ES", 117, "CASO PRÁCTICO: INTRODUCCIÓN"),
        ("CSL01_Introduction_Solution_ES", 118, "SOLUCIONES: INTRODUCCIÓN"),
        ("CSL02_Procurement_Process_ES", 119, "CASO PRÁCTICO: COMPRAS P2P"),
        ("CSL02_Procurement_Process_Solution_ES", 120, "SOLUCIONES: COMPRAS P2P"),
    ]
    for folder, num, badge in manuals:
        process_manual(folder, num, badge)

if __name__ == "__main__":
    main()
