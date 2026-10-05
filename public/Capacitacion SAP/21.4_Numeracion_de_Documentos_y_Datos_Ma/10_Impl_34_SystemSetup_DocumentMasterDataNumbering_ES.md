UNIDAD 027: NUMERACIÓN DE DOCUMENTOS Y DATOS MAESTROS EN SAP BUSINESS ONE 10.0
Código de Manual: 10_Impl_34_SystemSetup_DocumentMasterDataNumbering_ES
Módulo Oficial: Gestión / Inicialización del Sistema / Numeración de Documentos
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores de Implementación, Administradores del ERP, Auditores Fiscales y Agentes IA (Antigravity)
Carpeta Asociada: 027_10_Impl_34_SystemSetup_DocumentMasterDataNumbering_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "027",

  "topic": "Document & Master Data Numbering Series & Period Indicators",

  "sap_module": "SystemSetup_Numbering",

  "database_tables": {

    "numbering_series_definitions": {

      "table": "NNM1",

      "key_fields": ["ObjectCode", "Series", "SeriesName", "InitialNum", "NextNumber", "LastNum", "Prefix", "Suffix", "GroupCode", "PeriodIndicator", "IsCancel"],

      "description": "Definición central de rangos de numeración, prefijos, sufijos y estado de bloqueo para cada objeto"

    },

    "user_series_defaults": {

      "table": "NNM2",

      "key_fields": ["ObjectCode", "Series", "UserSign"],

      "description": "Asignación de series por defecto a nivel de usuario individual"

    },

    "period_indicators": {

      "table": "OOFP",

      "key_fields": ["Indicator", "IndicatorName"],

      "description": "Indicadores de período que vinculan series a ejercicios fiscales (OFPR)"

    }

  },

  "menu_paths": [

    "Gestión > Inicialización del sistema > Numeración de documento",

    "Gestión > Inicialización del sistema > Autorizaciones > Autorizaciones generales > Serie de numeración (Grupos 1 al 10)",

    "Gestión > Utilidades > Comprobar numeración de documentos"

  ],

  "document_numbering_rules": {

    "primary_series": "Creada automáticamente al inicializar la base de datos (inicia en 1, ilimitada). Modificable solo antes de contabilizar el primer documento.",

    "overlap_prevention": "En documentos transaccionales, dos series del mismo tipo NO pueden solapar sus rangos numéricos. Se debe fijar un 'Número final' en la serie previa.",

    "prefix_suffix_scope": "En documentos, el prefijo/sufijo NO forma parte del campo numérico interno de BD (DocNum); solo es visible en la impresión de layouts.",

    "group_security": "Cada serie se vincula a un Grupo (1 a 10). Un usuario recién creado carece de acceso a cualquier serie hasta que se le asigne permiso al grupo correspondiente.",

    "period_indicator_alignment": "Permite reiniciar la numeración en 1 para cada nuevo ejercicio fiscal al cambiar el indicador de período en los períodos contables.",

    "cancellation_series": "Serie dedicada exclusivamente a registrar documentos anulados, manteniendo limpia la correlatividad de la serie activa ordinaria."

  },

  "master_data_numbering_rules": {

    "supported_entities": ["Interlocutores comerciales (OCRD)", "Artículos (OITM)", "Recursos (ORSC)"],

    "code_composition": "En datos maestros, el Prefijo y Sufijo SÍ forman parte de la clave primaria (CardCode/ItemCode). Permite solapar números numéricos entre series con prefijos distintos.",

    "digit_constraint": "Debe definirse un número fijo de dígitos; el sistema rellena con ceros a la izquierda (ej. 4 dígitos -> 0001). El número de dígitos es irreversible tras crear el primer registro.",

    "period_limitation": "Las series de datos maestros NO admiten indicadores de período."

  },

  "menu_customization": "Permite renombrar en caliente los títulos de documentos en el menú principal (ej. 'Facturas de clientes' -> 'Facturas de ventas') afectando a toda la empresa."

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Principios de la Numeración de Documentos
En SAP Business One 10.0, cada transacción comercial o contable (Ofertas, Pedidos, Facturas, Asientos) requiere un identificador correlativo unívoco. El sistema gestiona esto mediante Series de Numeración:

Serie Principal (Primary): Se genera por defecto al crear la sociedad. Su numeración arranca en 1 y es infinita (LastNum = null). Se puede alterar su valor de inicio antes de que se grabe la primera transacción (típico en migraciones para continuar la numeración del software legado).
Series Múltiples: Permite segregar documentos por sucursal, unidad de negocio, departamento o punto de emisión fiscal.
Regla de No Solapamiento: Para garantizar la integridad referencial y cumplir con auditorías fiscales, dos series del mismo documento jamás pueden compartir números. Si la Serie A termina en 5000, la Serie B debe iniciar obligatoriamente en 5001.
2.2 Seguridad y Autorización por Grupos de Series (1 al 10)
Un error común de los administradores novatos es crear un usuario nuevo y comprobar que no puede abrir la pantalla de Facturas de Clientes.

