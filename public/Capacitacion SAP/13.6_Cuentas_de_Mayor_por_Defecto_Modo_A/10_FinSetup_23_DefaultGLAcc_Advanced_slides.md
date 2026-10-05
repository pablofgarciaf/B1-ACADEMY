# Transcripción por Diapositiva: 10_FinSetup_23_DefaultGLAcc_Advanced

## Diapositiva 1

Configuración Financiera: Determinación Avanzada de Cuentas G/L — SAP Business One Versión 10.0. Bienvenido al tema: Determinación Avanzada de Cuentas G/L.

---

## Diapositiva 2

Al finalizar este curso, podrás: Implementar la Determinación de Cuentas G/L – Solución Avanzada en una nueva empresa. Explicar cómo convertir una empresa existente para comenzar a usar la solución avanzada. Objetivos.

---

## Diapositiva 3

Escenario de Negocio. OEC Computers está ubicada en EE.UU. y anteriormente vendía principalmente a clientes nacionales. Ahora está expandiendo sus ventas a Canadá y Brasil. En el informe de Pérdidas y Ganancias, James, el CEO, quiere ver cuáles son los beneficios por cada grupo de artículos (por ejemplo, Impresoras) por país (por ejemplo, Canadá). Para ello, deben definir una cuenta de ingresos separada para cada grupo de artículos por país (por ejemplo, ingresos por impresoras en Canadá).

---

## Diapositiva 4

Aquí hay un recordatorio de la solución avanzada: La ventana Determinación de Cuentas G/L se usa para definir cuentas G/L a nivel de empresa. Además, la solución avanzada proporciona una matriz centralizada para determinar reglas de asignación de cuentas G/L en asientos contables según una lista cerrada y predefinida de criterios. Por lo tanto, la solución es más flexible y consistente con la contabilidad. Solución Tradicional – Método de cuenta G/L predeterminado para un artículo / Determinación Avanzada de Cuentas G/L – La ventana Determinación de Cuentas G/L se usa para definir cuentas G/L a nivel de empresa / También puedes definir reglas para asignar cuentas G/L en asientos contables. Recordatorio: ¿qué es la solución de Determinación Avanzada de Cuentas G/L? Cuentas G/L predeterminadas. Configuración de la Solución Avanzada. Ventana Determinación de Cuentas G/L: Ventas / Compras / General (por ejemplo, Cierre de Período) / Inventario / Recursos y WIP. Asignación.

---

## Diapositiva 5

Revisemos la configuración de la solución avanzada para la Determinación de Cuentas G/L. El formulario actual de Determinación de Cuentas G/L se usa para definir cuentas G/L a nivel de empresa (ve a Administración → Configuración → Finanzas → Determinación de Cuentas G/L → Determinación de Cuentas G/L). La columna Reglas Avanzadas indicará si existe una regla. Una vez que el usuario define una regla avanzada para una cuenta específica, la columna Reglas Avanzadas de esa cuenta en la ventana Determinación de Cuentas G/L se actualiza con el número de reglas definidas y un enlace al formulario avanzado. Al elegir la flecha de enlace, se abre el formulario avanzado (en modo editable), filtrado y mostrando solo las reglas avanzadas relacionadas con esa cuenta. Usando el botón Avanzado se abre la ventana Reglas de Determinación Avanzada de Cuentas G/L. Cuentas G/L predeterminadas. Configuración de la Solución Avanzada.

---

## Diapositiva 6

Revisemos las definiciones necesarias para comenzar a trabajar con la solución avanzada. En una base de datos nueva, debes seguir estos pasos para empezar a trabajar con la Determinación de Cuentas G/L – Solución Avanzada: Primero, activa la solución. Todos los artículos nuevos se establecerán automáticamente con Tipo de Regla Avanzada: General. A continuación, define los criterios de determinación. Y finalmente, establece el formulario de Reglas de Determinación Avanzada de Cuentas G/L - Inventario. En las siguientes diapositivas repasaremos los cuatro pasos y veremos cómo inicializar la Determinación de Cuentas G/L – Solución Avanzada. Inicialización del Sistema – Pasos. En una base de datos nueva, sigue estos pasos: 1. Activar la solución. 2. Todos los artículos nuevos se establecerán en Tipo de Regla Avanzada: General (automático). 3. Definir criterios de determinación. 4. Establecer el formulario de Reglas de Determinación Avanzada de Cuentas G/L - Inventario.

