# Transcripción por Diapositiva: 10_CostandBudget_12_CostAcc_MultiDimensions_ES

## Diapositiva 1

PUBLIC Contabilidad de costes y presupuesto: Dimensiones múltiples en la contabilidad de costes SAP Business One Versión 10.0 Bienvenido al tema Dimensiones múltiples en la contabilidad de costes. 1

---

## Diapositiva 2

 En este tema, observaremos la posibilidad de utilizar dimensiones múltiples al trabajar con la contabilidad de costes.  Tenga en cuenta que este tema se basa en el concepto de contabilidad de costes. 2 PUBLIC Al finalizar este tema, podrá:  Describir cómo utilizar las dimensiones múltiples al trabajar con la contabilidad de costes Nota: Este tema se basa en el concepto de contabilidad de costes. Objetivos

---

## Diapositiva 3

3 PUBLIC Dimensiones múltiples - Ejemplo empresarial Cuando analizan los ingresos y gastos, desean conocer los resultados finales de cada línea de productos. Desean generar el informe Resumen de contabilidad de costes por departamento (ventas, soporte y desarrollo) y por línea de negocio. OEC Computers utiliza la opción de contabilidad de costes en SAP Business One. Anteriormente, definía los tres departamentos: ventas, soporte y desarrollo como centros de coste. OEC Computers también tiene dos líneas de negocio:  Hardware  Aplicaciones  OEC Computers utiliza la opción de contabilidad de costes en SAP Business One. Anteriormente, definía los tres departamentos: ventas, soporte y desarrollo como centros de coste.  Ahora, al examinar los productos que vende OEC Computers, el director le dice que desea analizar los ingresos y gastos por las dos líneas de negocio que dirigen: hardware y aplicaciones.  Quieren ver los resultados finales de cada línea de negocio.  El contable afirma que sería mejor una vista analítica por departamentos. Es decir, ventas, soporte y desarrollo.  Les explica que pueden analizar los mismos datos según los departamentos de la empresa y también por línea de negocio.

---

## Diapositiva 4

4 PUBLIC Dimensiones múltiples Soporte Centro_z Ventas Desarrollo OEC Computers Dimensión 1: Departamentos Dimensión 2: Línea de negocio (LOB) Aplicaciones Centro_z Hardware OEC Computers  Las dimensiones múltiples permiten generar hasta cinco vistas distintas de los mismos datos.  Observe que cada centro de coste y norma de reparto pertenecen a solo una dimensión.  Las dimensiones múltiples permiten generar hasta cinco vistas distintas de los mismos datos.  Esta opción solo aparece si se marca la casilla de selección Utilizar dimensiones múltiples en la ficha Contabilidad de costes de la ventana Parametrizaciones generales en Gestión  Inicialización del sistema Parametrizaciones generales.  Para definir dimensiones seleccione Finanzas Contabilidad de costes Dimensiones.  En nuestro ejemplo puede definir los departamentos de la empresa como dimensión 1 y las líneas de negocio como dimensión 2.  Para cada dimensión cree centros de coste y normas de reparto que se correspondan con sus requisitos de generación de informes. Observe que cada centro de coste y norma de reparto pertenecen a solo una dimensión.  Al emitir los distintos informes, seleccione la dimensión relevante.

---

## Diapositiva 5

5 PUBLIC Enlace entre el Libro mayor y la Contabilidad de costes con Dimensiones múltiples Costes de electricidad, cuenta de mayor Norma de reparto X Área Centro de coste 1: Ventas Centro de coste 2: Soporte Centro de coste 3: Desarrollo Asiento 1000 Costes de calefacción Norma reparto área Asiento 2000 Área Costes electricidad Norma reparto Dimensión 1: Departamentos Dimensión 2: LOB Norma de reparto X Nº de empleados Asiento 1000 Costes de calefacción Norma reparto área Asiento 2000 nº de empleado Costes electricidad Norma reparto Centro de coste 1: Hardware Centro de coste 2: Software  Veamos el coste de electricidad de la empresa:  En la ventana Plan de cuentas, enlace la cuenta de gastos de electricidad con las 2 dimensiones: Departamentos y Líneas de negocio.  Para cada dimensión defina la norma de reparto relevante. En la dimensión de departamentos es la norma indirecta la que distribuye los costes según el tamaño de las áreas del departamento. En la dimensión de línea de negocio, los costes se distribuirán entre el número de empleados de cada centro de coste.  En el trabajo diario, cada vez que emita un gasto en la cuenta de gastos de electricidad, el importe se asignará automáticamente a los distintos departamentos según la norma de reparto definida en la dimensión 1. Y, paralelamente, el mismo importe se asignará conforme al número de empleados que trabajan para cada línea de negocio según se ha definido en la dimensión 2.  Entonces, puede ejecutar los distintos informes y comparar el análisis de costes e ingresos por departamento y por línea de negocio.

