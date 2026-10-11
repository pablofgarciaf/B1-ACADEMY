# Transcripción por Diapositiva: 10_Pricing_32_DiscSP_DiscGrp_ES

## Diapositiva 1

PUBLIC Determinación de precios: Grupos de descuento SAP Business One Versión 10.0 Le damos la bienvenida al tema sobre los grupos de descuento. 1

---

## Diapositiva 2

En este tema, aprenderá a determinar grupos de descuento para satisfacer sus necesidades en cuanto a la determinación de precios 2 PUBLIC Al finalizar este tema, podrá:  Definir los grupos de descuento que necesite para determinar los precios Objetivos

---

## Diapositiva 3

Imagine que su compañía desea introducir algunos descuentos nuevos. Algunas de estas ofertas se basarán en grupos de clientes específicos, otras ofertas estarán disponibles para todos los interlocutores comerciales, pero en base a artículos o fabricantes específicos. Algunos clientes reunirán los requisitos para múltiples descuentos del mismo producto, pero otros recibirán solo uno de los descuentos. Una oferta será "pague por 2, obtenga uno gratis" por un rango de productos como teléfonos móviles, recargas de cartuchos de tinta y discos. Para crear estas ofertas de descuento, puede utilizar los grupos de descuento. 3 3 PUBLIC Escenario empresarial Su compañía desea introducir algunos descuentos nuevos. Algunas de estas ofertas se basarán en determinados grupos de clientes. Otras ofertas estarán disponibles para todos los interlocutores comerciales pero en base a artículos específicos o fabricantes. Algunos clientes reunirán los requisitos para múltiples descuentos del mismo producto, pero otros recibirán solo uno de los descuentos. Una oferta será "pague 2, obtenga 1 gratis" para un rango de productos. Para crear estas ofertas de descuento, utilizarán grupos de descuento.

---

## Diapositiva 4

Los grupos de descuento son el tipo de determinación de precios más flexible. Puede asignar un grupo de descuento a un interlocutor comercial específico, un grupo de interlocutores comerciales o hasta todos los interlocutores comerciales. Los descuentos se definen para los artículos específicos o grupos de artículos, una combinación de propiedades del artículo o un fabricante de artículo. Se pueden definir múltiples descuentos dentro del grupo de descuento.  Por ejemplo, dentro del mismo grupo de descuento puede tener un descuento en un grupo de artículos, así como también un descuento para un fabricante específico. Los descuentos se pueden fijar en un porcentaje o se calculan por cantidad comprada. Observemos las diferentes combinaciones de descuentos que puede crear usando grupos de descuento. 4 PUBLIC Base del descuento Los grupos de descuento pueden asignarse a:  Interlocutores comerciales específicos  Grupos interlocutores comerciales  Todos los interlocutores comerciales Los grupos de descuento pueden basarse en:  Artículos específicos  Grupos de artículos  Propiedades del artículo  Fabricantes de artículos % Grupos de descuento

---

## Diapositiva 5

El primer paso para crear un grupo de descuento es pensar los tipos de descuentos que serían adecuados para uno o más interlocutores comerciales y agruparlos dentro del grupo de descuento. Por ejemplo, es posible que desee otorgar 5% de descuento en impresoras a los clientes minoristas y una oferta de 1 caja gratis de papel reciclado cuando compran 2 cajas.  Un conjunto de descuentos diferente puede aplicarse al grupo de clientes para los grandes clientes.  Para ellos, puede ofrecer 2% de descuento en productos del fabricante Rainbow y 3% de descuento en artículos que tienen la propiedad de artículo de productos comerciales. Una vez que conoce el tipo de descuentos que desea agrupar, el primer paso para crear el grupo de descuento es seleccionar los interlocutores comerciales a los que los descuentos se aplicarán. 5 PUBLIC Crear grupos de descuento  5% de descuento en el grupo de artículos para impresoras  1 caja gratis de papel reciclado al comprar dos cajas  2% de descuento en productos fabricados por Rainbow  3% de descuento en artículos con la propiedad de artículo de productos comerciales Clientes minoristas Grandes clientes

---

## Diapositiva 6

Los grupos de descuento se pueden asignar no solo a interlocutores comerciales específicos, sino a grupos de interlocutores específicos (como los grupos de proveedores o clientes) o hasta asignarse a todos los interlocutores comerciales. Ya que puede asignar un descuento por grupos y para todos los interlocutores comerciales, SAP brinda la opción de excluir interlocutores comerciales específicos de los grupos de descuento.  Volveremos a este tema más adelante. Ahora observaremos los tipos de descuentos específicos que están disponibles en todos los grupos de descuento y cómo se aplican. 6 PUBLIC Asignación de grupos de descuento Opciones de selección para quien reciba los descuentos. Asignar a:  IC específico  Grupo de clientes  Grupo de acreedores  Todos los IC

