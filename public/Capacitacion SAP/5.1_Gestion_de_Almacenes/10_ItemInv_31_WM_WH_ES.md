UNIDAD 036: GESTIÓN DE ALMACENES EN EL INVENTARIO (SAP BUSINESS ONE 10.0)
Código de Manual: 10_ItemInv_31_WM_WH_ES
Módulo Oficial: Artículos e Inventario / Gestión de Almacenes (Warehouses - MM)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Gestores de Cadena de Suministro, Jefes de Inventario y Agentes IA (Antigravity)
Carpeta Asociada: 036_10_ItemInv_31_WM_WH_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "036",

  "topic": "Inventory Warehouses Management (Standard, Drop-Ship, and Bin-Managed Warehouses)",

  "sap_module": "Inventory_WarehouseManagement",

  "database_tables": {

    "warehouse_master": {

      "table": "OWHS",

      "primary_key": "WhsCode",

      "fields": {

        "WhsCode": "Código alfanumérico único del almacén (hasta 8 caracteres)",

        "WhsName": "Nombre descriptivo del almacén",

        "DropShip": "Flag 'Y'/'N' para almacén de entrega directa (virtual)",

        "BinActivat": "Flag 'Y'/'N' para habilitar ubicaciones de depósito",

        "Nettable": "Flag 'Y'/'N' para ser considerado en el cálculo MRP (Compensable)",

        "TaxOffice": "Información fiscal / jurisdicción tributaria",

        "Street": "Dirección física (determinación de Ship-To en compras)"

      }

    },

    "warehouse_item_stock": {

      "table": "OITW",

      "composite_key": ["ItemCode", "WhsCode"],

      "fields": {

        "OnHand": "Cantidad en stock físico",

        "IsCommited": "Cantidad comprometida en pedidos de venta/producción",

        "OnOrder": "Cantidad pedida en compras/producción",

        "AvgPrice": "Costo promedio ponderado en el almacén"

      }

    },

    "procurement_confirmation": {

      "table": "POR1",

      "description": "Líneas de órdenes de compra vinculadas a pedidos de venta de entrega directa"

    }

  },

  "menu_paths": [

    "Gestión > Definición > Inventario > Almacenes",

    "Inventario > Datos maestros de artículo > Pestaña Datos de inventario",

    "Ventas - Clientes > Pedido de cliente > Asistente de confirmación de aprovisionamiento"

  ],

  "warehouse_typologies": {

    "Standard_Physical_Warehouse": {

      "description": "Almacén físico tradicional para almacenamiento de mercancías propias",

      "inventory_effect": "Afecta stock físico (OnHand), valor del inventario y genera asientos contables en inventario permanente",

      "mrp_inclusion": "Configurable mediante la casilla 'Compensable'"

    },

    "Drop_Ship_Warehouse": {

      "description": "Almacén virtual que representa la ubicación de un proveedor para entregas directas a clientes",

      "inventory_effect": "NO afecta cantidades físicas (OnHand = 0 siempre), NO afecta cuentas de existencias en balance, NO genera asientos de inventario",

      "serial_batch_tracking": "Opcional mediante la casilla 'Gestionar números de serie y lotes'",

      "bin_location_compatibility": "Incompatible: NO puede activar ubicaciones de depósito"

    },

    "Bin_Managed_Warehouse": {

      "description": "Almacén físico subdividido jerárquicamente en celdas de depósito tridimensionales",

      "inventory_effect": "Exige asignación de ubicación en cada documento de entrada, salida o transferencia",

      "sublevels": "Hasta 4 subniveles jerárquicos (Almacén-Isla-Estantería-Nivel)"

    }

  },

  "business_rules": {

    "address_inheritance": "La dirección del almacén especificado en la primera línea del documento se toma por defecto como la dirección de destino del documento comercial",

    "drop_ship_workflow": "Pedido de Cliente en Almacén Drop-Ship -> Asistente de Aprovisionamiento -> Pedido de Compra a Proveedor con dirección de envío del Cliente -> Entrega física directa Proveedor-Cliente -> Factura de Proveedores (Costo) + Factura de Clientes (Venta)",

    "bin_activation_lock": "No se puede habilitar ubicaciones de depósito en almacenes marcados como Drop-Ship"

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 El Rol Central del Almacén en SAP Business One
En SAP Business One 10.0, el Almacén (OWHS) es el punto nodal que articula los procesos de ventas, compras, producción e inventario:

Ventas y Compras: Todo documento transaccional de tipo artículo (Ofertas, Pedidos, Entregas, Facturas) exige un almacén por cada línea (WhsCode), determinando de dónde se descuenta o a dónde ingresa el stock.
Determinación de Direcciones: La dirección física ingresada en los datos maestros del almacén de la primera línea del documento se hereda automáticamente como la dirección de envío del documento, gobernando los cálculos logísticos y los impuestos de entrega.
Segmentación de Costos: Cuando la empresa opera con valoración de inventario a nivel de almacén, cada almacén mantiene su propio costo promedio (OITW.AvgPrice), permitiendo diferenciar márgenes entre sucursales o regiones.
2.2 Almacenes de Entrega Directa (Drop-Ship Warehouses)
Existen modelos de negocio donde la empresa actúa como intermediaria comercial: comercializa artículos que no fabrica ni almacena en sus propias instalaciones.

Naturaleza Contable y Física:
Al marcar un almacén con la casilla Entrega Directa (DropShip = 'Y'), este se convierte en un almacén virtual.
Cero impacto en existencias: Las compras y ventas contra este almacén no mueven inventario físico ni alteran el balance de existencias. Las cuentas contables de inventario no intervienen; se contabiliza directamente el Costo de Ventas contra la Cuenta de Proveedores al recibir la factura de compra, y el Ingreso contra Clientes al emitir la factura de venta.
Los informes estándar de valoración de inventario (Auditoría de stocks) omiten los almacenes de entrega directa para no distorsionar el activo realizable.
El Asistente de Confirmación de Aprovisionamiento:
Al grabar un Pedido de Cliente asignado a un almacén Drop-Ship, SAP Business One dispara automáticamente el Asistente de Aprovisionamiento.
El asistente crea de inmediato un Pedido de Compra dirigido al proveedor preferente del artículo.
La dirección de entrega en la orden de compra no es la bodega de la empresa, sino la dirección física del cliente final.
Gestión de Lotes y Series en Drop-Ship:
Aunque no se almacena físicamente la mercancía, la empresa puede requerir registrar los números de serie o lote para efectos de garantía y servicio postventa.
Al activar la casilla Gestionar números de serie y lotes en almacén de entrega directa, el sistema solicita ingresar los números de serie al registrar las facturas.
2.3 Almacenes Gestionados por Ubicaciones de Depósito (Bin Locations)
La casilla Activar ubicaciones de depósito (BinActivat = 'Y') permite dividir el almacén en celdas espaciales de hasta 4 subniveles (ejemplo: Almacén 05, Isla A1, Estantería S1, Nivel L3 $\rightarrow$ Código 05-A1-S1-L3).
Esta opción optimiza el espacio de almacenamiento, acelera los tiempos de localización de artículos y permite generar listas de picking con rutas óptimas de recorrido.
Restricción Estricta del Sistema: Un almacén no puede ser simultáneamente de entrega directa y gestionado por ubicaciones (DropShip = 'Y' y BinActivat = 'Y' son mutuamente excluyentes).


3. CASO DE NEGOCIO RESUELTO: EXPANSIÓN MULTI-ALMACÉN EN OEC COMPUTERS
Contexto del Proyecto:
OEC Computers amplía sus operaciones comerciales y logísticas mediante la creación y reestructuración de tres almacenes en SAP Business One 10.0:

Almacén 02 (Almacén Regional Norte): Almacén físico estándar en una nueva región geográfica para abastecer distribuidores locales.
Almacén 03 (Almacén Drop-Ship Suministros): Almacén virtual para vender impresoras de gran formato que el fabricante despacha directamente al cliente final.
Almacén 05 (Centro de Distribución Central con Ubicaciones): Almacén principal de alta rotación con racks organizados en 4 niveles.
Paso a Paso Operativo en SAP Business One:
Configuración del Almacén Regional (Almacén 02):
Ruta: Gestión > Definición > Inventario > Almacenes.
Código: 02, Nombre: Almacén Regional Norte.
Casilla Compensable: Marcada (para que el módulo MRP considere sus existencias y requerimientos en la planificación de compras).
Casilla Entrega directa: Desmarcada.
Configuración del Almacén Drop-Ship (Almacén 03):
Código: 03, Nombre: Almacén Drop-Ship Impresoras.
Se marca la casilla Entrega directa.
Se marca la casilla Gestionar números de serie y lotes para registrar la garantía del fabricante.
La pestaña de ubicaciones queda deshabilitada automáticamente por el sistema.
Flujo Transaccional de Venta Drop-Ship:
Se crea un Pedido de Cliente para el cliente C10000 por 1 Impresora Industrial en el Almacén 03.
Al pulsar Crear, se abre el Asistente de confirmación de aprovisionamiento.
Se genera automáticamente el Pedido de Compra al proveedor P20000 - HP Direct con la dirección de entrega del cliente C10000.
Al recibir la factura de compra de HP por $4,000 y emitir la factura de venta por $5,500, el inventario físico no sufre variación alguna, reconociéndose un margen bruto de $1,500 de manera limpia.


4. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál de las siguientes afirmaciones describe con precisión el impacto contable y de inventario de una transacción de venta procesada en un Almacén de Entrega Directa (Drop-Ship)?
A) Aumenta el stock físico y debita la cuenta de existencias transitorias.
B) No genera movimientos en las cantidades físicas del inventario (OnHand) ni crea asientos contables que afecten el valor del inventario en balance.
C) Genera automáticamente una orden de producción para fabricar el artículo.
D) Disminuye el stock del almacén central de la empresa.
Respuesta Correcta: B
Justificación Técnica: Los almacenes Drop-Ship son entidades puramente virtuales. Las transacciones no afectan las cuentas de balance de existencias ni el stock físico; la relación de costo/ingreso se registra directamente entre las facturas de proveedores y clientes.
Pregunta 2
Si una empresa requiere gestionar celdas de depósito (Bin Locations) y a la vez registrar entregas directas desde proveedores hacia clientes, ¿cómo debe estructurarse la configuración en SAP Business One?
A) Debe activar ambas opciones en el mismo almacén marcando simultáneamente "Entrega directa" y "Habilitar ubicaciones".
B) Debe crear dos almacenes independientes: uno marcado como entrega directa (Drop-Ship) y otro físico con ubicaciones habilitadas, ya que ambas opciones son incompatibles en un mismo registro de almacén.
C) Debe utilizar un almacén de consignación.
D) Las ubicaciones de depósito solo se pueden activar si la empresa no realiza compras.
Respuesta Correcta: B
Justificación Técnica: La arquitectura de SAP Business One bloquea la activación de ubicaciones en almacenes de entrega directa debido a que un almacén virtual no posee coordenadas físicas reales en las instalaciones de la empresa.
Pregunta 3
¿Qué ocurre al modificar el campo "Compensable" (Nettable) en la definición de un almacén?
A) Permite que el almacén facture en monedas extranjeras.
B) Determina si las cantidades de inventario y los pedidos de dicho almacén son tomados en cuenta por el Asistente de Planificación de Necesidades de Materiales (MRP).
C) Exonera al almacén del pago de impuestos aduaneros.
D) Habilita la lectura de códigos de barras en el punto de venta.
Respuesta Correcta: B
Justificación Técnica: El campo Compensable en OWHS es el filtro directo que utiliza el motor del MRP para decidir si las existencias y demandas de ese almacén entran en la ecuación de aprovisionamiento.