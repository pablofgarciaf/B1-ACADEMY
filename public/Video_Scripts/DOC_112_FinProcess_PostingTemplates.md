# Guion de Video: DOC 112 FinProcess PostingTemplates

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 112 FinProcess PostingTemplates.

## Contenido Principal (Visual: Diapositivas correspondientes)
GUÍA TÉCNICA Y OPERATIVA DE APRENDIZAJE: MODELOS DE CONTABILIZACIÓN Y CONTABILIZACIONES PERIÓDICAS
Módulo: Finanzas y Automatización de Asientos (SAP Business One 10.0)
Código de Unidad: DOC_112_FinProcess_PostingTemplates | Audiencia: Consultores de Finanzas, Jefes de Contabilidad, Diseñadores de Procesos ERP

METADATOS TÉCNICOS
Módulo SAP: Finanzas -> Modelos de Contabilización / Contabilizaciones Periódicas
Componente: Automatización de Asientos Recurrentes y Distribución Porcentual
Versión de SAP: 10.0 (HANA y SQL)
ID Documento Base: 10_FinProcess_12_PostJE_template_ES.pdf


JSON ANTIGRAVITY MASTER SCHEMA
{

  "$schema": "https://antigravity.softia.tech/schemas/v1/sap-b1-unit.json",

  "unit_id": "DOC_112_FinProcess_PostingTemplates",

  "title": "Modelos de Contabilización Porcentuales y Contabilizaciones Periódicas Fijas",

  "sap_module": "Financials",

  "source_manual": "10_FinProcess_12_PostJE_template_ES.pdf",

  "target_audience": ["Financial Consultants", "Senior Controllers", "Accounting Supervisors", "Antigravity Agents"],

  "database_tables": {

    "header_tables": [

      {

        "table_name": "OTPL",

        "description": "Cabecera de Modelos de Contabilización Porcentual (Posting Templates Header)",

        "key_fields": ["Template", "Desc"]

      },

      {

        "table_name": "ORCP",

        "description": "Cabecera de Contabilizaciones Periódicas Recurrentes (Recurring Postings Header)",

        "key_fields": ["RcpCode", "RcpDesc", "Frequency", "Remind", "NextDate", "EndDate", "Status"]

      }

    ],

    "line_tables": [

      {

        "table_name": "TPL1",

        "description": "Líneas de Modelos de Contabilización Porcentual (Template Lines)",

        "key_fields": ["Template", "Line_ID", "AcctCode", "ShortName", "DebitRate", "CreditRate"]

      },

      {

        "table_name": "RCP1",

        "description": "Líneas de Contabilizaciones Periódicas Recurrentes (Recurring Posting Lines)",

        "key_fields": ["RcpCode", "Line_ID", "AcctCode", "ShortName", "Debit", "Credit"]

      }

    ],

    "configuration_tables": [

      {

        "table_name": "OADM",

        "description": "Parametrizaciones Generales de la Empresa",

        "key_fields": ["RecurrPost"]

      }

    ]

  },

  "menu_paths": {

    "posting_templates": "Finanzas -> Modelos de contabilización",

    "recurring_postings": "Finanzas -> Contabilizaciones periódicas",

    "confirmation_utility": "Finanzas -> Contabilizaciones periódicas (Ventana de Ejecución al inicio de sesión)",

    "system_setup": "Gestión -> Inicialización del sistema -> Parametrizaciones generales -> Ficha Servicios -> Visualizar contabilizaciones periódicas durante la ejecución"

  },

  "business_rules": [

    {

      "rule_id": "BR_POST_01",

      "name": "Naturaleza de Modelos Porcentuales",

      "description": "Los Modelos de Contabilización (OTPL) almacenan estructuras fijas de cuentas con proporciones relativas (porcentajes de Debe y Haber). No contienen importes monetarios fijos. Al indicar un monto en cualquiera de las líneas durante la captura manual, el sistema calcula automáticamente las demás."

    },

    {

      "rule_id": "BR_POST_02",

      "name": "Naturaleza de Contabilizaciones Periódicas",

      "description": "Las Contabilizaciones Periódicas (ORCP) almacenan importes monetarios fijos con una cadencia temporal estricta (Diaria, Semanal, Mensual, Trimestral, Semestral, Anual o Una vez) y un rango de validez definido (Fecha fin de validez)."

    },

    {

      "rule_id": "BR_POST_03",

      "name": "Ejecución Asistida al Inicio de Sesión",

      "description": "Al activar la opción en Parametrizaciones Generales, SAP B1 presenta automáticamente al iniciar sesión la lista de operaciones periódicas que han alcanzado su fecha de vencimiento, permitiendo agregarlas al libro mayor o posponerlas."

    },

    {

      "rule_id": "BR_POST_04",

      "name": "Integración con Flujo de Caja",

      "description": "Las transacciones periódicas programadas pueden incluirse en el informe de Flujo de Caja previsional, identificándose de forma distintiva en color verde como movimientos proyectados futuros."

    }

  ]

}


DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
1. Diferenciación Arquitectónica: Modelos Porcentuales vs. Contabilizaciones Periódicas
La automatización contable en SAP Business One resuelve dos problemáticas operativas recurrentes en las empresas:

Estructura Fija con Importes Variables (Modelos de Contabilización - OTPL):
Se utiliza para transacciones cuya distribución contable siempre involucra las mismas cuentas y porcentajes de prorrateo, pero cuyos montos monetarios fluctúan mes a mes.
Ejemplo típico: Gastos de servicios públicos (electricidad, agua, telecomunicaciones) o liquidaciones de seguros distribuidos porcentualmente entre departamentos, sucursales o centros de costos.
En la plantilla se definen las cuentas y los porcentajes (TPL1.DebitRate / CreditRate). Durante el registro de un Asiento Manual, el usuario selecciona el modelo, ingresa el valor total de una línea y el sistema calcula y cuadra automáticamente las líneas restantes.
Estructura e Importes Fijos con Frecuencia Temporal (Contabilizaciones Periódicas - ORCP):
Se utiliza para transacciones que se repiten con montos exactamente idénticos en intervalos regulares de tiempo.
Ejemplo típico: Pago de cánones de arrendamiento de oficinas, cuotas de préstamos bancarios de amortización constante o pagos recurrentes de licencias de software.
Almacena cuentas, códigos de socio, importes monetarios exactos, frecuencia de ejecución (Frequency) y fecha de caducidad (EndDate).
2. Configuración y Ciclo de Vida de las Contabilizaciones Periódicas
Catálogo de Frecuencias: Diaria, Semanal, Mensual (especificando día exacto del mes), Trimestral, Semestral, Anual y Una vez.
Control de Estados:
Aún no ejecutada: Permite registrar modelos con anticipación sin que el sistema los sugiera en las ventanas de inicio hasta que llegue la fecha requerida.
Activa: El motor de recordatorios evalúa la columna NextDate frente a la fecha del sistema.
Fin de validez: Al superar la fecha establecida en EndDate, la plantilla pasa automáticamente a estatus inactivo, bloqueando ejecuciones no autorizadas.
Mecanismo de Despacho (Ventana de Ejecución):
Configuración previa: Gestión -> Inicialización del sistema -> Parametrizaciones generales -> ficha Servicios -> Visualizar contabilizaciones periódicas durante la ejecución.
Cuando un contador autorizado inicia sesión en la fecha programada, SAP B1 abre la ventana de transacciones periódicas pendientes. El usuario puede verificar las líneas, modificar importes excepcionales o aprobar el lote. Al añadirse, la instancia temporal se borra y la fecha de próxima ejecución avanza al siguiente ciclo.
3. Flexibilidad Operativa en Modelos de Contabilización
Cuentas Indefinidas: Un modelo porcentual puede dejar el campo AcctCode en blanco e ingresar únicamente una descripción conceptual en la línea (ej. "Gasto Sede Norte"), obligando al usuario a seleccionar la cuenta contable puntual al momento de la captura pero aplicando rígidamente la matriz porcentual.
Cancelación Dinámica del Modelo: En la ventana del Asiento Manual, si una transacción específica requiere alterar montos fuera de los porcentajes parametrizados, el usuario puede pulsar el botón Cancelar modelo para congelar las cuentas y editar los valores numéricos sin alterar la plantilla maestra original.


CASO DE NEGOCIO RESUELTO: OEC COMPUTERS
Escenario: OEC Computers gestiona dos operaciones contables repetitivas:

Arrendamiento de Bodega: Un contrato de renta fija por $2,500.00 mensuales pagadero los días 5 de cada mes a la inmobiliaria V70000, vigente por 24 meses.
Factura Mensual de Telecomunicaciones y Datos: Una factura cuyo monto total varía mes a mes, pero que contractualmente debe distribuirse siempre en: 40% a Ventas (630010), 35% a Operaciones (630020) y 25% a Administración (630030), contra la cuenta por pagar del proveedor V55000 (100% Haber).

Resolución Técnica:

Configuración de Renta Recurrente:
En Finanzas -> Contabilizaciones periódicas, crea el código RENTA_BOD.
Asigna Cuenta de Gasto 620000 (Débito: $2,500.00) contra Proveedor V70000 (Haber: $2,500.00). Frecuencia: Mensual, Día: 5. Fija Fin de validez a 2 años.
Cada día 5, al abrir el sistema, la contadora visualiza el recordatorio y aprueba el asiento con un clic.
Configuración de Modelo Porcentual:
En Finanzas -> Modelos de contabilización, crea el código TELCO_DIST.
Línea 1: Cuenta 630010, Debe %: 40.
Línea 2: Cuenta 630020, Debe %: 35.
Línea 3: Cuenta 630030, Debe %: 25.
Línea 4: Proveedor V55000, Haber %: 100.
Al recibir la factura de $1,800.00, abre Asiento, selecciona TELCO_DIST, digita $1,800.00 en la fila del proveedor y el sistema calcula inmediatamente: $720.00 (Ventas), $630.00 (Operaciones) y $450.00 (Administración).


BANCO DE EVALUACIÓN SITUACIONAL (CERTIFICACIÓN SAP B1)
¿Cuál es la diferencia fundamental entre un Modelo de Contabilización y una Contabilización Periódica en SAP Business One?

A) El modelo de contabilización solo funciona para cuentas de balance, mientras que la contabilización periódica solo opera con cuentas de resultados.
B) El modelo de contabilización maneja porcentajes de distribución para importes variables, mientras que la contabilización periódica maneja montos fijos con una frecuencia calendarizada.
C) Las contabilizaciones periódicas requieren aprobación en Service Layer y los modelos no.
D) Los modelos de contabilización generan asientos preliminares obligatorios. Respuesta Correcta: B. Los modelos de contabilización distribuyen porcentualmente importes variables, mientras que las contabilizaciones periódicas ejecutan importes fijos según una programación temporal predefinida.

¿En qué parte de SAP Business One se activa el recordatorio automático para ejecutar transacciones periódicas al iniciar sesión?

A) Gestión de Alertas predefinidas en Mantenimiento del Sistema.
B) Parametrizaciones de Documento ficha Asiento.
C) Parametrizaciones Generales ficha Servicios -> Visualizar contabilizaciones periódicas durante la ejecución.
D) En el Centro de Notificaciones de SAP Fiori Cockpit exclusivamente. Respuesta Correcta: C. La activación global se define en Parametrizaciones Generales dentro de la pestaña Servicios.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
