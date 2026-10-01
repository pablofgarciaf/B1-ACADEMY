# Transcripción por Diapositiva: CSI08_Query_Practice

## Diapositiva 1

Caso Práctico: Práctica de Consultas (Query Practice) SAP Business One 10.0, versión para SAP HANA - PÚBLICO

---

## Diapositiva 2

PRÁCTICA: CONSULTAS - PÚBLICO 2
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

PRÁCTICA: CONSULTAS - PÚBLICO 3 
Tarea 1: Crear un Informe de Lista de Clientes 
Este informe muestra una lista de clientes y saldos de la tabla de Interlocutores Comerciales OCRD. 
1. Cree una consulta utilizando los siguientes campos de la tabla de Interlocutores Comerciales OCRD: CardCode, CardName, Address, City (Ciudad de facturación), ZipCode, Balance, CntctPrsn. 
2. Dado que la tabla OCRD también contiene registros para proveedores y clientes potenciales, debe filtrar los registros de clientes utilizando la condición CardType = 'C'. 
3. En los resultados de la consulta, ordene alfabéticamente por el nombre del cliente y agregue un total a la columna de saldos de cuenta. 
4. Guarde la consulta en una nueva categoría llamada Ventas (Sales) y elija el botón Asignar Grupo para asignar la categoría al grupo de autorización Consultas Guardadas – Grupo N° 1. 
5. Ejecute la consulta guardada desde el menú Herramientas. 
Nota: Al usar una base de datos HANA, los nombres de los campos con mayúsculas y minúsculas deben estar entre comillas dobles en la consulta. 
La consulta y los resultados deberían verse más o menos así:

---

## Diapositiva 4

PRÁCTICA: CONSULTAS - PÚBLICO 4 
Ajuste Fino de los Resultados 
• Puede ordenar los resultados según cualquier columna haciendo doble clic en el campo de encabezado de la columna. 
• Para incluir un total de los saldos de las cuentas, presione Ctrl y haga clic en el campo de encabezado de la columna Saldo de Cuenta. El total aparecerá en la parte inferior de la columna, como se muestra a continuación.

---

## Diapositiva 5

PRÁCTICA: CONSULTAS - PÚBLICO 5 
Tarea 2: Crear un Informe con un Parámetro 
Este informe muestra una lista de facturas de clientes contabilizadas después de cierta fecha. La fecha se ingresa como un parámetro cuando se ejecuta la consulta. El informe utiliza la tabla de facturas OINV. 

Buscar Nombres de Campos:
Para averiguar los nombres de los campos para el informe, utilice la información del sistema: 
Nombre en el Documento -> Nombre del Campo en la Base de Datos 
N° -> DocNum
Nombre de Cliente -> CardName
Fecha de Contabilización -> DocDate
Total -> DocTotal 
Nota: Cuando pasa el cursor sobre el campo Total, el nombre del campo no se muestra en la información del sistema. Esto se debe a que este campo contiene el símbolo de la moneda además de la cantidad. El nombre del campo en la base de datos es DocTotal. 

Crear la Consulta:
Seleccione los campos de la tabla OINV que identificó utilizando la información del sistema. Filtre por facturas de deudores abiertas y use la variable [%0] con la condición 'Mayor que' para filtrar solo las facturas contabilizadas después de una fecha ingresada por el usuario como parámetro: 
T0."DocStatus" = 'O' and T0."DocDate" > [%0] 

Ejecutar la Consulta:
Elija Ejecutar. Seleccione una fecha de la lista. Nota: si está utilizando la base de datos de demostración, las facturas que verá pueden ser muy antiguas, a menos que haya agregado facturas recientemente. Para mostrar el total de las facturas, presione Ctrl y haga doble clic en el encabezado de la columna Total del Documento. Guarde esta consulta con el nombre Lista de Facturas en la categoría Ventas.

---

## Diapositiva 6

PRÁCTICA: CONSULTAS - PÚBLICO 6 
Tarea 3: Crear un Informe desde Múltiples Tablas 
Esta consulta mostrará una lista de ofertas de ventas abiertas resumidas por cliente y agrupadas por empleado de ventas. La consulta utilizará dos tablas: 
▪ Oferta de Ventas (OQUT) 
▪ Tabla de Empleados de Ventas (OSLP) 
La unión interna (inner join) será proporcionada automáticamente por la herramienta de consulta. 

Crear la consulta:
Seleccione la tabla OSLP y luego seleccione el campo SlpName. Seleccione la tabla OQUT y luego seleccione los campos CardCode y CardName. 
Calcule el valor total de las ofertas de ventas utilizando la función SUM y proporcione un encabezado de columna en el informe: 
SUM(T0."DocTotal") as "Valor Total" 
Cuente el número de ofertas de ventas para cada cliente utilizando la función COUNT y proporcione un encabezado: 
COUNT(T0."DocNum") as "Nro de Documentos" 
Filtre la consulta para que solo se utilicen ofertas abiertas: 
T0."DocStatus" = 'O' 
Ordene por el campo SlpName. 
Agrupe por los campos SlpName, CardCode y CardName. 
Ejecute y guarde la consulta.

---

## Diapositiva 7

