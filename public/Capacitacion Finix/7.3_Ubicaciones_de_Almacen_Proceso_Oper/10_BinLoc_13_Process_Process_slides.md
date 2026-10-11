# Transcripción por Diapositiva: 10_BinLoc_13_Process_Process

## Diapositiva 1

Procesos de Asignación en Ubicaciones de Almacén — SAP Business One Versión 10.0. Bienvenido al curso: Proceso de Asignación en Ubicaciones de Almacén. Este curso forma parte de una serie de cursos disponibles sobre el tema de ubicaciones de almacén.

---

## Diapositiva 2

Al finalizar este módulo, podrás: Asignar artículos manualmente y de forma automática en los procesos de negocio: Ventas y Compras, Inventario, Picking y Embalaje, y Producción. Objetivos.

---

## Diapositiva 3

Esta es la agenda del curso. Comenzaremos con una breve revisión del proceso de configuración que vimos en el curso de Configuración de ubicaciones de almacén. Luego veremos cómo realizar la asignación manual en transacciones de entrada y salida. Después aprenderemos los distintos métodos de asignación automática. Una vez familiarizados con los métodos automáticos, veremos cómo el sistema asigna artículos según dichos métodos. También examinaremos diferentes escenarios que involucran ubicaciones de almacén: cambiar una asignación ya realizada, copiar y cancelar un documento, usar borradores y más. A continuación, asignaremos artículos en transacciones de inventario. Por último, veremos cómo se ven afectados los procesos de Picking y Embalaje y de Producción por la solución de Ubicaciones de Almacén. Pero primero, revisemos un ejemplo de negocio sobre OEC Computers y su estructura de almacén. Agenda: Ejemplo de negocio / Procesos de asignación manual (Entradas y Salidas) / Procesos de asignación automática (Entradas y Salidas) / Escenarios adicionales / Ubicaciones de almacén en documentos de inventario / Asignaciones en el módulo de Picking, Embalaje y Producción / Asignaciones en el proceso de Producción.

---

## Diapositiva 4

Acabas de terminar de configurar las ubicaciones de almacén en OEC Computers. Ahora continúas con la implementación del módulo de ubicaciones de almacén. OEC Computers compra mercancías a distintos fabricantes y distribuidores, y luego las vende a sus clientes. Durante estos procesos logísticos, las mercancías se asignan a y desde ubicaciones de almacén. Asesoras al gerente de almacén y su equipo sobre cómo crear asignaciones manuales. Además, le muestras al gerente cómo definir las reglas para asignaciones automáticas y cómo se usan dichas reglas en el proceso de negocio.

---

## Diapositiva 5

Para configurar las ubicaciones de almacén en OEC Computers, primero necesitamos examinar la estructura del almacén. En la imagen podemos ver el almacén principal de OEC Computers. Es un gran hangar dividido en pasillos. Cada pasillo tiene estantes a los lados y cada estante está dividido en niveles, tal como se muestra en la imagen.

---

## Diapositiva 6

Conozcamos la estructura de subniveles de un almacén gestionado por ubicaciones de almacén, para entender cómo definir ubicaciones en el almacén de OEC Computers. La estructura de un almacén suele estar compuesta por distintos niveles: un pasillo, una estantería o un piso. Un tipo de área puede ser subnivel de otro tipo. En OEC Computers, por ejemplo, una estantería es subnivel de un pasillo, es decir, un pasillo contiene varias estanterías. SAP Business One admite hasta 4 subniveles de almacén. La combinación del código de almacén y los códigos de subnivel define el código único de ubicación. Un ejemplo: el código de ubicación 05-A1-S2-L1. El mismo código de subnivel puede usarse en muchos códigos de ubicación. El nivel L1 aparece asociado tanto a S1 como a S2.

---

## Diapositiva 7

Veamos un ejemplo de estructura de código de ubicación. El código es una combinación del almacén y los códigos de subnivel: 01 – A4 – S2 – L9, que corresponde a: Almacén 01 – Pasillo 4 – Estantería 2 – Nivel 9.

---

## Diapositiva 8

Veamos cómo se realiza una asignación manual y conozcamos la ventana de asignación. Agenda: Ejemplo de negocio / Procesos de asignación manual (Entradas y Salidas) / Procesos de asignación automática (Entradas y Salidas) / Escenarios adicionales / Ubicaciones de almacén en documentos de inventario / Asignaciones en Picking, Embalaje y Producción / Asignaciones en el proceso de Producción.

