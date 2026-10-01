# -*- coding: utf-8 -*-
"""
Compilador Maestro para los 2 Manuales de Soluciones Grandes:
1. CSL01_Introduction_Solution_ES (21 pasos)
2. CSL02_Procurement_Process_Solution_ES (24 pasos)
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
TEMP_BASE = r"C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\scratch\temp_build_solutions"
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

    if not os.path.exists(capture_path):
        print(f"[!] No existe captura: {capture_path}")
        return False

    screenshot = Image.open(capture_path).convert("RGB")
    sw, sh = screenshot.size

    max_w = W - 120
    max_h = H - 95 - 45

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


# =========================================================================
# 1. CSL01_Introduction_Solution_ES (21 pasos útiles)
# =========================================================================
CSL01_SOL_BASE = os.path.join(BASE_DIR, "Recursos_Audiovisuales", "CSL01_Introduction_Solution_ES", "Capturas_Originales_PDF")

CSL01_SOLUTIONS = [
    {
        "slide_index": 1,
        "capture_path": os.path.join(CSL01_SOL_BASE, "slide_2_img_04.png"),
        "badge_title": "PASO 01 / 21: NAVEGACIÓN Y ESTRUCTURA DE MÓDULOS",
        "script_text": "Iniciamos la solución del caso práctico de introducción explorando la arquitectura de menús en SAP Business One. El menú principal organiza las operaciones de la empresa en módulos modulares: Gestión, Finanzas, Socios de Negocios, Ventas, Compras e Inventario.",
        "step_guide": {
            "title": "Navegación en el Menú Principal",
            "menu_path": "Menú Principal > Módulos",
            "action_type": "navigation",
            "instructions": ["Inicia sesión en la sociedad OEC Computers.", "Despliega los módulos del Menú Principal."],
            "expected_output": "Estructura de módulos desplegada con accesos a transacciones estándar."
        }
    },
    {
        "slide_index": 2,
        "capture_path": os.path.join(CSL01_SOL_BASE, "slide_3_img_05.png"),
        "badge_title": "PASO 02 / 21: SELECCIÓN DE PLANTILLA DE COCKPIT",
        "script_text": "Para personalizar el espacio de trabajo de Bill como jefe de ventas, accedemos a la selección de plantillas de Cockpit y asignamos la plantilla oficial de Ventas. Esto despliega los paneles analíticos Fiori y los indicadores clave de rendimiento comercial.",
        "step_guide": {
            "title": "Asignación de Plantilla de Cockpit de Ventas",
            "menu_path": "Herramientas > Cockpit > Seleccionar Plantilla de Cockpit",
            "action_type": "cockpit_setup",
            "instructions": ["Selecciona la plantilla 'Ventas'.", "Fija la plantilla como predeterminada."],
            "expected_output": "Cockpit Fiori de Ventas cargado con widgets analíticos."
        }
    },
    {
        "slide_index": 3,
        "capture_path": os.path.join(CSL01_SOL_BASE, "slide_4_img_08.png"),
        "badge_title": "PASO 03 / 21: MAESTRO DE CLIENTES (OCRD)",
        "script_text": "En el Maestro de Socios de Negocios, buscamos los clientes asignados C20000, C50000 y C60000. En la pestaña General, vinculamos a Bill en el campo Empleado de Departamento de Ventas y actualizamos la ficha para formalizar la responsabilidad sobre las cuentas.",
        "step_guide": {
            "title": "Asignación de Responsable Comercial en OCRD",
            "menu_path": "Socios de Negocios > Datos Maestros Socio de Negocios",
            "action_type": "master_data",
            "instructions": ["Busca el cliente C20000.", "Asigna a Bill como empleado de ventas y haz clic en Actualizar."],
            "expected_output": "Cliente actualizado con Bill como responsable comercial."
        }
    },
    {
        "slide_index": 4,
        "capture_path": os.path.join(CSL01_SOL_BASE, "slide_4_img_09.jpeg"),
        "badge_title": "PASO 04 / 21: BÚSQUEDA DIRECTA DE MENÚ",
        "script_text": "Utilizamos la potente herramienta de búsqueda de menús ubicada en la esquina superior derecha. Al digitar Actividades, el sistema resalta de inmediato la ubicación exacta dentro del árbol de módulos, ahorrando tiempo de navegación.",
        "step_guide": {
            "title": "Búsqueda Rápida en el Menú de SAP",
            "menu_path": "Barra de Búsqueda > Menús",
            "action_type": "menu_search",
            "instructions": ["Escribe 'Actividades' en el buscador superior.", "Presiona Enter o haz clic en la lupa."],
            "expected_output": "Ruta de Actividades resaltada en el Menú Principal."
        }
    },
    {
        "slide_index": 5,
        "capture_path": os.path.join(CSL01_SOL_BASE, "slide_5_img_12.png"),
        "badge_title": "PASO 05 / 21: WIDGET DE FUNCIONES COMUNES",
        "script_text": "Arrastramos la transacción de Actividades desde el menú directamente hacia el widget de Funciones Comunes. A partir de este momento, Bill puede registrar llamadas, reuniones y tareas comerciales con un solo clic desde su página de inicio.",
        "step_guide": {
            "title": "Anclaje de Acceso Rápido",
            "menu_path": "Cockpit > Funciones Comunes",
            "action_type": "widget_drag",
            "instructions": ["Arrastra 'Actividades' al panel de Funciones Comunes."],
            "expected_output": "Icono de acceso directo disponible en el Cockpit."
        }
    },
    {
        "slide_index": 6,
        "capture_path": os.path.join(CSL01_SOL_BASE, "slide_5_img_13.png"),
        "badge_title": "PASO 06 / 21: PERSONALIZACIÓN DE INTERFAZ",
        "script_text": "Exploramos las parametrizaciones de formulario y la barra de herramientas superior. En SAP Business One, cada usuario puede ocultar campos irrelevantes, activar columnas clave y reorganizar la interfaz según sus necesidades operativas.",
        "step_guide": {
            "title": "Ajuste de Parametrizaciones de Formulario",
            "menu_path": "Herramientas > Parametrizaciones de Formulario",
            "action_type": "ui_customization",
            "instructions": ["Abre Parametrizaciones de Formulario.", "Activa las casillas 'Visible' y 'Activo' según el perfil."],
            "expected_output": "Formulario adaptado al flujo de trabajo del usuario."
        }
    },
    {
        "slide_index": 7,
        "capture_path": os.path.join(CSL01_SOL_BASE, "slide_6_img_16.png"),
        "badge_title": "PASO 07 / 21: REGISTRO DE ACTIVIDAD COMERCIAL",
        "script_text": "Creamos una Actividad para el cliente C20000 registrando una llamada telefónica de prospección. Definimos la fecha de contacto, la hora de inicio y el contenido de la conversación, vinculándola directamente a la ficha del socio.",
        "step_guide": {
            "title": "Creación de Actividad de CRM",
            "menu_path": "Gestión de Socios de Negocios > Actividades",
            "action_type": "crm_activity",
            "instructions": ["Selecciona el cliente C20000.", "Define tipo 'Llamada telefónica' y describe los acuerdos.", "Pulsa Crear."],
            "expected_output": "Actividad guardada en el historial de relaciones con el cliente."
        }
    },
    {
        "slide_index": 8,
        "capture_path": os.path.join(CSL01_SOL_BASE, "slide_7_img_17.png"),
        "badge_title": "PASO 08 / 21: CREACIÓN DE OFERTA DE VENTA (OQUT)",
        "script_text": "Iniciamos el ciclo comercial formal creando una Oferta de Venta para C20000. Seleccionamos los artículos JB001 y A00001, verificando que los precios de lista y descuentos se calculen automáticamente según la política comercial del cliente.",
        "step_guide": {
            "title": "Generación de Oferta de Venta",
            "menu_path": "Ventas - Clientes > Oferta de Ventas",
            "action_type": "sales_quotation",
            "instructions": ["Ingresa el cliente C20000.", "Añade los artículos solicitados.", "Verifica el precio total y haz clic en Crear."],
            "expected_output": "Oferta de venta creada con número de documento correlativo."
        }
    },
    {
        "slide_index": 9,
        "capture_path": os.path.join(CSL01_SOL_BASE, "slide_7_img_18.png"),
        "badge_title": "PASO 09 / 21: SELECCIÓN DE ARTÍCULOS EN LISTA",
        "script_text": "Al presionar Tabulador en el campo de artículo, SAP despliega la lista maestra de artículos con stock disponible, precios unitarios y almacén asignado, asegurando que solo se coticen productos con disponibilidad inmediata.",
        "step_guide": {
            "title": "Consulta de Lista de Artículos",
            "menu_path": "Líneas de Documento de Venta",
            "action_type": "item_selection",
            "instructions": ["Presiona Tab en Número de Artículo.", "Selecciona el producto y revisa el stock disponible."],
            "expected_output": "Artículo cargado con descripción y unidad de medida."
        }
    },
    {
        "slide_index": 10,
        "capture_path": os.path.join(CSL01_SOL_BASE, "slide_8_img_20.png"),
        "badge_title": "PASO 10 / 21: COPIAR OFERTA A PEDIDO (ORDR)",
        "script_text": "Una vez que el cliente aprueba la cotización, abrimos la oferta y pulsamos el botón Copiar a en la esquina inferior derecha, seleccionando Pedido de Cliente. Esto traslada todos los datos sin necesidad de reescribir información.",
        "step_guide": {
            "title": "Transferencia de Documento",
            "menu_path": "Oferta de Ventas > Botón Copiar a",
            "action_type": "copy_to_order",
            "instructions": ["Abre la oferta aprobada.", "Haz clic en 'Copiar a' y selecciona 'Pedido de Cliente'."],
            "expected_output": "Nuevo Pedido de Cliente precargado con los datos de la oferta."
        }
    },
    {
        "slide_index": 11,
        "capture_path": os.path.join(CSL01_SOL_BASE, "slide_9_img_21.png"),
        "badge_title": "PASO 11 / 21: CONFIRMACIÓN Y COMPROMISO DE STOCK",
        "script_text": "En el Pedido de Cliente definimos la fecha de entrega comprometida y pulsamos Crear. En este instante, SAP Business One actualiza la columna Comprometido en la tabla de inventario, asegurando que ese stock quede reservado para esta orden.",
        "step_guide": {
            "title": "Creación del Pedido y Reserva de Stock",
            "menu_path": "Ventas - Clientes > Pedido de Cliente",
            "action_type": "sales_order_confirm",
            "instructions": ["Ingresa la Fecha de Entrega.", "Pulsa Crear para registrar el pedido."],
            "expected_output": "Pedido registrado y stock comprometido en almacén."
        }
    },
    {
        "slide_index": 12,
        "capture_path": os.path.join(CSL01_SOL_BASE, "slide_9_img_22.png"),
        "badge_title": "PASO 12 / 21: MAPA DE RELACIONES (OFERTA -> PEDIDO)",
        "script_text": "Haciendo clic derecho sobre el pedido y seleccionando Mapa de Relaciones, auditamos visualmente el flujo documental. Vemos cómo la oferta aparece enlazada al pedido, garantizando plena trazabilidad operativa.",
        "step_guide": {
            "title": "Verificación del Mapa de Relaciones",
            "menu_path": "Clic Derecho > Mapa de Relaciones",
            "action_type": "relationship_map",
            "instructions": ["Haz clic derecho en cualquier parte vacía del pedido.", "Selecciona 'Mapa de Relaciones'."],
            "expected_output": "Árbol gráfico mostrando el vínculo entre Oferta y Pedido."
        }
    },
    {
        "slide_index": 13,
        "capture_path": os.path.join(CSL01_SOL_BASE, "slide_10_img_23.png"),
        "badge_title": "PASO 13 / 21: ENTREGA DE MERCANCÍAS (ODLN)",
        "script_text": "Cuando almacén despacha los productos, copiamos el pedido a una Entrega de Mercancías. Al crear la entrega, SAP reduce físicamente las existencias del inventario y genera el coste de las mercancías vendidas en la contabilidad.",
        "step_guide": {
            "title": "Registro de Salida de Inventario",
            "menu_path": "Pedido > Copiar a > Entrega",
            "action_type": "delivery",
            "instructions": ["Desde el pedido haz clic en 'Copiar a' > 'Entrega'.", "Pulsa Crear."],
            "expected_output": "Albarán de entrega generado y stock disminuido en almacén."
        }
    },
    {
        "slide_index": 14,
        "capture_path": os.path.join(CSL01_SOL_BASE, "slide_11_img_27.png"),
        "badge_title": "PASO 14 / 21: FACTURA DE DEUDORES (OINV)",
        "script_text": "Desde la entrega generamos la Factura de Deudores correspondiente. Este documento formaliza el reconocimiento de ingresos por ventas, liquida el IVA repercutido y asienta el derecho de cobro en la cuenta del cliente.",
        "step_guide": {
            "title": "Facturación de la Venta",
            "menu_path": "Entrega > Copiar a > Factura de Deudores",
            "action_type": "ar_invoice",
            "instructions": ["Copia la entrega a 'Factura de Deudores'.", "Verifica la condición de pago y crea la factura."],
            "expected_output": "Factura legal de cliente contabilizada en el sistema."
        }
    },
    {
        "slide_index": 15,
        "capture_path": os.path.join(CSL01_SOL_BASE, "slide_12_img_28.png"),
        "badge_title": "PASO 15 / 21: ASIENTO CONTABLE AUTOMÁTICO (OJDT)",
        "script_text": "Pulsando la flecha naranja de enlace junto al campo Número de Asiento en la factura, abrimos el registro contable en el Libro Mayor. Observamos el débito a Clientes y los créditos a Ventas de Mercancías e IVA Repercutido.",
        "step_guide": {
            "title": "Auditoría de Asiento Contable",
            "menu_path": "Factura > Flecha Naranja en Número de Transacción",
            "action_type": "journal_entry",
            "instructions": ["Haz clic en la flecha de enlace del asiento.", "Audita las cuentas de débito y crédito."],
            "expected_output": "Asiento contable balanceado en el Libro Mayor (OJDT)."
        }
    },
    {
        "slide_index": 16,
        "capture_path": os.path.join(CSL01_SOL_BASE, "slide_13_img_29.png"),
        "badge_title": "PASO 16 / 21: COBRO EN GESTIÓN DE BANCOS (ORCT)",
        "script_text": "Registramos el cobro de la factura a través del módulo de Gestión de Bancos en Cobros Recibidos. Seleccionamos el medio de pago, ingresamos el importe liquidado y completamos la transacción de tesorería.",
        "step_guide": {
            "title": "Registro del Cobro Bancario",
            "menu_path": "Gestión de Bancos > Cobros > Cobros Recibidos",
            "action_type": "payment_receipt",
            "instructions": ["Abre Cobros Recibidos y selecciona al cliente C20000.", "Marca la factura y define el medio de pago.", "Pulsa Crear."],
            "expected_output": "Cobro recibido contabilizado y saldo deudor cancelado."
        }
    },
    {
        "slide_index": 17,
        "capture_path": os.path.join(CSL01_SOL_BASE, "slide_14_img_33.png"),
        "badge_title": "PASO 17 / 21: SALDO RECONCILIADO EN CLIENTES",
        "script_text": "Regresamos al Maestro de Socios de Negocios y abrimos el saldo de cuenta del cliente C20000. Comprobamos cómo la factura y el cobro se han reconciliado internamente, reflejando un saldo actualizado con total precisión.",
        "step_guide": {
            "title": "Verificación de Saldo de Cuenta",
            "menu_path": "Socios de Negocios > Saldo de Cuenta",
            "action_type": "balance_verification",
            "instructions": ["Abre la ficha de C20000.", "Haz clic en la flecha de 'Saldo de Cuenta'."],
            "expected_output": "Movimientos de débito y crédito compensados en la cuenta corriente."
        }
    },
    {
        "slide_index": 18,
        "capture_path": os.path.join(CSL01_SOL_BASE, "slide_15_img_34.png"),
        "badge_title": "PASO 18 / 21: MAPA DE RELACIONES COMPLETO",
        "script_text": "Abrimos el Mapa de Relaciones final desde la factura o el cobro. En pantalla se exhibe la cadena completa: Oferta, Pedido, Entrega, Factura y Pago, todos interconectados y cerrados satisfactoriamente.",
        "step_guide": {
            "title": "Auditoría Integral de la Cadena Comercial",
            "menu_path": "Clic Derecho > Mapa de Relaciones",
            "action_type": "full_relationship_map",
            "instructions": ["Abre el Mapa de Relaciones del documento final."],
            "expected_output": "Cadena documental completa en estado Cerrado."
        }
    },
    {
        "slide_index": 19,
        "capture_path": os.path.join(CSL01_SOL_BASE, "slide_16_img_37.png"),
        "badge_title": "PASO 19 / 21: PERVASIVE ANALYTICS Y RENTABILIDAD",
        "script_text": "Accedemos a Pervasive Analytics para evaluar el impacto comercial. Analizamos los gráficos interactivos de ventas por cliente, margen bruto y productos más vendidos impulsados por la tecnología en memoria de SAP HANA.",
        "step_guide": {
            "title": "Análisis Analítico de Ventas",
            "menu_path": "Herramientas > Pervasive Analytics",
            "action_type": "analytics",
            "instructions": ["Abre Pervasive Analytics.", "Inspecciona los paneles de rentabilidad por cliente."],
            "expected_output": "Métricas de rentabilidad y margen comercial actualizadas."
        }
    },
    {
        "slide_index": 20,
        "capture_path": os.path.join(CSL01_SOL_BASE, "slide_17_img_38.png"),
        "badge_title": "PASO 20 / 21: COCKPIT FIORI ACTUALIZADO",
        "script_text": "En el Cockpit de Bill, observamos cómo los indicadores KPI de ventas del mes y el albarán de entregas se han incrementado en tiempo real tras contabilizar las transacciones del ciclo.",
        "step_guide": {
            "title": "Monitoreo en Tiempo Real",
            "menu_path": "Pantalla Principal > Cockpit Fiori",
            "action_type": "kpi_monitoring",
            "instructions": ["Regresa a la pantalla principal.", "Comprueba la actualización de los contadores KPI."],
            "expected_output": "Indicadores de ventas reflejando las operaciones concluidas."
        }
    },
    {
        "slide_index": 21,
        "capture_path": os.path.join(CSL01_SOL_BASE, "slide_18_img_41.png"),
        "badge_title": "PASO 21 / 21: RESUMEN EJECUTIVO Y CONCLUSIÓN",
        "script_text": "¡Felicitaciones! Has completado exitosamente la solución del caso práctico de Introducción. Ahora dominas la navegación, personalización de cockpits, gestión de maestros, actividades de CRM y el ciclo integral de ventas en SAP Business One.",
        "step_guide": {
            "title": "Cierre del Caso Práctico",
            "menu_path": "Resumen de Capacitación",
            "action_type": "course_completion",
            "instructions": ["Revisa el checklist de objetivos pedagógicos.", "Registra tu progreso en el simulador interactivo."],
            "expected_output": "Competencias comerciales y de navegación consolidadas."
        }
    }
]


# =========================================================================
# 2. CSL02_Procurement_Process_Solution_ES (24 pasos útiles)
# =========================================================================
CSL02_SOL_BASE = os.path.join(BASE_DIR, "Recursos_Audiovisuales", "CSL02_Procurement_Process_Solution_ES", "Capturas_Originales_PDF")

CSL02_SOLUTIONS = [
    {
        "slide_index": 1,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_2_img_03.png"),
        "badge_title": "PASO 01 / 24: OFERTA DE COMPRA A PROVEEDORES",
        "script_text": "Iniciamos el ciclo de aprovisionamiento en SAP Business One emitiendo una Oferta de Compra para solicitar cotización a nuestros proveedores habituales. Registramos los artículos requeridos, las cantidades estimadas y la fecha límite de respuesta comercial.",
        "step_guide": {
            "title": "Solicitud de Oferta de Compra",
            "menu_path": "Compras - Proveedores > Oferta de Compra",
            "action_type": "purchase_quotation",
            "instructions": ["Abre Oferta de Compra.", "Selecciona el proveedor y artículos solicitados.", "Pulsa Crear."],
            "expected_output": "Oferta de compra registrada para comparativa de precios."
        }
    },
    {
        "slide_index": 2,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_3_img_04.png"),
        "badge_title": "PASO 02 / 24: PEDIDO DE COMPRA (OPOR)",
        "script_text": "Tras confirmar la cotización más competitiva, creamos el Pedido de Compra formal en la tabla OPOR. Este documento contractual fija los precios unitarios, las condiciones de crédito acordadas y la fecha de entrega comprometida por el proveedor.",
        "step_guide": {
            "title": "Generación de Pedido de Compra",
            "menu_path": "Compras - Proveedores > Pedido",
            "action_type": "purchase_order",
            "instructions": ["Copia la oferta a Pedido o crea un nuevo documento.", "Define las condiciones de entrega y pulsa Crear."],
            "expected_output": "Pedido de compra registrado en estado Abierto."
        }
    },
    {
        "slide_index": 3,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_4_img_07.png"),
        "badge_title": "PASO 03 / 24: SELECCIÓN DE PROVEEDOR Y ALMACÉN",
        "script_text": "En las líneas del pedido de compra, asignamos el almacén específico de recepción para cada artículo. SAP Business One permite distribuir una misma orden entre diferentes almacenes logísticos según la demanda operativa.",
        "step_guide": {
            "title": "Asignación Logística de Destino",
            "menu_path": "Pedido > Columna Almacén",
            "action_type": "warehouse_selection",
            "instructions": ["Verifica la columna Almacén en cada línea.", "Asigna el almacén general 01."],
            "expected_output": "Almacenes de recepción vinculados a cada artículo."
        }
    },
    {
        "slide_index": 4,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_5_img_08.png"),
        "badge_title": "PASO 04 / 24: CONDICIONES COMERCIALES DE COMPRA",
        "script_text": "Revisamos los descuentos por volumen y las listas de precios de compra. El sistema carga automáticamente las tarifas vigentes acordadas con el socio de negocios, evitando errores en la facturación posterior.",
        "step_guide": {
            "title": "Verificación de Condiciones Comerciales",
            "menu_path": "Pedido > Pestaña Finanzas",
            "action_type": "purchase_pricing",
            "instructions": ["Revisa las condiciones de pago y lista de precios.", "Confirma los importes de línea."],
            "expected_output": "Precios y descuentos validados conforme al contrato."
        }
    },
    {
        "slide_index": 5,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_6_img_09.png"),
        "badge_title": "PASO 05 / 24: ENTRADA DE MERCANCÍAS POR COMPRA (OPDN)",
        "script_text": "Cuando el camión del proveedor llega a nuestras instalaciones, almacén registra la Entrada de Mercancías por Pedido utilizando la función Copiar a. Se constatan las cantidades reales recibidas frente al albarán del transportista.",
        "step_guide": {
            "title": "Recepción Física de Mercancías",
            "menu_path": "Pedido > Copiar a > Entrada de Mercancías por Pedido",
            "action_type": "goods_receipt_po",
            "instructions": ["Abre el pedido y selecciona 'Copiar a' > 'Entrada de Mercancías'.", "Ajusta cantidades recibidas y pulsa Crear."],
            "expected_output": "Entrada de mercancías registrada y stock físico incrementado."
        }
    },
    {
        "slide_index": 6,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_7_img_10.png"),
        "badge_title": "PASO 06 / 24: ASIENTO DE PROVISIÓN EN LIBRO MAYOR",
        "script_text": "Al crear la entrada de mercancías, el sistema genera de forma automática un asiento contable que debita la cuenta de Existencias y acredita la cuenta puente de Compras no Facturadas, garantizando el principio de devengo.",
        "step_guide": {
            "title": "Auditoría de Contabilización de Inventario",
            "menu_path": "Entrada de Mercancías > Asiento Contable",
            "action_type": "inventory_journal_entry",
            "instructions": ["Haz clic en la flecha de enlace del asiento.", "Audita las cuentas de existencias y provisión."],
            "expected_output": "Asiento contable de provisión registrado en Libro Mayor."
        }
    },
    {
        "slide_index": 7,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_8_img_11.png"),
        "badge_title": "PASO 07 / 24: DEVOLUCIÓN DE MERCANCÍAS A PROVEEDOR",
        "script_text": "Si durante la inspección de calidad se detectan productos defectuosos, se genera una Devolución de Mercancías copiada desde la entrada. Esto reduce el inventario físico y revierte la provisión contable de compras.",
        "step_guide": {
            "title": "Gestión de Rechazos de Calidad",
            "menu_path": "Compras - Proveedores > Devolución de Mercancías",
            "action_type": "goods_return",
            "instructions": ["Copia la entrada a Devolución de Mercancías.", "Indica el motivo de devolución y pulsa Crear."],
            "expected_output": "Mercancía defectuosa dada de baja del inventario."
        }
    },
    {
        "slide_index": 8,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_9_img_14.png"),
        "badge_title": "PASO 08 / 24: FACTURA DE PROVEEDORES (OPCH)",
        "script_text": "Al recibir la factura física o electrónica del proveedor, el departamento contable registra la Factura de Proveedores en la tabla OPCH. Ingresamos el número fiscal de factura en el campo Número de Referencia para control tributario.",
        "step_guide": {
            "title": "Registro de Factura de Proveedor",
            "menu_path": "Compras - Proveedores > Factura de Proveedores",
            "action_type": "ap_invoice",
            "instructions": ["Copia la entrada de mercancías a Factura de Proveedores.", "Ingresa el número fiscal de factura y pulsa Crear."],
            "expected_output": "Factura de proveedor contabilizada en el pasivo exigible."
        }
    },
    {
        "slide_index": 9,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_10_img_16.png"),
        "badge_title": "PASO 09 / 24: VALIDACIÓN FISCAL Y RETENCIONES",
        "script_text": "Verificamos los grupos impositivos de IVA soportado y los códigos de retención de impuestos aplicables según la normativa fiscal del país. SAP Business One desglosa cada impuesto en su correspondiente cuenta contable.",
        "step_guide": {
            "title": "Validación Tributaria de la Compra",
            "menu_path": "Factura > Pestaña Finanzas > Impuestos",
            "action_type": "tax_validation",
            "instructions": ["Revisa los importes brutos, netos e impuestos aplicados.", "Confirma la retención en la fuente si aplica."],
            "expected_output": "Impuestos calculados y asignados a cuentas fiscales."
        }
    },
    {
        "slide_index": 10,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_11_img_17.png"),
        "badge_title": "PASO 10 / 24: ASIENTO CONTABLE DE FACTURA",
        "script_text": "Auditamos el asiento contable de la factura de proveedor. La cuenta puente de Compras no Facturadas se debita para cancelarse, se debita el IVA Soportado deducible y se acredita la cuenta del Proveedor en el pasivo.",
        "step_guide": {
            "title": "Asiento de Pasivo Comercial",
            "menu_path": "Factura > Flecha de Asiento Contable",
            "action_type": "ap_journal_entry",
            "instructions": ["Inspecciona el asiento generado en el Libro Mayor.", "Verifica la cancelación de la cuenta puente."],
            "expected_output": "Deuda comercial asentada formalmente con el proveedor."
        }
    },
    {
        "slide_index": 11,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_12_img_18.png"),
        "badge_title": "PASO 11 / 24: PAGOS EFECTUADOS (OVPM)",
        "script_text": "En la fecha de vencimiento acordada, el departamento de tesorería procesa el Pago Efectuado en la tabla OVPM. Seleccionamos al proveedor y el sistema lista todas las facturas pendientes de liquidación.",
        "step_guide": {
            "title": "Emisión de Pago a Proveedor",
            "menu_path": "Gestión de Bancos > Pagos Efectuados > Pagos Efectuados",
            "action_type": "outgoing_payment",
            "instructions": ["Abre Pagos Efectuados y selecciona al proveedor.", "Marca la casilla de la factura a cancelar."],
            "expected_output": "Factura seleccionada para pago en tesorería."
        }
    },
    {
        "slide_index": 12,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_13_img_19.png"),
        "badge_title": "PASO 12 / 24: MEDIO DE PAGO Y TRANSFERENCIA",
        "script_text": "Hacemos clic en el icono de Medios de Pago en la barra de herramientas. Seleccionamos Transferencia Bancaria, indicamos la cuenta bancaria de la empresa, la fecha de transferencia y el número de referencia bancario.",
        "step_guide": {
            "title": "Definición del Medio de Pago",
            "menu_path": "Pagos Efectuados > Icono Medios de Pago (Ctrl + Y)",
            "action_type": "payment_means",
            "instructions": ["Abre Medios de Pago y selecciona la pestaña Transferencia.", "Indica cuenta bancaria e importe total. Pulsa OK y Crear."],
            "expected_output": "Pago efectuado contabilizado contra la cuenta bancaria."
        }
    },
    {
        "slide_index": 13,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_14_img_22.png"),
        "badge_title": "PASO 13 / 24: RECONCILIACIÓN DE PROVEEDOR",
        "script_text": "Abrimos la cuenta del proveedor en Datos Maestros de Socio de Negocios y constatamos que la factura de compra y el pago bancario han quedado reconciliados internamente, dejando el saldo comercial en cero.",
        "step_guide": {
            "title": "Comprobación de Saldo Reconciliado",
            "menu_path": "Socios de Negocios > Saldo de Cuenta",
            "action_type": "bp_reconciliation",
            "instructions": ["Inspecciona el saldo de cuenta del proveedor.", "Comprueba que la factura figure como pagada."],
            "expected_output": "Saldo del proveedor cancelado con reconciliación interna automática."
        }
    },
    {
        "slide_index": 14,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_16_img_26.png"),
        "badge_title": "PASO 14 / 24: AUDITORÍA DE STOCK EN ALMACÉN (OITW)",
        "script_text": "En el Maestro de Artículos, revisamos la pestaña Inventario en la tabla OITW. Constatamos el incremento exacto del stock en almacén y la actualización del coste medio ponderado tras la entrada de mercancías.",
        "step_guide": {
            "title": "Auditoría de Stock de Artículos",
            "menu_path": "Inventario > Datos Maestros de Artículo > Pestaña Inventario",
            "action_type": "stock_audit",
            "instructions": ["Abre la ficha del artículo comprado.", "Verifica las columnas 'En stock', 'Comprometido' y 'Pedido'."],
            "expected_output": "Stock físico y coste medio ponderado actualizados en almacén."
        }
    },
    {
        "slide_index": 15,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_17_img_27.png"),
        "badge_title": "PASO 15 / 24: PRECIOS DE ENTREGA (LANDED COSTS)",
        "script_text": "Para compras internacionales con costes de aduanas, aranceles y fletes, abrimos la función Precios de Entrega en la tabla OIPF. Cargamos la entrada de mercancías correspondiente para imputar los gastos adicionales.",
        "step_guide": {
            "title": "Asignación de Costes de Importación",
            "menu_path": "Compras - Proveedores > Precios de Entrega",
            "action_type": "landed_costs",
            "instructions": ["Abre Precios de Entrega.", "Copia la Entrada de Mercancías por Pedido.", "Ingresa a la pestaña Costes."],
            "expected_output": "Documento de costes de entrega listo para repartir gastos."
        }
    },
    {
        "slide_index": 16,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_18_img_30.png"),
        "badge_title": "PASO 16 / 24: DISTRIBUCIÓN DE FLETES Y ARANCELES",
        "script_text": "En la pestaña Costes de los Precios de Entrega, registramos los importes de transporte y aduanas, seleccionando el método de reparto por valor monetario, peso o volumen entre las líneas de artículos adquiridos.",
        "step_guide": {
            "title": "Reparto de Gastos Adicionales",
            "menu_path": "Precios de Entrega > Pestaña Costes",
            "action_type": "cost_distribution",
            "instructions": ["Ingresa el importe de flete y arancel.", "Selecciona el método de distribución por valor."],
            "expected_output": "Gastos distribuidos proporcionalmente entre cada artículo."
        }
    },
    {
        "slide_index": 17,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_19_img_31.png"),
        "badge_title": "PASO 17 / 24: ACTUALIZACIÓN DEL VALOR DE INVENTARIO",
        "script_text": "Al crear los Precios de Entrega, SAP Business One capitaliza los costes indirectos en el inventario, incrementando el coste unitario del producto y generando el asiento de imputación correspondiente en la contabilidad.",
        "step_guide": {
            "title": "Capitalización de Costes en Inventario",
            "menu_path": "Precios de Entrega > Botón Crear",
            "action_type": "inventory_revaluation",
            "instructions": ["Haz clic en Crear.", "Verifica el recálculo del nuevo coste unitario."],
            "expected_output": "Coste de stock actualizado con aranceles y fletes incorporados."
        }
    },
    {
        "slide_index": 18,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_21_img_35.png"),
        "badge_title": "PASO 18 / 24: MAPA DE RELACIONES DEL CICLO DE COMPRAS",
        "script_text": "Abrimos el Mapa de Relaciones para auditar la trazabilidad global del aprovisionamiento. Visualizamos el flujo completo desde el Pedido, Entrada de Mercancías, Factura de Proveedor, Pago y Precios de Entrega.",
        "step_guide": {
            "title": "Mapa de Relaciones de Aprovisionamiento",
            "menu_path": "Clic Derecho > Mapa de Relaciones",
            "action_type": "procurement_relationship_map",
            "instructions": ["Haz clic derecho en la factura o pedido.", "Selecciona 'Mapa de Relaciones'."],
            "expected_output": "Flujo documental completo con estado cerrado y trazabilidad 100%."
        }
    },
    {
        "slide_index": 19,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_22_img_37.png"),
        "badge_title": "PASO 19 / 24: TRAZABILIDAD Y CIERRE DOCUMENTAL",
        "script_text": "Comprobamos que cada nodo del mapa indique el estatus Cerrado. En SAP Business One, un documento cerrado no admite modificaciones ni duplicidades de facturación, blindando el control administrativo de la empresa.",
        "step_guide": {
            "title": "Verificación de Estatus Documental",
            "menu_path": "Mapa de Relaciones > Nodos Documentales",
            "action_type": "document_status",
            "instructions": ["Verifica que los documentos figuren en color gris o con marca de cerrado."],
            "expected_output": "Ciclo administrativo cerrado sin pendientes de facturación."
        }
    },
    {
        "slide_index": 20,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_23_img_38.png"),
        "badge_title": "PASO 20 / 24: RECONCILIACIÓN INTERNA DEL INTERLOCUTOR",
        "script_text": "En el módulo de Finanzas, ejecutamos la Reconciliación Interna para socios de negocios. Confirmamos que los números de transacción contable coincidan exactamente con las referencias bancarias y facturas asociadas.",
        "step_guide": {
            "title": "Auditoría de Reconciliación Contable",
            "menu_path": "Finanzas > Reconciliación Interna",
            "action_type": "internal_reconciliation",
            "instructions": ["Abre Reconciliación Interna.", "Verifica el historial del proveedor auditado."],
            "expected_output": "Reconciliación histórica validada sin discrepancias contables."
        }
    },
    {
        "slide_index": 21,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_24_img_40.png"),
        "badge_title": "PASO 21 / 24: INFORME DE AUDITORÍA DE STOCK",
        "script_text": "Ejecutamos el Informe de Auditoría de Stock en el módulo de Inventario. Este reporte muestra cronológicamente cada entrada, salida y ajuste de costes por documento, constituyendo el informe oficial para auditorías fiscales.",
        "step_guide": {
            "title": "Informe Oficial de Auditoría de Stock",
            "menu_path": "Inventario > Informes de Inventario > Informe de Auditoría de Stocks",
            "action_type": "stock_audit_report",
            "instructions": ["Abre Informe de Auditoría de Stocks.", "Filtra por artículo y sociedad.", "Pulsa OK."],
            "expected_output": "Kárdex valorado con trazabilidad exacta de movimientos."
        }
    },
    {
        "slide_index": 22,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_25_img_42.png"),
        "badge_title": "PASO 22 / 24: PERVASIVE ANALYTICS EN COMPRAS",
        "script_text": "Analizamos las compras mediante los cuadros de mando de Pervasive Analytics en SAP HANA. Auditamos el volumen de compras por proveedor, tiempos de entrega y cumplimiento de plazos para evaluar a nuestros socios comerciales.",
        "step_guide": {
            "title": "Análisis Analítico de Compras",
            "menu_path": "Herramientas > Pervasive Analytics > Dashboard de Compras",
            "action_type": "procurement_analytics",
            "instructions": ["Abre el Dashboard de Compras.", "Evalúa el volumen de gasto y cumplimiento de proveedores."],
            "expected_output": "Métricas de aprovisionamiento en tiempo real."
        }
    },
    {
        "slide_index": 23,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_26_img_44.png"),
        "badge_title": "PASO 23 / 24: COCKPIT DE APROVISIONAMIENTO EN VIVO",
        "script_text": "En el Cockpit Fiori de Compras, revisamos los widgets de Pedidos Abiertos y Albaranes Pendientes de Facturación. Los gráficos interactivos se actualizan automáticamente tras cada transacción registrada.",
        "step_guide": {
            "title": "Monitoreo en Cockpit de Compras",
            "menu_path": "Pantalla Principal > Cockpit de Compras",
            "action_type": "procurement_cockpit",
            "instructions": ["Regresa a la pantalla principal.", "Comprueba la actualización de los widgets de compras."],
            "expected_output": "Panel de control reflejando las compras del período."
        }
    },
    {
        "slide_index": 24,
        "capture_path": os.path.join(CSL02_SOL_BASE, "slide_27_img_47.png"),
        "badge_title": "PASO 24 / 24: CONCLUSIÓN Y BUENAS PRÁCTICAS",
        "script_text": "¡Excelente trabajo! Has completado el ciclo integral de aprovisionamiento en SAP Business One. Ahora dominas la gestión de pedidos, recepción de inventario, facturación de compras, pagos bancarios, precios de entrega y trazabilidad en el mapa de relaciones.",
        "step_guide": {
            "title": "Cierre del Laboratorio de Aprovisionamiento",
            "menu_path": "Resumen de Capacitación",
            "action_type": "procurement_completion",
            "instructions": ["Revisa el resumen técnico de aprovisionamiento.", "Consolida tu aprendizaje en el simulador interactivo."],
            "expected_output": "Competencias logísticas y contables de compras certificadas."
        }
    }
]

if __name__ == "__main__":
    process_manual("CSL01_Introduction_Solution_ES", CSL01_SOLUTIONS)
    process_manual("CSL02_Procurement_Process_Solution_ES", CSL02_SOLUTIONS)
