# Transcripción por Diapositiva: 10_CostandBudget_11_CostAcc_CostAcc_ES

## Diapositiva 1

PUBLIC Contabilidad de costes y presupuesto: Contabilidad de costes SAP Business One Versión 10.0 Bienvenido al tema Contabilidad de costes. 1

---

## Diapositiva 2

 En este tema, veremos las ventajas de utilizar la contabilidad de costes y describiremos cómo gestionarla. 2 PUBLIC Al finalizar este tema, podrá:  Describir cómo se debe gestionar la contabilidad de costes Objetivos

---

## Diapositiva 3

3 PUBLIC Ejemplo empresarial El departamento de ventas genera más ingresos que los otros departamentos. Por otro lado, este departamento también tiene muchos gastos: viajes, hotel, cena, conferencias, publicidad, bonos, etc. ¿Cómo puede conocer el contable de la empresa los resultados finales de cada departamento? ¿Cómo pueden generar un informe de pérdidas y ganancias para un departamento? Implementará SAP Business One en un nuevo cliente, OEC Computers. La empresa está divida en departamentos:  Ventas  Soporte  Desarrollo  Veamos un ejemplo empresarial:  Supongamos que está implementando SAP Business One en una empresa con tres departamentos: ventas, soporte y desarrollo.  Lógicamente, el departamento de ventas genera más ingresos que los otros departamentos. Por otro lado, este departamento también tiene muchos gastos: viajes, hotel, cena, conferencias, publicidad, bonos, etc.  El contable de la empresa le pregunta cómo pueden conocer los resultados finales de cada departamento. ¿Cómo pueden generar un informe de pérdidas y ganancias para un departamento?

---

## Diapositiva 4

4 PUBLIC ¿Qué es la contabilidad de costes en SAP Business One?  Además de su contabilidad periódica, muchas empresas realizan análisis de gastos e ingresos que miden la rentabilidad de cada una de sus actividades empresariales o departamentos.  Para ello, define unidades de la empresa para cada actividad empresarial o departamento. Estos son los centros de coste que se utilizan para consolidar los gastos y los ingresos que resultan de la actividad continua de la unidad organizativa específica.  Una norma de reparto es un método de contabilidad de costes utilizado para asignar gastos e ingresos directos e indirectos a uno o más centros de coste. Contiene información relativa a la parte o los importes fijos de gastos o ingresos que se asignarán a cada centro de coste. Antes de sumergirnos en el proceso de contabilidad de costes, veamos la terminología correspondiente tal y como está definida en SAP Business One.  Además de su contabilidad periódica, muchas empresas realizan análisis de gastos e ingresos que miden la rentabilidad de cada una de sus actividades empresariales o departamentos.  Para ello, define unidades de la empresa para cada actividad empresarial o departamento. Estos son los centros de coste que se utilizan para consolidar los gastos y los ingresos que resultan de la actividad continua de la unidad organizativa específica.  Una norma de reparto es un método de contabilidad de costes utilizado para asignar gastos e ingresos directos e indirectos a uno o más centros de coste. Contiene información relativa a la parte o los importes fijos de gastos o ingresos que se asignarán a cada centro de coste. 4

---

## Diapositiva 5

5 PUBLIC ¿Qué es la contabilidad de costes en SAP Business One? Cont.  Al trabajar con el proceso de contabilidad de costes, los costes presentados en el libro mayor se distribuyen automáticamente a los centros de coste mediante las normas de reparto definidas.  La función de contabilidad de costes de SAP Business One le permite definir conjuntos de centros de coste y normas de reparto. La generación de los respectivos informes le proporciona información importante relativa al coste. El sistema recopila los datos contabilizados en las cuentas y los presenta de diferentes maneras en los informes.  Al trabajar con el proceso de contabilidad de costes, los costes presentados en el libro mayor se distribuyen automáticamente a los centros de coste mediante las normas de reparto definidas.  La función de contabilidad de costes de SAP Business One le permite definir conjuntos de centros de coste y normas de reparto. La generación de los respectivos informes le proporciona información importante relativa al coste. El sistema recopila los datos contabilizados en las cuentas y los presenta de diferentes maneras en los informes. 5

