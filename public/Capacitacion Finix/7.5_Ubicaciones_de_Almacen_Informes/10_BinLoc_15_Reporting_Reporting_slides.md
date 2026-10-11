# Transcripción por Diapositiva: 10_BinLoc_15_Reporting_Reporting

## Diapositiva 1

Informes de Ubicaciones de Almacén — SAP Business One Versión 10.0. Bienvenido al curso: Informes de Ubicaciones de Almacén.

---

## Diapositiva 2

Al finalizar este módulo, podrás: Ejecutar informes de ubicaciones de almacén y analizar su contenido. Iniciar procesos de reposición y vaciado de ubicaciones. Describir la información de ubicaciones de almacén que se encuentra en los informes de inventario. Objetivos.

---

## Diapositiva 3

Escenario de Negocio: Has terminado de configurar las ubicaciones de almacén en OEC Computers. También has guiado a los empleados de OEC Computers sobre cómo realizar los procesos de asignación. Ahora George, el gerente de almacén, solicita herramientas que le ayuden a rastrear, controlar y gestionar el inventario en las diferentes ubicaciones de almacén. Le presentas los informes de ubicaciones de almacén e inventario.

---

## Diapositiva 4

Esta es la agenda del curso. Revisaremos los informes de ubicaciones de almacén: la Lista de Ubicaciones de Almacén y la Lista de Contenido de Ubicaciones de Almacén.

---

## Diapositiva 5

El primer informe es el Informe Lista de Ubicaciones de Almacén. Muestra una lista de códigos de ubicación y sus datos asociados. Para cada ubicación se pueden ver el almacén y subniveles de almacén asociados, así como atributos, restricciones y otra información del Maestro de Ubicación. Todos los campos definidos por el usuario se agregan automáticamente a la ventana Configuración de Formulario y pueden mostrarse en el informe. Además, para cada ubicación se puede ver la cantidad de artículo almacenada y el número de tipos distintos de artículos existentes. Desde este informe se pueden generar el Informe Lista de Registros de Inventario y el Informe Lista de Contenido de Ubicaciones, filtrados por las ubicaciones seleccionadas. También se puede generar una transferencia de inventario para las ubicaciones seleccionadas mediante el botón Transferencia de Inventario.

---

## Diapositiva 6

En SAP Business One puedes realizar un procedimiento de reposición que rellena automáticamente una ubicación hasta la cantidad máxima definida para ella. Este procedimiento se activa desde el Informe Lista de Ubicaciones de Almacén. OEC Computers gestiona una zona de "cara de picking" (pick face) cerca del área de embalaje y entrega del almacén, donde se almacenan cantidades menores de los artículos de mayor rotación para hacer el picking más rápido y accesible. El procedimiento de reposición ayuda a mantener las cantidades deseadas en las ubicaciones de esta zona. Una vez a la semana, George emite el Informe Lista de Ubicaciones para ver las cantidades de artículos en las ubicaciones del pick face y activa un procedimiento de reposición para llenar las cantidades deseadas.

---

## Diapositiva 7

La columna Cantidad de Reposición muestra el resultado de restar la cantidad actual del artículo en la ubicación a la cantidad máxima definida para ella. Un resultado positivo representa la cantidad necesaria para alcanzar la cantidad máxima. En la imagen, la primera fila del informe muestra que la cantidad máxima definida es 50 y la cantidad actual es 10; por lo tanto, la cantidad de reposición es 40. El procedimiento de reposición crea una transacción de inventario que llena la ubicación con la cantidad calculada en la columna Cantidad de Reposición para las filas seleccionadas. Importante: el proceso de reposición automática no tiene en cuenta la cantidad mínima definida para la ubicación; siempre repone hasta la cantidad máxima definida, no hasta la mínima. Cálculo: Cantidad Máxima – Cantidad del Artículo = Cantidad de Reposición.

---

## Diapositiva 8

Para iniciar el proceso de reposición: primero selecciona las filas de las ubicaciones para las que deseas crear el procedimiento. Luego elige el botón Transferencia de Inventario y selecciona la opción Reponer Ubicaciones de Almacén. Se abre un documento de Transferencia de Inventario con los datos de las filas seleccionadas en el informe. Los siguientes campos se rellenan automáticamente para todas las filas seleccionadas: la columna Número de Artículo se llena con todos los artículos almacenados en las ubicaciones seleccionadas; en la columna Ubicación Destino el sistema asigna las cantidades de reposición de cada ubicación elegida en el informe; la columna Ubicación Origen se llena según las reglas de asignación automática, siempre que sea diferente a la Ubicación Destino; la columna Cantidad se llena con la cantidad de reposición por artículo. Para activar el proceso de reposición cuando los artículos caen por debajo de la cantidad mínima, podemos seleccionar solo las ubicaciones con cantidad positiva por debajo del mínimo.

---

