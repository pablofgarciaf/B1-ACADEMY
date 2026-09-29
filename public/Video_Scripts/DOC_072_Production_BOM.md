# Guion de Video: DOC 072 Production BOM

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 072 Production BOM.

## Contenido Principal (Visual: Diapositivas correspondientes)
Unidad 072: Estructura de Listas de Materiales y Tipos de LdM (SAP Business One 10.0)
1. Metadatos Técnicos
Módulo: Producción (Production Master Data)
Código de Unidad: DOC_072_Production_BOM
Audiencia Objetivo: Ingenieros de Producto, Jefes de Producción, Especialistas en Costos y Consultores Funcionales de SAP B1.
Versión de SAP: SAP Business One 10.0 (HANA / SQL Server).


2. Antigravity Master Schema (JSON Specification)
{

  "$schema": "https://antigravity.schema.sap.com/v10/production-bom-types.json",

  "unit_id": "072_Production_BOM",

  "system_context": {

    "module": "Production",

    "submodules": ["Bill of Materials", "Item Master Data", "Component Management"],

    "database_tables": {

      "bom_tables": [

        {"table": "OITT", "description": "Cabecera de Lista de Materiales (Parent Item, BOM Type, Price List, Project, Distribution Rule)"},

        {"table": "ITT1", "description": "Líneas de Componentes (Child Items, Quantities, Issue Method, Warehouse, Price, Additional Qty)"}

      ],

      "routing_tables": [

        {"table": "WOR4", "description": "Etapas de Ruta en Órdenes de Fabricación y LdM estructuradas"}

      ],

      "item_master_tables": [

        {"table": "OITM", "description": "Datos Maestros de Artículo (PrjctItem, InvntItem, SellItem, BuyItem, Phantom Item flag)"}

      ]

    },

    "menu_navigation_paths": [

      "Producción > Lista de materiales",

      "Producción > Lista de materiales - Gestión de componentes",

      "Producción > Actualizar precios de artículo globalmente",

      "Inventario > Datos maestros de artículo > Ficha General > Casilla Artículo ficticio (Phantom)"

    ]

  },

  "business_rules": {

    "bom_types": [

      {

        "type": "Production",

        "parent_requirements": "Debe ser Artículo de Inventario (InvntItem = 'Y'). Opcionalmente de Venta o Compra.",

        "usage": "Se copia en Órdenes de Fabricación (OWOR). Soporta Recursos, Líneas de Texto y Etapas de Ruta.",

        "inventory_impact": "Consumo de componentes mediante OIGE y entrada de padre mediante OIGN."

      },

      {

        "type": "Sales",

        "parent_requirements": "Debe ser Artículo de Venta (SellItem = 'Y'). NO es artículo de inventario.",

        "usage": "Se utiliza en documentos de venta (Oferta, Pedido, Entrega, Factura). En el documento se desglosan todos los componentes como subartículos.",

        "inventory_impact": "El stock se descuenta a nivel de componentes individuales en la Entrega/Factura. No genera OWOR."

      },

      {

        "type": "Assembly",

        "parent_requirements": "Debe ser Artículo de Venta (SellItem = 'Y'). NO es artículo de inventario.",

        "usage": "Similar a la de Ventas, pero en el documento de marketing SOLO se visualiza el artículo padre; los componentes están ocultos tras bambalinas.",

        "inventory_impact": "El stock de los componentes se descuenta automáticamente al facturar o entregar el padre."

      },

      {

        "type": "Template",

        "parent_requirements": "Sin restricciones. El padre y los hijos pueden ser cualquier combinación de compra, venta o inventario.",

        "usage": "Colección flexible de artículos para agilizar la captura en Compras y Ventas. Permite borrar, editar, duplicar o añadir líneas libremente."

      }

    ],

    "phantom_item_rule": "Un artículo ficticio (Phantom) en una LdM de producción se descompone al copiarse a la Orden de Fabricación, sustituyéndose por sus componentes directos. No puede crearse una orden de producción directa de un artículo fantasma ni tener etapas de ruta."

  }

}