---

## Diapositiva 6

6 PUBLIC Opciones de dimensiones  Puede configurar la visualización de las normas de reparto en los documentos de marketing y asientos.  En la ventana Parametrizaciones generales – Contabilidad de costes, puede fijar la visualización de las normas de reparto en los documentos de marketing y asientos. Seleccione si desea visualizar las normas de reparto de varias dimensiones en una columna, separadas por punto y coma (;) o si desea visualizar todas las dimensiones activas en columnas separadas. Para obtener más información acerca de estas dos opciones, consulte la ayuda en línea.  Puede modificar el estado del botón de selección en cualquier momento. La modificación solo afecta a la forma en que se visualizan las normas de reparto; no afecta la base de datos. 6

---

## Diapositiva 7

7 PUBLIC Informes de contabilidad de costes  Informes estándar para una determinada dimensión y norma de reparto: Cuenta de pérdidas y ganancias, Balance de sumas y saldos e Informe de presupuesto.  Informes de contabilidad de costes:  Informe de centro de coste  Informe de distribución  Informe de resumen de contabilidad de costes Tenga en cuenta que también puede ejecutar estos informes según un proyecto financiero seleccionado.  Puede generar algunos informes estándar para una determinada dimensión y norma de reparto; por ejemplo, Cuenta de pérdidas y ganancias, Balance de sumas y saldos o Informe de presupuesto.  Seleccione Finanzas Contabilidad de costes para ejecutar informes específicos de contabilidad de costes:  Informe de centro de coste para visualizar un resumen de los gastos e ingresos contabilizados.  Informe de distribución para obtener una visión de los gastos generales contabilizados por transacciones específicas y los importes distribuidos en cada centro de coste.  Informe de resumen de contabilidad de costes que incluye documentos preliminares y utilice jerarquías para la estructura de informes que requiera. Tenga en cuenta que también puede ejecutar estos informes según un proyecto financiero seleccionado.

---

## Diapositiva 8

8 PUBLIC Jerarquía de centros de coste  Utilice la Jerarquía de centros de coste para definir modelos de informes de contabilidad de costes según las necesidades de la empresa.  Puede utilizar estos modelos en varios informes.  El modelo permite agrupar los datos de distintas maneras. Según el modo en que se agrupan los datos, la dirección de la empresa obtiene una visión mejor del rendimiento de las distintas partes de la organización.  Cada jerarquía se relaciona directamente con una dimensión (si se utilizan dimensiones en la empresa).  Para cada dimensión se pueden crear varios modelos.  Puede definir jerarquías de hasta tres niveles.  Los centros de coste solo se pueden incluir en los nodos inferiores de la jerarquía.  También puede utilizar fórmulas para agregar varios centros de coste.  En el ejemplo presentado, para la dimensión Departamentos, los centros de coste Ventas y Soporte se agrupan bajo el título Servicio al cliente y se totalizan con la opción Subtotal.  Seleccione Finanzas Contabilidad de costes Jerarquía de centros de coste para definir y visualizar los modelos de informes de contabilidad de costes.

---

## Diapositiva 9

9 PUBLIC Resumen - 1  Las dimensiones múltiples permiten generar hasta cinco vistas distintas de los mismos datos. Esta opción solo aparece si se marca la casilla de selección en la ficha Contabilidad de costes de la ventana Parametrizaciones generales.  Para cada dimensión cree centros de coste y normas de reparto que se correspondan con sus requisitos de generación de informes.  En la ventana Plan de cuentas, enlace las cuentas relevantes con las dimensiones: Para cada dimensión defina la norma de reparto relevante. A continuación, se detallan algunos puntos clave:  Las dimensiones múltiples permiten generar hasta cinco vistas distintas de los mismos datos. Esta opción solo aparece si se marca la casilla de selección en la ficha Contabilidad de costes de la ventana Parametrizaciones generales.  Para cada dimensión cree centros de coste y normas de reparto que se correspondan con sus requisitos de generación de informes.  En la ventana Plan de cuentas, enlace las cuentas relevantes con las dimensiones: Para cada dimensión defina la norma de reparto relevante. 9

---

## Diapositiva 10

10 PUBLIC Resumen – 2  En el trabajo diario, cada vez que envíe un importe a la cuenta de gastos o ventas, se asignará el mismo importe automáticamente a las dimensiones y a sus normas de reparto en paralelo.  Puede configurar la visualización de las normas de reparto en los documentos de marketing y asientos.  Al emitir los distintos informes, seleccione la dimensión deseada.  En el trabajo diario, cada vez que envíe un importe a la cuenta de gastos o ventas, se asignará el mismo importe automáticamente a las dimensiones y sus normas de reparto en paralelo.  Puede configurar la visualización de las normas de reparto en los documentos de marketing y asientos.  Al emitir los distintos informes, seleccione la dimensión deseada. 10

---