## Diapositiva 9

El campo calculado Cantidad Por Debajo del Mínimo muestra el resultado de restar la cantidad actual del artículo en la ubicación a la cantidad mínima definida. Un resultado positivo representa la cantidad necesaria para alcanzar la cantidad mínima definida. En la imagen, la sexta fila muestra que la cantidad mínima es 5 y la cantidad actual solo es 2; por lo tanto, la cantidad por debajo del mínimo es 3. Puedes filtrar u ordenar el informe por la columna Cantidad Por Debajo del Mínimo para mostrar solo las filas con valor positivo, seleccionarlas y elegir el botón Transferencia de Inventario. Nota: los valores de Cantidad Por Debajo del Mínimo y Cantidad de Reposición solo se calculan cuando se cumple una de las siguientes condiciones: la ubicación contiene un único artículo con cantidad no nula, o una ubicación con cantidad cero cuya restricción de artículo es "Artículo Específico". Por ejemplo, la fila 8 no muestra valores calculados porque la columna Número de Artículos indica que hay varios artículos en esa ubicación. Cálculo: Cantidad Mínima – Cantidad Actual = Cantidad Por Debajo del Mínimo.

---

## Diapositiva 10

Otro procedimiento disponible en el Informe Lista de Ubicaciones es el procedimiento de vaciado. En algunos casos es necesario vaciar una ubicación, por ejemplo cuando se quiere asignar una ubicación a un artículo específico y ya hay otro artículo almacenado en ella. El procedimiento de vaciado permite generar automáticamente un documento de Transferencia de Inventario para trasladar la cantidad total o parcial de un artículo almacenado en una ubicación. Primero selecciona las filas de las ubicaciones relevantes, luego elige el botón Transferencia de Inventario y selecciona la opción Vaciar Ubicaciones de Almacén. Se abre un documento de Transferencia de Inventario con los datos de las filas seleccionadas. Los campos se rellenan automáticamente así: la columna Número de Artículo se llena con todos los artículos de las ubicaciones seleccionadas; en la columna Ubicación Origen el sistema asigna la cantidad del artículo en la ubicación elegida en el informe; la columna Ubicación Destino se llena según las reglas de asignación automática de entradas, siempre que sea diferente a la Ubicación Origen; en la columna Ubicación Destino el sistema asigna las cantidades de reposición mostradas en el informe para cada ubicación. En el apéndice encontrarás las reglas para la población de datos en la Transferencia de Inventario para las opciones de vaciado y reposición.

---

## Diapositiva 11

La Lista de Contenido de Ubicaciones de Almacén muestra una lista de artículos por ubicación con información adicional, de forma similar al informe Lista de Ubicaciones, pero es un desglose de este. También permite generar el Informe Lista de Registros de Inventario filtrado por artículos seleccionados, además de procesos de vaciado y reposición. En la imagen, en la fila 3 del informe Lista de Ubicaciones vemos el código de ubicación 05-A4-S1-L1 con valor 2 en la columna Número de Artículos, lo que significa que hay dos tipos de artículos en esa ubicación. El desglose por artículo se puede ver en la Lista de Contenido de Ubicaciones. Este informe puede generarse directamente desde el informe Lista de Ubicaciones, seleccionando las filas deseadas y eligiendo el botón Lista de Contenido de Ubicaciones. También puede generarse directamente desde el menú Informes de Inventario. Cuando George desea transferir los artículos almacenados en la ubicación de recepción a sus ubicaciones de almacenamiento regulares, emite este informe y elige la opción Vaciar Ubicación para abrir una Transferencia de Inventario. George prefiere usar este informe porque puede ver el desglose de la ubicación por artículo y así elegir los artículos específicos a vaciar.

---

## Diapositiva 12

Otra función disponible en este informe es establecer una ubicación seleccionada como predeterminada para el artículo de la fila. La ubicación donde ya se encuentra el artículo suele ser la elección obvia como Ubicación Predeterminada para ese artículo. Simplemente selecciona la fila que combina el artículo y la ubicación que deseas establecer como predeterminada y elige el botón Establecer como Ubicación Predeterminada. Nota: establecer una ubicación como predeterminada para un artículo sobreescribirá la ubicación predeterminada existente si ya había una definida.

---

## Diapositiva 13

El informe Lista de Contenido de Ubicaciones de Almacén también tiene una vista de informe jerárquica. Esta vista permite diferentes desgloses de la cantidad del artículo en los distintos subniveles de almacén y ubicaciones. El informe también permite expandir y contraer registros por cada nivel de visualización mediante el botón de expansión. Los registros contraídos muestran los totales de cantidades. En la imagen, George emitió el informe para ver dónde se encuentran los dispositivos tablet en su almacén. En el campo Vista de Informe eligió "Jerárquica" y en el campo Orden de Columnas eligió "Artículo Antes de Almacén". También puedes elegir otras opciones en el campo Orden de Columnas; por ejemplo, si quieres ver la lista de artículos en cada subnivel de Área, elige "Artículo Después de Área". Nota: puedes ejecutar el informe Lista de Contenido de Ubicaciones desde el menú contextual del Maestro de Artículos, obteniendo así un informe filtrado para ese artículo con solo hacer clic derecho en el registro del artículo.

