#!/usr/bin/env python3
"""
Genera las 16 clases de consultoría y business analyst (mod-26 a mod-29) en scratch/aula_es/<id>/clase.json.
Diseñado con rigor metodológico oficial de SAP Activate, AIP, BPMN 2.0, BRD/BBD y UAT.
"""
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parents[2]
DESTINO = ROOT / "scratch" / "aula_es"

CLASES = [
    # ══════════════════════════════════════════════════════════════════════════
    # MÓDULO 26: Metodología de Implementación y Ciclo de Vida SAP
    # ══════════════════════════════════════════════════════════════════════════
    {
        "id": "mod26-c1",
        "modulo": "mod-26",
        "titulo": "El Marco Metodológico: De Waterfall a SAP Activate y AIP",
        "laminas": [
            {
                "layout": "portada",
                "titulo": "De Waterfall a SAP Activate y AIP",
                "claves": ["Metodología ágil", "SAP Activate", "AIP", "Gobernanza"],
                "icono": "graduation-cap",
                "narracion": "Bienvenido a la clase magistral sobre metodologías de implementación en SAP. Hoy aprenderás cómo la consultoría moderna superó los viejos modelos en cascada para adoptar SAP Activate y AIP en el mercado empresarial. Conocerás las seis fases del ciclo de vida, la conformación del equipo de proyecto y las reglas de gobernanza que garantizan implementaciones a tiempo, en presupuesto y con máxima satisfacción del cliente."
            },
            {
                "layout": "objetivos",
                "titulo": "Objetivos de aprendizaje",
                "claves": ["Comprender SAP Activate", "Dominar las 6 fases", "Definir gobernanza", "Configurar sociedad modelo"],
                "icono": "target",
                "narracion": "Al finalizar esta clase comprenderás los principios de SAP Activate y el programa acelerado AIP. Podrás identificar las actividades y entregables críticos de cada una de las seis fases del proyecto. Sabrás estructurar la gobernanza con roles como Sponsor, Project Manager y Key Users, y practicarás en el sistema la inicialización de los parámetros maestros de la sociedad."
            },
            {
                "layout": "concepto",
                "titulo": "Superando el modelo Waterfall tradicional",
                "claves": ["Enfoque iterativo", "Menor riesgo", "Entregas tempranas", "Alineación continua"],
                "icono": "refresh-cw",
                "narracion": "El modelo tradicional en cascada generaba entregas tardías y gran fricción, porque el cliente veía el sistema funcionando meses después del diseño inicial. En cambio, SAP Activate propone un modelo ágil e híbrido basado en mejores prácticas preconfiguradas. El cliente interactúa con prototipos desde las primeras semanas, validando requerimientos en tiempo real y eliminando sorpresas desagradables al final del proyecto."
            },
            {
                "layout": "flujo",
                "titulo": "Las seis fases de SAP Activate",
                "claves": ["Descubrimiento", "Preparación", "Exploración", "Realización", "Despliegue", "Operación"],
                "icono": "workflow",
                "pasos": [
                    {"texto": "Discover: alcance y valor", "icono": "search"},
                    {"texto": "Prepare: plan y gobernanza", "icono": "clipboard-list"},
                    {"texto": "Explore: talleres Fit-Gap", "icono": "handshake"},
                    {"texto": "Realize: configuración y DTW", "icono": "settings"},
                    {"texto": "Deploy: UAT y Go-Live", "icono": "rocket" if False else "award"},
                    {"texto": "Run: Hypercare y soporte", "icono": "headset" if False else "shield-check"}
                ],
                "narracion": "SAP Activate estructura el ciclo de vida en seis fases continuas. Discover define la visión de negocio y retorno de inversión. Prepare establece el acta de constitución y el equipo. Explore ejecuta los talleres Fit-Gap sobre el estándar. Realize parametriza la Golden Database y migra datos. Deploy realiza las pruebas UAT, la transición y el Go-Live. Finalmente, Run asegura la estabilización durante el período de Hypercare."
            },
            {
                "layout": "comparacion",
                "titulo": "Waterfall frente a SAP Activate",
                "claves": ["Metodología", "Flexibilidad", "Riesgo", "Tiempo"],
                "icono": "scale",
                "columnas": [
                    {
                        "titulo": "Waterfall Tradicional",
                        "icono": "clock",
                        "puntos": ["Diseño teórico extenso sin ver el sistema", "Feedback del usuario solo al final del ciclo", "Alto riesgo de sobrecostos y retrasos"]
                    },
                    {
                        "titulo": "SAP Activate / AIP",
                        "icono": "circle-check",
                        "puntos": ["Prototipo estándar funcionando desde el inicio", "Validación iterativa mediante talleres Fit-Gap", "Entregables modulares y menor tiempo a producción"]
                    }
                ],
                "narracion": "Comparar Waterfall con SAP Activate evidencia por qué los proyectos modernos tienen mayor tasa de éxito. Mientras Waterfall gastaba meses en documentos estáticos sin tocar software, SAP Activate parte de una base preconfigurada con las mejores prácticas de la industria. El cliente evalúa los flujos en vivo, lo que acelera el aprendizaje y reduce drásticamente las desviaciones de alcance."
            },
            {
                "layout": "pantalla",
                "titulo": "Configurar parámetros de la sociedad",
                "claves": ["Razón social", "RUC fiscal", "Moneda USD", "Sociedad Golden"],
                "icono": "settings",
                "ventana": "Gestión > Inicialización del sistema > Detalles de la empresa",
                "campos": [
                    {"etiqueta": "Razón social", "valor": "B1 Center"},
                    {"etiqueta": "RUC", "valor": "1792456789001"},
                    {"etiqueta": "Moneda local", "valor": "USD"},
                    {"etiqueta": "Dirección fiscal", "valor": "Av. República de El Salvador N34-12, Quito"}
                ],
                "resaltar": 0,
                "practica": {
                    "titulo": "Verificar parámetros maestros de la sociedad",
                    "menu_path": "Gestión > Inicialización del sistema > Detalles de la empresa",
                    "instrucciones": [
                        "Ingresa al menú Gestión e Inicialización del sistema",
                        "Abre la ventana Detalles de la empresa",
                        "Verifica que la razón social sea B1 Center y el RUC 1792456789001",
                        "Comprueba que la moneda local sea USD y guarda los cambios"
                    ],
                    "campos": [
                        {"etiqueta": "Razón social", "valor": "B1 Center", "pista": "Nombre legal de la sociedad de prueba"},
                        {"etiqueta": "RUC", "valor": "1792456789001", "pista": "Identificador tributario de 13 dígitos"},
                        {"etiqueta": "Moneda local", "valor": "USD", "pista": "Moneda funcional de operación"},
                        {"etiqueta": "Dirección fiscal", "valor": "Av. República de El Salvador N34-12, Quito", "pista": "Domicilio legal"}
                    ]
                },
                "narracion": "En la fase de preparación, el consultor inicializa la base de datos modelo configurando la ventana Detalles de la empresa. En esta práctica verificarás los datos de tu sociedad B1 Center: razón social, RUC tributario, moneda funcional USD y domicilio fiscal. Estos parámetros son la piedra angular que alimentará todos los documentos legales, facturas y comprobantes emitidos en el sistema."
            },
            {
                "layout": "tabla",
                "titulo": "Matriz de gobernanza y roles RACI",
                "claves": ["Sponsor", "Project Manager", "Consultor", "Key User"],
                "icono": "users",
                "tabla": {
                    "encabezados": ["Rol de Proyecto", "Responsabilidad Principal", "Fase Clave", "Entregable"],
                    "filas": [
                        ["Sponsor Ejecutivo", "Aprobación de alcance y presupuesto", "Prepare y Deploy", "Project Charter firmado"],
                        ["Project Manager", "Gestión de cronograma, riesgos e hitos", "Todas las fases", "Plan de proyecto y actas"],
                        ["Business Analyst", "Diseño de procesos y análisis Fit-Gap", "Explore y Realize", "Business Blueprint (BBD)"],
                        ["Key User", "Validación operativa y pruebas UAT", "Explore y Deploy", "Aprobación de casos UAT"]
                    ]
                },
                "narracion": "Una gobernanza sólida asigna responsabilidades claras mediante la matriz RACI. El Sponsor asegura el respaldo financiero y estratégico. El Project Manager vela por los tiempos y recursos. El Business Analyst traduce necesidades en soluciones SAP estándar, y los Key Users aportan el conocimiento del día a día y validan las pruebas de aceptación."
            },
            {
                "layout": "kpi",
                "titulo": "Indicadores de éxito en la preparación",
                "claves": ["Alineación", "Riesgos mitigados", "Puntualidad"],
                "icono": "chart-line",
                "kpis": [
                    {"valor": "100%", "etiqueta": "Roles asignados con respaldo directivo", "icono": "users"},
                    {"valor": "0", "etiqueta": "Ambigüedades en alcance contractual", "icono": "file-check"},
                    {"valor": "100%", "etiqueta": "Ambiente Sandbox listo para Explore", "icono": "database"}
                ],
                "narracion": "Tres indicadores determinan si la fase de preparación concluyó exitosamente: tener el cien por ciento de los roles definidos con dedicación horaria real, cero ambigüedades en el alcance del proyecto acordado con el cliente, y el ambiente de pruebas listo y operativo para comenzar los talleres de exploración."
            },
            {
                "layout": "concepto",
                "titulo": "Factores de riesgo en el arranque",
                "claves": ["Dedicación de usuarios", "Expectativas irreales", "Alcance indefinido"],
                "icono": "shield-check",
                "narracion": "El mayor riesgo en la fase de preparación es la falta de tiempo de los usuarios clave debido a su carga operativa diaria. La consultora debe acordar formalmente con la gerencia un porcentaje de dedicación de los Key Users. Si los dueños del proceso no participan activamente en el diseño, el sistema resultante no reflejará la realidad del negocio y generará rechazo."
            },
            {
                "layout": "resumen",
                "titulo": "Resumen de la metodología",
                "claves": ["Agilidad SAP", "Alineación temprana", "Roles claros", "Base preconfigurada"],
                "icono": "lightbulb",
                "narracion": "Hemos revisado los fundamentos metodológicos de SAP Activate y AIP. Recuerda que la clave del consultor de clase mundial no es imponer tecnología, sino guiar al cliente por un ciclo estructurado de seis fases, mitigando riesgos desde el primer día y asegurando que cada decisión técnica responda a un objetivo de negocio concreto."
            }
        ]
    },
    {
        "id": "mod26-c2",
        "modulo": "mod-26",
        "titulo": "Talleres de Exploración (Explore) y Análisis Fit / Gap",
        "laminas": [
            {
                "layout": "portada",
                "titulo": "Talleres de Exploración y Análisis Fit/Gap",
                "claves": ["Fase Explore", "Fit-Gap", "Mejores prácticas", "Blueprint"],
                "icono": "handshake",
                "narracion": "La fase de exploración es el corazón de la consultoría funcional en SAP. En esta clase aprenderás cómo liderar talleres Fit-Gap profesionales, cómo categorizar los requerimientos del cliente frente al estándar de SAP Business One y cómo documentar la Matriz Fit-Gap que servirá de contrato funcional para la construcción del sistema."
            },
            {
                "layout": "objetivos",
                "titulo": "Objetivos de la clase",
                "claves": ["Liderar talleres Explore", "Clasificar brechas Fit-Gap", "Evitar sobre-personalización", "Configurar controles nativos"],
                "icono": "target",
                "narracion": "Al finalizar esta clase sabrás conducir talleres de exploración por cada ciclo operativo. Aprenderás a clasificar requerimientos en cuatro categorías: estándar, configuración, add-on o desarrollo. Sabrás defender las mejores prácticas para evitar sobre-personalizaciones costosas y parametrizarás reglas de crédito nativas en SAP Business One."
            },
            {
                "layout": "concepto",
                "titulo": "Dinámica de un taller Fit / Gap",
                "claves": ["Demostración estándar", "Contraste con cliente", "Identificación de brechas", "Acuerdo funcional"],
                "icono": "users",
                "narracion": "En el taller Fit-Gap no se pregunta al cliente qué quiere que haga el sistema desde una hoja en blanco. El consultor demuestra el proceso estándar funcionando en SAP Business One con datos de ejemplo y luego analiza con el usuario clave si ese flujo cubre sus necesidades. Cada diferencia observada se registra y evalúa metódicamente."
            },
            {
                "layout": "tabla",
                "titulo": "Las cuatro categorías del análisis Fit / Gap",
                "claves": ["Fit estándar", "Gap configurable", "Gap extensión", "Gap desarrollo"],
                "icono": "list-checks",
                "tabla": {
                    "encabezados": ["Categoría", "Descripción", "Solución en SAP B1", "Impacto en Costo/Tiempo"],
                    "filas": [
                        ["Fit Estándar", "El proceso del cliente coincide con el ERP", "Uso directo de la pantalla nativa", "Cero costo adicional"],
                        ["Gap Configurable", "Requiere ajuste sin código de programación", "Campos UDF, alertas, autorizaciones", "Bajo impacto (horas consultor)"],
                        ["Gap Add-on", "Funcionalidad especializada de industria", "Módulos certificados (WMS, Beas)", "Medio (licenciamiento socio)"],
                        ["Gap Desarrollo", "Regla única muy específica del cliente", "API Service Layer o script a medida", "Alto (requiere desarrollo y QA)"]
                    ]
                },
                "narracion": "Clasificar correctamente cada requerimiento es vital para la salud del proyecto. El Fit estándar aprovecha la inversión inmediatamente. El Gap configurable se resuelve con herramientas nativas de SAP B1 como UDFs y alertas. Los Gaps de add-on incorporan soluciones certificadas, y solo cuando sea estrictamente imprescindible se aprueba un desarrollo a medida."
            },
            {
                "layout": "pantalla",
                "titulo": "Parametrizar bloqueo por límite de crédito",
                "claves": ["Límite de crédito", "Control preventivo", "Bloqueo automático", "Gestión de riesgo"],
                "icono": "shield-check",
                "ventana": "Gestión > Inicialización del sistema > Parametrizaciones de documento",
                "campos": [
                    {"etiqueta": "Verificar límite de crédito", "valor": "Activo"},
                    {"etiqueta": "Aplicar en pedido de cliente", "valor": "Sí"},
                    {"etiqueta": "Aplicar en entrega", "valor": "Sí"},
                    {"etiqueta": "Mensaje de advertencia o bloqueo", "valor": "Bloqueo"}
                ],
                "resaltar": 0,
                "practica": {
                    "titulo": "Activar bloqueo por límite de crédito",
                    "menu_path": "Gestión > Inicialización del sistema > Parametrizaciones de documento",
                    "instrucciones": [
                        "Accede a Gestión e Inicialización del sistema",
                        "Selecciona Parametrizaciones de documento",
                        "En la pestaña General activa la verificación de límite de crédito",
                        "Selecciona la opción de Bloqueo al superar el cupo y guarda los cambios"
                    ],
                    "campos": [
                        {"etiqueta": "Verificar límite de crédito", "valor": "Activo", "pista": "Casilla de verificación de cupo"},
                        {"etiqueta": "Aplicar en pedido de cliente", "valor": "Sí", "pista": "Control en la captura de ventas"},
                        {"etiqueta": "Aplicar en entrega", "valor": "Sí", "pista": "Control previo al despacho de bodega"},
                        {"etiqueta": "Mensaje de advertencia o bloqueo", "valor": "Bloqueo", "pista": "Impide guardar sin autorización"}
                    ]
                },
                "narracion": "Durante el taller de exploración comercial, el cliente solicita controlar estrictamente que ningún vendedor facture a clientes con deudas vencidas. En esta práctica configuras la solución estándar en Parametrizaciones de documento, activando el bloqueo automático en pedidos y entregas cuando se exceda el límite de crédito asignado."
            },
            {
                "layout": "concepto",
                "titulo": "La tentación de sobre-personalizar",
                "claves": ["Deuda técnica", "Actualizaciones complejas", "Costos ocultos", "Pérdida de estándar"],
                "icono": "triangle-alert",
                "narracion": "El error más costoso de un consultor novato es decir sí a todas las solicitudes de cambio del cliente. Sobre-personalizar un ERP genera deuda técnica masiva, dificulta las actualizaciones de versión y aumenta los costos de soporte. El buen consultor asesora al cliente para adaptar sus procesos internos al estándar probado de SAP."
            },
            {
                "layout": "kpi",
                "titulo": "Indicadores de calidad en la fase Explore",
                "claves": ["Cobertura estándar", "Gaps aprobados", "Firma BBD"],
                "icono": "chart-pie",
                "kpis": [
                    {"valor": "≥ 85%", "etiqueta": "Procesos cubiertos por el estándar SAP", "icono": "circle-check"},
                    {"valor": "100%", "etiqueta": "Gaps documentados con costo y solución", "icono": "file-text"},
                    {"valor": "100%", "etiqueta": "Business Blueprint formalmente firmado", "icono": "award"}
                ],
                "narracion": "Un proyecto saludable mantiene al menos un ochenta y cinco por ciento de sus procesos dentro del estándar de SAP Business One. El cien por ciento de las brechas deben tener solución técnica aprobada, culminando con la firma solemne del Business Blueprint antes de iniciar la construcción."
            },
            {
                "layout": "resumen",
                "titulo": "Resumen del análisis Fit / Gap",
                "claves": ["Estándar primero", "Matriz rigurosa", "Blueprint consensuado", "Contrato funcional"],
                "icono": "lightbulb",
                "narracion": "Los talleres Fit-Gap son el puente entre las expectativas del cliente y la realidad del sistema. Al guiar la exploración con empatía y firmeza técnica, aseguras un Business Blueprint claro que servirá de mapa indiscutible para la fase de realización que veremos a continuación."
            }
        ]
    },
    {
        "id": "mod26-c3",
        "modulo": "mod-26",
        "titulo": "Fase de Realización: Parametrización y Migración Golden DB",
        "laminas": [
            {
                "layout": "portada",
                "titulo": "Fase de Realización y Golden Database",
                "claves": ["Realize", "Golden Database", "Migración DTW", "Parametrización"],
                "icono": "database",
                "narracion": "En la fase de Realización el diseño conceptual del Blueprint se convierte en una solución viva y funcional. Hoy aprenderás a estructurar la Golden Database, la base de datos maestra que contendrá todas las configuraciones definitivas, y cómo liderar la migración masiva de datos limpios mediante Data Transfer Workbench."
            },
            {
                "layout": "objetivos",
                "titulo": "Objetivos de aprendizaje",
                "claves": ["Construir Golden DB", "Estrategia DTW", "Depurar datos maestros", "Registrar saldos iniciales"],
                "icono": "target",
                "narracion": "Al finalizar esta clase comprenderás cómo mantener el aislamiento entre la base de datos de desarrollo y la base maestra Golden. Aprenderás a preparar plantillas de carga masiva de clientes, proveedores y artículos con DTW, y practicarás en el sistema el registro contable de saldos iniciales."
            },
            {
                "layout": "concepto",
                "titulo": "La arquitectura de la Golden Database",
                "claves": ["Base maestra", "Sin datos basura", "Copia a producción", "Auditoría total"],
                "icono": "server",
                "narracion": "La Golden Database es la base de datos de referencia absoluta del proyecto. Contiene el plan de cuentas aprobado, las parametrizaciones generales, autorizaciones, formatos y tablas de usuario, pero sin registros operativos transaccionales de prueba. De ella nacerá la base de producción definitiva en el arranque."
            },
            {
                "layout": "flujo",
                "titulo": "Flujo de migración de datos con DTW",
                "claves": ["Extracción", "Depuración", "Mapeo", "Carga", "Validación"],
                "icono": "workflow",
                "pasos": [
                    {"texto": "Extracción desde sistema legado", "icono": "upload"},
                    {"texto": "Depuración y eliminación de duplicados", "icono": "filter"},
                    {"texto": "Llenado de plantillas oficiales DTW", "icono": "file-spreadsheet"},
                    {"texto": "Simulación de carga y prueba", "icono": "search"},
                    {"texto": "Importación definitiva a SAP B1", "icono": "database"}
                ],
                "narracion": "La migración de datos sigue un proceso riguroso en cinco pasos. Se extraen los datos del sistema antiguo, el cliente los depura eliminando duplicados e inactivos, se completan las plantillas oficiales de DTW, se ejecuta una simulación para detectar errores de tipos de datos, y finalmente se importan en SAP Business One."
            },
            {
                "layout": "pantalla",
                "titulo": "Carga de saldos iniciales de inventario",
                "claves": ["Stock inicial", "Bodega 01", "Costo unitario", "Partida de apertura"],
                "icono": "boxes",
                "ventana": "Inventario > Transacciones de inventario > Saldos iniciales de inventario",
                "campos": [
                    {"etiqueta": "Artículo", "valor": "A00001"},
                    {"etiqueta": "Almacén", "valor": "01"},
                    {"etiqueta": "Cantidad inicial", "valor": "50"},
                    {"etiqueta": "Precio por unidad", "valor": "650.00"}
                ],
                "resaltar": 2,
                "practica": {
                    "titulo": "Registrar saldo de apertura de inventario",
                    "menu_path": "Inventario > Transacciones de inventario > Saldos iniciales de inventario",
                    "instrucciones": [
                        "Ingresa a Inventario y Transacciones de inventario",
                        "Abre Saldos iniciales de inventario",
                        "Selecciona el artículo A00001 (Laptop Dell) para la Bodega 01",
                        "Ingresa 50 unidades a un costo de 650.00 dólares y procesa la carga"
                    ],
                    "campos": [
                        {"etiqueta": "Artículo", "valor": "A00001", "pista": "Código del artículo modelo"},
                        {"etiqueta": "Almacén", "valor": "01", "pista": "Bodega Central Quito"},
                        {"etiqueta": "Cantidad inicial", "valor": "50", "pista": "Existencia física de apertura"},
                        {"etiqueta": "Precio por unidad", "valor": "650.00", "pista": "Costo promedio ponderado"}
                    ]
                },
                "narracion": "El inventario inicial es uno de los saldos críticos que se cargan antes del Go-Live. En esta práctica registras en la ventana de Saldos iniciales de inventario cincuenta unidades de la Laptop Dell en la Bodega Central Quito a un costo unitario de seiscientos cincuenta dólares, alimentando simultáneamente el kardex físico y la contabilidad."
            },
            {
                "layout": "asiento",
                "titulo": "Impacto contable del saldo inicial",
                "claves": ["Partida doble", "Inventario", "Cuenta puente", "Cuadre exacto"],
                "icono": "calculator",
                "lineas": [
                    {"cuenta": "103010 - Inventario de mercaderías", "debe": "32.500,00", "haber": "0,00"},
                    {"cuenta": "301090 - Cuenta puente saldos iniciales", "debe": "0,00", "haber": "32.500,00"}
                ],
                "narracion": "Al registrar el saldo inicial de inventario, el sistema genera automáticamente un asiento por treinta y dos mil quinientos dólares. Se debita la cuenta de Inventario de mercaderías aumentando el activo, y se acredita la cuenta puente de Saldos iniciales de patrimonio, garantizando la partida doble exacta requerida por las normas contables."
            },
            {
                "layout": "kpi",
                "titulo": "Métricas de éxito en la migración",
                "claves": ["Integridad", "Cuadre contable", "Cero pérdidas"],
                "icono": "chart-bar",
                "kpis": [
                    {"valor": "100%", "etiqueta": "Datos maestros verificados por el cliente", "icono": "circle-check"},
                    {"valor": "$ 0,00", "etiqueta": "Diferencia entre balance legado y SAP", "icono": "scale"},
                    {"valor": "100%", "etiqueta": "Pruebas unitarias de consultoría aprobadas", "icono": "award"}
                ],
                "narracion": "La fase de Realización se considera exitosa cuando los datos maestros están validados al cien por ciento, la diferencia entre el balance del sistema anterior y el balance de apertura en SAP es exactamente cero dólares, y todas las pruebas funcionales unitarias han sido certificadas."
            },
            {
                "layout": "resumen",
                "titulo": "Resumen de la fase de Realización",
                "claves": ["Golden DB", "Calidad de datos", "Pruebas rigurosas", "Listos para UAT"],
                "icono": "lightbulb",
                "narracion": "La fase de Realización materializa la solución. Mantener la disciplina en la Golden Database y realizar una migración de datos impecable son las bases que permitirán a los usuarios ejecutar sus pruebas UAT con confianza y asegurar una salida en vivo sin sobresaltos."
            }
        ]
    },
    {
        "id": "mod26-c4",
        "modulo": "mod-26",
        "titulo": "Estrategia de Salida en Vivo (Cutover), Go-Live e Hypercare",
        "laminas": [
            {
                "layout": "portada",
                "titulo": "Estrategia de Cutover, Go-Live e Hypercare",
                "claves": ["Cutover Runbook", "Go-Live", "Comité Go/No-Go", "Hypercare"],
                "icono": "award",
                "narracion": "El momento culminante de todo proyecto ERP es la salida en vivo. En esta clase dominarás la planificación del Cutover Runbook, el cronograma hora a hora del fin de semana de arranque, los criterios del comité Go/No-Go y el acompañamiento durante el período de Hypercare para estabilizar la operación del cliente."
            },
            {
                "layout": "objetivos",
                "titulo": "Objetivos de aprendizaje",
                "claves": ["Elaborar Cutover Runbook", "Decisión Go/No-Go", "Bloquear períodos legados", "Estructurar Hypercare"],
                "icono": "target",
                "narracion": "Al finalizar esta clase sabrás redactar un plan de transición detallado con responsables y tiempos precisos. Conocerás los criterios innegociables para autorizar la salida en vivo, aprenderás a gestionar el período de congelamiento transaccional y practicarás el bloqueo de períodos contables en SAP Business One."
            },
            {
                "layout": "concepto",
                "titulo": "El Cutover Runbook: La partitura del arranque",
                "claves": ["Cronograma hora a hora", "Tareas críticas", "Responsables", "Plan de contingencia"],
                "icono": "calendar",
                "narracion": "El Cutover Runbook es el documento maestro que coordina todas las actividades durante el fin de semana del Go-Live. Detalla minuto a minuto quién apaga el sistema legado, quién extrae los saldos finales, quién ejecuta las cargas en SAP, quién valida los balances y a qué hora exacta se autoriza el ingreso a los usuarios de producción."
            },
            {
                "layout": "flujo",
                "titulo": "Cronograma del fin de semana de transición",
                "claves": ["Viernes cierre", "Sábado migración", "Domingo cuadre", "Lunes Go-Live"],
                "icono": "workflow",
                "pasos": [
                    {"texto": "Viernes 18h: Blackout del sistema viejo", "icono": "lock"},
                    {"texto": "Sábado 08h: Extracción y depuración de saldos", "icono": "filter"},
                    {"texto": "Sábado 14h: Carga masiva en producción SAP", "icono": "upload"},
                    {"texto": "Domingo 10h: Validación contable y Go/No-Go", "icono": "scale"},
                    {"texto": "Lunes 07h: Apertura oficial de operaciones", "icono": "circle-check"}
                ],
                "narracion": "La secuencia típica de Cutover inicia el viernes al cerrar operaciones en el sistema anterior. El sábado por la mañana se extraen saldos finales y por la tarde se cargan en producción mediante DTW. El domingo se cuadran balances con el contador general y se realiza la reunión Go/No-Go. El lunes por la mañana los usuarios inician labores directamente en SAP Business One."
            },
            {
                "layout": "pantalla",
                "titulo": "Bloquear períodos contables anteriores",
                "claves": ["Control contable", "Período bloqueado", "Cero registros retroactivos", "Auditoría"],
                "icono": "lock",
                "ventana": "Gestión > Inicialización del sistema > Períodos contables",
                "campos": [
                    {"etiqueta": "Código de período", "valor": "2026-01"},
                    {"etiqueta": "Nombre del período", "valor": "Enero 2026"},
                    {"etiqueta": "Estado del período", "valor": "Bloqueado"},
                    {"etiqueta": "Fecha de vencimiento hasta", "valor": "31/01/2026"}
                ],
                "resaltar": 2,
                "practica": {
                    "titulo": "Bloquear período contable cerrado",
                    "menu_path": "Gestión > Inicialización del sistema > Períodos contables",
                    "instrucciones": [
                        "Ingresa a Gestión e Inicialización del sistema",
                        "Abre la ventana Períodos contables",
                        "Ubica el período contable del mes anterior",
                        "Cambia su estado de Activo a Bloqueado y actualiza la ventana"
                    ],
                    "campos": [
                        {"etiqueta": "Código de período", "valor": "2026-01", "pista": "Código del período mensual"},
                        {"etiqueta": "Nombre del período", "valor": "Enero 2026", "pista": "Descripción del ejercicio"},
                        {"etiqueta": "Estado del período", "valor": "Bloqueado", "pista": "Impide nuevas contabilizaciones"},
                        {"etiqueta": "Fecha de vencimiento hasta", "valor": "31/01/2026", "pista": "Límite temporal"}
                    ]
                },
                "narracion": "Al arrancar la producción es indispensable evitar que los usuarios sigan registrando documentos con fechas del ejercicio anterior. En esta práctica accedes a Períodos contables y cambias el estado del período a Bloqueado, blindando la contabilidad histórica y obligando a operar únicamente en el período vigente."
            },
            {
                "layout": "concepto",
                "titulo": "El período de Hypercare y soporte",
                "claves": ["Estabilización", "Presencia en sitio", "Resolución rápida", "Transferencia final"],
                "icono": "shield-check",
                "narracion": "El Go-Live no termina el lunes de apertura; se extiende durante las tres a cuatro semanas de Hypercare. Los consultores acompañan a los usuarios en sitio, resolviendo dudas, ajustando reportes y asegurando que el primer cierre de mes en SAP se realice con éxito antes de traspasar la cuenta al equipo de soporte permanente."
            },
            {
                "layout": "kpi",
                "titulo": "Indicadores de estabilidad en Hypercare",
                "claves": ["Disponibilidad", "Incidentes cerrados", "Primer cierre"],
                "icono": "chart-line",
                "kpis": [
                    {"valor": "99,9%", "etiqueta": "Disponibilidad del sistema en el arranque", "icono": "server"},
                    {"valor": "< 2 h", "etiqueta": "Tiempo de respuesta en incidentes críticos", "icono": "clock"},
                    {"valor": "Día 3", "etiqueta": "Primer cierre contable mensual completado", "icono": "calendar"}
                ],
                "narracion": "La excelencia de la implementación se mide en la estabilidad: mantener el sistema disponible al noventa y nueve coma nueve por ciento, responder incidentes críticos en menos de dos horas y lograr el primer cierre contable mensual en los primeros tres días del mes siguiente."
            },
            {
                "layout": "resumen",
                "titulo": "Resumen de la puesta en marcha",
                "claves": ["Disciplina en Cutover", "Gobernanza Go/No-Go", "Acompañamiento Hypercare", "Éxito total"],
                "icono": "lightbulb",
                "narracion": "Concluir exitosamente la metodología SAP exige planificación milimétrica en el Cutover y empatía en el Hypercare. Has completado el módulo de metodología y estás listo para profundizar en el modelado formal de procesos con BPMN dos punto cero."
            }
        ]
    }
]

def main():
    print(f"Generando clases en {DESTINO}...")
    for c in CLASES:
        p = DESTINO / c["id"] / "clase.json"
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(json.dumps(c, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"✔ Clase generada: {c['id']} ({len(c['laminas'])} láminas)")

if __name__ == "__main__":
    main()
