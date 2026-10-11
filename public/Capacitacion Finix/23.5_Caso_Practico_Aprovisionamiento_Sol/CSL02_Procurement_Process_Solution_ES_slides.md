# Transcripción por Diapositiva: CSL02_Procurement_Process_Solution_ES

## Diapositiva 1

Solución del caso práctico: Proceso de aprovisionamiento SAP Business One 10.0, versión para SAP HANA PÚBLICO

---

## Diapositiva 2

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 2 Soluciones sugeridas para el caso práctico de proceso de aprovisionamiento Nota importante: al comparar su trabajo con las capturas de pantalla que se proporcionan aquí, hágalo solo con los campos mencionados en el ejercicio porque es posible que la base de datos contenga datos o configuraciones ligeramente distintos. Sugerencia: Puede utilizar la función Buscar menús en SAP HANA o la función Buscar en SQL para encontrar las vías de acceso relevantes. TAREA 1 Cree el pedido. Para pedir los artículos, abra la ventana Pedido. Añada el proveedor V10000, los artículos relevantes y la cantidad de cada uno antes de grabar el pedido.

---

## Diapositiva 3

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 3 TAREA 2 Cree el pedido de entrada de mercancías parcial. Para introducir la entrega parcial del proveedor V10000, abra el Pedido de entrada de mercancías correspondiente y copie los artículos relevantes en el documento utilizando el botón Copiar de. Seleccione el proveedor V10000. Seleccione Copiar de y, a continuación, Pedidos. Haga doble clic en el pedido para seleccionarlo.

---

## Diapositiva 4

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 4 Seleccione Personalizar y haga clic en Siguiente… …Para seleccionar los artículos relevantes e introducir las cantidades entregadas en el campo Ctd. En las filas en las que la cantidad entregada es la misma que la cantidad solicitada, no es necesario ninguna modificación. Haga clic en Finalizar para copiar los artículos seleccionados en el Pedido de entrada de mercancías.

---

## Diapositiva 5

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 5 INFORMACIÓN: Para seleccionar varias filas, presione y mantenga presionado la tecla Control y haga clic en los números de fila relevantes. Para seleccionar un rango de filas consecutivas, presione y mantenga presionado la tecla Mayúsculas y haga clic en la primera y la última fila del rango. Los artículos seleccionados y sus cantidades se copiarán en el pedido de entrada de mercancías, que luego se puede introducir en el sistema.

---

## Diapositiva 6

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 6 Alternativa: Copie todos los datos en el Pedido de entrada de mercancías y haga las modificaciones en el documento en sí: – Modifique la cantidad del artículo I00004 de 100 a 50 – Borre el artículo I00002 (aún no entregado)

---

## Diapositiva 7

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 7 INFORMACIÓN: Para borrar una fila de un documento (como un Pedido de entrada de mercancías), haga clic con el botón derecho del ratón en la fila en cuestión y seleccione Borrar fila en el menú desplegable. TAREA 3 ¿Cómo puede gestionar las diferencias/modificaciones en el pedido de entrada de mercancías? Para recibir los artículos solicitados, abra el pedido. Las filas de artículos completamente entregados aparecen en gris. El resto de las filas de artículos aparecen en blanco, y las cantidades pendientes se ven en el campo Ctd. pendiente.

---

## Diapositiva 8

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 8 Para visualizar la columna Ctd. pendiente en los pedidos, abra las Parametrizaciones de formulario en la barra de herramientas y marque la casilla Visible para Ctd. pendiente. Para crear un Pedido de entrada de mercancías para los artículos restantes, utilice el botón Copiar en para copiar los artículos…

---

## Diapositiva 9

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 9 ….en el pedido de entrada de mercancías. En el pedido de entrada de mercancías, haga las siguientes modificaciones: - Modifique la cantidad del artículo I00004 de 50 a 30 - Añada el artículo I00003 con una cantidad de 20 No introduzca aún el pedido de entrada de mercancías.

---

## Diapositiva 10

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 10 ¿Cómo puede verificar fácilmente el status de stocks de los artículos directamente del pedido de entrada de mercancías? (Hay diferentes opciones posibles) Opción 1 – Mediante los Datos maestros de artículo Abra los datos maestros de los artículos I00004 e I00003 haciendo clic en la flecha de vínculo del campo Nº artículo.

---

## Diapositiva 11

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 11 Ahora abra la ficha Datos de stocks . Para el artículo I00004, hay disponible una cantidad de 330 en el almacén 01. Para el artículo I00003, hay disponible una cantidad de 191 en el almacén 01.

---

## Diapositiva 12

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 12 Opción 2 – Mediante el artículo por Almacenes Abra el artículo por la ventana Almacenes seleccionado el campo Alm. Correspondiente y pulsando Control + Tab.

---

