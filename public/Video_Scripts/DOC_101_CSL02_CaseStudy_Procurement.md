# Guion de Video: DOC 101 CSL02 CaseStudy Procurement

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 101 CSL02 CaseStudy Procurement.

## Contenido Principal (Visual: Diapositivas correspondientes)
Guía Técnica: Caso Práctico CSL02 - Proceso Integral de Aprovisionamiento (Compras)
Metadatos Técnicos
Módulo SAP: Compras y Gestión de Inventarios (Procurement & Purchasing Flow)
Código de Unidad: 101_CSL02_Procurement_Process_ES
Versión Oficial: SAP Business One 10.0, versión para SAP HANA
Audiencia Objetivo: Compradores, Jefes de Logística, Contadores y Consultores Funcionales.



{

  "antigravity_master_schema": {

    "module": "Purchasing & Inventory Valuation - Procurement Case Study",

    "version": "10.0 HANA",

    "business_scenario": "OEC Computers - Reabastecimiento integral, entregas parciales, gestión de mermas y pagos a proveedores",

    "key_actors": {

      "procurement_manager": "James",

      "vendor": "V10000"

    },

    "master_data_prerequisites": {

      "vendor_code": "V10000",

      "assigned_items": ["I00002", "I00003", "I00007", "I00008"]

    },

    "document_flow_chain": [

      "Pedido de Compra (OPOR)",

      "Entrada de Mercancías / Remisión (OPDN)",

      "Verificación de Stock en Almacenes (OITW)",

      "Factura de Proveedor (OPCH)",

      "Pago Efectuado / Finanzas (OVPM)"

    ]

  }

}


1. Contexto Operativo del Caso Práctico en OEC Computers
James, Jefe de Compras en OEC Computers, debe gestionar el ciclo completo de compras para asegurar existencias de componentes críticos. La operación involucra al proveedor habitual V10000 y enfrenta situaciones reales de la cadena de suministro:

Emisión de un pedido de reabastecimiento para múltiples códigos de inventario.
Recepción de entregas parciales y registro en entradas de mercancías (OPDN).
Detección de discrepancias en cantidades recibidas y entrega de artículos no planificados originalmente.
Consulta de disponibilidad de stock multialmacén antes de aceptar modificaciones en muelle.
Cierre administrativo de líneas de pedido no suministradas para evitar pasivos contingentes en el MRP.
Consolidación de múltiples entregas en una única Factura de Proveedor (OPCH).
Procesamiento de compras urgentes mediante Factura directa de Proveedor con análisis contable.
Liquidación financiera combinada mediante Pago Efectuado (OVPM).


2. Enunciado de las Tareas del Caso Práctico
Tarea 1: Creación del Pedido de Compras Multilinea
Acción: James emite un Pedido de Compras (OPOR) al proveedor V10000 con el siguiente detalle:
I00002: 50 unidades.
I00004: 100 unidades.
I00007: 25 unidades.
I00008: 15 unidades.
Tarea 2: Recepción Parcial de Mercancías
Acción: El proveedor despacha una primera entrega incompleta:
I00004: 50 unidades (de 100 pedidas).
I00007: 25 unidades (completo).
I00008: 15 unidades (completo).
I00002: No se entrega ninguna unidad en este lote.
Requerimiento: Registrar la Entrada de Mercancías parcial (OPDN) utilizando el asistente de copiado de documentos.
Tarea 3: Gestión de Discrepancias y Auditoría de Stock en Muelle
Acción: Arriba un segundo camión con el resto de la mercancía, pero con variaciones:
I00002: 50 unidades.
I00004: 30 unidades (quedando 20 unidades pendientes del pedido original).
I00003: 20 unidades (artículo no incluido en el pedido inicial).
Pregunta de Negocio:
¿Cómo incorporar estas diferencias en la segunda Entrada de Mercancías?
Antes de validar el ingreso, ¿cómo verificar el estado de stock físico y disponible de los artículos I00004 e I00003 directamente desde la pantalla de recepción?
Tarea 4: Facturación Consolidada y Cierre de Saldo Pendiente
Acción: El proveedor V10000 emite la factura por los artículos entregados y notifica que no podrá suministrar las 20 unidades faltantes de I00004.
Requerimiento:
Cerrar definitivamente la línea pendiente de I00004 en el Pedido de Compra original para liberar el estatus de comprometido.
Consolidar los dos documentos de Entrada de Mercancías en una única Factura de Proveedor (OPCH).
Tarea 5: Compra Urgente sin Pedido Previo y Análisis Contable
Acción: James necesita de forma inmediata 25 unidades de I00008 y 5 unidades de I00009. Las recibe en mano con la factura comercial del proveedor.
Pregunta de Negocio:
¿Cómo registrar la operación en un solo paso optimizando tiempos?
¿Cuáles son las 3 opciones nativas para auditar el asiento contable generado en finanzas a partir de la factura?
Tarea 6: Liquidación Financiera Combinada (Pago Masivo)
Acción: Liquidar simultáneamente ambas facturas comerciales de V10000 mediante transferencia bancaria utilizando las funciones de captura rápida de importe total.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
