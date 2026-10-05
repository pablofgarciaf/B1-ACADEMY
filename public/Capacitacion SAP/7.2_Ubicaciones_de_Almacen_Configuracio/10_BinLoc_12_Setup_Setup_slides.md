# Transcripción por Diapositiva: 10_BinLoc_12_Setup_Setup

## Diapositiva 1

PUBLIC Ubicaciones: Configuración de Ubicaciones SAP Business One Versión 10.0 Bienvenido al curso de Configuración del tema de ubicaciones. Este es uno de los cursos disponibles sobre el tema de ubicaciones. 1

---

## Diapositiva 2

Al finalizar este módulo, podrá: Configurar almacenes gestionados por ubicaciones, subniveles de almacén y códigos de ubicación. Mantener y realizar cambios en los subniveles de almacén y códigos de ubicación existentes. Definir estrategias de asignación automática y ubicaciones receptoras. 2 PUBLIC Al finalizar este tema, podrá:  Configurar almacenes gestionados por ubicaciones, subniveles de almacén y códigos de ubicación.  Mantener y realizar cambios en los subniveles de almacén y códigos de ubicación existentes.  Definir estrategias de asignación automática y ubicaciones receptoras. Objetivos

---

## Diapositiva 3

Esta es la agenda del curso de Configuración. Comenzaremos con una breve introducción al proceso de configuración y presentaremos un ejemplo empresarial. 3 PUBLIC Agenda Introducción Subniveles de almacén y estructura de ubicaciones Configuración de un almacén gestionado con ubicaciones Subniveles de almacén Activación de campos de subnivel Configuración de códigos de subniveles de almacén Gestión de códigos de subniveles de almacén Códigos de ubicación Datos maestros de ubicación Atributos de ubicación Gestión de ubicaciones Modificación de códigos de ubicaciones Estrategias de asignación automática y ubicación receptora

---

## Diapositiva 4

La mayoría de las empresas basadas en inventario necesitan poder localizar artículos dentro de sus almacenes y, por lo tanto, requieren la funcionalidad de ubicaciones. En SAP Business One, puede activar la funcionalidad de ubicaciones por almacén. Los almacenes pueden dividirse en múltiples subniveles que soportan 4 dimensiones de subnivel. Con algunas organizaciones que gestionan miles de ubicaciones, estos subniveles y códigos de ubicación se pueden gestionar fácilmente de forma manual o automática con funciones de generación/actualización/eliminación por lotes. Business One le permite definir varios procesos de asignación automática para la recepción o emisión de mercancías, haciendo estos procesos lo más eficientes y automáticos posible. En este tema de formación cubriremos la configuración y definición necesarias antes de comenzar a trabajar con ubicaciones. 4 PUBLIC Introducción 1/2  La mayoría de las empresas basadas en inventario necesitan poder localizar artículos en sus almacenes.  En SAP Business One puede activar la funcionalidad de ubicaciones por almacén. Los almacenes pueden dividirse en múltiples subniveles que soportan 4 dimensiones.  Los subniveles y códigos de ubicación se pueden gestionar manualmente o de forma automática mediante funciones de generación/actualización/eliminación por lotes.  Business One permite definir varios procesos de asignación automática para la recepción o emisión de mercancías.  En este tema cubriremos la configuración y definición necesarias para trabajar con ubicaciones.

---

## Diapositiva 5

En esta unidad de formación describiremos la configuración de ubicaciones según el flujo de configuración mostrado. Esta configuración se realiza en cuatro fases: La fase uno define un almacén gestionado por ubicaciones. En la fase dos se añaden subniveles de almacén y atributos. Una vez definido el almacén gestionado por ubicaciones, también se pueden definir estrategias de asignación automática. En la fase tres, después de añadir los subniveles de almacén, se pueden crear los códigos de ubicación. En la fase cuatro, una vez disponibles las ubicaciones, algunas pueden definirse como ubicaciones receptoras. 5 PUBLIC Introducción 2/2 Configurar almacén gestionado por ubicaciones Configurar atributos Definir estrategia de asignación automática Fase 1 Fase 2 Fase 3 Configurar códigos de ubicación Configurar ubicaciones receptoras Configurar subniveles de almacén Fase 4

---

## Diapositiva 6

OEC Computers vende equipos y material de oficina a minoristas en EE. UU. OEC Computers tiene dos almacenes principales: en Nueva York y en Los Ángeles. George es el jefe de almacén en Nueva York. George y su equipo tienen dificultades para localizar artículos en su gran almacén. Necesitan una solución que permita dividir el almacén de Nueva York en subniveles y ubicaciones. Usted le demuestra el módulo de Ubicaciones a George. 6 PUBLIC Escenario empresarial OEC Computers vende equipos y material de oficina a minoristas en EE. UU. Tiene dos almacenes principales en Nueva York y Los Ángeles. George es el jefe de almacén en Nueva York y necesita una solución para localizar artículos en su gran almacén mediante subniveles y ubicaciones.

