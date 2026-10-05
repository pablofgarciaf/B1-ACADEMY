# Transcripción por Diapositiva: 10_Sales_21_Cust_Customers_ES

## Diapositiva 1

PUBLIC Ventas - clientes: Clientes y grupos de clientes SAP Business One Versión 10.0 Bienvenido al tema sobre clientes y grupos de clientes. 1

---

## Diapositiva 2

En este tema, definiremos un nuevo grupo de clientes y un nuevo cliente que pertenece a este grupo. Crearemos un cliente potencial y luego convertiremos el cliente potencial en cliente. 2 PUBLIC Al finalizar este tema, podrá:  Definir un grupo de clientes  Crear un nuevo cliente  Crear un cliente potencial  Convertir un cliente potencial en un cliente Objetivos

---

## Diapositiva 3

Usted tiene una campaña publicitaria centrada en atraer escuelas locales como nuevos clientes. Cree un nuevo grupo de clientes para gestionar la determinación especial de precios y las condiciones de pago para las escuelas. Usar el grupo de cliente ayuda a simplificar el proceso de creación de clientes potenciales y clientes, así como también facilita una mejor realización de informes. 3 3 PUBLIC Escenario empresarial  Usted tiene una campaña publicitaria centrada en atraer escuelas locales como nuevos clientes.  Cree un nuevo grupo de clientes para gestionar la determinación especial de precios y las condiciones de pago para las escuelas.  Usar el grupo de cliente ayuda a simplificar el proceso de creación de clientes y facilita una mejor realización de informes.

---

## Diapositiva 4

Dos tipos de interlocutores comerciales se utilizan en el proceso de ventas: clientes potenciales y clientes. Puede comenzar el proceso con el tipo de interlocutor comercial maestro: cliente potencial.  Un cliente potencial describe a las personas y organizaciones en el pipeline de ventas, es decir, los clientes potenciales. Los registros maestros de datos de clientes potenciales se utilizan como base para las ventas y el marketing. Cuando realiza la primera venta a un cliente potencial, cambia la clase de interlocutor comercial a cliente, lo que convierte al cliente potencial en un cliente real. Un pedido de un cliente puede tener asignado a un cliente o a un cliente potencial. Una vez que pasa a la entrega, debe tener un cliente. La información sobre los clientes potenciales y clientes se conserva en los registros maestros del interlocutor comercial. Mantener los datos maestros centralmente para los interlocutores comerciales le permite almacenar toda la información necesaria para ventas, reducir la duplicación y evitar los errores de registro de datos. 4 PUBLIC Interlocutores comerciales  Dos tipos de interlocutores comerciales se utilizan en el proceso de ventas:  Clientes potenciales  Clientes  Cuando realiza la primera venta, cambia la clase de interlocutor comercial a cliente  Los pedidos de cliente pueden tener clientes o clientes potenciales.  Las entregas deben tener clientes.

---

## Diapositiva 5

Nos interesan los clientes potenciales y clientes utilizados en el proceso de ventas, pero existe también otro registro maestro de interlocutores comerciales, el registro maestro de proveedores, el cual utiliza en las compras.  La razón por la que se menciona aquí es debido a que los datos para estos tres tipos de registros maestros de datos son muy similares. Por lo tanto, SAP Business One usa ventanas con una estructura común para los tres tipos de datos maestros: cliente, cliente potencial y proveedor. El registro maestro del interlocutor comercial incluye detalles de la empresa como las direcciones y números de teléfono, las personas de contacto empresarial, detalles de logística, información de impuestos, información contable, así como también enlaces a los saldos de cuentas y realización de informes. 5 PUBLIC Datos maestros de interlocutor comercial  Estructura común para todos los interlocutores comerciales:  Cliente  Cliente potencial  Proveedor  Vincular al saldo de cuenta  Realización de informes disponible directamente del registro maestro

---

## Diapositiva 6

Los clientes y los clientes potenciales tienen múltiples direcciones de facturación y envío almacenadas en el registro maestro de interlocutores comerciales. Puede fijar una dirección de facturación y una dirección de envío como predeterminadas. Además, tiene direcciones para todas las personas de contacto del interlocutor comercial. Las direcciones se copian automáticamente desde el registro maestro de interlocutores comerciales a los documentos de marketing. Cuando se encuentran disponibles múltiples direcciones, una casilla de selección está disponible dentro de los documentos de marketing para seleccionar la dirección correcta. 6 PUBLIC Direcciones de interlocutores comerciales Dirección de entrega Dirección de facturación Dirección de persona de contacto  Varias direcciones posibles para cada clase de dirección  Puede fijar valores predeterminados para cada clase de dirección

---

## Diapositiva 7

