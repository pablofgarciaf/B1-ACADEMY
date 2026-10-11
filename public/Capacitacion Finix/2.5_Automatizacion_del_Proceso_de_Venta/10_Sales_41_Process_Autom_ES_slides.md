# Transcripción por Diapositiva: 10_Sales_41_Process_Autom_ES

## Diapositiva 1

PUBLIC Ventas - clientes: Automatización del proceso de ventas SAP Business One Versión 10.0 Bienvenido al tema sobre la automatización del proceso de ventas. 1

---

## Diapositiva 2

2 PUBLIC Al finalizar este tema, podrá:  Analizar las formas de automatizar el proceso de ventas  Explicar el funcionamiento de la verificación de disponibilidad en el proceso de ventas  Enumerar las funciones del responsable de picking, embalaje y producción  Describir las ventajas de utilizar el Asistente de generación de documentos Objetivos En este tema, analizaremos las formas de automatizar el proceso de ventas, especialmente cómo interactuamos con la gestión de almacén. Veremos el funcionamiento de la verificación de disponibilidad automática en el proceso de ventas. También veremos las funciones suministradas por el responsable de picking, embalaje y producción y cómo se integran al proceso de ventas.  Analizaremos la ventaja de utilizar el Asistente de generación de documentos.

---

## Diapositiva 3

3 PUBLIC Escenario empresarial  La empresa define la satisfacción del cliente como prioridad. Por lo tanto, ellos han seleccionado automatizar los pasos del proceso de ventas.  Las verificaciones de disponibilidad automáticas se llevan a cabo en el pedido del cliente para garantizar que las cantidades suficientes estén disponibles para completar los pedidos del cliente de forma oportuna.  Si un producto no está disponible en el almacén local, usan las opciones disponibles para enviar ese artículo u otro artículo aceptable tan rápido como sea posible.  En caso de recibir pedidos de cliente de prioridad muy alta, pueden reprogramar las entregas.  La empresa usa el encargo de picking, embalaje y producción para automatizar el proceso de picking y entregar artículos de forma oportuna.  La facturación se automatiza usando el asistente de generación de documentos.  La empresa define la satisfacción del cliente como prioridad. Por lo tanto, ellos han seleccionado automatizar los pasos del proceso de ventas.  Las verificaciones de disponibilidad automáticas se llevan a cabo en el pedido del cliente para garantizar que las cantidades suficientes estén disponibles para completar los pedidos del cliente de forma oportuna.  Si un producto no está disponible en el almacén local, usa las opciones disponibles para enviar ese artículo u otro artículo aceptable tan rápido como sea posible. En caso de recibir pedidos de cliente de prioridad muy alta, pueden reprogramar las entregas.  La empresa usa el encargo de picking, embalaje y producción para automatizar el proceso de picking y entregar artículos de forma oportuna.  La facturación se automatiza usando el asistente de generación de documentos. 3

---

## Diapositiva 4

4 PUBLIC Automatización del proceso de ventas Verificación de disponibilidad  Verificación de disponibilidad  Picking utilizando listas de picking  Embalaje  Generación de documentos de entrega  Generación de facturas de clientes Pedido de cliente Picking Embalaje Entrega Factura de clientes Veremos cinco lugares del proceso de ventas en los que la automatización de ventas añade eficiencia: Verificación de disponibilidad, picking utilizando listas de picking, embalaje, generación de documentos de entrega y facturas de clientes mediante el asistente de generación de documentos. 4

---

## Diapositiva 5

