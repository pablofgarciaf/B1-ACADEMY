# Guion de Video: DOC 093 Sales ReturnsExchange

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 093 Sales ReturnsExchange.

## Contenido Principal (Visual: Diapositivas correspondientes)
Unidad 093: Gestión de Devoluciones e Intercambios en Ventas
Metadatos Técnicos
Módulo: Ventas - Clientes / Logística Inversa
Código de Unidad: DOC_093_Sales_ReturnsExchange
Versión de SAP Business One: 10.0
Audiencia Objetivo: Administradores de Almacén, Contadores, Consultores de Logística y Ventas


JSON Antigravity Master Schema
{

  "$schema": "https://antigravity.schema.sap.b1/v10/sales_returns.json",

  "unit_id": "093_10_Sales_51_Issues_ReturnsExchange_ES",

  "technical_module": "Sales Logistics & Reverse Flow",

  "database_tables": {

    "return_request": "ORRR",

    "return_request_lines": "RRR1",

    "returns": "ORDN",

    "returns_lines": "RDN1",

    "delivery": "ODLN",

    "sales_order": "ORDR"

  },

  "menu_paths": {

    "return_request": "Ventas - Clientes -> Solicitud de devolución",

    "returns": "Ventas - Clientes -> Devolución",

    "reopen_order_setting": "Gestión -> Inicialización del sistema -> Parametrizaciones de documento -> Ficha Por documento -> Pedido de cliente -> Permitir volver a abrir pedidos al crear devoluciones"

  },

  "business_rules": {

    "return_restrictions": "Una Devolución (ORDN) solo puede anular los efectos de una Entrega (ODLN). Si ya existe una Factura de Clientes (OINV), NO se puede utilizar una Devolución; debe usarse un Abono de Clientes.",

    "return_accounting": "La Devolución debita la Cuenta de Devoluciones y acredita la Cuenta de Coste de Mercancías Vendidas (COGS) por el valor del coste del artículo devuelto.",

    "return_request_nature": "La Solicitud de Devolución (ORRR) es un documento previo no vinculante (RMA) que no afecta inventario físico ni contabilidad; incrementa el estado Solicitado y reduce Disponible.",

    "reopening_sales_order": "Permite que la cantidad devuelta vuelva a quedar abierta en el Pedido de Cliente original para reentrega sin necesidad de duplicar pedidos.",

    "negative_rows": "Permite incluir líneas con cantidad negativa en Entregas o Facturas para gestionar intercambios inmediatos de productos (reemplazo del dañado)."

  }

}


Desarrollo Conceptual y Funcional Detallado
1. El Circuito de Devolución Física (ORDN)
Cuando una entrega (ODLN) no ha sido facturada y el cliente rechaza mercancías defectuosas:

Se genera una Devolución con referencia a la Entrega.
Efecto de Stock: Incrementa las existencias en el almacén especificado (se aconseja remitir a un almacén de cuarentena/averías).
Efecto Contable (Inventario Permanente):
Debe: Cuenta de Devoluciones de Ventas (o cuenta de existencias si no se segrega).
Haber: Cuenta de Coste de Ventas (COGS).
Se cancela el costo imputado originalmente en la entrega.
2. Solicitud de Devolución (RMA - ORRR)
Documento de autorización formal (Return Material Authorization):

Se puede originar tanto de una Entrega como de una Factura de Clientes.
Genera el número de RMA para el cliente y registra el motivo formal de reclamo.
Al procesar físicamente el retorno, el sistema convierte la solicitud automáticamente en una Devolución (si provenía de Entrega) o en un Abono de Clientes (si provenía de Factura).
3. Reapertura de Pedidos de Ventas para Reentrega
En Parametrizaciones de Documento para Pedidos de Clientes, se puede activar la opción:

Permitir volver a abrir pedidos al crear devoluciones basadas en entregas.
Al registrar la devolución de $N$ unidades, el pedido base pasa de estado Cerrado a Abierto, con una cantidad pendiente igual a $N$.
Permite generar una nueva entrega transparente sin rehacer cotizaciones ni pedidos.
4. Intercambios Directos mediante Líneas Negativas
Para cambiar un artículo dañado por otro sin emitir múltiples documentos:

En una Entrega o Factura, se introduce el nuevo artículo con cantidad positiva (+1).
Se añade una línea para el artículo defectuoso con cantidad negativa (-1).
El documento neto entrega el reemplazo, reingresa el defectuoso al inventario y ajusta el saldo contable correspondiente.


Caso de Negocio Resuelto: OEC Computers
Escenario
Un cliente adquirió 10 teclados inalámbricos mediante la Entrega #450. Al recibirlos, reporta que 3 unidades presentan fallas de fábrica:

OEC Computers genera una Solicitud de Devolución por 3 unidades, asignando el código de motivo Falla de hardware.
El cliente envía los 3 teclados rotulando el número de RMA #102.
Al recibirlos en bodega, el almacenista copia la Solicitud a una Devolución ingresando el stock al almacén de averías 03-Defectuosos.
El sistema reabre automáticamente el Pedido de Ventas base por las 3 unidades, permitiendo que bodega despache de inmediato 3 teclados nuevos en una segunda entrega limpia.


Banco de Evaluación Situacional
Pregunta 1
Si una Entrega ya ha sido copiada completamente a una Factura de Clientes en SAP Business One, ¿es posible registrar un documento de Devolución para devolver la mercancía al inventario?

A) Sí, siempre que la factura esté en estado abierto.
B) Sí, pero requiere autorización de un superusuario.
C) No, una Devolución solo puede generarse antes de facturar; una vez creada la factura debe usarse un Abono de Clientes o una Solicitud de Devolución hacia Abono.
D) Sí, cancelando previamente la cuenta asociada del cliente.
Respuesta correcta: C
Justificación técnica: Por consistencia legal y contable, una Devolución solo revierte una Entrega; tras la emisión de una Factura de Clientes, cualquier retorno físico o financiero exige un Abono de Clientes (Credit Memo).
Pregunta 2
¿Cuál es el impacto financiero y contable en el libro mayor al registrar una Solicitud de Devolución (RMA)?

A) Debita Existencias y acredita Coste de Ventas.
B) Ninguno, la Solicitud de Devolución no genera asientos contables en el libro mayor.
C) Genera un asiento provisional en la cuenta puente de devoluciones.
D) Disminuye la cuenta de Ingresos por Ventas.
Respuesta correcta: B
Justificación técnica: La Solicitud de Devolución es un documento puramente logístico y de autorización; actualiza cantidades pedidas/disponibles para planificación, pero no genera transacciones contables.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
