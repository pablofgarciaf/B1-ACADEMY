# Transcripción por Diapositiva: 10_Impl_15_CustomTools_UserDefinedValues_ES

## Diapositiva 1

PUBLIC Herramientas de personalización: Valores definidos por el usuario SAP Business One Versión 10.0 Bienvenido al tema Valores definidos por el usuario. 1

---

## Diapositiva 2

2 2 PUBLIC Objetivos Objetivos:  Añadir valores definidos por el usuario a campos de formularios y documentos para facilitar y agilizar la entrada de datos que los usuarios finales deben realizar:  Añadir una lista de valores como valores definidos por el usuario  Utilizar una consulta como valores definidos por el usuario  Al finalizar este tema, podrá añadir valores definidos por el usuario a campos de formularios y documentos. De esta manera se facilita y agiliza la entrada de datos que deben realizar los usuarios finales. Aprenderá a añadir una lista de valores como valores definidos por el usuario y a utilizar una consulta como valores definidos por el usuario.

---

## Diapositiva 3

3 3 PUBLIC Escenario empresarial La empresa desea que la fecha de entrega se calcule automáticamente en los pedidos de cliente, de modo que el vendedor no tenga que hacerlo manualmente. En el proceso comercial, la fecha de entrega no es importante ya que los pedidos se envían inmediatamente. El vendedor debe poder ver en el acto el saldo de la cuenta del cliente al procesar un nuevo pedido de cliente por teléfono. Solución: Estos requisitos se pueden implementar con valores definidos por el usuario. Pedido de cliente Entrega Factura de clientes Cobro  Se muestran dos ejemplos de requisitos que se pueden cumplir al añadir valores definidos por el usuario a campos de formulario:  En el primero, la empresa desea que la fecha de entrega, que es un campo obligatorio, se calcule automáticamente en los pedidos, de modo que el vendedor no tenga que hacerlo manualmente. En el proceso comercial, la fecha de entrega no se utiliza ya que los pedidos de cliente se envían inmediatamente para realizar la entrega.  En el segundo, el vendedor debe poder ver en el acto el saldo actualizado de la cuenta del cliente al procesar un pedido nuevo por teléfono. Con los valores definidos por el usuario, el vendedor no tiene que ir manualmente a los datos maestros.

---

## Diapositiva 4

4 4 PUBLIC Valores definidos por el usuario  Los valores definidos por el usuario (UDV) se pueden añadir a cualquier campo editable en un documento o formulario  Los UDV que se añaden a nivel de la línea son válidos en cada línea  Los UDV pueden tener dos formas:  Lista de valores  Consulta de usuario Pedido de cliente Los UDV se pueden añadir a cualquier campo editable a nivel de la cabecera o la línea y a campos definidos por el usuario.  Puede añadir valores definidos por el usuario a cualquier campo de cabecera editable en un documento o formulario y a campos a nivel de línea. También puede añadir UDV a los campos definidos por el usuario.  Si se añaden a nivel de la línea, los valores definidos por el usuario se aplican en cada línea.  Los valores definidos por el usuario se pueden añadir a un campo como:  Lista de valores. Para el campo, el usuario elige de una lista de valores predefinidos.  Consulta de usuario. Cuando se ejecuta la consulta, sus resultados se almacenan en el campo. En el ejemplo, se ha añadido una consulta al campo fecha de entrega.  La consulta calculará una fecha de entrega válida. Utilizar una consulta es la opción más flexible, ya que se puede configurar de manera que se ejecute manual o automáticamente.

---

## Diapositiva 5

5 5 PUBLIC Indicador de valores definidos por el usuario Vista Visualización de colectores Valores definidos por usuario  El icono de lupa indica que se han añadido los valores definidos por el usuario al campo  Activar y desactivar visualización desde Ver Visualización de colectoresValores definidos por usuario  El icono de lupa indica que se han añadido los valores definidos por el usuario al campo.  El usuario puede activar y desactivar la visualización de este icono mediante el menú Ver > Visualización de colectores > Valores definidos por usuario.  En el ejemplo, podemos ver que los valores definidos por el usuario se han añadido al campo Fecha de entrega y a un campo definido por el usuario y denominado Fuente.

---

