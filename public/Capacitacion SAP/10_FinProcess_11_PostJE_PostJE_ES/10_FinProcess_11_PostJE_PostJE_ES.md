GUÍA TÉCNICA Y OPERATIVA DE APRENDIZAJE: CONTABILIZACIÓN DE ASIENTOS MANUALES
Módulo: Finanzas y Procesos Contables (SAP Business One 10.0)
Código de Unidad: DOC_111_FinProcess_JournalEntries | Audiencia: Consultores Financieros, Auditores, Contadores y Agentes IA

METADATOS TÉCNICOS
Módulo SAP: Finanzas (Financials) -> Asiento (Journal Entry)
Componente: Contabilidad General y Fichero de Asientos
Versión de SAP: 10.0 (HANA y SQL)
ID Documento Base: 10_FinProcess_11_PostJE_PostJE_ES.pdf


JSON ANTIGRAVITY MASTER SCHEMA
{

  "$schema": "https://antigravity.softia.tech/schemas/v1/sap-b1-unit.json",

  "unit_id": "DOC_111_FinProcess_JournalEntries",

  "title": "Contabilización de Asientos Manuales y Transacciones de Anulación",

  "sap_module": "Financials",

  "source_manual": "10_FinProcess_11_PostJE_PostJE_ES.pdf",

  "target_audience": ["Financial Consultants", "Senior Accountants", "System Architects", "Antigravity Agents"],

  "database_tables": {

    "header_tables": [

      {

        "table_name": "OJDT",

        "description": "Fichero maestro de asientos contables (Journal Entries Header)",

        "key_fields": ["TransId", "TransType", "RefDate", "DueDate", "TaxDate", "Memo", "StornoDate", "AutoStorno"]

      },

      {

        "table_name": "CINF",

        "description": "Detalles de la empresa / Inicialización básica (Configuración de anulaciones)",

        "key_fields": ["NegStno"]

      }

    ],

    "line_tables": [

      {

        "table_name": "JDT1",

        "description": "Líneas de imputación de asientos contables (Journal Entries Lines)",

        "key_fields": ["TransId", "Line_ID", "Account", "ShortName", "Debit", "Credit", "FCDebit", "FCCredit", "DueDate", "ContraAct"]

      }

    ],

    "master_data_tables": [

      {

        "table_name": "OACT",

        "description": "Plan de Cuentas Contables (G/L Accounts)",

        "key_fields": ["AcctCode", "AcctName", "Postable"]

      },

      {

        "table_name": "OCRD",

        "description": "Datos Maestros de Socio de Negocios (Business Partners)",

        "key_fields": ["CardCode", "CardName", "CardType", "DebPayAcct"]

      }

    ]

  },

  "menu_paths": {

    "standard_path": "Finanzas -> Asiento",

    "storno_execution": "Finanzas -> Anular transacciones",

    "system_setup": "Gestión -> Inicialización del sistema -> Detalles de la empresa -> Inicialización básica -> Permitir importes negativos para contabilización de transacción de anulación"

  },

  "business_rules": [

    {

      "rule_id": "BR_JE_01",

      "name": "Balanceo Estricto Débito y Crédito",

      "description": "Ningún asiento puede ser registrado permanentemente en OJDT si la suma de Débito difiere de la suma de Crédito. El balance residual debe ser exactamente 0.00."

    },

    {

      "rule_id": "BR_JE_02",

      "name": "Imputación a Socios de Negocios con Cuenta Asociada",

      "description": "Al seleccionar un socio de negocios (CardCode en JDT1.ShortName mediante Ctrl+Tab), el sistema imputa automáticamente en JDT1.Account la cuenta asociada definida en OCRD, impidiendo desajustes entre el libro mayor y la contabilidad auxiliar."

    },

    {

      "rule_id": "BR_JE_03",

      "name": "Mecánica de Anulación Estándar vs. Importes Negativos",

      "description": "La anulación estándar invierte columnas (Débito a Crédito y viceversa), inflando los acumulados del Balance de Comprobación de Sumas y Saldos. La anulación con importes negativos (Storno contable estricto) registra valores negativos en el mismo lado original, preservando la veracidad de los acumulados de débito y crédito."

    },

    {

      "rule_id": "BR_JE_04",

      "name": "Anulación Programada Única",

      "description": "Al activar la casilla 'Anular' y especificar StornoDate, el sistema notifica al usuario al iniciar sesión en dicha fecha. Un asiento solo puede ser anulado formalmente una única vez."

    }

  ]

}


DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
1. Arquitectura del Fichero de Asientos en SAP Business One
En SAP Business One, toda transacción económica con impacto patrimonial converge en un único registro centralizado: el Fichero de Asientos (OJDT/JDT1).

Asientos Automáticos: Generados de forma transparente por documentos de compras (OPCH, OPDN), ventas (OINV, ODLN), gestión de bancos (ORCT, OVPM) e inventarios (OIGE, OIGN). Cada documento porta un código de origen identificador (TransType y prefijo en Memo, como FA para Facturas de Clientes, PU para Proveedores, RC para Cobros).
Asientos Manuales: Registrados directamente por el usuario contable para ajustes de cierre, provisiones, devengos, reclasificaciones de balance y gastos menores de caja chica. Tienen como origen y documento base el propio asiento (TransType = 30, identificador JE).
2. Operatoria de Captura y Atajos de Teclado
La ventana Finanzas -> Asiento ofrece herramientas avanzadas para optimizar la velocidad y precisión de la captura:

Navegación y Búsqueda en Cuentas y Socios:
Tab: Abre la lista del Plan de Cuentas (OACT) para imputaciones de mayor.
Ctrl + Tab: Abre la lista de Socios de Negocios (OCRD) para imputaciones a clientes o proveedores.
Búsqueda Parcial: El operador comodín * permite indexar registros alfanuméricos:
*[texto]: Filtra códigos o nombres que contienen o terminan con dicho texto.
[texto]*: Filtra códigos o nombres que inician con dicho texto.
Compensación Automática: Al ingresar importes en una fila, la siguiente fila sugiere automáticamente el importe residual en el lado opuesto para forzar el balanceo a cero.
Modo de Tratamiento Ampliado: Permite visualizar en panel lateral o inferior la totalidad de atributos analíticos de la línea seleccionada (Normas de reparto, Centros de coste, Proyectos, Fechas fiscales, Códigos de retención e impuestos).
3. Métodos de Anulación (Storno): Estándar vs. Importes Negativos
El estándar contable global y la normativa fiscal de múltiples jurisdicciones exigen rigor en la reversión de transacciones erróneas:

Transacción de Anulación Estándar:
Si el asiento original tenía un Débito de $2,050 en Cuenta A y Crédito de $2,050 en Cuenta B, la anulación estándar registra Débito de $2,050 en Cuenta B y Crédito de $2,050 en Cuenta A.
Consecuencia: El saldo neto final de las cuentas queda en cero, pero los totales acumulados de Debe y Haber del Balance de Sumas y Saldos aumentan artificialmente en $2,050 adicionales, distorsionando el volumen real de operaciones.
Transacción de Anulación con Importes Negativos (Storno Contable):
El sistema registra un importe negativo de -$2,050 en el Débito de Cuenta A y -$2,050 en el Crédito de Cuenta B.
Consecuencia: Se neutraliza el saldo neto y se reintegran los totales acumulados a cero en ambas columnas, reflejando fielmente la anulación contable sin inflar movimientos.
Activación: Se parametriza en Gestión -> Inicialización del sistema -> Detalles de la empresa -> ficha Inicialización básica -> Permitir importes negativos para contabilización de transacción de anulación (CINF.NegStno = 'Y').
4. Anulación Programada (Reversals)
Para operaciones de devengo (Accruals) o diferimientos de ingresos/gastos mensuales que deben revertirse el primer día del siguiente período:

Se marca la casilla Anular (OJDT.AutoStorno = 'Y') y se define la fecha futura de ejecución (OJDT.StornoDate).
Al iniciar sesión en dicha fecha, el sistema lanza la ventana de alerta Anular transacciones, donde el contador aprueba la reversa con un solo clic. El asiento resultante porta en comentarios (Anulación) - Asiento Nº XXXX y el documento original pasa a estatus Cancelado.


CASO DE NEGOCIO RESUELTO: OEC COMPUTERS
Escenario: María, la responsable de contabilidad de OEC Computers, requiere:

Registrar un gasto manual de papelería urgente pagado en efectivo de Caja Chica por $350.00.
Anular un asiento previo de amortización erróneo por $1,200.00 evitando inflar los totales de débito/crédito en el informe fiscal.
Registrar una provisión de bono por ventas de $4,500.00 al 31 de diciembre con reversión programada automática para el 1 de enero.

Resolución Técnica en SAP B1:

Asiento Manual: En Finanzas -> Asiento, ingresa la fecha contable. En la fila 1 digita 651000 (Gastos Útiles de Oficina) con Débito de $350.00. En la fila 2, digita 101000 (Caja General); el sistema autocompleta $350.00 en Haber. Crea el asiento (TransId = 10452).
Anulación en Rojo: Con Permitir importes negativos activo en CINF, localiza el asiento erróneo Nº 10420. Clic derecho -> Cancelar. SAP B1 genera el asiento Nº 10453 con -$1,200.00 en Debe y -$1,200.00 en Haber. El Balance de Sumas y Saldos refleja saldos y acumulados limpios en $0.00.
Reversión Programada: Registra Asiento Nº 10454 con Débito a Gastos de Bonos y Crédito a Provisión por Pagar por $4,500.00. Fecha contable: 31/12. Marca la casilla Anular y fija la fecha: 01/01. El 1 de enero, al ingresar al sistema, la ventana Anular transacciones solicita confirmación y ejecuta automáticamente el asiento inverso de apertura.


BANCO DE EVALUACIÓN SITUACIONAL (CERTIFICACIÓN SAP B1)
¿Qué sucede al consultar el Balance de Sumas y Saldos si se ejecuta una anulación estándar en lugar de una anulación con importes negativos?

A) El saldo final de la cuenta queda desbalanceado con diferencias de redondeo.
B) El saldo final queda en cero, pero las columnas de Debe acumulado y Haber acumulado se incrementan artificialmente.
C) El sistema bloquea el informe hasta que se ejecute la reconciliación interna.
D) Las transacciones quedan excluidas de los libros legales. Respuesta Correcta: B. La anulación estándar invierte los lados contables, lo que compensa el saldo final a cero pero aumenta los acumulados de ambas columnas, alterando la cifra neta de movimientos del período.

Al registrar una línea de asiento contable para un socio de negocios, ¿qué atajo de teclado debe emplearse para abrir el maestro de interlocutores comerciales en lugar del plan de cuentas?

A) Tab
B) Shift + F2
C) Ctrl + Tab
D) Alt + Enter Respuesta Correcta: C. La tecla Tab despliega el Plan de Cuentas (OACT), mientras que Ctrl + Tab abre la lista de Datos Maestros de Socios de Negocios (OCRD).