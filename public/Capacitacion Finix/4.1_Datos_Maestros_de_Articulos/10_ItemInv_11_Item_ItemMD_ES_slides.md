# Transcripción por Diapositiva: 10_ItemInv_11_Item_ItemMD_ES

## Diapositiva 1

PUBLIC Artículos e inventario: Datos maestros de artículo SAP Business One Versión 10.0 Bienvenido al tema sobre los datos maestros del artículo. 1

---

## Diapositiva 2

En este tema exploraremos los contenidos del registro maestro de artículos. 2 PUBLIC © 2018 SAP SE or an SAP affiliate company. All rights reserved.  ǀ Al finalizar este tema, podrá:  Describir los contenidos del registro maestro de artículos Objetivos

---

## Diapositiva 3

Su empresa tiene una gran cantidad de artículos.  Para administrar mejor las necesidades del negocio diario, los artículos se establecen como registros de datos maestros. Los datos predeterminados para las transacciones de compra, venta e inventario se incluyen en los registros maestros de artículos. 3 3 PUBLIC © 2018 SAP SE or an SAP affiliate company. All rights reserved.  ǀ Escenario empresarial  Su empresa tiene una gran cantidad de artículos.  Para administrar mejor el negocio diario, los artículos se establecen como registros de datos maestros.  Los datos predeterminados para las transacciones de compra, venta e inventario se incluyen en los registros maestros de artículos.

---

## Diapositiva 4

SAP Business One le permite administrar todos los artículos que adquiere, fabrica, vende o mantiene en stock. La manera en la que definimos qué son estos artículos y cómo se manejan es mediante el registro de datos maestros de artículo. El registro de datos maestros de artículo se crea para cada producto y se identifica con un código único. Creará un dato maestro de artículo para un producto a nivel del código de un producto universal o un número de catálogo. Un dato maestro de artículo está en el centro de casi todos los procesos de SAP Business One. Controla cómo actúa el artículo en los módulos de ventas, compras, producción, MRP, inventario y servicio. Un dato maestro de artículo almacena información esencial tal como si el artículo se comprara o vendiera. La información incluye: el precio del artículo, el nivel de inventario, y cómo la compra de un artículo se prevé y planea. El sistema utiliza estos datos automáticamente en los procesos de compras, ventas, producción, gestión del almacén y contabilidad financiera. 4 PUBLIC © 2018 SAP SE or an SAP affiliate company. All rights reserved.  ǀ Datos maestros de artículo Datos maestros de artículo  Gestiona todos los artículos que compra, fabrica, vende o mantiene en stock  Se crea para cada producto  Se identifica con un código único  Almacena información esencial utilizada en varios procesos empresariales

---

## Diapositiva 5

Existe una regla importante para los datos maestros de artículo. Si un registro de datos maestros se usa en un documento de marketing o en una transacción contable o de inventario (por ejemplo, facturas de proveedores, facturas de deudores, asientos, etc.), no puede eliminarse. ¿Qué sucede con los artículos obsoletos? Quizás ya no desee vender un modelo de monitor en particular, pero como se incluyó en el stock y se vendió en el pasado no puede eliminarlo. ¿Qué puede hacer? En su lugar puede marcar el artículo como inactivo para que ya no pueda añadirse a los pedidos de clientes. La casilla inactiva también puede usarse para los productos que no están listos aún para las transacciones de compra y venta. Puede elegir excluir estos artículos inactivos desde los informes del sistema. Las opciones en la ventana Parametrizaciones generales le permiten seleccionar si visualizar artículos inactivos en informes y/o en los documentos de marketing. Más adelante, cuando archive los datos antiguos y estos artículos ya no tengan transacciones relacionadas a ellos en la base de datos, es posible eliminarlos por completo. 5 PUBLIC © 2018 SAP SE or an SAP affiliate company. All rights reserved.  ǀ Artículos inactivos  Los artículos que se utilizan en una transacción contable o de inventario no pueden eliminarse.  Los artículos pueden marcarse como inactivos  Los artículos inactivos no pueden añadirse a los pedidos de cliente  Los artículos inactivos pueden excluirse de informes  Es posible eliminar los artículos una vez archivadas las transacciones

---

## Diapositiva 6