## Diapositiva 6

6 6 PUBLIC Cómo añadir valores definidos por el usuario  Para añadir valores definidos por el usuario a un campo, seleccione el campo en el documento o formulario y:  Pulse Alt+Shift+F2 o  Seleccione Herramientas > Herramientas de customizing > Valores definidos por usuario: Definición  Autorización general necesaria – “Valores definidos por usuario: Definición” Alt+Shift+F2  Para añadir valores definidos por el usuario a un campo, seleccione el campo en el documento o formulario y pulse la combinación de teclas Alt+Shift+F2 o seleccione la vía de acceso al menú Herramientas > Herramientas de customizing > Valores definidos por usuario: Definición.  Se abrirá la pantalla Valores definidos por usuario: Definición.  Solo los usuarios autorizados pueden añadir UDV. La autorización está en la ventana Autorizaciones generales en Herramientas de customizing > Valores definidos por usuario: Definición.

---

## Diapositiva 7

7 7 PUBLIC Cómo eliminar valores definidos por el usuario Para eliminar valores definidos por el usuario del campo:  Seleccione el campo y pulse Alt+Shift+F2  En la ventana de configuración, seleccione Sin buscar en valores definidos por usuario Alt+Shift+F2  En la ventana de configuración de los valores definidos por usuario, utilice la opción Sin buscar en valores definidos por usuario para eliminar los valores del campo.  No hay restricciones para eliminar valores definidos por el usuario de un campo. Después de eliminar los valores definidos por el usuario, los documentos grabados en el sistema conservan los valores indicados de los campos.

---

## Diapositiva 8

8 8 PUBLIC Lista de valores Puede añadir una lista de valores para un campo con valores definidos por el usuario.

---

## Diapositiva 9

9 9 PUBLIC Alt+Shift+F2 Asegúrese de que el valor introducido no supera la longitud del campo Seleccione la opción Buscar en valores existentes definidos por usuario. Cómo añadir una lista de valores  Para añadir una lista de valores a un campo, seleccione la opción Buscar en valores existentes definidos por usuario. Seleccione el icono Explorar de la pantalla Definición e introduzca los valores de la lista.  Al definir los valores, asegúrese de que no superan la longitud del campo definida en la base de datos. En este ejemplo, se ha añadido una lista de valores al campo definido por el usuario denominado Fuente. Si la longitud del campo Fuente es de 15 caracteres e introduce un valor con 16 caracteres, se truncará el último carácter.

---

## Diapositiva 10

10 10 PUBLIC Cómo añadir una lista de valores (cont.)  Para abrir la lista de valores, el usuario puede seleccionar la lupa en el campo o puede seleccionar el campo y pulsar Shift+F2  Para abrir la lista de valores al procesar un formulario, seleccione el icono de lupa o pulse Shift+F2 en el campo. A continuación, el usuario selecciona un valor de la lista. Además, el usuario puede añadir nuevos valores a la lista seleccionando el botón Nuevo.  El ejemplo muestra una lista de los valores añadidos a un campo definido por el usuario. Tenga en cuenta que también se puede definir la lista al crear inicialmente un campo definido por el usuario utilizando la ventana Campos definidos por usuario: Gestión. La diferencia radica en que el usuario no puede añadir nuevos valores a la lista. Solo puede actualizar la lista desde la ventana Campos definidos por usuario: Gestión.

---

## Diapositiva 11

11 11 PUBLIC Documentos de marketing y UDV Pedido de cliente Valores definidos por el usuario: Definición Los valores definidos por el usuario no se heredan de otros tipos de documentos, por lo tanto, debe añadirlos a cada tipo de documento según sea necesario. El valor introducido en un campo con valores definidos por el usuario se transfiere al documento de destino con las funciones Copiar a/Copiar de. El valor introducido en un campo definido por el usuario se transfiere al documento destino con las funciones Copiar a/Copiar de  Tenga en cuenta que, cuando añade valores definidos por el usuario a un tipo de documento de marketing específico, tal como un pedido, otros tipos de documentos similares, como entregas y facturas, no se ven afectados. Es decir, los valores definidos por el usuario se comportan de manera diferente de los campos definidos por el usuario y no los heredan otros tipos de documentos. Por lo tanto, debe añadir valores definidos por el usuario a cada tipo de documento según sea necesario.  Sin embargo, el valor introducido en un campo con valores definidos por el usuario se transfiere al documento de destino con la función Copiar a/Copiar de.