3. Desarrollo Conceptual y Funcional Exhaustivo
3.1 Anatomía y Estructura de la Lista de Materiales (LdM / BOM)
La Lista de Materiales (OITT) es la definición técnica que especifica los ingredientes (artículos de inventario), la capacidad y mano de obra (recursos), las instrucciones operativas (filas de texto) y las fases de fabricación (etapas de ruta) requeridas para ensamblar un producto terminado o semielaborado.

Listas Multinivel (Multi-Level BOMs): Un artículo componente dentro de una LdM puede ser a su vez el producto terminado de otra LdM subordinada (Subensamblaje). SAP B1 soporta anidación de niveles ilimitados.
Líneas de la LdM (ITT1):
Tipo: Artículo, Recurso, Etapa de ruta, Texto.
Cantidad Base: Proporción de componente por cada unidad del padre.
Método de Emisión: Manual vs. Toma retroactiva (Backflush).
Almacén: Almacén de consumo por defecto (ej. almacén de piso de planta).
Precio / Costo: Tomado de la lista de precios seleccionada en cabecera o costo estándar del recurso.
3.2 Los Cuatro Tipos de Lista de Materiales en SAP B1
LdM de Producción:
Es la única que interactúa con el módulo de Producción y el MRP.
El padre debe ser un artículo de inventario (OITM.InvntItem = 'Y').
Al planificar la producción, la LdM se copia a una Orden de Fabricación (OWOR).
Permite incluir Recursos (ORSC), Líneas de Texto con instructivos de taller y Etapas de Ruta.
LdM de Ventas (Sales BOM):
Diseñada para comercializar Kits o combos ensamblados en el momento de la venta.
El padre es un artículo de venta pero NO de inventario. Los componentes son artículos de inventario y de venta.
Al seleccionar el kit en un Pedido de Cliente (ORDR), el sistema expande automáticamente todas las líneas de componentes en el cuerpo del documento.
El usuario puede modificar cantidades globales o de líneas, pero no puede eliminar componentes del kit ni agregar nuevos.
Opción: Suprimir componentes de LdM en la impresión para mostrar solo el kit al cliente en el PDF final.
LdM de Montaje (Assembly BOM):
Idéntica conceptualmente a la de Ventas, pero con una diferencia clave en la interfaz: en el Pedido de Cliente y en la Factura solo aparece una única línea con el producto padre.
Los componentes se rebajan del stock silenciosamente en el almacén sin que el cliente o el vendedor vean el detalle de piezas en la pantalla de marketing.
LdM de Plantilla (Template BOM):
Lista universal sin restricciones de atributos contables ni comerciales.
Funciona como una plantilla de captura rápida tanto en Ventas como en Compras. Al seleccionar el artículo padre, se cargan los componentes como líneas independientes y totalmente editables (se pueden borrar, añadir, modificar precios y cantidades sin restricciones).
3.3 Artículos Ficticios (Phantom Items)
Un artículo ficticio o fantasma es una agrupación lógica de componentes utilizada en ingeniería para simplificar el diseño o estructurar catálogos, pero que físicamente nunca se almacena como un producto terminado intermedio.

Comportamiento: En los datos maestros (OITM), ficha General, se marca la casilla Artículo ficticio.
Al crear una LdM de Producción superior que contiene este artículo ficticio, en el momento en que se genera la Orden de Fabricación (OWOR), el sistema hace explotar automáticamente el fantasma, eliminando el código del artículo ficticio y reemplazándolo por sus componentes individuales directos en las líneas de la orden.
Restricción: No es posible agregar etapas de ruta a una LdM que contiene artículos ficticios.
3.4 Gestión Masiva de Componentes
La ventana Producción > Lista de materiales - Gestión de componentes permite a los ingenieros de procesos realizar cambios masivos y controlados en cientos de LdM simultáneamente:

Adición colectiva de nuevos componentes.
Supresión de componentes descontinuados o prohibidos por normativas ambientales.
Modificación de cantidades base, almacenes de consumo o métodos de emisión.
Sustitución de componentes obsoletos por códigos equivalentes vigentes.
Reorganización de números de secuencia de ruta.