5 PUBLIC Pedido de cliente Picking Embalaje Entrega Factura de clientes Cómo hace la automatización que el proceso de ventas sea eficiente Se produce una verificación de disponibilidad automática para los pedidos de cliente. La cantidad disponible se compromete en el inventario. El personal del almacén utiliza el Responsable de picking, embalaje y producción para crear listas de picking para pedidos de cliente que deben entregarse. Los colectores seleccionan los artículos y registran las cantidades seleccionadas en el sistema. Los colectores embalan los artículos y generan documentos de entrega. La entrega contabiliza la reducción del inventario y reduce la cantidad comprometida. Las facturas de cliente se generan en lotes mediante el asistente de generación de documentos. Verificación de disponibilidad  Vamos a ver un ejemplo sobre cómo puede la automatización contribuir para hacer que el proceso de ventas sea más eficiente.  Se produce una verificación de disponibilidad automática cuando introduce artículos y cantidades en un pedido de cliente.  Cuando se confirma que los artículos están disponibles, la cantidad se compromete en el inventario.  El personal del almacén accede y filtra los pedidos de cliente pendientes en el Responsable de picking, embalaje y producción para crear listas de picking para pedidos de cliente que deben entregarse.  Los colectores seleccionan los artículos de los estantes del almacén y registran las cantidades seleccionadas en el sistema.  Los colectores crean paquetes para los artículos con listas de embalaje y documentos de entrega generados a través del Responsable de picking, embalaje y producción.  La entrega contabiliza la reducción en el inventario y reduce la cantidad comprometida del pedido de cliente.  Luego de que se envían los artículos, las facturas de cliente se generan en lotes de facturación mediante el asistente de generación de documentos. 5

---

## Diapositiva 6

6 PUBLIC Objetivo de la verificación de la disponibilidad de los artículos  La verificación de disponibilidad de artículos determina si el artículo está disponible:  En una cantidad suficiente  En un almacén particular  En la fecha de entrega que solicita el cliente Pedido de cliente Verificación de disponibilidad  La verificación de disponibilidad de artículos determinará si el artículo está disponible: • En cantidad suficiente para su pedido de cliente • En el almacén particular asociado con su línea de pedido de cliente • En la fecha de entrega que solicita el cliente 6

---

## Diapositiva 7

7 PUBLIC Cálculo de disponibilidad Pedido de cliente Verificación de disponibilidad = En stock - Comprometido + solicitado Cantidad disponible ¿Cómo se calcula la disponibilidad?  ¿Cómo se calcula la disponibilidad?  La definición básica es: La cantidad disponible se calcula como la cantidad en stock menos la cantidad comprometida más la cantidad solicitada. 7

---

## Diapositiva 8

8 PUBLIC Datos de inventario en el registro maestro de artículo En stock Comprometido Solicitado Nombre de almacén #   Cód. almacén Almacén general 688                            38                     100                 750 Costa Este                           40                            10                       10 40 Costa oeste                           40 40 Entrega directa = En stock  - Comprometido + solicitado Cantidad disponible 1 2 3 4 5 01 02 03 04 768                           48                      110                 830 Disponible  El sistema realiza un seguimiento de las cantidades de cada artículo y muestra las cantidades de cada almacén en el registro maestro de artículos.  La ficha de datos de inventario del informe maestro de artículos muestra información actualizada de los niveles de stock y la demanda del artículo de cada almacén. Esta información se actualiza de manera dinámica para mostrar una imagen real en cualquier momento. Puede visualizar: – La cantidad en stock – La cantidad comprometida, que representa una cantidad reservada, como la cantidad solicitada por los clientes necesaria para los componentes de una orden de producción o la cantidad que se aparta para trasladarla a otro almacén. – La cantidad solicitada, que representa cualquier cantidad solicitada por su empresa para la compra pero que no se ha entregada todavía. o la cantidad que figura en las órdenes de producción para un artículo producido internamente, o una cantidad solicitada de otro almacén – Por último, muestra la cantidad disponible, que es la cantidad disponible para sus pedidos de cliente. 8

---

## Diapositiva 9