---

## Diapositiva 7

Para activar la solución, ve a: Administración → Inicialización del Sistema → Datos de la Empresa → Inicialización Básica y marca la casilla Habilitar Determinación Avanzada de Cuentas G/L. Al marcar la casilla, nuevas ventanas y campos están disponibles en el elemento de menú Determinación de Cuentas G/L en el área de Configuración de Finanzas del módulo de Administración. En una empresa existente, algunos campos cambiarán o se eliminarán al marcar la casilla. Más detalles sobre los cambios en una empresa actualizada y cómo configurarla se analizarán más adelante. ¡Nota! Debes tomar decisiones sobre la Determinación de Cuentas G/L junto con el contable del cliente. Activar la Solución Avanzada en una Base de Datos Nueva. Activar la solución: Administración → Inicialización del Sistema → Datos de la Empresa → Inicialización Básica → Marcar la casilla Habilitar Determinación Avanzada de Cuentas G/L. Nuevas ventanas y campos estarán disponibles. En una empresa existente, los campos cambiarán o se eliminarán. ¡Nota! Debes tomar decisiones sobre la Determinación de Cuentas G/L junto con el contable del cliente.

---

## Diapositiva 8

El Tipo de Regla Avanzada en el artículo es un nuevo campo que determina qué regla se usará para elegir las cuentas G/L de inventario en el asiento contable creado por el documento para ese artículo. Tras activar la solución avanzada, todos los artículos nuevos se establecerán automáticamente con Tipo de Regla Avanzada: General. El tipo de regla avanzada es el primer criterio para la selección automática de la regla de determinación avanzada de cuentas G/L. Recomendamos mantener el tipo de regla avanzada General en todos los artículos y reglas. Un tipo de regla avanzada diferente será establecido automáticamente por el sistema en escenarios especiales de migración desde la solución tradicional a la avanzada. ¡Nota! Para artículos con tipo de regla Almacén y Grupo de Artículos, se considerarán relevantes las reglas con el mismo tipo que el artículo así como las de tipo General. También ten en cuenta que el campo Establecer Cuentas G/L Por en el Maestro de Artículos bajo la pestaña Datos de Inventario cambia a: Establecer Método de Inventario Por. Los valores del campo (Almacén, Grupo de Artículos y Nivel de Artículo) permanecerán igual, pero ya no afectarán a la determinación de cuentas. Maestro de Artículos – Campo Tipo de Regla Avanzada.

---

## Diapositiva 9

Al habilitar la solución avanzada, la ventana Criterios de Determinación – Inventario aparece en el elemento de menú Determinación de Cuentas G/L en el área de Configuración de Finanzas del módulo de Administración. Esta ventana proporciona una lista cerrada y predefinida de criterios: Código de Artículo, Grupo de Artículos, Código de Almacén, País de Envío, Estado de Envío, Grupo de Interlocutor Comercial, campos definidos por el usuario y más. En esta ventana, podrás activar todos o algunos de los criterios según las necesidades del negocio. Si un criterio de determinación activo no está en uso por ninguna de las reglas avanzadas, puedes desmarcarlo para dejarlo inactivo. Puedes definir o cambiar la prioridad de los criterios usando los botones Subir y Bajar. ¡Nota! Una vez que actives la solución avanzada, el sistema comprobará los criterios de esta ventana según los valores (Almacén, Grupo de Artículos, Nivel de Artículo) definidos en el campo Establecer Cuentas G/L Por en el Maestro de Artículos bajo la pestaña Datos de Inventario. Cuando eliges el criterio Código de Artículo, el criterio Grupo de Artículos también se seleccionará automáticamente, ya que el grupo de artículos es un campo obligatorio en el maestro de artículos. Usa la ventana Criterios de Determinación – Recursos para la definición de criterios de las cuentas que se usarán al contabilizar transacciones que involucren Recursos. Luego puedes definir reglas avanzadas basadas en este conjunto de criterios en la ventana Reglas de Determinación Avanzada de Cuentas G/L – Recursos. Definir Criterios de Determinación. La ventana Criterios de Determinación proporciona una lista cerrada y predefinida de criterios. El usuario podrá: Activar todos o algunos de los criterios según las necesidades del negocio. Definir (o cambiar) la prioridad de los criterios usando los botones Subir y Bajar.

