# Guion de Video: DOC 109 ControlReports AgingReports

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 109 ControlReports AgingReports.

## Contenido Principal (Visual: Diapositivas correspondientes)
DOC_109_ControlReports_AgingReports.md
BASE DE CONOCIMIENTO TÉCNICA ANTIGRAVITY - SAP BUSINESS ONE 10.0
Módulo de Finanzas y Control: Informes de Antigüedad de Saldos (Aging de Clientes y Proveedores)

METADATOS TÉCNICOS
Código de Documento: DOC_109_ControlReports_AgingReports
Archivo Fuente Original: 10_ControlReports_22_CashReports_Aging_ES.pdf (File ID: 1c-7WrO_424h2Z8t2X43jWT8q4dMmX7QE)
Módulo SAP Business One: Finanzas / Informes Financieros / Contabilidad / Antigüedad (Financials -> Financial Reports -> Accounting -> Aging)
Audiencia Objetivo: Gestores de Cobranzas, Analistas de Cuentas por Cobrar/Pagar (AR/AP), Auditores y Agentes de IA Antigravity.
Versión de SAP B1 Soportada: 10.0 (SQL Server & SAP HANA).


JSON ANTIGRAVITY MASTER SCHEMA
{

  "$schema": "https://antigravity.ai/schemas/sap_b1_aging_reports_v10.json",

  "unit_id": "109_ControlReports_AgingReports",

  "module": "Financials",

  "submodule": "Accounting / Aging Analysis",

  "database_tables": {

    "business_partners": "OCRD",

    "business_partner_addresses": "CRD1",

    "payment_terms": "OCTG",

    "invoices_customers": "OINV",

    "invoices_vendors": "OPCH",

    "credit_memos_customers": "ORIN",

    "credit_memos_vendors": "ORPC",

    "journal_entries": "OJDT",

    "journal_lines": "JDT1"

  },

  "menu_paths": {

    "customer_aging": "Finanzas -> Informes financieros -> Contabilidad -> Antigüedad -> Antigüedad de créditos de clientes",

    "vendor_aging": "Finanzas -> Informes financieros -> Contabilidad -> Antigüedad -> Antigüedad de deudas de proveedores",

    "payment_terms_setup": "Gestión -> Definiciones -> Interlocutores comerciales -> Condiciones de pago"

  },

  "aging_date_mechanics": {

    "aging_date_definition": "Fecha base de corte contra la cual se compara la fecha de vencimiento contractual (DocDueDate) de cada transacción abierta.",

    "future_due_column": "Columna 'Pago pendiente' (Future Due): Importes cuya fecha de vencimiento es posterior a la fecha de corte.",

    "past_due_intervals": "Columnas de mora escalonadas (0-30 días, 31-45 días, 46-75 días, 76-100 días, >100 días)."

  },

  "connected_bp_mechanism": {

    "checkbox": "Considerar clientes/proveedores conectados",

    "logic": "Si un Interlocutor Comercial está configurado simultáneamente como Cliente (CardType='C') y Proveedor (CardType='S') mediante el campo FatherCard/Connected BP, el informe compensa deudas y acreencias para reflejar la exposición crediticia neta."

  },

  "critical_controls": {

    "unreconciled_transactions_only": "El informe lee exclusivamente partidas abiertas sin reconciliación interna (JDT1.ReconSum = 0 o parcial).",

    "communication_integration": "Capacidad nativa de despachar extractos de cuenta y estados de morosidad directamente por correo electrónico (SMTP/Outlook) a cada contacto del cliente desde la grilla del reporte."

  }

}


DESARROLLO CONCEPTUAL Y FUNCIONAL
1. Propósito Estratégico de los Informes de Antigüedad (Aging Reports)
Una compañía puede ser altamente rentable en sus estados financieros de pérdidas y ganancias, pero quebrar debido a problemas graves de cobranza o iliquidez. Los informes de antigüedad son el instrumento de control monetario primario de los ciclos de Ventas (Order-to-Cash) y Compras (Procure-to-Pay).