---

## Diapositiva 12

12 12 PUBLIC Adjuntar una consulta de usuario Puede adjuntar una consulta para un campo con valores definidos por el usuario.

---

## Diapositiva 13

13 13 PUBLIC Cómo añadir una consulta a un campo Seleccione la opción Buscar en valores existentes definidos por usuario según consulta grabada.  La última opción, Buscar en valores existentes definidos por usuario según consulta grabada, le permite adjuntar una consulta al campo.  Esta opción es muy útil ya que el campo se completa con los resultados de la consulta.  La consulta puede definir un valor en el campo o asignarle el resultado de un cálculo, o bien, buscar otro valor para el campo en la base de datos.  La consulta también puede indicarle al usuario un parámetro para que lo utilice al calcular los resultados.

---

## Diapositiva 14

14 14 PUBLIC Cómo añadir una consulta a un campo (cont.) Seleccione la opción Buscar en valores existentes definidos por usuario según consulta grabada.  Cuando se ejecuta la consulta, el campo se completa con los resultados. Consulta de usuario grabada Ejemplo: SELECT ADD_DAYS (($[ORDR."DocDate".DATE]), 7) FROM DUMMY  Cuando utilice una consulta, asegúrese de que el resultado coincide con el tipo de campo del documento y no supera el tamaño del campo. Por ejemplo, no devuelva un resultado de string alfanumérico en un campo definido como numérico.  En el ejemplo que se muestra, se utiliza una consulta para definir la fecha de entrega en un pedido de cliente. La consulta añade 7 días a la fecha actual (DocDate) y almacena el resultado como la fecha de entrega. Hace referencia al campo DocDate del documento activo actual, por lo tanto utiliza el símbolo $ y los corchetes.  Se escribe utilizando la sintaxis SAP HANA y necesita la cláusula "FROM DUMMY" puesto que en la consulta no hay ninguna cláusula FROM.  Para obtener más información sobre cómo crear consultas con las herramientas de consulta, vea el curso Consultas.

---

## Diapositiva 15

15 15 PUBLIC Cómo añadir una consulta a un campo (cont.) Puede decidir cómo se ejecutará la consulta:  Si no selecciona Actualización automática al modificarse campo, el usuario deberá seleccionar el icono de lupa o los campos y pulsar Shift+F2  Si selecciona Actualización automática al modificarse campo, la consulta se ejecutará automáticamente sin que el usuario participe  Cuando selecciona la opción de utilizar una consulta como valores definidos por el usuario, puede elegir que la consulta se ejecute automáticamente.  La casilla de selección Actualización automática al modificarse campo determina si la consulta se ejecuta automáticamente.  Si no selecciona esta casilla, la consulta no se ejecuta automáticamente, solo cuando el usuario hace clic en el icono de lupa o pulsa Shift+F2 en el campo.

---

## Diapositiva 16

16 16 PUBLIC Actualización automática Fecha de entrega  Para que la consulta se ejecute automáticamente, debe seleccionar un campo dependiente  Seleccione un máximo de 5 campos dependientes para desencadenar la ejecución de la consulta  Al seleccionar o modificar el campo dependiente, se ejecuta la consulta  En documentos de marketing, a veces se selecciona el código de proveedor o de cliente como campo dependiente  En este ejemplo también seleccionamos Fecha de contabilización. Seleccione el campo dependiente  Si selecciona la casilla de selección Actualizar automáticamente al modificarse campo, se le solicitará que seleccione un campo dependiente. Puede seleccionar un máximo de 5 campos para desencadenar la ejecución de la consulta. La consulta se ejecuta automáticamente cuando el valor del campo dependiente cambia o el usuario introduce otro valor.  En documentos de marketing, a veces se selecciona el código de proveedor o de cliente como campo dependiente.

---

## Diapositiva 17

