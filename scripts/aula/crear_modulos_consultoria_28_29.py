#!/usr/bin/env python3
"""
Genera las 8 clases de los módulos 28 y 29 en scratch/aula_es/<id>/clase.json.
Diseñado con rigor metodológico oficial de BRD/BBD, Gherkin, RTM, Stakeholders, UAT y Go-Live.
"""
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parents[2]
DESTINO = ROOT / "scratch" / "aula_es"

CLASES = [
    # ══════════════════════════════════════════════════════════════════════════
    # MÓDULO 28: Levantamiento de Requerimientos y Documentación de Negocio
    # ══════════════════════════════════════════════════════════════════════════
    {
        "id": "mod28-c1",
        "modulo": "mod-28",
        "titulo": "Técnicas de Elicitación de Requisitos y Entrevistas Clave",
        "laminas": [
            {
                "layout": "portada",
                "titulo": "Elicitación de Requisitos y Entrevistas",
                "claves": ["Elicitación", "Entrevistas clave", "Cinco Porqués", "Requerimientos"],
                "icono": "users",
                "narracion": "Bienvenido a la clase sobre elicitación de requerimientos en consultoría ERP. El éxito de una implementación no depende de lo que el cliente dice que quiere, sino de lo que realmente necesita para operar y crecer. Hoy aprenderás las técnicas de interrogación apreciativa, cómo descubrir la causa raíz de los problemas y cómo clasificar los requisitos con rigor profesional."
            },
            {
                "layout": "objetivos",
                "titulo": "Objetivos de aprendizaje",
                "claves": ["Técnicas de elicitación", "Aplicar Cinco Porqués", "Clasificar requerimientos", "Definir propiedades de socios"],
                "icono": "target",
                "narracion": "Al finalizar esta clase sabrás estructurar entrevistas de descubrimiento con gerentes y usuarios operativos. Aprenderás a aplicar la técnica de los Cinco Porqués para desarmar solicitudes superficiales y encontrar la necesidad real, y practicarás en SAP Business One la configuración de propiedades maestras de interlocutores comerciales."
            },
            {
                "layout": "concepto",
                "titulo": "El arte de la elicitación frente a tomar notas",
                "claves": ["Elicitar no es transcribir", "Cuestionar supuestos", "Descubrir la necesidad", "Aportar valor"],
                "icono": "lightbulb",
                "narracion": "Un tomador de pedidos transcribe lo que el usuario pide; un Business Analyst de clase mundial elicita, es decir, extrae la verdad operativa mediante preguntas estratégicas. Cuando un usuario pide una función extravagante, el consultor indaga qué dolor intenta resolver, mostrando cómo el estándar de SAP soluciona el problema de raíz sin desarrollos costosos."
            },
            {
                "layout": "flujo",
                "titulo": "La técnica de los Cinco Porqués (5 Whys)",
                "claves": ["Problema visible", "Indagación iterativa", "Causa raíz", "Solución definitiva"],
                "icono": "workflow",
                "pasos": [
                    {"texto": "1. ¿Por qué pide inventario negativo?", "icono": "help-circle" if False else "search"},
                    {"texto": "2. ¿Por qué despachan sin factura?", "icono": "search"},
                    {"texto": "3. ¿Por qué la mercadería no está en SAP?", "icono": "search"},
                    {"texto": "4. ¿Por qué Compras demora en digitar?", "icono": "search"},
                    {"texto": "5. Causa: Falta implementar GRPO en muelle", "icono": "circle-check"}
                ],
                "narracion": "La técnica de los Cinco Porqués desmonta falsas necesidades. Ante la solicitud de permitir inventario negativo, preguntamos por qué hasta descubrir que el problema real era que Compras demoraba días en registrar facturas mientras el camión ya estaba en bodega. La solución no era inventario negativo, sino implementar la Entrada de Mercancías por Pedido en recepción física."
            },
            {
                "layout": "pantalla",
                "titulo": "Configurar propiedades de interlocutor comercial",
                "claves": ["Propiedades de socio", "Segmentación VIP", "Elicitación comercial", "Datos maestros"],
                "icono": "user-check",
                "ventana": "Gestión > Definición > Interlocutores comerciales > Propiedades",
                "campos": [
                    {"etiqueta": "Número de propiedad", "valor": "1"},
                    {"etiqueta": "Nombre de propiedad", "valor": "Cliente Corporativo VIP"},
                    {"etiqueta": "Estado", "valor": "Activo"},
                    {"etiqueta": "Área de aplicación", "valor": "Ventas"}
                ],
                "resaltar": 1,
                "practica": {
                    "titulo": "Definir propiedad de segmentación de clientes",
                    "menu_path": "Gestión > Definición > Interlocutores comerciales > Propiedades",
                    "instrucciones": [
                        "Accede a Gestión y Definición de Interlocutores comerciales",
                        "Abre la ventana Propiedades",
                        "En la propiedad número 1 escribe: Cliente Corporativo VIP",
                        "Actualiza la ventana para que esté disponible en los datos maestros"
                    ],
                    "campos": [
                        {"etiqueta": "Número de propiedad", "valor": "1", "pista": "Posición de la propiedad en el formulario"},
                        {"etiqueta": "Nombre de propiedad", "valor": "Cliente Corporativo VIP", "pista": "Etiqueta requerida por la gerencia"},
                        {"etiqueta": "Estado", "valor": "Activo", "pista": "Propiedad habilitada"},
                        {"etiqueta": "Área de aplicación", "valor": "Ventas", "pista": "Uso en módulo comercial"}
                    ]
                },
                "narracion": "En la entrevista con la Dirección Comercial, el cliente solicita clasificar a sus clientes estratégicos para campañas y descuentos especiales. En esta práctica configuras la Propiedad 1 en el maestro de interlocutores comerciales con el nombre Cliente Corporativo VIP, resolviendo el requerimiento con una función estándar y sin crear tablas adicionales."
            },
            {
                "layout": "tabla",
                "titulo": "Taxonomía de requerimientos en proyectos ERP",
                "claves": ["Requerimiento funcional", "No funcional", "Transición", "Regulatorio"],
                "icono": "list-checks",
                "tabla": {
                    "encabezados": ["Tipo de Requerimiento", "Definición", "Ejemplo en el Proyecto", "Responsable de Aprobación"],
                    "filas": [
                        ["Funcional", "Qué debe hacer el sistema operativamente", "Calcular retención en la fuente automática", "Key User del área contable"],
                        ["No Funcional", "Criterios de calidad, seguridad y velocidad", "Generar balance en menos de 3 segundos", "Líder de TI de la empresa"],
                        ["Transición", "Necesidades temporales para el Go-Live", "Migrar 3 años de saldos históricos de clientes", "Project Manager del cliente"],
                        ["Regulatorio", "Obligaciones legales y tributarias del país", "Cumplimiento de XML y RIDE según SRI", "Auditor o Contador General"]
                    ]
                },
                "narracion": "Clasificar los requerimientos en estas cuatro categorías evita confusiones. Los funcionales definen la operación diaria. Los no funcionales establecen los límites técnicos. Los de transición garantizan el arranque con datos históricos, y los regulatorios aseguran el cumplimiento ineludible de las leyes del país."
            },
            {
                "layout": "kpi",
                "titulo": "Eficacia en el levantamiento de requisitos",
                "claves": ["Cero retrabajos", "Comprensión", "Alineación"],
                "icono": "chart-line",
                "kpis": [
                    {"valor": "100%", "etiqueta": "Requisitos aprobados con criterio SMART", "icono": "circle-check"},
                    {"valor": "0", "etiqueta": "Supuestos no validados con el cliente", "icono": "shield-check"},
                    {"valor": "≥ 90%", "etiqueta": "Satisfacción de los Key Users en entrevistas", "icono": "handshake"}
                ],
                "narracion": "La excelencia de la elicitación se valida cuando el cien por ciento de los requerimientos cumple con los criterios SMART: específicos, medibles, alcanzables, relevantes y con plazos claros, eliminando por completo los supuestos no contrastados."
            },
            {
                "layout": "resumen",
                "titulo": "Resumen de la elicitación profesional",
                "claves": ["Preguntas profundas", "Causa raíz", "Clasificación rigurosa", "Solución estándar"],
                "icono": "lightbulb",
                "narracion": "Has aprendido a conducir entrevistas de descubrimiento como un consultor de alto calibre. Con los requerimientos genuinos identificados y libres de caprichos, estás preparado para documentar el Business Blueprint que veremos en la siguiente clase."
            }
        ]
    },
    {
        "id": "mod28-c2",
        "modulo": "mod-28",
        "titulo": "El Business Blueprint (BBD) y Business Requirements Document (BRD)",
        "laminas": [
            {
                "layout": "portada",
                "titulo": "El Business Blueprint (BBD) y el BRD",
                "claves": ["Business Blueprint", "BRD", "Contrato funcional", "Alcance In/Out"],
                "icono": "book-open",
                "narracion": "El Business Blueprint es el documento más importante de una implementación SAP. Es el contrato técnico y funcional que describe con detalle milimétrico cómo operará la empresa dentro del ERP. En esta clase aprenderás la estructura oficial del Blueprint, cómo delimitar el alcance In-Scope y Out-of-Scope y cómo configurar el plan contable maestro."
            },
            {
                "layout": "objetivos",
                "titulo": "Objetivos de aprendizaje",
                "claves": ["Estructurar el Blueprint", "Diferenciar BRD de BBD", "Delimitar alcance", "Crear cuenta contable en B1"],
                "icono": "target",
                "narracion": "Al finalizar esta clase sabrás redactar las secciones esenciales de un Business Blueprint oficial de SAP. Aprenderás a blindar el proyecto delimitando qué requerimientos están incluidos y cuáles quedan fuera de alcance, y practicarás en el sistema la creación de cuentas contables según las especificaciones del diseño financiero."
            },
            {
                "layout": "concepto",
                "titulo": "Diferencia entre BRD y Business Blueprint",
                "claves": ["Visión de negocio", "Arquitectura SAP", "Problema vs. Solución", "Complementariedad"],
                "icono": "scale",
                "narracion": "El BRD describe el problema y los objetivos desde la perspectiva del cliente, sin importar el software. El Business Blueprint de SAP toma esos requerimientos de negocio y los traduce a la arquitectura de SAP Business One: qué módulo se usa, qué pantalla, qué reglas de determinación contable y qué campos personalizados intervienen."
            },
            {
                "layout": "tabla",
                "titulo": "Estructura estándar de un Business Blueprint",
                "claves": ["Sociedad", "Datos maestros", "Procesos TO-BE", "Integraciones"],
                "icono": "file-text",
                "tabla": {
                    "encabezados": ["Sección del Blueprint", "Contenido Técnico", "Responsable", "Criterio de Validación"],
                    "filas": [
                        ["1. Estructura de la Empresa", "Monedas, bodegas, series de numeración", "Consultor Líder", "Configuración inicial validada"],
                        ["2. Datos Maestros", "Estructura de cuentas, socios y artículos", "Consultor Funcional", "Homologación de catálogos"],
                        ["3. Procesos de Negocio", "Flujos detallados paso a paso por ciclo", "Business Analyst", "Aprobación de Key Users"],
                        ["4. Matriz de Personalización", "Campos UDF, tablas UDT y alertas", "Consultor Técnico", "Viabilidad y arquitectura"],
                        ["5. Delimitación de Alcance", "Lista expresa In-Scope y Out-of-Scope", "Project Manager", "Firma formal del Sponsor"]
                    ]
                },
                "narracion": "El Business Blueprint se compone de cinco secciones fundamentales. Define la estructura organizativa, los estándares de datos maestros, los flujos operativos paso a paso, la matriz de campos de usuario y la delimitación estricta del alcance acordado."
            },
            {
                "layout": "pantalla",
                "titulo": "Crear subcuenta contable según Blueprint",
                "claves": ["Plan de cuentas", "Cuenta 410105", "Ventas Corporativas", "Nivel 4"],
                "icono": "landmark",
                "ventana": "Finanzas > Plan de cuentas",
                "campos": [
                    {"etiqueta": "Código de cuenta", "valor": "410105"},
                    {"etiqueta": "Nombre de cuenta", "valor": "Ventas Canal Corporativo"},
                    {"etiqueta": "Moneda", "valor": "USD"},
                    {"etiqueta": "Nivel", "valor": "4"}
                ],
                "resaltar": 0,
                "practica": {
                    "titulo": "Registrar cuenta contable aprobada en Blueprint",
                    "menu_path": "Finanzas > Plan de cuentas",
                    "instrucciones": [
                        "Ingresa al módulo Finanzas y abre Plan de cuentas",
                        "Ubica el rubro de Ingresos operacionales",
                        "Agrega la subcuenta 410105 con nombre Ventas Canal Corporativo",
                        "Verifica que la moneda sea USD en nivel 4 y actualiza el plan"
                    ],
                    "campos": [
                        {"etiqueta": "Código de cuenta", "valor": "410105", "pista": "Código numérico de ingresos"},
                        {"etiqueta": "Nombre de cuenta", "valor": "Ventas Canal Corporativo", "pista": "Descripción aprobada en el BBD"},
                        {"etiqueta": "Moneda", "valor": "USD", "pista": "Moneda de la cuenta"},
                        {"etiqueta": "Nivel", "valor": "4", "pista": "Nivel de subcuenta imputable"}
                    ]
                },
                "narracion": "En el diseño del módulo financiero del Business Blueprint se acordó separar los ingresos de ventas minoristas de los corporativos para mejorar los reportes gerenciales. En esta práctica creas la cuenta 410105 Ventas Canal Corporativo en el Plan de Cuentas, dejando listo el sistema para la determinación contable automática."
            },
            {
                "layout": "comparacion",
                "titulo": "Alcance Incluido (In-Scope) vs. Excluido (Out-of-Scope)",
                "claves": ["Límites del proyecto", "Control de expectativas", "Protección contractual"],
                "icono": "shield-check",
                "columnas": [
                    {
                        "titulo": "In-Scope (Dentro de Alcance)",
                        "icono": "circle-check",
                        "puntos": ["Flujos estándar de ventas, compras y stock", "Facturación electrónica y retenciones SRI", "Capacitación a Key Users bajo Train the Trainer"]
                    },
                    {
                        "titulo": "Out-of-Scope (Fuera de Alcance)",
                        "icono": "triangle-alert",
                        "puntos": ["Desarrollo de aplicación móvil para choferes", "Integración con sistema POS de tiendas físicas", "Carga de movimientos contables de hace 10 años"]
                    }
                ],
                "narracion": "Definir con absoluta claridad lo que queda fuera de alcance es la mejor protección de un consultor. Todo lo que no esté explícitamente en el In-Scope se considera fuera de alcance y requerirá una solicitud formal de cambio con costo y tiempo adicionales si el cliente desea incorporarlo más adelante."
            },
            {
                "layout": "kpi",
                "titulo": "Garantía de calidad del Business Blueprint",
                "claves": ["Firmas completas", "Cero ambigüedad", "Respaldo"],
                "icono": "award",
                "kpis": [
                    {"valor": "100%", "etiqueta": "Capítulos firmados por los Key Users y Sponsor", "icono": "file-check"},
                    {"valor": "0", "etiqueta": "Procesos operativos sin especificación técnica", "icono": "shield-check"},
                    {"valor": "100%", "etiqueta": "Alineación con el cronograma y presupuesto", "icono": "calendar"}
                ],
                "narracion": "El Business Blueprint es perfecto cuando cuenta con la firma formal de todos los involucrados, no deja ningún vacío en la definición de procesos y mantiene la alineación total con los compromisos contractuales del proyecto."
            },
            {
                "layout": "resumen",
                "titulo": "Resumen del Business Blueprint",
                "claves": ["Documento maestro", "Contrato funcional", "Alcance blindado", "Guía para Realize"],
                "icono": "lightbulb",
                "narracion": "El Business Blueprint es el cimiento sobre el que descansa toda la solución. Con este documento formalmente aprobado, podemos traducir cada requerimiento en historias de usuario ágiles y matrices de trazabilidad."
            }
        ]
    },
    {
        "id": "mod28-c3",
        "modulo": "mod-28",
        "titulo": "Historias de Usuario, Criterios Gherkin y Matriz RTM",
        "laminas": [
            {
                "layout": "portada",
                "titulo": "Historias de Usuario, Gherkin y Matriz RTM",
                "claves": ["Historias de usuario", "Formato Gherkin", "Matriz RTM", "Trazabilidad"],
                "icono": "file-check",
                "narracion": "En la gestión moderna de proyectos ERP, los requerimientos se gestionan con agilidad y precisión matemática. En esta clase aprenderás a redactar historias de usuario profesionales, cómo formular criterios de aceptación en formato Gherkin (Dado-Cuando-Entonces) y cómo mantener la Matriz de Trazabilidad de Requisitos para que nada se pierda."
            },
            {
                "layout": "objetivos",
                "titulo": "Objetivos de aprendizaje",
                "claves": ["Escribir historias ágiles", "Formular criterios Gherkin", "Gestionar la Matriz RTM", "Configurar alerta de stock"],
                "icono": "target",
                "narracion": "Al finalizar esta clase sabrás redactar historias de usuario bajo el estándar internacional. Aprenderás a definir criterios de aceptación claros que servirán directamente como casos de prueba para los usuarios, y practicarás en SAP Business One la configuración de una alerta automática de stock crítico."
            },
            {
                "layout": "concepto",
                "titulo": "Estructura ágil de una Historia de Usuario",
                "claves": ["Rol de negocio", "Acción concreta", "Beneficio medible", "Enfoque en valor"],
                "icono": "user",
                "narracion": "Una historia de usuario captura la intención sin tecnicismos innecesarios. Sigue el formato: Como [rol en la empresa], Quiero [ejecutar una acción en el sistema], Para [obtener un beneficio de negocio concreto]. Esto asegura que el equipo técnico nunca olvide para qué existe la funcionalidad que está configurando."
            },
            {
                "layout": "flujo",
                "titulo": "Criterios de aceptación en formato Gherkin",
                "claves": ["Dado el contexto", "Cuando ocurre acción", "Entonces resultado esperado"],
                "icono": "workflow",
                "pasos": [
                    {"texto": "DADO: Contexto inicial y datos de partida", "icono": "search"},
                    {"texto": "CUANDO: El usuario ejecuta la acción en SAP", "icono": "settings"},
                    {"texto": "ENTONCES: El sistema valida y emite resultado", "icono": "circle-check"},
                    {"texto": "Y: Se genera el registro auditable o asiento", "icono": "file-text"}
                ],
                "narracion": "El formato Gherkin elimina las dudas en las pruebas. Por ejemplo: DADO que el artículo A00001 tiene un stock mínimo de diez unidades; CUANDO Bodega despacha cinco unidades dejando el stock en ocho; ENTONCES el sistema genera automáticamente una alerta al Jefe de Compras para gestionar el reabastecimiento."
            },
            {
                "layout": "pantalla",
                "titulo": "Configurar alerta de stock crítico en SAP",
                "claves": ["Alertas automáticas", "Stock mínimo", "Notificación activa", "Control continuo"],
                "icono": "bell",
                "ventana": "Gestión > Alertas",
                "campos": [
                    {"etiqueta": "Nombre de la alerta", "valor": "Alerta Stock Crítico Laptops"},
                    {"etiqueta": "Prioridad", "valor": "Alta"},
                    {"etiqueta": "Activo", "valor": "Sí"},
                    {"etiqueta": "Frecuencia", "valor": "Cada 1 hora"}
                ],
                "resaltar": 0,
                "practica": {
                    "titulo": "Parametrizar alerta de inventario mínimo",
                    "menu_path": "Gestión > Alertas",
                    "instrucciones": [
                        "Accede a Gestión y selecciona Alertas",
                        "Crea una nueva alerta con el nombre: Alerta Stock Crítico Laptops",
                        "Establece la prioridad en Alta y marca la casilla Activo",
                        "Configura la frecuencia en Cada 1 hora y guarda la parametrización"
                    ],
                    "campos": [
                        {"etiqueta": "Nombre de la alerta", "valor": "Alerta Stock Crítico Laptops", "pista": "Nombre descriptivo de la regla"},
                        {"etiqueta": "Prioridad", "valor": "Alta", "pista": "Nivel de urgencia en la bandeja"},
                        {"etiqueta": "Activo", "valor": "Sí", "pista": "Habilita la evaluación periódica"},
                        {"etiqueta": "Frecuencia", "valor": "Cada 1 hora", "pista": "Intervalo de revisión de stock"}
                    ]
                },
                "narracion": "Para materializar el criterio de aceptación de la historia de usuario de compras, configuramos una alerta en el sistema. En esta práctica accedes a la ventana de Alertas y programas la notificación automática de stock crítico con prioridad alta y evaluación horaria, protegiendo a la empresa contra quiebres de inventario."
            },
            {
                "layout": "tabla",
                "titulo": "Estructura de la Matriz de Trazabilidad (RTM)",
                "claves": ["ID Requisito", "Proceso TO-BE", "Configuración SAP", "Caso UAT"],
                "icono": "table",
                "tabla": {
                    "encabezados": ["ID Req.", "Historia de Usuario", "Solución SAP B1", "Caso Prueba UAT", "Estado"],
                    "filas": [
                        ["REQ-01", "Alerta automática por stock mínimo", "Gestión > Alertas", "UAT-INV-04", "Validado"],
                        ["REQ-02", "Bloqueo por cupo de crédito vencido", "Parametrizaciones de documento", "UAT-O2C-02", "Validado"],
                        ["REQ-03", "Aprobación de compras > $2.000", "Modelos de autorización", "UAT-P2P-05", "Validado"],
                        ["REQ-04", "Clasificación de clientes VIP", "Propiedades de interlocutor", "UAT-CRM-01", "Validado"]
                    ]
                },
                "narracion": "La Matriz de Trazabilidad de Requisitos (RTM) vincula cada necesidad del cliente con su configuración en SAP y su respectivo caso de prueba UAT. Si un requerimiento no tiene caso de prueba asignado, la matriz lo evidencia de inmediato, garantizando cobertura total."
            },
            {
                "layout": "kpi",
                "titulo": "Métricas de trazabilidad de requisitos",
                "claves": ["Cobertura total", "Cero olvidos", "Alineación UAT"],
                "icono": "chart-line",
                "kpis": [
                    {"valor": "100%", "etiqueta": "Requerimientos trazados contra casos de prueba", "icono": "circle-check"},
                    {"valor": "0", "etiqueta": "Funcionalidades huérfanas sin requerimiento", "icono": "shield-check"},
                    {"valor": "100%", "etiqueta": "Criterios de aceptación expresados en Gherkin", "icono": "file-check"}
                ],
                "narracion": "La trazabilidad del cien por ciento asegura dos cosas: que nada de lo solicitado quede sin implementar, y que no se construya ninguna funcionalidad innecesaria que no esté respaldada por una historia de usuario aprobada."
            },
            {
                "layout": "resumen",
                "titulo": "Resumen de documentación ágil",
                "claves": ["Historias claras", "Criterios Gherkin", "Matriz RTM viva", "Calidad certificada"],
                "icono": "lightbulb",
                "narracion": "Dominar historias de usuario y matrices de trazabilidad eleva tu perfil profesional a nivel internacional. A continuación aprenderemos cómo modelar campos personalizados y valores válidos cuando el negocio exige datos especializados."
            }
        ]
    },
    {
        "id": "mod28-c4",
        "modulo": "mod-28",
        "titulo": "De Requerimiento a Configuración: Campos UDF y Valores Válidos",
        "laminas": [
            {
                "layout": "portada",
                "titulo": "De Requerimiento a Configuración: Campos UDF",
                "claves": ["Campos de usuario", "UDF", "Valores válidos", "Calidad de datos"],
                "icono": "settings",
                "narracion": "Cuando un requerimiento de negocio supera los campos estándar del ERP, el consultor utiliza los Campos Definidos por el Usuario (UDF). En esta clase aprenderás la arquitectura de extensibilidad de SAP Business One, las mejores prácticas de nomenclatura y cómo crear campos con listas de valores válidos para proteger la calidad de la información."
            },
            {
                "layout": "objetivos",
                "titulo": "Objetivos de aprendizaje",
                "claves": ["Crear campos UDF", "Definir valores válidos", "Elegir tipos de datos", "Extender maestro de clientes"],
                "icono": "target",
                "narracion": "Al finalizar esta clase comprenderás cuándo está justificado crear un UDF y cuándo es preferible usar campos nativos. Aprenderás a configurar tipos alfanuméricos, numéricos y de fecha, y practicarás en el sistema la creación de un campo de canal de ventas con valores controlados en el maestro de clientes."
            },
            {
                "layout": "concepto",
                "titulo": "Extensibilidad controlada en SAP B1",
                "claves": ["Campos UDF", "Tablas UDT", "Objetos UDO", "Sin tocar código"],
                "icono": "database",
                "narracion": "SAP Business One ofrece una arquitectura de extensibilidad líder en el mercado. Permite agregar campos personalizados en tablas maestras y documentos sin alterar el código fuente ni poner en riesgo futuras actualizaciones de versión. Toda la información añadida en UDFs queda inmediatamente disponible para consultas SQL y reportes."
            },
            {
                "layout": "comparacion",
                "titulo": "Texto libre frente a Lista de valores válidos",
                "claves": ["Texto libre", "Valores válidos", "Consistencia", "Reportes confiables"],
                "icono": "scale",
                "columnas": [
                    {
                        "titulo": "Campo de Texto Libre",
                        "icono": "triangle-alert",
                        "puntos": ["Usuarios escriben con faltas o abreviaturas", "Genera datos inconsistentes (ej. May., MAYORISTA)", "Arruina los reportes y filtros gerenciales"]
                    },
                    {
                        "titulo": "Lista de Valores Válidos",
                        "icono": "circle-check",
                        "puntos": ["Menú desplegable con opciones predefinidas", "Obliga a una captura de datos estandarizada", "Permite análisis y segmentación perfectos en BI"]
                    }
                ],
                "narracion": "Como regla de oro de consultoría, jamás utilices campos de texto libre para datos que deban agruparse en reportes. Crear una lista desplegable con valores válidos cerrados garantiza que nadie escriba variaciones arbitrarias, protegiendo la integridad de la base de datos."
            },
            {
                "layout": "pantalla",
                "titulo": "Crear campo UDF de canal de venta en clientes",
                "claves": ["UDF en clientes", "U_CanalVenta", "Valores válidos", "Personalización"],
                "icono": "settings",
                "ventana": "Herramientas > Herramientas de customizing > Campos definidos por el usuario - Gestión",
                "campos": [
                    {"etiqueta": "Tabla de destino", "valor": "Datos maestros interlocutor comercial (OCRD)"},
                    {"etiqueta": "Nombre del campo", "valor": "U_CanalVenta"},
                    {"etiqueta": "Descripción", "valor": "Canal de Distribución"},
                    {"etiqueta": "Tipo", "valor": "Alfanumérico (20)"}
                ],
                "resaltar": 1,
                "practica": {
                    "titulo": "Crear campo UDF de canal de distribución",
                    "menu_path": "Herramientas > Herramientas de customizing > Campos definidos por el usuario - Gestión",
                    "instrucciones": [
                        "Accede al menú Herramientas y Herramientas de customizing",
                        "Abre Campos definidos por el usuario - Gestión",
                        "Selecciona Datos maestros de interlocutor comercial",
                        "Agrega el campo U_CanalVenta de tipo Alfanumérico con descripción Canal de Distribución"
                    ],
                    "campos": [
                        {"etiqueta": "Tabla de destino", "valor": "Datos maestros interlocutor comercial (OCRD)", "pista": "Tabla maestra de clientes"},
                        {"etiqueta": "Nombre del campo", "valor": "U_CanalVenta", "pista": "Código técnico con prefijo U_"},
                        {"etiqueta": "Descripción", "valor": "Canal de Distribución", "pista": "Etiqueta visible para el usuario"},
                        {"etiqueta": "Tipo", "valor": "Alfanumérico (20)", "pista": "Tipo de dato y longitud"}
                    ]
                },
                "narracion": "En el Business Blueprint se especificó que la empresa necesita clasificar a sus clientes por canal comercial para calcular comisiones diferenciadas. En esta práctica accedes a la gestión de UDFs y creas el campo técnico U_CanalVenta en la tabla OCRD de interlocutores comerciales, dotando al sistema del dato exacto requerido por el negocio."
            },
            {
                "layout": "tabla",
                "titulo": "Nomenclatura y buenas prácticas en UDFs",
                "claves": ["Prefijo obligatorio", "Longitud óptima", "Descripción clara"],
                "icono": "file-text",
                "tabla": {
                    "encabezados": ["Regla de Buena Práctica", "Estándar Recomendado", "Ejemplo Correcto", "Ejemplo Incorrecto"],
                    "filas": [
                        ["Prefijo de Usuario", "Siempre iniciar con U_", "U_ZonaVenta", "ZonaVenta (rompe estándar)"],
                        ["Descripción Clara", "Nombre legible sin tecnicismos", "Zona Comercial", "CAMPO_ZON_01"],
                        ["Longitud Adecuada", "Ajustada a la necesidad real", "Alfanumérico 20", "Alfanumérico 100 (desperdicio)"],
                        ["Valores Válidos", "Códigos cortos con descripción", "MAY / Mayorista", "Texto libre manual"]
                    ]
                },
                "narracion": "Respetar la nomenclatura estándar de SAP protege el sistema. Los nombres técnicos deben llevar el prefijo U guion bajo, las etiquetas deben ser comprensibles para el usuario final y la longitud de caracteres debe ajustarse al tamaño real de los datos para no degradar el rendimiento de la base de datos."
            },
            {
                "layout": "kpi",
                "titulo": "Impacto de la estandarización de datos",
                "claves": ["Calidad de datos", "Agilidad de captura", "Reportes limpios"],
                "icono": "chart-pie",
                "kpis": [
                    {"valor": "100%", "etiqueta": "Campos clasificadores con valores válidos", "icono": "circle-check"},
                    {"valor": "0", "etiqueta": "Errores de digitación en canales de venta", "icono": "shield-check"},
                    {"valor": "100%", "etiqueta": "Disponibilidad inmediata en Query Manager", "icono": "database"}
                ],
                "narracion": "El impacto es inmediato: tener el cien por ciento de los campos de clasificación bajo listas cerradas elimina los errores de digitación y garantiza que las consultas SQL y reportes gerenciales entreguen información limpia desde el primer día."
            },
            {
                "layout": "resumen",
                "titulo": "Resumen de extensibilidad en SAP",
                "claves": ["UDFs estratégicos", "Valores cerrados", "Calidad de datos", "Módulo 28 completo"],
                "icono": "lightbulb",
                "narracion": "Has completado el Módulo 28 dominando todo el ciclo de análisis de requerimientos: desde la entrevista inicial y la redacción del Blueprint hasta la creación de campos de usuario en el ERP. Estás listo para el módulo final sobre gestión de clientes, pruebas UAT y Go-Live."
            }
        ]
    },

    # ══════════════════════════════════════════════════════════════════════════
    # MÓDULO 29: Gestión de Clientes, Pruebas UAT y Adopción del Cambio
    # ══════════════════════════════════════════════════════════════════════════
    {
        "id": "mod29-c1",
        "modulo": "mod-29",
        "titulo": "Gestión de Stakeholders y Control de Cambios (Change Requests)",
        "laminas": [
            {
                "layout": "portada",
                "titulo": "Gestión de Stakeholders y Control de Cambios",
                "claves": ["Stakeholders", "Matriz Poder/Interés", "Change Request", "Triángulo de Hierro"],
                "icono": "users",
                "narracion": "Bienvenido al módulo definitivo sobre consultoría y gestión de clientes. Los proyectos de software no fracasan por la base de datos; fracasan cuando no se gestionan las expectativas humanas y el alcance se desborda sin control. Hoy aprenderás a mapear a los interesados clave, negociar con firmeza y gestionar las solicitudes de cambio formales."
            },
            {
                "layout": "objetivos",
                "titulo": "Objetivos de aprendizaje",
                "claves": ["Mapear con Mendelow", "Evaluar Change Requests", "Aplicar Triángulo de Hierro", "Registrar actividades CRM"],
                "icono": "target",
                "narracion": "Al finalizar esta clase sabrás clasificar a los interesados según su poder e interés en el proyecto. Aprenderás a gestionar solicitudes de cambio evaluando su impacto en costo, tiempo y calidad, y practicarás en SAP Business One el registro de minutas y compromisos formales mediante el módulo de CRM."
            },
            {
                "layout": "concepto",
                "titulo": "La Matriz de Mendelow (Poder frente a Interés)",
                "claves": ["Gestionar de cerca", "Mantener satisfecho", "Mantener informado", "Monitorear"],
                "icono": "users",
                "narracion": "No todos los interesados reciben la misma atención. La matriz de Mendelow divide a los actores en cuatro cuadrantes: los de alto poder y alto interés (Sponsor y Directores) se gestionan de cerca. Los de alto poder y bajo interés se mantienen satisfechos. Los Key Users se mantienen informados y motivados, y el resto del personal se monitorea periódicamente."
            },
            {
                "layout": "flujo",
                "titulo": "Flujo de control de cambios (Change Request)",
                "claves": ["Solicitud", "Evaluación impacto", "Aprobación Comité", "Actualización BBD"],
                "icono": "workflow",
                "pasos": [
                    {"texto": "1. Cliente solicita nueva funcionalidad", "icono": "file-text"},
                    {"texto": "2. Consultor evalúa horas y costo adicional", "icono": "calculator"},
                    {"texto": "3. Presentación formal de Change Request", "icono": "clipboard-list"},
                    {"texto": "4. Comité de Proyecto aprueba o rechaza", "icono": "check-check" if False else "circle-check"},
                    {"texto": "5. Actualización de contrato y cronograma", "icono": "calendar"}
                ],
                "narracion": "Cuando el cliente pide algo fuera del Blueprint, nunca se dice un sí apresurado ni un no cortante. Se inicia el proceso formal de Change Request: el consultor calcula el impacto en horas de trabajo, costo económico y posible retraso del Go-Live. El Comité de Proyecto evalúa y decide formalmente si aprueba la ampliación."
            },
            {
                "layout": "pantalla",
                "titulo": "Registrar actividad de seguimiento en CRM",
                "claves": ["Actividad CRM", "Minuta de reunión", "Seguimiento acuerdos", "Auditoría"],
                "icono": "calendar",
                "ventana": "CRM > Actividades",
                "campos": [
                    {"etiqueta": "Tipo de actividad", "valor": "Reunión"},
                    {"etiqueta": "Asunto", "valor": "Revisión Change Request CR-04"},
                    {"etiqueta": "Interlocutor comercial", "valor": "C20000 - Maxi-Teq"},
                    {"etiqueta": "Comentarios", "valor": "Aprobado impacto en cronograma +3 días"}
                ],
                "resaltar": 1,
                "practica": {
                    "titulo": "Registrar minuta de acuerdo con cliente",
                    "menu_path": "CRM > Actividades",
                    "instrucciones": [
                        "Accede al módulo CRM y selecciona Actividades",
                        "Elige el tipo de actividad Reunión con el asunto Revisión Change Request CR-04",
                        "Vincula al cliente Maxi-Teq (C20000)",
                        "En comentarios registra Aprobado impacto en cronograma +3 días y guarda"
                    ],
                    "campos": [
                        {"etiqueta": "Tipo de actividad", "valor": "Reunión", "pista": "Clasificación de la interacción"},
                        {"etiqueta": "Asunto", "valor": "Revisión Change Request CR-04", "pista": "Tema central acordado"},
                        {"etiqueta": "Interlocutor comercial", "valor": "C20000 - Maxi-Teq", "pista": "Socio de negocios involucrado"},
                        {"etiqueta": "Comentarios", "valor": "Aprobado impacto en cronograma +3 días", "pista": "Minuta formal de resolución"}
                    ]
                },
                "narracion": "Las palabras se las lleva el viento; los acuerdos de consultoría deben quedar registrados. En esta práctica utilizas el módulo de CRM de SAP Business One para registrar una Actividad formal documentando la reunión del Change Request con Maxi-Teq, asegurando respaldo y trazabilidad institucional ante cualquier controversia."
            },
            {
                "layout": "comparacion",
                "titulo": "Cambio informal vs. Change Request formal",
                "claves": ["Descontrol", "Control riguroso", "Presupuesto", "Puntualidad"],
                "icono": "scale",
                "columnas": [
                    {
                        "titulo": "Cambios Informales (Scope Creep)",
                        "icono": "triangle-alert",
                        "puntos": ["Pedidos verbales por pasillo o correo", "Consumen horas de consultoría sin cobrar", "Destruyen la fecha prometida de Go-Live"]
                    },
                    {
                        "titulo": "Change Request Formal",
                        "icono": "circle-check",
                        "puntos": ["Documento escrito con justificación clara", "Cálculo transparente de horas y costos", "Aprobación firmada por el Sponsor directivo"]
                    }
                ],
                "narracion": "El crecimiento descontrolado del alcance, conocido como Scope Creep, es el enemigo silencioso de los proyectos. Gestionar cada modificación mediante Change Requests formales protege el presupuesto de la consultora y garantiza que el cliente tenga plena conciencia del costo y tiempo de sus decisiones."
            },
            {
                "layout": "kpi",
                "titulo": "Control del alcance del proyecto",
                "claves": ["Cero desvíos", "Aprobaciones formales", "Cumplimiento"],
                "icono": "shield-check",
                "kpis": [
                    {"valor": "100%", "etiqueta": "Cambios de alcance documentados con CR", "icono": "file-text"},
                    {"valor": "0", "etiqueta": "Modificaciones sin aprobación del Sponsor", "icono": "lock"},
                    {"valor": "≤ 5%", "etiqueta": "Desviación presupuestaria máxima permitida", "icono": "coins"}
                ],
                "narracion": "La disciplina en la gestión de interesados se refleja en indicadores rigurosos: cien por ciento de los cambios respaldados por un Change Request, cero alteraciones sin la firma del Sponsor y una desviación presupuestaria contenida por debajo del cinco por ciento."
            },
            {
                "layout": "resumen",
                "titulo": "Resumen de gestión de stakeholders",
                "claves": ["Mapeo estratégico", "Firmeza profesional", "Registro en CRM", "Alcance blindado"],
                "icono": "lightbulb",
                "narracion": "Manejar a los interesados y controlar los cambios de alcance es el sello del consultor maduro. A continuación aprenderemos cómo gestionar el cambio organizacional y capacitar a los usuarios con la metodología Train the Trainer."
            }
        ]
    },
    {
        "id": "mod29-c2",
        "modulo": "mod-29",
        "titulo": "Gestión del Cambio Organizacional y Estrategia Train the Trainer",
        "laminas": [
            {
                "layout": "portada",
                "titulo": "Gestión del Cambio y Train the Trainer",
                "claves": ["Gestión del cambio", "Train the Trainer", "Adopción", "Champions"],
                "icono": "users",
                "narracion": "Implementar un ERP cambia la rutina diaria de cientos de personas, lo que genera miedo y resistencia natural. En esta clase aprenderás la psicología de la adopción del cambio, cómo acompañar a los usuarios a través de la curva de Kübler-Ross y cómo implementar la exitosa estrategia Train the Trainer para empoderar a los líderes internos de la empresa."
            },
            {
                "layout": "objetivos",
                "titulo": "Objetivos de aprendizaje",
                "claves": ["Comprender la curva del cambio", "Modelo Train the Trainer", "Identificar Champions", "Configurar permisos de práctica"],
                "icono": "target",
                "narracion": "Al finalizar esta clase sabrás diagnosticar y desactivar la resistencia de los usuarios ante el nuevo sistema. Aprenderás a formar a los Key Users para que capaciten a sus propios equipos con entusiasmo, y practicarás en SAP Business One la configuración de autorizaciones seguras para sesiones de entrenamiento."
            },
            {
                "layout": "concepto",
                "titulo": "La psicología de la resistencia al ERP",
                "claves": ["Miedo a lo desconocido", "Pérdida de control", "Mayor transparencia", "Acompañamiento"],
                "icono": "refresh-cw",
                "narracion": "Los empleados no rechazan a SAP Business One por sus pantallas, sino por la incertidumbre que genera. Un sistema integrado aporta transparencia total: ya no se pueden ocultar errores en cuadernos y los controles son automáticos. El consultor debe actuar con empatía, mostrando cómo el sistema elimina tareas repetitivas y jerarquiza su trabajo."
            },
            {
                "layout": "flujo",
                "titulo": "Fases de la curva del cambio organizacional",
                "claves": ["Negación", "Resistencia", "Exploración", "Compromiso"],
                "icono": "workflow",
                "pasos": [
                    {"texto": "1. Negación: 'El sistema viejo funcionaba bien'", "icono": "help-circle" if False else "search"},
                    {"texto": "2. Resistencia: 'SAP me pide demasiados datos'", "icono": "triangle-alert"},
                    {"texto": "3. Exploración: 'Los reportes automáticos me ahorran horas'", "icono": "lightbulb"},
                    {"texto": "4. Compromiso: 'Ya no podría trabajar sin SAP'", "icono": "award"}
                ],
                "narracion": "Todo usuario atraviesa cuatro etapas psicológicas. Pasa de la negación inicial a la resistencia activa; luego, al practicar y ver el valor de los informes automáticos, entra en la fase de exploración y aprendizaje, culminando en el compromiso total donde reconoce que no volvería al sistema anterior."
            },
            {
                "layout": "comparacion",
                "titulo": "Capacitación masiva tradicional vs. Train the Trainer",
                "claves": ["Modelo tradicional", "Train the Trainer", "Sostenibilidad", "Costo"],
                "icono": "scale",
                "columnas": [
                    {
                        "titulo": "Capacitación Masiva Externa",
                        "icono": "users",
                        "puntos": ["Consultores intentan enseñar a 200 personas", "Usuarios se sienten juzgados por extraños", "Al irse los consultores se pierde el conocimiento"]
                    },
                    {
                        "titulo": "Estrategia Train the Trainer",
                        "icono": "circle-check",
                        "puntos": ["Consultores forman intensamente a 8 Key Users", "Los Key Users capacitan a sus propios pares", "Crea soporte interno permanente y sentido de orgullo"]
                    }
                ],
                "narracion": "El modelo Train the Trainer es incomparablemente superior. En lugar de que consultores externos dicten cursos masivos que se olvidan rápido, capacitamos a los Key Users hasta convertirlos en expertos. Ellos enseñan a sus propios compañeros con su vocabulario cotidiano, creando una red de soporte interno que perdura en el tiempo."
            },
            {
                "layout": "pantalla",
                "titulo": "Autorizaciones de sólo lectura para entrenamiento",
                "claves": ["Autorizaciones", "Ambiente de pruebas", "Entrenamiento", "Seguridad"],
                "icono": "lock",
                "ventana": "Gestión > Inicialización del sistema > Autorizaciones > Autorizaciones generales",
                "campos": [
                    {"etiqueta": "Usuario", "valor": "ASILVA - Ana Silva"},
                    {"etiqueta": "Módulo", "valor": "Ventas - Clientes"},
                    {"etiqueta": "Oferta de ventas", "valor": "Autorización total"},
                    {"etiqueta": "Factura de clientes", "valor": "Sólo lectura"}
                ],
                "resaltar": 3,
                "practica": {
                    "titulo": "Configurar permisos de entrenamiento para usuario",
                    "menu_path": "Gestión > Inicialización del sistema > Autorizaciones > Autorizaciones generales",
                    "instrucciones": [
                        "Accede a Gestión e Inicialización del sistema",
                        "Abre Autorizaciones y Autorizaciones generales",
                        "Selecciona a la usuaria Ana Silva (ASILVA)",
                        "En el módulo Ventas asigna Sólo lectura para Factura de clientes y guarda"
                    ],
                    "campos": [
                        {"etiqueta": "Usuario", "valor": "ASILVA - Ana Silva", "pista": "Usuario en etapa de capacitación"},
                        {"etiqueta": "Módulo", "valor": "Ventas - Clientes", "pista": "Área funcional correspondiente"},
                        {"etiqueta": "Oferta de ventas", "valor": "Autorización total", "pista": "Permiso para practicar creación"},
                        {"etiqueta": "Factura de clientes", "valor": "Sólo lectura", "pista": "Protección para evitar emisión contable"}
                    ]
                },
                "narracion": "Durante las semanas de capacitación previa al arranque, los usuarios deben practicar sin riesgo de alterar la contabilidad. En esta práctica configuras las Autorizaciones generales de Ana Silva otorgando permiso de creación en ofertas pero restringiendo las facturas a sólo lectura, garantizando un entorno de aprendizaje seguro."
            },
            {
                "layout": "kpi",
                "titulo": "Indicadores de adopción del cambio",
                "claves": ["Asistencia", "Aprobación", "Autonomía"],
                "icono": "chart-line",
                "kpis": [
                    {"valor": "100%", "etiqueta": "Key Users certificados como instructores internos", "icono": "award"},
                    {"valor": "≥ 95%", "etiqueta": "Asistencia a los talleres de capacitación", "icono": "users"},
                    {"valor": "≥ 90%", "etiqueta": "Aprobación en la evaluación de competencias", "icono": "circle-check"}
                ],
                "narracion": "El éxito de la gestión del cambio se mide con hechos: lograr que el cien por ciento de los Key Users esté certificado para capacitar, mantener una asistencia superior al noventa y cinco por ciento y certificar que más del noventa por ciento del personal apruebe la evaluación operativa antes de tocar producción."
            },
            {
                "layout": "resumen",
                "titulo": "Resumen de gestión del cambio",
                "claves": ["Empatía activa", "Train the Trainer", "Líderes internos", "Adopción garantizada"],
                "icono": "lightbulb",
                "narracion": "Empoderar a los usuarios clave transforma la resistencia en entusiasmo y orgullo de pertenencia. En la próxima clase aprenderemos cómo estos usuarios validan formalmente el sistema mediante las Pruebas de Aceptación UAT."
            }
        ]
    },
    {
        "id": "mod29-c3",
        "modulo": "mod-29",
        "titulo": "Estrategia y Elaboración de Guiones de Prueba UAT (Test Scripts)",
        "laminas": [
            {
                "layout": "portada",
                "titulo": "Guiones de Prueba UAT (Test Scripts)",
                "claves": ["Pruebas UAT", "Test Scripts", "Casos de prueba", "Certificación"],
                "icono": "clipboard-check",
                "narracion": "Las Pruebas de Aceptación de Usuario (UAT) son el examen final del sistema antes de autorizar el arranque. En esta clase aprenderás la estrategia para diseñar Guiones de Prueba (Test Scripts) profesionales, cómo registrar defectos metódicamente y cómo guiar a los Key Users para certificar que el ERP cumple con el Business Blueprint."
            },
            {
                "layout": "objetivos",
                "titulo": "Objetivos de aprendizaje",
                "claves": ["Diseñar Test Scripts", "Ciclo de vida de defectos", "Diferenciar pruebas", "Ejecutar caso de prueba"],
                "icono": "target",
                "narracion": "Al finalizar esta clase sabrás estructurar guiones de prueba con datos maestros reales, condiciones de entrada y resultados esperados. Aprenderás a clasificar los defectos por severidad para gestionar su resolución rápida, y practicarás en el sistema la ejecución paso a paso de un caso de prueba comercial."
            },
            {
                "layout": "concepto",
                "titulo": "El propósito de las Pruebas UAT",
                "claves": ["Validación de usuario", "Datos reales", "Escenarios cotidianos", "Aprobación formal"],
                "icono": "shield-check",
                "narracion": "Las pruebas UAT no son para que el consultor demuestre cómo funciona el software; son para que los propios usuarios de la empresa ejecuten sus tareas cotidianas en el sistema sin ayuda externa. Solo cuando el usuario clave firma que pudo operar sus casos reales con éxito, el sistema se considera técnicamente aceptado."
            },
            {
                "layout": "flujo",
                "titulo": "Ciclo de vida de un defecto en UAT",
                "claves": ["Reporte", "Triage", "Corrección", "Re-test", "Cierre"],
                "icono": "workflow",
                "pasos": [
                    {"texto": "1. Usuario ejecuta script y detecta falla", "icono": "search"},
                    {"texto": "2. Registro con captura de pantalla y severidad", "icono": "file-text"},
                    {"texto": "3. Consultor ajusta configuración en Golden DB", "icono": "settings"},
                    {"texto": "4. Usuario repite la prueba (Re-test)", "icono": "refresh-cw"},
                    {"texto": "5. Firma de conformidad y cierre del defecto", "icono": "circle-check"}
                ],
                "narracion": "Cuando una prueba falla se sigue un ciclo riguroso. El usuario documenta el error con captura de pantalla. El equipo de consultoría clasifica la severidad y corrige la causa raíz en la base modelo. Luego el mismo usuario repite la prueba en el ambiente de UAT y, si el resultado coincide con lo esperado, firma el cierre formal del caso."
            },
            {
                "layout": "pantalla",
                "titulo": "Ejecutar caso de prueba UAT-O2C-01 en pedido",
                "claves": ["Caso UAT-O2C-01", "Maxi-Teq", "2 Laptops Dell", "Resultado esperado"],
                "icono": "shopping-cart",
                "ventana": "Ventas - Clientes > Pedido de cliente",
                "campos": [
                    {"etiqueta": "Cliente", "valor": "C20000 - Maxi-Teq"},
                    {"etiqueta": "Artículo", "valor": "A00001 - Laptop Dell Latitude 3420"},
                    {"etiqueta": "Cantidad", "valor": "2"},
                    {"etiqueta": "Precio unitario", "valor": "850.00"}
                ],
                "resaltar": 0,
                "practica": {
                    "titulo": "Ejecutar guion UAT de captura de pedido",
                    "menu_path": "Ventas - Clientes > Pedido de cliente",
                    "instrucciones": [
                        "Accede a Ventas - Clientes y selecciona Pedido de cliente",
                        "Elige al cliente C20000 (Maxi-Teq) según el guion UAT-O2C-01",
                        "Ingresa 2 unidades del artículo A00001 a 850.00 dólares",
                        "Comprueba que el subtotal sea 1.700,00 dólares, el IVA 15% sea 255,00 y guarda el pedido"
                    ],
                    "campos": [
                        {"etiqueta": "Cliente", "valor": "C20000 - Maxi-Teq", "pista": "Socio de prueba del script"},
                        {"etiqueta": "Artículo", "valor": "A00001 - Laptop Dell Latitude 3420", "pista": "Artículo a validar"},
                        {"etiqueta": "Cantidad", "valor": "2", "pista": "Cantidad especificada en el guion"},
                        {"etiqueta": "Precio unitario", "valor": "850.00", "pista": "Precio de catálogo"}
                    ]
                },
                "narracion": "El guion UAT-O2C-01 pide validar que un pedido comercial calcule automáticamente el subtotal de mil setecientos dólares y el IVA del quince por ciento por doscientos cincuenta y cinco dólares para Maxi-Teq. En esta práctica ejecutas el caso en la ventana de Pedido de cliente, verificando que los valores coincidan exactamente con la especificación."
            },
            {
                "layout": "tabla",
                "titulo": "Clasificación de severidad de defectos",
                "claves": ["Bloqueante", "Mayor", "Menor", "Cosmético"],
                "icono": "triangle-alert",
                "tabla": {
                    "encabezados": ["Nivel de Severidad", "Impacto en el Negocio", "Ejemplo en SAP B1", "Criterio para Go-Live"],
                    "filas": [
                        ["Crítico / Bloqueante", "Impide operar un proceso esencial", "La factura no genera asiento contable", "Cero permitidos para salir en vivo"],
                        ["Mayor", "Falla con solución alternativa temporal", "Un reporte secundario sale desordenado", "Máximo 2 acordados con solución"],
                        ["Menor", "Inconveniente leve sin pérdida de datos", "Un campo UDF no tiene el orden visual deseado", "Se corrigen en Hypercare"],
                        ["Cosmético", "Detalle estético en formato o texto", "Texto de una etiqueta con error tipográfico", "Se corrigen en mantenimiento"]
                    ]
                },
                "narracion": "La severidad de los defectos determina la decisión de salida en vivo. Los defectos críticos impiden el Go-Live hasta ser completamente subsanados. Los mayores pueden tolerarse si existe una alternativa operativa viable, mientras que los menores y cosméticos se programan para el período de Hypercare."
            },
            {
                "layout": "kpi",
                "titulo": "Control de calidad en la fase UAT",
                "claves": ["Tasa de éxito", "Cero bloqueantes", "Cobertura"],
                "icono": "chart-line",
                "kpis": [
                    {"valor": "100%", "etiqueta": "Casos de prueba UAT ejecutados por Key Users", "icono": "clipboard-check"},
                    {"valor": "0", "etiqueta": "Defectos bloqueantes abiertos al cierre", "icono": "shield-check"},
                    {"valor": "≥ 98%", "etiqueta": "Tasa de aprobación en primera o segunda vuelta", "icono": "circle-check"}
                ],
                "narracion": "La meta innegociable de la fase UAT es alcanzar el cien por ciento de los guiones ejecutados por los propios usuarios de la empresa, cerrando con cero defectos bloqueantes abiertos para llegar al comité de decisión final con total tranquilidad."
            },
            {
                "layout": "resumen",
                "titulo": "Resumen de las pruebas UAT",
                "claves": ["Pruebas con usuarios", "Guiones estructurados", "Defectos controlados", "Confianza total"],
                "icono": "lightbulb",
                "narracion": "Las pruebas UAT transforman las dudas en certeza técnica y operativa. En la clase final de la academia realizaremos la validación contable de un ciclo completo y firmaremos el Acta de Go-Live."
            }
        ]
    },
    {
        "id": "mod29-c4",
        "modulo": "mod-29",
        "titulo": "Ejecución de Ciclo UAT, Validación Contable y Acta de Go-Live",
        "laminas": [
            {
                "layout": "portada",
                "titulo": "Ciclo UAT, Validación Contable y Acta de Go-Live",
                "claves": ["Ciclo integrado", "Cuadre contable", "Acta de Go-Live", "Graduación"],
                "icono": "award",
                "narracion": "Has llegado a la clase cumbre de tu formación como Consultor y Business Analyst en SAP Business One. Hoy ejecutarás la validación integral de un ciclo completo de negocio de punta a punta, verificarás el balance de comprobación contable para certificar la partida doble y conocerás el protocolo formal del Acta de Go-Live que autoriza el pase a producción."
            },
            {
                "layout": "objetivos",
                "titulo": "Objetivos de aprendizaje",
                "claves": ["Validar flujo punta a punta", "Verificar balance en SAP", "Comprobar asientos", "Firmar Acta Go-Live"],
                "icono": "target",
                "narracion": "Al finalizar esta clase magistral sabrás auditar la coherencia contable y logística de un ciclo operativo completo. Aprenderás a interpretar el Balance de comprobación para certificar que todas las cuentas puente y de inventario cuadran con exactitud, y dominarás el protocolo de firma del Acta de Go-Live con el Comité de Proyecto."
            },
            {
                "layout": "concepto",
                "titulo": "La prueba de integración de ciclo completo",
                "claves": ["Order-to-Cash", "Procure-to-Pay", "Contabilidad viva", "Cero inconsistencias"],
                "icono": "layers",
                "narracion": "Probar pantallas aisladas no basta; la verdadera prueba de fuego es el flujo interconectado: comprar la mercadería, recibirla en muelle con GRPO, venderla al cliente, despacharla desde bodega, facturar electrónicamente, cobrar en banco y validar que el costo de ventas, el IVA y las retenciones hayan contabilizado exactamente en el libro mayor."
            },
            {
                "layout": "pantalla",
                "titulo": "Verificar balance de sumas y saldos en SAP",
                "claves": ["Balance comprobación", "Sumas y saldos", "Partida doble", "Certificación"],
                "icono": "landmark",
                "ventana": "Finanzas > Informes financieros > Financiero > Balance",
                "campos": [
                    {"etiqueta": "Moneda", "valor": "Moneda local (USD)"},
                    {"etiqueta": "Nivel de detalle", "valor": "4"},
                    {"etiqueta": "Ejercicio fiscal", "valor": "2026"},
                    {"etiqueta": "Diferencia Debe - Haber", "valor": "0.00"}
                ],
                "resaltar": 3,
                "practica": {
                    "titulo": "Generar balance de comprobación y validar cuadre",
                    "menu_path": "Finanzas > Informes financieros > Financiero > Balance",
                    "instrucciones": [
                        "Ingresa a Finanzas e Informes financieros",
                        "Abre el informe Balance",
                        "Selecciona la opción de Moneda local en Nivel 4",
                        "Comprueba que la diferencia entre Débito y Crédito sea exactamente cero dólares y genera el reporte"
                    ],
                    "campos": [
                        {"etiqueta": "Moneda", "valor": "Moneda local (USD)", "pista": "Moneda de reporte funcional"},
                        {"etiqueta": "Nivel de detalle", "valor": "4", "pista": "Nivel analítico de subcuentas"},
                        {"etiqueta": "Ejercicio fiscal", "valor": "2026", "pista": "Año de operación"},
                        {"etiqueta": "Diferencia Debe - Haber", "valor": "0.00", "pista": "Cuadre contable exacto"}
                    ]
                },
                "narracion": "Antes de emitir el visto bueno para la salida en vivo, el consultor y el contador general generan el Balance de comprobación. En esta práctica accedes a Informes financieros en SAP Business One y ejecutas el Balance a nivel cuatro, verificando que la suma de todos los débitos sea idéntica a la suma de los créditos con una diferencia de cero dólares."
            },
            {
                "layout": "asiento",
                "titulo": "Asiento automático de venta con costo integrado",
                "claves": ["Factura clientes", "Cuentas por cobrar", "Ingreso", "Costo de ventas", "Inventario"],
                "icono": "calculator",
                "lineas": [
                    {"cuenta": "101020 - Clientes por cobrar (C20000)", "debe": "1.955,00", "haber": "0,00"},
                    {"cuenta": "410101 - Ventas de mercaderías", "debe": "0,00", "haber": "1.700,00"},
                    {"cuenta": "201040 - IVA débito fiscal (15%)", "debe": "0,00", "haber": "255,00"}
                ],
                "narracion": "El ciclo operativo culmina con la contabilización automática de la venta por dos laptops. La factura debita Clientes por cobrar por mil novecientos cincuenta y cinco dólares, acredita la cuenta de Ingresos por mil setecientos y registra el IVA del quince por ciento por doscientos cincuenta y cinco dólares al haber, manteniendo la partida doble intacta."
            },
            {
                "layout": "tabla",
                "titulo": "Lista de chequeo del Acta de Go-Live",
                "claves": ["Chequeo final", "Comité decisor", "Aprobación formal", "Pase a producción"],
                "icono": "file-check",
                "tabla": {
                    "encabezados": ["Elemento Auditado", "Condición Requerida", "Estado de Verificación", "Firma Responsable"],
                    "filas": [
                        ["Pruebas UAT", "100% casos aprobados, cero bloqueantes", "Conforme", "Key Users de cada área"],
                        ["Capacitación", "Usuarios evaluados bajo Train the Trainer", "Conforme", "Jefe de Recursos Humanos"],
                        ["Datos Maestros", "DTW ejecutado y saldos iniciales cuadrados", "Conforme", "Contador General"],
                        ["Infraestructura", "Servidor HANA o Cloud listo con respaldos", "Conforme", "Líder de TI / Infraestructura"],
                        ["Cutover Runbook", "Cronograma de transición acordado", "Conforme", "Project Manager de Consultoría"]
                    ]
                },
                "narracion": "El Acta de Go-Live es el documento supremo del proyecto. Revisa uno a uno los cinco pilares obligatorios: pruebas UAT aprobadas, personal capacitado, datos maestros cuadrados al centavo, infraestructura tecnológica lista y plan de corte coordinado. Cuando todos firman conforme, el proyecto recibe la luz verde para iniciar operaciones en vivo."
            },
            {
                "layout": "kpi",
                "titulo": "Certificación de excelencia profesional",
                "claves": ["Job-Ready", "Excelencia técnica", "Consultor integral"],
                "icono": "award",
                "kpis": [
                    {"valor": "100%", "etiqueta": "Ciclo metodológico completado con rigor internacional", "icono": "award"},
                    {"valor": "0", "etiqueta": "Dudas operativas en el manejo de SAP B1", "icono": "shield-check"},
                    {"valor": "Job-Ready", "etiqueta": "Calificación profesional para liderar proyectos reales", "icono": "graduation-cap"}
                ],
                "narracion": "Completar este track formativo te sitúa en la élite de la consultoría internacional: dominas la metodología de implementación, el modelado formal BPMN dos punto cero, el levantamiento de requerimientos con Business Blueprint, la gestión del cambio y la puesta en marcha en el sistema real."
            },
            {
                "layout": "resumen",
                "titulo": "Diploma de Consultor & Business Analyst",
                "claves": ["Metodología oficial", "BPMN 2.0", "Blueprint", "Consultor de élite mundial"],
                "icono": "lightbulb",
                "narracion": "Felicitaciones. Has culminado los módulos de Consultoría y Business Analysis de B1 Academy, integrando la metodología global con la práctica transaccional en SAP Business One. Estás preparado para defender tu conocimiento ante Master B1 y obtener tu certificación oficial con hash criptográfico."
            }
        ]
    }
]

def main():
    print(f"Generando clases mod-28 y mod-29 en {DESTINO}...")
    for c in CLASES:
        p = DESTINO / c["id"] / "clase.json"
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(json.dumps(c, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"✔ Clase generada: {c['id']} ({len(c['laminas'])} láminas)")

if __name__ == "__main__":
    main()
