# Guion de Video: DOC 081 Purch ItemsProcess

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 081 Purch ItemsProcess.

## Contenido Principal (Visual: Diapositivas correspondientes)
DOC_081: Proceso Estándar de Compra de Artículos (Aprovisionamiento en 4 Pasos)
1. Metadatos Técnicos y Contexto Curricular
Módulo SAP Business One: Gestión de Compras / Aprovisionamiento y Gestión de Stocks (Purchasing / A/P & Inventory Management).
Código de Archivo Fuente: 10_Purch_12_Process_Items_ES.pdf.
Versión del Sistema: SAP Business One 10.0 (HANA / SQL).
Nivel Curricular: Nivel 1 - Operación y Configuración del Flujo Transaccional Estándar.
Audiencia Objetivo: Consultores Logísticos, Analistas de Compras, Contadores de Costos, Administradores de Almacén.


2. JSON Antigravity Master Schema
{

  "antigravity_schema_version": "2.0.0",

  "unit_id": "SAP_B1_PURCH_081",

  "unit_title": "Proceso Estándar de Compra de Artículos en 4 Pasos",

  "technical_metadata": {

    "module": "Purchasing - A/P",

    "sap_object_types": [

      {"object_name": "Purchase Order", "object_type_code": "22", "table_header": "OPOR", "table_lines": "POR1"},

      {"object_name": "Goods Receipt PO", "object_type_code": "20", "table_header": "OPDN", "table_lines": "PDN1"},

      {"object_name": "A/P Invoice", "object_type_code": "18", "table_header": "OPCH", "table_lines": "PCH1"},

      {"object_name": "Outgoing Payment", "object_type_code": "46", "table_header": "OVPM", "table_lines": "VPM1"}

    ],

    "master_data_tables": ["OCRD", "OITM", "OITW", "NNM1", "OACT", "OJDT", "JDT1"]

  },

  "menu_navigation_paths": {

    "purchase_order": "Compras - Proveedores -> Pedido de Compras",

    "goods_receipt_po": "Compras - Proveedores -> Entrada de Mercancías de Pedido",

    "ap_invoice": "Compras - Proveedores -> Factura de Proveedores",

    "outgoing_payment": "Gestión de Bancos -> Pagos Efectuados -> Pagos Efectuados",

    "open_items_list": "Compras - Proveedores -> Informes de Compras -> Lista de Partidas Abiertas",

    "inventory_status": "Inventario -> Informes de Inventario -> Estado de Almacén"

  },

  "business_logic_matrix": {

    "step_1_purchase_order": {

      "accounting_impact": "Ninguno. No genera asiento en OJDT.",

      "inventory_quantity_impact": {

        "in_stock": 0,

        "committed": 0,

        "ordered": "+ Cantidad pedida",

        "available": "+ Cantidad pedida (Disponible = En Stock - Comprometido + Solicitado)"

      },

      "constraints": "Documento comercial vinculante. Define precios acordados, fechas y condiciones de pago."

    },

    "step_2_goods_receipt_po": {

      "accounting_impact": "Obligatorio en Inventario Permanente. Asiento: Débito a Cuenta de Existencias / Crédito a Cuenta de Compensación de Existencias (Allocation Account).",

      "inventory_quantity_impact": {

        "in_stock": "+ Cantidad recibida",

        "committed": 0,

        "ordered": "- Cantidad recibida",

        "available": "Sin cambio neto (+En Stock contrarrestado por -Solicitado)"

      },

      "cost_valuation_impact": "Actualiza el coste unitario del artículo para métodos Media Variable y FIFO según el precio de compra del documento.",

      "constraints": "No modificable tras ser añadido. Para correcciones se requiere Cancelación o Devolución de Mercancías."

    },

    "step_3_ap_invoice": {

      "accounting_impact": "Con referencia a EM: Débito a Cuenta de Compensación de Existencias / Débito a Cuenta de Impuesto Soportado (IVA) / Crédito a Cuenta del Proveedor (Reconciliation Account). Sin referencia previa: Débito a Cuenta de Existencias / Débito IVA / Crédito Proveedor.",

      "inventory_quantity_impact": {

        "in_stock": "0 si hace referencia a Entrada de Mercancías. + Cantidad si es Factura directa sin EM previa.",

        "committed": 0,

        "ordered": 0,

        "available": 0

      },

      "constraints": "Base fiscal y legal para el pago. Cierra la Entrada de Mercancías de base."

    },

    "step_4_outgoing_payment": {

      "accounting_impact": "Débito a Cuenta del Proveedor / Crédito a Cuenta de Mayor Bancaria o Caja Efectivo.",

      "reconciliation": "Efectúa automáticamente la reconciliación interna del saldo del socio de negocios."

    }

  }

}