9 PUBLIC Existen dos opciones en la verificación de disponibilidad 1) Verificación de disponibilidad estándar Busca automáticamente las cantidades de las líneas en los documentos de ventas. Si las cantidades no son suficientes, ofrece opciones para:  cambiar almacenes,  elegir artículos alternativos,  modificar las cantidades, o  ver un informe con varios almacenes 2) Verificación de cantidad ATP avanzada Ofrece más funciones para:  Crear líneas de programa confirmadas  Ver datos del programa de entregas  Reprogramar entregas de varios documentos  Solo disponible con SAP HANA • Existen dos opciones en la verificación de disponibilidad. • Solo puede seleccionar una opción: la verificación de disponibilidad estándar de SAP Business One o una verificación de cantidad ATP avanzada. • La verificación de disponibilidad estándar comprueba automáticamente las cantidades de las líneas de los documentos de ventas.  Si no hay suficiente cantidad de algo, este sistema de verificación muestra un cuadro emergente que ofrece distintas opciones para cambiar de almacén, elegir un artículo alternativo, cambiar las cantidades solicitadas o ver un informe en el que se muestren varios almacenes. • La verificación de disponibilidad estándar está disponible para las bases de datos de SAP HANA y MS SQL. • La segunda opción, la verificación de cantidad ATP avanzada, ofrece una función adicional para crear líneas de programa confirmadas con fechas de entrega para los artículos verificados, y la posibilidad de ver los datos del programa de dichos artículos.  Si es necesario, puede reprogramar las entregas de varios documentos.  Esta opción solo está disponible si utiliza una base de datos SAP HANA. 9

---

## Diapositiva 10

10 PUBLIC Ejemplo empresarial – Verificación de disponibilidad  Un cliente muy importante hace un pedido de 7 escáneres, pero solo hay 5 en el almacén principal  Se abre una ventana emergente que muestra que no se puede confirmar toda la cantidad  El vendedor puede hacer distintas cosas para satisfacer la solicitud del cliente Pedido de cliente Entrega Factura de clientes Verificación de disponibilidad  Vamos a ver cómo funciona la verificación de disponibilidad con un ejemplo empresarial.  Un cliente muy importante solicita 7 escáneres, pero lamentablemente solo 5 están disponibles actualmente en el almacén principal.  Cuando el vendedor introduce el artículo en el sistema, aparece un cuadro emergente en el que se le indica que no se puede confirmar toda la cantidad.  El vendedor tiene distintas opciones en cuanto a qué puede hacer para satisfacer la solicitud del cliente.  Vamos a ver qué opciones tiene cada verificación de disponibilidad. 10

---

## Diapositiva 11

11 PUBLIC Opción 1: Verificación de disponibilidad estándar Pedido de cliente Verificación de disponibilidad Pedido de cliente SC7701 Núm. artículo Descripción … Cantidad 7 01 Alm.  Vamos a ver la primera opción: La verificación de disponibilidad estándar de SAP Business One.  Cada vez que esté creando un pedido de cliente e indique una cantidad para un artículo que es mayor que la cantidad disponible para este artículo menos el stock mínimo en la fecha de entrega, la ventana Verificación de disponibilidad de artículos aparecerá de forma automática.  El vendedor ha introducido una cantidad de 7 para el artículo escáner, pero el sistema le indica que solo hay 5 unidades disponibles. 11

---

## Diapositiva 12

