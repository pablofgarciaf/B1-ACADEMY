# Transcripción por Diapositiva: 10_Impl_22_ImplTools_ExpressWizard_ES

## Diapositiva 1

PUBLIC Herramientas de implementación: Asistente de configuración rápida SAP Business One Versión 10.0 El asistente de configuración rápida facilita la tarea de creación y configuración de una nueva base de datos empresarial. 1

---

## Diapositiva 2

 Al final de este tema, podrá crear una nueva empresa de SAP Business One y configurar parametrizaciones clave en una empresa con un asistente fácil de utilizar. 2 2 PUBLIC Al concluir este curso, estará en condiciones de:  Crear una nueva empresa de SAP Business One y  Configurar parametrizaciones clave en una empresa con un asistente fácil de utilizar Objetivos

---

## Diapositiva 3

 Veamos un ejemplo empresarial.  Está configurando una nueva base de datos de cliente y desea asegurarse de que configurar las parametrizaciones clave en el orden correcto. Además, el cliente ha pedido un registro de auditoría de todas las parametrizaciones de configuración.  Solución: El Asistente de configuración rápida ofrece una manera estructurada y sistemática de crear y/o configurar una nueva empresa. Además, se graba automáticamente un informe de auditoría de cualquier cambio en la parametrización o configuración realizado en el asistente. 3 3 PUBLIC Desea asegurarse de que puede configurar las parametrizaciones clave en el orden correcto. Además, el cliente ha pedido un registro de auditoría que muestre todas las parametrizaciones de configuración. Solución: El Asistente de configuración rápida ofrece una manera estructurada y sistemática de crear y/o configurar una empresa. Adicionalmente, se graba automáticamente un informe de auditoría de cualquier cambio en la parametrización o configuración realizado en el asistente. Ejemplo empresarial

---

## Diapositiva 4

4 PUBLIC Instalación del software  El software de SAP Business One se descarga desde el centro de descarga de software (accesible desde PartnerEdge o desde el portal de soporte)  Para obtener instrucciones de instalación paso a paso, consulte la Guía del administrador  Durante la instalación, establezca la clave de usuario del sitio  De forma opcional, puede instalar una base de datos de muestra durante la instalación del software  Puede utilizar el software durante 31 días sin licencia. Hay disponibles en PartnerEdge para interlocutores autorizados enlaces para descargar el software de SAP Business One. Para obtener instrucciones de instalación paso a paso, consulte la Guía del administrador Durante la instalación, establezca la clave de usuario (B1SiteUser) del sitio. La clave de usuario del sitio es necesaria para realizar diversas tareas de nivel de sistema como:  Crear empresas nuevas.  Actualizar una versión o nivel de patch  Ingresar al System Landscape Directory (SLD)  Creación de un usuario de base de datos con privilegios de solo lectura para informes y consultas Nota: La clave de usuario del sitio solo puede se puede modificar posteriormente en el System Landscape Directory (SLD). Puede ejecutar la versión recientemente instalada del producto SAP Business One por 31 días sin licencia. Para continuar utilizando la aplicación después de los 31 días, debe instalar una clave de licencia válida asignada por SAP. 4

---

## Diapositiva 5

5 PUBLIC Directorio de infraestructura del sistema (SLD) https://<Server>:<Port>/ControlCenter  Lugar de trabajo central para la gestión de bases de datos de la empresa en los servidores de base de datos  Gestión de la seguridad, incluida la autenticación de la base de datos, el inicio de sesión único, las claves de cifrado, la clave de usuario del sitio, las credenciales de usuario de la base de datos  Gestión de licencias, correo, alertas y servicios de acceso del navegador System Landscape Directory (SLD) es el lugar de trabajo central para realizar varias tareas administrativas y de seguridad. Se puede acceder desde un navegador web con la URL que mostrada anteriormente. Utilice el SLD para:  Gestionar empresas en los servidores de base de datos. Las empresas añadidas aquí se mostrarán en la pantalla de inicio de sesión del usuario.  Gestionar la autenticación de usuarios de la base de datos  Permitir funcionalidad de entrada individual  Gestionar las claves de cifrado utilizadas para cifrar datos en SAP Business One  Modificar la clave de acceso de usuario al sitio  Modificar el usuario de base de datos utilizado para conectar al servidor de la base de datos En la ficha Servicios del SLD, puede gestionar varios servicios entre los que se incluyen:  El servicio de licencia  Los servicios de correo electrónico y alertas  El servicio de acceso al navegador 5

