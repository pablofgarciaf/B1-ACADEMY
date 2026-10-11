# Transcripción por Diapositiva: 10_BinLoc_16_Serial_Serial

## Diapositiva 1

Números de Serie y Lotes en Ubicaciones de Almacén — SAP Business One Versión 10.0. Bienvenido al curso: Gestión de Números de Serie y Lotes en Ubicaciones de Almacén. En este curso se abordan los procesos de compra, venta y gestión de artículos administrados por número de serie o lote en un almacén gestionado por ubicaciones.

---

## Diapositiva 2

Al finalizar este curso, podrás describir cómo asignar ubicaciones de almacén para números de serie y lotes en los procesos de ventas y compras. Objetivos.

---

## Diapositiva 3

Esta es la agenda del curso. Comenzamos con un ejemplo de negocio. Agenda: Ejemplo de negocio / Proceso de compras / Proceso de ventas / Diferencias en Lotes.

---

## Diapositiva 4

Escenario de Negocio: Has terminado de configurar las ubicaciones de almacén en OEC Computers. También has guiado a los empleados en la realización de procesos de asignación y ejecución de informes de inventario para ubicaciones. Como OEC Computers compra y vende muchos artículos administrados por números de serie y lotes, explicas a George (el gerente) y su equipo el proceso de asignación de estos artículos.

---

## Diapositiva 5

En este curso veremos algunos escenarios típicos en OEC Computers que incluyen la compra, venta y picking de artículos administrados por números de serie en un almacén con ubicaciones. Los escenarios incluyen: agregar una Entrada de Mercancías OC para tablets (administradas por número de serie), asignándolas a las ubicaciones deseadas y actualizando sus números de serie. Luego crearemos tres escenarios de venta y examinaremos distintos métodos de emisión: en el escenario 1, emitimos una Entrega no basada en otro documento de venta; en el escenario 2, vemos qué ocurre cuando la Entrega se basa en un Pedido de Venta; en el escenario 3, vemos cómo el proceso de picking y embalaje se ve influenciado por el método de emisión. Nota: para simplificar, los escenarios se refieren a números de serie y no a lotes a lo largo de la formación. Sin embargo, la mayoría de las explicaciones son igualmente válidas para lotes. Las diferencias clave entre los procesos de serie y lote se cubrirán al final. Además, los escenarios se refieren a documentos de Entrada de Mercancías OC y Entrega, aunque los procesos de entrada y salida son similares en la mayoría de los documentos.

---

## Diapositiva 6

Examinemos un breve proceso de compras que demuestra la asignación de artículos administrados por números de serie en ubicaciones de almacén. Agenda: Ejemplo de negocio / Proceso de compras / Proceso de ventas / Diferencias en Lotes.

---

## Diapositiva 7

Este es el esquema general de los procesos de trabajo para la asignación de entrada de artículos administrados por número de serie. Los artículos administrados por número de serie o lote tienen asignado un método de gestión que controla cuándo se requieren dichos números. Los dos métodos son: "En Cada Transacción" y "Solo en Liberación". Con el primer método, "En Cada Transacción", se debe asignar un número de serie al recibir artículos en inventario. Al crear una Entrada de Mercancías, se abre la ventana Configuración de Número de Serie, donde se asignan los números de serie y luego las ubicaciones. Con el método "Solo en Liberación", no es obligatorio ingresar un número de serie al recibir el artículo; por eso, al crear una Entrada de Mercancías OC, no es necesario abrir la ventana de Configuración de Número de Serie y se usa directamente la ventana Asignación de Ubicación de Almacén como con cualquier otro artículo. Aun así, si se decide agregar números de serie al recibir un artículo de este método, se puede abrir manualmente la ventana para ingresarlos. Nota: este es un proceso general. Los procesos detallados se ven afectados por las reglas de asignación automática y la configuración de Creación Automática de Número de Serie en el Maestro de Artículos.

---

## Diapositiva 8

En el gráfico vemos un artículo con el método de gestión "En Cada Transacción". Cuando este artículo se agrega a una Entrada de Mercancías OC, ya no está disponible la opción de abrir la ventana Asignación de Ubicación directamente. Como se mencionó, la asignación de ubicación debe hacerse desde la ventana Configuración de Número de Serie, después de ingresar los números de serie obligatorios. Sin embargo, tras asignar los números de serie y la ubicación, se puede cambiar la asignación usando la flecha de enlace en el campo Asignación de Ubicación para abrir la ventana Configuración de Número de Serie.

