UNIDAD 049: HERRAMIENTAS DE IMPLEMENTACIÓN - ASISTENTE DE CONFIGURACIÓN RÁPIDA (EXPRESS WIZARD) (SAP BUSINESS ONE 10.0)
Código de Manual: 10_Impl_22_ImplTools_ExpressWizard_ES
Módulo Oficial: Herramientas de Implementación / Inicialización del Sistema
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores de Implementación, Arquitectos de Soluciones, Administradores del Sistema y Agentes IA (Antigravity)
Carpeta Asociada: 049_10_Impl_22_ImplTools_ExpressWizard_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "049",

  "topic": "Express Configuration Wizard & Initial Company Setup",

  "sap_module": "Implementation_SystemSetup_ExpressWizard",

  "system_infrastructure": {

    "sld_url": "https://<Server>:<Port>/ControlCenter",

    "site_user": "B1SiteUser (Superusuario de infraestructura requerido para crear sociedades y upgrades)",

    "grace_period": "31 días de evaluación sin licencia requerida",

    "core_tables": {

      "company_details": "CINF / OADM",

      "posting_periods": "OFPR",

      "chart_of_accounts": "OACT",

      "default_super_user": "manager (Creado por defecto al inicializar la base de datos)"

    }

  },

  "menu_paths": [

    "Gestión > Seleccionar empresa > Nueva con el asistente",

    "Gestión > Inicialización del sistema > Centro de implementación > Tareas de implementación > Configurar parametrizaciones de empresa",

    "Gestión > Inicialización del sistema > Centro de implementación > Gestión de configuración"

  ],

  "configuration_sequence_7_steps": [

    { "step": 1, "module": "Detalles de la empresa", "scope": "Nombre de sociedad, información legal, monedas local y del sistema, clonación de UDF/UDT/UDO" },

    { "step": 2, "module": "Contabilidad / Finanzas", "scope": "Plan de cuentas (Modelo vs Definido por usuario), Inventario Permanente, Almacenes e Impuestos" },

    { "step": 3, "module": "Gestión de bancos", "scope": "Bancos nacionales, Cuentas de banco propio y cuentas puente de compensación" },

    { "step": 4, "module": "Interlocutores comerciales", "scope": "Grupos de clientes y proveedores, condiciones de pago estándar y vías de cobro" },

    { "step": 5, "module": "Inventario (Stock)", "scope": "Grupos de artículos, métodos de costeo (PMP, FIFO, Estándar), listas de precios y ciclos de recuento" },

    { "step": 6, "module": "Compras y ventas", "scope": "Parametrizaciones de documento, series de numeración, redondeos y tolerancias" },

    { "step": 7, "module": "Usuarios", "scope": "Cuentas de usuario, asignación de licencias y perfiles de autorización general" }

  ],

  "irreversible_settings_warning": {

    "visual_indicator": "Signo de exclamación rojo (!)",

    "behavior": "Una vez que se contabiliza la primera transacción en la base de datos, estas parametrizaciones se bloquean permanentemente en el asistente y en la BD",

    "critical_irreversible_flags": [

      "Localización del país",

      "Moneda local y de sistema",

      "Estructura base del Plan de Cuentas",

      "Sistema de Inventario Permanente (No se puede desactivar)",

      "Método de valoración por Almacén vs Empresa"

    ]

  },

  "audit_and_configuration_tracking": {

    "configuration_report": "Genera una instantánea completa (Snapshot) con cada ejecución del asistente",

    "configuration_management_tool": "Permite comparar dos informes históricos (Baseline vs Actual) para detectar modificaciones no autorizadas hechas fuera del asistente"

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Creación de Sociedades y el System Landscape Directory (SLD)
En la arquitectura de SAP Business One 10.0, la creación de nuevas bases de datos empresariales está desacoplada de la interfaz operativa del usuario y protegida por la infraestructura centralizada del System Landscape Directory (SLD):

Para crear una base de datos se requiere la credencial maestra de infraestructura B1SiteUser.
Al acceder a Gestión > Seleccionar empresa, el consultor dispone de dos alternativas:
Nueva (Estándar): Crea la base de datos vacía, obligando al consultor a navegar dispersamente por decenas de ventanas de parametrización manual.
Nueva con el Asistente (Express Configuration Wizard): Crea la base de datos e inmediatamente inicia un asistente estructurado que organiza las parametrizaciones en una secuencia lógica estandarizada.
Periodo de Prueba: Toda nueva base de datos puede operar en modo demostración durante 31 días sin necesidad de asignar licencias definitivas.
2.2 Parámetros Iniciales Inmutables
Durante el primer paso del asistente se introducen los datos de identidad corporativa con consecuencias estructurales permanentes:

Localización Legal (País): Define las tablas tributarias nativas, reportes fiscales obligatorios y plantillas de plan de cuentas. No puede cambiarse jamás tras la creación de la empresa.
Modelo del Plan de Cuentas:
Modelo predeterminado: Crea el árbol contable oficial del país con cuentas precargadas en los cajones de activo, pasivo, patrimonio, ingresos y gastos.
Definido por el usuario: Crea únicamente los cajones superiores vacíos, permitiendo importar un plan contable corporativo propio. No admite cambios estructurales tras contabilizar el primer asiento.
Ejercicio Contable Más Antiguo: Se deben definir obligatoriamente los períodos contables del año fiscal más antiguo que se requerirá para cargar saldos históricos. SAP B1 no permite crear periodos contables retroactivos hacia el pasado una vez creada la sociedad.
Clonación de Objetos: Permite heredar tablas (UDT), campos (UDF) y objetos (UDO) desde otra sociedad existente en el mismo servidor.
2.3 Secuencia Lógica de Configuración (Los 7 Pasos)
El Asistente de Configuración Rápida resuelve el problema de las dependencias circulares guiando al consultor a través de un orden riguroso:

¿Por qué Finanzas antes que Artículos? Porque los Grupos de Artículos exigen tener creadas las Cuentas Contables de Existencias y Costo de Ventas.
¿Por qué Bancos antes que Interlocutores Comerciales? Porque los Clientes y Proveedores requieren tener asignadas Vías de Pago vinculadas a Cuentas de Banco Propio.
¿Por qué Compras/Ventas antes que Usuarios? Porque los Usuarios requieren tener definidas las Series de Numeración y Límites de Documento para sus autorizaciones.
2.4 Alertas de Irreversibilidad y Auditoría de Configuraciones
Signo de Exclamación Rojo (!): El asistente advierte visualmente qué campos quedarán congelados de por vida tras el inicio transaccional. Al registrarse el primer asiento, estos campos se sombrean en gris y quedan bloqueados contra escritura.
Gestión de Configuración (Configuration Management):
Cada vez que se ejecuta el asistente, el sistema graba una instantánea inmutable en el historial.
Si un usuario o consultor realiza una modificación directa por el menú de gestión tradicional (fuera del asistente), la herramienta de comparación de configuraciones detecta la discrepancia entre la línea base grabada y el estado actual de la base de datos, entregando una pista de auditoría completa.


3. ATLAS DIDÁCTICO: EL FLUJO DE CREACIÓN CON EL ASISTENTE EXPRÉS
               [ INICIO: B1SiteUser en SLD ]

                            │

               [ VENTANA SELECCIONAR EMPRESA ]

             "Nueva con Asistente de Configuración"

                            │

   ┌────────────────────────┴────────────────────────┐

   ▼                                                 ▼

[ DATOS ESTRUCTURALES ]                     [ PERIODOS CONTABLES ]

• Localización (País - Inmutable)           • Ejercicio más antiguo requerido

• Plan de Cuentas (Modelo / Usuario)        • Rango de vencimiento ampliado

• Moneda Local y de Sistema                 • Creación de usuario "manager"

   │                                                 │

   └────────────────────────┬────────────────────────┘

                            ▼

        [ EJECUCIÓN SECUENCIAL DEL ASISTENTE EXPRÉS ]

     1. Detalles Empresa    ──> 2. Contabilidad & Almacenes (!)

     3. Gestión Bancos      ──> 4. Interlocutores Comerciales

     5. Inventario & Costo  ──> 6. Compras, Ventas & Series

     7. Usuarios & Permisos

                            │

                            ▼

        [ INFORME DE CONFIGURACIÓN & LÍNEA BASE AUDITABLE ]


4. CASO DE NEGOCIO RESUELTO: CREACIÓN DE NUEVA SUCURSAL EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers expande sus operaciones y requiere crear una nueva empresa en el servidor para su división mayorista OEC Wholesale Ltd. El director de finanzas exige que la configuración siga los mismos estándares contables que la casa matriz y solicita una copia de seguridad documental de todos los parámetros aplicados para auditoría externa.
Procedimiento con el Asistente de Configuración Rápida:
En Gestión > Seleccionar empresa, el consultor pulsa Nueva con el asistente.
Ingresa la clave maestra B1SiteUser.
Especifica:
Nombre de base de datos: OEC_WHOLESALE.
Localización: Estados Unidos / Ecuador.
Marca la casilla Copiar UDFs y UDTs desde OEC_COMPUTERS_PROD.
Define el ejercicio fiscal 2026 con 12 subperíodos mensuales.
El asistente crea las tablas y el consultor avanza por los 7 pasos configurando:
Moneda Local = USD.
Inventario permanente = Activo con método PMP.
Bancos propios y series de numeración estándar.
Al finalizar, el sistema genera el Informe de Configuración Estándar, el cual se exporta a PDF y se entrega a la gerencia general como entregable de cierre de fase Blueprint.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Qué credencial de seguridad del sistema es estrictamente requerida para poder crear una nueva base de datos de empresa en SAP Business One?
A) La contraseña del superusuario manager.
B) La clave de acceso del usuario del sitio (B1SiteUser), gestionada centralmente en el System Landscape Directory (SLD).
C) La firma electrónica del auditor externo.
D) La clave de Windows del administrador de dominio.
Respuesta Correcta: B
Justificación Técnica: La creación de empresas es una operación a nivel de servidor que altera el catálogo global de bases de datos, requiriendo obligatoriamente la autenticación de B1SiteUser en el SLD.
Pregunta 2
¿Cuál es la razón principal por la cual se recomienda utilizar la opción "Nueva con el asistente" en lugar de "Nueva" estándar al inicializar una empresa?
A) Porque el asistente instala automáticamente add-ons de terceros.
B) Porque guía al consultor a través de un orden secuencial recomendado según las dependencias relacionales de los datos, avisa de parámetros irreversibles con signos de exclamación rojos y genera un informe de auditoría de configuración.
C) Porque exime del pago de licencias de usuario durante un año.
D) Porque elimina la necesidad de definir cuentas de mayor.
Respuesta Correcta: B
Justificación Técnica: El Asistente de Configuración Rápida previene errores de configuración al asegurar que las entidades padre (como cuentas contables y bancos) se configuren antes de las entidades dependientes (como artículos y socios de negocios).
Pregunta 3
¿Qué herramienta del Centro de Implementación permite detectar si un usuario modificó parámetros del sistema directamente desde los menús de Gestión por fuera de los procedimientos aprobados?
A) El Asistente de Actualización de Licencias.
B) La herramienta "Gestión de configuración" (Configuration Management), comparando el estado actual de la base de datos contra los informes de configuración históricos grabados por el asistente.
C) El Generador de Consultas de Crystal Reports.
D) El Log de Mensajes del Sistema.
Respuesta Correcta: B
Justificación Técnica: La Gestión de configuración almacena instantáneas de configuración y permite comparar dos estados para identificar con exactitud qué parámetros cambiaron y auditar discrepancias.