PRÁCTICA: CONSULTAS - PÚBLICO 7 
Tarea 4: Crear un Informe como Lista de Trabajo para un Usuario 
Este informe muestra todos los pedidos de clientes contabilizados el día de hoy, organizados por el nombre del empleado de ventas. El informe utiliza la tabla ORDR y la tabla OSLP. El informe se guarda y luego puede utilizarse más tarde con una alerta para proporcionar una lista de trabajo diaria a un usuario. 

Preparación: 
Cree 2-3 pedidos de clientes, con la fecha de contabilización de hoy. Seleccione un % de descuento en cada pedido. 

Crear la consulta:
Seleccione las tablas ORDR y OSLP. Seleccione el nombre del empleado de ventas, número de documento, código de cliente, total del documento y descuento. Sume el total del documento de cada pedido (SUM), combinado con la cláusula OVER para mantener un total acumulado por cada empleado de ventas. Seleccione solo los pedidos de ventas para el día actual: 

Ejecutar la consulta:
Guarde la consulta en la categoría Ventas con el nombre 'Pedidos de Ventas de Hoy'. 
INFORMACIÓN: El informe puede programarse para ejecutarse diariamente y enviarse a un usuario utilizando el mecanismo de alertas. Esto se cubrirá en el caso práctico de alertas.

---

## Diapositiva 8

PRÁCTICA: CONSULTAS - PÚBLICO 8 
Tarea 5: Crear una Consulta para un Widget de Dashboard 
Configure un widget de recuento que cuente el número de entregas creadas cada día. 

Crear la consulta:
La consulta debe seleccionar los números de documento de la tabla ODLN donde la fecha del documento (fecha de contabilización) sea la fecha actual. Guarde y nombre la consulta Entregas_Hoy. 

Probar la Consulta:
Cree algunas entregas (con la fecha actual) para que pueda probar su consulta. 

Configurar el Widget de Recuento:
Herramientas > Cockpit → Configuración de Widget de Recuento. Cambie al modo Añadir. Dé al widget de recuento un código, nombre y descripción. El nombre aparecerá en el widget, así que hágalo corto y preciso. Por ejemplo, nómbrelo Entregas de Hoy. Vincule el widget de recuento a la consulta que acaba de crear. Elija Añadir. 

Agregar el Widget de Recuento a su cockpit:
Elija el icono del Lápiz para realizar cambios en su cockpit. Encuentre el widget recién creado en la Galería de Widgets (elija Recuento de Objetos de Negocio en el cuadro desplegable) y agréguelo al cockpit. Guarde los cambios en el cockpit. 

Probar el Widget de Recuento:
Puede probar el widget de recuento agregando más entregas. Puede esperar hasta que el cockpit detecte las nuevas entregas o elegir Actualizar para ver el recuento actualizado.

---

## Diapositiva 9

PRÁCTICA: CONSULTAS - PÚBLICO 9

---

## Diapositiva 10

Ninguna parte de esta publicación puede ser reproducida o transmitida en forma alguna o para ningún propósito sin el permiso expreso de SAP SE o una empresa afiliada a SAP. SAP y otros productos y servicios de SAP mencionados en este documento, así como sus respectivos logotipos, son marcas comerciales o marcas comerciales registradas de SAP SE (o una empresa afiliada a SAP) en Alemania y en otros países. Por favor, consulte http://www.sap.com/corporate-en/legal/copyright/index.epx#trademark para obtener información y avisos adicionales sobre marcas comerciales.
Algunos productos de software comercializados por SAP SE y sus distribuidores contienen componentes de software patentados por otros proveedores de software. Las especificaciones de productos nacionales pueden variar.
Estos materiales son proporcionados por SAP SE o una empresa afiliada a SAP solo con fines informativos, sin representación ni garantía de ningún tipo, y SAP SE o sus empresas afiliadas no serán responsables de errores u omisiones con respecto a los materiales. Las únicas garantías de los productos y servicios de SAP SE o empresas afiliadas a SAP son las establecidas en las declaraciones expresas de garantía que acompañan a dichos productos y servicios, si las hubiera. Nada de lo aquí incluido debe interpretarse como una garantía adicional. En particular, SAP SE o sus empresas afiliadas no tienen obligación alguna de seguir ninguna línea de negocio delineada en este documento o en cualquier presentación relacionada, ni de desarrollar o lanzar ninguna funcionalidad mencionada en los mismos.
Este documento, o cualquier presentación relacionada, y la estrategia de SAP SE o sus empresas afiliadas y los posibles desarrollos futuros, productos y/o direcciones y funcionalidades de plataformas, están todos sujetos a cambios y pueden ser modificados por SAP SE o sus empresas afiliadas en cualquier momento por cualquier motivo y sin previo aviso. La información de este documento no constituye un compromiso, promesa u obligación legal para entregar ningún material, código o funcionalidad. Todas las declaraciones prospectivas están sujetas a diversos riesgos e incertidumbres que podrían hacer que los resultados reales difieran materialmente de las expectativas. Se advierte a los lectores no depositar una confianza indebida en estas declaraciones prospectivas, que solo son válidas a partir de sus fechas, y no se debe confiar en ellas para tomar decisiones de compra. www.sap.com
---