---

## Diapositiva 9

En documentos de marketing, transacciones de inventario, el procedimiento de Picking y Embalaje y el proceso de producción, se pueden asignar artículos a y desde ubicaciones de almacén. La asignación ocurre al emitir documentos que generan transacciones de inventario (incluido el proceso de conteo de inventario). Por eso, la opción de asignación de ubicación no existe en documentos como órdenes de venta. En las siguientes diapositivas seguiremos el proceso de asignación manual en documentos de marketing para la entrada y salida de mercancías. Comenzamos con una demostración en un documento de Entrega.

---

## Diapositiva 10

Todo documento de recepción de inventario que involucre un almacén gestionado por ubicaciones requiere asignación a ubicaciones específicas. Esta asignación puede ser manual o automática. Empezamos con la asignación manual para comprender mejor el mecanismo. La asignación se hace por fila de documento en la ventana Asignación de Ubicación de Almacén. Antes de asignar, verifica que la cantidad y el código de almacén correctos estén actualizados en la fila. Para asignar manualmente, elige la flecha de enlace en el campo Asignación de Ubicación para abrir la ventana de asignación de recepción. En el encabezado verás información de la fila original: Número de Documento, Número de Fila, Código de Almacén y Número de Artículo, así como la cantidad a asignar. En la matriz inferior, asigna la cantidad de la fila a las ubicaciones deseadas. Puedes elegir un código de ubicación de una lista o ingresarlo manualmente. Puedes dividir la cantidad entre varios códigos de ubicación. Usa CTRL+B para ingresar la cantidad restante en el campo Asignado. La cantidad asignada no puede superar la cantidad de la fila. El botón Borrar Asignación limpia las cantidades asignadas. También puedes acceder a esta ventana desde el menú contextual.

---

## Diapositiva 11

La ventana Asignación de Ubicación (recepción y emisión) solo se abrirá cuando la fila elegida contenga: Número de Artículo, Cantidad y Código de Almacén. La cantidad ingresada en el campo Asignado siempre es positiva, aunque la cantidad de la fila sea negativa. Una sola asignación puede incluir varios almacenes: tanto gestionados por ubicaciones como almacenes regulares. Tras agregar el documento, la flecha de enlace en la columna Asignación de Ubicación abre el informe Lista de Registros de Inventario, filtrado por las transacciones de la fila del documento correspondiente. Este informe es muy útil al recibir mercancías, ya que el almacenero puede ubicar físicamente los artículos según el informe emitido.

---

## Diapositiva 12

Ahora veremos cómo se realizan las asignaciones automáticas. Primero examinaremos el proceso de recepción de mercancías, aprenderemos los dos métodos automáticos para recibir y veremos cómo se realiza la asignación automáticamente. Luego examinaremos el proceso de emisión de mercancías, revisaremos los cinco métodos automáticos de recepción y veremos un ejemplo de cada uno. También veremos qué ocurre cuando la cantidad a asignar es insuficiente y qué pasa al cambiar los detalles de la fila tras una asignación ya realizada. Pero primero, recordemos los dos métodos de asignación automática para la recepción de mercancías.

---

## Diapositiva 13

En el curso de Configuración conocimos los dos métodos de asignación automática en recepción: el primero consiste en elegir una estrategia de asignación automática (ubicación predeterminada o ubicaciones actuales/históricas del artículo); el segundo consiste en definir ubicaciones de almacén como Ubicaciones de Recepción, que sirven como área de tránsito para controles de calidad u otros procedimientos. El gráfico muestra los dos procesos propuestos: a la izquierda, un proceso con estrategias de asignación automática donde los artículos van directamente a ubicaciones de almacenamiento; a la derecha, un proceso con Ubicaciones de Recepción donde los artículos van primero a la ubicación de recepción y luego, mediante una Transferencia de Inventario, a la ubicación de almacenamiento.

---

## Diapositiva 14

