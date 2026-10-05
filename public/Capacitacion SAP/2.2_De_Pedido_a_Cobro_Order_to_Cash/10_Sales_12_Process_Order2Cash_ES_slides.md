# Transcripción por Diapositiva: 10_Sales_12_Process_Order2Cash_ES

## Diapositiva 1

PUBLIC Ventas - clientes: Del pedido de cliente al cobro SAP Business One Versión 10.0 Bienvenido al tema del pedido del cliente al cobro. 1

---

## Diapositiva 2

En este tema, llevaremos a cabo los pasos del proceso de ventas desde el pedido al cobro.  A medida que creamos cada documento, describimos el efecto de cada paso en el inventario y la contabilidad. 2 PUBLIC Al finalizar este tema, podrá:  Llevar a cabo los pasos en el proceso de ventas desde el pedido del cliente al cobro  Describir el efecto que tiene cada paso en el inventario y la contabilidad Objetivos

---

## Diapositiva 3

Su empresa fijó que la satisfacción del cliente será la mayor prioridad y desea usar los procesos eficientes en ventas para garantizar que las demandas del cliente se puedan cumplir lo más rápido posible. Revisaremos el proceso de ventas desde el pedido al cobro prestando atención a la comprensión del impacto de cada paso para ver cómo podemos mejorar el proceso. 3 3 PUBLIC Escenario empresarial  Su empresa fijó que la satisfacción del cliente será la mayor prioridad y desea usar los procesos eficientes en ventas para garantizar que las demandas del cliente se puedan cumplir lo más rápido posible.  Revisaremos el proceso de ventas desde el pedido al cobro prestando atención a la comprensión del impacto de cada paso para ver cómo podemos mejorar el proceso.

---

## Diapositiva 4

El pedido de cliente es un documento importante, ya que avisa a todos que deben comenzar a trabajar para cumplir con el pedido. Como tal, este documento es importante para planificar la producción, crear pedidos y programar recursos.  Puede modificar un pedido de cliente (modificar las cantidades, actualizar los precios o descuentos, etc.) una vez que lo contabilice. Esto es posible siempre y cuando haya establecido las parametrizaciones correctas en Parametrizaciones de documento y el pedido del cliente aún este abierto.  Un pedido de cliente puede basarse en una o más ofertas de venta.  Una característica exclusiva de SAP Business One consiste en la posibilidad de crear pedidos directamente desde los pedidos de cliente, lo que optimiza la cadena de suministro y los procesos de planificación de los materiales necesarios. En SAP Business One, los pedidos de cliente afectan el nivel de stock disponible. Es decir, las cantidades de los pedidos reducen el stock disponible. Cuando introduce pedidos de cliente, las transacciones de inventario o los cambios basados en el valor no se contabilizan en el libro mayor, pero los artículos se añaden a la cantidad comprometida en el módulo de inventario. 4 PUBLIC Pedido de cliente Pedido de cliente Entrega Factura de clientes Cobro Características del pedido de cliente: Puede modificar un pedido de cliente una vez que lo haya contabilizado. Un pedido de cliente puede basarse en una o más ofertas de venta. Puede crear pedidos directamente desde los pedidos de cliente. El pedido de cliente no contabiliza las transacciones de inventario o los cambios basados en valores, pero los artículos se añaden a la cantidad comprometida en el módulo de inventario.

---

## Diapositiva 5

Imaginemos que nuestro cliente solicita 5 impresoras. En el pedido de cliente, introducimos el cliente, los artículos y la cantidad El sistema determina el precio automáticamente, en función de la lista de precios asignada. El vendedor ofrece un descuento al cliente, por lo que se indica un descuento manual del 1% en el pedido de cliente En función de las condiciones de pago, el cliente cumple los requisitos para recibir un descuento del 2% por pronto pago 5 PUBLIC Escenario de pedido de cliente  Nuestro cliente solicita 5 impresoras  En el pedido de cliente, introducimos el cliente, los artículos y la cantidad  El sistema determina el precio automáticamente  Se introduce un descuento manual del 1% en el pedido  El cliente también cumple los requisitos para recibir un descuento del 2% por pago adelantado Pedido de cliente Entrega Factura de clientes Cobro

---

## Diapositiva 6

Una entrega registra que las mercancías se enviaron. Este documento también suele denominarse documento de embalaje o nota de entrega. Puede crear una nota de entrega a partir de un pedido de cliente o una oferta de cliente. Para hacerlo, abra el pedido o la oferta de cliente y seleccione Entrega en la lista desplegable Copiar a. Si tiene varios pedidos de cliente para entregar a un cliente, abra una entrega vacía, añada el nombre de cliente y use la opción Copiar de para seleccionar a partir de una lista de pedidos y ofertas de clientes de ese cliente en particular. 6 PUBLIC Entrega Pedido de cliente Entrega Factura de clientes Cobro Características de entrega: Registra que las mercancías se enviaron. Se puede crear a partir de un pedido de cliente u oferta de ventas. Puede contener artículos de varios pedidos de cliente u ofertas

---

