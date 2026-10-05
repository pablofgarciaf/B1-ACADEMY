# Transcripción por Diapositiva: 10_Item_23_UoM_Weight

## Diapositiva 1

Artículos e Inventario: Uso de Pesos como Unidades de Medida — SAP Business One Versión 10.0. Bienvenido al tema sobre el uso de pesos como unidades de medida.

---

## Diapositiva 2

Objetivos. Al finalizar este tema, podrás: Configurar pesos en grupos de unidades de medida. En este tema aprenderás a configurar pesos como unidad de medida en un grupo de unidades de medida. Para comprender este tema completamente, necesitas saber previamente cómo configurar grupos de unidades de medida.

---

## Diapositiva 3

Escenario de Negocio. OEC Computers compra cables para reventa. Anteriormente los cables se compraban por metros. Sin embargo, están cambiando a un nuevo proveedor que vende los cables por peso. Desean añadir una unidad de medida de peso al grupo de unidades de medida existente y establecer esa medida como la medida predeterminada para compras. También quieren crear un nuevo grupo de unidades de medida para conectores USB que utilice el peso como unidad de medida base.

---

## Diapositiva 4

Ejemplo de Negocio 1 — Añadir una Unidad de Medida de Peso a un Grupo. OEC está cambiando de proveedor de cables. El nuevo proveedor vende cables por peso. OEC comprará cables en kilogramos (kg) y los gestionará en inventario por metros. 1 metro de cable de red = 1 kg; 1 metro de cable HDMI = 2 kg; 1 metro de cable de alimentación = 4 kg. Se modificará un grupo de unidades de medida existente para permitir comprar estos artículos por peso mientras se almacenan y venden en metros. OEC Computers revende distintos tipos de cables. Ya existe un grupo de unidades de medida para este artículo con el metro como unidad base. Anteriormente los cables se compraban en bobinas de 100 metros. OEC ha decidido cambiar a un nuevo proveedor que vende los cables por peso. OEC comprará cables por peso y gestionará el inventario en metros; vendiendo en diversas unidades que se convierten a metros. Como los cables se compran por peso y se venden en metros, el grupo de unidades de medida de cables debe poder convertir cantidades en kilogramos a cantidades en metros. Tres ejemplos de artículos en OEC Computers: cable de red, cable HDMI y cable de alimentación, con unidades de inventario en metros y distintos pesos por metro.

---

## Diapositiva 5

Uso del Peso en un Grupo de Unidades de Medida. Grupos de Unidades de Medida → Grupo Cable → Definición del Grupo. Nº 4: 1 Kilo (kg) = 1 Metro. Introduce la unidad de peso en el campo Unidad de Medida Alternativa. Usa un Factor de Peso cuando necesites ajustar la cantidad unitaria según el peso del artículo. En el ejemplo de negocio, hay un grupo de unidades de medida para cables con el metro como unidad base y otras unidades (Bobina, Carrete) ya definidas. Para añadir kilogramos al grupo: primero se define Kilo como unidad de medida con un peso de 1 kilogramo en la ventana de Configuración de Unidades de Medida. Luego se abre la Definición del Grupo de la ventana de Grupos de Unidades de Medida y se introduce Kilo como unidad alternativa. Se deben introducir los campos de cantidad alternativa y cantidad base. En el ejemplo, 1 kilogramo equivale a 1 metro de cable para los tipos más habituales. Sin embargo, como algunos cables tienen un peso distinto, también se introduce un factor de peso. El factor permite ajustar fácilmente la unidad según el peso del artículo.

---

## Diapositiva 6

Ventaja del Factor de Peso. Definición del Grupo Cable: 1 Kilo (kg) = 1 Metro. Cable de red: 1 metro = 1 kg; Cables HDMI: 1 metro = 2 kg; Cables de alimentación: 1 metro = 3 kg. Fórmula: "Cant. Alt." x "Factor de Peso" (del Peso en Datos Maestros del Artículo) = Cant. Base en documento. El factor de peso permite usar el peso especificado en el Datos Maestros del Artículo para la conversión. En versiones anteriores sin factor de peso era mucho más difícil gestionar artículos con distintos pesos para la misma longitud. Ahora con el factor de peso se puede usar el peso del Datos Maestros del Artículo para realizar la conversión. Esto permite compartir el mismo grupo de unidades de medida para todos los cables en lugar de tener tres grupos separados. OEC tiene tres tipos generales de cable: de red, HDMI y de alimentación, con distintos pesos. El factor de peso busca el peso del artículo en los Datos Maestros y calcula el peso real que se compra, vende o gestiona en inventario. El sistema multiplica la cantidad alternativa por el peso del Datos Maestros para calcular la cantidad base del documento.

---

## Diapositiva 7

