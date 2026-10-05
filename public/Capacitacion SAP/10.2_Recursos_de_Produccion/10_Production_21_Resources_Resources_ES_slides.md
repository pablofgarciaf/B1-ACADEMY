# Transcripción por Diapositiva: 10_Production_21_Resources_Resources_ES

## Diapositiva 1

PUBLIC Producción y MRP: Recursos SAP Business One Versión 10.0 Bienvenido al tema sobre recursos. 1

---

## Diapositiva 2

Al finalizar este tema, podrá:  Explicar qué son los tres tipos de recurso  Crear Datos maestros de recurso  Utilizar recursos en las listas de materiales y en el proceso de producción  Definir la unidad de medida del recurso y explicar el cálculo de tiempo de ejecución Tenga en cuenta que para estudiar este tema hay que estar familiarizado con el concepto del proceso de producción. 2 INTERNAL Al finalizar este tema, podrá: Explicar qué son los tres tipos de recurso Crear Datos maestros de recurso Utilizar recursos en las listas de materiales y en el proceso de producción Definir la unidad de medida del recurso y explicar el cálculo de tiempo de ejecución Objetivos

---

## Diapositiva 3

En este ejemplo, nos fijamos en la empresa OC WoodTrend que fabrica ventanas y puertas de madera personalizadas basándose en las especificaciones del cliente. Para fabricar dichos productos, OC WoodTrend define a sus empleados y maquinaria como recursos en el sistema. De este modo, pueden gestionar su disponibilidad y capacidad para el proceso de producción. 3 INTERNAL OC WoodTrend fabrica ventanas y puertas de madera personalizadas basándose en las especificaciones del cliente. Para fabricar dichos productos, OC WoodTrend ha definido a sus empleados y maquinaria como recursos en el sistema. De este modo, pueden gestionar su disponibilidad y capacidad para el proceso de producción. Escenario empresarial: gestionar y planificar recursos

---

## Diapositiva 4

El recurso se define como datos maestros del sistema. Existen tres clases de recursos:  Tipo maquinaria: Es un recurso relacionado con uno o varios activos fijos que se toman de la lista Datos maestros de activos fijos.  Tipo trabajo: Es un recurso relacionado con uno o varios empleados que se toman de la lista Datos maestros de empleado.  Tipo otros: Cualquier otro recurso distinto de la máquina y el trabajo. 4 4 INTERNAL Concepto de recurso (1/2) Tipo de salario Tipo de máquina Empleados Activos fijos Tres tipos de recursos: Otro tipo

---

## Diapositiva 5

Al igual que sucede con los artículos, los recursos se pueden utilizar en la lista de materiales y los documentos de marketing. Cuando se crea una lista de materiales, suele necesitarse un recurso de máquina para el proceso de producción y también puede hacer falta un recurso de empleado, por ejemplo, para manejar la máquina. Al igual que sucede con los artículos, los recursos se pueden pedir/comprar/vender o realizar otra acción en los documentos de marketing. Para ello, en primer lugar, es necesario conectar un artículo sin inventario al recurso. Esta posición, que representa un recurso, se utiliza en un documento de marketing. A diferencia de los artículos, los recursos no se acumulan en cantidades. Se gestionan por capacidad. Con SAP Business One podemos planificar y definir una capacidad diaria para los recursos. Supervisar dicha capacidad nos permite optimizar el plan de producción y evitar que se produzcan cuellos de botella. 5 5 INTERNAL Concepto de recurso (2/2) Gestionar la capacidad de recursos Los recursos se utilizan en: Lista de materiales Documentos de marketing Recurso Artículo Artículo Los recursos están representados en el documento mediante posiciones sin inventario que están conectados a recursos.

---

## Diapositiva 6

6 INTERNAL Elementos de datos maestros del recurso principal tratados en esta formación  Tipos de recursos  Grupos de recursos y definición de coste estándar  Unidad de medida de recurso y cálculo de tiempo de ejecución Recursos > Datos maestros del recurso Esta es una imagen de los datos maestros de recurso. Aquí puede definir datos importantes, tales como el grupo y el tipo de recurso, la unidad de medida del recurso y la capacidad de recurso. En este tema trataremos estos tres aspectos:  Tipos de recursos  Grupos de recursos  Unidad de medida del recurso y cálculo de tiempo de ejecución La gestión de capacidades de recurso se trata en el tema del curso Capacidad de recursos. 6

---

## Diapositiva 7