---

## Diapositiva 10

En el formulario Reglas de Determinación Avanzada de Cuentas G/L – Inventario defines reglas para asignar cuentas G/L en asientos contables. El formulario avanzado trata solo con cuentas relacionadas con artículos (las mismas cuentas que defines en el Maestro de Artículos en la solución tradicional). Al crear un nuevo período de registro, las reglas del último período se copiarán al nuevo período. Para cada regla debes definir al menos un criterio y una cuenta. Al definir nuevas reglas, recomendamos mantener el tipo de regla avanzada General a menos que se haya migrado un escenario especial desde la solución tradicional. General es el tipo predeterminado para cada nueva regla que crees. La columna Tipo está oculta por defecto; puedes agregarla eligiendo la opción Configuración de Formulario en la barra de herramientas. Usa los criterios Código de Almacén y Grupo de Artículos en lugar de usar los tipos de regla avanzada Almacén y Grupo de Artículos. Establecer las Reglas de Determinación Avanzada de Cuentas G/L para Inventario.

---

## Diapositiva 11

La prioridad (el orden de las filas) en la ventana Criterios de Determinación establece las prioridades en la ventana Reglas de Determinación Avanzada de Cuentas G/L. Esto se refleja de dos formas: Primero, los nombres y el orden de las columnas — la primera fila en la ventana Criterios de Determinación establece la prioridad más alta. Y así sucesivamente para el resto de las filas. Luego, el orden de las filas — la primera fila en la ventana Criterios de Determinación establece la regla con mayor prioridad en la tabla de Reglas de Determinación Avanzada. Y así sucesivamente para el resto de las filas. Una vez que defines una nueva regla avanzada (o cambias los criterios de la regla) y actualizas el formulario, el sistema priorizará automáticamente las reglas según los criterios de determinación. Cuando cambias las prioridades de los criterios de determinación, las prioridades de las reglas avanzadas se actualizarán automáticamente la próxima vez que abras el formulario. ¡Nota! Introducir un valor específico tiene mayor prioridad que el valor Todos. En el ejemplo mostrado: las 3 reglas en la ventana Reglas de Determinación Avanzada tienen valores específicos. En las primeras 2 reglas se especifica un grupo de artículos, y en la tercera se especifica un almacén. Las primeras 2 reglas tienen mayor prioridad ya que Grupo de Artículos está clasificado más alto que Código de Almacén en la ventana Criterios de Determinación. Prioridad de las Reglas Avanzadas. La prioridad (orden de filas) en la ventana Criterios de Determinación establece las prioridades en la ventana Reglas de Determinación Avanzada. ¡Nota! Introducir un valor específico tiene mayor prioridad que el valor Todos.

---

## Diapositiva 12

Veamos cómo funciona la Determinación de Cuentas G/L – Solución Avanzada en el trabajo diario. En los documentos de marketing y de inventario, las cuentas relacionadas con artículos se seleccionan automáticamente según las reglas definidas en la empresa. Cuando eliges un artículo en un documento de marketing (por ejemplo, una Factura A/R), el sistema comprueba las cuentas necesarias para la transacción (en nuestro ejemplo, las cuentas de inventario e ingresos). El sistema comprueba si existen reglas definidas para estas cuentas en la ventana Determinación de Cuentas G/L. Si no, las cuentas se toman del nivel de empresa — la ventana Determinación de Cuentas G/L. Si existen reglas definidas para las cuentas necesarias, el sistema va a la ventana Reglas de Determinación Avanzada de Cuentas G/L y busca la regla apropiada. El sistema comprueba si los criterios del documento coinciden con alguno de los criterios de las reglas avanzadas. Si es así, selecciona la regla avanzada con mayor prioridad. ¿Las cuentas necesarias para la fila del documento tienen reglas avanzadas? → Sí: ir a la matriz Reglas de Determinación Avanzada y encontrar las cuentas relevantes → ¿Los criterios del documento coinciden con los criterios de la regla avanzada? → Sí: usar la regla avanzada con mayor prioridad / No: tomar las cuentas del nivel de empresa. → No: tomar las cuentas del nivel de empresa — ventana Determinación de Cuentas G/L.

