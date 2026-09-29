# Guion de Video: DOC 098 CSI08 Query Practice

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 098 CSI08 Query Practice.

## Contenido Principal (Visual: Diapositivas correspondientes)
Guía Técnica: Práctica Guiada de Creación de Consultas SQL en SAP HANA (Query Generator & Wizard)
Metadatos Técnicos
Módulo SAP: Herramientas del Sistema y Personalización (System Customization / SQL Queries)
Código de Unidad: 098_CSI08_Query_Practice
Versión Oficial: SAP Business One 10.0, versión para SAP HANA
Audiencia Objetivo: Consultores Junior, Usuarios Clave (Power Users) y Analistas Funcionales.



{

  "antigravity_master_schema": {

    "module": "System Tools - Query Practice Exercises",

    "version": "10.0 HANA",

    "prerequisites": {

      "database": "SBODEMO_ES / SBODEMO_US (HANA Version)",

      "user_code": "manager",

      "license": "Professional"

    },

    "key_tables": {

      "OCRD": "Datos Maestros de Socios de Negocios",

      "OINV": "Facturas de Clientes (Cabecera)",

      "OQUT": "Ofertas de Ventas (Cabecera)",

      "OSLP": "Empleados de Ventas",

      "ORDR": "Pedidos de Clientes (Cabecera)",

      "ODLN": "Entregas (Cabecera)"

    },

    "tools_used": [

      "Generador de consultas (Query Generator)",

      "Asistente de consultas (Query Wizard)",

      "Información del sistema (System Information)",

      "Cockpit y Galería de Widgets"

    ],

    "exercises_summary": [

      {"task": 1, "description": "Reporte de lista de clientes con saldos de OCRD"},

      {"task": 2, "description": "Reporte de facturas deudoras abiertas con parámetro dinámico de fecha [%0]"},

      {"task": 3, "description": "Consulta multitabla OQUT + OSLP con agrupamiento y totales"},

      {"task": 4, "description": "Lista de trabajo de pedidos del día con acumulado continuo (Window function OVER)"},

      {"task": 5, "description": "Consulta de entregas del día para widget de recuento en cockpit"}

    ]

  }

}


1. Introducción y Preparación del Entorno
Esta unidad contiene los ejercicios prácticos de desarrollo de consultas SQL sobre SAP HANA utilizando las herramientas estándar de SAP Business One 10.0. Los ejercicios permiten al consultor familiarizarse con la estructura de metadatos, los vínculos relacionales entre cabeceras y maestros, y la explotación analítica de la información.
Protocolo de Identificación de Tablas y Columnas
Antes de iniciar cualquier consulta:

Abra el documento o maestro objetivo en el cliente SAP B1.
Vaya a Visualizar -> Información del sistema (Ctrl + Shift + I).
Sitúe el puntero sobre los campos requeridos para identificar el nombre técnico en la base de datos (campo [Tabla, Campo]).