12 PUBLIC Opción 1: Verificación de disponibilidad estándar Pedido de cliente SC7701 Núm. artículo Descripción … Cantidad 7 01 Alm. Si Cantidad de pedido de cliente > Cantidad disponible Verificación de disponibilidad de artículos Seleccionar acción: Continuar Cambiar a cantidad disponible Visualizar cantidades en otros almacenes Visualizar artículos alternativos Borrar línea Número de artículo Almacén Cantidad solicitada Cantidad disponible A1000 01 7 06.06 Fe. vencimiento solic. 05.06 5 Disponib. más temprana Visualizar informe cantidad ATP Pedido de cliente Verificación de disponibilidad  Aparece la ventana Verificación disponibilidad artículo. Muestra la cantidad de 7 artículos solicitados en el pedido de cliente y la cantidad disponible en el inventario.  Se ofrecen varias acciones en esta ventana.  La primera opción es continuar.  Esto le permite aceptar la información y proceder sin cambiar el pedido de cliente.  En ese caso el artículo quedará pendiente.  La segunda opción es cambiar la cantidad en el pedido de cliente de la partida individual para que coincida con la cantidad disponible. Esto reduce la cantidad pedida a la cantidad disponible.  Si desea obtener más información antes de decidir sobre una resolución, puede elegir la opción de visualizar el Informe de disponibilidad.  Esto ofrece un informe rápido sobre la entrada y salida de stock, incluidas las proyecciones. Este informe también está disponible directamente en el menú contextual.  También puede verificar las cantidades en otros almacenes. A partir de este informe, puede verificar e incluso seleccionar cantidades de otro almacén.  En ocasiones, se definió un artículo con artículos alternativos.  Cuando opta por esta opción, puede verificar si hay artículos alternativos y si así fuera, puede seleccionar las cantidades desde un artículo alternativo.  Si el artículo no está disponible y no quedan opciones para puntualidad en las entregas, un cliente puede decidir no solicitar ese artículo.  Una de las opciones disponibles es eliminar el artículo de la línea del pedido de cliente.  En ocasiones, puede ver una opción adicional, Cambiar a disponibilidad más temprana.  Esta opción sólo aparece cuando puede calcularse la fecha de disponibilidad. Copia la fecha de disponibilidad más temprana en la línea de fecha de entrega. 12

---

## Diapositiva 13

13 PUBLIC Informe de cantidad ATP 12 07.06 Microchips Solic. 359 40 Acme Associates Pedido 396 25 06.06 Yogi Yoga Solic. 343 87 04.06.2018 CTI Corp Pedido 390 Disponible Solicitado Fe. entrega Fe. pedido Cliente/Proveedor Documento N. º 4 3 2 1 Comprom. 06.06 06.06 08.06 08.06 10.06 Núm. artículo Almacén SC7701 92 95 107 67 Almacén general  El informe de disponibilidad se encuentra en la verificación de disponibilidad, sin embargo, aun cuando tenga suficiente cantidad en un pedido, puede verificar la disponibilidad para comprometer un artículo.  En el menú contextual de una línea, seleccione la opción Disponibilidad. Esto abre una ventana con el informe de estado de inventario para el artículo de la línea.  Puede ver todos los documentos que afectan la entrada o salida de este artículo desde el almacén enumerado en la línea.  Puede utilizar la lista desplegable para ver un almacén alternativo.  En cada documento de la lista, usted puede ver el cliente o proveedor, fecha del pedido, fecha de entrega, la cantidad solicitada o comprometida.  Los documentos se enumeran en orden de fecha de entrega y se muestra la disponibilidad proyectada para el artículo en esa fecha.  Puede ampliar la información de cada documento de la lista. 13

---

## Diapositiva 14

14 PUBLIC Configuración de la verificación de disponibilidad estándar Gestión Inicialización del sistema Parametrizaciones de documento Activar verificación de disponibilidad automática Parametrizaciones de documento: Ficha Por documento Pedido de cliente Documento Para activar esta opción, vaya a la ficha Por documento de la ventana Parametrizaciones de documento y seleccione Pedido de cliente. Marque la casilla de selección Activar verificación de disponibilidad automática. 14

---

## Diapositiva 15

