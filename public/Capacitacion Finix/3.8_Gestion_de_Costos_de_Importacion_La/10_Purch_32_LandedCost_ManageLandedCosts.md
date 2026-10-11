DOC_087_Purch_ManageLandedCosts: Gestión de Costes en Destino y Aduanas en SAP Business One 10.0
Metadatos Técnicos
Módulo SAP: Compras - Proveedores: Precios de Entrega (Landed Costs & Customs Management)
Código de Documento: DOC_087_Purch_ManageLandedCosts
Audiencia Objetivo: Consultores Funcionales de Compras e Inventarios, Directores de Comercio Exterior, Contadores de Costos, Analistas de Importaciones.
Nivel Técnico: Avanzado / Costeo de Importaciones y Desaduanaje
Versión de SAP: SAP Business One 10.0 FP 2008 / HANA & SQL


1. Antigravity Master Schema (Arquitectura de Datos y Parámetros)
{

  "unit_id": "087_10_Purch_32_LandedCost_ManageLandedCosts",

  "system_component": "Landed Costs & Customs Clearance Architecture",

  "database_tables": {

    "setup_tables": [

      {

        "table_name": "OALC",

        "description": "Definición de costes en destino (Landed Costs Codes & Allocation Accounts)"

      },

      {

        "table_name": "OCDG",

        "description": "Grupos de aduanas y fórmulas arancelarias (Customs Groups Master)"

      }

    ],

    "transaction_tables": [

      {

        "table_name": "OIPF",

        "description": "Cabecera del documento de Precios de Entrega (Landed Costs Header)"

      },

      {

        "table_name": "IPF1",

        "description": "Líneas de artículos importados con asignación de costos y aduanas"

      },

      {

        "table_name": "IPF2",

        "description": "Costes de transporte, seguro y almacenamiento aplicados en el documento"

      },

      {

        "table_name": "IPF3",

        "description": "Proveedores de servicios adicionales asociados al documento"

      }

    ],

    "master_integration": [

      {

        "table_name": "OITM",

        "fields": [

          "CstGrpCode",

          "TreeType",

          "InvntItem",

          "AvgPrice",

          "LastPurPrc"

        ]

      }

    ]

  },

  "menu_paths": {

    "customs_setup": "Gestión -> Definición -> Inventario -> Grupos de aduanas",

    "landed_cost_setup": "Gestión -> Definición -> Compras -> Precios de entrega",

    "landed_cost_transaction": "Compras - Proveedores -> Precios de entrega"

  },

  "operational_prerequisites": {

    "inventory_system": "El costeo de precios de entrega basado en Facturas de Proveedores exige estrictamente un Sistema de Inventario Permanente (Perpetual Inventory)",

    "non_perpetual_behavior": "En empresas con inventario periódico, el documento de precios de entrega no genera asientos contables en el libro mayor"

  },

  "allocation_methods": [

    "Cash Value Before Customs",

    "Cash Value After Customs",

    "Quantity",

    "Weight",

    "Volume",

    "Equal"

  ]

}


2. Desarrollo Conceptual y Funcional Exhaustivo
2.1 Definición de Precios de Entrega (Landed Costs)
En operaciones de comercio exterior, los costos de adquisición no se limitan al valor FOB/CIF facturado por el fabricante extranjero. Para que el Costo de Ventas (COGS) y la valoración del balance sean verídicos, es indispensable capitalizar en el costo unitario del inventario:

Aranceles e Impuestos Aduaneros (Customs Duties): Tarifas fijadas por la legislación aduanera del país receptor basadas en la clasificación arancelaria del bien.
Gastos Accesorios de Importación (Landed Costs): Fletes marítimos/aéreos internacionales, seguros de carga en tránsito, bodegajes portuarios (Demurrage), honorarios de agentes aduanales y gastos de inspección fitosanitaria o técnica.

El documento de Precios de Entrega (OIPF) permite consolidar todos estos costes, prorratearlos entre las partidas importadas, debitar el inventario permanente y compensar las provisiones contables correspondientes.


2.2 Flujo Operativo Estándar del Proceso de Importación
El flujo estándar en SAP Business One comprende los siguientes hitos:

