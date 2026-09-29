Unidad 077: Costo Estándar de Producción y Cálculo de Costos en SAP Business One 10.0
Metadatos Técnicos
Módulo: Producción y MRP (Production & MRP)
Código de Documento: DOC_077_Production_CostCalculation
Audiencia Objetivo: Consultores de Producción y Costos, Controllers Financieros, Diseñadores de Listas de Materiales (BOM) y Gerentes de Operaciones.
Prerrequisitos: Proceso de Producción en Inventario Continuo, Conceptos de Subproductos y Cantidad Adicional (Additional Quantity), Datos Maestros de Recursos y Artículos.
Versión SAP B1: SAP Business One 10.0 FP 2008 / HANA & SQL.


JSON Antigravity Master Schema
{

  "unit_id": "077",

  "document_code": "DOC_077_Production_CostCalculation",

  "topic": "Production Standard Cost Management, BOM Costing, Rollup and Update",

  "module": "Production",

  "version": "10.0",

  "data_architecture": {

    "primary_tables": [

      {

        "table_name": "OITM",

        "description": "Item Master Data (Costo Estándar de Producción y bandera de inclusión en Rollup)",

        "key_fields": ["ItemCode", "ProdStdCost", "InCostRoll", "ItemType", "EvalSystem"]

      },

      {

        "table_name": "OITT / ITT1",

        "description": "Bill of Materials Header and Lines (Tamaño promedio de lote, Cantidad Adicional, Costos Estándar calculados)",

        "key_fields": ["Code", "Qauntity", "PlnAvgPrSz", "ItemCode", "Type", "Quantity", "AddQuantity", "StdCost"]

      },

      {

        "table_name": "ORSC / RSC1",

        "description": "Resource Master Data & Cost Components (Hasta 10 componentes de costo estándar por recurso)",

        "key_fields": ["ResCode", "ResType", "CostPrc1", "CostPrc2", "CostPrc3", "CostPrc10"]

      },

      {

        "table_name": "ORGP",

        "description": "Resource Groups (Nombres de componentes de costos estándar y proporciones por defecto)",

        "key_fields": ["ResGrpCod", "CostName1", "CostName2", "CostName10"]

      },

      {

        "table_name": "OGDR / GDR1",

        "description": "Advanced G/L Account Determination for Resources (Enlace de componentes de costo con cuentas de gastos de recursos)",

        "key_fields": ["RuleId", "ResCode", "CostComponent", "AcctCode"]

      }

    ],

    "menu_navigation_paths": [

      "Producción -> Lista de materiales (Campos Costo estándar de producción y Tamaño promedio de producción planificado)",

      "Inventario -> Datos maestros de artículo -> Ficha Producción (Casilla 'Incluido en acumulación de costes estándar de producción')",

      "Producción -> Gestión de costes estándar de producción -> Actualización de costes estándar de producción",

      "Producción -> Gestión de costes estándar de producción -> Acumulación de costes estándar de producción (Rollup)",

      "Gestión -> Definición -> Finanzas -> Determinación de cuentas de mayor -> Ficha Recursos"

    ],

    "business_rules": [

      {

        "rule_id": "BR_CST_01",

        "name": "Perpetual Inventory Mandatory Constraint",

        "description": "La funcionalidad completa de Costo Estándar de Producción (Rollup y Update) está estrictamente restringida a empresas configuradas con sistema de inventario continuo (Perpetual Inventory)."

      },

      {

        "rule_id": "BR_CST_02",

        "name": "Production Std Cost Formula with Fixed Additional Costs",

        "description": "El cálculo del Costo Estándar Total de un componente en la Lista de Materiales absorbe la cantidad variable y la porción prorrateada de la cantidad fija adicional: Costo = (Costo_Std * Cantidad) + ((Costo_Std / Tamaño_Promedio_Lote) * Cantidad_Adicional)."

      },

      {

        "rule_id": "BR_CST_03",

        "name": "Costing Execution Best Practice Sequence",

        "description": "En entornos de manufactura, el ciclo de actualización presupuestaria debe ejecutarse en dos pasos secuenciales estrictos: 1) Ejecutar 'Actualización de costes estándar' para alinear el costo estándar de los insumos y materias primas con sus costos reales de adquisición; 2) Ejecutar 'Acumulación de costes estándar' (Rollup) para proyectar en cascada los nuevos costos calculados a través de todos los niveles del árbol de materiales hacia el producto terminado."

      }

    ]

  }

}


