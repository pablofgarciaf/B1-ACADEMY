UNIDAD 006: GESTIÓN DE UBICACIONES EN ALMACÉN - RESUMEN GENERAL (SAP BUSINESS ONE 10.0)
Código de Manual: 10_BinLoc_11_Overview_Overview_ES
Módulo Oficial: Inventario / Ubicaciones (Bin Locations - WMS)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Logísticos, Jefes de Almacén, Contadores de Inventario y Agentes IA (Antigravity)
Carpeta Asociada: 006_10_BinLoc_11_Overview_Overview_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "006",

  "topic": "Bin Locations Overview & Warehouse Hierarchy",

  "sap_module": "Inventory_WMS",

  "database_tables": {

    "warehouse_master": "OWHS",

    "bin_location_master": "OBIN",

    "warehouse_sublevels": "OSBL",

    "sublevel_codes": "SBL1",

    "bin_location_attributes": "OBAT",

    "inventory_posting_content": "OIBQ"

  },

  "menu_paths": [

    "Inventario > Ubicaciones > Datos maestros de ubicación",

    "Gestión > Definición > Inventario > Almacenes (Activar ubicaciones)",

    "Gestión > Definición > Inventario > Ubicaciones > Subniveles de almacén",

    "Inventario > Informes de inventario > Lista de contenido de la ubicación"

  ],

  "hierarchy_structure": {

    "max_sublevels": 4,

    "typical_architecture": [

      { "level": 0, "name": "Almacén (Warehouse)", "example": "01" },

      { "level": 1, "name": "Subnivel 1: Pasillo (Aisle)", "example": "A4" },

      { "level": 2, "name": "Subnivel 2: Estantería (Shelf / Rack)", "example": "S2" },

      { "level": 3, "name": "Subnivel 3: Nivel / Altura (Level)", "example": "L9" }

    ],

    "bin_code_formula": "WarehouseCode - Sublevel1 - Sublevel2 - Sublevel3",

    "example_code": "01-A4-S2-L9"

  },

  "inbound_allocation_strategies": {

    "Receiving_Bin_Location": "Ubicación receptora de tránsito para control de calidad e inspección",

    "Default_Bin_Location": "Prioridad en cascada: 1. Artículo -> 2. Grupo de Artículos -> 3. Almacén",

    "Current_Bin_Location": "Asigna a la ubicación donde el artículo ya tiene stock positivo",

    "Last_Bin_Location": "Asigna a la última ubicación utilizada por el artículo",

    "Historical_Bin_Location": "Asigna a cualquier ubicación histórica donde residió el artículo"

  },

  "outbound_allocation_strategies": {

    "Bin_Code_Order": "Orden alfanumérico estricto del código de depósito",

    "Alternative_Sort_Code_Order": "Secuencia optimizada de recorrido en bodega",

    "Ascending_Quantity": "Prioriza vaciar primero las ubicaciones con menor saldo para liberar espacio",

    "Descending_Quantity": "Toma de la ubicación con mayor saldo para minimizar líneas de picking",

    "FIFO_Entry_Date": "Asigna según la fecha de entrada más antigua en inventario"

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 El Reto Logístico y la Solución de Ubicaciones
En almacenes de mediana y gran escala, uno de los mayores cuellos de botella radica en la lentitud del almacenamiento y del picking. Cuando los operarios no disponen de una zonificación estandarizada, las mercancías del mismo código se dispersan aleatoriamente en cualquier espacio libre, generando tiempos muertos y errores de despacho.

La funcionalidad de Ubicaciones (Bin Locations) en SAP Business One 10.0 resuelve este desafío dividiendo los almacenes físicos en celdas tridimensionales trazables, permitiendo:

Conocer con exactitud milimétrica la posición física de cada unidad de stock.
Optimizar los recorridos del personal de almacén mediante listas de picking estructuradas.
Restringir capacidades por peso, volumen, lote o estado de cuarentena.
2.2 Jerarquía de Almacén y Estructura del Código de Depósito
SAP Business One modela la bodega física como un árbol jerárquico con hasta 4 subniveles:

Almacén: Entidad legal/física mayor (ej. Almacén 01 - Principal).
Subnivel 1 (Pasillo / Aisle): Vía de tránsito principal (ej. A1, A2, A3).
Subnivel 2 (Estantería / Shelf / Bay): Módulo vertical de racks dentro del pasillo (ej. S1, S2).
Subnivel 3 (Nivel / Altura / Level): Piso o altura dentro de la estantería (ej. L1, L2, L3).
Subnivel 4 (Opcional - Cajón / Bin Box): Subdivisión menor dentro del nivel.

El Código de Ubicación es una clave primaria única generada por la concatenación de sus subniveles separados por guiones (ej. 01-A4-S2-L9).
2.3 Estrategias de Asignación Automática: Entrada vs Salida
Asignación Entrante (Receiving):
Ubicación Receptora (Receiving Bin): Zona de descarga y cuarentena donde se reciben físicamente los pedidos de compra antes de pasar la inspección de calidad. Una vez validada la mercancía, se ejecuta un Traslado de Inventario hacia las ubicaciones de almacenamiento definitivo.
Estrategia de Ubicación por Defecto: Si no se usa ubicación receptora, el sistema busca en cascada: (1) Ubicación fija en Datos Maestros del Artículo -> (2) Ubicación fija del Grupo de Artículos -> (3) Ubicación por defecto del Almacén.
Asignación Saliente (Picking & Delivery):
Método de Cantidad Ascendente: Ideal para consolidación de espacio; obliga al recolector a retirar unidades de la ubicación con menor stock disponible para dejarla vacía y disponible para nuevos ingresos.
Método FIFO: Despacha primero los lotes con fecha de ingreso más antigua.


3. ATLAS DIDÁCTICO: EL CICLO OPERATIVO CON UBICACIONES
Jerarquía Visual de Subniveles:
Representación espacial de Pasillo $\rightarrow$ Estantería $\rightarrow$ Nivel $\rightarrow$ Ubicación.
Ciclo de Entrada con Ubicación Receptora:
Recepción en muelle (Entrada de mercancías) $\rightarrow$ Almacenamiento en Ubicación Receptora $\rightarrow$ Control de calidad $\rightarrow$ Traslado de inventario a Ubicación de Almacenamiento.
Ciclo de Salida con Lista de Picking:
Pedido de Cliente $\rightarrow$ Generación de Lista de Picking en el Cockpit de Almacén $\rightarrow$ Selección física dirigida $\rightarrow$ Entrega (Asignación saliente de ubicación).


4. CASO DE NEGOCIO RESUELTO: IMPLEMENTACIÓN EN OEC COMPUTERS
Escenario de Consultoría:
George, jefe de almacén de OEC Computers, necesita organizar el almacenamiento de Ratones Ópticos USB.

Se activa la gestión de ubicaciones en el Almacén 05 - Almacén Central.
Se definen los subniveles: Pasillo A1, Estantería S2, Nivel L1.
Se define la ubicación 05-REC-01 como Ubicación Receptora de muelle.
Flujo Operativo:
Recepción: El proveedor entrega 100 ratones. George registra la Entrada de mercancías por pedido (OPDN). El sistema asigna automáticamente las 100 unidades a 05-REC-01.
Inspección y Traslado: Tras verificar que los ratones funcionan correctamente, George abre el informe Lista de contenido de la ubicación, selecciona 05-REC-01 y pulsa Traslado. El sistema abre un traslado donde George envía 50 unidades a 05-A1-S2-L1 y 50 unidades a 05-A1-S2-L2.
Despacho / Picking: Llega un pedido de venta de 25 ratones. En la Entrega, el sistema aplica la estrategia de cantidad ascendente y descuenta las 25 unidades directamente de la ubicación de almacenamiento correspondiente.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Hasta cuántos subniveles de almacén permite configurar SAP Business One para estructurar los códigos de depósito de una ubicación?
A) Máximo 2 subniveles.
B) Hasta 4 subniveles de almacén.
C) No hay límites, es infinito.
D) Solo 1 subnivel por cada cajón financiero.
Respuesta Correcta: B
Justificación Técnica: SAP Business One admite hasta 4 subniveles jerárquicos (por ejemplo: Pasillo, Estantería, Nivel y Sección), los cuales se combinan con el código del almacén para conformar el identificador unívoco de la ubicación.
Pregunta 2
¿Cuál es la función principal de una "Ubicación Receptora" (Receiving Bin Location) en la gestión de compras?
A) Servir como depósito para mercancías obsoletas o destruidas.
B) Actuar como una zona de tránsito y supervisión para inspección y control de calidad antes de que los artículos se trasladen a sus ubicaciones de almacenamiento final.
C) Almacenar productos vendidos que esperan transporte.
D) Facturar automáticamente los pedidos al proveedor.
Respuesta Correcta: B
Justificación Técnica: La ubicación receptora recibe transitoriamente los artículos entrantes para procedimientos de clasificación y control, impidiendo que se mezclen con el stock disponible general hasta que se emita el traslado.
Pregunta 3
Al realizar una asignación automática de salida en una Entrega, ¿qué objetivo persigue el método de "Cantidad Ascendente"?
A) Recoger siempre de la estantería más alta del almacén.
B) Vaciar prioritariamente las ubicaciones que contienen la menor cantidad de artículos para reducir el número total de ubicaciones ocupadas y optimizar el espacio.
C) Seleccionar los artículos con el precio de costo más elevado.
D) Despachar únicamente los artículos en cajas cerradas.
Respuesta Correcta: B
Justificación Técnica: La estrategia ascendente busca liberar huecos en el almacén dirigiendo el picking hacia aquellas ubicaciones con saldos residuales pequeños.