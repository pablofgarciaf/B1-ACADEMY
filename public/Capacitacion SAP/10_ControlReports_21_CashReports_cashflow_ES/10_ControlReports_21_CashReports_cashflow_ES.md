DOC_108_ControlReports_CashFlow.md
BASE DE CONOCIMIENTO TÉCNICA ANTIGRAVITY - SAP BUSINESS ONE 10.0
Módulo de Finanzas: Informes de Control de Flujo de Efectivo y Previsión Gráfica de Liquidez

METADATOS TÉCNICOS
Código de Documento: DOC_108_ControlReports_CashFlow
Archivo Fuente Original: 10_ControlReports_21_CashReports_cashflow_ES.pdf (File ID: 1Rdp9QBE-IXcGZTyFrFHFtpDNcMLeMXwL)
Módulo SAP Business One: Finanzas / Informes Financieros / Informes de Flujo de Caja (Financials -> Financial Reports -> Financial -> Cash Flow)
Audiencia Objetivo: Tesoreros, Directores de Finanzas, Contadores Generales y Agentes de IA Antigravity.
Versión de SAP B1 Soportada: 10.0 (SQL Server & SAP HANA).


JSON ANTIGRAVITY MASTER SCHEMA
{

  "$schema": "https://antigravity.ai/schemas/sap_b1_cash_flow_reports_v10.json",

  "unit_id": "108_ControlReports_CashFlow",

  "module": "Financials",

  "submodule": "Cash Flow Reporting & Forecasting",

  "database_tables": {

    "cash_flow_line_items": "OCSH",

    "cash_flow_transactions": "CSH1",

    "journal_entries": "OJDT",

    "journal_lines": "JDT1",

    "invoices_customers": "OINV",

    "orders_customers": "ORDR",

    "invoices_vendors": "OPCH",

    "purchase_orders": "OPOR",

    "drafts_documents": "ODRF"

  },

  "menu_paths": {

    "cash_flow_report": "Finanzas -> Informes financieros -> Financiero -> Flujo de caja",

    "cash_flow_forecast": "Finanzas -> Previsión de flujo de efectivo",

    "cash_flow_statement_legal": "Finanzas -> Informes financieros -> Financiero -> Estado de flujos de efectivo",

    "cash_flow_defaults": "Gestión -> Inicialización del sistema -> Parametrizaciones generales -> Ficha Flujo de efectivo"

  },

  "security_levels_hierarchy": {

    "level_1_highest": "Cuentas monetarias (Caja y Bancos propios en moneda local y extranjera)",

    "level_2_high": "Documentos de cobro en cartera (Tarjetas de crédito y cheques recibidos no depositados)",

    "level_3_medium": "Deudas de clientes líquidas (Facturas de clientes abiertas) y Deudas con proveedores (Facturas de proveedores abiertas)",

    "level_4_lowest": "Previsiones operativas y no devengadas (Pedidos de clientes ORDR, Pedidos de compras OPOR, Documentos preliminares ODRF y Contabilizaciones proyectadas manuales)"

  },

  "visual_analytics": {

    "bar_chart_inflows": "Color Azul (Cobros esperados y entradas proyectadas)",

    "bar_chart_outflows": "Color Verde (Pagos programados y salidas proyectadas)",

    "line_chart": "Curva de Saldo Neto e Importes Acumulados de Liquidez"

  },

  "critical_controls": {

    "unreconciled_open_transactions": "El flujo de caja proyectado se calcula en función estricta de las partidas abiertas (no reconciliadas) y su fecha de vencimiento contractual (DocDueDate).",

    "projected_postings_injection": "Capacidad de simular desembolsos extraordinarios no registrados contablemente (ej. adquisición de flota o reparto de dividendos) mediante la tabla 'Incluir contabilizaciones proyectadas'."

  }

}


DESARROLLO CONCEPTUAL Y FUNCIONAL
1. Naturaleza y Propósito del Flujo de Caja en SAP Business One
A diferencia de la Cuenta de Pérdidas y Ganancias (que opera bajo el principio contable de devengo independientemente de cuándo se cobre o pague), el Informe de Flujo de Caja (Cash Flow) mide la liquidez financiera real y proyectada de la empresa. Evalúa si la sociedad dispondrá de los fondos monetarios suficientes para cumplir sus compromisos operativos a corto y medio plazo.

