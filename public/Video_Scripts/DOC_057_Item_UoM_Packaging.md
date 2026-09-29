# Guion de Video: DOC 057 Item UoM Packaging

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 057 Item UoM Packaging.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 057: CONFIGURACIÓN DE EMBALAJES Y GENERACIÓN AUTOMÁTICA DE PACKING SLIPS (SAP BUSINESS ONE 10.0)
Código de Manual: 10_Item_24_UoM_Packaging
Módulo Oficial: Inventario y Artículos (Items and Inventory - Packaging Management)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Logísticos, Jefes de Despacho, Supervisores de Empaque y Agentes IA (Antigravity)
Carpeta Asociada: 057_10_Item_24_UoM_Packaging


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "057",

  "topic": "UoM Packaging Setup & Automatic Packing Slips",

  "sap_module": "Inventory_Packaging",

  "database_tables": {

    "package_types_setup": "OPKG",

    "item_package_definitions": "ITM12 / ITM13",

    "delivery_package_header": "PKG1",

    "delivery_package_lines": "PKG2",

    "document_settings": "OADM"

  },

  "menu_paths": [

    "Gestión > Definición > Inventario > Clases de paquete",

    "Inventario > Datos maestros de artículo > Pestañas Datos de ventas / Datos de compras > Botón Clase de paquete",

    "Gestión > Inicialización del sistema > Parametrizaciones de documento > Pestaña Por documento > Entrega / Factura de clientes > Casilla 'Recomendar embalaje basándose en datos maestros de artículo'"

  ],

  "packaging_calculation_rules": {

    "volumetric_calculation": "Cantidad_por_Paquete = Floor((Largo_Paquete / Largo_UdM) * (Ancho_Paquete / Ancho_UdM) * (Alto_Paquete / Alto_UdM))",

    "weight_fallback": "Si no existen dimensiones volumétricas completas, el sistema divide el peso bruto del paquete para el peso unitario del artículo",

    "integer_rounding": "El campo Cantidad por Paquete es estrictamente un número entero truncado hacia abajo (Floor). Si el resultado matemático es < 1, no se asigna valor.",

    "document_packages_formula": "Numero_de_Paquetes = Ceiling(Cantidad_Vendida / Cantidad_por_Paquete)"

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 El Flujo de Embalaje en la Cadena de Suministro
En la gestión comercial y logística de SAP Business One, los clientes compran artículos en diversas Unidades de Medida (UdM), pero el departamento de despacho debe consolidar físicamente los productos en recipientes adecuados (cajas de cartón, contenedores plásticos, palets europeos o fardos). La funcionalidad de Embalajes por UdM automatiza el cálculo de cuántos paquetes y de qué tipo se necesitan para cumplir un pedido, eliminando la estimación manual y acelerando la generación del Packing Slip (Albarán de Empaque).
2.2 Metodología de Configuración en 3 Pasos
Paso 1: Definir Clases de Paquete Globales (OPKG):
Ruta: Gestión > Definición > Inventario > Clases de paquete.
Se registran las dimensiones exteriores estándar: Largo, Ancho, Alto, Volumen y Peso.
Consideración de Peso: El peso de la clase de paquete puede definirse como peso neto (peso de la caja vacía) o peso bruto máximo soportado.
Paso 2: Asignar Grupo de UdM al Artículo (OITM):
El artículo debe estar vinculado a un grupo de unidades de medida estructurado.
Paso 3: Parametrizar Embalajes por UdM en el Artículo:
En la pestaña Datos de ventas o Datos de compras, se presiona el botón explorador junto al campo Clase de paquete.
Se establece la relación entre cada UdM comercial y los paquetes posibles.
El sistema calcula automáticamente el campo Cantidad por paquete (Quantity per Package).
2.3 Generación Automática del Packing Slip en Entregas
Al activar en Parametrizaciones de documento la opción Recomendar embalaje basándose en datos maestros de artículo, SAP Business One construye la estructura de bultos en tiempo real al generar una Entrega (ODLN) o Factura de Clientes (OINV).
En la ventana de Embalajes, el sistema indica:
Número de bultos (ej. 2 Cajas).
Peso total de cada bulto (calculado: $\text{Peso unitario} \times \text{Unidades contenidas} + \text{Tara de la caja}$).
Contenido específico asignado a cada paquete individual.


3. ATLAS DIDÁCTICO: CÁLCULO VOLUMÉTRICO DE EMBALAJE
Ejemplo Práctico de Dimensionamiento:

Unidad de Medida (Pack de Papel): Largo = 30 cm, Ancho = 21 cm, Alto = 10 cm.
Clase de Paquete (Caja Estándar): Largo = 60 cm, Ancho = 42 cm, Alto = 10 cm.
Cálculo de Capacidad:
Largo: $60 / 30 = 2\text{ unidades}$
Ancho: $42 / 21 = 2\text{ unidades}$
Alto: $10 / 10 = 1\text{ unidad}$
Capacidad total por caja = $2 \times 2 \times 1 = \mathbf{4\text{ packs por caja}}$.
Si el cliente compra 8 packs, el documento calcula automáticamente: $$\text{Número de Cajas} = \frac{8}{4} = \mathbf{2\text{ cajas}}$$


4. CASO DE NEGOCIO RESUELTO: DESPACHO DE RESMAS DE PAPEL EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers vende papel para impresoras en paquetes de 6 resmas (6-Pack).

Dimensiones del 6-Pack: 30 cm de largo, 21 cm de ancho, peso = 15 kg.
Clase de empaque utilizada: Caja Master 60x42 (Capacidad: 4 unidades de 6-Pack).
Un cliente corporativo emite una orden de compra por 8 unidades de 6-Pack.
Ejecución del Despacho:
Al crear la Entrega (ODLN), el operario pulsa el botón Visualizar embalaje.
El sistema propone de forma autónoma:
Paquete 1: 1 Caja Master con 4 unidades de 6-Pack (Peso: $4 \times 15\text{ kg} = 60\text{ kg}$).
Paquete 2: 1 Caja Master con 4 unidades de 6-Pack (Peso: $4 \times 15\text{ kg} = 60\text{ kg}$).
Se imprime el Packing Slip desglosando la carga por bulto, facilitando la estiba en el camión y la verificación en la bodega del cliente.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Qué criterio geométrico utiliza prioritariamente SAP Business One para calcular el campo "Cantidad por paquete" en los datos maestros del artículo?
A) El precio de venta del artículo.
B) Las dimensiones volumétricas (largo, ancho y alto) de la unidad de medida comparadas con las dimensiones de la clase de paquete.
C) El código de barras EAN-13.
D) El peso en libras del almacén de origen.
Respuesta Correcta: B
Justificación Técnica: El sistema calcula cuántas veces caben las dimensiones lineales de la UdM dentro de las dimensiones del paquete. Solo si faltan medidas de volumen recurre al cálculo secundario por peso.
Pregunta 2
Si el cálculo volumétrico indica que en una caja caben 3.75 unidades de una determinada unidad de medida, ¿qué valor numérico asigna el sistema al campo Cantidad por Paquete?
A) 4 (redondea hacia arriba).
B) 3 (trunca hacia abajo al entero inferior).
C) 3.75 con dos decimales.
D) Emite un error de empaque inválido.
Respuesta Correcta: B
Justificación Técnica: Las capacidades de empaque en SAP Business One son estrictamente valores enteros no fraccionables, truncándose siempre hacia abajo (Floor) para garantizar que el producto quepa físicamente sin desbordar el contenedor.
Pregunta 3
¿Dónde se activa la recomendación automática de bultos y packing slips para documentos de ventas?
A) En el Plan de Cuentas de Mayor.
B) En las Parametrizaciones de Documento, pestaña "Por documento", seleccionando Entrega o Factura de clientes y marcando la casilla "Recomendar embalaje basándose en datos maestros de artículo".
C) En el Asistente de Pagos Masivos.
D) En la ficha del socio de negocios del transportista.
Respuesta Correcta: B
Justificación Técnica: Dicha parametrización gobierna el comportamiento de los documentos de entrega para invocar la lógica de empaque definida en OITM al momento de agregar transacciones de salida.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
