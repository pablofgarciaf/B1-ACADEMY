UNIDAD 055: GESTIÓN DE PICK & PACK EN TRASLADOS ENTRE ALMACENES Y ZONAS DE PACKING
Código de Manual: 10_Inven_23_PNP_PNPTTransfer
Módulo Oficial: Inventario / Picking y Embalaje en Traslados (Inventory - Pick & Pack for Inventory Transfer)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Coordinadores de Logística de Distribución, Administradores de Almacén Multisede y Agentes IA (Antigravity)
Carpeta Asociada: 055_10_Inven_23_PNP_PNPTTransfer


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "055",

  "topic": "Pick Pack and Production Manager in Inventory Transfer Logistics",

  "sap_module": "Inventory_Transfer_Pick_and_Pack",

  "database_tables": {

    "transfer_request_header": "OWTQ (Inventory Transfer Request Header)",

    "transfer_request_lines": "WTQ1 (Inventory Transfer Request Rows)",

    "inventory_transfer_header": "OWTR (Inventory Transfer Header)",

    "inventory_transfer_lines": "WTR1 (Inventory Transfer Rows)",

    "pick_list_header": "OPKL (Pick List)",

    "pick_list_lines": "PKL1 (Pick List Rows)",

    "bin_allocations": "OILM / OIBQ"

  },

  "menu_paths": [

    "Inventario > Picking y embalaje > Gestor de picking y embalaje",

    "Inventario > Operaciones de stock > Solicitud de traslado",

    "Inventario > Operaciones de stock > Traslado de inventario"

  ],

  "inter_warehouse_pnp_flow": {

    "phase_1_request": "El almacén receptor (ej. Sucursal o Almacén de Distribución) emite una 'Solicitud de traslado' (OWTQ) demandando stock al Almacén Central",

    "phase_2_pnp_manager": "El Almacén Central abre el Gestor de Pick & Pack filtrando por 'Solicitudes de traslado'",

    "phase_3_picking": "Se genera la Lista de Picking (OPKL) para recolección física en los pasillos de expedición del Almacén Central",

    "phase_4_transfer_execution": "Desde el cajón 'Recolectado', se pulsa Crear > 'Traslado de inventario' (OWTR). El traslado se añade, dando salida al stock del Almacén Central e ingreso al Almacén de Distribución, cerrando la solicitud base"

  },

  "staging_and_packing_area_flow": {

    "scenario_description": "Traslado interno a una zona especial de embalaje (Staging / Packing Bin) para mercancías delicadas antes de generar la entrega al cliente",

    "operational_sequence": [

      "1. Se reciben Pedidos de Clientes (ORDR) en el Gestor de Pick & Pack",

      "2. En el cajón 'Abierto', se seleccionan las líneas y se elige Crear > 'Solicitud de traslado'",

      "3. Se genera la recolección física y el 'Traslado de inventario' hacia la celda o almacén de empaque especial",

      "4. Finalmente se emite la Entrega definitiva hacia el cliente desde la zona de packing"

    ]

  },

  "transfer_document_creation_comparison": {

    "Inventory_Transfer_Option": {

      "base_document_requirement": "Exclusivo para líneas originadas en una 'Solicitud de traslado' (OWTQ)",

      "purpose": "Consumir y cerrar la solicitud de traslado formal entre almacenes"

    },

    "Items_Components_Transfer_Option": {

      "base_document_requirement": "Disponible para cualquier tipo de documento base (Ventas, Producción)",

      "purpose": "Mover mercancías o insumos a una zona intermedia de preparación o muelle sin cerrar el pedido base"

    }

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Reabastecimiento de Almacenes Satélite mediante Solicitudes de Traslado
En empresas con redes logísticas distribuidas (un centro de distribución principal y múltiples sucursales o tiendas retail), el reabastecimiento requiere un flujo formal de dos fases para evitar discrepancias de inventario:

Fase de Demanda (Solicitud de Traslado - OWTQ): La sucursal genera un pedido de abastecimiento interno. En este punto no hay movimiento físico ni contable de stock; el sistema actualiza la columna Solicitado (OnOrder) en el almacén de destino y Comprometido (IsCommited) en el almacén de origen.
Fase de Suministro (Pick & Pack en Centro de Distribución): El centro de distribución centraliza todas las solicitudes en el Gestor de Picking y Embalaje. Al procesar la recolección en lote:
Agrupa solicitudes de distintas tiendas en una ruta eficiente de picking.
Los operarios recolectan las cajas en el almacén principal.
Desde el cajón Recolectado, se genera el Traslado de Inventario (OWTR).
La adición del traslado descuenta el stock del almacén central, aumenta el stock de la sucursal y cierra automáticamente la Solicitud de Traslado base.
2.2 Escenario Avanzado: La Solicitud de Traslado como Documento Destino
Una de las funcionalidades más potentes y menos conocidas del Gestor de Pick & Pack es su capacidad para generar Solicitudes de Traslado a partir de Pedidos de Clientes:

El Reto Operativo: Un cliente solicita productos de alta fragilidad (ej. cristalería o pantallas de precisión) que no pueden embalarse en el muelle de carga regular, sino que deben pasar por un taller especializado de empaque acolchado.
El Flujo en el Gestor:
En el cajón Abierto, el supervisor visualiza las líneas del Pedido de Cliente.
En el menú desplegable del botón Crear, selecciona Solicitud de traslado.
El sistema genera una orden de traslado interno hacia la celda o almacén de empaque especial (Packing Bin).
Una vez empacado el producto de forma segura, se ejecuta la Entrega (ODLN) final hacia el cliente directamente desde la zona de empaque.
2.3 Distinción Crítica: "Traslado de Inventario" vs. "Traslado de Artículos/Componentes"
Al presionar el botón Crear en los cajones del Gestor, coexisten dos opciones que generan documentos de traslado (OWTR), pero con objetivos de negocio radicalmente opuestos:

Traslado de Inventario (Inventory Transfer): Se utiliza exclusivamente cuando el documento base es una Solicitud de Traslado (OWTQ). Su propósito es completar y finiquitar el requerimiento inter-almacenes.
Traslado de Artículos/Componentes (Items/Components Transfer): Puede ejecutarse sobre cualquier tipo de documento base (Pedidos de Ventas u Órdenes de Fabricación). Su propósito no es cerrar el pedido, sino reubicar físicamente los artículos hacia un área transitoria de picking o muelle de carga antes del despacho o consumo.


3. FLUJO INTEGRADO DE TRASLADO ENTRE CENTROS DE DISTRIBUCIÓN
┌─────────────────────────────────────────────────────────────────────────┐

│     ALMACÉN SUCURSAL: SOLICITUD DE TRASLADO (OWTQ / WTQ1)               │

└────────────────────────────────────┬────────────────────────────────────┘

                                     │ (Visible en red central)

                                     ▼

                [ ALMACÉN CENTRAL: GESTOR DE PICK & PACK ]

                • Filtra por 'Solicitudes de traslado' en cajón Abierto

                • Asistente de Liberación divide por Sucursal / Zona

                                     │

                                     ▼ (Release to Pick List)

                    [ LISTA DE PICKING CENTRAL (OPKL) ]

                    • Recolección física de pallets consolidados

                                     │

                                     ▼ (Operario marca 'Picked')

                 [ GESTOR PICK & PACK: CAJÓN RECOLECTADO ]

                                     │

                                     ▼ (Crear > Traslado de inventario)

                  [ TRASLADO DE INVENTARIO (OWTR / WTR1) ]

                  • Salida de Almacén Central (OnHand disminuye)

                  • Ingreso a Almacén Sucursal (OnHand aumenta)

                  • Solicitud de Traslado base pasa a estado CERRADA


4. CASO DE NEGOCIO RESUELTO: REABASTECIMIENTO DE SUCURSALES EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers opera un Centro de Distribución Principal en Nueva York (Almacén 01) y una tienda satélite en Manhattan (Almacén 03).

El encargado de la tienda en Manhattan emite la Solicitud de Traslado Nº 75 pidiendo: 50 Laptops Empresariales y 100 Mouse Ópticos.
En Nueva York, George recibe la solicitud en el Gestor de picking y embalaje.
Ejecución Logística:
George abre el Gestor de picking y embalaje, selecciona el filtro Solicitudes de traslado y abre el cajón Abierto.
Visualiza la solicitud Nº 75. La columna Disponible para liberar confirma que hay 120 laptops y 300 mouse en existencia.
Pulsa Liberar para lista de picking, asignando la recolección al operario de carretilla Tom.
Tom recolecta los 2 pallets en los pasillos de Nueva York y actualiza la lista de picking como Picked.
En el cajón Recolectado, George selecciona la orden y pulsa Crear > Traslado de inventario.
Se genera automáticamente el Traslado de Inventario Nº 310:
Descarga 50 laptops y 100 mouse del Almacén 01.
Carga 50 laptops y 100 mouse en el Almacén 03.
La Solicitud Nº 75 se cierra instantáneamente, asegurando control absoluto contra pérdidas y mermas en tránsito.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
Al procesar una Solicitud de Traslado de inventario dentro del Gestor de Pick & Pack, ¿en qué momento exacto se descuentan físicamente las unidades del almacén emisor?
A) Inmediatamente al crear la Solicitud de Traslado.
B) Cuando la solicitud se libera a una Lista de Picking.
C) Únicamente cuando se genera y añade el documento definitivo de Traslado de Inventario (OWTR) desde el cajón Recolectado.
D) Al imprimir la etiqueta de envío.
Respuesta Correcta: C
Justificación Técnica: La Solicitud de Traslado y la Lista de Picking solo comprometen el inventario (IsCommited); la afectación física real de existencias (OnHand) y el asiento contable entre almacenes ocurre estrictamente al registrar el Traslado de Inventario final.
Pregunta 2
En el Gestor de Pick & Pack, ¿cuál es la diferencia funcional entre la opción "Traslado de inventario" y la opción "Traslado de artículos/componentes"?
A) "Traslado de inventario" solo traslada artículos de tipo servicio.
B) "Traslado de inventario" se utiliza exclusivamente para cerrar Solicitudes de Traslado previas, mientras que "Traslado de artículos/componentes" se usa para mover mercancías de cualquier documento base (ej. Pedidos de Ventas) hacia un área intermedia de empaque o muelle.
C) No existe ninguna diferencia; son sinónimos visuales.
D) "Traslado de artículos/componentes" borra la lista de precios del artículo.
Respuesta Correcta: B
Justificación Técnica: "Traslado de inventario" finiquita el ciclo de una solicitud inter-almacenes formal; "Traslado de componentes" es una utilidad logística de conveniencia para reubicar stock transitoriamente antes del despacho comercial.
Pregunta 3
¿Qué impacto genera la creación de una Solicitud de Traslado en el almacén de destino (receptor)?
A) Aumenta el stock físico disponible de inmediato.
B) Incrementa la columna "Solicitado / Pedido" (OnOrder), reflejando que la mercancía está en camino y permitiendo planificar ventas sin duplicar existencias físicas.
C) Genera un asiento contable de cuentas por cobrar.
D) Bloquea las compras a proveedores externos.
Respuesta Correcta: B
Justificación Técnica: La solicitud de traslado actúa como un compromiso de suministro: reserva stock en el emisor (IsCommited) y marca stock futuro en el receptor (OnOrder), preservando la integridad del cálculo de inventario disponible.