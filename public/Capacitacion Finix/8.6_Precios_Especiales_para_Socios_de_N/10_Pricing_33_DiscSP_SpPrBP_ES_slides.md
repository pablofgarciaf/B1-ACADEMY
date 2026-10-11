# Transcripción por Diapositiva: 10_Pricing_33_DiscSP_SpPrBP_ES

## Diapositiva 1

PUBLIC Determinación de precios: Precios especiales para interlocutores comerciales SAP Business One Versión 10.0 Le damos la bienvenida al tema sobre los precios especiales para interlocutores comerciales. 1

---

## Diapositiva 2

En este tema, aprenderá a configurar los precios especiales para interlocutores comerciales. Se recomienda completar la formación sobre descuentos por período y cantidad antes de empezar este tema. 2 PUBLIC Objetivos Al finalizar este tema, podrá: Establecer los precios especiales para interlocutores comerciales.

---

## Diapositiva 3

Imagine que algunos clientes reciben precios especiales debido a su relación con la empresa. A veces, estos precios se configuran en relación con una lista de precios determinada, como la lista de precios asignada a ese interlocutor comercial. Otras veces, los precios se configuran específicamente para este interlocutor comercial sin hacer referencia a ninguna lista de precios. Esto se lleva a cabo usando precios especiales para interlocutores comerciales. 3 3 PUBLIC Escenario empresarial  Algunos clientes reciben precios especiales de artículos debido a su relación con la empresa.  Algunos de estos precios se establecen en relación con una lista de precios determinada.  Otras veces, estos precios se configuran específicamente para este interlocutor comercial y artículo sin hacer referencia a ninguna lista de precios.

---

## Diapositiva 4

Los precios especiales para los interlocutores comerciales le permiten otorgar un descuento (o recargo) en artículos para un determinado interlocutor comercial. Los precios especiales son muy flexibles.  Puede crear precios especiales con o sin referencia a una lista de precios, y ni siquiera debe ser la lista de precios asociada al interlocutor comercial. Puede establecer un descuento de porcentaje estándar o recargo para el interlocutor comercial que se predeterminará en las líneas a medida que añada artículos por precios especiales.  Puede modificar este porcentaje luego de añadir el artículo. Puede incluso definir el precio especial para que se actualice y vuelva a calcular cuando la lista de precios a la que hace referencia se actualiza. 4 PUBLIC Precios especiales para interlocutores comerciales  Con o sin referencia a una lista de precios  Puede ser una lista de precios diferente a la que se ha asignado al IC  Cálculo del descuento  Actualización automática cuando se actualizan las listas de precios Precios especiales para artículos seleccionados de un interlocutor comercial: Para un interlocutor comercial determinado

---

## Diapositiva 5

Al igual que se aplican descuentos de período y cantidad a las listas de precios, los precios especiales para los interlocutores comerciales también pueden tener descuentos de período y cantidad. Hay que hacer doble clic en el precio especial para que se abran los campos en los que puede introducir las fechas en las que el precio es válido. Haciendo clic una segunda vez puede definir el descuento de cantidad basado en una escala de cantidad para el período de validez que acaba de definir. Al igual que sucede con los descuentos de período y cantidad, cualquier artículo que pertenezca a un grupo de unidades de medida le permitirá definir precios por unidad a los artículos que pertenezcan a dicho grupo de unidades de medida. Una vez que haya definido un precio especial para un artículo, podrá copiar los descuentos para copiar el intervalo de fechas y los porcentajes en otros artículos seleccionados para dicho interlocutor comercial. 5 PUBLIC Precios especiales para interlocutores comerciales hacer doble clic hacer doble clic Períodos de validez De             a De             a Escala de cantidad  Con o sin referencia a una lista de precios  Puede ser una lista de precios diferente a la que se ha asignado al IC  Cálculo del descuento  Actualización automática cuando se actualizan las listas de precios Precios especiales para artículos seleccionados de un interlocutor comercial: Para un interlocutor comercial determinado

---

## Diapositiva 6

Los precios especiales definidos para un interlocutor comercial sustituyen el resto de los precios en un documento de marketing, excepto los precios fijados en un acuerdo global específico con este interlocutor comercial.  Esto es así porque son los precios más específicos que se pueden definir en SAP Business One. Es el primer precio que busca el sistema. Si no se encuentra un precio especial para este interlocutor comercial, el sistema buscará un grupo de descuento, a continuación, los descuentos de período y cantidad de la lista de precios asignada al documento y, finalmente, un precio de la lista de precios. Para que un precio especial se aplique a un artículo del documento, la fecha debe estar dentro del período de validez y la unidad de medida de la línea debe coincidir con la unidad de medida de la definición del precio especial. 6 PUBLIC Determinación de precios en Business One Precios especiales para interlocutores comerciales Sustituye a todos los precios excepto los acuerdos globales específicos. 3. ¿Existe un grupo de descuento? 4. ¿Existen descuentos por período y cantidad en la lista de precios? 2. ¿Existe un precio especial específico de artículo e IC? 5. Lista de precios 1. ¿Existe un precio de acuerdo global específico? SÍ NO

