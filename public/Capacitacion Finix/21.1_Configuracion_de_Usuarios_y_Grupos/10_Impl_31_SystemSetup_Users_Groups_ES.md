UNIDAD 023: CONFIGURACIÓN DEL SISTEMA - USUARIOS, GRUPOS Y POLÍTICAS DE SEGURIDAD (SAP BUSINESS ONE 10.0)
Código de Manual: 10_Impl_31_SystemSetup_Users_Groups_ES
Módulo Oficial: Configuración y Gestión del Sistema (System Setup / Security & Administration)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Administradores del Sistema SAP, Consultores Funcionales, Oficiales de Seguridad IT y Agentes IA (Antigravity)
Carpeta Asociada: 023_10_Impl_31_SystemSetup_Users_Groups_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "023",

  "topic": "System Setup: Users, User Groups & Security Policies",

  "sap_module": "Administration_Security",

  "database_tables": {

    "users": "OUSR",

    "user_groups": "OUGR",

    "user_group_members": "USR1",

    "user_defaults": "OUDG",

    "user_authorizations": "USR3",

    "employees": "OHEM"

  },

  "menu_paths": [

    "Gestión > Definición > General > Usuarios",

    "Gestión > Definición > General > Grupos de usuarios",

    "Gestión > Definición > General > Opciones de usuario",

    "Gestión > Configuración > General > Seguridad > Gestión de claves de acceso",

    "Gestión > Licencia > Gestión de licencias"

  ],

  "predefined_system_users": {

    "manager": "Superusuario maestro creado automáticamente al inicializar la base de datos de la empresa.",

    "B1i": "Usuario técnico interno utilizado por el marco de integración (B1iF) para escenarios móviles y servicios web.",

    "Workflow": "Usuario de servicio utilizado para conectar el motor de flujos de trabajo de SAP B1.",

    "AlertSvc": "Usuario técnico interno para la entrega de alertas automáticas en segundo plano.",

    "Support": "Cuenta especial utilizada por consultores de soporte mediante la Plataforma de Soporte Remoto (RSP), sin consumo de licencias."

  },

  "user_account_types": {

    "Superuser": {

      "privileges": "Acceso total, irrestricto e inmodificable a todas las funciones y menús del sistema. Puede crear usuarios, redefinir permisos y gestionar licencias.",

      "license_required": "Licencia Profesional (Professional License) obligatoria."

    },

    "Normal_User": {

      "privileges": "Sin acceso por defecto. Sus permisos se definen mediante la asignación de Licencia (Profesional o Limitada) y la matriz de Autorizaciones Generales.",

      "group_inheritance": "Hereda autorizaciones, alertas, formatos de IU y parametrizaciones de formulario de sus grupos asignados."

    },

    "Mobile_User": {

      "privileges": "Habilita acceso a las aplicaciones móviles oficiales de SAP Business One (iOS y Android).",

      "requirements": "Número de teléfono móvil, ID de dispositivo (dirección MAC), escenario sap.B1Mobile activo en B1iF y asignación de licencia técnica gratuita B1i."

    }

  },

  "user_group_types": [

    { "type": "Autorización", "target_window": "Autorizaciones generales" },

    { "type": "Alertas", "target_window": "Gestión de alarmas / Mensajes" },

    { "type": "Parametrizaciones de formulario", "target_window": "Copiar parametrizaciones de formulario" },

    { "type": "Modelos de configuración de IU", "target_window": "Configuración del modelo de IU" },

    { "type": "En todos los tipos", "target_window": "Aparece simultáneamente en las cuatro ventanas de configuración" }

  ],

  "hierarchy_of_settings": {

    "rule": "La parametrización más específica sustituye a la más amplia.",

    "order_of_precedence": [

      "1. Cuenta de usuario (Mis parametrizaciones personales) [MÁXIMA PRIORIDAD]",

      "2. Opciones de usuario / Valores por defecto (OUDG)",

      "3. Parametrizaciones generales de la empresa [BASE]"

    ]

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Configuración de Cuentas de Usuario (OUSR)
Para operar en SAP Business One, cada persona física requiere una cuenta unívoca:

Código de Usuario: Cadena alfanumérica de hasta 8 caracteres que distingue estrictamente entre mayúsculas y minúsculas. Una vez creada y guardada en la base de datos, el código de usuario no se puede modificar ni renombrar jamás.
Retirada de Cuentas: Si un usuario deja la organización, su cuenta puede ser marcada como bloqueada o eliminada (Datos > Eliminar). Por motivos de auditoría transaccional (CreatedBy/UpdatedBy), el registro permanece internamente en la tabla OUSR y el sistema no permitirá reutilizar el mismo código en el futuro. Antes de eliminar una cuenta, es obligatorio desasignar su licencia para evitar licencias huérfanas.
Integración con Datos Maestros de Empleados (OHEM): Vincular la cuenta con la ficha de empleado facilita la propiedad de datos (Data Ownership), organigramas departamentales y comisiones de venta.
2.2 Superusuarios vs Usuarios Estándar
Superusuario: No está sujeto al módulo de autorizaciones. Posee acceso absoluto por arquitectura de software y requiere una licencia Profesional.
Usuario Normal: Al crearse, nace sin permisos para ninguna ventana o reporte. Sus permisos deben construirse asignando licencias y configurando la matriz de autorizaciones o incorporándolo a Grupos de Usuarios.
2.3 Grupos de Usuarios: Gobernanza y Administración Escalable
En empresas con decenas o cientos de empleados, asignar permisos usuario por usuario es ineficiente y propenso a brechas de seguridad. SAP B1 10.0 implementa Grupos de Usuarios segmentados por propósito funcional:

Grupo de Autorización: Define la matriz de lectura/escritura en menús. Si un usuario se añade al grupo "Vendedores", hereda instantáneamente sus autorizaciones.
Grupo de Alertas: Permite suscribir a todo un departamento (ej. Contabilidad) a notificaciones de límites de crédito o desviaciones de presupuesto.
Grupo de Parametrizaciones de Formulario: Permite estandarizar columnas visibles, anchos de cuadrícula y campos obligatorios en documentos comerciales copiándolos en bloque desde un usuario maestro.
Grupo de Modelos de Configuración de IU: Asigna plantillas gráficas con campos reorganizados u ocultos.
Grupo "En todos los tipos": Es el contenedor maestro que permite aplicar las cuatro funciones anteriores de forma unificada.
2.4 Jerarquía de Parametrizaciones y Valores por Defecto
El entorno de trabajo del usuario se define en tres capas concéntricas con regla de precedencia estricta:

Parametrizaciones Generales: Aplican globalmente a toda la empresa (formato de fecha, idioma corporativo, moneda).
Opciones de Usuario (Valores por Defecto - OUDG): Se asignan a nivel de departamento o sucursal (ej. almacén de expedición predeterminado, cuentas de cheques/efectivo, subcarpeta de anexos).
Mis Parametrizaciones Personales: Ajustes individuales que cada usuario puede realizar en su sesión (color de ventana, comportamiento de la tecla Intro en teclado numérico como Tabulador). Esta configuración individual sobreescribe las anteriores.
2.5 Políticas de Claves de Acceso y Seguridad Corporativa
En Gestión > Configuración > General > Seguridad > Gestión de claves de acceso, los superusuarios configuran las políticas de contraseña:

Niveles de Seguridad: Baja (mínimo 4 caracteres, no expira), Media (mínimo 6 caracteres con números), Alta (mínimo 8 caracteres, mayúsculas, minúsculas, dígitos, expiración forzosa cada 30 días) o Personalizada.
Bloqueo Automático: La cuenta se bloquea tras un número determinado de intentos fallidos consecutivos, requiriendo desbloqueo explícito por un superusuario.


3. CASO DE NEGOCIO RESUELTO: DESPLIEGUE DEL DEPARTAMENTO DE VENTAS EN DG INDUSTRIES
Escenario de Consultoría:
DG Industries incorpora a 15 ejecutivos de ventas que utilizarán las mismas parametrizaciones de documentos, listas de precios y plantillas de interfaz en SAP Business One. La empresa exige una política de contraseñas de alta seguridad con cambio obligatorio en el primer inicio de sesión.
Estrategia de Implementación:
Política de Seguridad: El superusuario ingresa a Gestión de claves de acceso, activa el nivel Alta (mínimo 8 caracteres alfanuméricos) y establece bloqueo tras 3 intentos fallidos.
Valores por Defecto: En Opciones de usuario, se crea el perfil DEF_VENTAS asignando el Almacén 01 como almacén por defecto y configurando la exportación automática de ofertas en PDF.
Grupo de Usuarios: Se crea el grupo GRP_VENTAS de tipo En todos los tipos, añadiendo a los 15 usuarios.
Parametrizaciones de Formulario: El consultor configura el usuario Ventas_Master, ajusta las columnas visibles de la Factura de Clientes y utiliza el botón Copiar parametrizaciones de formulario hacia la pestaña Grupos, seleccionando GRP_VENTAS.
Resultado: Los 15 usuarios quedan operativos de forma simultánea en menos de 10 minutos, garantizando homogeneidad visual y cumplimiento de seguridad.


4. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál de las siguientes afirmaciones respecto a la creación y mantenimiento del "Código de usuario" (User Code) en SAP Business One es VERDADERA?
A) Puede contener hasta 20 caracteres y puede renombrarse en cualquier momento.
B) Distingue entre mayúsculas y minúsculas y, una vez grabado en la base de datos, NO se puede modificar jamás.
C) Es insensible a mayúsculas y minúsculas y se elimina automáticamente al desasignar la licencia.
D) Se genera obligatoriamente a partir del correo electrónico del empleado.
Respuesta Correcta: B
Justificación Técnica: El código de usuario es la clave primaria en la tabla OUSR, tiene un límite de 8 caracteres, es case-sensitive y queda grabado de forma inmutable para preservar la integridad histórica de auditoría.
Pregunta 2
Si un usuario tiene asignadas parametrizaciones en "Parametrizaciones generales", un perfil en "Opciones de usuario" y ha configurado sus propias opciones en "Mis parametrizaciones personales", ¿cuál de ellas tiene la MÁXIMA prioridad?
A) Las Parametrizaciones Generales de la empresa.
B) Las Opciones de Usuario (Valores por defecto).
C) La ventana "Mis parametrizaciones personales" en la cuenta individual del usuario.
D) Prevalecen únicamente las parametrizaciones del superusuario.
Respuesta Correcta: C
Justificación Técnica: En SAP Business One rige el principio de especificidad: las configuraciones más limitadas (a nivel de cuenta individual) tienen prioridad y sustituyen a las configuraciones más amplias definidas a nivel departamental o corporativo.
Pregunta 3
¿Qué requisitos técnicos son indispensables para habilitar a un usuario como "Usuario Móvil" en SAP Business One?
A) Marcar la casilla Superusuario y asignar una licencia CRM.
B) Marcar la casilla Usuario Móvil, ingresar el número de teléfono móvil, el ID de dispositivo (dirección MAC) y asignar una licencia B1i gratuita.
C) Conectarse exclusivamente mediante VPN corporativa sin B1iF.
D) Contratar una licencia Profesional adicional exclusiva para móviles.
Respuesta Correcta: B
Justificación Técnica: El acceso móvil requiere identificación del hardware del dispositivo mediante su MAC address, número telefónico para autenticación y la licencia técnica gratuita B1i que permite la comunicación vía Integration Framework (B1iF).