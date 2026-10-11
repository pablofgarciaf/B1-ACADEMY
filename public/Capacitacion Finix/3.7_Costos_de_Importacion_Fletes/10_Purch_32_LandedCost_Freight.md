DOC_086_Purch_LandedCostsFreight: Gestión Integral de Portes y Gastos Adicionales en SAP Business One 10.0
Metadatos Técnicos
Módulo SAP: Compras - Proveedores & Ventas - Clientes (Gestión Transversal de Gastos Adicionales)
Código de Documento: DOC_086_Purch_LandedCostsFreight
Audiencia Objetivo: Consultores Funcionales de Compras, Finanzas y Ventas, Contadores Generales, Jefes de Logística y Almacén.
Nivel Técnico: Avanzado / Parametrización y Flujos Contables
Versión de SAP: SAP Business One 10.0 FP 2008 / HANA & SQL


1. Antigravity Master Schema (Arquitectura de Datos y Parámetros)
{

  "unit_id": "086_10_Purch_32_LandedCost_Freight",

  "system_component": "Freight & Additional Expenses Engine",

  "database_tables": {

    "setup_tables": [

      {

        "table_name": "OEXD",

        "description": "Definición maestra de portes y gastos adicionales (Freight Charges Master)"

      },

      {

        "table_name": "EXD1",

        "description": "Cuentas contables de ingresos y gastos e impuestos por localización fiscal"

      }

    ],

    "document_header_freight": [

      {

        "table_name": "DOC3",

        "description": "Portes a nivel de cabecera de documentos de marketing (QUT3, RDR3, DLN3, INV3, POR3, PDN3, PCH3)"

      }

    ],

    "document_line_freight": [

      {

        "table_name": "RDR1 / INV1 / POR1 / PCH1",

        "fields": [

          "Freight1",

          "Freight2",

          "Freight3",

          "DistribExp",

          "GrossBuyPr",

          "PriceBefDi"

        ]

      }

    ]

  },

  "menu_paths": {

    "system_activation": "Gestión -> Inicialización del sistema -> Parametrizaciones de documento -> Ficha General -> Casilla 'Gestionar porte en documentos'",

    "freight_setup": "Gestión -> Definición -> General -> Portes (o botón 'Definición de portes' en Parametrizaciones de documento)",

    "operational_entry": "En cualquier documento de Compras o Ventas -> Campo 'Porte' (flecha de enlace en el total de cabecera o columnas de porte 1-3 en líneas)"

  },

  "critical_system_flags": {

    "manage_freight_documents": {

      "irreversible": true,

      "effect": "Habilita el cálculo y campo de portes en todos los documentos de marketing; no se puede desmarcar una vez contabilizado el primer documento"

    },

    "stock_effect": {

      "field": "OEXD.Stock",

      "valid_valuation": [

        "FIFO",

        "Moving Average",

        "Serial/Batch Valuation"

      ],

      "exception": "En artículos con método Costo Estándar (Standard Cost), el importe del porte se envía a cuenta de gastos, no capitaliza inventario"

    }

  },

  "distribution_methods": [

    "None",

    "Quantity",

    "Volume",

    "Weight",

    "Equally",

    "Row Total"

  ],

  "drawing_methods": [

    "All",

    "None",

    "Total",

    "Quantity"

  ]

}


2. Desarrollo Conceptual y Funcional Exhaustivo
2.1 Naturaleza del Porte en SAP Business One
El porte (Freight / Additional Expenses) representa cualquier cargo por transporte de mercancías (terrestre, marítimo, aéreo) o gastos accesorios devengados durante la cadena de suministro que no forman parte del precio base contractual del artículo, tales como:

Flete y acarreos de entrega.
Primas de seguro de transporte para mercancías de alto valor.
Gastos de embalaje especial o manipulación (Handling).
Tasas de despacho rápido o mensajería urgente.

SAP Business One 10.0 ofrece un motor híbrido que permite aplicar portes tanto en el flujo de Compras como en el flujo de Ventas, gestionando dos niveles de granularidad:

Nivel de Cabecera (Header Level): Coste global del envío para todo el documento, distribuido matemáticamente a las líneas.
Nivel de Línea (Row Level): Cargos específicos asignados a un artículo puntual (soporta hasta 3 tipos de portes simultáneos por fila).
2.2 Activación Irreversible y Parametrización Maestra
Para operar con portes, es obligatorio realizar la activación estructural:

Ruta: Gestión -> Inicialización del sistema -> Parametrizaciones de documento -> Ficha General.
Casilla: Gestionar porte en documentos (Manage Freight in Documents).
Advertencia técnica bloqueante: Una vez que se marca esta casilla y se añade el primer documento comercial en la base de datos, la opción queda permanentemente bloqueada e irreversible.
Definición de Portes (OEXD)
En la ventana de Definición de Portes (Gestión -> Definición -> General -> Portes), se definen los tipos de cargos con sus atributos operativos:

