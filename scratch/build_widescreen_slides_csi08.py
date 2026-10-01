# -*- coding: utf-8 -*-
"""
Diseñador de Láminas Widescreen 16:9 (1920x1080) para Clase Magistral:
CSI08_Query_Practice (Práctica de Consultas SQL HANA)
"""

import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = r"C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP"
TARGET_DIR = os.path.join(BASE_DIR, "CSI08_Query_Practice", "Imagenes_Diapositivas")
CAPTURES_DIR = os.path.join(BASE_DIR, "Recursos_Audiovisuales", "CSI08_Query_Practice", "Capturas_Originales_PDF")

# Fuentes estándar de Windows
FONT_BOLD = r"C:\Windows\Fonts\arialbd.ttf"
FONT_REGULAR = r"C:\Windows\Fonts\arial.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

font_title = get_font(FONT_BOLD, 36)
font_subtitle = get_font(FONT_BOLD, 24)
font_body = get_font(FONT_REGULAR, 20)
font_bold_sm = get_font(FONT_BOLD, 18)
font_tag = get_font(FONT_BOLD, 15)
font_path = get_font(FONT_REGULAR, 17)

slides_data = [
    {
        "step": 1,
        "title": "Apertura y Preparación del Entorno",
        "subtitle": "Generador de Consultas en SAP HANA",
        "menu": "Menú Principal > Herramientas > Consultas",
        "bullets": [
            "Conexión con credenciales autorizadas en la base SBODEMO.",
            "Activación de Información del Sistema con Ctrl + Shift + I.",
            "Identificación de la arquitectura columnar in-memory de SAP HANA."
        ],
        "expected": "Barra de estado activa lista para capturar tablas y campos.",
        "capture_file": "slide_1_img_02.jpeg",
        "crop_box": None
    },
    {
        "step": 2,
        "title": "Hoja de Ruta del Laboratorio",
        "subtitle": "5 Consultas Estratégicas para Consultoría",
        "menu": "Herramientas > Administrador de Consultas",
        "bullets": [
            "1. Lista de clientes activos filtrando proveedores en OCRD.",
            "2. Consulta dinámica con parámetro de fecha de corte [%0].",
            "3. Reporte relacional multitabla (INNER JOIN OINV - INV1).",
            "4. Alerta automática por exceso de límite de crédito.",
            "5. Consulta agregada con GROUP BY para widgets Fiori."
        ],
        "expected": "Estructura de las 5 consultas clave para la gestión empresarial.",
        "capture_file": "slide_3_img_03.png",
        "crop_box": None
    },
    {
        "step": 3,
        "title": "Tarea 1: Lista de Clientes (Tabla OCRD)",
        "subtitle": "Filtrado Transaccional por Tipo de Socio",
        "menu": "Herramientas > Consultas > Generador de Consultas",
        "bullets": [
            "Selección de campos: CardCode, CardName, Address, Balance, CntctPrsn.",
            "Filtro obligatorio WHERE: CardType = 'C' (excluye proveedores 'S').",
            "Sintaxis HANA: nombres de campos entre comillas dobles si aplica."
        ],
        "expected": "Grilla con clientes activos y saldos contables precisos.",
        "capture_file": "slide_3_img_03.png",
        "crop_box": None
    },
    {
        "step": 4,
        "title": "Ajuste Fino y Sumatoria Automática",
        "subtitle": "Ordenamiento y Categorización de Consultas",
        "menu": "Ventana de Resultados de Consulta",
        "bullets": [
            "Doble clic en el encabezado 'Nombre de Cliente' para ordenar A-Z.",
            "Tecla Ctrl + clic en 'Saldo de Cuenta' para generar sumatoria al pie.",
            "Guardar en categoría 'Ventas' asignada al Grupo de Autorizaciones 1."
        ],
        "expected": "Consulta catalogada en el Administrador de Consultas.",
        "capture_file": "slide_3_img_03.png",
        "crop_box": None
    },
    {
        "step": 5,
        "title": "Tarea 2: Parámetros Dinámicos con [%0]",
        "subtitle": "Filtro de Facturas Abiertas por Fecha de Corte",
        "menu": "Herramientas > Consultas > Generador de Consultas",
        "bullets": [
            "Tabla de Facturas de Deudores OINV (DocNum, CardName, DocDate, DocTotal).",
            "Condición 1: DocStatus = 'O' para auditar solo facturas pendientes.",
            "Condición 2: DocDate > [%0] para solicitar la fecha en tiempo de ejecución."
        ],
        "expected": "Apertura del selector de fecha nativo al ejecutar la consulta.",
        "capture_file": "slide_5_img_04.png",
        "crop_box": None
    },
    {
        "step": 6,
        "title": "Validación de la Variable [%0]",
        "subtitle": "Ejecución Interactiva con Parámetro de Usuario",
        "menu": "Ventana Criterios de Selección de Consulta",
        "bullets": [
            "El sistema despliega automáticamente el calendario de SAP B1.",
            "No se requiere modificar la consulta SQL para cambiar el rango.",
            "Guardado en la categoría 'Ventas' como 'Facturas Abiertas por Fecha'."
        ],
        "expected": "Reporte de facturas emitidas posteriormente a la fecha indicada.",
        "capture_file": "slide_5_img_04.png",
        "crop_box": None
    },
    {
        "step": 7,
        "title": "Tarea 3: Relación Multitabla (JOIN)",
        "subtitle": "Unión de Cabecera y Líneas (OINV - INV1)",
        "menu": "Herramientas > Consultas > Generador de Consultas",
        "bullets": [
            "Carga de dos tablas: OINV (Cabecera) e INV1 (Líneas de Detalle).",
            "Relación de clave foránea automática: T0.DocEntry = T1.DocEntry.",
            "Auditoría combinada de artículos vendidos, precios de lista y cantidades."
        ],
        "expected": "Desglose pormenorizado de cada artículo por documento de venta.",
        "capture_file": "slide_7_img_05.png",
        "crop_box": None
    },
    {
        "step": 8,
        "title": "Tarea 4: Consulta para Alertas del Sistema",
        "subtitle": "Monitoreo Proactivo de Límite de Crédito",
        "menu": "Gestión > Alarmas > Gestión de Alarmas",
        "bullets": [
            "Condición sobre tabla OCRD: Balance > CreditLine.",
            "Automatización de la alarma con ejecución periódica cada 2 horas.",
            "Envío automático de mensaje interno a la bandeja del Director Financiero."
        ],
        "expected": "Alarma activa que notifica desviaciones de riesgo crediticio.",
        "capture_file": "slide_8_img_06.png",
        "crop_box": None
    },
    {
        "step": 9,
        "title": "Tarea 5: Agregación para Widgets Fiori",
        "subtitle": "Uso de GROUP BY y Métricas para Dashboards",
        "menu": "Herramientas > Consultas > Generador de Consultas",
        "bullets": [
            "Agrupamiento por cliente: SELECT CardName, SUM(DocTotal) AS Ventas.",
            "Cláusula GROUP BY T0.CardName ORDER BY Ventas DESC.",
            "Vinculación en Pervasive Analytics para gráficos de barras interactivos."
        ],
        "expected": "Widget analítico listo para anclar en el Cockpit Fiori del usuario.",
        "capture_file": "slide_9_img_08.png",
        "crop_box": None
    },
    {
        "step": 10,
        "title": "Cierre del Laboratorio & Certificación",
        "subtitle": "Validación Integral de Consultas en SAP B1",
        "menu": "Herramientas > Consultas > Consultas de Usuario",
        "bullets": [
            "Verificación de las 5 consultas operativas en la categoría 'Ventas'.",
            "Cero errores de sintaxis en el motor in-memory de SAP HANA.",
            "Desbloqueo de la Evaluación Práctica para Certificación de Consultor."
        ],
        "expected": "Competencias prácticas validadas y examen de laboratorio listo.",
        "capture_file": "slide_3_img_03.png",
        "crop_box": None
    }
]

