# -*- coding: utf-8 -*-
"""
Compilador Maestro de los 5 Manuales Prácticos CS restantes:
1. CSI08_Query_Practice (5 pasos)
2. CSL01_Introduction_Solution_ES (21 pasos)
3. CSL01_Introduction_ES (4 pasos)
4. CSL02_Procurement_Process_Solution_ES (24 pasos)
5. CSL02_Procurement_Process_ES (4 pasos)
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
# 1. CSI08_Query_Practice (5 pasos prácticos)
# =========================================================================
CSI08_PRACTICE = [
    {
        "slide_index": 1,
        "capture_path": os.path.join(BASE_DIR, "Recursos_Audiovisuales", "CSI08_Query_Practice", "Capturas_Originales_PDF", "slide_3_img_03.png"),
        "badge_title": "TAREA 01 / 05: CONSULTA DE CLIENTES EN OCRD",
        "script_text": "Iniciamos la primera tarea del laboratorio práctico construyendo una consulta de clientes en la tabla OCRD. Seleccionamos los campos CardCode, CardName, Address, Balance y CntctPrsn. En la cláusula WHERE aplicamos el filtro CardType igual a 'C' entre comillas simples para listar exclusivamente clientes y excluir a proveedores.",
        "step_guide": {
            "title": "Tarea 1: Consulta de Clientes (Tabla OCRD)",
            "menu_path": "Herramientas > Consultas > Generador de Consultas",
            "action_type": "query_builder",
            "instructions": [
                "Escribe OCRD en el Generador y presiona Tab.",
                "Agrega los campos CardCode, CardName, Address, Balance y CntctPrsn.",
                "En WHERE añade la condición CardType = 'C'."
            ],
            "expected_output": "Sentencia SELECT con campos de cliente y filtro WHERE CardType = 'C'.",
            "consultant_tip": "Al filtrar CardType = 'C', aseguras que solo se muestren clientes y no proveedores."
        }
    },
    {
        "slide_index": 2,
        "capture_path": os.path.join(BASE_DIR, "Recursos_Audiovisuales", "CSI08_Query_Practice", "Capturas_Originales_PDF", "slide_5_img_04.png"),
        "badge_title": "TAREA 02 / 05: FILTRO DINÁMICO DE FECHA [%0]",
        "script_text": "En la segunda tarea, configuramos una consulta dinámica con parámetro de fecha sobre la tabla de Facturas OINV. Establecemos la condición WHERE con DocStatus igual a 'O' para facturas abiertas y DocDate mayor que corchete porcentaje cero corchete. Al ejecutar la consulta, el sistema solicitará la fecha de corte mediante un calendario emergente.",
        "step_guide": {
            "title": "Tarea 2: Parámetro Dinámico de Fecha",
            "menu_path": "Herramientas > Consultas > Generador de Consultas",
            "action_type": "dynamic_parameter",
            "instructions": [
                "Carga la tabla OINV en el Generador.",
                "Selecciona DocNum, CardName, DocDate y DocTotal.",
                "En WHERE añade DocStatus = 'O' AND DocDate > [%0]."
            ],
            "expected_output": "Apertura de la ventana interactiva solicitando la fecha de corte [%0].",
            "consultant_tip": "La variable [%0] permite que usuarios sin conocimientos técnicos ingresen parámetros fácilmente."
        }
    },
    {
        "slide_index": 3,
        "capture_path": os.path.join(BASE_DIR, "Recursos_Audiovisuales", "CSI08_Query_Practice", "Capturas_Originales_PDF", "slide_7_img_05.png"),
        "badge_title": "TAREA 03 / 05: CONSULTA MULTITABLA (INNER JOIN)",
        "script_text": "Para la tercera tarea, relacionamos múltiples tablas uniendo la cabecera OINV con sus líneas INV1 mediante la clave foránea DocEntry. Seleccionamos el código de artículo, la descripción, la cantidad y el precio unitario, ordenando los resultados por el representante comercial SlpName.",
        "step_guide": {
            "title": "Tarea 3: Consulta Relacional Multitabla",
            "menu_path": "Herramientas > Consultas > Generador de Consultas",
            "action_type": "multitable_join",
            "instructions": [
                "Ingresa OINV en la casilla 1 e INV1 en la casilla 2.",
                "Verifica la relación automática por DocEntry.",
                "Selecciona campos de cabecera y líneas de artículos.",
                "Ordena por SlpName y ejecuta para validar."
            ],
            "expected_output": "Grilla detallada con artículos, cantidades y totales desglosados por factura.",
            "consultant_tip": "El Generador de Consultas enlaza automáticamente tablas que comparten relaciones de clave foránea predefinidas en el diccionario de datos."
        }
    },
    {
        "slide_index": 4,
        "capture_path": os.path.join(BASE_DIR, "Recursos_Audiovisuales", "CSI08_Query Practice_Solutions", "Capturas_Originales_PDF", "slide_17_img_21.png"),
        "badge_title": "TAREA 04 / 05: ALERTA AUTOMÁTICA POR SALDO",
        "script_text": "En la cuarta tarea, automatizamos una alarma del sistema. Construimos una consulta sobre OCRD donde el saldo de cuenta supere el límite de crédito fijado. Vinculamos la consulta guardada en el módulo de Gestión de Alarmas con ejecución periódica cada 2 horas para alertar a los administradores.",
        "step_guide": {
            "title": "Tarea 4: Automatización de Alarmas del Sistema",
            "menu_path": "Gestión > Alarmas > Gestión de Alarmas",
            "action_type": "alert_setup",
            "instructions": [
                "Construye la consulta OCRD con Balance > CreditLine.",
                "Guarda la consulta en la categoría Ventas.",
                "En Gestión de Alarmas, vincula la consulta y define periodicidad y destinatarios."
            ],
            "expected_output": "Alarma programada que notifica automáticamente excesos en el límite de crédito.",
            "consultant_tip": "Las alarmas basadas en consultas permiten anticipar riesgos financieros sin requerir revisión manual constante."
        }
    },
    {
        "slide_index": 5,
        "capture_path": os.path.join(BASE_DIR, "Recursos_Audiovisuales", "CSI08_Query_Practice", "Capturas_Originales_PDF", "slide_9_img_08.png"),
        "badge_title": "TAREA 05 / 05: WIDGET DE RECUENTO EN COCKPIT",
        "script_text": "En la quinta y última tarea, configuramos un widget analítico de recuento en el Cockpit Fiori. Diseñamos una consulta sobre la tabla de Entregas ODLN filtrando por la fecha actual. En la Configuración de Widgets de Recuento creamos el indicador y lo anclamos a la página principal de SAP.",
        "step_guide": {
            "title": "Tarea 5: Widget Analítico de Recuento",
            "menu_path": "Herramientas > Cockpit > Configuración de Widget de Recuento",
            "action_type": "widget_configuration",
            "instructions": [
                "Genera la consulta de entregas del día sobre ODLN.",
                "Abre Configuración de Widget de Recuento y pulsa Añadir.",
                "Asigna nombre, vincula la consulta y ancla el widget en el Cockpit Fiori."
            ],
            "expected_output": "Widget de recuento operativo mostrando despachos en tiempo real.",
            "consultant_tip": "Los widgets de recuento brindan visibilidad inmediata sobre la operación logística diaria."
        }
    }
]


# =========================================================================
# 2. CSL01_Introduction_ES (4 tareas de práctica)
# =========================================================================
CSL01_PRACTICE = [
    {
        "slide_index": 1,
        "capture_path": os.path.join(BASE_DIR, "Recursos_Audiovisuales", "CSL01_Introduction_Solution_ES", "Capturas_Originales_PDF", "slide_3_img_05.png"),
        "badge_title": "TAREA 01 / 04: PLANTILLA DE COCKPIT DE VENTAS",
        "script_text": "En la primera tarea de introducción, configuramos el entorno de trabajo del nuevo jefe de ventas Bill. Nos dirigimos a Herramientas, Cockpit y seleccionamos la Plantilla de Cockpit de Ventas para activar indicadores y accesos rápidos orientados al área comercial.",
        "step_guide": {
            "title": "Tarea 1: Asignar Plantilla de Cockpit de Ventas",
            "menu_path": "Herramientas > Cockpit > Seleccionar Plantilla de Cockpit",
            "action_type": "cockpit_setup",
            "instructions": [
                "Abre Herramientas > Cockpit > Seleccionar Plantilla de Cockpit.",
                "Selecciona la plantilla 'Ventas'.",
                "Haz clic en 'Fijar como Predeterminado' para el usuario actual."
            ],
            "expected_output": "Cockpit Fiori de Ventas activado con widgets analíticos comerciales.",
            "consultant_tip": "Las plantillas de cockpit estandarizan la experiencia de usuario según el rol operativo del empleado."
        }
    },
    {
        "slide_index": 2,
        "capture_path": os.path.join(BASE_DIR, "Recursos_Audiovisuales", "CSL01_Introduction_Solution_ES", "Capturas_Originales_PDF", "slide_4_img_08.png"),
        "badge_title": "TAREA 02 / 04: ASIGNACIÓN DE CLIENTES A BILL",
        "script_text": "En la segunda tarea, vinculamos a Bill como responsable de las cuentas estratégicas. Abrimos el Maestro de Socios de Negocios en la tabla OCRD, localizamos los clientes C20000, C50000 y C60000, y asignamos a Bill en el campo Empleado de Ventas.",
        "step_guide": {
            "title": "Tarea 2: Asignación de Clientes al Empleado de Ventas",
            "menu_path": "Socios de Negocios > Datos Maestros Socio de Negocios",
            "action_type": "master_data",
            "instructions": [
                "Abre Datos Maestros de Socio de Negocios (Ctrl + F).",
                "Busca el código C20000 y pasa a Modo Modificar.",
                "En la pestaña General, selecciona a 'Bill' como Empleado de Ventas.",
                "Repite la asignación para los clientes C50000 y C60000."
            ],
            "expected_output": "Clientes C20000, C50000 y C60000 asignados formalmente a Bill.",
            "consultant_tip": "Asignar el empleado de ventas en OCRD permite calcular comisiones automáticas y filtrar informes de cartera por vendedor."
        }
    },
    {
        "slide_index": 3,
        "capture_path": os.path.join(BASE_DIR, "Recursos_Audiovisuales", "CSL01_Introduction_Solution_ES", "Capturas_Originales_PDF", "slide_5_img_12.png"),
        "badge_title": "TAREA 03 / 04: ACCESO RÁPIDO A ACTIVIDADES",
        "script_text": "En la tercera tarea, optimizamos la productividad del puesto configurando un acceso rápido. Utilizamos la herramienta de búsqueda de menús para localizar la función de Actividades y la arrastramos al widget de Funciones Comunes del Cockpit.",
        "step_guide": {
            "title": "Tarea 3: Configurar Acceso Rápido a Actividades",
            "menu_path": "Cockpit > Widget de Funciones Comunes",
            "action_type": "quick_access",
            "instructions": [
                "Utiliza la barra de búsqueda de menús superior para escribir 'Actividades'.",
                "Arrastra el acceso directo al widget de Funciones Comunes en el Cockpit.",
                "Comprueba que el clic abra directamente la ventana de gestión de tareas."
            ],
            "expected_output": "Acceso directo a Actividades fijado en el Cockpit Fiori.",
            "consultant_tip": "El widget de Funciones Comunes reduce hasta un 40% el tiempo de navegación en transacciones repetitivas."
        }
    },
    {
        "slide_index": 4,
        "capture_path": os.path.join(BASE_DIR, "Recursos_Audiovisuales", "CSL01_Introduction_Solution_ES", "Capturas_Originales_PDF", "slide_7_img_17.png"),
        "badge_title": "TAREA 04 / 04: OFERTA DE VENTA Y COPIAR A PEDIDO",
        "script_text": "En la cuarta tarea, ejecutamos el ciclo comercial inicial. Creamos una Oferta de Venta para el cliente C20000, seleccionamos artículos y cantidades, y utilizamos el botón Copiar a para transferir el documento íntegramente a un Pedido de Cliente.",
        "step_guide": {
            "title": "Tarea 4: Ciclo Comercial Oferta -> Pedido",
            "menu_path": "Ventas - Clientes > Oferta de Ventas",
            "action_type": "sales_cycle",
            "instructions": [
                "Abre Oferta de Ventas y selecciona el cliente C20000.",
                "Añade dos artículos de catálogo con sus cantidades y precios.",
                "Puntualiza la fecha de entrega y pulsa Crear.",
                "Haz clic en 'Copiar a' y selecciona 'Pedido de Cliente'."
            ],
            "expected_output": "Pedido de Cliente generado con trazabilidad directa a la oferta original.",
            "consultant_tip": "La función Copiar a preserva el historial del ciclo comercial y garantiza que no haya discrepancias de precios ni cantidades."
        }
    }
]


# =========================================================================
# 3. CSL02_Procurement_Process_ES (4 tareas de práctica)
# =========================================================================
CSL02_PRACTICE = [
    {
        "slide_index": 1,
        "capture_path": os.path.join(BASE_DIR, "Recursos_Audiovisuales", "CSL02_Procurement_Process_Solution_ES", "Capturas_Originales_PDF", "slide_3_img_04.png"),
        "badge_title": "TAREA 01 / 04: CREAR PEDIDO DE COMPRA (OPOR)",
        "script_text": "En la primera tarea de aprovisionamiento, registramos una orden formal de compra para nuestro proveedor habitual. Abrimos Pedido en el módulo de Compras, seleccionamos el proveedor, definimos el almacén de recepción y cargamos los artículos con sus cantidades y precios negociados.",
        "step_guide": {
            "title": "Tarea 1: Creación de Pedido de Compra (OPOR)",
            "menu_path": "Compras - Proveedores > Pedido",
            "action_type": "purchase_order",
            "instructions": [
                "Navega a Compras - Proveedores > Pedido.",
                "Selecciona el código de proveedor y verifica las condiciones de pago.",
                "Añade los artículos solicitados y asigna el almacén de destino.",
                "Haz clic en 'Crear' para generar el documento oficial de compra."
            ],
            "expected_output": "Pedido de compra registrado en estado Abierto sin impacto contable.",
            "consultant_tip": "El pedido de compra compromete el pedido pero no afecta el stock físico ni el balance contable hasta la recepción."
        }
    },
    {
        "slide_index": 2,
        "capture_path": os.path.join(BASE_DIR, "Recursos_Audiovisuales", "CSL02_Procurement_Process_Solution_ES", "Capturas_Originales_PDF", "slide_6_img_09.png"),
        "badge_title": "TAREA 02 / 04: ENTRADA DE MERCANCÍAS (OPDN)",
        "script_text": "En la segunda tarea, recibimos el material en almacén. Desde el pedido de compra utilizamos Copiar a Entrada de Mercancías por Pedido. Al guardar el albarán, el sistema incrementa el stock físico y registra automáticamente un asiento contable de provisión de compras en el Libro Mayor.",
        "step_guide": {
            "title": "Tarea 2: Recepción de Mercancías en Almacén",
            "menu_path": "Compras - Proveedores > Entrada de Mercancías por Pedido",
            "action_type": "goods_receipt",
            "instructions": [
                "Abre el pedido de compra y pulsa el botón 'Copiar a'.",
                "Selecciona 'Entrada de Mercancías por Pedido'.",
                "Verifica las cantidades recibidas físicamente en almacén.",
                "Haz clic en 'Crear' para contabilizar la entrada de existencias."
            ],
            "expected_output": "Incremento de inventario y asiento contable de provisión generado.",
            "consultant_tip": "La entrada de mercancías contabiliza un débito a existencias y un crédito a la cuenta transitoria de compras no facturadas."
        }
    },
    {
        "slide_index": 3,
        "capture_path": os.path.join(BASE_DIR, "Recursos_Audiovisuales", "CSL02_Procurement_Process_Solution_ES", "Capturas_Originales_PDF", "slide_9_img_14.png"),
        "badge_title": "TAREA 03 / 04: FACTURA DE PROVEEDORES (OPCH)",
        "script_text": "En la tercera tarea, contabilizamos la factura recibida del proveedor. Desde la entrada de mercancías copiamos a Factura de Proveedores. El sistema compensa la cuenta de provisión transitoria, liquida el IVA soportado y registra la deuda líquida a favor del proveedor.",
        "step_guide": {
            "title": "Tarea 3: Registro de Factura de Proveedores",
            "menu_path": "Compras - Proveedores > Factura de Proveedores",
            "action_type": "ap_invoice",
            "instructions": [
                "Desde la entrada de mercancías, haz clic en 'Copiar a' > 'Factura de Proveedores'.",
                "Introduce el número de factura fiscal del proveedor en 'Número de Referencia'.",
                "Verifica los importes, impuestos y fecha de vencimiento.",
                "Pulsa 'Crear' para asentar la deuda comercial."
            ],
            "expected_output": "Factura de proveedor registrada y cuenta a pagar generada en el pasivo.",
            "consultant_tip": "La factura de proveedor cancela la cuenta puente de compensación y deja la obligación lista para el ciclo de tesorería."
        }
    },
    {
        "slide_index": 4,
        "capture_path": os.path.join(BASE_DIR, "Recursos_Audiovisuales", "CSL02_Procurement_Process_Solution_ES", "Capturas_Originales_PDF", "slide_21_img_35.png"),
        "badge_title": "TAREA 04 / 04: PAGO Y MAPA DE RELACIONES",
        "script_text": "En la cuarta tarea, completamos la liquidación de la compra. Realizamos el pago efectuado mediante transferencia bancaria y abrimos el Mapa de Relaciones. Comprobamos la cadena documental completa desde el pedido hasta el pago final, con todos los documentos en estatus cerrado.",
        "step_guide": {
            "title": "Tarea 4: Pago y Auditoría de Trazabilidad",
            "menu_path": "Gestión de Bancos > Pagos Efectuados",
            "action_type": "payment_and_traceability",
            "instructions": [
                "Abre Pagos Efectuados y selecciona al proveedor.",
                "Marca la factura correspondiente y selecciona el medio de pago.",
                "Crea el pago y regresa a la factura.",
                "Haz clic derecho y selecciona 'Mapa de Relaciones'."
            ],
            "expected_output": "Mapa de relaciones completo con todos los nodos enlazados y cerrados.",
            "consultant_tip": "El mapa de relaciones es la herramienta de auditoría más potente de SAP B1 para verificar el cumplimiento del ciclo de compras."
        }
    }
]

if __name__ == "__main__":
    process_manual("CSI08_Query_Practice", CSI08_PRACTICE)
    process_manual("CSL01_Introduction_ES", CSL01_PRACTICE)
    process_manual("CSL02_Procurement_Process_ES", CSL02_PRACTICE)
