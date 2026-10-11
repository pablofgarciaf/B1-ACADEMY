DOC_105: Ajustes de Contabilidad de Costes y Reasignación entre Centros de Coste en SAP Business One 10.0
Metadatos Técnicos
Módulo SAP: Contabilidad de Costes y Finanzas (Cost Accounting Adjustments)
Código de Documento: DOC_105_CostandBudget_CostAdjustment
Archivo Fuente Analizado: 10_CostandBudget_13_CostAcc_CostAdjustment.pdf (File ID: 1O3PZupK-DcM3WOmJ4tM83qtFDWKpbsuu)
Audiencia Objetivo: Contadores de Costos, Controladores de Gestión, Auditores Internos y Agentes Autónomos de IA / Antigravity
Prerrequisitos: DOC_103 (Contabilidad de Costes Básica), DOC_104 (Dimensiones Múltiples), Asientos Contables (OJDT), Numeración de Documentos (NNM1)


JSON Antigravity Master Schema
{

  "antigravity_schema_version": "2.0_Master",

  "document_id": "DOC_105_CostandBudget_CostAdjustment",

  "sap_module": "Financials - Cost Accounting Adjustments",

  "db_tables": {

    "adjustment_entry_tables": [

      {

        "table_name": "OJDT",

        "description": "Cabecera del Asiento Contable dedicado a Ajustes de Contabilidad de Costes",

        "columns": ["TransId", "Series", "RefDate", "Memo", "TransType"]

      },

      {

        "table_name": "JDT1",

        "description": "Líneas del Asiento de Ajuste: imputación a la cuenta puente exclusiva y normas directas de centros emisor y receptor",

        "columns": ["TransId", "Line_ID", "Account", "Debit", "Credit", "ProfitCode", "OcrCode2"]

      }

    ],

    "configuration_tables": [

      {

        "table_name": "NNM1",

        "description": "Definición de Series de Numeración con indicador 'Solo para ajuste de contabilidad de costes'",

        "primary_key": "Series"

      },

      {

        "table_name": "OACT",

        "description": "Detalles de Cuenta de Mayor con indicador 'Solo para ajuste de contabilidad de costes'",

        "primary_key": "AcctCode"

      },

      {

        "table_name": "CINF / OADM",

        "description": "Parametrizaciones Generales - Ficha Contabilidad de Costes (Campos de serie y cuenta por defecto de ajuste)"

      }

    ]

  },

  "menu_paths": [

    "Gestión -> Inicialización del sistema -> Numeración de documentos -> Asientos (Casilla Solo para ajuste de contabilidad de costes)",

    "Finanzas -> Plan de cuentas -> Detalles de cuenta (Casilla Solo para ajuste de contabilidad de costes)",

    "Gestión -> Inicialización del sistema -> Parametrizaciones generales -> Ficha Contabilidad de costes (Sección Parametrizaciones de ajuste de contabilidad de costes)",

    "Finanzas -> Asiento para ajuste de contabilidad de costes",

    "Finanzas -> Informes financieros -> Informes de contabilidad de costes -> Informe de distribución (Botón Ajuste de contabilidad de costes)",

    "Finanzas -> Contabilidad de costes -> Normas de reparto (Botón Ajuste de contabilidad de costes)",

    "Finanzas -> Contabilidad de costes -> Tabla de centros de coste y normas de reparto (Botón Ajuste de contabilidad de costes)"

  ],

  "business_rules": [

    "Regla 1: El Asiento para Ajuste de Contabilidad de Costes es una transacción contable especializada que reasigna importes entre centros de coste sin distorsionar los saldos financieros del libro mayor.",

    "Regla 2: Requiere obligatoriamente una Serie de Numeración dedicada marcada con la casilla 'Solo para ajuste de contabilidad de costes' en NNM1.",

    "Regla 3: Requiere una Cuenta de Mayor intermedia (puente) configurada en OACT con la casilla 'Solo para ajuste de contabilidad de costes'. Esta cuenta debe debitarse y acreditarse por el mismo importe exacto, cerrando con saldo cero.",

    "Regla 4: Ambos parámetros (Serie y Cuenta) deben enlazarse en las Parametrizaciones Generales (ficha Contabilidad de costes).",

    "Regla 5: La reasignación entre centros de coste se realiza utilizando exclusivamente la Norma de Reparto de asignación directa de cada centro en cada línea del asiento.",

    "Regla 6: Si el ajuste requiere revisión o aprobación previa antes de su contabilización formal en el libro mayor, puede crearse dentro de un Documento Preliminar / Comprobante de Diario (Journal Voucher)."

  ],

  "accounting_impact": {

    "general_ledger_net_effect": "0.00 (Saldo financiero neutro en balance)",

    "cost_accounting_net_effect": "Disminución de costos en el centro de coste emisor / Aumento equivalente de costos en el centro de coste receptor"

  }

}