Una estrategia principal en la lista es la Ubicación Predeterminada. A diferencia de las Ubicaciones de Recepción, estas son ubicaciones de almacenamiento permanentes, no temporales. Las ubicaciones predeterminadas se pueden definir a nivel de Almacén, Grupo de Artículos o Artículo. Una transacción entrante que involucre cualquiera de estos tres niveles se actualiza automáticamente con la ubicación predeterminada definida (según reglas de prioridad). Esta asignación automática ocurre al seleccionar un artículo en la fila del documento, siempre que Cantidad y Almacén estén definidos. Las ubicaciones predeterminadas pueden forzarse en cualquier nivel, lo que significa que no se puede asignar a ninguna otra ubicación, aunque se haya elegido otra estrategia de asignación automática en la configuración del almacén. Prioridad: 1) Nivel de Artículo, 2) Nivel de Grupo de Artículos, 3) Nivel de Almacén.

---

## Diapositiva 15

Para explicar las otras tres estrategias, usamos un ejemplo. Observa la tabla. Hay tres ubicaciones. Ubic_1 y Ubic_2 tienen cantidad no nula del artículo A; Ubic_3 tiene cantidad cero pero tuvo una transacción de entrada el 1 de mayo. La estrategia "Última Ubicación Usada que Recibió el Artículo" asigna a la ubicación con la entrada más reciente — Ubic_1 (1 de julio). La estrategia "Ubicación Actual del Artículo" asigna a la ubicación que actualmente contiene el artículo, según orden alfanumérico — Ubic_2 (antes que Ubic_1 en orden alfanumérico). La estrategia "Ubicaciones Actuales e Históricas del Artículo" asigna a Ubic_3, la primera en orden alfanumérico entre todas las que alguna vez recibieron el artículo A. Una opción útil en todas las estrategias: activar "Recibir hasta Cantidad Máxima" en la configuración del almacén para respetar el máximo de la ubicación. Si la cantidad supera ese máximo en asignación manual, aparece un mensaje de advertencia.

---

## Diapositiva 16

Conozcamos el segundo método de asignación automática: las Ubicaciones de Recepción. Son ubicaciones de tránsito que se usan como área de inspección para control de calidad u otros procedimientos. También permiten recibir mercancías aunque el almacenero no sepa aún dónde ubicarlas físicamente. Con este método, todas las transacciones de entrada van a las Ubicaciones de Recepción, salvo que se elijan manualmente otras ubicaciones en el documento. La asignación automática ocurre al agregar el documento. Si la cantidad de la fila no está completamente asignada, el sistema sugiere asignarla a la ubicación de recepción. Al aprobar, asigna la cantidad no asignada a la ubicación marcada como "Recepción" en el maestro de ubicación. Tras completar la recepción, los artículos se transfieren mediante un documento de Transferencia de Inventario a las ubicaciones de almacenamiento. Nota: esta funcionalidad solo aplica a documentos de compra, no a documentos de inventario (Recepción de Mercancías, Transferencia de Inventario, Recepción de Producción, ni transacciones de ensamblado entrantes).

---

## Diapositiva 17

Esta tabla resume la diferencia entre los dos tipos de asignación automática. Con estrategias de asignación automática, las ubicaciones se rellenan en las filas del documento antes de agregarlo. Con las Ubicaciones de Recepción, la asignación ocurre solo después de agregar el documento. En documentos de compra, cuando ambas aplican simultáneamente: el sistema no asigna automáticamente según la estrategia (ni siquiera si hay una ubicación predeterminada forzada); al agregar el documento sin asignación manual, sugiere asignar la cantidad no asignada a la Ubicación de Recepción.

---

## Diapositiva 18

Notas importantes sobre la asignación automática de entradas: cuando una Ubicación Predeterminada está forzada, la asignación siempre va a esa ubicación, sin importar la estrategia definida en la configuración del almacén. Para evitar cualquier asignación automática, selecciona la estrategia de Ubicación Predeterminada y asegúrate de que no haya ninguna ubicación predeterminada definida en almacenes, grupos de artículos ni artículos. En la ventana Configuración de Formulario puedes elegir otra ubicación de asignación para todo el documento, anulando así la estrategia automática (salvo que haya una ubicación predeterminada forzada). Para más detalles sobre las definiciones necesarias, consulta el curso de Configuración.

---

## Diapositiva 19

Tras los métodos automáticos de entradas, veamos los métodos de asignación automática de salidas. La asignación de artículos desde ubicaciones puede realizarse automáticamente al emitir documentos que generan transacciones de inventario de salida. La cantidad a asignar puede tomarse de diferentes ubicaciones en cierto orden. Esta definición se realiza en la ventana Configuración del Almacén y aplica a todas las transacciones de emisión. Aun así, es posible cambiar manualmente el método de asignación automática por transacción de salida.

