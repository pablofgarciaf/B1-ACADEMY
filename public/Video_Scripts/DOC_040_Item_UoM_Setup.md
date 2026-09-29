# Guion de Video: DOC 040 Item UoM Setup

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 040 Item UoM Setup.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 040: CONFIGURACIÓN DE UNIDADES DE MEDIDA Y GRUPOS DE UDM (SAP BUSINESS ONE 10.0)
Código de Manual: 10_Item_22_UoM_Setup
Módulo Oficial: Artículos e Inventario / Configuración de Unidades de Medida (Units of Measure Setup - MM)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Ingenieros de Empaque, Administradores de Catálogos y Agentes IA (Antigravity)
Carpeta Asociada: 040_10_Item_22_UoM_Setup


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "040",

  "topic": "Units of Measure (UoM) and UoM Groups Setup and Conversion Rules",

  "sap_module": "Inventory_UoM_Configuration",

  "database_tables": {

    "global_uom_master": {

      "table": "OUOM",

      "primary_key": "UomEntry",

      "fields": ["UomCode (Código único)", "UomName (Nombre descriptivo)", "Length", "Width", "Height", "Volume", "Weight"]

    },

    "uom_groups_header": {

      "table": "OUGP",

      "primary_key": "UgpEntry",

      "fields": ["UgpCode (Código de grupo)", "UgpName (Descripción)", "BaseUom (Clave de UdM base)"]

    },

    "uom_group_definitions": {

      "table": "UGP1",

      "composite_key": ["UgpEntry", "UomEntry"],

      "fields": {

        "AltQty": "Cantidad alternativa",

        "UomEntry": "Unidad de medida alternativa",

        "BaseQty": "Cantidad equivalente en unidad base",

        "Formula": "AltQty * AltUoM = BaseQty * BaseUoM"

      }

    },

    "item_master_integration": {

      "table": "OITM",

      "fields": {

        "UgpEntry": "Vínculo al Grupo de UdM",

        "InvntryUom": "Unidad de medida de inventario (Inalterable tras la 1ª transacción)",

        "SalUnitMsr": "Unidad de medida de ventas por defecto",

        "BuyUnitMsr": "Unidad de medida de compras por defecto",

        "CntUnitMsr": "Unidad de medida para recuentos de inventario físico"

      }

    }

  },

  "menu_paths": [

    "Gestión > Definición > Inventario > Unidades de medida",

    "Gestión > Definición > Inventario > Grupos de unidades de medida",

    "Gestión > Definición > Inventario > Longitud y anchura / Peso",

    "Gestión > Inicialización del sistema > Parametrizaciones generales > Pestaña Inventario > Pestaña Artículos",

    "Inventario > Datos maestros de artículo > Pestañas Compras, Ventas e Inventario"

  ],

  "setup_methodology_4_steps": [

    { "step": 1, "name": "Definir Lista Global de UdM", "table": "OUOM", "action": "Crear códigos globales (Metro, Rollo, Bobina, Caja, Palet, Paquete, Unidad)" },

    { "step": 2, "name": "Definir Grupos de UdM y Reglas de Conversión", "table": "OUGP/UGP1", "action": "Fijar la UdM Base (generalmente la de inventario) y definir fórmulas de equivalencia" },

    { "step": 3, "name": "Asignar Grupos de UdM", "action": "Opción A: Por defecto en Grupos de Artículos (OITB) | Opción B: Directamente en Datos Maestros de Artículo (OITM)" },

    { "step": 4, "name": "Fijar Valores por Defecto en el Artículo", "table": "OITM", "action": "Establecer UdM de inventario, compras, ventas, empaque y códigos de barras por UdM" }

  ],

  "business_rules": {

    "inventory_uom_locking": "La Unidad de Medida de Inventario (InvntryUom) NO se puede modificar una vez que existen transacciones registradas para ese artículo",

    "base_unit_constraint": "En la primera línea de UGP1, la UdM alternativa es obligatoriamente la UdM Base, y AltQty = BaseQty = 1 (fijo de solo lectura)",

    "contextual_packaging": "Una misma UdM global (ej. 'Caja') puede tener conversiones completamente distintas en diferentes grupos (ej. 1 Caja = 24 paquetes en Papel, pero 1 Caja = 100 unidades en Electrónica)"

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Desacoplamiento Arquitectónico: Unidades Globales vs Grupos de UdM
En versiones legadas de ERPs, una "Caja" o un "Paquete" solía tener un valor rígido. SAP Business One 10.0 implementa una arquitectura flexible desacoplada en dos niveles:

Unidades de Medida Globales (OUOM):
Es el catálogo corporativo maestro donde se declaran todos los términos de medida utilizados en la empresa (Metro, Rollo, Bobina, Paquete, Botella, Caja, Palet, Litro, Kilogramo).
Puede incorporar características dimensionales maestras (largo, ancho, alto, peso y volumen resultante), útiles para cubicaje de empaques.
Grupos de Unidades de Medida (OUGP / UGP1):
Es la estructura relacional que define el comportamiento específico de esas unidades para una familia homogénea de artículos.
Un grupo define una Unidad Base y un conjunto de Reglas de Conversión.
Ejemplo de Reusabilidad: La palabra global "Caja" se reutiliza en el grupo Papelería (1 Caja = 24 resmas) y en el grupo Tornillos (1 Caja = 500 piezas), evitando crear cientos de códigos redundantes como "Caja24" o "Caja500".
2.2 Metodología de Implementación en 4 Pasos
Paso 1: Definición Global de Unidades (OUOM)
Se crean los códigos alfanuméricos y nombres en Gestión > Definición > Inventario > Unidades de medida. Si la misma unidad se aplica a artículos con dimensiones físicas disímiles, se recomienda dejar los campos de largo, ancho y peso en blanco para completarlos en el maestro de cada artículo.
Paso 2: Configuración del Grupo de UdM y la Unidad Base (UGP1)
Cada grupo exige seleccionar una Unidad Base (Base UoM).
Mejor Práctica de Consultoría SAP: La Unidad Base debe coincidir siempre con la Unidad de Medida de Inventario. Esto simplifica las consultas SQL, las valoraciones de existencias y los informes de auditoría.
Las filas siguientes establecen las equivalencias matemáticas respecto a la base: $$\text{Cantidad Alternativa} \times \text{UdM Alternativa} = \text{Cantidad Base} \times \text{UdM Base}$$
Ejemplo: $1\text{ Rollo} = 100\text{ Metros}$ | $1\text{ Bobina} = 50\text{ Metros}$.
Paso 3: Asignación del Grupo (Al Grupo de Artículos o al Artículo Directo)
Opción Preferente (Por Grupo de Artículos OITB): Al configurar la familia de artículos (ej. Cables), se predefine el Grupo de UdM Cables y la unidad de inventario Metro. Todo nuevo artículo creado dentro de esa familia hereda automáticamente toda la estructura.
Opción Manual: Si los artículos de una familia son heterogéneos, el grupo de UdM se asigna artículo por artículo en OITM.
Paso 4: Parametrización de Unidades por Defecto en el Maestro de Artículos
Con el grupo asignado, se parametrizan los valores operativos:

Pestaña Compras (BuyUnitMsr): La unidad por defecto en órdenes de compra (ej. Rollo).
Pestaña Ventas (SalUnitMsr): La unidad por defecto en ofertas y facturas (ej. Bobina o Metro).
Pestaña Inventario (InvntryUom y CntUnitMsr): La unidad contable inalterable y la unidad utilizada para recuentos de stock físico.
Códigos de Barras y Precios Múltiples: SAP B1 permite asociar un código de barras único y una lista de precios diferencial para cada UdM del grupo (ej. precio especial con descuento por compra en Rollo de 100m frente a metro fraccionado).


3. CASO DE NEGOCIO RESUELTO: GESTIÓN DE CABLES EN OEC COMPUTERS
Contexto del Proyecto:
OEC Computers distribuye cables de red y fibra óptica para infraestructuras corporativas:

Los cables se almacenan y valorizan en inventario por Metros (Metro = Unidad Base).
Se compran a los fabricantes internacionales en Rollos de 100 Metros.
Se venden a instaladores en tres modalidades:
Fraccionado por Metros (corte a medida).
En Bobinas medianas de 50 Metros.
En Rollos completos de 100 Metros.
Configuración Paso a Paso en SAP Business One 10.0:
Creación de UdMs Globales:
Ruta: Gestión > Definición > Inventario > Unidades de medida.
Se definen: MTR (Metro), ROLL (Rollo), SPOOL (Bobina).
Definición del Grupo de UdM "Cables":
Ruta: Gestión > Definición > Inventario > Grupos de unidades de medida.
Código: GRP_CABLES, Descripción: Grupo Cables de Red.
Matriz de Conversión en UGP1:
Fila 1 (Base): $1\text{ MTR} = 1\text{ MTR}$ (Sistema automático).
Fila 2: $1\text{ ROLL} = 100\text{ MTR}$.
Fila 3: $1\text{ SPOOL} = 50\text{ MTR}$.
Asignación al Grupo de Artículos "Cables":
En Definición > Grupos de artículos, se vincula Default UoM Group = GRP_CABLES y Default Inventory UoM = MTR.
Flujo Operativo Integrado:
Compras: Se emite una orden de compra por 5 ROLL de cable Cat6. En la recepción física ingresan 5 rollos, pero en la pestaña de inventario de OITW el stock aumenta en +500 MTR.
Ventas: Se emite una factura de venta a un cliente por 2 SPOOL y a otro por 25 MTR. El sistema deduce automáticamente 125 MTR del inventario ($2 \times 50 + 25$).
Resultado: Cero descuadres de inventario, trazabilidad perfecta y libertad total en la venta multiformato.


4. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Bajo qué circunstancia estricta se bloquea y queda deshabilitado para modificación el campo "Unidad de medida de inventario" (InvntryUom) en los Datos Maestros de Artículo?
A) Cuando el artículo es marcado como "Artículo de venta".
B) En el momento en que se registra la primera transacción de inventario (compra, venta, entrada o traslado) para ese artículo específico.
C) Únicamente si el artículo pertenece a un almacén gestionado por ubicaciones de depósito.
D) Al cierre del periodo fiscal anual.
Respuesta Correcta: B
Justificación Técnica: La unidad de inventario es la base matemática sobre la cual se registran las capas contables y los saldos físicos en OITW. Cambiarla tras existir movimientos corrompería la integridad del libro mayor y los históricos de stock.
Pregunta 2
En la configuración de un Grupo de Unidades de Medida (UGP1), ¿cuál es la mejor práctica recomendada al definir la "Unidad de Medida Base" (Base UoM)?
A) Utilizar siempre la unidad de compras más grande (ej. Palet o Contenedor).
B) Configurar como Unidad Base la misma unidad que se utilizará como Unidad de Medida de Inventario del artículo.
C) Dejar la unidad base sin definir para que el sistema elija al azar.
D) Utilizar una unidad monetaria en lugar de física.
Respuesta Correcta: B
Justificación Técnica: Al hacer coincidir la Unidad Base del grupo con la Unidad de Inventario, la conversión matemática interna es 1:1, optimizando los cálculos en tiempo real y simplificando auditorías y reportes SQL.
Pregunta 3
Si una empresa asigna un Grupo de Unidades de Medida predeterminado a un Grupo de Artículos (OITB), ¿qué ocurre cuando se crea un nuevo artículo dentro de esa categoría?
A) El sistema emite un error exigiendo confirmación del superusuario.
B) El nuevo artículo hereda automáticamente el Grupo de UdM y la Unidad de Medida de Inventario configuradas en el grupo de artículos, reduciendo tiempos de parametrización y evitando inconsistencias.
C) Se crean automáticamente 100 códigos de barras para el artículo.
D) El artículo se bloquea hasta ejecutar un recuento físico.
Respuesta Correcta: B
Justificación Técnica: La herencia desde el Grupo de Artículos asegura la estandarización operativa del catálogo maestro, asegurando que todos los productos de la misma familia operen bajo idénticas reglas de conversión.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