Como con otros tipos de datos maestros, tales como los interlocutores comerciales, existen dos secciones principales en un registro maestro de artículo: la cabecera y las fichas. La cabecera contiene información general sobre el artículo. Se debe asignar un número de ID único como código. Las 9 fichas contienen más información detallada para procesar el artículo. 6 PUBLIC © 2018 SAP SE or an SAP affiliate company. All rights reserved.  ǀ Estructura del registro maestro de artículo Área general Número de artículo Descripción Descripción en idioma extranjero Clase de artículo Grupo de artículos Grupo de unidades de medida Lista de precios… Categorías del artículo Código de barras Precio por unidad General Compras Unidades de medida de compra Grupo aduanero Información fiscal Dimensiones … Ventas Unidad de medida de venta Unidad de medida de embalaje Dimensiones … Inventario Método de valoración Almacenes Cantidades en stock Coste de artículo … Planificación Método de planificación Adquisiciones Método Pedido Información Ciclo de producción … Propiedades Hasta 64 propied. de artículo distintas Comentarios Texto Fotografía Fabricante Clase de expedición Número de serie y Números de lote Válido/inactivo /adelantado con fechas … Datos maestros de artículo Anexos Archivos Producción Método de salida Tipos de listas de materiales Hoja de ruta Información Coste …

---

## Diapositiva 7

En la cabecera también se pueden asignar categorías de artículo. Las categorías de artículo controlan si ese artículo puede comprarse, venderse o almacenarse en el inventario. Un artículo puede pertenecer a múltiples categorías. Designar el artículo como un artículo de inventario significa que el artículo puede utilizarse en transacciones de inventario. De forma similar, marcar un artículo para la compra o ventas significa que el artículo puede comprarse o venderse en documentos de marketing. Si marca un artículo como de solo inventario, no podrá comprar o vender ese artículo. Tal vez tiene un artículo que nunca compra, en lugar de fabricar el artículo internamente y luego venderlo.  Este artículo estaría marcado para inventario y ventas. Un segundo ejemplo sería un servicio que vende. En este caso, el artículo estaría marcado solo para ventas y no para la compra o el inventario. Un tercer ejemplo podrían ser los gastos, como los suministros de oficina que compra para usar en su negocio. Podría seleccionar no recibir estos en el inventario porque se utilizan directamente luego de la compra. Este artículo luego podría ser un artículo de compra, pero no un artículo de inventario. 7 PUBLIC © 2018 SAP SE or an SAP affiliate company. All rights reserved.  ǀ Categorías del artículo Artículo de compra Artículo de compra Artículo de inventario Artículo de venta Artículo de inventario Artículo de venta Artículo de compra Artículo de inventario Artículo de venta Servicios para la venta: Gastos: Artículo de inventario que fabrica y vende:

---

## Diapositiva 8

Las fichas de datos de compra y datos de venta incluyen la información necesaria para usar ese artículo en los documentos de marketing. La ficha de datos de venta contiene información sobre las unidades de medida de ventas del artículo, las dimensiones del artículo de venta, los embalajes para ventas y los detalles de impuestos. De forma similar, la ficha de datos de compra incluye información sobre la unidad de medida de compra del artículo con sus dimensiones, embalajes y detalles del impuesto. Además, la ficha de datos de compra tiene información sobre los proveedores específicos y los números de catálogo del fabricante. Cuando crea un documento de marketing, la información relevante para el artículo se predetermina en el documento. Ambas fichas le ofrecen un vínculo para la realización de informes a través de iconos para el Análisis de ventas y el Análisis de compras para el artículo. 8 PUBLIC © 2018 SAP SE or an SAP affiliate company. All rights reserved.  ǀ Fichas de compras y ventas Información necesaria para documentos de marketing:  Unidades de medida  Dimensiones  Embalaje  Impuestos  Vínculos a los análisis  La ficha compras contiene adicionalmente:  Proveedores preferentes  Números de catálogo del fabricante

---

## Diapositiva 9

La ficha de datos de inventario muestra información actualizada de los niveles de stock y la demanda del artículo de cada almacén. Esta información se actualiza de manera dinámica para mostrar una imagen real en cualquier momento.  Se muestra una matriz:  La cantidad actual en stock  La cantidad comprometida, que es la cantidad que ordenaron los clientes  La cantidad solicitada que representa a cualquier cantidad solicitada por su empresa para la compra pero no entregada todavía o la cantidad de órdenes de producción para un artículo producido internamente.  Y en la última columna, muestra la cantidad disponible para los pedidos de cliente.  La cantidad disponible se calcula sumando las cantidades en stock y solicitadas, y luego restando todas las cantidades comprometidas. Puede fijar un almacén para que sea el almacén predeterminado para las transacciones.  Si no fija un valor predeterminado, el primero que aparece en la matriz será el predeterminado. Otros campos de esta etiqueta, como el método de valoración y la unidad de medida de inventario se tratan en detalle en los siguientes temas. 9 PUBLIC © 2018 SAP SE or an SAP affiliate company. All rights reserved.  ǀ Ficha de datos de inventario y niveles de stock En stock Comprometido Solicitado Disponible Nombre alm. Código alm. Almacén general Costa Este Costa Oeste Entrega directa La información de stock se actualiza de manera dinámica y se muestra en el registro maestro del artículo.