Nombre del Porte: Identificador del concepto (ej. Flete Terrestre, Seguro de Carga).
Cuentas de Mayor:
Cuenta de Gastos (OEXD.ExpnsAcct): Cuenta de pérdidas utilizada en transacciones de compra cuando el porte no capitaliza inventario.
Cuenta de Ingresos (OEXD.RevnAcct): Cuenta de ganancias utilizada en ventas para reconocer el cobro del transporte al cliente.
Indicador de Impuestos: Código de IVA por defecto para compras y ventas si el interlocutor no tiene uno asignado.
Importe Fijo: Monto predeterminado que se inserta automáticamente en cada documento nuevo.
Porte Bruto (Gross Freight): Determina si el importe fijo ingresado incluye impuestos o es neto.
Sujeto a Retención (WTax Liable): Aplica retenciones en la fuente al valor del flete.
Casilla Stock (OEXD.Stock): Si se activa, en compras el importe del porte se suma directamente al costo unitario del artículo (Item Cost), debitando la cuenta de inventario en lugar de la cuenta de gastos.
Casilla Último Precio de Compra (OEXD.LastPurPrc): Actualiza el último precio de compra con el valor del artículo incrementado por el porte.
Método de Distribución (DistribMethod): Algoritmo por defecto para repartir los portes de cabecera entre las líneas del documento.
Método de Extracción / Arrastre (DrawMethod): Comportamiento al copiar partidas parciales a documentos posteriores.


2.3 Métodos de Distribución de Portes de Cabecera (Distribution Methods)
Cuando un porte se registra a nivel de cabecera y está configurado para afectar stock, el sistema exige un método de prorrateo para asignar el coste a cada línea:


Nota Crítica en Ventas: En documentos de ventas, la distribución de portes a nivel de línea tiene propósitos estrictamente informativos y de análisis de margen. La columna Distribuir porte en la fila debe cambiarse a Sí si se desea visualizar el prorrateo.


2.4 Métodos de Extracción en Documentos Parciales (Drawing Methods)
Determinan cómo se transfieren los portes registrados a nivel de línea cuando se utiliza el asistente de copia de documentos (Copiar a / Copiar de) en entregas o facturas parciales:

Todos (All): El sistema transfiere el 100% del importe del porte en el primer documento destino parcial, sin importar la cantidad física copiada.
Ninguno (None): No se transfiere ningún porte al documento destino; el usuario debe reingresarlo manualmente.
Total (Total): Se copia un importe proporcional en función del valor monetario total copiado frente al total del documento base.
Cantidad (Quantity): Se copia un importe proporcional exacto al porcentaje de cantidad de artículos transferidos ($\frac{\text{Cant. Copiada}}{\text{Cant. Base}} \times \text{Porte Línea}$).


2.5 Dinámica Contable en el Libro Mayor (OJDT / JDT1)
A. Ciclo de Ventas (Factura de Clientes con Flete y Seguro)
Cuando OEC Computers emite una Factura de Clientes con artículos por 100 USD, porte de envío por 5 USD y seguro por 5 USD:

Débito: Cuenta del Cliente (OCRD.DebPayAcct): 110.00 USD
Crédito: Cuenta de Ingresos por Ventas (OACT): 100.00 USD
Crédito: Cuenta de Ingresos por Fletes (OEXD.RevnAcct Flete): 5.00 USD (asigna Norma de Reparto / Proyecto)
Crédito: Cuenta de Ingresos por Seguros (OEXD.RevnAcct Seguro): 5.00 USD (asigna Norma de Reparto / Proyecto)
B. Ciclo de Compras (Factura de Proveedores / Entrada de Mercancías)
Supongamos compra de componentes por 100 USD, Transporte por 5 USD (marcado con casilla Stock) y Seguro por 5 USD (marcado como gasto sin afectar stock):

Débito: Cuenta de Inventario / Stock (OACT): 105.00 USD (100 del artículo + 5 de transporte capitalizado)
Débito: Cuenta de Gasto de Porte / Seguro (OEXD.ExpnsAcct): 5.00 USD
Crédito: Cuenta del Proveedor (OCRD.DebPayAcct): 110.00 USD

Punto Clave: En el asiento contable, el porte que afecta stock se funde dentro del débito a la cuenta de inventario; por lo tanto, no se genera una línea separada de gasto y no admite asignación de centro de costo individual en ese asiento.


3. Caso de Negocio Práctico en OEC Computers
Contexto
OEC Computers adquiere componentes de servidores desde la fábrica nacional:

