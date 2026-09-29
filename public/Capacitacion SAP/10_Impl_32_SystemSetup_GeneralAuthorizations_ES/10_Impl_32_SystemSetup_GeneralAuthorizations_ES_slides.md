# Transcripción por Diapositiva: 10_Impl_32_SystemSetup_GeneralAuthorizations_ES

## Diapositiva 1

PUBLIC Configuración y gestión del sistema: Autorizaciones generales SAP Business One Versión 10.0 Bienvenido al tema Autorizaciones generales. 1

---

## Diapositiva 2

 Al completar este tema, podrá describir el proceso de asignación manual de autorizaciones generales a un usuario para que pueda acceder a funciones y menús de SAP Business One.  También aprenderá a cómo definir y utilizar grupos de autorizaciones para asignar eficientemente un conjunto de autorizaciones generales a varios usuarios.  Podrá explicar la diferencia entre autorizaciones y autorizaciones efectivas.  Finalmente, aprenderá algunos consejos para ahorrar tiempo a la hora de copiar un conjunto de autorizaciones generales de un usuario a otros usuarios. 2 2 PUBLIC Objetivos: Describir el proceso para asignar manualmente autorizaciones generales a un usuario Definir grupos de usuarios de autorización para asignar de forma eficiente un grupo de autorizaciones a varios usuarios Explicar la diferencia entre autorizaciones y autorizaciones efectivas Copiar autorizaciones generales de un usuario en otros usuarios Objetivos

---

## Diapositiva 3

 DG Industries tiene 15 usuarios en el departamento de ventas. Estos usuarios necesitan autorización para menús de Ventas y funciones en SAP Business One.  Además, el jefe de ventas necesita acceder a los informes del volumen de ventas y paneles de análisis de ventas. Este es un ejemplo muy sencillo de requisito de autorización, y en la vida real los requisitos serían mucho más complejos.  Existen varias formas de implementar estas autorizaciones de forma optimizada:  Opción 1: Configurar un usuario con las autorizaciones requeridas y copiar el conjunto de autorizaciones en los demás usuarios de ventas, incluyendo el jefe de ventas. Especifique manualmente las autorizaciones del jefe de ventas para añadir las autorizaciones adicionales necesarias para el rol.  Opción 2: Cree un nuevo grupo de usuarios de autorización basado en el grupo de autorizaciones de ventas por defecto. Asigne todos los usuarios a este grupo incluyendo el jefe de ventas y, a continuación, realizar el ajuste fino de las autorizaciones para el jefe de ventas.  En este curso, aprenderá cómo funcionan las dos opciones. 3 3 PUBLIC DG Industries tiene 15 usuarios en el departamento de ventas. Estos usuarios necesitan autorización para menús de Ventas y otras funciones relacionadas con las ventas en SAP Business One. Además, el jefe de ventas necesita acceso a los informes del volumen de ventas y a los paneles de análisis de ventas. Opción 1: Configure autorizaciones generales para un usuario de ventas y posteriormente copie dichas autorizaciones en otros usuarios de ventas, incluyendo el jefe de ventas. A continuación, ajuste manualmente de las autorizaciones para el jefe de ventas. Opción 2: Cree un grupo de usuarios (autorización de tipo). Fije las autorizaciones necesarias y asigne todos los usuarios de ventas a este grupo, incluido el jefe de ventas.  Realice el ajuste fino manualmente de las autorizaciones para el jefe de ventas. Ejemplo empresarial

---

## Diapositiva 4

Introducción a autorizaciones generales 4

---

## Diapositiva 5

