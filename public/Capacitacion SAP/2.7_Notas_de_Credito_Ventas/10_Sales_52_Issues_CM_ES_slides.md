# Transcripción por Diapositiva: 10_Sales_52_Issues_CM_ES

## Diapositiva 1

PUBLIC Ventas - clientes: Abonos de clientes SAP Business One Versión 10.0 Bienvenido al tema sobre los abonos de clientes. 1

---

## Diapositiva 2

 En este tema, hablaremos sobre cómo corregir los problemas que suceden luego de que se crea la factura de cliente.  Veremos cómo crear abonos de cliente y cómo cancelar una factura de cliente. 2 PUBLIC Al finalizar este tema, podrá:  Corregir los problemas que ocurren luego de que una factura de cliente se ha creado. Objetivos

---

## Diapositiva 3

Como parte de la iniciativa para mejorar la satisfacción del cliente, la empresa comenzó a estudiar cómo corregir mejor los problemas que suceden luego de la facturación. El documento clave para corregir los problemas de facturación es el abono de cliente.  Los abonos de cliente se utilizan para corregir problemas con la determinación de precios de la factura, así como también permiten que los artículos se devuelvan para obtener crédito. Otra herramienta para corregir los problemas es la capacidad de cancelar un documento de marketing.  La empresa utiliza esta opción cuando se crean las facturas de cliente incorrectas. 3 3 PUBLIC Escenario empresarial  Como parte de la iniciativa para mejorar la satisfacción del cliente, la empresa comenzó a estudiar cómo corregir mejor los problemas que suceden luego de la facturación.  El documento clave para corregir los problemas de facturación es el abono de cliente.  Los abonos de cliente se utilizan para corregir problemas con la determinación de precios de la factura, así como también permiten que los artículos se devuelvan para obtener crédito.  Otra herramienta para corregir los problemas es la capacidad de cancelar un documento de marketing.  La empresa utiliza esta opción cuando se crean las facturas incorrectas.

---

## Diapositiva 4

4 PUBLIC Documentos de corrección Entrega Solicitud de devolución Factura de clientes Devolución Abono de clientes Los dos documentos principales de corrección para el proceso de ventas son el documento de devolución y el abono de clientes.  En este tema nos centramos en el abono de clientes. El abono de clientes (o nota de crédito) es el documento usado para procesar los artículos devueltos o brindar crédito, una vez que se introdujo una factura de clientes. Las devoluciones no se pueden utilizar para corregir los problemas que surgen de facturas de clientes. Solo se utilizan para corregir los problemas que surgen en la entrega. Una ventaja de utilizar el documento de solicitud de devolución es que los usuarios pueden utilizar este documento para los problemas que surgen de las dos entregas y de las facturas de clientes.   El sistema determinará automáticamente el documento de corrección correspondiente para seguir la solicitud de devolución. Una opción adicional para corregir los problemas después de realizar la factura para el cliente es cancelar una factura y volver a emitirla. 4

---

## Diapositiva 5

En nuestra situación de ejemplo, el cliente está desilusionado con el desempeño de la cámara solicitada. Por esto decidió devolver la cámara. El coste de artículo de la cámara era de 50. La cámara se facturó al precio de 100. Debido a que la cámara ya se había facturado, tuvimos que usar un abono para procesar la devolución. El abono de clientes anula ambos, la contabilización de la factura y la entrega. 5 PUBLIC Ejemplo de abono 50 50 Cuenta de existencias Cuenta de gastos Ingresos por ventas Cliente 100 100  El cliente devuelve una cámara.  El coste original es de 50.  El precio de la factura es de 100.  Debido a que la cámara se facturó, usamos un abono.  El abono anula ambos, la factura y la entrega. 100 Cliente 100 Cta. de ingresos 50 Cta. de gastos Cta. existencias 50 Pedido de cliente Entrega Factura de clientes

---

## Diapositiva 6