---

## Diapositiva 9

La imagen muestra los dos pasos necesarios al recibir artículos con el método "En Cada Transacción". Para cada fila del documento con un artículo que requiere números de serie, se entra en la ventana Configuración de Número de Serie. Primero se ingresan los números de serie. Una vez asignados, el sistema asigna una ubicación automáticamente (si aplican reglas de asignación automática). También se puede asignar manualmente. Notas: los documentos pueden contener varias filas, algunas de artículos en serie y otras no; en la ventana de Configuración de Número de Serie solo se muestran los artículos administrados por serie. Además, al elegir un almacén no gestionado por ubicaciones en la fila del documento, ningún campo ni botón relacionado con ubicaciones es visible en la ventana.

---

## Diapositiva 10

Para artículos administrados por número de serie con el método "Solo en Liberación", se pueden asignar números en la ventana Asignación de Ubicación o en la ventana Configuración de Número de Serie (de forma opcional). Si en el Maestro de Artículos el campo Método de Gestión del Número de Serie está configurado como "Solo en Liberación" y la casilla Creación Automática de Número de Serie en Recepción está marcada, el sistema asignará una ubicación automáticamente al agregar el documento (si aplican reglas de asignación automática en recepción). Si no aplican reglas automáticas, el artículo entrante se asigna a la Ubicación del Sistema.

---

## Diapositiva 11

A veces se recibe una gran cantidad de un artículo y se desea redistribuirla entre múltiples ubicaciones. En la ventana Configuración de Número de Serie existe una forma de distribuir artículos desde la cuadrícula Números de Serie Creados a diferentes ubicaciones. Elige el botón Reasignar Ubicaciones de Almacén para abrir la ventana Reasignación de Ubicación de Almacén para Números de Serie. La lista de artículos se copia a esta ventana. Para activar la reasignación, selecciona los números de serie a reasignar y elige la ubicación destino en el campo Reasignar a Ubicación de Almacén. Tras la actualización, las nuevas ubicaciones aparecen en la ventana Configuración de Número de Serie. OEC Computers recibe grandes cantidades de tablets; cada tablet tiene un número de serie único y la cantidad es demasiado grande para una sola ubicación. El empleado del almacén abre la ventana Configuración de Número de Serie, actualiza los números de serie para toda la cantidad, elige el botón Reasignar Ubicaciones, selecciona unas 20 unidades y las asigna a una ubicación, luego otras 20 a otra, y así sucesivamente. Esta es una manera sencilla de asignar grandes cantidades del mismo artículo en lugar de elegir la ubicación en cada fila de la cuadrícula de números de serie. Nota: la reasignación es posible tanto para artículos que ya han sido asignados como para los que aún no lo han sido.

---

## Diapositiva 12

Como siempre al recibir artículos con número de serie, existe la opción de que el sistema genere los números de serie automáticamente para los artículos entrantes, sin necesidad de ingresarlos manualmente. Para ello, elige el botón Creación Automática para abrir la ventana Creación Automática de Números de Serie. El campo Ubicación de Almacén permite seleccionar una ubicación de una lista filtrada por el campo Almacén. Ingresar datos en este campo es opcional. Si se completa, se aplicará el mismo código de ubicación a todas las filas de números de serie creadas por esta ventana. El campo Ubicación de Almacén se actualizará automáticamente con la Ubicación Predeterminada si existe una definida.

---

## Diapositiva 13

Algunos artículos que OEC compra, como las tablets, se reciben en el almacén sin números de serie. Sin embargo, a la empresa le gusta asignarles números de serie poco después para poder rastrearlos. En esos casos, los artículos se configuran con el método "Solo en Liberación" y se reciben sin números de serie en las ubicaciones. Posteriormente, George asigna los números de serie usando la ventana Gestión de Número de Serie – Completo, accesible desde la ventana Gestión de Números de Serie. En la imagen, la Entrada de Mercancías OC número 756 fue creada para 2 unidades de tablet, asignadas a 2 ubicaciones diferentes. El siguiente paso es completar los números de serie y relacionar cada número con la ubicación correspondiente. En la ventana Gestión de Número de Serie – Completo, en la cuadrícula Números de Serie Creados, primero se ingresa el número de serie y luego se puede elegir la ubicación relevante de la lista de ubicaciones ingresadas para el artículo en la Entrada de Mercancías OC. Cuando se ha elegido solo una ubicación en la Entrada de Mercancías OC para toda la cantidad, esa ubicación se actualiza automáticamente en la columna Ubicación de Almacén de la cuadrícula.