---

## Diapositiva 6

6 PUBLIC Centros de coste Soporte Centro_z Ventas Desarrollo Admin. OEC Computers Código de clasificación Centros de coste  Para utilizar las funciones de contabilidad de costes en SAP Business One, debe definir los centros de beneficio o los departamentos de la empresa como centros de coste. Posteriormente, puede compilar una cuenta de pérdidas y ganancias para cada centro de coste en cada período.  En nuestro ejemplo, OEC Computers ha definido sus tres departamentos: ventas, soporte y desarrollo como centros de coste.  Puede agrupar los centros de coste mediante un código de clasificación.  Seleccione Finanzas Contabilidad de costes Centros de coste para definir y actualizar centros de coste.  El sistema crea automáticamente un centro de coste cero (Centro_z) que reúne los costes e ingresos que no pueden distribuirse claramente en otros centros de coste porque no se dispone de suficiente información. El centro de coste Centro_z también puede registrar costes que no se presentarán en la contabilidad de costes interna. Por ejemplo, si sólo desea mostrar el 80% de sus gastos de alquiler como costes, puede asignar el 20% restante al Centro_z.

---

## Diapositiva 7

7 PUBLIC Normas de reparto Enlace entre el Libro mayor y la Contabilidad de costes Gastos de vehículo de la empresa, cuenta de mayor Norma de reparto directa X Ventas Ventas Centro de coste 1 Asiento 1000 Costes de calefacción Norma reparto área Asiento Importe de coste 100% Vehículo empresa Norma reparto Asignación de costes e ingresos directos Cuando se crea un centro de coste, el sistema crea automáticamente una norma de reparto con el mismo nombre.  Si desea incluir los costes enviados al libro mayor automáticamente en la contabilidad de costes, debe enlazar una cuenta con una norma de reparto, en el Plan de cuentas.  Solo se pueden enlazar cuentas con el tipo de cuenta Ventas o Gastos en el plan de cuentas.  Las normas de reparto definen cómo se distribuyen los costes o ingresos contabilizados para una cuenta en los centros de coste.  En el trabajo diario, contabiliza asientos o documentos de marketing en una cuenta de mayor que está enlazada a una norma de reparto.  Cuando se crea un centro de coste, el sistema crea automáticamente una norma de reparto con el mismo nombre. Esta norma (que no se puede modificar) se configura para que el sistema contabilice todos los costes o ingresos en el centro de coste correspondiente. En otras palabras, el sistema no divide los importes. Puede utilizar estas normas de reparto para costes e ingresos directos, que puede asignar exclusiva y completamente a un determinado centro de coste.  Por ejemplo, en OEC Computers, los gastos de vehículos de la empresa se asignan directamente al centro de coste Ventas porque sólo los empleados de ventas disponen de vehículos de la empresa.  Después de enlazar la cuenta de gastos de vehículos con la norma de reparto Ventas, cada vez que se emita un gasto en la cuenta de gastos de vehículos de la empresa, el importe completo se imputará directamente al centro de coste de ventas.

---

## Diapositiva 8

8 PUBLIC Asignación de costes e ingresos indirectos Norma de reparto indirecta Área Centro de coste 1: Ventas Centro de coste 2: Soporte Centro de coste 3: Desarrollo Total: 500 (en unidades de área local)  Los costes e ingresos indirectos no se asignan directamente a un centro de coste. En lugar de ello, se asignan a uno o varios centros de coste mediante una norma de reparto. En la norma de reparto, se especifica cómo se distribuirá el importe entre los centros de coste. Puede realizar asignaciones por porcentaje o ratio. Por ejemplo, puede distribuir los costes en los centros de coste según el tamaño de las áreas del departamento. De la misma forma, puede distribuir los beneficios de empleados voluntarios entre el número de empleados.  Si no puede definir la asignación total (porque no dispone de suficiente información en ese momento), el sistema asignará los costes o ingresos no asignados al centro de coste Centro_z. Cuando disponga de la información necesaria, podrá modificar la norma de reparto para que el sistema corrija la distribución correspondientemente.  Seleccione Finanzas Contabilidad de costes Normas de reparto para definir y actualizar normas de reparto.

