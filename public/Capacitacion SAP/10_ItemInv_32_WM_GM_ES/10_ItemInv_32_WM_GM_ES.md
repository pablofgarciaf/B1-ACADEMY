UNIDAD 037: MOVIMIENTOS DE MERCANCÍAS Y TRASLADOS DE INVENTARIO (SAP BUSINESS ONE 10.0)
Código de Manual: 10_ItemInv_32_WM_GM_ES
Módulo Oficial: Artículos e Inventario / Movimientos de Mercancías (Goods Movements - MM)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Contadores de Costos, Jefes de Logística y Agentes IA (Antigravity)
Carpeta Asociada: 037_10_ItemInv_32_WM_GM_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "037",

  "topic": "Goods Movements and Inventory Transfers (Receipts, Issues, and Transfer Requests)",

  "sap_module": "Inventory_GoodsMovements",

  "transactional_documents": {

    "goods_receipt": {

      "header_table": "OIGN",

      "lines_table": "IGN1",

      "description": "Entrada de mercancías no vinculada a compras ni producción (muestras, inventario inicial, donaciones)",

      "accounting_entry": "Debe: Cuenta de Existencias | Haber: Cuenta de Compensación de Stocks (Incremento)",

      "pricing_rule": "El usuario ingresa libremente el costo/precio unitario que valorizará el ingreso en el inventario"

    },

    "goods_issue": {

      "header_table": "OIGE",

      "lines_table": "IGE1",

      "description": "Salida de mercancías no vinculada a ventas (mermas, desguace, muestras de marketing, obsolescencia)",

      "accounting_entry": "Debe: Cuenta de Compensación de Stocks (Reducción / Gastos de Merma) | Haber: Cuenta de Existencias",

      "pricing_rule": "El sistema extrae estrictamente el costo actual del artículo (AvgPrice/FIFO/Estándar); el campo precio es meramente informativo"

    },

    "inventory_transfer_request": {

      "header_table": "OWTQ",

      "lines_table": "WTQ1",

      "description": "Solicitud formal de traslado entre almacenes; no genera movimientos contables ni físicos",

      "stock_impact": {

        "from_warehouse": "Incrementa cantidad Comprometida (IsCommited) y reduce Disponible",

        "to_warehouse": "Incrementa cantidad Solicitada / Pedida (OnOrder)"

      }

    },

    "inventory_transfer": {

      "header_table": "OWTR",

      "lines_table": "WTR1",

      "description": "Movimiento físico definitivo entre almacenes o ubicaciones de depósito",

      "accounting_entry": "Debe: Cuenta de Existencias (Almacén Destino) | Haber: Cuenta de Existencias (Almacén Origen)",

      "business_partner_support": "Admite vincular un Socio de Negocios (fundamental para almacenes en consignación)"

    }

  },

  "menu_paths": [

    "Inventario > Operaciones de stock > Entrada de mercancías",

    "Inventario > Operaciones de stock > Salida de mercancías",

    "Inventario > Operaciones de stock > Solicitud de traslado",

    "Inventario > Operaciones de stock > Traslado de inventario"

  ],

  "business_rules": {

    "no_business_partner_in_gm": "Las transacciones de Entrada de Mercancías (OIGN) y Salida de Mercancías (OIGE) no admiten Interlocutor Comercial (a diferencia de los documentos de compras y ventas)",

    "perpetual_inventory_trigger": "Bajo inventario permanente, cada entrada, salida o traslado entre almacenes con cuentas contables distintas genera un asiento automático en OJDT",

    "consignment_workflow": "Traslado de inventario al Almacén de Consignación del Cliente -> Stock sigue siendo propiedad de la empresa -> Factura de Clientes con referencia al Almacén de Consignación al consumirse las unidades"

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Tipología de Movimientos de Mercancías en SAP Business One
Los movimientos de inventario en SAP Business One se dividen en dos grandes categorías:

Movimientos Derivados de Marketing: Aquellos integrados en los ciclos de compras (Entrada de mercancías por pedido OPDN, Devolución de mercancías ORPD) o de ventas (Entregas ODLN, Devoluciones ORDN).
Movimientos Puros de Inventario: Operaciones directas de ajuste, recepción no comercial o traslado entre almacenes propios y de terceros.
2.2 Entrada de Mercancías (OIGN) vs Salida de Mercancías (OIGE)
Entrada de Mercancías (Goods Receipt):
Se utiliza cuando ingresan artículos al almacén sin una orden de compra o factura de proveedor previa.
Casos típicos: Recepción de muestras comerciales gratuitas para pruebas, carga de inventarios iniciales en implementaciones ("Go-Live"), sobrantes de inventario físico no explicados o donaciones recibidas.
Fijación de Costo: En este documento, el usuario debe ingresar el precio/costo del artículo, ya que dicho valor determinará la revalorización del costo promedio (AvgPrice) o la nueva capa FIFO en el inventario permanente.
Asiento Contable: Débito a la Cuenta de Existencias (Activo corriente) y Crédito a la Cuenta de Compensación de Stocks - Aumento (Cuenta de ingresos/contrapartida configurada en la Determinación de Cuentas de Mayor).
Salida de Mercancías (Goods Issue):
Se utiliza para dar de baja inventario sin generar una cuenta por cobrar ni facturación a un cliente.
Casos típicos: Mercancía destruida o dañada (inundaciones, roturas en bodega), mermas operativas, muestras gratuitas entregadas para ferias o exposiciones comerciales, o consumo interno departamental.
Fijación de Costo: A diferencia de la entrada, en la salida el usuario no puede alterar el costo contable; el sistema toma automáticamente el costo del método de valoración vigente. Si se visualiza un campo de precio, este cumple solo un fin estadístico o de lista de precios, pero la salida del balance se efectúa estrictamente al costo real.
Asiento Contable: Débito a la Cuenta de Compensación de Stocks - Reducción / Pérdida por Merma (Pérdidas y Ganancias) y Crédito a la Cuenta de Existencias (Disminución de Activo).
2.3 Solicitud de Traslado (OWTQ) vs Traslado de Inventario (OWTR)
Solicitud de Traslado (Inventory Transfer Request):
Documento preparatorio y de planificación logística que no mueve físicamente el stock ni crea asientos contables.
Impacto en Disponibilidad: $$\text{Disponible} = \text{En Stock} - \text{Comprometido} + \text{Solicitado}$$
En el Almacén Origen (Emisor): La cantidad se marca como Comprometida (IsCommited), reduciendo el disponible para evitar que ventas u otros traslados tomen esas unidades.
En el Almacén Destino (Receptor): La cantidad se marca como Solicitada / Pedida (OnOrder), alertando a los planificadores de que el stock está en tránsito o planificado.
Traslado de Inventario (Inventory Transfer):
Ejecuta el movimiento real. Resta del stock físico (OnHand) del almacén de origen y suma al stock físico del almacén de destino.
Asiento Contable: Si los almacenes emisor y receptor tienen asignadas cuentas de mayor independientes, el sistema debita la cuenta de existencias del almacén receptor y acredita la cuenta de existencias del almacén emisor por el costo total de las mercancías.
Soporte de Ubicaciones de Depósito (Bin Locations): Si uno o ambos almacenes están gestionados por ubicaciones, el traslado exige especificar la celda física de salida (From Bin) y la celda física de entrada (To Bin).
2.4 Gestión de Almacenes en Consignación
Cuando una empresa mantiene stock en las instalaciones físicas de un cliente para su consumo inmediato, se crea un almacén específico (ej. Almacén 07 - Consignación Cliente).
El traslado inicial desde la bodega central hacia el almacén del cliente se registra con un Traslado de Inventario, especificando el código del cliente en la cabecera.
Como el almacén en consignación sigue perteneciendo legalmente a la empresa, el stock permanece en el balance general de la compañía.
Cuando el cliente reporta el consumo de las mercancías, se emite una Factura de Clientes seleccionando como almacén de salida el Almacén 07. En ese momento se descuenta el stock y se reconoce el ingreso y el costo de ventas.


3. CASO DE NEGOCIO RESUELTO: GESTIÓN DE INCIDENCIAS Y TRASLADOS EN OEC COMPUTERS
Contexto del Proyecto:
OEC Computers gestiona el Almacén Central (01) y el Almacén Secundario (02). Durante el turno de operaciones se presentan tres situaciones:

Atención de Pedido Urgente: Llega un pedido de cliente por 5 computadoras portátiles en el Almacén 01, pero este solo dispone de 2 unidades físicas. En el Almacén 02 hay 10 unidades disponibles.
Daño de Mercancía: Una fuga de agua en el Almacén 01 estropea 3 monitores que quedan inutilizables.
Muestras Comerciales: Un proveedor entrega 2 prototipos de teclado ergonómico sin costo para evaluación técnica.
Pasos Operativos y Trazabilidad en SAP Business One:
Resolución del Pedido Urgente:
El operador crea una Solicitud de Traslado de Inventario del Almacén 02 al Almacén 01 por 3 unidades.
En el Almacén 02, la cantidad comprometida sube a 3. En el Almacén 01, la cantidad solicitada sube a 3.
El chofer del camión interno retira las computadoras; se copia la solicitud a un Traslado de Inventario.
Asiento contable: Débito a Existencias Almacén 01 por $1,500 y Crédito a Existencias Almacén 02 por $1,500. El Almacén 01 completa 5 unidades en stock y despacha la entrega al cliente.
Registro de la Merma por Agua:
Ruta: Inventario > Operaciones de stock > Salida de mercancías.
Se seleccionan los 3 monitores en el Almacén 01.
El sistema extrae el costo unitario de $120. Asiento generado:
Debe: 610000 - Pérdidas por Mermas y Desguace = $360.00
Haber: 140000 - Cuenta de Existencias Almacén 01 = $360.00
Ingreso de Prototipos Gratuitos:
Ruta: Inventario > Operaciones de stock > Entrada de mercancías.
Se ingresan los 2 teclados fijando un costo simbólico de $1.00 para permitir su inventario físico y trazabilidad interna.


4. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál es la diferencia fundamental en la determinación de precios entre un documento de Entrada de Mercancías (OIGN) y un documento de Salida de Mercancías (OIGE) en SAP Business One?
A) En la salida de mercancías el usuario fija el precio de venta y en la entrada se calcula automáticamente.
B) En la entrada de mercancías el usuario introduce manualmente el costo/precio del artículo para valorizar el inventario entrante, mientras que en la salida de mercancías el sistema utiliza obligatoriamente el costo actual del método de valoración del artículo.
C) Ambos documentos utilizan siempre la última lista de precios de compra.
D) Ninguno de los dos documentos genera asientos contables.
Respuesta Correcta: B
Justificación Técnica: Al ingresar stock sin factura comercial previa, el usuario define el valor del activo. Al retirar stock, para no generar desbalances en la valoración contable, SAP B1 extrae estrictamente el costo en libros vigente.
Pregunta 2
Al registrar una Solicitud de Traslado de Inventario con estado "Abierto", ¿qué efecto inmediato se produce en las cantidades de inventario de los almacenes emisor y receptor?
A) Se descuenta inmediatamente la cantidad en stock físico (OnHand) del almacén emisor.
B) En el almacén emisor la cantidad se registra como Comprometida (IsCommited), y en el almacén receptor la cantidad se registra como Solicitada (OnOrder), sin alterar las existencias físicas.
C) Se genera un asiento contable provisional en el Libro Mayor.
D) Se bloquea el almacén emisor para cualquier otra operación.
Respuesta Correcta: B
Justificación Técnica: La solicitud de traslado es una reserva logística. Afecta los balances de disponibilidad (IsCommited y OnOrder), pero no altera las existencias reales (OnHand) ni la contabilidad financiera hasta que se convierta en un Traslado definitivo.
Pregunta 3
¿Por qué un Traslado de Inventario permite especificar un Socio de Negocios en su cabecera, a diferencia de una Entrada o Salida de Mercancías pura?
A) Para facturar comisiones al transportista del flete.
B) Para gestionar traslados de inventario hacia o desde almacenes en consignación ubicados en las instalaciones de clientes o proveedores.
C) Es un error de diseño de la interfaz y no tiene utilidad práctica.
D) Para obligar al cliente a pagar el impuesto al valor agregado por adelantado.
Respuesta Correcta: B
Justificación Técnica: La asociación de un socio de negocios en un traslado permite formalizar remesas hacia bodegas de consignación (Consignment Stocks), manteniendo el control de qué cliente o proveedor custodia físicamente las existencias de la empresa.