## Diapositiva 7

Añadir una entrega reduce los niveles de inventario reales. Cuando se contabiliza una entrega, también se contabiliza la salida de mercancías. Las mercancías abandonan el almacén, se reducen las cantidades de inventario y, si utiliza un inventario permanente, los cambios relevantes de inventario se contabilizan. Si la entrega está basada en un pedido de cliente, también se reducirá la cantidad comprometida de ese pedido. 7 PUBLIC Efecto de entrega Pedido de cliente Entrega Factura de clientes Cobro Añadir una entrega reduce los niveles de inventario. Si utiliza un inventario permanente, los cambios de inventario relevantes se contabilizan. Si la entrega está basada en un pedido de cliente, también se reduce la cantidad comprometida de ese pedido.

---

## Diapositiva 8

En nuestra situación de ejemplo, nuestro cliente solicitó 5 impresoras. Cuando es el momento, enviamos 5 impresoras al cliente. Se borra la cantidad de 5 impresoras del inventario. Se abona el coste del artículo a la cuenta de inventario. Se carga el coste de la cuenta de variación de existencias. 8 PUBLIC Escenario de entrega  Enviamos 5 impresoras al cliente  Se borra la cantidad de 5 impresoras del inventario  Se abona el coste del artículo a la cuenta de inventario  Se carga a la cuenta de variación de existencias Pedido de cliente Entrega Factura de clientes Cobro

---

## Diapositiva 9

Si utiliza un inventario permanente, el sistema crea un asiento automáticamente. El asiento contabiliza el valor del coste del artículo actual en la columna del Debe de la cuenta de gastos (tales como el coste de la mercancía vendida) y en la columna del Haber de la cuenta de existencias. La cuenta de existencias y la cuenta de gastos se recuperan a partir del campo Cuenta de existencias y el campo Cuenta de costes de la ficha Inventario del registro maestro de artículos. La cantidad del stock se ve siempre afectada, utilice o no un inventario permanente. 9 PUBLIC Entregas y contabilidad Artículo de compra Artículo de inventario Artículo de venta 100 100 Cuenta de existencias Cuenta de gastos Pedido de cliente Entrega Factura de clientes Si utiliza un inventario permanente, la entrega crea un asiento automáticamente. Las cuentas de stock y de costes se recuperan desde los campos de la ficha Inventario del registro maestro de artículo.

---

## Diapositiva 10

Una factura de clientes es una solicitud de pago. La contabilización de una factura de clientes registra los ingresos en la cuenta de pérdidas y ganancias. Una vez añadida, la factura de clientes crea automáticamente la contabilización del asiento en las cuentas de cliente y de ingresos correspondientes. 10 PUBLIC Factura de clientes Pedido de cliente Entrega Factura de clientes Cobro  La factura de clientes representa una solicitud de pago.  La contabilización de una factura de clientes registra los ingresos en la cuenta de pérdidas y ganancias.  Una vez añadida, la factura de clientes crea automáticamente la contabilización del asiento en las cuentas de cliente y de ingresos.

---

## Diapositiva 11

En nuestra situación de ejemplo, hemos entregado 5 impresoras a nuestro cliente. Ahora realizamos la factura de las impresoras para nuestro cliente. El importe total se redujo en un 1% de descuento que introdujo el vendedor manualmente. La fecha de vencimiento se basa en las condiciones de pago del cliente.  Estas condiciones de pago también incluyen un descuento del 2% por pago adelantado. Cuando se añade la factura de clientes, se crea automáticamente un asiento para registrar el Haber en los ingresos y el Debe en la cuenta del cliente. 11 PUBLIC Escenario de factura de clientes Realizamos la factura de las 5 impresoras para nuestro cliente El importe total incluye el descuento manual del 1% La fecha de vencimiento se basa en las condiciones de pago del cliente Se crea un asiento para registrar lo siguiente:  el Haber en los ingresos  al Debe de la cuenta del cliente Pedido de cliente Entrega Factura de clientes Cobro

---

## Diapositiva 12

Aquí vemos los asientos realizados en un sistema de inventario permanente para artículos de inventario. Anteriormente vimos que la entrega crea un asiento asociado con la venta de mercancías y la reducción en el valor del inventario. Una factura de clientes registra lo que debe el cliente y los ingresos que derivan de la venta. Es posible que existan contabilizaciones adicionales para los impuestos o ingresos y gastos adicionales. 12 PUBLIC Contabilizaciones del proceso de ventas de artículos de inventario Artículo de compra Artículo de inventario Artículo de venta Ingresos por ventas Cliente 500 500 Pedido de cliente Entrega Factura de clientes 100 100 Cuenta de existencias Cuenta de gastos

---

## Diapositiva 13

