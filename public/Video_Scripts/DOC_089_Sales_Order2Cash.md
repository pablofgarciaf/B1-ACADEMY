# Guion de Video: DOC 089 Sales Order2Cash

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 089 Sales Order2Cash.

## Contenido Principal (Visual: Diapositivas correspondientes)
DOC_089_Sales_Order2Cash: Del Pedido de Cliente al Cobro en SAP Business One 10.0
Metadatos Técnicos
Módulo SAP: Ventas - Clientes & Gestión de Bancos (Order-to-Cash Execution)
Código de Documento: DOC_089_Sales_Order2Cash
Audiencia Objetivo: Consultores Funcionales de Ventas, Contadores Generales, Auditores de Sistemas, Administradores de Cartera y Cobranzas.
Nivel Técnico: Avanzado / Integración Logística, Contable y Bancaria
Versión de SAP: SAP Business One 10.0 FP 2008 / HANA & SQL


1. Antigravity Master Schema (Arquitectura de Datos y Parámetros)
{

  "unit_id": "089_10_Sales_12_Process_Order2Cash_ES",

  "system_component": "Full Order-to-Cash Lifecycle Engine",

  "database_tables": {

    "stages": [

      {

        "step": 1,

        "name": "Sales Order",

        "header": "ORDR",

        "lines": "RDR1",

        "inventory_impact": "Increases OITW.IsCommited, decreases Available",

        "financial_impact": "None (No Journal Entry)"

      },

      {

        "step": 2,

        "name": "Delivery",

        "header": "ODLN",

        "lines": "DLN1",

        "inventory_impact": "Decreases OITW.OnHand & OITW.IsCommited",

        "financial_impact": "Debit COGS, Credit Stock (OJDT/JDT1)"

      },

      {

        "step": 3,

        "name": "A/R Invoice",

        "header": "OINV",

        "lines": "INV1",

        "inventory_impact": "None if based on Delivery",

        "financial_impact": "Debit Customer, Credit Revenue & Output Tax"

      },

      {

        "step": 4,

        "name": "Incoming Payment",

        "header": "ORCT",

        "lines": "RCT2",

        "inventory_impact": "None",

        "financial_impact": "Debit Bank/Cash & Early Discount, Credit Customer"

      }

    ],

    "inventory_tracking": {

      "item_warehouse_table": "OITW",

      "fields": ["OnHand", "IsCommited", "OnOrder"]

    }

  },

  "menu_paths": {

    "sales_order": "Ventas - Clientes -> Pedido de cliente",

    "delivery": "Ventas - Clientes -> Entrega",

    "ar_invoice": "Ventas - Clientes -> Factura de clientes",

    "incoming_payment": "Gestión de bancos -> Pagos recibidos",

    "simulation": "Barra de herramientas -> Icono 'Previsualización de asiento'"

  },

  "critical_formulas": {

    "available_stock": "Disponible = En Stock (OnHand) - Comprometido (IsCommited) + Solicitado (OnOrder)"

  }

}


2. Desarrollo Conceptual y Funcional Exhaustivo
2.1 Fase 1: El Pedido de Cliente (ORDR / RDR1)
El Pedido de Cliente es el disparador operativo de la cadena logística. Notifica a compras, producción y almacén que debe iniciarse el aprovisionamiento y preparación de los bienes:

Efecto en Inventario: No altera la cantidad física en existencia (OnHand), pero incrementa inmediatamente la cantidad Comprometida (IsCommited) en la tabla OITW.
Fórmula de Disponibilidad: $\text{Disponible} = \text{En Stock} - \text{Comprometido} + \text{Pedido/Solicitado}$.
Efecto Contable: Cero impacto en el Libro Mayor. No se genera ningún asiento contable (OJDT).
Flexibilidad Operativa: Un pedido de cliente contabilizado puede modificarse en cantidades, fechas y precios siempre que permanezca en estatus Abierto y la parametrización lo autorice en Parametrizaciones de documento.
Aprovisionamiento Directo: Permite crear automáticamente órdenes de compra a proveedores (OPOR) o solicitudes de traslado de almacén directamente desde la ventana del pedido mediante el Asistente de aprovisionamiento.


