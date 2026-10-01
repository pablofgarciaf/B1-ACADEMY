# -*- coding: utf-8 -*-
"""
Generador Maestro Pedagógico A+ de Clases Magistrales para:
1. CSI08_Query_Practice (5 pasos prácticos)
2. CSI08_Query Practice_Solutions (17 pasos de soluciones)
Aplica la voz del Consultor Senior y Docente de Élite de SAP Business One.
CERO lectura de clics como loro. CERO muletillas. 100% Pedagogía y Negocio Real.
"""

import os
import sys
import json
import subprocess
import asyncio
import edge_tts

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

BASE_DIR = r"C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP"
TEMP_BASE = r"C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\scratch\temp_elite_build"
os.makedirs(TEMP_BASE, exist_ok=True)

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
    except Exception:
        return 20.0

def build_masterclass(manual_name, lessons_data):
    manual_dir = os.path.join(BASE_DIR, manual_name)
    slides_dir = os.path.join(manual_dir, "Imagenes_Diapositivas")
    temp_dir = os.path.join(TEMP_BASE, manual_name.replace(" ", "_").replace("-", "_"))
    os.makedirs(temp_dir, exist_ok=True)

    print(f"\n==================================================================")
    print(f"🎓 GENERANDO CLASE PEDAGÓGICA MAGISTRAL: {manual_name}")
    print(f"==================================================================")

    sync_records = []
    clips_list = []
    current_time = 0.0
    total_steps = len(lessons_data)

    for item in lessons_data:
        idx = item["slide_index"]
        img_file = item["image_file"]
        script_text = item["script_text"].strip()
        step_guide = item["step_guide"]

        img_path = os.path.join(slides_dir, img_file)
        if not os.path.exists(img_path):
            print(f"[!] No existe imagen: {img_path}")
            continue

        audio_file = os.path.join(temp_dir, f"aud_{idx:02d}.mp3")
        clip_file = os.path.join(temp_dir, f"clip_{idx:02d}.mp4")

        # Generar locución neuronal docente con UTF-8 nativo
        clean_text = script_text.replace('"', '').replace('$', '').replace('\n', ' ')
        async def gen_tts(text, path):
            comm = edge_tts.Communicate(text, "es-MX-JorgeNeural")
            await comm.save(path)
        asyncio.run(gen_tts(clean_text, audio_file))

        dur = get_audio_duration(audio_file)
        pad_pause = 0.8  # Pausa pedagógica al cambiar de concepto
        clip_dur = dur + pad_pause

        start_t = round(current_time, 3)
        current_time += clip_dur
        end_t = round(current_time, 3)

        sync_records.append({
            "slide_index": idx,
            "image_file": img_file,
            "script_text": script_text,
            "step_guide": step_guide,
            "start_time": start_t,
            "end_time": end_t
        })

        # Compilar clip en Full HD 1080p
        cmd_ffmpeg = (
            f'ffmpeg -y -loop 1 -framerate 25 -i "{img_path}" -i "{audio_file}" '
            f'-vf "scale=1920:1080" -c:v libx264 -preset veryfast -crf 23 '
            f'-af "apad=pad_dur={pad_pause}" -c:a aac -b:a 128k -ar 44100 -pix_fmt yuv420p '
            f'-t {clip_dur} "{clip_file}"'
        )
        subprocess.run(cmd_ffmpeg, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        clips_list.append(clip_file)
        print(f"  [OK] Lección {idx:02d}/{total_steps:02d}: {dur:.1f}s locución didáctica -> Clip generado.")

    # Guardar clase_sync.json
    sync_path = os.path.join(manual_dir, "clase_sync.json")
    with open(sync_path, "w", encoding="utf-8") as f:
        json.dump(sync_records, f, indent=2, ensure_ascii=False)

    # Concatenar video final de la masterclass
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
    print(f"🎉 MASTERCLASS COMPLETADA: {manual_name} -> {final_video} ({current_time/60.0:.1f} min)")


# =========================================================================
# 1. CSI08_Query_Practice (5 Lecciones Pedagógicas de Élite)
# =========================================================================
CSI08_PRACTICE_LESSONS = [
    {
        "slide_index": 1,
        "image_file": "Slide_01.webp",
        "script_text": (
            "En el día a día de una empresa que opera con SAP Business One, la gerencia comercial necesita informes inmediatos de su cartera de clientes. "
            "Como consultores, nuestro primer instinto debe ser recurrir a la tabla maestra OCRD. "
            "Pero aquí hay una trampa clásica en la que caen los principiantes: la tabla OCRD no solo guarda clientes, también almacena a todos los proveedores y prospectos de la compañía. "
            "Si omites el filtro CardType igual a C, tu reporte mezclará cuentas por cobrar con cuentas por pagar, distorsionando por completo la liquidez del negocio. "
            "Por eso, dominar la estructura de campos como CardCode, CardName y Balance junto con la condición WHERE es el primer mandamiento de las consultas en SAP."
        ),
        "step_guide": {
            "title": "Tarea 1: Arquitectura de Clientes en OCRD",
            "menu_path": "Herramientas > Consultas > Generador de Consultas",
            "action_type": "query_builder",
            "instructions": [
                "Carga la tabla maestra 'OCRD' en el casillero principal del Generador de Consultas.",
                "Selecciona los campos de identificación y saldo: CardCode, CardName, Address, Balance y CntctPrsn.",
                "En la sección WHERE, incorpora la condición estricta: CardType = 'C' para aislar clientes."
            ],
            "expected_output": "Sentencia SELECT con campos de cliente y filtro WHERE CardType = 'C'.",
            "consultant_tip": "Al filtrar CardType = 'C', evitamos cruces indebidos con proveedores ('S') y prospectos ('L')."
        }
    },
    {
        "slide_index": 2,
        "image_file": "Slide_02.webp",
        "script_text": (
            "Un error muy común de los desarrolladores novatos es 'quemar' o dejar fijas las fechas en el código SQL. "
            "Si creas una consulta con una fecha estática, al día siguiente ya no le sirve a nadie en la empresa. "
            "En SAP Business One tenemos una de las herramientas más elegantes del ERP: los parámetros dinámicos con porcentaje cero entre corchetes. "
            "Al asociar esta variable a la fecha de contabilización DocDate en la tabla de facturas OINV, el motor de SAP genera automáticamente un calendario interactivo en pantalla para el usuario final. "
            "Esto significa que cualquier administrativo de ventas puede ejecutar el reporte con el rango de fechas que necesite, sin tener que saber una sola línea de código SQL."
        ),
        "step_guide": {
            "title": "Tarea 2: Parámetro Dinámico de Fecha ([%0])",
            "menu_path": "Herramientas > Consultas > Generador de Consultas",
            "action_type": "dynamic_parameter",
            "instructions": [
                "Carga la tabla de facturas de deudores 'OINV' en el Generador.",
                "Selecciona los campos DocNum, CardName, DocDate y DocTotal.",
                "En WHERE añade la condición combinada: DocStatus = 'O' AND DocDate > [%0]."
            ],
            "expected_output": "Apertura de la ventana interactiva solicitando la fecha de corte [%0].",
            "consultant_tip": "La variable [%0] convierte una consulta técnica en un formulario interactivo amigable para el usuario."
        }
    },
    {
        "slide_index": 3,
        "image_file": "Slide_03.webp",
        "script_text": (
            "Cuando la gerencia nos pide un reporte que incluya tanto el nombre de la empresa como los artículos específicos que compró, una sola tabla no es suficiente. "
            "Aquí es donde entra el modelo relacional de SAP Business One. "
            "Por convención oficial en SAP, todas las tablas de cabecera comienzan con la letra O, como OINV para facturas, mientras que las tablas de líneas de artículos sustituyen esa O por el número uno, como INV1. "
            "Ambas se comunican a través de un identificador numérico interno único llamado DocEntry. "
            "Al cargar ambas tablas en el Generador de Consultas, SAP formula el cruce interno de manera automática, permitiéndonos auditar cantidades, precios unitarios y el representante comercial SlpName con total consistencia contable."
        ),
        "step_guide": {
            "title": "Tarea 3: Modelo Relacional Cabecera-Líneas (OINV + INV1)",
            "menu_path": "Herramientas > Consultas > Generador de Consultas",
            "action_type": "multitable_join",
            "instructions": [
                "Ingresa OINV en la casilla 1 e INV1 en la casilla 2 del Generador.",
                "Comprueba la relación relacional automática mediante el campo clave DocEntry.",
                "Selecciona campos de cabecera (DocNum, CardName) y de detalle (ItemCode, Dscription, Quantity, Price).",
                "Ordena por SlpName y ejecuta para validar la consistencia de los datos."
            ],
            "expected_output": "Grilla detallada con artículos, cantidades y totales desglosados por factura.",
            "consultant_tip": "Las tablas de cabecera inician con 'O' y las de líneas con '1' (OINV/INV1, ORDR/RDR1, OPOR/POR1)."
        }
    },
    {
        "slide_index": 4,
        "image_file": "Slide_04.webp",
        "script_text": (
            "Una consulta SQL no debe quedarse guardada como un simple archivo muerto en el sistema; su verdadero valor radica en convertirla en un centinela activo de control interno. "
            "En este ejercicio conectamos la consulta de clientes con el módulo de Gestión de Alarmas. "
            "Al evaluar en tiempo real si el saldo de cuenta supera el límite de crédito fijado en la empresa, configuramos una alerta automática que se dispara periódicamente. "
            "De esta forma, el departamento de créditos y cobranzas recibe una notificación instantánea en su pantalla antes de que ventas intente despachar un nuevo pedido a un cliente moroso, blindando el flujo de caja de la compañía."
        ),
        "step_guide": {
            "title": "Tarea 4: Automatización de Alarmas del Sistema",
            "menu_path": "Gestión > Alarmas > Gestión de Alarmas",
            "action_type": "alert_setup",
            "instructions": [
                "Construye la consulta sobre OCRD comparando Balance > CreditLine.",
                "Guarda la consulta en la categoría 'Ventas'.",
                "En Gestión de Alarmas, vincula la consulta y define periodicidad de sondeo y usuarios destinatarios."
            ],
            "expected_output": "Alarma programada que notifica automáticamente excesos en el límite de crédito.",
            "consultant_tip": "Las alarmas basadas en consultas permiten anticipar riesgos financieros sin requerir revisión manual."
        }
    },
    {
        "slide_index": 5,
        "image_file": "Slide_05.webp",
        "script_text": (
            "La consultoría moderna en SAP HANA no consiste en entregar tablas de datos aburridas, sino en proporcionar inteligencia visual accionable para la toma de decisiones. "
            "En este último paso, transformamos una consulta sobre la tabla de entregas abiertas ODLN en un widget interactivo de recuento para el Cockpit estilo Fiori. "
            "Al anclar este indicador visual en el panel principal del usuario de almacén, el equipo operativo puede monitorear de un solo vistazo los pedidos pendientes de despacho en tiempo real, agilizando la logística sin necesidad de ingresar a los menús tradicionales del ERP."
        ),
        "step_guide": {
            "title": "Tarea 5: Widgets Analíticos en Cockpit Fiori",
            "menu_path": "Herramientas > Cockpit > Widgets de Recuento",
            "action_type": "dashboard_widget",
            "instructions": [
                "Crea una consulta sobre ODLN filtrando entregas abiertas con fecha de hoy.",
                "Abre la configuración de Widgets de Recuento en el Cockpit Fiori.",
                "Asigna la consulta al nuevo widget y anclalo en el panel principal de operaciones."
            ],
            "expected_output": "Widget de recuento activo en la pantalla principal reflejando entregas pendientes.",
            "consultant_tip": "Los widgets de recuento en SAP HANA ofrecen visibilidad instantánea de cuellos de botella operativos."
        }
    }
]


# =========================================================================
# 2. CSI08_Query Practice_Solutions (17 Lecciones Magistrales de Consultoría)
# =========================================================================
CSI08_SOLUTIONS_LESSONS = [
    {
        "slide_index": 1,
        "image_file": "Slide_01.webp",
        "script_text": (
            "En SAP Business One disponemos de dos herramientas nativas para construir consultas: el Asistente de Consultas y el Generador de Consultas. "
            "Mientras que el Asistente es guiado paso a paso para usuarios finales, el Generador de Consultas es la estación de trabajo predilecta del consultor profesional porque nos permite diseñar, probar y optimizar sentencias SQL complejas en una sola pantalla visual. "
            "Desde aquí podemos cargar tablas directamente de la base de datos SAP HANA, seleccionar columnas con doble clic y verificar la estructura relacional del sistema en tiempo real."
        ),
        "step_guide": {
            "title": "Lección 1: Filosofía y Acceso al Generador de Consultas",
            "menu_path": "Herramientas > Consultas > Generador de Consultas",
            "action_type": "navigation",
            "instructions": [
                "Haz clic en el menú superior 'Herramientas'.",
                "Despliega el submenú 'Consultas'.",
                "Selecciona 'Generador de Consultas'."
            ],
            "expected_output": "Ventana del Generador de Consultas abierta con el cursor en la casilla de tabla.",
            "consultant_tip": "El Generador de Consultas traduce directamente la selección visual a sintaxis SQL de SAP HANA."
        }
    },
    {
        "slide_index": 2,
        "image_file": "Slide_02.webp",
        "script_text": (
            "Comenzamos resolviendo la primera tarea sobre la tabla de interlocutores comerciales OCRD. "
            "Al presionar la tecla Tabulador en la casilla de tabla, el sistema carga el diccionario de datos. "
            "Al seleccionar campos con mayúsculas y minúsculas en bases de datos SAP HANA, recuerda que el motor requiere comillas dobles en los nombres de campo. "
            "El paso crítico aquí es la cláusula WHERE: aplicar CardType igual a C mayúscula entre comillas simples. "
            "Esta condición garantiza la pureza del informe, asegurando que los saldos correspondan exclusivamente a deudores comerciales y no a acreedores de compras."
        ),
        "step_guide": {
            "title": "Lección 2: Selección Técnica en OCRD y Cláusula WHERE",
            "menu_path": "Herramientas > Consultas > Generador de Consultas",
            "action_type": "query_builder",
            "instructions": [
                "Ingresa 'OCRD' en la casilla de tabla y pulsa Tab.",
                "Selecciona con doble clic: CardCode, CardName, Address, ZipCode, Balance y CntctPrsn.",
                "En la sección WHERE, introduce CardType = 'C'."
            ],
            "expected_output": "Sentencia SQL configurada: SELECT CardCode, CardName... FROM OCRD WHERE CardType = 'C'.",
            "consultant_tip": "En SAP HANA, los identificadores sensibles a mayúsculas requieren comillas dobles obligatorias."
        }
    },
    {
        "slide_index": 3,
        "image_file": "Slide_03.webp",
        "script_text": (
            "Al presionar Ejecutar pasamos a la grilla de resultados. "
            "Aquí existen dos técnicas indispensables de productividad: la primera es hacer doble clic sobre el encabezado de cualquier columna para ordenar al instante de forma ascendente o descendente en memoria sin sobrecargar el servidor de base de datos. "
            "La segunda es uno de los mejores secretos de consultoría en SAP: si mantienes presionada la tecla Control y haces clic en la cabecera de la columna Saldo de Cuenta, SAP Business One calcula de inmediato la sumatoria matemática total en el pie de página, ahorrándote exportar a hojas de cálculo."
        ),
        "step_guide": {
            "title": "Lección 3: Grilla de Resultados y Atajo Secreto Ctrl + Clic",
            "menu_path": "Ventana de Vista Previa de Consulta",
            "action_type": "execution",
            "instructions": [
                "Haz clic en 'Ejecutar' en el Generador de Consultas.",
                "Ordena haciendo doble clic en el encabezado de la columna 'Nombre'.",
                "Mantén pulsada la tecla Ctrl y haz un clic en 'Saldo de Cuenta' para calcular la sumatoria."
            ],
            "expected_output": "Grilla ordenada con celda de totalización activa en la barra inferior.",
            "consultant_tip": "El atajo Ctrl + Clic funciona sobre cualquier columna numérica en cualquier informe estándar de SAP B1."
        }
    },
    {
        "slide_index": 4,
        "image_file": "Slide_04.webp",
        "script_text": (
            "El gobierno de datos es una responsabilidad vital del consultor. "
            "En una empresa con cientos de reportes, guardar consultas en carpetas genéricas genera duplicidad y desorden. "
            "Mediante la opción Tratar Categorías, creamos una estructura departamental limpia; en este caso, la categoría Ventas. "
            "De esta manera, cada área de la empresa tiene un espacio centralizado para sus reportes operativos, lo que facilita el mantenimiento del sistema a largo plazo."
        ),
        "step_guide": {
            "title": "Lección 4: Gobierno de Datos y Creación de Categorías",
            "menu_path": "Vista Previa de Consulta > Guardar > Tratar Categorías",
            "action_type": "categorization",
            "instructions": [
                "Haz clic en 'Guardar' en la barra de vista previa.",
                "Pulsa el botón 'Tratar Categorías'.",
                "Escribe 'Ventas' en una nueva línea y haz clic en 'Actualizar'."
            ],
            "expected_output": "Categoría 'Ventas' creada en el catálogo corporativo de consultas.",
            "consultant_tip": "Organizar consultas por departamento previene redundancias y simplifica la asignación de permisos."
        }
    },
    {
        "slide_index": 5,
        "image_file": "Slide_05.webp",
        "script_text": (
            "La información de saldos y clientes es sumamente confidencial. "
            "En SAP Business One, la seguridad de las consultas no se gestiona consulta por consulta, sino a nivel de categorías vinculadas a Grupos de Autorización del uno al sesenta y cuatro. "
            "Al asignar la categoría Ventas al Grupo Número Uno, podemos restringir en las Autorizaciones Generales que solo los gerentes de ventas tengan acceso a ejecutarla, impidiendo que usuarios no autorizados de otros módulos visualicen datos financieros sensibles."
        ),
        "step_guide": {
            "title": "Lección 5: Seguridad y Matriz de Autorizaciones (Grupos 1 al 64)",
            "menu_path": "Tratar Categorías > Asignar Grupo",
            "action_type": "security",
            "instructions": [
                "Selecciona la fila de la categoría 'Ventas'.",
                "Pulsa 'Asignar Grupo'.",
                "Marca la casilla del Grupo Nº 1 y confirma con Actualizar y OK."
            ],
            "expected_output": "Permisos de acceso vinculados al Grupo de Autorizaciones 1.",
            "consultant_tip": "Asignar categorías a grupos de autorización previene fugas de información confidencial en el ERP."
        }
    },
    {
        "slide_index": 6,
        "image_file": "Slide_06.webp",
        "script_text": (
            "Todo consultor de SAP debe dominar la Información del Sistema mediante el atajo Control Shift I. "
            "Al pasar el cursor sobre cualquier campo de cualquier ventana del ERP, la barra de estado inferior nos revela la radiografía técnica: el nombre físico de la tabla en base de datos, el nombre del campo, su tipo de dato y su longitud en memoria. "
            "En este caso, al inspeccionar la Fecha de Contabilización en una factura, confirmamos que la tabla es OINV y el campo es DocDate, eliminando cualquier margen de error al redactar nuestro SQL."
        ),
        "step_guide": {
            "title": "Lección 6: El Atajo de Oro del Consultor (Ctrl + Shift + I)",
            "menu_path": "Ventas - Clientes > Factura de Deudores",
            "action_type": "system_info",
            "instructions": [
                "Abre una Factura de Clientes.",
                "Presiona Ctrl + Shift + I para activar la Información del Sistema.",
                "Pasa el ratón sobre los campos del documento y lee la barra inferior: Tabla OINV, Campos DocNum, DocStatus, DocDate."
            ],
            "expected_output": "Datos técnicos de tabla y campo visibles en la barra de estado inferior.",
            "consultant_tip": "La Información del Sistema es la brújula indispensable para formular cualquier reporte SQL en SAP."
        }
    },
    {
        "slide_index": 7,
        "image_file": "Slide_07.webp",
        "script_text": (
            "Para la Tarea Dos diseñamos una consulta interactiva que localiza facturas abiertas posteriores a una fecha seleccionada. "
            "Combinamos dos condiciones fundamentales: DocStatus igual a O mayúscula para filtrar únicamente documentos abiertos con saldo pendiente de cobro, y DocDate mayor que corchete porcentaje cero corchete. "
            "La sintaxis porcentaje cero le indica al motor de SAP que cree un parámetro interactivo que solicitará la fecha al usuario en tiempo de ejecución, transformando un código estático en una herramienta completamente dinámica y reutilizable."
        ),
        "step_guide": {
            "title": "Lección 7: Filtros Parametrizados ([%0]) y DocStatus = 'O'",
            "menu_path": "Herramientas > Consultas > Generador de Consultas",
            "action_type": "parameter_query",
            "instructions": [
                "En el Generador escribe OINV y presiona Tab.",
                "Agrega DocNum, CardName, DocDate y DocTotal.",
                "En WHERE formula: T0.\"DocStatus\" = 'O' AND T0.\"DocDate\" > [%0]."
            ],
            "expected_output": "Sentencia SQL con variable dinámica [%0] lista para ejecución.",
            "consultant_tip": "La variable [%0] evita hardcodear fechas fijas, garantizando reportes reutilizables a largo plazo."
        }
    },
    {
        "slide_index": 8,
        "image_file": "Slide_08.webp",
        "script_text": (
            "Al hacer clic en Ejecutar, el motor de consultas de SAP evalúa la variable porcentaje cero y despliega la ventana de Criterios de Selección. "
            "Como el sistema reconoce por el diccionario de datos que DocDate es una variable temporal, habilita automáticamente el botón de calendario para que el usuario elija la fecha cómodamente. "
            "Este mecanismo convierte a una consulta técnica en una aplicación amigable para cualquier administrativo de la empresa."
        ),
        "step_guide": {
            "title": "Lección 8: Interfaz Dinámica de Criterios de Selección",
            "menu_path": "Ventana Criterios de Selección de Consulta",
            "action_type": "runtime_parameter",
            "instructions": [
                "Haz clic en 'Ejecutar'.",
                "En la ventana emergente, pulsa el icono de calendario o pulsa Tab.",
                "Elige la fecha de corte y haz clic en OK."
            ],
            "expected_output": "Ventana de parámetros interactiva respondiendo a la variable [%0].",
            "consultant_tip": "Al presionar Tab dentro de un criterio de selección en SAP, se abre la lista de valores válidos del sistema."
        }
    },
    {
        "slide_index": 9,
        "image_file": "Slide_09.webp",
        "script_text": (
            "La grilla nos devuelve únicamente las facturas con saldo vivo cuya fecha supera el parámetro ingresado. "
            "Como consultores, siempre debemos realizar un control de calidad cruzando los totales devueltos contra el informe financiero estándar del módulo de ventas. "
            "Una vez validada la integridad de los datos, procedemos a guardar la consulta en la categoría Ventas con un nombre claro y estandarizado para su uso diario por el equipo de finanzas."
        ),
        "step_guide": {
            "title": "Lección 9: Control de Calidad y Guardado en el Repositorio",
            "menu_path": "Vista Previa de Consulta > Guardar",
            "action_type": "validation",
            "instructions": [
                "Comprueba que todas las filas devueltas correspondan a facturas con saldo abierto.",
                "Valida que las fechas de contabilización superen la fecha ingresada.",
                "Haz clic en Guardar y nómbrala 'Lista de Facturas Abiertas' en 'Ventas'."
            ],
            "expected_output": "Reporte de facturas abierto y consulta almacenada en el repositorio.",
            "consultant_tip": "Auditar los resultados contra los informes estándar de SAP garantiza la confiabilidad de la consulta."
        }
    },
    {
        "slide_index": 10,
        "image_file": "Slide_10.webp",
        "script_text": (
            "Iniciamos la solución de la Tarea Tres, abordando uno de los pilares del diseño de bases de datos ERP: la relación entre documentos de cabecera y líneas de artículos. "
            "La cabecera en OINV almacena la información común a todo el documento como el cliente, la fecha y el total, mientras que INV1 registra cada línea individual con sus artículos, cantidades y precios. "
            "Ambas tablas están ligadas indisolublemente a través del campo clave DocEntry."
        ),
        "step_guide": {
            "title": "Lección 10: Arquitectura Relacional Cabecera y Detalle (OINV + INV1)",
            "menu_path": "Herramientas > Consultas > Generador de Consultas",
            "action_type": "join_query",
            "instructions": [
                "Limpia la ventana e ingresa en la casilla 1 OINV y en la casilla 2 INV1.",
                "Verifica la relación automática por la clave relacional DocEntry.",
                "Selecciona campos de cabecera y detalle.",
                "En Ordenar Por, selecciona SlpName."
            ],
            "expected_output": "Consulta relacional cabecera-detalle estructurada visualmente.",
            "consultant_tip": "La normalización relacional en cabecera y detalle optimiza el almacenamiento y evita redundancias."
        }
    },
    {
        "slide_index": 11,
        "image_file": "Slide_11.webp",
        "script_text": (
            "Al introducir OINV e INV1 en el Generador de Consultas, el sistema detecta que comparten la clave foránea DocEntry y formula automáticamente la cláusula INNER JOIN. "
            "Este comportamiento automatizado de SAP Business One previene la creación accidental de productos cartesianos que podrían bloquear la memoria del servidor SAP HANA al cruzar millones de registros innecesariamente."
        ),
        "step_guide": {
            "title": "Lección 11: Unión Automática (INNER JOIN) en SAP HANA",
            "menu_path": "Herramientas > Consultas > Generador de Consultas",
            "action_type": "sql_join",
            "instructions": [
                "Observa cómo el Generador enlaza automáticamente T0.\"DocEntry\" = T1.\"DocEntry\".",
                "Verifica que los campos foráneos en negrita se relacionen correctamente.",
                "Ejecuta la consulta y analiza la grilla multitabla devuelta."
            ],
            "expected_output": "Sentencia INNER JOIN compilada y ejecutada en SAP HANA sin errores.",
            "consultant_tip": "Las relaciones automáticas protegen al servidor HANA contra productos cartesianos destructivos."
        }
    },
    {
        "slide_index": 12,
        "image_file": "Slide_12.webp",
        "script_text": (
            "En la Tarea Cuatro configuramos una consulta preventiva de riesgo de crédito. "
            "En la tabla OCRD comparamos el saldo contable actual Balance contra el límite de crédito comercial autorizado CreditLine. "
            "Si el saldo supera el límite concedido, el cliente ingresa inmediatamente en la lista de excepción. "
            "Esta consulta servirá como disparador para el sistema de control preventivo de la compañía."
        ),
        "step_guide": {
            "title": "Lección 12: Detección de Riesgos (Balance > CreditLine)",
            "menu_path": "Herramientas > Consultas > Generador de Consultas",
            "action_type": "risk_query",
            "instructions": [
                "Carga OCRD en el Generador de Consultas.",
                "Selecciona CardCode, CardName, Balance y CreditLine.",
                "En WHERE formula: Balance > CreditLine AND CardType = 'C'."
            ],
            "expected_output": "Listado de clientes con saldo contable por encima del límite concedido.",
            "consultant_tip": "Monitorear Balance vs CreditLine previene la acumulación de cartera morosa no autorizada."
        }
    },
    {
        "slide_index": 13,
        "image_file": "Slide_13.webp",
        "script_text": (
            "Ingresamos a la Gestión de Alarmas para vincular nuestra consulta de riesgo. "
            "A diferencia de las alarmas estándar del sistema que se disparan por eventos transaccionales, las alarmas basadas en consultas de usuario operan mediante un motor de sondeo programado que evalúa la base de datos de manera proactiva e independiente."
        ),
        "step_guide": {
            "title": "Lección 13: Vinculación en la Gestión de Alarmas de SAP",
            "menu_path": "Gestión > Alarmas > Gestión de Alarmas",
            "action_type": "alarm_linking",
            "instructions": [
                "Abre Gestión de Alarmas en el menú Gestión.",
                "Pulsa 'Crear Alerta de Usuario'.",
                "Asigna un nombre descriptivo y pulsa 'Abrir Consulta Guardada' para vincularla."
            ],
            "expected_output": "Alerta personalizada vinculada a la consulta SQL de auditoría de crédito.",
            "consultant_tip": "Las alarmas de usuario transforman consultas estáticas en procesos de supervisión activa continua."
        }
    },
    {
        "slide_index": 14,
        "image_file": "Slide_14.webp",
        "script_text": (
            "Configuramos la periodicidad de ejecución de la alarma, por ejemplo cada dos horas o diariamente al inicio de la jornada. "
            "Seleccionamos a los destinatarios responsables, como el jefe de créditos y cobranzas, activando tanto el mensaje interno en la bandeja de SAP como el envío automático por correo electrónico. "
            "De este modo, la empresa automatiza su supervisión sin requerir intervención humana constante."
        ),
        "step_guide": {
            "title": "Lección 14: Periodicidad y Canales de Notificación",
            "menu_path": "Gestión de Alarmas > Pestaña Destinatarios y Frecuencia",
            "action_type": "alarm_schedule",
            "instructions": [
                "Define la frecuencia de sondeo (cada 2 horas o diariamente).",
                "Selecciona los usuarios autorizados en la grilla de destinatarios.",
                "Marca las casillas 'Interno' y 'Correo electrónico' según la política corporativa."
            ],
            "expected_output": "Alarma activa y programada en el motor de servicios de SAP Business One.",
            "consultant_tip": "Configurar notificaciones automáticas asegura que los desvíos críticos se atiendan de inmediato."
        }
    },
    {
        "slide_index": 15,
        "image_file": "Slide_15.webp",
        "script_text": (
            "En la Tarea Cinco avanzamos hacia la analítica de negocio. "
            "Formulamos una consulta que agrupa las ventas por representante comercial utilizando la función de agregación SUM sobre DocTotal y la cláusula analítica OVER para calcular totales acumulados. "
            "Este tipo de sentencias avanzadas en SAP HANA aprovecha la velocidad del procesamiento en memoria RAM para entregar cálculos instantáneos sobre grandes volúmenes de facturación."
        ),
        "step_guide": {
            "title": "Lección 15: Agregación con SUM y Cláusula Analítica OVER",
            "menu_path": "Herramientas > Consultas > Generador de Consultas",
            "action_type": "analytical_query",
            "instructions": [
                "Carga ORDR y OSLP en el Generador.",
                "En SELECT ingresa la agregación SUM(DocTotal) con OVER por vendedor.",
                "Ejecuta la consulta y analiza el comportamiento de los totales acumulados."
            ],
            "expected_output": "Sentencia analítica con agregaciones calculada en tiempo real en SAP HANA.",
            "consultant_tip": "Las funciones de ventana como OVER optimizan cálculos complejos sin requerir subconsultas pesadas."
        }
    },
    {
        "slide_index": 16,
        "image_file": "Slide_16.webp",
        "script_text": (
            "Conectamos los resultados de nuestra consulta analítica con la herramienta Pervasive Analytics de SAP HANA. "
            "Definimos el nombre del vendedor como la dimensión de análisis y el importe total facturado como la métrica de medición, seleccionando un gráfico de barras visual y elegante que permite evaluar el rendimiento comercial de un solo vistazo."
        ),
        "step_guide": {
            "title": "Lección 16: Diseño de Gráficos en Pervasive Analytics",
            "menu_path": "Herramientas > Pervasive Analytics",
            "action_type": "pervasive_analytics",
            "instructions": [
                "Abre el diseñador de Pervasive Analytics.",
                "Crea un nuevo panel analítico basado en la consulta SQL de ventas.",
                "Configura la dimensión 'SlpName' y la métrica de medición 'DocTotal'."
            ],
            "expected_output": "Gráfico de barras interactivo generado a partir de la consulta SQL.",
            "consultant_tip": "Pervasive Analytics aprovecha las vistas analíticas en memoria para visualizaciones ultra-rápidas."
        }
    },
    {
        "slide_index": 17,
        "image_file": "Slide_17.webp",
        "script_text": (
            "Culminamos el ciclo completo de consultoría anclando el nuevo widget en el Cockpit estilo Fiori del Director Comercial. "
            "Al iniciar su jornada en SAP Business One, la gerencia dispone de visualizaciones en tiempo real sin tener que solicitar reportes manuales al área contable, cumpliendo el objetivo principal de una implementación de clase mundial."
        ),
        "step_guide": {
            "title": "Lección 17: Publicación en el Cockpit Fiori del Usuario",
            "menu_path": "Pantalla Principal > Cockpit Fiori",
            "action_type": "cockpit_publishing",
            "instructions": [
                "Accede a la pantalla principal en modo Cockpit Fiori.",
                "Haz clic en el botón '+' para añadir un nuevo elemento de panel.",
                "Selecciona el gráfico creado en Pervasive Analytics y ubícalo en la vista gerencial."
            ],
            "expected_output": "Panel de control activo y visible en la sesión diaria del Director Comercial.",
            "consultant_tip": "El valor final de la consultoría es colocar la inteligencia de negocio directamente en manos del usuario."
        }
    }
]

if __name__ == "__main__":
    print("Iniciando generación pedagógica de élite...")
    build_masterclass("CSI08_Query_Practice", CSI08_PRACTICE_LESSONS)
    build_masterclass("CSI08_Query Practice_Solutions", CSI08_SOLUTIONS_LESSONS)
    print("\n✅ Proceso completado exitosamente.")
