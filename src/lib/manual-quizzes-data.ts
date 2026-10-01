export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
  topic?: string;
  recommendedManualId?: string;
  recommendedManualTitle?: string;
}

export const MANUAL_SPECIFIC_QUIZZES: Record<string, QuizQuestion[]> = {
  "10_Intro_11_Overview_IntroSAPB1_ES": [
    {
      q: "¿Cuál es la principal ventaja arquitectónica de SAP Business One sobre una base de datos SAP HANA frente a Microsoft SQL Server?",
      options: [
        "Permite instalarse en sistemas operativos móviles Android de forma nativa.",
        "Procesamiento columnar en memoria RAM que habilita analítica transaccional y dashboards en tiempo real sin congelar la operación.",
        "Elimina por completo la necesidad de realizar respaldos periódicos de base de datos.",
        "Duplica automáticamente los asientos contables en una nube pública sin configurar licencias."
      ],
      answer: 1,
      explanation: "SAP HANA procesa los datos en memoria con compresión columnar, unificando OLTP (transacciones) y OLAP (analítica) en un solo motor de altísima velocidad.",
      topic: "Arquitectura en Memoria SAP HANA",
      recommendedManualId: "10_Intro_11_Overview_IntroSAPB1_ES",
      recommendedManualTitle: "Introducción a SAP Business One"
    },
    {
      q: "En el ecosistema de integración de SAP Business One, ¿cuál es el rol fundamental de la capa Service Layer (OData)?",
      options: [
        "Reemplazar el sistema operativo del servidor de aplicaciones.",
        "Exponer una API RESTful de alta concurrencia diseñada especialmente para el Cliente Web y consumo de servicios móviles e IoT.",
        "Imprimir directamente facturas fiscales sin necesidad de drivers en el puesto de trabajo.",
        "Solo permitir conexiones ODBC antiguas de lectura para Excel."
      ],
      answer: 1,
      explanation: "Service Layer es la API RESTful de última generación para SAP B1 sobre HANA/SQL, permitiendo integraciones HTTP sin depender de librerías COM Windows pesadas.",
      topic: "Integración con Service Layer",
      recommendedManualId: "10_Intro_11_Overview_IntroSAPB1_ES",
      recommendedManualTitle: "Introducción a SAP Business One"
    },
    {
      q: "¿Cómo gestiona SAP Business One las transacciones internacionales en empresas que operan con múltiples monedas?",
      options: [
        "Obliga a crear una base de datos independiente por cada tipo de divisa extranjera.",
        "Permite configurar Moneda Local, Moneda del Sistema y Monedas de Socios de Negocios, registrando la tasa de cambio y calculando diferencias de conversión automáticamente.",
        "Solo permite facturar en dólares estadounidenses y euros.",
        "No permite transacciones multimoneda sin un add-on de terceros."
      ],
      answer: 1,
      explanation: "El motor financiero de SAP B1 es nativamente multimoneda, registrando cada transacción tanto en moneda del documento como en moneda local y del sistema.",
      topic: "Gestión Multimoneda",
      recommendedManualId: "10_Intro_11_Overview_IntroSAPB1_ES",
      recommendedManualTitle: "Introducción a SAP Business One"
    },
    {
      q: "¿Cuál es la función del System Landscape Directory (SLD) en una arquitectura multi-empresa de SAP B1?",
      options: [
        "Servir como antivirus centralizado de las terminales de usuario.",
        "Centralizar la administración de servidores, bases de datos de empresas, licencias y servicios de integración.",
        "Diseñar las interfaces gráficas de usuario en HTML5.",
        "Calcular la depreciación de activos fijos al final del ejercicio."
      ],
      answer: 1,
      explanation: "El SLD es el centro de control técnico que gestiona la topología de servidores, registros de empresas y el servidor de licencias.",
      topic: "Administración del SLD",
      recommendedManualId: "10_Intro_11_Overview_IntroSAPB1_ES",
      recommendedManualTitle: "Introducción a SAP Business One"
    },
    {
      q: "¿Qué modelo de despliegue permite a las organizaciones operar SAP Business One en modalidad SaaS (Software as a Service) a través de un navegador web?",
      options: [
        "Instalación cliente-servidor tradicional sobre Windows 98.",
        "Cloud Control Center (CCC) con Web Client ejecutado sobre Linux/Windows con Service Layer.",
        "Exportación periódica de tablas en formato CSV por correo electrónico.",
        "Uso exclusivo de conexiones de escritorio remoto RDP sin seguridad SSL."
      ],
      answer: 1,
      explanation: "El Cloud Control Center permite a los partners gestionar tenants multi-cliente en la nube con acceso nativo vía Web Client.",
      topic: "Despliegue Cloud y Web Client",
      recommendedManualId: "10_Intro_11_Overview_IntroSAPB1_ES",
      recommendedManualTitle: "Introducción a SAP Business One"
    }
  ],
  "10_Intro_12_Overview_GettingStarted_ES": [
    {
      q: "¿Qué componente de la interfaz moderna de SAP Business One permite a un usuario anclar indicadores KPI, widgets interactivos y Workbench de procesos por rol?",
      options: [
        "El Administrador de Tareas de Windows.",
        "El Cockpit estilo Fiori personalizado.",
        "El Gestor de Archivos adjuntos del servidor.",
        "El Diseñador de Formatos de Impresión PLD."
      ],
      answer: 1,
      explanation: "El Cockpit Fiori de SAP B1 organiza el espacio de trabajo con widgets analíticos, accesos directos por rol y flujos visuales interactivos de procesos.",
      topic: "Personalización del Cockpit Fiori",
      recommendedManualId: "10_Intro_12_Overview_GettingStarted_ES",
      recommendedManualTitle: "Primeros Pasos en SAP Business One"
    },
    {
      q: "¿Cuál es el atajo de teclado estándar para activar la 'Información del Sistema' y revelar el nombre técnico de las tablas y campos en la barra de estado inferior?",
      options: [
        "Alt + F4",
        "Ctrl + Shift + I",
        "Ctrl + Alt + Delete",
        "Shift + F1"
      ],
      answer: 1,
      explanation: "Ctrl + Shift + I activa la Información del Sistema, mostrando de forma indispensable para consultores la tabla de base de datos y el campo al pasar el cursor.",
      topic: "Información del Sistema y Auditoría",
      recommendedManualId: "10_Intro_12_Overview_GettingStarted_ES",
      recommendedManualTitle: "Primeros Pasos en SAP Business One"
    },
    {
      q: "Si un usuario recién creado inicia sesión pero no puede visualizar el módulo de Ventas ni Compras en el menú principal, ¿cuál es la causa técnica?",
      options: [
        "El monitor de la computadora tiene una resolución inferior a 1080p.",
        "El usuario no tiene asignada una licencia activa o carece de autorizaciones en Gestión > Inicialización del Sistema > Autorizaciones.",
        "El servicio del SQL Server está apagado exclusivamente para ese usuario.",
        "La empresa no ha emitido su primera factura del mes."
      ],
      answer: 1,
      explanation: "La visibilidad de módulos en SAP B1 está estrictamente regida por la asignación de Licencias Nominales y la matriz de Autorizaciones por usuario o grupo.",
      topic: "Licenciamiento y Autorizaciones",
      recommendedManualId: "10_Intro_12_Overview_GettingStarted_ES",
      recommendedManualTitle: "Primeros Pasos en SAP Business One"
    },
    {
      q: "¿Cuál es la utilidad de la función 'Parametrizaciones de Formulario' (icono de engranaje) en cualquier ventana de documento de SAP B1?",
      options: [
        "Formatear el disco duro de la computadora cliente.",
        "Ocultar, mostrar, bloquear o reorganizar columnas y campos visibles en la pantalla para agilizar la digitación del usuario.",
        "Cambiar el tipo de cambio oficial del Banco Central.",
        "Eliminar los asientos contables generados por el documento."
      ],
      answer: 1,
      explanation: "Las Parametrizaciones de Formulario permiten adaptar la vista de cualquier tabla (filas de artículos, totales) según las necesidades de cada usuario o rol.",
      topic: "Parametrizaciones de Formulario",
      recommendedManualId: "10_Intro_12_Overview_GettingStarted_ES",
      recommendedManualTitle: "Primeros Pasos en SAP Business One"
    },
    {
      q: "Al trabajar en modo 'Buscar' (indicado por el botón Buscar en amarillo), ¿qué carácter comodín se utiliza para filtrar registros cuyo nombre comience con una letra determinada?",
      options: [
        "Signo de interrogación (?)",
        "Asterisco (*) al final de la letra (ej: C*)",
        "Símbolo de arroba (@)",
        "Numeral (#)"
      ],
      answer: 1,
      explanation: "El asterisco (*) actúa como comodín en las búsquedas de SAP B1 para representar cualquier secuencia de caracteres.",
      topic: "Búsquedas y Filtros en SAP B1",
      recommendedManualId: "10_Intro_12_Overview_GettingStarted_ES",
      recommendedManualTitle: "Primeros Pasos en SAP Business One"
    }
  ],
  "10_Overview_13_MDDoc_ES": [
    {
      q: "En el modelo de datos de SAP Business One, ¿cuál es la tabla maestra que almacena los registros de cabecera de Clientes y Proveedores (Interlocutores Comerciales)?",
      options: [
        "OITM",
        "OCRD",
        "OINV",
        "ORDR"
      ],
      answer: 1,
      explanation: "OCRD (Business Partners Master Data) es la tabla central de interlocutores comerciales, diferenciando el tipo con el campo CardType (C: Cliente, S: Proveedor, L: Lead).",
      topic: "Tablas de Socios de Negocios (OCRD)",
      recommendedManualId: "10_Overview_13_MDDoc_ES",
      recommendedManualTitle: "Documentos y Datos Maestros: Conceptos Generales"
    },
    {
      q: "En un documento de marketing (como una Oferta o Pedido de Venta), ¿qué tipo de línea se debe seleccionar en la pestaña Contenido para redactar especificaciones especiales de entrega sin alterar el importe total ni el inventario?",
      options: [
        "Línea regular en blanco",
        "Línea de tipo T (Texto)",
        "Línea de tipo S (Subtotal)",
        "Línea de tipo A (Alternativo)"
      ],
      answer: 1,
      explanation: "La línea tipo T abre el editor de texto libre de SAP B1, permitiendo insertar cláusulas o instrucciones que se imprimen en el documento sin valor monetario.",
      topic: "Tipos de Línea en Documentos de Marketing",
      recommendedManualId: "10_Overview_13_MDDoc_ES",
      recommendedManualTitle: "Documentos y Datos Maestros: Conceptos Generales"
    },
    {
      q: "¿Cuál es el impacto en la base de datos al guardar una cotización como 'Documento Preliminar' (Borrador)?",
      options: [
        "Genera un asiento contable diferido y descuenta el stock en almacén.",
        "No afecta las cuentas contables de mayor ni modifica el stock comprometido; queda aislado en tablas provisionales (ODRF/DRF1) hasta su aprobación.",
        "Bloquea la ficha del cliente impidiendo que otros usuarios le vendan.",
        "Envía automáticamente el documento a la entidad tributaria del país."
      ],
      answer: 1,
      explanation: "Los documentos preliminares se almacenan en ODRF/DRF1 y no tienen repercusión contable ni logística hasta que un usuario autorizado los añade formalmente.",
      topic: "Documentos Preliminares (Borradores)",
      recommendedManualId: "10_Overview_13_MDDoc_ES",
      recommendedManualTitle: "Documentos y Datos Maestros: Conceptos Generales"
    },
    {
      q: "Si en un Pedido de Venta se modifica la dirección de entrega en la pestaña Logística, ¿qué sucede con la dirección grabada en el Dato Maestro del Cliente?",
      options: [
        "Se sobreescribe permanentemente en la tabla maestra OCRD para todas las ventas futuras.",
        "Solo se modifica para ese pedido específico; el dato maestro permanece intacto sin alteraciones.",
        "El sistema genera un error bloqueando la transacción.",
        "Se crea un nuevo cliente con un código correlativo."
      ],
      answer: 1,
      explanation: "Los documentos heredan los datos maestros pero permiten excepciones transaccionales sin corromper el registro maestro permanente.",
      topic: "Heredabilidad y Logística de Documentos",
      recommendedManualId: "10_Overview_13_MDDoc_ES",
      recommendedManualTitle: "Documentos y Datos Maestros: Conceptos Generales"
    },
    {
      q: "¿Qué función cumple el botón 'Copiar a' (Copy To) en la barra inferior de un documento de marketing aprobado?",
      options: [
        "Duplica el documento en formato borrador dentro de la misma pantalla.",
        "Transfiere todos los datos, líneas, precios y referencias hacia el documento sucesor del flujo (ej: de Oferta a Pedido, o de Pedido a Entrega) cerrando las líneas base.",
        "Envía una copia del documento a la impresora de red predeterminada.",
        "Borra el documento origen y crea uno nuevo sin historial."
      ],
      answer: 1,
      explanation: "El flujo 'Copiar a' garantiza la cadena de suministro conectada, alimentando el Mapa de Relaciones y gestionando cantidades abiertas y cerradas.",
      topic: "Flujo de Documentos y Copiar A",
      recommendedManualId: "10_Overview_13_MDDoc_ES",
      recommendedManualTitle: "Documentos y Datos Maestros: Conceptos Generales"
    }
  ],
  "10_Impl_11_CustomTools_Queries_ES": [
    {
      q: "En la base de datos de SAP Business One, ¿qué par de tablas corresponde respectivamente a la cabecera y las líneas de una Orden de Venta (Pedido de Cliente)?",
      options: [
        "OITM y ITM1",
        "ORDR y RDR1",
        "OPCH y PCH1",
        "OJDT y JDT1"
      ],
      answer: 1,
      explanation: "ORDR almacena la cabecera del pedido de ventas y RDR1 almacena las líneas individuales de artículos, cantidades y precios.",
      topic: "Estructura de Tablas ORDR / RDR1",
      recommendedManualId: "10_Impl_11_CustomTools_Queries_ES",
      recommendedManualTitle: "Consultas Personalizadas (Queries)"
    },
    {
      q: "¿Por qué SAP prohíbe terminantemente ejecutar consultas SQL de modificación directa (INSERT, UPDATE, DELETE) en tablas estándar de producción?",
      options: [
        "Porque SQL Server no admite transacciones concurrentes.",
        "Porque elude la capa de lógica empresarial (DI-API/Service Layer), corrompe la integridad referencial contable y anula de inmediato la garantía y soporte oficial de SAP.",
        "Porque los nombres de las tablas son de solo 4 caracteres.",
        "Porque reinicia el servidor de licencias cada vez que se ejecuta un UPDATE."
      ],
      answer: 1,
      explanation: "Toda modificación en SAP B1 debe pasar por los objetos de negocio para garantizar asientos contables balanceados, costos y trazabilidad.",
      topic: "Integridad y Garantía de Soporte SAP",
      recommendedManualId: "10_Impl_11_CustomTools_Queries_ES",
      recommendedManualTitle: "Consultas Personalizadas (Queries)"
    },
    {
      q: "Al programar una Búsqueda Formateada (Valor Definido por el Usuario - UDV) que debe capturar el valor de un campo en pantalla antes de guardarlo en base de datos, ¿qué sintaxis nativa de SAP B1 se debe utilizar?",
      options: [
        "SELECT * FROM CURRENT_SCREEN",
        "$[$Item.Column.Number$]",
        "#SESSION_VALUE(Field)",
        "@@PREVIOUS_RECORD"
      ],
      answer: 1,
      explanation: "La sintaxis $[$Item.Column.Number$] es la variable interna de SAP B1 para leer valores dinámicos del buffer de memoria de la ventana activa.",
      topic: "Sintaxis de Búsquedas Formateadas",
      recommendedManualId: "10_Impl_11_CustomTools_Queries_ES",
      recommendedManualTitle: "Consultas Personalizadas (Queries)"
    },
    {
      q: "¿Cuál es la función del archivo REFDB accesible desde el SDK o Workbench de Transferencia de Datos (DTW)?",
      options: [
        "Restaurar copias de seguridad corruptas.",
        "Servir como diccionario de datos oficial que detalla tipos de campo, longitud máxima, claves foráneas y tablas de referencia de SAP B1.",
        "Calcular la declaración de impuestos del mes.",
        "Gestionar las contraseñas de los usuarios de Windows."
      ],
      answer: 1,
      explanation: "REFDB es la referencia canónica de tablas y campos para desarrolladores y consultores de integración en SAP B1.",
      topic: "Diccionario de Datos REFDB",
      recommendedManualId: "10_Impl_11_CustomTools_Queries_ES",
      recommendedManualTitle: "Consultas Personalizadas (Queries)"
    },
    {
      q: "En el Generador de Consultas de SAP B1, ¿qué cláusula SQL se genera automáticamente cuando el usuario vincula el campo CardCode de la tabla OCRD con el campo CardCode de la tabla ORDR?",
      options: [
        "GROUP BY ORDR.CardCode",
        "INNER JOIN ORDR ON OCRD.CardCode = ORDR.CardCode (Cláusula WHERE de enlace relacional)",
        "ORDER BY DESC",
        "DROP TABLE OCRD"
      ],
      answer: 1,
      explanation: "El generador relaciona ambas entidades mediante la clave primaria/foránea CardCode para cruzar los datos de clientes con sus órdenes.",
      topic: "Relaciones SQL en Query Generator",
      recommendedManualId: "10_Impl_11_CustomTools_Queries_ES",
      recommendedManualTitle: "Consultas Personalizadas (Queries)"
    }
  ],
  "CSI08_Query_Practice": [
    {
      q: "¿Por qué en la Tarea 1 de la práctica de consultas es estrictamente necesario aplicar la condición WHERE CardType = 'C' sobre la tabla OCRD?",
      options: [
        "Porque la tabla OCRD unifica clientes, proveedores ('S') y leads ('L'); sin este filtro se mezclarían todos los socios de negocios.",
        "Porque el motor SAP HANA bloquea las consultas que no contengan la letra 'C' en la cláusula WHERE.",
        "Porque 'C' indica que el cliente posee una cuenta contable en dólares estadounidenses.",
        "Porque es un requisito de diseño para que el Generador de Consultas pueda calcular el saldo de cuenta."
      ],
      answer: 0,
      explanation: "La tabla OCRD almacena todo el maestro de interlocutores comerciales. El campo CardType distingue 'C' (Cliente/Customer), 'S' (Proveedor/Supplier) y 'L' (Lead/Prospecto).",
      topic: "Filtro Transaccional de Socios (OCRD)",
      recommendedManualId: "CSI08_Query_Practice",
      recommendedManualTitle: "Práctica de Consultas (Query Practice)"
    },
    {
      q: "En la Tarea 2, ¿qué función cumple la sintaxis DocDate > [%0] al estructurar la consulta sobre la tabla de facturas OINV?",
      options: [
        "Convierte la consulta en dinámica, haciendo que SAP B1 abra automáticamente un selector de calendario para que el usuario ingrese la fecha en tiempo de ejecución.",
        "Filtra de manera fija las facturas que tengan más de noventa días de vencidas.",
        "Obliga al servidor a indexar el campo de fecha en el disco duro del cliente.",
        "Elimina las facturas cuya fecha de contabilización sea posterior al cierre del ejercicio contable."
      ],
      answer: 0,
      explanation: "La sintaxis [%0] en SAP B1 representa un parámetro dinámico de usuario. Al asociarlo al campo DocDate, el sistema despliega el calendario nativo para filtrar sin editar el código SQL.",
      topic: "Parámetros Dinámicos ([%0])",
      recommendedManualId: "CSI08_Query_Practice",
      recommendedManualTitle: "Práctica de Consultas (Query Practice)"
    },
    {
      q: "Al realizar la consulta relacional de la Tarea 3 entre la cabecera de facturas (OINV) y sus líneas de artículos (INV1), ¿cuál es el campo clave de unión (Join Key)?",
      options: [
        "CardCode",
        "DocEntry (Clave primaria de cabecera y foránea en líneas)",
        "ItemCode",
        "SlpCode"
      ],
      answer: 1,
      explanation: "DocEntry es el identificador único interno e inmutable de los documentos en SAP B1 que vincula unívocamente la tabla de cabecera (OINV) con la de detalle (INV1).",
      topic: "Relaciones Multitabla (INNER JOIN)",
      recommendedManualId: "CSI08_Query_Practice",
      recommendedManualTitle: "Práctica de Consultas (Query Practice)"
    },
    {
      q: "Durante la visualización de resultados en la grilla de SAP B1, ¿qué atajo permite calcular la sumatoria total de una columna numérica sin modificar la consulta SQL?",
      options: [
        "Alt + Shift + Clic derecho",
        "Mantener presionada la tecla Ctrl y hacer clic en el encabezado de la columna deseada",
        "Hacer doble clic en la primera fila de datos de la columna",
        "Presionar F5 para forzar la actualización del total"
      ],
      answer: 1,
      explanation: "Presionar Ctrl + Clic sobre el encabezado de cualquier columna numérica en la grilla de resultados de SAP B1 genera inmediatamente el total acumulado en el pie de página.",
      topic: "Ajuste Fino de Grilla en SAP B1",
      recommendedManualId: "CSI08_Query_Practice",
      recommendedManualTitle: "Práctica de Consultas (Query Practice)"
    },
    {
      q: "¿Cuál es el requisito indispensable al construir una consulta SQL destinada a alimentar un widget de gráfico de barras en Pervasive Analytics?",
      options: [
        "Exportar los datos a formato CSV plano.",
        "Definir una dimensión de agrupación con GROUP BY (ej. CardName) y una medida numérica agregada con funciones como SUM() o COUNT().",
        "Desactivar las autorizaciones de usuario en el menú Gestión.",
        "No utilizar alias de tabla (T0, T1) en la sintaxis SQL."
      ],
      answer: 1,
      explanation: "Los widgets y paneles de control Fiori requieren datos consolidados: una dimensión para el eje de categorías (GROUP BY) y una o más medidas numéricas agregadas (SUM, AVG, COUNT).",
      topic: "Consultas para Dashboards Fiori",
      recommendedManualId: "CSI08_Query_Practice",
      recommendedManualTitle: "Práctica de Consultas (Query Practice)"
    }
  ],
  "CSI08_Query Practice_Solutions": [
    {
      q: "¿Cuál es la mejor práctica de optimización en SAP HANA cuando se combinan tablas con millones de transacciones como OINV e INV1?",
      options: [
        "Ejecutar SELECT * sin cláusula WHERE para cargar toda la memoria caché.",
        "Seleccionar únicamente las columnas necesarias en el SELECT, indexar los campos de filtro y aplicar el WHERE antes del JOIN.",
        "Crear un trigger que duplique los datos en una tabla temporal no indexada.",
        "Desactivar la compresión en columnas de la base de datos."
      ],
      answer: 1,
      explanation: "En bases de datos columnares como SAP HANA, especificar únicamente las columnas requeridas evita lecturas innecesarias en memoria y acelera la ejecución.",
      topic: "Optimización de Consultas SQL HANA",
      recommendedManualId: "CSI08_Query Practice_Solutions",
      recommendedManualTitle: "Práctica de Consultas: Soluciones"
    },
    {
      q: "Al ejecutar una consulta con GROUP BY por CardName calculando SUM(DocTotal), ¿qué error emite el motor si agregamos DocDate al SELECT sin incluirlo en el GROUP BY?",
      options: [
        "Error de violación de clave primaria inmutable.",
        "Error de expresión no agregada: la columna debe figurar en la cláusula GROUP BY o utilizarse en una función de agregación.",
        "Error de sintaxis Fiori: la fecha debe convertirse a texto plano.",
        "Ninguno, SAP B1 agrupa automáticamente por todas las columnas."
      ],
      answer: 1,
      explanation: "En el estándar SQL y HANA, cualquier campo proyectado en el SELECT que no esté envuelto en una función de agregación (SUM, COUNT, MAX) debe estar listado en el GROUP BY.",
      topic: "Reglas de Agregación SQL",
      recommendedManualId: "CSI08_Query Practice_Solutions",
      recommendedManualTitle: "Práctica de Consultas: Soluciones"
    },
    {
      q: "¿Por qué en SAP Business One se recomienda clasificar las consultas en categorías dentro del Administrador de Consultas?",
      options: [
        "Porque el sistema no permite guardar más de tres consultas en una sola categoría.",
        "Porque las categorías permiten aplicar autorizaciones de usuario granulares, protegiendo reportes financieros confidenciales.",
        "Porque incrementa la velocidad de reloj del procesador del servidor.",
        "Porque es la única forma de que aparezcan en los menús de compras."
      ],
      answer: 1,
      explanation: "El Administrador de Consultas se enlaza al árbol de autorizaciones de SAP B1, permitiendo restringir o conceder acceso por categoría de consulta a usuarios o grupos.",
      topic: "Seguridad y Autorizaciones de Consultas",
      recommendedManualId: "CSI08_Query Practice_Solutions",
      recommendedManualTitle: "Práctica de Consultas: Soluciones"
    },
    {
      q: "¿Cómo se transforma una consulta SQL guardada en un origen de datos activo para un widget de KPI en el Cockpit Fiori?",
      options: [
        "Exportando el script a un archivo .bat en el escritorio.",
        "Abriendo Pervasive Analytics Designer y seleccionando la consulta guardada como dataset del KPI o dashboard interactivo.",
        "Cambiando el nombre de la consulta para que comience con la palabra 'KPI'.",
        "Enviándola como consulta directa al Administrador de Tareas de Windows."
      ],
      answer: 1,
      explanation: "Pervasive Analytics Designer es la herramienta nativa que se conecta directamente a las consultas guardadas para crear KPIs, dashboards y vistas 360.",
      topic: "Publicación de Consultas a KPIs Fiori",
      recommendedManualId: "CSI08_Query Practice_Solutions",
      recommendedManualTitle: "Práctica de Consultas: Soluciones"
    },
    {
      q: "Si un reporte generado con el Generador de Consultas requiere ejecutarse de forma recurrente sin modificar código, ¿qué técnica implementa SAP B1?",
      options: [
        "Generador de consultas con parámetros dinámicos [%0], [%1] que solicitan las variables de usuario al ejecutar.",
        "Reescribir el query en cada inicio de sesión.",
        "Desconectar la base de datos para congelar los filtros.",
        "Instalar un software complementario de terceros."
      ],
      answer: 0,
      explanation: "Los parámetros dinámicos [%0], [%1] permiten que una misma consulta sirva para diferentes fechas, clientes o almacenes sin alterar el SQL.",
      topic: "Parámetros Reutilizables",
      recommendedManualId: "CSI08_Query Practice_Solutions",
      recommendedManualTitle: "Práctica de Consultas: Soluciones"
    }
  ],
  "CSL01_Introduction_ES": [
    {
      q: "En el Caso Práctico 1, ¿cuál es el procedimiento estándar para asignar una plantilla de Cockpit de Ventas a un usuario específico en SAP B1?",
      options: [
        "Editar el registro de Windows en la máquina cliente.",
        "Navegar a Gestión -> Definición -> General -> Plantillas de Cockpit y asignar la plantilla al usuario o departamento correspondiente.",
        "Modificar directamente el archivo de configuración XML en el servidor.",
        "Desinstalar e instalar de nuevo el cliente SAP."
      ],
      answer: 1,
      explanation: "Las plantillas de Cockpit se gestionan y asignan centralizadamente desde Gestión -> Definición -> General -> Plantillas de Cockpit.",
      topic: "Asignación Centralizada de Cockpit",
      recommendedManualId: "CSL01_Introduction_ES",
      recommendedManualTitle: "Caso Práctico: Introducción"
    },
    {
      q: "¿Cuál es el propósito primordial de la interfaz Fiori Cockpit en SAP Business One?",
      options: [
        "Reemplazar la base de datos relacional por archivos de texto.",
        "Proporcionar un entorno de trabajo visual con widgets de KPIs, accesos directos y analítica en tiempo real orientado al rol del usuario.",
        "Bloquear el acceso de los empleados a los módulos de finanzas.",
        "Eliminar la necesidad de licencias profesionales."
      ],
      answer: 1,
      explanation: "Fiori Cockpit transforma la experiencia operativa en un panel interactivo con widgets dinámicos y analítica inmediata orientada al rol laboral.",
      topic: "Arquitectura de Fiori Cockpit",
      recommendedManualId: "CSL01_Introduction_ES",
      recommendedManualTitle: "Caso Práctico: Introducción"
    },
    {
      q: "Al configurar las Parametrizaciones de Usuario en SAP B1, ¿qué beneficio operativo aporta definir valores por defecto (Default Values)?",
      options: [
        "Desactiva las alertas automáticas del sistema.",
        "Automatiza la asignación de almacén, serie de numeración y condiciones de pago al crear documentos, reduciendo tiempos y errores.",
        "Permite contabilizar asientos sin partida doble.",
        "Impide que el usuario cierre sesión al final del día."
      ],
      answer: 1,
      explanation: "Los valores por defecto preasignan almacenes, series y listas de precios preferenciales para agilizar la captura de datos del operador.",
      topic: "Parametrizaciones de Usuario y Valores por Defecto",
      recommendedManualId: "CSL01_Introduction_ES",
      recommendedManualTitle: "Caso Práctico: Introducción"
    },
    {
      q: "¿Qué función cumple la flecha de enlace naranja presente en los formularios y widgets del Cockpit?",
      options: [
        "Abre el explorador de Windows.",
        "Permite realizar un drill-down inmediato para abrir el registro maestro o documento original en detalle.",
        "Borra el registro actual de la base de datos.",
        "Cambia el color de la ventana a modo nocturno."
      ],
      answer: 1,
      explanation: "La flecha de enlace naranja es el mecanismo nativo de navegación en profundidad (drill-down) que conecta cualquier vista con su origen.",
      topic: "Navegación Drill-down en SAP B1",
      recommendedManualId: "CSL01_Introduction_ES",
      recommendedManualTitle: "Caso Práctico: Introducción"
    },
    {
      q: "Si un usuario requiere agregar un nuevo widget a su Cockpit personal, ¿cuál es el icono o acción dentro del entorno Fiori?",
      options: [
        "Presionar Ctrl + Alt + Supr.",
        "Hacer clic en el icono '+' o 'Galería de Widgets' y arrastrar el widget deseado al lienzo del Cockpit.",
        "Reiniciar el servicio de SQL Server.",
        "Enviar un correo al soporte técnico de SAP internacional."
      ],
      answer: 1,
      explanation: "La galería de widgets permite a los usuarios con permisos explorar, activar y ubicar dashboards y accesos directos en su área de trabajo.",
      topic: "Personalización del Espacio de Trabajo",
      recommendedManualId: "CSL01_Introduction_ES",
      recommendedManualTitle: "Caso Práctico: Introducción"
    }
  ],
  "CSL01_Introduction_Solution_ES": [
    {
      q: "Según la solución sugerida del caso práctico, ¿cómo se valida que una plantilla de cockpit fue asignada correctamente y está activa?",
      options: [
        "Verificando que al reiniciar la sesión del usuario se desplieguen los widgets y el menú configurados según la plantilla asignada.",
        "Ejecutando un script de comprobación en la consola de comandos de Windows.",
        "Revisando que el fondo de pantalla de Windows haya cambiado a color azul.",
        "Comprobando que no se pueda acceder al menú de ayuda de SAP."
      ],
      answer: 0,
      explanation: "La activación del cockpit asignado se valida al ingresar con el usuario y constatar los widgets de KPIs y accesos directos configurados para su perfil.",
      topic: "Validación de Plantilla de Cockpit",
      recommendedManualId: "CSL01_Introduction_Solution_ES",
      recommendedManualTitle: "Caso Práctico: Introducción (Solución)"
    },
    {
      q: "Si tras asignar un Cockpit de Ventas un widget analítico reporta 'No hay datos disponibles', ¿cuál es el diagnóstico técnico adecuado según la solución?",
      options: [
        "El servidor SAP está dañado irreversiblemente.",
        "No existen transacciones en el sistema que cumplan los filtros del widget o el usuario carece de autorizaciones sobre el grupo de datos analizado.",
        "El monitor de la computadora no es compatible con SAP Business One.",
        "El cockpit solo funciona los fines de semana."
      ],
      answer: 1,
      explanation: "Los widgets dependen de la existencia de datos transaccionales en el período consultado y de que el usuario tenga permisos sobre esos objetos de negocio.",
      topic: "Diagnóstico de Datos en Widgets",
      recommendedManualId: "CSL01_Introduction_Solution_ES",
      recommendedManualTitle: "Caso Práctico: Introducción (Solución)"
    },
    {
      q: "¿Por qué en la solución del caso práctico se enfatiza la importancia de 'Publicar' la plantilla de Cockpit tras configurarla?",
      options: [
        "Para que la plantilla pase de modo borrador a estado disponible y pueda ser heredada por los usuarios designados.",
        "Para enviarla automáticamente a las redes sociales de la empresa.",
        "Para bloquear el acceso a internet de los puestos de trabajo.",
        "Para generar una copia en formato PDF en el servidor."
      ],
      answer: 0,
      explanation: "Las plantillas en SAP B1 deben publicarse para que queden habilitadas formalmente para los usuarios y perfiles asignados.",
      topic: "Publicación de Plantillas Corporativas",
      recommendedManualId: "CSL01_Introduction_Solution_ES",
      recommendedManualTitle: "Caso Práctico: Introducción (Solución)"
    },
    {
      q: "¿Qué ventaja tiene vincular valores por defecto de sucursal y almacén a un usuario en lugar de definirlos a nivel de empresa global?",
      options: [
        "Permite que usuarios de diferentes centros logísticos operen simultáneamente con sus propios almacenes sin seleccionar manualmente en cada documento.",
        "Ninguna, todos los usuarios deben usar siempre el mismo almacén general.",
        "Reduce el tamaño de la base de datos a la mitad.",
        "Elimina los impuestos de las facturas de venta."
      ],
      answer: 0,
      explanation: "Las parametrizaciones por usuario adaptan el ERP a la ubicación geográfica y función de cada operador, evitando errores de digitación en almacenes y sucursales.",
      topic: "Gestión Multisede y Parámetros Locales",
      recommendedManualId: "CSL01_Introduction_Solution_ES",
      recommendedManualTitle: "Caso Práctico: Introducción (Solución)"
    },
    {
      q: "¿Cuál es el rol del superusuario ('manager') frente a las plantillas de Cockpit personalizadas por los usuarios?",
      options: [
        "Supervisar, estandarizar y restablecer la plantilla corporativa en caso de que un usuario modifique o elimine widgets esenciales.",
        "Eliminar periódicamente los usuarios del sistema.",
        "Impedir que los empleados abran el menú de ventas.",
        "Reinstalar el servidor mensualmente."
      ],
      answer: 0,
      explanation: "El administrador mantiene la gobernanza del sistema garantizando que todos los roles operativos cuenten con la información clave requerida por la empresa.",
      topic: "Gobernanza y Administración de Cockpits",
      recommendedManualId: "CSL01_Introduction_Solution_ES",
      recommendedManualTitle: "Caso Práctico: Introducción (Solución)"
    }
  ],
  "CSL02_Procurement_Process_ES": [
    {
      q: "En el ciclo de aprovisionamiento de SAP Business One (Caso Práctico 2), ¿qué documento inicia el compromiso formal de compra con el proveedor?",
      options: [
        "La Factura de Clientes.",
        "El Pedido de Compras (Purchase Order / OPOR).",
        "El Asiento Contable Manual.",
        "El Recibo de Producción."
      ],
      answer: 1,
      explanation: "El Pedido de Compras es el documento comercial que formaliza la solicitud de mercancías o servicios ante el proveedor bajo condiciones pactadas.",
      topic: "Inicio del Ciclo de Compras",
      recommendedManualId: "CSL02_Procurement_Process_ES",
      recommendedManualTitle: "Caso Práctico: Proceso de Aprovisionamiento"
    },
    {
      q: "Al crear el Pedido de Compras al proveedor Far East Imports (S10000), ¿qué impacto contable genera en el Libro Mayor?",
      options: [
        "Cero impacto contable en cuentas de mayor; no se crea asiento contable ni se incrementa el inventario físico.",
        "Genera un asiento debitando Gasto de Compras y acreditando Bancos.",
        "Aumenta inmediatamente el inventario disponible en el almacén central.",
        "Debita la cuenta de IVA por pagar automáticamente."
      ],
      answer: 0,
      explanation: "El Pedido de Compras es un documento netamente de compromiso logístico; no altera saldos contables ni existencias físicas en el almacén.",
      topic: "Impacto del Pedido de Compras",
      recommendedManualId: "CSL02_Procurement_Process_ES",
      recommendedManualTitle: "Caso Práctico: Proceso de Aprovisionamiento"
    },
    {
      q: "En la Tarea 2, al registrar la Entrada de Mercancías (OPDN) basada en el Pedido de Compras, ¿cuál es el asiento contable automático generado?",
      options: [
        "Débito a Inventario (aumento de activo) y Crédito a Compensación EM/RF (pasivo transitorio).",
        "Débito a Proveedor y Crédito a Caja General.",
        "Débito a Gastos de Administración y Crédito a Ventas.",
        "No se genera ningún asiento contable."
      ],
      answer: 0,
      explanation: "La Entrada de Mercancías incrementa el inventario físico y registra la contrapartida en la cuenta transitoria de compensación EM/RF a la espera de la factura oficial.",
      topic: "Contabilidad de Entrada de Mercancías (EM/RF)",
      recommendedManualId: "CSL02_Procurement_Process_ES",
      recommendedManualTitle: "Caso Práctico: Proceso de Aprovisionamiento"
    },
    {
      q: "Si en la Entrada de Mercancías se reciben solo 3 unidades de las 5 solicitadas en el Pedido original, ¿qué sucede con el Pedido?",
      options: [
        "Se cancela automáticamente y las 2 unidades restantes se pierden.",
        "Permanece con estado 'Abierto' con cantidad pendiente de 2 unidades para futuras entregas.",
        "Bloquea la cuenta corriente del proveedor por incumplimiento.",
        "Obliga a crear una factura por el total de 5 unidades."
      ],
      answer: 1,
      explanation: "SAP B1 gestiona entregas parciales de forma automática: la línea del Pedido queda abierta por el saldo no entregado.",
      topic: "Gestión de Entregas Parciales",
      recommendedManualId: "CSL02_Procurement_Process_ES",
      recommendedManualTitle: "Caso Práctico: Proceso de Aprovisionamiento"
    },
    {
      q: "Al copiar la Entrada de Mercancías a una Factura de Proveedores (OPCH), ¿qué sucede con la cuenta transitoria de Compensación EM/RF?",
      options: [
        "Se debita la cuenta de Compensación EM/RF (saldándose a cero) y se acredita la cuenta por pagar del Proveedor.",
        "Permanece con saldo positivo indefinidamente.",
        "Se transfiere a una cuenta de pérdidas acumuladas.",
        "Se duplica el saldo para pagar impuestos adicionales."
      ],
      answer: 0,
      explanation: "La Factura de Proveedores cierra el pasivo temporal debitando la cuenta EM/RF y reconoce la deuda formal definitiva a favor del proveedor.",
      topic: "Compensación de Factura de Proveedores",
      recommendedManualId: "CSL02_Procurement_Process_ES",
      recommendedManualTitle: "Caso Práctico: Proceso de Aprovisionamiento"
    }
  ],
  "CSL02_Procurement_Process_Solution_ES": [
    {
      q: "Al abrir el Mapa de Relaciones en la solución del caso práctico de aprovisionamiento, ¿qué estructura visual representa el flujo completo exitoso?",
      options: [
        "Un árbol jerárquico que conecta Pedido de Compras -> Entrada de Mercancías -> Factura de Proveedores con estado Cerrado.",
        "Una gráfica de barras con los precios de la competencia.",
        "Un diagrama circular sin conexiones entre documentos.",
        "Una lista de correos electrónicos enviados al proveedor."
      ],
      answer: 0,
      explanation: "El Mapa de Relaciones muestra el árbol documental completo, permitiendo auditar la trazabilidad desde la orden inicial hasta la factura final.",
      topic: "Trazabilidad en el Mapa de Relaciones",
      recommendedManualId: "CSL02_Procurement_Process_Solution_ES",
      recommendedManualTitle: "Caso Práctico: Aprovisionamiento (Solución)"
    },
    {
      q: "Si el precio unitario en la Factura de Proveedores difiere del precio registrado en la Entrada de Mercancías, ¿cómo maneja SAP B1 la diferencia?",
      options: [
        "Rechaza el documento y apaga el sistema.",
        "Contabiliza la diferencia en la cuenta de 'Desviación de Precio / Variación de Costos' o ajusta el costo del stock según el método de valoración.",
        "Obliga al proveedor a devolver el dinero en efectivo inmediatamente.",
        "Modifica retroactivamente el Pedido original sin dejar rastro de auditoría."
      ],
      answer: 1,
      explanation: "SAP B1 calcula las variaciones de precio y las aplica a cuentas de desviación de compras o al costo de inventario respetando el método de valoración (FIFO, Promedio Ponderado, Estándar).",
      topic: "Desviaciones de Precio en Compras",
      recommendedManualId: "CSL02_Procurement_Process_Solution_ES",
      recommendedManualTitle: "Caso Práctico: Aprovisionamiento (Solución)"
    },
    {
      q: "En la solución, ¿por qué el sistema impide cancelar directamente una Entrada de Mercancías que ya ha sido facturada?",
      options: [
        "Porque para mantener la integridad contable y fiscal, primero debe abonarse o anularse la Factura de Proveedores mediante una Nota de Crédito.",
        "Porque las entradas de mercancías nunca pueden modificarse bajo ninguna circunstancia.",
        "Porque el usuario no tiene instalada la versión en inglés de SAP.",
        "Porque el proveedor debe autorizarlo mediante una carta notariada."
      ],
      answer: 0,
      explanation: "La cadena de documentos bloquea la cancelación en reversa mientras existan documentos subsecuentes activos; se debe cancelar primero la factura.",
      topic: "Reglas de Bloqueo Documental en SAP B1",
      recommendedManualId: "CSL02_Procurement_Process_Solution_ES",
      recommendedManualTitle: "Caso Práctico: Aprovisionamiento (Solución)"
    },
    {
      q: "¿Qué reporte del módulo de inventario certifica con exactitud el ingreso de las cantidades y el valor monetario tras la Entrada de Mercancías?",
      options: [
        "El Informe de Auditoría de Stocks (Stock Audit Report).",
        "El Balance de Apertura de Clientes.",
        "El Catálogo de Cuentas Financieras.",
        "La Lista de Empleados del Departamento."
      ],
      answer: 0,
      explanation: "El Informe de Auditoría de Stocks desglosa cada movimiento de entrada y salida con fecha, documento origen, cantidad y costo unitario.",
      topic: "Auditoría de Stocks y Movimientos de Inventario",
      recommendedManualId: "CSL02_Procurement_Process_Solution_ES",
      recommendedManualTitle: "Caso Práctico: Aprovisionamiento (Solución)"
    },
    {
      q: "¿Cuál es el estado final de un Pedido de Compras cuando todas sus líneas han sido 100% recibidas y facturadas?",
      options: [
        "Pendiente de Aprobación.",
        "Cerrado (Closed) automáticamente por el sistema.",
        "Cancelado por Vencimiento.",
        "Borrador en Proceso."
      ],
      answer: 1,
      explanation: "Al completarse la recepción y facturación de la totalidad de las cantidades ordenadas, SAP B1 actualiza el estado del Pedido a 'Cerrado'.",
      topic: "Cierre del Ciclo de Compras",
      recommendedManualId: "CSL02_Procurement_Process_Solution_ES",
      recommendedManualTitle: "Caso Práctico: Aprovisionamiento (Solución)"
    }
  ]
};

