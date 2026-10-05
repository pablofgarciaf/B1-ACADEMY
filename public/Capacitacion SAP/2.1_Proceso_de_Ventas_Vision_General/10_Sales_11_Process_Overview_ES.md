DOC_088_Sales_ProcessOverview: Descripción General del Proceso de Ventas en SAP Business One 10.0
Metadatos Técnicos
Módulo SAP: Ventas - Clientes (Sales - A/R Process Architecture)
Código de Documento: DOC_088_Sales_ProcessOverview
Audiencia Objetivo: Consultores Funcionales de Ventas y Distribución, Gerentes Comerciales, Administradores de SAP B1, Cajeros y Operadores de Venta.
Nivel Técnico: Fundamental a Intermedio / Flujos Comerciales y Contables
Versión de SAP: SAP Business One 10.0 FP 2008 / HANA & SQL


1. Antigravity Master Schema (Arquitectura de Datos y Parámetros)
{

  "unit_id": "088_10_Sales_11_Process_Overview_ES",

  "system_component": "Sales - A/R Core Workflow Engine",

  "database_tables": {

    "marketing_documents": [

      {

        "stage": "Presales Quotation",

        "header_table": "OQUT",

        "lines_table": "QUT1",

        "partner_allowed": ["Lead", "Customer"],

        "financial_effect": false,

        "stock_effect": false

      },

      {

        "stage": "Sales Order",

        "header_table": "ORDR",

        "lines_table": "RDR1",

        "partner_allowed": ["Lead", "Customer"],

        "financial_effect": false,

        "stock_effect": "Increases Committed Quantity"

      },

      {

        "stage": "Delivery",

        "header_table": "ODLN",

        "lines_table": "DLN1",

        "partner_allowed": ["Customer strictly"],

        "financial_effect": "COGS vs Stock (Perpetual Inventory)",

        "stock_effect": "Decreases On-Hand & Committed"

      },

      {

        "stage": "A/R Invoice",

        "header_table": "OINV",

        "lines_table": "INV1",

        "partner_allowed": ["Customer strictly"],

        "financial_effect": "Customer vs Revenue (+ Stock entry if standalone)",

        "stock_effect": "Decreases On-Hand if standalone without predecessor"

      },

      {

        "stage": "Incoming Payment",

        "header_table": "ORCT",

        "lines_table": "RCT2",

        "partner_allowed": ["Customer strictly"],

        "financial_effect": "Bank/Cash vs Customer (Clears receivable)",

        "stock_effect": false

      }

    ]

  },

  "menu_paths": {

    "quotation": "Ventas - Clientes -> Oferta de ventas",

    "order": "Ventas - Clientes -> Pedido de cliente",

    "delivery": "Ventas - Clientes -> Entrega",

    "invoice": "Ventas - Clientes -> Factura de clientes",

    "payment": "Gestión de bancos -> Pagos recibidos"

  },

  "business_rules": {

    "mandatory_document": "La Factura de Clientes (OINV) es el único documento formalmente obligatorio en todo el ciclo comercial de SAP Business One",

    "lead_constraints": "Los Clientes Potenciales (Leads) pueden registrarse en Ofertas y Pedidos, pero NUNCA en Entregas ni Facturas de Clientes",

    "optimized_sales_process": "Permite completar todo el ciclo Order-to-Cash mediante un único documento (Factura de Clientes con cobro inmediato integrado)"

  }

}


2. Desarrollo Conceptual y Funcional Exhaustivo
2.1 La Cadena Tradicional de Ventas (Order-to-Cash)
El ciclo comercial en SAP Business One está diseñado para integrar la gestión de demanda, la logística de almacén y el devengo financiero sin redundancia de datos. La información fluye automáticamente de un eslabón al siguiente mediante los mecanismos de Copiar a / Copiar de:

[ Oferta de Ventas (OQUT) ]  -->  Compromiso inicial de cotización de precios/condiciones.

             │

             ▼

 [ Pedido de Cliente (ORDR) ] -->  Compromiso vinculante. Reserva stock (Comprometido).

             │

             ▼

    [ Entrega (ODLN) ]       -->  Salida física de mercancía. Rebaja inventario (Stock).

             │

             ▼

