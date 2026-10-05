# Transcripción por Diapositiva: 10_FixedAsset_21_FixedAsset_InitSettings

## Diapositiva 1

Activos Fijos: Configuración Inicial — SAP Business One Versión 10.0. Bienvenido al tema: Activos Fijos – Configuración Inicial.

---

## Diapositiva 2

Objetivos. Al finalizar este tema, podrás: Configurar las definiciones de activos fijos en el sistema. Definir los Datos Maestros de Activos Fijos. Nota: Debes tomar decisiones sobre los requisitos legales y del sector junto con el contable del cliente.

---

## Diapositiva 3

Escenario de Negocio. OEC Computers utiliza una pequeña flota de camiones de reparto. Al adquirir los camiones, desean registrarlos como activos. Bryce, el contable, quería tener la opción de gestionar y supervisar el valor de los camiones. Después de que le presentaras la solución de Activos Fijos en SAP Business One, decidió habilitarla en la base de datos de la empresa. Tú le ayudas a configurarla en el sistema.

---

## Diapositiva 4

Inicialización del Sistema – Pasos. Para comenzar a trabajar con la solución de Activos Fijos debes seguir estos pasos: 1. Activar la nueva solución. 2. Para cada tipo de activo que posea la empresa, configurar un conjunto de definiciones. Por ejemplo, definir el conjunto de definiciones Vehículos Pesados para adjuntarlo a la flota de camiones de reparto de OEC Computers. 3. Definir la numeración de documentos para los documentos de activos fijos con los que trabajará la empresa. 4. Definir un registro de Datos Maestros de Activos para cada activo. Por ejemplo, definir el Camión como Datos Maestros de Activos. 5. Adjuntar el conjunto de definiciones relevante a cada datos maestros de activos. En nuestro ejemplo, adjuntarías el conjunto de definiciones Vehículos Pesados a los Datos Maestros del Camión.

---

## Diapositiva 5

1. Activar la Nueva Solución. Administración → Inicialización del Sistema → Datos de la Empresa → Inicialización Básica. Marca la casilla Habilitar Activos Fijos. Nuevas ventanas y campos estarán disponibles para el usuario en: Administración → Configuración → Finanzas → Activos Fijos, y en Finanzas → Activos Fijos. Una vez activada la solución, no podrás desactivarla y la casilla Habilitar Activos Fijos quedará deshabilitada.

---

## Diapositiva 6

Activar la Solución de Activos Fijos – Configurar el Cálculo de Amortización. Tras activar la solución de Activos Fijos, aparece una nueva opción, Calcular Amortización Por, que permite definir el período de cálculo de la amortización. En este campo especificas si deseas que el sistema calcule la amortización de los activos fijos por mes o por día. La selección predeterminada es Mes. Esta es una configuración global a nivel de empresa. No puedes cambiarla durante un ejercicio fiscal si ya se ha contabilizado una transacción de amortización. Podrás cambiar el valor seleccionado en el siguiente ejercicio fiscal. En el ejemplo presentado puedes ver el vehículo de transporte que la empresa adquirió con un coste de 6.000, con una vida útil de 12 meses. En el cálculo mensual, el sistema calculará el mismo valor para cada mes. Por ejemplo, 6.000 ÷ 12 Meses = 500 de cuota de amortización mensual. Este cálculo se mostrará como las cuotas de Amortización Planificada en los Datos Maestros de Activos, pestaña Activos Fijos → subpestaña Amortización. En el cálculo diario, la operación sería 6.000 ÷ 365 Días = 16,44 por día. Así, el importe de amortización para febrero, por ejemplo, sería 28 días × 16,44 = 460,27. Nota: en los cálculos presentados aquí se asume que se ha definido el Método de Amortización Lineal para los datos maestros del activo. Hablaremos de los métodos de amortización en las siguientes diapositivas.

---

## Diapositiva 7

