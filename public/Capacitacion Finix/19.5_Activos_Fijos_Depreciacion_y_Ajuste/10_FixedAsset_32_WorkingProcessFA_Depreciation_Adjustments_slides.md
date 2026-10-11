# Transcripción por Diapositiva: 10_FixedAsset_32_WorkingProcessFA_Depreciation_Adjustments

## Diapositiva 1

Activos Fijos: Amortización y Ajustes — SAP Business One Versión 10.0. Bienvenido al tema: Amortización y Ajustes.

---

## Diapositiva 2

Objetivos. Al finalizar este curso, podrás: Generar documentos para reflejar el valor del activo fijo. Nota: Debes tomar decisiones sobre los requisitos legales y del sector junto con el contable del cliente.

---

## Diapositiva 3

Escenario de Negocio. OEC Computers utiliza una pequeña flota de camiones de reparto. Tras adquirirlos, los definieron como activos fijos en SAP Business One. Para presentar el valor actualizado de los camiones en los informes financieros de la empresa, necesitan documentar las transacciones que afectan al valor de los vehículos durante su vida útil. Usa la opción de amortización para dar de baja el coste de un activo a lo largo de su vida útil. Para ajustes, utiliza documentos adicionales de activos fijos: Transferencia, Amortización Manual y Revaluación de Activos.

---

## Diapositiva 4

Tipo de Amortización / Clase de Activo / Método Lineal. 6.000 ÷ 36 meses de vida útil = 166,67 por mes. 12 Meses × 166,67 = 2.000 de amortización anual. La amortización se usa para dar de baja el coste de un activo a lo largo de su vida útil. Representa la reducción del valor contable de un activo tanto a efectos fiscales como contables. SAP Business One permite configurar tipos de amortización usando varios métodos predefinidos. El método de amortización establece el cálculo del valor de la amortización. En nuestro ejemplo elegimos el método Lineal, el más común. El valor de adquisición del camión fue 6.000 y la vida útil definida para la clase de activo es de 3 años, es decir, 36 meses. El valor de amortización calculado para un año será 2.000 según el siguiente cálculo: la cuota mensual será 6.000 ÷ 36 meses = 166,67, y la amortización anual: 12 Meses × 166,67 = 2.000.

---

## Diapositiva 5

Amortización de Activos Fijos – Valor Contable Neto del Activo. Valor de adquisición: 6.000 / Vida Útil: 3 años. Fecha de Valoración: 1 de enero. 31 de diciembre: 4.000 / 31 de diciembre: 2.000 / 31 de diciembre: 0. Método de Amortización: Lineal. En nuestro ejemplo, al definir el nuevo camión que OEC Computers adquirió, definimos la Vida Útil del activo, es decir, el período durante el cual se espera que el activo sea utilizable para el propósito para el que se adquirió. Definimos la vida útil del camión como 3 años. Cada período la empresa calcula la amortización del activo. La amortización se incluye entre los gastos de la empresa. Tal como se mencionó en la diapositiva anterior, está previsto que el camión reduzca su valor en 2.000 cada año. Durante la vida útil del activo, el sistema también calcula el Valor Contable Neto del activo: el valor de un activo en los libros contables calculado usando el coste histórico menos cualquier amortización acumulada. En nuestro caso, tras el primer año el valor del camión será 4.000, luego 2.000 y llegará a 0 al final de su vida útil. El cálculo del Valor Contable Neto del activo aparece en los Datos Maestros de Activos.

---

## Diapositiva 6

Ejecución de Amortización – Área de Amortización. Clase de Activo / Área de Amortización. Recuerda que las cuentas y los importes en el proceso de amortización se derivan de la definición de los Datos Maestros de Activos. En el ejemplo del camión, la clase de activo definida está vinculada al área PCGA como el área principal y de Contabilización en C/G. Si el tipo de área de amortización es Contabilización en C/G, además de contabilizar la amortización para cada activo, hay una contabilización financiera. En el campo Contabilización de Amortización, si definimos la Contabilización Directa, el sistema contabilizará la amortización directamente en la cuenta del balance del activo especificada. En la Contabilización Indirecta, el sistema usa la cuenta de amortización acumulada para contabilizar la amortización. En esta opción, la cuenta del balance del activo solo se ve afectada cuando el activo se compra o se da de baja.

---

## Diapositiva 7

Transacciones de Activos Fijos. Libro Auxiliar de Activos Fijos / Transacción de Activo Fijo. Los Datos Maestros de Activos no pueden definirse como un Artículo de Inventario. Por lo tanto, no registra transacciones de inventario. El sistema sí registra transacciones de activos fijos. Según la clase de activo adjunta al activo fijo, se definen una o más áreas para el registro del dato maestro de activo. En el ejemplo presentado, se definen dos áreas de amortización para el dato maestro de activo del camión: el área PCGA (Principios de Contabilidad Generalmente Aceptados locales), que es el área de amortización principal definida como Contabilización en C/G, lo que significa que contabiliza transacciones financieras en el libro auxiliar de activos fijos además de las transacciones de activos fijos. El área NIIF (Normas Internacionales de Información Financiera) es el área adicional y por lo tanto no contabilizará transacciones financieras en el libro mayor. Aunque el área adicional no registra transacciones en el libro mayor, sí afectará a los valores en los datos maestros de activos y en los diferentes informes.