---

## Diapositiva 20

En la tabla vemos todos los métodos de emisión con una breve descripción: Elección Única: la asignación automática solo ocurre cuando hay una sola opción posible. Orden por Código de Ubicación: según el orden alfanumérico de los códigos de ubicación. Orden por Código de Clasificación Alternativa: según el orden alfanumérico de los códigos alternativos. Cantidad Descendente: según la cantidad de artículo en cada ubicación, de mayor a menor. Cantidad Ascendente: según la cantidad de artículo, de menor a mayor. Cantidad Ascendente - Preferencia de Una Sola Ubicación: primera ubicación con la cantidad completa en la lista ascendente. FIFO: según la fecha de entrada del artículo en la ubicación, comenzando por la más antigua. LIFO: según la fecha de entrada, comenzando por la más reciente.

---

## Diapositiva 21

El primer método es Elección Única. Las empresas lo eligen cuando quieren controlar cuidadosamente el proceso de asignación. Solo activa la asignación automática cuando existe una única opción posible. Ejemplo: en la tabla hay tres ubicaciones con cantidades del artículo A. Si la cantidad a asignar es 7 (igual al total), solo hay una opción posible y la asignación es automática. Si la cantidad es 3, existen múltiples combinaciones posibles (2 de Ubic_1 + 1 de Ubic_2, o 3 de Ubic_3), y el sistema no asigna automáticamente; se requiere asignación manual.

---

## Diapositiva 22

Los métodos segundo y tercero asignan según orden alfanumérico. La asignación automática ocurre siempre que haya cantidad disponible. Con Orden por Código de Ubicación, el sistema elige primero la ubicación con el código alfanumérico más bajo: ejemplo con cantidad 3 → 2 de Ubic_1 (01-A4-S1-L1) y 1 de Ubic_2 (01-A1-S4-L3). Con Orden por Código de Clasificación Alternativa, se ordena por el código alternativo: Ubic_2 tiene código 00010 (primero), Ubic_3 tiene 00050 (segundo) → 1 de Ubic_2 y 2 de Ubic_3. A diferencia del código de ubicación, el código alternativo puede editarse para crear un orden diferente.

---

## Diapositiva 23

Los métodos cuarto y quinto asignan según la cantidad del artículo en cada ubicación. Con Cantidad Descendente, comienza por la ubicación con mayor cantidad: ejemplo con total 5 → 4 de Ubic_3 (mayor) y 1 de Ubic_1. Con Cantidad Ascendente, comienza por la ubicación con menor cantidad: 1 de Ubic_2, 2 de Ubic_1, 2 de Ubic_3. La diferencia clave: Cantidad Descendente minimiza el número de ubicaciones usadas por transacción (mínimo de picks). Cantidad Ascendente reduce progresivamente el número de ubicaciones por artículo, ya que vacía primero las que tienen menos stock.

---

## Diapositiva 24

Con los métodos FIFO y LIFO, el sistema verifica la fecha de la última transacción de entrada en cada ubicación. En FIFO, el sistema busca la fecha más antigua: en el ejemplo, Ubic_2 (1 de junio) es anterior a Ubic_1 (1 de julio) → asigna 1 de Ubic_2 y 1 de Ubic_1 para una cantidad de 2. En LIFO, busca la fecha más reciente: Ubic_1 (1 de julio) → asigna los 2 de Ubic_1.

---

## Diapositiva 25

Independientemente del método definido en la configuración, es posible cambiar el método de emisión del documento o la fila antes de agregarlo. Para cambiar el método de todo el documento, entra en Configuración de Formulario → pestaña Tabla del Documento. Para cambiar el método de una fila, entra en la ventana Asignación de Ubicación – Emisión y elige el botón Asignación Automática, donde seleccionas el método deseado. En el ejemplo mostrado, se eligió Orden por Código de Ubicación: la tabla se ordena por código de ubicación y el sistema asigna 1 de la primera y 1 de la segunda. En OEC Computers, se definió Cantidad Ascendente como predeterminado para el almacén de Nueva York. Sin embargo, para artículos con muchas ubicaciones, es más práctico usar Cantidad Descendente, lo que el personal de almacén puede cambiar directamente en la ventana de Asignación.