2.2 Fase 2: La Entrega de Mercancías (ODLN / DLN1)
La Entrega o albarán documenta el despacho y salida física de las mercancías del almacén hacia las instalaciones del comprador:

Efecto en Inventario:
Disminuye la cantidad física En Stock (OnHand).
Si la entrega se basa en un pedido de cliente, libera y disminuye la cantidad Comprometida (IsCommited), equilibrando el saldo disponible.
Efecto Contable (Sistema de Inventario Permanente):
La salida de existencias desencadena un asiento automático que refleja el costo real de los bienes despachados:
Débito: Cuenta de Coste de Mercancías Vendidas (COGS / Cuenta de Gastos de Venta).
Crédito: Cuenta de Existencias (Inventario / Activo).
Las cuentas contables se determinan automáticamente desde la ficha Inventario del maestro del artículo (OITM) o según la matriz de Determinación avanzada de cuentas de mayor.
Consolidación de Despachos: Mediante el botón Copiar de, una sola Entrega puede consolidar múltiples pedidos abiertos correspondientes al mismo cliente.


2.3 Fase 3: La Factura de Clientes (OINV / INV1)
La Factura de Clientes es el documento mercantil y tributario que formaliza la solicitud de pago y el devengo contable del ingreso:

Efecto en Inventario: Dado que la entrega previa ya redujo las existencias y contabilizó el costo de ventas, la factura basada en una entrega no genera ningún movimiento físico ni de costo de inventario.
Efecto Contable:
Débito: Cuenta de Control del Cliente (OCRD): Importe total bruto adeudado.
Crédito: Cuenta de Ingresos por Ventas (OACT): Valor neto de las mercancías.
Crédito: Cuentas de Impuestos Repercutidos / Débito Fiscal (IVA/Ventas).
Condiciones de Pago: La fecha de vencimiento y los descuentos por pronto pago se heredan de la condición de pago del cliente (OCTG).
Previsualización de Asiento (Journal Entry Preview)
SAP Business One 10.0 ofrece la herramienta interactiva Previsualización de Asiento (icono en la barra de menús o clic derecho). Permite:

Simular con exactitud las cuentas contables, débitos, créditos y distribución de centros de coste antes de pulsar el botón Crear/Añadir.
Evitar errores contables irreversibles, ya que una vez contabilizado un asiento, no puede editarse, solo cancelarse mediante asiento de anulación.


2.4 Fase 4: El Cobro / Pago Recibido (ORCT / RCT2)
Ubicado en el módulo Gestión de Bancos, representa la culminación del ciclo Order-to-Cash mediante el cobro de la deuda:

Medios de Pago Soportados: Transferencia bancaria, cheques recibidos, tarjetas de crédito, dinero en efectivo o letras de cambio.
Efecto Contable del Cobro:
Débito: Cuenta Bancaria, Caja de Efectivo o Cheques por Cobrar.
Débito: Cuenta de Descuento por Pronto Pago concedido (si el cliente paga dentro del plazo convenido).
Crédito: Cuenta de Control del Cliente (OCRD): Da de baja la cuenta por cobrar.
Reconciliación Interna Automática: El sistema vincula internamente el asiento del cobro con el asiento de la factura de clientes, cerrando la partida abierta de la cartera.
Automatización: Los cobros masivos pueden ejecutarse mediante el Asistente de Pagos o la importación del extracto bancario electrónico.


3. Matriz Sinóptica de Asientos del Ciclo Completo


4. Caso de Negocio Práctico en OEC Computers
Escenario
El cliente Corporación del Austro adquiere 5 impresoras láser:

