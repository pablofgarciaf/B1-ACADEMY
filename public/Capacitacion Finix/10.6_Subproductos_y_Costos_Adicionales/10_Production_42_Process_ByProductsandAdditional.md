Unidad 074: Subproductos y Cantidad Adicional en Producción (SAP Business One 10.0)
1. Metadatos Técnicos
Módulo: Producción (Advanced Manufacturing Features)
Código de Unidad: DOC_074_Production_ByProducts
Audiencia Objetivo: Diseñadores de Procesos Químicos/Discretos, Analistas de Costos, Consultores de Producción e Implementadores SAP B1.
Versión de SAP: SAP Business One 10.0 (HANA / SQL Server).


2. Antigravity Master Schema (JSON Specification)
{

  "$schema": "https://antigravity.schema.sap.com/v10/production-byproducts-additional-qty.json",

  "unit_id": "074_Production_ByProducts",

  "system_context": {

    "module": "Production",

    "submodules": ["Bill of Materials", "By-Products", "Setup Quantities"],

    "database_tables": {

      "bom_lines": [

        {"table": "ITT1", "description": "Líneas de LdM (Quantity < 0 indica Subproducto, AddQuantity indica Cantidad Adicional / Setup)"}

      ],

      "production_order_lines": [

        {"table": "WOR1", "description": "Líneas de Orden de Producción (PlannedQty calculada con fórmula de Cantidad Adicional y signo negativo para By-Products)"}

      ],

      "receipt_tables": [

        {"table": "OIGN", "description": "Recibo de Producción (Cabecera)"},

        {"table": "IGN1", "description": "Líneas de Recibo (Donde conviven el producto terminado principal y los subproductos recibidos en inventario)"}

      ]

    },

    "menu_navigation_paths": [

      "Producción > Lista de materiales > Columna Cantidad (ingreso de valor negativo)",

      "Producción > Lista de materiales > Columna Cantidad adicional",

      "Producción > Orden de producción > Columna Cantidad adicional",

      "Producción > Recibo de producción > Columna Subproducto"

    ]

  },

  "business_rules": {

    "byproduct_definition": "Un subproducto se modela como un artículo componente regular en la LdM o en la Orden de Producción pero con una CANTIDAD NEGATIVA.",

    "byproduct_receipt_logic": "Los subproductos NO se emiten mediante Salida para Producción (OIGE), sino que se RECIBEN en el almacén mediante Recibo de Producción (OIGN) junto con el producto terminado.",

    "byproduct_issue_methods": {

      "Backflush": "La cantidad del subproducto recibida está atada estrictamente a la cantidad notificada del producto padre.",

      "Manual": "El subproducto puede agregarse, editarse o recibirse como una línea independiente en el recibo de producción."

    },

    "additional_qty_formula": "Planned Quantity = (Produced Item Planned Qty * Base Qty) + Additional Qty",

    "additional_qty_nature": "Representa una cantidad fija de puesta a punto (Setup / Lead time / Merma fija de calibración) que NO escala con el número de unidades producidas."

  }

}


3. Desarrollo Conceptual y Funcional Exhaustivo
3.1 El Concepto y Gestión de Subproductos (By-Products)
En múltiples industrias (química, metalmecánica, maderera, alimentaria), el proceso de fabricación de un producto principal genera inevitablemente remanentes, derivados secundarios o descartes utilizables:

Ejemplo Maderero: Al cortar marcos para puertas se generan tablones pequeños reutilizables para cajas o marcos de fotos.
Ejemplo Metalúrgico: Recortes de planchas de acero o virutas metálicas vendibles como chatarra.
Ejemplo Químico: Destilación de solventes donde se obtienen subproductos secundarios.
Configuración Técnica en SAP Business One
Modelado con Cantidad Negativa: En la Lista de Materiales (OITT/ITT1) o directamente en la Orden de Producción (OWOR/WOR1), el subproducto se añade como una línea de tipo Artículo, pero introduciendo un valor numérico negativo en el campo Cantidad (por ejemplo, $-2$).
Métodos de Emisión aplicados al Subproducto:
Toma Retroactiva (Backflush): El subproducto queda enlazado indisolublemente al artículo padre. Si se reciben 10 unidades del padre y la cantidad base es $-0.5$, el sistema ingresa automáticamente 5 unidades del subproducto al inventario en el Recibo de producción.
Manual: Permite recibir el subproducto de forma desacoplada o ajustar manualmente la cantidad real obtenida en planta en la ventana de Recibo de producción (OIGN).
Recepción en Almacén (OIGN): Los subproductos nunca se procesan en la ventana Salida para producción (OIGE). Se reciben en el inventario a través de la ventana Recibo de producción (OIGN). En este documento, una columna especial denominada Subproducto identifica claramente cuáles líneas corresponden a subproductos y cuál al producto padre.
3.2 El Concepto de Cantidad Adicional (Additional Quantity / Setup Time)
En una línea de producción, ciertos consumos de materiales o tiempos de maquinaria son independientes del tamaño del lote fabricado. Se denominan comúnmente Costos de Preparación (Setup / Puesta a punto):

