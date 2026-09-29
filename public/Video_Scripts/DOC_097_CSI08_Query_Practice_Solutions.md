# Guion de Video: DOC 097 CSI08 Query Practice Solutions

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 097 CSI08 Query Practice Solutions.

## Contenido Principal (Visual: Diapositivas correspondientes)
Guía Técnica Avanzada: Soluciones de Práctica de Consultas SQL en SAP HANA (Query Generator & Wizard)
Metadatos Técnicos
Módulo SAP: Herramientas de Implementación y Consultas (Tools & Implementation / System Customization)
Código de Unidad: 097_CSI08_Query_Practice_Solutions
Versión Oficial: SAP Business One 10.0, versión para SAP HANA
Audiencia Objetivo: Administradores del Sistema, Consultores Técnicos de BI/Analytics, Consultores Funcionales e Implementadores.



{

  "antigravity_master_schema": {

    "module": "Administration & Customization Tools - Query Solutions",

    "version": "10.0 HANA",

    "authorizations": {

      "super_user": "Required for Query Category Group assignment and advanced SQL execution",

      "general_authorization": "Saved Queries -> Group No.1 to No.128",

      "license_type": "Professional / Limited CRM or Financial with Query execution rights"

    },

    "database_tables": {

      "OCRD": {

        "description": "Datos Maestros de Socios de Negocios (Clientes, Proveedores, Leads)",

        "key_fields": ["CardCode", "CardName", "CardType", "Balance", "Address", "City", "ZipCode", "CntctPrsn"]

      },

      "OINV": {

        "description": "Factura de Clientes (Cabecera)",

        "key_fields": ["DocEntry", "DocNum", "DocStatus", "DocDate", "CardCode", "CardName", "DocTotal"]

      },

      "OQUT": {

        "description": "Ofertas de Ventas (Cabecera)",

        "key_fields": ["DocEntry", "DocNum", "DocStatus", "SlpCode", "CardCode", "CardName", "DocTotal"]

      },

      "OSLP": {

        "description": "Maestro de Empleados del Departamento de Ventas",

        "key_fields": ["SlpCode", "SlpName", "Active"]

      },

      "ORDR": {

        "description": "Pedidos de Clientes (Cabecera)",

        "key_fields": ["DocEntry", "DocNum", "DocDate", "SlpCode", "CardCode", "DocTotal", "DiscPrcnt"]

      },

      "ODLN": {

        "description": "Entregas de Ventas (Cabecera)",

        "key_fields": ["DocEntry", "DocNum", "DocDate", "CardCode", "DocStatus"]

      },

      "OUQR": {

        "description": "Consultas de Usuario Guardadas (User Queries)",

        "key_fields": ["QId", "QCategory", "QName", "QString"]

      },

      "OQCN": {

        "description": "Categorías de Consultas (Query Categories)",

        "key_fields": ["CategoryId", "CatName", "PermId"]

      }

    },

    "menu_navigation_paths": [

      "Herramientas -> Consultas -> Generador de consultas (Tools -> Queries -> Query Generator)",

      "Herramientas -> Consultas -> Asistente de consultas (Tools -> Queries -> Query Wizard)",

      "Herramientas -> Consultas -> Consultas de usuario (Tools -> Queries -> User Queries)",

      "Herramientas -> Cockpit -> Configuración de widget de recuento (Tools -> Cockpit -> Count Widget Setup)",

      "Visualizar -> Información del sistema (View -> System Information [Ctrl + Shift + I])"

    ],

    "business_rules": [

      "En bases de datos SAP HANA, todos los nombres de campos mixtos o camelCase deben estar delimitados obligatoriamente por comillas dobles (ejemplo: T0.\"CardCode\", T0.\"DocDate\").",

      "Las cadenas de texto literales en SQL HANA deben encerrarse estrictamente entre comillas simples (ejemplo: 'C', 'O').",

      "Para solicitar parámetros dinámicos en tiempo de ejecución, se utilizan las variables de sustitución sintáctica [%0], [%1], etc., vinculadas a campos con tipos de datos nativos.",

      "El cálculo acumulativo continuo en SAP HANA utiliza funciones de ventana como SUM(T0.\"DocTotal\") OVER(PARTITION BY T1.\"SlpName\" ORDER BY T0.\"DocEntry\").",

      "La asignación de categorías de consultas a grupos de autorización (Grupos 1 a 128) es mandatoria para restringir el acceso a usuarios no autorizados."

    ]

  }

}


