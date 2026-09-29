# Transcripción por Diapositiva: 10_Impl_16_CustomTools_UserDefinedTables_ES

## Diapositiva 1

PUBLIC Herramientas de personalización: Tablas definidas por el usuario SAP Business One Versión 10.0 Bienvenido al tema sobre Tablas definidas por el usuario. 1

---

## Diapositiva 2

 Al finalizar este tema, podrá:  Añadir una tabla definida por el usuario (UDT) a la base de datos de empresa de SAP Business One y hacer que sea accesible en un documento o formulario.  Crear un objeto definido por el usuario (UDO) desde una tabla de usuario y hacer que el objeto sea accesible desde el menú principal. 2 2 PUBLIC Objetivos Objetivos:  Añadir una tabla definida por el usuario (UDT) a la base de datos de SAP Business One y hacer que sea accesible en un documento o formulario  Crear un objeto definido por el usuario (UDO) desde una tabla definida por el usuario y hacer que el objeto sea accesible desde el menú principal

---

## Diapositiva 3

3 PUBLIC  La empresa desea asignar un conductor de entrega a los documentos de entrega. Los conductores de entrega pueden mantenerse en una tabla definida por el usuario a la que se puede acceder desde el documento de entrega.  La tabla puede ser mantenida por los usuarios. Escenario empresarial Pedido de cliente Entrega Factura de clientes Cobro  Una empresa desea la capacidad de asignar un vehículo de entrega a los documentos de entrega.  La flota de entrega puede mantenerse como una tabla definida por el usuario y hacer que esté disponible para el documento de entrega.  Los usuarios pueden gestionar las entradas de la flota en la tabla. 3

---

## Diapositiva 4

4 PUBLIC Tablas definidas por el usuario  Las tablas definidas por el usuario (UDT) almacenan conjuntos de datos relacionados  Las tablas de usuario tienen el prefijo @  Opción de copiar UDT al crear una nueva empresa Herramientas → Herramientas de customizing → Tablas definidas por el usuario - Configuración @Conductores  Además de los campos definidos por el usuario, puede añadir tablas nuevas a la base de datos. Las tablas definidas por el usuario (UDT) permiten almacenar conjuntos adicionales de datos relacionados.  Las tablas definidas por el usuario pasan a formar parte de la base de datos de la empresa. El sistema identifica las tablas definidas por el usuario con el prefijo ‘@’ para que pueda distinguirlas fácilmente de las tablas del sistema.  Cuando crea una nueva empresa, tiene la opción de copiar tablas definidas por el usuario de la empresa actualmente seleccionada en la nueva empresa. 4

---

## Diapositiva 5

5 PUBLIC Tipo de objeto para tablas definidas por el usuario  Para configurar una tabla, introduzca el nombre y la descripción, y seleccione el tipo de objeto Tipo de objeto: Para vincular la tabla con un campo definido por el usuario (UDF) en un documento o formulario, seleccione:  Ningún objeto  Ningún objeto con incremento automático Para vincular la tabla con un objeto definido por el usuario (UDO), seleccione: • Datos maestros • Líneas de datos maestros • Documento • Líneas de documento Herramientas → Herramientas de customizing → Tablas definidas por el usuario - Configuración  Las tablas definidas por el usuario pueden vincularse con un campo definido por el usuario (UDF) en un documento o formulario. Para ello, debe seleccionar el tipo de objeto correcto cuando cree la tabla.  Para vincular con un UDF, seleccione Sin objeto o Sin objeto con incremento automático.  Para vincular con un objeto definido por el usuario (UDO), seleccione una de las otras opciones:  Seleccione Datos maestros si el objeto va a contener datos maestros. También puede crear tablas de nivel inferior seleccionando Líneas de datos maestros como el tipo de objeto.  Seleccione Documento si el objeto va a contener datos de transacciones. También puede crear tablas de nivel inferior seleccionando Líneas de documento como el tipo de objeto.  Tenga en cuenta que no puede cambiar el Tipo de objeto después de haber añadido la tabla de usuario al sistema. 5

---

## Diapositiva 6