Precio unitario de lista: 100 USD.
Descuento comercial manual acordado en línea: 1% (Precio neto: 99 USD/unidad; Total pedido: 495 USD).
Costo unitario registrado en almacén: 60 USD/unidad (Total costo: 300 USD).
Términos de pago: Descuento adicional del 2% si abona antes de 10 días.
Secuencia Operativa y Contable
Pedido de Cliente:
Se crea por 5 impresoras a 99 USD.
OITW.IsCommited aumenta en 5 unidades. Sin asiento contable.
Entrega de Mercancías:
Se despachan las 5 impresoras. OnHand disminuye en 5; IsCommited disminuye en 5.
Asiento:
Débito: Costo de Mercancías Vendidas (610100): 300 USD.
Crédito: Existencias de Productos Terminados (130100): 300 USD.
Factura de Clientes:
Se factura con base en la Entrega por 495 USD (sin considerar IVA para simplificación).
Asiento:
Débito: Cliente Corporación del Austro (120100): 495 USD.
Crédito: Ingresos por Ventas de Hardware (410100): 495 USD.
Cobro Recibido (dentro de los 10 días con 2% pronto pago):
Descuento pronto pago: $495 \times 0.02 = 9.90\text{ USD}$.
Importe cobrado en banco: $495 - 9.90 = 485.10\text{ USD}$.
Asiento:
Débito: Cuenta Bancaria Principal (110200): 485.10 USD.
Débito: Descuentos Concedidos por Pronto Pago (640500): 9.90 USD.
Crédito: Cliente Corporación del Austro (120100): 495.00 USD.
Factura reconciliada automáticamente al 100%.


5. Banco de Evaluación Situacional (Certificación SAP)
Pregunta 1: En un sistema con inventario permanente, ¿cuál es el efecto que produce la creación de un Pedido de Cliente en el módulo de inventarios y en la contabilidad general?

A) Disminuye el stock físico y debita el costo de ventas en el libro mayor.
B) Aumenta la cantidad comprometida del artículo reduciendo el disponible, y no genera ningún asiento en el libro mayor.
C) Aumenta la cantidad solicitada y genera un asiento preliminar en borrador.
D) No produce ningún cambio ni en inventario ni en contabilidad.
Respuesta Correcta: B.
Justificación Técnica: Los pedidos de cliente representan un compromiso de demanda; incrementan el campo IsCommited en OITW, reduciendo el cálculo de inventario disponible, pero carecen de efecto patrimonial o contable en el libro mayor.

Pregunta 2: Si una Factura de Clientes se crea tomando como documento base una Entrega de mercancías previa, ¿qué movimientos contables y de inventario tienen lugar?

A) Se reduce el stock físico de nuevo y se duplica el asiento de costo de ventas.
B) No se genera asiento contable, solo se emite el comprobante fiscal.
C) Se debita la cuenta del cliente y se acreditan los ingresos por ventas; el inventario físico y el costo de ventas no se alteran porque ya fueron afectados en la entrega.
D) Se revierte la entrega y se emite una salida extraordinaria.
Respuesta Correcta: C.
Justificación Técnica: La salida física y el reconocimiento del costo de ventas ocurren en el paso de la Entrega (ODLN). Por tanto, la Factura de Clientes subsiguiente solo liquida la cuenta por cobrar del socio contra los ingresos por ventas.

Pregunta 3: Un contador general desea revisar con exactitud las cuentas contables y los importes de débito/crédito que afectará una Factura de Clientes compleja antes de añadirla definitivamente a la base de datos. ¿Qué funcionalidad nativa debe emplear?

A) Simulación de balance en Excel.
B) El botón "Previsualización de asiento" (Journal Entry Preview) disponible en la barra de herramientas.
C) El Asistente de Reconciliación.
D) El módulo de Auditoría de Stock.
Respuesta Correcta: B.
Justificación Técnica: El icono Previsualización de Asiento realiza una simulación en memoria del asiento contable resultante, mostrando cuentas, montos e imputaciones analíticas antes de la inserción física irreversible en OJDT.

Pregunta 4: ¿En qué módulo de SAP Business One se gestiona formalmente el paso final del proceso de ventas (el cobro de la factura y recepción del dinero)?

A) Módulo Ventas - Clientes.
B) Módulo Finanzas.
C) Módulo Gestión de Bancos (Cobros / Pagos Recibidos).
D) Módulo Inventario.
Respuesta Correcta: C.
Justificación Técnica: Aunque funcionalmente es el cierre del ciclo Order-to-Cash, la recepción de fondos de clientes se ejecuta bajo la función Pagos Recibidos (Cobros) en el módulo de Gestión de Bancos.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