---

## Diapositiva 26

La primera opción del menú desplegable para asignación automática es "Restante". No es uno de los métodos de la configuración del almacén, sino una forma de controlar el orden de asignación según múltiples parámetros. Con el método Restante, puedes usar parámetros adicionales no cubiertos por los métodos estándar, y priorizar el orden de picking de una entrega según campos adicionales en el formulario. Por ejemplo, OEC Computers puede ordenar la cuadrícula de asignación por Pasillo, luego Área y luego Fila, reduciendo así el área de picking. Las ubicaciones aparecen en la tabla ordenadas por cantidad disponible y ubicación física, y el sistema asigna en ese orden.

---

## Diapositiva 27

En conclusión: el sistema asigna automáticamente cuando existe cantidad en el almacén del documento. Con el método Elección Única, solo asigna cuando hay una única opción. En cualquier otro caso, puedes: asignar manualmente, elegir otro método automático para el documento completo o la fila, o usar el método Restante para ordenar los artículos según el criterio que definas.

---

## Diapositiva 28

Ahora que conocemos ambos procedimientos, surge la pregunta: ¿cuándo usar cada uno? La recomendación general es usar la asignación automática cuando satisfaga los requisitos del negocio, ya que ahorra tiempo, evita errores humanos y garantiza el cumplimiento de las reglas definidas. La asignación manual es flexible y ofrece control total sobre cada asignación. Un buen ejemplo para la automática: cuando la misma ubicación se usa regularmente para un artículo específico, tiene sentido definir una ubicación predeterminada. Si el almacenero ubica físicamente los artículos sin reglas predefinidas, se necesita asignación manual para reflejar la ubicación real. En algunos casos se combinan ambos métodos: con Elección Única, el sistema asigna automáticamente solo cuando hay una opción; si no es así, se asigna manualmente. Recuerda que, cuando hay reglas automáticas definidas, siempre puedes cambiar la asignación antes de agregar el documento.

---

## Diapositiva 29

En los procesos adicionales veremos qué ocurre al guardar un documento como borrador y al cancelarlo. Agenda: Ejemplo de negocio / Procesos de asignación manual (Entradas y Salidas) / Procesos de asignación automática (Entradas y Salidas) / Escenarios adicionales / Ubicaciones de almacén en documentos de inventario / Asignaciones en Picking, Embalaje y Producción / Asignaciones en el proceso de Producción.

---

## Diapositiva 30

¿Qué pasa cuando no hay cantidad suficiente para asignar? Cuando la cantidad disponible en el almacén es insuficiente, el sistema asigna la cantidad disponible automáticamente y muestra en rojo la cantidad asignada parcialmente en el campo Asignación de Ubicación. En la primera fila de la entrega no hay cantidad disponible, por lo que se muestra cero. En la segunda fila solo hay una unidad disponible; al entrar en la ventana de emisión se muestra que se necesitan 2 pero solo hay 1 disponible. Nota: si hay cantidad en otros almacenes, puedes cambiar el almacén de la fila para completar la asignación, lo que vuelve a activar la asignación automática. Si agregas el documento sin notar que la cantidad no fue completamente asignada, el sistema abre automáticamente la ventana de emisión para completarla.

---

## Diapositiva 31

En OEC Computers, a veces el almacenero emite una Entrega para artículos que aún están en el área de recepción porque no ha podido hacer la Transferencia de Inventario a tiempo. Esta situación puede generar una cantidad negativa en la ubicación de almacenamiento. Para estos casos, se puede activar la opción de inventario negativo agregando la columna Permitir Inventario Negativo. En el ejemplo, se necesitan 3 unidades pero solo hay 2. Al marcar "Permitir Inventario Negativo", se puede asignar la cantidad completa y la cantidad disponible resultante en esa ubicación aparece como -1.

---

## Diapositiva 32

A veces es necesario hacer cambios en los detalles de la fila tras una asignación ya realizada (por ejemplo, aumentar o disminuir la cantidad, o cambiar el artículo). Si cambias el artículo o el almacén en la fila, el sistema borra la asignación e intenta reasignar automáticamente si es posible. Este diagrama de flujo muestra qué ocurre al cambiar la cantidad: si la asignación original era automática, se vuelve a asignar automáticamente con los nuevos valores. Si la asignación era manual, el sistema te da la opción de asignar manual o automáticamente, ya que se asume que querrás hacerlo nuevamente de forma manual.