3. Desarrollo Conceptual y Funcional Detallado
3.1. Arquitectura del Flujo Transaccional en 4 Pasos
El ciclo de compras de bienes físicos en SAP Business One está estructurado para garantizar la integridad operativa entre el almacén físico, las cuentas por pagar y la contabilidad financiera general.

+------------------+         +-------------------------------+         +---------------------------+         +----------------------+

| 1. Pedido (PO)   | ------> | 2. Entrada Mercancías (GRPO)  | ------> | 3. Factura de Proveedor   | ------> | 4. Pago Efectuado    |

| Tabla: OPOR/POR1 |         | Tabla: OPDN/PDN1              |         | Tabla: OPCH/PCH1          |         | Tabla: OVPM/VPM1     |

| Impacto: Solicitado|       | Impacto: Stock & Asiento EM   |         | Impacto: Deuda Proveedor  |         | Impacto: Saldo Banco |

+------------------+         +-------------------------------+         +---------------------------+         +----------------------+
3.2. Paso 1: Pedido de Compras (Purchase Order - OPOR)
Propósito y Validez Comercial: Representa un documento contractual formal enviado al proveedor donde se estipulan los códigos de artículo (ItemCode), cantidades, unidades de medida, precios unitarios pactados, descuentos y fechas prometidas de entrega.
Impacto en Inventario: $$\text{Cantidad Disponible} = \text{En Stock} - \text{Comprometido} + \text{Solicitado}$$ Al añadir un Pedido, el campo OITW.OnHand permanece inalterado, pero OITW.OnOrder (Solicitado) se incrementa de inmediato. Esto aumenta la disponibilidad proyectada del artículo para responder a futuros pedidos de clientes sin generar alertas falsas de quiebre de stock.
Impacto Contable: Totalmente neutro. No se genera ningún registro contable en OJDT / JDT1 ya que no ha existido transferencia física de propiedad ni devengo de pasivo exigible.
Determinación de Direcciones en la Ficha Logística:
Dirección de Envío (Ship-to Address): Define el lugar donde el proveedor entregará las mercancías. En Gestión -> Inicialización del Sistema -> Parametrizaciones de Documento -> Ficha General, existe la casilla Usar dirección de almacén. Si está marcada, el documento toma la dirección configurada en el almacén de la primera línea (OWHS.Street, etc.); si no está marcada, adopta la dirección corporativa de la empresa (OADM).
Dirección de Pago (Pay-to Address): Se hereda directamente del registro maestro del socio de negocios (OCRD.BillToDef). Esta dirección es crítica puesto que es la que se imprime en los cheques y en las transferencias bancarias generadas en la fase de pago.
3.3. Paso 2: Entrada de Mercancías de Pedido (Goods Receipt PO - OPDN)
Momento Operativo: Es emitido en el muelle de descarga por el recepcionista de almacén tras cotejar el albarán/guía de remisión física del transportista.
Efectos en Inventario:
La cantidad en OITW.OnHand (En Stock) se incrementa de inmediato.
La cantidad en OITW.OnOrder (Solicitado) disminuye en la misma proporción recibida.
Si la recepción cubre la totalidad del pedido base, el estado del pedido cambia de Abierto a Cerrado.
Efectos Contables en Inventario Permanente: Se crea automáticamente un asiento contable en OJDT:
Débito: Cuenta de Existencias / Inventario (según la determinación de cuentas de mayor en OITB o OGDR).
Crédito: Cuenta de Compensación de Existencias / Asignación de Compras (Goods Receipt / Invoice Receipt Clearing Account).
Valoración y Costeo: Para artículos controlados por Media Variable o FIFO, el costo unitario del artículo en inventario se recalcula de acuerdo con el precio de compra y costos adicionales declarados en la línea del documento.
Inmutabilidad: Una vez registrada la Entrada de Mercancías, no puede ser modificada. La única vía para revertirla o corregirla es emitir una Cancelación formal o un documento de Devolución de Mercancías.
3.4. Mecanismos de Trazabilidad: Copiar a vs. Copiar de
SAP Business One ofrece dos vías para encadenar documentos:

Copiar a (Copy To): Desde el documento base abierto (ej. Pedido), se presiona el botón inferior derecho Copiar a -> Entrada de mercancías de pedido. El sistema traslada el 100% de las líneas al documento destino. El usuario puede modificar cantidades hacia abajo o eliminar filas antes de grabar.
Copiar de (Copy From): Desde un documento destino nuevo en blanco (ej. Entrada de Mercancías), tras ingresar el código de proveedor (CardCode), se presiona Copiar de -> Pedidos. Se abre el Asistente de Creación de Documentos, permitiendo seleccionar múltiples pedidos pendientes, configurar la regla de arrastre de tipo de cambio y filtrar líneas individuales.
Cierre de Documentos Base: Cuando la cantidad acumulada en los documentos destino iguala la cantidad del documento base, este último se cierra automáticamente y pasa a color gris claro en pantalla.
3.5. Paso 3: Factura de Proveedores (A/P Invoice - OPCH)
Propósito: Registro contable y tributario de la factura formal emitida por el proveedor.
Contabilización con Entrada de Mercancías Previa:
Débito: Cuenta de Compensación de Existencias (Cancela el saldo transitorio creado en el paso 2).
Débito: Cuenta de IVA Crédito Fiscal / Impuesto Soportado.
Crédito: Cuenta del Proveedor (OCRD.DebPayAcct - Pasivo exigible).
Inventario Físico: No sufre ninguna alteración (ya fue incrementado en la EM).
Contabilización sin Entrada Previa (Factura Directa): Si la factura se registra directamente sin pasar por EM, la factura asume el doble rol: actualiza las existencias en almacén (OITW.OnHand + Qty) y genera el pasivo con el proveedor debitando directamente la Cuenta de Inventario.
3.6. Paso 4: Pagos Efectuados (Outgoing Payment - OVPM)
Ejecución: Desde el módulo de Gestión de Bancos. Puede realizarse documento a documento o masivamente mediante el Asistente de Pagos (Payment Wizard).
Efecto Contable:
Débito: Proveedor (Disminuye la cuenta por pagar).
Crédito: Banco / Caja Efectivo / Medios de Pago.
Reconciliación Interna: El sistema concilia el saldo deudor del pago con el saldo acreedor de la factura en OITR / ITR1, dejando las partidas en estado conciliado.
3.7. Supervisión con la Lista de Partidas Abiertas (Open Items List)
Ubicada en Compras -> Informes de Compras -> Lista de Partidas Abiertas. Permite al departamento de compras y almacén auditar en tiempo real:

Pedidos pendientes de entrega.
Entradas de mercancías pendientes de facturación (pasivos no devengados).
Facturas pendientes de pago. Permite abrir los documentos directamente o ejecutar conversiones masivas con un solo clic.


4. Caso de Negocio Resuelto: OEC Computers
Contexto
OEC Computers comercializa impresoras multifunción láser modelo PRN-LSR01.

Stock inicial: 10 unidades a un costo de $200.00 c/u en el Almacén 01 (General).
Stock mínimo requerido: 15 unidades.
Acción: El comprador emite el Pedido Nº 401 por 5 impresoras al proveedor V10000 - Far East Imports a un precio pactado de $220.00 c/u + 10% IVA.
Ejecución Paso a Paso
Creación del Pedido Nº 401:
Estado de almacén resultante:
En stock: 10
Comprometido: 0
Solicitado: 5
Disponible: $10 - 0 + 5 = 15$ unidades.
Contabilidad: Sin asientos contables.
Recepción con Entrada de Mercancías Nº 705:
El transportista entrega las 5 impresoras con su albarán. El bodeguero hace Copiar a -> Entrada de mercancías de pedido.
Estado de almacén resultante:
En stock: 15
Comprometido: 0
Solicitado: 0
Disponible: $15 - 0 + 0 = 15$ unidades.
Asiento Contable generado por $1,100.00 (5 x $220.00):
Débito: 140000 - Inventario de Mercaderías -> $1,100.00
Crédito: 211050 - Compensación de Existencias (Allocation) -> $1,100.00
Nuevo costo promedio en almacén: $$\text{Costo Promedio} = \frac{(10 \times 200) + (5 \times 220)}{15} = \frac{2000 + 1100}{15} = \frac{3100}{15} = 206.67 \text{ USD/unidad}$$
Recepción y Registro de Factura de Proveedor Nº 902:
El proveedor envía la factura por 5 unidades a $220.00 ($1,100.00) + $110.00 IVA = $1,210.00 total.
Asiento Contable generado:
Débito: 211050 - Compensación de Existencias -> $1,100.00 (Queda en cero)
Débito: 119010 - IVA Crédito Tributario en Compras -> $110.00
Crédito: 211010 - Cuentas por Pagar Proveedor Far East Imports -> $1,210.00
Inventario: Sin movimientos.
Emisión de Pago Efectuado Nº 310:
Tesorería emite transferencia bancaria por $1,210.00.
Asiento Contable generado:
Débito: 211010 - Cuentas por Pagar Proveedor Far East Imports -> $1,210.00 (Deuda saldada)
Crédito: 111020 - Banco Nacional Cta. Cte. -> $1,210.00
Reconciliación interna efectuada automáticamente entre Factura 902 y Pago 310.


