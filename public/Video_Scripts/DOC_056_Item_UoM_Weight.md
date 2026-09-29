# Guion de Video: DOC 056 Item UoM Weight

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 056 Item UoM Weight.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 056: GESTIÓN DE PESOS COMO UNIDADES DE MEDIDA EN SAP BUSINESS ONE 10.0
Código de Manual: 10_Item_23_UoM_Weight
Módulo Oficial: Inventario y Artículos (Items and Inventory - UoM Management)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Logísticos, Ingenieros de Procesos, Arquitectos de Integración y Agentes IA (Antigravity)
Carpeta Asociada: 056_10_Item_23_UoM_Weight


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "056",

  "topic": "Use Weights as Units of Measure & Weight Factor Dynamics",

  "sap_module": "Inventory_UoM_Weight",

  "database_tables": {

    "uom_setup": "OUOM",

    "uom_groups": "OUGP",

    "uom_group_definitions": "UGP1",

    "item_master_data": "OITM",

    "document_lines": "RDR1 / POR1 / DLN1 / PDN1"

  },

  "menu_paths": [

    "Gestión > Definición > Inventario > Unidades de medida",

    "Gestión > Definición > Inventario > Grupos de unidades de medida",

    "Inventario > Datos maestros de artículo > Pestañas Compras / Ventas / Inventario"

  ],

  "conversion_formulas": {

    "weight_factor_rule": "Cantidad_Base_Documento = Cantidad_Alternativa * Factor_Peso (proveniente de OITM.IWeight1)",

    "reverse_rule": "Cantidad_Alternativa = Cantidad_Base / Factor_Peso",

    "udf_factor_rule": "Cantidad_Base = Cantidad_Alternativa * Factor_UDF (cuando la unidad base es peso y se convierte a unidades no métricas como piezas/volumen)"

  },

  "operational_scenarios": {

    "Scenario_1_Weight_as_Alt_UoM": {

      "base_uom": "Metros (Longitud)",

      "alt_uom": "Kilogramos (Peso)",

      "mechanism": "El factor de peso extrae el peso por metro configurado en cada artículo específico, permitiendo reutilizar un único Grupo de UdM para artículos de distinto calibre/peso (Cable de red 1 kg/m, HDMI 2 kg/m, Fuerza 4 kg/m)."

    },

    "Scenario_2_Weight_as_Base_UoM": {

      "base_uom": "Kilogramos (Peso)",

      "alt_uom": "Piezas / Cajas (Unidades discretas)",

      "mechanism": "Uso del campo Factor UDF para capturar tasas de conversión específicas por artículo (ej. 100 conectores = 1 kg)."

    }

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 El Desafío de la Conversión Bidireccional entre Longitud/Unidades y Peso
En empresas industriales, metalmecánicas y tecnológicas, es habitual comprar materias primas por peso (toneladas, kilogramos) pero almacenarlas y consumirlas por longitud (metros, bobinas) o piezas discretas (unidades, conectores). Antes de la introducción del Factor de Peso (Weight Factor) y el Factor UDF, era necesario crear un Grupo de UdM separado para cada calibre o densidad de producto, saturando la base de datos de parametrizaciones redundantes.
2.2 Dinámica del Factor de Peso (Weight Factor)
En la ventana Definición de grupo de unidades de medida (UGP1), se define la relación entre la unidad alternativa (ej. Kilo - kg) y la unidad base (ej. Metro - m).
Al activar la columna Factor de peso, el sistema no fija un ratio estático universal, sino que lee dinámicamente el valor del campo Peso (IWeight1) de la ficha de Datos Maestros del Artículo (OITM).
Ejecución en Documentos: $$\text{Cantidad Base en Inventario} = \text{Cantidad Alternativa Comprada (kg)} \times \text{Factor de Peso}$$
Si compramos 10 kg de Cable HDMI (cuyo peso es 2 kg/metro), el sistema calcula automáticamente que ingresan 5 metros a inventario ($10 / 2 = 5\text{ m}$).
2.3 Peso como Unidad Base y Factor UDF (User-Defined Field Factor)
Cuando el inventario se gestiona nativamente por peso (ej. tornillería, conectores USB, resinas), la Unidad Base debe ser obligatoriamente el Kilogramo o Gramo:

Si estos artículos se comercializan en piezas individuales, la tasa de piezas por kilo varía según el modelo.
SAP Business One permite vincular un Campo Definido por el Usuario (UDF) en la cabecera de OITM al campo Factor UDF en UGP1.
Esto habilita conversiones complejas multidimensionales: peso a piezas, o dimensiones lineales (pulgadas de cajas plegadas) a volumen (litros de capacidad).


3. ATLAS DIDÁCTICO: MODELO DE CONVERSIÓN CON FACTOR DE PESO
┌─────────────────────────────────────────────────────────────────────────┐

│              GRUPO DE UDM: CABLES (Unidad Base = Metro)                 │

├───────────────┬─────────────────┬───────────────────┬───────────────────┤

│ Línea UdM     │ UdM Alternativa │ Factor de Peso    │ Fórmula Base      │

│ 1             │ 1 Metro         │ N/A               │ = 1 Metro         │

│ 2             │ 1 Kilo (kg)     │ Leer de OITM.Peso │ = 1 m * Factor    │

└───────────────┴─────────────────┴───────────────────┴───────────────────┘

                                   │

               ┌───────────────────┴───────────────────┐

               ▼                                       ▼

     [ Cable Red (1 kg/m) ]                  [ Cable Fuerza (4 kg/m) ]

     Compra: 100 kg                          Compra: 100 kg

     Inventario: 100 metros                  Inventario: 25 metros


4. CASO DE NEGOCIO RESUELTO: COMPRA DE CABLES EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers compra cables industriales al proveedor Copper Global, quien factura exclusivamente por peso en kilogramos. Sin embargo, OEC almacena y vende el cable a técnicos instaladores por metro lineal.

Artículo 1: Cable Red UTP (Peso en OITM = 1.0 kg/m).
Artículo 2: Cable Potencia Trifásico (Peso en OITM = 4.0 kg/m).
Ejecución Transaccional:
En el Grupo de UdM Cables, se define 1 Kilo = 1 Metro con la casilla de Factor de peso activa.
En la Orden de Compra (OPOR), el comprador solicita 200 kg de Cable de Potencia.
El sistema aplica el factor 4: $$\text{Metros ingresados} = \frac{200\text{ kg}}{4\text{ kg/m}} = 50\text{ metros}$$
El proveedor recibe su orden por 200 kg, y el almacén recibe y controla 50 metros exactos de cable físico.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿De dónde obtiene SAP Business One el valor numérico para calcular la conversión cuando se utiliza la columna "Factor de peso" en un Grupo de Unidades de Medida?
A) De la lista de precios de compras.
B) Del campo "Peso" ubicado en los Datos de Inventario del maestro del artículo (OITM).
C) De la báscula conectada al puerto COM del servidor.
D) De las parametrizaciones generales de la empresa.
Respuesta Correcta: B
Justificación Técnica: La funcionalidad de factor de peso consulta dinámicamente el peso unitario registrado en la ficha del artículo (OITM.IWeight1) para realizar la conversión dimensional hacia la unidad base.
Pregunta 2
¿Cuál es la función del campo "Factor UDF" en la definición de un Grupo de Unidades de Medida?
A) Calcular el impuesto al valor agregado por peso.
B) Permitir que un Campo Definido por el Usuario en el maestro del artículo actúe como multiplicador de conversión entre la unidad base y unidades alternativas no estándar (ej. piezas o volumen).
C) Bloquear la edición del artículo a usuarios no autorizados.
D) Traducir el nombre de la unidad de medida a otro idioma.
Respuesta Correcta: B
Justificación Técnica: El Factor UDF vincula valores variables específicos por producto (como densidad o unidades por kilo) para resolver conversiones no lineales en un mismo grupo de UdM.
Pregunta 3
Si se compra 1 kg de un artículo cuya unidad base de inventario es "Metro" y su factor de peso en el maestro es 2 kg/metro, ¿cuántos metros ingresarán al inventario en la Entrada de Mercancías?
A) 2 metros.
B) 0.5 metros.
C) 1 metro.
D) El sistema emite un error de incompatibilidad de unidades.
Respuesta Correcta: B
Justificación Técnica: Dado que cada metro pesa 2 kg, un peso de 1 kg representa exactamente la mitad de un metro ($1 / 2 = 0.5\text{ m}$).

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