---

## Diapositiva 8

Ejecución de Amortización. Finanzas → Activos Fijos → Ejecución de Amortización. Ejecuta la opción Ejecución de Amortización para actualizar el valor con la amortización real. Ve a Finanzas → Activos Fijos → Ejecución de Amortización. Ejecutas la Ejecución de Amortización para cada Área de Amortización. En el ejemplo presentado ejecutamos la ejecución de amortización para el área de amortización principal, es decir, el área PCGA. Cada vez que ejecutas la Ejecución de Amortización puedes ver las ejecuciones anteriores. Para ejecutar una nueva ejecución, elige el botón Vista Previa.

---

## Diapositiva 9

Ejecución de Amortización – Vista Previa. En la ventana Vista Previa de la Ejecución de Amortización, las contabilizaciones financieras se agrupan por la clase de activo. Solo cuando ejecutas la ejecución de amortización el sistema lleva a cabo todas las amortizaciones planificadas hasta la fecha especificada. Para desencadenar la contabilización de una amortización planificada, generalmente es suficiente iniciar una ejecución de amortización para varios períodos de contabilización. En las ejecuciones de amortización, la amortización planificada no contabilizada se contabiliza usando un método de recuperación. En el método de recuperación, el sistema reúne cualquier amortización planificada que aún no se haya contabilizado para todo el período de amortización y luego crea una contabilización colectiva. Por lo tanto, la contabilización resultante también puede incluir amortización planificada de varios períodos. Nota: una ejecución de amortización puede repetirse tantas veces como sea necesario, siempre que no se haya ejecutado ninguna ejecución de amortización para períodos posteriores. Para registrar los importes de amortización en el libro mayor, elige el botón Ejecutar.

---

## Diapositiva 10

Ejecución de Amortización – Asientos Contables. Las contabilizaciones financieras se agrupan por clase de activo. El sistema acreditará la cuenta del balance del activo (en la opción de Contabilización Directa) y debitará la cuenta de amortización. En la Contabilización Indirecta, el sistema usa la cuenta de amortización acumulada en el lado del Haber. En esta opción, la cuenta del balance del activo solo se ve afectada cuando el activo se compra o se da de baja. En el importe del Debe puedes ver que la amortización se incluye entre los gastos de la empresa. El usuario puede elegir dividir la cuenta del balance del activo por activos en el asiento contable. Defines la división en Administración → Inicialización del Sistema → Configuración de Documentos → Por Documento → Ejecución de Amortización. El valor predeterminado es sin división.

---

## Diapositiva 11

Ejecución de Amortización – Estado. En el ejemplo de la clase de activo Vehículos de Motor definimos el área PCGA y el área NIIF, con el área PCGA definida como el área principal y de Contabilización en C/G. Si el tipo de área de amortización es Contabilización en C/G, además de contabilizar la amortización para cada activo, hay una contabilización financiera. El área NIIF, en nuestro ejemplo, fue definida como Área Adicional y por lo tanto no contabiliza asientos. Aun así, puedes contabilizar importes de amortización en esta área de amortización para usarlos en informes. Por lo tanto, en la tercera ejecución puedes ver que para el área NIIF aparece el estado Sin Amortización Contabilizada.

---

## Diapositiva 12

Cuentas de Activos en el Balance de la Empresa (Contabilización Directa). Cuenta del Balance del Activo. Contabilización Directa: 6.000 − 2.000 = 4.000. Capitalización / Amortización / Valor Contable Neto. Debe – Balance – Haber. Cuenta de Activo Fijo: 4.000. El Balance de una empresa contiene las cuentas de activos. El documento de Capitalización debita la cuenta del balance del activo especificada para el activo. Cuando se usa el método de contabilización directa, el documento de Amortización acredita la misma cuenta del balance del activo. Por lo tanto, el valor contable neto del activo se refleja en el saldo de la cuenta.

---

## Diapositiva 13

Cuentas de Activos en el Balance de la Empresa (Contabilización Indirecta). Cuenta del Balance del Activo. Cuenta de Amortización Acumulada. Contabilización Indirecta: 6.000 − 2.000 = 4.000. En la Contabilización Indirecta, el sistema usa la cuenta de amortización acumulada para contabilizar la amortización. En esta opción, la cuenta del balance del activo solo se ve afectada cuando el activo se capitaliza o se da de baja. Por lo tanto, el valor contable neto del activo se reflejará en la visualización de subtotales del Balance.

---

## Diapositiva 14