5 PUBLIC Acceder a la funcionalidad del sistema A los usuarios que no sean superusuarios es necesario asignarles tanto una licencia autorización general a los menús como las funciones necesarias para su rol:  Licencia determina las funciones para las que el usuario dispone de contrato legal de uso  Autorizaciones generales permiten al usuario acceder a las funciones y objetos de menú requeridas por el rol de trabajo del usuario dentro del alcance del tipo de licencia asignada  Cuando se crea una cuenta de usuario para un usuario normal (no un superusuario), el usuario puede iniciar sesión en SAP Business One aunque no puede acceder a ninguna funcionalidad.  El usuario requiere una licencia y autorizaciones generales a las funciones y menús con las que deben trabajar.  El tipo de licencia asignado a cada usuario determina las funciones y documentos para las cuales el usuario posee contrato legal de uso. Si el usuario intenta acceder a una función que se encuentra fuera del alcance de la licencia, recibirá un error generado por el servidor de licencias.  Las autorizaciones generales concedidas a un usuario permiten al usuario acceder o actualizar las funciones y objetos de SAP Business One dentro del alcance del tipo de licencia asignada. Estas autorizaciones permiten a una empresa limitar el acceso a menús y funciones en base a los requisitos del rol de trabajo del usuario. Si el usuario no tiene autorización a un menú, el usuario obtendrá un error de autorización cuando intente acceder al menú.  Tenga en cuenta que la asignación de una autorización general a un usuario para una función que no está permitida por el tipo de licencia asignado no concederá al usuario permiso para acceder a dicha función. 5

---

## Diapositiva 6

6 PUBLIC Autorizaciones para superusuarios Gestión Inicialización del sistema AutorizacionesAutorizaciones generales  La ventana de autorizaciones muestra una lista de autorizaciones concedidas a un usuario seleccionado  Las autorizaciones se enumeran por área temática y generalmente se corresponden con el menú principal Superusuario  Un superusuario tiene la autorización total a todos los menús y funciones y requiere una licencia profesional  No puede modificar las autorizaciones para un superusuario  La ventana de autorizaciones generales muestra la lista de autorizaciones concedidas a un usuario seleccionado. La cuenta de usuario se selecciona en la parte izquierda de la ventana en la ficha Usuarios.  Las autorizaciones se enumeran por área temática, pueden ampliarse y generalmente se corresponden con el menú principal.  Un usuario definido como superusuario tiene la autorización total a todos los menús y funciones de SAP Business One y no puede modificar las autorizaciones para este usuario ya que la selección está desactivada.  En el ejemplo, el usuario seleccionado es un superusuario y tiene la autorización total a todos los menús y funciones. Por ese motivo, un superusuario debe tener asignada una licencia profesional. 6

---

## Diapositiva 7

7 PUBLIC Autorizaciones para usuarios normales Gestión Inicialización del sistema AutorizacionesAutorizaciones generales  Inicialmente, un usuario normal creado recientemente no dispone de autorizaciones y, por lo tanto, no tiene acceso a menús ni funciones  Las autorizaciones deben establecerse para el usuario con el fin de que pueda realizar su trabajo  Las autorizaciones deben concederse de acuerdo con la licencia comprada para el usuario Usuario normal  Por defecto, todos los usuarios recientemente creados y que no son superusuarios no tienen autorizaciones para ningún menú ni función de SAP Business One. Las autorizaciones generales deben establecerse para cada usuario con el fin que de puedan realizar su trabajo. En el ejemplo, el usuario seleccionado es un usuario normal e inicialmente no dispone de ninguna autorización para menús ni funciones.  Nota: las autorizaciones deben concederse de acuerdo con la licencia comprada para el usuario. Dispone del cuadro comparativo de licencias para descargarlo del portal PartnerEdge. Este cuadro muestra los derechos de acceso para cada tipo de licencia. 7

---

## Diapositiva 8

