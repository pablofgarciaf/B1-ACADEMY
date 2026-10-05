# Transcripción por Diapositiva: 10_FinSetup_22_DefaultGLAcc_Traditional

## Diapositiva 1

Configuración Financiera: Cuentas G/L Predeterminadas — Solución Tradicional — SAP Business One Versión 10.0. Bienvenido al tema: Cuentas G/L Predeterminadas – Solución Tradicional.

---

## Diapositiva 2

En esta sesión, analizaremos cómo implementar la Determinación de Cuentas G/L – Solución Tradicional. Objetivos. Al finalizar este tema, podrás: Implementar la Determinación de Cuentas G/L – Solución Tradicional.

---

## Diapositiva 3

Escenario de Negocio. Imagina que estás implementando SAP Business One en un nuevo cliente, OEC Computers. James, el CEO, te comenta que en el informe de Pérdidas y Ganancias quiere ver cuáles son los beneficios por cada grupo de artículos (por ejemplo, Impresoras). Desea que el sistema contabilice automáticamente los asientos contables en las cuentas de pérdidas y ganancias relevantes.

---

## Diapositiva 4

Aquí hay un recordatorio de la solución tradicional. Según la solución tradicional, existen tres opciones para definir un método de cuenta G/L predeterminado para un artículo: nivel de almacén, nivel de grupo de artículos y nivel de artículo. Cada artículo tendrá un método definido. Puedes establecer el método de antemano para todos los artículos nuevos y luego cambiarlo por artículo. Los valores que defines en las pestañas de la ventana Determinación de Cuentas G/L se toman como predeterminados para los 3 niveles. Luego puedes cambiar las cuentas predeterminadas en cualquiera de los niveles. Por ejemplo, puedes gestionar diferentes cuentas de inventario para cada almacén que posea la empresa. Cuando agregas un documento que genera un asiento contable (por ejemplo, una Factura A/R), el sistema examina cada artículo del documento para determinar el nivel definido para ese artículo y luego encuentra las cuentas G/L asociadas en las cuentas predeterminadas. Solución Avanzada de Determinación de Cuentas G/L / Solución Tradicional – Método de cuenta G/L predeterminado para un artículo: a nivel de almacén / a nivel de grupo de artículos / a nivel de artículo. Recordatorio: ¿qué es la opción de solución tradicional para definir cuentas G/L predeterminadas? Cuentas G/L predeterminadas para artículos usados en documentos. Ventana Determinación de Cuentas G/L: Ventas / Compras / General (por ejemplo, Cierre de Período) / Inventario / Recursos y WIP. Asignación.

---

## Diapositiva 5

Revisemos la configuración de la solución tradicional para la Determinación de Cuentas G/L. Las cuentas predeterminadas de la empresa en la ventana Determinación de Cuentas G/L se toman como predeterminadas para los 3 niveles (almacén, grupo de artículos y artículo). A continuación, defines las cuentas en cada nivel requerido. En el ejemplo mostrado, definimos las cuentas para cada grupo de artículos (paso 1 en el gráfico). Esto significa que cuando se elige un artículo que usa el nivel de grupo de artículos en un documento, el sistema recuperará automáticamente las cuentas de la definición del grupo de artículos al que pertenece el artículo. ¿Dónde se definen estas cuentas predeterminadas? Para el nivel de grupo de artículos, las cuentas predeterminadas se definen en la definición de cada grupo de artículos (en el área de configuración de inventario del módulo de Administración), en la pestaña Contabilidad. Igualmente, para el nivel de almacén, las cuentas predeterminadas se definen en la pestaña Contabilidad de la definición de cada almacén (también en el área de configuración de inventario). Si defines que un artículo se controla a nivel de artículo, estableces las cuentas G/L directamente en el maestro de artículos. Cuentas G/L predeterminadas. Configuración de la Solución Tradicional. Paso 1.

---

## Diapositiva 6

Una vez que hayas definido las cuentas predeterminadas, también debes elegir el método G/L predeterminado para los artículos nuevos en la Configuración General, en la pestaña Inventario → subpestaña Artículos, donde encontrarás el campo Establecer Cuentas G/L Por (paso 2 en el gráfico). En nuestro ejemplo, el método G/L predeterminado para los artículos nuevos se estableció como grupo de artículos. Por lo tanto, el predeterminado en cualquier artículo nuevo es el Nivel de Grupo de Artículos (paso 3) y las cuentas asignadas al maestro de artículos se derivan del grupo de artículos definido para ese artículo (paso 4). Cuentas G/L predeterminadas. Configuración de la Solución Tradicional. Pasos 1, 2, 3, 4.

---

## Diapositiva 7

Estas son las tres opciones para elegir un conjunto de cuentas predeterminadas, presentadas desde el punto de vista del artículo. Cada artículo puede tener un método definido. En los niveles de almacén y grupo de artículos, las cuentas se derivan del almacén o del grupo de artículos y el usuario no puede cambiarlas. En el nivel de artículo, el usuario introduce las cuentas manualmente en el maestro de artículos. Ten en cuenta que aunque especifiques un método G/L predeterminado para los artículos nuevos, puedes gestionar diferentes artículos con diferentes métodos si este escenario es necesario en tu empresa: simplemente cambia el nivel predeterminado en el maestro de artículos según sea necesario. Nota: después de que el nivel de almacén o de grupo de artículos esté definido en un artículo, puedes cambiar al método de nivel de artículo y asignar diferentes Cuentas G/L para usar en las transacciones monetarias. Establecer Cuentas G/L por Almacén / por Grupo de Artículos / por Nivel de Artículo. Cuentas desde la Definición del Almacén / desde la Definición del Grupo de Artículos / Introducidas Manualmente. Configuración de la Solución Tradicional. Cuentas G/L predeterminadas en el Nivel de Artículo.

---

## Diapositiva 8

Resumen. Puntos clave: En la ventana Determinación de Cuentas G/L defines las cuentas G/L predeterminadas a usar en las transacciones. La solución tradicional te permite definir el método de cuenta G/L predeterminado para un artículo. Existen tres opciones para definir un método de cuenta G/L predeterminado para un artículo: Nivel de almacén / Nivel de grupo de artículos / Nivel de artículo.

---

## Diapositiva 9

Aviso legal SAP — sin cambios respecto al documento original.

---
