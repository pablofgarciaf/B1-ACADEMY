# Transcripción por Diapositiva: 10_MRP_13_MRP_BOM

## Diapositiva 1

Planificación de Necesidades de Material: MRP para Listas de Materiales — SAP Business One Versión 10.0. Bienvenido al tema sobre el uso del MRP con Listas de Materiales.

---

## Diapositiva 2

Objetivos. Al finalizar este tema, podrás: Ejecutar el MRP para artículos con Lista de Materiales (LM). Entender el concepto de Tiempo de Aprovisionamiento Acumulado. Configurar opciones para excluir almacenes y manejar LM de Ventas y Ensamble en el MRP.

---

## Diapositiva 3

Escenario de Negocio. OEC Computers fabrica servidores compuestos por múltiples componentes (PC, teclado, monitor, memoria, etc.). El responsable de planificación quiere utilizar el MRP para generar automáticamente las recomendaciones de producción para el servidor terminado y las recomendaciones de compra para todos sus componentes, respetando los tiempos de entrega de cada nivel de la Lista de Materiales.

---

## Diapositiva 4

Lista de Materiales de Ejemplo — Servidor OEC. Lista de Materiales del Servidor OEC (artículo producido): Componente 1: Carcasa (comprada, plazo 3 días). Componente 2: Placa Base (comprada, plazo 5 días). Componente 3: Procesador (comprado, plazo 7 días). Componente 4: Memoria RAM (comprada, plazo 2 días). Componente 5: Disco Duro (comprado, plazo 4 días). Componente 6: Fuente de Alimentación (comprada, plazo 3 días). El servidor tiene un plazo de producción propio de 2 días.

---

## Diapositiva 5

Cómo el MRP Procesa una Lista de Materiales. Cuando el MRP encuentra una demanda para el artículo producido (Servidor), genera: Una recomendación de Orden de Producción para el servidor. Recomendaciones de Pedido de Compra o Solicitud de Compra para cada componente. Las recomendaciones de componentes se calculan considerando el plazo del nivel superior (servidor) más el plazo propio de cada componente.

---

## Diapositiva 6

Tipos de Recomendaciones del MRP. Según la configuración de cada artículo en los Datos Maestros, el MRP puede recomendar: Órdenes de Producción: para artículos fabricados internamente. Solicitudes/Pedidos de Compra: para artículos comprados a proveedores. Solicitudes de Transferencia de Inventario: para artículos que se trasladan entre almacenes. El tipo de recomendación depende del campo Método de Aprovisionamiento en el Datos Maestros del Artículo.

---

## Diapositiva 7

Tiempo de Aprovisionamiento Acumulado. El Tiempo de Aprovisionamiento Acumulado es la suma de todos los tiempos de entrega a lo largo de los niveles de la Lista de Materiales. Ejemplo: Para fabricar el Servidor el 10 de enero, necesito: Iniciar la producción del servidor el 8 de enero (plazo 2 días). Tener el Procesador disponible el 8 de enero, lo que significa pedirlo el 1 de enero (plazo 7 días). El tiempo acumulado total sería 9 días (7 días de componente + 2 días de producción).

---

## Diapositiva 8

Visualización del Tiempo de Aprovisionamiento Acumulado. En el Informe de Recomendaciones del MRP se puede ver el Tiempo de Aprovisionamiento Acumulado para cada artículo. Esta información ayuda al planificador a entender cuánto tiempo antes de la fecha de entrega al cliente debe iniciarse el proceso de aprovisionamiento. Es especialmente importante para productos con LM de varios niveles y componentes con plazos largos.

---

## Diapositiva 9

Ignorar el Tiempo de Aprovisionamiento Acumulado. En los criterios de ejecución del MRP existe la opción de Ignorar el Tiempo de Aprovisionamiento Acumulado. Cuando esta opción está activa, el MRP programa todos los componentes para el mismo día que el artículo producido, sin considerar los plazos en cascada. Esta opción puede ser útil en escenarios específicos donde el stock de componentes ya está disponible o se gestiona independientemente.

---

## Diapositiva 10

Excluir Almacenes del MRP. En los criterios del MRP es posible excluir almacenes específicos del cálculo. Efecto: el stock disponible en los almacenes excluidos no se considera en el MRP, lo que puede generar más recomendaciones de aprovisionamiento. Caso de uso: almacenes de cuarentena, almacenes de devoluciones o almacenes que no están disponibles para la producción principal.

---

## Diapositiva 11

Efecto de Excluir Almacenes — Ejemplo. Sin exclusión: Stock total disponible = 50 unidades (30 en almacén principal + 20 en almacén de cuarentena). MRP no genera recomendación para los próximos 50 unidades de demanda. Con exclusión del almacén de cuarentena: Stock considerado = 30 unidades. MRP genera una recomendación para 20 unidades (50 demanda − 30 stock disponible).