---

## Diapositiva 14

Los cambios o actualizaciones a los números de serie ya creados se pueden realizar en el modo Actualización de la ventana Gestión de Número de Serie. Sin embargo, el código de ubicación de almacén no se puede modificar. La columna Ubicación de Almacén de solo lectura permite ver en qué ubicación se encuentra cada número de serie.

---

## Diapositiva 15

Veamos los cambios introducidos en los procesos de venta. Agenda: Ejemplo de negocio / Proceso de compras / Proceso de ventas / Diferencias en Lotes.

---

## Diapositiva 16

En OEC Computers, algunos artículos se recogen según su número de serie y no según su ubicación. Por ejemplo, OEC revende servidores a medida según la configuración especial solicitada por cada cliente. Todos estos servidores tienen el mismo código de artículo y cada servidor único se identifica por su número de serie. Al entregar el servidor al cliente, se recoge según su número de serie. En SAP Business One, el método de recogida para estos artículos se indica en el Maestro de Artículos mediante el campo Método de Emisión: Método 1 – Emisión Principalmente por Ubicaciones de Almacén: primero se elige la ubicación y luego un artículo específico con número de serie dentro de esa ubicación. Método 2 – Emisión Principalmente por Números de Serie y Lote: primero se elige el número de serie y luego se asigna automáticamente la ubicación donde está almacenado. En OEC Computers, casi todos los artículos usan el Método 1 por las siguientes razones: en la mayoría de los casos, al vender un producto, no importa ni al cliente ni a OEC qué número de serie exacto se emite; además, este método permite un picking más fácil y rápido porque no hay que buscar un número de serie específico; también permite el máximo control sobre la organización del almacenamiento en las distintas ubicaciones. Nota: estos dos métodos también afectan los escenarios donde la selección del número de serie y la asignación de ubicación no se realizan en el mismo documento.

---

## Diapositiva 17

El método de emisión se define en el Maestro de Artículos y puede cambiarse manualmente. El valor de este campo se obtiene por defecto del campo "Emisión Principalmente Por" en Configuración General → Inventario → Artículos. Nota: la configuración del campo en el Maestro de Artículos no puede cambiarse si existen pedidos de venta abiertos con asignaciones de serie o lote. En las siguientes diapositivas examinaremos 3 escenarios: Escenario 1: una entrega no basada en un pedido de venta; Escenario 2: una entrega basada en un pedido de venta; Escenario 3: el proceso de picking y embalaje.

---

## Diapositiva 18

Volvamos a OEC Computers. En el primer escenario emitimos una entrega no basada en un pedido de venta. OEC vende a su cliente Parameter Technology dos artículos: el primero es un servidor a medida emitido principalmente por número de serie; el segundo es una tablet también administrada por número de serie pero con método de emisión principalmente por ubicación. Observa las diferencias en los procesos de asignación de estos artículos. En la fila del servidor, la columna Ubicación de Almacén está bloqueada y la única forma de asignar el artículo desde una ubicación es entrando en la ventana Selección de Número de Serie desde el campo Cantidad. En cambio, para el artículo tablet se puede asignar una ubicación también eligiendo la flecha de enlace en la columna Asignación de Ubicación, o bien automáticamente si aplican reglas automáticas. En la imagen, la tablet ya fue asignada automáticamente. Nota: cuando se trabaja con el método "Principalmente por Números de Serie y Lote", primero hay que elegir los números de serie y luego las ubicaciones asociadas se asignan automáticamente.

---

## Diapositiva 19