---

## Diapositiva 7

Hay cuatro fichas en todos los grupos de descuento para definir descuentos: Grupos de artículos, propiedades, fabricantes y artículos. Primero observaremos los grupos de artículos. La ficha grupo de artículos muestra todos los grupos de artículos definidos para la empresa. Registre el descuento que desee en la línea para cada grupo de artículos. Las parametrizaciones de formulario establecidas solo muestran la opción para los descuentos de porcentaje, sin embargo, puede añadir los campos para otorgar artículos gratis en base a la cantidad comprada en la ventana Parametrizaciones de formulario. Una vez que estableció un descuento en base a un grupo de artículos, todos los artículos que pertenecen a ese grupo de artículos se incluyen automáticamente en el descuento. Esto significa que cuando un nuevo registro maestro de artículos se asigna a un grupo de artículos, este automáticamente se añadirá a cualquier grupo de descuento que esté basado en ese grupo de artículos. 7 PUBLIC Grupos de descuento para grupos de artículos Ficha para descuentos de grupo de artículos Todos los grupos de artículos definidos para la empresa Establecer importe de descuento para grupos de artículos

---

## Diapositiva 8

Otra opción es utilizar propiedades de artículo como una forma de indicar qué artículos deben tener un descuento. Una excelente función de los grupos de descuento a nivel de propiedades de artículo es que SAP Business One le permite definir un descuento para varias propiedades a la vez. Además, puede utilizar una regla para decidir el descuento que debe utilizar el sistema para efectuar el cálculo:  Descuento más alto: la propiedad con el descuento superior determinará el descuento general calculado para el artículo.  Descuento más bajo: la propiedad con el descuento inferior determinará el descuento general calculado para el artículo.  El descuento medio: el sistema calcula la media de todos los descuentos de las propiedades. La media resultante se utiliza como valor de descuento.  Descuento total: el sistema suma todos los descuentos de las propiedades aplicables al artículo. El total resultante (hasta un máximo de 100%) se utiliza como valor de descuento.  Descuentos múltiples: El sistema multiplica los descuentos de las propiedades que se aplican al artículo. 8 PUBLIC Grupos de descuento por propiedades Establezca una regla para:  El más alto  El más bajo  Promedio  Total de todos los descuentos  Multiplicación de descuentos Seleccionar una regla para calcular el descuento Ficha para propiedades de artículo

---

## Diapositiva 9

Otra forma de definir un grupo de descuento es por fabricante. Por ejemplo, imagine que vende impresoras y accesorios Rainbow.  El fabricante, Rainbow, le ofrece un precio menor como distribuidor para todos sus productos.  Le gustaría compartir este ahorro ofreciendo un descuento del 2% en todos los productos Rainbow a los clientes grandes. Puede fijar un grupo de descuentos para el grupo de clientes de grandes cuentas que incluya un 2% de descuento para todos los productos fabricados por Rainbow. 9 PUBLIC Grupos de descuento por fabricantes Defina un descuento para los productos de un fabricante concreto Ficha de los fabricantes Puede añadir nuevos fabricantes a la lista.

---

## Diapositiva 10

La cuarta ficha es la ficha Artículos. Aquí puede enumerar artículos individuales que desee descontar.  A diferencia de otras fichas, la lista está vacía hasta que añada los artículos que desea descontar. Esto funciona si piensa en las grandes cantidades de artículos que una empresa puede tener. Aquí vemos un grupo de descuento definido para los colegios, para promocionar la venta de papel de copia. 10 PUBLIC Grupos de descuento por artículos Ficha para definir descuentos por código de artículo Añadir artículos a la tabla

---

## Diapositiva 11

Las compañías con frecuencia deben ofrecer precios de incentivo con productos gratuitos.   Los descuentos se pueden basar en función de la cantidad comprada. Los descuentos de productos gratuitos pueden fijarse en las cuatro fichas. Existen 3 campos para establecer un descuento variable conforme a la cantidad comprada. Los campos se ocultan hasta que los selecciona en Parametrizaciones de formulario y luego amplíe la ventana o desplácese para ver los campos adicionales. 11 PUBLIC Artículos gratis Descuento conforme a la cantidad comprada Los descuentos de productos gratis pueden definirse en las 4 fichas

