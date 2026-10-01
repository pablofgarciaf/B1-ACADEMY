# -*- coding: utf-8 -*-
"""
Generador de Clases Magistrales (Teleprompter + Paso a Paso Guiado) para los 6 manuales CS
Estructura:
- slide_index
- image_file (.webp)
- script_text (Teleprompter del instructor)
- step_guide (Instrucciones guiadas para el estudiante y el simulador)
- start_time / end_time
"""

import os
import json

BASE = r"C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP"

def build_csi08_practice():
    # CSI08_Query_Practice (10 slides)
    slides = [
        {
            "slide_index": 1,
            "image_file": "116_Slide_01_CSI08_Query_Practice.webp",
            "script_text": "¡Bienvenidos a la clase magistral de Práctica de Consultas en SAP Business One versión para SAP HANA! En esta sesión práctica, aprenderás a construir consultas SQL desde cero utilizando el Generador de Consultas. La habilidad de extraer información en tiempo real es una de las competencias más valoradas en un consultor SAP.",
            "step_guide": {
                "title": "Apertura y Preparación del Entorno",
                "menu_path": "Menú Principal > Módulo General",
                "action_type": "setup",
                "instructions": [
                    "Inicia sesión en SAP Business One con usuario 'manager'.",
                    "Asegúrate de tener activa la base de datos de demostración SBODEMOUS o similar.",
                    "Activa la visualización de Información del Sistema presionando Ctrl + Shift + I."
                ],
                "expected_output": "Barra de estado inferior lista para inspeccionar nombres de tablas y campos SQL."
            },
            "start_time": 0.0,
            "end_time": 25.0
        },
        {
            "slide_index": 2,
            "image_file": "116_Slide_02_CSI08_Query_Practice.webp",
            "script_text": "Revisemos los objetivos de esta práctica de laboratorio. Desarrollarás 5 consultas estratégicas: una lista de clientes filtrada, un informe dinámico con parámetros de fecha, un reporte relacional combinando múltiples tablas, un reporte con total acumulado para alertas del sistema y, finalmente, una consulta optimizada para widgets de panel de control.",
            "step_guide": {
                "title": "Revisión del Plan de Consultas",
                "menu_path": "Herramientas > Consultas",
                "action_type": "planning",
                "instructions": [
                    "Identifica las tablas centrales que utilizaremos: OCRD (Socios de Negocios) y OINV (Facturas de Clientes).",
                    "Familiarízate con la sintaxis SQL de SAP HANA: recuerda que las columnas con mayúsculas y minúsculas deben ir entre comillas dobles."
                ],
                "expected_output": "Mapa mental de las 5 consultas que vas a construir."
            },
            "start_time": 25.0,
            "end_time": 52.0
        },
        {
            "slide_index": 3,
            "image_file": "116_Slide_03_CSI08_Query_Practice.webp",
            "script_text": "Comencemos con la Tarea 1: Informe de Lista de Clientes. Nuestro objetivo es extraer clientes activos de la tabla OCRD mostrando su código, nombre, dirección, ciudad, saldo de cuenta y persona de contacto. Para excluir proveedores y prospectos, filtraremos estrictamente donde CardType sea igual a 'C'.",
            "step_guide": {
                "title": "Tarea 1: Consulta de Lista de Clientes (OCRD)",
                "menu_path": "Herramientas > Consultas > Generador de Consultas",
                "action_type": "query_builder",
                "instructions": [
                    "Abre el Generador de Consultas.",
                    "En el primer campo de tabla, escribe OCRD y presiona Tab.",
                    "Haz doble clic en los campos: CardCode, CardName, Address, City, ZipCode, Balance y CntctPrsn.",
                    "En la sección de Condiciones (WHERE), selecciona el campo CardType, haz clic en '=' y escribe 'C'.",
                    "Haz clic en el botón 'Ejecutar' para comprobar los datos."
                ],
                "expected_output": "Grilla de resultados con únicamente clientes (CardType = 'C') y sus respectivos saldos."
            },
            "start_time": 52.0,
            "end_time": 85.0
        },
        {
            "slide_index": 4,
            "image_file": "116_Slide_04_CSI08_Query_Practice.webp",
            "script_text": "Ahora aplicaremos ajuste fino a los resultados. En SAP Business One puedes ordenar cualquier informe haciendo doble clic en el encabezado de la columna. Además, si mantienes presionada la tecla Control y haces clic sobre el encabezado de Saldo de Cuenta, el sistema calculará automáticamente la sumatoria total en el pie de página.",
            "step_guide": {
                "title": "Ajuste Fino y Guardado en Categoría",
                "menu_path": "Ventana de Resultados de Consulta",
                "action_type": "formatting",
                "instructions": [
                    "Haz doble clic sobre el encabezado 'Nombre de Cliente' para ordenar alfabéticamente de la A a la Z.",
                    "Mantén presionada la tecla Ctrl y haz clic en el encabezado 'Saldo de Cuenta' para calcular el total.",
                    "Haz clic en el botón 'Guardar'.",
                    "Crea una nueva categoría llamada 'Ventas' (Sales).",
                    "Haz clic en 'Asignar Grupo' y vincula al grupo Consultas Guardadas – Grupo 1.",
                    "Nombra la consulta 'Lista de Clientes' y confirma con Guardar."
                ],
                "expected_output": "Consulta guardada exitosamente en el Administrador de Consultas dentro de la categoría Ventas."
            },
            "start_time": 85.0,
            "end_time": 118.0
        },
        {
            "slide_index": 5,
            "image_file": "116_Slide_05_CSI08_Query_Practice.webp",
            "script_text": "Pasamos a la Tarea 2: Crear un informe con parámetros dinámicos. En lugar de una fecha fija, usaremos la variable de SAP corchete porcentaje cero corchete ([%0]). Cuando el usuario ejecute la consulta, SAP abrirá automáticamente un cuadro de diálogo solicitando la fecha de corte para filtrar las facturas de la tabla OINV.",
            "step_guide": {
                "title": "Tarea 2: Consulta con Parámetro de Fecha ([%0])",
                "menu_path": "Herramientas > Consultas > Generador de Consultas",
                "action_type": "dynamic_query",
                "instructions": [
                    "Limpia el Generador de Consultas y selecciona la tabla OINV (Facturas de Clientes).",
                    "Selecciona los campos: DocNum, CardName, DocDate y DocTotal.",
                    "En la condición WHERE, añade: DocStatus = 'O' (Facturas Abiertas).",
                    "Añade la condición AND: DocDate > [%0].",
                    "Ejecuta la consulta e ingresa una fecha en la ventana emergente para probar el filtro."
                ],
                "expected_output": "Cuadro emergente solicitando la fecha de contabilización y reporte filtrado dinámicamente."
            },
            "start_time": 118.0,
            "end_time": 155.0
        },
        {
            "slide_index": 6,
            "image_file": "116_Slide_06_CSI08_Query_Practice.webp",
            "script_text": "Observa cómo trabaja la variable de parámetro. Al indicar DocDate mayor que [%0], SAP Business One reconoce el tipo de dato fecha y despliega el calendario nativo. Esto permite a los gerentes de ventas consultar facturas recientes sin necesidad de modificar el código de la consulta.",
            "step_guide": {
                "title": "Validación de Parámetros Dinámicos",
                "menu_path": "Ventana Criterios de Selección de Consulta",
                "action_type": "validation",
                "instructions": [
                    "Selecciona una fecha del selector (ej. primer día del mes en curso).",
                    "Presiona 'OK' o 'Intro'.",
                    "Verifica que todos los registros mostrados tengan una fecha estrictamente posterior a la ingresada.",
                    "Guarda la consulta en la categoría 'Ventas' con el nombre 'Facturas Abiertas por Fecha'."
                ],
                "expected_output": "Resultados de facturas abiertas validadas con fecha posterior al parámetro ingresado."
            },
            "start_time": 155.0,
            "end_time": 188.0
        },
        {
            "slide_index": 7,
            "image_file": "116_Slide_07_CSI08_Query_Practice.webp",
            "script_text": "Llegamos a la Tarea 3: Consultas relacionales entre múltiples tablas. Uniremos la cabecera de la factura OINV con sus líneas de detalle INV1 mediante el campo común DocEntry. Esto nos permitirá auditar artículos vendidos, precios de lista y cantidades por documento.",
            "step_guide": {
                "title": "Tarea 3: Consulta Multitabla (JOIN OINV - INV1)",
                "menu_path": "Herramientas > Consultas > Generador de Consultas",
                "action_type": "join_query",
                "instructions": [
                    "En el Generador de Consultas, añade en la primera casilla OINV y en la segunda casilla INV1.",
                    "Verifica que el generador cree la relación relacional: T0.DocEntry = T1.DocEntry.",
                    "Selecciona de T0 (OINV): DocNum, CardName, DocDate.",
                    "Selecciona de T1 (INV1): ItemCode, Dscription, Quantity, Price, LineTotal.",
                    "Ejecuta la consulta."
                ],
                "expected_output": "Listado detallado donde cada factura se desglosa en sus respectivos artículos y totales de línea."
            },
            "start_time": 188.0,
            "end_time": 222.0
        },
        {
            "slide_index": 8,
            "image_file": "116_Slide_08_CSI08_Query_Practice.webp",
            "script_text": "En la Tarea 4, crearemos un informe con sumatoria acumulada para activar una Alerta del Sistema. Configuraremos la consulta para detectar clientes cuyo saldo supere un límite de crédito crítico. Cada vez que SAP detecte estos registros, enviará un mensaje interno automático al director financiero.",
            "step_guide": {
                "title": "Tarea 4: Consulta para Alertas del Sistema",
                "menu_path": "Gestión > Alarmas > Gestión de Alarmas",
                "action_type": "alert_setup",
                "instructions": [
                    "Crea una consulta sobre OCRD donde Balance > CreditLine.",
                    "Selecciona CardCode, CardName, Balance y CreditLine.",
                    "Guarda la consulta como 'Clientes con Saldo Excedido'.",
                    "Abre Gestión de Alarmas y crea una nueva alarma periódica cada 2 horas vinculada a esta consulta.",
                    "Asigna como destinatario al usuario 'manager'."
                ],
                "expected_output": "Alerta configurada en SAP B1 que disparará notificaciones automáticas ante saldos excedidos."
            },
            "start_time": 222.0,
            "end_time": 258.0
        },
        {
            "slide_index": 9,
            "image_file": "116_Slide_09_CSI08_Query_Practice.webp",
            "script_text": "Para finalizar en la Tarea 5, prepararemos una consulta optimizada para Widgets de Panel de Control (Dashboards en SAP HANA). Las consultas de dashboard requieren agrupar datos con GROUP BY y aplicar funciones de agregación como SUM o COUNT para generar gráficos visuales de barras o pastel.",
            "step_guide": {
                "title": "Tarea 5: Consulta para Widget de Dashboard",
                "menu_path": "Herramientas > Consultas > Generador de Consultas",
                "action_type": "dashboard_query",
                "instructions": [
                    "Construye una consulta sobre OINV sumando DocTotal agrupado por CardName.",
                    "Sintaxis SQL: SELECT T0.CardName, SUM(T0.DocTotal) AS TotalVentas FROM OINV T0 GROUP BY T0.CardName ORDER BY TotalVentas DESC.",
                    "Guarda la consulta en una categoría apta para widgets.",
                    "Abre Pervasive Analytics y crea un gráfico de barras seleccionando CardName en el eje X y TotalVentas en el eje Y."
                ],
                "expected_output": "Widget interactivo listo para anclar en el Cockpit Fiori del usuario."
            },
            "start_time": 258.0,
            "end_time": 292.0
        },
        {
            "slide_index": 10,
            "image_file": "116_Slide_10_CSI08_Query_Practice.webp",
            "script_text": "¡Excelente trabajo! Has completado el caso práctico de Consultas en SAP Business One. Ahora dominas la selección de tablas, condiciones lógicas, parámetros dinámicos, uniones relacionales y la publicación de consultas en alertas y dashboards. ¡Continúa con el manual de Soluciones para revisar los detalles técnicos avanzados!",
            "step_guide": {
                "title": "Cierre y Verificación del Laboratorio",
                "menu_path": "Herramientas > Consultas > Consultas de Usuario",
                "action_type": "summary",
                "instructions": [
                    "Abre el Administrador de Consultas y confirma que las 5 consultas estén guardadas en la categoría 'Ventas'.",
                    "Ejecuta cada una para verificar que no arrojen errores de sintaxis en HANA.",
                    "Marca el laboratorio como completado para registrar tu progreso en la plataforma."
                ],
                "expected_output": "5 consultas operativas y progreso registrado en el aula virtual."
            },
            "start_time": 292.0,
            "end_time": 320.0
        }
    ]
    return slides