17 17 PUBLIC Actualización automática: frecuencia de actualización  Actualización automática cuando se modifica el campo Visualizar valores grabados definidos por usuario (por defecto): la consulta se ejecuta una vez y conserva el resultado en el campo. Actualizar regularmente: la consulta se ejecuta cada vez que el campo dependiente se modifica o se selecciona en un documento.  Cuando selecciona Actualización automática si se producen modificaciones campo, aparecen otras dos opciones. Actualizar regularmente: la consulta se ejecuta cada vez que el campo dependiente se modifica o se selecciona en un documento.  La opción por defecto es Visualizar valores grabados definidos por usuario y es la recomendada ya que conserva el resultado inicial de la consulta. La consulta se ejecuta una vez cuando el campo dependiente se modifica y no volverá a hacerlo aunque el campo vuelva a modificarse. Un ejemplo es una consulta añadida a la Fecha de entrega en un documento. La consulta calcula una fecha de entrega en base a la fecha del sistema. Desea que la consulta se ejecute una sola vez. Si la consulta se ejecutara varias veces, la fecha de entrega podría actualizarse incorrectamente.  Si selecciona Actualizar regularmente, la consulta se ejecutará cada vez que el campo dependiente se modifique o se seleccione en un documento. Utilice esta opción con cuidado ya que el valor del campo puede modificarse sin esperarlo. Al ejecutarse la consulta, el estatus del documento pasará al modo Actualizar; grabe los cambios si desea registrar los nuevos resultados de la consulta. Un ejemplo de utilizar Actualizar regularmente es una consulta que muestra el saldo de cuenta actualizado de un interlocutor comercial. Desea que la consulta se ejecute al explorar o abrir el documento para poder ver siempre el saldo más reciente. Sin embargo, deberá actualizar el documento si desea grabar los resultados de la consulta.

---

## Diapositiva 18

18 18 PUBLIC Actualización automática: ejemplo Pedido de cliente  La consulta se añade al campo definido por el usuario Saldo de cuenta  El código de cliente se establece como campo dependiente  La opción Actualización automática se selecciona con Actualizar regularmente Resultado:  Se ejecutará la consulta cuando el usuario seleccione un código de interlocutor comercial en un nuevo pedido de cliente  También se ejecutará la consulta si el usuario explora documentos antiguos  Este es un ejemplo de cómo funciona la actualización automática.  Se añade una consulta a un campo definido por el usuario en el pedido de cliente. La consulta accede al saldo de cuenta del cliente desde los datos maestros del interlocutor comercial.  Se selecciona Código de cliente/proveedor como campo dependiente. Cuando el usuario selecciona el código de interlocutor comercial en un nuevo pedido del cliente, se inicia la ejecución de la consulta.  Esto es lo primero que normalmente sucede cuando un usuario procesa un documento de marketing nuevo. Por lo tanto, es habitual utilizar Código de cliente/proveedor como campo dependiente para iniciar la ejecución de la consulta.

---

## Diapositiva 19

19 19 PUBLIC Actualización automática en campos a nivel de línea  En una consulta añadida a un campo de cabecera, como campo dependiente solo puede seleccionar otro campo de cabecera.  En una consulta añadida a un campo de línea, como campo dependiente puede seleccionar un campo de cabecera o un campo de línea.  Seleccione Si se modifica el campo cuando desee utilizar un campo de cabecera como campo dependiente  Seleccione Al salir de columna modificada o Cuando el valor de la columna cambie si desea utilizar otro campo de línea como campo dependiente  Si necesita que la consulta se ejecute cuando se seleccione el artículo, utilice siempre uno de los campos dependientes para que sea Núm. artículo o Descripción  En una consulta añadida a un campo de cabecera de un documento, como campo dependiente solo puede seleccionar otro campo de cabecera. Esto incluye todos los campos del documento que no están en la tabla de línea.  En una consulta añadida a un campo de línea, como campo dependiente puede seleccionar un campo de cabecera o un campo de línea. Cuando se añaden valores definidos por el usuario a un campo de línea y se selecciona Actualización automática, tiene dos opciones:  Seleccione Si se modifica el campo cuando desee utilizar como campo dependiente un campo de cabecera en una consulta a nivel de línea.  Seleccione Al salir de columna modificada o Cuando el valor de la columna cambie si desea utilizar otro campo de línea como campo dependiente  Si necesita que la consulta se ejecute cuando se seleccione el artículo, utilice siempre uno de los campos dependientes para que sea Núm. artículo o Descripción  En el ejemplo se añade una consulta a un campo de fila llamado Comisión. La consulta calcula el importe de comisión multiplicando la cantidad, el precio y el porcentaje de comisión.  La consulta se ejecutará cuando se seleccione por primera vez el número de artículo y si el usuario actualiza la cantidad o el precio.