La ventana Selección de Número de Serie admite la asignación de ubicaciones para ambos métodos de emisión. En la cuadrícula Números de Serie Disponibles, se pueden mostrar los distintos códigos de subnivel, atributos de ubicación y código de clasificación alternativa. El objetivo principal de estos campos es ayudar a la función de Autoselección, que simplemente selecciona números de serie para la cantidad requerida según el orden actual de la cuadrícula. La selección de números de serie puede gestionarse por secuencias de clasificación de ubicaciones o atributos, incluso para un artículo configurado para emitir principalmente por número de serie. En la imagen, se ha elegido el artículo servidor (emitido principalmente por número de serie). En la cuadrícula de Números de Serie Disponibles, la columna Número de Serie aparece seguida de la columna Ubicación. Los campos Filtrar y Buscar en el encabezado permiten filtrar por las propiedades del número de serie: Número de Serie, Número de Lote, Número de Serie del Fabricante y Número de Sistema. Al seleccionar el número de serie, la ubicación asociada se selecciona automáticamente.

---

## Diapositiva 20

Veamos qué ocurre en la ventana Selección de Número de Serie al elegir un artículo con el método "Principalmente por Ubicaciones". En nuestro ejemplo elegimos la tablet. Aquí, los campos de filtro permiten filtrar por códigos de ubicación de almacén o subniveles. La columna Ubicación aparece primero, seguida de la columna Número de Serie. En lugar del botón Autoselección, existe el botón Método de Selección, que proporciona las opciones regulares de selección de ubicación además de la Autoselección. La opción Autoselección elige ubicaciones según el orden de aparición en la cuadrícula de Números de Serie Disponibles.

---

## Diapositiva 21

En el segundo escenario, se emite una entrega basada en un pedido de venta. En la mayoría de los casos, el proceso de asignación de ubicaciones en una entrega será el mismo, ya sea o no basada en un pedido de venta. Sin embargo, hay circunstancias que pueden afectar la asignación en la entrega. Para artículos emitidos principalmente por ubicaciones, no es posible seleccionar números de serie en un pedido de venta, por lo que el proceso de asignación en la entrega basada en el pedido es el mismo que el descrito anteriormente. Para artículos emitidos principalmente por número de serie, sí es posible seleccionar los números de serie en el pedido de venta. Si los números de serie no se seleccionaron en el pedido, el proceso de asignación para la entrega es el mismo que el descrito. Sin embargo, si los números de serie sí se seleccionaron en el pedido, las ubicaciones asociadas a esos números se asignan automáticamente en el documento de entrega.

---

## Diapositiva 22

El tercer escenario hace referencia al proceso de Picking y Embalaje. Este proceso cambia según el método "Emisión Principalmente por" de cada artículo involucrado. La tabla muestra las principales diferencias entre cada método en los procesos de picking y embalaje. Para artículos emitidos principalmente por número de serie, todas las funciones de picking y embalaje solo pueden realizarse si ya se han seleccionado los números de serie. Por ejemplo, generar listas de picking y crear entregas solo es posible cuando los números de serie ya se han especificado en el pedido de venta. Si los números no se seleccionaron y se elige el botón Liberar a Lista de Picking, el sistema abre la ventana Selección de Número de Serie para permitir la selección durante el proceso de picking y embalaje. Para artículos emitidos principalmente por ubicaciones, la mayoría de las funciones de picking y embalaje pueden realizarse de la manera habitual. No es posible, sin embargo, seleccionar números de serie antes de crear el documento de entrega. Nota: las diferencias relativas a la creación de entregas también aplican a la creación de facturas.

---

## Diapositiva 23

Por último, revisaremos las principales diferencias en los procesos que involucran números de lote en lugar de números de serie. También examinaremos un escenario para trabajar con Lotes usando el método de asignación FIFO. Agenda: Ejemplo de negocio / Proceso de compras / Proceso de ventas / Diferencias en Lotes.

---

## Diapositiva 24

Los procesos de compra y venta para artículos administrados por lote en un almacén con ubicaciones son similares a los de artículos administrados por número de serie. En esta sección revisaremos algunas diferencias. Diferencia 1: para artículos administrados por lote, se usa la columna Primera Ubicación en lugar de la columna Ubicación de Almacén, ya que un número de lote representa un grupo de artículos y no un único artículo como en los números de serie. Al elegir la flecha de enlace de la Primera Ubicación, se abre la Lista de Contenido de Ubicaciones filtrada por el lote elegido. Diferencia 2: como un lote puede estar almacenado en múltiples ubicaciones, en la ventana Configuración de Lote (así como en las ventanas de Completar y Actualizar Lote), la selección del lote se realiza a través de la ventana Asignación de Ubicación – Recepción. En la ventana Configuración de Lote, la flecha de enlace en el campo Ubicación abre la ventana Asignación de Ubicación – Recepción.