def build_csi08_solutions():
    # CSI08_Query Practice_Solutions (20 slides)
    slides = []
    topics = [
        ("Portada y Bienvenida a Soluciones de Consultas", "Revisión técnica de las soluciones oficiales para el Generador y Asistente de Consultas en SAP Business One.", "setup"),
        ("Estructura de la Solución Tarea 1", "Solución detallada para la lista de clientes en la tabla OCRD con CardType = 'C'.", "query_builder"),
        ("Navegación en el Menú y Generador", "Cómo acceder al Generador de Consultas desde Herramientas y cargar la tabla OCRD.", "menu_path"),
        ("Selección de Campos en OCRD", "Doble clic en campos CardCode, CardName, Address, City, ZipCode, Balance y CntctPrsn.", "field_selection"),
        ("Definición de Filtro CardType = 'C'", "Inyección de la condición WHERE en el Generador de Consultas.", "where_condition"),
        ("Ejecución y Grilla de Resultados", "Validación de los registros devueltos y cálculo de sumatoria con tecla Ctrl.", "execution"),
        ("Guardado en Categoría Ventas", "Creación de categoría de consultas y asignación de grupo de autorizaciones 1.", "save_category"),
        ("Solución Tarea 2: Parámetros Dinámicos", "Arquitectura de la variable [%0] sobre la tabla OINV de facturas.", "dynamic_param"),
        ("Identificación de Campos con Info de Sistema", "Ctrl+Shift+I para identificar DocNum, CardName, DocDate y DocTotal.", "system_info"),
        ("Filtro de Facturas Abiertas (DocStatus = 'O')", "Configuración de la condición WHERE con DocStatus = 'O' y DocDate > [%0].", "query_condition"),
        ("Ventana de Ingreso del Parámetro", "Comportamiento del asistente de criterios de selección en tiempo de ejecución.", "param_runtime"),
        ("Solución Tarea 3: Relación OINV e INV1", "Fundamentos del INNER JOIN relacional por DocEntry en HANA SQL.", "inner_join"),
        ("Diseño de la Consulta Multitabla", "Selección combinada de cabecera de documento y líneas de artículos.", "multitable_design"),
        ("Sintaxis SQL HANA para Tablas Relacionadas", "Uso correcto de alias T0 y T1 y comillas dobles en campos sensibles.", "sql_hana_syntax"),
        ("Solución Tarea 4: Consulta para Alertas", "Filtrado de saldos excedentes (Balance > CreditLine) para notificación.", "alert_query"),
        ("Configuración del Mensaje de Alarma", "Vinculación en Gestión de Alarmas con frecuencia y destinatarios.", "alert_config"),
        ("Solución Tarea 5: Agregación para Dashboards", "Uso de GROUP BY y SUM(DocTotal) para alimentar widgets Fiori.", "dashboard_aggregation"),
        ("Creación del Gráfico en Pervasive Analytics", "Asignación de dimensiones y medidas para el panel de control.", "pervasive_analytics"),
        ("Buenas Prácticas de Consultoría SAP", "Recomendaciones para optimizar el rendimiento y no bloquear la base de datos.", "best_practices"),
        ("Conclusión y Checklist de Certificación", "Resumen de competencias adquiridas en el laboratorio de consultas SQL.", "summary")
    ]
    
    for i, (title, desc, action_type) in enumerate(topics):
        idx = i + 1
        start = i * 25.0
        end = (i + 1) * 25.0
        slides.append({
            "slide_index": idx,
            "image_file": f"115_Slide_{idx:02d}_CSI08_Query_Practice_Solutions.webp",
            "script_text": f"En este paso revisamos: {title}. {desc} En SAP Business One, dominar este procedimiento garantiza una gestión ágil de los datos del ERP.",
            "step_guide": {
                "title": title,
                "menu_path": "Herramientas > Consultas > Generador de Consultas",
                "action_type": action_type,
                "instructions": [
                    f"Abre la ventana correspondiente a {title}.",
                    f"Sigue las instrucciones técnicas descritas en la diapositiva {idx}.",
                    "Verifica que los valores y la sintaxis SQL coincidan exactamente con la solución oficial de SAP."
                ],
                "expected_output": f"Paso {idx} validado conforme a la guía oficial de SAP B1."
            },
            "start_time": start,
            "end_time": end
        })
    return slides

