# Transcripción por Diapositiva: CSL02_Procurement_Process_ES

## Diapositiva 1

Caso práctico: Proceso de aprovisionamiento SAP Business One 10.0, versión para SAP HANA PÚBLICO

---

## Diapositiva 2

CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO                                  PÚBLICO 2 INTRODUCCIÓN En este caso práctico, realizará las tareas siguientes: • Crear pedidos • Introducir una entrada de mercancías • Gestionar entregas parciales • Contabilizar una factura y un pago • Crear solicitudes de compra y ofertas (para artículos y servicios) REQUISITO PREVIO 1. Utilizar la base de datos de muestra para SAP Business One 10.0, versión para SAP HANA o SAP Business One 10.0 2. Credenciales: Código de usuario: director; Contraseña inicial: director 3. Compruebe que el Proveedor por defecto V10000 está especificado en la ficha Datos de compras para los siguientes artículos: - I00002 - I00003 - I00007 - I00008 La captura de pantalla siguiente sirve de referencia:

---

## Diapositiva 3

CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO                                  PÚBLICO 3 TAREA 1 James, el jefe de compras de OEC Computers, quiere rellenar algunos artículos que tienen un nivel bajo de stocks. Decide pedir los siguientes artículos al proveedor V10000: I00002 con una cantidad de 50 I00004 con una cantidad de 100 I00007 con una cantidad de 25 I00008 con una cantidad de 15 Cree el pedido. TAREA 2 James recibe algunos de los artículos que ha pedido al proveedor  V10000: I00004 con una cantidad de 50 I00007 con una cantidad de 25 I00008 con una cantidad de 15 Cree el pedido de entrada de mercancías parcial. TAREA 3 El proveedor  V10000 entrega el resto de los artículos. James revisa los artículos entregados y registra la entrada de la manera siguiente: I00002 con una cantidad de 50 I00004 con una cantidad de 30 I00003 con una cantidad de 20 También revisa el pedido original  y ve que no coincide del todo con los artículos entregados. ¿Cómo puede gestionar las diferencias/modificaciones en el pedido de entrada de mercancías? Antes de que James introduzca las modificaciones en el sistema, tiene que decidir si las cantidades entregadas de los artículos I00004 e I00003 son aceptables. Para hacerlo, quiere verificar el status de los stocks de ambos artículos. ¿Cómo puede verificar fácilmente el status de stocks de los artículos directamente del pedido de entrada de mercancías? (Hay diferentes opciones posibles) TAREA 4 Al cabo de unos días, James recibe una factura  del proveedor V10000 para los artículos entregados. El proveedor también informa a James de que en este momento no puede entregar la cantidad restante de 20 para el artículo I00004. Cree la factura correspondiente y cierre la cantidad pendiente en el pedido para el artículo I00004.

---

## Diapositiva 4

CASO PRÁCTICO: PROCESO DE APROVISIONAMIENTO                                  PÚBLICO 4 TAREA 5 Ese mismo día, James ha contabilizado la Factura de proveedor del proveedor V10000, necesita urgentemente pedir dos artículos más. Los necesita ese mismo día, así que llama al proveedor V10000 para solicitar los artículos siguientes: I00008 con una cantidad de 25 I00009 con una cantidad de 5 Recibe los artículos y la factura por ellos ese mismo día. ¿Cómo puede introducir este pedido urgente en el sistema? James quiere ver qué ha contabilizado el sistema en el área financiera. ¿Cómo puede abrir el asiento correspondiente directamente desde la factura de proveedor? (Hay diferentes opciones posibles) . TAREA 6 James quiere pagar las dos facturas de proveedor para el proveedor V10000 al mismo tiempo. Cree el pago.

---

## Diapositiva 5

www.sap.com

---