---

## Diapositiva 33

Al guardar un documento como borrador, las asignaciones manuales se guardan con él. Las asignaciones automáticas, en cambio, no se guardan. Nota: cualquier actualización realizada en la ventana Asignación de Ubicación de Almacén – Emisión/Recepción hace que la asignación se considere manual, incluso si se modificó una asignación automática.

---

## Diapositiva 34

Existen dos opciones de cancelación de documentos de marketing: la primera es copiar el documento a un documento inverso (por ejemplo, copiar una Entrega a un Devolución). En este caso, aplican los procesos automáticos normales de asignación de entradas y salidas. La segunda opción es elegir "Cancelar" en el menú contextual. Se abre un nuevo documento del mismo tipo en modo Agregar y los artículos deben asignarse nuevamente. Las asignaciones del documento original se copian al documento de cancelación. Los procesos de asignación automática también aplican a documentos que generan transacciones de inventario y se copian desde documentos base.

---

## Diapositiva 35

Cuando la cantidad de la fila es negativa: en transacciones de entrada, se abre la ventana Asignación de Ubicación – Emisión. Para transacciones de salida con cantidad negativa, se abre la ventana Asignación de Ubicación – Recepción.

---

## Diapositiva 36

Veamos cómo se realizan las asignaciones en documentos de inventario. Agenda: Ejemplo de negocio / Procesos de asignación manual (Entradas y Salidas) / Procesos de asignación automática (Entradas y Salidas) / Escenarios adicionales / Ubicaciones de almacén en documentos de inventario / Asignaciones en Picking, Embalaje y Producción / Asignaciones en el proceso de Producción.

---

## Diapositiva 37

Los procedimientos de asignación en Recepción de Mercancías y Emisión de Mercancías son similares a los de los documentos de marketing de entrada y salida, con una excepción: en los documentos de inventario no hay asignación automática a Ubicación de Recepción.

---

## Diapositiva 38

En nuestro ejemplo, OEC Computers trabaja con Ubicaciones de Recepción. George (el gerente) realiza varias Transferencias de Inventario al día para trasladar mercancías del área de recepción a las ubicaciones de almacenamiento. El documento de Transferencia de Inventario admite traslados entre ubicaciones dentro del mismo almacén o entre almacenes distintos. Los campos Almacén Origen, Almacén Destino y Ubicación Destino en el encabezado contienen los valores predeterminados para las filas. La imagen muestra también la columna "Primera Ubicación", que muestra la ubicación sin necesidad de abrir la ventana de Asignación de Ubicación; si se usaron varias, muestra la primera según el orden de asignación. Esta estructura permite crear el documento para múltiples almacenes de origen simultáneamente, incluso cuando la funcionalidad de ubicaciones no está activada en ninguno. Si un almacén de origen o destino no gestiona ubicaciones, los campos correspondientes aparecen desactivados.

---

## Diapositiva 39

Nota: la Transferencia de Inventario genera dos tipos de asignación: salida y entrada. La flecha de enlace en el campo Ubicaciones Origen abre la ventana Asignación de Ubicación – Emisión. La flecha de enlace en el campo Ubicaciones Destino abre la ventana Asignación de Ubicación – Recepción.

---

## Diapositiva 40

Se puede cancelar o invertir una Transferencia de Inventario existente. En ambos casos, el sistema crea otra Transferencia de Inventario con cantidades de signo opuesto. Al cancelar, se agrega automáticamente una Transferencia de cancelación. Al invertir, se abre automáticamente un nuevo documento en modo Agregar para editarlo manualmente antes de guardarlo. En el nuevo documento: los campos Ubicaciones Origen y Destino se invierten, al igual que los almacenes Origen y Destino. Nota: la funcionalidad de inversión está disponible aunque las ubicaciones de almacén no estén activadas.

---

## Diapositiva 41

Revisemos el procedimiento de asignaciones en el módulo de Picking, Embalaje y Producción. Agenda: Ejemplo de negocio / Procesos de asignación manual (Entradas y Salidas) / Procesos de asignación automática (Entradas y Salidas) / Escenarios adicionales / Ubicaciones de almacén en documentos de inventario / Asignaciones en Picking, Embalaje y Producción / Asignaciones en el proceso de Producción.

