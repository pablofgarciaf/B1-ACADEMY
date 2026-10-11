UNIDAD 059: PLANIFICACIÓN DE NECESIDADES DE MATERIALES (MRP) EN SAP BUSINESS ONE 10.0
Código de Manual: 10_MRP_11_MRP_Process_ES
Módulo Oficial: Producción y Planificación (Production & MRP)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Planificadores de Producción, Jefes de Compras, Consultores de Cadena de Suministro y Agentes IA (Antigravity)
Carpeta Asociada: 059_10_MRP_11_MRP_Process_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "059",

  "topic": "Material Requirements Planning (MRP Process & Wizard Execution)",

  "sap_module": "Production_MRP",

  "mrp_core_equation": "Recomendaciones = (Stock_Disponible + Suministros_Esperados) - Demanda_Proyectada",

  "database_tables": {

    "mrp_scenarios": "OMRP",

    "mrp_results": "MRP1",

    "mrp_recommendations": "MRP2",

    "forecasts": "OFCT / FCT1",

    "item_planning_data": "OITM (MngMethod, PrchseItem, LeadTime, OrderIntrv, OrderMulti, MinOrder, ToleranDay)"

  },

  "menu_paths": [

    "Planificación de necesidades > Asistente de planificación de necesidades (MRP)",

    "Planificación de necesidades > Previsiones",

    "Planificación de necesidades > Recomendaciones de pedido",

    "Inventario > Datos maestros de artículo > Pestaña Datos de planificación"

  ],

  "mrp_components": {

    "Demand_Sources": [

      "Pedidos de cliente (ORDR)",

      "Previsiones / Pronósticos de ventas (OFCT)",

      "Órdenes de producción abiertas para componentes (OWOR)",

      "Niveles de inventario mínimos/necesarios (OITW)",

      "Solicitudes de traslado de almacén de origen (OWTQ)",

      "Acuerdos globales de venta y Facturas de reserva"

    ],

    "Supply_Sources": [

      "Pedidos de compra (OPOR)",

      "Solicitudes y ofertas de compra (OPRQ / OOPR)",

      "Órdenes de producción abiertas para producto terminado (OWOR)",

      "Solicitudes de traslado hacia almacén destino (OWTQ)",

      "Acuerdos globales de compra"

    ],

    "Generated_Recommendations": [

      "Pedidos de compra (Purchase Orders)",

      "Solicitudes de compra (Purchase Requests)",

      "Órdenes de producción (Production Orders)",

      "Solicitudes de traslado de inventario (Inventory Transfer Requests)"

    ]

  },

  "wizard_steps": [

    { "step": 1, "name": "Seleccionar escenario", "desc": "Elegir escenario existente o crear nuevo" },

    { "step": 2, "name": "Detalles del escenario", "desc": "Horizonte de planificación, periodicidad (días/semanas/meses) y calendario laboral" },

    { "step": 3, "name": "Selección de artículos", "desc": "Artículos a evaluar y expansión multinivel de LMat" },

    { "step": 4, "name": "Fuentes de datos de inventario", "desc": "Consolidado por Empresa vs desglose independiente por Almacén" },

    { "step": 5, "name": "Fuentes de documentos", "desc": "Selección de documentos de oferta/demanda y tolerancias" },

    { "step": 6, "name": "Resultados y Recomendaciones", "desc": "Matriz de resultados con pegging y generación de órdenes" }

  ]

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Principios Fundamentales del Motor MRP
El motor de Planificación de Necesidades de Materiales (MRP) en SAP Business One actúa como el cerebro logístico de la empresa, equilibrando el delicado balance entre disponibilidad de producto y costo de inventario inmovilizado. Su objetivo es calcular con precisión matemática qué comprar, qué fabricar y qué transferir entre bodegas, determinando:

¿Qué cantidad exacta se necesita? (considerando lote mínimo y múltiplos).
¿En qué fecha debe emitirse la orden? (restando el tiempo de entrega o Lead Time a la fecha de vencimiento de la demanda).
¿A qué almacén debe asignarse el aprovisionamiento?
2.2 Parametrización en Datos Maestros de Artículo (OITM)
En la pestaña Datos de planificación, se definen las reglas que rigen el cálculo:

Método de Planificación: Planificación de necesidades (MRP) o Ninguno.
Método de Aprovisionamiento:
Comprar: El sistema recomienda Pedidos o Solicitudes de Compra.
Fabricar: El sistema recomienda Órdenes de Producción y analiza la Lista de Materiales (LMat).
Intervalo de Pedido: Agrupa necesidades en ciclos temporales (ej. pedidos semanales solo los lunes para optimizar logística con el proveedor).
Pedido Múltiple (Order Multiple): Restricción de empaque industrial (ej. múltiplos de 50; si se necesitan 80, recomienda 100).
Cantidad de Pedido Mínima: Lote mínimo negociado contractualmente.
Ciclo de Producción / Tiempo de Entrega (Lead Time): Días calendario requeridos por el proveedor para despachar o por la planta para ensamblar.
Días de Tolerancia: Margen de gracia para aceptar entregas ligeramente posteriores a la necesidad sin disparar compras adicionales.
2.3 Ejecución a Nivel de Empresa vs Nivel de Almacén
Nivel de Empresa (Company Level): Consolida la demanda y el stock de todas las bodegas de la sociedad, generando recomendaciones centralizadas dirigidas al almacén predeterminado del artículo.
Nivel de Almacén (Warehouse Level): Trata cada almacén como un centro logístico autónomo. Si el Almacén 01 tiene déficit y el Almacén 02 tiene excedente, el asistente puede recomendar Solicitudes de Traslado de Inventario (OWTR) antes de sugerir compras externas.