def create_slide(data):
    # Lienzo 1920x1080
    w, h = 1920, 1080
    im = Image.new("RGB", (w, h), (11, 16, 29))
    draw = ImageDraw.Draw(im)

    # 1. Fondo degradado sutil y acentos
    # Barra superior
    draw.rectangle([0, 0, w, 65], fill=(15, 23, 42))
    draw.line([0, 65, w, 65], fill=(30, 41, 59), width=2)
    
    # Textos de barra superior
    draw.text((60, 22), "B1 ACADEMY • LABORATORIO PRÁCTICO OFICIAL SAP BUSINESS ONE 10.0 (HANA)", font=font_tag, fill=(217, 119, 6))
    
    badge_text = "CASO PRÁCTICO: CONSULTAS SQL"
    draw.rounded_rectangle([w - 380, 16, w - 60, 48], radius=6, fill=(30, 58, 138))
    draw.text((w - 360, 24), badge_text, font=font_tag, fill=(191, 219, 254))

    # 2. Panel Izquierdo: Contenido Pedagógico (x: 60 a 760)
    left_x = 60
    top_y = 100
    
    # Badge de Paso
    step_str = f"PASO {data['step']:02d} DE 10"
    draw.rounded_rectangle([left_x, top_y, left_x + 155, top_y + 32], radius=6, fill=(217, 119, 6))
    draw.text((left_x + 14, top_y + 7), step_str, font=font_bold_sm, fill=(0, 0, 0))

    # Ruta de Menú
    draw.rounded_rectangle([left_x + 170, top_y, left_x + 700, top_y + 32], radius=6, fill=(15, 23, 42), outline=(51, 65, 85))
    draw.text((left_x + 185, top_y + 7), f"RUTA: {data['menu']}", font=font_path, fill=(148, 163, 184))

    # Título Principal
    draw.text((left_x, top_y + 50), data['title'], font=font_title, fill=(255, 255, 255))
    draw.text((left_x, top_y + 100), data['subtitle'], font=font_subtitle, fill=(56, 189, 248))

    # Separador decorativo
    draw.line([left_x, top_y + 145, left_x + 680, top_y + 145], fill=(30, 41, 59), width=2)

    # Viñetas pedagógicas
    bullet_y = top_y + 175
    for b in data['bullets']:
        # Bullet circle
        draw.ellipse([left_x + 5, bullet_y + 6, left_x + 15, bullet_y + 16], fill=(217, 119, 6))
        # Bullet text (con wrap simple de 45 caracteres)
        words = b.split(' ')
        lines = []
        curr_line = []
        for word in words:
            if len(" ".join(curr_line + [word])) <= 46:
                curr_line.append(word)
            else:
                lines.append(" ".join(curr_line))
                curr_line = [word]
        if curr_line:
            lines.append(" ".join(curr_line))
            
        for line in lines:
            draw.text((left_x + 28, bullet_y), line, font=font_body, fill=(226, 232, 240))
            bullet_y += 28
        bullet_y += 18

    # Tarjeta de Resultado Esperado al Pie
    card_y = 900
    draw.rounded_rectangle([left_x, card_y, left_x + 680, card_y + 110], radius=10, fill=(6, 78, 59), outline=(16, 185, 129), width=1)
    draw.text((left_x + 20, card_y + 15), "RESULTADO TÉCNICO ESPERADO:", font=font_bold_sm, fill=(167, 243, 208))
    draw.text((left_x + 20, card_y + 45), data['expected'], font=font_body, fill=(255, 255, 255))

    # 3. Panel Derecho: Captura Real de SAP B1 Ampliada (x: 780 a 1860, y: 90 a 1020)
    right_x = 780
    right_w = 1080
    right_h = 920
    panel_y = 90

    # Marco de ventana estilo Fiori / macOS Dark
    draw.rounded_rectangle([right_x, panel_y, right_x + right_w, panel_y + right_h], radius=12, fill=(15, 23, 42), outline=(59, 130, 246), width=2)
    # Barra de título de la ventana SAP
    draw.rounded_rectangle([right_x, panel_y, right_x + right_w, panel_y + 42], radius=12, fill=(30, 41, 59))
    draw.rectangle([right_x, panel_y + 30, right_x + right_w, panel_y + 42], fill=(30, 41, 59)) # cubrir esquinas inferiores
    # Botones de ventana
    draw.ellipse([right_x + 18, panel_y + 14, right_x + 30, panel_y + 26], fill=(239, 68, 68))
    draw.ellipse([right_x + 38, panel_y + 14, right_x + 50, panel_y + 26], fill=(245, 158, 11))
    draw.ellipse([right_x + 58, panel_y + 14, right_x + 70, panel_y + 26], fill=(16, 185, 129))
    draw.text((right_x + 85, panel_y + 11), f"SAP Business One 10.0 — {data['title']}", font=font_bold_sm, fill=(203, 213, 225))

    # Cargar y pegar la captura
    cap_path = os.path.join(CAPTURES_DIR, data['capture_file'])
    if os.path.exists(cap_path):
        cap_img = Image.open(cap_path).convert("RGBA")
        
        # Área disponible para la captura
        max_cap_w = right_w - 40
        max_cap_h = right_h - 75
        
        # Redimensionar preservando proporción
        cap_ratio = cap_img.width / cap_img.height
        target_ratio = max_cap_w / max_cap_h
        
        if cap_ratio > target_ratio:
            new_w = max_cap_w
            new_h = int(max_cap_w / cap_ratio)
        else:
            new_h = max_cap_h
            new_w = int(max_cap_h * cap_ratio)
            
        cap_resized = cap_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Centrar captura dentro del panel
        paste_x = right_x + 20 + (max_cap_w - new_w) // 2
        paste_y = panel_y + 55 + (max_cap_h - new_h) // 2
        
        im.paste(cap_resized, (paste_x, paste_y), cap_resized if cap_resized.mode == 'RGBA' else None)

    # Guardar en WebP alta resolución
    slide_filename = f"116_Slide_{data['step']:02d}_CSI08_Query_Practice.webp"
    output_path = os.path.join(TARGET_DIR, slide_filename)
    im.save(output_path, "WEBP", quality=95)
    print(f"[OK] Generada lámina 16:9: {slide_filename}")

def main():
    print("Iniciando diseño de 10 láminas panorámicas 16:9 para CSI08_Query_Practice...")
    os.makedirs(TARGET_DIR, exist_ok=True)
    for s in slides_data:
        create_slide(s)
    print("¡Diseño completado con éxito!")

if __name__ == "__main__":
    main()