8 PUBLIC Autorización temporal  Si el usuario no tuviera autorización para una función, aparecerá un mensaje emergente  Un superusuario puede permitir temporalmente acceso de una sola vez  No se permite que los usuarios accedan a un formulario, informe o documento del que no tengan autorización.  En el ejemplo, un usuario de CRM quiere ver la previsión de flujo de caja. Aunque no tiene autorización para acceder a dicha función. Cuando intenta acceder a la opción de menú, aparece un mensaje emergente indicándole que no tiene autorización.  Un superusuario puede permitir temporalmente a un usuario acceso de una sola vez a la función.  Si el usuario necesitara acceso permanente a la función, entonces debe tener asignada una autorización general. 8

---

## Diapositiva 9

Establecimiento manual de autorizaciones La opción 1 del escenario empresarial, asigna manualmente autorizaciones a un usuario de ejemplo y copia las autorizaciones en otros usuarios. 9

---

## Diapositiva 10

10 PUBLIC Establecimiento manual de autorizaciones Gestión Inicialización del sistema AutorizacionesAutorizaciones generales 1. Seleccione la cuenta de usuario 2. Para cada área temática, seleccione Autorización total o De solo lectura de la lista desplegable 3. Solo superusuarios o usuarios autorizados pueden establecer autorizaciones para usuarios 4. Para disponer de una explicación completa de cada autorización, consulte la guía práctica  Para establecer una autorización manualmente, abra la ventana de autorizaciones y en la ficha Usuarios seleccione el usuario. A continuación, abra la lista desplegable para cada menú o función y seleccione Autorización total o Solo lectura:  Si selecciona Autorización total, entonces el usuario podrá visualizar y modificar datos para dicha función. Por ejemplo, si se seleccionara esta autorización para la función Oferta de ventas, un usuario podría ver, crear y actualizar las ofertas de ventas.  Si selecciona Solo lectura, entonces el usuario podrá ver, aunque no cambiar ningún dato.  Solo los superusuarios o usuarios autorizados pueden establecer autorizaciones para usuarios.  Para disponer de una explicación completa de cada autorización general, consulte la guía práctica Cómo definir autorizaciones. 10

---

## Diapositiva 11

11 PUBLIC Establecimiento manual de autorizaciones (Cont.) Al fijar una autorización al nodo superior de un asunto, la misma autorización se aplica a todos los menús de nivel inferior Si asigna o cambia la autorización en un nivel inferior, el nodo de nivel superior cambiará a Varias autorizaciones  Cuando asigne una autorización para un módulo, como por ejemplo Ventas – Clientes, la misma autorización se aplicará a todos los submenús dentro del módulo.  Si asigna o cambia una autorización en un nivel inferior del módulo, la autorización de nivel superior cambiará a Varias autorizaciones para indicar que existen autorizaciones establecidas por debajo en el árbol. 11

---

## Diapositiva 12

12 PUBLIC Establecimiento manual de autorizaciones (Cont.) Para cada usuario puede:  Limite el descuento que pueden ofrecer en ventas, compras y/o otras ventanas  Fije el importe máximo de los pagos recibidos  En la ventana de autorizaciones también puede establecer el máximo descuento que un usuario puede ofrecer en ventas, compras o en otras formas como por ejemplo datos maestros del interlocutor comercial y condiciones de pago. Si el porcentaje de descuento es cero, no se permitirá que el usuario introduzca ningún descuento.  En el ejemplo mostrado aquí, se permite que el usuario introduzca descuentos de hasta el 15% en documentos de ventas.  También puede permitir la cantidad de efectivo que se permite que introduzca un usuario en un pago recibido (ventana Medio de pago, ficha Efectivo). Cuando seleccione la casilla de selección podrá introducir el importe de caja. 12

---

## Diapositiva 13

13 PUBLIC Copiar autorizaciones Para copiar un conjunto de autorizaciones en varios usuarios, seleccione el usuario fuente, seleccione el botón Copiar autorizaciones y seleccione los usuarios destino También puede copiar autorizaciones en un único usuario utilizando arrastrar y soltar  Para ahorrar tiempo, puede copiar las autorizaciones de un usuario en otros usuarios.  En la ventana de autorizaciones, seleccione el usuario y posteriormente el botón Copiar autorizaciones. Aparecerá una lista de usuarios y podrá seleccionar varios usuarios destino para la copia.  También puede copiar las autorizaciones de un usuario seleccionado a otro manteniendo pulsado el ratón sobre el nombre del usuario origen hasta que aparezca un rectángulo negro, y posteriormente soltar el rectángulo sobre el usuario destino. El sistema le pedirá que confirme si desea copiar las autorizaciones. 13