---

## Diapositiva 9

9 PUBLIC Asignación de costes e ingresos indirectos Costes de electricidad, cuenta de mayor Norma de reparto X Área Centro de coste 1: Ventas Centro de coste 2: Soporte Centro de coste 3: Desarrollo Asiento 1000 Costes de calefacción Norma reparto área Asiento Importe 2000 Área Costes electricidad Norma reparto  Igual que en la asignación de costes e ingresos indirectos, enlace las cuentas pertinentes con una norma de reparto indirecta en el Plan de cuentas.  Contabilice un asiento o un documento de marketing en una cuenta de mayor que esté enlazada con una norma de reparto.  En nuestro ejemplo, cada vez que emita un gasto en la cuenta de gastos de electricidad, el importe se asignará automáticamente a los distintos departamentos según la definición de la norma de reparto.

---

## Diapositiva 10

10 PUBLIC Asignación de costes e ingresos  Puede modificar la norma de reparto fijada en la cuenta de mayor al emitir un documento de marketing o un asiento manual.  Puede modificar la norma de reparto fijada en la cuenta de mayor al emitir un documento de marketing o un asiento manual.  Para los asientos creados a partir de los documentos de marketing y para los asientos manuales, puede modificar la norma de reparto asignada en cualquier momento.  Esta norma de reparto tiene prioridad sobre la regla definida en la cuenta de mayor y en el documento de marketing.  En el asiento, seleccione la línea de cuenta de mayor y utilice el campo de norma de reparto en la tabla o en Desplegar modo de tratamiento. 10

---

## Diapositiva 11

11 PUBLIC Norma de reparto manual  Al contabilizar un asiento manual, tiene la opción de definir una norma de reparto manual.  El importe que indica en la línea del asiento es el importe total a distribuir.  En la ventana Definir norma de reparto manual, seleccione los centros de coste y asigne el importe entre ellos.  No podrá utilizar esta norma de reparto manual en asientos futuros.  Puede ver los importes de esta norma de distribución en el Informe de distribución y el Informe de resumen de contabilidad de costes. 11

---

## Diapositiva 12

12 PUBLIC Asignación por importe fijo Norma de reparto de importe fijo Alquiler mensual Centro de coste 1: Ventas Centro de coste 2: Soporte Centro de coste 3: Desarrollo No hay ningún importe total * Las diferencias se asignarán al centro de coste sin ningún valor o al Centro_z. A veces, es necesario asignar los importes fijos a centros de coste específicos. Por ejemplo, los empleados de ventas aparecen en el campo; sin embargo, los empleados de soporte y desarrollo no. Por lo tanto, la empresa desea asignar un importe fijo de los gastos del alquiler mensual al departamento de soporte y al departamento de desarrollo. Para lograrlo, en la configuración de la norma de reparto puede definir un importe fijo de 3000 para los centros de coste de desarrollo y soporte. Puede incluir también el centro de coste de ventas sin ningún valor de coste para que asuma las diferencias. Nota:  Al enviar los costes, los importes asignados fijos se mantendrán igual. En caso de que se produzca una diferencia entre el importe total definido (6000 en nuestro ejemplo) y el importe de coste enviado cada mes, el resto del coste se enviará al centro de coste sin ningún valor definido (que en nuestro ejemplo es el centro de coste de ventas).  En el caso que solo mantenga los centros de coste de desarrollo y soporte definidos. Cualquier diferencia se asignará al centro de coste cero (Centro_z).  Esto hace referencia a ambos casos: cuando el importe de coste es mayor o menor que el importe total definido. 12