---

## Diapositiva 7

Examinemos los subniveles de almacén y la estructura de ubicaciones. 7 PUBLIC Agenda Introducción Subniveles de almacén y estructura de ubicaciones Configuración de un almacén gestionado con ubicaciones Subniveles de almacén Activación de campo de subnivel Configuración de códigos de subniveles de almacén Gestión de códigos de subniveles de almacén Códigos de ubicación Datos maestros de ubicación Atributos de ubicación Gestión de ubicaciones Modificación de códigos de ubicaciones Estrategias de asignación automática y ubicación receptora

---

## Diapositiva 8

Para configurar las ubicaciones en OEC Computers, primero necesitamos examinar la estructura del almacén. En la imagen podemos ver el almacén principal de OEC Computers. El almacén es un gran hangar dividido en pasillos. Cada pasillo tiene estanterías a lo largo de los lados y cada estantería está dividida en niveles, como se muestra en la imagen. 8 PUBLIC Escenario empresarial Estructura del almacén de OEC Computers Estantería Estantería Estantería Estantería

---

## Diapositiva 9

Conozcamos la estructura de subniveles de un almacén gestionado por ubicaciones, para entender cómo definir las ubicaciones en el almacén de OEC Computers. La estructura de un almacén a menudo consiste en una combinación de diferentes niveles, como pasillo, estantería o piso. Un tipo de área puede ser subnivel de otro tipo. En OEC Computers, por ejemplo, una estantería es un subnivel de un pasillo, lo que significa que un pasillo contiene varias estanterías. SAP Business One soporta hasta 4 subniveles de almacén. Una combinación del código de almacén y los códigos de subniveles de almacén define el código de ubicación único. Un ejemplo en el gráfico puede ser el código de ubicación 05-A1-S2-L1. El mismo código de subnivel de almacén puede usarse en muchos códigos de ubicación. Podemos ver que el nivel L1 está conectado a la estantería S1 y la estantería S2. 9 PUBLIC Estructura de subniveles de almacén Composición del código de ubicación - Ejemplo Almacén 05 A1 S1 S2 L1 L2 L1 L2 Código de ubicación A2 Nivel de almacén Subnivel 1 de almacén - Pasillo Subnivel 2 de almacén - Estantería Subnivel 3 de almacén - Nivel Combinación única del código de almacén y los códigos de subnivel

---

## Diapositiva 10

Veamos ahora un ejemplo de la estructura del código de ubicación. Podemos ver que el código de ubicación es una combinación del almacén y los códigos de subniveles de almacén. 10 PUBLIC OEC Computers: Estructura del código de ubicación 01 – A4 – S2 – L9 Almacén - Subnivel1 - Subnivel2 - Subnivel3 Almacén 01 – Pasillo 4 - Estantería 2 - Nivel 9 Estructura de subniveles Código de ubicación en OEC Computers Detalles

---

## Diapositiva 11

Configuremos ahora un almacén gestionado con ubicaciones. 11 PUBLIC Agenda Introducción Subniveles de almacén y estructura de ubicaciones Configuración de un almacén gestionado con ubicaciones Subniveles de almacén Activación de campo de subnivel Configuración de códigos de subniveles Gestión de códigos de subniveles Códigos de ubicación Datos maestros de ubicación Atributos de ubicación Gestión de ubicaciones Modificación de códigos de ubicaciones Estrategias de asignación automática y ubicación receptora

---

## Diapositiva 12

OEC Computers decidió gestionar ubicaciones para sus almacenes principales en Los Ángeles y Nueva York. OEC Computers también tiene algunos almacenes pequeños, incluidos almacenes de laboratorio. George, el jefe de almacén, decide no gestionar ubicaciones para estos almacenes ya que son pequeños y fáciles de navegar. En SAP Business One, tiene la opción de habilitar ubicaciones almacén por almacén. Para activar las ubicaciones en el almacén, marque la casilla Activar ubicaciones. Una vez activadas las ubicaciones para un almacén: Aparece una pestaña Ubicaciones en la ventana Almacén – Configuración con los campos de configuración de ubicaciones. Todos los campos relacionados con ubicaciones aparecen en la ventana Almacén – Configuración. Aparecen todas las demás entradas de menú y ventanas relacionadas con ubicaciones. Se crea la Ubicación del sistema. Todas las transacciones de inventario futuras involucrarán ubicaciones. La casilla Activar ubicaciones puede desmarcarse en cualquier momento siempre que no haya transacciones de ubicaciones ni códigos de ubicación generados (excepto el código de Ubicación del sistema). Los códigos de subniveles de almacén definidos en el sistema se guardarán y estarán disponibles al volver a habilitar las ubicaciones. Tenga en cuenta que en esta ventana también se define el separador del código de ubicaciones, indicando un carácter que se usará como separador entre los diferentes segmentos del código. 12 PUBLIC Administración Configuración Inventario Almacenes Activar ubicaciones 1/2 Un carácter para distinguir entre los diferentes segmentos del código de ubicación