Comencemos con el tipo de recurso. Puede seleccionar el tipo de recurso correspondiente (máquina/trabajo/otro) en el campo Tipo de recurso de la cabecera la ventana Datos maestros del recurso.  Al seleccionar Maquinaria como tipo de recurso, la ficha Activos fijos se activa en el registro de datos maestros. Es posible seleccionar uno o varios activos fijos para una máquina.  Al seleccionar Trabajo como tipo de recurso, la ficha Empleados se activa (en lugar de la ficha Activos fijos) y puede seleccionar los empleados relacionados con este recurso.  El tipo Otros se utiliza para recursos que no son activos fijos ni empleados. Tenga en cuenta que para trabajar con activos fijos y ver la ficha Activos fijos, primero tendrá que activar dicha opción en la ventana Detalles de la empresa en la vía de acceso al menú Gestión  Inicialización del sistema. 7 7 INTERNAL Tipos de recursos Maquinaria  La ficha Activos fijos está activada.  Es posible vincular uno o varios activos fijos al recurso. Trabajo  La ficha Empleados está activada.  Es posible vincular uno o varios empleados al recurso. Otros  No hay más fichas activadas.

---

## Diapositiva 8

8 INTERNAL Grupos de recursos Gestión > Configuración > Inventario > Grupos de artículos  Los grupos de recursos se utilizan para agrupar máquinas o empleados que tienen tipos de costes similares.  Al seleccionar un grupo de recursos, la lista de costes estándar de recursos se actualiza. Esta lista se predetermina a partir de la ventana Grupos de recursos: Configuración. Cada tipo de recurso puede tener muchos de grupos de recursos. Los grupos de recursos se utilizan para agrupar máquinas, empleados y otros recursos que tienen tipos de costes similares. Los grupos de recursos se definen en la ventana Grupos de recursos: Configuración. Aquí puede definir hasta 10 componentes de coste definidos por el usuario para cada grupo. Se puede proporcionar un nombre significativo a cada componente de coste para un coste relacionado con el recurso. La cifra que se introduce en la columna Coste estándar La columna Costedefine el ratio del importe del gasto de cada componente de coste en un asiento hecho por el recurso. En la imagen de la derecha, podemos ver una definición de grupo Creación de máquina. Este grupo tiene el tipo de recurso Máquina. Se han definido tres componentes de coste estándar de recurso para este grupo: Amortización, Mantenimiento y Gastos generales. La lista de costes estándar por defecto en los datos maestros de recurso se toma de la definición del grupo de recursos. Estos costes se pueden modificar manualmente para cada datos maestros del recurso. En nuestro ejemplo empresarial, OC WoodTrends tiene cinco tornos que usan en la producción. Como sus tipos de costes son similares, se han agrupado en el grupo de recursos Creación de máquina. Es posible definir una cuenta de mayor diferente para cada de coste estándar del recurso, que se usará en el asiento de producción. Para obtener más información acerca del coste de producción, la determinación de cuenta de mayor para la producción y el coste de producción estándar, consulte los siguientes temas del curso. 8

---

## Diapositiva 9

9 INTERNAL Unidad de medida del recurso y tiempo de ejecución  La capacidad del recurso se mide con una unidad de medida determinada.  Las unidades de recurso pueden ser “tiempo” o cualquier otro tipo de unidad.  Las unidades de medida del recurso se convierten en unidades de tiempo utilizando los campos Tiempo por unidades de recurso y Unidades de recurso por período de tiempo.  El tiempo de ejecución por unidad de medida del recurso es igual a: Tiempo por unidades de recurso / Unidades de recurso por período de tiempo • Texto de la unidad de medida = Ciclo • Tiempo por recurso = 00:15:00 = 15 minutos • Unidades de recurso por período de tiempo = 1 La capacidad de un recurso se mide en la unidad de medida del recurso. Esta unidad de medida tiene unidades de tiempo, como horas o minutos, además de otro tipo de unidad, como ciclo, vuelta, etc. Esta unidad de medida se utiliza durante la planificación y consumo de la capacidad en las listas de materiales y en las órdenes de producción, lo que incluye todas las transacciones relacionadas, como la salida para producción. Para traducir el tiempo de consumo de recursos en el proceso de producción, debemos definir el período de tiempo específico que representa el texto de la unidad de medida. El campo Tiempo por unidades de recurso (15 minutos) representa el tiempo necesario para el recurso Unidades por período de tiempo (1 unidad)que se debe consumir durante la producción. El tiempo de ejecución o tiempo de consumo de una sola unidad de recurso es igual al tiempo por unidades de recurso dividido entre las unidades de recurso por período de tiempo. Obtenga más información acerca de la planificación y consumo de la capacidad de recursos en el tema del curso Capacidad de recursos. 9

---

## Diapositiva 10