Una vez que se realiza el asiento, no puede modificarse, solo anularse. La previsualización del asiento le permite simular los asientos antes de que realmente ocurran en la base de datos. Esto puede ser útil si crea una factura de cliente con circunstancias especiales y desea comprobar el asiento antes de contabilizar la factura.  También es útil para capacitar a los nuevos empleados o probar las parametrizaciones durante una implementación.  La función está disponible para todos los documentos que crean contabilizaciones de asiento. Seleccione el icono Previsualización de asiento para ver de forma instantánea lo que sucede cuando contabiliza el documento. La simulación incluye cuentas de libro mayor y la distribución del Centro de coste. 13 PUBLIC Previsualización de asiento Ingresos p/ ventas Cliente 500 500 100 100 Cuenta de existencias Cuenta de gastos . La previsualización del asiento le permite simular los asientos antes de que se contabilicen. Previsualización de asiento 100 100 Cuenta de existencias Cuenta de gastos

---

## Diapositiva 14

Los cobros representan el último paso del proceso básico de ventas, a pesar de que son una función en el módulo Gestión de bancos. Al contabilizar un cobro, se recibe el pago del cliente.  Los pagos de clientes pueden procesarse para transferencias bancarias, cheques, tarjetas de crédito y efectivo. En algunas localizaciones, también puede utilizarse una letra de cambio. Cuando se añade el cobro, se crea un asiento que acredita el importe de la cuenta del cliente para el pago.  Según el medio de pago, se debitará de la cuenta de mayor correspondiente (por ejemplo, una de nuestras cuentas bancarias). Si se aplica un descuento por pago adelantado, se realizará un débito en la cuenta de descuento. Cuando crea un cobro para borrar (total o parcialmente) un documento o una transacción, la reconciliación interna ocurre automáticamente, lo que significa que la factura del cliente y el pago coinciden en el sistema. Además, el asistente de pago se puede usar para procesar tanto los cobros como los pagos efectuados.  También se pueden recibir pagos automáticamente desde una transferencia bancaria mediante el proceso de transferencia bancaria en diversas localizaciones. 14 PUBLIC Cobro Pedido de cliente Entrega Factura de clientes Cobro Los cobros representan el último paso del proceso básico de ventas, a pesar de que son una función en Gestión de bancos. Los pagos de clientes pueden procesarse para transferencias bancarias, cheques, tarjetas de crédito y efectivo. En algunas localizaciones, también puede utilizarse una letra de cambio. Cuando se añade el pago, se crea un asiento de forma automática.

---

## Diapositiva 15

Consideremos la situación de ejemplo. El cliente paga la factura a tiempo por las 5 impresoras El importe total incluye el descuento manual del 1% y el descuento del 2% por pronto pago.  El descuento por pronto pago aparece por defecto en las condiciones de pago asociadas al registro maestro de clientes. Se crea un asiento para registrar lo siguiente:  el Debe de la cuenta bancaria local, o una cuenta de compensación dependiendo de las condiciones de pago seleccionadas, y para las cuentas con descuento  y el Haber en la cuenta del cliente 15 PUBLIC Pedido de cliente Entrega Factura de clientes Cobro Escenario de cobro El cliente paga la factura a tiempo por las 5 impresoras. El importe total incluye el descuento manual del 1% y el descuento del 2% por pronto pago. Se crea un asiento para registrar lo siguiente: el Debe de la cuenta bancaria local y de las cuentas de descuentos el Haber en la cuenta del cliente

---

## Diapositiva 16

Los pedidos de cliente incluyen la información básica para realizar el pedido, entregar mercancías y facturar al cliente.  Un pedido de cliente no tiene efecto en la contabilidad. Los pedidos del cliente pueden modificarse luego de la contabilización siempre y cuando se lleven a cabo las parametrizaciones correctas y el pedido aún esté abierto. Una entrega indica que las mercancías se enviaron y reduce los niveles de inventario. Si ejecuta un inventario permanente, contabilizar una entrega debita el coste del artículo actual y acredita la cuenta de stock de inventario. Una factura de clientes es una solicitud de pago.  Cuando uno se contabiliza una factura de cliente, un asiento contabiliza un débito a la cuenta del cliente y un crédito a los ingresos de ventas y todas las cuentas de impuestos. Puede previsualizar los asientos antes de que se contabilicen. Los cobros representan el último paso del proceso básico de ventas, a pesar de que son una función en Gestión de bancos. 16 16 PUBLIC Resumen A continuación, se detallan algunos puntos clave:  Los pedidos de cliente incluyen información para realizar el pedido, entregar mercancías y facturar al cliente. No tienen efecto en la contabilidad.  Los pedidos del cliente pueden modificarse luego de la contabilización siempre y cuando se lleven a cabo las parametrizaciones correctas y el pedido aún esté abierto.  Una entrega indica que las mercancías se enviaron y reduce los niveles de inventario.  En el inventario permanente, contabilizar una entrega debita el coste del artículo actual y acredita la cuenta de stock de inventario.  Una factura de clientes es una solicitud de pago.  Cuando uno se contabiliza, un asiento contabiliza un débito a la cuenta del cliente y un crédito a los ingresos de ventas y todas las cuentas de impuestos.  Puede previsualizar los asientos antes de que se contabilicen.  Los cobros representan el último paso del proceso de ventas, a pesar de que son una función en Gestión de bancos.

---