---

## Diapositiva 13

George activó las ubicaciones para el almacén de Nueva York. Ahora está creando los subniveles de almacén y aún no ha tenido la oportunidad de crear los códigos de ubicación. Sin embargo, el sistema impone ubicaciones en cada transacción de inventario tras activarlas. Todos los usuarios de SAP Business One en OEC Computers continúan trabajando con normalidad. Esto es posible gracias a la Ubicación del sistema. Cuando se activa la funcionalidad de ubicaciones para un almacén, se crea automáticamente una única ubicación del sistema para ese almacén. El nombre del código de Ubicación del sistema será: [Código de almacén]-SYSTEM-BIN-LOCATION. Por defecto, al activar las ubicaciones para un almacén: Todo el inventario se coloca automáticamente en la Ubicación del sistema. Todas las recepciones se reciben automáticamente en la Ubicación del sistema. Todas las emisiones se realizan automáticamente desde la Ubicación del sistema. SAP Business One actualiza la Ubicación del sistema en el campo Ubicación predeterminada, y por eso las transacciones de inventario se realizan para esta ubicación. Esto significa "negocio como siempre" hasta completar toda la configuración. Luego puede crear documentos de Transferencia de inventario para transferir el inventario desde la Ubicación del sistema a las ubicaciones físicas reales. Para trabajar con ubicaciones, debe definirse al menos un código para el Subnivel 1. Por este motivo, el sistema genera un código del sistema para el Subnivel 1 llamado: SYSTEM-BIN-LOCATION. Este código de subnivel de almacén puede renombrarse pero no eliminarse. 13 PUBLIC Ubicación del sistema  Código del sistema para Subnivel 1: SYSTEM-BIN-LOCATION Código de Ubicación del sistema: [Código de almacén]-SYSTEM-BIN-LOCATION

---

## Diapositiva 14

Después de habilitar las ubicaciones para un almacén, debe configurar la estructura de los Subniveles de almacén. Veamos cómo crear y gestionar Subniveles de almacén. 14 PUBLIC Agenda Introducción Subniveles de almacén y estructura de ubicaciones Configuración de un almacén gestionado con ubicaciones Subniveles de almacén Activación de campo de subnivel Configuración de códigos de subniveles Gestión de códigos de subniveles Códigos de ubicación Datos maestros de ubicación Atributos de ubicación Gestión de ubicaciones Modificación de códigos de ubicaciones Estrategias de asignación automática y ubicación receptora

---

## Diapositiva 15

En SAP Business One puede gestionar hasta 4 subniveles de almacén. Por ejemplo, OEC Computers usa los cuatro subniveles: Los Pisos del edificio del almacén se definieron como Subnivel 1. Las Áreas en cada Piso como Subnivel 2. Las Filas de Estanterías de cada Área como Subnivel 3. Las Estanterías en cada Fila como Subnivel 4. El Subnivel 1 de almacén siempre está activado y no puede desactivarse. Por defecto, todos los demás subniveles están desactivados. Los subniveles deben activarse de forma secuencial. Los nombres de los subniveles se usan como etiquetas de campo en todas las pantallas e informes relevantes. 15 PUBLIC Configuración Inventario Ubicaciones Activación de campos de ubicación Subniveles de almacén Activación de campos de subnivel

---

## Diapositiva 16

En la ventana Códigos de subniveles de almacén, podemos añadir los diferentes códigos de subniveles de almacén para cada nivel. Los subniveles disponibles son los que definimos en la ventana Activación de campos de ubicación. Cada código será un segmento en un código de ubicación. Por ejemplo, en el almacén de Nueva York de OEC Computers hay 3 Pisos, 4 Áreas en cada Piso, muchas Filas en cada Área y muchas Estanterías en cada Fila. En el Subnivel 1 vemos el código SYSTEM-BIN-LOCATION. En esta ventana también podemos actualizar y eliminar códigos de subniveles de almacén manualmente (uno por uno). Nota: Es importante entender que los códigos de subniveles de almacén son comunes a todos los almacenes, es decir, están disponibles para usar en todos los almacenes. Sin embargo, si un almacén diferente tiene una estructura distinta y por lo tanto diferentes subniveles, deben configurarse nuevos subniveles de almacén adicionalmente a los existentes. Además, cada subnivel de almacén se define como un código independiente sin 16 PUBLIC Códigos de subniveles de almacén Creación manual de códigos de subniveles de almacén Configuración Inventario Ubicaciones Códigos de subniveles de almacén Subnivel 1 Subnivel 2 Subnivel 3 Subnivel 4

---

## Diapositiva 17

dependencia o conexión con otro subnivel superior. 16

---

## Diapositiva 18

