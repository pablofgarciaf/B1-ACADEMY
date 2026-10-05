# Transcripción por Diapositiva: 10_Production_41_Process_BasicProductionProcess_ES

## Diapositiva 1

PUBLIC Producción y MRP: Proceso de producción básico SAP Business One Versión 10.0 Le damos la bienvenida al tema de formación Proceso de producción básico. Para hacer este curso se recomienda completar antes el tema Lista de materiales. 1

---

## Diapositiva 2

Al finalizar este tema, podrá:  Añadir una orden de producción  Completar un proceso de producción básico 2 PUBLIC Al finalizar este tema, podrá:  Añadir una orden de producción  Completar un proceso de producción básico Objetivos

---

## Diapositiva 3

3 PUBLIC El concepto de proceso de producción Crear la orden de producción Enviar a la planta de producción Enviar componentes y recursos Informar de la finalización El proceso de producción comienza con una Orden de producción. Es el documento principal del proceso de producción.  En él se registra el progreso del proceso de producción de cada artículo que se produce. Antes de empezar a trabajar, el estado Orden de producción se debe cambiar a Liberado.  En ese momento, la orden de producción puede empezar a recopilar los costes de producción. Los componentes que se utilizan en el proceso de producción pueden enviarse a la planta de producción (dependiendo del método de envío). Cuando el trabajo está completado, informa de la finalización en la orden de producción.  En ese momento, los artículos terminados se reciben en el almacén Tenga en cuenta que cuando se selecciona el método automático para enviar componentes a la planta de producción, los componentes y los recursos se declaran como emitidos en cuanto se informe de la finalización. Cuando acaba el proceso de producción se cierra la orden de producción. El hecho de cerrarla crea un asiento para saldar las cuentas de inventario en las empresas que utilizan un inventario permanente. En las siguientes diapositivas veremos en más detalle la orden de producción y el proceso de producción. 3

---

## Diapositiva 4

4 PUBLIC El concepto de orden de producción Orden de producción Orden de producción: Puerta decorativa de madera x 6 Fecha de vencimiento: 31.09.20XX Artículo: Puerta de madera Artículo: Pomo Recurso: Operario de la máquina Recurso: Torno La orden de producción es una orden para producir o reparar un artículo de producción. Una lista de materiales (LdM) se copia en el documento Orden de producción. A continuación, se introduce la cantidad necesaria del artículo terminado junto con la fecha de vencimiento de la orden de producción deseada y otros datos relevantes. La orden de producción también sirve para hacer el seguimiento de todas las transacciones de materiales y costes que existen en el proceso de producción. Tenga en cuenta que las órdenes de producción también se pueden generar en los procesos de planificación de la necesidad material y de picking, embalaje y producción. Estos aspectos se explican más detalladamente en los temas sobre la planificación de necesidad de material y picking, embalaje y producción. 4

---

## Diapositiva 5

5 PUBLIC Orden de producción: información de cabecera Una vez que seleccione el artículo de la lista de materiales, todos los datos de los datos maestros de la lista de materiales se copian en la orden de producción. →Indicar la cantidad planificada para la producción. →Utilizar el campo de prioridad para determinar manualmente la prioridad de esta orden de producción. →Introducir las fechas de inicio y fin de la producción. Esta es la cabecera de una orden de producción para la LMat (lista de materiales) de una puerta de madera decorativa. Cuando se selecciona el artículo que hay que fabricar en el campo Número de producto, los datos se copian del documento de lista de materiales a la orden de producción. En el encabezado del documento, en el campo Cantidad planificada, el jefe de producción ha indicado que desea fabricar 10 puertas de madera decorativas. La cantidad base de los componentes en las filas se multiplica por la cantidad planificada. Utilice el campo de prioridad para determinar manualmente la prioridad de una orden de producción; por ejemplo, fije el valor 1 para obtener una prioridad más alta. De forma predeterminada, el valor se fija en 100. OC WoodTrend proporciona prioridades mayores a pedidos grandes. El campo prioridad se visualiza en la ventana picking, embalaje y producción y en el informe Lista de partidas abiertas. Al abrir una orden de producción, el estado de la orden se define como Planificado. Con este estado no es posible enviar componentes o informar sobre la finalización de la orden de producción. No obstante, sí que se pueden hacer cambios en los datos de la orden de producción. Más adelante, para poder seguir con el siguiente paso del proceso de producción, el jefe de producción cambia el estado a Liberado.. Observe las fechas en el lado derecho de la imagen. La fecha de pedido es la fecha en la que se contabilizó la orden de fabricación y la fecha de inicio y la fecha de fin son el rango de fecha planificado de este proceso de producción. Por defecto, la fecha de vencimiento es igual a la fecha de inicio + el ciclo de producción del artículo 5