---

## Diapositiva 12

Para fijar un descuento variable conforme a la cantidad comprada: Especifique la cantidad pagada en la primera columna.  Esta es la cantidad que un cliente abonará o que usted compraría de un proveedor.  En este ejemplo, la cantidad abonada es 2. La segunda columna especifica la cantidad que se otorga de forma gratuita cuando la cantidad de pago se compra. En este ejemplo, el cliente recibe 1 artículo gratis por cada dos comprados. El último campo es opcional, pero especifica un límite para los artículos gratis. En el ejemplo, está definido en 4.  El cliente recibirá hasta 4 artículos gratis con 8 artículos pagados.  Si hay más de 8 artículos pagados, el cliente solo recibe 4. Observe que los artículos comprados y los artículos gratuitos deben tener el mismo código de artículo. La funcionalidad no cubre la compra de artículos con un artículo diferente como el artículo gratuito. 12 PUBLIC Artículos gratis Compre 3 cartuchos, obtenga 1 gratis. 4 cartuchos gratuitos como máximo.

---

## Diapositiva 13

Exploremos cómo se calcula realmente el descuento. En el ejemplo mostrado, el grupo de descuento se establece de la siguiente forma: La cantidad abonada se fija en 2 La cantidad gratuita se fija en 1 El número máximo de artículos gratuitos es 4. Si el cliente compra 2, no se aplicará el descuento. Si el cliente compra 3, el descuento se aplicará otorgando un descuento del 33,33% del precio regular. En otras palabras, si el cliente compra 3 obtiene 1 de los 3 gratis. Si el cliente compra 4, solo obtienen un descuento en base a 3 comprados, por lo tanto, el porcentaje de descuento se reduce de un tercio a un cuarto. Si el cliente compra 6 artículos, el descuento es del 33,33%.  el cliente abona por 4 artículos y obtiene 2 gratis. El cliente básicamente obtiene 1 gratis con cada 3 artículos comprados, con un límite máximo de 4 artículos gratis. Por lo tanto, si el cliente compra 12 artículos (4*3 artículos), obtendrá el número máximo de productos gratuitos. 13 PUBLIC Cálculo de descuento de productos gratuitos Cantidad comprada % de descuento Total (ML) Comentarios 2 0 Precio unitario *2 Sin descuento 3 33,33 Precio unitario *2 Pague 2 y obtenga 1 gratis 4 25 Precio unitario *3 Pague 3 y obtenga 1 gratis 5 20 Precio unitario *4 Pague 4 y obtenga 1 gratis 6 33,33 Precio unitario *4 Pague 4 y obtenga 2 gratis 12 33,33 Precio unitario *8 Pague 8 y obtenga 4 gratis 15 26,67 Precio unitario *11 Pague 11 y obtenga 4 gratis Artículo N.º Cantidad pagada Cantidad gratuita Cantidad gratuita máxima I00031 2 1 4

---

## Diapositiva 14

Podemos ver el efecto del descuento de cantidad múltiple en un pedido de cliente. Cuando la cantidad de artículos se registra en la línea, el sistema automáticamente registra el porcentaje de descuento calculado en la línea. Cuando la cantidad de artículos registrada es 3, el sistema automáticamente registra automáticamente un descuento de 33,33% en el campo Descuento en la línea del pedido de cliente. Si el cliente devuelve uno de los artículos, el cliente recibirá un reembolso en base al precio de compra descontado. En este ejemplo, el cliente recibirá un tercio del precio total abonado por los tres artículos. 14 PUBLIC Productos gratuitos en el pedido de cliente Si se devuelve el artículo, el cliente recibirá el reembolso en base al precio descontado. Cuando la cantidad introducida es 3… El descuento se aplica automáticamente en base a la cantidad comprada

---

## Diapositiva 15

Para cada línea, defina el descuento por un porcentaje de descuento fijo o un descuento variable conforme a la cantidad comprada. En otras palabras, los dos tipos de descuento son mutuamente exclusivos. En el ejemplo vemos que las columnas de los productos gratuitos están desactivadas en la primera línea en la que aparece el porcentaje de descuento fijo. En las otras dos líneas, vemos que la columna de porcentaje de descuento está desactivada porque hemos definido el descuento conforme a la cantidad comprada de dichos artículos. 15 PUBLIC Productos gratuitos o porcentaje Descuento por porcentaje Descuento conforme a la cantidad comprada Descuentos exclusivos mutuamente:  Descuento fijo por porcentaje  Descuento variable conforme a la cantidad comprada

