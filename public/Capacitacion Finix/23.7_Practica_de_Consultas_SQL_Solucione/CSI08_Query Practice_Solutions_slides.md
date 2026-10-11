# Transcripción por Diapositiva: CSI08_Query Practice_Solutions

## Diapositiva 1

Solución al Caso Práctico: Práctica de Consultas (Query Practice) SAP Business One 10.0, versión para SAP HANA - PÚBLICO

---

## Diapositiva 2

PRÁCTICA: SOLUCIONES PARA LAS CONSULTAS - PÚBLICO 2 
INTRODUCCIÓN 
Estos ejercicios prácticos están diseñados para brindarle experiencia práctica en la creación de consultas SQL básicas para SAP HANA utilizando las herramientas de consulta integradas en SAP Business One. 
Creará las siguientes consultas: 
1. Un informe que muestra una lista de clientes. 
2. Un informe que utiliza un parámetro como criterio de selección. 
3. Un informe basado en múltiples tablas. 
4. Un informe con un total acumulado que puede usarse con una alerta para proporcionar una lista de trabajo a un usuario. 
5. Una consulta utilizada en un widget de panel de control (dashboard). 

REQUISITO PREVIO: 
1. Utilice la base de datos de demostración para SAP Business One 10.0, versión para SAP HANA. 
2. Credenciales: Código de usuario: manager. 
Utilice cualquiera de las herramientas de consulta de SAP Business One: Generador de Consultas o Asistente de Consultas. 
Nota: las soluciones se muestran solo para el Generador de Consultas. Todas las consultas mostradas aquí utilizan la sintaxis SQL de HANA. 
Nota importante: Los informes incluidos en este caso práctico muestran datos de la base de datos de localización del Reino Unido. Obviamente, los datos que verá serán diferentes dependiendo de su localización y de la fecha en que ejecute las consultas.

---

## Diapositiva 3

SOLUCIÓN PRÁCTICA: CONSULTAS - PÚBLICO 3 
Tarea 1: Crear un Informe de Lista de Clientes 
Este informe muestra una lista de clientes y saldos de la tabla de Interlocutores Comerciales OCRD. 

Crear la consulta: 
Elija Herramientas → Consultas → Generador de Consultas. Escriba OCRD en el campo resaltado en la parte superior izquierda de la ventana, luego presione Tab. Seleccione campos para el informe haciendo doble clic en la lista: 
• CardCode 
• CardName 
• Address 
• City (Ciudad de facturación) 
• ZipCode 
• Balance 
• CntctPrsn 
Nota: Al usar una base de datos HANA, los nombres de los campos con mayúsculas y minúsculas deben estar entre comillas dobles en la consulta. 
Consejo: Ordenar los Campos 
Para que sea más fácil seleccionar campos, puede ordenar la lista de campos alfabéticamente haciendo doble clic en el encabezado de la columna Nombre. 

Agregar una condición a la consulta:
Dado que la tabla OCRD también contiene registros para clientes potenciales y proveedores, debe agregar un filtro para los registros maestros de clientes: 
• Haga clic en el área Dónde (Where) a la derecha. 
• Haga doble clic para seleccionar el campo CardType. 
• Escriba = 'C' para completar la cláusula Dónde (use el carácter de comilla simple). 
La cláusula Dónde debería leerse ahora: T0."CardType" = 'C'

---

## Diapositiva 4

SOLUCIÓN PRÁCTICA: CONSULTAS - PÚBLICO 4 
Elija Ejecutar. 

Ajuste Fino de los Resultados:
• Puede ordenar los resultados según cualquier columna haciendo doble clic en el campo de encabezado de la columna. Opcionalmente, puede agregar una ordenación a la consulta ingresando un campo en el área Ordenar por de la ventana del Generador de Consultas. 
• Para incluir un total de los saldos de las cuentas, presione Ctrl y haga clic en el campo de encabezado de la columna Saldo de Cuenta. El total aparecerá en la parte inferior de la columna, como se muestra a continuación.

---

## Diapositiva 5

SOLUCIÓN PRÁCTICA: CONSULTAS - PÚBLICO 5 
Guardar la consulta para reutilizar: 
En la ventana de Vista Previa de Consulta, elija Guardar. En la ventana Guardar Consulta, elija Tratar Categorías. Ingrese una nueva categoría llamada Ventas (Sales). Elija Añadir/Actualizar.

---

## Diapositiva 6

SOLUCIÓN PRÁCTICA: CONSULTAS - PÚBLICO 6 
Seleccione la categoría Ventas recién creada y elija el botón Asignar Grupo para asignar la categoría al grupo de autorización Consultas Guardadas – Grupo N° 1. Elija Actualizar y luego OK.

---

## Diapositiva 7

SOLUCIÓN PRÁCTICA: CONSULTAS - PÚBLICO 7 
De vuelta en la ventana Guardar Consulta, seleccione la categoría Ventas. Ingrese Informe de Saldo de Clientes en el campo Nombre de Consulta. Después elija Guardar. 

Ejecutar la consulta guardada:
Elija Herramientas → Consultas → Consultas de Usuario → Ventas → Informe de Saldo de Clientes.