---

## Diapositiva 6

6 PUBLIC Opciones para crear una nueva empresa (seleccione el icono a la derecha del botón Nueva)  Para crear una nueva empresa, seleccione Nueva en la ventana Seleccionar empresa  Para crear y configurar una nueva empresa mediante un asistente, seleccione Nueva con el asistente en la ventana Seleccionar empresa Es necesaria la contraseña B1SiteUser Creación de una nueva empresa Administración > Seleccionar empresa Se le pedirá que introduzca la clave de acceso de usuario de sitio para continuar. Para crear una empresa, seleccione Gestión Seleccionar empresa. En la ventana Seleccionar empresa seleccione el icono a la derecha del botón -Nueva para ver las entradas de la lista desplegable: • Seleccione Nueva para crear una nueva empresa. Después de crear la empresa puede utilizar las ventanas de configuración en el menú Gestión para configurarla. • Seleccione Nueva con el asistente para crear la base de datos de la empresa y configurar la empresa utilizando el asistente. El asistente permite que la organización de un interlocutor adopte un método uniforme para la configuración con consultores siguiendo una secuencia recomendada de configuración. En ambos casos, se le pedirá que introduzca la clave de acceso de usuario del sitio para continuar. 6

---

## Diapositiva 7

Creación de una nueva empresa con el asistente de configuración rápida 7

---

## Diapositiva 8

8 PUBLIC Asistente de configuración rápida – Detalles de la empresa Detalles iniciales de la empresa Licencia requerida (o versión de prueba) Nombre y nombre de la base de datos Opción para copiar en UDF, UDT y UDO desde empresa actual Las parametrizaciones locales activan tablas y funcionalidad locales Modelo del plan de cuentas (o definido por el usuario) Localización Idioma base para la IU El asistente le dirige primero a la pantalla de creación de empresa estándar donde introducirá los detalles iniciales de la nueva empresa.  Si se trata de una nueva instalación de SAP Business One, puede seleccionar la casilla de selección Versión de prueba. Pasados 31 días, vencerá el período de validez de la ventana y deberá instalar la clave de licencia. Si ya se ha instalado una licencia, la nueva empresa deberá pertenecer a la misma localización.  Nombre y nombre de la base de datos. El nombre aparecerá en la pantalla Detalles de la empresa.  Opción para copiar las tablas, los campos y los objetos definidos por el usuario de la empresa existente a la nueva. Esto resulta útil cuando es necesario crear una empresa adicional para la empresa del cliente o para crear una base de datos de prueba.  Opciones locales. Cuando selecciona las parametrizaciones de la localización, se activan las tablas y funcionalidad locales de la nueva empresa. No puede modificar la localización después de que haya creado la empresa.  Plan de cuentas. Los modelos del plan de cuentas que verá dependen de las parametrizaciones locales. Si selecciona la opción “modelo”, se creará automáticamente un plan de cuentas por defecto en base a la localización, cuyas cuentas puede editar como desee. O bien, puede seleccionar la opción "definido por el usuario". Solo los cajones de nivel superior se proporcionan en un plan de cuentas definido por el usuario, lo que permite añadir cuentas manualmente a los cajones. Nota: No puede modificar el plan de cuentas después de que haya contabilizado las transacciones.  Idioma fuente. El idioma de visualización inicial de la IU. Se puede modificar posteriormente. 8