// Generador de preguntas complejas y desafiantes para cualquier manual
export function getQuizForManual(manualId: string, manualTitle: string, manualCategory: string): QuizQuestion[] {
  if (MANUAL_SPECIFIC_QUIZZES[manualId]) {
    return MANUAL_SPECIFIC_QUIZZES[manualId];
  }

  return [
    {
      q: `En la arquitectura empresarial de SAP Business One para "${manualTitle}", ¿cuál es el objetivo crítico que cumple este proceso en la operación?`,
      options: [
        "Almacenar registros temporales que se depuran automáticamente al final de cada turno.",
        `Garantizar la consistencia transaccional y la trazabilidad integral dentro del módulo de ${manualCategory}.`,
        "Duplicar manualmente la información contable en hojas de cálculo externas.",
        "Evitar que los usuarios utilicen la barra de herramientas del sistema."
      ],
      answer: 1,
      explanation: `El proceso de ${manualTitle} asegura que las operaciones queden registradas con validaciones de integridad en la base de datos de SAP B1.`,
      topic: `Fundamentos de ${manualTitle}`,
      recommendedManualId: manualId,
      recommendedManualTitle: manualTitle
    },
    {
      q: `Al configurar los parámetros correspondientes a "${manualTitle}", ¿qué control técnico ejerce SAP Business One para proteger los datos?`,
      options: [
        "Desconecta a todos los usuarios del sistema mientras se realiza la configuración.",
        "Aplica validaciones de integridad referencial y permisos de usuario basados en el perfil de autorizaciones.",
        "Permite que cualquier usuario sin credenciales modifique las cuentas contables asociadas.",
        "Convierte la base de datos a formato de solo lectura de forma irrevocable."
      ],
      answer: 1,
      explanation: "SAP Business One protege cada configuración mediante matrices de roles, autorizaciones de usuario y candados de integridad referencial.",
      topic: `Seguridad y Permisos en ${manualTitle}`,
      recommendedManualId: manualId,
      recommendedManualTitle: manualTitle
    },
    {
      q: `Si durante la ejecución de las tareas descritas en "${manualTitle}" ocurre una inconsistencia en los valores, ¿cuál es la mejor práctica recomendada por SAP?`,
      options: [
        "Modificar las tablas directamente mediante un script de base de datos no auditado.",
        "Revisar el mapa de relaciones del documento, el registro de auditoría de stocks o el log de modificaciones del sistema.",
        "Eliminar la base de datos de la empresa y volverla a crear desde cero.",
        "Ignorar el mensaje y forzar el cierre del cliente SAP con el Administrador de Tareas."
      ],
      answer: 1,
      explanation: "El Mapa de Relaciones y el Log de Modificaciones de SAP B1 son las herramientas estándar para rastrear el origen de cualquier discrepancia.",
      topic: `Auditoría y Trazabilidad en ${manualTitle}`,
      recommendedManualId: manualId,
      recommendedManualTitle: manualTitle
    },
    {
      q: `¿Qué impacto tiene en la contabilidad general de la empresa la correcta ejecución de "${manualTitle}"?`,
      options: [
        "No genera ningún impacto ya que es un proceso exclusivamente decorativo.",
        `Actualiza en tiempo real las cuentas de mayor y centros de costo asignados según la determinación de cuentas de ${manualCategory}.`,
        "Borra el historial de auditoría de períodos fiscales anteriores.",
        "Obliga a recalcular manualmente el balance general en Excel."
      ],
      answer: 1,
      explanation: "En SAP B1 la contabilidad está 100% enlazada a las transacciones de negocio, asegurando estados financieros en línea.",
      topic: `Impacto Financiero de ${manualTitle}`,
      recommendedManualId: manualId,
      recommendedManualTitle: manualTitle
    },
    {
      q: `Al consultar los registros generados en "${manualTitle}" para una auditoría fiscal o externa, ¿qué herramienta proporciona la evidencia más concluyente?`,
      options: [
        "Una captura de pantalla enviada por chat sin fecha.",
        "El informe nativo de auditoría del sistema con fecha, hora, usuario y número de transacción de base de datos inmutable.",
        "Un archivo de texto plano editable por cualquier empleado.",
        "La memoria verbal de los operadores de turno."
      ],
      answer: 1,
      explanation: "Los reportes nativos y el log de transacciones de SAP B1 poseen valor legal y de auditoría inmutable bajo normas internacionales.",
      topic: `Reportes y Auditoría en ${manualTitle}`,
      recommendedManualId: manualId,
      recommendedManualTitle: manualTitle
    }
  ];
}
