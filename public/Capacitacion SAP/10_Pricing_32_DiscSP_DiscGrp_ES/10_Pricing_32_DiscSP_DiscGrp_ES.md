UNIDAD 067: DETERMINACIÓN DE PRECIOS - GRUPOS DE DESCUENTO (SAP BUSINESS ONE 10.0)
Código de Manual: 10_Pricing_32_DiscSP_DiscGrp_ES
Módulo Oficial: Gestión de Precios / Ventas y Compras (Pricing & Discounts)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Comerciales, Administradores de Precios, Arquitectos de Datos y Agentes IA (Antigravity)
Carpeta Asociada: 067_10_Pricing_32_DiscSP_DiscGrp_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "067",

  "topic": "Discount Groups & Free Goods Logic",

  "sap_module": "Pricing_Discounts",

  "database_tables": {

    "discount_groups_header": "OEDG",

    "discount_groups_lines": "EDG1",

    "business_partner_master": "OCRD",

    "item_master": "OITM",

    "item_groups": "OITB",

    "manufacturers": "OMRC"

  },

  "menu_paths": [

    "Inventario > Listas de precios > Precios especiales > Grupos de descuento",

    "Gestión > Definición > Interlocutores comerciales > Grupos de clientes / acreedores"

  ],

  "assignment_hierarchy": {

    "target_recipients": [

      { "type": "Interlocutor Comercial Específico", "field": "OEDG.ObjKey = CardCode" },

      { "type": "Grupo de Interlocutores Comerciales", "field": "OEDG.ObjKey = GroupCode" },

      { "type": "Todos los Interlocutores Comerciales", "field": "OEDG.ObjType = 'A'" }

    ],

    "discount_criteria_tabs": [

      { "tab": "Grupos de Artículos", "table": "OITB", "behavior": "Aplica automáticamente a cualquier nuevo artículo asignado al grupo" },

      { "tab": "Propiedades de Artículo", "fields": "Properties 1..64", "behavior": "Permite fijar reglas multi-propiedad" },

      { "tab": "Fabricantes", "table": "OMRC", "behavior": "Descuento por marca/fabricante de catálogo" },

      { "tab": "Artículos", "table": "OITM", "behavior": "Selección manual de artículos específicos" }

    ]

  },

  "property_discount_rules": [

    "Más alto (Highest Discount)",

    "Más bajo (Lowest Discount - Default)",

    "Descuento medio (Average Discount)",

    "Descuento total (Sum of Discounts up to 100%)",

    "Descuentos múltiples (Multiplication of Discount Rates)"

  ],

  "free_goods_matrix": {

    "mechanic": "Pague X, Lleve Y Gratis (Buy X, Get Y Free)",

    "fields": {

      "paid_qty": "EDG1.PaidQty (Cantidad mínima que el cliente abona)",

      "free_qty": "EDG1.FreeQty (Cantidad adicional gratuita)",

      "max_free_qty": "EDG1.MaxFreeQty (Tope máximo de unidades gratuitas por transacción)"

    },

    "calculation_formula": "DiscountPercentage = (FreeUnits / TotalPurchasedUnits) * 100",

    "returns_behavior": "En caso de devolución de una unidad, el abono se calcula sobre el precio efectivo neto descontado, no sobre el precio de lista."

  },

  "effective_discount_rules": [

    "El más bajo (Lowest - Default)",

    "El más alto (Highest)",

    "Promedio (Average)",

    "Total (Sum)",

    "Multiplicado (Multiplied)"

  ]

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Naturaleza y Flexibilidad de los Grupos de Descuento
Los Grupos de Descuento representan la herramienta promocional más flexible de SAP Business One 10.0. A diferencia de las listas de precios convencionales:

No contienen precios fijos por unidad: Únicamente definen tasas de descuento porcentuales o ecuaciones de bonificación de productos gratuitos.
Búsqueda en Dos Pasos: Cuando el sistema procesa una línea comercial, encuentra la tasa de descuento aplicable en OEDG/EDG1 y posteriormente busca el precio base unitario en la lista de precios asignada al cliente o en la lista de descuentos por período.
Auto-Inclusión de Nuevos Artículos: Si se define un descuento del 10% para el Grupo de Artículos Laptops, cualquier producto nuevo que se cree en el futuro bajo ese grupo heredará el descuento de inmediato sin intervención administrativa.
2.2 Las 4 Dimensiones de Definición
Un Grupo de Descuento se estructura en cuatro pestañas operativas:

