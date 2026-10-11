UNIDAD 031: INTRODUCCIÓN A SAP BUSINESS ONE - PRIMEROS PASOS, NAVEGACIÓN Y COCKPIT FIORI
Código de Manual: 10_Intro_12_Overview_GettingStarted_ES
Módulo Oficial: Introducción y Administración del Sistema (System Administration & User Interface)
Versión de SAP: Business One 10.0 (HANA / SQL)
Audiencia Objetivo: Consultores Funcionales, Usuarios Clave, Desarrolladores de Extensiones y Agentes Autónomos IA (Antigravity)
Carpeta Asociada: 031_10_Intro_12_Overview_GettingStarted_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "031",

  "topic": "Getting Started, System Navigation & Fiori Cockpit Architecture",

  "sap_module": "Administration_UI",

  "database_tables": {

    "users_master": "OUSR",

    "user_groups": "OUSG",

    "user_group_assignments": "USR7",

    "user_defaults_display": "OUDG",

    "cockpit_configuration": "CPRF",

    "system_messages_log": "OALR",

    "company_administration": "OADM"

  },

  "menu_paths": [

    "Gestión > Seleccionar empresa",

    "Gestión > Inicialización del sistema > Parametrizaciones generales > Pestaña Cockpit",

    "Herramientas > Cockpit > Gestión de Cockpit",

    "Herramientas > Parametrizaciones de formulario > Menú principal",

    "Herramientas > Mis parametrizaciones personales"

  ],

  "system_architecture": {

    "company_db_model": "1 Sociedad Legal = 1 Base de Datos Transaccional independiente",

    "user_classes": {

      "Superuser": "Acceso total e irrestricto a todas las funciones y tablas del sistema; no sujeto a bloqueos de autorizaciones generales",

      "End_User": "Acceso restringido delimitado por tipo de licencia (Profesional, Limitada CRM/Logística/Financiera) y matriz de autorizaciones generales"

    },

    "cockpit_variants": {

      "SAP_HANA": "Habilita interfaz gráfica Fiori (HTML5), analíticas interactivas en memoria, búsqueda semántica y widgets avanzados",

      "Microsoft_SQL": "Cockpit clásico estándar o desactivado; no soporta entorno nativo Fiori HTML5"

    }

  },

  "widgets_matrix": {

    "operational_widgets": [

      { "name": "Workbench", "purpose": "Cubre el 80% de las transacciones diarias del rol (Ventas, Compras, Finanzas, Inventario) con flujos visuales interactivos" },

      { "name": "Funciones comunes", "purpose": "Accesos directos personalizables tipo 'un clic' arrastrando opciones de menú" },

      { "name": "Mis actualizaciones recientes", "purpose": "Historial de los últimos documentos y datos maestros consultados o modificados por el usuario" },

      { "name": "Mensajes y alertas", "purpose": "Centro de notificaciones internas de aprobaciones y desviaciones de negocio" },

      { "name": "Recuento de Business Object", "purpose": "Contadores numéricos basados en consultas SQL (ej. facturas abiertas, pedidos pendientes)" }

    ],

    "analytical_widgets": [

      { "name": "Paneles (Dashboards)", "purpose": "Gráficos de tendencias y análisis interactivos desarrollados en Pervasive Analytics o Crystal Reports" },

      { "name": "KPIs", "purpose": "Indicadores clave con metas numéricas, semáforos de color y vectores de tendencia ascendente/descendente" }

    ]

  },

  "system_navigation_shortcuts": {

    "F1": "Ayuda sensible al contexto de la pantalla activa",

    "Shift_F1": "Ayuda a nivel de campo (Field-level Help)",

    "Ctrl_Tab": "Abre tablas de selección o expande búsquedas en campos restringidos",

    "System_Message_Log": "Almacena los últimos 50 mensajes de advertencia, error o éxito con su código único de 8-9 dígitos"

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Modelo de Empresa y Conexión a Base de Datos
En la arquitectura de SAP Business One, cada entidad legal o razón social opera en una base de datos independiente en el motor de base de datos (SAP HANA o MS SQL Server).

Selección de Empresa: Al iniciar la aplicación, el usuario autentica sus credenciales y selecciona la base de datos correspondiente. La ventana Seleccionar empresa (Gestión > Seleccionar empresa) permite alternar entre sociedades o cambiar de usuario sin cerrar el cliente de escritorio.
Seguridad y Segregación de Funciones:
Los Superusuarios (marcados en OUSR.Superuser = 'Y') omiten todas las comprobaciones de la matriz de autorizaciones y acceden a cualquier transacción y parametrización de inicialización.
Los Usuarios Finales operan bajo un principio de mínimo privilegio: sus opciones de menú, accesos a informes y capacidades de creación/modificación están estrictamente controladas por la licencia y las autorizaciones grupales o individuales.
2.2 Navegación, Barras de Herramientas y Búsqueda Integrada
La interfaz gráfica de SAP Business One 10.0 ofrece múltiples capas ergonómicas:

Barra de Menús Superior: Contiene las funciones estándar de Windows (Fichero, Tratar, Datos, Ir a, Herramientas, Ventana, Ayuda).
Barra de Herramientas: Iconos de acceso rápido para operaciones frecuentes: Buscar (Ctrl+F), Añadir (Ctrl+A), Navegación de registros (Primero, Anterior, Siguiente, Último), Exportación a Microsoft Excel / Word (incluyendo integración con OneDrive / Office 365), Exportación a PDF y Bloqueo de pantalla.
Búsqueda de Menús: Ubicada en la parte superior del menú de Módulos, permite escribir palabras clave (ej. "maestros artículo") para desplegar y filtrar instantáneamente la ruta correspondiente sin tener que navegar por el árbol de carpetas.
Log de Mensajes del Sistema: Panel inferior flotante que conserva el historial de los últimos 50 mensajes emitidos. Cada mensaje crítico contiene un identificador único de 8 o 9 dígitos que sirve como clave de consulta para la documentación técnica y notas SAP.
2.3 Entorno de Cockpit Personalizado y Estilo Fiori
En las instancias implementadas sobre SAP HANA, SAP Business One despliega el Cockpit estilo Fiori, un espacio de trabajo HTML5 altamente interactivo:

Galería de Widgets: Accesible mediante el icono +, permite añadir componentes organizados en operativos y analíticos.
Los 4 Workbenches Estándar: Proporcionan flujos de trabajo preconfigurados para cuatro áreas neurálgicas:
Ventas: Oferta -> Pedido -> Entrega -> Factura de clientes -> Informes de partidas abiertas.
Compras: Solicitud de compra -> Pedido -> Entrada de mercancías -> Factura de proveedores.
Finanzas: Asientos, Pagos, Reconciliación interna/externa y Balances.
Inventario: Gestión de artículos, Ubicaciones, Traslados y Recuentos.
Gobierno de Modelos de Cockpit: Un consultor o superusuario puede diseñar un cockpit optimizado y publicarlo como Modelo (Template) vinculándolo a un grupo de usuarios de autorización (OUSG), asegurando que todos los miembros del departamento compartan la misma vista operativa.
Simplificación del Menú Principal: Mediante las Parametrizaciones de Formulario del menú principal (icono de llave inglesa), los usuarios pueden ocultar módulos o transacciones que no utilizan, agilizando la carga visual y reduciendo errores operativos.


3. CASO DE NEGOCIO RESUELTO: INDUCCIÓN Y CONFIGURACIÓN EN OEC COMPUTERS
Escenario de Negocio:
Alex se incorpora a OEC Computers como nuevo asistente de operaciones comerciales e inventario. El gerente de operaciones le solicita configurar su entorno de trabajo para que pueda procesar pedidos de venta, verificar existencias en almacén y monitorear los clientes de alto volumen, sin verse abrumado por las opciones financieras y de administración del sistema.
Configuración Paso a Paso:
Asignación de Rol y Grupo de Autorización:
El administrador de sistemas ingresa a Gestión > Configuración > General > Grupos de usuarios y vincula el usuario de Alex al grupo COMERCIAL_JR.
Se asigna el modelo de cockpit estándar de Ventas con acceso adicional a consultas de stock.
Personalización del Cockpit Fiori:
Alex activa la edición del cockpit con el icono de lápiz y añade:
El widget de Workbench de Ventas para ejecutar el flujo cotización-pedido-entrega.
El widget de Funciones comunes, arrastrando las transacciones Datos maestros de artículo y Lista de partidas abiertas.
Un widget de Recuento de Business Object configurado para mostrar Pedidos de cliente pendientes de entrega.
El panel analítico Top 5 artículos más vendidos.
Depuración del Menú de Módulos:
Mediante Parametrizaciones de formulario - Menú principal, Alex oculta los módulos Gestión de bancos, Producción y Recursos, dejando un menú limpio enfocado exclusivamente en Ventas e Inventario.
Resultado Operativo:
Alex opera desde su primer día con un entorno visual intuitivo, reduciendo los tiempos de capacitación en un 60% y ejecutando sus labores cotidianas con acceso de un clic.


4. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál es la diferencia fundamental entre un Superusuario y un Usuario Normal en SAP Business One en relación con la matriz de autorizaciones generales?
A) Los superusuarios solo pueden acceder a la empresa durante el horario de oficina.
B) Los superusuarios tienen acceso absoluto a todos los módulos, pantallas y bases de datos; la matriz de autorizaciones generales no aplica restricciones sobre ellos.
C) Los superusuarios requieren licencias especiales de tipo CRM exclusivamente.
D) Los usuarios normales pueden modificar el plan de cuentas sin restricciones pero no pueden crear clientes.
Respuesta Correcta: B
Justificación Técnica: En SAP Business One, el flag de superusuario en OUSR.SUPERUSER invalida cualquier restricción de autorización, otorgando permisos totales sobre todas las entidades y datos del sistema.
Pregunta 2
Un usuario en SAP Business One desea consultar ayuda sobre el significado específico del campo "Condiciones de pago" dentro del maestro de clientes. ¿Qué comando o atajo debe utilizar?
A) Presionar la tecla F1 directamente.
B) Posicionarse sobre el campo y presionar Shift + F1.
C) Hacer clic derecho y seleccionar "Eliminar fila".
D) Presionar Ctrl + Tab.
Respuesta Correcta: B
Justificación Técnica: Mientras que F1 abre la ayuda sensible a la ventana completa, la combinación Shift + F1 invoca la ayuda a nivel de campo (Field-level Help), detallando la definición técnica y reglas de negocio del campo enfocado.
Pregunta 3
¿Bajo qué plataforma de base de datos es posible activar y utilizar la interfaz gráfica del Cockpit estilo Fiori con widgets HTML5 en SAP Business One 10.0?
A) Exclusivamente en SAP HANA.
B) Exclusivamente en Microsoft SQL Server 2019.
C) En cualquier base de datos incluyendo Oracle y DB2.
D) Solo cuando el cliente se ejecuta en sistemas operativos Linux.
Respuesta Correcta: A
Justificación Técnica: La interfaz Fiori HTML5, sus capas semánticas de analítica interactiva y los paneles Pervasive Analytics están diseñados para explotar el motor de computación en memoria de SAP HANA; no están disponibles en la versión para MS SQL Server.