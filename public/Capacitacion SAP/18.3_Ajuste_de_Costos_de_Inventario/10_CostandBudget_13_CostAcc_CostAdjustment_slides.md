# Transcripción por Diapositiva: 10_CostandBudget_13_CostAcc_CostAdjustment

## Diapositiva 1

Contabilidad de Costos y Presupuesto: Ajuste de Contabilidad de Costos — SAP Business One Versión 10.0. Bienvenido al tema: Ajuste de Contabilidad de Costos.

---

## Diapositiva 2

En este tema veremos cómo reasignar costos entre centros de costos. Objetivos: Al finalizar este tema, podrás reasignar costos entre centros de costos.

---

## Diapositiva 3

Ejemplo de Negocio — Ajuste de Contabilidad de Costos: OEC Computers distribuye su gasto de catering en función del número de empleados de cada departamento. Sin embargo, este mes algunos consultores de soporte fueron trasladados al equipo de desarrollo para ayudar en tareas de pruebas. La dirección quiere asegurarse de que los costos se reflejen correctamente en los distintos centros de costos mediante un asiento contable de ajuste de costos al cierre del mes. Centro de Costos 1: Ventas / Centro de Costos 2: Soporte / Centro de Costos 3: Desarrollo. Regla de Distribución X: Empleados. OEC Computers distribuye su gasto de catering en función del número de empleados de cada departamento. Este mes, algunos consultores de soporte fueron trasladados al equipo de desarrollo para ayudar en tareas de pruebas. La dirección quiere asegurarse de que los costos se reflejen correctamente en los distintos centros de costos mediante un asiento contable de ajuste de costos al cierre del mes.

---

## Diapositiva 4

Asiento Contable para Ajuste de Contabilidad de Costos. Se accede a la ventana Asiento Contable para Ajuste de Contabilidad de Costos mediante: el menú de búsqueda de SAP Business One, el botón Ajuste de Contabilidad de Costos en el Informe de Distribución, la ventana Reglas de Distribución, la ventana Tabla de Centros de Costos y Reglas de Distribución, o bien agregando un asiento contable de ajuste de costos a un nuevo comprobante de diario para revisarlo antes de publicarlo. En todas estas opciones se contabilizará un asiento contable dedicado con una serie de numeración predeterminada para ajustes de contabilidad de costos.

---

## Diapositiva 5

Ajuste de Contabilidad de Costos a través de Informes. Veamos la opción del Informe de Distribución. Tras emitir el informe, selecciona la fila de la regla de distribución para la que deseas emitir el asiento de ajuste (en nuestro ejemplo, "Desarrollo") y elige el botón Ajuste de Contabilidad de Costos en la parte inferior de la pantalla. Tabla del Informe de Distribución: Centros de Costos (Desarrollo, Soporte, Ventas, Centro Z) con sus totales por regla de distribución (Área: 4800/2400/0/0; N.º de empleados: 750/500/1000/250). Total general: 16.370.

---

## Diapositiva 6

Asiento Contable para Ajuste de Contabilidad de Costos: Regla de Distribución / Debe / Haber / Cuenta G/L. Ejemplo: Desarrollo* → 200 (debe) / Cuenta de Ajuste de Contabilidad de Costos. Soporte* → 200 (haber) / Cuenta de Ajuste de Contabilidad de Costos. (* Regla de distribución de asignación directa.) El asiento contable dedicado para ajustes de costos incluye: una serie de numeración predeterminada y una cuenta G/L predeterminada. En cada fila, se elige la regla de distribución de asignación directa de cada centro de costos. Al publicar el asiento de ajuste desde un informe (como en nuestro ejemplo), la primera fila del asiento incluye automáticamente la regla de distribución seleccionada en el informe: la regla de asignación directa de "Desarrollo" en este ejemplo. Ingresa el importe a transferir. En nuestro ejemplo, se reduce el importe de gastos del centro de costos de soporte y se aumenta el del centro de costos de desarrollo. En la segunda fila, elige nuevamente la cuenta predeterminada y la regla de distribución de asignación directa de "Soporte".

---

## Diapositiva 7

Configuración para Ajuste de Contabilidad de Costos: para permitir los asientos contables de ajuste de costos, debes definir una serie de asientos contables predeterminada. En la ventana Configuración de Numeración de Documentos, haz doble clic en la fila Asientos Contables y define una nueva serie. Marca la casilla "Solo para Ajuste de Contabilidad de Costos" para esta nueva serie.

---

## Diapositiva 8

Configuración para Ajuste de Contabilidad de Costos: también debes crear una cuenta G/L predeterminada en el Plan de Cuentas. Elige el botón Detalles de la Cuenta y marca la casilla "Solo para Ajuste de Contabilidad de Costos".

---

## Diapositiva 9

Configuración para Ajuste de Contabilidad de Costos: vincula la serie predeterminada y la cuenta G/L que has definido en la ventana Configuración General → pestaña Contabilidad de Costos, en la sección Configuración de Ajuste de Contabilidad de Costos. Tanto la serie predeterminada como la cuenta G/L se usarán exclusivamente en los asientos contables de ajuste de costos.

---

## Diapositiva 10

Resumen. Puntos clave: Los ajustes de contabilidad de costos permiten reasignar costos entre centros de costos cuando sea necesario, garantizando que los costos se reflejen correctamente en los distintos centros. Para emitir un ajuste, usa la ventana Asiento Contable para Ajuste de Contabilidad de Costos. Este asiento contable dedicado usa una serie de numeración predeterminada y una cuenta predeterminada para ajustes de costos. Usa esta cuenta intermedia en ambas filas del asiento contable. Elige la regla de distribución de asignación directa de cada centro de costos para transferir importes entre centros. Configuración necesaria: define una serie de asientos contables predeterminada para ajustes; crea una cuenta G/L predeterminada; vincula la serie y la cuenta G/L en la Configuración General.

---

## Diapositiva 11

Aviso legal SAP — sin cambios respecto al documento original.

---