1. Fundamentos Teóricos y Arquitectura de Consultas en SAP HANA
El motor de consultas de SAP Business One 10.0 sobre SAP HANA permite interactuar directamente con la capa de persistencia mediante dialecto ANSI SQL / SAP HANA SQL. A diferencia del entorno SQL Server, SAP HANA impone reglas estrictas de diferenciación entre mayúsculas y minúsculas (case-sensitivity) para los identificadores de esquemas, tablas y columnas cuando estos están entrecomillados.
Identificación de Metadatos con Información del Sistema
Para construir consultas eficientes sin recurrir a ingeniería inversa:

Se activa Información del Sistema mediante el menú Visualizar -> Información del sistema o la combinación de teclas Ctrl + Shift + I.
Al posar el cursor sobre cualquier campo de un documento de marketing o maestro, la barra de estado inferior muestra la tabla y la columna física subyacente.
Excepción Técnica Crítica: Campos que combinan importe y símbolo de divisa (como el Total del Documento) no muestran directamente el nombre físico en la barra de estado; la columna física en base de datos es invariablemente DocTotal para moneda local o DocTotalFC para moneda extranjera.


2. Desarrollo Detallado de las Soluciones Técnicas (Casos 1 al 5)
Tarea 1: Reporte de Lista de Clientes con Filtro de Tipo y Saldo Acumulado
Objetivo: Listar los clientes activos con sus datos de contacto y balances financieros, excluyendo proveedores y prospectos.
Tabla Base: OCRD (Socio de Negocios).
Sentencia SQL HANA:

SELECT 

    T0."CardCode", 

    T0."CardName", 

    T0."Address", 

    T0."City", 

    T0."ZipCode", 

    T0."Balance", 

    T0."CntctPrsn" 

FROM OCRD T0 

WHERE T0."CardType" = 'C'

ORDER BY T0."CardName" ASC;

Operaciones de Interfaz:
Para sumarizar la columna de saldo (Balance) sin modificar la consulta, el usuario presiona Ctrl y hace clic en el encabezado de la columna en la cuadrícula de resultados.
Se guarda la consulta en Herramientas -> Consultas -> Administrar categorías, creando la categoría Sales y asignándola al grupo de autorización Saved Queries – Group No.1.
Tarea 2: Reporte con Criterio de Selección Dinámico (Parámetros de Entrada)
Objetivo: Filtrar facturas deudoras abiertas cuya fecha de contabilización sea posterior a una fecha seleccionada interactivamente por el usuario.
Tabla Base: OINV.
Sentencia SQL HANA con Parámetro:

SELECT 

    T0."DocNum", 

    T0."CardCode", 

    T0."CardName", 

    T0."DocDate", 

    T0."DocTotal" 

FROM OINV T0 

WHERE T0."DocStatus" = 'O' 

  AND T0."DocDate" > [%0];

Mecánica del Parámetro [%0]: Al ejecutarse, SAP B1 intercepta la variable y despliega una ventana modal con calendario para seleccionar el valor de fecha. El sistema mantiene habilitada la flecha de enlace naranja (Orange Drill-down Arrow) hacia el maestro de clientes (OCRD).
Tarea 3: Reporte Multitabla con Agrupación y Funciones de Agregación (Inner Join)
Objetivo: Consolidar el importe total y la cantidad de ofertas de venta abiertas por cliente y agrupadas por empleado de ventas.
Tablas Involucradas: OQUT (Ofertas) y OSLP (Empleados de Ventas).
Sentencia SQL HANA:

SELECT 

    T1."SlpName", 

    T0."CardCode", 

    T0."CardName", 

    SUM(T0."DocTotal") AS "Total Value", 

    COUNT(T0."DocNum") AS "No of Documents" 

FROM OQUT T0 

INNER JOIN OSLP T1 ON T0."SlpCode" = T1."SlpCode" 

WHERE T0."DocStatus" = 'O'

GROUP BY T1."SlpName", T0."CardCode", T0."CardName"

ORDER BY T1."SlpName";

Regla de Negocio: Toda columna no agregada en la cláusula SELECT debe estar declarada taxativamente en la cláusula GROUP BY.
Tarea 4: Lista de Trabajo Diaria con Saldo Continuo (Running Total con Window Functions)
Objetivo: Supervisar los pedidos cargados en el día en curso, calculando el acumulado progresivo de ventas por cada representante comercial.
Tablas Involucradas: ORDR y OSLP.
Sentencia SQL HANA con Cláusula OVER():