2. Conjunto de Definiciones de Activos Fijos. Clase de Activo / Datos Maestros del Activo: Camión / Tipo de Amortización / Determinación de Cuentas / Área de Amortización. Área de Amortización Principal: PCGA. Método: Lineal. Código: FA Motores. Código: Vehículos de Motor. Veamos nuestro ejemplo. Tenemos el nuevo camión que OEC Computers adquirió a principios del ejercicio fiscal. Creamos un conjunto de definiciones relevante para este tipo de activo. En nuestro ejemplo definimos el conjunto de definiciones Vehículos de Motor. Luego, definimos este camión como Datos Maestros de Activos en Finanzas → Activos Fijos → Datos Maestros de Activos y adjuntamos el conjunto de definiciones Vehículos de Motor a los datos maestros del camión. La definición principal en los Datos Maestros de Activos es la Clase de Activo, que agrupa las demás definiciones: Área de Amortización, Determinación de Cuentas y Tipo de Amortización.

---

## Diapositiva 8

Área de Amortización. Defines el Área de Amortización en Administración → Configuración → Finanzas → Activos Fijos. El Área de Amortización es una dimensión financiera que muestra la valoración del activo según una norma contable particular, por ejemplo: amortización contable, amortización fiscal o amortización para contabilidad de costos. En el campo Tipo eliges entre tres opciones: Contabilización en C/G, Área Adicional y Área Derivada. La opción predeterminada es Área Adicional. La opción Contabilización en C/G significa que esta área contabilizará transacciones en el libro auxiliar de activos. En nuestro ejemplo, definiremos PCGA (Principios de Contabilidad Generalmente Aceptados locales) como el área de Contabilización en C/G. Puedes definir un Área Adicional si es necesario. En nuestro ejemplo, definiremos las NIIF como el área adicional (Normas Internacionales de Información Financiera). El área adicional puede usarse para informes. Para el área de amortización principal única, el usuario puede definir un Área Derivada. El área derivada es una referencia al área de amortización principal. Las diferencias de valor entre ambas se usan principalmente para conservar los valores de amortización no planificada. Así, en nuestro caso, cuando contabilizas una amortización especial o no planificada en el área principal (el área PCGA), el área derivada conservará los valores de amortización no planificada permitiendo que el área principal refleje el cálculo base definido en la configuración inicial. Nota: No puedes cambiar el tipo de área de amortización si el área fue asignada a una clase de activo.

---

## Diapositiva 9

Área de Amortización – Tipo Contabilización en C/G. Cuando eliges el tipo Contabilización en C/G aparecen otros campos. Estos campos son exclusivos del tipo Contabilización en C/G y no aparecerán cuando elijas Área Adicional o Área Derivada. El Área de Amortización Principal es la primera definición que eliges. Debes definir un área de amortización como el área principal en la empresa. En nuestro ejemplo, el área principal es PCGA. Esta área de amortización principal contabilizará las transacciones en el sistema. Nota: Puedes definir otro tipo de área Contabilización en C/G distinta del área de amortización principal. Pero recuerda que ambas contabilizarán transacciones en el libro auxiliar de activos. Para el área principal puedes elegir un área de amortización derivada.

---

## Diapositiva 10

Área de Amortización – Tipo Contabilización en C/G – Cont. Otros dos campos que se activan al elegir el tipo de área Contabilización en C/G son: Contabilización de Amortización y Contabilización de Baja. Estas definiciones se aplicarán en los documentos de Amortización y Baja respectivamente. Aquí decides qué cuentas se usarán automáticamente en los documentos de Amortización y Baja. Las cuentas se toman de la definición de Determinación de Cuentas de activos fijos adjunta a los datos maestros del activo. En el campo Contabilización de Amortización eliges entre Contabilización Directa e Indirecta. El valor predeterminado es Contabilización Directa. En la Contabilización Directa, el sistema contabilizará la amortización directamente en la cuenta del balance del activo especificada para el mismo. En la Contabilización Indirecta, el sistema usa la cuenta de amortización acumulada para contabilizar la amortización. En esta opción, la cuenta del balance del activo solo se ve afectada cuando el activo se compra o se da de baja. Nota: esta configuración depende de los Principios de Contabilidad Generalmente Aceptados locales o de la política contable interna de la empresa. No debe cambiarse en la práctica. Si se cambia, los informes pueden no ser transparentes. En el campo Contabilización de Baja eliges entre Bruto y Neto. El valor predeterminado es Bruto. Esta definición se aplicará en un documento de Baja de tipo Desecho (a diferencia del tipo Venta). El sistema siempre tratará el desecho como pérdida. En Bruto el sistema usa la cuenta de gastos brutos predeterminada. Y en Neto usa la cuenta de gastos netos predeterminada.