Antes de comenzar a introducir interlocutores comerciales al sistema, fije los valores predeterminados para los interlocutores comerciales a nivel de la empresa. En la ficha IC de las Parametrizaciones generales de la empresa, tiene la opción de fijar las condiciones de pago predeterminadas, los métodos de pago predeterminados y las condiciones de reclamación (para cuando un cliente no abona a tiempo). Estos valores predeterminados luego se copian a cada uno de los registros de datos maestros de interlocutores comerciales recién creados. Claro que, todos estos valores estándar pueden modificarse en el registro de datos maestros, y hasta cuando sea necesario en los documentos de ventas. 7 PUBLIC Parametrizaciones previas Valores predeterminados de IC:  Condiciones de pago  Vías de pago  Condiciones de reclamación

---

## Diapositiva 8

Los detalles detrás de las parametrizaciones predeterminadas así como también las opciones de configuración adicionales se encuentran en el menú Gestión, en Configuración para Interlocutores comerciales. En este menú puede encontrar los detalles detrás de las condiciones de pago y condiciones de reclamación, así como también otras parametrizaciones relacionadas con los interlocutores comerciales. Las condiciones de pago son muy importantes y no sólo contienen cálculos de la fecha de vencimiento y descuento por pronto pago. Los límites de crédito y las listas de precio también se especifican en las definiciones de las condiciones de pago. Además, una lista de precios predeterminada puede asignarse para todos los clientes a través de la definición de las condiciones de pago. Otra opción para asignar una lista de precios es a través de un grupo de clientes. 8 PUBLIC Condiciones de pago Gestión > Configuración > Interlocutores comerciales

---

## Diapositiva 9

Los grupos de clientes son una forma de clasificar los clientes para la determinación de precios y la realización de informes.  Es posible que desee clasificar a los clientes por sectores o por tamaño. Un cliente puede estar asignado a un grupo. Cuando ejecute los informes, puede ejecutarlos por grupos de clientes.  Esto le permite ver las cifras de ventas de los diferentes sectores.  Luego, puede clasificar los datos o realizar selecciones en base a los grupos. Si asigna una lista de precios a un grupo de clientes, la lista de precios asignada al grupo de clientes reemplazará la predeterminada de las parametrizaciones generales. 9 PUBLIC Grupos de clientes Para determinar precios y realizar de informes  Cliente asignado a solo un grupo  Puede utilizar grupos de clientes en la gestión de informes para ver las cifras de ventas de diferentes sectores.  Puede asignar una lista de precios a un grupo de clientes  La lista de precios asignada al grupo reemplazará el valor por defecto de Parametrizaciones generales.

---

## Diapositiva 10

Además de los clientes en el proceso de ventas, también tenemos los clientes potenciales. Los clientes potenciales se utilizan para identificar un cliente potencial. Tener datos maestros de clientes potenciales le permite documentar y realizar un seguimiento de las actividades de preventa para un cliente potencial. Puede crear los siguientes documentos para los datos maestros de un cliente potencial: oferta de cliente, pedido de cliente, oportunidad de venta y actividad. Los clientes potenciales no pueden utilizarse en entregas o facturas. Esto le permite comenzar el procesamiento de un pedido de cliente potencial, pero evita que los usuarios no informados entreguen artículos a un cliente no conocido o no aprobado. Una vez que asigna un cliente potencial a un documento de ventas, éste no se puede eliminar, aunque no se proceda con la operación. 10 PUBLIC Clientes potenciales y clientes Clientes potenciales  Utilizados en documentos o pedidos de cliente previos a la venta.  No se utilizan en entregas ni en facturas

---

## Diapositiva 11

Cuando el cliente potencial compra el producto o servicio se transforma en un cliente. En este caso, todo lo que debe hacer es modificar la clase de interlocutor comercial en el registro maestro de cliente potencial a cliente. Toda la información añadida al registro maestro de datos de clientes potenciales se graba, así como los documentos creados para el cliente potencial. Por ejemplo, si creó un pedido de cliente para un cliente potencial, cuando dicho cliente potencial se transforme en un cliente y compre los artículos del pedido de cliente, puede utilizar este pedido como base para crear un documento de entrega y, más adelante, una factura. Dado que SAP Business One automatiza muchos procesos relacionados con el proceso de Ventas - clientes, es fundamental que seleccione o introduzca la información correcta sobre el cliente y los artículos en el momento de iniciar el pedido de cliente. Por ejemplo, si se introducen incorrectamente o de manera incompleta datos tan simples como la dirección de facturación o la dirección de envío del cliente, esto puede afectar gravemente el balance final de la empresa cuando los artículos pedidos lleguen a lugares incorrectos o las facturas se envíen a oficinas erróneas.  Además, en algunas localizaciones como Estados Unidos el indicador de impuestos y la tasa se determinan de acuerdo con la asignación de envío. Por lo tanto, asegúrese de seleccionar la dirección de envío correcta desde la lista desplegable. 11 PUBLIC Clientes potenciales y clientes Clientes potenciales  Utilizados en documentos o pedidos de cliente previos a la venta.  No se utilizan en entregas ni en facturas clientes  Utilizados en cualquier documento de ventas  Los clientes potenciales se transforman en clientes cuando realizan una compra

