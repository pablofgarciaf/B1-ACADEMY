# Guion de Video: DOC 024 Impl GeneralAuthorizations

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 024 Impl GeneralAuthorizations.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 024: AUTORIZACIONES GENERALES Y AUTORIZACIONES EFECTIVAS (SAP BUSINESS ONE 10.0)
Código de Manual: 10_Impl_32_SystemSetup_GeneralAuthorizations_ES
Módulo Oficial: Configuración y Gestión del Sistema (System Setup / General Authorizations)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Administradores de Seguridad, Consultores Funcionales, Auditores de Control Interno y Agentes IA (Antigravity)
Carpeta Asociada: 024_10_Impl_32_SystemSetup_GeneralAuthorizations_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "024",

  "topic": "System Setup: General Authorizations & Effective Authorizations",

  "sap_module": "Administration_Security_Authorizations",

  "database_tables": {

    "authorizations": "USR3",

    "users": "OUSR",

    "groups": "OUGR",

    "user_group_links": "USR1",

    "additional_authorizations": "OUDO / Form IDs"

  },

  "menu_paths": [

    "Gestión > Inicialización del sistema > Autorizaciones > Autorizaciones generales",

    "Gestión > Inicialización del sistema > Autorizaciones > Autorizaciones generales > Autor de autorización adicional"

  ],

  "authorization_levels": [

    { "code": "FULL", "name": "Autorización total", "description": "Permite ver, crear, modificar y cancelar registros del objeto o menú." },

    { "code": "READ", "name": "Solo lectura", "description": "Permite consultar y listar información, pero bloquea la creación y edición." },

    { "code": "NONE", "name": "Sin autorización", "description": "Bloquea totalmente la visualización y acceso a la opción de menú o reporte." }

  ],

  "effective_authorization_engine": {

    "definition": "Columna 'Autorización efectiva' que consolida los permisos manuales individuales y los permisos heredados de uno o múltiples grupos de usuarios.",

    "conflict_resolution_rule": "Rige estrictamente el principio de la autorización MÁS ALTA / MÁS GENEROSA (Full > Read-Only > No Authorization).",

    "example": "Si el Usuario X tiene 'Sin autorización' asignada manualmente en Facturas de Clientes, pero pertenece al Grupo Ventas con 'Autorización total', su autorización efectiva será 'Autorización total'."

  },

  "specific_functional_restrictions": {

    "max_discount_sales": "Límite porcentual máximo de descuento permitido en documentos de ventas (0% a 100%).",

    "max_discount_purchasing": "Límite porcentual máximo de descuento permitido en compras.",

    "max_cash_amount": "Importe monetario tope permitido para cobros en efectivo en la ventana Medios de pago."

  },

  "audit_trail": {

    "change_log": "Herramientas > Log de modificaciones: registra fecha, hora, usuario modificador, valor anterior y nuevo valor de cada permiso.",

    "export_tool": "Exportación completa de la matriz de autorizaciones a Microsoft Excel para auditorías SOX/LOTAIP."

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 El Modelo de Seguridad Basado en Roles
En SAP Business One, la seguridad de acceso se estructura sobre dos pilares complementarios:

La Licencia de Software: Establece los derechos contractuales legales del usuario (Profesional, Limitada CRM, Limitada Logística, Limitada Financiera). La licencia define el perímetro máximo de lo que el usuario puede llegar a usar.
Las Autorizaciones Generales (USR3): Regulan las acciones operativas cotidianas que el usuario tiene permitido ejecutar según su perfil de puesto.

Regla de exclusión: Asignar "Autorización total" a un usuario con licencia Limitada CRM para un menú financiero (como el Balance General) no le permitirá ingresar; el servidor de licencias bloqueará el acceso por incompatibilidad de licencia.
2.2 Estructura Jerárquica del Árbol de Permisos
La matriz de autorizaciones replica fielmente la estructura del Menú Principal de SAP Business One:

Herencia Descendente: Al otorgar un nivel de permiso (ej. "Solo lectura") a un módulo principal (como Ventas - Clientes), todos los submenús dependientes (Ofertas, Pedidos, Entregas, Facturas) heredan automáticamente dicha condición.
Estado "Varias Autorizaciones": Si el administrador personaliza un submenú específico con un permiso diferente al del nodo padre, el encabezado superior cambia automáticamente su estado a Varias autorizaciones, indicando heterogeneidad en la rama.
2.3 Autorizaciones Efectivas y Resolución de Conflictos
La columna Autorización Efectiva representa el estado real y final de ejecución de un usuario. Un empleado puede pertenecer a varios grupos funcionales a la vez (por ejemplo, Grupo Ventas y Grupo Inventario).

Cuando confluyen permisos disímiles para un mismo objeto: $$\text{Autorización Total} > \text{Solo Lectura} > \text{Sin Autorización}$$

El sistema aplica siempre el permiso más generoso.
Si se desea restringir totalmente a un usuario en una función particular, no basta con asignarle "Sin autorización" en su ficha personal si pertenece a un grupo que tiene "Autorización total"; es indispensable retirarlo del grupo permisivo o degradar el permiso en dicho grupo.
2.4 Límites Financieros Individuales
En la parte inferior de la ventana de autorizaciones generales, el administrador puede fijar parámetros de control financiero por usuario:

Descuento Máximo: Impide que los comerciales otorguen rebajas no autorizadas. Si se fija en 0%, el campo de descuento en líneas de factura queda inhabilitado.
Límite de Efectivo: Protege la caja chica limitando el monto máximo que un cajero o vendedor puede recibir en moneda física en una sola transacción.
2.5 Autor de Autorización Adicional (Additional Authorization Creator)
Para desarrollos a medida, Add-ons o Tablas Definidas por el Usuario (UDT):

Permite a los desarrolladores registrar permisos personalizados en el árbol estándar.
Requiere capturar el Form ID (activando Vista > Información de sistema en el menú superior y pasando el cursor sobre el formulario personalizado).
El nuevo permiso se integra inmediatamente a la matriz bajo el nodo Autorización de usuario.


3. CASO DE NEGOCIO RESUELTO: ESTRUCTURACIÓN DEL ÁREA COMERCIAL EN DG INDUSTRIES
Escenario de Consultoría:
DG Industries tiene 15 ejecutivos de ventas y 1 Director de Ventas. Todos los ejecutivos deben tener permiso para emitir ofertas, pedidos y facturas de clientes, pero tienen prohibido ver informes de rentabilidad bruta y su descuento máximo negociable es del 10%. El Director de Ventas requiere autorización total para todos los informes de análisis y un descuento máximo del 25%.
Estrategia de Despliegue:
Creación del Grupo Base: Se crea el grupo de autorización GRP_VENTAS_BASE.
Configuración de Permisos en el Grupo:
Módulo Ventas - Clientes: Autorización total.
Informes de Ventas y Análisis de Rentabilidad: Sin autorización.
Se asignan los 15 ejecutivos de ventas a este grupo.
En la ficha de los ejecutivos, se establece el Descuento máximo en ventas = 10%.
Configuración del Director de Ventas:
Se asigna al Director al grupo GRP_VENTAS_BASE.
En su ficha de usuario individual, el consultor sobreescribe los informes de ventas otorgándole Autorización total.
Su autorización efectiva en informes cambia automáticamente a Autorización total (por la regla del permiso más alto).
Se actualiza su límite a Descuento máximo en ventas = 25%.
Auditoría: Se exporta la matriz completa a Excel y se verifica el Log de modificaciones para certificar la fecha y responsable del cambio.


4. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
Si un usuario normal tiene configurada manualmente la opción "Sin autorización" para Facturas de Clientes, pero pertenece a un Grupo de Autorizaciones que tiene "Autorización total" para dicha función, ¿cuál será su Autorización Efectiva en el sistema?
A) Sin autorización, porque el permiso manual individual tiene prioridad sobre el grupo.
B) Autorización total, porque el sistema aplica estrictamente la regla de la autorización más alta (más generosa) ante conflictos.
C) Solo lectura, como punto medio de compromiso.
D) El sistema se bloquea y genera un error de excepción de permisos.
Respuesta Correcta: B
Justificación Técnica: El motor de autorizaciones efectivas de SAP Business One resuelve cualquier conflicto entre permisos manuales y múltiples grupos otorgando siempre el nivel más alto de privilegios (Total > Lectura > Ninguna).
Pregunta 2
¿Qué ocurre si un administrador asigna "Autorización total" en el módulo de Finanzas a un usuario que tiene contratada y asignada una licencia "Limitada Logística"?
A) El usuario podrá ingresar y modificar todos los asientos contables sin restricción.
B) El usuario no podrá acceder a las funciones financieras restringidas por su tipo de licencia, recibiendo un mensaje de bloqueo por parte del servidor de licencias.
C) La licencia del usuario se actualiza automáticamente a Profesional.
D) La base de datos queda suspendida por incumplimiento de contrato.
Respuesta Correcta: B
Justificación Técnica: Las autorizaciones generales operan subordinadas al alcance legal del tipo de licencia asignada. Una autorización general nunca puede habilitar funcionalidades que excedan el tipo de licencia contratado.
Pregunta 3
¿Cómo puede un auditor comprobar qué persona modificó los permisos de un usuario específico en SAP Business One y cuáles fueron los valores alterados?
A) Consultando únicamente los archivos de log del sistema operativo Windows.
B) Abriendo la ventana de Autorizaciones Generales para dicho usuario y seleccionando "Herramientas > Log de modificaciones" para comparar las instantáneas históricas.
C) No existe registro histórico de cambios de autorizaciones.
D) Restaurando un backup anterior.
Respuesta Correcta: B
Justificación Técnica: SAP Business One mantiene un log de modificaciones con pistas de auditoría detalladas que permite comparar dos estados temporales mediante la ventana de diferencias, exhibiendo fecha, hora, usuario auditor y valores anterior/nuevo.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