---

## Diapositiva 11

Determinación de Cuentas para Activos Fijos. Configuras la Determinación de Cuentas para activos fijos en Administración → Configuración → Finanzas → Activos Fijos. La definición de Determinación de Cuentas permite al sistema seleccionar automáticamente las cuentas G/L relevantes para la contabilidad de activos. Para cada tipo de activo que posea la empresa defines un conjunto de cuentas. En nuestro ejemplo definimos el conjunto de cuentas FA Motores. Luego, adjuntarás esta definición a la clase de activo apropiada. En nuestro ejemplo será la clase de activo Vehículos de Motor. La clase de activo se seleccionará para activos de vehículos pesados, por ejemplo el camión que posee la empresa. Por tanto, todas las transacciones que involucren al camión registrarán automáticamente asientos en el conjunto de cuentas FA Motores. Nota: debes tomar decisiones sobre la Determinación de Cuentas G/L junto con el contable del cliente.

---

## Diapositiva 12

Tipo de Amortización. Defines el Tipo de Amortización en Administración → Configuración → Finanzas → Activos Fijos. El Tipo de Amortización clasifica la amortización según el motivo del ajuste de valor. El parámetro principal en la definición del Tipo de Amortización es el Método de amortización. En el gráfico, un ejemplo de tipo de amortización es el método lineal.

---

## Diapositiva 13

Tipo de Amortización – Método de Amortización. SAP Business One permite configurar tipos de amortización utilizando varios métodos predefinidos: Sin Amortización / Lineal / Lineal con Control de Período / Saldo Decreciente / Multinivel / Amortización Inmediata / Amortización Especial / y Amortización Manual. El método de amortización establece el cálculo del valor de la amortización. En nuestro ejemplo elegimos el método Lineal que es el más común. La Base de Cálculo puede ser Anual o Mensual. El valor predeterminado es Anual. Nota: El uso de la opción Mensual es excepcional. En la mayoría de los países es ilegal según los Principios de Contabilidad Generalmente Aceptados locales y solo puede usarse en un Área Adicional. El valor elegido en el campo Base de Cálculo influirá en la pestaña de cálculo.

---

## Diapositiva 14

Método Lineal – La Pestaña de Cálculo. 4.800 ÷ 24 meses de vida útil = 200. 200 × 12 meses = 2.400. Valor de adquisición × porcentaje × meses del período ÷ 12. Valor contable neto × meses del período ÷ Vida restante del activo. Cuando eliges el método Lineal aparece el campo Método de Cálculo en la pestaña de cálculo. La amortización lineal es el método más simple y común, que asume que un activo pierde un importe igual de valor cada año durante su vida útil estimada. En el campo Método de Cálculo puedes elegir entre tres opciones: La primera es Valor de Adquisición / Vida Útil Total: si el valor de adquisición del camión fue 4.800 y la vida útil definida es de 24 meses, el valor de amortización calculado para un año será 4.800 ÷ 24 = 200, y el cálculo anual será 200 × 12 = 2.400. La segunda es Porcentaje del Valor de Adquisición: cuando eliges esta opción aparece el campo Porcentaje Anual para introducir el valor porcentual. El cálculo será: valor de adquisición × porcentaje × meses del período ÷ 12. Y la tercera es Valor Contable Neto / Vida Restante: el Valor Contable Neto es el valor de adquisición del activo menos cualquier amortización aplicada o el último valor de revaluación del activo. El cálculo será: Valor Contable Neto × meses del período ÷ Vida Restante del activo.

---

## Diapositiva 15

Método de Saldo Decreciente. El segundo método más común es el de Saldo Decreciente. Este método implica cargos de amortización más elevados al principio de la vida útil del activo y cargos gradualmente decrecientes en períodos posteriores. Cada año, la amortización se calcula usando el mismo porcentaje constante. En el primer año, el sistema calcula la amortización basándose en los costes de adquisición y producción del activo. En los años siguientes, el cálculo se basa en el valor contable neto restante del activo.

---

## Diapositiva 16

