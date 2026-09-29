# Guion de Video: DOC 113 FinProcess JournalVouchers

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 113 FinProcess JournalVouchers.

## Contenido Principal (Visual: Diapositivas correspondientes)
GUÍA TÉCNICA Y OPERATIVA DE APRENDIZAJE: DOCUMENTOS PRELIMINARES DE ASIENTO (JOURNAL VOUCHERS)
Módulo: Finanzas y Control de Auditoría (SAP Business One 10.0)
Código de Unidad: DOC_113_FinProcess_JournalVouchers | Audiencia: Supervisores Contables, Auditores Financieros, Consultores Senior ERP

METADATOS TÉCNICOS
Módulo SAP: Finanzas -> Documentos Preliminares (Journal Vouchers)
Componente: Preparación, Supervisión y Contabilización en Dos Pasos de Asientos Contables
Versión de SAP: 10.0 (HANA y SQL)
ID Documento Base: 10_FinProcess_13_PostJE_voucher_ES.pdf


JSON ANTIGRAVITY MASTER SCHEMA
{

  "$schema": "https://antigravity.softia.tech/schemas/v1/sap-b1-unit.json",

  "unit_id": "DOC_113_FinProcess_JournalVouchers",

  "title": "Documentos Preliminares de Asiento (Journal Vouchers) y Protocolo de Aprobación en Dos Pasos",

  "sap_module": "Financials",

  "source_manual": "10_FinProcess_13_PostJE_voucher_ES.pdf",

  "target_audience": ["Financial Controllers", "Auditing Directors", "Implementation Consultants", "Antigravity Agents"],

  "database_tables": {

    "header_tables": [

      {

        "table_name": "OBTF",

        "description": "Fichero maestro de Lotes de Documentos Preliminares (Journal Vouchers Batch Header)",

        "key_fields": ["BatchNum", "Status", "Date"]

      },

      {

        "table_name": "OJDT",

        "description": "Fichero definitivo de Asientos Contables (Journal Entries)",

        "key_fields": ["TransId", "TransType", "RefDate", "BtfStatus"]

      }

    ],

    "line_tables": [

      {

        "table_name": "BTF1",

        "description": "Líneas de Asientos dentro del Documento Preliminar (Voucher Entry Lines)",

        "key_fields": ["BatchNum", "TransId", "Line_ID", "Account", "ShortName", "Debit", "Credit"]

      }

    ]

  },

  "menu_paths": {

    "voucher_management": "Finanzas -> Documentos preliminares",

    "voucher_report": "Finanzas -> Informe de documento preliminar"

  },

  "business_rules": [

    {

      "rule_id": "BR_JV_01",

      "name": "Permisividad de Desbalanceo Temporal",

      "description": "A diferencia de los asientos estándar en OJDT, los asientos contenidos en un Documento Preliminar (OBTF/BTF1) pueden guardarse desbalanceados (Débito != Crédito) mientras permanezcan en estatus preliminar, facilitando la captura de transacciones extensas."

    },

    {

      "rule_id": "BR_JV_02",

      "name": "Obligatoriedad de Cuadratura Previa al Pase a Mayor",

      "description": "El sistema prohíbe terminantemente la contabilización definitiva de cualquier entrada o lote preliminar si la suma de Débito difiere de la suma de Crédito en el momento de presionar 'Contabilizar documento'."

    },

    {

      "rule_id": "BR_JV_03",

      "name": "Contabilización Selectiva y Parcial",

      "description": "Desde el Informe de Documentos Preliminares, un supervisor puede seleccionar y contabilizar asientos individuales específicos de un lote, manteniendo las demás entradas abiertas en el documento preliminar para revisiones posteriores."

    },

    {

      "rule_id": "BR_JV_04",

      "name": "Sustitución de Flujos de Aprobación para Asientos Manuales",

      "description": "Dado que el Procedimiento de Autorizaciones nativo de SAP B1 no aplica sobre asientos manuales del libro diario, los Documentos Preliminares representan el mecanismo estándar oficial para la separación de funciones (captura por auxiliares y aprobación/contabilización por jefes)."

    }

  ]

}


DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
1. Justificación y Propósito Empresarial del Documento Preliminar
En la gestión financiera existen dos escenarios críticos donde la contabilización directa e inmediata en el libro mayor resulta inviable o riesgosa:

Captura Progresiva de Asientos Complejos: Procesos como nóminas multinivel, liquidaciones de importación o ajustes anuales de auditoría contienen cientos de líneas y requieren validaciones parciales durante varios días antes de cerrarse.
Segregación de Funciones y Auditoría Interna: Auxiliares contables o pasantes capturan información que debe ser sometida a revisión analítica y corrección técnica por parte del Contador General antes de que impacte los balances oficiales. El Documento Preliminar (Journal Voucher) actúa como un espacio de almacenamiento intermedio (Sandbox Contable) que no afecta los saldos de las cuentas de mayor ni el libro auxiliar de socios de negocios.
2. Estructura y Funcionamiento del Lote Preliminar
La ventana Finanzas -> Documentos preliminares presenta una interfaz dividida en dos cuadrículas relacionales:

Cuadrícula Superior (Lotes de Documentos): Lista los registros de lote creados (OBTF.BatchNum). Un lote puede agrupar múltiples asientos independientes bajo una misma carátula descriptiva.
Cuadrícula Inferior (Asientos del Lote): Al seleccionar un lote en la parte superior, se muestran los asientos individuales que contiene, indicando su estado (Abierto o Cerrado/Contabilizado).

Flujo Operativo en 4 Pasos:

Paso 1: Seleccionar Añadir asiento al nuevo documento para iniciar un nuevo lote preliminar.
Paso 2: Introducir las líneas contables en la ventana Entrada de documento preliminar. Si el asiento no cuadra, SAP B1 emite una advertencia informativa, pero permite guardar el registro en borrador.
Paso 3: Para añadir transacciones adicionales al mismo lote, pulsar Añadir entrada al documento existente.
Paso 4: Una vez verificado el cuadre exacto de débitos y créditos, presionar Contabilizar documento. La transacción se transfiere al fichero definitivo de asientos (OJDT), asignándole un número de transacción irreversible (TransId) y cerrando el borrador.
3. El Informe de Documentos Preliminares y la Contabilización Selectiva
Ubicado en Finanzas -> Informe de documento preliminar:

Permite filtrar lotes por número de grupo, fechas contables, usuarios creadores o estado de apertura.
Potencia Analítica: La columna Nº grupo desglosa la jerarquía [Número de Lote - Número de Asiento].
Contabilización Fraccionada: A diferencia de la ventana principal (que contabiliza la totalidad del lote), desde este informe el supervisor puede marcar únicamente las filas que ya han sido auditadas y presionar Contabilizar. Dichas entradas se transfieren a OJDT como transacciones firmes, mientras que las líneas pendientes permanecen en el lote preliminar para futuros ajustes.


CASO DE NEGOCIO RESUELTO: OEC COMPUTERS
Escenario: En OEC Computers, Carlos (pasante contable) está encargado de registrar el asiento de nómina quincenal, compuesto por 45 líneas entre sueldos brutos, retenciones de impuestos, aportes a la seguridad social y anticipos. Al final del día, Carlos tiene registradas las líneas de gasto y retenciones por $68,500.00, pero aún no recibe la liquidación definitiva del banco para cuadrar los pagos netos. Además, María (Jefa de Contabilidad) debe revisar cada línea antes del pase oficial a libros.

Resolución Técnica:

Captura Parcial Desbalanceada: Carlos abre Finanzas -> Documentos preliminares y selecciona Añadir asiento al nuevo documento. Ingresa las cuentas de gasto de sueldo y pasivos fiscales por $68,500.00. Deja el asiento con una diferencia temporal y presiona Añadir a documento. El sistema genera el Lote Preliminar Nº 12, Entrada Nº 1.
Revisión del Supervisor: A la mañana siguiente, María abre Finanzas -> Informe de documento preliminar. Accede a la entrada mediante la flecha naranja, verifica las cuentas de retención y detecta un error de digitación en la cuenta de aporte patronal, corrigiendo el valor directamente.
Cierre y Cuadre: Carlos recibe el extracto de transferencias bancarias, abre el lote preliminar e ingresa la línea de contrapartida de Banco por el neto a pagar, logrando la diferencia exacta de $0.00.
Pase Definitivo: María selecciona la entrada en el Informe de Documentos Preliminares y presiona Contabilizar documento. La nómina queda formalmente asentada en OJDT como Asiento Oficial Nº 10455, sin haber puesto en riesgo la consistencia del balance durante la etapa de confección.


BANCO DE EVALUACIÓN SITUACIONAL (CERTIFICACIÓN SAP B1)
¿Qué particularidad contable distingue a un Asiento dentro de un Documento Preliminar respecto a un Asiento registrado directamente en la ventana estándar?

A) Permite registrar transacciones únicamente en moneda extranjera.
B) Puede guardarse desbalanceado (Débito diferente de Crédito) mientras permanezca en estatus preliminar.
C) No permite vincular cuentas asociadas de socios de negocios.
D) Requiere forzosamente una clave de autorización criptográfica. Respuesta Correcta: B. Los asientos en documentos preliminares permiten guardar desbalances temporales durante el proceso de elaboración, requiriendo cuadratura estricta únicamente al momento de la contabilización final en el libro mayor.

Un supervisor contable desea contabilizar solo 2 de las 5 entradas preparadas en un lote preliminar. ¿Desde qué interfaz puede realizar esta contabilización selectiva?

A) Directamente en la ventana Asiento presionando Ctrl + P.
B) En la ventana Documentos Preliminares mediante el botón Contabilizar Todo.
C) En el Informe de Documentos Preliminares, seleccionando las líneas específicas del grupo.
D) A través del Asistente de Pagos en Gestión de Bancos. Respuesta Correcta: C. El Informe de Documentos Preliminares (Finanzas -> Informe de documento preliminar) es la única consola que permite seleccionar y contabilizar entradas parciales de un lote dejando el resto abierto.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
