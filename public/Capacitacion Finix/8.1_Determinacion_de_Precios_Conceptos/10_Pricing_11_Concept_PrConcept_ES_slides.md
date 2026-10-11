# Transcripción por Diapositiva: 10_Pricing_11_Concept_PrConcept_ES

## Diapositiva 1

PUBLIC Determinación de precios: Conceptos SAP Business One Versión 10.0 Le damos la bienvenida al tema sobre los conceptos de precios. 1

---

## Diapositiva 2

En este tema, exploraremos cómo se gestiona la determinación de precios en SAP Business One.  Observaremos los tipos de precios y descuentos que pueden establecerse para artículos en el sistema.  Hablaremos de los artículos y las listas de precios. Observaremos cómo se asocian aquellos precios con un interlocutor comercial y cómo se llevan los precios a un documento. 2 PUBLIC Al finalizar este tema, podrá:  Describir los conceptos detrás de la determinación de precios en SAP Business One:  Tipos de precios y descuentos  Artículos y listas de precios  Asociación de precios con interlocutores comerciales  Determinación de precios en un documento Objetivos

---

## Diapositiva 3

Imagine que: Su empresa tiene listas de precios para distintos grupos de clientes. Algunos clientes, como sus mejores clientes, reciben una determinación especial de precios. Los clientes adicionalmente pueden recibir descuentos basados en grupos de artículos o propiedades de los artículos vendidos Periódicamente otorga descuentos de la lista de precios basados en las compras de cantidad o durante transacciones de ventas 3 3 PUBLIC Escenario empresarial  Su empresa cuenta con varias listas de precios que se usan para distintos grupos de clientes  Algunos clientes reciben precios especiales debido a su relación con la empresa  Los clientes también pueden recibir descuentos basados en las propiedades de los artículos vendidos  Periódicamente otorga descuentos de la lista de precios basados en las compras de cantidad o durante transacciones de ventas

---

## Diapositiva 4

Los negocios necesitan flexibilidad en la determinación de precios. Los distintos clientes reciben diferentes precios basados en las circunstancias de la venta. Por ejemplo, un cliente único paga más que un cliente habitual o uno de sus revendedores.  De igual modo un cliente que compra una gran cantidad obtendrá un mejor precio que un cliente que compra una unidad.  Los clientes de internet obtienen un precio menor que los clientes a los que se les presta atención al cliente en una tienda física. Es por eso que SAP Business One tiene varias maneras de gestionar la determinación de precios. Veamos algunas de las diferentes herramientas disponibles para definir la determinación de precios. En SAP Business One, contamos con listas de precios, descuentos por período y cantidad, grupos de descuento, determinación especial de precios para interlocutores comerciales y acuerdos globales especiales. 4 PUBLIC Determinación de precios en Business One Precios especiales para los IC Grupos de descuento Descuentos por período y cantidad Listas de precios Acuerdos globales

---

## Diapositiva 5

El primer y más básico modo de determinar los precios es mediante las listas de precios. Puede definir listas de precios para distintos grupos de clientes. En cada lista de precios puede registrar un precio para cada artículo y unidad de medida. Luego cuando un interlocutor comercial que pertenece a esa lista de precios compra un artículo, obtiene el precio correcto para su grupo de clientes. 5 PUBLIC Determinación de precios en Business One: Listas de precios El método básico de determinación de precios:  Introduzca los precios en listas de precios y asigne la lista de precios correspondiente a cada interlocutor comercial. Precios especiales para los IC Grupos de descuento Descuentos por período y cantidad Listas de precios Acuerdos globales

---

## Diapositiva 6