---

## Diapositiva 12

MRP para Lista de Materiales de Ventas. Una LM de Ventas (Sales BOM) es una lista de materiales utilizada en el proceso de ventas para vender un conjunto de artículos como un paquete. A diferencia de la LM de Producción, los componentes de una LM de Ventas se entregan directamente al cliente. El MRP puede considerar las LM de Ventas y generar recomendaciones de compra para los componentes individuales cuando existe una demanda para el artículo padre de ventas.

---

## Diapositiva 13

MRP para Lista de Materiales de Ensamble. Una LM de Ensamble (Assembly BOM) define artículos que se ensamblan en el momento de la venta, sin una Orden de Producción formal. En el MRP, cuando existe demanda para el artículo de ensamble, el sistema puede generar recomendaciones para los componentes directamente, ya que no hay una orden de producción intermedia. Esto permite planificar el aprovisionamiento de componentes de ensamble con la misma eficiencia que los artículos producidos formalmente.

---

## Diapositiva 14

Recomendaciones Teóricas en el MRP. Las Recomendaciones Teóricas son sugerencias del MRP basadas en datos futuros proyectados (previsiones, pedidos de ventas futuros) que aún no han sido confirmados. En el Informe de Recomendaciones del MRP, las recomendaciones teóricas se distinguen de las recomendaciones firmes. El planificador puede revisar las recomendaciones teóricas y decidir si convertirlas en documentos reales o descartarlas.

---

## Diapositiva 15

Convertir Recomendaciones en Documentos. Desde el Informe de Recomendaciones del MRP, el planificador puede seleccionar las recomendaciones y crear directamente: Órdenes de Producción (para artículos producidos). Pedidos de Compra o Solicitudes de Compra (para artículos comprados). Solicitudes de Transferencia de Inventario (para traslados entre almacenes). Esto permite pasar eficientemente del plan a la ejecución sin necesidad de crear los documentos manualmente uno por uno.

---

## Diapositiva 16

Gestión de Múltiples Niveles de LM. Cuando la LM tiene múltiples niveles (sub-ensambles que a su vez tienen componentes), el MRP los procesa todos en cascada. Nivel 0: Servidor (artículo terminado). Nivel 1: Sub-ensamble de Placa Base (componentes de la placa). Nivel 2: Componentes individuales (condensadores, chips, etc.). El MRP genera recomendaciones para todos los niveles respetando sus plazos individuales.

---

## Diapositiva 17

Configuración del Horizonte de Planificación. El MRP se ejecuta dentro de un horizonte de planificación definido por el usuario. Período demasiado corto: no se detectan necesidades futuras importantes. Período demasiado largo: se generan demasiadas recomendaciones con incertidumbre alta. La configuración del horizonte debe equilibrar la visibilidad necesaria con la precisión de los datos de demanda disponibles.

---

## Diapositiva 18

Flujo Completo del MRP con LM. Resumen del proceso: 1) Demanda: Pedido de ventas o previsión para el artículo terminado. 2) Ejecución MRP: el sistema explota la LM y calcula necesidades netas. 3) Recomendaciones: Órdenes de Producción para artículos fabricados, Pedidos de Compra para componentes. 4) Confirmación: el planificador revisa y aprueba las recomendaciones. 5) Ejecución: los documentos aprobados se crean y el proceso de producción/compra comienza.

---

## Diapositiva 19

![Diapositiva 19](Imagenes_Diapositivas/slide_019.webp)

---

## Diapositiva 20

![Diapositiva 20](Imagenes_Diapositivas/slide_020.webp)

---

## Diapositiva 21

![Diapositiva 21](Imagenes_Diapositivas/slide_021.webp)

---

## Diapositiva 22

![Diapositiva 22](Imagenes_Diapositivas/slide_022.webp)

---

## Diapositiva 23

![Diapositiva 23](Imagenes_Diapositivas/slide_023.webp)

---

## Diapositiva 24

![Diapositiva 24](Imagenes_Diapositivas/slide_024.webp)

---

## Diapositiva 25

![Diapositiva 25](Imagenes_Diapositivas/slide_025.webp)

---

## Diapositiva 26

![Diapositiva 26](Imagenes_Diapositivas/slide_026.webp)

---

## Diapositiva 27

Puntos Clave — Resumen. El MRP explosiona automáticamente las Listas de Materiales para generar recomendaciones en todos los niveles. El Tiempo de Aprovisionamiento Acumulado asegura que los componentes se pidan con suficiente antelación. Es posible excluir almacenes del cálculo del MRP para reflejar la disponibilidad real. Las LM de Ventas y Ensamble también se pueden procesar en el MRP. Las recomendaciones del MRP se pueden convertir directamente en Órdenes de Producción y Pedidos de Compra.

---

## Diapositiva 28

Aviso legal SAP — sin cambios respecto al documento original.

---