---

## Diapositiva 13

13 PUBLIC Tabla de centros de coste y normas de reparto 6 8 4 2 20 Empleados 200 200 100 0 500 Área 100 0 0 0 100 CC 3 Desarrollo 0 100 0 0 100 CC 2 Soporte 0 0 100 0 100 CC 1 Ventas CC 3 Des. CC 2 Soporte CC 1 Ventas Centro_z Total Centro de coste Norma Regla Normas de reparto para costes e ingresos DIRECTOS Normas de reparto para costes e ingresos INDIRECTOS * Centro de coste (CC)  Una vez que OEC Computers haya configurado sus centros de coste y normas de reparto, podrá ver las asignaciones en formato de tabla.  Seleccione Finanzas Contabilidad de costes Tabla de centros de coste y normas de reparto para visualizar las asignaciones para las normas de reparto.  Aquí se ofrece un ejemplo de cómo podría OEC Computers fijar sus normas de reparto para distribuir los costes en los correspondientes centros de coste del departamento.

---

## Diapositiva 14

14 PUBLIC Resumen - 1 A continuación, se detallan algunos puntos clave:  Para utilizar las funciones de contabilidad de costes, debe definir los centros de beneficio o los departamentos de la empresa como centros de coste.  Cuando se crea un centro de coste, el sistema crea automáticamente una norma de reparto con el mismo nombre. Esta norma se configura para que el sistema contabilice todos los costes o ingresos en el centro de coste correspondiente.  Los costes e ingresos indirectos no se asignan directamente a un centro de coste. En su lugar, se asignan a uno o varios centros de coste mediante una norma de reparto indirecta. En la norma de reparto, se especifica cómo se distribuirá el importe entre los centros de coste.  A continuación, se detallan algunos puntos clave:  Para utilizar las funciones de contabilidad de costes, debe definir los centros de beneficio o los departamentos de la empresa como centros de coste.  Cuando se crea un centro de coste, el sistema crea automáticamente una norma de reparto con el mismo nombre. Esta norma se configura para que el sistema contabilice todos los costes o ingresos en el centro de coste correspondiente.  Los costes e ingresos indirectos no se asignan directamente a un centro de coste. En su lugar, se asignan a uno o varios centros de coste mediante una norma de reparto indirecta. En la norma de reparto, se especifica cómo se distribuirá el importe entre los centros de coste. 14

---

## Diapositiva 15

15 PUBLIC Resumen – 2  Para incluir automáticamente costes del libro mayor en la contabilidad de costes, enlace una norma de reparto con cuentas del Plan de cuentas.  Cada vez que emita un importe en estas cuentas, el importe se asignará a los distintos departamentos según la definición de la norma de reparto.  Puede modificar la norma de reparto fijada en la cuenta de mayor al emitir un documento de marketing o un asiento manual.  Para los asientos creados a partir de los documentos de marketing y para los asientos manuales, puede modificar la norma de reparto asignada en cualquier momento.  Esta norma de reparto tiene prioridad sobre la regla definida en la cuenta de mayor y en el documento de marketing.  Para incluir automáticamente costes del libro mayor en la contabilidad de costes, enlace una norma de reparto con cuentas del Plan de cuentas.  Cada vez que emita un importe en estas cuentas, el importe se asignará a los distintos departamentos según la definición de la norma de reparto.  Puede modificar la norma de reparto fijada en la cuenta de mayor al emitir un documento de marketing o un asiento manual.  Para los asientos creados a partir de los documentos de marketing y para los asientos manuales, puede modificar la norma de reparto asignada en cualquier momento.  Esta norma de reparto tiene prioridad sobre la regla definida en la cuenta de mayor y en el documento de marketing. 15

---