SAP Business One proporciona dos informes gemelos con estructuras simétricas:

Antigüedad de Créditos de Clientes (Customer Aging): Muestra el dinero que los clientes adeudan a la empresa, segmentado por el tiempo exacto que lleva vencida cada factura. Evalúa la calidad crediticia y el riesgo de incobrabilidad.
Antigüedad de Deudas de Proveedores (Vendor Aging): Muestra los compromisos de pago que la empresa mantiene con sus proveedores, permitiendo programar pagos para evitar penalizaciones, intereses por mora o suspensiones de suministro.
2. Mecánica de Cálculo: Fecha de Antigüedad e Intervalos de Vencimiento
El informe opera comparando dos fechas críticas:

Fecha de Antigüedad (Aging Date): Es la fecha de corte analítico establecida por el usuario (típicamente el día actual o el último día de un mes cerrado).
Fecha de Vencimiento (Due Date / DocDueDate): La fecha contractual de pago derivada de las Condiciones de Pago (OCTG) asignadas al maestro del cliente (OCRD.GroupNum).

Estructura de Columnas del Informe:

Columna "Pago Pendiente" (Future Due): Registra aquellas transacciones cuya fecha de vencimiento es posterior a la fecha de corte. Es deuda vigente que aún no incurre en mora.
Intervalos de Antigüedad Vencida: Tramos temporales configurables (en días, meses o períodos) para clasificar la deuda atrasada:
Tramo 1 (0 - 30 días): Mora temprana o retrasos operativos menores.
Tramo 2 (31 - 45 días): Mora moderada; requiere llamada de seguimiento del ejecutivo comercial.
Tramo 3 (46 - 75 días): Mora severa; activación de cartas de reclamación Nivel 2 y suspensión de crédito.
Tramo 4 (76 - 100+ días): Cartera de alto riesgo o pre-judicial; provisión de cuentas incobrables.
Línea de Porcentajes Relativos: Al pie de cada columna, el informe calcula qué porcentaje del saldo total vencido representa cada tramo temporal, permitiendo diagnósticos inmediatos del estado de la cartera.
3. Tipos de Transacciones Incluidas y Valores Negativos
El informe no se limita a facturas de clientes (OINV), sino que procesa cualquier asiento abierto en la cuenta asociada:

Facturas de Clientes (OINV): Figuran con importes positivos (saldo deudor).
Abonos / Notas de Crédito de Clientes (ORIN): Aparecen entre paréntesis (valores negativos), reduciendo el saldo total de la deuda.
Cobros a Cuenta / Pagos Anticipados (ORCT no reconciliados): Disminuyen el saldo exigible.
Asientos Manuales (OJDT): Ajustes directos imputados a la cuenta auxiliar del socio de negocios.
4. Compensación de Interlocutores Conectados (Connected Business Partners)
En muchos escenarios comerciales, una empresa compra insumos a un proveedor que, a su vez, le adquiere productos terminados (es cliente y proveedor simultáneo). En SAP Business One:

Se crean dos códigos maestros en OCRD (ej. C20000 como cliente y V20000 como proveedor) y se enlazan formalmente.
Al marcar la casilla Considerar clientes/proveedores conectados en la ventana de criterios de selección:
El informe de antigüedad de créditos del cliente inserta las facturas de proveedores pendientes de dicho socio en negativo debajo de las facturas de cliente.
Se calcula un Saldo Neto de Exposición Crediticia, permitiendo a Tesorería retener pagos o compensar saldos antes de liberar despachos o emitir transferencias bancarias.


CASO DE NEGOCIO RESUELTO: OEC COMPUTERS
Contexto: OEC Computers tiene problemas de liquidez a fin de mes. María, la Contadora General, detecta que varios clientes mayoristas están dilatando sus pagos a más de 60 días, mientras que el proveedor estratégico Funtech exige el pago de sus facturas de materias primas.