En nuestro ejemplo, los subniveles de Fila y Estantería tienen muchos códigos. Añadirlos manualmente puede ser tedioso. SAP Business One permite la creación automatizada por lotes de códigos de subnivel. En la ventana Códigos de subniveles de almacén, elija el botón Gestionar códigos de subniveles para abrir la ventana Gestión de códigos de subniveles de almacén. George creó 30 Filas con el prefijo R: R01 a R30. Para combinar esta estructura de códigos, George hace lo siguiente: En el primer campo de segmento elige Fijo e introduce el valor R. En el segundo campo de segmento elige Numérico e introduce los valores del 1 al 30. El sistema añade automáticamente ceros iniciales para igualar la longitud del número más largo. Los ceros iniciales permiten una ordenación alfanumérica óptima. Puede crear un código más complejo definiendo hasta 6 segmentos de un código de subnivel. George también crea automáticamente códigos de subniveles de almacén para el subnivel de Estantería. En el código del subnivel Estantería, George elige un segmento Alfabético. Para generar el rango de códigos, elige el botón Aceptar para abrir la ventana Vista previa de generación. 17 PUBLIC Gestión de códigos de subniveles de almacén Generación automática de subniveles de almacén 1 2

---

## Diapositiva 19

Después de que George seleccionó el botón Aceptar, se abre la ventana de Vista previa. En esta ventana puede revisar los códigos que están a punto de generarse. También puede ver si hay un error asociado con uno o más códigos; los códigos con mensajes de error aparecerán en rojo. Si en la Vista previa de generación los códigos aparecen en rojo con un mensaje de error indicando que el código ya existe, es porque estos códigos ya existen y el sistema no permitirá añadirlos de nuevo. Elija el botón Generar para añadir los códigos que aparecen en la ventana de vista previa sin mensaje de error. Nota: Todos los códigos generados estarán en mayúsculas. También puede acceder a la ventana Gestión de códigos de subniveles de almacén desde: Administración Configuración Inventario Ubicaciones Gestión de códigos de subniveles de almacén. 18 PUBLIC Gestión de códigos de subniveles de almacén Generación automática de subniveles de almacén – Ventana de vista previa 2 3

---

## Diapositiva 20

En la ventana Gestión de códigos de subniveles de almacén también podemos actualizar o eliminar códigos de subniveles de almacén. La opción de actualización permite actualizar la descripción de los códigos de subniveles de almacén. La opción de eliminación permite eliminar un rango de códigos de subnivel. Los códigos de subnivel que están actualmente en uso como parte de un código de ubicación no se eliminarán. Si hay algunos códigos en uso dentro del rango de códigos a eliminar, el sistema eliminará solo los códigos no utilizados. Puede filtrar los códigos a eliminar introduciendo una cadena de descripción en los Criterios de selección ampliados. 19 PUBLIC Gestión de códigos de subniveles de almacén Actualizar y eliminar un rango de códigos Actualizar propiedades de subniveles de almacén Eliminar códigos de subniveles de almacén

---

## Diapositiva 21

A continuación, aprendamos a gestionar los códigos de ubicación. 20 PUBLIC Agenda Introducción Subniveles de almacén y estructura de ubicaciones Configuración de un almacén gestionado con ubicaciones Subniveles de almacén Activación de campo de subnivel Configuración de códigos de subniveles Gestión de códigos de subniveles Códigos de ubicación Datos maestros de ubicación Atributos de ubicación Gestión de ubicaciones Modificación de códigos de ubicaciones Estrategias de asignación automática y ubicación receptora

---

## Diapositiva 22

Como en cualquier ventana de datos maestros, los Datos maestros de ubicación pueden crearse, actualizarse, eliminarse o duplicarse. La ventana Datos maestros de ubicación puede dividirse en 4 partes lógicas: estructura del código, propiedades de la ubicación, restricciones en las ubicaciones y atributos de la ubicación. Repasemos cada parte en las siguientes diapositivas. 21 PUBLIC Datos maestros de ubicación Inventario Ubicaciones Datos maestros de ubicación Estructura del código Propiedades Restricciones Atributos

---

## Diapositiva 23

Un código de ubicación se construye seleccionando una combinación única de un almacén y códigos de subniveles de almacén. Podemos ver en la imagen que cada subnivel definido aparece como nombre de campo. Los subniveles de almacén disponibles para elegir son los que generamos en la ventana Gestión de códigos de subniveles de almacén. Una vez introducidos el almacén y los códigos de subniveles de almacén, el campo Código de ubicación se construye automáticamente con los valores introducidos junto con el carácter separador definido en la ventana Configuración de almacén. George creó manualmente una nueva ubicación en el almacén 01, primer piso, Área Azul, Fila 01 y Estantería B. 22 PUBLIC Datos maestros de ubicación Estructura del código

---

## Diapositiva 24