---

## Diapositiva 9

9 PUBLIC Asistente de configuración rápida (cont.) Para completar las parametrizaciones iniciales, seleccione el botón Explorar para definir los períodos contables Debe definir los períodos contables del ejercicio más antiguo que serán necesarios en la nueva empresa para los informes.  Para completar las parametrizaciones iniciales, seleccione el botón Explorar para definir los períodos contables. Este paso es obligatorio.  Debe definir los períodos contables para el ejercicio más antiguo que serán necesarios en la nueva empresa para los informes. Una vez creada la empresa, puede definir períodos contables para los ejercicios siguientes, pero no se puede definir períodos contables para un ejercicio anterior.  Para las fechas de vencimiento, SAP recomienda que defina un rango que es mayor que el intervalo de fechas de contabilización del período concreto. Esto le permite alojar las condiciones de pago que calculan una fecha de vencimiento posterior a la fecha actual del sistema.  Las fechas de vencimiento de los períodos contables se pueden modificar posteriormente. Por ejemplo, si el rango de fecha de vencimiento no permite una transacción con una condición de pago determinada, es posible ajustarlo.  No puede crear períodos que se solapen. Después de crear períodos, puede ajustar el rango de fecha y el inicio del ejercicio según sus necesidades. El ejercicio no tiene que ser el mismo que el año natural; sin embargo, el comienzo del ejercicio debe ser el primer día del mes. En este caso, debe modificar el intervalo de fechas de los períodos del ejercicio fiscal. Para ello comience con el último período y vaya hacia atrás para evitar una situación en la cual los períodos se solapen. 9

---

## Diapositiva 10

Base de datos de la empresa - Finalización  Después de definir el período contable el asistente crea las tablas de base de datos  El progreso se muestra en la barra de estado  La cuenta de director se crea y deberá proporcionar la contraseña El usuario “director” se crea por defecto. Deberá proporcionar una contraseña de director. Después de definir los períodos contables, el asistente crea las tablas para la nueva empresa. La cuenta de usuario "director" se ha creado de manera predeterminada. Introduzca una clave de acceso para este usuario y utilice estas credenciales para entrar en la empresa por primera vez.

---

## Diapositiva 11

Utilización del asistente para configurar una empresa 11

---

## Diapositiva 12

12 PUBLIC Configuración de una nueva empresa Para preparar el uso de SAP Business One, debe crear la base de datos de empresa y configurar varias parametrizaciones Debido a las dependencias de datos, existe un orden sugerido para la configuración y establecimiento de una nueva empresa La mayoría de estas parametrizaciones se ubican en los menús: Gestión > Inicialización del sistema Gestión > Definiciones  Para preparar SAP Business One para utilizarlo con una empresa, configure varias parametrizaciones, como contabilidad, inventario, interlocutores comerciales, usuarios, ventas y compras. Debido a las dependencias de datos, existe un orden sugerido para la configuración y establecimiento de una nueva empresa. Por ejemplo, debe configurar primero las parametrizaciones de contabilidad.  Las pantallas de configuración se ubican principalmente en los menús Gestión > Inicialización del sistema y Gestión > Definiciones.  En lugar de utilizar las pantallas de configuración individuales, suele ser más sencillo utilizar el Asistente de configuración rápida. 12

---

## Diapositiva 13

13 PUBLIC Configuración de una nueva empresa o empresa existente Gestión > Inicialización del sistema > Centro de implementación > Tareas de implementación – Configurar parametrizaciones de empresa  Para acceder al asistente para configurar una empresa, ábralo desde el Centro de implementación  Puede utilizar el asistente para realizar cambios de configuración en la nueva empresa además de hacerlo en una empresa existente. Para acceder al asistente, abra el Centro de implementación y seleccione Configurar parametrizaciones de empresa.  Para utilizar las tareas del centro de implementación, es necesaria la autorización general Gestión >Inicialización del sistema> Tareas de implementación > Tareas de implementación. 13

