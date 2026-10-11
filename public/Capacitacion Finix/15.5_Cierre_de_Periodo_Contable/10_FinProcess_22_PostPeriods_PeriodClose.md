GUÍA TÉCNICA Y OPERATIVA DE APRENDIZAJE: CIERRE DEL PERÍODO Y EJERCICIO CONTABLE (PERIOD-END CLOSING)
Módulo: Finanzas y Cierre Fiscal (SAP Business One 10.0)
Código de Unidad: DOC_115_FinProcess_PeriodEndClosing | Audiencia: Directores Financieros, Auditores Externos, Contadores Generales, Consultores Senior ERP

METADATOS TÉCNICOS
Módulo SAP: Gestión -> Utilidades -> Cierre del Período / Gestión -> Inicialización del sistema -> Períodos contables
Componente: Liquidación de Cuentas de Resultados (PyG), Arrastre de Saldos y Bloqueo de Períodos
Versión de SAP: 10.0 (HANA y SQL)
ID Documento Base: 10_FinProcess_22_PostPeriods_PeriodClose.pdf


JSON ANTIGRAVITY MASTER SCHEMA
{

  "$schema": "https://antigravity.softia.tech/schemas/v1/sap-b1-unit.json",

  "unit_id": "DOC_115_FinProcess_PeriodEndClosing",

  "title": "Proceso Integral de Cierre de Período, Liquidación de PyG y Gobernanza de Estados",

  "sap_module": "Financials / Administration",

  "source_manual": "10_FinProcess_22_PostPeriods_PeriodClose.pdf",

  "target_audience": ["Chief Financial Officers", "Senior Accounting Managers", "External Auditors", "Antigravity Agents"],

  "database_tables": {

    "header_tables": [

      {

        "table_name": "OFPR",

        "description": "Períodos Contables y Estado de Gobernanza (Posting Periods)",

        "key_fields": ["AbsEntry", "PeriodCat", "PeriodName", "PeriodStat"]

      },

      {

        "table_name": "OJDT",

        "description": "Asientos contables automáticos de cierre con origen BC (Closing Balances)",

        "key_fields": ["TransId", "TransType", "RefDate", "Memo", "BaseRef"]

      }

    ],

    "master_data_tables": [

      {

        "table_name": "OACT",

        "description": "Plan de Cuentas: Cuentas de PyG (Cajones 4-8), Cuenta Puente de Cierre y Beneficios Retenidos (Cajón 3)",

        "key_fields": ["AcctCode", "AcctName", "ActType", "LocManTran"]

      }

    ]

  },

  "menu_paths": {

    "closing_utility": "Gestión -> Utilidades -> Cierre del período",

    "posting_periods_status": "Gestión -> Inicialización del sistema -> Períodos contables",

    "general_authorizations": "Gestión -> Inicialización del sistema -> Autorizaciones -> Autorizaciones generales -> Módulo Gestión -> Estado del período: Período de cierre"

  },

  "business_rules": [

    {

      "rule_id": "BR_CLS_01",

      "name": "Mecánica de Dos Asientos Sincrónicos",

      "description": "El asistente de cierre genera automáticamente dos asientos por cada cuenta de PyG: 1) En la última fecha del período actual (ej. 31/12), debita/acredita la cuenta de PyG para saldarla en cero contra la Cuenta de Cierre de Período (cuenta puente); 2) En la primera fecha del siguiente período (ej. 01/01), debita/acredita la Cuenta de Cierre de Período contra la Cuenta de Arrastre de Saldos / Beneficios Retenidos en el Patrimonio Neto."

    },

    {

      "rule_id": "BR_CLS_02",

      "name": "Identificación de Asientos de Cierre (Origen BC)",

      "description": "Todas las transacciones generadas por el Asistente de Cierre portan el código de origen 'BC' (Balance Carryforward / Closing Balance). En los informes de Balance General pueden incluirse o excluirse mediante la casilla 'Añadir saldos de cierre'."

    },

    {

      "rule_id": "BR_CLS_03",

      "name": "Gobernanza de los 4 Estados del Período",

      "description": "Un período puede transitar entre 4 estados: 1) Desbloqueado (todos imputan); 2) Desbloqueado excepto ventas (restringe documentos de ventas); 3) Período de cierre (solo usuarios con autorización especial pueden imputar ajustes de auditoría); 4) Bloqueado (ningún usuario puede registrar operaciones bajo ninguna circunstancia)."

    },

    {

      "rule_id": "BR_CLS_04",

      "name": "Repetición del Cierre ante Imputaciones Posteriores",

      "description": "Si tras ejecutar el cierre se registran asientos de ajuste en un subperíodo con estatus 'Período de cierre', debe reejecutarse el Asistente de Cierre de Período para liquidar los deltas marginales acumulados hacia beneficios retenidos."

    }

  ]

}


DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
1. Ciclo de Cierre: Mensual vs. Anual
En SAP Business One, el cierre contable se opera con dos enfoques:

Cierre Mensual (Control Interno): Típicamente no se ejecuta la utilidad de cierre de PyG a fin de cada mes; en su lugar, se cambian los subperíodos pasados a estatus Bloqueado para evitar alteraciones, y se realizan tareas operativas de conciliación (conciliación bancaria externa, revisión de cuentas de compensación de existencias, aging de cartera y proveedores).
Cierre Anual (Cierre Fiscal Obligatorio): Se ejecuta al finalizar el ejercicio económico anual. Su objetivo primordial es transferir la totalidad de los saldos de ingresos y gastos (cajones 4 al 8) a la cuenta de Patrimonio Neto (Beneficios no distribuidos / Arrastre de saldos) en el cajón de Capital y Reservas, dejando las cuentas de resultados con saldo exacto de $0.00 para comenzar limpios el siguiente ejercicio.
2. Protocolo de 4 Fases para el Cierre Anual
Fase 1: Transición a 'Período de Cierre' (Closing Period):
En Gestión -> Inicialización del sistema -> Períodos contables, se cambia el estado del período a Período de cierre.
Esto bloquea la operación para los usuarios estándar de ventas, compras e inventario, permitiendo únicamente a contadores y auditores con la autorización especial Period Status: Closing Period registrar ajustes de cierre.
Fase 2: Tareas de Auditoría y Ajuste:
Contabilización de provisiones y amortizaciones de activos fijos del ejercicio.
Ajustes por diferencias de cambio y conversión de moneda extranjera (Finanzas -> Diferencias de tipo de cambio).
Conciliación interna de cuentas de control de compensación de existencias (Allocation Account).
Depuración de partidas abiertas dudosas.
Emisión de informes de control previo: Balance de Comprobación (Trial Balance), Auditoría de Stocks (Inventory Audit Report) y Conciliaciones de Proveedores y Clientes.
Respaldo obligatorio de la base de datos de la sociedad (Backup).
Fase 3: Ejecución del Asistente de Cierre del Período:
Ruta: Gestión -> Utilidades -> Cierre del período.
Se seleccionan las cuentas de ingresos y gastos, el período o subperíodos a cerrar, y se definen:
Cuenta de arrastre de saldos (Retained Earnings): Cuenta patrimonial definitiva (Cajón 3).
Cuenta de cierre de período (Period-End Closing Account): Cuenta puente transitoria que absorbe temporalmente los saldos.
El sistema genera una propuesta de liquidación detallada por cuenta. El usuario puede aceptar la propuesta en lote o individualmente.
Mecánica Contable de los 2 Asientos Automáticos:
Asiento A (Fecha: 31 de Diciembre):
Débito: Cuentas de Ingresos (para saldar su haber).
Crédito: Cuentas de Gastos (para saldar su debe).
Contrapartida: Cuenta de Cierre de Período (Saldo temporal acumulado del ejercicio).
Resultado: Las cuentas de PyG quedan estrictamente en $0.00 al cierre del año.
Asiento B (Fecha: 1 de Enero del siguiente ejercicio):
Se transfiere el saldo de la Cuenta de Cierre de Período hacia la cuenta patrimonial de Beneficios Retenidos.
Resultado: La cuenta puente queda en $0.00 y el patrimonio del nuevo ejercicio refleja la utilidad o pérdida neta acumulada.
Fase 4: Bloqueo Definitivo (Locked):
Se cambia el estatus de todos los subperíodos del ejercicio a Bloqueado. A partir de este momento, ninguna transacción puede registrarse en dicho ejercicio.
3. Gobernanza de los 4 Estados de Período Contable
| Estado | Ventas (O2C) | Compras (P2P) | Inventario / Bancos | Asientos de Ajuste | | :--- | :---: | :---: | :---: | :---: |\n| Desbloqueado (Unlocked) | Habilitado | Habilitado | Habilitado | Habilitado | | Desbloqueado excepto ventas | BLOQUEADO | Habilitado | Habilitado | Habilitado | | Período de cierre (Closing Period) | BLOQUEADO | BLOQUEADO | BLOQUEADO | Solo Usuarios Autorizados | | Bloqueado (Locked) | BLOQUEADO | BLOQUEADO | BLOQUEADO | BLOQUEADO |