Un abono de clientes (también llamado una nota de crédito) anula parcial o completamente el asiento creado por una factura de clientes. Cuando se crea un abono con referencia a la factura, el sistema corrige las cantidades y los valores de la factura.  El sistema aumenta los stocks de los artículos abonados.  El sistema abona en la cuenta del cliente el valor del abono en el libro mayor y corrige los ingresos con el mismo importe. Si el abono es un abono de tipo artículo con líneas para los artículos de inventario, entonces el asiento para el abono también aumentará la cuenta de stock y disminuirá la cuenta de costes. 6 PUBLIC Abono Pedido de cliente Entrega Factura de clientes Cuando se crea un abono de cliente con referencia a la factura, el sistema corrige las cantidades y los valores. Aumenta los stocks de los artículos abonados Abona el valor a la cuenta del cliente y corrige los ingresos Aumenta la cuenta de stock y disminuye la cuenta de gastos de documentos con tipo de artículo 50 50 Cuenta de existencias Cuenta de gastos Ingresos por ventas Cliente 100 100 100 Cliente 100 Cuenta de ingresos 50 Cta. de gastos Cta. de existencias 50

---

## Diapositiva 7

7 PUBLIC Abono de factura de deudores cerrada (pagada) En el caso de que ya se haya pagado una factura de deudores, primero deberá hacer clic con el botón derecho del ratón y cambiar el estado del documento a Abierto antes de poder copiarlo en una nota de crédito o en una solicitud de devolución. En algunos casos, puede que un cliente haya pagado completamente una factura de cliente antes de devolver los artículos para obtener el crédito. En estos casos, primero debe modificar el estado del documento de la factura de deudores de Cerrado a Abierto. Haga esto con el botón derecho del ratón y seleccione la opción para modificar el estado del documento a Abierto. Una vez que haya seleccionado Actualizar, el documento volverá al estado Abierto. Una actualización del documento permitirá que se haga una copia al abono. 7

---

## Diapositiva 8

Como recién vimos, un abono de tipo artículo normalmente devuelve artículos al stock así como también otorga un crédito para los artículos. Si desea otorgar crédito, pero no crear un movimiento de mercancías, tiene dos opciones. Puede crear un abono de tipo artículo y seleccionar la casilla de verificación Sin contabilización de cantidad en la línea del artículo, o puede usar un abono de tipo servicio. La ventaja de usar un abono de tipo artículo y la casilla de verificación Sin contabilización de cantidad es que un abono de tipo artículo puede copiarse desde una factura de cliente de tipo artículo.  Solo un abono de tipo artículo, puede enumerar los números de artículos. Ninguno de estos es posible con un abono de tipo servicio.  Por lo tanto, el abono de tipo servicio se utiliza mejor para acreditar servicios o para circunstancias en las que no desea hacer referencia a la factura como documento base. 8 PUBLIC Crédito sin devolución al stock Pedido de cliente Entrega Factura de clientes  Si desea proporcionar un abono sin un movimiento de mercancías:  Cree un abono de tipo artículo y seleccione la casilla de selección Sin contabilización de cantidad, o  Utilice un abono de tipo servicio.  Ventaja de la primera opción: los abonos de tipo artículo pueden copiarse de facturas de tipo artículo 50 50 Cuenta de existencias Cuenta de gastos Ingresos por ventas Cliente 100 100 Sin contabilización de cantidad 100 Cliente 100 Cuenta de ingresos

---

## Diapositiva 9

Observemos un ejemplo de creación de un abono de tipo artículo si una contabilización de cantidad para el inventario. En este caso, la cámara de un cliente se rompe.  A diferencia de nuestro último ejemplo, no requerimos que el cliente devuelva el artículo para recibir crédito. Como antes, el coste original es de 50 y el precio factura es 100. Volvemos a hacer referencia a la factura original y creamos un abono de tipo artículo.  Sin embargo, esta vez seleccionamos la casilla de verificación "Sin contabilización de cantidad". El cliente recibe el crédito completo por el artículo y no se llevan a cabo contabilizaciones de stock. 9 PUBLIC Ejemplo de crédito sin devolución al stock Pedido de cliente Entrega Factura de clientes 50 50 Cuenta de existencias Cuenta de gastos Ingresos por ventas Cliente 100 100 Sin contabilización de cantidad 100 Cliente 100 Cuenta de ingresos  La cámara de un cliente se rompe.  No le solicitamos que devuelva el artículo para recibir crédito.  El coste original es de 50.  El precio de la factura es de 100.  Hacemos referencia a la factura original y creamos un abono sin una contabilización de cantidad.  El abono revierte solo la factura.