Un precio básico para un producto puede no ser suficiente. Probablemente desee definir precios de venta por un período de tiempo limitado. Probablemente desee otorgar un descuento cuando un cliente compre en cantidad. Los descuentos por período y cantidad le permiten definir los descuentos por fecha, basados en cantidad de una lista de precios existente.  Los descuentos introducidos aquí sustituirán al precio básico en la lista de precios asignada al interlocutor comercial. La unidad de medida definida en los descuentos por periodo y cantidad debe coincidir con la unidad de medida especificada en la línea del documento para que se aplique el descuento. 6 PUBLIC Determinación de precios en Business One: Descuentos por período y cantidad Defina un precio de descuento por fecha y cantidades en una lista de precios. Sustituye a la lista de precios básica asignada al interlocutor comercial. Precios especiales para los IC Grupos de descuento Descuentos por período y cantidad Listas de precios Acuerdos globales

---

## Diapositiva 7

El próximo nivel de determinación de precios es el grupo de descuento. Puede añadir descuentos basados en el grupo de artículo, propiedades y fabricante.  Estos tipos de precios se denominan grupos de descuento. Si una partida individual de pedido de cliente es relevante para el precio de un grupo de descuento, luego ese precio sustituirá a un precio basado en un descuento por período o cantidad, o una lista de precios. 7 PUBLIC Determinación de precios en Business One: Grupos de descuento Defina el porcentaje de descuento por grupo de artículos, propiedades del artículo o fabricante. Sustituye a los descuentos por período y cantidad. Precios especiales para los IC Grupos de descuento Descuentos por período y cantidad Listas de precios Acuerdos globales

---

## Diapositiva 8

Algunas veces desea ofrecer a sus clientes por defecto una mejor compra.  En ese caso, puede usar precios especiales para los interlocutores comerciales. Puede basar sus descuentos en cualquier lista de precios, o simplemente introducirlos manualmente. Puede definir descuentos por rango de fecha y cantidades y unidades de medida. Los precios especiales definidos para un interlocutor comercial anulan al resto de precios excepto los acuerdos globales. Sin embargo, observe que la unidad de medida definida en el precio especial debe coincidir con la unidad de medida especificada en la línea para que el descuento se aplique. 8 PUBLIC Determinación de precios en Business One: Precios especiales para interlocutores comerciales Determine precios especiales según artículo, IC, fechas y cantidades. Sustituye a todos los precios (excepto los acuerdos globales). Precios especiales para los IC Grupos de descuento Descuentos por período y cantidad Listas de precios Acuerdos globales

---

## Diapositiva 9

Los acuerdos globales (con el tipo Específico) le permiten negociar artículos, cantidades y precios con un interlocutor comercial durante un determinado período de validez.  Este precio negociado sustituirá todos los demás tipos de determinación de precios de un documento de marketing. 9 PUBLIC Determinación de precios en Business One: Acuerdos globales Especifica los precios de artículo que ha negociado con un interlocutor comercial. Sustituye todos los demás precios Precios especiales para los IC Grupos de descuento Descuentos por período y cantidad Listas de precios Acuerdos globales

---

## Diapositiva 10

Notará que los cuatro tipos de precios varían desde las "listas de precios" más generales a los “precios especiales para los interlocutores comerciales” más específicos. Cuando el sistema busca un precio, busca el tipo de precio más específico primero.  Entonces, eso significa que comienza con los tipos de precios listados en el orden opuesto a cómo se introdujeron en esta diapositiva. El sistema comienza un acuerdo global específico aplicable que contenga un precio. Si no existe un acuerdo global específico que se aplique, buscará un precio especial para ese interlocutor comercial. Si no existe un precio especial para ese interlocutor comercial, busca grupos de descuento. Si dichos grupos tampoco existen, busca los descuentos por período o cantidad. En caso de que tampoco existan, utiliza la lista básica de precios asignada al interlocutor comercial para encontrar ese precio. El sistema también busca la determinación de precios asociada a la unidad de medida utilizada en la línea. 10 PUBLIC Determinación de precios en Business One Precios especiales para los IC Grupos de descuento Descuentos por período y cantidad Listas de precios Acuerdos globales Especifica los precios de artículo que ha negociado con un interlocutor comercial. Sustituye todos los demás precios Determine precios especiales según artículo, IC, fechas y cantidades. Sustituye a todos los precios (excepto los acuerdos globales). Defina el porcentaje de descuento por grupo de artículos, propiedades del artículo o fabricante. Sustituye a los descuentos por período y cantidad. Defina porcentajes de descuento por fecha y cantidades en una lista de precios. Sustituye a la lista de precios básica asignada al interlocutor comercial. El método básico de determinación de precios:  Introduzca los precios en listas de precios y asigne la lista de precios correspondiente a cada interlocutor comercial.