def build_csl01_intro():
    # CSL01_Introduction_ES (4 slides)
    slides = [
        {
            "slide_index": 1,
            "image_file": "117_Slide_01_CSL01_Introduction_ES.webp",
            "script_text": "Bienvenidos al Caso Práctico de Introducción a SAP Business One versión para SAP HANA. Este módulo está diseñado para que te familiarices con la navegación en el sistema, la personalización de tu espacio de trabajo y el ciclo de vida de los documentos de ventas.",
            "step_guide": {
                "title": "Inicio del Caso Práctico de Introducción",
                "menu_path": "Acceso al Sistema",
                "action_type": "setup",
                "instructions": [
                    "Inicia sesión con el usuario 'director' y clave 'director'.",
                    "Asegúrate de estar en la sociedad de prueba OEC Computers."
                ],
                "expected_output": "Cockpit inicial de SAP Business One cargado en pantalla."
            },
            "start_time": 0.0,
            "end_time": 30.0
        },
        {
            "slide_index": 2,
            "image_file": "117_Slide_02_CSL01_Introduction_ES.webp",
            "script_text": "En esta segunda lámina analizamos el escenario de Bill, nuevo jefe de ventas de OEC Computers. Realizarás tres tareas clave: asignarte una plantilla de cockpit de ventas, vincularte como responsable de los clientes C20000, C50000 y C60000, y configurar un acceso rápido a la función de Actividades.",
            "step_guide": {
                "title": "Configuración de Cockpit y Asignación de Clientes",
                "menu_path": "Herramientas > Cockpit > Seleccionar Plantilla de Cockpit",
                "action_type": "cockpit_setup",
                "instructions": [
                    "Selecciona la plantilla de Cockpit 'Ventas'.",
                    "Abre el Maestro de Socios de Negocios y localiza los clientes C20000, C50000 y C60000.",
                    "Asigna a Bill como Jefe de Ventas en el campo 'Empleado de Departamento de Ventas'.",
                    "Usa la búsqueda de menús para localizar 'Actividades' y arrástrala al widget de Funciones Comunes."
                ],
                "expected_output": "Cockpit personalizado con widget de ventas y clientes asignados a Bill."
            },
            "start_time": 30.0,
            "end_time": 75.0
        },
        {
            "slide_index": 3,
            "image_file": "117_Slide_03_CSL01_Introduction_ES.webp",
            "script_text": "Continuamos con las Tareas 4, 5 y 6: Creación de la Oferta de Ventas con artículos A00002, A00005 y C00008, aplicando un 5% de descuento especial. Luego, utilizaremos Enterprise Search para localizar la oferta y convertirla en Pedido de Cliente, explorando además la función Arrastrar y Vincular.",
            "step_guide": {
                "title": "Oferta de Ventas y Enterprise Search",
                "menu_path": "Ventas - Clientes > Oferta de Ventas",
                "action_type": "sales_flow",
                "instructions": [
                    "Crea una oferta de venta para el cliente C20000 con los artículos indicados.",
                    "Aplica un 5% en el campo de descuento general.",
                    "Copia la oferta a Pedido de Cliente.",
                    "Usa Enterprise Search para rastrear el pedido por número de cliente y fecha."
                ],
                "expected_output": "Pedido de cliente creado y localizado mediante Enterprise Search."
            },
            "start_time": 75.0,
            "end_time": 120.0
        },
        {
            "slide_index": 4,
            "image_file": "117_Slide_04_CSL01_Introduction_ES.webp",
            "script_text": "¡Felicidades por completar el caso de estudio introductorio! Con estas actividades has dominado la ergonomía del sistema, la personalización Fiori y el flujo básico de ventas. Revisa a continuación el manual de soluciones para cotejar cada pantalla.",
            "step_guide": {
                "title": "Cierre de Caso Introductorio",
                "menu_path": "Menú Principal",
                "action_type": "summary",
                "instructions": [
                    "Verifica que el pedido de cliente tenga el estado 'Abierto'.",
                    "Comprueba que el mapa de relaciones muestre el vínculo entre la Oferta y el Pedido."
                ],
                "expected_output": "Flujo de ventas verificado con mapa de relaciones completo."
            },
            "start_time": 120.0,
            "end_time": 150.0
        }
    ]
    return slides