[ Factura de Clientes (OINV)]-->  Reconocimiento legal de la deuda e ingreso financiero.

             │

             ▼

  [ Cobro / Pago Recibido ]  -->  Cancelación de cartera en el módulo Gestión de Bancos.


2.2 El Principio del Documento Único Obligatorio: La Factura de Clientes
Una regla fundamental de diseño en SAP Business One es que el único documento obligatorio del proceso de ventas es la Factura de Clientes (OINV). Todos los demás documentos (Ofertas, Pedidos, Entregas) son opcionales y pueden omitirse en función de la madurez, dimensión y velocidad del modelo de negocio.
El Proceso de Ventas Optimizado (One-Step Sales Flow)
Para empresas de venta minorista (Retail), venta de mostrador o negocios ágiles con estructuras compactas, SAP Business One permite emitir directamente la Factura de Clientes sin requerir un Pedido o una Entrega previa. Cuando una Factura de Clientes se registra sin documentos precedentes, asume de forma autónoma las funciones del pedido, el albarán de entrega y la factura fiscal:

Acción Comercial: Registra la venta y el compromiso del cliente.
Acción Logística: Provoca la salida inmediata de existencias del almacén (OnHand), reduciendo el inventario físico.
Acción Contable Integral: Genera dos asientos contables sincronizados en una sola transacción:
Asiento de Ingreso y Cartera:
Débito: Cuenta del Cliente (OCRD): Registra la cuenta por cobrar con impuestos.
Crédito: Cuenta de Ingresos por Ventas (OACT): Reconoce el ingreso bruto en PyG.
Asiento de Costo de Ventas (en Inventario Permanente):
Débito: Coste de Mercancías Vendidas (COGS / Cuenta de Gastos).
Crédito: Cuenta de Existencias (Inventario / Activo).
Cobro Inmediato Integrado: Mediante el icono de la barra de herramientas Medios de Pago (Payment Means), el operador registra la recepción del dinero (efectivo, tarjeta, transferencia) en la misma ventana, creando la factura (OINV) y el cobro (ORCT) en una sola operación atómica con reconciliación interna automática.


2.3 Entidades Maestras Clave en el Circuito de Ventas
A. Interlocutores Comerciales (OCRD)
Clientes Potenciales (Leads): Entidades en etapa de prospección. Permiten emitir Ofertas de Venta (OQUT) y Pedidos de Cliente (ORDR). Restricción estricta: Un Lead jamás puede ser destinatario de una Entrega (ODLN) ni de una Factura (OINV).
Clientes (Customers): Entidades validadas comercial y crediticiamente que pueden figurar en cualquier documento del circuito. Un Lead se transforma en Cliente en el momento en que se concreta la primera transacción con impacto de entrega o cobro.
B. Artículos y Servicios
Artículos de Inventario y Venta (OITM): Bienes tangibles con control de stock, seguimiento de coste promedio o serie/lote.
Servicios Gestionados como Artículos: Prestaciones intangibles configuradas en OITM desmarcando la casilla Artículo de inventario y marcando Artículo de venta. Permite combinar productos y servicios en el mismo pedido.
Documentos de Clase Servicio: Formato alternativo de documento donde se detallan descripciones libres de servicios y cuentas de mayor sin usar códigos del maestro de artículos.
C. Determinación Automática de Precios
Al ingresar el cliente y las líneas de artículo en un documento de ventas, el motor de cálculo asigna el precio automáticamente en base a la lista de precios predeterminada en las Condiciones de Pago (OCTG) o en el Grupo de Clientes (OCRG). Los usuarios autorizados pueden modificar descuentos o precios unitarios según su perfil de permisos.


3. Caso de Negocio Práctico en OEC Computers
Escenario Dual
OEC Computers gestiona dos canales comerciales distintos:

Canal Corporativo: Empresas que solicitan cotización formal de 20 estaciones de trabajo, requieren validación de crédito, entrega coordinada por camión y factura a 30 días.
Flujo utilizado: Oferta de Venta $\rightarrow$ Pedido de Cliente $\rightarrow$ Entrega de Mercancías $\rightarrow$ Factura de Clientes $\rightarrow$ Cobro en Bancos.
Canal Express / Tienda: Clientes que acuden al mostrador para adquirir cables, routers o periféricos con entrega inmediata y pago en tarjeta de débito en el acto.
Flujo optimizado: Se genera una Factura de Clientes directa, se pulsa el icono Medios de Pago, se ingresa el cobro por tarjeta y se añade el documento. En un lapso de 15 segundos, el stock del almacén se descuenta, se contabiliza el ingreso, se registra el costo de ventas y la cuenta por cobrar nace reconciliada a saldo cero.


4. Banco de Evaluación Situacional (Certificación SAP)
Pregunta 1: ¿Cuál es el único documento que resulta estrictamente obligatorio para completar el ciclo de ventas en SAP Business One?

A) Pedido de cliente.
B) Entrega de mercancías.
C) Factura de clientes.
D) Oferta de venta.
Respuesta Correcta: C.
Justificación Técnica: La Factura de Clientes (OINV) es el único documento indispensable en el módulo de ventas. Puede operar de forma aislada realizando simultáneamente la entrega de existencias y el reconocimiento contable.

Pregunta 2: Si se emite una Factura de Clientes directa sin basarse en ningún documento precedente (sin pedido ni entrega previa) en un entorno de inventario permanente, ¿qué contabilizaciones se originan en el libro mayor?

A) Únicamente débito al cliente y crédito a los ingresos por ventas.
B) Débito al cliente, crédito a ingresos por ventas, y simultáneamente débito al costo de mercancías vendidas (COGS) con crédito a la cuenta de existencias de inventario.
C) No se afecta el costo de inventario hasta que se ejecute el cierre de mes.
D) Débito a una cuenta de existencias en tránsito.
Respuesta Correcta: B.
Justificación Técnica: Al no existir un documento de entrega anterior que haya rebajado el stock, la factura asume la salida logística de mercancías, generando el asiento comercial (Cliente vs Ingresos) y el asiento de variación patrimonial de existencias (COGS vs Inventario).

Pregunta 3: Un vendedor ha creado un pedido de cliente para un interlocutor clasificado como "Cliente Potencial" (Lead). Al intentar generar la Entrega a partir de dicho pedido, el sistema bloquea la operación. ¿Cuál es el motivo técnico?

A) El pedido de cliente tiene un límite de crédito excedido.
B) Los clientes potenciales (Leads) pueden utilizarse en ofertas y pedidos de cliente, pero el sistema prohíbe terminantemente su uso en documentos de Entrega o Facturas de Clientes.
C) La lista de precios no está autorizada para clientes potenciales.
D) Se requiere forzosamente una aprobación de gerencia.
Respuesta Correcta: B.
Justificación Técnica: SAP Business One restringe los documentos con implicaciones legales, tributarias y de movimiento de inventario definitivo (Entregas y Facturas) exclusivamente a socios de tipo Cliente. El Lead debe convertirse previamente a Cliente en sus datos maestros.

Pregunta 4: ¿Cómo se logra en SAP Business One que una factura de venta de mostrador quede cancelada en el mismo instante de su creación sin dejar saldo pendiente en la cartera del cliente?

A) Creando una nota de crédito por el total de la venta.
B) Accediendo al icono "Medios de pago" durante la confección de la factura de clientes para generar el cobro simultáneo.
C) Desmarcando la opción de inventario permanente en la ficha contable.
D) Asignando un descuento manual del 100%.
Respuesta Correcta: B.
Justificación Técnica: Al utilizar el botón Medios de Pago en el momento de crear la factura de clientes, SAP B1 registra en un solo paso la factura (OINV) y el pago recibido (ORCT), aplicando la reconciliación interna automática del documento.