---

## Diapositiva 13

Cuando emites un documento de marketing (por ejemplo, una Factura A/R), el sistema selecciona las reglas del período que coincide con la fecha de contabilización del documento. De estas reglas, el sistema filtra el tipo de regla avanzada que coincide con el tipo en el maestro de artículos. En nuestro ejemplo, el tipo de regla avanzada en el artículo es General. El sistema seleccionará de las reglas definidas como tipo General. Reglas de Selección de Cuentas – Criterios del Documento.

---

## Diapositiva 14

A continuación, el sistema comprueba el interlocutor comercial y el maestro de artículos elegidos en el documento, y filtra la lista de reglas según los criterios definidos para ellos. En nuestro ejemplo, el sistema selecciona la regla según los siguientes criterios: Si el País de Envío del maestro de interlocutor comercial es Canadá y el artículo pertenece al grupo de artículos J.B. Printers, entonces elige las cuentas de ingresos e inventario definidas en la primera regla. La regla anula las cuentas G/L definidas en la ventana Determinación de Cuentas G/L. Las cuentas de inventario e ingresos definidas para esta regla se incluirán en el asiento contable creado por la Factura A/R. Si solo se define una cuenta en la regla, las otras cuentas relevantes para la creación del asiento contable se tomarán de la definición del nivel de empresa, es decir, de la ventana Determinación de Cuentas G/L. Por lo tanto, si una regla coincide con los dos criterios relevantes (es decir, país de envío Canadá y grupo de artículos J.B. Printers) y solo tiene definida la cuenta de ingresos, la cuenta de inventario se tomará de la ventana Determinación de Cuentas G/L. Si más de una regla cumple los criterios de la línea del documento, se seleccionará la regla con mayor prioridad. Reglas de Selección de Cuentas – Criterios del Documento. Determinados por los Datos del Interlocutor Comercial: País de Envío / Estado de Envío / Grupo IC / Código IC / Tipo IC / … Determinados por los Datos del Maestro de Artículos: Código de Artículo / Grupo de Artículos / Código de Almacén / … Criterios de Determinación.

---

## Diapositiva 15

Si el usuario cambia una cuenta en el documento manualmente, la cuenta actualizada se usará en el asiento contable. ¡Nota! Para asegurarte de que las reglas de determinación avanzada de cuentas G/L se definieron según las expectativas del cliente, recomendamos usar la opción Vista Previa del Asiento Contable antes de agregar el documento. Esta opción presenta una simulación del asiento contable que se creará después de agregar el documento (haz clic derecho en el encabezado o pie del documento para abrir el menú contextual y elige la opción Vista Previa del Asiento Contable). El Asiento Contable Creado.

---

## Diapositiva 16

Por último, veamos cómo configurar el sistema en una empresa existente que usa la solución tradicional. Marca la casilla Habilitar Determinación Avanzada de Cuentas G/L en Administración → Inicialización del Sistema → Datos de la Empresa → Inicialización Básica para activar la solución avanzada. Como se mencionó anteriormente, una vez que el usuario marca la casilla, la funcionalidad avanzada de cuentas G/L se activará y nuevas ventanas y campos estarán disponibles. En una empresa existente, los campos cambiarán o se eliminarán al marcar la casilla: El campo Establecer Cuentas G/L Por cambia a: Establecer Método de Inventario Por en: Administración → Inicialización del Sistema → Configuración General → pestaña Inventario → subpestaña Artículos; y en Inventario → Datos Maestros de Artículos → pestaña Datos de Inventario. Los valores del campo (Almacén, Grupo de Artículos y Nivel de Artículo) permanecerán igual. Todas las implementaciones del campo (por ejemplo, la función Multi Sucursales) permanecerán como están, excepto la asignación de cuentas G/L en documentos. La pestaña Contabilidad con todas las cuentas se eliminará de: Administración → Configuración → Inventario → Almacenes; y de Administración → Configuración → Inventario → Grupos de Artículos. En la pestaña Datos de Inventario del maestro de artículos, se eliminarán todas las columnas de cuentas de la matriz. Activar la Solución Avanzada en una Base de Datos Existente.