---

## Diapositiva 16

Cuando el sistema busca un precio, busca el tipo de precio más específico primero. Primero, el sistema busca un precio en un acuerdo global válido.   Si no se encuentra ninguno, el sistema verifica precios especiales para interlocutores comerciales. Si no existe uno, entonces el sistema busca los grupos de descuento. El sistema buscará grupos de descuento que se apliquen a este interlocutor comercial, los grupos de interlocutores comerciales asociados con esos interlocutores comerciales o un grupo de descuentos que se aplique a todos los interlocutores comerciales. Una vez que se encuentran los grupos de descuento, el sistema aplica el descuento(s) y, a continuación, busca un precio en los descuentos por período y cantidad o en la lista de precios para que se apliquen los descuentos. Existen algunos factores que controlan si un grupo de descuento se encontrará cuando se crea un documento de marketing. 16 PUBLIC Determinación de precios ¿Existe un precio de acuerdo global o precio especial para el interlocutor comercial en este documento de marketing? ¿No?   Entonces revise los grupos de descuento que se aplican a:  Este interlocutor comercial  El grupo de interlocutores comerciales del interlocutor comercial, o  Todos los interlocutores comerciales Si se encuentra un grupo de descuentos, el sistema aplica el descuento(s) y continúa buscando un precio en la lista de descuentos por período y cantidad o en los registros de lista de precios. Precios especiales para los IC Grupos de descuento Descuentos por período y cantidad Listas de precios Acuerdos globales

---

## Diapositiva 17

Cuando el sistema busca un precio, busca el tipo de precio más específico primero. Primero, el sistema busca los acuerdos globales aplicables o precios especiales para los interlocutores comerciales. Si no existe uno, entonces el sistema busca los grupos de descuento. El sistema buscará grupos de descuento que se apliquen a este interlocutor comercial, los grupos de interlocutores comerciales asociados con esos interlocutores comerciales o un grupo de descuentos que se aplique a todos los interlocutores comerciales. 17 PUBLIC Artículo Precio p/un.  Descuento Documento 5% ??? Determinación de precios y grupos de descuento Artículo Precio p/un.  Descuento Documento ??? ??? 3. ¿Existe un grupo de descuento? 2. ¿Existe un precio especial para los IC? 1. ¿Existe un acuerdo global específico válido para el artículo? 4. Lista de precios 3. ¿Existen descuentos por período y cantidad en la lista de precios? NO NO SÍ

---

## Diapositiva 18

Un grupo de descuentos contiene descuentos, pero no incluye ningún precio.  Si se encuentra un grupo de descuentos, se introducirá el descuento o descuentos aplicados. El sistema continuará buscando un precio en la lista de precios asignada al cliente. 18 PUBLIC Artículo Precio p/un.  Descuento Documento 5% 199 Artículo Precio p/un.  Descuento Documento 5% ??? Determinación de precios y grupos de descuento Artículo Precio p/un.  Descuento Documento ??? ??? 3. ¿Existe un grupo de descuento? 2. ¿Existe un precio especial para los IC? 1. ¿Existe un acuerdo global específico válido para el artículo? 4. Lista de precios 3. ¿Existen descuentos por período y cantidad en la lista de precios? NO NO SÍ Búsqueda del precio por unidad continúa

---

## Diapositiva 19

Existen algunos factores que controlan si un grupo de descuento se encontrará cuando se crea un documento de marketing. Uno de los factores que controla si un grupo de descuento se aplica a un documento es la parametrización de validez. Como todos los precios, tiene la opción de marcar un grupo de descuento como inactivo o fijar un rango de fechas de validez para un grupo de descuento. Puede marcar el grupo de descuento como activo o inactivo. Los grupos de descuento están activos de forma predeterminada. Si un rango de fecha se fija para un grupo de descuento activo, el descuento se aplicará a un documento de marketing si la fecha de contabilización del documento se encuentra en el rango de fecha activo. 19 PUBLIC Parametrizaciones de validez Puede establecer que los grupos de descuento estén activos o inactivos, con un rango de fecha opcional.

---

## Diapositiva 20