---

## Diapositiva 14

Grupos de usuarios de autorización La opción 2 del escenario empresarial asigna autorizaciones a los usuarios en el nivel de grupo de usuarios de autorización. 14

---

## Diapositiva 15

15 PUBLIC Ahorro de tiempo – Grupos de usuarios de autorización Gestión > Definiciones > General > Opciones de usuario  Los grupos de usuarios de autorización son conjuntos de autorizaciones predefinidos que se pueden asignar a varios usuarios  El sistema proporciona cuatro grupos de usuarios de autorización por defecto –finanzas, ventas, compras e inventario – que contienen las autorizaciones generalmente requeridas para estos roles  Puede utilizar estos grupos de usuarios predeterminados, editarlo, copiarlos en nuevos grupos de usuarios o crear nuevos grupos de usuarios desde el principio  El establecimiento de autorizaciones por usuario puede requerir tiempo. Si una empresa tuviera varios usuarios con el mismo rol, o trabajara con el mismo conjunto de funciones, resultaría más eficiente utilizar un grupo de usuarios de autorización.  Los grupos de usuarios de autorización son conjuntos de autorizaciones predefinidos que se pueden asignar a varios usuarios.  En un nuevo sistema, existen cuatro grupos por defecto definidos por SAP que contienen las autorizaciones generalmente requeridas para los roles relacionados con finanzas, ventas, compras e inventario.  Puede utilizar estos grupos de usuarios predeterminados, editarlo, copiarlos para crear nuevos grupos de usuarios o crear sus propios grupos de usuarios desde el principio 15

---

## Diapositiva 16

16 PUBLIC Creación de un nuevo grupo de usuarios de autorización Gestión > Definiciones > General > Opciones de usuario Seleccione el botón Crear grupo. Seleccione el Tipo de grupo como Autorización o En todos los tipos Opciones:  Fijar rango de fecha activo para el grupo  Seleccionar un modelo de cockpit (solo SAP HANA)  Fijar rango de fecha activo por usuario Nota: También se pueden crear grupos de usuarios para otros tipos de uso. Para obtener más información acerca de estos grupos, consulte el curso Usuarios y opciones de usuario.  Para crear un nuevo grupo de autorizaciones, seleccione el botón Crear grupo e introduzca un nombre y descripción.  Seleccione el Tipo de grupo como Autorización o En todos los tipos  Tiene la opción de fijar una fecha activa cuando se cree un nuevo grupo. Esto le permite predefinir las autorizaciones y desplegarlas en una fecha posterior. También puede fijar un rango de fecha activo para cada usuario individual que añade al grupo.  Para SAP HANA puede asociar un modelo de cockpit publicado predefinido que deberá asignar a todos los miembros del grupo. SAP proporciona modelos de Ventas, Finanzas e Inventario listos para usar, pero también puede añadir sus propios modelos de cockpit. Para más información sobre los modelos de cockpit, consulte el tema Primeros pasos en programa de resumen. Nota: Los grupos de usuarios también pueden crearse para otros tipos de uso (por ejemplo, alertas y parametrizaciones de formulario). Para obtener más información acerca de estos grupos consulte el curso Usuarios y Grupos de usuarios en este programa. 16

---

## Diapositiva 17