Ejemplo de Cómo Funciona la Conversión. El valor del factor de peso proviene del campo Peso en los Datos Maestros del Artículo. Si la unidad difiere (p. ej., gramos en lugar de kilogramos), se realiza una conversión previa. Luego se calculan las conversiones de Cantidad Alternativa (Kilo) a Cantidad Base (Metro). Factor de peso del cable de red = 1 kg → 1 kg de cable de red = 1 metro. Factor de peso del cable HDMI = 2 kg → 1 kg de cable HDMI = 0,5 metros. Factor de peso del cable de alimentación = 4 kg → 1 kg de cable de alimentación = 0,25 metros. Para los artículos de cable se han introducido los siguientes pesos en el campo Peso de los Datos Maestros: 1 kg para el cable de red, 2 kg para el cable HDMI y 4 kg para el cable de alimentación.

---

## Diapositiva 8

Efecto del Factor de Peso en Documentos. Factor de peso del cable de red = 1 kg; HDMI = 2 kg; alimentación = 4 kg. 1 Kg de cable de red = 1 metro; 1 Kg de cable HDMI = 0,5 metros; 1 Kg de cable de alimentación = 0,25 metros. Una vez realizados los ajustes, se prueban los artículos y unidades de medida en un documento. Obsérvese cómo el cálculo con el factor de peso afecta al campo Artículos por Unidad. Por ejemplo, para el cable de alimentación cuyo factor de peso es 4 kilogramos: si se compra 1 kilogramo de cable de alimentación, la longitud es solo un cuarto de metro.

---

## Diapositiva 9

Ejemplo de Negocio 2: Peso como Unidad Base. Conectores USB: 1 Kg = Unidad base. Factor CUD (Piezas): 100 piezas = 1 kg. OEC Computers revende conectores USB. Los conectores se compran y almacenan en kilogramos pero se venden como piezas. Por ello, es recomendable usar el peso como unidad base. Se puede crear un campo definido por el usuario para especificar la conversión entre la unidad base en peso y otro tipo de unidad, como piezas. Luego se puede usar el campo Factor CUD en la ventana de Grupo de Unidades de Medida para gestionar la conversión.

---

## Diapositiva 10

Pasos para Usar un Campo CUD. Definición del Grupo Conectores: 1 Kg = 1 Kg (base); 1 Piezas (Factor CUD Piezas) = 1 Kg. Pasos: Configurar un campo definido por el usuario (CUD) en los Datos Maestros del Artículo (el CUD contiene el valor de conversión, p. ej., 100). Introducir el nombre del CUD en el campo Factor CUD. El sistema calcula la conversión de 100 piezas por cada 1 kg de conectores. En el grupo de unidades de medida Conectores, la unidad base es el Kilogramo y la unidad alternativa son las Piezas. Se ha añadido un CUD al artículo para indicar cuántas piezas equivalen a 1 kilogramo de conectores. El valor del CUD del artículo conector USB es 100, lo que significa que 100 piezas equivalen a 1 kg de conectores. Obsérvese que no se necesita factor de peso porque el peso es la unidad base. Un factor CUD también puede ser útil para registrar medidas adicionales de un artículo como densidad, volumen u otro elemento necesario para reglas de conversión.

---

## Diapositiva 11

Ejemplo 3: Usar CUD para Convertir Longitud a Volumen. Definición del Grupo Caja: 1 Pulgada = 1 Pulgada (base); 2 Litros (Factor CUD Litros) = 6 Pulgadas. 2 litros del artículo caja = 6 pulgadas. El factor CUD de litros para la caja = 2 litros. Usa un campo CUD para convertir entre tipos de medidas como longitud a volumen. OEC Computers mantiene un suministro de cajas como material de embalaje, gestionadas como artículos en inventario. Cuando las cajas están plegadas son planas y se miden en pulgadas; también pueden medirse por su volumen en litros. Se ha creado el grupo de unidades de medida Caja y se ha definido un campo CUD para litros asignado en el encabezado de los Datos Maestros del Artículo. Para la caja más habitual, el valor del campo CUD de litros es 2, lo que significa que 2 litros de la caja equivalen a 6 pulgadas.

---

## Diapositiva 12

Resumen. Puntos clave: Las unidades basadas en peso pueden usarse en grupos de unidades de medida. Un factor de peso puede usarse para convertir unidades de peso a la unidad base. El valor del factor de peso se obtiene del campo Peso en los Datos Maestros del Artículo. La fórmula para calcular el peso es: "Cant. Alt." x "Factor de Peso" (del Peso en Datos Maestros) = Cant. Base. SAP Business One proporciona un campo Factor CUD en el Grupo de Unidades de Medida que permite incluir valores de un campo definido por el usuario para realizar conversiones adicionales. El factor CUD también permite usar una unidad de peso como unidad de medida base de un grupo.

---

## Diapositiva 13

Has completado el tema sobre el uso de pesos como unidades de medida. ¡Gracias por tu tiempo!

---

## Diapositiva 14

Aviso legal SAP — sin cambios respecto al documento original.

---