Otro factor para aplicar un grupo de descuento en un documento de marketing puede ser que un interlocutor comercial o artículo se excluya de los grupos de descuento. Aunque defina que un grupo de descuento se aplique a todos los interlocutores comerciales, tiene la opción de excluir un interlocutor comercial de todos los grupos de descuento. Tal vez, este cliente posee contratos muy específicos o tal vez elige no aplicar ningún grupo de descuento para los nuevos clientes hasta que hayan comprado una determinada cantidad. De forma similar, tiene la opción de excluir un artículo de todos los grupos de descuento, aunque ese artículo normalmente se incluiría en un descuento en base al grupo de artículos, propiedades del artículo o fabricante.  Tal vez, es un artículo de temporada que nunca tiene descuento durante las ventas de temporada alta. En cualquiera de estos casos, usted elige excluir el interlocutor comercial o el artículo en el registro de datos maestros. 20 PUBLIC Exclusión de IC o artículos

---

## Diapositiva 21

La casilla de verificación se localiza en la ficha Condiciones de pago del registro de datos maestros del interlocutor comercial. La casilla de verificación está desmarcada de forma predeterminada. Si selecciona la casilla de verificación No aplicar grupos de descuento, todos los grupos de descuento que normalmente se aplicarían se ignoran en los documentos de marketing para este interlocutor comercial. Esta casilla de verificación afecta solo a grupos de descuento no a otros precios especiales. Aunque la casilla de verificación esté marcada para un interlocutor comercial, aún puede definir un descuento manualmente en el área de cabecera o en la línea de un documento. Esta configuración no afecta a los descuentos que se copian de los documentos base. Al copiar un documento a un documento destino, los descuentos del documento base se copian al documento destino independientemente de lo que se define en la casilla de verificación No aplicar grupos de descuento. Por ejemplo, podría existir un pedido de cliente creado antes de que la casilla de verificación se marque para un interlocutor comercial. 21 PUBLIC Exclusión de IC  Si se selecciona, todos los grupos de descuento que se aplicarían se ignoran en los documentos.  La casilla de verificación afecta solo a grupos de descuento no a otros precios especiales.  Aún puede establecer descuentos manualmente en los documentos.  No afecta a los descuentos que se copian de los documentos base La casilla de verificación No aplicar grupos de descuento está ubicada en la ficha Condiciones de pago.

---

## Diapositiva 22

La misma casilla de verificación aparece en los datos maestros del artículo para excluir un artículo específico de los grupos de descuento. Esto podría ser útil para un artículo de temporada que no desea descontar durante la temporada alta. Como con la parametrización de los interlocutores comerciales, aún puede aplicar descuentos manualmente en el artículo en los documentos de marketing. Los descuentos de un documento base se copian al documento destino, aunque la casilla de verificación No aplicar grupos de descuento esté marcada. 22 PUBLIC Excluir artículo de grupos de descuento  La misma c. de verificación en el reg. maestro de Art.  Aún puede aplicar los descuentos en documentos manualmente.  Los descuentos se copian a los documentos destino, aunque la casilla de verificación esté marcada.

---

## Diapositiva 23

Luego de que el sistema eliminó un precio especial para el interlocutor comercial y artículo en una línea del documento de ventas, el sistema busca un grupo de descuento. Sin embargo, ya que los grupos de descuento se pueden aplicar a un interlocutor comercial, un grupo de interlocutores comerciales y a todos los interlocutores comerciales con solapamiento de períodos de validez, el sistema puede buscar más de un grupo de descuento. De hecho, hasta dentro de un grupo de descuento, se pueden aplicar múltiples descuentos, por ejemplo si un grupo de descuento contiene un 3% en un grupo de artículos que contiene artículos que también reúnen los requisitos para un 5% de descuento por fabricante. En todos estos casos, el sistema debe determinar cómo aplicar los múltiples descuentos encontrados. La forma de gestionar el problema de múltiples descuentos es fijar una regla para la determinación del descuento efectivo. 23 PUBLIC Múltiples descuentos Documento Artículo ??? Descuento NO ¿Existe un descuento del grupo de descuento? ¿Existe un precio especial específico de artículo e IC? SÍ Ya que los grupos de descuento se pueden aplicar a:  Un interlocutor comercial específico  Un grupo de interlocutores comerciales  Todos los interlocutores comerciales Más de un grupo de descuento puede aplicar a...

---

## Diapositiva 24