17 PUBLIC Configuración de autorizaciones en el nivel de grupo  Los grupos de usuarios del tipo Autorización y En todos los tipos son visibles en la ventana de autorizaciones (etiqueta Grupos)  Fije las autorizaciones para el grupo como lo haría para un usuario  Los grupos de usuarios del tipo Autorización y En todos los tipos son visibles en la ventana de autorizaciones.  Para establecer autorizaciones para un grupo de usuarios, seleccione la ficha Grupos en la ventana de autorizaciones y seleccione el grupo predefinido. Luego, puede fijar las autorizaciones como lo haría de forma manual para un usuario.  Las autorizaciones se aplicarán al instante a todos los usuarios del grupo. 17

---

## Diapositiva 18

18 PUBLIC Copia de autorizaciones en un grupo de autorizaciones nuevo  En lugar de establecer las autorizaciones de forma manual para un grupo nuevo, puede copiar autorizaciones de uno de los grupos predefinidos  A continuación, puede ajustar manualmente según las necesidades únicas de la empresa  En lugar de establecer las autorizaciones de forma manual para un nuevo grupo de usuarios, puede copiar las autorizaciones de uno de los grupos de usuarios predefinidos proporcionados y listos para utilizar (Ventas, Compras, Finanzas e Inventario). Esto le proporciona un buen punto de partida para establecer las autorizaciones. Por ejemplo, si crea un grupo nuevo para los gerentes de ventas, puede seleccionar el grupo de usuarios de ventas por defecto como base.  Para ello, seleccione el botón Copiar autorizaciones . A continuación, seleccione el grupo de usuarios de destino.  Luego podrá ajustar las autorizaciones en el nuevo grupo, según sea necesario. 18

---

## Diapositiva 19

19 PUBLIC Asignación de autorizaciones de grupo a una cuenta de usuario Desde la cuenta de usuario: También puede asignar un usuario a un grupo desde la cuenta de usuario En la cuenta de usuario seleccione el botón de puntos suspensivos para el campo Grupos y seleccione un grupo de la lista Cuando asigna un usuario a un grupo, el usuario se añade a la lista del grupo y recibe al instante las autorizaciones generales fijadas para el grupo Nota: Si modifica la autorización de un grupo después de haber asignado usuarios al grupo, dichos usuarios recibirán la autorización modificada.  Además de asignar usuarios a un grupo añadiéndolos en el grupo, puede asignar un usuario a un grupo desde la cuenta de usuario. En la cuenta de usuario seleccione el botón situado a la derecha del campo Grupos y seleccione un grupo de la lista.  Cuando asigna un usuario a un grupo, el usuario se añade a la lista del grupo y recibe al instante las autorizaciones generales fijadas para el grupo.  Nota: Si modifica la autorización de un grupo después de haber asignado usuarios al grupo, dichos usuarios recibirán la autorización modificada.  Puede seleccionar más de un grupo si fuera aplicable para el rol del usuario y si el usuario tuviera la licencia correspondiente. También puede modificar manualmente las autorizaciones para un usuario, incluso si pertenecen a un grupo de usuarios. 19

---

## Diapositiva 20

Gestión de autorizaciones 20

---

## Diapositiva 21

21 PUBLIC Revisión de autorizaciones fijadas Para revisar las autorizaciones de un usuario o grupo de usuarios, seleccione el usuario o nombre del grupo de usuarios y, a continuación, seleccione el icono Exportar a Excel Exportar autorizaciones de grupo de usuarios Exportar autorizaciones de usuario individuales  Desde la ventana Autorizaciones puede exportar el conjunto de autorizaciones de un usuario o grupo de usuarios a Microsoft Excel.  Para exportar las autorizaciones para uno o varios usuarios individuales, seleccione la ficha Usuarios en la ventana de autorizaciones y, a continuación, seleccione el icono Excel en el icono barras y seleccione uno o varios usuarios.  Para exportar las autorizaciones para uno o varios grupos de usuarios, seleccione la ficha Grupos en la ventana de autorizaciones generales y, a continuación, seleccione el icono Excel y seleccione los grupos.  Sugerencia: Durante un proyecto de implementación, debería grabarse con la documentación del proyecto un informe u hoja de cálculo de las autorizaciones asignadas. 21