def build_csl01_intro_solutions():
    # CSL01_Introduction_Solution_ES (20 slides)
    slides = []
    titles = [
        "Portada de Soluciones: Caso Práctico Introducción",
        "Selección de la Plantilla de Cockpit de Ventas",
        "Gestión de Autorizaciones de Usuario 'Director'",
        "Asignación de Empleado de Ventas en Ficha OCRD",
        "Búsqueda Rápida de Menús en SAP HANA",
        "Añadir Widget de Funciones Comunes al Cockpit",
        "Personalización de Widgets y Organización Visual",
        "Guardar Modificaciones del Cockpit Fiori",
        "Arrastrar Transacciones al Widget de Acceso Rápido",
        "Creación de la Oferta de Ventas para Cliente C20000",
        "Inclusión de Filas de Texto y Parametrizaciones",
        "Cálculo de Subtotales y Descuento del 5%",
        "Validación y Grabación de la Oferta de Ventas",
        "Uso de Enterprise Search para Rastrear Documentos",
        "Búsqueda Combinada por Cliente y Fecha",
        "Copiar Oferta de Ventas a Pedido de Cliente",
        "Función Arrastrar y Vincular (Drag & Relate)",
        "Consulta de Pedidos Abiertos del Cliente C20000",
        "Auditoría del Mapa de Relaciones del Documento",
        "Conclusiones del Laboratorio de Introducción"
    ]
    for i, title in enumerate(titles):
        idx = i + 1
        slides.append({
            "slide_index": idx,
            "image_file": f"118_Slide_{idx:02d}_CSL01_Introduction_Solution_ES.webp",
            "script_text": f"En esta lámina revisamos la solución de: {title}. Este paso demuestra cómo SAP Business One agiliza los flujos de trabajo diarios mediante herramientas intuitivas de interfaz.",
            "step_guide": {
                "title": title,
                "menu_path": "Menú Principal > Ventas / Cockpit",
                "action_type": "step_solution",
                "instructions": [
                    f"Abre la ventana correspondiente a {title}.",
                    f"Sigue las capturas de pantalla de la solución oficial (Lámina {idx}).",
                    "Confirma que los campos coincidan con la guía técnica."
                ],
                "expected_output": f"Paso {idx} resuelto exitosamente."
            },
            "start_time": i * 20.0,
            "end_time": (i + 1) * 20.0
        })
    return slides

