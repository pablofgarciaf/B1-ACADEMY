# Transcripción por Diapositiva: 10_Production_42_Process_ByProductsandAdditional

## Diapositiva 1

Producción y MRP: Proceso de Producción — Subproductos y Cantidades Adicionales — SAP Business One Versión 10.0. Bienvenido al tema sobre Subproductos y Cantidades Adicionales en el proceso de producción.

---

## Diapositiva 2

Objetivos. Al finalizar este tema, podrás: Configurar subproductos en una Lista de Materiales. Procesar subproductos en una Orden de Producción. Configurar y utilizar Cantidades Adicionales en la producción.

---

## Diapositiva 3

Concepto de Subproductos. Un subproducto es un artículo que se genera como resultado secundario del proceso de producción, además del artículo principal producido. En SAP Business One, los subproductos se representan como componentes con cantidad negativa en la Lista de Materiales. La cantidad negativa indica que en lugar de consumirse, ese artículo se agrega al inventario como salida del proceso.

---

## Diapositiva 4

Configuración de Subproductos en la Lista de Materiales. Para configurar un subproducto: En la Lista de Materiales del artículo producido, agregar una fila con el artículo subproducto. Ingresar una cantidad negativa (por ejemplo, -0.5 para indicar que por cada unidad producida se genera 0.5 unidades del subproducto). El tipo de componente debe ser "Artículo". Esta configuración indica al sistema que el subproducto debe añadirse al inventario al completar la producción.

---

## Diapositiva 5

Métodos de Procesamiento de Subproductos. Existen dos métodos para procesar subproductos en una Orden de Producción: Método Manual: el usuario crea manualmente la Entrada desde Producción del subproducto en el momento de la recepción. Método de Retroimputación (Backflush): el subproducto se agrega automáticamente al inventario cuando se cierra la Orden de Producción, sin necesidad de crear un documento de Entrada explícito.

---

## Diapositiva 6

Entrada desde Producción para Subproductos. Cuando se utiliza el método Manual, al completar la producción se crea un documento de Entrada desde Producción que incluye tanto el artículo principal fabricado como el subproducto. La Entrada desde Producción registra el ingreso del subproducto al inventario con su cantidad y almacén de destino correspondientes. El costo del subproducto se calcula basándose en su costo estándar o en la asignación de costos definida.

---

## Diapositiva 7

Concepto de Cantidades Adicionales. Las Cantidades Adicionales representan una cantidad fija de un componente que se necesita para preparar o configurar el proceso de producción, independientemente de la cantidad total producida. Ejemplo: Para configurar la máquina antes de cada producción se necesita 1 hora de operario (tiempo de preparación o setup). Esta hora se necesita siempre, ya sea que se produzcan 10 o 1.000 unidades.

---

## Diapositiva 8

Fórmula de Cantidades Adicionales. La fórmula para calcular la cantidad total planificada de un componente con Cantidad Adicional es: Cantidad Planificada = (Cantidad OP × Cantidad Base del Componente) + Cantidad Adicional. Ejemplo: Orden de Producción para 100 servidores. Componente: 2 horas de operario por servidor (Cantidad Base = 2). Cantidad Adicional: 1 hora de preparación. Cantidad Planificada = (100 × 2) + 1 = 201 horas.

---

## Diapositiva 9

Puntos Clave — Resumen. Los subproductos se configuran con cantidad negativa en la Lista de Materiales para indicar que se agregan al inventario durante la producción. Existen dos métodos para procesar subproductos: Manual (mediante Entrada desde Producción) y Retroimputación (automático al cerrar la OP). Las Cantidades Adicionales representan costos fijos de preparación o setup que se suman a los costos variables de producción. La fórmula de Cantidad Adicional es: (Cantidad OP × Cantidad Base) + Cantidad Adicional. Tanto los subproductos como las cantidades adicionales permiten modelar con precisión los procesos de producción reales en SAP Business One.

---

