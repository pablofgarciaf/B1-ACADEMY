# Guion de Video: DOC 080 Purch OverviewProcess

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 080 Purch OverviewProcess.

## Contenido Principal (Visual: Diapositivas correspondientes)
Unidad 080: Conceptos Básicos y Flujo del Proceso de Compras en SAP Business One 10.0
Metadatos Técnicos
Módulo: Compras - Proveedores (Purchasing - A/P)
Código de Documento: DOC_080_Purch_OverviewProcess
Audiencia Objetivo: Consultores Logísticos y Financieros, Responsables de Aprovisionamiento, Jefes de Almacén y Contadores de Cuentas por Pagar.
Prerrequisitos: Conceptos de Datos Maestros de Artículos y Socios de Negocios, Sistema de Inventario Continuo y Fundamentos Contables.
Versión SAP B1: SAP Business One 10.0 FP 2008 / HANA & SQL.


JSON Antigravity Master Schema
{

  "unit_id": "080",

  "document_code": "DOC_080_Purch_OverviewProcess",

  "topic": "Procurement Process Lifecycle, Inventory & Financial Postings, Streamlined Purchasing",

  "module": "Purchasing",

  "version": "10.0",

  "data_architecture": {

    "primary_tables": [

      {

        "table_name": "OPOR / POR1",

        "description": "Purchase Order Header and Lines (Pedido de compras, compromiso legal sin asiento contable)",

        "key_fields": ["DocEntry", "DocNum", "CardCode", "DocDate", "DocTotal", "ItemCode", "Quantity", "Price", "LineStatus"]

      },

      {

        "table_name": "OPDN / PDN1",

        "description": "Goods Receipt PO Header and Lines (Entrada de mercancías de pedido, recepción física y asiento de existencias vs dotación)",

        "key_fields": ["DocEntry", "DocNum", "BaseEntry", "BaseLine", "CardCode", "ItemCode", "Quantity", "Price", "WhsCode"]

      },

      {

        "table_name": "OPCH / PCH1",

        "description": "A/P Invoice Header and Lines (Factura de proveedores, reconocimiento de pasivo y liquidación de cuenta puente)",

        "key_fields": ["DocEntry", "DocNum", "BaseEntry", "BaseLine", "CardCode", "DocTotal", "ItemCode", "Price", "VatSum"]

      },

      {

        "table_name": "OVPM / VPM1",

        "description": "Outgoing Payments (Pagos efectuados, cancelación de pasivo del proveedor vía bancos o caja)",

        "key_fields": ["DocEntry", "DocNum", "CardCode", "DocDate", "CashSum", "TrsfrSum", "CheckSum"]

      },

      {

        "table_name": "OCRD",

        "description": "Business Partner Master Data (Maestro de proveedores, condiciones de pago y cuentas asociadas)",

        "key_fields": ["CardCode", "CardName", "CardType", "GroupCode", "DebPayAcct"]

      },

      {

        "table_name": "OITM",

        "description": "Item Master Data (Datos de compra, proveedor por defecto, UdM de compra y cuentas contables)",

        "key_fields": ["ItemCode", "ItemName", "PrchseItem", "InvntItem", "CardCode", "BuyUnitMsr", "NumInBuy"]

      },

      {

        "table_name": "OINM",

        "description": "Warehouse Journal (Kardex físico y financiero de movimientos de stock)",

        "key_fields": ["TransSeq", "ItemCode", "Warehouse", "TransType", "BASE_REF", "CalcPrice"]

      }

    ],

    "menu_navigation_paths": [

      "Compras - Proveedores -> Pedido",

      "Compras - Proveedores -> Entrada de mercancías de pedido",

      "Compras - Proveedores -> Factura de proveedores",

      "Gestión de bancos -> Pagos efectuados -> Pagos efectuados",

      "Gestión -> Definición -> Finanzas -> Determinación de cuentas de mayor -> Ficha Inventario (Cuenta de existencias y Cuenta de compensación de existencias / asignación)"

    ],

    "business_rules": [

      {

        "rule_id": "BR_PUR_01",

        "name": "Purchase Order Zero Financial Impact",

        "description": "El Pedido de Compras (PO) no genera ningún movimiento físico de inventario ni asiento contable en el libro mayor; únicamente incrementa la cantidad 'Pedido' (Ordered) en el maestro de inventario."

      },

      {

        "rule_id": "BR_PUR_02",

        "name": "Allocation Clearing Balance Requirement",

        "description": "La Entrada de Mercancías de Pedido (OPDN) acredita la Cuenta de Compensación de Existencias / Asignación. La Factura de Proveedores (OPCH) debe debitar dicha cuenta al copiarse desde la entrada, extinguiendo el saldo temporal de la cuenta puente."

      },

      {

        "rule_id": "BR_PUR_03",

        "name": "Standalone Invoice Stock Duplication Warning",

        "description": "Una Factura de Proveedores directa e independiente (sin copiar de una Entrada de Mercancías previa) debita directamente la cuenta de existencias e incrementa el stock físico. Si previamente existía una Entrada de Mercancías física no referenciada, se generará una duplicación de inventario y de pasivos contables."

      }

    ]

  }

}


