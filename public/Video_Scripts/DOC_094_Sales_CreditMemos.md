# Guion de Video: DOC 094 Sales CreditMemos

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 094 Sales CreditMemos.

## Contenido Principal (Visual: Diapositivas correspondientes)
Unidad 094: Abonos de Clientes y Cancelación de Documentos
Metadatos Técnicos
Módulo: Ventas - Clientes / Contabilidad y Créditos
Código de Unidad: DOC_094_Sales_CreditMemos
Versión de SAP Business One: 10.0
Audiencia Objetivo: Contadores, Analistas de Cuentas por Cobrar, Consultores Financieros


JSON Antigravity Master Schema
{

  "$schema": "https://antigravity.schema.sap.b1/v10/sales_credit_memos.json",

  "unit_id": "094_10_Sales_52_Issues_CM_ES",

  "technical_module": "Sales Financial Corrections & AR",

  "database_tables": {

    "credit_memo_header": "ORIN",

    "credit_memo_lines": "RIN1",

    "invoice_header": "OINV",

    "invoice_lines": "INV1",

    "journal_entry": "OJDT",

    "journal_lines": "JDT1"

  },

  "menu_paths": {

    "credit_memo": "Ventas - Clientes -> Abono de clientes",

    "cancel_document": "Clic derecho sobre el documento de marketing -> Cancelar",

    "reopen_paid_invoice": "Clic derecho sobre Factura de clientes cerrada/pagada -> Modificar estado del documento a Abierto",

    "max_cancel_days_setting": "Gestión -> Inicialización del sistema -> Parametrizaciones de documento -> Ficha General -> Máximo de días permitidos para cancelar documentos"

  },

  "business_rules": {

    "standard_credit_memo_journal": "Debita Ingresos por Ventas e IVA Repercutido, y acredita la cuenta del Cliente (OCRD). Si contiene artículos de inventario, debita Existencias y acredita Coste de Ventas (COGS).",

    "without_qty_posting": "Al marcar la casilla 'Sin contabilización de cantidad' en la línea del abono, solo se realizan asientos financieros de saldo y no se mueve el stock físico.",

    "service_credit_memo": "Acredita únicamente importes monetarios o servicios sin relación con artículos de stock.",

    "marketing_cancellation_logic": "Genera automáticamente un documento de reversión con estado 'Cerrado - Cancelación', cambia el documento original a 'Cancelado', concilia ambos saldos a cero y reabre el documento base anterior."

  }

}


Desarrollo Conceptual y Funcional Detallado
1. El Abono de Clientes (ORIN)
Es el documento contable oficial para anular total o parcialmente una Factura de Clientes (OINV):

Abono con Retorno Físico: Cuando el cliente devuelve un producto facturado. Realiza un asiento dual:
Revierte la deuda comercial: Debe Ingresos / Haber Cliente.
Revierte el movimiento de existencias: Debe Existencias / Haber Coste de Ventas.
Abono sin Movimiento de Mercancía: Cuando se otorga un descuento comercial posterior, corrección tarifaria o indemnización sin retorno de producto:
Se marca la casilla Sin contabilización de cantidad en la línea del artículo.
O bien, se emite un Abono de tipo Servicio.
2. Tratamiento de Facturas Pagadas (Cerradas)
Si una factura de clientes ya ha recibido un cobro (ORCT) y su estado es Cerrado:

Se debe hacer clic derecho sobre la factura y seleccionar Modificar estado del documento a Abierto.
Una vez abierta, el sistema permite copiarla hacia un Abono de Clientes o Solicitud de Devolución.
3. Cancelación Nativa de Documentos de Marketing
SAP Business One permite cancelar documentos de marketing sin rehacer asientos manuales:

Al ejecutar Cancelar, el sistema genera un documento espejo de anulación contable e inventario.
Ambos documentos quedan cerrados y mutuamente reconciliados en el sistema.
Reapertura de la Entrega: Si se cancela una Factura emitida prematuramente, la Entrega base vuelve a quedar en estado Abierto para poder refacturarse correctamente.
Se puede parametrizar el número máximo de días permitidos para autorizar cancelaciones.


Caso de Negocio Resuelto: OEC Computers
Escenario
OEC Computers emitió la Factura #800 por 1 servidor corporativo ($2,000 USD, costo $1,200 USD). El cliente reporta que se acordó un descuento comercial del 10% por volumen que no fue aplicado:

OEC no requiere que el servidor sea devuelto a bodega.
Desde la Factura #800 se genera un Abono de Clientes de tipo Artículo copiando la línea del servidor.
Se selecciona la casilla Sin contabilización de cantidad y se ajusta el importe a abonar en $200 USD.
El sistema debita la cuenta de Ingresos por Ventas por $200 y acredita la cuenta corriente del cliente sin alterar el kardex del almacén.


Banco de Evaluación Situacional
Pregunta 1
¿Qué ocurre con los movimientos de existencias y costos si se marca la casilla 'Sin contabilización de cantidad' en la línea de un Abono de Clientes de tipo artículo?

A) El stock aumenta, pero no se afecta el costo medio ponderado.
B) El documento no realiza ningún movimiento de inventario ni asiento de coste de ventas, limitándose a corregir las cuentas financieras de ingresos y saldo del cliente.
C) El documento genera un asiento en la cuenta de existencias pero no en la cuenta de clientes.
D) El sistema bloquea la creación del abono por descuadre contable.
Respuesta correcta: B
Justificación técnica: La casilla 'Sin contabilización de cantidad' inhabilita el impacto logístico y las contabilizaciones de inventario permanente (Stock / COGS), aplicando únicamente la corrección financiera en el libro mayor de clientes e ingresos.
Pregunta 2
Al cancelar una Factura de Clientes que se basó en una Entrega, ¿qué sucede con dicha Entrega base?

A) La Entrega se cancela automáticamente y se borra del sistema.
B) La Entrega se vuelve a abrir en el sistema para permitir generar una nueva factura limpia.
C) La Entrega permanece cerrada y obliga a crear un nuevo pedido de cliente.
D) Se crea un abono automático para la entrega.
Respuesta correcta: B
Justificación técnica: La función de cancelación de SAP Business One anula la factura, cierra y reconcilia los documentos fiscales correspondientes y reabre el documento base previo (la entrega) para que pueda volver a utilizarse.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