En la sección de propiedades de la ubicación podemos ver información relevante sobre la ubicación seleccionada: cantidades de artículos, números de serie y lotes; el número de artículos diferentes en esta ubicación. También podemos definir información como descripción y cantidades mínimas y máximas. Marque el campo Inactivo cuando desee bloquear esta ubicación para que no se utilice. Un código de ubicación solo puede marcarse como Inactivo si no tiene inventario ni ningún documento de recuento de inventario abierto. George decidió marcar como inactiva una determinada ubicación, ya que esa estantería está cerca de la tubería de drenaje y sufre humedad. Dado que esta ubicación tenía transacciones históricas, George no la eliminó y solo la marcó como Inactiva. El Código de clasificación alternativo es un campo de referencia de texto libre. Al emitir artículos, puede elegir asignar artículos a ubicaciones por orden alfanumérico del código de ubicación o por orden alfanumérico de este código de clasificación alternativo. También existe la opción de excluir ubicaciones específicas de la asignación automática en transacciones de salida marcando la casilla Excluir de asignación automática en emisión. 23 PUBLIC Datos maestros de ubicación Propiedades de ubicación

---

## Diapositiva 25

En esta sección de la ventana de datos maestros podemos definir restricciones para esta ubicación. Estas restricciones determinan qué ubicaciones estarán disponibles para asignaciones en documentos de marketing y transacciones de inventario. Existen diferentes tipos de restricciones que pueden definirse para una ubicación, como restringir a un determinado artículo o grupo de artículos, una determinada unidad de medida, un determinado lote o incluso tipos específicos de transacciones de inventario. Tenga en cuenta que al elegir una Restricción de transacción, permite todas las transacciones excepto el tipo de transacciones elegido. Por otro lado, en la Restricción de artículo y lote, permite transacciones solo al tipo de restricción elegido. Además, es importante entender la diferencia entre marcar una ubicación como Inactiva y simplemente restringir todas sus transacciones. En ambos casos no podemos realizar ninguna transacción para esas ubicaciones. Pero al marcar una ubicación como Inactiva, además de la restricción de transacciones, la ubicación no aparecerá en los informes de ubicaciones ni estará disponible para asignación manual. El sistema no permitirá establecer una restricción a una ubicación cuyo contenido actual contradiga la restricción. 24 PUBLIC Datos maestros de ubicación Restricciones para ubicación (1/2)

---

## Diapositiva 26

En la parte inferior de la ventana podemos ver los campos de Atributo. Los nombres de los atributos de ubicación se toman de la definición realizada en la ventana Activación de campos de ubicación, pestaña Atributos de ubicación. Los nuevos valores de Atributo pueden añadirse fácilmente en cualquier campo de selección de Atributo introduciendo el valor como texto libre y presionando Ctrl+TAB en el teclado. Aprendamos más sobre los atributos en las siguientes diapositivas. 25 PUBLIC Datos maestros de ubicación Atributos de ubicación

---

## Diapositiva 27

Un Atributo de ubicación es una característica, dada por el usuario, que proporciona información o significado adicional a la ubicación. Después de activar los campos de Atributo, se añaden como campos de filtro a los criterios de selección de los informes de ubicación y sus valores pueden mostrarse en el informe Lista de contenido de ubicación. Los Atributos se definen y activan en Administración Configuración Inventario Ubicaciones Activación de campos de ubicación. El sistema soporta hasta 10 Atributos. Por defecto todos los atributos están inactivos. Para activar un Atributo simplemente marque la casilla Activo. Además, se recomienda cambiar el nombre predeterminado del Atributo (de Atributo 1, 2, 3...) a un nombre significativo. El nombre puede cambiarse en cualquier momento. En nuestro ejemplo empresarial, en el almacén de Nueva York, es importante para George y su equipo distinguir entre diferentes tamaños de estanterías. Los atributos Alto, Ancho y Profundidad describen el tamaño exacto de cada estantería, para saber si un determinado paquete o artículo cabe en cierta estantería. Además, los componentes electrónicos deben almacenarse en un lugar antiestático y por eso George añadió el Atributo Antiestático. Nota: Un Atributo de ubicación no puede desactivarse si está relacionado actualmente con una ubicación. Solo cuando un Atributo está activado aparece como campo en los diferentes informes y ventanas de criterios de selección. 26 PUBLIC Atributos de ubicación Activación de atributos  Un Atributo de ubicación es una característica, dada por el usuario, que proporciona información adicional a la ubicación. Administración Configuración Inventario Ubicaciones Activación de campos de ubicación  Una vez creados, los Atributos de ubicación se usan como etiquetas de campo en todas las pantallas e informes relevantes

---

## Diapositiva 28

Para cada Atributo definido en la ventana Activación de campos de ubicación, podemos introducir valores como códigos de Atributo. Vaya a Administración Configuración Inventario Ubicaciones Códigos de atributos de ubicación. Desde la lista desplegable, elija el atributo para el que desea introducir códigos. En el ejemplo anterior podemos ver que George introdujo las posibles alturas de estantería en cualquier lugar del almacén. Esta ventana también muestra, para cada atributo, cuántas ubicaciones contiene actualmente. Al elegir la flecha de enlace se abre la Lista de ubicaciones filtrada para el atributo seleccionado. Los códigos de atributo pueden eliminarse manualmente de esta ventana si no están asignados a ningún código de ubicación. Los códigos de atributo no pueden cambiarse si están en uso, por ejemplo cuando están asociados con un código de ubicación. Nota: La definición de códigos de atributos, igual que la definición de subniveles de almacén, son definiciones entre almacenes, lo que significa que cualquier atributo añadido puede usarse en la definición de ubicaciones de todos los almacenes. 27 PUBLIC Atributos de ubicación Añadir y mantener códigos de atributos (valores) Administración Configuración Inventario Ubicaciones Códigos de atributos de ubicación

