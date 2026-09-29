# Guion de Video: DOC 051 Impl ImportingDocsDTW

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 051 Impl ImportingDocsDTW.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 051: IMPORTACIÓN DE DOCUMENTOS DE MARKETING Y LOGÍSTICA CON DATA TRANSFER WORKBENCH (DTW)
Código de Manual: 10_Impl_33_Importing_Docs_using_DTW
Módulo Oficial: Herramientas de Implementación / Migración de Datos (Implementation Tools - DTW)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores de Implementación, Administradores de Sistemas, Migradores de Datos y Agentes IA (Antigravity)
Carpeta Asociada: 051_10_Impl_33_Importing_Docs_using_DTW


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "051",

  "topic": "Importing Documents using Data Transfer Workbench (DTW)",

  "sap_module": "Implementation_Tools_DTW",

  "data_model": {

    "parent_object": "Documents (Representa la cabecera del documento transaccional)",

    "child_object": "Document_Lines (Representa las filas/partidas del documento)",

    "primary_foreign_key_relationship": {

      "parent_key_field": "DocNum o RecordKey",

      "child_foreign_key_field": "ParentKey / RecordKey",

      "line_identifier": "LineNum (0-indexed en DI API)"

    },

    "subordinate_child_objects": [

      "Document_LinesAdditionalExpenses (Gastos adicionales a nivel de línea o cabecera)",

      "Document_Lines_WithholdingTax (Retenciones impositivas)",

      "Document_Lines_SerialNumbers (Asignación de series en documentos)",

      "Document_Lines_BatchNumbers (Asignación de lotes en documentos)",

      "Document_Lines_Text (Filas de texto y subtotales)"

    ]

  },

  "base_target_linking": {

    "base_type_property": "Document_Lines.BaseType (Entero que identifica el BoAPARDocumentTypes)",

    "base_entry_property": "Document_Lines.BaseEntry (DocEntry interno del documento base)",

    "base_line_property": "Document_Lines.BaseLine (Número de línea base iniciando en 0)",

    "document_type_mapping": {

      "23": "Sales Quotation (Oferta de ventas)",

      "17": "Sales Order (Pedido de cliente)",

      "15": "Delivery (Entrega)",

      "16": "Return (Devolución)",

      "13": "A/R Invoice (Factura de clientes)",

      "14": "Sales Credit Memo (Nota de crédito de clientes)",

      "22": "Purchase Order (Pedido de compras)",

      "20": "Goods Receipt PO (Entrada de mercancías por pedido)",

      "21": "Goods Return (Devolución de mercancías)",

      "18": "A/P Invoice (Factura de proveedores)",

      "19": "Purchase Credit Memo (Nota de crédito de compras)"

    }

  },

  "document_numbering_rules": {

    "automatic_system_numbering": {

      "HandWritten": "tNO o campo vacío",

      "behavior": "El sistema auto-asigna el correlativo según la serie por defecto o especificada en la columna Series (NNM1)"

    },

    "manual_legacy_numbering": {

      "HandWritten": "tYES",

      "DocNum": "Número de documento legado exacto",

      "behavior": "Conserva el número original del sistema anterior; el documento se marca automáticamente como 'Impreso'"

    }

  },

  "opening_balances_strategy": {

    "inventory_quantities_and_costs": "Importación mediante Goods Receipt (OIGN/IGN1) o Inventario Inicial",

    "bp_balances_ar_ap": "Importación mediante Facturas de Clientes (OINV) / Facturas de Proveedores (OPCH)",

    "critical_double_counting_prevention": "Si se importan facturas de artículos sin documento base previo, se incrementa/disminuye stock y se afecta inventario permanente. Para saldos iniciales de clientes/proveedores sin afectar stock, se DEBE usar tipo servicio (DocType = 'dDocument_Service') contra cuenta puente de contrapartida de saldos iniciales."

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 La Arquitectura de Documentos en la DI API y DTW
En SAP Business One, todos los documentos de marketing (comerciales y de compras) comparten un mismo modelo de objetos subyacente en la capa DI API denominado Documents:

Objeto Cabecera (Documents): Contiene los metadatos globales de la transacción, tales como código de socio de negocio (CardCode), fechas contables (DocDate, DocDueDate, TaxDate), moneda (DocCur), número de serie (Series) y tipo de documento (DocType: dDocument_Items o dDocument_Service).
Objeto Líneas (Document_Lines): Representa el detalle transaccional de los artículos o servicios (ItemCode, Quantity, Price, WarehouseCode, AccountCode).
Relación Clave Padre-Hijo: En las plantillas DTW, la vinculación entre ambos archivos se establece mediante la columna RecordKey (o DocNum). Si en la plantilla de cabecera el documento tiene RecordKey = 1, todas las filas asociadas en la plantilla de líneas deberán indicar RecordKey = 1.
2.2 Gestión de Numeración: Correlativos del Sistema vs. Numeración Legada
Al migrar transacciones históricas o activas desde sistemas legados, existen dos alternativas operativas:

Numeración Automática de SAP: Se deja la columna HandWritten en blanco o tNO. SAP asignará el siguiente número correlativo de la serie activa. Si se desea una serie específica de migración, se coloca en la columna Series el identificador numérico interno de la serie (obtenido de la tabla NNM1).
Conservación de Números Legados (Manual): Se ingresa el valor tYES en el campo HandWritten y se indica el número original en DocNum. Esto permite que las facturas y pedidos mantengan su identidad original de auditoría. Además, SAP marca internamente estos documentos como ya impresos.
2.3 Importación de Documentos Enlazados (Base y Destino)
Cuando se replican flujos completos (ej. Pedido de Venta -> Entrega -> Factura de Clientes), DTW permite simular la acción nativa de Copiar de / Copiar a:

Para vincular una línea de Entrega con una línea de Pedido de Venta, en la plantilla Document_Lines de la Entrega se completan tres campos obligatorios:
BaseType: Tipo de documento base (ej. 17 para Pedido de Ventas).
BaseEntry: Número interno (DocEntry) del pedido base en SAP Business One.
BaseLine: Índice de la línea base que se está consumiendo (comienza en 0 para la fila 1).
Efecto de Cierre: Al importar el documento destino con las referencias base, SAP Business One cierra automáticamente las líneas correspondientes en el documento base, impidiendo consumos duplicados y reflejando la trazabilidad completa en el Mapa de Relaciones.
Excepción de Gastos Adicionales: Los fletes, seguros y gastos adicionales no se heredan automáticamente del documento base; deben importarse explícitamente en la plantilla Document_LinesAdditionalExpenses.
2.4 Mitigación de la Doble Contabilización en Saldos Iniciales
Un error clásico en implementaciones consiste en cargar el inventario inicial mediante Entrada de Mercancías (OIGN) y posteriormente cargar las facturas pendientes de clientes como facturas de artículos sin documento base.

Si se importa una Factura de Clientes de tipo artículo sin documento previo, el sistema asume que la factura actúa como entrega física, descontando unidades del almacén y acreditando la cuenta de inventario en inventario permanente.
Solución de Arquitectura: Las facturas de saldos iniciales deben importarse como Documentos de Servicio (DocType = dDocument_Service), asignando en la línea una cuenta contable transitoria de contrapartida de saldos iniciales. De este modo, se actualiza el auxiliar de cuentas por cobrar (OCRD/JDT1) sin alterar las cantidades físicas ni los costos de existencias.


3. MAPEO RELACIONAL DE TIPOS DE DOCUMENTO (BASE TYPE EN DI API)


4. CASO DE NEGOCIO RESUELTO: MIGRACIÓN DE SALDOS Y PEDIDOS EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers entra en fase de corte previo al Go-Live. El consultor debe migrar:

200 Facturas de Clientes pendientes de cobro del sistema anterior, con su antigüedad de saldos intacta.
50 Pedidos de Ventas abiertos que fueron capturados la semana anterior al corte y deben entregarse desde SAP Business One.
Protocolo de Ejecución:
Para las 200 Facturas de Clientes (Saldos Iniciales):
Se utilizan las plantillas OINV - Documents.csv y INV1 - Document_Lines.csv.
En OINV: Se define DocType = dDocument_Service, HandWritten = tYES y DocNum = Número Legado. Se respetan las fechas históricas DocDate y DocDueDate en periodos contables abiertos de arrastre.
En INV1: Se asigna AccountCode = 999999 (Cuenta Transitoria de Saldos Iniciales) y el importe pendiente.
Resultado: El balance de cuentas por cobrar queda perfecto sin afectar el stock físico que se migró por inventario inicial.
Para los 50 Pedidos de Ventas Abiertos:
Se utilizan ORDR y RDR1 con DocType = dDocument_Items.
Se importan los artículos, cantidades y almacenes. Al crearse en SAP, el inventario comprometido (IsCommited) se actualiza de inmediato, reservando las unidades para el posterior picking.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
Al importar una Factura de Clientes mediante DTW que debe liquidar y cerrar un Pedido de Ventas previamente existente en SAP, ¿qué campos deben configurarse obligatoriamente en la plantilla de líneas INV1 - Document_Lines?
A) BaseDocNum, BaseRow y ItemCode.
B) BaseType = 17, BaseEntry = DocEntry interno del Pedido y BaseLine = Número de fila base (iniciando en 0).
C) Solamente el CardCode y la fecha de vencimiento.
D) El campo DocStatus = 'C' en la cabecera.
Respuesta Correcta: B
Justificación Técnica: La DI API exige el trío BaseType (17 para Sales Order), BaseEntry (la clave primaria interna DocEntry del pedido, no el número visible DocNum) y BaseLine (índice 0-based de la línea base).
Pregunta 2
¿Cómo se previene la duplicación de movimientos de inventario al migrar saldos históricos de cuentas por cobrar pendientes de clientes mediante Facturas en DTW?
A) Borrando los artículos del almacén antes de la importación.
B) Importando las facturas como documentos de tipo servicio (DocType = dDocument_Service) imputados a una cuenta de compensación de saldos iniciales.
C) Desactivando la licencia de inventario durante el proceso de carga.
D) Estableciendo el precio del artículo en cero en la plantilla INV1.
Respuesta Correcta: B
Justificación Técnica: Las facturas de tipo servicio solo afectan la contabilidad financiera y el auxiliar de socios de negocios; no interactúan con el kardex físico ni con las cuentas de inventario permanente.
Pregunta 3
Para importar documentos de compra conservando la numeración manual original del sistema anterior en lugar de utilizar los correlativos automáticos de SAP, ¿qué valores deben ingresarse en la plantilla de cabecera?
A) AutoNumber = 'False' y ManualCode = '1'.
B) HandWritten = 'tYES' y el número legado exacto en la columna DocNum.
C) Dejar la columna DocNum vacía y poner el número en comentarios.
D) No es posible conservar numeraciones legadas en documentos de marketing.
Respuesta Correcta: B
Justificación Técnica: El parámetro HandWritten = tYES indica a SAP Business One que el documento utiliza numeración manual externa, respetando el valor numérico provisto en DocNum.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