Desarrollo Conceptual y Funcional Detallado
1. El Propósito del Costo Estándar de Producción (Production Standard Cost)
En entornos industriales de alta volatilidad donde los costos de materias primas y tarifas energéticas fluctúan constantemente, la gestión presupuestaria requiere un Costo Estándar de Producción (Production Std. Cost) como costo presupuestado de referencia (Budgeted Baseline).

Este valor permite a la dirección financiera:

Establecer un costo de referencia presupuestado frente al cual contrastar los costos reales de fabricación (Actual vs. Budget Variance).
Servir de base para la fijación de precios en listas de venta y cálculo de márgenes teóricos de rentabilidad.
Actualizar y proyectar masivamente las estructuras de costos a través de múltiples niveles de Listas de Materiales (BOMs multinivel) sin recurrir a cálculos manuales en hojas de cálculo externas.


2. Estructura de Costos de Recursos (Resource Standard Costs)
El costo estándar de un recurso (máquina, línea de producción o mano de obra técnica) no es una cifra plana, sino que se compone de hasta 10 componentes de costo estándar independientes:

Grupo de Recursos (ORGP): Define la nomenclatura de los componentes (ej. Componente 1: Amortización; Componente 2: Mantenimiento; Componente 3: Electricidad; Componente 4: Mano de Obra Indirecta).
Maestro de Recursos (ORSC/RSC1): Asigna el valor monetario a cada componente. El costo unitario total del recurso es la sumatoria aritmética de todos sus componentes activos.
Determinación de Cuentas de Mayor: En la determinación contable estándar (o mediante reglas en la Determinación Avanzada), cada uno de los 10 componentes de costo se vincula a una cuenta contable de gastos de recursos específica (510160, 510170, etc.). Cuando el recurso se imputa en una orden de fabricación, el crédito se distribuye en las cuentas de gastos asociadas según la composición configurada.


3. La Ecuación de Cálculo del Costo Estándar en la Lista de Materiales (BOM)
En la cabecera de la Lista de Materiales (OITT), existen dos campos estructurales clave:

Costo Estándar de Producción (Production Std. Cost): Campo informativo proveniente del Dato Maestro del Artículo (OITM.ProdStdCost).
Tamaño Promedio de Producción Planificado (Planned Average Production Size - OITT.PlnAvgPrSz): Representa el tamaño de lote económico o tirada estándar promedio habitual que la planta procesa en una sola orden de fabricación (ej. 10 unidades, 100 unidades).
El Impacto de la Cantidad Adicional (Additional Quantity - Costo Fijo)
En manufactura existen consumos que son fijos e independientes del volumen del lote (por ejemplo, 1 hora de calibración del torno antes de iniciar la corrida, o 2 metros de cable para pruebas de encendido). Esto se modela mediante la Cantidad Adicional (AddQuantity).

Para que el Costo Estándar unitario del producto terminado absorba adecuadamente este costo fijo, SAP Business One aplica la fórmula maestra:

$$\text{Costo Estándar Total del Componente} = (\text{Costo Std.} \times \text{Cantidad}) + \left( \frac{\text{Costo Std.}}{\text{Tamaño Promedio Lote}} \times \text{Cantidad Adicional} \right)$$

Donde:

$(\text{Costo Std.} \times \text{Cantidad})$ es el Costo Variable Directo proporcional a cada unidad producida.
$\left( \frac{\text{Costo Std.}}{\text{Tamaño Promedio Lote}} \times \text{Cantidad Adicional} \right)$ es el Costo Fijo Prorrateado asignado a cada unidad terminada en función del tamaño estándar de la tirada.