---

## Diapositiva 12

Observemos la utilización de los clientes potenciales en los documentos de venta en un escenario empresarial clásico. Un cliente potencial solicita una oferta para un ordenador con accesorios. En las ofertas introducimos los datos maestros del cliente potencial, los artículos y las cantidades. La oferta de ventas actúa como una oferta para el interesado en mercancías específicas a un precio específico. La determinación de precios para este artículo asociado con el cliente potencial se determina automáticamente. Decidimos brindarle este cliente potencial un descuento adicional, por lo que registramos un descuento manual del 1% en la oferta. 12 PUBLIC Clientes potenciales en ofertas de venta  Un cliente potencial solicita una oferta para un ordenador con accesorios.  En las ofertas introducimos los datos maestros del cliente potencial, los artículos y las cantidades.  El sistema determina el precio automáticamente  Se introduce un descuento manual del 1% en la oferta. Oferta de ventas Pedido de cliente Entrega Factura de clientes

---

## Diapositiva 13

Si el cliente potencial decide pedir los artículos, copiamos la oferta a un pedido de cliente. Toda la información: los datos maestros del cliente potencial, el artículo, la determinación de precios que incluye el descuento manual, se copian en el pedido del cliente. El cliente potencial puede convertirse ahora en un cliente, para el pedido de ventas o al momento de la entrega. 13 PUBLIC Clientes potenciales en el pedido de cliente  Si el cliente potencial decide pedir los artículos, copiamos la oferta a un pedido de cliente.  Toda la información, incluido el descuento manual, se copia al pedido de cliente.  El cliente potencial puede convertirse a un cliente real en este momento o en el momento de la entrega. Oferta de ventas Pedido de cliente Entrega Factura de clientes

---

## Diapositiva 14

14 PUBLIC Conexión de clientes y proveedores Cliente C1999 Proveedor V2999 Contabilidad Contabilidad Proveedor conectado   V2999 Cliente conectado   C1999 Informes de antigüedad Reclamaciones Reconciliación La conexión le ofrece visibilidad de ambas operaciones abiertas del IC en: Si tiene un cliente que también es un proveedor, puede conectar los dos registros de datos maestros de interlocutor comercial entre sí mediante Proveedor conectado y Cliente conectado. Cuando haya introducido un valor en uno de los campos, el otro campo se rellena automáticamente con el interlocutor comercial relacionado.  Una flecha de enlace junto al campo le permite desplazarse de un interlocutor comercial a otro. La conexión de los dos interlocutores comerciales le permite ver en su totalidad las operaciones abiertas del proveedor y del cliente en los informes de antigüedad y en el asistente de reclamaciones. También le proporciona la capacidad de reconciliar las transacciones de clientes abiertas con transacciones de proveedores abiertas. Encontrará más información acerca del impacto de la gestión financiera de esta conexión en los temas financieros que tratan la reconciliación interna, de reclamaciones y de antigüedad. 14

---

## Diapositiva 15

Existen tres clases de interlocutores comerciales: clientes potenciales, clientes y proveedores. Los clientes y clientes potenciales se utilizan en el proceso de ventas. Los proveedores se utilizan en las compras. Los clientes potenciales se utilizan en su mayoría en las preventas, pero se pueden utilizar en un pedido de cliente. El registro de datos maestros de un cliente potencial puede convertirse en el registro de datos maestros de un cliente. Los clientes potenciales no pueden usarse en entregas o facturas.  Un cliente debe utilizarse en documentos con un posible impacto contable. Los clientes y clientes potenciales tienen múltiples direcciones de envío, facturación y personas de contacto. Puede establecer un valor por defecto para cada clase de dirección. 15 15 PUBLIC Resumen A continuación, se detallan algunos puntos clave:  Existen tres clases de interlocutores comerciales: clientes potenciales, clientes y proveedores.  Los clientes y clientes potenciales se utilizan en el proceso de ventas.  Los clientes potenciales se utilizan en su mayoría en las preventas, pero se pueden utilizar en un pedido de cliente.  El registro de datos maestros de un cliente potencial puede convertirse en el registro de datos maestros de un cliente.  Los clientes potenciales no pueden usarse en entregas o facturas.  Los clientes y clientes potenciales tienen múltiples direcciones de envío, facturación y personas de contacto.  Puede establecer un valor por defecto para cada clase de dirección.

---