15 PUBLIC Opción 2: Verificación de cantidad ATP avanzada  Detalles del plan de entregas para diferentes tipos de documentos de demanda  Cantidades confirmadas para las fechas de entrega  Las reglas de verificación se pueden configurar de distinta forma para los artículos o los grupos de artículos  La verificación de disponibilidad de ATP se lleva a cabo para los documentos de demanda, por ejemplo:  Pedidos de cliente  Factura de reserva de clientes  Solicitudes de traslado  Pedidos (con cantidad negativa)  Facturas de reserva de cliente (con cantidad negativa)  Órdenes de producción  Las reglas de verificación se pueden configurar de distinta forma para los artículos o los grupos de artículos  Si está ejecutando la base de datos SAP HANA como base de datos de transacciones, es posible que quiera utilizar la segunda opción como función adicional.  SAP Business One, versión para SAP HANA tiene una opción de configuración para activar la cantidad ATP avanzada.  Tal y como se ha mencionado previamente, esta opción admite detalles de plan de entregas para distintos tipos de documentos que crean demanda y tienen una posible salida.  La verificación de ATP confirma la cantidad y las fechas de entrega y de reserva la información sobre la disponibilidad.  La verificación de ATP se lleva a cabo para los documentos de demanda como los pedidos de cliente y las facturas de reserva de cliente con cantidades positivas, solicitud de traslado de inventario, pedidos y facturas de reserva de proveedores con cantidades negativas, y órdenes de producción.  Las reglas de verificación se pueden configurar de distinta forma para los artículos o los grupos de artículos 15

---

## Diapositiva 16

16 PUBLIC Proceso de verificación de cantidad ATP avanzada  Introducción de datos = artículo+ almacén + cant. requerida + fecha requerida  Cantidad disponible = en stock + entradas previstas – cantidad solicitada/confirmada existente – cantidad asignada temporalmente Estrategias de entrega: Propuesta de entrega se divide la entrega para que coincida con cantidades disponibles, permite varias entregas. Entrega única solo se entregan artículos cuando se pueden mandar en la fecha solicitada. Entrega completa no se realiza la entrega hasta que no se puede enviar la cantidad completa Cuando crea un documento con demanda, como un pedido de cliente, la verificación de la cantidad ATP comprueba si se dispone de suficiente cantidad de artículos para entregarlos en la fecha solicitada. La verificación toma el artículo, el almacén, la cantidad solicitada y la fecha solicitada del documento para calcular la cantidad base. La disponibilidad es la suma de las cantidades en stock más las entradas previstas menos las cantidades solicitadas o confirmadas existentes.  La verificación también tiene en cuenta las cantidades asignadas temporalmente que estén tomando otros usuarios que también estén haciendo una verificación de cantidad ATP. El resultado es el resultado de la verificación de cantidad ATP.  Si en la verificación se determina que no hay una cantidad suficiente, se abre la ventana Detalles de plan de entregas en la que se indican algunas recomendaciones para las cantidades y las fechas de entrega solicitadas. En nuestro ejemplo, el cliente solicitaba 7 escáneres, pero solo se podían entregar a tiempo 5. Si no hay suficiente cantidad disponible en las fechas solicitadas, es posible aplicar una estrategia de entregas. En las estrategias de entregas se comprueba si un artículo se puede asignar a varias entregas. Hay tres estrategias de entregas:  Propuesta de entrega: se divide la entrega para que concuerde con la cantidad disponible que tiene. Si se elige esta opción, se entregarían 5 escáneres al cliente en la primera fecha disponible y los otros 2 restantes en una fecha posterior.  Entrega única: solo se entregan los artículos cuando se pueden mandar en la fecha solicitada. Si se elige esta opción, solo se entregarían 5 escáneres.  Un cliente que necesite los escáneres inmediatamente para un evento concreto elegiría esta opción.  Entrega completa: se retrasa la entrega para poder entregar la totalidad de la cantidad de los artículos solicitados. Esta sería la opción elegida si el cliente quiere instalar los 7 escáneres a la vez.  Es posible que quieran asegurarse de que toda la cantidad llega en la misma fecha. Es posible volver a abrir la ventana Detalles de plan de entregas desde el menú contextual de una línea de artículo del documento. 16

---

## Diapositiva 17