Método de Saldo Decreciente – La Pestaña de Cálculo. En el campo Porcentaje introduce la tasa porcentual anual (si seleccionaste Anual en Base de Cálculo) o la tasa mensual (si seleccionaste Mensual). Nota: El uso de la opción Mensual es excepcional. El importe de amortización determinado por el método de Saldo Decreciente no debe superar un límite máximo especificado. El valor introducido en el campo Factor controla ese límite. El límite se calcula usando el método lineal y multiplicado por este factor. Si el importe de amortización de un activo supera el límite, SAP Business One usa el límite como importe de amortización. En el campo Cambiar Automáticamente A puedes definir que el método de saldo decreciente cambie a un tipo de amortización diferente. El sistema compara los importes de amortización entre el método de saldo decreciente y el lineal. Cuando el importe calculado con el saldo decreciente cae por debajo del importe de amortización lineal, SAP Business One cambia automáticamente al método lineal desde ese punto. Si el usuario deja el campo Cambiar Automáticamente A vacío, el sistema continuará calculando los importes según el método de saldo decreciente hasta el final de la vida útil del activo.

---

## Diapositiva 17

Método Multinivel – La Pestaña de Cálculo. Valor de adquisición o Valor contable neto × porcentaje anual × meses del período ÷ 12. Con el método multinivel, puedes ver la vida útil de un activo como varias fases y amortizar el activo a una tasa definida en cada fase. SAP Business One permite dividir la vida útil de un activo en hasta cinco fases. Dentro de cada nivel se usa un determinado porcentaje para la amortización, que se reemplaza por el porcentaje del nivel siguiente cuando expira el período de validez. En la columna Base eliges entre Valor de Adquisición y Valor Contable Neto. En la columna Número de Años introduces el número de años para este nivel. Luego introduces el porcentaje anual a amortizar en este nivel. Nota: debes definir al menos un nivel. El cálculo será: Valor de Adquisición o Valor Contable Neto × porcentaje anual × meses del período ÷ 12.

---

## Diapositiva 18

Clase de Activo. Defines las Clases de Activo en Administración → Configuración → Finanzas → Activos Fijos. Cada clase de activo agrupa las definiciones de los demás ajustes: Área de Amortización, Determinación de Cuentas y Tipo de Amortización. Cada activo fijo se asignará a una clase de activo. En nuestro ejemplo, el camión pertenece a la clase de activo Vehículos de Motor. Al definir una nueva clase de activo introduces el Código y opcionalmente la Descripción. En el campo Tipo de Activo eliges entre General y Activo de Bajo Valor. Un Activo de Bajo Valor es aquel cuyo coste de adquisición y producción (menos el IVA incluido) no supera un importe legalmente predefinido. Normalmente, un activo de bajo valor puede darse de baja completamente dentro del período en que se adquiere. Al elegir la opción Activo de Bajo Valor aparecen dos campos adicionales: Límite de Valor Desde y Límite de Valor Hasta, que permiten introducir los valores mínimo y máximo permitidos por las leyes nacionales.

---

## Diapositiva 19

Clase de Activo – Sección Áreas de Amortización. En la sección de áreas de amortización, primero eliges las áreas de amortización según las cuales deseas valorar el activo. Cada clase de activo debe contener el área de amortización principal (PCGA en nuestro ejemplo). Si se definió un área derivada para el área principal, aparecerá justo debajo. Puedes elegir un área adicional para la definición de la clase de activo si es necesario. En nuestro ejemplo, definimos las NIIF como el área adicional en la clase de activo Vehículos de Motor. El área adicional puede usarse para informes. El estado predeterminado del campo Activo está marcado. En las filas del área de amortización principal y el área derivada, este campo está marcado y no es editable. El usuario puede actualizar el campo en las demás áreas. A continuación, eliges la definición de Determinación de Cuentas y el Tipo de Amortización para cada área. En el campo Vida Útil introduces (en meses) el período durante el cual se espera que este tipo de activo sea utilizable para el propósito para el que se adquirió.

---

## Diapositiva 20