Llegada al Puerto / Aviso de Arribo: Se registra la Entrada de Mercancías por Compras (OPDN) o la Factura de Proveedores (OPCH) por el valor FOB de los bienes.
Creación del Documento Precios de Entrega (OIPF):
Se selecciona el proveedor extranjero o se usa el botón Copiar de para cargar la Entrada de Mercancías o Factura de Proveedor base.
La pestaña Artículos (IPF1) se llena automáticamente con cantidades, pesos, volúmenes, precios base y el grupo de aduanas asociado al maestro OITM.
En la pestaña Costes (IPF2), se registran los importes cobrados por las empresas navieras, aseguradoras y almacenes de depósito temporal.
El sistema calcula automáticamente la columna Gasto (coste por unidad) y Valor de asignación de costes (coste total de la fila).
Facturación del Agente de Aduanas / Proveedores de Servicios (Broker A/P Invoice):
El despachante de aduanas y las empresas logísticas emiten sus facturas legales.
Estas facturas de proveedores se registran con base en el documento de Precios de Entrega, liquidando la cuenta puente de asignación.


2.3 Métodos de Asignación de Costes (Allocation Methods)
En la configuración de Precios de Entrega (Gestión -> Definición -> Compras -> Precios de entrega), se define el método por defecto para cada concepto, el cual puede anularse puntualmente dentro del documento:



2.4 Grupos de Aduanas (OCDG) y Cálculo Arancelario
El arancel se asocia en el registro maestro de artículos (Ficha Compras -> Grupo de aduanas).

Parámetros configurables: Porcentaje de aduanas, porcentaje de compra y porcentaje adicional.
La columna Total % aplica la fórmula legal para determinar la alícuota sobre el valor aduanero.
Cuentas de Mayor:
Cuenta de Asignación de Aduanas (Pasivo/Clearing): Recibe el crédito al generar el Landed Cost.
Cuenta de Gasto de Aduanas (Pérdidas): Se debita si en la línea del documento se desmarca la casilla Afecta inventario (Custom Affect Inventory).
Si la casilla Afecta inventario está marcada, el importe aduanero se debita a la Cuenta de Inventario, incrementando el costo del activo.


2.5 Arquitectura Contable y Liquidación de Cuentas Puente
A. Contabilización del Documento de Precios de Entrega (Landed Costs):

   ---------------------------------------------------------------------

   Débito:  Cuenta de Inventario (Materias Primas / Mercaderías)  [Importe Total Gastos + Aduana]

   Crédito: Cuenta de Asignación de Costes en Destino (Pasivo)   [Fletes, Seguros, Almacén]

   Crédito: Cuenta de Asignación de Aduanas (Pasivo)             [Derechos Arancelarios]

B. Contabilización de la Factura del Agente / Proveedor de Logística (Broker A/P Invoice):

   ---------------------------------------------------------------------

   Débito:  Cuenta de Asignación de Costes en Destino (Pasivo)   [Cancela provisión previa]

   Débito:  Cuenta de Asignación de Aduanas (Pasivo)             [Cancela provisión previa]

   Crédito: Cuenta por Pagar al Proveedor / Agente de Aduanas    [Importe total adeudado]

Resultado Neto: La cuenta de asignación de costes en destino queda con saldo 0.00. Si la factura del transportista difiere de la estimación original, el usuario puede generar un segundo documento de Precios de Entrega basado en el primero para ajustar las desviaciones reales contra inventario o cuentas de desviación.


2.6 Funcionalidades Avanzadas
Importación con Múltiples Proveedores (Multiple Vendors): Si en un mismo contenedor conviven mercancías provistas por dos fabricantes distintos, se copia la primera recepción, luego se reemplaza el código de proveedor en cabecera seleccionando "No" ante la pregunta de borrar líneas. El sistema mostrará la etiqueta Varios proveedores (Different Vendors) y listará todas las fuentes en la pestaña Proveedores.
Actualización de Precios de Venta: En la ficha Detalles, se puede activar la actualización del Último precio de compra y de cualquier lista de precios comercial seleccionada, recalculando márgenes en base al coste nacionalizado real.


3. Caso de Negocio Práctico en OEC Computers
Escenario
OEC Computers importa 3 modelos de tablets desde Shenzhen (China) recibidas en una sola Entrada de Mercancías (OPDN):

