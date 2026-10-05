UNIDAD 026: GESTIÓN Y AUTORIZACIONES DE PROPIEDAD DE DATOS (DATA OWNERSHIP) EN SAP BUSINESS ONE 10.0
Código de Manual: 10_Impl_33_SystemSetup_DataOwnership_ES
Módulo Oficial: Gestión / Inicialización del Sistema / Autorizaciones
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Administradores de Seguridad, Auditores y Agentes IA (Antigravity)
Carpeta Asociada: 026_10_Impl_33_SystemSetup_DataOwnership_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "026",

  "topic": "Data Ownership Authorizations & Organizational Hierarchies",

  "sap_module": "SystemSetup_Security",

  "database_tables": {

    "employee_master_data": {

      "table": "OHEM",

      "key_fields": ["empID", "lastName", "firstName", "manager", "dept", "branch", "userId"],

      "description": "Núcleo organizacional que define jefes, departamentos, sucursales y vinculación a usuarios del sistema (OUSR)"

    },

    "business_partner_master": {

      "table": "OCRD",

      "key_fields": ["CardCode", "CardName", "OwnerCode", "SlpCode"],

      "description": "Maestro de IC con campo OwnerCode (propietario) y SlpCode (empleado de ventas)"

    },

    "marketing_documents": {

      "tables": ["ORDR", "ODLN", "OINV", "OPOR", "OPDN", "OPCH", "OQUT"],

      "key_fields": ["DocEntry", "DocNum", "OwnerCode", "SlpCode", "UserSign"],

      "description": "Documentos de marketing protegidos por propiedad de datos"

    },

    "data_ownership_permissions": {

      "headers": "OPDO",

      "lines": "PDO1",

      "description": "Matriz de autorizaciones de propiedad de datos por usuario, tipo de objeto y relación"

    }

  },

  "menu_paths": [

    "Gestión > Inicialización del sistema > Parametrizaciones generales > Ficha IC",

    "Gestión > Inicialización del sistema > Autorizaciones > Propiedad de datos > Autorizaciones de propiedad de datos",

    "Recursos humanos > Datos maestros de empleado"

  ],

  "data_ownership_methods": {

    "BP_Only": {

      "name": "Solo para interlocutor comercial",

      "behavior": "El propietario se define en OCRD y se hereda automáticamente a todos los documentos del IC. Restringe el acceso a los datos maestros en listas de selección, búsquedas e informes. Si el IC no tiene propietario y se permite, cualquiera accede."

    },

    "Document_Only": {

      "name": "Solo para documento",

      "behavior": "El maestro OCRD no tiene campo propietario ni se restringe. Cada documento asigna propietario al crearse según reglas de prelación: vendedor/comprador del IC con usuario vinculado > creador del documento con registro de empleado. Si no hay empleado vinculado, queda sin propietario."

    },

    "BP_and_Document": {

      "name": "Interlocutor comercial y documento (Híbrido)",

      "behavior": "Si el IC tiene propietario en OCRD, aplica la lógica de 'Solo IC'. Si el IC no tiene propietario, el documento aplica la lógica de 'Solo documento' evaluando al creador/vendedor."

    },

    "Branch": {

      "name": "Por sucursal",

      "condition": "Requiere función de Múltiples Sucursales activa. Autoriza el acceso por pertenencia de sucursal del usuario e IC."

    }

  },

  "organizational_relationships": {

    "Peer": "Compañero: Ambos empleados comparten el mismo jefe directo (campo manager en OHEM).",

    "Manager": "Jefe: El propietario del documento es el jefe directo del usuario.",

    "Subordinate": "Subordinado: El usuario es el jefe directo del propietario del documento.",

    "Team": "Equipo: Ambos empleados forman parte del mismo equipo definido en OHEM.",

    "Department": "Departamento: Ambos empleados pertenecen al mismo departamento.",

    "Branch": "Sucursal: Ambos empleados pertenecen a la misma sucursal.",

    "Company": "Empresa: Acceso global irrestricto, omite la propiedad de datos."

  },

  "permission_levels": {

    "Full": "Total (Lectura, creación y actualización)",

    "Read_Only": "Solo lectura (Consulta en documentos, listas e informes)",

    "None": "Ninguno (Sin acceso alguno)"

  },

  "conflict_rule": "Si existen autorizaciones solapadas por múltiples relaciones, prevalece la más generosa (Total > Solo lectura > Ninguno). Los superusuarios omiten toda restricción de propiedad."

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 El Rol de la Propiedad de Datos frente a las Autorizaciones Generales
En SAP Business One, las licencias y las autorizaciones generales (Gestión > Autorizaciones > Autorizaciones generales) determinan si un usuario puede ingresar a una ventana transaccional (ej. Facturas de Clientes). Sin embargo, bajo autorizaciones generales ordinarias, un vendedor puede consultar las ofertas y facturas de sus compañeros de departamento.

La Propiedad de los Datos (Data Ownership) introduce una capa de seguridad granular basada en la estructura jerárquica de la organización:

No viene activa por defecto: Se habilita en Parametrizaciones generales > Ficha IC.
Requisito estructural: Todos los usuarios que actúen como propietarios o que requieran acceder a datos ajenos deben tener una ficha activa en Recursos Humanos > Datos maestros de empleado (OHEM) vinculada a su cuenta de acceso (OUSR).
Exención: Los Superusuarios no están limitados por las reglas de propiedad de datos; tienen visibilidad total e irrestricta.
2.2 Relaciones Organizacionales Basadas en Recursos Humanos
La asignación de permisos no se hace usuario por usuario de manera estática, sino a través de relaciones organizacionales:

