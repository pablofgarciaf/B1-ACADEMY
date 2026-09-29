# Guion de Video: DOC 053 Inven PNPSales

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 053 Inven PNPSales.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 053: GESTIÓN DE PICK & PACK EN EL PROCESO DE VENTAS (PICK PACK AND PRODUCTION MANAGER)
Código de Manual: 10_Inven_21_PNP_PNPSales
Módulo Oficial: Inventario / Picking y Embalaje en Ventas (Inventory - Pick & Pack)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Logísticos, Jefes de Bodega, Operadores de Picking y Agentes IA (Antigravity)
Carpeta Asociada: 053_10_Inven_21_PNP_PNPSales


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "053",

  "topic": "Pick Pack and Production Manager in Sales Logistics",

  "sap_module": "Inventory_Pick_and_Pack",

  "database_tables": {

    "pick_list_header": "OPKL (Pick List Header)",

    "pick_list_lines": "PKL1 (Pick List Rows / Base Document References)",

    "pick_list_sublevel_allocations": "PKL2 (Pick List Bin Location Allocations)",

    "base_sales_documents": {

      "sales_orders": "ORDR / RDR1",

      "ar_reserve_invoices": "OINV / INV1"

    },

    "generated_sales_documents": {

      "deliveries": "ODLN / DLN1",

      "ar_invoices": "OINV / INV1"

    },

    "packing_slip": "OPCK / PCK1 (Packing Slip Details)"

  },

  "menu_paths": [

    "Inventario > Picking y embalaje > Gestor de picking y embalaje",

    "Inventario > Picking y embalaje > Lista de picking",

    "Menú contextual de Pedido de Cliente > Generar lista de picking / Ver listas de picking"

  ],

  "manager_drawers_lifecycle": {

    "drawer_1_open": {

      "name": "Abierto (Open)",

      "content": "Líneas de documentos de venta abiertas que aún no han sido liberadas a ninguna lista de picking",

      "actions": "Liberar para lista de picking (Release to Pick List)"

    },

    "drawer_2_released": {

      "name": "Liberado (Released)",

      "content": "Líneas que ya forman parte de una o más listas de picking activas pero que los operarios no han terminado de recolectar",

      "actions": "Seguimiento de picking, reasignación de recolector, anulación de lista de picking"

    },

    "drawer_3_picked": {

      "name": "Elegido / Recolectado (Picked)",

      "content": "Líneas marcadas formalmente con cantidad recogida (Picked) en la lista de picking",

      "actions": "Creación manual o automática de Entregas (ODLN) o Facturas de Clientes (OINV)"

    }

  },

  "business_rules_and_controls": {

    "available_to_release_calculation": "Muestra la cantidad acumulada disponible en almacén teniendo en cuenta las cantidades ya propuestas para recolección en las filas anteriores de la grilla",

    "wizard_splitting_parameters": ["Por Socio de Negocios", "Por Documento Base", "Por Grupo de Artículos", "Por Almacén"],

    "non_inventory_items_support": "Permite incluir artículos que no son de inventario (mano de obra, servicios, cargos técnicos) en listas de picking y arrastrarlos automáticamente a la Entrega/Factura para asegurar su facturación",

    "delivery_modes": {

      "Manual_Delivery": "Abre el documento de Entrega en modo Crear con todos los datos precargados para revisión/edición",

      "Automatic_Delivery": "Genera las Entregas en segundo plano agrupadas por cliente si se cumplen todas las condiciones comerciales y de stock"

    }

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 El Rol del Gestor de Picking y Embalaje en la Cadena de Suministro
El Gestor de Picking y Embalaje (Pick Pack and Production Manager) opera como un panel de control logístico integral en SAP Business One. Su objetivo central es desacoplar el procesamiento comercial (captura de pedidos en Ventas) de la ejecución física de bodega (recolección de bultos y despacho):

Permite gestionar simultáneamente miles de partidas abiertas de Pedidos de Clientes (ORDR) y Facturas de Reserva (OINV).
Centraliza la emisión masiva de Listas de Picking (OPKL), optimizando las rutas de los operarios en almacén.
Actúa como mesa de despacho (Workbench): desde una única ventana se pueden generar Entregas masivas, facturas, traslados o listas de empaque, sin necesidad de ingresar manualmente a los diferentes módulos del sistema.
2.2 Anatomía de los Tres Cajones Operativos (Drawers)
La ventana principal del Gestor se organiza en tres pestañas o cajones de estado secuencial:

Cajón Abierto (Open): Contiene las partidas de pedidos pendientes.
La columna Cantidad pendiente se copia a la columna Para liberar (To Release), permitiendo al supervisor liberar despachos parciales si no se dispone de stock completo.
La columna Disponible para liberar (Available to Release) calcula la existencia física real descontando dinámicamente las cantidades asignadas a las filas superiores de la lista, evitando emitir órdenes de picking sin respaldo físico.
Cajón Liberado (Released): Agrupa los documentos cuyas órdenes de trabajo ya están en manos de los operarios de almacén. Permite supervisar qué recolector tiene asignada la tarea y qué porcentaje de avance lleva.
Cajón Recolectado (Picked): Una vez que el operario tilda la cantidad física en la Lista de Picking (PKL1.PickedQty), las líneas pasan a este cajón. Aquí el despachador ejecuta la generación de la Entrega (ODLN) o Factura de Clientes (OINV).
2.3 El Asistente de Liberación de Listas de Picking
Al seleccionar las líneas en el cajón Abierto y pulsar Liberar para lista de picking, se activa un asistente de 2 pasos:

Paso 1 (Criterios de División): Permite consolidar o segregar el trabajo de bodega:
Por Socio de Negocios: Agrupa múltiples pedidos de un mismo cliente en una sola lista de picking para consolidar el despacho.
Por Documento Base: Genera una lista de recolección individual por cada pedido.
Por Almacén / Grupo de Artículos: Asigna áreas especializadas (ej. refrigerados vs secos).
Paso 2 (Asignación de Operarios y Prioridades): Se designa el código de usuario del recolector (Picker), la fecha planificada de recolección y observaciones prioritarias (ej. Despacho Urgente Express).
2.4 Generación Directa y Paquetes de Embalaje (Packing Slips)
Atajo desde Documento Base: Si un pedido requiere atención inmediata, el usuario no necesita abrir el Gestor; basta con hacer clic derecho sobre el Pedido de Ventas y seleccionar Generar lista de picking.
Lista de Embalaje (Packing Slip): Desde la Entrega o Factura creada, el personal accede al menú contextual para abrir la ventana de embalaje (OPCK). Aquí se definen los bultos (cajas, palets, contenedores), se arrastran los artículos a cada bulto y se calcula el peso total acumulado para imprimir la etiqueta de expedición.
Integración de Servicios y Mano de Obra: Los artículos sin control de inventario (fletes, seguros, horas técnicas de instalación) pueden ser incluidos en la lista de picking. Aunque no requieran recolección física, esto asegura que viajen a la Entrega final y no se omitan en la facturación.


3. FLUJO DEL CICLO DE PICK & PACK EN VENTAS
┌─────────────────────────────────────────────────────────────────────────┐

│                      PEDIDOS DE VENTA / FACTURAS DE RESERVA             │

└────────────────────────────────────┬────────────────────────────────────┘

                                     │

                                     ▼

                   [ GESTOR PICK & PACK: CAJÓN ABIERTO ]

                   • Evalúa existencia 'Disponible para liberar'

                   • Define cantidades en 'Para liberar'

                                     │

                                     ▼ (Asistente de Liberación)

                 [ GESTOR PICK & PACK: CAJÓN LIBERADO ]

                 • Genera Listas de Picking (OPKL / PKL1)

                 • Asigna operarios de bodega (Pickers)

                                     │

                                     ▼ (Recolección física en estanterías)

                  [ GESTOR PICK & PACK: CAJÓN RECOLECTADO ]

                  • Líneas marcadas como Picked

                                     │

                    ┌────────────────┴────────────────┐

                    ▼                                 ▼

           [ ENTREGA MANUAL ]               [ ENTREGA AUTOMÁTICA ]

           Abre ODLN para edición           Crea ODLN en segundo plano

                    │                                 │

                    └────────────────┬────────────────┘

                                     │

                                     ▼

                  [ EMBALAJE Y EXPEDICIÓN: PACKING SLIP ]

                  Asignación a cajas/palets y cálculo de peso


4. CASO DE NEGOCIO RESUELTO: DESPACHO CONSOLIDADO EN OEC COMPUTERS
Escenario de Consultoría:
George, jefe de almacén de OEC Computers, debe procesar los despachos matutinos para el cliente corporativo Microchips S.A.. El cliente emitió dos pedidos de venta distintos durante la semana:

Pedido Nº 401: 15 Monitores LED.
Pedido Nº 405: 15 Teclados Inalámbricos y 2 Licencias de Soporte Técnico (artículo no inventariable).
Procedimiento en SAP Business One:
George abre Inventario > Picking y embalaje > Gestor de picking y embalaje.
Filtra por fecha de entrega del día y abre el cajón Abierto.
Selecciona las 3 líneas correspondientes a Microchips S.A.
Pulsa Liberar para lista de picking. En el Paso 1 selecciona dividir Por Socio de Negocios. En el Paso 2 asigna como recolector a Bill con la nota Consolidar en pallet 1.
Se genera la Lista de Picking Nº 88. Bill recoge los 15 monitores y 15 teclados, marcando 15 en la columna Recogido. Las 2 licencias de soporte se marcan automáticamente como listas.
En el cajón Recolectado, George selecciona las líneas y pulsa Crear > Entrega automática.
SAP Business One crea una única Entrega (ODLN) consolidada para Microchips S.A. conteniendo los monitores, teclados y licencias de servicio, lista para packing y despacho.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
En el Gestor de Picking y Embalaje, ¿qué representa el valor mostrado en la columna "Disponible para liberar" (Available to Release)?
A) La cantidad total de stock físico sin considerar ningún documento.
B) La cantidad acumulada disponible en el almacén, calculada de forma dinámica considerando las cantidades ya propuestas para recolección en las filas anteriores de la grilla.
C) La cantidad máxima de artículos que caben en el camión de transporte.
D) El saldo pendiente de pago financiero del cliente.
Respuesta Correcta: B
Justificación Técnica: La columna calcula la disponibilidad en cascada: a medida que las filas superiores de la tabla consumen stock disponible, el valor restante para las filas inferiores disminuye para alertar sobre posibles quiebres de inventario.
Pregunta 2
¿Es posible incluir artículos no inventariables (servicios, horas de técnico o pólizas) dentro de una Lista de Picking en el Gestor de Pick & Pack?
A) No, el módulo de Pick & Pack rechaza cualquier artículo que no tenga control de stock.
B) Sí, los artículos no inventariables pueden procesarse en listas de picking y copiarse a Entregas o Facturas, asegurando que los cargos por servicios no se olviden en la facturación final.
C) Solo si se gestionan por número de lote ficticio.
D) Únicamente si el documento base es una Factura de Proveedores.
Respuesta Correcta: B
Justificación Técnica: SAP B1 permite procesar líneas no inventariables en Pick & Pack como mecanismo de control para garantizar que los conceptos de servicio asociados a una venta viajen integrados al documento de entrega o cobro.
Pregunta 3
¿Cuál es la diferencia entre las opciones "Entrega manual" y "Entrega automática" disponibles en el botón Crear del Gestor de Pick & Pack?
A) La entrega manual no genera asiento contable, mientras que la automática sí.
B) La entrega manual abre el documento de Entrega en pantalla para permitir revisiones y ajustes antes de guardarlo, mientras que la automática genera los documentos de Entrega en segundo plano agrupados por cliente sin intervención visual.
C) La entrega automática solo funciona con clientes extranjeros.
D) La entrega manual cancela la lista de picking original.
Respuesta Correcta: B
Justificación Técnica: La creación manual despliega la interfaz gráfica estándar de ODLN para confirmación interactiva, mientras que la automática ejecuta el proceso batch por DI API en background.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