---

## Diapositiva 6

fabricado, si es que existe. Este ciclo de producción se define en los datos maestros de artículo, en la ficha de planificación, y se utiliza en el proceso de fabricación y de planificación de la necesidad de material para definir el tiempo previsto de compra o producción de un artículo. La fecha de inicio puede ofrecer flexibilidad adicional al responsable de producción en la programación de órdenes de producción. Tenga en cuenta que la información de cabecera también se utiliza como base o valor por defecto en las líneas de orden de producción. Vamos a analizar las líneas de la orden de producción en la siguiente diapositiva. 5

---

## Diapositiva 7

6 PUBLIC Líneas de orden de producción →Los datos de línea se copian de la LMat y la cantidad planificada en las líneas se multiplica según la cantidad planificada en la cabecera. →Campo Tiempo de producción = tiempo de recurso total calculado en la línea cantidad planificada X tiempo de recurso. Cabecera Cantidad planificada = 10 Puede ver que los datos de esa línea también se han copiado a la orden de producción, aunque todavía se pueden realizar modificaciones. Utilice las flechas de la derecha para definir la secuencia correcta de las líneas o modifique los datos en las líneas. El campoTiempo de producción indica el tiempo de recurso total calculado en la línea. La Cantidad base se ha copiado de la LMat y la Cantidad planificada se calcula según la cantidad de cabecera planificada que el jefe de producción ha introducido. También existe un estado en el nivel de línea. El estado se puede ajustar manualmente. No se ve afectado por el estado en la cabecera y se utiliza únicamente para fines informativos. En las líneas también hay campos de fecha. Por defecto, la Fecha de inicio y las Fechas de vencimiento de las líneas se copian en la Fecha de inicio y en la Fecha de vencimiento del encabezado respectivamente. Cuando modifica una fecha en la cabecera, puede seleccionar aplicar las modificaciones en las filas. En este escenario básico, la puerta de madera decorativa se fabrica en un día para que la fecha de inicio y la fecha de fin sea la misma en todas las filas. En las siguientes diapositivas conocerá un escenario de varias de etapas de ruta en las que las fechas de inicio y de fin pueden variar en las distintas etapas. 6

---

## Diapositiva 8

Vamos a empezar con el proceso de producción de la puerta de madera decorativa. Una vez que se introduce la orden de producción, pasa lo siguiente: - La cantidad de los componentes del artículo de la orden de producción se resta de la cantidad disponible de los artículos y se convierte en una cantidad comprometida (como se puede ver en la ficha Datos maestros artículoInventario). - La capacidad de los recursos de la orden de producción se resta de la capacidad interna y se convierte en una capacidad comprometida (se puede encontrar más información sobre la capacidad de los recursos en el tema Capacidad de los recursos). El jefe de producción modifica el estado de la orden a Liberado para que empiece el proceso de producción. Una vez que el estado se ha definido como Liberado, podemos: enviar componentes (dependiendo del método de envío que se utilice) recibir el artículo producido en el inventario e informar sobre la finalización de la orden de producción. En ese punto todavía es posible añadir o modificar componentes y recursos que no se hayan enviado todavía. OC WoodTrend gestiona la zona de la planta de producción como un almacén aparte, por lo que el jefe de 7 7 PUBLIC Crear y enviar una orden de producción Enviar a la planta de producción Estado: Planificado Liberado Crear una orden de producción 

