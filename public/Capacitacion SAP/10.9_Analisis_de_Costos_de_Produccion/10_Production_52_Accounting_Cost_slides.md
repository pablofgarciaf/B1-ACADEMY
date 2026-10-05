# Transcripción por Diapositiva: 10_Production_52_Accounting_Cost

## Diapositiva 1

Producción y MRP: Costo Estándar de Producción — SAP Business One Versión 10.0. Bienvenido al tema sobre el Costo Estándar de Producción. Aunque los campos de Costo Estándar de Producción existen tanto para inventario perpetuo como no perpetuo, en este curso solo se trata la funcionalidad para inventario perpetuo. Además, para realizar esta formación primero debes completar los temas de Proceso de Producción y Subproductos y Cantidades Adicionales.

---

## Diapositiva 2

Objetivos. Al finalizar este tema, podrás: Definir un costo estándar de producción para artículos producidos. Explicar el cálculo del costo estándar de producción total en la Lista de Materiales. Describir los procedimientos de Acumulación y Actualización del costo estándar de producción.

---

## Diapositiva 3

Escenario de Negocio. OC WoodTrend fabrica puertas de madera personalizadas. Utilizan el módulo de Producción en SAP Business One para registrar el proceso productivo. Hubo grandes fluctuaciones en el costo de producción de las puertas durante el último año y el contable quiere tener una mejor predicción de costos. OC WoodTrend decide gestionar el Costo Estándar de Producción para analizar y predecir los costos con mayor precisión. Además, quiere configurar las cuentas de costo relevantes para los recursos en la determinación de cuentas G/L.

---

## Diapositiva 4

Concepto. El Costo Estándar de Producción es un costo de producción presupuestado que se puede comparar con el costo de producción real. En los Datos Maestros del Artículo, el Costo Estándar de Producción puede configurarse opcionalmente según el costo de valoración actual y también puede acumularse opcionalmente a través de múltiples niveles de la Lista de Materiales. La ventana de Lista de Materiales muestra los datos de Costo Estándar de Producción para los componentes de artículo, los datos de costo para los componentes de recurso y los datos de Costo Estándar de Producción para el artículo producido. Beneficio: facilita las comparaciones de costo presupuestado vs. real y los cálculos de varianza de producción.

---

## Diapositiva 5

Definición del Costo Estándar del Recurso. Determinación de Cuentas G/L (estándar) → Grupo de Recursos → Datos Maestros del Recurso → Nombre del Costo Estándar y Ratio de Costo Predeterminado. Cada cuenta de gasto del recurso está relacionada con un Costo Estándar del recurso. El costo estándar de un recurso es la suma de todos los elementos de costo estándar y también es el costo real del recurso. El costo de un recurso es en realidad el costo estándar definido en los Datos Maestros del Recurso. Este costo está compuesto por una lista de diferentes elementos de costo estándar que se copian del Grupo de Recursos. Para la taladradora, el costo estándar se compone de 3 elementos: amortización, mantenimiento y gastos generales. Cada elemento de costo está relacionado con una cuenta determinada en la ventana de Determinación de Cuentas G/L (cuando se usa la determinación de cuentas G/L estándar). Allí se pueden definir hasta diez cuentas de gasto de recurso, correspondientes a los diez componentes de costo en los Datos Maestros del Recurso.

---

## Diapositiva 6

Definición del Costo Estándar del Artículo. El Costo Estándar de Producción de un artículo se puede introducir manualmente o se puede rellenar durante el procedimiento de Acumulación del Costo Estándar de Producción. El valor del Costo Estándar de Producción también puede copiarse de forma masiva desde el costo real del producto del artículo (incluyendo artículos componentes). Esto se realiza en el procedimiento de Acumulación. Existe una casilla que indica si el artículo está incluido en la Acumulación del Costo Estándar de Producción.

---

## Diapositiva 7

Cálculo del Costo Estándar de Producción en la Lista de Materiales. Costo Estándar de Producción × Cantidad + Costo Estándar de Producción × Cantidad Adicional / Tamaño Promedio Planificado de Producción = Costo Estándar de Producción Total. En la Lista de Materiales se puede ver el Costo Estándar de Producción tomado de los Datos Maestros del Artículo. Debajo de este campo hay otro llamado Tamaño Promedio Planificado de Producción. Aquí se introduce la cantidad promedio de artículos producidos que se fabrican normalmente en una corrida de producción. En el ejemplo, si se producen en promedio 10 Puertas de Madera Decorativas por corrida, el costo fijo de la Cantidad Adicional necesaria para producir 1 puerta es 30 dividido entre 10, multiplicado por 1 Cantidad Adicional = 3. Por lo tanto, el Costo Estándar de Producción Total del recurso Operario de Máquina es 30 × 2 horas + 3 = 63.

---

## Diapositiva 8

Acumulación del Costo Estándar de Producción. Producción → Gestión del Costo Estándar de Producción → Acumulación del Costo Estándar de Producción → Inventario → Datos Maestros del Artículo → pestaña Producción. Esta función es relevante para los artículos producidos que están marcados como incluidos en el procedimiento de acumulación. En la ventana de Acumulación se puede elegir qué artículos actualizar. Una vez se elige Aceptar, el Costo Estándar de Producción en los Datos Maestros del Artículo se actualiza según el Costo Estándar de Producción calculado en la Lista de Materiales. Nota: el procedimiento de acumulación se calcula para todos los niveles de la Lista de Materiales.

---

## Diapositiva 9

Actualización del Costo Estándar de Producción. Producción → Gestión del Costo Estándar de Producción → Actualización del Costo Estándar de Producción. Esta función es relevante para todos los artículos. Se recomienda primero realizar una Actualización del Costo Estándar de Producción y luego el procedimiento de Acumulación. La Actualización del Costo Estándar de Producción actualiza el Costo Estándar de Producción de los artículos según su costo real. Este procedimiento funciona de manera similar al procedimiento de acumulación. En la ventana de Actualización, se eligen los artículos relevantes y se pulsa el botón Aceptar. La actualización se realiza de forma instantánea. Nota: en la ventana de Criterios de Selección se puede elegir cualquier artículo, incluso si no es un artículo producido ni un componente. Nota: esta función no se aplica a empresas con inventario no perpetuo.

---

## Diapositiva 10

Puntos Clave. Puntos clave de este tema: La función de Costo Estándar de Producción permite planificar un presupuesto para el costo de producción. El Costo Estándar de Producción puede introducirse manualmente o copiarse mediante el procedimiento de acumulación. El procedimiento de Acumulación actualiza el Costo Estándar de Producción en los Datos Maestros del Artículo de los artículos producidos según el Costo Estándar calculado en la Lista de Materiales. En la ventana de Actualización del Costo Estándar de Producción se puede actualizar el Costo Estándar según el costo real de los artículos. Esta función es relevante para todos los artículos.

---

## Diapositiva 11

Aviso legal SAP — sin cambios respecto al documento original.

---