---

## Diapositiva 29

La ventana Gestión de ubicaciones permite añadir, eliminar y actualizar códigos de ubicación en lotes. Para generar nuevos códigos de ubicación, elija la opción Generar ubicaciones en la lista desplegable del campo Tarea de gestión. Para cada ubicación creada se añade un registro de Datos maestros de ubicación. En la imagen anterior, estamos intentando añadir códigos de ubicación al segundo Piso, Área Roja, Filas 1 a 20, Estanterías A a F. Cualquier valor que introduzca en los campos de Propiedades de ubicación se actualizará en las nuevas ubicaciones que añada. Para añadir los nuevos códigos de ubicación, elija el botón Aceptar. Al hacerlo, se abre una ventana de vista previa que muestra la lista de códigos de ubicación que están a punto de añadirse. Use esta ventana para revisar estos códigos de ubicación. Al intentar añadir un código de ubicación que ya existe, el sistema muestra el código existente en rojo en la ventana de vista previa y lo ignora en el proceso de generación. 28 PUBLIC Gestión de ubicaciones Generación de códigos de ubicación Inventario Ubicaciones Gestión de ubicaciones

---

## Diapositiva 30

Es posible generar ubicaciones junto con sus valores de campo definido por el usuario. Después de definir campos definidos por el usuario en la ventana Gestión de ubicaciones en la ventana Gestión de campos definidos por el usuario bajo el menú Herramientas - Herramientas de personalización, introduzca valores para esos campos eligiendo el botón de exploración Campos definidos por el usuario para abrir la ventana Campos definidos por el usuario de ubicación. Aquí puede ver todos los campos definidos por el usuario que existen para los Datos maestros de ubicación. Introduzca los valores que desea actualizar en todas las ubicaciones que se van a generar. En el ejemplo mostrado, podemos ver que OEC Computers gestiona dos campos definidos por el usuario en los Datos maestros de ubicación: Encargado de almacén y Observaciones. Cuando George generó un grupo de ubicaciones también introdujo valores para los campos definidos por el usuario. Podemos ver en la ubicación creada que los valores de los campos definidos por el usuario se copiaron desde la ventana. Nota: también es posible eliminar o actualizar ubicaciones según los valores de sus campos definidos por el usuario. 29 PUBLIC Gestión de ubicaciones Generación de códigos de ubicación con valores de campo definido por el usuario

---

## Diapositiva 31

Usar el modo Actualizar en la ventana Gestión de ubicaciones permite actualizar diferentes propiedades para ubicaciones existentes. Si un código de ubicación en el rango no existe, se ignorará y no se actualizará. Una Restricción a una ubicación no se actualizará si contradice el contenido actual de la ubicación. Por ejemplo, si intentamos restringir un código de ubicación a un Artículo específico y en esa misma ubicación ya hay dos artículos, el sistema no actualizará ese código de ubicación. Cualquier contradicción generará un mensaje de error en la ventana de vista previa. En la imagen anterior vemos que al intentar actualizar una restricción de Artículo único a otra ubicación recibimos un mensaje de error indicando que la ubicación contiene más de un artículo. Nota: cuando aparece un mensaje de error, no se realizará ninguna actualización para esa ubicación aunque hayamos actualizado otro campo de propiedad no relacionado con el error recibido. 30 PUBLIC Gestión de ubicaciones Actualización de códigos de ubicación

---

## Diapositiva 32

Al usar el modo Eliminar en la ventana Gestión de ubicaciones podemos eliminar ubicaciones en lotes. Los campos de propiedades se usan como filtros y solo se eliminarán las ubicaciones que cumplan las propiedades definidas. Si no se marca nada, se eliminarán todos los códigos de ubicación en el rango especificado. Los códigos de ubicación con contenido o con historial de transacciones no pueden eliminarse. Al intentarlo, aparecerá un error en la ventana de vista previa para esas ubicaciones. Como buena práctica: La opción Eliminar puede usarse cuando es necesario eliminar códigos de ubicación añadidos por error. Además, en algunos casos es más fácil generar un rango de códigos de ubicación y luego eliminar solo algunos dentro de ese rango. 31 PUBLIC Gestión de ubicaciones Eliminación de códigos de ubicación

---

## Diapositiva 33