17 PUBLIC Verificar ATP sin un documento Introduzca la cantidad Consulte cuándo estará disponible la cantidad completa en la línea cronológica Abra la ventana Verificación ATP pulsando el icono Introduzca un artículo Además de verificar la disponibilidad desde documentos internos también es posible abrir una vista gráfica de la disponibilidad desde un icono de la barra de herramientas. Pulse el icono de Verificación ATP en la barra de herramientas para abrir la vista de la disponibilidad en todos los almacenes de un artículo concreto. Introduzca el artículo y la cantidad requerida.  Seleccione los almacenes cuyo inventario le gustaría ver. En nuestro ejemplo empresarial queremos ver cuándo estarán disponibles los 7 escáneres para nuestro cliente. Una vista gráfica muestra la disponibilidad de los artículos. El color rojo indica que no es posible entregar la cantidad total en dichas fechas. El color azul indica cuándo estará disponible la cantidad completa en la línea cronológica. Como podemos observar, el 6 de junio solo habrá 5 artículos disponibles. Puede recorrer la línea cronológica hacia la izquierda y hacia la derecha para ver cuándo estará disponible el artículo. También tiene la opción de cambiar de almacén y ver la disponibilidad de los artículos alternativos. 17

---

## Diapositiva 18

18 PUBLIC Configuración de la verificación ATP avanzada Parametrizaciones de documento: General Reglas verif. ATP - Configuración Activar cantidad ATP avanzada X Es posible asignar reglas de verificación a:  Grupos de artículos o  Artículos (ficha Datos de planificación) Para activar la verificación ATP avanzada hay que ir a la ficha Parametrizaciones del documento, General. Marque el cuadro de selección Activar cantidad ATP avanzada. Después pulse el botón para configurar las reglas de verificación de ATP.  Al hacerlo se abre Lista de reglas de verificación ATP. La regla por defecto es AA. Es posible crear más reglas de verificación.  Cuando cree una regla nueva, póngale un nombre y defina sus detalles. Las reglas de verificación se pueden asignar a grupos de artículos o a artículos concretos. Las reglas permiten definir si se desea incluir las entradas previstas pasadas, realizar o no una verificación automática, mostrar los detalles de la línea de programa y permitir que se entreguen las cantidades no confirmadas o retrasadas.  También puede definir si desea permitir que haya varias entregas o no. La regla de verificación asignada aparece en la ficha Datos de planificación de los artículos. 18

---

## Diapositiva 19

19 PUBLIC Herramienta para reprogramar entregas Amplíe los pedidos de cliente para ver los detalles sobre la cantidad que se va a entregar y las fechas de entrega. Abra Reprogramar entrega pulsando en el icono La gestión del plan de entregas es una herramienta que sirve para reprogramar las entregas. Para abrir esta herramienta hay que pulsar el icono de la barra de herramientas o seleccionar el menú Ventas – clientes. En nuestro ejemplo empresarial, un cliente muy importante necesita recibir los 7 escáneres puntualmente a toda cosa y no está dispuesto a aceptar otra opción. Únicamente los usuarios actualizados pueden reprogramar las entregas.  En nuestro ejemplo empresarial, el jefe de ventas y el jefe del almacén son los únicos empleados que tienen acceso. Después de hablar con el jefe de ventas, el jefe de almacén abre la herramienta de gestión del plan de entregas para ver todos los pedidos pendientes que hay para el artículo. Comprueba si puede reprogramar la cantidad comprometida de otro pedido de cliente que tenga menos prioridad para satisfacer el pedido urgente del cliente importante. Para hacerlo, abre la ventana de gestión del plan de entregas desde dentro del pedido guardado haciendo doble clic en la línea de la cantidad no confirmada.  Puede ver todas las líneas de pedido de cliente de este artículo. Otra forma de abrir la ventana es pulsar el icono de gestión del plan de entregas en la barra de herramientas y seleccionar después el artículo. Una vez que se abre la ventana puede ampliar cada pedido de cliente haciendo clic en la línea para ver las cantidades que hay que entregar y las fechas de entrega. Como podemos ver, hemos retrasado 4 días el pedido de cliente del cliente. 19

---

## Diapositiva 20