Puede establecer la regla para el descuento efectivo para un interlocutor comercial o para un grupo de interlocutores comerciales Puede seleccionar una de cinco parametrizaciones para el descuento efectivo: el más bajo, el más alto, promedio, total, multiplicado: El descuento más bajo: Se establece el descuento más bajo disponible (Este es el predeterminado). El descuento más alto: Se establece el descuento más alto. Promedio: Se establece el promedio de todos los descuentos disponibles. Total: Se establece la suma de todos los descuentos disponibles. Multiplicado: El sistema multiplica todos los descuentos disponibles y utiliza el resultado como el descuento. Cuando crea un nuevo registro de interlocutores comerciales, el sistema le preguntará si desea traer el descuento efectivo del grupo de interlocutores comerciales. Si responde "no", el nuevo interlocutor comercial se establecerá en el descuento efectivo más bajo. Puede modificar esto en cualquier momento en los datos maestros de interlocutores comerciales. Nota: El descuento efectivo se desactiva si marca la casilla de verificación No aplicar grupos de descuento. También puede modificar el descuento efectivo en las ventanas de configuración del grupo de interlocutores comerciales. Si selecciona un nuevo valor de descuento efectivo, se le pregunta si se actualizan todos los registros de interlocutores comerciales existentes para el grupo. 24 PUBLIC Regla de descuento efectivo Descuento efectivo:  El más bajo (predeterminado)  El más alto  Promedio  Total  Multiplicado

---

## Diapositiva 25

Una gran ventaja al usar los grupos de descuento es cuando crea nuevos artículos, cualquier grupo de descuento que se aplica se incluye automáticamente. Por ejemplo, digamos que existe un grupo de descuento para productos asignados al grupo de artículos para escáneres. Cada vez que crea un artículo nuevo y lo asigna al grupo de artículos para escáneres, pertenecerá automáticamente al grupo de descuento de escáneres. Puede incluir o excluir artículos e interlocutores comerciales Puede definir una determinación de precios libre basándose en las cantidades compradas, así como en porcentajes de descuento fijo. Además, la realización de informes está disponible para los grupos de descuento. 25 PUBLIC Ventas de los grupos de descuento Los grupos de descuento son muy flexibles  Nuevos artículos se incluyen automáticamente en los grupos de descuento aplicables  Se puede incluir o excluir artículos  Se puede incluir o excluir interlocutores comerciales  Se pueden establecer los precios para los productos gratuitos  Realización de informe de grupos de descuento

---

## Diapositiva 26

Aquí se detallan algunos puntos clave que muestran las ventajas y la flexibilidad de los grupos de descuento. Los grupos de descuento pueden definirse para IC específicos, grupos de IC o todos los IC. Dentro de un grupo de descuentos, puede establecer descuentos en grupos de artículos, propiedades, fabricantes o artículos. Si se establecen múltiples descuentos de propiedades en un grupo de descuento, la regla se establece para determinar cómo aplicar los descuentos. Los descuentos se pueden aplicar en base a un porcentaje fijo o una cantidad variable comprada.  La última opción se utiliza para otorgar productos gratuitos. Los nuevos artículos se añaden automáticamente a los grupos de descuento aplicables en base a los grupos de artículos, propiedades o fabricantes. Los artículos e interlocutores comerciales se pueden excluir de los grupos de descuento. Los grupos de descuento pueden tener períodos de validez o se pueden marcar como inactivos. Las reglas de descuento efectivo resuelven situaciones en las que los grupos de descuento múltiples se aplican a un documento de marketing. Los grupos de descuento contienen solo descuentos, no contienen precios por unidad.  Una vez se ha aplicado un grupo de descuentos a una línea del documento, el sistema continuará buscando un precio por unidad en la lista de precios. 26 PUBLIC A continuación, se detallan algunos puntos clave: Los grupos de descuento pueden definirse para IC específicos, grupos de IC o todos los IC. Dentro de un grupo de descuentos, puede establecer descuentos en grupos de artículos, propiedades, fabricantes o artículos. Si se establecen múltiples descuentos de propiedades en un grupo de descuento, la regla se establece para determinar cómo aplicar los descuentos. Los descuentos se pueden aplicar en base a un porcentaje fijo o una cantidad variable comprada.  La última opción se utiliza para otorgar productos gratuitos. Los nuevos artículos se añaden automáticamente a los grupos de descuento aplicables en base a los grupos de artículos, propiedades o fabricantes. Los artículos e interlocutores comerciales se pueden excluir de los grupos de descuento. Los grupos de descuento pueden tener períodos de validez o se pueden marcar como inactivos. Las reglas de descuento efectivo resuelven situaciones en las que los grupos de descuento múltiples se aplican a un documento de marketing. Los grupos de descuento contienen solo descuentos, no contienen precios por unidad.  Una vez se ha aplicado un grupo de descuentos a una línea del documento, el sistema continuará buscando un precio por unidad en la lista de precios. Resumen

---