---

## Diapositiva 10

La ficha de datos de planificación contiene la información para planificar sus requisitos de inventario. En esta ficha, puede controlar si el artículo está considerado en la planificación de necesidades de materiales. Y si es relevante para la planificación, puede indicar si este es un artículo que se compra o fabrica internamente y fijar un plazo para calcular cuánto tiempo toma en reabastecer el artículo.  Los otros campos de esta ficha admiten los materiales del proceso de planificación de requisitos. 10 PUBLIC © 2018 SAP SE or an SAP affiliate company. All rights reserved.  ǀ Datos de planificación Número de artículo P1001 Descripción Impresora … Datos de planificación Método de planificación Plan.necesidades/Ninguno Método de aprovisionamiento Fabricar/Comprar Intervalo de pedido Semanal/Mensual/… Pedido múltiple 12 Ctd. pedido mínima 5 Ciclo de producción 10 días Datos maestros de artículo

---

## Diapositiva 11

11 PUBLIC © 2018 SAP SE or an SAP affiliate company. All rights reserved.  ǀ Ficha Datos de producción  Método de emisión: Toma retroactiva o manual  Información de la lista de materiales  Tipo de lista de materiales  Número de componentes  Número de recursos  Número de etapas de la hoja de ruta  Enlace para abrir una lista de materiales  Coste estándar de producción La ficha Datos de producción contiene información que se usa en la gestión del artículo durante la producción. Puede controlar cómo se emite el artículo a las órdenes de producción.  Si la posición se compone de una lista de materiales, hay disponible un enlace a la lista de materiales, así como un resumen que muestra el número de componentes, recursos y etapas de ruta. También tiene la opción de introducir la información de costes para la producción en esta ficha. 11

---

## Diapositiva 12

Las propiedades de artículo le brindan una forma de añadir más información sobre cómo este artículo se adapta al curso de negocio, territorios de ventas y objetivos de marketing de su empresa. En esta ficha puede clasificar el artículo con hasta 64 propiedades diferentes que puede usar para la realización de informes, fines de marketing y hasta para determinar la fijación de precios. Por ejemplo, un ordenador portátil determinado puede estar clasificado de acuerdo con el tipo de usuario (profesional, estudiante), condición (nuevo, renovado) y otras propiedades como el tamaño de pantalla, la marca del procesador, el rango de precio, la memoria del sistema, pantalla táctil o no, plataforma operativa y mucho más. 12 PUBLIC © 2018 SAP SE or an SAP affiliate company. All rights reserved.  ǀ Propiedades del artículo  Las propiedades de artículo añaden más información sobre cómo se adaptan los artículos a la empresa  64 propiedades disponibles para:  Informes  Objetivos de marketing  Determinación de precios

---

## Diapositiva 13

Los datos maestros de artículo controlan cómo actúa un artículo en los procesos comerciales. El sistema utiliza estos datos automáticamente en los procesos de compras, ventas, producción, gestión del almacén, servicio y contabilidad financiera. Un registro de datos maestros se utiliza en transacciones y no puede eliminarse hasta que estas transacciones se archiven, pero el artículo puede marcarse como inactivo. Las categorías de artículo controlan si ese artículo puede comprarse, venderse o almacenarse en el inventario. Un artículo puede pertenecer a múltiples categorías. Designar el artículo como un artículo de inventario significa que el artículo puede utilizarse en transacciones de inventario. De forma similar, marcar un artículo para la compra o ventas significa que el artículo puede comprarse o venderse en documentos de marketing. Si marca un artículo como de solo inventario, no podrá comprar o vender ese artículo. La ficha datos de inventario registra las cantidades en stock, comprometido, solicitado y disponibles para un artículo de inventario en cada almacén. La cantidad disponible es igual al total de las cantidades en stock y solicitadas menos la cantidad comprometida. 13 13 PUBLIC © 2018 SAP SE or an SAP affiliate company. All rights reserved.  ǀ Resumen A continuación, se detallan algunos puntos clave:  Los datos maestros de artículo controlan cómo actúa un artículo en los procesos comerciales. Los datos se utilizan automáticamente en procesos de compras, ventas, producción, gestión de almacén, servicio y contabilidad.  Un registro de datos maestros utilizado en transacciones no puede eliminarse, pero puede marcarse como inactivo.  Las categorías de artículo controlan si ese artículo puede comprarse, venderse o almacenarse en el inventario. Un artículo puede pertenecer a múltiples categorías.  La ficha datos de inventario registra las cantidades en stock, comprometido, solicitado y disponibles para un artículo de inventario.  Cantidad disponible = en stock + solicitada - comprometida.

---