Desarrollo Conceptual y Funcional Exhaustivo
1. Propósito de los Ajustes de Contabilidad de Costes
Durante el ejercicio operativo diario, los gastos se distribuyen entre los centros de coste según normas de reparto predefinidas (por ejemplo, catering o suministros distribuidos por número de colaboradores fijos de cada departamento). Sin embargo, ocurren situaciones dinámicas excepcionales:

Colaboradores de soporte técnico reasignados temporalmente al departamento de desarrollo para pruebas intensivas de software antes de un lanzamiento.
Préstamo de recursos, equipos o maquinaria entre plantas o sucursales.
Desvíos operativos detectados al cierre contable mensual.

Para reflejar fielmente la realidad económica sin alterar la contabilidad financiera legal ni modificar las facturas históricas ya cerradas, SAP Business One provee la transacción Asiento para ajuste de contabilidad de costes (Journal Entry for Cost Accounting Adjustment).
2. Arquitectura de Configuración en Tres Pasos
Para habilitar esta funcionalidad, el sistema exige tres parametrizaciones previas e interconectadas:
Paso 1: Definición de Serie de Numeración Dedicada
Ruta: Gestión -> Inicialización del sistema -> Numeración de documentos.
Se hace doble clic sobre la fila Asientos.
Se añade una nueva serie (ej. AJ-CC) y se marca obligatoriamente la casilla: Solo para ajuste de contabilidad de costes (Cost Accounting Adjustment Only).
Paso 2: Creación de la Cuenta Puente de Ajuste
Ruta: Finanzas -> Plan de cuentas.
Se crea una cuenta de compensación transitoria en el grupo de gastos (ej. 610999 - Cuenta Puente Ajustes de Costes).
En Detalles de cuenta, se marca la casilla: Solo para ajuste de contabilidad de costes.
Esta bandera restringe el uso de la cuenta, impidiendo que sea seleccionada en facturas de proveedores, clientes o cobros/pagos regulares.
Paso 3: Enlace en Parametrizaciones Generales
Ruta: Gestión -> Inicialización del sistema -> Parametrizaciones generales -> Ficha Contabilidad de costes.
En la sección Parametrizaciones de ajuste de contabilidad de costes:
Se asigna la Serie por defecto definida en el Paso 1.
Se asigna la Cuenta de mayor por defecto definida en el Paso 2.
3. Ejecución del Asiento de Ajuste
La ventana especializada puede abrirse desde múltiples vías:

Desde el menú: Finanzas -> Asiento para ajuste de contabilidad de costes.
Desde reportes de control: Pulsando el botón Ajuste de contabilidad de costes en el Informe de distribución, en la ventana Normas de reparto o en la Tabla de centros de coste y normas de reparto.
Desde Comprobantes de Diario (Journal Vouchers): Para someter el ajuste a revisión gerencial antes del registro definitivo.
Mecánica Contable de la Transacción:
Línea 1 (Aumento de costo en Centro Receptor):
Cuenta: 610999 - Cuenta Puente Ajustes
Importe: Debe (ej. $200 USD)
Norma de Reparto: Norma directa del centro de coste receptor (ej. CC_DEV)
Línea 2 (Disminución de costo en Centro Emisor):
Cuenta: 610999 - Cuenta Puente Ajustes
Importe: Haber (ej. $200 USD)
Norma de Reparto: Norma directa del centro de coste emisor (ej. CC_SOPORTE)

Impacto en Libros:

Libro Mayor: El impacto neto en la cuenta puente es $0.00 ($200 al Debe - $200 al Haber), por lo que el saldo del Balance General y el Estado de Resultados de la empresa no sufre ninguna alteración.
Contabilidad de Costes: El Informe de Distribución y el Pérdidas y Ganancias por Centro de Coste reflejan con exactitud la disminución de $200 USD en Soporte y el incremento de $200 USD en Desarrollo.


Caso de Negocio Resuelto en OEC Computers
Escenario
En OEC Computers, los gastos de catering y cafetería mensual ($2,500 USD) se distribuyen automáticamente entre Ventas ($500), Soporte ($1,000) y Desarrollo ($750) según la norma NR_EMPLEADOS (con $250 a Center_z).

Durante el mes corriente, dos ingenieros del equipo de Soporte fueron asignados durante dos semanas al equipo de Desarrollo para el control de calidad de un nuevo producto. La gerencia instruye reasignar $200 USD del gasto de catering desde Soporte hacia Desarrollo.
Ejecución en el Sistema
El contador abre el Informe de distribución en Finanzas -> Informes financieros -> Informes de contabilidad de costes.
Selecciona la fila de Desarrollo y pulsa Ajuste de contabilidad de costes.
Se despliega automáticamente la ventana de asiento de ajuste con la serie AJ-CC:
Fila 1: Cuenta 610999 | Debe: $200 USD | Norma de reparto: CC_DEV.
Fila 2: Cuenta 610999 | Haber: $200 USD | Norma de reparto: CC_SOPORTE.
Se registra el asiento.
Al volver a emitir el Informe de Centro de Coste:
Soporte muestra $800 USD ($1,000 original - $200 ajuste).
Desarrollo muestra $950 USD ($750 original + $200 ajuste).
La contabilidad general de OEC Computers permanece perfectamente balanceada.


Banco de Evaluación Situacional
Pregunta 1
¿Cuál es la función primordial de la casilla 'Solo para ajuste de contabilidad de costes' al configurar una serie de numeración o una cuenta contable? A) Ocultar los datos a los auditores externos durante el cierre fiscal.
B) Restringir su uso exclusivamente para asientos dedicados de reasignación de costos entre centros de coste, impidiendo su selección en transacciones comerciales habituales.
C) Permitir que la cuenta contable registre saldos negativos en el balance general.
D) Convertir automáticamente una cuenta de activo en una cuenta de gastos.

Respuesta Correcta: B
Justificación Técnica: La bandera 'Cost Accounting Adjustment Only' en NNM1 y OACT garantiza el aislamiento funcional de la cuenta intermedia y de la serie, asegurando que solo se empleen en la ventana especializada de ajustes de costos.
Pregunta 2
Al ejecutar un Asiento para Ajuste de Contabilidad de Costes entre el centro de coste A (emisor) y el centro de coste B (receptor), ¿qué efecto contable tiene la transacción sobre el libro mayor de la sociedad? A) Aumenta el gasto total de la empresa en el importe transferido.
B) Disminuye el patrimonio neto por el valor del ajuste.
C) El efecto neto en el libro mayor es de cero (0.00), ya que la misma cuenta intermedia se debita y acredita por idéntico valor.
D) Genera una diferencia de conversión obligatoria hacia la moneda del sistema.

Respuesta Correcta: C
Justificación Técnica: El asiento de ajuste utiliza una cuenta puente en ambas líneas (una al Debe y otra al Haber por el mismo monto), por lo que el saldo global en el libro mayor es neutro y solo se redistribuyen las imputaciones analíticas en los centros de coste.
Pregunta 3
Si un controlador financiero necesita que los ajustes de contabilidad de costes de fin de mes sean auditados y validados por el Director Financiero antes de impactar los informes definitivos, ¿qué mecanismo de SAP Business One debe utilizar? A) Crear el ajuste en una hoja de cálculo externa e importarlo por DTW al mes siguiente.
B) Ingresar el asiento de ajuste dentro de un Comprobante de Diario (Journal Voucher).
C) Bloquear todos los centros de coste con una alerta SQL.
D) Modificar la tabla ODRF mediante una búsqueda formateada.

Respuesta Correcta: B
Justificación Técnica: Los Comprobantes de Diario (Journal Vouchers) permiten registrar transacciones preliminares en borrador que pueden ser revisadas, aprobadas o modificadas colectivamente antes de su inserción definitiva en el libro mayor.