# Guion de Video: DOC 015 Impl ApprovalProcesses

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 015 Impl ApprovalProcesses.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 015: HERRAMIENTAS DE PERSONALIZACIÓN - PROCESOS DE AUTORIZACIÓN (SAP BUSINESS ONE 10.0)
Código de Manual: 10_Impl_13_CustomTools_ApprovalProcesses_ES
Módulo Oficial: Implementación / Control Interno (Customization Tools - Approval Procedures)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Oficiales de Control Interno, Gerentes de Compras/Ventas y Agentes IA (Antigravity)
Carpeta Asociada: 015_10_Impl_13_CustomTools_ApprovalProcesses_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "015",

  "topic": "Approval Procedures & Multi-Level Authorization Workflows",

  "sap_module": "Implementation_ApprovalProcess",

  "activation_prerequisites": {

    "menu_path": "Gestión > Inicialización del sistema > Parametrizaciones generales > Pestaña IC",

    "checkbox": "Habilitar el proceso de autorización",

    "di_api_support": "Habilitar el proceso de autorización para la DI API (soporte para integraciones y Add-Ons externos)",

    "system_lock_rule": "Una vez activada la funcionalidad y con modelos vigentes, ningún usuario creador puede desactivar el proceso, incluso si posee perfil de superusuario."

  },

  "database_tables": {

    "approval_templates": "OWTM",

    "template_originators": "WTM1",

    "template_documents": "WTM2",

    "template_stages": "WTM3",

    "template_terms": "WTM4",

    "approval_stages": "OWST",

    "stage_authorizers": "WST1",

    "draft_documents": "ODRF",

    "approval_requests": "OWDD",

    "approval_decisions": "WDD1"

  },

  "menu_paths": [

    "Gestión > Inicialización del sistema > Procesos de autorización > Etapas de autorización",

    "Gestión > Inicialización del sistema > Procesos de autorización > Modelos de autorización",

    "Gestión de bancos / Compras / Ventas > Informes de autorización > Informe de estado de autorización",

    "Gestión de bancos / Compras / Ventas > Informes de autorización > Informe de decisión de autorización"

  ],

  "architecture_components": {

    "Stage (Etapa)": "Lista independiente de autorizadores predefinidos con umbral mínimo de aprobaciones o rechazos requeridos.",

    "Template (Modelo)": "Ensamblador central que vincula: Creadores (Originators) + Tipos de Documentos + Secuencia de Etapas Multinivel + Condiciones de Activación."

  },

  "document_lifecycle_statuses": {

    "Draft_Pending": "Documento preliminar [Pendiente] - Generado automáticamente al intentar añadir; bloqueado en ODRF a la espera de decisión.",

    "Draft_Approved": "Documento preliminar [Aprobado] - Autorizado por el último nivel; listo para que el creador lo grabe en el sistema.",

    "Draft_Rejected": "Documento preliminar [Rechazado] - Devuelto al creador con motivos de rechazo para modificación o archivo.",

    "Draft_Canceled": "Documento preliminar [Cancelado] - Proceso abortado por el creador o aprobador.",

    "Formal_Added": "[Autorizado] - Documento añadido definitivamente a la base de datos con su número fiscal/correlativo real."

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Finalidad del Procedimiento de Autorización
El módulo de Procesos de Autorización (Approval Procedures) es la herramienta nativa de gobernanza corporativa en SAP Business One. Su objetivo es aplicar controles automáticos de segregación de funciones, límites de gastos y políticas de descuento comercial:

Evita que usuarios sin atribuciones suficientes comprometan financieramente a la organización.
Bloquea documentos en tiempo de captura antes de que generen impacto contable o movimientos de inventario en el Libro Mayor (OJDT).
Soporta documentos de ventas, compras, pagos manuales efectuados, traslados de inventario y recuentos de stock.
2.2 Anatomía de la Configuración en Dos Pasos
Paso 1: Definición de Etapas de Autorización (OWST)
Representa un nivel de aprobación (ej. Jefe de Compras, Gerente de Operaciones, Director Financiero).
Se define un pool de usuarios aprobadores para contemplar suplencias por vacaciones o ausencias.
Se estipula el Número de aprobaciones requeridas (ej. se requiere 1 autorización de 3 posibles) y el número de rechazos mínimos para cancelar la etapa.
Paso 2: Configuración del Modelo de Autorización (OWTM)
El modelo agrupa cuatro dimensiones operativas:

Ficha Creador (WTM1): Usuarios que están subordinados al control. Si un usuario no está listado como creador en ningún modelo, sus transacciones se graban directamente sin pasar por aprobaciones.
Ficha Documentos (WTM2): Clases de documentos sometidos al flujo (ej. Pedidos de compra, Facturas de proveedores).
Ficha Etapas (WTM3): Secuencia ordenada de niveles. Si se definen N niveles, el documento debe ser autorizado sucesivamente por el Nivel 1 antes de saltar a la bandeja del Nivel 2.
Ficha Condiciones (WTM4):
Siempre: El documento siempre requiere autorización sin importar sus montos.
Condiciones Predefinidas: Reglas estándar a nivel de cabecera (Monto Total, Porcentaje de Descuento, Margen Bruto, Límite de Crédito). Si se definen múltiples condiciones predefinidas, el sistema las evalúa bajo el operador lógico "O" (se activa si se cumple al menos una).
Consultas de Usuario (Personalizadas): Permite lógica avanzada basada en sentencias SQL con sintaxis de ventana activa ($[Tabla.Campo]) para validar campos de línea, grupos de artículos o atributos específicos.
2.3 El Circuito Operativo y Gestión de Estados
Captura: El creador llena el documento y pulsa Crear/Añadir. El sistema evalúa las condiciones. Si se cumplen, bloquea la creación directa y despliega una ventana modal donde el creador puede ingresar un comentario explicativo.
Registro del Borrador: El documento se almacena en la tabla de borradores preliminares (ODRF) con estado Pendiente. El documento preliminar no genera asiento contable ni altera el stock físico o comprometido.
Notificación: Los autorizadores reciben una alerta emergente en su ventana Resumen de Mensajes/Alertas y pueden revisar el borrador desglosando la información.
Decisión:
Aprobado: El creador recibe una notificación con el enlace al borrador, cuyo estado pasa a Documento preliminar [Aprobado]. El creador debe abrir el borrador y presionar "Crear" para convertirlo en documento oficial.
Rechazado: El creador puede editar el borrador para ajustarlo a los límites autorizados o cancelarlo.
2.4 Numeración de Documentos y Concurrencia
Al generarse el borrador preliminar, el sistema le asigna una clave de borrador temporal (ej. Borrador Nº 727).
Mientras el borrador espera aprobación durante horas o días, otros usuarios de la empresa continúan creando documentos normales en la misma serie correlativa.
Por lo tanto, cuando el documento es finalmente aprobado y grabado formalmente, asume el siguiente número correlativo disponible en la serie real (ej. Pedido Nº 735), desvinculándose de la numeración que tuvo en su fase preliminar.


3. ATLAS DIDÁCTICO: DIAGRAMA DE FLUJO DEL WORKFLOW DE APROBACIÓN
   [ CREADOR ]

   Llena Pedido de Compra > Pulsa 'Crear'

              │

              ▼

   ¿Cumple Criterios del Modelo?

        ├─ NO ──> Se graba como Documento Normal en Base de Datos (OJDT / OPOR)

        │

        └─ SÍ ──> Se almacena como 'Documento Preliminar [Pendiente]' (ODRF)

                  Se envía alerta interna a Autorizadores (OWDD)

                                 │

                                 ▼

                     [ EVALUACIÓN AUTORIZADOR ]

                     Revisa documento en pantalla

                                 │

                 ┌───────────────┴───────────────┐

                 ▼                               ▼

          [ RECHAZADO ]                    [ APROBADO ]

     Creador recibe aviso.           Borrador pasa a estado [Aprobado].

     Modifica borrador o descarta.   Creador abre el borrador y pulsa 'Crear'.

                                     El documento se convierte en Pedido Oficial.


4. CASO DE NEGOCIO RESUELTO: POLÍTICA DE GASTOS EN OEC COMPUTERS
Escenario de Consultoría:
Para mantener un estricto control presupuestario, la gerencia de OEC Computers dictamina que:

Cualquier Pedido de Compra (OPOR) emitido por los asistentes de compras (User_Junior1 y User_Junior2) cuyo monto total sea superior a $1,000.00 USD, debe ser aprobado previamente por el Gerente de Finanzas (Bryce) o por la Gerente General.
Configuración del Procedimiento en SAP Business One:
Etapa de Autorización (OWST):
Nombre: Aprobacion_Compras_Gerencia.
Usuarios asignados: Bryce y Gerente_General.
Autorizaciones requeridas = 1.
Modelo de Autorización (OWTM):
Nombre: POLITICA_COMPRAS_MAYOR_1000.
Creadores: User_Junior1, User_Junior2.
Documentos: Pedido.
Etapas: Aprobacion_Compras_Gerencia.
Condiciones: Condición predefinida Total del documento > 1,000.00 USD.
Estado: Activo.
Prueba de Operación:
User_Junior1 registra un pedido de 20 monitores al proveedor ViewSonic por un total de $2,400.00 USD.
Al pulsar Crear, SAP B1 despliega la ventana Se requiere autorización. El usuario escribe: "Compra urgente de monitores para reposición de inventario".
El documento se guarda como borrador. Bryce recibe la alerta en tiempo real, revisa el pedido y hace clic en Autorizar.
User_Junior1 recibe la confirmación en su pantalla, abre el borrador autorizado y pulsa Crear, formalizando el pedido ante el proveedor con total respaldo corporativo.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
Si en una etapa de autorización se configuran 3 autorizadores diferentes y se define que el número mínimo de autorizaciones requeridas es 1, ¿qué ocurre si el Autorizador A aprueba el documento y posteriormente el Autorizador B lo rechaza?
A) El rechazo de B anula la aprobación de A y el documento se bloquea definitivamente.
B) Debido a que se alcanzó el mínimo requerido de 1 autorización con la decisión de A, el documento queda formalmente aprobado y el rechazo posterior de B es ignorado por el sistema.
C) El sistema solicita una votación de desempate al superusuario.
D) El documento se borra de la tabla ODRF.
Respuesta Correcta: B
Justificación Técnica: Cuando la cuota mínima de autorizaciones se satisface, la etapa se considera exitosamente superada; cualquier respuesta tardía emitida por otros autorizadores del mismo nivel no tiene efecto revocatorio sobre el estado aprobado.
Pregunta 2
¿Afecta a la contabilidad del Libro Mayor (OJDT) o a los saldos de inventario en almacén un documento mientras se encuentra en estado "Documento preliminar [Pendiente]"?
A) Sí, reserva el stock en inventario y realiza un asiento provisional de pasivo.
B) No; mientras el documento permanece como borrador preliminar en la tabla ODRF, no genera ningún asiento contable ni altera las existencias físicas o comprometidas en el almacén.
C) Solo altera el balance si se trata de una factura de compras.
D) Congela todas las transacciones bancarias del proveedor.
Respuesta Correcta: B
Justificación Técnica: Los documentos preliminares en proceso de aprobación son meras estructuras de datos temporales sin efecto financiero ni logístico hasta que se aprueben y se añadan formalmente al sistema.
Pregunta 3
¿Puede un usuario que está definido como "Creador" en un modelo de autorización desactivar el proceso de autorización o modificar el modelo para saltarse el control?
A) Sí, siempre que tenga acceso al menú de parametrizaciones generales.
B) No; el sistema impide estrictamente que un usuario creador modifique o desactive los modelos de autorización en los que está involucrado, garantizando la inviolabilidad del control interno.
C) Solo si cuenta con la aprobación del departamento de recursos humanos.
D) Sí, cambiando su contraseña de acceso.
Respuesta Correcta: B
Justificación Técnica: Por diseño de seguridad, SAP Business One bloquea la edición de modelos a los usuarios creadores para impedir que un empleado se auto-exima de las directrices de autorización.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