Desarrollo Conceptual y Funcional Detallado
1. El Ciclo Tradicional de Aprovisionamiento en 4 Etapas
En SAP Business One 10.0, el circuito estándar de aprovisionamiento de bienes y servicios responde a la cadena operativa de cuatro eslabones: Pedir $\rightarrow$ Recibir $\rightarrow$ Facturar $\rightarrow$ Pagar.

[1. Pedir: Pedido (PO)] ───────────► Sin impacto contable ni de stock (Afecta columna 'Pedido')

          │

          ▼

[2. Recibir: Entrada de Mercancías (GRPO)] ──► Débito: Cuenta de Existencias

          │                                  Crédito: Cuenta de Asignación / Compensación

          ▼

[3. Facturar: Factura de Proveedores (A/P)] ──► Débito: Cuenta de Asignación / Compensación

          │                                   Crédito: Cuenta del Proveedor (Pasivo)

          ▼

[4. Pagar: Pago Efectuado] ─────────────────► Débito: Cuenta del Proveedor

                                              Crédito: Banco / Caja / Cheques

El sistema sincroniza en tiempo real las operaciones físicas de bodega con las transacciones financieras en el libro mayor (OJDT), garantizando la trazabilidad integral mediante el Mapa de Relaciones (Relationship Map).


2. Datos Maestros Clave en el Proceso de Compras
A. Maestro de Socios de Negocios: Proveedor (OCRD)
El proveedor (CardType = 'S') representa a la entidad jurídica o natural que suministra bienes o servicios:

Condiciones de Pago: Define la lista de precios por defecto, límite de crédito del proveedor, porcentaje de descuento por pronto pago y días de vencimiento.
Personas de Contacto y Direcciones: Almacena múltiples direcciones fiscales y de despacho.
Control Contable: Vinculado a una Cuenta Asociada de Proveedores (DebPayAcct), la cual centraliza el pasivo comercial exigible en el balance general.
B. Maestro del Artículo: Pestaña Datos de Compras (OITM)
Define las propiedades logísticas y arancelarias aplicables a las compras:

Proveedor Preferente (OITM.CardCode): Sugerido automáticamente al crear pedidos y en recomendaciones del asistente MRP.
Número de Catálogo del Fabricante: Permite ingresar el código interno del proveedor para que se imprima en las órdenes de compra.
Unidad de Medida de Compra (BuyUnitMsr): Define el empaque de compra (ej. Caja de 24 unidades) y su factor de conversión a la unidad base de inventario (NumInBuy).
Dimensiones Físicas y Grupos de Aduanas: Largo, ancho, alto, peso volumétrico y aranceles asociados para artículos importados.
Enlace al Análisis de Compras: Icono gráfico en la pestaña que permite auditar las compras históricas del artículo por proveedor y mes.