En la ventana Modificación de códigos de ubicación podemos realizar cambios masivos en la estructura de códigos de ubicación. Modificar códigos de ubicación suele ser necesario debido a la reorganización del almacén o para corregir errores en los códigos de ubicación. Esta modificación es posible incluso si estas ubicaciones ya contienen artículos. SAP Business One crea automáticamente un documento de Transferencia de inventario que transfiere el inventario desde la ubicación de origen a la ubicación de destino y desactiva la ubicación de origen. En la imagen anterior podemos ver que la ventana está dividida en dos partes. En la sección superior, introduzca el rango de códigos de ubicación a modificar. En la sección inferior, introduzca los nuevos subniveles de almacén que desea actualizar en el rango seleccionado. En nuestro ejemplo empresarial, debido a renovaciones en el almacén de Nueva York, en el tercer piso, una sección del Área Roja se trasladó al Área Verde. Para actualizar este cambio en el sistema, George entró a la ventana Modificación de códigos de ubicación y cambió el subnivel de Área de estos códigos de ubicación. Nota: En la sección inferior, si el subnivel está marcado y el campo está en blanco, el código de subnivel se establecerá en blanco, lo que significa que el nuevo código de ubicación creado no incluirá el segmento de ese nivel. 32 PUBLIC Modificación de códigos de ubicación 1/2 Rango de códigos de ubicación a modificar = Ubicaciones de origen Nuevo segmento de subnivel a actualizar en el rango anterior = Ubicación de destino Inventario Ubicaciones Modificación de código de ubicación

---

## Diapositiva 34

La fusión de códigos de ubicación será necesaria cuando se dé una de las siguientes condiciones: El código de ubicación de destino ya existe. En este caso, el código de ubicación de destino se fusionará con el código de ubicación existente. Varios códigos de ubicación de origen comparten un código de ubicación de destino. En este caso, todos los códigos de ubicación de origen se fusionarán en uno. Si el código de ubicación de destino no existe, SAP Business One crea automáticamente la ubicación de destino con las mismas propiedades que las de la ubicación de origen. En la ventana de vista previa, el sistema indicará cuándo es necesaria una fusión. Observe las filas 1 a 4 en la imagen anterior. El sistema indica que estos códigos de ubicación de destino ya existen y por eso se requiere una Fusión con el código de ubicación existente. Para habilitar esta modificación, primero debemos marcar la casilla Fusionar códigos de ubicación en la parte inferior de la ventana. Si no elegimos fusionar y la fusión es necesaria, las filas seleccionadas se colorean en rojo y el sistema no permitirá que la modificación proceda. 33 PUBLIC Modificación de códigos de ubicación 2/2 Fusión de códigos de ubicación

---

## Diapositiva 35

Finalmente, veamos cómo definir una estrategia de asignación automática para las transacciones de entrada. 34 PUBLIC Agenda Introducción Subniveles de almacén y estructura de ubicaciones Configuración de un almacén gestionado con ubicaciones Subniveles de almacén Activación de campo de subnivel Configuración de códigos de subniveles Gestión de códigos de subniveles Códigos de ubicación Datos maestros de ubicación Atributos de ubicación Gestión de ubicaciones Modificación de códigos de ubicaciones Estrategias de asignación automática y ubicación receptora

---

## Diapositiva 36

Existen dos métodos de asignaciones automáticas para las transacciones de entrada. El primer método se refiere a las diferentes estrategias de asignación automática que se enumeran en el campo Asignación automática en recepción en la ventana Almacén – Configuración. Las diferentes estrategias incluyen asignar a: Una ubicación predeterminada definida con anterioridad, o La última ubicación que recibió artículos, o La ubicación actual del artículo, o La ubicación actual e histórica. El segundo método se refiere a la asignación automática a ubicaciones de área receptora. Las áreas receptoras son ubicaciones específicas definidas como Receptoras. Esta definición se realiza en los Datos maestros de ubicación. Aprendamos más sobre las ubicaciones receptoras. 35 PUBLIC Asignaciones de entrada Tipos de asignación automática en recepción Estrategias de asignación automática Ubicaciones receptoras

---

## Diapositiva 37

La ubicación receptora puede usarse como una sección especial en un almacén que típicamente representa un área de inspección de recepción o simplemente un área de tránsito para almacenamiento temporal de mercancías entrantes. En OEC Computers, George decidió gestionar un área receptora por las siguientes razones: En algunos casos, los empleados del almacén no saben dónde asignar ciertas mercancías. En otros casos no hay espacio para todas las mercancías recibidas. Para mantener el nivel correcto de inventario en SAP Business One, el inventario que no fue completamente asignado en la transacción de entrada, entrará en la ubicación receptora. Una vez encontrada una ubicación adecuada para las mercancías almacenadas en el área receptora, el empleado del almacén crea un documento de Transferencia de inventario para asignar las mercancías en la ubicación de almacenamiento. Las definiciones de ubicación receptora se configuran en dos ventanas: La ventana Configuración de almacén – Aquí se indica si se pueden definir ubicaciones receptoras en este almacén. La ventana Datos maestros de ubicación – Una vez habilitadas las ubicaciones receptoras para un almacén, puede designar cualquier ubicación como receptora marcando la casilla Ubicación receptora. En la ventana Configuración de almacén también puede elegir el orden de los códigos de ubicación receptora. En el campo Artículos recibidos por, elija recibir artículos en ubicaciones receptoras según el orden alfanumérico de los códigos de ubicación o el orden alfanumérico del código de clasificación alternativo. 36 PUBLIC Ubicaciones receptoras  Primero defina su almacén como Habilitado para ubicaciones receptoras 1 2 Luego elija las ubicaciones que desea definir como ubicación receptora

