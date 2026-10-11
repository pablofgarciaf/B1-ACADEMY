# Transcripción por Diapositiva: 10_ItemInv_31_WM_WH_ES

## Diapositiva 1

PUBLIC Artículos e inventario: Almacenes SAP Business One Versión 10.0 Le damos la bienvenida al tema sobre almacenes de gestión de inventario. 1

---

## Diapositiva 2

En este tema, hablaremos sobre la importancia de los almacenes en los procesos comerciales. Crearemos un almacén y veremos las opciones disponibles.  Observaremos rápidamente cómo usar los depósitos para la gestión del almacén.  Luego observaremos cómo se pueden configurar almacenes virtuales para el proceso de entrega inmediata. 2 PUBLIC Al finalizar este tema, podrá:  Crear un almacén  Ver la estructura de depósito de un almacén  Describir el proceso de entrega inmediata Objetivos

---

## Diapositiva 3

Su empresa fabrica, compra y vende artículos almacenados en varios almacenes. Uno de los almacenes está controlado por los depósitos. Otro de los almacenes está físicamente ubicado en un proveedor para que este se represente como un almacén de entrega inmediata. Su negocio crece en una nueva región, por lo que crea un nuevo almacén regional para ampliar su distribución. 3 3 PUBLIC Escenario empresarial  Su empresa fabrica, compra y vende artículos almacenados en varios almacenes.  Uno de los almacenes está controlado por los depósitos.  Otro de los almacenes está físicamente ubicado en un proveedor para que este se represente en su sistema como un almacén de entrega inmediata.  El negocio crece en una nueva región, por lo que crea un nuevo almacén para ampliar su distribución.

---

## Diapositiva 4

Los documentos de los procesos de ventas y compras hacen referencia a un almacén siempre que incluyan artículos. Los documentos de inventario como la entrada de mercancías, el traslado de inventario y la salida de mercancías siempre hacen referencia a un almacén. Debido a que los almacenes son tan claves en cualquier proceso que involucre artículos, observaremos cómo se definen los almacenes y qué significan. 4 PUBLIC Almacenes y documentos Documentos de tipo artículo en los almacenes de referencia a procesos de compra y ventas La entrada de mercancías, el traslado de inventario y los documentos de salida de mercancías siempre incluyen almacenes. Pedido / Pedido de cliente Entrada de mercancías de pedido / Entrega Factura de proveedores / Factura de clientes

---

## Diapositiva 5

Un almacén representa una ubicación en donde las mercancías se almacenan. 5 PUBLIC Almacenes Almacén 01 Almacén general Almacén 02 Almacén regional Almacén 03 Almacén de entrega inmediata Almacén 05 Almacén administrado por ubicación Un almacén representa una ubicación en donde las mercancías se almacenan.

---

## Diapositiva 6

El primer paso para definir un almacén es introducir un código de almacén y un nombre de almacén. Luego debe especificar dónde está el almacén introduciendo la información de ubicación.  Esta información de ubicación es importante, porque generalmente la dirección del almacén asociada con la primera línea del documento se utiliza como la dirección de envío. La mayoría de los almacenes están creados para almacenar artículos físicamente, pero un almacén también puede definirse como almacén virtual para gestionar procesos empresariales en los que uno de sus vendedores entrega las mercancías directamente a sus clientes.  Llamamos a este almacén de entrega directa.  Si opta por establecer un almacén como un almacén de entrega directa, tendrá la opción adicional de gestionar números de serie y lotes en el almacén de entrega inmediata. Otra opción es si desea que este almacén se considere en la planificación de necesidades de materiales. Una tercera opción, nueva en 9.0, es la opción de usar ubicaciones de depósito como subniveles dentro de sus almacenes.  Esta opción no debería estar disponible si este es un almacén de entrega inmediata. Otros campos la información de impuestos pueden estar visibles dependiendo de la localización. 6 PUBLIC Definición de un almacén General Información de dirección Ubicación Entrega directa Compensable Almacén 02 Almacén regional Habilitar ubicaciones de depósito Mostrar ubicación en el explorador web

---

## Diapositiva 7

