# Transcripción por Diapositiva: 10_Production_11_Overview_Overview_ES

## Diapositiva 1

PUBLIC Producción y MRP: Conceptos del proceso de producción SAP Business One Versión 10.0 Le damos la bienvenida al tema Conceptos del proceso de producción. 1

---

## Diapositiva 2

Al finalizar este tema, podrá: Describir el proceso de producción principal en un nivel alto Explicar el concepto de Lista de materiales. Explicar el concepto de Recurso. 2 PUBLIC Al finalizar este tema, podrá:  Describir el proceso de producción principal en un nivel alto  Explicar el concepto de Lista de materiales  Explicar el concepto de Recurso Objetivos

---

## Diapositiva 3

3 PUBLIC El concepto del proceso de producción en SAP Business One Lista de materiales  Artículos  Recursos:  Maquinaria  Trabajo Proceso de producción  Orden de producción  Enviar a planta producción  Los componentes se extraen del inventario Productos terminados  Informar de la finalización  El producto terminado se añade al inventario Con SAP Business One es posible gestionar los procesos de producción de toda la empresa. Además de los artículos, también podemos definir y gestionar distintos recursos que son necesarios para el proceso de producción, como las horas de uso de la maquinaria y el tiempo de trabajo de los empleados. En el documento Lista de materiales se indican los componentes y recursos necesarios para producir el producto terminado. Después, para empezar el proceso de producción emitimos un documento de Orden de producción, que se basa en la Lista de materiales, y enviamos los componentes del almacén a la planta. Cuando se completa el proceso de producción, el producto terminado se añade al inventario. Tenga en cuenta que este es el principal concepto relativo al proceso de producción de SAP Business One, pero no es el único. 3

---

## Diapositiva 4

El recurso se define como datos maestros del sistema. Existen dos clases de recursos: Tipo maquinaria: Un recurso relacionado con un activo fijo que se toma de la lista Datos maestros de activos fijos. Tipo mano de obra: Un recurso relacionado con un empleado que se toma de la lista Datos maestros empleado. Cuando se crea una lista de materiales, suele necesitarse una máquina para el proceso de producción y también puede hacer falta un empleado, por ejemplo, para manejar la máquina. Con SAP Business One podemos planificar y definir una capacidad diaria para los recursos. Supervisar dicha capacidad nos permite optimizar el plan de producción y evitar que se produzcan cuellos de botella. 4 4 PUBLIC Concepto de Recurso Trabajo Maquinaria Planificar y supervisar la capacidad de los recursos Empleados Activos fijos Hay dos tipos de datos maestros de recurso principales:

---

## Diapositiva 5

5 PUBLIC Ejemplo de lista de materiales = Artículo = Recurso Puerta decorativa de madera Puerta de madera Torno Pomo Operario de la máquina Vamos a explicar el concepto de Lista de materiales con el siguiente ejemplo: Para fabricar una puerta de madera tallada necesitamos dos artículos: una puerta de madera normal y un pomo. Además, tenemos que grabar un dibujo decorativo. Para hacerlo, necesitamos dos recursos: un torno y un operario que maneje la máquina. Esos son los artículos y recursos que forman la lista de materiales para hacer puerta de madera decorativa. En un entorno de producción real, las listas de materiales suelen tener varios niveles. En nuestro ejemplo, el componente de la pieza de madera también puede tener su propia lista de materiales. Tenga en cuenta que los productos terminados también se definen como artículos (datos maestros) en el sistema. Para comenzar el proceso de producción, esta lista de materiales se copia a una orden de producción. 5

---

## Diapositiva 6

6 PUBLIC Orden de producción Orden de producción Orden de producción: Puerta decorativa de madera x 6 Fecha de vencimiento: 31.09.2020 Artículo: Puerta de madera Artículo: Pomo Recurso: Operario de la máquina Recurso: Torno La orden de producción es una orden para producir o reparar un artículo de producción. Una Lista de materiales se copia en el documento Orden de producción (manualmente o mediante un proceso automático). Después, se introduce la cantidad necesaria del producto terminado, junto con la fecha de vencimiento de la producción y otros datos relevantes. En los próximos temas del curso vamos a conocer el proceso de producción en detalle. 6

---

## Diapositiva 7

7 PUBLIC Producción con hoja de ruta Etapa en ruta Componentes Días totales Etapa 1: Corte 2 días Recurso Recurso Artículo Etapa 2: Lija 1 día Recurso Recurso Etapa 3: Pintura 3 días Recurso Recurso Artículo  Una orden de producción con una hoja de ruta contiene varias etapas de ruta  Cada etapa tiene sus propios artículos y recursos y calcula sus propias fechas La lista de materiales se puede definir con una hoja de ruta. Esta lista de materiales contiene diferentes etapas de producción. Cada etapa tiene sus propios artículos y recursos y calcula sus propias fechas. Es posible que se produzca una dependencia entre la etapa del cálculo de fecha, en la que una etapa posterior comienza cuando finaliza la etapa inmediatamente anterior. El cálculo de los días totales por etapa se realiza según la capacidad disponible de recursos en cada etapa individual. Al igual que cualquier otra lista de materiales, una lista de materiales con hoja de ruta se copia en una orden de producción.  Después cada etapa de la orden de producción se podrá emitir, transferir o recibir de producción. Para obtener más información sobre la gestión de capacidades de recursos, consulte el curso: Capacidad de recursos 7

---

## Diapositiva 8

8 PUBLIC Resumen A continuación, se detallan algunos puntos clave:  El proceso de producción empieza creando una orden de producción y enviándola a producción.  La orden de producción se basa en la lista de materiales.  La lista de materiales está formada por artículos y recursos.  Existen dos clases de recursos: mano de obra y maquinaria.  Estos son algunos puntos clave de esta sesión.  El proceso de producción empieza añadiendo una orden de producción y enviándola a producción.  La orden de producción se basa en la lista de materiales.  La lista de materiales está formada por artículos y recursos.  Existen dos clases de recursos: mano de obra y maquinaria. 8

---