4. Rutinas de Gestión de Costes Estándar de Producción
SAP Business One 10.0 proporciona dos asistentes automatizados para mantener la vigencia del modelo de costos:
A. Actualización de Costes Estándar de Producción (Production Std. Cost Update)
Ubicación: Producción -> Gestión de costes estándar de producción -> Actualización de costes estándar de producción.
Función: Permite copiar de forma masiva el costo real actual de los artículos (costo de valoración en el kardex según Media Ponderada, FIFO o Estándar) hacia el campo Costo estándar de producción del maestro OITM.
Alcance: Es aplicable a cualquier artículo de la base de datos (tanto materias primas adquiridas a proveedores como ensambles y productos semielaborados).
B. Acumulación de Costes Estándar de Producción (Production Std. Cost Rollup)
Ubicación: Producción -> Gestión de costes estándar de producción -> Acumulación de costes estándar de producción.
Función: Lee el costo estándar de todos los insumos (artículos y recursos) configurados en las Listas de Materiales y calcula el nuevo costo total del producto terminado, actualizando el campo OITM.ProdStdCost del padre.
Procesamiento Multinivel: La rutina realiza una explosión matemática en cascada a través de todos los niveles del árbol de manufactura (Nivel 3 -> Nivel 2 -> Nivel 1 -> Nivel 0).
Filtro Requerido: Solo procesa aquellos artículos que tengan marcada la casilla Incluido en acumulación de costes estándar de producción (Included in Production Std. Cost Rollup) en la ficha Producción del Dato Maestro del Artículo.
Secuencia Metodológica Recomendada
[Paso 1: Actualización de Costes Estándar (Update)]

   Sincroniza los costos estándar de las materias primas compradas 

   con sus costos reales de adquisición recientes.

                       │

                       ▼

[Paso 2: Acumulación de Costes Estándar (Rollup)]

   Explota las BOMs y proyecta en cascada el nuevo costo estándar 

   hacia los semielaborados y productos terminados.


Caso de Negocio Resuelto: OC WoodTrend / OEC Computers
Contexto
OC WoodTrend detectó que el costo de fabricación de su Puerta de Madera Decorativa oscilaba entre $180 y $240 debido a variaciones en la preparación de máquinas y fluctuaciones de precio en herrajes. La dirección de finanzas decide implementar la gestión de Costo Estándar de Producción para presupuestar un costo base oficial de $200.00 y medir variaciones mensuales.
Parámetros de la Lista de Materiales (D00002 - Puerta Decorativa)
Tamaño Promedio de Producción Planificado: 10 puertas por corrida.
Componente 1: Plancha de Madera (W100)
Costo Estándar: $50.00 c/u.
Cantidad: 1 plancha por puerta. Cantidad adicional: 0.
Costo Total Componente: $50.00 \times 1 = \mathbf{$50.00}$.
Componente 2: Manija de Acero (H200)
Costo Estándar: $10.00 c/u.
Cantidad: 2 manijas por puerta. Cantidad adicional: 0.
Costo Total Componente: $10.00 \times 2 = \mathbf{$20.00}$.
Componente 3: Torno Industrial (R_LATHE)
Costo Estándar: $20.00 / hora (Amortización $10, Mantenimiento $5, Electricidad $5).
Cantidad: 2 horas por puerta. Cantidad adicional: 0.
Costo Total Recurso: $20.00 \times 2 = \mathbf{$40.00}$.
Componente 4: Operador Técnico Especializado (R_OPERATOR)
Costo Estándar: $30.00 / hora.
Cantidad: 2 horas por puerta (Variable).
Cantidad Adicional: 1 hora de preparación y calibración inicial de la estación de trabajo por lote (Fijo).
Cálculo del costo: $$\text{Costo Variable} = 30 \times 2 = $60.00$$ $$\text{Costo Fijo Prorrateado} = \left(\frac{$30.00}{10}\right) \times 1 = $3.00$$ $$\text{Costo Total Recurso Operador} = 60 + 3 = \mathbf{$63.00}$$
Costo Estándar Total Resultante en la BOM
$$\text{Costo Total} = $50.00 (\text{Madera}) + $20.00 (\text{Manijas}) + $40.00 (\text{Torno}) + $63.00 (\text{Operador}) = \mathbf{$173.00}$$