Ejecución Operativa:

Emisión de la Antigüedad de Créditos de Clientes:
Ruta: Finanzas -> Informes financieros -> Contabilidad -> Antigüedad -> Antigüedad de créditos de clientes.
Fecha de antigüedad: 30.09.2026. Intervalo: 30 días.
Vista detallada (desglosando cada documento).
Hallazgos en Cartera:
Cliente Microchips: Saldo total $15,970.00. Factura de $11,000.00 vencida hace 85 días (Riesgo crítico).
Cliente Surf O’bello: Saldo $4,600.00. Factura de $3,100.00 en tramo 0-30 días y $1,500.00 en pago pendiente.
Cliente Funtech: Saldo en facturas de venta $21,500.00 (con $20,000 pendientes de vencer y $1,000 en mora 0-30 días), menos un Abono de clientes de -$750.00.
Activación de Interlocutor Conectado (Funtech):
Funtech también le vende accesorios a OEC Computers (Proveedor V-Funtech).
María marca la casilla Considerar proveedores conectados.
El informe añade dos facturas de proveedores pendientes de Funtech: -$500.00 y -$200.00.
Resultado: El saldo deudor bruto de Funtech pasa de $20,750.00 a un saldo neto compensado de $20,050.00.
Plan de Acción Derivado:
Se envía por correo electrónico el extracto del Aging directamente al contacto de pagos de Microchips advirtiéndole que pasará al Asistente de Reclamaciones si no liquida los $11,000.00 en 48 horas.
Se ajustan las condiciones de pago futuras de Microchips de Neto 60 días a Pago al Contado contra Entrega (COD).


BANCO DE EVALUACIÓN SITUACIONAL (TIPO CERTIFICACIÓN SAP)
Pregunta 1
Enunciado: En el informe de Antigüedad de Créditos de Clientes de SAP Business One, un consultor observa una cifra de $20,000.00 en la columna "Pago Pendiente" (Future Due) para un cliente, y otra de $1,000.00 en la columna "0-30 días". ¿Cuál es el significado contable exacto de estos valores?

A) Los $20,000.00 corresponden a un anticipo no registrado y los $1,000.00 son intereses moratorios.
B) Los $20,000.00 corresponden a una factura cuya fecha de vencimiento es posterior a la Fecha de Antigüedad establecida (deuda vigente no vencida), mientras que los $1,000.00 corresponden a una factura que ya ha superado su fecha de vencimiento entre 1 y 30 días respecto a la fecha de corte.
C) Los $20,000.00 representan el límite de crédito disponible y los $1,000.00 el saldo bancario.
D) Ambos importes están vencidos pero en monedas diferentes.
Respuesta Correcta: B
Justificación Técnica: La columna "Pago Pendiente" agrupa todas las partidas abiertas cuya fecha de vencimiento contractual está en el futuro respecto a la fecha de corte del reporte. Las columnas de intervalos (0-30, 31-45, etc.) muestran exclusivamente partidas que ya entraron en mora efectiva.
Pregunta 2
Enunciado: ¿Para qué se utiliza la opción "Considerar clientes/proveedores conectados" en los criterios de selección de los informes de antigüedad de SAP Business One?

A) Para consolidar automáticamente todas las bases de datos de una corporación multi-sociedad.
B) Para permitir que el informe muestre simultáneamente las deudas comerciales de clientes y las obligaciones con proveedores en caso de que una misma entidad física actúe como cliente y suplidor de la empresa, compensando los saldos pendientes.
C) Para enviar una copia del informe al banco del cliente mediante EDI.
D) Para bloquear el acceso de usuarios no autorizados a la tabla OCRD.
Respuesta Correcta: B
Justificación Técnica: Al marcar esta opción, si un socio de negocios tiene registros enlazados como cliente y proveedor, el sistema refleja ambas corrientes de documentos en una sola vista, calculando el saldo neto adeudado o por cobrar para fines de compensación financiera.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