6 PUBLIC Información sobre tablas definidas por el usuario  La información acerca de nuevas tablas se almacena en la tabla OUTB  La información de cada tabla nueva se almacena en la tabla OUTB del sistema. La información incluye el tipo de objeto. 6

---

## Diapositiva 7

Vínculo de una tabla definida por el usuario a un UDF  Para vincular la tabla con un campo definido por el usuario (UDF) en un documento o formulario, cree la tabla con el tipo de objeto Sin objeto. 7

---

## Diapositiva 8

8 PUBLIC Acceso a una nueva tabla Herramientas → Ventanas definidas por el usuario  Acceda a la nueva tabla desde el menú Herramientas  La tabla contiene inicialmente dos columnas: código y nombre  Accederá a una tabla definida por el usuario creada recientemente seleccionando la tabla desde el menú Herramientas.  La tabla contiene inicialmente dos columnas: código y nombre. 8

---

## Diapositiva 9

9 PUBLIC Introducción de datos en una nueva tabla  Si el tipo de objeto fuera Sin objeto, el campo Código es editable  Si el tipo de objeto fuera Sin objeto con incremento automático, el campo Código no es editable y se incrementa automáticamente  Código es la clave principal y Nombre debe ser único en cada línea Clave principal Único  En nuestro escenario, queremos utilizar la tabla en un campo definido por el usuario en un documento de entrega. Por lo tanto, cuando configuramos la tabla, pudimos seleccionar Sin objeto o Sin objeto con incremento automático como el tipo de objeto.  Si selecciona Sin objeto como el tipo de objeto cuando crea la tabla, la columna Código es editable y puede introducir un valor único para cada línea.  Si selecciona Sin objeto con incremento automático como el tipo de objeto, la columna Código no es editable y el valor se incrementará automáticamente para cada línea de datos que introduzca. Seleccionamos esta opción para que la clave principal se actualice por nosotros.  El Código es la clave principal y el Nombre debe ser único para cada línea que añada a la tabla. Además, tiene la opción de seleccionar cualquier campo o combinación de campos de la tabla de usuario para formar una clave nueva. Esta opción puede acelerar las búsquedas. 9

---

## Diapositiva 10

10 PUBLIC Cómo añadir columnas a una UDT Herramientas → Herramientas de customizing → Campos definidos por el usuario - Gestión  Para añadir columnas a la tabla, seleccione la tabla y elija Añadir  Para que resulte útil, una tabla definida por el usuario necesita columnas adicionales. Cada columna se añade como un campo definido por el usuario.  Seleccione el nombre de la tabla en la ventana de gestión de campos definidos por el usuario. A continuación, añada un campo definido por el usuario para cada columna.  En el ejemplo, hemos añadido cuatro columnas adicionales: Nombre, Turno, Disponible y Ubicación a la tabla Conductores de entrega. En estos campos registraremos el nombre del conductor, su horario de trabajo, si se encuentra disponible para la asignación y su ubicación. Con esta información, un usuario podrá seleccionar el mejor conductor para la entrega.  Para disponer de información sobre campos definidos por el usuario, consulte el curso relacionado Campos definidos por el usuario. 10

---

## Diapositiva 11

11 PUBLIC Visualización de las columnas añadidas a una UDT  Para introducir datos en las columnas adicionales o para añadir nuevas líneas a la tabla, abra la tabla desde el menú Herramientas  Si no visualiza las columnas nuevas en la ventana, ajuste su ancho Herramientas →Ventanas definidas por el usuario Columnas adicionales  Después de añadir columnas adicionales a la tabla, puede introducir datos o añadir nuevas líneas seleccionando el menú Herramientas > Ventanas definidas por el usuario. Elija y seleccione la tabla. Si no visualiza las columnas nuevas en la ventana, tal vez deba ajustar su ancho para poder ver los campos nuevos. 11

---

## Diapositiva 12

12 PUBLIC Consultas  La tabla definida por el usuario aún no se encuentra adjunta a un formulario o documento, sino que puede utilizarse en consultas  El nombre de tabla comienza con @  Las columnas son UDF por lo que empiezan con U_  También puede importar datos en la tabla por medio de Data Transfer Workbench.  En este punto, la tabla definida por el usuario no está adjunta a ningún formulario o documento por lo que no es accesible para el usuario; sin embargo, puede utilizarla en consultas e importarle datos mediante Data Transfer Workbench. 12