4. Caso de Negocio Práctico en OEC Computers
Contexto
OEC Computers comercializa computadoras de escritorio y accesorios bajo dos modalidades:

LdM de Producción: Computadora Gamer PC-GAMER-ADVANCED (Requiere ensamble en planta, mano de obra, pruebas térmicas y componentes físicos).
LdM de Ventas: Combo Promocional KIT-PERIFERICOS-PRO (Incluye teclado mecánico, mouse ergonómico y alfombrilla XL).
Implementación y Reglas de Negocio
Para PC-GAMER-ADVANCED (LdM de Producción):
Padre: Artículo de inventario y de venta (InvntItem = 'Y', SellItem = 'Y').
Componentes: Tarjeta madre, Procesador i7, 32GB RAM, Tarjeta gráfica RTX, Fuente de poder y Chasis.
Recursos: 1 hora de Operario de Ensamble y 2 horas de Banco de Pruebas.
Flujo: Se genera Orden de Fabricación, se liberan componentes, se emite mano de obra y se ingresa el equipo terminado al inventario con su número de serie individual.
Para KIT-PERIFERICOS-PRO (LdM de Ventas):
Padre: Artículo de venta sin inventario (SellItem = 'Y', InvntItem = 'N').
Componentes: Teclado (Cant: 1), Mouse (Cant: 1), Alfombrilla (Cant: 1).
En el Pedido de Ventas: Se ingresa el código KIT-PERIFERICOS-PRO. El sistema despliega las 3 líneas hijas con sangría. El precio total se consolida en la cabecera del kit. Al despachar la Entrega (ODLN), el inventario se rebaja de los 3 ítems hijos, dejando el stock de periféricos conciliado con exactitud.


5. Banco de Evaluación Situacional (Certificación SAP B1)
Pregunta 1
Una empresa desea vender un paquete de muebles compuesto por una mesa y 4 sillas. Desean que el vendedor digite el código del paquete en la orden de venta y que en pantalla aparezcan desglosados la mesa y las sillas para verificar inventario, pero que al imprimir la factura al cliente final solo se muestre el nombre del paquete y el precio total. ¿Qué configuración de LdM se debe utilizar?

A) Lista de materiales de montaje con supresión de líneas.
B) Lista de materiales de ventas con la opción "Suprimir componentes de lista de materiales en la impresión" marcada en la LdM.
C) Lista de materiales de producción con orden de fabricación automática.
D) Lista de materiales de plantilla.
Respuesta Correcta: B
Justificación Técnica: La LdM de Ventas desglosa los componentes en el documento de marketing para control logístico, y la casilla de verificación nativa en la LdM permite ocultar las líneas hijas al momento de generar la impresión física o digital hacia el cliente.
Pregunta 2
¿Qué requisito obligatorio en Datos Maestros de Artículo debe cumplir el artículo padre de una Lista de Materiales de Producción?

A) Debe ser exclusivamente artículo de compra.
B) Debe ser artículo de inventario (InvntItem = 'Y').
C) Debe tener activada la bandera de artículo ficticio.
D) No puede tener costo estándar asignado.
Respuesta Correcta: B
Justificación Técnica: Dado que la Orden de Fabricación concluye con una entrada formal de inventario mediante Recibo de Producción (OIGN), el artículo superior resultante debe estar habilitado como artículo de inventario en el sistema.
Pregunta 3
¿Cuál es el comportamiento de un "Artículo Ficticio" (Phantom Item) cuando la Lista de Materiales de nivel superior que lo contiene se copia a una Orden de Producción?

A) La orden de producción se bloquea exigiendo una sub-orden previa.
B) El artículo ficticio desaparece de la orden de producción y es sustituido automáticamente por sus artículos componentes directos.
C) Se recibe en el inventario como un artículo en tránsito.
D) Se crea automáticamente una lista de materiales de plantilla.
Respuesta Correcta: B
Justificación Técnica: Por definición en SAP Business One, los subconjuntos ficticios no tienen existencia física en stock; su función es estructurar el diseño, por lo que el motor de órdenes de producción los disuelve en sus componentes elementales al instanciar la orden.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