---

## Diapositiva 8

SOLUCIÓN PRÁCTICA: CONSULTAS - PÚBLICO 8 
Tarea 2: Crear un Informe con un Parámetro 
Este informe muestra una lista de facturas de clientes contabilizadas después de cierta fecha. La fecha se ingresa como un parámetro cuando se ejecuta la consulta. El informe utiliza la tabla de facturas OINV. 

Buscar Nombres de Campos:
Para averiguar los nombres de los campos para el informe, utilice la información del sistema: 
▪ Abra un documento en blanco de factura de deudores y active Vista > Información del Sistema. 
▪ Pase el cursor sobre los siguientes campos y escriba el nombre del campo de la base de datos que se muestra en el área de información del sistema: 
Nombre en el Documento -> Nombre del Campo en la Base de Datos 
N° -> DocNum
Nombre de Cliente -> CardName
Fecha de Contabilización -> DocDate
Total -> DocTotal 
Nota: Cuando pasa el cursor sobre el campo Total, el nombre del campo no se muestra en la información del sistema. Esto se debe a que este campo contiene el símbolo de la moneda además de la cantidad. El nombre del campo en la base de datos es DocTotal. 

Crear la Consulta:
En la ventana del Generador de Consultas, elija el botón X para limpiar la selección de la tabla anterior. Si cerró la ventana del Generador de Consultas, vuelva a abrirla usando la ruta Herramientas → Consultas → Generador de Consultas. Escriba OINV en el campo Tabla y presione Tab. Seleccione los campos de la tabla OINV que identificó utilizando la información del sistema. 
En la cláusula Dónde (Where), agregue un filtro para documentos abiertos (DocStatus = 'O'). La cláusula Dónde debe leerse: 
T0."DocStatus" = 'O' 
En la cláusula Dónde, escriba la palabra 'and' y seleccione el campo fecha de documento (DocDate). Luego presione el botón Condiciones para abrir la ventana lateral: 
• Haga doble clic en la condición 'Mayor que' (Greater than)
• Haga doble clic en la primera variable [%0].

---

## Diapositiva 9

SOLUCIÓN PRÁCTICA: CONSULTAS - PÚBLICO 9 
La cláusula Dónde debería leerse ahora: T0."DocStatus" = 'O' and T0."Docdate" > [%0] 

Ejecutar la Consulta:
Elija Ejecutar. Aparecerá una ventana emergente. Elija el icono de la lista de selección en la ventana emergente, luego seleccione una fecha de la lista de resultados. Nota: si está utilizando la base de datos de demostración, las facturas que verá pueden ser muy antiguas, a menos que haya agregado facturas recientemente. 
Elija OK para ejecutar la consulta. El sistema muestra el resultado. Note las flechas naranjas de desglose que dirigen a los datos maestros del cliente. Para mostrar el total de las facturas, presione Ctrl y haga doble clic en el encabezado de la columna Total del Documento.

---

## Diapositiva 10

SOLUCIÓN PRÁCTICA: CONSULTAS - PÚBLICO 10 
Guarde esta consulta con el nombre Lista de Facturas en la categoría Ventas.

---

## Diapositiva 11

SOLUCIÓN PRÁCTICA: CONSULTAS - PÚBLICO 11 
Tarea 3: Crear un Informe desde Múltiples Tablas 
Esta consulta mostrará una lista de ofertas de ventas abiertas resumidas por cliente y agrupadas por empleado de ventas. La consulta utilizará dos tablas: 
▪ Oferta de Ventas (OQUT) 
▪ Tabla de Empleados de Ventas (OSLP) 
La unión interna (inner join) será proporcionada automáticamente por la herramienta de consulta. 

Crear la consulta:
Limpie la tabla anterior de la ventana de consulta. Ingrese cada nombre de tabla en el cuadro superior izquierdo y presione Tab cada vez. Note que la unión interna se realiza automáticamente en la ventana del generador de consultas. 
Seleccione la tabla OSLP y luego seleccione el campo SlpName. Seleccione la tabla OQUT y luego seleccione los campos CardCode y CardName. 
Calcule el valor total de las ofertas de ventas utilizando la función SUM y proporcione un encabezado en el informe: 
SUM(T0."DocTotal") as "Valor Total" 
Cuente el número de ofertas de ventas para cada cliente utilizando la función COUNT y proporcione un encabezado: 
COUNT(T0."DocNum") as "Nro de Documentos" 
Importante: Asegúrese de no olvidar el paréntesis de cierre para las funciones SUM y COUNT.

---

## Diapositiva 12

SOLUCIÓN PRÁCTICA: CONSULTAS - PÚBLICO 12 
Ingrese la siguiente condición en la cláusula Dónde (Where) para que solo se utilicen ofertas abiertas: 
T0."DocStatus" = 'O' 
Haga clic en el área Ordenar por y seleccione el campo SlpName. 
Haga clic en el área Agrupar por y seleccione los campos SlpName, CardCode y CardName para que los resultados se agrupen por empleado de ventas y cliente. 

