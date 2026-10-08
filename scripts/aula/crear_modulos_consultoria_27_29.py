#!/usr/bin/env python3
"""
Genera las 12 clases restantes de consultoría y business analyst (mod-27 a mod-29) en scratch/aula_es/<id>/clase.json.
Diseñado con rigor metodológico oficial de BPMN 2.0, BRD/BBD, UAT y Change Management.
"""
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parents[2]
DESTINO = ROOT / "scratch" / "aula_es"

CLASES = [
    # ══════════════════════════════════════════════════════════════════════════
    # MÓDULO 27: Modelado y Optimización de Procesos de Negocio (BPMN 2.0)
    # ══════════════════════════════════════════════════════════════════════════
    {
        "id": "mod27-c1",
        "modulo": "mod-27",
        "titulo": "Fundamentos de BPMN 2.0 para Consultores ERP",
        "laminas": [
            {
                "layout": "portada",
                "titulo": "Fundamentos de BPMN 2.0 para Consultores ERP",
                "claves": ["BPMN 2.0", "Modelado gráfico", "Lenguaje universal", "Alineación"],
                "icono": "workflow",
                "narracion": "Bienvenido a la clase sobre modelado de procesos con BPMN dos punto cero. Como consultor funcional en SAP, tu labor principal es traducir realidades operativas complejas en flujos visuales comprensibles y libres de ambigüedad. Hoy aprenderás la notación gráfica estándar que conecta a gerentes de negocio con consultores y parametrizadores del sistema."
            },
            {
                "layout": "objetivos",
                "titulo": "Objetivos de aprendizaje",
                "claves": ["Dominar símbolos BPMN", "Diferenciar Pools y Lanes", "Usar compuertas lógicas", "Crear usuario en SAP B1"],
                "icono": "target",
                "narracion": "Al finalizar esta clase dominarás la simbología central de BPMN dos punto cero: eventos, actividades y compuertas lógicas. Aprenderás a delimitar responsabilidades entre departamentos mediante Pools y Lanes, y practicarás en SAP Business One la creación de usuarios vinculados a sus respectivos carriles funcionales."
            },
            {
                "layout": "concepto",
                "titulo": "El estándar global de modelado de negocio",
                "claves": ["Notación unificada", "Cero ambigüedad", "Puente negocio-TI", "Norma ISO"],
                "icono": "globe",
                "narracion": "BPMN dos punto cero es la norma internacional mantenida por el Object Management Group para la representación gráfica de procesos. A diferencia de los diagramas informales, cada símbolo de BPMN tiene una semántica matemática precisa. Esto evita que los requerimientos se presten a interpretaciones contradictorias durante la implementación de SAP."
            },
            {
                "layout": "flujo",
                "titulo": "Elementos centrales de un flujo BPMN",
                "claves": ["Evento inicio", "Actividad", "Compuerta decisión", "Flujo secuencia", "Evento fin"],
                "icono": "workflow",
                "pasos": [
                    {"texto": "Evento de inicio del proceso", "icono": "search"},
                    {"texto": "Tarea o actividad ejecutada", "icono": "clipboard-list"},
                    {"texto": "Compuerta de decisión lógica", "icono": "git-branch"},
                    {"texto": "Flujo de secuencia conector", "icono": "arrow-left-right"},
                    {"texto": "Evento de fin con resultado", "icono": "award"}
                ],
                "narracion": "Todo proceso BPMN comienza con un evento de inicio que detona la acción. Las actividades representan tareas específicas etiquetadas con verbo y sustantivo. Las compuertas bifurcan el camino según condiciones de negocio. Las líneas de secuencia marcan el orden temporal, culminando en un evento de fin que registra el resultado alcanzado."
            },
            {
                "layout": "comparacion",
                "titulo": "Diagrama informal vs. Notación BPMN 2.0",
                "claves": ["Rigor", "Estandarización", "Claridad", "Automatización"],
                "icono": "scale",
                "columnas": [
                    {
                        "titulo": "Diagramas Informales",
                        "icono": "file-text",
                        "puntos": ["Formas geométricas libres y confusas", "No distinguen responsable ni condiciones", "Inútiles para parametrizar software"]
                    },
                    {
                        "titulo": "BPMN 2.0 Oficial",
                        "icono": "circle-check",
                        "puntos": ["Simbología estandarizada a nivel mundial", "Carriles y compuertas con lógica formal", "Base directa para configurar reglas en SAP"]
                    }
                ],
                "narracion": "Los diagramas informales hechos en pizarras suelen esconder lagunas de información que explotan durante la puesta en marcha. Por el contrario, BPMN dos punto cero fuerza al consultor a definir con exactitud quién realiza cada paso y qué ocurre ante cada excepción, sirviendo de base directa para parametrizar el ERP."
            },
            {
                "layout": "pantalla",
                "titulo": "Definir usuario y rol operativo en SAP",
                "claves": ["Usuario SAP", "Código identificador", "Departamento", "Carril de proceso"],
                "icono": "user-check",
                "ventana": "Gestión > Definición > General > Usuarios",
                "campos": [
                    {"etiqueta": "Código de usuario", "valor": "ASILVA"},
                    {"etiqueta": "Nombre de usuario", "valor": "Ana Silva"},
                    {"etiqueta": "Departamento", "valor": "Ventas"},
                    {"etiqueta": "Bloqueado", "valor": "No"}
                ],
                "resaltar": 0,
                "practica": {
                    "titulo": "Registrar usuario asignado a carril de ventas",
                    "menu_path": "Gestión > Definición > General > Usuarios",
                    "instrucciones": [
                        "Accede a Gestión y Definición General",
                        "Abre la ventana Usuarios",
                        "Ingresa el código de usuario ASILVA y nombre Ana Silva",
                        "Asigna el departamento de Ventas y guarda el registro"
                    ],
                    "campos": [
                        {"etiqueta": "Código de usuario", "valor": "ASILVA", "pista": "Código corto del empleado"},
                        {"etiqueta": "Nombre de usuario", "valor": "Ana Silva", "pista": "Nombre completo de la asistente"},
                        {"etiqueta": "Departamento", "valor": "Ventas", "pista": "Área funcional correspondiente al carril BPMN"},
                        {"etiqueta": "Bloqueado", "valor": "No", "pista": "Usuario habilitado para operar"}
                    ]
                },
                "narracion": "En el modelo BPMN cada carril o Lane representa un rol de la organización. Para que el proceso cobre vida en SAP Business One, creamos los usuarios correspondientes en el sistema. En esta práctica creas a la usuaria Ana Silva vinculada al departamento de Ventas, habilitándola para operar las pantallas de su carril de proceso."
            },
            {
                "layout": "tabla",
                "titulo": "Compuertas de decisión en BPMN 2.0",
                "claves": ["Compuerta exclusiva", "Compuerta paralela", "Compuerta inclusiva"],
                "icono": "git-branch",
                "tabla": {
                    "encabezados": ["Compuerta", "Símbolo", "Comportamiento", "Aplicación en SAP B1"],
                    "filas": [
                        ["Exclusiva (XOR)", "Rombo con X", "Toma solo una ruta según condición", "Aprobación crediticia: Aprobado o Rechazado"],
                        ["Paralela (AND)", "Rombo con +", "Activa todas las ramas simultáneas", "Notificar a almacén Y enviar copia a facturación"],
                        ["Inclusiva (OR)", "Rombo con O", "Activa una o más ramas válidas", "Despacho parcial o retención de garantía"]
                    ]
                },
                "narracion": "Dominar las compuertas es fundamental para modelar decisiones. La compuerta exclusiva evalúa condiciones mutuamente excluyentes, como aprobar o rechazar un pedido. La paralela ejecuta tareas simultáneas en distintos departamentos, y la inclusiva permite caminos combinados según múltiples criterios comerciales."
            },
            {
                "layout": "kpi",
                "titulo": "Métricas de calidad en el modelado",
                "claves": ["Simplicidad", "Cobertura", "Estandarización"],
                "icono": "chart-line",
                "kpis": [
                    {"valor": "100%", "etiqueta": "Actividades con responsable asignado en Lane", "icono": "user-check"},
                    {"valor": "0", "etiqueta": "Compuertas sin condición de salida definida", "icono": "git-branch"},
                    {"valor": "100%", "etiqueta": "Alineación con la simbología BPMN 2.0", "icono": "award"}
                ],
                "narracion": "Un diagrama de procesos es de clase mundial cuando el cien por ciento de las actividades tiene un carril de responsabilidad explícito, no existe ninguna compuerta sin regla lógica de salida, y la notación respeta estrictamente los estándares internacionales de la industria."
            },
            {
                "layout": "resumen",
                "titulo": "Resumen de fundamentos BPMN",
                "claves": ["Notación formal", "Lanes por rol", "Compuertas lógicas", "Base para SAP"],
                "icono": "lightbulb",
                "narracion": "BPMN dos punto cero es la herramienta de pensamiento del consultor de élite. Has aprendido a estructurar flujos visuales que facilitan el diálogo con el cliente y sientan las bases para el diagnóstico del estado actual que abordaremos en la próxima lección."
            }
        ]
    },
    {
        "id": "mod27-c2",
        "modulo": "mod-27",
        "titulo": "Mapeo del Estado Actual (AS-IS) y Detección de Ineficiencias",
        "laminas": [
            {
                "layout": "portada",
                "titulo": "Mapeo del Estado Actual (AS-IS)",
                "claves": ["Diagnóstico AS-IS", "Cuellos de botella", "Silos de datos", "Eficiencia"],
                "icono": "search",
                "narracion": "Antes de proponer mejoras o configurar software, el consultor debe comprender con exactitud la realidad operativa del cliente. En esta clase aprenderás las técnicas de levantamiento del estado actual AS-IS, cómo identificar cuellos de botella y silos de información, y cómo medir el impacto de las ineficiencias en el negocio."
            },
            {
                "layout": "objetivos",
                "titulo": "Objetivos de aprendizaje",
                "claves": ["Levantar flujo AS-IS", "Identificar patologías", "Medir tiempos de ciclo", "Auditar pedidos abiertos"],
                "icono": "target",
                "narracion": "Al finalizar esta clase sabrás aplicar técnicas de observación directa y entrevistas para mapear el proceso AS-IS. Aprenderás a diagnosticar patologías comunes como la doble digitación y las aprobaciones informales, y practicarás en el sistema la auditoría de pedidos pendientes de entrega."
            },
            {
                "layout": "concepto",
                "titulo": "Por qué documentar el AS-IS antes de parametrizar",
                "claves": ["Diagnóstico previo", "Evitar automatizar vicios", "Medir el retorno", "Justificar cambio"],
                "icono": "clipboard-list",
                "narracion": "Automatizar un proceso ineficiente sin revisarlo solo produce ineficiencia automatizada a mayor velocidad. El mapeo AS-IS permite entender las causas profundas de los problemas del cliente, cuantificar los tiempos perdidos y sustentar con datos sólidos ante la gerencia por qué el nuevo flujo en SAP generará ahorros millonarios."
            },
            {
                "layout": "flujo",
                "titulo": "Técnicas de levantamiento en sitio",
                "claves": ["Entrevistas", "Gemba Walk", "Revisión documental", "Validación grupal"],
                "icono": "workflow",
                "pasos": [
                    {"texto": "Entrevista semi-estructurada con Key Users", "icono": "users"},
                    {"texto": "Gemba Walk: observación en puesto de trabajo", "icono": "search"},
                    {"texto": "Recolección de documentos y formatos físicos", "icono": "files"},
                    {"texto": "Diagramación del flujo AS-IS en BPMN", "icono": "workflow"},
                    {"texto": "Sesión de validación y firma del estado actual", "icono": "file-check"}
                ],
                "narracion": "El relevamiento efectivo combina múltiples fuentes. Se entrevista a los usuarios clave, se realiza un recorrido de observación en el puesto de trabajo para ver qué hacen realmente, se analizan los documentos y hojas de cálculo auxiliares, se dibuja el flujo en BPMN y se valida en conjunto para certificar el diagnóstico."
            },
            {
                "layout": "pantalla",
                "titulo": "Auditar pedidos pendientes de entrega",
                "claves": ["Partidas abiertas", "Cuello de botella", "Pedidos demorados", "Diagnóstico"],
                "icono": "shopping-cart",
                "ventana": "Ventas - Clientes > Informes de ventas > Lista de partidas abiertas",
                "campos": [
                    {"etiqueta": "Documento", "valor": "Pedidos de cliente"},
                    {"etiqueta": "Estado", "valor": "Abierto"},
                    {"etiqueta": "Cliente", "valor": "C20000 - Maxi-Teq"},
                    {"etiqueta": "Fecha de contabilización", "valor": "07/10/2026"}
                ],
                "resaltar": 0,
                "practica": {
                    "titulo": "Consultar lista de pedidos pendientes",
                    "menu_path": "Ventas - Clientes > Informes de ventas > Lista de partidas abiertas",
                    "instrucciones": [
                        "Ingresa al módulo Ventas - Clientes e Informes de ventas",
                        "Abre el informe Lista de partidas abiertas",
                        "Selecciona el tipo de documento Pedidos de cliente",
                        "Verifica los pedidos pendientes de despacho para medir el retraso"
                    ],
                    "campos": [
                        {"etiqueta": "Documento", "valor": "Pedidos de cliente", "pista": "Filtro por tipo de documento abierto"},
                        {"etiqueta": "Estado", "valor": "Abierto", "pista": "Documentos sin entrega completa"},
                        {"etiqueta": "Cliente", "valor": "C20000 - Maxi-Teq", "pista": "Socio de negocios con pedidos pendientes"},
                        {"etiqueta": "Fecha de contabilización", "valor": "07/10/2026", "pista": "Fecha de corte del informe"}
                    ]
                },
                "narracion": "Durante el diagnóstico del proceso comercial, descubrimos que los pedidos tardan cuatro días en despacharse porque Bodega no recibe la información a tiempo. En esta práctica abres la Lista de partidas abiertas en SAP Business One para auditar los pedidos de clientes pendientes, detectando con precisión dónde se concentra el cuello de botella."
            },
            {
                "layout": "tabla",
                "titulo": "Patologías habituales en procesos AS-IS",
                "claves": ["Silos de datos", "Doble digitación", "Aprobaciones informales", "Falta de stock"],
                "icono": "triangle-alert",
                "tabla": {
                    "encabezados": ["Patología Operativa", "Manifestación en la PyME", "Riesgo para el Negocio", "Solución en SAP B1"],
                    "filas": [
                        ["Silos de Información", "Bodega y Contabilidad usan Excel separado", "Cifras de stock y costo no cuadran", "Base de datos unificada en tiempo real"],
                        ["Doble Digitación", "El mismo pedido se tipea en 3 sistemas", "Errores humanos y pérdida de tiempo", "Documentos interconectados por flujo"],
                        ["Aprobación Informal", "Autorizaciones por WhatsApp o de palabra", "Falta de auditoría y descontrol de costos", "Modelos de autorización configurables"],
                        ["Venta sin Stock", "Vendedores prometen productos inexistentes", "Incumplimiento al cliente y devoluciones", "Verificación automática de disponibilidad ATP"]
                    ]
                },
                "narracion": "Identificar estas patologías permite al consultor formular la prescripción exacta. Si hay silos de datos, la solución es la base unificada de SAP. Si hay aprobaciones por mensaje informal, se parametrizan procedimientos formales de autorización. Si hay ventas sin stock, se activa el control de ATP en tiempo real."
            },
            {
                "layout": "kpi",
                "titulo": "Impacto cuantificable del diagnóstico",
                "claves": ["Tiempo de ciclo", "Horas hombre", "Precisión de stock"],
                "icono": "clock",
                "kpis": [
                    {"valor": "72 h", "etiqueta": "Tiempo promedio de despacho en el estado actual", "icono": "clock"},
                    {"valor": "15 h/sem", "etiqueta": "Horas perdidas en digitación duplicada", "icono": "repeat"},
                    {"valor": "68%", "etiqueta": "Confiabilidad del inventario previo a SAP", "icono": "trending-down"}
                ],
                "narracion": "Presentar los problemas del cliente con números concretos es la marca de un consultor senior: demostrar que el despacho demora setenta y dos horas, que se desperdician quince horas semanales reescribiendo datos y que la precisión del inventario apenas alcanza el sesenta y ocho por ciento crea la urgencia necesaria para el cambio."
            },
            {
                "layout": "resumen",
                "titulo": "Resumen del diagnóstico AS-IS",
                "claves": ["Escuchar al usuario", "Medir con datos", "Identificar patologías", "Base para el TO-BE"],
                "icono": "lightbulb",
                "narracion": "El diagnóstico AS-IS te proporciona la radiografía del negocio. Con las ineficiencias claramente expuestas y cuantificadas, estamos en posición de diseñar el estado futuro TO-BE bajo las mejores prácticas globales de SAP Business One."
            }
        ]
    },
    {
        "id": "mod27-c3",
        "modulo": "mod-27",
        "titulo": "Diseño del Estado Futuro (TO-BE) alineado a Mejores Prácticas SAP",
        "laminas": [
            {
                "layout": "portada",
                "titulo": "Diseño del Estado Futuro (TO-BE)",
                "claves": ["Proceso TO-BE", "Mejores prácticas", "Order-to-Cash", "Trazabilidad"],
                "icono": "layers",
                "narracion": "Diseñar el estado futuro TO-BE es la oportunidad de transformar la empresa cliente. En esta clase aprenderás cómo redefinir los flujos operativos para alinearlos con las mejores prácticas globales de SAP Business One, eliminando pasos redundantes y garantizando trazabilidad total desde la oferta comercial hasta el cobro en banco."
            },
            {
                "layout": "objetivos",
                "titulo": "Objetivos de aprendizaje",
                "claves": ["Diseñar flujos TO-BE", "Alinear a mejores prácticas", "Mapear documentos SAP", "Registrar oferta comercial"],
                "icono": "target",
                "narracion": "Al finalizar esta clase sabrás modelar el proceso futuro en BPMN dos punto cero. Aprenderás a mapear cada tarea gráfica a un documento transaccional de SAP Business One, garantizando la continuidad de la información, y practicarás la creación de una oferta de venta que inicia el ciclo Order-to-Cash."
            },
            {
                "layout": "concepto",
                "titulo": "La filosofía del diseño TO-BE en ERP",
                "claves": ["Simplicidad", "Integración nativa", "Flujo continuo", "Control por excepción"],
                "icono": "workflow",
                "narracion": "El diseño TO-BE no busca replicar lo que la empresa hacía antes, sino simplificar radicalmente la operación mediante el flujo nativo de SAP. Cada documento transaccional copia los datos del documento anterior, heredando socios, precios, cantidades y cuentas contables sin necesidad de que el usuario vuelva a escribir un solo dato."
            },
            {
                "layout": "flujo",
                "titulo": "Ciclo Order-to-Cash optimizado en SAP B1",
                "claves": ["Oferta", "Pedido", "Entrega", "Factura", "Cobro bancario"],
                "icono": "workflow",
                "pasos": [
                    {"texto": "Oferta de venta al cliente", "icono": "file-text"},
                    {"texto": "Pedido de cliente con reserva de stock", "icono": "shopping-cart"},
                    {"texto": "Entrega y rebaja física en bodega", "icono": "truck"},
                    {"texto": "Factura de clientes con asiento e IVA", "icono": "receipt"},
                    {"texto": "Pago recibido y conciliación bancaria", "icono": "landmark"}
                ],
                "narracion": "En el flujo TO-BE de Order-to-Cash, la oferta comercial se convierte en pedido reservando el stock. Bodega despacha la mercadería generando la entrega y rebajando el inventario físico. Facturación genera el comprobante fiscal y el asiento con IVA, y Tesorería registra el cobro cerrando el ciclo con conciliación bancaria automática."
            },
            {
                "layout": "pantalla",
                "titulo": "Registrar oferta de venta en flujo TO-BE",
                "claves": ["Oferta de ventas", "Maxi-Teq", "Laptop Dell", "Inicio de ciclo"],
                "icono": "file-text",
                "ventana": "Ventas - Clientes > Oferta de ventas",
                "campos": [
                    {"etiqueta": "Cliente", "valor": "C20000 - Maxi-Teq"},
                    {"etiqueta": "Artículo", "valor": "A00001 - Laptop Dell Latitude 3420"},
                    {"etiqueta": "Cantidad", "valor": "5"},
                    {"etiqueta": "Precio unitario", "valor": "850.00"}
                ],
                "resaltar": 0,
                "practica": {
                    "titulo": "Crear oferta comercial según flujo TO-BE",
                    "menu_path": "Ventas - Clientes > Oferta de ventas",
                    "instrucciones": [
                        "Accede a Ventas - Clientes y selecciona Oferta de ventas",
                        "Elige al cliente C20000 (Maxi-Teq)",
                        "Agrega 5 unidades del artículo A00001 a precio de 850.00 dólares",
                        "Verifica el cálculo de IVA y guarda la oferta comercial"
                    ],
                    "campos": [
                        {"etiqueta": "Cliente", "valor": "C20000 - Maxi-Teq", "pista": "Socio de negocios comercial"},
                        {"etiqueta": "Artículo", "valor": "A00001 - Laptop Dell Latitude 3420", "pista": "Código del producto a cotizar"},
                        {"etiqueta": "Cantidad", "valor": "5", "pista": "Unidades cotizadas"},
                        {"etiqueta": "Precio unitario", "valor": "850.00", "pista": "Precio de lista según catálogo"}
                    ]
                },
                "narracion": "En el proceso rediseñado, la venta formal comienza con la oferta comercial en el sistema. En esta práctica creas la oferta de ventas para Maxi-Teq por cinco laptops Dell a ochocientos cincuenta dólares cada una. Esta oferta alimentará automáticamente el pedido y la entrega sin que nadie tenga que volver a digitar la información."
            },
            {
                "layout": "comparacion",
                "titulo": "Proceso fragmentado vs. Flujo integrado",
                "claves": ["Fragmentación", "Integración", "Visibilidad", "Eficiencia"],
                "icono": "scale",
                "columnas": [
                    {
                        "titulo": "Operación Fragmentada",
                        "icono": "triangle-alert",
                        "puntos": ["Cotizaciones en Word que se pierden", "Entregas en papel sin rebajar el sistema", "Cobranza a ciegas sin historial de cartera"]
                    },
                    {
                        "titulo": "Flujo TO-BE en SAP B1",
                        "icono": "circle-check",
                        "puntos": ["Documentos encadenados con copiar a / copiar de", "Rebaja de stock inmediata con costo real", "Trazabilidad visual con el Mapa de Relaciones"]
                    }
                ],
                "narracion": "El contraste es contundente: en lugar de documentos dispersos en computadoras individuales, el flujo TO-BE de SAP Business One conecta todos los eslabones de la cadena. El Mapa de Relaciones permite al gerente hacer un clic y ver la cotización original, la entrega, la factura y el cobro en un solo gráfico interactivo."
            },
            {
                "layout": "kpi",
                "titulo": "Beneficios tangibles del nuevo proceso",
                "claves": ["Lead Time", "Cero duplicidad", "Satisfacción"],
                "icono": "trending-up",
                "kpis": [
                    {"valor": "12 h", "etiqueta": "Reducción del tiempo de despacho (de 72h a 12h)", "icono": "clock"},
                    {"valor": "100%", "etiqueta": "Eliminación de la doble digitación de documentos", "icono": "repeat"},
                    {"valor": "99,5%", "etiqueta": "Precisión en las entregas sin pedidos erróneos", "icono": "circle-check"}
                ],
                "narracion": "El valor del rediseño TO-BE se refleja en resultados de alto impacto: reducir el tiempo de despacho de setenta y dos a doce horas, eliminar el cien por ciento de la digitación redundante y alcanzar un noventa y nueve coma cinco por ciento de precisión en las entregas a clientes."
            },
            {
                "layout": "resumen",
                "titulo": "Resumen del diseño TO-BE",
                "claves": ["Flujo continuo", "Copiar documentos", "Trazabilidad total", "Valor empresarial"],
                "icono": "lightbulb",
                "narracion": "Diseñar procesos TO-BE es dotar a la empresa de una estructura ágil y escalable. A continuación aprenderemos cómo convertir las compuertas de decisión de este flujo en procedimientos de aprobación auditables dentro de SAP Business One."
            }
        ]
    },
    {
        "id": "mod27-c4",
        "modulo": "mod-27",
        "titulo": "Traducción de BPMN a Reglas de Negocio y Aprobaciones en SAP B1",
        "laminas": [
            {
                "layout": "portada",
                "titulo": "De BPMN a Reglas de Negocio y Aprobaciones",
                "claves": ["Compuertas BPMN", "Aprobaciones SAP", "Auditoría", "Automatización"],
                "icono": "shield-check",
                "narracion": "En esta clase aprenderás a traducir las compuertas de decisión de tus diagramas BPMN en procedimientos de aprobación reales dentro de SAP Business One. Descubrirás cómo parametrizar autorizaciones por monto, descuentos o margen comercial para que el sistema controle por excepción de forma totalmente automática y auditable."
            },
            {
                "layout": "objetivos",
                "titulo": "Objetivos de aprendizaje",
                "claves": ["Traducir compuertas a reglas", "Configurar etapas y modelos", "Parametrizar límites de importe", "Crear modelo de aprobación"],
                "icono": "target",
                "narracion": "Al finalizar esta clase comprenderás la arquitectura de los procedimientos de aprobación en SAP: etapas, autores, modelos y condiciones. Aprenderás a configurar reglas preventivas para compras y ventas, y practicarás en el sistema la creación de un modelo de aprobación para pedidos comerciales de alto valor."
            },
            {
                "layout": "concepto",
                "titulo": "Arquitectura de autorizaciones en SAP B1",
                "claves": ["Etapas de autorización", "Usuarios autorizadores", "Términos y condiciones", "Documento preliminar"],
                "icono": "settings",
                "narracion": "Cuando un documento viola una regla de negocio (como superar el descuento máximo o el importe de crédito), SAP Business One detiene su creación y lo guarda como documento preliminar. Simultáneamente, el sistema envía una alerta y correo electrónico a los usuarios autorizadores definidos en la etapa correspondiente."
            },
            {
                "layout": "flujo",
                "titulo": "Ciclo de vida de una aprobación",
                "claves": ["Generación", "Detención", "Notificación", "Decisión", "Liberación"],
                "icono": "workflow",
                "pasos": [
                    {"texto": "Usuario intenta crear documento", "icono": "file-text"},
                    {"texto": "Sistema evalúa condiciones y retiene", "icono": "lock"},
                    {"texto": "Alerta automática al autorizador", "icono": "bell"},
                    {"texto": "Autorizador revisa y aprueba o rechaza", "icono": "check-check" if False else "circle-check"},
                    {"texto": "Documento definitivo generado en SAP", "icono": "award"}
                ],
                "narracion": "El ciclo es completamente transparente y sin papeles. El empleado genera el pedido; el sistema detecta que supera el umbral y lo congela; el gerente recibe una alerta instantánea en su escritorio; el gerente evalúa y aprueba con un clic, y el pedido queda formalmente generado con registro auditable de quién aprobó y a qué hora."
            },
            {
                "layout": "pantalla",
                "titulo": "Configurar modelo de aprobación comercial",
                "claves": ["Modelo aprobación", "Pedidos de cliente", "Umbral $ 2.000", "Autorizador Juan Pérez"],
                "icono": "settings",
                "ventana": "Gestión > Procedimientos de aprobación > Modelos de autorización",
                "campos": [
                    {"etiqueta": "Nombre del modelo", "valor": "Aprobación Pedidos > $2.000"},
                    {"etiqueta": "Documento", "valor": "Pedido de cliente"},
                    {"etiqueta": "Autorizador", "valor": "E001 - Juan Pérez"},
                    {"etiqueta": "Condición", "valor": "Total documento > 2000.00"}
                ],
                "resaltar": 0,
                "practica": {
                    "titulo": "Crear modelo de aprobación para ventas mayores a $2.000",
                    "menu_path": "Gestión > Procedimientos de aprobación > Modelos de autorización",
                    "instrucciones": [
                        "Accede a Gestión y Procedimientos de aprobación",
                        "Abre Modelos de autorización",
                        "Define el nombre del modelo: Aprobación Pedidos > $2.000",
                        "Asigna al autorizador Juan Pérez (E001) para pedidos que superen 2000.00 dólares y guarda"
                    ],
                    "campos": [
                        {"etiqueta": "Nombre del modelo", "valor": "Aprobación Pedidos > $2.000", "pista": "Nombre descriptivo de la regla"},
                        {"etiqueta": "Documento", "valor": "Pedido de cliente", "pista": "Tipo de documento sujeto a control"},
                        {"etiqueta": "Autorizador", "valor": "E001 - Juan Pérez", "pista": "Gerente Comercial autorizador"},
                        {"etiqueta": "Condición", "valor": "Total documento > 2000.00", "pista": "Criterio financiero de activación"}
                    ]
                },
                "narracion": "En el diagrama BPMN modelamos una compuerta que exige la firma del Gerente Comercial si la venta supera dos mil dólares. En esta práctica traduces esa compuerta en SAP Business One configurando un Modelo de autorización para que cualquier pedido superior a dos mil dólares requiera la aprobación digital de Juan Pérez."
            },
            {
                "layout": "tabla",
                "titulo": "Condiciones nativas frente a consultas SQL",
                "claves": ["Condiciones estándar", "Queries personalizadas", "Flexibilidad", "Rendimiento"],
                "icono": "database",
                "tabla": {
                    "encabezados": ["Tipo de Condición", "Casos Típicos", "Ventajas", "Recomendación"],
                    "filas": [
                        ["Condición Estándar", "Límite de crédito, % de descuento, Total del documento", "Configuración en 2 minutos, cero mantenimiento", "Usar siempre como primera opción"],
                        ["Consulta SQL de Usuario", "Margen bruto < 15%, cliente con facturas vencidas", "Flexibilidad total para reglas muy complejas", "Usar solo cuando el estándar no alcance"]
                    ]
                },
                "narracion": "SAP Business One permite activar aprobaciones mediante condiciones nativas predefinidas o mediante consultas SQL personalizadas. Como consultor, utiliza siempre las condiciones estándar por su rapidez de configuración y alta estabilidad, reservando las consultas SQL solo para reglas de alta sofisticación de negocio."
            },
            {
                "layout": "kpi",
                "titulo": "Control y agilidad empresarial",
                "claves": ["Cero fugas", "Tiempo de respuesta", "Auditoría"],
                "icono": "shield-check",
                "kpis": [
                    {"valor": "100%", "etiqueta": "Documentos de alto valor controlados y auditables", "icono": "lock"},
                    {"valor": "< 30 min", "etiqueta": "Tiempo promedio de resolución de autorizaciones", "icono": "clock"},
                    {"valor": "0", "etiqueta": "Descuentos no autorizados filtrados en ventas", "icono": "badge-dollar-sign"}
                ],
                "narracion": "Automatizar las compuertas de decisión elimina las fugas de dinero: cien por ciento de los pedidos críticos auditados, tiempos de respuesta gerencial menores a treinta minutos y cero descuentos indebidos en las ventas de la compañía."
            },
            {
                "layout": "resumen",
                "titulo": "Resumen de automatización de reglas",
                "claves": ["De BPMN a SAP", "Modelos de autorización", "Control sin frenar", "Procesos vivos"],
                "icono": "lightbulb",
                "narracion": "Has completado el Módulo 27 aprendiendo a tender el puente entre los modelos conceptuales BPMN dos punto cero y la parametrización ejecutiva de SAP Business One. Estás listo para avanzar al Módulo 28 sobre levantamiento y documentación de requerimientos."
            }
        ]
    }
]

def main():
    print(f"Generando clases mod-27 en {DESTINO}...")
    for c in CLASES:
        p = DESTINO / c["id"] / "clase.json"
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(json.dumps(c, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"✔ Clase generada: {c['id']} ({len(c['laminas'])} láminas)")

if __name__ == "__main__":
    main()