---

## Diapositiva 42

En el Gestor de Picking, Embalaje y Producción se crean asignaciones de salida para la Lista de Picking. En el cajón Abierto, elige el botón Liberar a Lista de Picking para entrar al Asistente de Generación de Listas de Picking. En el primer paso puedes filtrar subniveles de almacén y atributos de las ubicaciones de las que quieres recoger. En el segundo paso puedes indicar si quieres crear varias listas de picking dividiendo las filas de pedido por almacén, subnivel o atributo, y elegir el método de asignación automática. Como este asistente puede ejecutarse para varios almacenes simultáneamente, el método de asignación no se copia desde la configuración del almacén; el método predeterminado es Orden por Código de Ubicación. En el tercer paso puedes ver y editar la lista de listas de picking propuestas. La cuadrícula muestra una columna por cada Subnivel de Almacén o Atributo elegido en el segundo paso. Para almacenes sin ubicaciones activadas, se ofrece un asistente de dos pasos. Si hay pedidos relacionados con almacenes con y sin ubicaciones, se generará una única lista de picking para las filas de los almacenes sin ubicaciones. El Gestor también permite crear entregas y facturas; los documentos creados están sujetos a las reglas de asignación automática vistas anteriormente.

---

## Diapositiva 43

Volvamos al ejemplo de negocio. En el almacén de tres pisos de OEC Computers en Nueva York, preparar un envío era antes una tarea difícil. Durante la implementación se decidió incluir estos pasos para mejorar el proceso: primero, George (el gerente) asignó un operario por piso; segundo, al crear listas de picking, George las divide por Piso usando el Asistente, y en cada lista asigna el nombre del picker. Para envíos grandes, George también divide por subnivel de Área y asigna pickers diferentes a distintas áreas. George evalúa la carga de trabajo prevista mirando las columnas Número de Picks y Cantidad Total Liberada en el tercer paso del asistente. Si es necesario, retrocede un paso para dividir las listas por otro subnivel.

---

## Diapositiva 44

Es posible realizar cambios en las asignaciones en el cajón Liberado. Al abrir la lista de filas liberadas, cualquier flecha de enlace en la columna Asignación de Ubicación abre la ventana de emisión, desde donde puedes reasignar cantidades o completar cantidades faltantes. La reasignación también es posible para subniveles o Atributos no incluidos en el Asistente. Por ejemplo, si en el Asistente se eligió solo el pasillo A1, el sistema asigna automáticamente solo 6 artículos, pero aún puedes entrar a la ventana y asignar otros 4 del pasillo A2. Al elegir el botón Crear en el cajón Liberado, puedes crear una Entrega o Factura con las asignaciones realizadas.

---

## Diapositiva 45

En la Lista de Picking aparece una fila por ubicación por fila de Pedido de Venta. Antes de que los artículos sean recogidos, aún puedes reasignarlos. En el menú contextual, selecciona Asignación de Ubicación. Aparece la ventana de emisión donde puedes cambiar las asignaciones. Nota: la reasignación se hace por artículo por fila de documento original, incluso si el artículo está asignado desde varias ubicaciones (y por tanto en varias filas de la Lista). La imagen muestra una lista de picking con 2 filas para el mismo artículo: está dividida porque la ubicación de la primera fila es distinta a la de la segunda. SAP Business One permite reasignar directamente en la Lista de Picking, ahorrando tiempo cuando un operario elige artículos de ubicaciones diferentes a las originalmente seleccionadas.

---

## Diapositiva 46

Una Lista de Picking también puede crearse directamente desde el Pedido de Venta. En lugar de usar el Asistente, haz clic derecho en el Pedido de Venta y elige Generar/Ver Listas de Picking. Se abre una nueva Lista de Picking con los artículos, almacenes y ubicaciones ya completados (según las reglas automáticas). Esta solución también admite empresas que procesan pedidos individualmente: emite el informe Lista de Artículos Abiertos, entra a cada pedido a entregar, haz clic derecho para generar la Lista de Picking, y asigna las listas de picking a los operarios. Alternativamente, puedes usar el informe Análisis de Ventas para filtrar pedidos por artículo, cliente, grupo, etc. Nota: la generación automática de la lista solo ocurre si los artículos pueden asignarse completamente a ubicaciones; si no, se abre el primer paso del Asistente con las filas del pedido ya incluidas. La opción de lista de picking directa también está disponible para almacenes sin ubicaciones activadas y puede emitirse desde una Factura Reserva.