## Diapositiva 13

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 13 La información de stock para cada almacén asignado aparecerá para el artículo seleccionado.

---

## Diapositiva 14

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 14 Opción 3 – Utilizando Disponibilidad Abra el informe Disponibilidad haciendo clic con el botón derecho del ratón en la fila de artículos relevante en el pedido de entrada de mercancías … …y haciendo clic en Disponibilidad.

---

## Diapositiva 15

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 15 Status de stocks del artículo I00004: Status de stocks del artículo I00003:

---

## Diapositiva 16

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 16 Tras verificar el status de stocks, James decide que el pedido de entrada de mercancías se puede introducir porque los niveles de stocks para ambos artículos son aceptables.

---

## Diapositiva 17

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 17 TAREA 4 Cree la factura correspondiente y cierre la cantidad pendiente en el pedido para el artículo I00004. Para cerrar la cantidad pendiente en el pedido, abra el pedido correspondiente. Haga clic con el botón derecho del ratón en la cantidad pendiente... …y seleccione Cerrar fila en el menú de contexto.

---

## Diapositiva 18

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 18 Después de hacer clic en Cerrar fila, aparecerá el siguiente mensaje. Cuando seleccione Sí, se cerrará la fila  . Seleccione Actualizar para grabar el documento. Una vez actualizado el documento, el campo Status quedará fijado en Cerrado.

---

## Diapositiva 19

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 19 Para crear la factura, abra la ventana Factura de proveedor, introduzca el proveedor V10000, y utilice el botón Copiar de, situado en la parte inferior derecha. Copie el artículo facturado del pedido de entrada de mercancías en la factura de proveedor. Seleccione los dos pedidos de entrada de mercancías mientras aprieta Control. Luego haga clic en Seleccionar.

---

## Diapositiva 20

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 20 Dado que todos los artículos están facturados y no se necesitan modificaciones, haga clic en Arrastrar todos los datos (Impuesto por portes y retención) para copiar todos los datos de los dos pedidos de entrada de mercancías. A continuación haga clic en Finalizar. El sistema copiará todos los datos de los dos pedidos de entrada de mercancías en la factura de proveedor.

---

## Diapositiva 21

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 21 INFORMACIÓN: El sistema visualiza el artículo I00004 en las filas 1 y 5 por las entregas parciales de estos artículos. La fila 1 se basa en el pedido de entrada de mercancías 425, y la fila 5 se basa en el pedido de entrada de mercancías 426 (en este ejemplo).

---

## Diapositiva 22

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 22 TAREA 5 ¿Cómo puede introducir este pedido urgente en el sistema? Para ahorrar tiempo y esfuerzos, cree una factura de proveedor. El sistema contabilizará automáticamente la entrega y la entrada financiera relacionada en el fondo. Introduzca el proveedor V10000 y seleccione la fecha actual como Fecha de vencimiento. A continuación, introduzca los artículos y cantidades relacionados en la factura de proveedor. ¿Cómo puede abrir el asiento correspondiente directamente desde la factura de proveedor? (Hay diferentes opciones posibles) Primer paso para todas las opciones: Reabra la factura de proveedor que ha introducido previamente. Opción 1 – Utilizando Comentario de asiento Abra la ficha Contabilidad y haga clic en la flecha de vínculo que hay junto al campo Comentario de asiento.

---

## Diapositiva 23

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 23 Opción 2 – Utilizando Vista previa de asiento Haga clic en el icono Vista previa de asiento en la barra de herramientas: Opción 3 – Mediante Mapa de relaciones Haga clic con el botón derecho del ratón en la factura de proveedor y seleccione Mapa de relaciones del menú de contexto.

---

## Diapositiva 24

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 24 A continuación seleccione Documento de marketing: Detalles de contabilización

---

## Diapositiva 25

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 25 Haga doble clic en la casilla Asiento… …para ver el asiento. TAREA 6 Cree el pago.

---

## Diapositiva 26

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 26 En la carpeta Gestión de bancos, abra la ventana Pagos efectuados. Introduzca el proveedor V10000, luego seleccione las dos facturas de proveedor para el pago…. …y haga clic en el icono Medios de pago. Suponiendo que el pago se realice por transferencia bancaria, abra la ficha correspondiente e introduzca una Fecha de transferencia y Total. A continuación haga clic en OK. INFORMACIÓN: Introduzca el total del pago pulsando Control + b. El sistema introducirá automáticamente el valor total del pago de las dos facturas de proveedor seleccionadas. Haga clic en Añadir para completar el pago de las dos facturas de proveedor…

---

## Diapositiva 27

SOLUCIÓN DEL CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO PÚBLICO 27 …y confirme el mensaje del sistema resultante para contabilizar el pago.

---

## Diapositiva 28

www.sap.com

---

