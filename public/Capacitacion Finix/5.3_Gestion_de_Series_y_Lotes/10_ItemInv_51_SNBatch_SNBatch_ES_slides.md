# Transcripción por Diapositiva: mal 10_ItemInv_51_SNBatch_SNBatch_ES

## Diapositiva 1

PUBLIC Artículos e inventario: Números de serie y lotes SAP Business One Versión 10.0 Le damos la bienvenida al resumen del tema sobre números de serie y lotes. 1

---

## Diapositiva 2

 En este tema, exploraremos dos de los métodos para rastrear artículos que compra, fabrica o vende: Números de serie y lotes.  Observaremos cómo crear y usar artículos gestionados por lotes.  Observaremos cómo crear artículos y usar artículos gestionados por números de serie. Al finalizar este tema, podrá:  Enumerar los motivos comerciales por los que se utilizan los números de serie y lotes  Crear y usar artículos gestionados por lotes  Crear y usar un artículo gestionado por números de serie Objetivos

---

## Diapositiva 3

Imagine que: Su empresa desea rastrear los artículos que fabrican, compran y venden más de cerca en todo su ciclo de vida. Algunos de los artículos más costosos, tales como ordenadores portátiles y de sobremesa, se gestionan por números de serie.  Cada ordenador portátil o de sobremesa tiene un número de serie para que pueda fácilmente hacer un seguimiento de las ventas y servicios de ese ordenador portátil o de sobremesa en particular. Otros artículos, tales como cartuchos de impresora, se compran y se manejan en lotes para hacer un seguimiento de las fechas de vencimiento. 3 Escenario empresarial  Su empresa desea rastrear los artículos que fabrican, compran y venden más de cerca en todo el ciclo de vida de cada artículo.  Algunos de los artículos, como los ordenadores, se gestionan por números de serie.  Cada ordenador individual tiene un número de serie para rastrear ventas y servicios para ese artículo.  Otros artículos, tales como cartuchos de impresora, se compran y se manejan en lotes para hacer un seguimiento de las fechas de vencimiento.

---

## Diapositiva 4

Los números de serie pueden ayudarlo a realizar el seguimiento de artículos a nivel de cada objeto individual, en su almacén, para que sepa exactamente cuál se ha vendido a un cliente. Los números de serie también son muy útiles para realizar un seguimiento del historial de servicio para la compra de un cliente. Aquí hay dos criterios que pueden utilizarse para decidir si un artículo debe serializarse:  El artículo, ¿es de alto valor?  ¿Es necesario realizar un seguimiento del artículo por razones de seguridad o para repararlo?  Si la respuesta a ambas preguntas es sí, entonces el artículo es un buen candidato para los números de serie. Números de serie Números de serie  Se utilizan para realizar el seguimiento de obj. individuales.

---

## Diapositiva 5

En cambio, los lotes se usan para realizar un seguimiento de la cantidad de un artículo con características en común. Estas características pueden ser atributos que usted defina, como la degradación de color, la granularidad o la compensación de PH. O bien, se puede tratar de fechas, como la fecha de vencimiento, la fecha de producción o la fecha de recepción de los artículos en el inventario. Un buen ejemplo de artículo gestionado por lote es la leche. Cada lote de leche tiene fecha de vencimiento.  Es muy importante realizar un seguimiento de esta fecha y asegurarse de que la leche se venda antes de la fecha de vencimiento. Números de serie y lotes Números de serie  Se utilizan para realizar el seguimiento de obj. individuales. Lotes  Se utilizan para realizar el seguimiento de grupos de artículos que tienen características en común.

---

## Diapositiva 6

Existe la opción de definir los números de serie o de lote para que se asignen en cada transacción o cuando el artículo se emite por primera vez. Esto se controla por el campo "Método de gestión" en el registro maestro de materiales. Las dos opciones se llaman "en toda transacción" y "solo en salida". Método de gestión Sólo en salida Opcional en documentos de entrada En cada transacción

---

## Diapositiva 7

Si elige “en cada transacción” entonces debe asignar atributos de números de serie para cada unidad apenas se registre en el inventario. En lo sucesivo, el sistema le solicitará un número de serie para cada transacción en la que el artículo salga o se devuelva al inventario. De esta manera sabe exactamente cuáles son los objetos que están en el inventario y los que se han enviado al cliente. Este método es útil cuando necesita realizar un seguimiento de los objetos individuales en todo momento, y donde el personal que recibe los objetos cuenta con la información necesaria en el momento en el que se reciben las unidades. Cuando recibe por primera vez los artículos serializados en el stock, puede elegir la opción de introducir los números de serie manualmente o crearlos automáticamente usando un conjunto de números de serie de su elección. En cada transacción En cada transacción Sólo en salida Opcional en documentos de entrada

---

## Diapositiva 8