20 PUBLIC Reprogramación de entregas – Mover cantidades entre pedidos Haga clic en la barra para modificar la cantidad. La barra de color azul se vuelve dorada (amarilla) y aparece un botón de desplazamiento. Para hacer que el inventario esté disponible, seleccione el pedido de cliente del que quiere tomar los artículos y pulse la barra azul. La barra se vuelve de color amarillo y aparece un botón de desplazamiento. Arrastre la barra hacia la izquierda para reducir la cantidad. En la imagen se ve que el usuario quita 2 artículos del pedido de cliente. 20

---

## Diapositiva 21

21 PUBLIC Reprogramación de entregas – Confirmar los cambios La cantidad se desplaza de un pedido de cliente a otro. Si está de acuerdo con el resultado puede confirmar el cambio. La cantidad se desplaza de un pedido de cliente al otro. Como se puede observar, la cantidad completa está ahora disponible para entregarse en el primer pedido de cliente. El pedido de cliente de menor prioridad se ha retrasado 3 días. 21

---

## Diapositiva 22

22 PUBLIC Automatización de los pasos del proceso – Picking y embalaje Pedido de cliente Picking Embalaje Entrega Factura de clientes El Responsable de picking, embalaje y producción le permite gestionar de forma más eficiente los procesos de almacén de picking, embalaje y entrega.  Ahora veremos de forma más detallada el Responsable de picking, embalaje y producción y cómo puede mejorar el picking, el embalaje y la entrega.  Los temas del Responsable picking, embalaje y producción relacionados con las ventas, los traslados y la producción se tratan detalladamente en otras sesiones del curso. 22

---

## Diapositiva 23

23 PUBLIC Pedido de cliente Picking Embalaje Entrega Factura de clientes Pedido de cliente Picking Embalaje Entrega Factura de clientes Pedido de cliente Picking Embalaje Entrega Factura de clientes Ventajas del responsable de efectuar picking, embalaje y producción  Ver varias líneas de pedido de cliente  Agrupar partidas para las que se debe efectuar el picking en listas de picking para obtener una mayor eficacia.  El embalaje para las entregas puede realizarse centralmente.  Se pueden generar entregas para todos los artículos embalados y de picking.  El Responsable de picking, embalaje y producción le permite ver múltiples líneas de pedido de cliente y agruparlas en listas de picking para mayor eficacia.  Luego del picking, el embalaje para las entregas puede realizarse centralmente.  Entonces se pueden generar los documentos de entrega para todos los artículos embalados y de picking.  De esta forma, puede gestionar la logística de los pedidos de cliente de picking y envío de forma más eficiente.  En este tema del curso se presenta el concepto que hay detrás del Responsable de picking, embalaje y producción.  Para obtener información más detallada sobre este tema, véanse los tres cursos que se centran exclusivamente en el picking y embalaje. 23

---

## Diapositiva 24

24 PUBLIC Crear lista de picking Picking Abra un cajón para ver una pantalla con partidas abiertas, artículos liberados (en listas de picking) o artículos de picking El cajón abierto muestra líneas de varios pedidos de cliente. Puede seleccionar los artículos que desea liberar a las listas de picking e imprimir las listas para los colectores.  En nuestro ejemplo empresarial, el jefe de almacén abre el Responsable de picking, embalaje y producción.  Define los criterios de selección para sacar adelante todas las entregas de la semana.  El Responsable de picking, embalaje y producción muestra 3 cajones: Abierto en el caso de los artículos que todavía no están en una lista de picking, Liberado en el caso de los artículos que se han liberado a una lista de picking y Picking efectuado en el caso de todos los artículos que ya se han tomado.  En el cajón Abierto ve estas líneas del pedido de cliente y las líneas de muchos otros pedidos de cliente.  Selecciona los artículos que se van a liberar para la lista de picking e imprime las listas de picking de todos los colectores del almacén. 24

---

## Diapositiva 25

