UNIDAD 054: GESTIÓN DE PICK & PACK EN PROCESOS DE PRODUCCIÓN Y RUTAS
Código de Manual: 10_Inven_22_PNP_PNPProduction
Módulo Oficial: Inventario / Picking y Embalaje en Producción (Inventory - Pick & Pack for Production)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Planificadores de Producción, Jefes de Planta, Supervisores de Bodega de Materiales y Agentes IA (Antigravity)
Carpeta Asociada: 054_10_Inven_22_PNP_PNPProduction


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "054",

  "topic": "Pick Pack and Production Manager in Manufacturing & Routing",

  "sap_module": "Production_Pick_and_Pack",

  "database_tables": {

    "production_order_header": "OWOR (Production Order Header)",

    "production_order_lines": "WOR1 (Components, Resources & Text)",

    "production_routing_stages": "WOR4 (Production Order Routing Stages)",

    "pick_list_header": "OPKL (Pick List)",

    "pick_list_lines": "PKL1 (Pick List Component Rows)",

    "issue_for_production": "OIGE / IGE1 (Manual Component Consumption)",

    "receipt_from_production": "OIGN / IGN1 (Finished Good Receipt)"

  },

  "menu_paths": [

    "Inventario > Picking y embalaje > Gestor de picking y embalaje",

    "Producción > Orden de fabricación",

    "Producción > Emisión para producción",

    "Producción > Recibo de producción"

  ],

  "production_pnp_lifecycle": {

    "step_1_order_release": "La Orden de Fabricación (OWOR) pasa de estado 'Planificado' a 'Liberado'",

    "step_2_pnp_selection": "En el Gestor de Pick & Pack se filtran las órdenes por Planta/Área de Taller (Shop Floor), Fechas de Etapa de Ruta o Prioridad",

    "step_3_pick_list": "Se liberan los componentes a una Lista de Picking (OPKL) para recolección en el almacén de materia prima",

    "step_4_issue_for_production": "Desde el cajón 'Liberado' o 'Recolectado', se genera la 'Emisión para producción' (OIGE) para consumir los componentes del inventario (Excluye artículos Backflush)",

    "step_5_receipt_from_production": "Finalizado el ensamblaje en taller, se genera el 'Recibo de producción' (OIGN) desde el cajón 'Recolectado' para dar de alta el producto terminado en stock"

  },

  "routing_and_resources_integration": {

    "resource_rows_processing": "Las líneas de tipo 'Recurso' (Máquinas, Mano de Obra en ORSC) se incluyen en el Gestor de Pick & Pack para permitir la emisión integral del costo de capacidad junto con los insumos materiales",

    "routing_fields_in_pnp": [

      "Route Sequence (Secuencia de ruta)",

      "Route Stage (Etapa operativa)",

      "Start Date (Fecha de inicio de etapa)",

      "Delivery / Due Date (Fecha de fin de etapa)",

      "Production Priority (Prioridad de fabricación)"

    ],

    "backflush_exception": "Los componentes configurados como 'Notificación' (Backflush) se consumen automáticamente al ingresar el Recibo de Producción, por lo que se omiten en la generación manual de Emisiones desde Pick & Pack"

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 El Gestor de Pick & Pack como Mesa de Control de Manufactura (Workbench)
Tradicionalmente, el personal de planta interactuaba de forma fragmentada: abría la Orden de Fabricación, luego el módulo de Emisión de Componentes y finalmente la ventana de Recibo de Producto Terminado. En SAP Business One 10.0, el Gestor de Picking, Embalaje y Producción se consolida como un Workbench unificado donde el jefe de producción supervisa y ejecuta el ciclo fabril completo:

Identifica qué órdenes de fabricación han sido liberadas para manufactura.
Genera las listas de recolección para que el personal de bodega traslade los componentes (insumos, piezas, materias primas) hacia la línea de producción (Shop Floor).
Genera la Emisión para Producción (OIGE) que descuenta formalmente los materiales del inventario de materias primas y los carga al costo de la cuenta de Trabajos en Proceso (WIP).
Genera el Recibo de Producción (OIGN) que valoriza y da de alta el producto terminado en el almacén de productos finales.
2.2 Tratamiento de Recursos (Máquinas y Mano de Obra) en Pick & Pack
Una innovación crítica en la versión 10.0 es la inclusión de líneas de tipo Recurso (ORSC) en el Gestor de Pick & Pack:

Aunque un recurso no es un artículo físico que se almacene en estanterías ni se cargue en una carretilla, su presencia en el Gestor permite procesar la Orden de Fabricación en su totalidad.
Al pulsar el botón Crear > Emisión para producción, el sistema arrastra tanto los artículos de inventario (chips, cables, gabinetes) como los recursos de máquina (horas de torno, tiempo de ensamblaje automatizado) en un solo documento transaccional.
2.3 Órdenes de Fabricación con Rutas de Producción (Routing)
Para empresas que manejan procesos de manufactura secuenciales por fases (ej. Corte -> Soldadura -> Pintura -> Ensamble -> Control de Calidad):

El Gestor de Pick & Pack exhibe campos especializados de enrutamiento: Secuencia de Ruta (Route Sequence), Etapa de Ruta (Route Stage), Fecha de Inicio y Fecha de Fin de Etapa.
Esto permite filtrar la recolección únicamente para las etapas inmediatas que van a iniciar en el turno de trabajo, evitando saturar el piso de planta con materiales que corresponden a fases tardías.
La columna Prioridad de Producción permite ordenar la grilla para despachar primero los insumos de las órdenes más críticas.
2.4 La Regla de Exclusión de Artículos Backflush
Emisión Manual: Los componentes configurados como método de emisión Manual requieren explícitamente la creación de la Emisión para producción.
Emisión por Notificación (Backflush): Los componentes marcados como Backflush no se emiten anticipadamente desde Pick & Pack; el sistema los descuenta de forma automática en el momento en que se añade el Recibo de producción del producto terminado.


3. WORKFLOW INTEGRADO DE PICK & PACK EN MANUFACTURA
┌─────────────────────────────────────────────────────────────────────────┐

│              ORDEN DE FABRICACIÓN LIBERADA (OWOR / WOR1 / WOR4)         │

└────────────────────────────────────┬────────────────────────────────────┘

                                     │

                                     ▼

             [ FILTRO EN GESTOR DE PICK & PACK Y PRODUCCIÓN ]

             • Filtra por Área de Planta (Shop Floor / UDF)

             • Filtra por Etapa de Ruta (Route Stage) y Fechas

                                     │

                                     ▼ (Release to Pick List)

                   [ LISTA DE PICKING DE COMPONENTES ]

                   • Recolección física en almacén de materias primas

                   • Traslado de componentes a la zona de ensamble

                                     │

                                     ▼ (Botón Crear en Gestor)

                 [ EMISIÓN PARA PRODUCCIÓN (OIGE / IGE1) ]

                 • Consume artículos e imputa horas de recurso

                 • Descarga stock de insumos y carga a cuenta WIP

                                     │

                                     ▼ (Finalización de ensamble)

                 [ RECIBO DE PRODUCCIÓN (OIGN / IGN1) ]

                 • Generado desde el cajón 'Recolectado' del Gestor

                 • Da de alta el producto terminado en almacén

                 • Consume automáticamente componentes Backflush


4. CASO DE NEGOCIO RESUELTO: LÍNEA DE ENSAMBLE DE COMPUTADORAS EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers produce computadoras de alto rendimiento en su planta de ensamblaje Lab Shop Floor.

La Orden de Fabricación Nº 205 contempla producir 10 Servidores Empresariales.
Componentes necesarios: 20 Procesadores Xeon (Emisión Manual), 40 Módulos RAM (Emisión Manual), 10 Gabinetes (Emisión Manual) y 15 Horas de Técnico de Ensamblaje (Recurso). Los tornillos y cables menores están definidos como Backflush.
Ejecución en el Gestor de Pick & Pack:
George abre el Gestor de picking y embalaje, selecciona el documento base Orden de fabricación y filtra por el UDF U_ShopFloor = 'Lab'.
Aparecen las líneas de procesadores, memorias, gabinetes y el recurso de técnico. Las líneas de tornillos Backflush no requieren recolección previa.
George libera las líneas a una lista de picking asignada al operario de bodega de componentes.
Una vez recolectados los componentes en la mesa de ensamble, George marca las líneas en el cajón Liberado y pulsa Crear > Emisión para producción. Se genera el documento OIGE consumiendo el inventario de procesadores, RAM y gabinetes, e imputando el costo del técnico.
Al día siguiente, completado el ensamblaje y superadas las pruebas de calidad, George abre el cajón Recolectado y pulsa Crear > Recibo de producción.
Se genera el documento OIGN: ingresan 10 servidores al stock de productos terminados, se liquidan los tornillos Backflush y la orden de fabricación queda lista para su cierre contable.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál es la función de incluir líneas de tipo "Recurso" (máquinas y mano de obra) dentro del Gestor de Picking, Embalaje y Producción en SAP Business One?
A) Permite planificar el mantenimiento preventivo de los camiones de despacho.
B) Permite utilizar el Gestor como un banco de trabajo completo (Workbench), generando documentos de Emisión para Producción que imputan tanto los insumos materiales como los costos de capacidad en una única transacción.
C) Imprime códigos de barras para los operarios del taller.
D) Asigna automáticamente salarios en el módulo de recursos humanos.
Respuesta Correcta: B
Justificación Técnica: La integración de recursos en el Gestor de Pick & Pack asegura que las emisiones a producción abarquen la totalidad de la estructura de costos de la orden sin requerir registros fragmentados.
Pregunta 2
En una Orden de Fabricación con rutas secuenciales de producción (Routing), ¿qué beneficio proporciona la información de "Secuencia de Ruta" y "Etapas de Ruta" en el Gestor de Pick & Pack?
A) Permite calcular el tipo de cambio de divisas para insumos importados.
B) Permite clasificar y filtrar las órdenes de picking según las fases cronológicas de fabricación, recolectando insumos únicamente para las etapas activas inmediatas.
C) Elimina automáticamente los productos defectuosos del inventario.
D) Impide que se modifiquen los precios de venta de los productos terminados.
Respuesta Correcta: B
Justificación Técnica: En manufactura por etapas, los materiales deben suministrarse a pie de máquina conforme avanza la ruta; el Gestor permite filtrar por etapas y fechas de inicio de etapa para un abastecimiento Just-in-Time.
Pregunta 3
¿Por qué los componentes de una Orden de Fabricación con método de emisión "Notificación" (Backflush) no requieren generar un documento de "Emisión para producción" desde el Gestor de Pick & Pack?
A) Porque son artículos donados sin costo contable.
B) Porque se consumen y descuentan del inventario de forma automática al registrar el Recibo de Producción del producto terminado.
C) Porque no pertenecen al plan de cuentas de la empresa.
D) Porque se compran directamente al proveedor en el momento del embarque.
Respuesta Correcta: B
Justificación Técnica: La emisión Backflush está vinculada contractualmente al evento del recibo final de producción; el sistema calcula y descarga el consumo teórico de los insumos sin necesidad de documentos manuales de emisión previa.