---

## Diapositiva 11

Comencemos centrándonos en listas de precios, porque son la forma más básica de determinar precios. Gestionar múltiples listas de precios le brinda flexibilidad en la determinación de precios. Por ejemplo, desea ofrecer a aquellos clientes que realizan compras regularmente o que compran grandes cantidades, precios más bajos que a aquellos otros clientes que solo compran de forma ocasional, o en pequeñas cantidades. La determinación de precios también se puede basar en el tamaño del cliente. Las listas de precios no solo se utilizan en ventas, sino que como en todas las funcionalidades de determinación de precios, también se utilizan en las compras. Generalmente tendrá una o varias listas de precios definidas para representar los precios de sus proveedores por los artículos que compra con regularidad. 11 PUBLIC Listas de precios  Las listas de precios brindan flexibilidad en la determinación de precios  Las listas de precios se utilizan en las ventas y las compras Listas de precios El método básico de determinación de precios:  Introduzca los precios en listas de precios y asigne la lista de precios correspondiente a cada interlocutor comercial.

---

## Diapositiva 12

Todos los artículos del sistema están vinculados automáticamente a todas las listas de precios. Puede fijar un indicador en Parametrizaciones generales que elimine los artículos sin precio de las listas de precios. Si observa el registro maestro de artículos comprobará que es posible ver precios de varias listas de precios directamente en el registro maestro de artículos.   Solo se mostrará una lista de precios a la vez, pero puede acceder a cada una y visualizar el precio asignado. Puede asignar precios para el artículo en todas menos en dos de las listas de precios.  Existen dos listas de precios por defecto que actualiza el sistema y los usuarios no pueden modificar: Último precio evaluado y Último precio de compra. Sin embargo, aunque es posible hacerlo, puede que no desee mantener la determinación de precios para las otras listas de precios directamente en el registro maestro de artículos, ya que este sustituye automáticamente a la determinación de precios en una lista de precios. 12 PUBLIC Precios de artículos Lista precios Datos maestros de artículo 299,00 Lista precios compra 599,00 499,00 799,00 349,00 299,00 Lista precios p. poca ctd. Lista precios p. gran ctd. Lista de precios 04 Lista de precios 05 Lista de precios 06 … Núm. artículo A1001  Todos los artículos del sistema están vinculados automáticamente a todas las listas de precios.  En la ventana Datos maestros de artículo, puede utilizar una lista desplegable para visualizar cada lista de precios y precio asignado.  El sistema actualiza automáticamente dos listas de precios:  Último precio evaluado  Último precio de compra

---

## Diapositiva 13

Cuando crea un interlocutor comercial, se asigna una lista de precios para cada interlocutor comercial. Las listas de precios pueden predeterminarse del grupo de clientes del cliente o desde las condiciones de pago asignadas si no se asigna una lista de precios al grupo de clientes. Se asigna un interlocutor comercial a una sola lista de precios. Puede visualizar y modificar la lista de precios que aparece por defecto en el registro maestro de interlocutor comercial. 13 PUBLIC Concepto de lista de precios Datos maestros de interlocutor comercial Lista precios Lista precios p. gran ctd. C1001 Cond. de pago Se asigna una lista de precios a cada interlocutor comercial. Lista precios Datos maestros de artículo Lista precios p. gran ctd. 499,00 Núm. artículo A1001

---

## Diapositiva 14

