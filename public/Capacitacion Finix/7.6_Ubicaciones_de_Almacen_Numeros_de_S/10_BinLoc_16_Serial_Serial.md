UNIDAD 011: GESTIÓN DE NÚMEROS DE SERIE Y LOTES EN UBICACIONES (SAP BUSINESS ONE 10.0)
Código de Manual: 10_BinLoc_16_Serial_Serial
Módulo Oficial: Inventario / Ubicaciones y Trazabilidad (Bin Locations - Serial Numbers & Batches)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Logísticos, Administradores de Bodega, Auditores de Calidad y Agentes IA (Antigravity)
Carpeta Asociada: 011_10_BinLoc_16_Serial_Serial


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "011",

  "topic": "Managing Serial Numbers and Batches in Bin Locations",

  "sap_module": "Inventory_WMS_Traceability",

  "database_entities": {

    "serial_numbers": {

      "master_table": "OSRN",

      "transaction_tracking": "SRNT",

      "bin_serial_quantities": "OSRQ",

      "unique_identifier": "DistNumber"

    },

    "batch_numbers": {

      "master_table": "OBTN",

      "transaction_tracking": "BTNT",

      "bin_batch_quantities": "OBTQ",

      "unique_identifier": "DistNumber"

    },

    "bin_locations_mapping": {

      "master_table": "OBIN",

      "inventory_log": "OILM"

    }

  },

  "menu_paths": [

    "Inventario > Gestión de artículos > Números de serie de artículo > Gestión de números de serie",

    "Inventario > Gestión de artículos > Lotes > Gestión de lotes",

    "Inventario > Datos maestros de artículo > Pestaña General > Método de emisión (Emitir principalmente por)",

    "Inventario > Informes de inventario > Lista de contabilización de inventario > Dividir visualización por números de serie/lote"

  ],

  "inbound_management_methods": {

    "On_Every_Transaction": {

      "rule": "Los números de serie/lote son obligatorios al recibir mercancías (Entrada de mercancías por pedido).",

      "workflow": "Paso 1: Abrir ventana Configuración de números de serie. Paso 2: Digitar/generar series. Paso 3: Asignar ubicaciones físicas dentro de la misma ventana modal."

    },

    "On_Release_Only": {

      "rule": "Los números de serie/lote NO son obligatorios en la recepción física, solo al emitir o despachar mercancías.",

      "workflow": "La asignación a ubicaciones se efectúa de manera estándar en la ventana de asignación de ubicación del documento. Las series pueden completarse a posteriori en 'Gestión de números de serie - Modo Completar'."

    }

  },

  "outbound_issuing_methods": {

    "Method_1_Primarily_By_Bin_Locations": {

      "concept": "Emitir principalmente por ubicaciones de almacén.",

      "flow": "El recolector elige primero la celda física óptima y luego selecciona cualquier número de serie contenido en ella.",

      "sales_order_behavior": "NO permite reservar series en el Pedido de Cliente; la selección se realiza en la Entrega o Factura.",

      "recommended_for": "Artículos estándar de consumo masivo donde al cliente no le importa el código de serie específico."

    },

    "Method_2_Primarily_By_Serial_Batch": {

      "concept": "Emitir principalmente por números de serie o lote.",

      "flow": "El usuario selecciona primero la serie específica requerida; el sistema asigna automáticamente la celda donde reside.",

      "sales_order_behavior": "SÍ permite pre-asignar y comprometer series específicas desde el Pedido de Cliente.",

      "recommended_for": "Equipos customizados, servidores a medida, dispositivos con garantía individualizada o requerimientos médicos/tributarios estrictos."

    }

  },

  "batch_specific_differences": {

    "column_presentation": "Para lotes se muestra la columna 'Primera Ubicación' (First Bin Location), ya que un único lote puede distribuirse en múltiples celdas.",

    "reallocation_button": "La herramienta 'Reasignar ubicaciones' es exclusiva para series individuales; no está disponible en la ventana de lotes.",

    "fifo_logic": "El algoritmo FIFO en lotes evalúa la fecha de ingreso de cada lote específico en cada celda, garantizando rotación estricta de partidas antiguas."

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Integración Bidireccional: Trazabilidad Unitaria y Posicionamiento Físico
La convergencia de la gestión de números de serie/lotes con almacenes gestionados por ubicaciones (WMS) representa el nivel más alto de precisión operativa en SAP Business One. Mientras que un almacén convencional solo rastrea que existen 100 unidades de un lote en la empresa, el módulo de ubicaciones conoce exactamente qué 20 unidades están en el pasillo A, cuáles en el pasillo B y cuáles en el muelle de inspección.
2.2 Métodos de Gestión en Entrada de Mercancías
En cada transacción (On Every Transaction):
El sistema bloquea el documento de recepción (OPDN/OIGN) si no se han completado los números de serie o lote.
Punto Técnico Clave: La columna de asignación de ubicación en la fila del documento base queda deshabilitada temporalmente; la asignación de celdas se ejecuta obligatoriamente dentro de la ventana de configuración de números de serie, asociando cada código de serie a su respectiva celda.
Reasignación Masiva (Reallocate Bin Locations): Para recepciones de cientos de unidades serializadas, el botón Reasignar ubicaciones abre una matriz donde el operador selecciona bloques de series (ej. 50 unidades) y los traslada en un solo clic a una ubicación específica, repitiendo el proceso para llenar estanterías contiguas sin tener que editar línea por línea.
Solo en la liberación (Release Only):
Facilita el ingreso rápido de mercancías a granel. Los artículos ingresan a las celdas de almacenamiento sin identificar series.
Posteriormente, el departamento de control de calidad accede a Inventario > Gestión de artículos > Números de serie de artículo > Gestión de números de serie en Modo Completar para registrar las series y enlazarlas a las ubicaciones donde fueron previamente almacenadas.
2.3 Estrategias de Emisión en Ventas: "Por Ubicación" vs "Por Número de Serie"
El parámetro Emitir principalmente por (Issue Primarily By) en los Datos Maestros del Artículo (OITM) define la filosofía de picking:

Emitir principalmente por Ubicación: Optimiza el recorrido físico del recolector en el almacén. El sistema guía al operario a la celda más cercana o conveniente; una vez allí, el operario escanea cualquier serie disponible dentro de esa celda.
Emitir principalmente por Número de Serie/Lote: Imprescindible cuando se comercializan productos con especificaciones únicas (ej. un servidor de gama alta configurado con 128 GB de RAM y 4 TB SSD bajo el código genérico SRV-01). El cliente compró esa máquina específica identificada por la serie SN-998811. Al seleccionar dicha serie en la orden o entrega, el sistema identifica de forma automática en qué celda exacta se encuentra almacenada.
2.4 Impacto en el Asistente de Picking y Embalaje (Pick & Pack)
Si el artículo se emite por número de serie, no se puede generar ni liberar la lista de picking si el pedido de venta no tiene las series asignadas. La lista de picking queda estrictamente ligada a esas unidades reservadas.
Si el artículo se emite por ubicación, la lista de picking se genera con total flexibilidad y las series se confirman en el momento de armar el embalaje o emitir la entrega.


3. ATLAS DIDÁCTICO: COMPARATIVA TÉCNICA SERIES VS LOTES EN CELDAS


4. CASO DE NEGOCIO RESUELTO: DESPLIEGUE INTEGRAL EN OEC COMPUTERS
Escenario de Consultoría:
George, jefe de almacén en OEC Computers, debe estructurar dos operaciones críticas:

Recepción de 100 Tabletas Gráficas: Cada tableta tiene número de serie único y el método está configurado como En cada transacción. La capacidad máxima de las celdas en el pasillo tecnológico es de 25 tabletas por celda.
Despacho de un Servidor Personalizado: El cliente Parameter Technology compró un servidor modelo SRV-CUSTOM con la serie SN-8841-B que se emite principalmente por número de serie.
Ejecución en SAP Business One:
Operación 1 (Recepción y Reasignación en Bloques):
Se registra la Entrada de mercancías por pedido.
En la ventana Configuración de números de serie, George utiliza el generador automático para crear las 100 series correlativas (TAB-2026-001 a TAB-2026-100).
Pulsa el botón Reasignar ubicaciones:
Selecciona las series 1 a 25 y las asigna a 01-A1-S1-L1.
Selecciona las series 26 a 50 y las asigna a 01-A1-S1-L2.
Selecciona las series 51 a 75 y las asigna a 01-A1-S1-L3.
Selecciona las series 76 a 100 y las asigna a 01-A1-S1-L4.
La recepción de 100 unidades queda completada y balanceada en 4 celdas en menos de dos minutos.
Operación 2 (Despacho de Servidor Dirigido por Serie):
En la Entrega de ventas, el operador busca el artículo SRV-CUSTOM.
Como el artículo está configurado como Emitir principalmente por número de serie, la columna de ubicación se bloquea para evitar errores.
El operario entra a la selección de series, escanea la etiqueta SN-8841-B y el sistema rellena automáticamente la celda de origen 01-A3-S2-L1.
Se garantiza que el cliente reciba el equipo exacto que fue configurado para su contrato sin riesgo de despachar otra unidad idéntica por equivocación.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
Cuando un artículo gestionado por números de serie tiene el método de gestión "En cada transacción" (On Every Transaction), ¿dónde se realiza la asignación de ubicaciones durante una Entrada de Mercancías por Pedido?
A) Directamente en la columna "Asignación de ubicación" de la línea del documento base.
B) Obligatoriamente dentro de la ventana modal "Configuración de números de serie", después de haber creado o asignado las series.
C) No se asignan ubicaciones; el sistema las envía siempre a pérdidas y ganancias.
D) Únicamente mediante un informe de inventario posterior.
Respuesta Correcta: B
Justificación Técnica: Para artículos con gestión en cada transacción, la integridad de la base de datos exige que cada número de serie nazca vinculado a su posición física. Por ende, la asignación de celdas se bloquea en el documento principal y se ejecuta dentro de la ventana de configuración de series.
Pregunta 2
¿Cuál es la diferencia fundamental en un Pedido de Cliente entre un artículo con método "Emitir principalmente por ubicaciones" y otro con método "Emitir principalmente por números de serie"?
A) El artículo por ubicaciones requiere autorización de gerencia.
B) Para el artículo emitido por números de serie es posible seleccionar y comprometer números de serie específicos desde el Pedido de Cliente; para el artículo emitido por ubicaciones esto no está permitido y la asignación ocurre en la Entrega o Factura.
C) El artículo emitido por números de serie no calcula impuestos.
D) No existe ninguna diferencia; ambos métodos se comportan idénticamente en la preventa.
Respuesta Correcta: B
Justificación Técnica: Cuando la prioridad es el número de serie, el ERP permite apartar la unidad física exacta desde el compromiso comercial en el pedido; cuando la prioridad es la ubicación, se busca flexibilidad logística y las series se escanean al momento del despacho.
Pregunta 3
¿Por qué en los documentos de inventario para artículos gestionados por LOTES se visualiza la columna "Primera Ubicación" (First Bin Location) en lugar de "Ubicación" (Bin Location)?
A) Porque el sistema solo permite asignar lotes en el primer pasillo del almacén.
B) Porque una cantidad perteneciente a un mismo lote puede estar fraccionada y almacenada en múltiples celdas diferentes, mostrando la celda más antigua o de menor código como referencia.
C) Porque indica la fábrica de origen donde se manufacturó el lote.
D) Es un error de traducción de la interfaz de usuario.
Respuesta Correcta: B
Justificación Técnica: A diferencia de los números de serie que son unitarios (1 a 1), un lote ampara múltiples piezas que pueden repartirse entre varias estanterías; por ello, el campo muestra la primera celda en orden correlativo y permite desplegar el desglose completo mediante la flecha de enlace.