---

## Diapositiva 22

22 PUBLIC Autorizaciones efectivas para un usuario Autorizaciones combinadas concedidas al usuario Autorizaciones concedidas al usuario manualmente La columna Autorizaciones efectivas muestra las autorizaciones combinadas otorgadas a un usuario ya sea manualmente o desde un grupo de usuarios de autorización.  Existe una columna adicional en la ventana de autorizaciones. Esta columna solo se muestra cuando selecciona un usuario en la ficha Usuarios.  Para ver esta columna, haga clic en la flecha de la parte superior derecha de la matriz o ajuste los anchos de columna manualmente para hacer que se visualice la columna adicional.  La columna Autorización efectiva muestra las autorizaciones combinadas concedidas a un usuario desde un grupo de usuarios de autorización y desde cualquier autorización manual. En caso de que se produzca autorizaciones conflictivas, prevalecerá la autorización más alta (la más generosa).  En el ejemplo, al usuario seleccionado no se le ha concedido ninguna autorización directamente, aunque el usuario dispone de autorizaciones efectivas de un grupo de usuarios de autorización. 22

---

## Diapositiva 23

23 PUBLIC Varios grupos de autorizaciones • Si la cuenta de usuario se asignó a varios grupos de autorizaciones, el usuario podría recibir potencialmente permisos conflictivos para una función específica (Solo lectura, Sin autorización y/o Autorización total) Resultado: • El sistema concederá la autorización más generosa Ventas Inventario Ventas: OEC Grupos de usuario:  El sistema no evita que se asigne un usuario a más de un grupo de autorizaciones. En la cuenta de usuario puede ver los grupos de autorizaciones asignados a un usuario.  Si un usuario se asigna a varios grupos de autorizaciones, entonces puede que existan autorizaciones conflictivas para una función específica.  Por ejemplo, el usuario podría recibir potencialmente los tres permisos para el menú Ventas: clientes (Solo lectura, Sin autorización y/o Autorización total).  En ese caso, el sistema concederá la autorización más alta (la más generosa) y esta aparecerá como la autorización efectiva. 23

---

## Diapositiva 24

24 PUBLIC Log de modificaciones Herramientas >Log de modificaciones...  Se realiza un seguimiento de las modificaciones en las autorizaciones de un usuario o grupo de usuarios en log de modificaciones  Cada línea es una instantánea de lo que se ha modificado  La ventana de diferencias consolida dos líneas seleccionadas  Se realiza un seguimiento de las modificaciones en las autorizaciones de un usuario o grupo de usuarios en el log de modificaciones. Esto proporciona un seguimiento de auditoría.  El log de modificaciones está disponible desde el menú Herramientas cuando la ventana Autorizaciones está abierta y cuando un usuario o grupo de usuarios se selecciona en esta ventana.  Cada línea en el log de modificaciones representa una instantánea de lo que se ha modificado, y puede ver todos los detalles haciendo doble clic en la línea.  También puede seleccionar dos líneas y mostrar las diferencias.  La ventana de diferencias muestra una consolidación de las dos líneas seleccionadas, incluyendo la fecha de modificación, el campo modificado, el valor previo y el nuevo valor, además del nombre de la persona que cambió la autorización. 24

---

## Diapositiva 25

