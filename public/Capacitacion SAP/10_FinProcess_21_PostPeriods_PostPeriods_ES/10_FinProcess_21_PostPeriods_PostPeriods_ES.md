GUÍA TÉCNICA Y OPERATIVA DE APRENDIZAJE: GESTIÓN DE PERÍODOS CONTABLES Y SUBPERÍODOS
Módulo: Finanzas y Administración del Sistema (SAP Business One 10.0)
Código de Unidad: DOC_114_FinProcess_PostingPeriods | Audiencia: Administradores de Sistema, Contadores Generales, Consultores de Implementación

METADATOS TÉCNICOS
Módulo SAP: Gestión -> Inicialización del Sistema -> Períodos Contables
Componente: Estructura Temporal del Ejercicio Fiscal y Parametrizaciones de Imputación
Versión de SAP: 10.0 (HANA y SQL)
ID Documento Base: 10_FinProcess_21_PostPeriods_PostPeriods_ES.pdf


JSON ANTIGRAVITY MASTER SCHEMA
{

  "$schema": "https://antigravity.softia.tech/schemas/v1/sap-b1-unit.json",

  "unit_id": "DOC_114_FinProcess_PostingPeriods",

  "title": "Definición y Parametrización de Períodos Contables y Subperíodos",

  "sap_module": "Administration / Financials",

  "source_manual": "10_FinProcess_21_PostPeriods_PostPeriods_ES.pdf",

  "target_audience": ["System Administrators", "Senior Financial Consultants", "Chief Accountants", "Antigravity Agents"],

  "database_tables": {

    "header_tables": [

      {

        "table_name": "OFPR",

        "description": "Fichero maestro de Períodos Contables (Posting Periods Header)",

        "key_fields": ["AbsEntry", "PeriodCat", "PeriodName", "F_RefDate", "T_RefDate", "F_DueDate", "T_DueDate", "F_TaxDate", "T_TaxDate", "PeriodStat"]

      }

    ],

    "configuration_tables": [

      {

        "table_name": "NNM1",

        "description": "Series de numeración vinculadas a períodos contables",

        "key_fields": ["ObjectCode", "Series", "Period"]

      }

    ]

  },

  "menu_paths": {

    "periods_setup": "Gestión -> Inicialización del sistema -> Períodos contables",

    "gl_determination": "Gestión -> Configuración -> Finanzas -> Determinación de cuentas de mayor"

  },

  "business_rules": [

    {

      "rule_id": "BR_PRD_01",

      "name": "Obligatoriedad del Primer Día del Mes",

      "description": "El inicio de cualquier ejercicio fiscal o período contable en SAP B1 debe corresponder obligatoriamente al primer día de un mes calendario (Día 01)."

    },

    {

      "rule_id": "BR_PRD_02",

      "name": "Secuencia Cronológica Estricta de Creación",

      "description": "Los períodos contables deben crearse rigurosamente desde el más antiguo hacia el futuro. El sistema no permite crear períodos anteriores a los ya existentes. Debe considerarse el ejercicio más antiguo del sistema legado antes de inicializar la sociedad."

    },

    {

      "rule_id": "BR_PRD_03",

      "name": "Prohibición de Solapamiento Temporal",

      "description": "No pueden existir rangos de fechas de contabilización que se superpongan entre períodos contables. El sistema valida automáticamente que la fecha de inicio sea estrictamente posterior a la fecha de fin del período anterior."

    },

    {

      "rule_id": "BR_PRD_04",

      "name": "Herencia de Determinación de Cuentas de Mayor",

      "description": "La Determinación de Cuentas de Mayor se administra de forma independiente por cada período contable. Al crear un nuevo período, SAP B1 clona íntegramente la determinación del período inmediatamente anterior."

    },

    {

      "rule_id": "BR_PRD_05",

      "name": "Determinación Dinámica por Fecha de Contabilización",

      "description": "Cualquier documento comercial o asiento contable se asigna automáticamente al subperíodo correspondiente basándose exclusivamente en su Fecha de Contabilización (Posting Date / RefDate), sin intervención del usuario."

    }

  ]

}


DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
1. Arquitectura de Períodos Contables en SAP Business One
El módulo de Períodos Contables (OFPR) conforma la columna vertebral de la integridad temporal y fiscal en SAP Business One:

Ejercicio Contable (Fiscal Year): Representa el ciclo financiero anual corporativo (típicamente coincidente con el año calendario: del 1 de enero al 31 de diciembre, aunque soporta ejercicios desfasados según la ley fiscal de cada país).
Subperíodos: Divisiones operativas internas creadas automáticamente al definir el ejercicio:
Año: 1 único período (adecuado únicamente para empresas sin requerimientos de cierre o auditoría mensual).
Trimestres: 4 subperíodos.
Meses: 12 subperíodos (el estándar adoptado por la inmensa mayoría de organizaciones para balance mensual y declaraciones de IVA/Retenciones).
Días: Subperíodos diarios (utilizados en escenarios excepcionales de alta rotación o tesorería intensiva).
2. Rangos de Fechas Tripartitas
Cada período contable define tres rangos de fechas independientes y complementarios:

Fecha de Contabilización (Posting Date - F_RefDate a T_RefDate): Delimita el marco temporal en el cual se asienta el registro en el libro mayor y determina en qué subperíodo cae la transacción.
Fecha de Vencimiento (Due Date - F_DueDate a T_DueDate): Delimita los vencimientos financieros válidos para documentos del período (ej. permite ventas en diciembre con vencimientos de cobro pactados a 90 o 120 días que vencen en el siguiente ejercicio).
Fecha de Documento / Impuestos (Tax Date - F_TaxDate a T_TaxDate): Delimita la fecha física de emisión legal o recepción del comprobante para efectos de cálculo y declaración tributaria.
3. Reglas Críticas de Implementación y Mantenimiento
Creación Temprana: Los nuevos períodos contables deben crearse con semanas de anticipación antes del inicio del nuevo año comercial. Esto previene bloqueos operativos cuando los vendedores intentan registrar pedidos con entregas programadas para el próximo año.
Vínculo con Determinación de Cuentas de Mayor: Dado que la matriz contable se hereda al crear el período, es una mejor práctica afinar y auditar la Determinación Contable (OACT / Determinación Avanzada) en el período actual antes de generar los períodos del año siguiente.
Series de Numeración (NNM1): Las series de numeración fiscal pueden asociarse a períodos contables específicos para reiniciar correlativos anuales o mantener control estricto por año calendario.


CASO DE NEGOCIO RESUELTO: OEC COMPUTERS
Escenario: OEC Computers está preparando el arranque de un nuevo año fiscal (2027). María, la Contadora General, necesita:

Crear el nuevo ejercicio 2027 estructurado en 12 subperíodos mensuales.
Garantizar que se puedan registrar pedidos de venta en diciembre 2026 con entrega y cobro a 60 días (vencimiento en febrero 2027).
Asegurar que las reglas contables vigentes en 2026 se mantengan operativas en 2027 sin reconfiguraciones manuales.

Resolución Técnica:

Creación del Ejercicio: En Gestión -> Inicialización del sistema -> Períodos contables, María pulsa Nuevo período.
Código de período: 2027.
Nombre de período: 2027.
Subperíodos: Selecciona Meses (el sistema genera automáticamente los sufijos 2027-01 a 2027-12).
Fecha de contabilización: 01.01.2027 a 31.12.2027.
Fecha de vencimiento: 01.01.2027 a 31.03.2028 (para permitir transacciones con crédito a clientes a 90 días sin alertas de rechazo).
Fecha de documento: 01.01.2027 a 31.12.2027.
Pulsa Añadir. SAP B1 crea los 12 subperíodos contables.
Herencia de Cuentas: El sistema copia automáticamente la Determinación de Cuentas de Mayor y la Determinación Avanzada activa en diciembre de 2026 hacia los 12 subperíodos de 2027.
Validación Operativa: Un agente comercial emite una cotización en diciembre de 2026 pactando entrega en enero de 2027. El sistema valida el período 2027-01 sin generar inconsistencias de inventario ni de tesorería.


BANCO DE EVALUACIÓN SITUACIONAL (CERTIFICACIÓN SAP B1)
¿Qué criterio utiliza SAP Business One para determinar automáticamente a qué subperíodo contable se asigna una factura de clientes o un asiento contable?

A) La Fecha del Documento (Tax Date).
B) La Fecha de Vencimiento del pago (Due Date).
C) La Fecha de Contabilización (Posting Date / RefDate).
D) La Fecha del sistema del servidor en el momento de guardar. Respuesta Correcta: C. La Fecha de Contabilización (RefDate) es el único parámetro que gobierna a qué período contable se imputa la transacción.

Al configurar un nuevo ejercicio fiscal en SAP Business One, ¿cuál de las siguientes afirmaciones es una regla mandatoria del sistema?

A) El ejercicio debe comenzar obligatoriamente el 1 de enero en todas las localizaciones.
B) La fecha de inicio del ejercicio debe corresponder siempre al primer día del mes especificado.
C) Los subperíodos solo pueden crearse una vez cerrado el ejercicio anterior.
D) No se pueden extender las fechas de vencimiento más allá del año calendario. Respuesta Correcta: B. SAP Business One exige que el inicio del ejercicio coincida exactamente con el primer día del mes calendario ingresado en la fecha de contabilización inicial.