---

## Diapositiva 7

Una función muy práctica de los precios especiales es que, una vez que defines un precio especial, puedes copiarlo y aplicarlo a otros interlocutores comerciales. Hay una serie de reglas para copiar los precios especiales de un interlocutor comercial a otros:  Sustituir artículos (todos): El sistema copia todos los precios especiales y posiblemente sobrescribe los precios existentes.  Sustituir sólo artículos existentes: El sistema sobrescribe todos los precios especiales que existen en los registros del interlocutor comercial (IC) de origen y de destino. Al utilizar esta función no se añade ningún nuevo precio especial.  No sustituir artículos: El sistema añade los nuevos precios especiales, pero no cambia los existentes. En la transacción se selecciona el interlocutor comercial que en ese momento tiene los precios especiales que quiere copiar. A continuación, se seleccionan los interlocutores comerciales por código, el grupo de interlocutores comerciales o las propiedades del interlocutor comercial. 7 PUBLIC Copiar precios especiales Una vez haya fijado un precio especial, puede copiar el precio a otros interlocutores comerciales. Opciones Copiar precios especiales en criterios de selección: Sustituir todos los artículos Sustituir sólo los artículos existentes No sustituir artículos

---

## Diapositiva 8

Hay una transacción que permite actualizar todos los precios especiales de forma global en SAP Business One. Dicha transacción contiene cuatro fichas que ofrecen distintas opciones sobre cómo actualizar los precios.  Seleccionará la ficha correspondiente para: cambiar el descuento aumentando o disminuyendo el porcentaje, cambiar los precios de los artículos por porcentaje, actualizar los precios especiales desde la lista de precios vinculada o borrar los precios especiales existentes. En todas estas fichas hay unos criterios de selección que permiten seleccionar los precios por interlocutores comerciales, grupo de clientes, grupo de proveedores o propiedades del interlocutor comercial. 8 PUBLIC Actualizar globalmente los precios especiales  Hay 4 fichas para actualizar los precios especiales globalmente:  Cambiar descuento aumentando o disminuyendo el porcentaje  Cambiar precios de los artículos por porcentaje  Actualizar precios especiales desde la lista de precios vinculada  Borrar precios especiales

---

## Diapositiva 9

Es posible aplicar precios especiales a interlocutores comerciales para definir un descuento o recargo en los artículos de un interlocutor comercial concreto. El sistema busca primero los precios especiales para los interlocutores comerciales antes de buscar cualquier otro tipo de precio. Si encuentra un precio especial para el interlocutor comercial, utilizará ese precio en la línea del documento de marketing. El precio puede estar en relación con una lista de precios o no.  No es necesario que la lista de precios referenciada sea la lista de precios asociada con el interlocutor comercial. Puede establecer un descuento de porcentaje estándar para el interlocutor comercial que se predeterminará en las líneas a medida que añada artículos por precios especiales.  Puede modificar este porcentaje luego de añadir el artículo. Puede definir que el precio especial se vuelva a ajustar automáticamente cuando la lista de precios a la que hace referencia se actualice. Las mismas opciones que hay en los descuentos por período y cantidad existen para los precios especiales. Se puede definir un periodo de validez y/o precios basados en una escala de cantidad. Si un artículo pertenece a un grupo de unidades de medida, puede definir descuentos por cantidad por unidad de medida; pero, para que se puedan aplicar dichos descuentos, la unidad de medida de la línea debe coincidir con la unidad de medida especificada en el descuento. 9 9 PUBLIC Resumen A continuación, se detallan algunos puntos clave: Es posible aplicar precios especiales a interlocutores comerciales para definir un descuento o recargo en los artículos de un interlocutor comercial concreto. El precio especial puede estar en relación con una lista de precios o no. Puede seleccionar un porcentaje por defecto para las líneas. Puede modificar este porcentaje después de añadir artículos. Puede definir que el precio especial se vuelva a ajustar cuando la lista de precios de referencia se actualice. Las mismas opciones que hay en los descuentos por período y cantidad existen para los precios especiales. Se puede definir un periodo de validez y/o precios basados en una escala de cantidad. Si un artículo pertenece a un grupo de unidades de medida, puede definir descuentos por cantidad por unidad de medida.

---