def build_csl02_procurement():
    # CSL02_Procurement_Process_ES (5 slides)
    slides = [
        {
            "slide_index": 1,
            "image_file": "119_Slide_01_CSL02_Procurement_Process_ES.webp",
            "script_text": "Bienvenidos al Caso Práctico del Proceso de Compras en SAP Business One. El ciclo de aprovisionamiento Procure-to-Pay es vital para cualquier organización. En esta práctica aprenderás a gestionar pedidos de compra, entradas de mercancías y facturas de proveedores.",
            "step_guide": {
                "title": "Inicio del Caso Práctico de Compras",
                "menu_path": "Compras - Proveedores",
                "action_type": "setup",
                "instructions": [
                    "Inicia sesión con el usuario asignado.",
                    "Abre el módulo Compras - Proveedores."
                ],
                "expected_output": "Módulo de Compras listo para operar."
            },
            "start_time": 0.0,
            "end_time": 25.0
        },
        {
            "slide_index": 2,
            "image_file": "119_Slide_02_CSL02_Procurement_Process_ES.webp",
            "script_text": "Analicemos el caso de negocio: La empresa necesita comprar materias primas y suministros de oficina para mantener su capacidad operativa. Aprenderás a solicitar cotizaciones a múltiples proveedores mediante la Solicitud de Pedido y la Oferta de Compra.",
            "step_guide": {
                "title": "Solicitud de Pedido y Ofertas de Compra",
                "menu_path": "Compras - Proveedores > Solicitud de Pedido",
                "action_type": "rfq_process",
                "instructions": [
                    "Crea una solicitud de pedido interna especificando los artículos requeridos.",
                    "Genera ofertas de compra comparativas para los proveedores preseleccionados."
                ],
                "expected_output": "Solicitud y cotizaciones registradas en el sistema."
            },
            "start_time": 25.0,
            "end_time": 60.0
        },
        {
            "slide_index": 3,
            "image_file": "119_Slide_03_CSL02_Procurement_Process_ES.webp",
            "script_text": "Una vez seleccionado el proveedor con la mejor propuesta comercial, creamos el Pedido de Compra. Este documento compromete la adquisición formalmente y afecta la cantidad pedida en el inventario sin generar asientos contables.",
            "step_guide": {
                "title": "Emisión del Pedido de Compra (PO)",
                "menu_path": "Compras - Proveedores > Pedido",
                "action_type": "purchase_order",
                "instructions": [
                    "Selecciona al proveedor adjudicado.",
                    "Introduce artículos, cantidades, fecha de entrega acordada y almacén de destino.",
                    "Guarda el Pedido de Compra."
                ],
                "expected_output": "Pedido de compra generado con estado 'Abierto' y stock comprometido actualizado."
            },
            "start_time": 60.0,
            "end_time": 95.0
        },
        {
            "slide_index": 4,
            "image_file": "119_Slide_04_CSL02_Procurement_Process_ES.webp",
            "script_text": "Al llegar el camión a las instalaciones, se realiza la Entrada de Mercancías por Compras (EMPC). Este documento incrementa físicamente el inventario y genera el asiento contable acreditando la cuenta puente de compensación de compras.",
            "step_guide": {
                "title": "Recepción de Mercancías (EMPC)",
                "menu_path": "Compras - Proveedores > Entrada de Mercancías",
                "action_type": "goods_receipt",
                "instructions": [
                    "Abre Entrada de Mercancías y utiliza 'Copiar de' Pedido de Compra.",
                    "Inspecciona cantidades físicas recibidas y asigna números de lote o serie si corresponde.",
                    "Añade la entrada de mercancías."
                ],
                "expected_output": "Aumento en existencias de almacén y registro del asiento contable automático."
            },
            "start_time": 95.0,
            "end_time": 135.0
        },
        {
            "slide_index": 5,
            "image_file": "119_Slide_05_CSL02_Procurement_Process_ES.webp",
            "script_text": "El ciclo culmina con la Factura de Proveedores y la reconciliación del pago. Al registrar la factura basada en la EMPC, la cuenta transitoria se cancela y se genera la cuenta por pagar real con el proveedor. ¡Revisa el manual de soluciones para auditar las 28 láminas paso a paso!",
            "step_guide": {
                "title": "Facturación y Cierre del Ciclo P2P",
                "menu_path": "Compras - Proveedores > Factura de Proveedores",
                "action_type": "ap_invoice",
                "instructions": [
                    "Copia la EMPC a Factura de Proveedores.",
                    "Verifica impuestos y condiciones de pago.",
                    "Revisa el Mapa de Relaciones para certificar que todo el flujo esté debidamente cerrado."
                ],
                "expected_output": "Ciclo completo de compras cerrado con factura contabilizada y mapa de relaciones íntegro."
            },
            "start_time": 135.0,
            "end_time": 170.0
        }
    ]
    return slides