---

## Diapositiva 14

Comprobemos la información de ubicaciones de almacén en el Informe Lista de Registros de Inventario y en el informe Inventario en Almacén. Agenda: Informes de ubicaciones de almacén (Lista de Ubicaciones y Lista de Contenido) / Información de ubicaciones en los informes de inventario (Lista de Registros de Inventario e Inventario en Almacén).

---

## Diapositiva 15

El Informe Lista de Registros de Inventario también refleja las transacciones de ubicaciones de almacén. Puedes marcar la casilla Visualización Dividida por Ubicaciones para ver el desglose de cada fila de documento por ubicación. Cuando la casilla está desmarcada, se muestra la columna Primera Ubicación en lugar de la columna Ubicación de Almacén. Si el mismo artículo está almacenado en más de una ubicación, el campo muestra la primera ubicación en orden alfanumérico y aparece resaltado en azul claro cuando no es la única ubicación donde está almacenado el artículo. El campo Primera Ubicación también aparece en la pestaña Inventario del Maestro de Artículos. En la imagen vemos que la segunda fila de la Entrada de Mercancías OC número 730 fue asignada a dos ubicaciones. Cuando la visualización dividida está desmarcada, el nombre de la columna cambia a Primera Ubicación y el campo aparece en azul (ya que hay más de una ubicación involucrada). La opción de Visualización Dividida por Números de Serie/Lote se explica en el curso de Números de Serie y Lotes de Ubicaciones de Almacén. Al elegir la flecha de enlace de la Primera Ubicación, se abre otro informe Lista de Registros de Inventario que muestra la lista de ubicaciones asignadas en la fila, filtrada por la línea de transacción elegida.

---

## Diapositiva 16

Examinemos algunas opciones de filtro y ordenación en la ventana de criterios de selección, según los números del gráfico: 1. Se puede ordenar por valores de ubicación de almacén. 2. Es posible dividir las filas por ubicación o por números de serie y lotes. 3. La ventana expandida tiene una sección para especificar Parámetros de Ubicación de Almacén, donde se puede filtrar los resultados del informe por código de ubicación, subnivel o atributo.

---

## Diapositiva 17

En la visualización detallada del informe Inventario en Almacén se puede ver la información de ubicaciones de almacén en las columnas: Primera Ubicación, Ubicación Predeterminada y Ubicación Predeterminada Forzada. Al elegir la flecha de enlace en el campo Primera Ubicación, se abre la Lista de Contenido de Ubicaciones filtrada por el artículo de la fila. Nota: este informe permite ver la lista de artículos con ubicaciones predeterminadas o, por el contrario, artículos sin ubicación predeterminada. Puedes usar este informe para visualizar, monitorizar o actualizar las ubicaciones predeterminadas.

---

## Diapositiva 18

Puntos clave: Existen dos informes principales en el módulo de ubicaciones de almacén: la Lista de Ubicaciones de Almacén y la Lista de Contenido de Ubicaciones de Almacén. Ambos informes muestran información de ubicaciones pero también sirven como punto de partida para diferentes procesos de inventario que involucran ubicaciones. El informe Lista de Ubicaciones muestra una lista de códigos de ubicación y sus datos asociados; el informe Lista de Contenido es un desglose del primero. Ambos informes habilitan procedimientos de reposición y vaciado. El informe Lista de Contenido tiene una vista jerárquica que permite distintos desgloses de la cantidad del artículo en los subniveles y ubicaciones, con opciones de expansión y contracción. El Informe Lista de Registros de Inventario muestra las transacciones de ubicaciones; el informe Inventario en Almacén muestra el desglose de ubicaciones por artículo y almacén.

---

## Diapositiva 19

Esta tabla resume las diferencias en los valores predeterminados de la Transferencia de Inventario para las opciones de Vaciado y Reposición. La columna Cantidad se llena con la cantidad de reposición en la opción Reponer y con la cantidad actual del artículo en la ubicación en la opción Vaciar. En la opción Reponer, los artículos en el campo Ubicación Origen se asignan según las reglas de asignación automática; en la opción Vaciar, la Ubicación Origen es la ubicación indicada en la fila del informe. La columna Ubicación Destino funciona al contrario: en la opción Reponer, la Ubicación Destino es la ubicación indicada en la fila del informe; en la opción Vaciar, la Ubicación Destino se asigna según las reglas de asignación automática.

---

## Diapositiva 20

Aviso legal SAP — sin cambios respecto al documento original.

---