25 PUBLIC Autor de autorización adicional Gestión Inicialización del sistema Autorizaciones Autorizaciones generales Autor de autorización adicional  En esta ventana, los desarrolladores pueden añadir nuevas autorizaciones a la tabla de autorización para controlar el acceso a menús y formularios nuevos  Utilice la información del sistema para buscar el ID de formulario: • En la ventana Autor de autorización adicional, los desarrolladores pueden añadir autorizaciones de usuario a la tabla de autorizaciones. Una autorización de usuario controla el acceso a una nueva opción de menú o formulario de usuario. Puede configurar las autorizaciones posibles como Total/Ninguna o Total/Leída/Ninguna. • Indique un ID y nombre de autorización y el ID de formulario. Para buscar el ID de formulario, abra el formulario y seleccione Vista > Información de sistema en el menú superior. El ID de formulario se muestra en la barra de estado cuando se desplaza sobre el formulario. • La nueva autorización aparece en la ventana de autorizaciones, en el área temática Autorización de usuario. Para obtener más información sobre tablas definidas por el usuario y los objetos definidos por el usuario, consulte el tema Tablas definidas por el usuario en este curso. 25

---

## Diapositiva 26

Autorizaciones para informes 26

---

## Diapositiva 27

27 PUBLIC Informes de ventas y compras Opción para autorizar o restringir el acceso a todos los informes de ventas y compras, en la lista de partidas abiertas, o en tipos de documento individuales en la lista de partidas abiertas Los informes de ventas y compras contienen información confidencial y es posible que la empresa desee restringir el acceso a estos informes. Puede restringir el acceso a todos los informes de ventas y compras en el área temática Informes, en el informe de lista Partidas abiertas o en tipos de documentos individuales de la lista de partidas abiertas. Si selecciona Sin autorización, el usuario no puede abrir estos informes. 27

---

## Diapositiva 28

28 PUBLIC Informes de análisis Capacidad para autorizar o restringir el acceso a • Informe de Excel e Interactive Designer • Informes de análisis interactivos • Vistas de capa semántica • KPI, cockpits y paneles Puede autorizar o restringir el acceso a informes analíticos de SAP HANA, incluida la capacidad de: • Iniciar la herramienta Informe de Excel e Interactive Analysis Designer • Ver un informe de análisis interactivo de Excel específico (por área funcional o en el nivel de informe específico) • Ver la capa semántica • Acceder a la información de los KPI, cockpits y paneles Nota: En la ventana de autorizaciones puede ver el botón Aplicar autenticación  a back end. Este botón sólo es relevante para las empresas que utilizan Microsoft SQL Server para la producción y SAP HANA para el análisis (B1A). Son necesarias autorizaciones para que los usuarios accedan a la capa semántica (estas autorizaciones se enumeran el área temática Análisis). Después de que las autorizaciones se actualicen, se graban en la base de datos de producción de SAP Business One, pero también deben sincronizarse con el servidor de análisis de SAP HANA subyacente. Para lograr coherencia, SAP recomienda que el servidor de análisis de SAP HANA se detenga al realizar estas modificaciones y, después de grabar las modificaciones, reiniciar el servidor de análisis y utilizar este botón para sincronizar las modificaciones. En la versión actual, la sincronización no es automática y debe realizarla manualmente el administrador pulsando este botón. 28

---

## Diapositiva 29