---

## Diapositiva 38

Una ubicación predeterminada se usa como predeterminada para las transacciones de entrada de ubicación. Cuando se define una Predeterminada, se actualiza automáticamente en la fila del documento. Existen tres niveles de Predeterminados: Almacén, Grupo de artículos y Artículo. Puede introducir Predeterminados para los tres niveles. Cuando el sistema encuentra un conflicto entre uno o más Predeterminados, el código de ubicación predeterminada se elige según la prioridad mostrada en la imagen anterior. La primera prioridad es el Predeterminado a nivel de Artículo. La segunda prioridad es el Predeterminado a nivel de Grupo de artículos. Y la tercera prioridad es el Predeterminado a nivel de Almacén. El uso de un código de ubicación predeterminada puede imponerse en cada nivel. Al hacerlo, la ubicación predeterminada se elige automáticamente y no es posible cambiarla. Los códigos de ubicación predeterminada que no están impuestos pueden cambiarse en cualquier momento. 37 PUBLIC Estrategias de asignación automática - Ubicación predeterminada Prioridad 1: Predeterminado a nivel de Artículo Prioridad 2: Predeterminado a nivel de Grupo de artículos Prioridad 3: Predeterminado a nivel de Almacén

---

## Diapositiva 39

En la ventana Configuración de almacén puede introducir un código de ubicación predeterminada y elegir si imponerlo. Al habilitar las ubicaciones en un almacén, SAP Business One introduce automáticamente el código de Ubicación del sistema en el campo Ubicación predeterminada. Esto se hace para garantizar que cada transacción de entrada se realice fácilmente en una ubicación incluso si el conjunto completo de códigos de ubicación aún no se ha construido. Dado que la Ubicación del sistema no es una ubicación física real, es importante reemplazar el código predeterminado del almacén por un código de ubicación significativo o eliminar el valor predeterminado. 38 PUBLIC Estrategias de asignación automática - Ubicación predeterminada Tercera prioridad: Predeterminado a nivel de Almacén

---

## Diapositiva 40

En la ventana Configuración – Grupo de artículos, en la tabla Ubicaciones predeterminadas puede elegir, por Almacén, un código de ubicación predeterminada y si imponerlo. 39 PUBLIC Estrategias de asignación automática - Ubicación predeterminada Segunda prioridad: Predeterminado a nivel de Grupo de artículos

---

## Diapositiva 41

En los Datos maestros de artículo, en la pestaña Datos de inventario, puede introducir un código de ubicación predeterminada y elegir si imponer este código de ubicación. Esta Predeterminada se define por fila de Almacén. Para los almacenes que no están habilitados para ubicaciones, todos los campos de ubicación estarán desactivados. En el siguiente curso de ubicaciones - Uso de ubicaciones en los procesos empresariales, aprenderemos sobre el uso de las ubicaciones predeterminadas y otras estrategias de asignación automática en el proceso de asignación. 40 PUBLIC Estrategias de asignación automática - Ubicación predeterminada Primera prioridad: Predeterminado a nivel de Artículo

---

## Diapositiva 42

Ahora debería ser capaz de: Configurar almacenes gestionados por ubicaciones, subniveles de almacén y códigos de ubicación. Mantener y realizar cambios en los subniveles de almacén y códigos de ubicación existentes. Definir ubicaciones predeterminadas y ubicaciones receptoras. 41 PUBLIC Resumen Ahora debería ser capaz de:  Configurar almacenes básicos gestionados por ubicaciones, subniveles de almacén y códigos de ubicación.  Mantener y realizar cambios en los subniveles de almacén y códigos de ubicación existentes.  Definir ubicaciones predeterminadas y receptoras.

---

## Diapositiva 43

42 Ninguna parte de esta publicación puede reproducirse o transmitirse en ninguna forma ni para ningún propósito sin el permiso expreso de SAP SE o una empresa afiliada de SAP. La información aquí contenida puede modificarse sin previo aviso. Algunos productos de software comercializados por SAP SE y sus distribuidores contienen componentes de software propietarios de otros proveedores de software. Las especificaciones de productos nacionales pueden variar. Estos materiales son proporcionados por SAP SE o una empresa afiliada de SAP solo con fines informativos, sin representación ni garantía de ningún tipo. SAP y otros productos y servicios de SAP mencionados aquí, así como sus respectivos logotipos, son marcas comerciales o marcas registradas de SAP SE en Alemania y otros países.

---