La razón es que los usuarios nuevos no tienen asignado acceso a ninguna serie de numeración por defecto.
En la ventana de configuración de la serie (NNM1), cada serie se etiqueta con un número de Grupo del 1 al 10.
En Autorizaciones generales, el administrador debe otorgar Autorización Total al grupo de series correspondiente (ej. Serie de numeración - Grupo 2).
2.3 Indicadores de Período y Reinicio Anual
Muchas legislaciones tributarias exigen que la facturación inicie en 1 al comenzar cada año calendario:

Para lograr esto sin colisionar con facturas del año anterior, se utilizan los Indicadores de Período (OOFP).
Al crear el ejercicio fiscal 2026, se le asigna el indicador 2026.
Se crea una nueva serie de facturas asociada al indicador 2026 con inicio en 1.
Los usuarios solo verán y podrán utilizar esta serie mientras la fecha de contabilización del sistema caiga dentro del período contable que lleve dicho indicador.
2.4 Numeración Automática en Datos Maestros vs Documentos
Existe una diferencia técnica crucial entre cómo SAP B1 maneja la numeración de documentos frente a la de datos maestros:



3. CASO DE NEGOCIO RESUELTO EN DG INDUSTRIES
Escenario de Consultoría:
La empresa DG Industries cuenta con tres divisiones comerciales: Norte, Sur e Internacional.

Requisito 1: Los pedidos de la división Norte deben emitirse con una serie separada que arranque en 100,000.
Requisito 2: Los clientes de la división Norte deben codificarse automáticamente con el prefijo NOR- y 5 dígitos (ej. NOR-00001).
Requisito 3: El vendedor de la división Norte, Carlos, debe tener precargada su serie por defecto para evitar digitación errónea.
Configuración en SAP Business One:
Configuración de Serie de Documento (Pedidos):
Ruta: Gestión > Inicialización del sistema > Numeración de documento.
Doble clic en Pedidos de cliente. Se añade la línea NORTE_PED, Primer Nº: 100001, Grupo: 2.
En la serie principal anterior se fija el número final en 100000 para evitar solapes.
Configuración de Serie de Maestro de Clientes:
Doble clic en Datos maestros de interlocutor comercial.
Se añade la serie CLI_NORTE, Prefijo: NOR-, Primer Nº: 1, Nº de dígitos: 5, Grupo: 2.
Asignación de Permisos y Serie por Defecto:
En Autorizaciones generales, se otorga a Carlos autorización total a Serie de numeración - Grupo 2.
En la ventana de series, se selecciona NORTE_PED y se presiona Fijar como por defecto > Ciertos usuarios > Carlos.
Validación: Al abrir un nuevo pedido, Carlos visualiza inmediatamente la serie NORTE_PED seleccionada con el correlativo correspondiente. Al crear un nuevo cliente bajo su serie, el sistema propone automáticamente NOR-00001.


4. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál es la función del "Indicador de período" en la definición de una serie de numeración de documentos?
A) Bloquear la serie cuando el usuario toma vacaciones.
B) Vincular la serie a un período contable específico para controlar en qué fechas puede usarse y permitir reiniciar la numeración en 1 en cada nuevo ejercicio fiscal.
C) Calcular intereses moratorios según los días de crédito.
D) Forzar a que las facturas solo se impriman a fin de mes.
Respuesta Correcta: B
Justificación Técnica: El indicador de período alinea la disponibilidad de la serie con el ejercicio contable activo, permitiendo ciclos de numeración anuales limpios sin solapamientos.
Pregunta 2
Si una empresa define una serie automática para Clientes con Prefijo "C-", Primer Número "1" y 4 dígitos, ¿cuál será el código exacto asignado al primer cliente registrado en la base de datos?
A) C-1
B) C-0001
C) 0001-C
D) C-1000
Respuesta Correcta: B
Justificación Técnica: En las series de datos maestros, el sistema concatena el prefijo con la parte numérica rellenada con ceros a la izquierda hasta completar la cantidad de dígitos definida (4 dígitos -> 0001, resultando en C-0001).
Pregunta 3
¿Qué herramienta de SAP Business One se debe ejecutar tras una migración masiva de documentos iniciales para verificar que no existan saltos ni números duplicados en las series?
A) El Asistente de Recuperación de Desastres.
B) Comprobar numeración de documentos (en Gestión > Utilidades).
C) La Reconciliación Interna Automática.
D) El Monitor de Rendimiento de HANA.
Respuesta Correcta: B
Justificación Técnica: La utilidad nativa Comprobar numeración de documentos escanea las tablas de documentos y maestros e identifica discrepancias, huecos en la secuencia o registros duplicados.