---

## Diapositiva 14

14 PUBLIC Orden de configuración del asistente de configuración rápida Contabilidad Gestión de bancos Interlocutores comerciales Inventario Compras y ventas Usuarios Plan de cuentas, Inventario permanente, Almacenes Bancos y Bancos propios Condiciones de pago, Grupos de interlocutores comerciales Grupos de artículos, Ciclos de inventario, Listas de precios Parametrizaciones de documento, Numeración de documentos Cuentas de usuario, Licencias, Autorizaciones Detalles de la empresa Información de la empresa, Ocultar funcionalidad  El asistente le guiará a través de los pasos del proceso de configuración de la empresa para cada área:  Detalles de la empresa  Contabilidad  Gestión de bancos  Interlocutores comerciales  Inventario (stock)  Compras y ventas  Usuarios. 14

---

## Diapositiva 15

15 PUBLIC Beneficios del uso del asistente para configuración  Para facilitar el uso, las pantallas de configuración para cada área se agrupan en un orden recomendado  El asistente resalta parametrizaciones irreversibles con antelación mediante un signo de exclamación rojo  Después de contabilizar una transacción, estas parametrizaciones se desactivan y no pueden cambiarse en el asistente  La ventaja de utilizar el asistente consiste en que las pantallas de configuración se agrupan en un orden recomendado para cada módulo o área: contabilidad, gestión de bancos, interlocutores comerciales, inventario (stock), compras y ventas y usuarios. Aquí se muestra un ejemplo de pantallas de configuración de contabilidad. Existen varias pantallas de contabilidad.  El asistente también resalta de forma anticipada cualquier parametrización que no pueda modificarse después de que se hayan contabilizado las transacciones para la empresa. Estas parametrizaciones tienen un signo de exclamación en rojo (!).  Cuando una parametrización pasa a ser irreversible, se desactiva en el asistente y no puede modificarse. 15

---

## Diapositiva 16

16 PUBLIC Resumen de pantallas de configuración utilizadas en el asistente Área Pantallas de configuración equivalentes Contabilidad Gestión > Inicialización del sistema > Detalles de la empresa Finanzas > Plan de cuentas Gestión > Definiciones > Finanzas Gestión > Definiciones > Finanzas > Impuestos Gestión de bancos Gestión > Definiciones > Gestión de bancos Interlocutores comerciales Gestión > Inicialización del sistema > Parametrizaciones generales – Ficha IC Gestión > Definiciones > Interlocutores comerciales Inventario Gestión > Definiciones > Inventario Inventario > Listas de precios Compras y ventas Gestión > Inicialización del sistema > Parametrizaciones de documento Gestión > Inicialización del sistema > Parametrizaciones generales – Ficha Visualización. Gestión > Inicialización del sistema > Numeración de documento Gestión > Definiciones > Compras > Precios de entrega Gestión > Definiciones > General > Vínculos a campos de referencia Gestión > Definiciones > Oportunidades Usuarios Gestión > Definiciones Gestión > Licencia Gestión > Inicialización del sistema > Autorizaciones Recursos Humanos La diapositiva muestra un resumen de los pasos del asistente y de las pantallas de configuración de empresa equivalentes. 16

---

## Diapositiva 17

17 PUBLIC Informe de configuración  Al finalizar el asistente para una nueva empresa, se crea un informe de configuración estándar. Al ejecutar el asistente para una nueva empresa, se crea un informe de configuración estándar. Este informe puede entregarse al cliente como documentación. Cada posible parametrización se muestra con el valor configurado o por defecto. 17

---

## Diapositiva 18