3. Impacto Financiero y Logístico en Inventario Continuo
1. Pedido de Compra (Purchase Order - OPOR)
Propósito: Documento legal que formaliza el compromiso de compra ante el proveedor con cantidades, especificaciones y precios pactados.
Impacto en Inventario: La cantidad física en almacén (InStock) no varía. Se incrementa el contador de Pedido (Ordered), el cual es tomado en cuenta por la fórmula de disponibilidad de inventario: $$\text{Disponible} = \text{En Stock} - \text{Comprometido} + \text{Pedido}$$
Impacto Contable: Ninguno. No se generan asientos contables.
2. Entrada de Mercancías de Pedido (Goods Receipt PO - OPDN)
Propósito: Certifica la recepción física de los materiales en el almacén de destino.
Impacto en Inventario: Incrementa la cantidad física en stock (InStock) y actualiza el costo promedio ponderado o las capas FIFO en el kardex (OINM).
Asiento Contable Generado:
Débito: Cuenta de Existencias / Inventario (InvntAct). Refleja el ingreso del activo realizable al balance.
Crédito: Cuenta de Asignación / Compensación de Existencias (Allocation Cost Account).
Función de la Cuenta de Asignación (Dotación/Compensación): Es una cuenta puente de pasivo transitorio que representa mercancías físicas recibidas que aún no han sido facturadas por el proveedor (Devengo de compras no facturadas). Su saldo consolidado refleja el pasivo pendiente por conciliar.
3. Factura de Proveedores (A/P Invoice - OPCH)
Propósito: Registro del comprobante fiscal emitido por el proveedor solicitando el pago formal.
Impacto en Inventario: Al crearse basándose en la Entrada de Mercancías, no afecta las cantidades de stock (el ingreso físico ya ocurrió). Cierra la entrada de mercancías base.
Asiento Contable Generado:
Débito: Cuenta de Asignación / Compensación de Existencias. Cancela y salda a cero la cuenta puente creada en la recepción.
Crédito: Cuenta Asociada del Proveedor (DebPayAcct). Registra la deuda comercial definitiva exigible en cuentas por pagar.
4. Pago Efectuado (Outgoing Payment - OVPM)
Módulo: Gestión de Bancos.
Asiento Contable:
Débito: Cuenta Asociada del Proveedor. Extingue el pasivo comercial.
Crédito: Cuenta de Bancos, Caja o Cheques Emitidos. Disminuye el activo disponible.


4. Proceso de Aprovisionamiento Optimizado / Abreviado
En situaciones de compras urgentes de mostrador, adquisiciones de emergencia por teléfono o compras de suministros de entrega inmediata con factura en mano:

Mecanismo: El usuario registra directamente una Factura de Proveedores independiente (OPCH), omitiendo el Pedido de Compra y la Entrada de Mercancías previa.
Efecto Dual Simultáneo de la Factura Independiente:
Incrementa las cantidades físicas en inventario (InStock).
Genera el pasivo contable ante el proveedor.
Asiento Contable Directo:
Débito: Cuenta de Existencias / Inventario.
Crédito: Cuenta del Proveedor.
(Se omite por completo el uso de la Cuenta de Asignación/Compensación).

                     [Factura de Proveedores Directa (Sin Base)]

                                         │

                   ┌─────────────────────┴─────────────────────┐

                   ▼                                           ▼

      Incremento Físico en Kardex               Asiento Contable Directo

      (Aumenta 'En Stock' en Almacén)       Débito:  Cuenta de Existencias

                                            Crédito: Cuenta del Proveedor
Regla de Oro y Riesgo Crítico de Duplicación
Si el personal de almacén ya había registrado una Entrada de Mercancías de Pedido (OPDN), el departamento de cuentas por pagar debe obligatoriamente utilizar la función 'Copiar de' (Copy From) seleccionando dicha entrada.

Si en lugar de copiar la entrada, el contador registra una Factura de Proveedores independiente:

El inventario se incrementará dos veces (duplicando el stock físico y valorizado).
La Cuenta de Asignación quedará con un saldo acreedor ficticio que nunca se liquidará.
Se duplicará la obligación financiera ante el proveedor en el balance.