Ajustes y Cambio de Ejercicio Fiscal. Durante el ciclo de vida de un activo fijo, documentos adicionales permiten realizar ajustes si es necesario: Transferencia / Amortización Manual / Revaluación de Activos. Cambio de Ejercicio Fiscal: en la gestión de activos fijos, debes ejecutar un cambio de ejercicio fiscal cuando finaliza un ejercicio fiscal. Con el cambio, SAP Business One transfiere todas las amortizaciones y saldos de activos del ejercicio fiscal actual al nuevo ejercicio fiscal. Para todos los documentos, ve a Finanzas → Activos Fijos. Nota: Para decidir qué documento de ajuste utilizar, debes verificar, junto con el contable del cliente, cuáles son los requisitos legales y del sector.

---

## Diapositiva 15

Transferencia. Puedes transferir un activo o parte de un activo a un activo diferente. Esto puede ser necesario cuando: 1. El valor se activó en el Dato Maestro de Activo incorrecto y necesitas transferirlo al correcto. 2. El activo se activó en la Clase de Activo incorrecta y ya se han creado amortizaciones. 3. El activo está en espera. Por ejemplo, el activo está en construcción. Cuando esté terminado, se moverá a la clase de activo correcta. Según los diferentes usos del documento de Transferencia, incluye dos tipos de transacción: Transferencia de Activo y Transferencia de Clase de Activo. Una vez que eliges un tipo de transacción, la estructura de la tabla cambia en consecuencia.

---

## Diapositiva 16

Amortización Manual. En algunos casos puede que quieras amortizar manualmente ciertos activos: 1. Hay una reducción permanente e inesperada en el valor del activo, por ejemplo causada por un accidente. 2. Hay amortizaciones especiales que deseas usar parcialmente. 3. Estás usando la amortización por unidades de producción y quieres planificar manualmente la amortización. 4. También puedes revalorizar el valor del activo fijo para revertir una amortización no planificada. Según los diferentes usos del documento de Amortización Manual, incluye cuatro tipos de documento: Amortización Ordinaria, Amortización No Planificada, Apreciación y Amortización Especial. El valor predeterminado es Amortización Ordinaria.

---

## Diapositiva 17

Revaluación de Activos. Con la opción de Revaluación de Activos puedes registrar un aumento o disminución en el valor contable de un activo para reflejar su valor de mercado justo actual. La contabilidad de valor razonable requiere que las revaluaciones se lleven a cabo siempre que haya una diferencia entre el valor de mercado actual de un activo y el valor en el balance. La revaluación se basa en un área de amortización. Una vez que el usuario elige un área de amortización diferente, la tabla se borra. Nota: Debes verificar, junto con el contable del cliente, si este documento está permitido en tu localización.

---

## Diapositiva 18

Cambio de Ejercicio Fiscal. SAP Business One transfiere todas las amortizaciones y saldos de activos del ejercicio fiscal actual al nuevo ejercicio fiscal. Ve a Finanzas → Activos Fijos → Cambio de Ejercicio Fiscal. En la gestión de activos fijos, debes ejecutar un cambio de ejercicio fiscal cuando finaliza un ejercicio fiscal. Cuando cambias un ejercicio fiscal, SAP Business One realiza los siguientes cálculos para cada activo: Calcula los valores de fin de año de todas las transacciones del activo. Estos valores se guardan en el dato maestro del activo y sirven como valores iniciales para el nuevo ejercicio fiscal. Recalcula la amortización planificada para el nuevo ejercicio fiscal. Nota: Si el siguiente ejercicio fiscal al que deseas cambiar aún no está definido en SAP Business One, recibirás un mensaje de error.

---

## Diapositiva 19

Resumen. Puntos clave: La amortización se usa para dar de baja el coste de un activo a lo largo de su vida útil. Puedes configurar tipos de amortización usando varios métodos predefinidos. Define la Vida Útil del activo. Antes del final de la vida útil de un activo, el activo debe darse de baja completamente. El sistema registra transacciones de activos fijos. Las cuentas y los importes en el proceso de amortización se derivan de la definición de los Datos Maestros de Activos.

---

## Diapositiva 20

Resumen (cont.). Ejecuta la opción Ejecución de Amortización para actualizar el valor con la amortización real. Ejecutas la ejecución de amortización para cada Área de Amortización. Si el tipo de área de amortización es Contabilización en C/G, además de contabilizar la amortización para cada activo, hay una contabilización financiera. Durante el ciclo de vida de un activo fijo, documentos adicionales permiten realizar ajustes si es necesario. Los documentos son: Transferencia, Amortización Manual y Revaluación de Activos. En la gestión de activos fijos, debes ejecutar un cambio de ejercicio fiscal cuando finaliza un ejercicio fiscal. SAP Business One transfiere todas las amortizaciones y saldos de activos del ejercicio fiscal actual al nuevo ejercicio fiscal.

---

## Diapositiva 21

Aviso legal SAP — sin cambios respecto al documento original.

---