---

## Diapositiva 13

13 PUBLIC Vínculo de la tabla con un UDF Herramientas → Herramientas de customizing → Campos definidos por el usuario - Gestión  Para hacer que la tabla sea accesible a los usuarios, vincúlela a un UDF en un documento o formulario  Los UDF deben ser Alfanuméricos. Nota: Puede vincular la misma tabla definida por el usuario a varios campos definidos por el usuario.  Para hacer visible una tabla de usuario directamente a los usuarios en un formulario o documento, puede vincular la tabla a un campo definido por el usuario en el documento o formulario.  Tenga en cuenta que las tablas de usuario solo se pueden vincular con UDF de tipo Alfanumérico y estructura Regular.  En este ejemplo, un campo definido por el usuario denominado Conductores se añade al área del título del objeto de documentos de marketing. Cuando añada el campo definido por el usuario, seleccione la opción de validación Fijar tabla vinculada. A continuación, seleccione la tabla definida por el usuario de la lista desplegable.  Puede vincular la misma tabla definida por el usuario a varios campos definidos por el usuario en diferentes objetos, tanto en la cabecera como a nivel de línea. Por ejemplo, podría vincular la tabla de camiones a un campo definido por el usuario en el documento de lista de picking además del documento de entrega. 13

---

## Diapositiva 14

14 PUBLIC Uso de la UDT en un documento  Para ver y acceder a todas las columnas, seleccione Definir nuevo  Cuando seleccione el campo definido por el usuario, puede ver las primeras dos columnas. Seleccione Definir nuevo para ver y acceder a todas las columnas de la tabla.  El usuario puede editar y añadir líneas a la tabla. 14

---

## Diapositiva 15

15 PUBLIC Selección del valor desde la UDT El valor seleccionado en la tabla definida por el usuario se almacena en el campo definido por el usuario  En este ejemplo, el cliente ha solicitado una entrega por la noche, por lo que se ha seleccionado un conductor disponible para ello. El Nombre de la tabla definida por el usuario se almacena ahora en el campo definido por el usuario en el documento. 15

---

## Diapositiva 16

Vínculo de una UDT a un objeto definido por el usuario  Para vincular una tabla de usuario con un objeto definido por el usuario (UDO), cree la tabla con el tipo de objeto Datos maestros o Documento. 16

---

## Diapositiva 17

17 PUBLIC Cómo añadir campos a la tabla de usuario para UDO  Para vincular una tabla de usuario con un objeto definido por el usuario (UDO), cree la tabla con el tipo de objeto Datos maestros o Documento.  Un Objeto definido por el usuario (UDO) está formado por una UDT y UDF añadidos  Estos campos contendrán datos para el nuevo objeto empresarial  Para añadir campos definidos por el usuario a la tabla de usuario, utilice la vía de acceso mostrada aquí o utilice la DI API Herramientas → Herramientas de customizing → Campos definidos por el usuario - Gestión  Para vincular una tabla de usuario con un objeto definido por el usuario (UDO), asegúrese de haber creado la tabla con el tipo de objeto Datos maestros o Documento.  Un objeto definido por el usuario está formado por una tabla definida por el usuario y campos añadidos definidos por el usuario. Estos campos contendrán los datos para el nuevo objeto empresarial.  Puede añadir campos definidos por el usuario utilizando la aplicación SAP Business One o a través de la DI API. En este ejemplo, hemos creado una tabla de usuario denominada Coches de la empresa como un objeto de datos maestros.  Hemos añadido 4 campos definidos por el usuario. 17

---

## Diapositiva 18

