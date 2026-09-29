UNIDAD 005: RECONCILIACIONES BANCARIAS INTERNAS Y EXTERNAS (SAP BUSINESS ONE 10.0)
Código de Manual: 10_BankProcess_21_BankReconcile_Overview_ES
Módulo Oficial: Gestión de Bancos (Banking)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Auditores Contables, Contadores y Agentes IA (Antigravity)
Carpeta Asociada: 005_10_BankProcess_21_BankReconcile_Overview_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "005",

  "topic": "Bank Reconciliation (Internal vs External Reconciliation & Bank Statement Processing)",

  "sap_module": "Banking_Reconciliation",

  "database_tables": {

    "internal_reconciliation": "OMTH",

    "internal_reconciliation_lines": "MTH1",

    "external_bank_statement": "OBNK",

    "bank_statement_processing": "OPBN",

    "journal_entries": "OJDT",

    "journal_lines": "JDT1"

  },

  "menu_paths": [

    "Gestión de bancos > Extractos de cuenta y reconciliaciones externas > Reconciliación",

    "Gestión de bancos > Extractos de cuenta y reconciliaciones externas > Reconciliación manual",

    "Gestión de bancos > Extractos de cuenta y reconciliaciones externas > Tratamiento de extracto bancario",

    "Finanzas > Reconciliación interna > Reconciliación"

  ],

  "reconciliation_types": {

    "Internal_Reconciliation": {

      "definition": "Compensación de partidas abiertas del Debe con partidas abiertas del Haber dentro de la misma cuenta o socio de negocios en SAP",

      "scope": "Cuentas de clientes (Factura vs Cobro), Cuentas de proveedores (Factura vs Pago), Cuentas transitorias de bancos",

      "status_affected": "Marca transacciones internas como compensadas"

    },

    "External_Reconciliation": {

      "definition": "Cotejo y conciliación entre los movimientos de la cuenta contable del Banco Propio en SAP y el extracto de cuenta externo emitido por la institución financiera",

      "scope": "Garantiza que el saldo en libros coincida exactamente con la posición bancaria real",

      "status_affected": "Marca transacciones de JDT1 como reconciliadas externamente (ExtrRecon = 'Y')"

    }

  },

  "external_reconciliation_methods": {

    "1_Reconciliacion_Estandar": {

      "availability": "Todas las localizaciones mundiales",

      "features": "Importación o tipeo manual de extracto externo. Modos: Manual, Automático o Semiautomático comparando columnas paralelas."

    },

    "2_Reconciliacion_Manual": {

      "availability": "Localizaciones anglosajonas y específicas (EE. UU., Reino Unido, Canadá, Australia, India, etc.)",

      "features": "Se ingresa el saldo final del extracto. El sistema calcula la diferencia contra las partidas marcadas y solo permite cerrar cuando Diferencia == 0."

    },

    "3_Tratamiento_Extracto_Bancario_BS_P": {

      "availability": "Todas las localizaciones mundiales",

      "features": "Máxima automatización. Permite importar ficheros bancarios electrónicos (SWIFT MT940, CAMT.053), generar pagos automáticos y reconciliar internamente y externamente en un solo paso."

    }

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Reconciliación Interna vs Reconciliación Externa
Uno de los conceptos más evaluados en certificaciones oficiales de SAP Business One es la diferenciación rigurosa entre ambos tipos de reconciliación:

Reconciliación Interna: Ocurre dentro del ERP. Consiste en cruzar un saldo deudor con un saldo acreedor para cancelar una partida pendiente. Ejemplo: cuando se emite una Factura de Clientes por $1,000 (Debe) y luego se registra un Cobro por $1,000 (Haber), SAP B1 ejecuta una reconciliación interna automática que cierra ambos documentos en el balance del tercero.
Reconciliación Externa: Conecta el ERP con el mundo exterior. Compara las partidas contabilizadas en la cuenta contable de mayor del Banco Propio con el extracto bancario oficial entregado por la entidad financiera. Verifica que cada cheque cobrado, transferencia recibida o comisión bancaria coincida al centavo.
2.2 Las Tres Opciones de Reconciliación Externa en SAP B1
Opción 1: Reconciliación Estándar (Reconciliation)
Disponible universalmente en todas las localizaciones.
El usuario introduce las líneas del extracto mediante la función Tratar extracto de cuenta externo.
En la pantalla de reconciliación se presentan dos grillas paralelas: a la izquierda las transacciones abiertas de SAP Business One y a la derecha los movimientos del extracto bancario.
Permite conciliación manual, o automática por parámetros (mismo importe, misma referencia, misma fecha).
Opción 2: Reconciliación Manual (Manual Reconciliation)
Muy extendida en localizaciones como Estados Unidos y Reino Unido.
El contador introduce la fecha de corte y el Saldo Final del Extracto Bancario.
El sistema presenta las partidas abiertas de la cuenta bancaria. A medida que el usuario marca las casillas de las transacciones verificadas, el sistema reduce la brecha entre el saldo en libros y el saldo del extracto.
Regla estricta: El botón Reconciliar solo se habilita cuando la Diferencia es exactamente 0.00. Si existen gastos bancarios o intereses no contabilizados en SAP, la ventana permite registrar asientos de ajuste directamente.
Opción 3: Tratamiento de Extractos Bancarios (TEB / Bank Statement Processing - BSP)
Es la funcionalidad de tesorería más avanzada de SAP Business One.
Diseñada para empresas donde la gran mayoría de cobros y pagos ocurren por transferencia electrónica.
Al importar el archivo bancario del día (ej. MT940), el sistema analiza las descripciones y referencias:
Si encuentra la factura de cliente coincidente, crea el cobro automáticamente, concilia internamente la factura y concilia externamente la línea del banco.
Si encuentra un gasto bancario no registrado, propone el asiento de comisiones de forma inmediata.


3. ATLAS DIDÁCTICO: EL CIRCUITO DE RECONCILIACIÓN
Flujo Integrado de Reconciliación en Compras:
Cuando se emite un pago por transferencia de $500 para cancelar una factura de proveedor, ocurren dos reconciliaciones necesarias:
Reconciliación 1 (Interna): Cruza el Debe del Pago Efectuado con el Haber de la Factura de Proveedor en la ficha del proveedor (OCRD).
Reconciliación 2 (Externa): Cruza el movimiento de salida en la cuenta bancaria de SAP con el renglón del extracto recibido del banco.
Comparativa de Pantallas de Reconciliación Externa:
Estructura de la grilla de Reconciliación Manual con contador dinámico de discrepancia a cero.
Flujo automatizado de Tratamiento de Extracto Bancario (TEB).


4. CASO DE NEGOCIO RESUELTO: CONCILIACIÓN SEMANAL EN OEC COMPUTERS
Escenario de Consultoría:
María, contable de OEC Computers, recibe el extracto bancario semanal de la cuenta corriente de Banco Pichincha. El saldo final del extracto al 30 de septiembre es de $45,200.00 USD. En el extracto aparecen:

3 depósitos de clientes acreditados exitosamente: $5,000, $3,200 y $1,800.
1 pago a proveedor por transferencia de $2,500.
Un débito por $15.00 USD por mantenimiento de cuenta bancaria, el cual aún no ha sido registrado en SAP Business One.
Ejecución de la Reconciliación Externa:
María abre Gestión de bancos > Extractos de cuenta y reconciliaciones externas > Reconciliación manual.
Introduce el saldo final del banco: $45,200.00 USD.
Marca las partidas correspondientes a los 3 depósitos y al pago del proveedor.
El sistema muestra una diferencia pendiente de -$15.00 USD.
Desde la misma ventana, María pulsa el botón Ajustes, selecciona la cuenta de gastos 530000 - Gastos y Comisiones Bancarias y registra el asiento por $15.00.
La diferencia en pantalla pasa a ser $0.00 USD.
Se activa el botón Reconciliar, cerrando el periodo bancario con total cuadratura contable.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
Cuando una empresa emite una transferencia bancaria para pagar una factura a un proveedor, ¿cuáles son las dos clases de reconciliación que deben tener lugar en SAP Business One?
A) Reconciliación de inventario y reconciliación fiscal.
B) Reconciliación interna (entre el pago y la factura en la cuenta del proveedor) y reconciliación externa (entre la cuenta bancaria en SAP y el extracto del banco).
C) Reconciliación de activos fijos y depreciación acumulada.
D) Reconciliación de tipo de cambio y conversión de monedas.
Respuesta Correcta: B
Justificación Técnica: La reconciliación interna cancela la deuda abierta con el proveedor en el auxiliar de socios de negocios; la reconciliación externa comprueba que el desembolso fue efectivamente debitado por el banco en el extracto oficial.
Pregunta 2
En la ventana de Reconciliación Manual de bancos, ¿cuál es la condición indispensable para que el sistema permita ejecutar la reconciliación?
A) Que todas las facturas del mes estén pagadas.
B) Que la diferencia calculada entre las partidas marcadas y el saldo final del extracto sea estrictamente 0.00.
C) Que el extracto bancario contenga al menos 50 líneas.
D) Que haya sido autorizada por el superusuario del sistema.
Respuesta Correcta: B
Justificación Técnica: La lógica financiera de SAP Business One exige que el balance coincida con exactitud matemática con el saldo reportado por la entidad bancaria antes de cerrar la reconciliación.
Pregunta 3
¿Qué funcionalidad de SAP Business One permite procesar ficheros bancarios electrónicos (como MT940), generar pagos automáticos y conciliar simultáneamente a nivel interno y externo?
A) El Asistente de Creación de Artículos.
B) El Tratamiento de Extracto Bancario (TEB / Bank Statement Processing).
C) El Generador de Consultas SQL.
D) El Asistente de Revalorización de Inventarios.
Respuesta Correcta: B
Justificación Técnica: TEB automatiza la ingesta de extractos bancarios electrónicos y dispone de reglas automáticas para contabilizar pagos y efectuar la doble reconciliación (interna y externa) en una sola operación.