29 PUBLIC Resumen 1 de 2 Puntos clave de este tema:  A los usuarios que no sean superusuarios es necesario asignarles tanto una licencia autorización general a los menús como las funciones necesarias para su rol:  Un superusuario tiene por defecto autorización total para todas las funciones y necesita una licencia profesional  Los usuarios normales no tienen autorización a ninguna función, por lo que tiene que otorgar autorizaciones generales a cada usuario de acuerdo con la licencia  La ventana de autorizaciones muestra la lista de autorizaciones generales en el mismo orden general que los menús y funciones de SAP Business One  Las autorizaciones también son necesarias para ejecutar informes y para el análisis  Para establecer una autorización, seleccione el usuario, abra la lista desplegable para cada menú o función y seleccione Autorización total o Solo lectura:  Si selecciona Autorización total, el usuario podrá visualizar y modificar datos para dicha función. Por ejemplo, visualizar, crear y actualizar ofertas de ventas  Si selecciona Solo lectura, el usuario podrá visualizar, aunque no podrá modificar ningún dato.  Para ahorrar tiempo, puede copiar las autorizaciones de un usuario en varios usuarios  Las modificaciones en las autorizaciones se registran en el log de modificaciones, para fines de auditoría  Estos son algunos puntos clave de esta sesión.  A los usuarios que no sean superusuarios es necesario asignarles tanto una licencia autorización general a los menús como las funciones necesarias para su rol  Un superusuario tiene autorización total por defecto para todas las funciones de SAP Business One. Los superusuarios necesitan una licencia profesional.  Por defecto, un usuario normal no tiene autorizaciones para ninguna función y deberá otorgar autorizaciones generales a cada usuario de acuerdo con la licencia comprada para el usuario.  La ventana de autorizaciones muestra la lista de autorizaciones generales en el mismo orden general que los menús y funciones de SAP Business One. También se requieren autorizaciones para acceder a informes y análisis.  Para establecer manualmente una autorización, seleccione el usuario y abra la lista desplegable para cada menú o función y seleccione la autorización total o de solo lectura:  Si selecciona Autorización total, el usuario podrá visualizar y modificar datos para dicha función. Por ejemplo, un usuario podría visualizar, crear y actualizar ofertas de ventas  Si selecciona Solo lectura el usuario podrá visualizar, aunque no podrá realizar cambios en ningún dato.  También puede copiar autorizaciones de un usuario en varios usuarios o en un único usuario arrastrando y soltando.  Tenga en cuenta que cualquier cambio en las autorizaciones se registra en el log de modificaciones, para fines de auditoría. 29

---

## Diapositiva 30

30 PUBLIC Resumen 2 de 2 Puntos clave de este tema:  Si una empresa tuviera varios usuarios con el mismo rol, resultaría más eficiente utilizar un grupo de usuario de autorización.  Los grupos de usuarios de autorización son conjuntos de autorizaciones predefinidos que se pueden asignar a varios usuarios  En un nuevo sistema, existen cuatro grupos por defecto que contienen las autorizaciones generalmente requeridas para los roles relacionados con finanzas, ventas, compras e inventario.  Los grupos de usuarios aparecen en la ventana autorizaciones y puede fijar las autorizaciones como lo haría manualmente para un usuario  Cuando se crea un grupo nuevo, puede copiar autorizaciones desde otro grupo de usuarios  La columna Autorización efectiva muestra las autorizaciones combinadas concedidas a un usuario desde un grupo de usuarios de autorización y desde cualquier autorización manual  Si se otorgan varias autorizaciones conflictivas a un usuario, se aplicará la autorización más alta (la más generosa)  Puede exportar autorizaciones asignadas a Microsoft Excel para revisar o para la documentación del proyecto  Estos son algunos puntos clave de esta sesión.  El establecimiento manual de autorizaciones para cada usuario requiere tiempo Si una empresa tuviera varios usuarios con el mismo rol, resultaría más eficiente utilizar un grupo de usuario de autorización.  Los grupos de usuarios de autorización son conjuntos de autorizaciones predefinidos que se pueden asignar a varios usuarios  En un nuevo sistema, existen cuatro grupos por defecto que contienen las autorizaciones generalmente requeridas para los roles relacionados con finanzas, ventas, compras e inventario.  Estos grupos de usuarios aparecen en la ventana autorizaciones y puede fijar las autorizaciones como lo haría manualmente para un único usuario  Cuando se crea un grupo nuevo, puede copiar autorizaciones desde otro grupo de usuarios  La columna Autorización efectiva muestra las autorizaciones combinadas concedidas a un usuario desde un grupo de usuarios de autorización y desde cualquier autorización manual.  Si se otorgan varias autorizaciones conflictivas a un usuario con una combinación de asignación manual y grupo de usuarios, se aplicará la autorización más alta (la más generosa)  Puede exportar autorizaciones asignadas a Microsoft Excel para revisar o para la documentación del proyecto 30

---