7 PUBLIC Ubicación de depósito en el almacén S1 S2 S3 A1 A2 A3 A4 L1 L2 L3 L1 L2 L3 L1 L2 L3 L1 L2 L3 S4 Almacén 05 Nivel de almacén Almacén Subnivel 1 - Isla Subnivel de almacén 2 - Estantería Almacén Subnivel 3 - Nivel Ubicación de depósito 05-A1-S1-L3 Una opción de mejorar la logística de los procesos de almacén es implementar la gestión de depósito. La gestión de depósito lo ayuda a mantener un registro de los artículos en un almacén por debajo de los depósitos físicos que almacenan los artículos. La gestión de depósito puede ayudarlo a optimizar el espacio de almacenamiento, localizar artículos rápidamente y planificar rutas eficientes para el picking. En nuestra situación de ejemplo, el Almacén 5 está gestionado con ubicaciones de depósito. El almacén está dividido en 4 niveles. El nivel superior es el almacén. Debajo del almacén, el primer subnivel está hecho de 4 islas: A1 a A4. Cada isla está hecha de 6 estanterías S1 a S6, y cada estantería tiene 3 niveles. El código de ubicación de depósito está hecho del código de almacén además de cada subnivel.  Aquí vemos que el tercer nivel de la estantería 1 en la isla 1 tiene un código de ubicación de depósito de 05-A1-S1-L3. 7

---

## Diapositiva 8

A continuación, se brinda una vista rápida de los procesos comerciales principales que muestran los pasos en el proceso que incluye depósitos.  Los depósitos están disponibles en todos los documentos que tienen movimientos de stocks. 8 PUBLIC Depósitos en procesos comerciales Proceso de ventas Proceso de compras Proceso de producción Pedido Entrada de mercancías de pedido Factura de proveedor Pago efectuado Pedido de cliente Entrega Factura de clientes Cobro Orden de producción Liberar piso de la tienda Salida de mercancías a la producción Entrada de mercancías a partir de la orden de producción

---

## Diapositiva 9

A veces, tiene productos que vende que usted no fabrica o almacena. En su lugar, la empresa sirve como un intermediario entre sus clientes y los proveedores.  En estas circunstancias, puede configurar un almacén de entrega inmediata. Cuando un cliente solicita un producto de un almacén de entrega inmediata, el sistema abre el asistente de confirmación de aprovisionamiento cuando graba el pedido del cliente. El asistente crea un pedido para el proveedor preferente del artículo. La dirección de envío del pedido es la dirección de envío del cliente en el pedido de cliente. Cuando el proveedor recibe el pedido, ellos envían el producto directamente al cliente. El proveedor le factura por el coste del producto y usted factura al cliente por el importe de venta. Con el proceso de entrega inmediata, no hay efecto en las cantidades o valores del inventario.  No se contabilizan movimientos de mercancías. No se realiza ningún asiento para reflejar cambios de valor de inventario.  Por consiguiente, el almacén de operaciones con terceros no está mostrado en los informes de inventario. Para establecer un almacén, marque la casilla de verificación Entrega inmediata.  Si le gustaría incluir la capacidad de rastrear números de serie o lotes en un envío inmediato, entonces marque también la casilla de verificación Gestión de números de serie y lotes. 9 PUBLIC Proceso de entrega inmediata General Información de dirección Ubicación Entrega directa x Gestionar números de serie y lotes Almacén 03 Almacén de entrega inmediata Pedido de cliente Pedido de compra Factura de proveedor Factura de clientes

---

## Diapositiva 10

Los almacenes se especifican en todos los documentos de inventario y en todos los documentos de venta y compra que incluyan artículos. La gestión de depósito puede ayudarlo a optimizar el espacio de almacenamiento, localizar artículos rápidamente y planificar rutas eficientes para el picking. El código de depósito consiste en el código de almacén además de cada subnivel. Los depósitos pueden especificarse en todos los documentos que tienen movimientos de inventario una vez que la gestión de depósito se active. Puede establecer un almacén de entrega inmediata para representar una ubicación de proveedor. Entonces, cuando graba un pedido de cliente con un producto desde el almacén de entrega inmediata, la confirmación de aprovisionamiento automáticamente sugiere la creación de un pedido al proveedor. Los artículos se envían directamente al cliente desde el proveedor. El proveedor le factura por el coste del producto y usted factura al cliente por el importe de venta. 10 10 PUBLIC Resumen A continuación, se detallan algunos puntos clave:  Los almacenes se especifican en todos los documentos de inventario y en todos los documentos de venta y compra que incluyan artículos.  La gestión de depósito puede utilizarse para optimizar el espacio de almacenamiento, localizar rápidamente los artículos y planificar las rutas de picking.  Un código de depósito consiste en el almacén además de cada subnivel.  Los depósitos pueden especificarse en todos los documentos que tienen movimientos de inventario una vez que la gestión de depósito se active.  Puede establecer un almacén de entrega inmediata para representar una ubicación de proveedor. Entonces, cuando grabe un pedido de cliente para ese almacén, entonces el asistente de aprovisionamiento le sugiere un pedido de compra al proveedor. Los artículos se envían directamente al cliente. El proveedor le factura a usted y usted le factura al cliente.

---