Grupos de Artículos (OITB): Descuentos transversales para familias de productos.
Propiedades de Artículo (1 al 64): Permite cruzar atributos cualitativos (ej. Artículos Ecológicos, Línea Outlet, Temporada Alta). Si un artículo cumple múltiples propiedades con descuento, el sistema resuelve el conflicto mediante la regla de propiedades (Más alto, Más bajo, Promedio, Suma o Multiplicado).
Fabricantes (OMRC): Descuentos por acuerdos comerciales con fabricantes específicos (ej. 2% de descuento en todos los consumibles HP o Epson).
Artículos Específicos (OITM): Selección directa de referencias de inventario.
2.3 Lógica Matemática de Productos Gratuitos (Free Goods)
En lugar de porcentajes fijos, SAP B1 permite fijar promociones del tipo "Pague 2 y lleve 1 gratis" mediante tres campos:

Cantidad Pagada (PaidQty): 2
Cantidad Gratuita (FreeQty): 1
Cantidad Gratuita Máxima (MaxFreeQty): 4 (Tope de protección financiera).

Mecánica de Cálculo:

El sistema no inserta una línea adicional a precio cero; en su lugar, traduce la bonificación en un descuento porcentual directo en la línea:
Si el cliente compra 2 unidades: No alcanza el umbral de bonificación (Descuento = 0%).
Si compra 3 unidades (2 pagadas + 1 gratis): El sistema factura 3 unidades con un 33.33% de descuento ($1/3$). El cliente paga exactamente el equivalente a 2 unidades.
Si compra 4 unidades: Aplica el beneficio de 1 gratis sobre 4 unidades $\rightarrow$ Descuento = 25.00% ($1/4$). El cliente abona el valor de 3 unidades.
Si compra 6 unidades: Recibe 2 gratis $\rightarrow$ Descuento = 33.33% ($2/6$).
Si compra 15 unidades: La escala teórica daría 5 gratis ($15/3$), pero el tope MaxFreeQty = 4 limita el beneficio a 4 unidades gratuitas $\rightarrow$ Descuento = 26.67% ($4/15$).
2.4 Resolución de Conflictos: Regla del Descuento Efectivo
Cuando un cliente pertenece a un grupo con descuento, pero también existe un descuento para todos los clientes y un descuento por fabricante, convergen múltiples tasas. SAP B1 resuelve la colisión mediante la Regla del Descuento Efectivo configurada en el Maestro del Interlocutor Comercial (OCRD) o en el Grupo de Clientes:

El más bajo (Por defecto): Protege el margen bruto de la empresa.
El más alto: Prioriza la satisfacción y fidelización del cliente.
Promedio / Total / Multiplicado: Para acuerdos comerciales especiales.
2.5 Exclusión de Grupos de Descuento
En la pestaña Condiciones de pago de OCRD o en el maestro de artículo OITM, existe la casilla No aplicar grupos de descuento. Al marcarla:

El cliente o el artículo quedan totalmente inmunizados frente a las reglas de OEDG.
Esto no impide aplicar descuentos manuales en la línea del pedido ni anula descuentos copiados desde documentos base previos.


3. ATLAS DIDÁCTICO: RESOLUCIÓN DE PRECIOS Y GRUPOS DE DESCUENTO
[ DOCUMENTO DE MARKETING: PEDIDO DE VENTA ]

         │

         ▼

¿Existe Acuerdo Global para el Artículo? ──(SÍ)──> Aplica Precio del Acuerdo

         │ (NO)

         ▼

¿Existe Precio Especial para el Cliente (OSPP)? ──(SÍ)──> Aplica Precio Especial

         │ (NO)

         ▼

