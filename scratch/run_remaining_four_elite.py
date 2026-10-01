# -*- coding: utf-8 -*-
"""
Compilador Maestro Pedagógico A+ para los 4 Manuales Restantes:
1. CSL01_Introduction_ES (4 pasos)
2. CSL02_Procurement_Process_ES (4 pasos)
3. CSL01_Introduction_Solution_ES (21 pasos)
4. CSL02_Procurement_Process_Solution_ES (24 pasos)

Aplica estrictamente las 5 Reglas de Oro de B1 Academy:
- Voz de Consultor Senior y Docente de Élite de SAP Business One.
- CERO lectura mecánica de clics o menús como loro.
- CERO muletillas. 100% Conceptos de Negocio, Impacto Contable y Trucos de Élite.
- Generación con edge_tts nativo (asyncio) para soporte UTF-8 impecable.
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
# 1. CSL01_Introduction_ES (4 Lecciones Pedagógicas)
# =========================================================================
CSL01_PRACTICE_LESSONS = [
    {
        "slide_index": 1,
        "image_file": "Slide_01.webp",
        "script_text": (
            "Cuando implementamos SAP Business One en una empresa, uno de los mayores retos es la adopción del usuario. "
            "Si un nuevo gerente de ventas entra al sistema y ve cientos de menús desconocidos, la fricción es enorme. "
            "La solución oficial de SAP para este desafío es el Cockpit estilo Fiori. "
            "Las plantillas de Cockpit no son solo pantallas decorativas; son entornos preconfigurados que agrupan los indicadores clave de rendimiento, "
            "como el KPI de facturación mensual, los accesos directos transaccionales y los embudos de ventas. "
            "Al asignar la plantilla de Ventas a nuestro nuevo responsable comercial, transformamos el ERP en una cabina de mando enfocada en el cierre de oportunidades desde el primer día."
        ),
        "step_guide": {
            "title": "Lección 1: Filosofía y Asignación de Cockpit Fiori",
            "menu_path": "Herramientas > Cockpit > Seleccionar Plantilla de Cockpit",
            "action_type": "cockpit_setup",
            "instructions": [
                "Abre Herramientas > Cockpit > Seleccionar Plantilla de Cockpit.",
                "Selecciona la plantilla oficial 'Ventas'.",
                "Fíjala como predeterminada para el rol del usuario."
            ],
            "expected_output": "Lienzo Cockpit Fiori activo con KPIs y accesos comerciales.",
            "consultant_tip": "Las plantillas de cockpit alinean la interfaz del ERP con los objetivos estratégicos del puesto."
        }
    },
    {
        "slide_index": 2,
        "image_file": "Slide_02.webp",
        "script_text": (
            "La asignación de cuentas en el maestro de interlocutores comerciales OCRD es una de las decisiones de diseño más trascendentales en SAP Business One. "
            "¿Por qué es tan crítico el campo Empleado de Ventas? "
            "Porque en SAP, este vínculo desencadena tres procesos automáticos fundamentales: "
            "primero, los permisos de visibilidad para que el comercial solo vea a sus clientes asignados si la empresa activa restricciones de propiedad de datos; "
            "segundo, el cálculo automático de comisiones en el libro mayor y nómina; "
            "y tercero, la trazabilidad directa en todos los pedidos futuros, asegurando que cada dólar facturado se atribuya con exactitud en las métricas de rendimiento del vendedor."
        ),
        "step_guide": {
            "title": "Lección 2: Asignación Estratégica en Maestro de Clientes (OCRD)",
            "menu_path": "Socios de Negocios > Datos Maestros Socio de Negocios",
            "action_type": "master_data",
            "instructions": [
                "Abre Datos Maestros de Socio de Negocios (Ctrl + F).",
                "Busca el código C20000 y accede a la pestaña General.",
                "Asigna a Bill en 'Empleado del departamento de ventas' y actualiza."
            ],
            "expected_output": "Cuentas comerciales asignadas formalmente al asesor responsable.",
            "consultant_tip": "El empleado de ventas en OCRD alimenta automáticamente las comisiones y los filtros de informes."
        }
    },
    {
        "slide_index": 3,
        "image_file": "Slide_03.webp",
        "script_text": (
            "La eficiencia operativa de un equipo comercial depende de reducir los clics innecesarios en la interfaz. "
            "En lugar de obligar al usuario a navegar por ramas complejas del árbol de menús, SAP Business One cuenta con el widget de Funciones Comunes. "
            "Al personalizar este panel con el módulo de Actividades y la creación de citas, dotamos al vendedor de un centro neurálgico de gestión CRM. "
            "Desde aquí puede programar llamadas de seguimiento, registrar minutas de reuniones y auditar el historial de interacciones con el cliente, "
            "manteniendo a todo el equipo alineado sin salir de su pantalla de inicio."
        ),
        "step_guide": {
            "title": "Lección 3: Productividad y CRM con Funciones Comunes",
            "menu_path": "Cockpit > Widget de Funciones Comunes",
            "action_type": "quick_access",
            "instructions": [
                "Utiliza el buscador superior para localizar 'Actividades'.",
                "Arrastra el acceso directo al panel de Funciones Comunes.",
                "Verifica que el icono abra directamente el gestor de tareas."
            ],
            "expected_output": "Centro de actividades comerciales disponible a un solo clic.",
            "consultant_tip": "Centralizar actividades en el cockpit previene el olvido de compromisos y llamadas con prospectos."
        }
    },
    {
        "slide_index": 4,
        "image_file": "Slide_04.webp",
        "script_text": (
            "El ciclo comercial en SAP Business One alcanza su madurez con el análisis del documento de ventas y el comportamiento del cliente. "
            "Al explorar la ficha técnica del interlocutor comercial y examinar sus condiciones de pago, listas de precios vinculadas y el límite de crédito asignado, "
            "el asesor comercial comprende que cada oferta o factura es parte de un ecosistema interconectado. "
            "La navegación contextual con las flechas de enlace naranja permite auditar en segundos el historial de transacciones y estados de cuenta, "
            "consolidando una experiencia fluida que une la gestión comercial con el rigor contable."
        ),
        "step_guide": {
            "title": "Lección 4: Integración Comercial y Auditoría Contable",
            "menu_path": "Ventas - Clientes > Documentos de Ventas",
            "action_type": "sales_cycle",
            "instructions": [
                "Inspecciona la lista de precios y condiciones de pago asociadas al cliente.",
                "Utiliza la flecha naranja para navegar entre el documento y el maestro de clientes.",
                "Valida la coherencia de datos financieros antes de emitir transacciones."
            ],
            "expected_output": "Ecosistema comercial comprendido y auditado visualmente.",
            "consultant_tip": "Las flechas de enlace naranja son el sello distintivo de trazabilidad relacional en SAP Business One."
        }
    }
]


# =========================================================================
# 2. CSL02_Procurement_Process_ES (4 Lecciones Pedagógicas)
# =========================================================================
CSL02_PRACTICE_LESSONS = [
    {
        "slide_index": 1,
        "image_file": "Slide_01.webp",
        "script_text": (
            "Comenzamos el estudio del ciclo de aprovisionamiento en SAP Business One analizando el Pedido de Compras en la tabla OPOR. "
            "Como consultores, una de las preguntas de certificación más frecuentes es: ¿genera el pedido un asiento contable en el Libro Mayor? "
            "La respuesta es un rotundo no. El pedido representa un acuerdo comercial de intención de compra entre la empresa y el proveedor, "
            "pero no transfiere la propiedad física del material ni crea una obligación jurídica de pago inmediata. "
            "Sin embargo, en la gestión logística cumple un papel estelar: reserva el compromiso de compra en la columna de stock solicitado, "
            "permitiendo que el planificador de compras y el módulo MRP de SAP calculen con precisión la disponibilidad futura de inventario sin inflar artificialmente el balance general de la compañía."
        ),
        "step_guide": {
            "title": "Lección 1: Arquitectura del Pedido de Compras (OPOR)",
            "menu_path": "Compras - Proveedores > Pedido",
            "action_type": "purchase_order",
            "instructions": [
                "Abre Compras - Proveedores > Pedido.",
                "Selecciona el proveedor y asigna el almacén logístico de destino.",
                "Carga los artículos con sus cantidades y precios pactados.",
                "Crea el pedido y verifica que el stock solicitado se incremente."
            ],
            "expected_output": "Pedido registrado en estado Abierto con impacto en stock solicitado y cero impacto contable.",
            "consultant_tip": "El pedido compromete la compra pero no afecta el Libro Mayor hasta la recepción física del material."
        }
    },
    {
        "slide_index": 2,
        "image_file": "Slide_02.webp",
        "script_text": (
            "El momento de la verdad en la logística ocurre con la Entrada de Mercancías en la tabla OPDN. "
            "Al ingresar físicamente los artículos al almacén, si la empresa opera bajo el esquema de inventario permanente, "
            "SAP Business One ejecuta automáticamente un asiento contable trascendental: "
            "incrementa el valor de las existencias en el activo en la columna del Debe, "
            "pero como aún no ha llegado la factura del proveedor, no podemos acreditar la cuenta por pagar definitiva. "
            "Aquí es donde entra en juego la cuenta transitoria o puente de Compensación EM/RF, acreditando el Haber. "
            "Este mecanismo financiero asegura que el balance refleje el incremento real del activo físico sin anticipar facturas fiscales no validadas."
        ),
        "step_guide": {
            "title": "Lección 2: Entrada de Mercancías (OPDN) y Cuenta Puente EM/RF",
            "menu_path": "Compras - Proveedores > Entrada de Mercancías por Pedido",
            "action_type": "goods_receipt",
            "instructions": [
                "Desde el pedido de compra, pulsa 'Copiar a' > 'Entrada de Mercancías por Pedido'.",
                "Verifica las cantidades recibidas físicamente en muelle.",
                "Contabiliza el documento y presiona Ctrl + J para auditar el asiento contable generado."
            ],
            "expected_output": "Inventario físico incrementado y asiento de provisión (Existencias vs Compensación EM/RF) registrado.",
            "consultant_tip": "La cuenta puente EM/RF garantiza que el balance cuadre antes de recibir la factura legal del proveedor."
        }
    },
    {
        "slide_index": 3,
        "image_file": "Slide_03.webp",
        "script_text": (
            "El cierre económico del aprovisionamiento se materializa con la Factura de Proveedores en la tabla OPCH. "
            "Al contabilizar la factura referenciando la entrada de mercancías previa mediante la función Copiar a, "
            "SAP realiza una operación de compensación perfecta: "
            "debita y salda a cero la cuenta puente transitoria de Compensación EM/RF, reconoce el impuesto de IVA soportado "
            "y acredita formalmente la deuda en la cuenta de control del proveedor en el pasivo. "
            "Este diseño de triple coincidencia entre pedido, entrada física y factura previene pagos indebidos "
            "y garantiza una auditoría contable inmaculada al momento de programar los pagos en tesorería."
        ),
        "step_guide": {
            "title": "Lección 3: Factura de Proveedores (OPCH) y Compensación Contable",
            "menu_path": "Compras - Proveedores > Factura de Proveedores",
            "action_type": "ap_invoice",
            "instructions": [
                "Copia la Entrada de Mercancías a 'Factura de Proveedores'.",
                "Introduce el número de factura fiscal del proveedor en Número de Referencia.",
                "Contabiliza y audita con Ctrl + J la cancelación de la cuenta puente EM/RF."
            ],
            "expected_output": "Cuenta transitoria compensada a cero y deuda comercial registrada en el pasivo.",
            "consultant_tip": "El proceso de triple coincidencia en SAP B1 blinda la empresa contra facturaciones duplicadas o erróneas."
        }
    },
    {
        "slide_index": 4,
        "image_file": "Slide_04.webp",
        "script_text": (
            "Uno de los mayores diferenciadores competitivos de SAP Business One frente a otros ERPs es su Mapa de Relaciones visual. "
            "Con un solo clic derecho sobre cualquier documento del circuito, el consultor o auditor financiero puede visualizar "
            "el árbol genealógico completo de la transacción: desde la cotización inicial, pasando por el pedido y la entrada de almacén, "
            "hasta la factura y el pago efectuado. "
            "Además, al hacer doble clic sobre la línea de conexión o los iconos contables, el sistema nos abre directamente el asiento en el Libro Mayor, "
            "permitiendo rastrear discrepancias de inventario o precios en cuestión de segundos y sin consultar tablas intermedias."
        ),
        "step_guide": {
            "title": "Lección 4: Mapa de Relaciones y Auditoría de Trazabilidad Total",
            "menu_path": "Clic Derecho en Documento > Mapa de Relaciones",
            "action_type": "relationship_map",
            "instructions": [
                "Haz clic derecho en la factura o entrada y selecciona 'Mapa de Relaciones'.",
                "Examina el árbol gráfico con el encadenamiento de todos los documentos.",
                "Haz doble clic en los iconos de diario para auditar los asientos contables vinculados."
            ],
            "expected_output": "Árbol gráfico interactivo mostrando el ciclo logístico completo y su estado de cierre.",
            "consultant_tip": "El Mapa de Relaciones es la herramienta definitiva para auditorías fiscales y resolución rápida de disputas."
        }
    }
]


# =========================================================================
# 3. CSL01_Introduction_Solution_ES (21 Lecciones Magistrales)
# =========================================================================
CSL01_SOL_BASE = [
    ("Lección 1: Visión General del ERP y Navegación Modular", "Iniciamos la solución del caso práctico de introducción explorando la arquitectura de menús en SAP Business One. El menú principal organiza las operaciones de la empresa en módulos interconectados: Gestión para parametrizaciones, Finanzas para el Libro Mayor, Socios de Negocios para clientes y proveedores, y las áreas operativas de Compras, Ventas e Inventario. La consistencia en la navegación permite que cualquier usuario domine el sistema con rapidez."),
    ("Lección 2: Filosofía del Cockpit Fiori en SAP HANA", "Para adaptar el sistema al rol del jefe de ventas Bill, seleccionamos la plantilla oficial de Cockpit de Ventas. A diferencia de las interfaces transaccionales clásicas, el Cockpit estilo Fiori en SAP HANA procesa métricas en memoria RAM en tiempo real, permitiendo que la gerencia visualice indicadores de desempeño y gráficos interactivos sin penalizar el rendimiento del servidor de producción."),
    ("Lección 3: Gestión Estratégica del Maestro de Clientes (OCRD)", "Abrimos el Maestro de Socios de Negocios para los clientes C20000, C50000 y C60000. En la pestaña General vinculamos a Bill como empleado de ventas responsable. En SAP Business One, esta asignación no es un dato decorativo: define la jerarquía de aprobaciones, las alertas automáticas de cartera y la liquidación de comisiones periódicas para el equipo comercial."),
    ("Lección 4: Búsqueda Rápida y Localización de Funciones", "Una de las funciones más potentes para el usuario diario es la barra de búsqueda de menús superior. Al escribir cualquier término, como Actividades, el sistema filtra y resalta la ruta exacta dentro del árbol de módulos en milisegundos, reduciendo el tiempo de capacitación y eliminando la necesidad de memorizar rutas complejas."),
    ("Lección 5: Widget de Funciones Comunes para CRM", "Arrastramos el acceso directo de Actividades hacia el widget de Funciones Comunes del Cockpit. Con esta configuración, el asesor comercial dispone de un centro de gestión para registrar llamadas telefónicas, reuniones presenciales y tareas de prospección con un solo clic, asegurando que ningún compromiso comercial quede desatendido."),
    ("Lección 6: Ajustes de Formulario y Personalización de Pantalla", "En implementaciones reales, un formulario comercial cargado de campos irrelevantes aumenta la probabilidad de error humano. Mediante los Ajustes de Formulario, el consultor puede ocultar o bloquear campos secundarios para simplificar la vista del usuario, manteniendo intacta la estructura subyacente de la base de datos."),
    ("Lección 7: Anatomía de la Oferta de Ventas (OQUT)", "Iniciamos el ciclo de ventas registrando una Oferta de Ventas formal en la tabla OQUT. Este documento comercial establece los precios de lista pactados y el período de validez de la propuesta. Dado que no representa una transacción consumada, la oferta no afecta el inventario físico ni genera movimientos en el Libro Mayor contable."),
    ("Lección 8: La Cadena de Trazabilidad: Copiar a vs Copiar de", "Para convertir la oferta en pedido, utilizamos el mecanismo oficial de enlace Copiar a. En SAP Business One, arrastrar datos entre documentos mediante Copiar a preserva el árbol genealógico del proceso, asegurando que las cantidades, precios y descuentos se transfieran sin discrepancias ni necesidad de recaptura manual."),
    ("Lección 9: El Pedido de Ventas (ORDR) y Stock Comprometido", "Al confirmar el pedido en la tabla ORDR, el sistema realiza una acción logística crucial: incrementa el valor en la columna de Stock Comprometido para los artículos seleccionados. Aunque el material sigue físicamente en el almacén, el motor de reservas de SAP impide que otros vendedores ofrezcan esas mismas unidades a otros clientes."),
    ("Lección 10: Comprobación de Disponibilidad (ATP) en Tiempo Real", "La tecnología SAP HANA incluye el cálculo dinámico de verificación de disponibilidad ATP (Available to Promise). El sistema analiza en milisegundos el stock físico disponible, las recepciones de compra programadas y los pedidos confirmados para entregar una fecha certera de despacho, evitando promesas de entrega imposibles de cumplir."),
    ("Lección 11: Entrega de Mercancías (ODLN): Impacto Físico", "La salida física del inventario se oficializa con la Entrega de Mercancías en la tabla ODLN. Este albarán es el documento legal de transporte que acompaña la carga física y descuenta inmediatamente las unidades del almacén seleccionado, reduciendo las existencias reales en el módulo de inventario."),
    ("Lección 12: Asiento Contable Automático de Existencias", "Si la empresa opera con sistema de inventario permanente, la Entrega de Mercancías genera automáticamente un asiento en el Libro Mayor: debita la cuenta de Costo de Mercancías Vendidas y acredita la cuenta de Existencias del activo. Este asiento reconoce el costo financiero de la venta en el mismo período en que se entrega el bien."),
    ("Lección 13: Factura de Clientes (OINV): Reconocimiento del Ingreso", "Copiamos la Entrega hacia la Factura de Deudores en la tabla OINV. Este documento tributario formaliza la obligación de pago del cliente, liquida los impuestos sobre el valor añadido correspondientes y reconoce formalmente el ingreso comercial en la contabilidad general de la empresa."),
    ("Lección 14: Asiento de Factura: Cliente vs Ventas e Impuestos", "El asiento contable de la Factura de Clientes carga en el Debe la cuenta de control del deudor por el total bruto, y abona en el Haber la cuenta de Ingresos Comerciales por el importe neto y la cuenta de Impuestos Repercutidos por el IVA correspondiente, dejando la cuenta por cobrar registrada en el balance."),
    ("Lección 15: Cobro Recibido en Gestión de Bancos (ORCT)", "Al recibir el pago del cliente, registramos el Cobro en la tabla ORCT del módulo de Gestión de Bancos. Seleccionamos el medio de pago, ya sea transferencia electrónica, cheque o efectivo, cancelando el saldo pendiente de la factura y extinguiendo la cuenta por cobrar en el balance."),
    ("Lección 16: Depósito Bancario y Liquidación de Medios", "Cuando los cobros se reciben en cheques o efectivo, permanecen provisionalmente en una cuenta de fondos a depositar. Mediante el Depósito Bancario en la tabla ODPS, transferimos formalmente esos recursos hacia la cuenta corriente bancaria de la empresa, cuadrando el saldo contable con el extracto bancario."),
    ("Lección 17: Conciliación Interna Automática", "Al aplicar el cobro a la factura, SAP Business One realiza la conciliación interna entre ambas transacciones. Este proceso matemático casa los importes en el Debe y el Haber del cliente, cerrando las partidas abiertas y garantizando que el estado de cuenta refleje únicamente las deudas vigentes."),
    ("Lección 18: Navegación Drill-down con la Flecha Naranja", "Un consultor senior aprovecha la navegación drill-down en todo momento. Al hacer clic sobre cualquier flecha de enlace naranja en los reportes o formularios, SAP abre directamente el maestro del cliente, del artículo o del asiento contable sin necesidad de abrir menús secundarios."),
    ("Lección 19: Auditoría Integral con el Mapa de Relaciones", "Desde cualquier documento del ciclo, abrimos el Mapa de Relaciones para auditar la cadena de transacciones completa. El gráfico muestra la Oferta, el Pedido, la Entrega, la Factura y el Cobro conectados en color verde con estado Cerrado, certificando que el proceso concluyó con éxito operativo y contable."),
    ("Lección 20: Monitoreo en Tiempo Real del Cockpit", "Al regresar a la pantalla de inicio, comprobamos cómo el Cockpit Fiori de Bill actualizó en tiempo real los contadores de facturación y despacho. La tecnología en memoria de SAP HANA permite que los directivos auditen la salud comercial del negocio sin esperar a los cierres mensuales."),
    ("Lección 21: Conclusión y Competencias de Consultoría Comercial", "Hemos completado la solución del ciclo de ventas e introducción a SAP Business One. Ahora dominas la navegación modular, la personalización de entornos Fiori, la arquitectura de maestros y la repercusión contable del circuito comercial, consolidando las bases para tu certificación oficial.")
]

CSL01_SOLUTIONS_LESSONS = []
for i, (title, script) in enumerate(CSL01_SOL_BASE):
    idx = i + 1
    CSL01_SOLUTIONS_LESSONS.append({
        "slide_index": idx,
        "image_file": f"Slide_{idx:02d}.webp",
        "script_text": script,
        "step_guide": {
            "title": title,
            "menu_path": "Circuito Order-to-Cash en SAP Business One",
            "action_type": "sales_step",
            "instructions": [
                f"Sigue las directrices pedagógicas de la {title}.",
                "Audita las transacciones y asientos contables asociados en el sistema.",
                "Valida la coherencia de datos entre módulos en el simulador."
            ],
            "expected_output": f"Paso {idx} validado según los estándares oficiales de consultoría SAP."
        }
    })


# =========================================================================
# 4. CSL02_Procurement_Process_Solution_ES (24 Lecciones Magistrales)
# =========================================================================
CSL02_SOL_BASE = [
    ("Lección 1: Oferta de Compra a Proveedores", "El ciclo de aprovisionamiento en SAP Business One inicia con la solicitud formal de cotizaciones mediante la Oferta de Compra. Este documento permite registrar las cotizaciones de múltiples proveedores para comparar precios, tiempos de entrega y descuentos comerciales antes de comprometer fondos de la empresa."),
    ("Lección 2: Creación del Pedido de Compra (OPOR)", "Una vez seleccionada la mejor propuesta comercial, formalizamos el Pedido de Compra en la tabla OPOR. Este contrato mercantil fija las condiciones comerciales pactadas y establece la fecha límite de entrega para el proveedor, asegurando el abastecimiento oportuno."),
    ("Lección 3: El Impacto Logístico del Stock Solicitado", "Aunque el pedido no genera movimientos contables en el Libro Mayor, tiene un impacto vital en la gestión de la cadena de suministro: incrementa el valor en la columna de Stock Solicitado, permitiendo que el planificador de compras y el cálculo MRP de SAP reconozcan las recepciones futuras de inventario."),
    ("Lección 4: Entrada de Mercancías por Pedido (OPDN)", "Cuando el transporte del proveedor entrega físicamente los materiales en el muelle de descarga, registramos la Entrada de Mercancías en la tabla OPDN. Esta transacción incrementa las existencias físicas en el almacén y actualiza el valor contable del inventario."),
    ("Lección 5: El Asiento Contable Provisional de Existencias", "Al contabilizar la Entrada de Mercancías bajo inventario permanente, SAP Business One genera un asiento en el Libro Mayor: debita la cuenta de Existencias del activo y acredita la cuenta puente de Compensación EM/RF, reflejando el incremento del activo antes de recibir la factura legal."),
    ("Lección 6: Valoración de Existencias (PMP vs FIFO)", "Durante la entrada de almacén, el motor de inventario de SAP aplica el método de valoración configurado para el artículo, ya sea Precio Medio Ponderado, FIFO o Coste Estándar, recalculando el costo unitario de las existencias para asegurar márgenes de venta precisos."),
    ("Lección 7: Gestión de Discrepancias y Devoluciones", "Si al momento de la inspección física se detectan artículos defectuosos o sobrantes, el consultor puede utilizar el documento de Devolución de Mercancías para devolver el material al proveedor, revirtiendo el asiento contable provisional y ajustando el stock físico sin generar facturas erróneas."),
    ("Lección 8: Factura de Proveedores (OPCH) y Triple Coincidencia", "El cierre financiero de la compra ocurre al recibir la Factura de Proveedores en la tabla OPCH. Mediante el principio de triple coincidencia, SAP valida que las cantidades y precios de la factura coincidan exactamente con lo estipulado en el pedido original y con lo recibido físicamente en el albarán."),
    ("Lección 9: Compensación a Cero de la Cuenta EM/RF", "El asiento contable de la Factura de Proveedores debita la cuenta transitoria de Compensación EM/RF dejándola exactamente en cero, reconoce el impuesto de IVA soportado deducible y acredita en el pasivo la cuenta por pagar a favor del proveedor, liquidando la provisión de compra."),
    ("Lección 10: Retenciones Fiscales y Cumplimiento Normativo", "En localizaciones fiscales complejas, la Factura de Proveedores calcula automáticamente las retenciones de impuestos en la fuente según la categoría fiscal del proveedor, registrando los pasivos fiscales ante la administración tributaria y deduciendo el neto a pagar."),
    ("Lección 11: Solicitud y Factura de Anticipo a Proveedores", "Cuando un proveedor exige un pago previo a la fabricación o despacho, utilizamos la Factura de Anticipo. Este mecanismo permite emitir el desembolso contable sin alterar el costo medio de los inventarios hasta que se produzca la entrega real de los bienes."),
    ("Lección 12: Notas de Crédito de Proveedores", "Si con posterioridad al registro de la factura se acuerdan descuentos por volumen o devoluciones posteriores a la facturación, se emite una Nota de Crédito de Proveedores en la tabla ORPC para disminuir la deuda comercial y ajustar el crédito fiscal correspondiente."),
    ("Lección 13: Pago Efectuado en Gestión de Bancos (OVPM)", "Al llegar la fecha de vencimiento acordada, el departamento de tesorería ejecuta el Pago Efectuado en la tabla OVPM. El sistema permite seleccionar facturas vencidas para liquidarlas mediante transferencia bancaria, cheque corporativo o pagaré electrónico."),
    ("Lección 14: Asiento Contable del Pago a Proveedores", "El Pago Efectuado debita la cuenta de control del proveedor en el pasivo, extinguiendo formalmente la deuda comercial, y acredita la cuenta bancaria en el activo financiero, completando el ciclo económico del dinero en la compañía."),
    ("Lección 15: Conciliación Bancaria y Extractos Electrónicos", "El ciclo de tesorería se audita mediante la Conciliación Bancaria Externa. Cruzamos los movimientos registrados en el Libro Mayor contra el extracto oficial recibido de la entidad bancaria, garantizando que no existan cobros indebidos, comisiones no contabilizadas o cheques extraviados."),
    ("Lección 16: Costes de Importación y Precios de Entrega", "En adquisiciones internacionales, el costo del artículo no es solo el precio de compra; incluye fletes marítimos, seguros y aranceles aduaneros. El documento de Precios de Entrega en SAP B1 prorratea estos costos adicionales sobre el costo unitario del inventario, garantizando un costeo real."),
    ("Lección 17: Auditoría con el Mapa de Relaciones de Compras", "Abrimos el Mapa de Relaciones del circuito de aprovisionamiento para verificar el encadenamiento de la Oferta, Pedido, Entrada de Mercancías, Factura y Pago. La visualización en árbol con indicadores en verde confirma que todos los documentos se encuentran cerrados y cuadrados."),
    ("Lección 18: Análisis de Compras y Lista de Partidas Abiertas", "El control de compras se complementa con reportes analíticos de gestión. El informe de Análisis de Compras permite evaluar el volumen negociado por proveedor y por familia de productos, mientras que la Lista de Partidas Abiertas alerta sobre pedidos pendientes de entrega en almacén."),
    ("Lección 19: Informe de Antigüedad de Saldos a Proveedores", "El informe de Antigüedad de Cuentas por Pagar es la herramienta clave para la planificación financiera. Proyecta los vencimientos de deuda a 30, 60 y 90 días, permitiendo que la dirección negocie plazos de crédito y proteja la liquidez del negocio sin incurrir en mora."),
    ("Lección 20: Gestión Estratégica del Flujo de Caja", "El ciclo de compras impacta directamente en el informe de Flujo de Caja proyectado en SAP Business One. Al programar pagos considerando los plazos de crédito negociados, la empresa optimiza su capital de trabajo sin comprometer la continuidad operativa del suministro."),
    ("Lección 21: El Cockpit Fiori del Gestor de Compras", "Configuramos el Cockpit Fiori para el departamento de compras con widgets analíticos que muestran el porcentaje de cumplimiento de entregas de proveedores, el gasto acumulado del mes y las solicitudes urgentes de cotización, facilitando la toma de decisiones basada en datos."),
    ("Lección 22: Buenas Prácticas de Consultoría en Compras", "Un consultor senior de SAP debe vigilar tres parametrizaciones maestras: bloquear la creación de entradas sin pedido previo, exigir tolerancia cero en diferencias de precios en la factura y parametrizar alertas de límite de presupuesto de compras por centro de beneficio."),
    ("Lección 23: Preguntas Clave de Certificación Oficial SAP", "Repasamos los conceptos evaluados en la certificación oficial de SAP: el rol de la cuenta transitoria EM/RF, el impacto en stock comprometido versus solicitado, y la diferencia entre una factura de reserva y una factura de proveedores estándar."),
    ("Lección 24: Conclusión Ejecutiva del Ciclo Procure-to-Pay", "¡Felicitaciones! Has completado el ciclo integral de compras y aprovisionamiento en SAP Business One. Cuentas ahora con el criterio técnico y contable necesario para liderar implementaciones de aprovisionamiento logístico bajo los más altos estándares internacionales.")
]

CSL02_SOLUTIONS_LESSONS = []
for i, (title, script) in enumerate(CSL02_SOL_BASE):
    idx = i + 1
    CSL02_SOLUTIONS_LESSONS.append({
        "slide_index": idx,
        "image_file": f"Slide_{idx:02d}.webp",
        "script_text": script,
        "step_guide": {
            "title": title,
            "menu_path": "Circuito Procure-to-Pay en SAP Business One",
            "action_type": "procurement_step",
            "instructions": [
                f"Analiza en profundidad los fundamentos técnicos de la {title}.",
                "Audita los movimientos de inventario y asientos en el Libro Mayor.",
                "Valida la integridad de la cadena en el simulador interactivo."
            ],
            "expected_output": f"Paso {idx} validado conforme a los estándares de certificación oficial SAP B1."
        }
    })

if __name__ == "__main__":
    print("Iniciando generación de los 4 manuales restantes con pedagogía de élite...")
    build_masterclass("CSL01_Introduction_ES", CSL01_PRACTICE_LESSONS)
    build_masterclass("CSL02_Procurement_Process_ES", CSL02_PRACTICE_LESSONS)
    build_masterclass("CSL01_Introduction_Solution_ES", CSL01_SOLUTIONS_LESSONS)
    build_masterclass("CSL02_Procurement_Process_Solution_ES", CSL02_SOLUTIONS_LESSONS)
    print("\n✅ Los 4 manuales restantes han sido completados con éxito.")