5. Banco de Evaluación Situacional (Certificación SAP B1)
Pregunta 1
Un comprador introduce un Pedido de Compras a un proveedor extranjero por 100 servidores. ¿Cuál es el impacto exacto en el balance general de la empresa y en el informe de auditoría de stocks tras guardar el pedido?

A) Se debita la cuenta de inventario y se acredita la cuenta de proveedores no facturados; el stock físico aumenta en 100.
B) Se debita la cuenta de compras solicitadas y se acredita compromisos futuros; el stock comprometido aumenta en 100.
C) No se genera ningún asiento en el libro mayor; el stock físico no cambia, pero la cantidad solicitada se incrementa en 100, aumentando el stock disponible.
D) Se crea un asiento preliminar en borrador y se bloquea la cantidad en el almacén de destino.
Respuesta Correcta: C
Justificación Técnica: Los pedidos de compra representan un compromiso comercial sin efectos contables ni movimientos físicos reales de inventario. Afectan exclusivamente los niveles de planificación aumentando OITW.OnOrder (Solicitado) y por ende Disponible = OnHand - IsCommited + OnOrder.
Pregunta 2
En una empresa que opera con inventario permanente y valoración por Media Variable, ¿en qué momento exacto del ciclo de compras se actualiza el costo promedio unitario del artículo en el almacén?

A) Al añadir el Pedido de Compras (OPOR).
B) Al añadir la Entrada de Mercancías de Pedido (OPDN).
C) Al registrar la Factura de Proveedores (OPCH).
D) Al ejecutar el Pago Efectuado (OVPM).
Respuesta Correcta: B
Justificación Técnica: La Entrada de Mercancías de Pedido es el hito logístico donde las existencias ingresan físicamente al almacén y se reconocen contablemente contra la cuenta de compensación. En ese instante se recalculan las existencias físicas y el costo unitario ponderado en OITW. La factura posterior no altera el costo salvo que existan desviaciones de precios o costos de importación adicionales.
Pregunta 3
¿Qué cuenta contable intermedia se utiliza en SAP Business One para asegurar que el inventario recibido en una Entrada de Mercancías no quede desbalanceado antes de que el proveedor emita la factura formal?

A) Cuenta de Diferencias de Conversión.
B) Cuenta de Pérdidas y Ganancias por Compras.
C) Cuenta de Compensación de Existencias / Asignación de Compras (Allocation Account).
D) Cuenta de Gastos No Deducibles.
Respuesta Correcta: C
Justificación Técnica: La cuenta de compensación de existencias (asignación) actúa como pasivo transitorio no liquidado. Se acredita en la EM de Pedido al ingresar el activo, y se debita y salda en cero cuando se contabiliza la Factura de Proveedores.
Pregunta 4
Un usuario necesita generar una Entrada de Mercancías seleccionando líneas específicas de tres Pedidos de Compra diferentes dirigidos al mismo proveedor. ¿Cuál es el procedimiento estándar recomendado?

A) Abrir el primer pedido y usar Copiar a, luego abrir el segundo pedido y repetir.
B) Crear una nueva Entrada de Mercancías, seleccionar el Proveedor y utilizar el botón Copiar de -> Pedidos para iniciar el Asistente de Creación de Documentos.
C) Duplicar los tres pedidos en un único pedido consolidado mediante Data Transfer Workbench.
D) Es imposible consolidar varios pedidos en una sola Entrada de Mercancías en SAP Business One.
Respuesta Correcta: B
Justificación Técnica: La función Copiar de inicia el asistente donde se pueden seleccionar múltiples pedidos base pendientes para el mismo interlocutor comercial, seleccionando qué líneas y cantidades se arrastran a la Entrada de Mercancías de destino.
Pregunta 5
Si una empresa recibe una factura de proveedor por servicios de flete y papelería que no requieren recepción de almacén previa y no tienen pedidos previos en el sistema, ¿qué sucede con los niveles de stock al registrar la Factura de Proveedores directa si se utiliza una línea de tipo Artículo?

A) El stock no sufre modificaciones porque el sistema exige una Entrada de Mercancías previa.
B) El stock en almacén aumenta de inmediato y se crea un asiento directo debitando la cuenta de existencias y acreditando al proveedor.
C) El sistema bloquea el documento con un error de validación de almacén obligatorio.
D) La factura queda guardada como borrador preliminar de forma obligatoria.
Respuesta Correcta: B
Justificación Técnica: Cuando una Factura de Proveedores de tipo artículo se registra sin vincular a una Entrada de Mercancías previa, el sistema asume que la recepción física ocurre en ese mismo acto, incrementando las existencias físicas y debitando directamente la cuenta de inventario. Por ello, para compras que no deban mover stock se debe utilizar el tipo Servicio o artículos con la casilla Artículo de inventario desmarcada en OITM.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