Al crear un documento de marketing, el sistema introduce la lista de precios asociada al interlocutor comercial en la cabecera del documento. Puede ver la lista de precios asignada en la ventana Parametrizaciones de formulario del documento. Puede sustituir la lista de precios asignada en el documento, modificándola directamente en Parametrizaciones de formulario o modificando la lista de precios asignada las condiciones de pago en la ficha Finanzas del documento.  Si modifica las condiciones de pago, el sistema le solicitará que pregunte si desea cambiar las condiciones de pago asignadas al interlocutor comercial. 14 PUBLIC Concepto de lista de precios Datos maestros de interlocutor comercial Lista precios Lista precios p. gran ctd. C1001 Cond. de pago Interlocutor comercial Documento Artículo       Precio un. C1001 A1001 Lista precios Datos maestros de artículo Lista precios p. gran ctd. 499,00 Núm. artículo A1001 La lista de precios del interlocutor comercial aparece por defecto en la cabecera de documento

---

## Diapositiva 15

A medida que introduce artículos en el documento, el sistema propone un precio para cada artículo en base a la lista de precios o descuentos o precios especiales definidos. 15 PUBLIC Concepto de lista de precios Datos maestros de interlocutor comercial Lista precios Lista precios p. gran ctd. C1001 Cond. de pago Documento Artículo       Precio un. C1001 A1001            499.00 Lista precios Datos maestros de artículo Lista precios p. gran ctd. 499,00 Núm. artículo A1001

---

## Diapositiva 16

16 PUBLIC Dos campos controlan la determinación de precios en las líneas Precio por un. % descuento Total 300                        10                  270  Estos dos campos trabajan juntos para brindarle el precio total de la fila.  El sistema buscará un precio y determinará si se aplican descuentos. Hay dos campos que controlan la determinación de precios en las líneas de los documentos de marketing.  Campo Precio por unidad  Campo % de descuento. Hay dos campos que controlan la determinación de precios en las líneas de los documentos de marketing. El campo Precio por unidad y el campo % de descuento.  Estos dos trabajan juntos para brindarle el precio total de la fila. El sistema buscará un precio y determinará si se aplican descuentos. 16

---

## Diapositiva 17

Dado que es posible definir diversos precios en el sistema para el mismo artículo, el sistema necesitará utilizar una lógica determinada para buscar el precio válido, comenzando por el precio más específico. El sistema utiliza la lista anterior de prioridades para localizar el precio válido. Una vez ha encontrado el precio y los descuentos aplicables, registra los resultados en el documento. El primer lugar en el que se debe buscar es en cualquier acuerdo global específico para este cliente.  Si existe un acuerdo global válido para este interlocutor comercial y este artículo con un precio, entonces el sistema lo utilizará primero. 17 PUBLIC Determinación de precios en SAP Business One Artículo Precio p/un.     Descuento Documento ??? ??? 3. ¿Existe un grupo de descuento? 2. ¿Existe un precio especial del IC y específico del artículo para el artículo y la unidad de medida? 1. ¿Existe un acuerdo global específico válido para el artículo? 5. Lista de precios 4. ¿Existen descuentos por período y cantidad en la lista de precios?

---

## Diapositiva 18

Si no existe un acuerdo global válido, el sistema buscará precios especiales para ese interlocutor comercial. El interlocutor comercial, la posición y la unidad de medida en los precios especiales de interlocutores comerciales debe coincidir con los del documento. Si se encuentra un precio, se introduce en el documento. Los precios especiales para el precio del interlocutor comercial también pueden tener un porcentaje de descuento asociado además de un precio.   Si existe un porcentaje de descuento, también se indica. 18 PUBLIC Determinación de precios en SAP Business One Artículo Precio p/un.     Descuento Documento ??? ??? 3. ¿Existe un grupo de descuento? 2. ¿Existe un precio especial del IC y específico del artículo para el artículo y la unidad de medida? 1. ¿Existe un acuerdo global específico válido para el artículo? 5. Lista de precios 4. ¿Existen descuentos por período y cantidad en la lista de precios? NO

---

## Diapositiva 19