---

## Diapositiva 9

producción traslada los componentes del almacén principal a la planta de producción. Para hacerlo, crea un traslado de inventario utilizando el menú contextual de la orden de producción. 7

---

## Diapositiva 10

Una vez completado el proceso, el jefe de producción informa de la finalización de la producción. En el menú contextual, selecciona Recibo de producción. Al informar de la finalización, el sistema automáticamente: • Recibe el producto terminado en el inventario añadiendo un documento de recibo de producción. • Envía los componentes de toma retroactiva añadiendo un documento de salida para producción. • Calcula el coste de producir el artículo. Nota: También es posible enviar un documento de recibo de producción desde la entrada de menú Producción. 8 PUBLIC Informar de la finalización Cuando informa de la finalización, el sistema automáticamente:  Recibe el producto terminado en el inventario  Emite los componentes obtenidos mediante toma retroactiva.  Calcula el coste de producir el artículo Informar de la finalización  Seleccione el menú contextual de la orden de producción para informar de la finalización.  Otra opción es añadir un documento de recibo de producción

---

## Diapositiva 11

9 PUBLIC Modificaciones de inventario en el proceso de producción +   Indica un aumento en la cantidad - Indica una disminución en la cantidad En inventario - Comprom. + Solicitado = Disponible Finalización notificada Estado: Planificado Componentes Producto terminado Componentes Producto terminado + + + + - - - - En esta diapositiva se resumen los cambios que se han hecho en los datos de inventario durante el proceso de producción. Cuando se planifica el estado de producción, se crea un compromiso para los componentes, y la cantidad solicitada del artículo fabricado aumenta. Cuando se completa la orden de producción, los productos terminados se reciben en el inventario. Recuerde que los componentes se pueden enviar en diferentes etapas del proceso de producción en función de su método de envío (de forma manual o de toma retroactiva). Tenga en cuenta que es posible visualizar las modificaciones de inventario (y la contabilidad de costes) de cada componente por orden de producción, introduciendo el informe de desviación de la ficha Resumen de la orden. Para obtener más información sobre el informe de desviación consulte la formación Contabilidad de la producción.

---

## Diapositiva 12

Estos son algunos puntos clave acerca del proceso de producción de esta sesión:  La orden de producción se basa en la lista de materiales.  Una orden de producción está en estado de planificación hasta que el estado cambia a Liberado.  Cuando la orden de producción se envía a la planta de producción, es posible enviar los componentes (artículos y recursos) para la producción y el trabajo puede empezar.  Los componentes se envían cuando se añade un documento de Salida para producción.  Los componentes se pueden enviar utilizando el método manual o el método de toma retroactiva.  Con el método de toma retroactiva, cuando se crea un recibo de producción, los artículos se envían automáticamente a la producción.  El método de salida manual le permite enviar los componentes con precisión cuando se necesitan en el proceso de producción y también enviar una cantidad parcial si es necesario, incluso antes de informar de la finalización.  Cuando informa de la finalización, el sistema recibe automáticamente el producto terminado en el inventario y envía los componentes de toma retroactiva. 10 10 PUBLIC Resumen A continuación, se muestran algunos puntos clave sobre el proceso de producción:  La orden de producción se basa en la lista de materiales.  Una orden de producción está en estado de planificación hasta que el estado cambia a Liberado. Cuando la orden de producción se envía a la planta de producción, es posible enviar los componentes (artículos y recursos) para la producción y el trabajo puede empezar.  Los componentes se envían cuando se añade el documento Salida para producción.  Los componentes se pueden enviar utilizando el método manual o el método de toma retroactiva.  Con el método de toma retroactiva, cuando se crea un recibo de producción, los artículos se envían automáticamente a la producción.  El método de salida manual le permite enviar los componentes con precisión cuando se necesitan en el proceso de producción y también enviar una cantidad parcial si es necesario, incluso antes de informar de la finalización.  Cuando informa de la finalización, el sistema recibe automáticamente el producto terminado en el inventario y envía los componentes de toma retroactiva.

---