3. ATLAS DIDÁCTICO: EL FLUJO DE BALANCEO DE MRP
[ DEMANDA ]                     [ OFERTA / STOCK ]

• Pedidos de Cliente             • Stock Actual en Almacén

• Previsiones de Venta    VS     • Pedidos de Compra Pendientes

• Necesidad de Componentes       • Órdenes de Fabricación en Curso

• Niveles de Stock Mínimo        • Solicitudes de Traslado Entrantes

             │                           │

             └─────────────┬─────────────┘

                           ▼

                 [ ASISTENTE DE MRP ]

      (Aplica Lead Time, Lote Mínimo y Múltiplos)

                           │

                           ▼

                  [ RECOMENDACIONES ]

         • Comprar (Pedido / Solicitud)

         • Producir (Orden de Fabricación)

         • Trasladar (Solicitud entre Bodegas)


4. CASO DE NEGOCIO RESUELTO: PLANIFICACIÓN DE DISCOS DUROS EN OEC COMPUTERS
Escenario de Consultoría:
Michelle, jefa de compras de OEC Computers, debe abastecer el disco duro C00007 (Seagate 400 GB) para el mes de octubre:

Stock actual = 20 unidades.
Pedido de compra pendiente de ingresar = 30 unidades.
Pedidos en firme de clientes = 40 unidades.
Previsión de ventas estimada = 80 unidades.
Demanda Total = $40 + 80 = 120\text{ unidades}$.
Suministro Disponible = $20 + 30 = 50\text{ unidades}$.
Déficit Neto Inicial = $120 - 50 = 70\text{ unidades}$.
Restricciones del Proveedor: Pedido Múltiple = 50 unidades, Lead Time = 10 días.
Resultado del Asistente de MRP:
El déficit es de 70 unidades, pero el proveedor vende en múltiplos de 50.
MRP recomienda emitir una orden de compra por 100 unidades ($50 \times 2$).
Resta los 10 días de Lead Time a la fecha requerida, fijando la fecha de emisión de la orden con la antelación necesaria para que el stock arribe exactamente el día previsto.
En Recomendaciones de Pedido, Michelle pulsa Crear y se genera el Pedido de Compra consolidado en firme.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
Si un artículo tiene una necesidad neta de 85 unidades calculada por MRP, pero en su ficha de datos maestros tiene un "Pedido Múltiple" de 50 y una "Cantidad de Pedido Mínima" de 100, ¿cuál será la cantidad recomendada por el Asistente?
A) 85 unidades exactas.
B) 100 unidades.
C) 150 unidades.
D) 50 unidades.
Respuesta Correcta: B
Justificación Técnica: La necesidad (85) es inferior a la cantidad mínima (100). Como 100 es exactamente un múltiplo de 50 ($50 \times 2$), el sistema recomienda 100 unidades satisfaciendo ambas restricciones contractuales simultáneamente.
Pregunta 2
¿Cuál es la diferencia fundamental entre ejecutar el Asistente de MRP a nivel de "Empresa" frente a nivel de "Almacén"?
A) A nivel de empresa no se pueden fabricar artículos.
B) A nivel de empresa se consolidan las existencias y demandas de todos los almacenes haciendo sugerencias al almacén por defecto; a nivel de almacén se calculan balances independientes para cada almacén pudiendo recomendar traslados internos entre ellos.
C) A nivel de almacén se cancelan los pedidos de clientes atrasados.
D) A nivel de empresa no se toman en cuenta los tiempos de entrega (Lead Times).
Respuesta Correcta: B
Justificación Técnica: La ejecución por almacén analiza los desbalances territoriales entre bodegas habilitando solicitudes de traslado, mientras que la ejecución corporativa evalúa la sociedad como un único inventario global.
Pregunta 3
¿Qué documento transaccional se genera en SAP Business One cuando se acepta una recomendación de MRP para un artículo cuyo método de aprovisionamiento es "Fabricar"?
A) Una Factura de Clientes con estado cerrado.
B) Una Orden de Producción en estado Planificado.
C) Una Entrada de Mercancías por Pedido.
D) Un Asiento Contable manual de costos.
Respuesta Correcta: B
Justificación Técnica: Para artículos elaborados internamente, la recomendación de MRP genera una Orden de Producción (OWOR) lista para ser liberada a piso de planta cuando se disponga de los componentes.