SELECT 

    T1."SlpName", 

    T0."DocNum", 

    T0."CardCode", 

    T0."DocTotal", 

    T0."DiscPrcnt",

    SUM(T0."DocTotal") OVER (

        PARTITION BY T1."SlpName" 

        ORDER BY T0."DocNum"

    ) AS "RunningTotal"

FROM ORDR T0 

INNER JOIN OSLP T1 ON T0."SlpCode" = T1."SlpCode" 

WHERE T0."DocDate" = CURRENT_DATE;

Integración con Alertas: Esta consulta se vincula al servicio de alertas automáticas para ejecutarse al final de cada jornada y distribuirse a los directores comerciales.
Tarea 5: Consulta para Widget de Recuento en el Cockpit de SAP HANA
Objetivo: Alimentar un widget tipo velocímetro o recuento numérico que cuantifique las entregas (ODLN) procesadas en el día.
Sentencia SQL HANA:

SELECT 

    T0."DocNum" 

FROM ODLN T0 

WHERE T0."DocDate" = CURRENT_DATE;

Configuración del Widget:
En Herramientas -> Cockpit -> Configuración de widget de recuento, se ingresa un código y descripción (ej. WGT_DELIV_TODAY, "Entregas de Hoy").
Se vincula la consulta guardada Deliveries_Today.
Desde el Cockpit, se abre la galería de widgets (+), se añade el componente desde la categoría Recuento de objetos de negocio, y al hacer clic en el valor numérico, el sistema abre directamente la cuadrícula detallada de entregas.


3. Caso de Negocio Resuelto en OEC Computers
Escenario: El director de TI de OEC Computers necesita estandarizar los reportes operativos de ventas y logística para evitar discrepancias entre los datos de CRM y contabilidad.
Implementación:
Se implementaron las consultas de control con comillas dobles estrictas para compatibilidad total con la base de datos SAP HANA.
Se configuraron las categorías de consultas seguras asignadas al Grupo 1, impidiendo que usuarios de nivel operativo alteren las sentencias.
Se conectó el widget de entregas en tiempo real en los cockpits de los supervisores de bodega, reduciendo los tiempos muertos en despacho.


4. Banco de Evaluación Situacional (Formato Certificación SAP)
Pregunta 1: Al diseñar una consulta en SAP Business One versión para SAP HANA mediante el Generador de Consultas, el usuario recibe un error de sintaxis al ejecutar: SELECT T0.CardCode FROM OCRD T0 WHERE T0.CardType = 'C'. ¿Cuál es la causa técnica del fallo?

A) La tabla OCRD no permite alias T0.
B) En SAP HANA, los nombres de columnas mixtos deben encerrarse entre comillas dobles (T0."CardCode").
C) La condición 'C' debe escribirse con comillas dobles "C".
D) El comando SELECT debe ir en minúsculas en SAP HANA.
Respuesta Correcta: B.
Justificación Técnica: El motor de base de datos SAP HANA es sensible a mayúsculas y minúsculas en identificadores entrecomillados y requiere comillas dobles para campos en formato camelCase como "CardCode". Las cadenas de texto literales como 'C' usan comillas simples.

Pregunta 2: Se requiere que un reporte solicite al usuario final una fecha de corte cada vez que se ejecute la consulta. ¿Qué sintaxis estándar proporciona esta funcionalidad en el Generador de Consultas?

A) @FechaCorte
B) :P_FECHA
C) [%0]
D) ?Date
Respuesta Correcta: C.
Justificación Técnica: SAP Business One utiliza internamente variables de sustitución delimitadas por corchetes y signos de porcentaje, comenzando en [%0], las cuales generan dinámicamente un cuadro de diálogo con validación de tipo de dato.

Pregunta 3: ¿Cuál es la función específica del atajo de teclado Ctrl + Clic en el encabezado de una columna numérica dentro de la ventana de resultados de una consulta de usuario?

A) Copiar los datos de la columna al portapapeles.
B) Calcular e insertar la suma total de la columna al pie de la cuadrícula.
C) Ordenar la columna de manera descendente.
D) Abrir la ventana de parametrizaciones de formulario.
Respuesta Correcta: B.
Justificación Técnica: Al presionar Ctrl y hacer clic en el encabezado de una columna numérica (como saldos o totales de documentos), SAP Business One calcula automáticamente el total acumulado y lo presenta al final de la columna.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