---

## Diapositiva 25

La última diferencia que se trata en esta formación es la opción de reasignación en la ventana de configuración. La opción de reasignación vista anteriormente en la ventana Configuración de Número de Serie no existe en la ventana Configuración de Lote. La razón principal es que, a diferencia de los números de serie (donde cada artículo comprado tiene su propio número), pocos números de lote suelen estar asociados a grandes cantidades de artículos. Por ejemplo, en OEC Computers, el artículo "Etiqueta de Impresora" está administrado por lote. Las etiquetas se compran en docenas pero cada lote de 10 unidades tiene un número de lote. Por eso, en el ejemplo mostrado, solo hay cinco filas en la cuadrícula Lotes Creados y la función de reasignación es redundante.

---

## Diapositiva 26

En algunos casos, al trabajar con artículos administrados por lote, es necesario recoger artículos por ambos métodos de emisión: primero por ubicación y primero por número de lote. Por eso, también existe una columna Primera Ubicación en la tabla de Lotes Disponibles en la ventana Selección de Número de Lote, incluso para artículos en los que se selecciona principalmente por lote y número de serie. La columna Primera Ubicación también está disponible en el Pedido de Venta. Nota: esta columna no es visible por defecto.

---

## Diapositiva 27

En el curso de Procesos de Asignación en Ubicaciones de Almacén, conocimos los métodos de asignación automática FIFO y LIFO para transacciones de salida. Las empresas que trabajan principalmente con artículos administrados por número de lote pueden encontrar estos métodos muy útiles. Si la política de la empresa es emitir primero los artículos más antiguos, una buena solución es usar el método FIFO. En el método FIFO, los artículos se asignan según la fecha de entrada del artículo en la ubicación por lote o número de serie. Examinemos el escenario del ejemplo: el artículo A está almacenado en dos ubicaciones. Ubic_1 contiene dos lotes: lote_a y lote_b. Ubic_2 contiene lote_c. Necesitamos emitir 2.000 unidades del artículo A usando el método FIFO. El sistema busca el lote con la fecha de entrada más antigua, que es lote_b (1 de mayo). Luego busca el siguiente con la fecha más antigua: lote_c (1 de junio), que está en Ubic_2. Aunque lote_a está en la misma ubicación que lote_b, el sistema sabe cómo rastrear el lote específico.

---

## Diapositiva 28

Puntos clave de esta formación: En la asignación de entradas, cuando el método de gestión del número de serie o lote está configurado como "En Cada Transacción", las ubicaciones solo pueden asignarse en la ventana Configuración de Número de Serie. Para agilizar el proceso de recepción de artículos con número de serie o lote, primero puedes asignar toda la cantidad a una ubicación y luego reasignar a diferentes ubicaciones usando la ventana Reasignación de Ubicación. En el Maestro de Artículos, define el método "Emisión Principalmente por": ubicaciones o números de serie y lote. Elige el segundo método si necesitas seleccionar un número de serie o lote específico. Cuando el método de emisión está configurado como "Principalmente por Ubicaciones", no puedes asignar números de serie o lote en un pedido de venta; solo posteriormente en una entrega o factura.

---

## Diapositiva 29

La misma regla aplica en el proceso de Picking y Embalaje: la selección de números de serie o lote solo está disponible cuando el método de emisión está configurado como "Principalmente por Números de Serie y Lote". El método de emisión también afecta la generación de listas de picking y los procedimientos de trabajo en el Asistente de Picking, Embalaje y Producción. Al trabajar con números de lote, ya que un lote contiene varios artículos, en lugar del campo Ubicación se muestra la Primera Ubicación que indica dónde se asignó el primer artículo del lote. Al elegir la flecha de enlace de la Primera Ubicación en un documento, se abre la Lista de Contenido de Ubicaciones filtrada por el lote elegido. En el método de emisión FIFO, los artículos se asignan según la fecha de entrada del artículo en la ubicación por lote o número de serie (no solo por ubicación). Este método ayuda a liberar primero los lotes más antiguos.

---

## Diapositiva 30

Aviso legal SAP — sin cambios respecto al documento original.

---