10 Tablets 64 GB (Precio base: 300 USD; Valor: 3,000 USD; Peso: 4 kg; Volumen: 10).
10 Tablets 128 GB (Precio base: 400 USD; Valor: 4,000 USD; Peso: 4 kg; Volumen: 10).
10 Tablets 256 GB (Precio base: 600 USD; Valor: 6,000 USD; Peso: 4 kg; Volumen: 10).
Costes incurridos en puerto de Guayaquil:
Seguro internacional: 100 USD (Asignado por Precio / Valor Base).
Flete marítimo: 60 USD (Asignado por Peso; pesos iguales entre líneas).
Bodegaje en terminal: 40 USD (Asignado por Volumen; volúmenes iguales).
Total de costes en destino: 200 USD.
Distribución de Costes
Seguro (100 USD distribuido por valor = 13,000 USD total):
Tablet 64 GB (3,000 / 13,000 = 23.08%): 23.08 USD (2.31 USD/unidad).
Tablet 128 GB (4,000 / 13,000 = 30.77%): 30.77 USD (3.08 USD/unidad).
Tablet 256 GB (6,000 / 13,000 = 46.15%): 46.15 USD (4.61 USD/unidad).
Flete Marítimo (60 USD distribuido por peso igual = 33.33% c/u):
20.00 USD por línea (2.00 USD/unidad).
Bodegaje (40 USD distribuido por volumen igual = 33.33% c/u):
13.33 USD por línea (1.33 USD/unidad).
Impacto Consolidado por Unidad:
Tablet 64 GB: Costo nuevo = $300 + 2.31 + 2.00 + 1.33 = \mathbf{305.64\text{ USD}}$.
Tablet 128 GB: Costo nuevo = $400 + 3.08 + 2.00 + 1.33 = \mathbf{406.41\text{ USD}}$.
Tablet 256 GB: Costo nuevo = $600 + 4.61 + 2.00 + 1.33 = \mathbf{607.94\text{ USD}}$.


4. Banco de Evaluación Situacional (Certificación SAP)
Pregunta 1: ¿En qué registro se asigna el Grupo de Aduanas para que el documento de Precios de Entrega calcule automáticamente el arancel aplicable?

A) En los Datos Maestros del Almacén de recepción.
B) En los Datos Maestros del Proveedor del flete.
C) En los Datos Maestros de Artículo, dentro de la ficha Compras.
D) En el documento de Entrada de Mercancías de manera manual obligatoria.
Respuesta Correcta: C.
Justificación Técnica: El campo OITM.CstGrpCode se encuentra en la ficha Compras de los datos maestros de artículo y vincula el artículo con el porcentaje arancelario de la tabla OCDG.

Pregunta 2: En un sistema de Inventario Permanente, ¿cuál es el asiento contable que se genera al registrar un documento de Precios de Entrega donde los gastos de transporte y seguro afectan inventario?

A) Débito a Cuenta de Gastos de Importación y Crédito a Cuenta por Pagar del Proveedor.
B) Débito a Cuenta de Inventario (Existencias) y Crédito a Cuenta de Asignación de Costes en Destino (Pasivo de Compensación).
C) Débito a Cuenta del Proveedor y Crédito a Variación de Existencias.
D) No se genera asiento contable hasta que se registre la factura del despachante aduanero.
Respuesta Correcta: B.
Justificación Técnica: El documento capitaliza inmediatamente los gastos en el inventario debitando la cuenta de stock de existencias y acredita una cuenta de pasivo puente transitoria (Asignación de costes en destino), la cual se conciliará a cero cuando se facture el proveedor de servicios logísticos.

Pregunta 3: Verdadero o Falso: Los métodos de asignación de costes en destino solo pueden definirse en la ventana de configuración y no pueden modificarse en el documento transaccional de Precios de Entrega.

A) Verdadero.
B) Falso.
Respuesta Correcta: B (Falso).
Justificación Técnica: Aunque cada coste en destino tiene un método por defecto asignado en OALC, el usuario tiene la facultad operativa de alterar el método de asignación directamente en la grilla del documento de Precios de Entrega según la casuística del embarque.

Pregunta 4: Si en la línea de un artículo dentro del documento de Precios de Entrega el usuario desmarca la casilla "Afecta inventario" (Custom Affect Inventory), ¿a qué cuenta contable se traslada el importe de los derechos de aduana calculados?

A) A la cuenta de Desviación de Costes Estándar.
B) A la cuenta de Gastos de Aduanas definida en el Grupo de Aduanas (OCDG).
C) A la cuenta corriente del Proveedor extranjero.
D) A la cuenta de Ingresos Extraordinarios.
Respuesta Correcta: B.
Justificación Técnica: Si la aduana no capitaliza el costo de las mercancías físicas, el valor liquidado se registra en el Debe de la cuenta de Gastos de Aduanas configurada en la parametrización del grupo aduanero.