¿Existe Grupo de Descuento Aplicable (OEDG)?

         │

   ┌─────┴─────┐

  (SÍ)        (NO)

   │           │

   │           ▼

   │     Busca Precio Base en Lista Asignada (OPLN)

   │           │

   ▼           ▼

Determina Tasa de Descuento (%) ───> Aplica Descuento sobre Precio Base


4. CASO DE NEGOCIO RESUELTO: ESTRATEGIA MULTICANAL EN OEC COMPUTERS
Escenario de Negocio:
OEC Computers implementa dos promociones concurrentes:

Promoción Minoristas: 5% de descuento en el Grupo de Artículos Impresoras.
Promoción Fabricante Rainbow: 2% de descuento en todos los suministros del fabricante Rainbow.
Promoción de Consumibles: "Compre 2 cartuchos de tóner negro I00031, lleve 1 gratis" (Máximo 4 gratis).
Parametrización en SAP Business One:
Menú: Inventario > Listas de precios > Precios especiales > Grupos de descuento.
Seleccionar Grupo de Clientes Minoristas:
Pestaña Grupos de artículos: Imputa 5% a Impresoras.
Pestaña Artículos: Para el código I00031, ingresar Cantidad pagada = 2, Cantidad gratuita = 1, Cantidad gratuita máxima = 4.
Seleccionar Grupo de Clientes Grandes Cuentas:
Pestaña Fabricantes: Imputa 2% al fabricante Rainbow.
Regla de descuento efectivo del cliente: El más alto.
Validación Transaccional:
Un cliente minorista compra 3 cartuchos I00031: El pedido asigna automáticamente 33.33% de descuento en la línea, facturando el equivalente exacto a 2 unidades.
Un cliente de gran cuenta compra una impresora del fabricante Rainbow que también pertenece al grupo de impresoras con 5%: El sistema evalúa ambas opciones y, aplicando la regla de El más alto, otorga el 5.00% de descuento.


5. BANCO DE EVALUACIÓN SITUACIONAL Y CERTIFICACIÓN
Pregunta 1
¿Qué información contiene un Grupo de Descuentos (OEDG) en SAP Business One?
A) Contiene los precios netos finales de venta y los costos de reposición.
B) Contiene únicamente porcentajes de descuento o fórmulas de productos gratuitos, pero no contiene precios unitarios; el precio base se obtiene de la lista de precios asignada.
C) Contiene las cuentas contables de pérdidas y ganancias del balance.
D) Contiene los números de serie de los artículos en promoción.
Respuesta Correcta: B
Justificación Técnica: Los grupos de descuento son estructuras desacopladas de precios; definen la tasa o bonificación que se aplicará sobre el precio unitario obtenido de la lista de precios base.
Pregunta 2
Si se configura una promoción de producto gratuito con "Cantidad pagada = 2, Cantidad gratuita = 1" y el cliente compra 3 unidades en una factura, ¿cómo registra SAP Business One la bonificación en el documento comercial?
A) Crea una línea adicional con cantidad 1 y precio $0.00.
B) Aplica automáticamente un descuento porcentual del 33.33% sobre la línea única de 3 unidades.
C) Emite un cupón de crédito para la siguiente compra.
D) Bloquea la factura hasta la aprobación del tesorero.
Respuesta Correcta: B
Justificación Técnica: SAP B1 integra la gratuidad directamente como descuento financiero porcentual proporcional en la misma línea ($\frac{1}{3} = 33.33%$), garantizando coherencia contable y en devoluciones.
Pregunta 3
¿Para qué sirve marcar la casilla "No aplicar grupos de descuento" en la pestaña Condiciones de Pago de un Interlocutor Comercial?
A) Para impedir que el cliente compre artículos de inventario.
B) Para ignorar todos los grupos de descuento definidos a nivel general o de grupo que normalmente aplicarían a este cliente, manteniendo activas otras condiciones como precios especiales individuales.
C) Para anular las listas de precios base y facturar al costo.
D) Para bloquear la emisión de notas de crédito.
Respuesta Correcta: B
Justificación Técnica: La casilla aísla al socio de negocios frente a los descuentos masivos de grupos, protegiendo acuerdos contractuales directos o políticas de cuentas especiales.