---

## Diapositiva 10

cuando un cliente devuelve artículos que no hacen referencia a una factura concreta, se puede contabilizar esta cantidad directamente en el almacén sin hacer referencia a un documento anterior. Si el abono es para los artículos de inventario, entonces el stock y valor de stock aumentan como resultado. 10 PUBLIC Abono sin referencia Almacén (Cantidad) Libro mayor (Valor) 100 Cliente 100 Cuenta de ingresos 50 Cta. de gastos Cta. existencias 50  Para los artículos devueltos que no hacen referencia a una factura, cree un abono sin hacer referencia a un documento anterior.  Si el abono es para los artículos de inventario, entonces el stock y valor de stock aumentan como resultado.

---

## Diapositiva 11

Si no desea revertir la contabilización de stocks y las contabilizaciones de coste, otra vez tiene la opción de usar la casilla de verificación "Sin contabilización de cantidad" para eliminar el movimiento de mercancías. Luego, la única contabilización es revertir las contabilizaciones para las cuentas de ingresos y cliente. 11 PUBLIC Abono sin referencia 100 Cliente 100 Cuenta de ingresos Sin contabilización de cantidad  Si no desea revertir la contabilización de stock y las contabilizaciones de coste, utilice la casilla de selección "Sin contabilización de cantidad"  De este modo, la contabilización solo lleva a cabo en las cuentas de ingresos y cliente Libro mayor (Valor)

---

## Diapositiva 12

A veces no es adecuado crear un abono y es posible que prefiera cancelar el documento original. Business One le brinda la capacidad de cancelar documentos de marketing como una factura incorrecta. Cuando cancela un documento de marketing, se crea un nuevo documento ‘cancelación’ con una contabilización de anulación que incluye las cantidades y su estado se define en Cerrado – Cancelación. La contabilización de facturas de cliente original se mantiene y el estado se actualiza a Cancelado.  Tanto la anulación como los documentos anulados se cierran de forma automática y se reconcilian por completo. Cancelar un documento ahorra tiempo porque las transacciones contables, fiscales, financieras y de inventario se anulan completamente en un paso. Los documentos de base, como una entrega, se vuelven a abrir luego de la cancelación y pueden utilizarse como documentos de base de nuevo. La realización de informes está disponible para los documentos cancelados, debido a que las contabilizaciones originales permanecen en el sistema junto con la cancelación. Tiene la flexibilidad de fijar un número máximo de días para permitir la cancelación luego de que los documentos se contabilizaron y las autorizaciones relevantes contemplan este proceso. 13 PUBLIC Cancelación Se mantiene la contabilización de la factura original de cliente El estado del documento se actualiza a Cancelado Se crea una nueva contabilización de anulación El estado del documento se define en Cerrado - Cancelación Cuando cancela una factura...

---

## Diapositiva 13

A un cliente se le facturó antes de entregarle los artículos del pedido de cliente. El cliente solicitó que no se le facturase hasta haber recibido el pedido completo. El cliente había solicitado varios artículos en un pedido de cliente, los cuales solo se habían entregado parcialmente.  Cuando estos artículos se facturaron, el estado del documento de entrega cambió a Cerrado y la cantidad pendiente de la entrega era 0. Para resolver el reclamo del cliente, se canceló la factura.  La cancelación crea una factura de cliente con cantidades anuladas. La entrega original se vuelve a abrir.  Se lleva a cabo una segunda entrega. Ahora debido a que la cantidad completa se envía al cliente, este puede facturarse por la cantidad completa de la venta. 14 PUBLIC Ejemplo de cancelación 1. A un cliente se le facturó antes de entregarle los artículos del pedido de cliente. 2. La factura se canceló. La cancelación crea una factura con cantidades anuladas. 3. La entrega original se vuelve a abrir. Se lleva a cabo una segunda entrega. El cliente puede ser facturado por la cantidad completa de la venta.

---

## Diapositiva 14

