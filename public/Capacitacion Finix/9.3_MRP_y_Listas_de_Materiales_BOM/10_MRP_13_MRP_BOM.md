UNIDAD 061: MRP PARA LISTAS DE MATERIALES (BOM), TIEMPO DE ESPERA ACUMULADO Y ESTRUCTURAS MULTINIVEL (SAP BUSINESS ONE 10.0)
Código de Manual: 10_MRP_13_MRP_BOM
Módulo Oficial: Planificación de Necesidades de Materiales (MRP) y Producción
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores de Producción/MRP, Jefes de Operaciones, Planificadores de Cadena de Suministro y Agentes IA (Antigravity)
Carpeta Asociada: 061_10_MRP_13_MRP_BOM


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "061",

  "topic": "MRP for Bills of Materials (BOM), Cumulative Lead Time & Multi-Level Planning",

  "sap_module": "Production_MRP",

  "database_tables": {

    "bill_of_materials_header": "OITT",

    "bill_of_materials_lines": "ITT1",

    "item_master_planning": "OITM (PlanningSys, PrcrmntMtd, LeadTime, ToleranDay)",

    "mrp_scenario_header": "OMRP",

    "mrp_recommendations": "MRP1",

    "production_orders": "OWOR",

    "purchase_requests": "OPRQ",

    "purchase_orders": "OPOR",

    "inventory_transfer_requests": "OWTQ"

  },

  "menu_paths": [

    "Producción > Lista de materiales",

    "Planificación de necesidades > Asistente MRP",

    "Planificación de necesidades > Recomendación de pedidos",

    "Inventario > Datos maestros de artículo > Pestaña Datos de planificación"

  ],

  "mrp_recommendation_types": {

    "Production_Order": {

      "target_items": "Artículos con método de aprovisionamiento 'Efectuar' (Make)",

      "trigger": "Demanda neta del artículo superior o intermedio en la estructura de la lista de materiales"

    },

    "Purchase_Document": {

      "target_items": "Artículos con método de aprovisionamiento 'Comprar' (Buy)",

      "documents": ["Solicitud de compra (Purchase Request)", "Pedido de compra (Purchase Order)"],

      "trigger": "Demanda neta de componentes inferiores o artículos sin lista de materiales"

    },

    "Inventory_Transfer_Request": {

      "target_items": "Artículos 'Make' o 'Buy' disponibles en otro almacén",

      "condition": "Escenario configurado por almacén con opción de generar solicitudes de traslado entre depósitos"

    }

  },

  "lead_time_mechanics": {

    "cumulative_lead_time": "Suma secuencial de tiempos de aprovisionamiento y ensamblaje a través de todos los niveles del árbol BOM",

    "ignore_cumulative_lead_time_flag": "Opción en Paso 2 del Asistente MRP. Si se marca, toma solo el Lead Time del artículo padre ignorando la cadena de hijos (No recomendado en manufactura real)",

    "theoretical_recommendation": {

      "condition": "Demanda del artículo padre situada en el horizonte futuro fuera del rango de planificación pero cuyo tiempo de espera acumulado exige iniciar compras dentro del horizonte actual",

      "display": "Aparece en la columna 'Datos futuros' con etiqueta 'Recomendación teórica' para equilibrar la demanda sin mostrar saldo negativo",

      "restriction": "Exclusivo para artículos con método de aprovisionamiento 'Efectuar' (Make)"

    }

  },

  "bom_types_behavior_in_mrp": {

    "Production_BOM": "Calcula necesidades multinivel completas y genera órdenes de producción para el padre y compras para los componentes",

    "Sales_Assembly_BOM": "El padre NO es un artículo de inventario; NO recibe recomendaciones de producción. El sistema emite una línea de suministro compensatoria ('Compensación de estructura de montaje') y genera recomendaciones de compra únicamente para los componentes hijos"

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 El Algoritmo MRP en Estructuras Multinivel de Lista de Materiales (BOM)
En entornos de manufactura y ensamblaje, la demanda no opera de manera aislada sobre un único código de producto. En SAP Business One, cuando un artículo superior (Parent Item) tiene asociada una Lista de Materiales de Producción (OITT), cualquier demanda neta (procedente de pedidos de clientes, órdenes de venta o previsiones de ventas) se traslada en cascada (explosionado de lista de materiales) hacia todos los componentes subordinados (Child Items y Grandchild Items).

El cálculo de necesidades brutas a netas evalúa en cada nivel: $$\text{Necesidad Neta} = \text{Demanda Bruta} - (\text{Stock Inicial} + \text{Suministros Confirmados} - \text{Stock de Seguridad})$$

Si el componente es producido internamente (Make), el MRP propone una Orden de Fabricación; si es adquirido externamente (Buy), genera una Solicitud o Pedido de Compra.
2.2 Tiempos de Espera Acumulados (Cumulative Lead Time)
Uno de los factores determinantes en la precisión del MRP es la sincronización temporal:

Definición de Lead Time: Número de días hábiles transcurridos desde que se emite una orden de compra o fabricación hasta que el artículo está físicamente disponible en el almacén (OITM.LeadTime).
Tiempo de Espera Acumulado (Cumulative Lead Time): Es el tiempo total requerido para fabricar el producto terminado desde el nivel cero, considerando los tiempos de aprovisionamiento de las materias primas más los tiempos de fabricación de los subconjuntos intermedios. $$\text{Tiempo Acumulado} = \text{Lead Time (Materias Primas)} + \text{Lead Time (Subconjunto)} + \text{Lead Time (Producto Final)}$$
Opción "Ignorar tiempo de espera acumulado": En el Paso 2 del Asistente MRP, existe la casilla Ignorar tiempo de espera acumulado. Si se marca, el sistema asume que los componentes ya están disponibles y programa la producción basándose únicamente en el tiempo de ensamble del padre. En entornos industriales reales esto genera roturas de stock, por lo que las mejores prácticas dictan mantener desmarcada esta opción.
2.3 Recomendaciones Teóricas en la Columna "Datos Futuros"
¿Qué ocurre cuando un cliente solicita un producto terminado para una fecha posterior al horizonte de planificación del MRP?

Ejemplo: El horizonte del asistente concluye el 31 de marzo, pero existe un pedido de 10 servidores para el 2 de abril.
Si el tiempo acumulado de fabricación y compras es de 4 días, la compra de las placas base y discos duros debe iniciarse el 29 de marzo (dentro del horizonte actual).
Para evitar mostrar un saldo negativo sin justificación en el horizonte futuro, SAP Business One genera una Recomendación Teórica (Theoretical Recommendation) en la columna Datos futuros, balanceando la necesidad futura y permitiendo que se generen las órdenes de compra necesarias en las fechas presentes.
2.4 Impacto de Almacenes Excluidos en la Lista de Materiales
En el Paso 4 del Asistente MRP, el planificador puede decidir ejecutar el cálculo por almacén o a nivel de empresa consolidada, excluyendo ciertos depósitos logísticos.

Regla Crítica de Integridad: Si un componente de la lista de materiales tiene configurado un almacén específico en la línea de la BOM (ITT1.Warehouse) y dicho almacén es excluido del escenario MRP, el sistema emitirá un mensaje de advertencia bloqueante y no generará recomendaciones para el artículo padre, debido a que el sistema no puede garantizar la disponibilidad de los insumos indispensables para la orden de fabricación.
2.5 Comportamiento de Listas de Materiales de Venta y Montaje en MRP
A diferencia de las listas de producción, los artículos padre de una Lista de Materiales de Ventas o de Montaje son artículos no inventariables que no se fabrican formalmente en planta mediante órdenes de fabricación.
Cuando existe demanda para un Kit de Ventas, el MRP no recomienda producir el Kit. En su lugar, el sistema inserta una entrada de suministro ficticia denominada Compensación de estructura de montaje (Assembly Tree Balancing) para nivelar la fila del padre, y emite recomendaciones reales de adquisición únicamente para los componentes físicos que integran el paquete.


3. ATLAS DIDÁCTICO: ARQUITECTURA DE DESGLOSE BOM EN MRP
[ S10001: Servidor Empresarial ] (Make - Lead Time: 2 días)

  │  ▲ Nivel 0 (Padre Superior) -> Recomendación: ORDEN DE PRODUCCIÓN

  │

  ├── [ C00001: Teclado USB ] (Buy - Lead Time: 2 días)

  │     ▲ Nivel 1 (Hijo) -> Recomendación: PEDIDO DE COMPRA

  │

  ├── [ P10009: Computadora Base PC ] (Make - Lead Time: 2 días)

  │     ▲ Nivel 1 (Subconjunto) -> Recomendación: ORDEN DE PRODUCCIÓN

  │     │

  │     ├── [ C00097: Placa Madre ] (Buy - Lead Time: 2 días) -> PEDIDO DE COMPRA

  │     ├── [ C00099: Disco Duro 1TB ] (Buy - Lead Time: 2 días) -> PEDIDO DE COMPRA

  │     └── [ C00098: Chasis Servidor ] (Buy - Lead Time: 2 días) -> PEDIDO DE COMPRA

  │

  └── [ RECURSO: Mano de Obra Ensamble ] (Resource - Horas hombre)

        ▲ No genera inventario; excluido de compra física

Tiempo Acumulado Total = 2 días (Insumos) + 2 días (Subconjunto PC) + 2 días (Servidor) = 6 días hábiles.


4. CASO DE NEGOCIO RESUELTO: FABRICACIÓN DE SERVIDORES EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers recibe un pedido de cliente por 10 Servidores S10001 con fecha de entrega comprometida para el Lunes 8 de Octubre.

Lead Time del Servidor (S10001): 2 días.
Lead Time del Subconjunto PC (P10009): 2 días.
Lead Time de los Discos Duros (C00099) y Placas Madre (C00097): 2 días.
No se dispone de stock previo en almacén. Se consideran días hábiles de lunes a viernes.
Programación Hacia Atrás (Backward Scheduling) del MRP:
Disponibilidad Requerida del Servidor: Lunes 8 de Octubre a primera hora $\rightarrow$ Finalización requerida el Viernes 5 de Octubre.
Inicio de Ensamble del Servidor: Miércoles 3 de Octubre (2 días antes). En esta fecha la Computadora Base P10009 debe estar terminada.
Inicio de Fabricación de la PC P10009: Lunes 1 de Octubre (2 días antes de su necesidad).
Emisión de Pedidos de Compra a Proveedores (Discos y Placas): Jueves 27 de Septiembre (2 días hábiles antes del 1 de Octubre).
Resultado del Asistente: El informe de recomendaciones genera órdenes de compra fechadas al 27 de septiembre y órdenes de fabricación sincronizadas secuencialmente, asegurando la entrega perfecta sin inventarios ociosos.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
Cuando se ejecuta el Asistente MRP para un artículo padre con Lista de Materiales de Producción que tiene subcomponentes de compra y subconjuntos intermedios, ¿cuáles recomendaciones genera el sistema?
A) Únicamente solicitudes de compra para todos los niveles.
B) Órdenes de producción para el artículo padre y los subconjuntos "Make", y solicitudes/pedidos de compra para los componentes "Buy".
C) Únicamente una orden de compra global dirigida al proveedor del chasis.
D) No genera recomendaciones hasta que se emita la factura de clientes.
Respuesta Correcta: B
Justificación Técnica: El MRP de SAP Business One evalúa el campo Método de Aprovisionamiento (PrcrmntMtd) de cada nodo del árbol de la BOM: los artículos marcados como 'Efectuar' generan propuestas de órdenes de fabricación, mientras que los marcados como 'Comprar' generan documentos de aprovisionamiento de compras.
Pregunta 2
¿Qué es una "Recomendación Teórica" (Theoretical Recommendation) en los resultados del Asistente MRP de SAP Business One?
A) Una propuesta de compra que el usuario puede ignorar sin consecuencias operativas.
B) Una recomendación ficticia en la columna de 'Datos Futuros' para un artículo de producción cuya demanda cae fuera del horizonte de planificación, pero cuyo tiempo de espera acumulado exige iniciar la adquisición de componentes dentro del horizonte actual.
C) Un informe estadístico de ventas proyectadas sin base en inventario.
D) Una orden de trabajo para mantenimiento preventivo de maquinaria.
Respuesta Correcta: B
Justificación Técnica: Cuando la demanda final está situada en el futuro pero la acumulación de plazos de entrega de sus componentes obliga a emitir compras inmediatas dentro del horizonte activo, el sistema equilibra la demanda futura mediante una recomendación teórica para artículos 'Make'.
Pregunta 3
Si se ejecuta el Asistente MRP para una Lista de Materiales de Venta (Sales BOM) o de Montaje (Assembly BOM), ¿qué recomendación emite el sistema para el artículo padre?
A) Una orden de fabricación estándar.
B) Ninguna recomendación de producción; el sistema inserta una partida de suministro de compensación de árbol de montaje para equilibrar la demanda y solo genera recomendaciones de compra para los componentes de inventario hijos.
C) Una orden de desguace de materiales.
D) Un traslado obligatorio entre almacenes fiscales.
Respuesta Correcta: B
Justificación Técnica: Los artículos padre de listas de montaje y ventas son artículos conceptuales que no se gestionan en inventario físico permanente; por tanto, el MRP no puede generar órdenes de producción para ellos y canaliza la planificación directamente hacia sus componentes físicos.