Si no existe ningún precio en los precios especiales de interlocutores comerciales, el sistema buscará un grupo de descuento asociados con ese interlocutor comercial. Un grupo de descuento tendrá un porcentaje de descuento asociado, pero no incluirá ningún precio. Si existe un grupo de descuento, el descuento se introducirá. Incluso si se encuentra un descuento, el sistema seguirá buscando para encontrar un precio y que este se aplique al descuento. El sistema busca primero un precio en cualquier lista de precios de descuentos por período y cantidad asignada al cliente. Si se encuentra una, los descuentos del grupo de descuentos se aplicarán al precio de la lista de precios de período y cantidad.  Si no existe un registro de período y cantidad válido para dicho cliente, el descuento del grupo de descuento se aplicará al precio en la lista de precios asignada del cliente. 19 PUBLIC Determinación de precios en SAP Business One Artículo Precio p/un.     Descuento Documento ??? ??? 3. ¿Existe un grupo de descuento? 2. ¿Existe un precio especial del IC y específico del artículo para el artículo y la unidad de medida? 1. ¿Existe un acuerdo global específico válido para el artículo? 5. Lista de precios 4. ¿Existen descuentos por período y cantidad en la lista de precios? NO NO

---

## Diapositiva 20

Lo siguiente que busca el sistema es un descuento por período y cantidad El sistema busca para ver si el artículo y la unidad de medida especificados en la línea coincide con el descuento por período o cantidad de la lista de precios. Si se encuentran un grupo de descuento aplicable y un descuento por período y cantidad, el porcentaje de descuento se aplica al campo Descuento y precio de descuento por período y cantidad se aplica al campo Precio por unidad. 20 PUBLIC Determinación de precios en SAP Business One Artículo Precio p/un.     Descuento Documento ??? ??? 3. ¿Existe un grupo de descuento? 2. ¿Existe un precio especial del IC y específico del artículo para el artículo y la unidad de medida? 1. ¿Existe un acuerdo global específico válido para el artículo? 5. Lista de precios 4. ¿Existen descuentos por período y cantidad en la lista de precios? NO NO NO

---

## Diapositiva 21

Si no existe un descuento por período y por cantidad válido en esta lista de precios para este artículo y unidad de medida, entonces utiliza la lista de precios básica asignada al documento para determinar el precio por unidad. Si existe un precio específico para la unidad de medida en el documento, entonces se utilizará ese precio. Sin embargo, la lista de precios no necesita incluir una entrada de la unidad de medida específica utilizada en el documento.  Se calculará un precio del artículo de forma automática en base a las relaciones en el grupo de unidades de medida. Si ha habido un grupo de descuento aplicable, pero ningún descuento por período y cantidad, el descuento se tomaría de los grupos de descuento y el precio por unidad de la lista de precios. 21 PUBLIC Artículo Precio p/un.     Descuento Documento ??? ??? Determinación de precios en SAP Business One 3. ¿Existe un grupo de descuento? 2. ¿Existe un precio especial del IC y específico del artículo para el artículo y la unidad de medida? 1. ¿Existe un acuerdo global específico válido para el artículo? NO NO Artículo Precio p/un.     Descuento Documento 479 NO 5. Lista de precios 4. ¿Existen descuentos por período y cantidad en la lista de precios? NO

---

## Diapositiva 22

Dado que el documento incluye precios no solo desde la lista de precios, sino también desde otros tipos de determinación de precios especiales, como descuentos por período y cantidad, grupos de descuento y precios especiales para interlocutores comerciales, es útil poder identificar la fuente del precio. El campo fuente del precio brinda información sobre la fuente de los precios y descuentos en la línea del artículo. El campo puede incluir uno de los siguientes valores: • Lista de precios inactiva. Esto indica que la lista de precios para el interlocutor comercial está inactiva. • Lista de precios activa.  Esto significa que el precio se toma desde la lista de precios del interlocutor comercial, sin descuentos. • Lista de precios activa, grupos de descuento. En este caso, el descuento se toma del grupo de descuento y el precio proviene de lista de precios. • Precios especiales para interlocutores comerciales Esto significa que el precio se toma desde la ventana Precios especiales p. interlocutores comerciales. • Descuento por período y cantidad. Esto muestra que el precio se toma desde la ventana Descuentos por período y cantidad. • Descuento por período y cantidad, grupos de descuento; el descuento se toma del grupo de descuento y el precio se toma del descuento por período y cantidad Este campo puede ser especialmente útil para verificar si todo funciona de forma correcta cuando define los precios por primera vez. Para ver el campo fuente de precios, defínalo como visible en Parametrizaciones de formulario. 22 PUBLIC Fuente de precio en documentos El campo Fuente de precios brinda información sobre la fuente de un precio o un descuento en la línea del artículo Debe activar Fuente de precio en las parametrizaciones del formulario