18 PUBLIC Informe de configuración Gestión > Inicialización del sistema > Centro de implementación > Gestión de configuración  El informe de configuración se graba cada vez que se ejecute el asistente, lo que proporciona un seguimiento de auditoría.  Acceda y compare informes de configuración grabados Seleccione el informe grabado y compárelo con la configuración actual (para comprobar si los cambios se realizaron directamente desde los menús Gestión) Seleccione varios informes para su comparación  Otra ventaja del uso del asistente de configuración consiste en que se graba un informe cada vez que se ejecute el asistente, lo que proporciona un seguimiento de auditoría de los cambios realizados.  Puede acceder a informes de la configuración grabados en cualquier momento seleccionando Gestión de configuración desde el menú Centro de implementación:  Puede seleccionar un informe grabado y compararlo con la configuración actual. Ya que no se realiza el seguimiento de los cambios de configuración realizados fuera del asistente, puede realizar esta comparación para comprobar si los cambios de configuración se han realizado directamente desde los menús Gestión y no utilizando el Asistente de configuración rápida.  También puede seleccionar varios informes y compararlos. Esto permite ver cambios realizados en diferentes fases de la implementación o a lo largo del tiempo.  También tiene la posibilidad de grabar una instantánea de la configuración actual en cualquier momento, desde la ficha General de la pantalla Gestión de configuración. 18

---

## Diapositiva 19

19 PUBLIC Resumen Puntos clave de este tema: Tiene dos opciones para crear una nueva empresa: la opción Asistente de configuración exprés reduce el tiempo necesario para crear una nueva empresa siguiendo un asistente de fácil uso. Esto hace posible que un interlocutor a adopte un enfoque uniforme para la configuración. El asistente agrupa pantallas de configuración relacionadas que es posible que no aparezcan en los mismos menús de gestión y, también importante, el asistente le avisa con antelación sobre las parametrizaciones irreversibles. También puede utilizar el asistente de configuración exprés para configurar una empresa existente. Después de ejecutar el asistente por primera vez, el sistema graba un informe de configuración estándar. Cada vez que utilice el asistente, se crea un nuevo informe y puede comparar y controlar las modificaciones de configuración. La clave de acceso de usuario al sitio es necesaria para crear una nueva empresa. La clave de acceso de usuario al sitio se establece y actualiza en el System Landscape Directory. Durante 31 días, puede ejecutar sin licencia la versión del producto SAP Business One recientemente instalada y crear bases de datos de la empresa utilizando la versión de prueba.  Estos son los puntos clave de este tema:  Tiene dos opciones para crear una nueva empresa: seleccionar Nueva o Nueva con el asistente. La última opción le permite ahorrar tiempo y elimina la necesidad de navegar por pantallas de configuración individuales. Esto hace posible que la organización de un interlocutor adopte un enfoque uniforme para la configuración. El asistente le guiará a través del orden correcto para realizar la configuración.  El asistente reúne las parametrizaciones de configuración encontradas en los menús Gestión > Inicialización del sistema, Gestión > Definiciones y en otros menús relevantes para Contabilidad, Gestión de bancos, Interlocutores comerciales, Inventario, Compras y ventas y Usuarios. El asistente agrupa automáticamente pantallas de configuración relacionadas.  Y también importante, el asistente le avisa sobre parametrizaciones irreversibles que están marcadas con un signo de exclamación rojo.  También puede ejecutar el asistente para configurar una empresa existente.  Después de ejecutar el asistente por primera vez, el sistema graba un informe de configuración estándar. Cada vez que utilice el asistente para realizar cambios adicionales de configuración, se crea un nuevo informe. Puede comparar los cambios en los informes con la función Gestión de configuración.  La clave de acceso de usuario del sitio se establece durante la instalación y es necesaria para crear una nueva empresa. La clave de acceso de usuario al sitio la gestiona el System Landscape Directory. Durante 31 días, puede ejecutar sin licencia la versión del producto SAP Business One recientemente instalada y crear bases de datos de la empresa utilizando la versión de prueba. 19

---

