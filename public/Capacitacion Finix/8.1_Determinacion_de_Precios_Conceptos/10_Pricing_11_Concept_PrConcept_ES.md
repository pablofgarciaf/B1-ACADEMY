UNIDAD 063: DETERMINACIÓN DE PRECIOS - CONCEPTOS Y JERARQUÍA DE PRECIOS (SAP BUSINESS ONE 10.0)
Código de Manual: 10_Pricing_11_Concept_PrConcept_ES
Módulo Oficial: Gestión de Precios (Pricing) y Ventas
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Comerciales, Gerentes de Ventas, Administradores de Precios y Agentes IA (Antigravity)
Carpeta Asociada: 063_10_Pricing_11_Concept_PrConcept_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "063",

  "topic": "Pricing Concepts, 5-Level Hierarchy & Price Determination Engine",

  "sap_module": "Sales_Pricing",

  "database_tables": {

    "price_lists": { "header": "OPLN", "lines": "ITM1" },

    "special_prices_for_bp": { "header": "OSPP", "period_discounts": "SPP1", "volume_discounts": "SPP2" },

    "discount_groups": { "header": "OEDG", "details": "EDG1" },

    "blanket_agreements": { "header": "OOAT", "lines": "OAT1" },

    "company_details": "OADM (GrossPriceActive)"

  },

  "menu_paths": [

    "Inventario > Listas de precios > Listas de precios",

    "Inventario > Listas de precios > Precios especiales > Precios especiales para interlocutores comerciales",

    "Inventario > Listas de precios > Precios especiales > Descuentos por período y cantidad",

    "Inventario > Listas de precios > Precios especiales > Grupos de descuento",

    "Ventas - Clientes > Acuerdo global"

  ],

  "pricing_5_levels_hierarchy": [

    {

      "priority": 1,

      "level": "Acuerdos Globales Específicos (Blanket Agreements - Specific)",

      "scope": "Precios y cantidades negociados bajo contrato formal por un periodo de validez determinado. Anula todos los demás precios."

    },

    {

      "priority": 2,

      "level": "Precios Especiales para Interlocutores Comerciales (Special Prices for BPs - OSPP)",

      "scope": "Precios fijados directamente por cliente/artículo/UdM. Puede incluir descuentos por fecha y volumen."

    },

    {

      "priority": 3,

      "level": "Grupos de Descuento (Discount Groups - OEDG)",

      "scope": "Porcentajes de descuento asignados por Grupo de Artículos, Fabricante o Propiedades (1-64). Se aplican sobre el precio base."

    },

    {

      "priority": 4,

      "level": "Descuentos por Período y Cantidad (Period and Volume Discounts)",

      "scope": "Precios temporales o escalas por cantidad vinculados a una lista de precios base específica."

    },

    {

      "priority": 5,

      "level": "Listas de Precios Básicas (Base Price Lists - OPLN / ITM1)",

      "scope": "Lista de precios asignada al socio de negocios (o derivada de sus condiciones de pago/grupo)."

    }

  ],

  "pricing_source_tracking": {

    "field": "Fuente de precio (PriceSource en líneas de documentos de marketing)",

    "possible_values": [

      "Lista de precios inactiva",

      "Lista de precios activa",

      "Lista de precios activa, grupos de descuento",

      "Precios especiales para interlocutores comerciales",

      "Descuento por período y cantidad",

      "Descuento por período y cantidad, grupos de descuento"

    ]

  },

  "effective_price_engine": {

    "options": ["Prioridad por defecto (Default Priority)", "Precio más bajo (Lowest Price)", "Precio más alto (Highest Price)"],

    "behavior_lowest_price": "El sistema evalúa simultáneamente todas las fuentes activas y selecciona la que brinde el costo menor al cliente (ideal para campañas comerciales y ventas flash)."

  },

  "gross_pricing_mode": {

    "setting": "Detalles de la empresa > Habilitar el modo precio bruto y neto individual (Irreversible)",

    "document_impact": "Habilita columnas 'Precio bruto' y 'Total bruto' e inhabilita 'Precio por unidad' neto en las transacciones con listas de precios brutos."

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 La Necesidad Comercial de Múltiples Esquemas de Precios
En una organización comercial moderna, un precio único estático por artículo es insuficiente. La estrategia comercial exige segmentar clientes (mayoristas vs. minoristas vs. ecommerce), premiar el volumen de compra, lanzar promociones temporales (Cyber Days) y cerrar contratos corporativos exclusivos.

SAP Business One 10.0 dispone de un potente Motor de Determinación de Precios que evalúa dinámicamente qué tarifa aplicar en cada línea de un documento de marketing.
2.2 La Jerarquía de Determinación de Precios (De lo Específico a lo General)
Cuando se introduce un artículo en una cotización, pedido o factura, el sistema resuelve el precio mediante una búsqueda jerárquica descendente de 5 niveles:

Nivel 1: Acuerdo Global Específico (OOAT/OAT1): Si el cliente tiene un acuerdo comercial específico vigente para ese artículo, el sistema toma este precio prioritario e interrumpe la búsqueda.
Nivel 2: Precios Especiales para Interlocutor Comercial (OSPP): Si no hay acuerdo global, busca si el cliente tiene un precio especial fijado para el artículo y para la Unidad de Medida transaccionada.
Nivel 3: Grupos de Descuento (OEDG): Si no hay precio especial directo, busca si el cliente tiene derecho a un porcentaje de descuento por fabricante, grupo de artículos o propiedades del ítem. Si existe, toma el porcentaje y busca el precio base en el nivel 4 o 5.
Nivel 4: Descuentos por Período y Cantidad: Evalúa si la lista de precios asignada al cliente tiene vigente una promoción temporal o una escala de descuento por volumen (ej. más de 50 unidades = 15% de descuento).
Nivel 5: Lista de Precios Base (OPLN/ITM1): Si no se cumple ninguna de las anteriores, toma el precio estándar configurado en la lista de precios asignada al socio de negocios.
2.3 Rastreabilidad: El Campo "Fuente de Precio" (Price Source)
En auditoría comercial y soporte técnico es común preguntarse: ¿Por qué el sistema calculó $85.00 y no $100.00 en esta factura?

Mediante las Parametrizaciones de Formulario, los usuarios pueden hacer visible la columna Fuente de precio.
Este campo describe con precisión milimétrica el origen de la tarifa (ej. "Precios especiales para IC" o "Descuento por período y cantidad, grupos de descuento"), eliminando conjeturas.
2.4 Flexibilidad Avanzada: El Precio Efectivo (Effective Price)
La jerarquía estándar prioriza siempre la regla más específica. Sin embargo, en escenarios comerciales con "Ventas Flash" o liquidaciones agresivas, un descuento general por volumen podría ser temporalmente más barato que el precio especial negociado con un cliente preferencial.

Para resolver esta discrepancia, SAP B1 permite configurar el campo Precio Efectivo en los Datos Maestros del Interlocutor Comercial (pestaña Condiciones de pago) o a nivel global:
Prioridad por Defecto: Aplica la jerarquía estricta de 5 niveles.
Precio Más Bajo (Lowest Price): Evalúa todas las fuentes aplicables y asigna automáticamente la tarifa más económica.
Precio Más Alto (Highest Price): Selecciona la opción más costosa (útil en aprovisionamiento de compras o contratos indexados).
2.5 Modo de Precios Brutos (Gross Pricing)
En empresas orientadas al consumidor final (B2C / Retail), los precios se publicitan y pactan incluyendo impuestos (IVA).
En Gestión > Inicialización del sistema > Detalles de la empresa, existe la casilla Habilitar el modo precio bruto y neto individual.
Advertencia Crítica: Esta parametrización es estrictamente irreversible. Al activarse, permite clasificar listas de precios y socios de negocios en modo "Bruto", calculando el impuesto hacia atrás a partir del precio final de venta.


3. ATLAS DIDÁCTICO: EL FLUJO DE BÚSQUEDA DEL MOTOR DE PRECIOS
[ LÍNEA DE DOCUMENTO DE MARKETING ]

   │

   ▼

1. ¿Existe Acuerdo Global Específico válido? ───► SÍ ───► [ Aplica Precio de Acuerdo Global ]

   │ NO

   ▼

2. ¿Existe Precio Especial de IC para el Artículo/UdM? ─► SÍ ─► [ Aplica Precio Especial ]

   │ NO

   ▼

3. ¿Existe Grupo de Descuento para el IC?

   │      ├─► SÍ ─► Captura % de Descuento

   │      └─► NO

   ▼

4. ¿Existe Descuento por Período y Cantidad en la Lista? ─► SÍ ─► [ Aplica Precio/Descuento por Cantidad ]

   │ NO

   ▼

5. [ Aplica Precio Base de la Lista de Precios del IC ]

* Si hay Grupo de Descuento activo, se aplica sobre el precio determinado en Nivel 4 o Nivel 5.


4. CASO DE NEGOCIO RESUELTO: ESTRATEGIA DE PRECIOS EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers comercializa el Disco Duro C00099:

Lista de Precios 01 (Público General): $100.00 USD.
Descuento por Período y Cantidad en Lista 01: Si compra $\ge 10$ unidades, precio = $90.00 USD.
Grupo de Descuento: Clientes del canal corporativo tienen 10% de descuento en todos los componentes de almacenamiento.
Precios Especiales para IC: El cliente VIP C20000 - Microchips S.A. tiene un precio especial pactado de $82.00 USD.
Resolución en Documentos de Venta:
Caso A (Cliente General compra 1 unidad):
No hay acuerdo, ni precio especial, ni grupo de descuento, ni escala de volumen.
Aplica Nivel 5: Precio = $100.00 USD (Fuente: Lista de precios activa).
Caso B (Cliente Corporativo compra 10 unidades):
Aplica Nivel 4 (Precio $90) combinado con Nivel 3 (10% de descuento del Grupo de Almacenamiento).
Precio final = $90.00 - 10% = $81.00 USD (Fuente: Descuento por período y cantidad, grupos de descuento).
Caso C (Cliente VIP C20000 compra 2 unidades con Prioridad por Defecto):
El sistema detecta Precio Especial en Nivel 2.
Aplica directamente: Precio = $82.00 USD (Fuente: Precios especiales para interlocutores comerciales).


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
En la jerarquía estándar de determinación de precios de SAP Business One, ¿cuál es el orden correcto de búsqueda desde el precio más específico hasta el más general?
A) Lista de precios $\rightarrow$ Grupos de descuento $\rightarrow$ Acuerdos globales $\rightarrow$ Precios especiales.
B) Acuerdos globales específicos $\rightarrow$ Precios especiales para IC $\rightarrow$ Grupos de descuento $\rightarrow$ Descuentos por período y cantidad $\rightarrow$ Lista de precios.
C) Costo estándar de inventario $\rightarrow$ Lista de precios $\rightarrow$ Precios especiales.
D) Descuentos por cantidad $\rightarrow$ Precios brutos $\rightarrow$ Acuerdos globales.
Respuesta Correcta: B
Justificación Técnica: El motor de precios evalúa siempre desde la condición contractual más personalizada (Acuerdo Global y Precios Especiales de IC) descendiendo hacia los descuentos por catálogo y finalizando en la lista de precios base.
Pregunta 2
Si una empresa desea que en todas sus ventas el sistema ignore la jerarquía habitual y seleccione automáticamente la tarifa más económica entre todas las listas, promociones y precios especiales existentes, ¿qué configuración debe establecer?
A) Modificar el tipo de cambio de la moneda del sistema.
B) Configurar el campo "Precio Efectivo" como "Precio más bajo" (Lowest Price) en los Datos Maestros del Interlocutor Comercial o en las Configuraciones Generales.
C) Eliminar todas las listas de precios excepto una.
D) Crear una búsqueda formateada con script SQL en cada línea.
Respuesta Correcta: B
Justificación Técnica: La opción Precio más bajo en el campo Precio Efectivo instruye al motor de cálculo a escanear todas las fuentes de precios activas y aplicar la tarifa más ventajosa para el comprador.
Pregunta 3
¿Qué característica crítica posee la opción "Habilitar el modo precio bruto y neto individual" en los Detalles de la Empresa?
A) Puede activarse y desactivarse libremente en cualquier momento del ejercicio fiscal.
B) Es una parametrización estrictamente irreversible; una vez habilitada en la base de datos no puede volver a desmarcarse.
C) Solo funciona para compras a proveedores extranjeros.
D) Duplica automáticamente todas las cuentas contables de ingresos.
Respuesta Correcta: B
Justificación Técnica: La habilitación del modo de precios brutos altera de manera estructural las tablas y cálculos de impuestos de los documentos comerciales, por lo que SAP Business One la define como irreversible.