Compañero (Peer): Si Juan y Pedro tienen a María como Manager en sus fichas de OHEM, son compañeros.
Subordinado (Subordinate): Permite a los directores o jefes de equipo auditar y editar los documentos comerciales de su personal a cargo.
Departamento / Equipo / Sucursal: Permite compartir información horizontalmente dentro de células de trabajo (ej. todo el departamento de compras colabora con los mismos proveedores).
Empresa: Otorga pase libre para ese tipo de documento en toda la sociedad.
2.3 Comparativa Rigurosa de los 3 Métodos de Gestión
2.4 Asignación de Propietario en el Método de Solo Documento
Cuando una empresa opera bajo el método de Solo Documento, el sistema aplica la siguiente regla en cascada al crear una transacción:

¿El creador tiene ficha de empleado vinculada? Si no tiene, el documento queda sin propietario y pasa a ser público.
Si tiene ficha de empleado: ¿El IC tiene asignado un Empleado de Ventas/Compras (SlpCode) con ficha de empleado y usuario activo?
Si SÍ: El propietario del documento pasa a ser el Empleado de Ventas/Compras del IC.
Si NO: El propietario del documento es el Creador directo del documento.


3. CASO DE NEGOCIO RESUELTO EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers reestructura su fuerza de ventas en dos ejecutivos: Fred Ingresos y Mary Descuentos. Ambos reportan al jefe de ventas George Ganancias.

Requisito 1: Fred y Mary no deben ver las cotizaciones, pedidos ni facturas de los clientes del otro.
Requisito 2: George Ganancias debe tener control total de modificación y lectura sobre los documentos de Fred y Mary.
Requisito 3: Todos los usuarios de la empresa deben poder consultar el maestro de clientes para emitir tickets de soporte técnico.
Solución Técnica Implementada:
Método seleccionado: Solo documento en Parametrizaciones generales > Ficha IC (cumple el Requisito 3, dejando el maestro accesible sin bloquear operaciones de soporte).
Modelado en Recursos Humanos (OHEM):
Se crea la ficha de George Ganancias (Manager = null, Dept = Ventas).
Se crean las fichas de Fred y Mary con Manager = George Ganancias.
Matriz de Autorizaciones de Propiedad de Datos:
Para Fred y Mary: En Pedido de cliente y Factura de clientes, se configuran todas las relaciones (Compañero, Departamento, Equipo) en Ninguno. (Cumple Requisito 1).
Para George Ganancias: En la columna Subordinado, se asigna autorización Total para todos los documentos de ventas. (Cumple Requisito 2).
Verificación: Cuando Mary ingresa a SAP B1 y busca pedidos, únicamente se listan aquellos donde ella figura como propietaria. Si intenta abrir un documento de Fred mediante enlace directo, el sistema emite el mensaje: "No tiene autorización de propiedad de datos para acceder a este documento".


4. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
Bajo el método de propiedad de datos "Solo interlocutor comercial", ¿qué sucede si un usuario intenta generar un informe de Antigüedad de Saldos de Clientes?
A) El informe se genera con todos los clientes, pero oculta los montos en moneda extranjera.
B) El sistema emite un error de base de datos y cancela la ejecución.
C) El informe se genera normalmente, pero omite automáticamente todos los clientes cuyo propietario no mantenga una relación autorizada con el usuario solicitante.
D) Solo los superusuarios pueden ejecutar informes financieros bajo este método.
Respuesta Correcta: C
Justificación Técnica: El método de Solo IC filtra activamente los registros maestros en listados, búsquedas formateadas e informes estándar, mostrando únicamente los socios de negocios donde el usuario posea permisos por relación organizacional.
Pregunta 2
Si un usuario recibe simultáneamente autorización de "Solo lectura" por la relación Departamento y autorización "Total" por la relación Subordinado para las Facturas de Clientes, ¿qué permiso efectivo prevalece al interactuar con el documento de un subordinado de su mismo departamento?
A) Prevalece "Solo lectura" por ser la regla más restrictiva de seguridad.
B) Prevalece "Total" porque SAP Business One aplica siempre la autorización más generosa ante solapamientos de relaciones.
C) Se produce un conflicto de privilegios y el documento se bloquea.
D) El sistema solicita la clave de un superusuario cada vez que intenta editar.
Respuesta Correcta: B
Justificación Técnica: La regla de gobernanza de propiedad de datos en SAP B1 establece que, si existen múltiples relaciones válidas entre el usuario y el propietario, tiene prioridad la autorización más amplia (Total > Solo lectura > Ninguno).
Pregunta 3
¿Por qué motivo la "Solicitud de compra" figura como una línea especial en la ventana de Autorizaciones de Propiedad de Datos cuando se opera bajo el método "Solo interlocutor comercial"?
A) Porque es el único documento del sistema que requiere autorización previa de gerencia.
B) Porque la Solicitud de Compra es un documento preparatorio que no tiene interlocutor comercial obligatorio en su cabecera, por lo que debe autorizarse directamente por la relación con su propietario/creador.
C) Porque no genera asientos contables en el Libro Mayor.
D) Porque solo puede ser emitida por el departamento de producción.
Respuesta Correcta: B
Justificación Técnica: Al no tener un proveedor asignado forzosamente en el documento de Solicitud de Compra, el sistema no puede derivar el propietario desde OCRD, requiriendo una entrada independiente en la matriz de autorizaciones.