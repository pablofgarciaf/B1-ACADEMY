# Guion de Video: DOC 039 ItemInv SerialNumbers Batches

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 039 ItemInv SerialNumbers Batches.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 039: GESTIÓN DE NÚMEROS DE SERIE Y LOTES (SAP BUSINESS ONE 10.0)
Código de Manual: 10_ItemInv_51_SNBatch_SNBatch_ES
Módulo Oficial: Artículos e Inventario / Números de Serie y Lotes (Serial Numbers & Batches - MM)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Gestores de Calidad, Jefes de Soporte Técnico y Agentes IA (Antigravity)
Carpeta Asociada: 039_10_ItemInv_51_SNBatch_SNBatch_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "039",

  "topic": "Serial Numbers and Batch Management (Traceability and Management Methods)",

  "sap_module": "Inventory_Traceability",

  "item_master_configuration": {

    "table": "OITM",

    "serial_flag": "OITM.ManSerNum ('Y'/'N')",

    "batch_flag": "OITM.ManBtchNum ('Y'/'N')",

    "management_method": {

      "field": "OITM.SrMnBtPrp",

      "values": {

        "A": "En cada transacción (On Every Transaction) - Obligatorio en entradas y salidas",

        "R": "Sólo en salida (On Release Only) - Opcional en compras, obligatorio al despachar"

      }

    },

    "mutual_exclusion": "Un artículo puede gestionarse por Números de Serie O por Lotes, pero NUNCA por ambos métodos simultáneamente"

  },

  "database_tables": {

    "serial_numbers_master": {

      "table": "OSRN",

      "primary_key": "AbsEntry",

      "fields": ["DistNumber (Número de serie del fabricante)", "MnfSerial (Número de serie interno)", "LotNumber", "ExpDate", "WarrantyStart", "WarrantyEnd"]

    },

    "batches_master": {

      "table": "OBTN",

      "primary_key": "AbsEntry",

      "fields": ["DistNumber (Código de lote)", "ExpDate (Fecha de vencimiento)", "MnfDate (Fecha de fabricación)", "InDate (Fecha de ingreso)", "PrdDesc"]

    },

    "transaction_allocations": {

      "serials_in_transactions": "SRI1",

      "batches_in_transactions": "IBT1",

      "serial_quantities_in_stock": "OSRI",

      "batch_quantities_in_stock": "OIBT"

    },

    "service_integration": {

      "customer_equipment_card": "OINS",

      "description": "Se crea automáticamente una Tarjeta de Equipo para el cliente al vender un artículo con número de serie mediante una Entrega o Factura de Clientes"

    }

  },

  "menu_paths": [

    "Inventario > Gestión de artículos > Números de serie > Gestión de números de serie",

    "Inventario > Gestión de artículos > Lotes > Gestión de lotes",

    "Servicio > Tarjeta de equipo de cliente",

    "Inventario > Informes de inventario > Informe de transacciones de números de serie / lotes"

  ],

  "business_rules": {

    "delivery_lock": "Una vez que una Entrega (ODLN) asigna y despacha un número de serie, la Factura de Clientes (OINV) basada en esa entrega no permite alterar los números de serie asignados",

    "optional_order_reservation": "Los Pedidos de Cliente (ORDR) y Solicitudes de Traslado (OWTQ) admiten la asignación opcional anticipada de números de serie/lote para apartar unidades específicas para clientes VIP",

    "auto_creation_on_receipt": "Bajo el método 'Sólo en salida', el sistema permite generar automáticamente números de serie consecutivos al recibir compras, posponiendo la parametrización de atributos"

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Criterios de Selección: Números de Serie vs Lotes
SAP Business One ofrece dos herramientas complementarias para la trazabilidad profunda del ciclo de vida de los inventarios:

Números de Serie (Serial Numbers):
Rastrea cada unidad física individual de forma unívoca (relación 1:1).
Criterios de aplicabilidad: Bienes de alto valor monetario (laptops, servidores, maquinaria, vehículos) o artículos que requieren control de garantías, contratos de servicio postventa y mantenimiento técnico preventivo.
Integración con Módulo de Servicio: Al despachar un artículo serializado en una Entrega o Factura, el sistema crea automáticamente una Tarjeta de Equipo del Cliente (OINS), habilitando llamadas de servicio y seguimiento de contratos de mantenimiento.
Lotes (Batches):
Rastrea grupos de artículos que comparten características homogéneas (relación 1:N).
Criterios de aplicabilidad: Bienes perecibles con fecha de caducidad (alimentos, lácteos, medicamentos, reactivos químicos) o productos con variaciones intrínsecas de producción (partidas de pintura por tono de color, granos por calibre, telas por tintada).
Permite gestionar fechas de vencimiento, fechas de fabricación, cuarentena de lotes y atributos de calidad.
2.2 Métodos de Gestión: "En cada transacción" vs "Sólo en salida"
El campo Método de gestión (OITM.SrMnBtPrp) define la exigencia operativa en los almacenes:
A. Método "En cada transacción" (On Every Transaction)
Control Máximo: Exige identificar y registrar los atributos del número de serie o lote en el momento exacto en que la mercancía toca el almacén (Entrada de mercancías por pedido OPDN, Entradas directas OIGN o Recibos de producción).
Cada movimiento interno posterior (traslados de bodega, recuentos, salidas a producción, despachos) exige validar qué serie o lote específico se mueve.
Garantiza que la empresa conoce con total certeza cuáles piezas exactas tiene en inventario y cuáles se entregaron a cada cliente.
B. Método "Sólo en salida" (On Release Only)
Flexibilidad Operativa: En el momento de la compra o recepción, no es obligatorio ingresar los números de serie o lote. El personal de muelle puede recibir 500 unidades rápidamente sin escanear códigos individuales.
El ingreso se registra como stock regular. Sin embargo, en el instante en que el artículo va a salir del almacén (Entregas ODLN, Salidas de mercancías OIGE, Facturas directas o Traslados entre bodegas), el sistema detiene el documento y obliga a seleccionar o crear los números de serie/lote correspondientes.
Creación Automática en Entrada: Opcionalmente, el sistema puede generar números correlativos automáticos al recibir, permitiendo que el personal complete los números de serie reales del fabricante en una etapa posterior antes del despacho.
2.3 Asignación Anticipada en Documentos de Compromiso
En los flujos estándar de ventas, la asignación de números de serie o lotes se efectúa al despachar (ODLN).
Sin embargo, SAP Business One permite realizar una Asignación Opcional en el Pedido de Cliente (ORDR) o en la Factura de Reserva:
Permite que el ejecutivo comercial reserve un equipo específico (ej. un servidor de demostración con número de serie SRV-9901) para un cliente preferente.
Al asignarse en el pedido, ese número de serie queda reservado y bloqueado; ningún otro pedido, entrega o traslado puede seleccionarlo.
Si el pedido de cliente se cancela o se cierra, la reserva del número de serie se libera automáticamente para el stock general.
Bloqueo en Factura: Si una Factura de Clientes se crea copiando desde una Entrega previa, los números de serie ya salieron físicamente de la bodega y no pueden ser alterados en la factura.


3. CASO DE NEGOCIO RESUELTO: TRAZABILIDAD INTEGRAL EN OEC COMPUTERS
Contexto del Proyecto:
OEC Computers comercializa dos familias de productos con exigencias de trazabilidad disímiles:

Computadoras Portátiles Profesionales: Equipos de $1,200 USD gestionados por Números de Serie bajo el método En cada transacción para garantizar cobertura de garantía y soporte técnico.
Cartuchos de Tóner Láser: Consumibles de $80 USD gestionados por Lotes bajo el método En cada transacción para controlar fechas de caducidad química de los polvos de impresión.
Operación 1: Venta y Garantía de Computadora Portátil
El proveedor entrega 10 computadoras en la Entrada de mercancías por pedido. El operario digita los 10 números de serie del fabricante (SN-DELL-001 a SN-DELL-010).
Se vende la unidad SN-DELL-003 al cliente C20000 - Microchips S.A. mediante una Entrega (ODLN).
Al grabar la entrega:
El número de serie SN-DELL-003 sale del inventario activo de la tabla OSRI y queda registrado en el histórico de transacciones SRI1.
SAP Business One crea automáticamente una Tarjeta de Equipo del Cliente en el módulo de Servicio, vinculando el equipo al cliente C20000 con 12 meses de garantía.
Dos meses después, el cliente llama reportando una falla de teclado; el departamento de soporte localiza la ficha instantáneamente por el número de serie.
Operación 2: Gestión de Caducidad de Tóner por Lote
Se compran 50 cartuchos de tóner asignados al Lote LOT-2026-B con fecha de vencimiento al 2027-12-31.
En las entregas de ventas, los operarios visualizan la fecha de caducidad en la ventana de asignación de lotes, asegurando la rotación FIFO de los cartuchos más próximos a vencer.


4. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál es la diferencia operativa entre el método de gestión "En cada transacción" y el método "Sólo en salida" para un artículo con números de serie en SAP Business One?
A) "En cada transacción" solo permite serializar artículos de producción interna, mientras que "Sólo en salida" es para compras.
B) "En cada transacción" exige registrar los números de serie tanto en las recepciones de entrada como en las salidas de inventario; "Sólo en salida" hace opcional el registro en compras y lo exige de forma obligatoria únicamente al emitir el stock del almacén.
C) "Sólo en salida" no permite utilizar números de serie en clientes extranjeros.
D) No existe diferencia, ambos métodos operan exactamente igual.
Respuesta Correcta: B
Justificación Técnica: El método Sólo en salida proporciona flexibilidad en la recepción de mercancías, postergando la individualización de los números de serie hasta el momento de despachar hacia clientes o transferir entre bodegas.
Pregunta 2
Si una Factura de Clientes se genera copiando directamente desde una Entrega de mercancías que ya asignó números de serie, ¿qué acción puede realizar el usuario respecto a dichos números de serie en la factura?
A) Puede cambiar libremente los números de serie por otros disponibles en stock.
B) No puede modificar los números de serie asignados, ya que el movimiento físico de inventario se ejecutó y cerró en la Entrega precedente.
C) Debe volver a escanear todos los números de serie para validar el documento.
D) Los números de serie se eliminan automáticamente del registro.
Respuesta Correcta: B
Justificación Técnica: En el flujo de ventas, la Entrega (ODLN) es el documento que ejecuta la salida física del inventario y consolida la asignación de series en SRI1. La Factura posterior tiene impacto contable y fiscal, pero no puede alterar la realidad física ya consumada.
Pregunta 3
¿Qué registro crea automáticamente SAP Business One en el sistema cuando se emite un documento de Entrega de ventas para un artículo gestionado por números de serie?
A) Una lista de materiales de ensamblaje.
B) Una Tarjeta de Equipo del Cliente en el módulo de Servicio para la trazabilidad de garantías y contratos de soporte.
C) Una orden de compra de reposición automática.
D) Un contrato de reventa con el fabricante.
Respuesta Correcta: B
Justificación Técnica: La serialización unitaria en SAP Business One está intrínsecamente integrada con el módulo de Servicio al Cliente, disparando la creación automática de la Tarjeta de Equipo (OINS) al momento de la venta.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
