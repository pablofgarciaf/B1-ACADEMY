# Transcripción por Diapositiva: CSL01_Introduction_Solution_ES

## Diapositiva 1

Solución del caso práctico: Introducción SAP Business One 10.0, versión para SAP HANA PÚBLICO

---

## Diapositiva 2

CASO PRÁCTICO: INTRODUCCIÓN                                                                                             PÚBLICO 2 Soluciones sugeridas para el caso práctico Introducción Nota importante: al comparar su trabajo con las capturas de pantalla que se proporcionan aquí, hágalo solo con los campos mencionados en el ejercicio porque es posible que la base de datos contenga datos o configuraciones ligeramente distintos. Sugerencia: Puede utilizar la función Buscar menús en SAP HANA o la función Buscar en SQL para encontrar las vías de acceso relevantes. TAREA 1 ¿Cómo puede asignar Bill una de cockpit de ventas a sí mismo? Para seleccionar una plantilla para el cockpit, proceda de la siguiente manera: Seleccione la plantilla Ventas.

---

## Diapositiva 3

CASO PRÁCTICO: INTRODUCCIÓN                                                                                             PÚBLICO 3 INFORMACIÓN: Los usuarios deben tener autorizaciones para las funciones que se incluyen en las plantillas. El usuario «director» recomendado para caso práctico es un superusuario, de modo que está autorizado a realizar todas las funciones para todas las plantillas. TAREA 2 ¿Cómo puede asignarse a sí mismo como jefe de ventas responsable de estos clientes? Verifique el sistema y (si es necesario) seleccione Jefe de ventas en el campo Empleado del departamento de ventas para asignar la responsabilidad para el interlocutor comercial en cuestión. Existen varias formas de abrir la transacción maestra de interlocutores comerciales. Algunas opciones son: • Haga clic en el icono de cliente en el widget del proceso de ventas • Siga un acceso de menú, o • utilice una búsqueda de menú. Busque un interlocutor comercial mediante la introducción del código: Y seleccione En el registro maestro de interlocutores comerciales, si es necesario asigne el jefe de ventas como empleado de ventas.

---

## Diapositiva 4

CASO PRÁCTICO: INTRODUCCIÓN                                                                                             PÚBLICO 4 TAREA 3 ¿Cómo puede Bill buscar estas funciones fácilmente? Utilice la función Buscar menús en SAP HANA o la función Buscar en SQL para buscar las vías de acceso relevantes.

---

## Diapositiva 5

CASO PRÁCTICO: INTRODUCCIÓN                                                                                             PÚBLICO 5 INFORMACIÓN: El sistema mostrará una lista de todas las funciones en el menú que contiene el texto de búsqueda indicado. También mostrará la vía de acceso en la que se encuentra cada función. ¿Cómo puede añadir la función Actividad a un widget del cockpit? Para modificar el cockpit, seleccione el icono Editar (lápiz). Seleccione el icono «+» para abrir la galería de widgets. En la galería de widgets, seleccione el widget Funciones comunes. Un modo para encontrar este widget es utilizar la lista desplegable de tipos de widget. Seleccione Otros. Seleccione el widget Funciones comunes y, a continuación, seleccione la flecha hacia atrás para volver al cockpit. INFORMACIÓN: El widget nuevo aparecerá en la parte inferior del cockpit.  Puede mover los widgets del cockpit haciendo clic sobre ellos y arrastrándolos a una nueva ubicación.  Si hay widgets que no desea, puede arrastrarlos a un «papelera» situada en la parte inferior derecha de la ventana. Una vez ajustados los widgets de la manera que desee, seleccione la marca de verificación para grabar las modificaciones.

---

## Diapositiva 6

CASO PRÁCTICO: INTRODUCCIÓN                                                                                             PÚBLICO 6 INFORMACIÓN: Existen dos opciones para grabar una modificación en el cockpit.  Puede grabar los cambios para este usuario solo con la opción Actualizar mi cockpit o puede grabar una plantilla que otros usuarios pueden seleccionar. El sistema le solicitará con un mensaje de advertencia que esta modificación sobrescribirá su cockpit actual. Arrastre y suelte la función Actividad en el widget Cockpit de funciones comunes. Añada cualquier otra transacción que desee tener en el widget Funciones comunes.

---

## Diapositiva 7

CASO PRÁCTICO: INTRODUCCIÓN                                                                                             PÚBLICO 7 TAREA 4 Cree la oferta. Abra la Oferta de ventas y seleccione el cliente C20000.