Caso de Negocio Resuelto: OEC Computers
Escenario A: Adquisición Regular de Microprocesadores
OEC Computers emite el Pedido de Compra PO 1002 al proveedor mayorista Intel por 50 Procesadores Core i7 a $300.00 USD c/u (Total: $15,000.00 USD).
Contabilidad: Sin asiento. Stock: Existencias = 0; Pedido = 50.
Al llegar el camión a bodega, el recepcionista genera la Entrada de Mercancías OPDN 501.
Kardex: Stock físico aumenta a 50 unidades.
Asiento: Débito a Existencias de Computación ($15,000.00) / Crédito a Cuenta de Compensación de Compras ($15,000.00).
Tres días después, llega la factura fiscal. El contador abre Facturas de Proveedores, pulsa Copiar de -> Entrada de mercancías, selecciona la OPDN 501 y crea la OPCH 802.
Asiento: Débito a Cuenta de Compensación de Compras ($15,000.00) / Crédito a Intel Corp ($15,000.00).
Resultado: La cuenta de compensación queda en 0.00 USD y la deuda con Intel queda formalizada.
Escenario B: Compra Urgente de Tóner para Administración
Se agota imprevistamente el tóner de las oficinas centrales. El asistente de compras va a la tienda local de suministros, adquiere 2 cartuchos por $120.00 USD y regresa con la factura comercial.
Para agilizar la operación sin burocracia, registra directamente una Factura de Proveedores (OPCH) seleccionando el proveedor "Office Max" y el artículo TONER_01.
El sistema carga de inmediato el inventario de bodega con 2 unidades y abona la cuenta de Office Max por $120.00 USD, sin pasar por pedidos ni cuentas de dotación intermedia.


Banco de Evaluación Situacional
Pregunta 1
En una empresa que utiliza inventario continuo en SAP Business One, ¿cuál es el efecto financiero y logístico exacto que se produce al momento de añadir un Pedido de Compra (OPOR)?

A) Se debita la cuenta de existencias y se acredita la cuenta de compensación de existencias, aumentando el stock físico.
B) Se debita la cuenta de gastos de compras y se incrementa el saldo del proveedor en cuentas por pagar.
C) No se genera ningún asiento contable ni movimiento de stock físico; únicamente se incrementa la cantidad en el campo 'Pedido' (Ordered) del dato maestro del artículo.
D) Se crea un documento preliminar en el libro mayor que reserva el presupuesto bancario.
Respuesta Correcta: C
Justificación Técnica: El pedido de compra es un compromiso comercial externo. No representa aún la transferencia de propiedad física de los bienes ni la exigibilidad jurídica de una factura. Por ello, en SAP B1 no genera asientos en el libro mayor ni modifica las existencias físicas en bodega; solo actualiza el compromiso logístico en la columna Pedido.
Pregunta 2
El jefe de bodega registró una Entrada de Mercancías de Pedido (OPDN) por un lote de materias primas. Al día siguiente, el analista de cuentas por pagar recibe la factura del proveedor y, por error, en lugar de copiar la entrada de mercancías existente, crea una Factura de Proveedores (OPCH) independiente ingresando el artículo directamente. ¿Cuáles son las dos consecuencias directas de este error?

A) La factura es rechazada automáticamente por el sistema y el pedido original se cancela.
B) El stock físico y valorizado en el almacén se duplica, y la cuenta de compensación de existencias queda con un saldo acreedor abierto que no se liquidará.
C) El sistema genera una devolución de mercancías automática y bloquea el socio de negocios.
D) El costo medio variable del artículo se recalcula a cero y se bloquea el período contable.
Respuesta Correcta: B
Justificación Técnica: Una Factura de Proveedores directa asume que no hubo entrada previa y, por diseño, aumenta el inventario y debita existencias. Al existir ya una Entrada de Mercancías anterior, el inventario se incrementa dos veces. Además, la cuenta puente de compensación acreditada en la primera entrada nunca recibe el débito compensatorio de la factura, generando descuadre contable y duplicación del valor en libros.
Pregunta 3
¿Cuál es la función contable de la 'Cuenta de Compensación de Existencias / Asignación' (Allocation Cost Account) en el proceso estándar de compras de SAP Business One?

A) Registrar las variaciones de tipo de cambio entre monedas extranjeras.
B) Servir como cuenta puente de balance que refleja el pasivo por mercancías ya recibidas físicamente en almacén pero cuya factura de proveedor aún no ha sido registrada.
C) Contabilizar los descuentos financieros por pronto pago otorgados por el proveedor.
D) Acumular las amortizaciones de activos fijos adquiridos durante el ejercicio.
Respuesta Correcta: B
Justificación Técnica: La cuenta de compensación/dotación (Allocation Account) absorbe la contrapartida del inventario recibido físicamente en la Entrada de Mercancías de Pedido. Permite cumplir con el principio contable de devengo (Accrual), reflejando que la empresa ya posee el activo en su balance y tiene una obligación pendiente de pago por documentar, la cual se regulariza y salda a cero al ingresar la Factura de Proveedores.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