15 PUBLIC Resumen de opciones para devoluciones y haber en ventas Problemas Soluciones sugeridas Entrada incorrecta de una factura de cliente Cancele la factura de clientes Se vuelve a abrir la entrega para crear una nueva factura de cliente Necesidad de devolver artículos recibidos en una entrega pero que aún no se han facturado Copie los artículos de la entrega a una solicitud de devolución A continuación, cópielos a la devolución Necesidad de devolver o abonar artículos facturados en una factura de clientes pero que aún no se han pagado Copie los artículos en una solicitud de devolución A continuación, cópielos a un abono de clientes Si no se desea utilizar el movimiento de stock, utilice Sin contabilización de cantidad Necesidad de devolver o abonar artículo(s) facturado(s) en una factura de deudores que se ha pagado (estado Cerrado) Modificar estado de factura de deudores a Abierto A continuación, cópielos a un abono de clientes Si no se desea utilizar el movimiento de stock, utilice Sin contabilización de cantidad Necesidad de devolver artículos sin referencia a una factura o necesidad de abonar artículos de varias facturas de cliente Cree un abono de clientes sin referencia Si no se desea utilizar el movimiento de stock, utilice Sin contabilización de cantidad Aquí hay un resumen de las opciones para devoluciones y cambios en las compras. • Para la entrada incorrecta de una factura de cliente, puede cancelar el documento.  La entrega relacionada se volverá a abrir para que pueda crear una nueva factura de cliente.  Lo mismo ocurre cuando introduce una entrega; puede cancelarla y volver a enviarla desde el pedido de cliente. • Si necesita devolver los artículos recibidos en una entrega que aún no se ha facturado, resulta útil copiarlos a una solicitud de devolución.  El sistema le propondrá automáticamente copiarlos a una devolución. • Si necesita devolver los artículos que se han facturado pero que no se han pagado, resulta útil copiarlos a una solicitud de devolución.  El sistema le propondrá automáticamente copiarlos a un abono de clientes. • Una vez que se haya pagado una factura, primero deberá modificar el estado del documento a Abierto antes de poder crear un abono de clientes. • No puede realizar copias de múltiples facturas para crear un abono. • Si desea incluir líneas de crédito en una entrega o factura de clientes, utilice las líneas negativas. El uso de las líneas negativas se trata con más en detalle en el tema Devoluciones y cambios. 15

---

## Diapositiva 15

Un abono de clientes anula un asiento de factura de clientes de forma parcial o completa. Cuando se crea un abono de cliente con referencia a la factura de cliente, el sistema corrige las cantidades y los valores de la factura. Si el abono contiene artículos de inventario, el asiento para el abono también aumentará la cuenta de existencias y disminuirá la cuenta de costes. Un abono puede crearse sin referencia a un documento base, por ejemplo cuando necesita acreditar facturas cerradas que se han pagado o cuando el crédito no está relacionado con ninguna factura específica. Si desea otorgar un crédito sin afectar el stock, puede seleccionar la casilla de verificación Sin contabilización de cantidad en una línea de artículo de un abono de tipo artículo, o puede usar un abono de tipo servicio. Puede cancelar documentos de marketing como facturas de clientes.  Un nuevo documento de "cancelación" de anulación se crea durante cada procedimiento de cancelación y tanto los documentos de anulación como los anulados se cierran de forma automática y se reconcilian por completo. Los documentos de base, como una entrega, se vuelven a abrir luego de la cancelación y pueden utilizarse como documentos de base de nuevo. 16 16 PUBLIC Resumen A continuación, se detallan algunos puntos clave:  Un abono de cliente anula un asiento de forma parcial o completa.  Cuando se crea un abono con referencia a la factura, el sistema corrige las cantidades y los valores de la factura.  Si el abono contiene artículos de inventario, la entrada del asiento aumentará la cuenta de stock y disminuirá la cuenta de costes.  Un abono puede crearse sin referencia.  Si desea otorgar crédito sin afectar el stock, seleccione la casilla de verificación Sin contabilización de cantidad en la línea del artículo o utilice un abono de tipo servicio.  Puede cancelar documentos de marketing.  Un documento de anulación se crea y se cierran tanto los documentos de anulación como los documentos anulados.  Los documentos de base se vuelven a abrir luego de la cancelación.

---