---

## Diapositiva 23

23 PUBLIC Campo de precio efectivo Precio p/un. % descuento Total Precio p/un. Descuento 270 Ninguno definido* 300 20% 300 300                  20                240 Precios especiales p.IC Grupo de descuento Dtos. p/período y ctd. Precio de lista de precios Muchas empresas desean utilizar la jerarquía de determinación de precios que busca primero el precio más específico. En la mayoría de los casos, se elegirá el mejor precio para el interlocutor comercial. Sin embargo, si una empresa tiene una gran cantidad de “ventas flash” que ofrecen grandes descuentos durante un breve período de tiempo, puede haber situaciones en las que un cliente con la determinación de precios específica de interlocutor comercial no recibirá el mejor descuento.  Si lo más probable es que esto ocurra, tiene la opción de utilizar una opción en la pestaña Datos maestros de interlocutor comercial: Condiciones de pago, que le permite hacer que el sistema busque todos los posibles precios disponibles y seleccione siempre el precio más bajo. Este caso se describe en el ejemplo que se muestra en esta diapositiva. El campo Precio efectivo se predetermina en Prioridad por defecto, pero lo puede cambiar por Precio más bajo o Precio más alto. 23

---

## Diapositiva 24

24 PUBLIC Campo de precio efectivo Cuando se selecciona la opción Precio más bajo/Precio más alto en el campo Precio efectivo , la opción El precio efectivo tiene en cuenta todas las fuentes de precio está disponible. Para aplicar esta definición para todos los interlocutores comerciales, marque la casilla de selección El precio efectivo tiene en cuenta todas las fuentes de precio en la pestaña Gestión - -> Inicialización del sistema - -> Configuraciones generales - -> Determinación de precios. Cuando se selecciona la opción Precio más bajo/Precio más alto en el campo Precio efectivo, la opción El precio efectivo tiene en cuenta todas las fuentes de precio está disponible. Para aplicar esta definición para todos los interlocutores comerciales, marque la casilla de selección El precio efectivo tiene en cuenta todas las fuentes de precio en la pestaña Gestión - -> Inicialización del sistema - -> Configuraciones generales - -> Determinación de precios. 24

---

## Diapositiva 25

25 PUBLIC Campo de precio efectivo 3. ¿Existe un grupo de descuento? 2. ¿Existe un precio especial del IC y específico del artículo para el artículo y la unidad de medida? 1. ¿Existe un acuerdo global específico válido para el artículo? 5. Lista de precios 4. ¿Existen descuentos por período y cantidad en la lista de precios? Nota: cuando se selecciona la Prioridad por defecto en el campo Precio efectivo, el sistema utiliza la lógica explicada anteriormente para encontrar el precio válido, empezando por el precio más específico (acuerdo global). 25

---

## Diapositiva 26

