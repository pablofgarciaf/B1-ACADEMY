# Transcripción por Diapositiva: 10_MRP_12_ConsumeForecast

## Diapositiva 1

Planificación de Necesidades de Material: Consumo de Previsión — SAP Business One Versión 10.0. Bienvenido al tema sobre el Consumo de Previsión en MRP.

---

## Diapositiva 2

Objetivos. Al finalizar este tema, podrás: Describir el concepto de previsión y consumo de previsión. Configurar el consumo de previsión a nivel de empresa. Explicar los dos métodos de consumo de previsión disponibles en SAP Business One.

---

## Diapositiva 3

Escenario de Negocio. OEC Computers planifica su producción con varios meses de antelación utilizando previsiones de demanda. Sin embargo, cuando llegan los pedidos reales de los clientes, es necesario reducir las cantidades planificadas para evitar la sobreproducción. El responsable de planificación quiere configurar el sistema para que los pedidos de ventas reales consuman automáticamente las cantidades previstas durante la ejecución del MRP.

---

## Diapositiva 4

Concepto de Previsión. Una previsión en SAP Business One es una estimación de la demanda futura para un artículo. Las previsiones se introducen mediante el documento de Previsión (Inventario → Transacciones de Inventario → Previsión). El MRP utiliza las previsiones como fuente de demanda planificada cuando no existen pedidos de ventas reales para un período determinado.

---

## Diapositiva 5

Concepto de Consumo de Previsión. El Consumo de Previsión es el proceso mediante el cual los pedidos de ventas reales reducen (consumen) las cantidades de previsión existentes. Sin consumo de previsión, el MRP contabilizaría tanto la demanda de previsión como la demanda de pedidos reales, resultando en una sobreplanificación. El consumo de previsión evita la doble contabilización de la demanda.

---

## Diapositiva 6

Configuración a Nivel de Empresa. Administración → Configuración General → pestaña Inventario → sección Planificación. En esta sección se activa el consumo de previsión y se selecciona el método a utilizar. La configuración es global para toda la empresa y afecta a todas las ejecuciones de MRP.

---

## Diapositiva 7

Método 1: Hacia Atrás-Adelante (Minimiza Inventario). Con el método Hacia Atrás-Adelante, cuando llega un pedido de ventas real, el sistema primero busca previsiones en períodos anteriores (hacia atrás) y luego en períodos posteriores (hacia adelante) para consumirlas. Este método minimiza el inventario en proceso porque asume que la demanda real satisface previsiones ya pasadas. Es adecuado para empresas que prefieren mantener niveles de inventario bajos.

---

## Diapositiva 8

Método 2: Adelante-Atrás (Minimiza Riesgo de Demanda Insatisfecha). Con el método Adelante-Atrás, cuando llega un pedido de ventas real, el sistema primero busca previsiones en períodos futuros (hacia adelante) y luego en períodos anteriores (hacia atrás). Este método minimiza el riesgo de demanda insatisfecha porque preserva las previsiones pasadas como "buffer". Es adecuado para empresas que priorizan el nivel de servicio al cliente.

---

## Diapositiva 9

Escenario de Ejemplo — Semana 1. Previsión semana 1: 100 unidades. Previsión semana 2: 80 unidades. Previsión semana 3: 120 unidades. Pedido de ventas real recibido en semana 2: 90 unidades. Con método Hacia Atrás-Adelante: se consumen 80 unidades de semana 2 y 10 unidades de semana 1. Con método Adelante-Atrás: se consumen 80 unidades de semana 2 y 10 unidades de semana 3.

---

## Diapositiva 10

Escenario de Ejemplo — Semana 2. Continuación del ejemplo: un segundo pedido de 50 unidades llega en semana 2. Método Hacia Atrás-Adelante: quedan 90 unidades en semana 1 (100-10), se consumen 50 de semana 1. Quedan 40 en semana 1. Método Adelante-Atrás: quedan 110 unidades en semana 3 (120-10), se consumen 50 de semana 3. Quedan 60 en semana 3. Cada método produce un resultado diferente en la planificación del MRP.

---

## Diapositiva 11

Escenario de Ejemplo — Semana 3. Con ambos métodos, el MRP para cada semana considera la demanda neta (previsión restante después del consumo) más los pedidos de ventas abiertos no cubiertos por previsiones consumidas. El resultado es que el MRP genera recomendaciones ajustadas a la demanda real, evitando exceso de inventario o faltantes.

---

## Diapositiva 12

Acuerdos Marco y Consumo de Previsión. Los Acuerdos Marco de Ventas también pueden consumir previsiones en el MRP. Un acuerdo marco es un compromiso del cliente de comprar una cantidad determinada en un período. SAP Business One puede configurarse para que los acuerdos marco activos se consideren como demanda real y consuman las previsiones correspondientes, de forma similar a los pedidos de ventas.

---

## Diapositiva 13

Ventana de Criterios de Ejecución del MRP. Al ejecutar el MRP (MRP → Asistente de Ejecución de MRP), en los criterios de selección se puede configurar: Considerar Previsiones (Sí/No), Considerar Acuerdos Marco (Sí/No). Estas opciones permiten incluir o excluir las fuentes de demanda prevista en cada ejecución de MRP, dando flexibilidad al planificador.

---

## Diapositiva 14

Visualización del Consumo en el Informe de MRP. El Informe de Recomendaciones del MRP muestra las cantidades de previsión originales, las cantidades consumidas por pedidos reales y la demanda neta restante. Esta visibilidad permite al planificador verificar que el consumo de previsión funciona correctamente y entender la composición de cada recomendación de aprovisionamiento.

---

## Diapositiva 15

Período de Consumo hacia Atrás y hacia Adelante. En la configuración de consumo de previsión también se pueden definir los períodos máximos de búsqueda hacia atrás y hacia adelante. Por ejemplo: buscar hacia atrás hasta 2 semanas y hacia adelante hasta 4 semanas. Esto limita el alcance del consumo y evita que pedidos de ventas consuman previsiones demasiado distantes en el tiempo.

---

## Diapositiva 16

Integración con el Proceso de Planificación. El consumo de previsión es una herramienta clave en la estrategia Make-to-Stock (fabricar para stock). Permite a las empresas comenzar la producción basándose en previsiones y luego ajustar automáticamente el plan cuando llegan los pedidos reales. El resultado es un proceso de planificación más preciso que reduce tanto el exceso de inventario como los faltantes.

---

## Diapositiva 17

Ejemplo Práctico: OEC Computers. OEC Computers tiene previsiones de 500 laptops para el mes siguiente. En los primeros 10 días del mes reciben pedidos reales por 350 laptops. Con el consumo de previsión activado (método Adelante-Atrás), el MRP reconoce que los 350 pedidos reales ya cubren parte de la previsión de 500. El MRP solo generará recomendaciones de producción para las 150 unidades previstas restantes, evitando la fabricación innecesaria de 350 unidades adicionales.

---

## Diapositiva 18

Puntos Clave — Resumen. El Consumo de Previsión evita la doble contabilización de demanda en el MRP. Se configura en Administración → Configuración General → Inventario → Planificación. Método Hacia Atrás-Adelante: minimiza inventario, consume previsiones pasadas primero. Método Adelante-Atrás: minimiza demanda insatisfecha, consume previsiones futuras primero. Los Acuerdos Marco también pueden participar en el consumo de previsiones. Los períodos de consumo pueden limitarse para evitar consumos de previsiones muy distantes en el tiempo.

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

Aviso legal SAP — sin cambios respecto al documento original.

---