18 PUBLIC Registro de la nueva tabla como un objeto Utilice el asistente de registro para registrar tablas de usuario como objetos definidos por el usuario El registro se realiza por empresa Introduzca un ID único y seleccione la tabla Seleccione los servicios para el objeto, como por ejemplo: Agregar Actualizar Buscar Borrar Opcionalmente, seleccione la tabla de nivel inferior como líneas Herramientas → Herramientas de customizing → Asistente de registro de objetos  Una vez que haya creado la tabla de usuario con los campos definidos por el usuario, tiene que registrarla como objeto en SAP Business One utilizando el Asistente de registro de objetos. El registro se realiza por empresa.  Introduzca un ID único y seleccione el nombre de la tabla definida por el usuario.  A medida que avance por el asistente, se le pedirá que seleccione los servicios para el objeto, por ejemplo, Añadir, Actualizar, Buscar, Borrar. Añadir y Actualizar son servicios básicos y no pueden desmarcarse.  Puede seleccionar de forma opcional una tabla de nivel inferior, que aparecerá como líneas en los datos maestros u objeto del documento. Las tablas de nivel inferior se crean seleccionando el tipo de objeto como Líneas de documento o Líneas de datos maestros. 18

---

## Diapositiva 19

19 PUBLIC Cómo añadir el objeto al menú principal  Para añadir el objeto como una opción de menú, seleccione la casilla de selección Opción de menú y seleccione el módulo y posición  Puede añadir el objeto al menú principal seleccionando la casilla de selección Opción de menú en el asistente. A continuación, seleccione el módulo del formulario de selección y la posición dentro del menú del módulo. 19

---

## Diapositiva 20

20 PUBLIC Tipo de la nueva tabla Tipo matriz Tipo línea de cabecera  Puede seleccionar Tipo línea de cabecera o Tipo matriz en el asistente. Esto afectará a cómo se mostrará la tabla cuando un usuario acceda a ella. A continuación, se muestran algunos ejemplos. 20

---

## Diapositiva 21

21 PUBLIC Tablas definidas por el usuario: Puntos clave Puntos clave de este tema: Puede añadir tablas definidas por el usuario (UDT) a la base de datos para mantener información adicional y relacionada Las tablas definidas por el usuario tienen el prefijo “@” Para vincular una tabla definida por el usuario con un campo definido por el usuario en un documento o formulario:  Seleccione Tipo de objeto como Sin objeto o Sin objeto con incremento automático  La tabla se crea inicialmente con dos columnas: código y nombre.  Añada campos definidos por el usuario como columnas adicionales en la tabla  Para hacer que la tabla se encuentre disponible en un documento o formulario, vincule la tabla con un campo definido por el usuario en el documento o formulario (seleccione la opción Fijar tabla vinculada).  Para utilizar una tabla como un objeto definido por el usuario:  Seleccione el Tipo de objeto como Datos maestros o Documento  Añada campos definidos por el usuario como columnas  Ejecute el asistente de registro de objetos para crear el objeto definido por el usuario, seleccione los servicios del objeto, seleccione tablas de nivel inferior para líneas y añada el objeto al menú principal.  Estos son algunos puntos que hay que destacar sobre las tablas definidas por el usuario:  Puede añadir sus propias tablas definidas por el usuario a la base de datos. Estas tablas pueden albergar información adicional relacionada.  Las tablas definidas por el usuario se pueden identificar con el prefijo “@”.  Para poder vincular una tabla definida por el usuario con un campo definido por el usuario en un documento o formulario, seleccione el Tipo de objeto como Sin objeto o Sin objeto con incremento automático.  La tabla se crea inicialmente con dos columnas: código y nombre.  Los campos definidos por el usuario pueden añadirse como columnas adicionales en la tabla.  Para hacer que una UDT sea accesible para un usuario en un documento o formulario, cree un campo definido por el usuario en el documento o formulario y seleccione la opción Fijar tabla vinculada para vincular la tabla con el UDF. Solo las UDT con Tipo de objeto Sin objeto o Sin objeto con incremento automático pueden vincularse con un UDF. Los usuarios finales pueden acceder a la tabla a través del UDF, y tienen la posibilidad de añadir líneas a la tabla e introducir datos en las columnas del campo definido por el usuario.  Para utilizar una tabla como objeto definido por el usuario (UDO), seleccione el Tipo de objeto como Datos maestros o Documento.  Añada campos definidos por el usuario a la tabla como columnas.  Ejecute el asistente de registro de objetos para crear el objeto, seleccione los servicios para el objeto, seleccione cualquier tabla de nivel inferior para líneas en el objeto y añada el objeto al menú principal. Los usuarios pueden acceder y mantener el objeto desde el menú y navegar por registros. 21

---