3. Definir la Numeración de Documentos. Documentos de activos fijos en la ventana de Numeración de Documentos: Capitalización / Nota de Crédito de Capitalización / Amortización Manual / Revaluación / Transferencia / Baja. Cuando trabajes con activos fijos como artículos virtuales, define series de numeración dedicadas para los activos creados. Ten en cuenta que los activos fijos y los datos maestros de artículos utilizan la misma configuración de series de numeración. Por lo tanto, define una serie para activos fijos virtuales en el objeto Artículos en la ventana de Numeración de Documentos. Antes de comenzar a trabajar con activos fijos, define la numeración de documentos para los documentos de activos fijos con los que trabajará la empresa. Si tu empresa desea definir algunos de sus activos fijos como artículos virtuales, debes configurar una serie de numeración dedicada para los activos creados. Una vez que defines un dato maestro de activo como artículo virtual, puedes empezar a usarlo como plantilla para comprar una gran cantidad de activos idénticos. Usando la serie de numeración, el sistema puede crear varios activos nuevos cuando se compra un artículo virtual en una sola fila de transacción.

---

## Diapositiva 21

4. Definir los Datos Maestros de Activos. Datos Maestros de Activos: Camión / Datos Maestros de Activos: Edificio / Datos Maestros de Activos: Portátil. A continuación, defines un registro de Datos Maestros de Activos para cada activo que posea la empresa, por ejemplo, vehículo, edificio o un portátil. En las siguientes diapositivas veremos cómo la definición en los Datos Maestros de Activos influye en los asientos contables creados automáticamente y en el valor del activo fijo.

---

## Diapositiva 22

Definir un Dato Maestro de Activo – Pestaña Activos Fijos. Los Datos Maestros de Activos se encuentran en Finanzas → Activos Fijos → Datos Maestros de Activos. En esta ventana defines los activos que posee la empresa. Es muy similar a la ventana de Datos Maestros de Artículos con la adición del Tipo de Artículo de Activos Fijos y la pestaña Activos Fijos. Al estar los Datos Maestros de Activos separados de los Datos Maestros de Artículos, las autorizaciones se gestionan de forma más eficiente. Puedes seguir el proceso de gestión de un activo usando las diferentes subpestañas en los Datos Maestros de Activos: Resumen / Valores / Amortización / Contabilidad de Costos / y Atributos.

---

## Diapositiva 23

La Subpestaña Resumen. Información / Definiciones Generales / Parámetros de Amortización. La subpestaña Resumen incluye tres áreas principales: El área Definiciones Generales donde defines la configuración del activo según su tipo. El área Parámetros de Amortización donde estableces los parámetros para el cálculo de la amortización. El área Información donde puedes ver información de alto nivel sobre el activo seleccionado en un determinado ejercicio fiscal y área de amortización.

---

## Diapositiva 24

La Subpestaña Resumen: Área de Definiciones Generales. En el área de definiciones generales introduces la configuración que refleja el tipo del activo. El campo Estado se actualiza automáticamente con los tres estados del sistema: Nuevo, Activo e Inactivo. El valor predeterminado al crear el activo es Nuevo, lo que significa que el activo fijo se ha añadido pero aún no se ha capitalizado. El estado cambia a Activo cuando el activo se capitaliza (es decir, cuando comienza el proceso de amortización). Cuando el activo fijo se da de baja por desecho o venta, el estado cambia a Inactivo. A partir de ese momento, no se registrará ningún valor en los libros para este activo. En el campo Fecha de Capitalización especifica la fecha en que se capitaliza el activo. La definición principal en los Datos Maestros de Activos es la Clase de Activo, que incluye la asociación con las demás definiciones: Área de Amortización, Determinación de Cuentas y Tipo de Amortización.

---

## Diapositiva 25

La Subpestaña Resumen: Área de Parámetros de Amortización. Paso 5 – Adjuntar el conjunto de definiciones relevante a cada dato maestro de activo. Este es el quinto paso donde adjuntas el conjunto de definiciones relevante a cada dato maestro de activo. En nuestro ejemplo, adjuntas la Clase de Activo Vehículos de Motor a los Datos Maestros del Camión. Una vez que adjuntas la Clase de Activo a la ventana de Datos Maestros de Activos, todas las definiciones relacionadas se aplicarán a este activo. En el ejemplo presentado puedes ver que las Áreas de Amortización, la Vida Útil y los Tipos de Amortización definidos para la Clase de Activo Vehículos de Motor se aplican a los Datos Maestros de Activos presentados. El usuario puede cambiar la Vida Útil y el Tipo de Amortización del activo.

---

## Diapositiva 26