CASO DE NEGOCIO RESUELTO: OEC COMPUTERS
Escenario: OEC Computers culmina el año fiscal 2026. Los ingresos totales por ventas sumaron $3,200,000.00 y los gastos operativos, costos de ventas y depreciación totalizaron $2,450,000.00, arrojando una utilidad neta de $750,000.00. María, la Contadora General, debe ejecutar el cierre contable oficial y garantizar el bloqueo del ejercicio.

Resolución Técnica:

Protección del Período: En Períodos contables, cambia el subperíodo 2026-12 a Período de cierre.
Auditoría Previa: Ejecuta la amortización final de activos fijos, corre el informe de diferencias de cambio por $12,400.00 y verifica que el informe de auditoría de inventario cuadre al centavo con la cuenta de mayor 140000.
Ejecución del Asistente: En Gestión -> Utilidades -> Cierre del período, selecciona todas las cuentas de PyG del ejercicio 2026. Define la cuenta puente 390000 (Cierre de Período) y la cuenta de patrimonio 310000 (Utilidades Retenidas / Arrastre de Saldos). Presiona Ejecutar.
Validación de Asientos Generados (Origen BC):
Asiento 1 (Fecha: 31/12/2026): Débito a Cuentas de Ingresos por $3,200,000.00, Crédito a Cuentas de Gastos por $2,450,000.00, y Crédito a la cuenta puente 390000 por $750,000.00. Todas las cuentas de resultados quedan en $0.00.
Asiento 2 (Fecha: 01/01/2027): Débito a la cuenta puente 390000 por $750,000.00 contra Crédito a la cuenta patrimonial 310000 (Utilidades Retenidas) por $750,000.00.
Bloqueo Definitivo: María cambia los 12 subperíodos del 2026 al estado Bloqueado, garantizando el congelamiento integral ante auditorías tributarias externas.


BANCO DE EVALUACIÓN SITUACIONAL (CERTIFICACIÓN SAP B1)
¿Qué asientos contables automáticos genera el Asistente de Cierre de Período al liquidar una cuenta de gastos?

A) Un solo asiento en la fecha actual debitando la cuenta de capital y acreditando el banco.
B) Dos asientos: el primero con fecha del último día del período liquidando el gasto contra la cuenta de cierre de período; el segundo con fecha del primer día del siguiente período trasladando el saldo a beneficios retenidos.
C) Un asiento preliminar que debe ser aprobado manualmente por el departamento de compras.
D) No genera asientos contables, solo bloquea la edición de facturas. Respuesta Correcta: B. La utilidad genera dos asientos: uno al final del ejercicio que salda el gasto a cero contra la cuenta transitoria de cierre, y otro al inicio del siguiente ejercicio que transfiere la utilidad/pérdida neta a la cuenta de capital y reservas.

Si una empresa necesita que durante el mes de enero los auditores continúen ingresando ajustes al mes de diciembre del año anterior sin que el resto del personal operativo emita transacciones en dicho mes, ¿qué estado debe fijarse en el período contable de diciembre?

A) Desbloqueado
B) Desbloqueado excepto ventas
C) Período de cierre (Closing Period)
D) Bloqueado (Locked) Respuesta Correcta: C. El estado Período de cierre restringe las imputaciones únicamente a aquellos usuarios que posean autorización explícita en Estado del período: Período de cierre, impidiendo el acceso a los usuarios operacionales regulares.