---

## Diapositiva 47

Por último, veremos cómo el proceso de Producción se ve afectado por la solución de Ubicaciones de Almacén. Agenda: Ejemplo de negocio / Procesos de asignación manual (Entradas y Salidas) / Procesos de asignación automática (Entradas y Salidas) / Escenarios adicionales / Ubicaciones de almacén en documentos de inventario / Asignaciones en Picking, Embalaje y Producción / Asignaciones en el proceso de Producción.

---

## Diapositiva 48

En el proceso de producción, se pueden especificar ubicaciones de almacén en los documentos de Recepción de Producción y Emisión de Producción. Las reglas de asignación automática aplican tanto para el producto padre como para sus componentes. Con el método de Retroalimentación (Backflush), los componentes se asignan automáticamente desde las ubicaciones. Si las reglas automáticas no aplican (por ejemplo, con Elección Única), el sistema asigna desde la Ubicación Predeterminada. Si no hay ninguna definida, la asignación se hace desde la Ubicación del Sistema, lo que probablemente generará una cantidad negativa en esa ubicación. Para completar el proceso de producción y eliminar esa cantidad negativa, se necesita una Transferencia de Inventario manual. La siguiente diapositiva muestra la solución que ofrece SAP Business One para evitar esa necesidad.

---

## Diapositiva 49

Esta solución crea una Transferencia de Inventario a un almacén de área de producción. Primero debes definir un almacén para el área de producción. Luego, agrega una Orden de Producción e indica el nuevo almacén de producción en las filas. Tras agregar la Orden de Producción, abre el menú contextual y elige la opción Transferir Componentes. Se abre un nuevo documento de Transferencia de Inventario con los componentes de la Orden de Producción en las filas. El campo Almacén Destino se completa automáticamente con el almacén de producción especificado en la Orden. Al agregar la Transferencia, los artículos se trasladan a ese almacén. Nota: todos los componentes se copian completamente a la Transferencia, incluso si la Orden de Producción fue fabricada parcialmente.

---

## Diapositiva 50

Esta solución crea una Transferencia de Inventario a un almacén de área de producción. Primero debes definir un almacén para el área de producción. Luego, agrega una Orden de Producción e indica el nuevo almacén de producción en las filas. Tras agregar la Orden de Producción, abre el menú contextual y elige la opción Transferir Componentes. Se abre un nuevo documento de Transferencia de Inventario con los componentes de la Orden de Producción en las filas. El campo Almacén Destino se completa automáticamente con el almacén de producción especificado en la Orden. Al agregar la Transferencia, los artículos se trasladan a ese almacén. Nota: todos los componentes se copian completamente a la Transferencia, incluso si la Orden de Producción fue fabricada parcialmente.

---

## Diapositiva 51

Puntos clave: En documentos de marketing, transacciones de inventario, Picking y Embalaje y Producción, se pueden asignar artículos a y desde ubicaciones de almacén. La asignación puede ser manual o automática mediante reglas definidas. Hay dos tipos de asignación automática de entradas: Ubicaciones de Recepción (ubicaciones designadas como área de tránsito) y Estrategias de asignación (ubicación predeterminada, ubicación actual u otras). Existen varios métodos de asignación automática de salidas: orden por código de ubicación, por fecha de entrada del artículo, entre otros. El Asistente de Picking, Embalaje y Producción: puede filtrarse y dividirse por subnivel de almacén o atributo, muestra la lista propuesta de listas de picking organizada por subnivel y número de picks, y los artículos pueden reasignarse en la lista según el picking real.

---

## Diapositiva 52

En el proceso de producción: las ubicaciones pueden especificarse en los documentos de Recepción e Emisión de Producción. Con el método de Retroalimentación, los componentes se asignan automáticamente desde las ubicaciones. Si las reglas automáticas no aplican (incluida la ubicación predeterminada), la asignación se hace desde la Ubicación del Sistema. Para trasladar la asignación de inventario de la Ubicación del Sistema a un almacén de producción designado, emite un documento de Transferencia de Inventario desde la Orden de Producción.

---

## Diapositiva 53

Aviso legal SAP — sin cambios respecto al documento original.

---