26 PUBLIC Opción de determinación de precios brutos Habilitar el modo precio bruto y neto individual Precio bruto Descuento Precio bruto total Parametrizaciones sobre los detalles de la empresa: Parametrizaciones sobre ICs y listas de precios: Campo Modo de precios con opciones de lista desplegable: Bruto frente a neto Asigne las listas de precios brutos para IC mediante determinación del precio bruto Efecto del documento de marketing: Documento marcado en el campo Modo de precio como bruto Precio por unidad en gris, en lugar de utilizar los campos de precio bruto Hemos explicado de forma básica la determinación de precios que calcula un precio neto. También tiene la opción de usar precios brutos. En la ventana Detalles de la empresa, puede elegir la opción de trabajar con la determinación de precios en neto o en bruto.  Existe una casilla de selección Habilitar el modo precio bruto y neto individual.  Esta parametrización es irreversible. Una vez haya habilitado esta parametrización, puede controlar qué listas de precios y qué interlocutores comerciales utilizan la determinación de precios brutos.  Todas las listas de precios tienen un campo llamado Modo de precios que le permite configurar la lista de precios para la determinación de precios brutos o netos.  Este campo también está en la ventana Datos maestros de interlocutor comercial en la pestaña Condiciones de pago. Cuando el precio bruto está habilitado para un interlocutor comercial, el campo de precio por unidad está desactivado en los documentos.  En su lugar, se utilizan las columnas de precio bruto y precio bruto total.   Puede tener precios brutos con descuentos en la determinación de precios. 26

---

## Diapositiva 27

Existen 5 tipos de determinación de precios en SAP Business One:  listas de precios, descuentos por período y cantidad, grupos de descuento, determinación especial de precios para interlocutores comerciales y precios de acuerdos globales especiales. Al crear un documento de marketing, el sistema introduce la lista de precios asociada al interlocutor comercial en la cabecera del documento. Puede visualizar la lista de precios asignada en la ventana Parametrizaciones de formulario. El sistema propone un precio para cada artículo en el documento. Puede modificar la lista de precios asignada en el documento, ya sea modificándola directamente o seleccionando diferentes condiciones de pago.  Si modifica las condiciones de pago, el sistema le solicitará que pregunte si desea cambiar la lista de precios o no. A medida que introduce artículos en el documento, el sistema propone un precio para cada artículo en base a la lista de precios o precios especiales definidos. El sistema busca primero el precio más específico y continúa hasta que encuentra un precio aplicable.  Si se encuentra un descuento, el descuento debe aplicarse a un precio. El orden de jerarquía de la determinación de precios es: acuerdos globales específicos, precios especiales para un interlocutor comercial, grupos de descuento, descuentos por período y cantidad basados en la lista de precios asociados con el documento de marketing y finalmente, precios en la lista de precios. El campo fuente de precios muestra la fuente de los precios y descuentos en la línea del documento. Tiene la opción de utilizar la opción Precio efectivo en los Datos maestros de interlocutor comercial para que el sistema busque todos los precios posibles disponibles y seleccione siempre el precio más bajo o más alto. Existe la opción de utilizar la determinación de precios brutos además de la determinación de precios 27 27 PUBLIC Resumen A continuación, se detallan algunos puntos clave:  Existen 5 clases de precios:  listas de precios, descuentos por período y cantidad, grupos de descuento, determinación especial de precios para interlocutores comerciales y precios de acuerdos globales especiales.  Cuando crea un documento, el sistema muestra la lista de precios asociada con el interlocutor comercial. Puede modificar la lista de precios asignada en el documento.  El sistema propone un precio para cada artículo en el documento. El sistema busca primero el precio más específico y continúa hasta que encuentra un precio aplicable.  Si se encuentra un descuento, el descuento debe aplicarse a un precio.  El orden de jerarquía de la determinación de precios es: acuerdos globales específicos, precios especiales para un interlocutor comercial, grupos de descuento, descuentos por período y cantidad, lista de precios.  El campo fuente de precios muestra la fuente de los precios en la línea.  Tiene la opción de utilizar la opción Precio efectivo en los Datos maestros de interlocutor comercial para que el sistema busque todos los precios posibles disponibles y seleccione siempre el precio más bajo o más alto.  Existe la opción de utilizar la determinación de precios brutos además de la determinación de precios netos. Ambas listas de precios e interlocutores comerciales se pueden establecer para utilizar la determinación precios brutos.

---

## Diapositiva 28

netos.  Ambas listas de precios e interlocutores comerciales se pueden establecer para utilizar la determinación de precios brutos o la determinación de precios netos. 27

---