25 PUBLIC Crear lista de picking Picking  En nuestro ejemplo empresarial, el jefe de almacén abre el Responsable de picking, embalaje y producción.  Define los criterios de selección para sacar adelante todas las entregas de la semana.  El Responsable de picking, embalaje y producción muestra 3 cajones: Abierto en el caso de los artículos que todavía no están en una lista de picking, Liberado en el caso de los artículos que se han liberado a una lista de picking y Picking efectuado en el caso de todos los artículos que ya se han tomado.  En el cajón Abierto ve estas líneas del pedido de cliente y las líneas de muchos otros pedidos de cliente.  Selecciona los artículos que se van a liberar para la lista de picking e imprime las listas de picking de todos los colectores del almacén. 25

---

## Diapositiva 26

26 PUBLIC El asistente de generación de listas de picking le proporciona formas de dividir sus listas de picking para un picking óptimo. Asistente de generación de listas de picking  Por interlocutor comercial  Por clase de documento  Por documento  Por grupo de artículos  Por almacén Picking Cuando se liberan artículos a una lista de picking, se abre el asistente de generación de listas de picking. El asistente le proporciona formas de dividir sus listas de picking para un picking óptimo. Puede dividir las listas de picking por interlocutor comercial, clase de documento, documento individual, grupo de artículos, artículo o almacén. En este almacén, los artículos se organizan por grupos de artículos por lo que el responsable de almacén selecciona los grupos de artículos para organizar las listas de picking. 26

---

## Diapositiva 27

27 PUBLIC Picking, embalaje y creación de la entrega Picking Embalaje Entrega Los colectores: Utilizan una impresión de la lista de picking para encontrar los artículos. Preparan las entregas en la zona de picking Actualizan la lista de picking con las cantidades de picking Generan las entregas desde la lista de picking  Los colectores utilizan una impresión de la lista de picking para encontrar todos los artículos.  Preparan las entregas en la zona de picking.  Actualizan la lista de picking con la información sobre lo que han tomado.  Y después generan las entregas desde la lista de picking.  Cuando cada entrega se contabiliza, la cantidad comprometida se reduce para el pedido del cliente cuando la cantidad del stock se emite para la entrega.  Las entregas se cargan en camiones para llevarlas a los clientes. 27

---

## Diapositiva 28

28 PUBLIC Automatización de los pasos del proceso – Asistente de creación de documentos Pedido de cliente Picking Embalaje Entrega Factura de clientes  Una empresa generará un número de facturas de una vez en un lote.  El asistente de generación de documentos es una herramienta para ejecutar un lote de documentos de una vez.  Una empresa generará un número de facturas de una vez en un lote.  El asistente de generación de documentos es una herramienta para ejecutar un lote de documentos de una vez. 28

---

## Diapositiva 29

29 PUBLIC Asistente de creación de documentos Entregas para un cliente Opcionalmente, consolide facturas para un cliente individual en una factura Se deben generar facturas El asistente recopila líneas de documentos base y crea documentos de destino en función de los parámetros que defina.  El asistente es un proceso simple que se utiliza para recopilar líneas de los documentos base a los documentos de destino, según varios parámetros definidos por el usuario. Los ejemplos de parámetros que existen son: el tipo de documento de destino, la fecha de contabilización, la fecha del documento, los artículos o servicios, y muchos más.  El asistente se puede usar, por ejemplo, para generar una factura de clientes resumida para un cliente que contenga todas las notas de entrega que se crearon para el cliente durante la semana anterior. Es un método simple y a la vez eficaz de resumir los datos para reducir la entrada de datos. Todas las entregas para un cliente individual pueden consolidarse en una factura o configurarse para crear facturas separadas. 29

---

## Diapositiva 30

Al final del día, el asistente de generación de documentos genera facturas consolidadas para las entregas de cliente recientes. En nuestro caso, el departamento de facturación ha creado un conjunto de parámetros para generar las facturas que utilizan cada semana y crear las facturas por lotes. El generador de documentos crea facturas con líneas de resumen por nota de entrega. En dicho departamento han especificado qué criterios utilizan habitualmente para consolidar las facturas y cómo gestionar los problemas automáticamente cuando surgen. 30 30 PUBLIC Ejemplo empresarial: Generación de facturas

---