“Sólo en salida” significa que los números de serie se necesitan sólo en documentos que emiten un artículo de un almacén. Los documentos de salida no sólo incluyen: la salida de mercancías, la entrega, las facturas de clientes y las salidas de mercancías de la producción, así como también las transferencias de inventario entre almacenes y los documentos de devoluciones y abonos. Al utilizar “Sólo en salida” en el momento de la compra, no hay necesidad de indicar atributos de números de serie. Sin embargo, cuando elimine el artículo del inventario, los números de serie de estos objetos deben crearse primero usando la ventana de Gestión de artículos de serie. Una opción alternativa es elegir "creación de números automática en entrada”.  Cuando compra el artículo serializado, el sistema crea automáticamente números de serie numéricos para la cantidad que ha comprado.  Con esta opción, puede poner inmediatamente en circulación estos objetos sin operaciones adicionales.  Puede actualizar los atributos de números de serie en una etapa posterior, utilizando la ventana de Gestión de artículos de serie.  Esto es especialmente útil cuando se produce o compra una gran cantidad. ¿Por qué elegiría "sólo en salida"? Un ejemplo podría ser si fabrica un artículo y desea sacarlo del inventario sin un número de serie.  De esta manera, puede esperar para asignar el número de serie hasta que el artículo se entregue.  "Sólo en salida" le brinda la flexibilidad de no preocuparse por los números de serie dentro del almacén. Sólo envíos Sólo en salida Opcional en documentos de entrada En cada transacción

---

## Diapositiva 9

A diferencia de los documentos de emisión que emiten stock del inventario, la información de serie y lote siempre es opcional en los pedidos de cliente, porque los pedidos de cliente no tienen efecto en el inventario, salvo que creen un compromiso.  Si desea que este compromiso capture información sobre un artículo serializado específico o que especifique un lote a venderse, entonces puede hacerlo en el pedido de cliente. Anular los números de serie o lotes específicos al momento del pedido de cliente permite una mejor planificación de control e inventario.  Tal vez, usted fabrica ordenadores personalizados como pedidos especiales para sus clientes.  En ese caso, es posible que desee designar un número de serie en el pedido de ventas que seguirá la computadora por el proceso de personalización hasta la entrega. Esta asignación opcional también es posible en una solicitud de traslado de inventario o una factura de reserva del cliente. Asignación opcional Crear pedido de cliente Asignar o revisar los detalles del número de serie

---

## Diapositiva 10

Una vez que han asignado el número de serie en el pedido de cliente, la información de serie se copiará a los documentos destino para picking, entrega o facturación. Luego de que el número de serie se asigna a un pedido de cliente, no puede seleccionarlo para otro documento, sin cancelar la asignación del número de serie en el documento original. Cerrar o cancelar el pedido de cliente automáticamente cancela su asignación de número de serie. Cuando copia el pedido de venta a un documento destino, como una entrega, la ventana del número de serie se abrirá automáticamente para que pueda confirmar que este es el número de serie que desea usar o que puede actualizarlo con un nuevo número de serie. Sin embargo, una vez que el artículo serializado deja el almacén en un documento de entrega, ya no puede ver o cambiar los números de serie en una factura de cliente.  Si un abono se crea, entonces podrá ver la ventana del número de serie para confirmar o actualizar los números de serie. Asignación opcional Crear pedido de cliente Asignar o revisar los detalles del número de serie Si la factura hace referencia a una entrega, entonces ya no puede modificar los números de serie. La entrega incluye el número de serie

---

## Diapositiva 11

Los números de serie rastrean cada unidad individual de un artículo. Los lotes sirven para realizar el seguimiento de una cantidad de un artículo con características en común. Existe la opción de definir los números de serie o de lote para que se asignen en cada transacción o cuando el artículo se emite por primera vez. El método de gestión “en cada transacción” exige que debe asignar atributos de números de serie para cada unidad apenas se registre en el inventario. “Sólo en salida” significa que los números de serie se necesitan sólo en documentos que emiten un artículo de un almacén. De forma opcional, puede asignar información de serie y lotes en los pedidos de cliente, solicitudes de traslado de inventario y facturas de reserva de proveedores. 11 Resumen A continuación, se detallan algunos puntos clave:  Los números de serie rastrean cada unidad individual de un artículo.  Los lotes sirven para realizar el seguimiento de una cantidad de un artículo con características en común.  Existe la opción de definir los números de serie o de lote para que se asignen en cada transacción o cuando el artículo se emite por primera vez.  El método de gestión “en cada transacción” exige que debe asignar atributos de números de serie para cada unidad apenas se registre en el inventario.  “Sólo en salida” significa que los números de serie se necesitan sólo en documentos que emiten un artículo de un almacén.  De forma opcional, puede asignar información de serie y lotes en los pedidos de cliente, solicitudes de traslado de inventario y facturas de reserva de proveedores.

---