La Subpestaña Resumen: Área de Información. En el área de información puedes ver una visión general de alto nivel de los datos del activo. Los datos se presentan según el Área de Amortización seleccionada y el Ejercicio Fiscal seleccionado. Una vez que eliges un área de amortización y un ejercicio fiscal en los campos correspondientes, los demás campos del área de información presentan los números según esta selección.

---

## Diapositiva 27

Gestionar Múltiples Activos vs. Gestionar la Cantidad Global en Activos Fijos. En muchos casos la empresa definirá un registro de dato maestro de activo separado para cada activo individual. Por ejemplo, cuando cada portátil está asignado a un empleado diferente o tiene componentes de software distintos instalados. En este caso, cada portátil se definirá como un Dato Maestro de Activos separado. Puedes gestionar activos fijos con la función de Artículo Virtual. Cuando tu empresa necesite comprar activos fijos idénticos en grandes cantidades para uso interno, crea un artículo virtual que represente el activo fijo. En la Factura OC elige este artículo plantilla e introduce una determinada cantidad en la fila del artículo. Luego, SAP Business One crea automáticamente la misma cantidad de registros de datos maestros de activos y los capitaliza. Algunas empresas, sin embargo, quieren gestionar el activo fijo solo a efectos contables y por ello definirán un solo tipo de activo que represente el valor de la cantidad total de ese activo. Por ejemplo, las sillas que OEC Computers compra para su aula.

---

## Diapositiva 28

Gestionar la Cantidad Global en Activos Fijos. En caso de que OEC Computers quiera gestionar las sillas del aula solo a efectos contables, definirán un único registro de dato maestro de activo que represente todas las sillas que compran para su aula. Luego, para este registro de dato maestro de activo, la empresa puede decidir si documentar el número de artículos comprados o no. En la Configuración de Formulario de la Factura OC, pestaña Formato de Tabla, deben elegir hacer Visible y Activa la columna Considerar Cantidad. La columna Considerar Cantidad solo estará activa para registros de datos maestros de activos. Estará deshabilitada para un artículo normal. Una vez que el usuario agrega la Factura OC, la cantidad comprada se registrará en el dato maestro de activo en el campo Cantidad bajo la subpestaña Resumen. Estos datos también aparecerán en los informes.

---

## Diapositiva 29

Gestionar Múltiples Activos con la Opción de Artículo Virtual. OEC Computers definió un artículo virtual para los teléfonos móviles que compran para sus empleados. Los artículos virtuales solo pueden capitalizarse mediante Facturas OC.

---

## Diapositiva 30

Gestionar Múltiples Activos con la Opción de Artículo Virtual (cont.). La cantidad de datos maestros de activos creados automáticamente es la misma que la cantidad especificada en la Factura OC. Los números de artículo se asignan automáticamente a los datos maestros de activos recién creados, según las reglas que hayas definido para la serie utilizada en el dato maestro del activo fijo virtual (paso 3 de nuestro proceso de inicialización). En nuestro ejemplo, cuando OEC Computers introduce una cantidad de 9 teléfonos móviles en la fila de la Factura OC, el sistema crea automáticamente 9 datos maestros de activos, uno para cada teléfono. La información del dato maestro de activo del artículo virtual se copia a los datos maestros de activos recién creados, excepto la casilla Artículo Virtual que permanece desmarcada. Los activos creados son activos fijos normales con valores monetarios. El artículo virtual funciona como plantilla y por lo tanto no tendrá ningún valor bajo la pestaña Activos Fijos.

---

## Diapositiva 31

Resumen. Para comenzar a trabajar con la solución de Activos Fijos debes seguir estos pasos: Activar la nueva solución. Para cada tipo de activo que posea la empresa, configurar un conjunto de definiciones. Definir la numeración de documentos para los documentos de activos fijos con los que trabajará la empresa. Definir un registro de Datos Maestros de Activos para cada activo. Adjuntar el conjunto de definiciones relevante a cada dato maestro de activo. Para ciertos activos, decide si definir un registro de dato maestro separado para cada activo individual usando la función Artículo Virtual, o gestionar el activo fijo solo a efectos contables y definir un solo activo que represente el valor de la cantidad total.

---

## Diapositiva 32

Aviso legal SAP — sin cambios respecto al documento original.

---