10 INTERNAL Ejemplo de cálculo de tiempo de ejecución  El recurso Torno normalmente funciona en ciclos de 15 minutos.  La Unidad de medida del recurso es el Ciclo  Para definir el tiempo de ejecución de este recurso en una orden de producción, tenemos que convertir la unidad Ciclo en una unidad de tiempo. Tenemos dos opciones para hacer esto:  Primera opción: • Tiempo por unidades de recurso = 0:15:00 (minutos) • Unidades de recurso por período de tiempo = 1 (1 ciclo en 15 minutos)  Segunda opción: • Tiempo por unidades de recurso = 1:00:00 (hora) • Unidades de recurso por período de tiempo = 4 (4 ciclos en 1 hora)  Resultado En una lista de materiales, hemos definido que hacen falta 3 ciclos para producir 1 producto final. Por lo tanto, el tiempo de ejecución del recurso para la producción de un producto final es de 45 minutos Vamos a analizar este escenario: El recurso de máquina normalmente funciona en ciclos de 15 minutos. El texto de unidad de medida de este recurso es el Ciclo. La capacidad del recurso se mide en ciclos y las cantidades de la lista de materiales también se expresan en Ciclos. En OC WoodTrend, en la en la lista de materiales de una puerta de madera, necesitan 3 ciclosdel torno para fabricar una puerta. Para definir el tiempo de ejecución de esta máquina en una orden de producción concreta, es necesario convertir la unidad de medida Ciclo en tiempo. La fórmula de la conversión entre el texto de la unidad de medida del recurso (Ciclo) y el tiempo es la siguiente: • Cuando Tiempo por unidades de recurso es 15 minutos, las unidades de recurso por período de tiempo equivalen a 1 ciclo. • Cuando Tiempo por unidades de recurso es 1 hora, las unidades de recurso por período de tiempo equivalen a 4 ciclos. Esta parametrización nos permite calcular el tiempo de ejecución de un recurso específico que es necesario para producir la cantidad requerida del producto final. En nuestro caso, son necesarios 3 ciclos de esta máquina para producir 1 puerta. El cálculo de tiempo de ejecución del recurso es: cantidad de la lista de materiales X (Tiempo por unidades de recurso/ Unidades de recurso por período de tiempo). En nuestro ejemplo es 45 minutos. Ahora que OC WoodTrend sabe cómo definir el tiempo de ejecución de los recursos, puede planificar y gestionar la capacidad de estos recursos. La forma de definir y gestionar capacidad de los recursos se describe en el tema del curso Capacidad de recursos. 10

---

## Diapositiva 11

Dado que en una orden de producción se pueden incluir distintos tipos de recursos (maquinaria/trabajo/otros), se aplica un cálculo simplificado de la orden de producción total. El tiempo de ejecución total en una orden de producción es el valor máximo del tiempo de producción de los recursos de la orden de producción. Esta imagen se toma de una orden de producción que contiene dos recursos: un torno y un operario que maneje la máquina. Para producir esta lista de materiales, se necesitan tres ciclos del torno. Puesto que cada ciclo es de 15 minutos, tres ciclos suman 45 minutos. Además, es necesario que el operador trabaje media hora (30 minutos). El tiempo de ejecución total de la orden de producción es igual al tiempo máximo de producción del recurso, que es de 45 minutos. Tenga en cuenta que este escenario es para una orden de producción sin hoja de ruta. Para obtener más información acerca de las órdenes de producción con hoja de ruta, consulte el curso Proceso de producción. 11 11 INTERNAL Tiempo de ejecución en la orden de producción Tiempo de ejecución total de la orden de producción = Máximo valor de los tiempos de ejecución de los recursos de la orden de producción. • El torno funciona durante 3 ciclos de 15 minutos = 45 minutos • El operario que maneja la máquina trabaja media hora = 30 minutos Tiempo total = tiempo de recurso máximo = 45 minutos.

---

## Diapositiva 12

12 INTERNAL Resumen A continuación, se detallan algunos puntos clave:  Existen tres clases de recursos: Trabajo, maquinaria y otros.  El tipo de recurso Maquinaria se puede vincular a un activo fijo en el sistema  El tipo de recurso Trabajo se puede vincular a un empleado en el sistema.  Los recursos se pueden conectar a artículos y, por lo tanto, se pueden representar en los documentos de marketing.  Cada recurso puede tener hasta 10 componentes de coste estándar. Es posible definir costes por defecto en el grupo de recursos.  Los parámetros de tiempo de ejecución deberían definirse en los datos maestros del recurso para planificar la capacidad del recurso.  Estos son algunos puntos clave de esta sesión.  Existen tres clases de recursos: Trabajo, maquinaria y otros.  El tipo de recurso Maquinaria se puede vincular a un activo fijo en el sistema  El tipo de recurso Trabajo se puede vincular a un empleado en el sistema.  Los recursos se pueden conectar a artículos y, por lo tanto, se pueden representar en los documentos de marketing.  Cada recurso puede tener hasta 10 componentes de coste estándar. Es posible definir el coste por defecto en el grupo de recursos.  Los parámetros de tiempo de ejecución deberían definirse en los datos maestros del recurso para planificar la capacidad del recurso. 12

---