---

## Diapositiva 20

20 20 PUBLIC Opciones de actualización automática en campos a nivel de línea Para una consulta añadida a un campo a nivel de fila, que depende de otros campos de fila, seleccione entre las dos opciones: Seleccione Al salir de columna modificada para desencadenar la ejecución de los UDV en función de los campos editables Seleccione Cuando el valor de la columna cambie para desencadenar la ejecución de los UDV en función de todos los campos disponibles en la fila, incluidos los campos no editables, como el importe del impuesto, el importe de ganancia bruta, etc.  Para una consulta añadida a un campo a nivel de fila, que depende de otros campos de fila, seleccione entre las dos opciones:  Seleccione Al salir de columna modificada para desencadenar la ejecución de los UDV en función de los campos editables  Seleccione Cuando el valor de la columna cambie para desencadenar la ejecución de los UDV en función de todos los campos disponibles en la fila, incluidos los campos no editables, como el importe del impuesto, el importe de ganancia bruta, etc.

---

## Diapositiva 21

21 21 PUBLIC Valores definidos por el usuario: Puntos clave Puntos clave de este tema:  Los valores definidos por el usuario (UDV) pueden ayudar a usuarios con la entrada de datos con una lista de valores o una consulta para completar un valor de campo.  Puede añadir UDV a los campos de cabecera y de línea editables y a campos definidos por el usuario. Para añadir UDV, seleccione el campo y pulse Alt+Shift+F2.  El icono de lupa muestra si un campo tiene UDV en Ver > Visualización de colectores  El usuario puede abrir una lista de valores o ejecutar una consulta manualmente con el icono o las teclas Shift+F2 en el campo  Para que una consulta se ejecute automáticamente, utilice la actualización automática y seleccione campos dependientes. Luego seleccione una opción:  Actualizar regularmente,la consulta se ejecuta cada vez que el campo dependiente se modifica o selecciona.  Visualizar valores grabados definidos por usuario: la consulta se ejecuta una vez y conserva el resultado en el campo.  Las consultas se deben escribir para hacer referencia a la ventana activa.  Tómese un momento para revisar estos puntos clave:  Los valores definidos por el usuario (UDV) pueden ayudar a usuarios con la entrada de datos utilizando una lista de valores o una consulta para completar un valor de campo.  Puede añadir UDV a los campos de cabecera y de línea editables y a cualquier campo definido por el usuario. Para añadir UDV, seleccione el campo y pulse Alt+Shift+F2.  Si para un campo existen valores definidos por el usuario, se visualiza un icono de lupa. Puede activarlo desde el menú Ver > Visualización de colectores.  Se pueden configurar los valores definidos por el usuario como lista de valores o, más frecuentemente, como consulta de usuario.  El usuario puede abrir la lista de valores o ejecutar manualmente una consulta con el icono de lupa o con las teclas Shift+F2 en el campo.  Si se utiliza una consulta, sus resultados se graban en el campo de destino. Para que la consulta se ejecute automáticamente sin que el usuario participe, utilice la opción actualizar automáticamente y seleccione un campo dependiente. Luego, seleccione una de las dos opciones para ejecutar la consulta:  Si selecciona Actualizar regularmente, la consulta se ejecutará cada vez que el campo dependiente se modifique o se seleccione, o bien, al explorar registros. Según la consulta, esto puede ocasionar resultados incoherentes o que el rendimiento baje al explorar los registros.  Si selecciona Visualizar valores grabados definidos por usuario, la consulta se ejecutará una vez y se conservará el resultado en el campo. Se recomienda esta opción ya que conserva el valor inicial del campo, pero depende de las necesidades de la empresa y de la consulta.  Las consultas deben escribirse haciendo referencia a la ventana activa, cuando sea necesario.

---