---

## Diapositiva 8

CASO PRÁCTICO: INTRODUCCIÓN                                                                                             PÚBLICO 8 Escriba un texto apropiado en la primera línea. Para introducir filas de texto, debe ser visible el campo Tipo.  Si no está visible, seleccione Parametrizaciones de formulario.

---

## Diapositiva 9

CASO PRÁCTICO: INTRODUCCIÓN                                                                                             PÚBLICO 9 A continuación, añada los artículos A00002 y A00005 con las cantidades respectivas. Añada un Subtotal. A continuación, añada el último artículo, C00008, y la cantidad relevante. En el campo Descuento en la parte inferior, añada el descuento del 5%. Luego, grabe la oferta haciendo clic en Añadir y nuevo, Añadir y visualizar o Añadir y cerrar en función de lo que desee hacer.

---

## Diapositiva 10

CASO PRÁCTICO: INTRODUCCIÓN                                                                                             PÚBLICO 10

---

## Diapositiva 11

CASO PRÁCTICO: INTRODUCCIÓN                                                                                             PÚBLICO 11 TAREA 5 Utilice Enterprise Search para abrir la oferta de ventas y crear el pedido de cliente. Enterprise Search permite buscar fácilmente la oferta de ventas: Indique el Número de cliente y la Fecha de contabilización de la oferta de ventas en cuestión: INFORMACIÓN: Puede introducir su formato de fecha preferido para los criterios de búsqueda. Para abrir la oferta de ventas, haga clic en el título: Para crear el pedido de cliente, haga clic en Copiar a y seleccione Pedido de cliente.

---

## Diapositiva 12

CASO PRÁCTICO: INTRODUCCIÓN                                                                                             PÚBLICO 12 INFORMACIÓN El sistema copiará toda la información de la oferta de ventas en el pedido de cliente. Indique una fecha de entrega y añada el documento.

---

## Diapositiva 13

CASO PRÁCTICO: INTRODUCCIÓN                                                                                             PÚBLICO 13 TAREA 6 ¿Cómo puede Bill obtener esta información (hay varias opciones posibles)? Opción 1: Mediante los Datos maestros de interlocutor comercial Abra el registro de datos maestros de interlocutor comercial desde el Pedido de cliente haciendo clic en la flecha de enlace junto al campo Cliente. Para abrir los pedidos de cliente correspondientes, haga clic en la flecha de enlace junto al campo Pedidos.

---

## Diapositiva 14

CASO PRÁCTICO: INTRODUCCIÓN                                                                                             PÚBLICO 14 Opción 2: Mediante Arrastrar y vincular Seleccione la ficha Arrastrar y vincular a la izquierda del panel y abra la carpeta Ventas – Clientes. Para ver todos los pedidos de cliente del cliente, seleccione el número de cliente con el ratón (espere hasta que el campo esté marcado) y arrástrelo hasta el informe Pedido de cliente en Arrastrar y vincular. Para ver todos los pedidos de cliente abiertos, haga doble clic en la columna Status hasta que Abiertos aparezca en primer lugar. Haga clic en el status Abiertos y arrástrelo hasta el icono de Filtro de la parte inferior derecha.

---

## Diapositiva 15

CASO PRÁCTICO: INTRODUCCIÓN                                                                                             PÚBLICO 15 Defina el status como igual a «o» Confirme el filtro… …para ver los resultados.

---

## Diapositiva 16

CASO PRÁCTICO: INTRODUCCIÓN                                                                                             PÚBLICO 16 . Opción 3: Mediante la Lista de partidas abiertas En el Workbench de proceso de ventas, abra el menú desplegable junto al icono Pedido de cliente o Informes de ventas y seleccione Lista de partidas abiertas. Seleccione Pedidos de cliente y haga doble clic en la cabecera de la columna Código de cliente para ordenar la lista por código de cliente.

---

## Diapositiva 17

CASO PRÁCTICO: INTRODUCCIÓN                                                                                             PÚBLICO 17

---

## Diapositiva 18

CASO PRÁCTICO: INTRODUCCIÓN                                                                                             PÚBLICO 18 Opción 4: Mediante Enterprise Search Abra Enterprise Search: Indique el nombre o número de cliente relevante: Para restringir los resultados, abra Pedido de cliente en el área Layout y desmarque el status Cerrados.

---

## Diapositiva 19

CASO PRÁCTICO: INTRODUCCIÓN                                                                                             PÚBLICO 19

---

## Diapositiva 20

www.sap.com

---