2. Especificación de los Ejercicios Prácticos
Ejercicio 1: Creación de Lista de Clientes (Tabla OCRD)
Requerimiento: Crear una consulta que extraiga el código, razón social, dirección de factura, ciudad, código postal, saldo de cuenta y persona de contacto de todos los clientes.
Condición de Filtrado: El campo CardType debe ser igual a 'C'. (Excluir proveedores 'S' y leads 'L').
Reglas de Interfaz:
Ordenar los resultados alfabéticamente por nombre de cliente.
Incorporar la sumatoria al pie de la columna de saldo mediante el atajo Ctrl + Clic.
Guardar la consulta bajo la categoría Sales, asignándola al grupo de autorización Saved Queries – Group No.1.
Ejercicio 2: Consulta Parametrizada de Facturas Abiertas (Tabla OINV)
Requerimiento: Generar un reporte dinámico que filtre facturas deudoras cuyo estatus sea Abierto (DocStatus = 'O') y cuya fecha de contabilización sea posterior a una fecha suministrada por el operador.
Uso de Variables: Configurar la cláusula WHERE utilizando el operador relacional > y la variable de parámetro [%0].
Verificación de Navegación: Comprobar que los resultados mantengan activos los enlaces de profundización (flechas naranjas) hacia el maestro de socios de negocios.
Ejercicio 3: Consulta Multitabla y Agrupación (OQUT + OSLP)
Requerimiento: Obtener el valor total cotizado y la cantidad de ofertas de venta abiertas por cliente, consolidado por cada empleado del departamento de ventas.
Técnica: Utilizar INNER JOIN entre OQUT.SlpCode y OSLP.SlpCode. Aplicar funciones agregadas SUM(T0."DocTotal") y COUNT(T0."DocNum").
Condición: Filtrar por T0."DocStatus" = 'O'. Agrupar obligatoriamente por empleado de ventas, código de cliente y nombre de cliente.
Ejercicio 4: Reporte de Órdenes del Día y Acumulado Continuo (ORDR + OSLP)
Requerimiento: Construir un reporte de supervisión diaria que muestre los pedidos ingresados con fecha de hoy (CURRENT_DATE), presentando una columna de acumulado progresivo por representante comercial.
Lógica SQL: Emplear la cláusula analítica SUM(T0."DocTotal") OVER (PARTITION BY T1."SlpName" ORDER BY T0."DocNum").
Aplicación: Preparar la consulta para su posterior programación en el Gestor de Alertas automáticas.
Ejercicio 5: Configuración de Widget de Recuento para el Cockpit
Requerimiento: Crear una consulta ligera que devuelva los números de documento de las entregas de clientes (ODLN) procesadas en la fecha actual.
Integración: Vincular la consulta a un widget de recuento (Count Widget) en el Cockpit de SAP HANA, facilitando la auditoría visual directa desde el panel principal.


3. Guía de Ejecución y Errores Frecuentes
Error de Comillas en HANA: Escribir T0.DocDate sin comillas dobles puede causar errores de ejecución si la instalación de HANA opera con distinción estricta de mayúsculas/minúsculas. Debe escribirse siempre T0."DocDate".
Confusión en DocTotal: Recordar que el campo visual del total contiene formateo monetario; en base de datos la columna es estrictamente numérica (DocTotal).
Omisión en GROUP BY: Si se selecciona una columna que no está dentro de una función de agregación (SUM, COUNT, AVG), omitirla en el GROUP BY generará una excepción SQL directa.


4. Banco de Evaluación Situacional
Pregunta 1: ¿Cuál es el procedimiento estándar para organizar consultas de usuario y restringir su acceso a departamentos específicos en SAP Business One?

A) Crear roles de usuario en el servidor Linux de SAP HANA.
B) Guardar las consultas en Categorías y asignar dichas categorías a Grupos de Consultas Autorizadas (Grupos 1 al 128) en la gestión de autorizaciones.
C) Asignar contraseñas individuales a cada archivo SQL.
D) Ocultar el menú de herramientas mediante parametrizaciones de formulario.
Respuesta Correcta: B.
Justificación Técnica: SAP B1 organiza las consultas en categorías lógicas (OQCN), las cuales se mapean directamente a grupos de autorización (1 a 128). Mediante Gestión -> Inicialización sistema -> Autorizaciones -> Autorizaciones generales, se concede o deniega el acceso a cada grupo.

Pregunta 2: En la creación de una consulta de usuario, ¿qué efecto tiene la cláusula T0."DocDate" > [%0]?

A) Compara la fecha contra la fecha del sistema del servidor.
B) Dispara una ventana modal interactiva para que el usuario ingrese o seleccione una fecha en tiempo de ejecución.
C) Genera un error fatal porque %0 solo admite números enteros.
D) Filtra automáticamente el primer día del mes corriente.
Respuesta Correcta: B.
Justificación Técnica: Las variables de sintaxis [%0] actúan como parámetros dinámicos de interfaz de usuario. Al ejecutarse, SAP B1 reconoce el tipo de dato del campo asociado y presenta el control adecuado (en este caso, un selector de calendario).

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