---

## Diapositiva 17

Después de que el usuario marque la casilla Habilitar Determinación Avanzada de Cuentas G/L, el sistema sugiere tres opciones: Con la primera opción, Migrar Asignaciones de Cuentas y Configuración de Determinación de Cuentas G/L de Inventario, todas las asignaciones de cuentas existentes a nivel de almacén, grupo de artículos y artículo se migrarán a las reglas de determinación avanzada de cuentas G/L. Con la segunda opción, Vista Previa de las Reglas de Determinación Avanzada de Cuentas G/L, el sistema simulará la asignación de cuentas esperada y el usuario podrá ver la matriz de reglas avanzadas y aceptar o rechazar las reglas. Y con la última opción, Migrar Solo la Configuración de Determinación de Cuentas G/L de Inventario, no se espera ninguna asignación de cuentas y solo los formularios del sistema y la configuración se ajustarán a la nueva matriz de Determinación de Cuentas G/L. Recomendamos elegir esta opción en caso de que la empresa quiera restablecer la determinación de cuentas y trabajar según la estructura de reglas avanzadas. ¡Nota! Una vez que la casilla está marcada y existen transacciones, puede desmarcarse, sin embargo en ese caso no se asignarán cuentas y el formulario Determinación de Cuentas G/L se usará para definir cuentas G/L en todos los niveles: almacén, grupo de artículos y nivel de artículo. Las asignaciones de cuentas se migrarán a todos los períodos existentes (Desbloqueado, Desbloqueado Excepto Ventas, Período de Cierre, Bloqueado). ¿Cómo Convertir los Datos en una Base de Datos Existente?

---

## Diapositiva 18

La solución avanzada proporciona una matriz centralizada para determinar reglas de asignación de cuentas G/L en asientos contables según una lista cerrada y predefinida de criterios. En una nueva empresa, debes seguir estos pasos para comenzar a trabajar con la Determinación de Cuentas G/L – Solución Avanzada: Activar la solución. Como resultado, todos los artículos nuevos se establecerán con Tipo de Regla Avanzada: General. A continuación, definir los criterios de determinación y establecer el formulario de Reglas de Determinación Avanzada de Cuentas G/L – Inventario. En los documentos de marketing y de inventario, las cuentas relacionadas con artículos se seleccionan automáticamente según las reglas avanzadas definidas en la empresa. Resumen. Puntos clave: La solución avanzada proporciona una matriz centralizada para determinar reglas de asignación de cuentas G/L en asientos contables según una lista cerrada y predefinida de criterios. En una nueva empresa, pasos: Activar la solución → Todos los artículos nuevos se establecerán en Tipo de Regla Avanzada: General (automático) → Definir criterios de determinación → Establecer el formulario de Reglas de Determinación Avanzada de Cuentas G/L - Inventario. En documentos de marketing y de inventario: Las cuentas relacionadas con artículos se seleccionan automáticamente según las reglas avanzadas definidas en la empresa.

---

## Diapositiva 19

Si no se definieron reglas para estas cuentas, las cuentas se toman del nivel de empresa, es decir, de la ventana Determinación de Cuentas G/L. Si eliges activar la solución avanzada en una empresa existente que usa la solución tradicional, tienes 3 opciones para migrar las asignaciones de cuentas existentes a las reglas de determinación avanzada de cuentas G/L. Resumen (cont.). Si no se definieron reglas para estas cuentas: las cuentas se toman del nivel de empresa, es decir, de la ventana Determinación de Cuentas G/L. Al activar la solución avanzada en una empresa existente que usa la solución tradicional, tienes 3 opciones para migrar las asignaciones de cuentas existentes a las reglas de determinación avanzada de cuentas G/L.

---

## Diapositiva 20

Aviso legal SAP — sin cambios respecto al documento original.

---