Línea 1: 10 Tarjetas Madre Server Pro (Total: 8,000 USD; Peso total: 80 kg).
Línea 2: 20 Procesadores Xeon (Total: 4,000 USD; Peso total: 20 kg).
Gastos de Envío de Cabecera: 500 USD mediante transporte terrestre (afecta Stock, distribuido por Peso).
Seguro de Tránsito de Cabecera: 120 USD (afecta Gasto, distribuido por Total de Línea).
Resolución en SAP B1
Prorrateo de Envío (500 USD por Peso total = 100 kg):
Tarjetas Madre (80 kg / 100 kg = 80%): $500 \times 0.80 = 400\text{ USD}$ ($40\text{ USD/unidad}$).
Procesadores (20 kg / 100 kg = 20%): $500 \times 0.20 = 100\text{ USD}$ ($5\text{ USD/unidad}$).
Prorrateo de Seguro (120 USD por Total comercial = 12,000 USD):
Tarjetas Madre (8,000 / 12,000 = 66.67%): $80\text{ USD}$.
Procesadores (4,000 / 12,000 = 33.33%): $40\text{ USD}$.
Costos Resultantes en Inventario:
Tarjeta Madre: Costo base 800 USD + Porte 40 USD = 840 USD/unidad en inventario.
Procesador Xeon: Costo base 200 USD + Porte 5 USD = 205 USD/unidad en inventario.
Seguro de 120 USD se debita a la cuenta de pérdidas 630100 (Gastos de Seguros de Transporte).


4. Banco de Evaluación Situacional (Certificación SAP)
Pregunta 1: Al ingresar una Factura de Proveedores con artículos valorados por Promedio Ponderado, se añade un porte de 150 USD configurado con la casilla "Stock" marcada. ¿Cuál es el impacto en el asiento contable registrado en el libro mayor?

A) Se debita la cuenta de Gasto de Porte por 150 USD y se acredita la cuenta del Proveedor.
B) Se debita la cuenta de Inventario por el valor de compra más los 150 USD de porte, acreditando al Proveedor; no aparece una línea separada para el gasto de porte.
C) Se crea un documento independiente de Precios de Entrega de forma automática.
D) El porte se debita a una cuenta de Desviación de Existencias.
Respuesta Correcta: B.
Justificación Técnica: Cuando un porte de compras tiene activada la casilla Stock y el artículo se gestiona con inventario permanente (FIFO, MAP o Lote/Serie), el importe se incorpora directamente en el débito a la cuenta de existencias, incrementando el costo unitario del inventario. No se registra en cuenta de gastos separada.

Pregunta 2: Se configuró un porte a nivel de línea con el método de arrastre (Drawing Method) "Todos" (All). El pedido de cliente original contiene 10 unidades con un cargo de porte por seguro de 50 USD. Si se genera una Entrega parcial por solo 2 unidades, ¿qué importe de porte se transferirá a la Entrega?

A) 10 USD (el 20% proporcional a las unidades).
B) 0 USD, porque el pedido aún no está completamente cerrado.
C) 50 USD (la totalidad del porte de la línea en la primera extracción).
D) El sistema bloquea la entrega parcial si el método es All.
Respuesta Correcta: C.
Justificación Técnica: El método Todos (All) transfiere el 100% del importe del porte en el primer documento de arrastre parcial, con independencia de que solo se haya copiado una fracción de la cantidad física de artículos.

Pregunta 3: ¿Por qué un usuario no puede desmarcar la casilla "Gestionar porte en documentos" en las Parametrizaciones de documento de una sociedad productiva?

A) Porque el usuario no tiene permisos de superusuario en el sistema.
B) Porque dicha parametrización es estructural e irreversible en SAP Business One una vez que se ha contabilizado al menos un documento en la empresa.
C) Porque requiere primero cerrar el período contable fiscal.
D) Porque existen artículos con stock negativo en los almacenes.
Respuesta Correcta: B.
Justificación Técnica: La activación de gestión de portes modifica permanentemente las estructuras de cálculo de totales en las tablas de marketing (OINV, ORDR, OPCH, etc.); SAP prohíbe su desactivación una vez registrado cualquier documento.

Pregunta 4: En un documento de ventas, ¿cuál es el propósito técnico y contable de marcar "Sí" en la columna "Distribuir porte" a nivel de fila?

A) Modificar el costo unitario del artículo en el almacén de salida.
B) Fines meramente informativos para analizar el margen bruto por línea de producto, sin ningún impacto contable adicional en el libro mayor.
C) Trasladar el porte al costo de mercancías vendidas (COGS).
D) Dividir la factura legal en varias cuentas por cobrar.
Respuesta Correcta: B.
Justificación Técnica: En ventas, los ingresos por portes se reconocen íntegramente en las cuentas de resultados definidas en OEXD. Distribuir el porte de cabecera a las líneas de venta es una funcionalidad analítica para reportes de rentabilidad de línea, sin afectar las cuentas de existencias.