Ejecutar la Consulta:
Elija Ejecutar. Los resultados muestran para cada empleado de ventas un conteo de ofertas de ventas abiertas por cada cliente y el valor total de las ofertas. Por ejemplo:

---

## Diapositiva 13

SOLUCIÓN PRÁCTICA: CONSULTAS - PÚBLICO 13 
Guarde la Consulta.

---

## Diapositiva 14

SOLUCIÓN PRÁCTICA: CONSULTAS - PÚBLICO 14 
Tarea 4: Crear un Informe como Lista de Trabajo para un Usuario 
Este informe muestra todos los pedidos de clientes contabilizados el día de hoy, organizados por el nombre del empleado de ventas. El informe utiliza la tabla ORDR y la tabla OSLP. El informe se guarda y luego puede utilizarse más tarde con una alerta para proporcionar una lista de trabajo diaria a un usuario. 

Preparación: 
Cree 2-3 pedidos de clientes, con la fecha de contabilización de hoy. Seleccione un % de descuento en cada pedido. 
En el Generador de Consultas, seleccione la tabla ORDR, presione Tab, luego seleccione la tabla OSLP y presione tab. Ingrese el SQL como se muestra a continuación en el área Seleccionar. Seleccione cada tabla antes de seleccionar los campos. Tenga en cuenta que la consulta usa la expresión SUM para totalizar los pedidos combinada con la cláusula OVER para mantener un total acumulado por empleado de ventas. Ingrese la cláusula Dónde como se muestra a continuación. 

Ejecute la consulta.

---

## Diapositiva 15

SOLUCIÓN PRÁCTICA: CONSULTAS - PÚBLICO 15 
Guarde la consulta en la categoría Ventas con el nombre 'Pedidos de Ventas de Hoy'. 
INFORMACIÓN: El informe puede programarse para ejecutarse diariamente y enviarse a un usuario utilizando el mecanismo de alertas. Esto se cubrirá en el caso práctico de alertas.

---

## Diapositiva 16

SOLUCIÓN PRÁCTICA: CONSULTAS - PÚBLICO 16 
Crear una Consulta para un Widget de Dashboard 
Configure un widget de recuento que cuente el número de entregas creadas cada día. 

Crear la consulta:
La consulta debe seleccionar los números de documento de la tabla ODLN donde la fecha del documento (fecha de contabilización) sea la fecha actual. Como se muestra a continuación: 
Guarde y nombre la consulta Entregas_Hoy. 

Probar la Consulta:
Cree algunas entregas (con la fecha actual) para que pueda probar su consulta. Ventas – Clientes → Entrega. 
Aquí hay una entrega de ejemplo:

---

## Diapositiva 17

SOLUCIÓN PRÁCTICA: CONSULTAS - PÚBLICO 17 
Después de crear algunas entregas, regrese a su consulta y elija Ejecutar. Los resultados muestran una lista de documentos de entrega para la fecha de hoy. Por ejemplo:

---

## Diapositiva 18

SOLUCIÓN PRÁCTICA: CONSULTAS - PÚBLICO 18 
Configurar el Widget de Recuento:
Herramientas > Cockpit → Configuración de Widget de Recuento. Cambie al modo añadir. Dé al widget de recuento un código, nombre y descripción. El nombre aparecerá en el widget, así que hágalo corto y preciso. Por ejemplo, nómbrelo Entregas de Hoy. 
Vincule el widget de recuento a la consulta que acaba de crear: Seleccione Elegir Consulta. Se abre la ventana del Gestor de Consultas. Elija su consulta y seleccione OK. Cuando su consulta se muestre en la ventana de Configuración de Widget de Recuento, Elija Añadir. 

Agregar el Widget de Recuento a su cockpit:
Elija el icono del Lápiz para realizar cambios en su cockpit. Utilice el símbolo + para abrir la Galería de Widgets.

---

## Diapositiva 19

SOLUCIÓN PRÁCTICA: CONSULTAS - PÚBLICO 19 
Elija Recuento de Objetos de Negocio en el cuadro desplegable. Para elegir el widget, haga clic en el signo Más debajo del widget. Cambiará a una marca de verificación verde. 
Elija la flecha en la parte superior izquierda para regresar al cockpit. Utilice el icono en forma de marca de verificación para guardar los cambios en el cockpit. 

Probar el Widget de Recuento:
Puede probar el widget de recuento agregando más entregas. Puede esperar hasta que el cockpit detecte las nuevas entregas o elegir Actualizar para ver el recuento actualizado. Si hace clic en el número mostrado, se abrirá una ventana con los resultados de la consulta.

---

## Diapositiva 20

Ninguna parte de esta publicación puede ser reproducida o transmitida en forma alguna o para ningún propósito sin el permiso expreso de SAP SE o una empresa afiliada a SAP. SAP y otros productos y servicios de SAP mencionados en este documento, así como sus respectivos logotipos, son marcas comerciales o marcas comerciales registradas de SAP SE (o una empresa afiliada a SAP) en Alemania y en otros países. Por favor, consulte http://www.sap.com/corporate-en/legal/copyright/index.epx#trademark para obtener información y avisos adicionales sobre marcas comerciales.
---