Al ejecutar la Acumulación de Costes Estándar (Rollup), el campo Costo Estándar de Producción en el Dato Maestro de la puerta decorativa D00002 se actualiza automáticamente de su valor histórico a $173.00 USD, estableciendo el nuevo presupuesto oficial contra el cual se auditará la planta.


Banco de Evaluación Situacional
Pregunta 1
En una Lista de Materiales, un recurso tiene un costo estándar de $40.00 USD por hora. En la línea de la BOM se define una cantidad requerida de 1.5 horas, una cantidad adicional fija de 2 horas para calibración, y el campo 'Tamaño promedio de producción planificado' en la cabecera es de 20 unidades. ¿Cuál es el Costo Estándar Total que el sistema calculará para este recurso por cada unidad producida?

A) $60.00 USD
B) $64.00 USD
C) $80.00 USD
D) $140.00 USD
Respuesta Correcta: B
Justificación Técnica: Aplicando la fórmula oficial: $$\text{Costo Total} = (\text{Costo Std} \times \text{Cantidad}) + \left(\frac{\text{Costo Std}}{\text{Tamaño Lote}}\right) \times \text{Cantidad Adicional}$$ $$\text{Costo Variable} = 40.00 \times 1.5 = $60.00 \text{ USD}$$ $$\text{Costo Fijo Prorrateado} = \left(\frac{40.00}{20}\right) \times 2 = 2.00 \times 2 = $4.00 \text{ USD}$$ $$\text{Costo Total} = 60.00 + 4.00 = \mathbf{$64.00 \text{ USD}}.$$
Pregunta 2
El controller de una fábrica nota que al ejecutar el asistente de 'Acumulación de costes estándar de producción' (Rollup), algunos productos terminados no actualizaron su costo estándar en el dato maestro a pesar de pertenecer al rango de artículos seleccionados. ¿Cuál es la causa más probable de esta omisión?

A) La lista de materiales de dichos artículos no contiene recursos de mano de obra.
B) Los artículos terminados no tienen seleccionada la casilla 'Incluido en acumulación de costes estándar de producción' en la ficha Producción de su Dato Maestro.
C) La empresa opera con el método de valoración FIFO en lugar de Costo Estándar.
D) No se ha ejecutado el Cierre del Período contable en el módulo de Finanzas.
Respuesta Correcta: B
Justificación Técnica: La rutina de Acumulación (Rollup) valida estrictamente la bandera OITM.InCostRoll (Incluido en acumulación de costes estándar de producción). Si esta casilla no está marcada en el dato maestro del artículo, el asistente ignora el producto terminado para proteger configuraciones manuales o especiales de costos.
Pregunta 3
¿Cuál es la secuencia recomendada de mejores prácticas en SAP Business One para actualizar los costos presupuestados de manufactura antes de iniciar un nuevo ejercicio fiscal?

A) Primero ejecutar el Rollup de la BOM y luego actualizar los costos estándar de los componentes.
B) Ejecutar una Revalorización de Inventario masiva para todos los artículos en almacén.
C) Primero ejecutar la 'Actualización de costes estándar de producción' para sincronizar el costo de los insumos y materias primas con los costos reales de adquisición, y posteriormente ejecutar la 'Acumulación de costes estándar de producción' (Rollup) para proyectar los costos en cascada hacia los productos terminados.
D) Modificar manualmente el costo de cada recurso en las Órdenes de Fabricación activas.
Respuesta Correcta: C
Justificación Técnica: La actualización de abajo hacia arriba (Bottom-Up) garantiza la consistencia del presupuesto: primero se actualizan los costos base de las materias primas compradas según sus precios reales recientes (Production Std. Cost Update), y luego se corre el Rollup para que la fórmula de las Listas de Materiales calcule con precisión los nuevos costos estándar de ensambles intermedios y productos terminados a través de todos los niveles.