El motor de cálculo de SAP Business One consolida:

Saldos Disponibles Inmediatos: Fondos líquidos existentes en cuentas de banco y cajas registradoras.
Flujos Futuros Contractuales: Entradas y salidas pendientes clasificadas en función de su fecha de vencimiento (DocDueDate) y agrupadas en intervalos temporales (diarios, semanales, quincenales, mensuales o trimestrales).
2. Jerarquía de Niveles de Seguridad (Certeza de Conversión a Efectivo)
Dado que no todos los documentos abiertos presentan la misma probabilidad de cobro o pago, SAP Business One clasifica los componentes del flujo de caja mediante una escala jerárquica de Niveles de Seguridad (Security Levels):

Nivel 1 (Máxima Certeza - Cuentas Monetarias): Saldos reales en cuentas corrientes bancarias (GL Accounts marcadas como cuentas de efectivo) y fondos de caja menor. Certeza: 100%.
Nivel 2 (Alta Certeza - Valores en Cartera): Cheques posfechados recibidos en cobros pendientes de depositar y cupones de tarjetas de crédito en tránsito.
Nivel 3 (Certeza Media - Deudas Comerciales Devengadas): Facturas de Clientes (OINV) pendientes de cobro y Facturas de Proveedores (OPCH) pendientes de pago.
Nivel 4 (Baja Certeza - Previsiones y Compromisos Operativos):
Pedidos de clientes (ORDR): Ventas confirmadas pendientes de entrega y facturación.
Pedidos de compras (OPOR): Órdenes de abastecimiento colocadas a suplidores.
Documentos preliminares (ODRF): Borradores de marketing o transacciones sujetas a circuitos de autorización.
Contratos o Acuerdos Globales autorizados (OOAT).
Transacciones periódicas recurrentes (OTOR).
3. El Informe de Previsión de Flujo de Efectivo (Herramienta Gráfica Interactiva)
En SAP Business One 10.0, la herramienta de Previsión de flujo de efectivo proporciona un tablero dinámico e interactivo:

Gráfico de Barras Bicolor:
Barras Azules: Representan entradas de fondos previstas (cobros a clientes, depósitos).
Barras Verdes: Representan salidas de fondos proyectadas (pagos a proveedores, amortizaciones de deuda).
Gráfico de Líneas: Traza la trayectoria de la liquidez neta acumulada en el horizonte de tiempo, alertando al instante si la curva cruza por debajo de la línea cero (déficit de caja previsto).
Interactividad en Tiempo Real: El usuario puede arrastrar sliders temporales en pantalla o desmarcar niveles de seguridad (por ejemplo, excluir pedidos y ver solo facturas en mano), recalculando los gráficos de forma instantánea.
4. Contabilizaciones Proyectadas y Documento Legal
Contabilizaciones Proyectadas: Permite al departamento financiero insertar transacciones ficticias o estimadas que aún no tienen sustento documental en el sistema (por ejemplo, la compra programada de un montacargas dentro de 45 días por $35,000.00). Estas líneas se identifican en color verde en el reporte analítico.
Estado de Flujos de Efectivo (Informe Legal): A diferencia del reporte de pronóstico operativo, el Estado de flujos de efectivo es un estado contable legal oficial requerido por normas internacionales (NIIF/GAAP), que clasifica las salidas y entradas en: Actividades de Explotación, Inversión y Financiación. Su parametrización inicial se define en Gestión -> Inicialización del sistema -> Parametrizaciones generales -> Ficha Flujo de efectivo.


CASO DE NEGOCIO RESUELTO: OEC COMPUTERS
Contexto: OEC Computers afrontará en los próximos 30 días el pago de nóminas extraordinarias y una importación masiva de servidores. María, la Contadora, necesita evaluar si los saldos de tesorería y los cobros de clientes cubrirán los pagos a proveedores sin necesidad de recurrir a una línea de sobregiro bancario.

Ejecución Operativa:

Configuración de Criterios de Selección:
Ruta: Finanzas -> Informes financieros -> Financiero -> Flujo de caja.
Rango de fechas: Desde el día de hoy hasta 30 días en adelante.
Intervalo: Semanal (4 semanas).
Opciones marcadas:
Cuentas monetarias (Bancos propios).
Deudas de clientes (Facturas abiertas).
Deudas con proveedores (Facturas abiertas).
Previsión de proveedores (Pedidos de compra autorizados).
Inclusión de una Contabilización Proyectada: Pago de prima de seguros de planta el día 20 por $15,000.00.
Análisis de Resultados por Semanas:
Semana 1: Saldo inicial en bancos $85,000.00. Cobros vencidos previstos $40,000.00. Pagos a proveedores programados -$50,000.00. Saldo final semana 1: $75,000.00 (Superávit).
Semana 2: Cobros esperados de clientes mayoristas $120,000.00. Pagos a proveedores extranjeros -$140,000.00. Saldo final semana 2: $55,000.00 (Superávit).
Semana 3: Salida extraordinaria por seguro $15,000.00 + Pago nómina $60,000.00 = -$75,000.00. Cobros de cartera $30,000.00. Saldo final semana 3: $10,000.00 (Nivel de reserva crítico).
Semana 4: Cobros regulares de contratos de servicio $45,000.00. Saldo proyectado de cierre: $55,000.00.
Decisión Gerencial Basada en el Informe:
Al visualizar en el gráfico interactivo que la Semana 3 la liquidez roza el límite mínimo de seguridad ($10,000), María instruye al equipo de cobranzas para que aplique el procedimiento de reclamación de deudas vencidas a clientes morosos y ofrezca un 2% de descuento por pronto pago a Funtech, garantizando un colchón adicional de $25,000 en la semana 3.


BANCO DE EVALUACIÓN SITUACIONAL (TIPO CERTIFICACIÓN SAP)
Pregunta 1
Enunciado: ¿Cuál es la diferencia conceptual y técnica fundamental entre la información proporcionada por la Cuenta de Pérdidas y Ganancias y el Informe de Flujo de Caja en SAP Business One?

A) La Cuenta de Pérdidas y Ganancias solo evalúa transacciones en moneda extranjera, mientras que el Flujo de Caja opera en moneda local.
B) La Cuenta de Pérdidas y Ganancias se rige por el principio de devengo (reconocimiento del ingreso o gasto al originarse el derecho u obligación), mientras que el Flujo de Caja evalúa la liquidez monetaria real y proyectada basada en fechas de vencimiento y pagos efectivos.
C) El Flujo de Caja requiere obligatoriamente que todas las órdenes de venta estén cerradas en OWOR.
D) La Cuenta de Pérdidas y Ganancias incluye cuentas bancarias y el Flujo de Caja solo considera órdenes de compra.
Respuesta Correcta: B
Justificación Técnica: Una empresa puede reportar utilidades contables récord en Pérdidas y Ganancias pero caer en iliquidez técnica si las ventas están financiadas a plazos largos. El Flujo de Caja complementa el análisis midiendo las entradas y salidas financieras reales por fecha de vencimiento (DocDueDate).
Pregunta 2
Enunciado: Al configurar el informe de Flujo de Caja, un usuario desea incluir tanto las facturas de proveedores registradas como los pedidos de compra abiertos y borradores de pago. ¿Cómo clasifica y visualiza SAP Business One estos documentos según su certeza financiera?

A) Asigna a todos el mismo nivel de seguridad para no alterar la media estadística.
B) Las facturas pertenecen a un nivel de seguridad intermedio (Deudas con proveedores), mientras que los pedidos y borradores se asignan al nivel de seguridad más bajo (Previsiones), identificándose en colores diferenciados (verde y azul) en el reporte.
C) El sistema bloquea la inclusión de pedidos de compras porque no generan asientos contables directos en OJDT.
D) Los borradores deben aprobarse formalmente antes de que el motor de flujo de efectivo pueda leerlos.
Respuesta Correcta: B
Justificación Técnica: Los niveles de seguridad ordenan los flujos según su probabilidad de realización: las deudas devengadas (facturas) tienen mayor peso y certeza que las previsiones o borradores preliminares (ODRF), los cuales se reflejan como líneas proyectadas en colores distintivos.