Recurso: Tiempo necesario para calibrar una máquina fresadora o precalentar un horno industrial (ej. 30 minutos de puesta a punto, ya sea que se hornee 1 pieza o 500 piezas).
Artículo: Plancha de prueba o bobina de purga que se descarta obligatoriamente al arrancar una extrusora para limpiar el conducto.
Algoritmo de Cálculo de la Cantidad Planificada
SAP Business One calcula la cantidad total requerida de un componente (artículo o recurso) aplicando la fórmula: $$\text{Cantidad Planificada} = (\text{Cantidad Planificada del Padre} \times \text{Cantidad Base}) + \text{Cantidad Adicional}$$

Comportamiento de Escala:
Si fabricamos 1 unidad con Cantidad Base = 1 h y Cantidad Adicional = 0.5 h: $$\text{Planificada} = (1 \times 1) + 0.5 = 1.5\text{ horas}$$
Si fabricamos 100 unidades: $$\text{Planificada} = (100 \times 1) + 0.5 = 100.5\text{ horas}$$ (La cantidad adicional de 0.5 horas NO se multiplicó por 100; se mantuvo constante como costo fijo de arranque).


4. Caso de Negocio Práctico en OEC Computers
Contexto
OEC Computers fabrica cables de conexión de red blindados de alta velocidad modelo CAB-CAT7-10M.
Parámetros de Fabricación
LdM del Cable:
Padre: CAB-CAT7-10M (Rollo terminado de 10 metros).
Componente 1: Cable UTP crudo por bobina. Cantidad Base = 10 metros.
Recurso 1 (Crimpadora Automática): Tiempo de ciclo = 0.1 horas. Cantidad Adicional (Setup) = 0.25 horas (15 minutos para montar las cuchillas de corte y calibrar la tensión).
Componente 2 (Subproducto - Cobre de Descarte): Durante el pelado y corte automático se recupera viruta de cobre puro reutilizable (COPPER-SCRAP). Se configura como Cantidad = -0.05 kg por cada rollo producido (Método: Toma retroactiva).
Ejecución de la Orden para 50 Rollos
Cálculo de la Máquina Crimpadora: $$\text{Tiempo Planificado} = (50 \times 0.1\text{ h}) + 0.25\text{ h} = 5.0 + 0.25 = 5.25\text{ horas}$$
Cálculo del Subproducto (COPPER-SCRAP): $$\text{Cantidad Planificada} = (50 \times -0.05\text{ kg}) = -2.5\text{ kg}$$
Proceso en Planta y Resultados:
La orden se libera y la crimpadora consume 5.25 horas de tiempo total.
Al notificar la finalización mediante Recibo de producción (OIGN) por los 50 cables terminados:
Ingresan al almacén 50 unidades de CAB-CAT7-10M.
Ingresan automáticamente al almacén de materiales reciclables 2.5 kg de COPPER-SCRAP valorados al costo correspondiente, reduciendo el costo neto final de la orden en WIP.


5. Banco de Evaluación Situacional (Certificación SAP B1)
Pregunta 1
¿Cómo se define técnicamente un Subproducto (By-Product) en la Lista de Materiales de SAP Business One 10.0?

A) Creando una lista de materiales de montaje paralela.
B) Ingresando el artículo en las líneas de la LdM con una cantidad negativa.
C) Marcando la casilla "Subproducto" en la ficha de Finanzas del maestro de artículos.
D) Creando un documento de Salida de Mercancías con motivo de merma.
Respuesta Correcta: B
Justificación Técnica: La sintaxis del motor de producción de SAP B1 reconoce cualquier componente con cantidad negativa como un subproducto que debe ingresarse al stock en lugar de consumirse.
Pregunta 2
Una Lista de Materiales tiene asignado un recurso con una Cantidad Base de 2 horas y una Cantidad Adicional de 1 hora para calibración inicial. Si se crea una Orden de Producción para fabricar 20 unidades del producto padre, ¿cuál será la Cantidad Planificada total del recurso en la línea de la orden?

A) 60 horas.
B) 40 horas.
C) 41 horas.
D) 21 horas.
Respuesta Correcta: C
Justificación Técnica: Aplicando la fórmula oficial: $\text{Planned Qty} = (\text{Produced Item Qty} \times \text{Base Qty}) + \text{Additional Qty} = (20 \times 2) + 1 = 40 + 1 = 41\text{ horas}$. La cantidad adicional es fija y no escala con el lote.
Pregunta 3
¿A través de qué documento se ingresa físicamente al stock un subproducto generado durante la orden de fabricación?

A) Salida para producción (OIGE).
B) Recibo de producción (OIGN).
C) Entrada de mercancías general (OPDN).
D) Revalorización de inventarios (OMRV).
Respuesta Correcta: B
Justificación Técnica: Dado que el subproducto es un resultado derivado del proceso productivo, se recibe en los almacenes mediante el documento Recibo de producción, apareciendo junto al artículo terminado principal.