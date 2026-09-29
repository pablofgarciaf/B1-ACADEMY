# Guion de Video: DOC 050 Impl OpeningBalances

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 050 Impl OpeningBalances.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 050: HERRAMIENTAS DE IMPLEMENTACIÓN - CARGA DE SALDOS INICIALES (OPENING BALANCES) (SAP BUSINESS ONE 10.0)
Código de Manual: 10_Impl_25_ImplTools_OpeningBalances
Módulo Oficial: Herramientas de Implementación / Migración de Datos (AIP Data Migration)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores de Implementación, Contadores Generales, Auditores de Migración y Agentes IA (Antigravity)
Carpeta Asociada: 050_10_Impl_25_ImplTools_OpeningBalances


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "050",

  "topic": "Opening Balances Migration and Cutover Management",

  "sap_module": "Implementation_Cutover_OpeningBalances",

  "database_entities": {

    "journal_entries": "OJDT (TransType = -2 / Código Origen 'OB')",

    "journal_lines": "JDT1",

    "chart_of_accounts": "OACT",

    "business_partners": "OCRD",

    "item_master": "OITM",

    "item_warehouse_quantities": "OITW",

    "inventory_audit_log": "OINM"

  },

  "menu_paths": [

    "Gestión > Inicialización del sistema > Saldos iniciales > Saldos iniciales de cuentas de mayor",

    "Gestión > Inicialización del sistema > Saldos iniciales > Saldos iniciales de interlocutores comerciales",

    "Inventario > Transacciones de inventario > Saldos iniciales de inventario",

    "Finanzas > Informes financieros > Balance",

    "Inventario > Informes de inventario > Informe de auditoría de inventario",

    "Finanzas > Informes financieros > Antigüedad de saldos"

  ],

  "cutover_migration_sequence_4_steps": [

    {

      "step": 1,

      "name": "Datos Maestros Finales",

      "scope": "Nuevos clientes, proveedores, artículos, listas de materiales (BOM), recursos, listas de precios y empleados dados de alta en el sistema legado tras la carga inicial."

    },

    {

      "step": 2,

      "name": "Cantidades y Costes de Inventario (Tras Recuento Físico)",

      "scope": "Carga del stock físico contado. En Inventario Permanente, genera asiento automático debitando la Cuenta de Existencias y acreditando la Cuenta de Contrapartida de Saldos Iniciales.",

      "anti_duplication_rule": "Como el inventario ya actualiza la cuenta contable de existencias, en el Paso 4 se DEBE EXCLUIR la cuenta de mayor de inventario para no duplicar el activo en el balance."

    },

    {

      "step": 3,

      "name": "Transacciones Abiertas (Documentos en Tránsito)",

      "scope": "Pedidos y ofertas abiertas; facturas pendientes de cobro/pago.",

      "critical_recommendation": "Importar las facturas de proveedores y clientes históricas como 'Facturas de Servicio' para evitar movimientos espurios de stock. Como estas facturas ya actualizan las cuentas de control de clientes y proveedores, se DEBEN EXCLUIR las cuentas de control en el Paso 4."

    },

    {

      "step": 4,

      "name": "Saldos Iniciales Finales de Cuentas de Mayor y Socios",

      "scope": "Carga de cuentas de balance restantes (Caja, Bancos, Activos Fijos, Préstamos, Capital Social). Se balancea contra la Cuenta de Contrapartida de Saldos Iniciales, la cual debe quedar en 0.00."

    }

  ],

  "reconciliation_reports_matrix": {

    "Inventory": "Informe de auditoría de inventario (Stock Audit Report) vs. Kardex legado",

    "Receivables": "Informe de antigüedad de deudores (Customer Aging) vs. Auxiliar legado",

    "Payables": "Informe de antigüedad de proveedores (Vendor Aging) vs. Auxiliar legado",

    "General_Ledger": "Balance General de Apertura (Opening Balance Sheet) vs. Balance legado de cierre"

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 El Periodo de Transición (Cutover Period)
El período de Cutover (corte operativo) es el intervalo crítico inmediatamente anterior a la puesta en marcha en productivo (Go-Live), con una duración típica de entre unas horas y un fin de semana completo. Sus objetivos fundamentales son:

Congelar el Sistema Legado: Bloquear la introducción de nuevas transacciones operativas en el software anterior.
Depuración y Cierre: Conciliar cuentas bancarias y cerrar la mayor cantidad posible de pedidos y entregas abiertas para minimizar la carga de partidas en tránsito.
Recuento Físico de Stock (Inventario Ciego): Levantar el conteo físico real de mercancías en todos los almacenes.
Carga y Cuadratura: Migrar maestros finales, saldos iniciales y transacciones abiertas, asegurando que el Balance General de apertura en SAP Business One sea idéntico al céntimo respecto al Balance de Cierre del sistema legado.
2.2 La Secuencia Estricta de Migración en 4 Fases
Para evitar errores de doble contabilización o desbalance entre inventarios y libros de mayor, la metodología AIP de SAP define el siguiente orden cronológico:
Fase 1: Datos Maestros Finales
Migración de último minuto de interlocutores comerciales, artículos, listas de precios y listas de materiales (BOM) creados en el sistema legado entre la carga previa y la fecha de corte.
Fase 2: Carga de Inventario Inicial (Stock y Costo)
Se realiza a través de Inventario > Transacciones de inventario > Saldos iniciales de inventario.
Si la empresa opera bajo Inventario Permanente, el sistema genera un asiento contable: $$\text{Debe: Cuenta de Existencias / Inventario} \quad \longleftrightarrow \quad \text{Haber: Cuenta Contrapartida de Saldos Iniciales}$$
Regla de Oro Anti-Duplicidad #1: Debido a que este documento ya debitó la cuenta de existencias del mayor, la cuenta contable de inventario debe ser excluida obligatoriamente de la carga de saldos de mayor en la Fase 4. Si se volviera a cargar en el balance general, el inventario quedaría duplicado.
Fase 3: Transacciones Abiertas (En Tránsito)
Documentos no contables ni de inventario: Pedidos de venta y órdenes de compra abiertas. Se importan fácilmente mediante Data Transfer Workbench (DTW).
Facturas abiertas de Clientes y Proveedores:
Recomendación Oficial SAP: Importar las facturas pendientes como facturas de Tipo Servicio (en lugar de Tipo Artículo). De este modo, la factura reconoce la deuda del cliente o la obligación con el proveedor sin volver a mover cantidades ni costos de stock (que ya fueron fijados en la Fase 2).
Regla de Oro Anti-Duplicidad #2: Como la importación de facturas abiertas ya carga los saldos en las cuentas asociadas de clientes (110000) y proveedores (200000), dichas cuentas de control asociadas deben excluirse de la carga de saldos de mayor en la Fase 4.
Fase 4: Saldos Iniciales de Cuentas de Mayor y Tesorería
Se registran mediante Gestión > Inicialización del sistema > Saldos iniciales > Saldos iniciales de cuentas de mayor.
Se cargan únicamente las cuentas que no han tenido asientos en las fases 2 y 3 (Bancos, Caja, Inmuebles, Pasivos Financieros, Capital Social).
Todas las líneas se contraponen contra una cuenta transitoria del patrimonio: la Cuenta de Contrapartida de Saldos Iniciales (Offsetting Account).
Si el balance legado de partida doble estaba cuadrado, al terminar la carga de débitos y créditos el saldo de la cuenta de contrapartida queda estrictamente en $0.00 USD.
2.3 Tratamiento de Cuentas Bancarias
Cuentas bancarias totalmente conciliadas: Se transfiere el saldo neto directo al banco propio.
Cuentas con cheques girados y no cobrados o depósitos en tránsito: No se debe transferir el saldo neto. Deben contabilizarse individualmente los cheques y partidas en tránsito para permitir su posterior conciliación bancaria externa cuando aparezcan en los extractos de los meses siguientes.


3. ATLAS DIDÁCTICO: MAPA DE RUTA DE SALDOS INICIALES
                    [ PERIODO CUTOVER: SISTEMA LEGADO CONGELADO ]

                                          │

    ┌─────────────────────────────────────┴─────────────────────────────────────┐

    ▼                                                                           ▼

[ FASE 1: MAESTROS FINALES ]                                    [ FASE 2: INVENTARIO FÍSICO ]

• Clientes / Proveedores / Artículos                             • Conteo Físico Real

• Listas de Precios y Materiales                                • Entrada a Cuenta de Existencias

                                                                • Contrapartida: Cta. Saldos Iniciales

                                                                (Cuenta Inventario queda cargada)

                                          │

    ┌─────────────────────────────────────┴─────────────────────────────────────┐

    ▼                                                                           ▼

[ FASE 3: TRANSACCIONES ABIERTAS ]                              [ FASE 4: BALANCE DE APERTURA ]

• Facturas abiertas como TIPO SERVICIO                           • Bancos, Caja, Pasivos y Patrimonio

• Se cargan Deudores y Proveedores                              • EXCLUIR Cuenta de Inventario (Ya cargada)

(Cuentas Asociadas quedan cargadas)                             • EXCLUIR Cuentas Asociadas (Ya cargadas)

                                                                • Contrapartida salda exactamente en $0.00

                                          │

                                          ▼

                [ AUDITORÍA Y CUADRATURA CONTABLE FINAL ]

                • Stock Audit Report  ==  Kardex Legado

                • Aging Reports       ==  Cartera Legada

                • Balance General     ==  Balance Legado


4. CASO DE NEGOCIO RESUELTO: GO-LIVE EXITOSO EN OEC COMPUTERS
Escenario de Consultoría:
OEC Computers realiza su Go-Live el 1 de octubre de 2026. El fin de semana de Cutover se organizó de la siguiente forma:

Viernes 20:00: Se congela el sistema anterior.
Sábado 08:00 a 14:00: Se cuenta el inventario físico total: $150,000.00 USD en mercancías.
Sábado 15:00: Se cargan los saldos iniciales de inventario en SAP B1 con costo promedio ponderado.
Asiento: Débito Existencias $150,000 / Crédito Cuenta Saldos Iniciales $150,000.
Sábado 17:00: Se importan 30 facturas de clientes abiertas por $80,000 USD y 20 facturas de proveedores por $45,000 USD como facturas de servicio.
Domingo 10:00: Se cargan los saldos iniciales de mayor restantes (Caja $10,000, Bancos $40,000, Activos Fijos $65,000, Préstamos Bancarios $50,000 y Capital Social $250,000).
Domingo 14:00: Se audita el balance general:
Total Activos = $345,000 USD.
Total Pasivos + Patrimonio = $345,000 USD.
Saldo de la Cuenta Contrapartida de Saldos Iniciales = $0.00 USD.
Lunes 08:00: Apertura de puertas y facturación en vivo en SAP Business One sin retrasos.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
Al realizar la migración de saldos iniciales en una empresa que utiliza Inventario Permanente, ¿por qué es mandatorio EXCLUIR la cuenta contable de inventario de la transacción de saldos iniciales del mayor en la Fase 4?
A) Porque las cuentas de inventario no admiten moneda extranjera.
B) Porque la cuenta de existencias ya fue debitada automáticamente en la Fase 2 al registrar los saldos iniciales de inventario (artículos y costos). Incluirla en la carga del mayor duplicaría el saldo de existencias en el Balance General.
C) Porque el plan de cuentas bloquea las cuentas de activo corriente.
D) Porque el costo de inventario debe registrarse en cuentas de pérdidas y ganancias.
Respuesta Correcta: B
Justificación Técnica: La carga inicial de artículos mediante la transacción de inventario genera el movimiento contable en la cuenta de existencias de forma automática. Si se cargara nuevamente en el balance de apertura, se produciría una doble contabilización del activo.
Pregunta 2
¿Cuál es la recomendación oficial de SAP para la migración de facturas de clientes (A/R Invoices) y facturas de proveedores (A/P Invoices) históricas abiertas durante el Cutover?
A) Migrarlas como facturas de Tipo Servicio en lugar de Tipo Artículo.
B) Borrarlas y exigir a los clientes que paguen en efectivo antes de iniciar.
C) Reemplazarlas por órdenes de fabricación.
D) Duplicar las cantidades para compensar mermas.
Respuesta Correcta: A
Justificación Técnica: Al importar las facturas pendientes como documentos de Tipo Servicio, se crea el registro de cuenta por cobrar o cuenta por pagar sin detonar movimientos de almacén en un inventario físico que ya fue cargado previamente.
Pregunta 3
¿Qué código de origen identificador (Origin) asigna automáticamente SAP Business One en el Libro Mayor a todos los asientos contables generados por las transacciones de Saldos Iniciales?
A) IN (Invoice).
B) OB (Opening Balance).
C) JE (Journal Entry).
D) RC (Receipt).
Respuesta Correcta: B
Justificación Técnica: Las transacciones de saldos iniciales marcan sus asientos en OJDT con el código de origen OB, permitiendo filtrarlas con facilidad en los reportes de auditoría de migración.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
