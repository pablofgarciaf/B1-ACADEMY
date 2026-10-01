# -*- coding: utf-8 -*-
"""
Generador Maestro A+ de Clase Magistral para:
CSI08_Query Practice_Solutions (17 Pasos Útiles de Consultas SAP Business One)
"""

import os
import sys
import json
import subprocess
try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

from PIL import Image, ImageDraw, ImageFont

BASE_DIR = r"C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP"
MANUAL_NAME = "CSI08_Query Practice_Solutions"
MANUAL_DIR = os.path.join(BASE_DIR, MANUAL_NAME)
CAPTURES_DIR = os.path.join(BASE_DIR, "Recursos_Audiovisuales", MANUAL_NAME, "Capturas_Originales_PDF")
SLIDES_DIR = os.path.join(MANUAL_DIR, "Imagenes_Diapositivas")
TEMP_DIR = r"C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\scratch\temp_csi08_build"

os.makedirs(SLIDES_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

FONT_BOLD = r"C:\Windows\Fonts\arialbd.ttf"
FONT_REGULAR = r"C:\Windows\Fonts\arial.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

font_title = get_font(FONT_BOLD, 22)
font_badge = get_font(FONT_BOLD, 17)

# 17 Pasos Oficiales con Capturas Reales de SAP Business One
STEPS_DATA = [
    {
        "slide_index": 1,
        "capture_file": "slide_4_img_05.png",
        "badge_title": "PASO 01 / 17: ACCESO AL GENERADOR DE CONSULTAS",
        "script_text": "Para iniciar la construcción de nuestras consultas personalizadas en SAP Business One, nos dirigimos al menú superior de Herramientas, desplegamos el submenú de Consultas y seleccionamos el Generador de Consultas. Esta herramienta nativa nos permite construir sentencias SQL de forma visual e interactiva sin necesidad de escribir código complejo a mano.",
        "step_guide": {
            "title": "Acceso al Generador de Consultas",
            "menu_path": "Herramientas > Consultas > Generador de Consultas",
            "action_type": "navigation",
            "instructions": [
                "Haz clic en el menú superior 'Herramientas'.",
                "Despliega la opción 'Consultas'.",
                "Selecciona 'Generador de Consultas'."
            ],
            "expected_output": "Ventana del Generador de Consultas abierta con el cursor posicionado en la primera casilla de tabla.",
            "consultant_tip": "El Generador de Consultas es ideal para prototipar sentencias SQL rápidas antes de guardarlas en el Administrador de Consultas o usarlas en dashboards."
        }
    },
    {
        "slide_index": 2,
        "capture_file": "slide_5_img_06.png",
        "badge_title": "PASO 02 / 17: TABLA OCRD Y CONDICIÓN WHERE",
        "script_text": "En el primer casillero de tabla, digitamos OCRD y presionamos la tecla Tabulador para cargar la estructura de Socios de Negocios. Hacemos doble clic en los campos requeridos: CardCode, CardName, Address, ZipCode, Balance y CntctPrsn. En la sección WHERE inferior, agregamos la condición haciendo doble clic en CardType, seleccionamos el operador igual y escribimos la letra C mayúscula entre comillas simples para filtrar estrictamente clientes.",
        "step_guide": {
            "title": "Tarea 1: Selección de Campos y Filtro en OCRD",
            "menu_path": "Herramientas > Consultas > Generador de Consultas",
            "action_type": "query_builder",
            "instructions": [
                "En el primer campo de tabla ingresa 'OCRD' y presiona Tab.",
                "Haz doble clic en los campos CardCode, CardName, Address, ZipCode, Balance y CntctPrsn para añadirlos al SELECT.",
                "En el bloque WHERE, selecciona CardType, el operador '=' y escribe 'C'."
            ],
            "expected_output": "Sentencia SQL configurada: SELECT CardCode, CardName, Address, ZipCode, Balance, CntctPrsn FROM OCRD WHERE CardType = 'C'.",
            "consultant_tip": "Al filtrar CardType = 'C', evitamos mezclar proveedores (S) y prospectos (L) en los reportes comerciales de saldos."
        }
    },
    {
        "slide_index": 3,
        "capture_file": "slide_5_img_07.png",
        "badge_title": "PASO 03 / 17: VISTA PREVIA Y SUMATORIA CON CTRL + CLIC",
        "script_text": "Hacemos clic en el botón Ejecutar para visualizar la grilla de resultados. Para ordenar la lista alfabéticamente por cliente, simplemente hacemos doble clic en la cabecera de la columna Nombre del Interlocutor Comercial. Además, un truco clave de productividad en SAP Business One: manteniendo presionada la tecla Control y haciendo clic sobre la cabecera Saldo de Cuenta, el sistema calcula de inmediato la sumatoria total al pie del informe.",
        "step_guide": {
            "title": "Ejecución de Consulta y Cálculo de Totales",
            "menu_path": "Ventana de Vista Previa de Consulta",
            "action_type": "execution",
            "instructions": [
                "Haz clic en 'Ejecutar' en el Generador de Consultas.",
                "Haz doble clic en la columna 'Nombre del Interlocutor' para ordenar de la A a la Z.",
                "Mantén presionada la tecla Ctrl y haz un clic en el encabezado 'Saldo de Cuenta' para obtener el total acumulado."
            ],
            "expected_output": "Grilla con clientes ordenados y la celda de totalización visible en el pie de página.",
            "consultant_tip": "La combinación Ctrl + Clic funciona en cualquier columna numérica de cualquier grilla o informe estándar de SAP Business One."
        }
    },
    {
        "slide_index": 4,
        "capture_file": "slide_6_img_10.png",
        "badge_title": "PASO 04 / 17: CREACIÓN DE CATEGORÍA DE CONSULTAS",
        "script_text": "En la barra superior de la vista previa, hacemos clic en Guardar. En el cuadro de diálogo Guardar Consulta, pulsamos el botón Tratar Categorías para organizar nuestros reportes corporativos. Añadimos una nueva categoría con el nombre 'Ventas' y confirmamos haciendo clic en el botón Actualizar. Esto mantendrá un entorno de consultas ordenado y segmentado por departamento.",
        "step_guide": {
            "title": "Tratar Categorías y Guardar Consulta",
            "menu_path": "Vista Previa de Consulta > Botón Guardar > Tratar Categorías",
            "action_type": "categorization",
            "instructions": [
                "En la ventana de Vista Previa, haz clic en el botón 'Guardar'.",
                "Pulsa el botón 'Tratar Categorías'.",
                "Escribe 'Ventas' en una nueva línea y haz clic en 'Actualizar'."
            ],
            "expected_output": "Nueva categoría 'Ventas' registrada en el catálogo de consultas de usuario.",
            "consultant_tip": "Mantener las consultas categorizadas por departamentos previene duplicidades y facilita la asignación de permisos por rol."
        }
    },
    {
        "slide_index": 5,
        "capture_file": "slide_7_img_11.png",
        "badge_title": "PASO 05 / 17: ASIGNACIÓN DE GRUPOS DE AUTORIZACIÓN",
        "script_text": "Seleccionamos la categoría Ventas recién creada y pulsamos el botón Asignar Grupo. Vinculamos la categoría al grupo Consultas Guardadas Número 1. Esta configuración es fundamental en implementaciones reales, ya que restringe el acceso a la información confidencial de clientes únicamente a los usuarios autorizados de ese grupo de seguridad.",
        "step_guide": {
            "title": "Seguridad y Autorizaciones de Consultas",
            "menu_path": "Tratar Categorías > Asignar Grupo",
            "action_type": "security",
            "instructions": [
                "Selecciona la fila de la categoría 'Ventas'.",
                "Haz clic en el botón 'Asignar Grupo'.",
                "Marca la casilla del Grupo Nº 1 (Consultas Guardadas) y pulsa Actualizar y OK."
            ],
            "expected_output": "Permisos de acceso vinculados al Grupo de Autorizaciones 1.",
            "consultant_tip": "En SAP B1 existen hasta 64 grupos de autorizaciones para consultas; vincular cada categoría a un grupo específico garantiza el cumplimiento de políticas de auditoría."
        }
    },
    {
        "slide_index": 6,
        "capture_file": "slide_9_img_12.png",
        "badge_title": "PASO 06 / 17: INSPECCIÓN CON INFORMACIÓN DEL SISTEMA",
        "script_text": "Para la Tarea 2 crearemos un informe dinámico de facturas abiertas. Para conocer los nombres técnicos de las tablas y campos en la base de datos, activamos la Información del Sistema con el atajo Control Shift I, o desde el menú Vista. Al colocar el cursor sobre el campo Fecha de Contabilización en una Factura de Clientes, la barra de estado inferior nos revela con precisión que la tabla es OINV y el campo técnico es DocDate.",
        "step_guide": {
            "title": "Tarea 2: Uso de Información del Sistema (Ctrl + Shift + I)",
            "menu_path": "Menú Principal > Ventas - Clientes > Factura de Deudores",
            "action_type": "system_info",
            "instructions": [
                "Abre cualquier Factura de Clientes.",
                "Presiona Ctrl + Shift + I (o activa Vista > Información del Sistema).",
                "Pasa el ratón sobre los campos del documento y lee la barra inferior: Tabla OINV, Campos DocNum, DocStatus, DocDate."
            ],
            "expected_output": "Información técnica visible en la barra de estado inferior de SAP Business One.",
            "consultant_tip": "La barra de información del sistema muestra la tabla física en base de datos, el nombre del campo, la longitud y el número de elemento en el formulario."
        }
    },
    {
        "slide_index": 7,
        "capture_file": "slide_10_img_14.png",
        "badge_title": "PASO 07 / 17: PARÁMETRO DINÁMICO DE FECHA [%0]",
        "script_text": "Abrimos nuevamente el Generador de Consultas y seleccionamos la tabla OINV. Agregamos DocNum, CardName, DocDate y DocTotal. En la sección WHERE incorporamos dos condiciones: primero, DocStatus igual a 'O' para filtrar únicamente documentos abiertos; y segundo, la cláusula AND con DocDate mayor que corchete porcentaje cero corchete. La variable porcentaje cero le indica a SAP que debe solicitar la fecha al usuario en tiempo de ejecución.",
        "step_guide": {
            "title": "Construcción de Filtro Parametrizado ([%0])",
            "menu_path": "Herramientas > Consultas > Generador de Consultas",
            "action_type": "parameter_query",
            "instructions": [
                "En el Generador de Consultas escribe OINV y presiona Tab.",
                "Agrega los campos DocNum, CardName, DocDate y DocTotal.",
                "En WHERE añade: T0.\"DocStatus\" = 'O' AND T0.\"DocDate\" > [%0]."
            ],
            "expected_output": "Sentencia SQL con variable dinámica [%0] lista para compilar.",
            "consultant_tip": "La sintaxis [%0] crea un parámetro obligatorio. Si añades múltiples parámetros secuenciales usa [%1], [%2], y el motor creará un formulario con varios campos de captura."
        }
    },
    {
        "slide_index": 8,
        "capture_file": "slide_12_img_15.png",
        "badge_title": "PASO 08 / 17: CUADRO DE DIÁLOGO DE PARÁMETROS",
        "script_text": "Al pulsar Ejecutar, SAP Business One detecta la variable porcentaje cero y abre automáticamente la ventana de Criterios de Selección. El motor de consultas reconoce de forma nativa que el campo evaluado es una fecha, por lo que nos despliega el icono de calendario para que el usuario elija la fecha de corte cómodamente sin escribir código.",
        "step_guide": {
            "title": "Ingreso Interactivo del Parámetro de Fecha",
            "menu_path": "Ventana Criterios de Selección de Consulta",
            "action_type": "runtime_parameter",
            "instructions": [
                "Haz clic en 'Ejecutar'.",
                "En la ventana emergente, pulsa el icono de calendario o presiona Tab.",
                "Selecciona una fecha de inicio (por ejemplo, el primer día del mes actual) y pulsa OK."
            ],
            "expected_output": "Ventana de parámetros interactiva respondiendo a la variable [%0].",
            "consultant_tip": "Al presionar Tab dentro del campo de criterio en SAP B1, se abre la lista de selección de valores válidos o el calendario interactivo."
        }
    },
    {
        "slide_index": 9,
        "capture_file": "slide_13_img_16.png",
        "badge_title": "PASO 09 / 17: FACTURAS FILTRADAS POR FECHA",
        "script_text": "La consulta se ejecuta en la base de datos SAP HANA y nos devuelve únicamente las facturas de deudores cuyo estado es abierto y cuya fecha de contabilización es posterior a la ingresada en el parámetro. Procedemos a guardar la consulta en la categoría Ventas con el nombre descriptivo 'Lista de Facturas Abiertas'.",
        "step_guide": {
            "title": "Validación de Resultados y Guardado de Facturas",
            "menu_path": "Vista Previa de Consulta > Guardar",
            "action_type": "validation",
            "instructions": [
                "Verifica que todas las filas devueltas correspondan a facturas con saldo abierto.",
                "Comprueba que las fechas de contabilización sean mayores a la fecha ingresada.",
                "Haz clic en Guardar y nómbrala 'Lista de Facturas Abiertas' en la categoría 'Ventas'."
            ],
            "expected_output": "Reporte de facturas abierto y consulta almacenada en el repositorio.",
            "consultant_tip": "Las consultas parametrizadas guardadas pueden ser ejecutadas directamente por usuarios finales sin que ellos conozcan SQL."
        }
    },
    {
        "slide_index": 10,
        "capture_file": "slide_14_img_18.png",
        "badge_title": "PASO 10 / 17: CONSULTA MULTITABLA (INNER JOIN)",
        "script_text": "Iniciamos la Tarea 3 para generar reportes que cruzan información de múltiples tablas. Al ingresar en el Generador la cabecera del documento OINV en el primer casillero y las líneas de detalle INV1 en el segundo casillero, SAP Business One vincula automáticamente ambas entidades mediante la clave relacional T0 punto DocEntry igual a T1 punto DocEntry. Añadimos el filtro DocStatus igual a 'O' y definimos el ordenamiento por el Empleado de Ventas.",
        "step_guide": {
            "title": "Tarea 3: Relaciones Multitabla en Generador de Consultas",
            "menu_path": "Herramientas > Consultas > Generador de Consultas",
            "action_type": "join_query",
            "instructions": [
                "Limpia la ventana e ingresa en la primera casilla OINV y en la segunda casilla INV1.",
                "Verifica la relación automática por la clave primaria y foránea DocEntry.",
                "Selecciona DocNum, CardName, ItemCode, Dscription, Quantity, Price y SlpName.",
                "En la cláusula Ordenar Por, selecciona SlpName."
            ],
            "expected_output": "Consulta relacional cabecera-detalle estructurada visualmente.",
            "consultant_tip": "En SAP Business One, las tablas de cabecera comienzan con 'O' (OINV, ORDR, OPOR) y las de líneas sustituyen la 'O' por el número 1 (INV1, RDR1, POR1)."
        }
    },
    {
        "slide_index": 11,
        "capture_file": "slide_15_img_19.png",
        "badge_title": "PASO 11 / 17: AUDITORÍA DE LÍNEAS Y REPRESENTANTES",
        "script_text": "Al ejecutar la consulta relacional, obtenemos una vista completa y desglosada donde cada factura muestra cada uno de los artículos comercializados, sus precios unitarios, cantidades e importes de línea, todo agrupado por el representante comercial responsable. Esta información permite auditar comisiones y rendimiento de ventas de manera inmediata.",
        "step_guide": {
            "title": "Análisis Detallado por Línea de Documento",
            "menu_path": "Ventana de Vista Previa de Consulta Multitabla",
            "action_type": "multitable_results",
            "instructions": [
                "Haz clic en 'Ejecutar'.",
                "Comprueba que los datos de cabecera (Cliente, Número) se repitan armónicamente por cada línea de artículo.",
                "Guarda la consulta en la categoría 'Ventas' con el nombre 'Ofertas y Facturas por Representante'."
            ],
            "expected_output": "Informe multitabla con trazabilidad completa de productos y vendedores.",
            "consultant_tip": "Las consultas relacionales entre cabecera y detalle son el fundamento principal para auditar márgenes de beneficio por línea de producto."
        }
    },
    {
        "slide_index": 12,
        "capture_file": "slide_16_img_20.png",
        "badge_title": "PASO 12 / 17: LISTA DE TRABAJO DIARIA (ORDR)",
        "script_text": "En la Tarea 4 preparamos una lista de trabajo operativa para los gestores comerciales. Construimos una consulta sobre la tabla de Pedidos de Clientes ORDR, extrayendo el número de orden, el cliente, el importe total y la fecha de entrega comprometida, filtrando por la fecha actual. Esta consulta servirá como disparador automático del sistema de alertas.",
        "step_guide": {
            "title": "Tarea 4: Consulta de Seguimiento Diario (ORDR)",
            "menu_path": "Herramientas > Consultas > Generador de Consultas",
            "action_type": "workflow_query",
            "instructions": [
                "Carga la tabla ORDR en el Generador de Consultas.",
                "Selecciona DocNum, CardCode, CardName, DocTotal y DocDueDate.",
                "En WHERE establece la condición de fecha actual: DocDate = CURRENT_DATE.",
                "Guarda la consulta como 'Pedidos de Ventas del Día' en la categoría 'Ventas'."
            ],
            "expected_output": "Consulta de trabajo diario guardada para integración con alertas.",
            "consultant_tip": "Filtrar por CURRENT_DATE en SAP HANA permite que la consulta sea completamente dinámica y no requiera mantenimiento diario."
        }
    },
    {
        "slide_index": 13,
        "capture_file": "slide_17_img_21.png",
        "badge_title": "PASO 13 / 17: GESTIÓN DE ALARMAS Y VINCULACIÓN",
        "script_text": "Accedemos a Gestión, Alarmas y abrimos Gestión de Alarmas. Creamos un nuevo registro de alarma, le asignamos una descripción clara y pulsamos el botón Abrir Consulta Guardada. Desde el Administrador de Consultas, seleccionamos nuestra consulta 'Pedidos de Ventas del Día' ubicada en la categoría Ventas.",
        "step_guide": {
            "title": "Automatización de Alarmas del Sistema",
            "menu_path": "Gestión > Alarmas > Gestión de Alarmas",
            "action_type": "alert_setup",
            "instructions": [
                "Navega a Gestión > Alarmas > Gestión de Alarmas.",
                "Cambia a Modo Añadir (Ctrl + A).",
                "Asigna el nombre 'Alerta Pedidos de Ventas de Hoy'.",
                "Haz clic en 'Abrir Consulta Guardada' y selecciona la consulta de la categoría 'Ventas'."
            ],
            "expected_output": "Alarma vinculada formalmente a la consulta SQL personalizada.",
            "consultant_tip": "El módulo de alarmas ejecuta la consulta de fondo; si la consulta devuelve al menos un registro, el sistema dispara los mensajes inmediatamente."
        }
    },
    {
        "slide_index": 14,
        "capture_file": "slide_17_img_22.png",
        "badge_title": "PASO 14 / 17: FRECUENCIA Y DESTINATARIOS DE ALARMA",
        "script_text": "En la parte inferior de la ventana de Alarmas configuramos la frecuencia de ejecución, por ejemplo cada 2 horas o diaria a primera hora de la mañana. En la grilla de usuarios seleccionamos al usuario Manager o al Responsable de Ventas y marcamos la casilla Interno para que reciba un mensaje emergente en su pantalla de SAP en cuanto existan nuevos pedidos.",
        "step_guide": {
            "title": "Programación de Frecuencia y Usuarios Destino",
            "menu_path": "Gestión de Alarmas > Pestaña Destinatarios y Frecuencia",
            "action_type": "alert_schedule",
            "instructions": [
                "Establece la frecuencia de repetición en 'Cada 2 Horas' (o Diaria).",
                "En la lista de usuarios, localiza a 'manager' y 'director'.",
                "Marca la columna 'Interno' para notificación en SAP y opcionalmente 'Email'.",
                "Haz clic en 'Añadir' para activar el servicio de alertas."
            ],
            "expected_output": "Servicio de alertas programado y activo en el servidor de SAP Business One.",
            "consultant_tip": "Para que los correos electrónicos se envíen al exterior, se requiere tener configurado el servicio SBO Mailer en el System Landscape Directory."
        }
    },
    {
        "slide_index": 15,
        "capture_file": "slide_18_img_24.png",
        "badge_title": "PASO 15 / 17: CONSULTA AGREGADA DE RECUENTO (ODLN)",
        "script_text": "Para la Tarea 5 diseñaremos un indicador visual en el panel de control. Diseñamos una consulta sobre la tabla de Entregas ODLN seleccionando el número de documento con la condición de contabilización igual a la fecha de hoy. Este resultado alimentará un widget de recuento en el Cockpit Fiori para que la gerencia vea en tiempo real cuántas entregas se han despachado en el día.",
        "step_guide": {
            "title": "Tarea 5: Consulta de Recuento para Cockpit Fiori",
            "menu_path": "Herramientas > Consultas > Generador de Consultas",
            "action_type": "count_query",
            "instructions": [
                "En el Generador de Consultas, selecciona la tabla ODLN (Entregas).",
                "Selecciona el campo DocNum.",
                "En WHERE añade la condición DocDate = CURRENT_DATE (o fecha de demostración).",
                "Guarda la consulta en Ventas con el nombre 'Entregas del Día'."
            ],
            "expected_output": "Consulta de recuento lista para enlazar a widgets analíticos.",
            "consultant_tip": "Las consultas para widgets de recuento (Count Widgets) deben retornar registros individuales o un recuento que el cockpit procesará automáticamente."
        }
    },
    {
        "slide_index": 16,
        "capture_file": "slide_19_img_28.png",
        "badge_title": "PASO 16 / 17: CONFIGURACIÓN DE WIDGET DE RECUENTO",
        "script_text": "Nos dirigimos a Herramientas, Cockpit y abrimos la Configuración de Widget de Recuento. Pasamos al Modo Añadir y definimos el código y nombre del widget, por ejemplo 'Entregas Hoy'. En el campo Tipo seleccionamos Recuento de Objetos de Negocio y vinculamos la consulta de entregas que acabamos de guardar.",
        "step_guide": {
            "title": "Creación del Widget en Cockpit Fiori",
            "menu_path": "Herramientas > Cockpit > Configuración de Widget de Recuento",
            "action_type": "widget_setup",
            "instructions": [
                "Navega a Herramientas > Cockpit > Configuración de widget de recuento.",
                "Presiona Ctrl + A para añadir un nuevo registro.",
                "Ingresa Código 'W_ENTREGAS' y Nombre 'Entregas Hoy'.",
                "En 'Consulta' selecciona 'Entregas del Día' de la categoría Ventas y pulsa Añadir."
            ],
            "expected_output": "Widget de recuento configurado en el catálogo corporativo.",
            "consultant_tip": "Puedes asignar colores y umbrales de alerta a los widgets de recuento para que el número cambie a rojo si no se alcanza la meta mínima."
        }
    },
    {
        "slide_index": 17,
        "capture_file": "slide_19_img_27.png",
        "badge_title": "PASO 17 / 17: PUBLICACIÓN EN COCKPIT FIORI",
        "script_text": "Finalmente, en la pantalla principal de SAP Business One, hacemos clic en el signo más de la Galería de Widgets del Cockpit Fiori. Localizamos nuestro widget 'Entregas Hoy' y pulsamos el botón de anclaje. A partir de este momento, cada vez que almacén registre un albarán de entrega, el contador numérico del Cockpit se actualizará en tiempo real, completando así una solución integral de inteligencia de negocios.",
        "step_guide": {
            "title": "Publicación y Monitoreo en el Cockpit",
            "menu_path": "Pantalla Principal > Cockpit Fiori > Galería de Widgets",
            "action_type": "cockpit_deploy",
            "instructions": [
                "Regresa a la pantalla principal de SAP Business One.",
                "Haz clic en el icono '+' en el Cockpit para abrir la Galería de Widgets.",
                "Localiza 'Entregas Hoy' y pulsa el botón de anclaje (+).",
                "Observa cómo el contador numérico refleja los despachos en tiempo real."
            ],
            "expected_output": "Widget analítico de recuento anclado y operativo en el Cockpit Fiori.",
            "consultant_tip": "Los widgets de recuento se actualizan automáticamente según la frecuencia de refresco definida en las parametrizaciones del Cockpit de SAP HANA."
        }
    }
]

def render_slide_image(step_data, total_steps):
    W, H = 1920, 1080
    canvas = Image.new('RGB', (W, H), (11, 16, 27))
    draw = ImageDraw.Draw(canvas)

    # Top Header Bar
    draw.rectangle([0, 0, W, 72], fill=(15, 23, 42))
    draw.line([0, 72, W, 72], fill=(217, 119, 6), width=3)

    # Academy Branding
    draw.text((45, 24), "B1 ACADEMY • LABORATORIO OFICIAL SAP BUSINESS ONE 10.0 (HANA)", font=font_title, fill=(248, 250, 252))

    # Right Badge
    badge_text = step_data["badge_title"]
    bbox = font_badge.getbbox(badge_text)
    bw = bbox[2] - bbox[0] + 32
    bx = W - bw - 45
    draw.rounded_rectangle([bx, 15, W - 45, 57], radius=6, fill=(30, 58, 138), outline=(59, 130, 246))
    draw.text((bx + 16, 24), badge_text, font=font_badge, fill=(224, 231, 255))

    # Cargar captura real
    capture_path = os.path.join(CAPTURES_DIR, step_data["capture_file"])
    if not os.path.exists(capture_path):
        print(f"[!] No existe captura: {capture_path}")
        return None

    screenshot = Image.open(capture_path).convert("RGB")
    sw, sh = screenshot.size

    # Maximizar captura en el canvas: x in [60, 1860], y in [95, 1045]
    max_w = W - 120 # 1800
    max_h = H - 95 - 45 # 940

    ratio = min(max_w / sw, max_h / sh)
    target_w = int(sw * ratio)
    target_h = int(sh * ratio)

    scaled_shot = screenshot.resize((target_w, target_h), Image.Resampling.LANCZOS)

    pos_x = (W - target_w) // 2
    pos_y = 95 + (max_h - target_h) // 2

    # Marco sutil
    pad = 3
    draw.rounded_rectangle([pos_x - pad, pos_y - pad, pos_x + target_w + pad, pos_y + target_h + pad], radius=6, outline=(51, 65, 85), width=2)
    canvas.paste(scaled_shot, (pos_x, pos_y))

    idx = step_data["slide_index"]
    out_name = f"Slide_{idx:02d}.webp"
    out_path = os.path.join(SLIDES_DIR, out_name)
    canvas.save(out_path, "WEBP", quality=95)
    return out_name

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

def build_masterclass():
    print(f"\n==================================================================")
    print(f"🚀 INICIANDO PRODUCCIÓN A+ DE CLASE MAGISTRAL: {MANUAL_NAME}")
    print(f"==================================================================")

    # Limpiar directorio de diapositivas viejas
    for f in os.listdir(SLIDES_DIR):
        if f.endswith(".webp") or f.endswith(".png"):
            try:
                os.remove(os.path.join(SLIDES_DIR, f))
            except Exception:
                pass

    total_steps = len(STEPS_DATA)
    clips_list = []
    current_time = 0.0
    sync_records = []

    for step in STEPS_DATA:
        idx = step["slide_index"]
        print(f"\n--- Procesando Paso {idx:02d} / {total_steps:02d} ---")
        
        # 1. Renderizar Lámina 1080p
        img_file = render_slide_image(step, total_steps)
        step["image_file"] = img_file
        print(f"  [OK] Lámina 1080p: {img_file}")

        # 2. Generar Audio con edge-tts (JorgeNeural)
        audio_file = os.path.join(TEMP_DIR, f"aud_{idx:02d}.mp3")
        clip_file = os.path.join(TEMP_DIR, f"clip_{idx:02d}.mp4")
        text = step["script_text"].replace('"', '').replace('$', '').replace('\n', ' ')

        cmd_tts = f'edge-tts --text "{text}" --voice es-MX-JorgeNeural --write-media "{audio_file}"'
        subprocess.run(cmd_tts, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        dur = get_audio_duration(audio_file)
        pad_pause = 0.6
        clip_dur = dur + pad_pause

        # Tiempos milimétricos para teleprompter
        start_t = round(current_time, 3)
        current_time += clip_dur
        end_t = round(current_time, 3)

        sync_records.append({
            "slide_index": idx,
            "image_file": img_file,
            "script_text": step["script_text"],
            "step_guide": step["step_guide"],
            "start_time": start_t,
            "end_time": end_t
        })

        # 3. Compilar clip 1080p
        img_full_path = os.path.join(SLIDES_DIR, img_file)
        cmd_ffmpeg = (
            f'ffmpeg -y -loop 1 -framerate 25 -i "{img_full_path}" -i "{audio_file}" '
            f'-vf "scale=1920:1080" -c:v libx264 -preset veryfast -crf 23 '
            f'-af "apad=pad_dur={pad_pause}" -c:a aac -b:a 128k -ar 44100 -pix_fmt yuv420p '
            f'-t {clip_dur} "{clip_file}"'
        )
        subprocess.run(cmd_ffmpeg, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        clips_list.append(clip_file)
        print(f"  [OK] Clip Video 1080p generado ({dur:.1f}s locución).")

    # 4. Guardar clase_sync.json
    sync_path = os.path.join(MANUAL_DIR, "clase_sync.json")
    with open(sync_path, "w", encoding="utf-8") as f:
        json.dump(sync_records, f, indent=2, ensure_ascii=False)
    print(f"\n[OK] Sincronización guardada: {sync_path}")

    # 5. Concatenar clips con ffmpeg
    concat_txt = os.path.join(TEMP_DIR, "concat_list.txt")
    with open(concat_txt, "w", encoding="utf-8") as f:
        for c in clips_list:
            clean_p = c.replace('\\', '/')
            f.write(f"file '{clean_p}'\n")

    final_video = os.path.join(MANUAL_DIR, "clase_video.mp4")
    cmd_concat = (
        f'ffmpeg -y -f concat -safe 0 -i "{concat_txt}" '
        f'-c copy "{final_video}"'
    )
    print(f"\n🎬 Concatenando video final...")
    subprocess.run(cmd_concat, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    total_min = current_time / 60.0
    print(f"\n==================================================================")
    print(f"🎉 MASTERCLASS COMPLETADA CON ÉXITO: {final_video}")
    print(f"   Duración total: {current_time:.1f}s ({total_min:.1f} minutos)")
    print(f"   Total diapositivas útiles: {total_steps}")
    print(f"==================================================================")

if __name__ == "__main__":
    build_masterclass()