def build_csl02_procurement_solutions():
    # CSL02_Procurement_Process_Solution_ES (28 slides)
    slides = []
    titles = [
        "Portada de Soluciones: Proceso de Compras",
        "Revisión General del Escenario de Aprovisionamiento",
        "Creación de la Solicitud de Pedido Interna",
        "Selección de Artículos para Cotización",
        "Emisión de Ofertas de Compra a Proveedores",
        "Cuadro Comparativo de Ofertas de Compra",
        "Selección de la Oferta Ganadora",
        "Conversión de Oferta a Pedido de Compra",
        "Verificación de Datos en el Pedido de Compra",
        "Revisión del Estado del Inventario tras el Pedido",
        "Proceso de Recepción en Almacén",
        "Creación de la Entrada de Mercancías (EMPC)",
        "Uso de 'Copiar de' para Mantener Trazabilidad",
        "Recepción Parcial vs Recepción Total",
        "Asignación de Lotes y Fechas de Caducidad",
        "Contabilización Automática de Inventario y Cuenta Puente",
        "Auditoría del Asiento Contable de la EMPC",
        "Recepción de la Factura Física del Proveedor",
        "Creación de la Factura de Proveedores en SAP B1",
        "Conciliación de Precios y Cantidades en la Factura",
        "Cancelación de la Cuenta Transitoria de Compras",
        "Asiento Contable de la Factura de Proveedores",
        "Gestión de Descuentos Financieros y Pronto Pago",
        "Preparación del Asistente de Pagos",
        "Emisión del Pago Efectuado al Proveedor",
        "Auditoría Completa del Mapa de Relaciones P2P",
        "Resolución de Incidencias y Devoluciones de Mercancía",
        "Conclusiones y Certificación del Módulo de Compras"
    ]
    for i, title in enumerate(titles):
        idx = i + 1
        slides.append({
            "slide_index": idx,
            "image_file": f"120_Slide_{idx:02d}_CSL02_Procurement_Process_Solution_ES.webp",
            "script_text": f"En este paso analizamos la solución de: {title}. Este paso demuestra cómo SAP Business One controla rigurosamente los costos, el inventario y las cuentas por pagar a lo largo del ciclo P2P.",
            "step_guide": {
                "title": title,
                "menu_path": "Compras - Proveedores",
                "action_type": "procurement_solution",
                "instructions": [
                    f"Abre la transacción correspondiente a {title}.",
                    f"Verifica los datos con las capturas de la lámina {idx}.",
                    "Asegura la correspondencia entre los documentos base y documentos destino."
                ],
                "expected_output": f"Paso {idx} validado y conforme al estándar SAP."
            },
            "start_time": i * 20.0,
            "end_time": (i + 1) * 20.0
        })
    return slides

def main():
    manuals_builders = [
        ("CSI08_Query_Practice", build_csi08_practice),
        ("CSI08_Query Practice_Solutions", build_csi08_solutions),
        ("CSL01_Introduction_ES", build_csl01_intro),
        ("CSL01_Introduction_Solution_ES", build_csl01_intro_solutions),
        ("CSL02_Procurement_Process_ES", build_csl02_procurement),
        ("CSL02_Procurement_Process_Solution_ES", build_csl02_procurement_solutions),
    ]

    for folder_name, builder_func in manuals_builders:
        folder_path = os.path.join(BASE, folder_name)
        if not os.path.exists(folder_path):
            print(f"[!] Carpeta no encontrada: {folder_path}")
            continue
        
        sync_data = builder_func()
        sync_file = os.path.join(folder_path, "clase_sync.json")
        with open(sync_file, "w", encoding="utf-8") as f:
            json.dump(sync_data, f, indent=2, ensure_ascii=False)
        print(f"[OK] {folder_name}: clase_sync.json generado con {len(sync_data)} diapositivas (Teleprompter + Paso a Paso).")

if __name__ == "__main__":
    main()
