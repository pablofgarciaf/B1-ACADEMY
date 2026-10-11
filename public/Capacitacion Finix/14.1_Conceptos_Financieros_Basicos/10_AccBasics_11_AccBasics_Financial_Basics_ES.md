UNIDAD 001: FUNDAMENTOS DE CONTABILIDAD Y FINANZAS BÁSICAS (SAP BUSINESS ONE 10.0)
Código de Manual: 10_AccBasics_11_AccBasics_Financial_Basics_ES
Módulo Oficial: Finanzas (Financials - FI)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Contadores Generales, Arquitectos de Datos y Modelos de IA (Antigravity)
Carpeta Asociada: 001_10_AccBasics_11_AccBasics_Financial_Basics_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "001",

  "topic": "Financial Basics & Double-Entry Conventions",

  "sap_module": "Financials",

  "business_objects": [

    {

      "name": "Journal Entry",

      "header_table": "OJDT",

      "lines_table": "JDT1",

      "primary_key": "TransId",

      "description": "Asiento contable que registra transacciones en el Libro Mayor"

    },

    {

      "name": "Chart of Accounts",

      "table": "OACT",

      "primary_key": "AcctCode",

      "description": "Plan de cuentas contables estructurado por cajones financieros"

    },

    {

      "name": "Business Partner Master Data",

      "table": "OCRD",

      "primary_key": "CardCode",

      "description": "Maestro de Clientes y Proveedores con cuenta asociada asignada"

    }

  ],

  "menu_paths": [

    "Finanzas > Plan de cuentas",

    "Finanzas > Asiento",

    "Finanzas > Informes financieros > Balance",

    "Finanzas > Informes financieros > Libro mayor"

  ],

  "accounting_rules": {

    "balance_equation": "Activo = Pasivo + Patrimonio Neto",

    "account_types_behavior": {

      "Activo": { "debit": "Aumenta (+)", "credit": "Disminuye (-)", "natural_balance": "Deudor" },

      "Pasivo": { "debit": "Disminuye (-)", "credit": "Aumenta (+)", "natural_balance": "Acreedor" },

      "Patrimonio": { "debit": "Disminuye (-)", "credit": "Aumenta (+)", "natural_balance": "Acreedor" },

      "Ingresos": { "debit": "Disminuye (-)", "credit": "Aumenta (+)", "natural_balance": "Acreedor" },

      "Gastos": { "debit": "Aumenta (+)", "credit": "Disminuye (-)", "natural_balance": "Deudor" }

    },

    "entry_integrity": "SUM(Debit) == SUM(Credit) para cada TransId"

  },

  "sales_process_financial_impact": {

    "Delivery": {

      "impacts_gl": "Solo si se utiliza Inventario Permanente (Perpetual Inventory)",

      "debit_account": "Costo de Ventas (COGS)",

      "credit_account": "Cuenta de Inventario"

    },

    "A_R_Invoice": {

      "impacts_gl": "Siempre",

      "debit_account": "Cuenta de Control de Deudores / Cliente (Activo)",

      "credit_account": "Ingresos por Ventas (Ganancias) + Impuestos Repercutidos (Pasivo)"

    },

    "Incoming_Payment": {

      "impacts_gl": "Siempre",

      "debit_account": "Cuenta de Caja / Cheques en Cartera / Transferencia",

      "credit_account": "Cuenta de Control de Deudores / Cliente"

    },

    "Deposit": {

      "impacts_gl": "Siempre",

      "debit_account": "Cuenta Bancaria Activa",

      "credit_account": "Cuenta Puente de Caja / Cheques Recibidos"

    }

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Principios de la Contabilidad Financiera en SAP Business One
La gestión financiera en SAP Business One constituye el núcleo sobre el cual operan todos los submódulos logísticos y comerciales. El sistema opera estrictamente bajo el principio universal de partida doble, asegurando que cada movimiento financiero esté respaldado por al menos un cargo en el Debe y un abono en el Haber, manteniendo el balance general permanentemente cuadrado.

El registro sistemático de las operaciones cumple dos propósitos empresariales cardinales:

Control Interno y Gobernanza Operativa: Permite la emisión de estados financieros en tiempo real (Balance de Sumas y Saldos, Balance General, Estado de Pérdidas y Ganancias) para la toma de decisiones estratégicas.
Cumplimiento Tributario y Legal: Satisface las obligaciones fiscales frente a las administraciones tributarias mediante auditorías transaccionales completas.
2.2 Dinámica de Débito, Crédito y Mecánica de Saldos
En el Libro Mayor, cada cuenta contable almacena transacciones individuales registradas en la tabla JDT1. El saldo actual de cualquier cuenta contable o interlocutor comercial se calcula según la fórmula:

$$\text{Saldo de Cuenta} = \sum \text{Transacciones en el Debe} - \sum \text{Transacciones en el Haber}$$

El comportamiento del saldo varía según la naturaleza contable del cajón:

Cuentas de Activo: Un débito (Debe) incrementa el saldo del activo; un crédito (Haber) lo disminuye. Su saldo habitual es positivo (deudor).
Cuentas de Pasivo y Patrimonio Neto: Un débito disminuye la obligación con terceros o accionistas; un crédito incrementa la deuda o el capital. Su saldo habitual es negativo/acreedor en la lógica del Libro Mayor.
Cuentas de Resultados (Ingresos y Gastos):
Los Gastos (Costos de ventas, gastos operacionales) incrementan su valor por el Debe.
Los Ingresos (Ventas brutas, ingresos financieros) incrementan su valor por el Haber.
2.3 Cuentas Asociadas (Reconciliation Accounts) y Socios de Negocios
En SAP Business One, los clientes y proveedores no son cuentas contables del Libro Mayor, sino entidades maestras registradas en la tabla OCRD (Socios de Negocios). Para integrar sus transacciones en la contabilidad financiera:

Cada cliente tiene asignada una Cuenta Asociada de Deudores (típicamente en el activo corriente).
Cuando se emite un documento comercial (ej. Factura de Clientes), SAP Business One imputa la deuda directamente a la ficha del cliente (mostrando el detalle en el auxiliar) y simultáneamente actualiza el saldo de la cuenta asociada en el Libro Mayor (OJDT / JDT1).


3. ATLAS DIDÁCTICO Y ANÁLISIS DE LÁMINAS TÉCNICAS
En la subcarpeta Imagenes_Diapositivas de esta unidad se encuentran las siguientes láminas operativas extraídas:

SLIDE_06_Documentos_Ventas_Asientos_Contables.png:

Descripción Técnica: Muestra la secuencia de documentos del ciclo Order-to-Cash (Oferta -> Pedido -> Entrega -> Factura de Clientes -> Cobros -> Depósito).
Punto Clave: Identifica con precisión qué documentos generan asientos contables: la Entrega (bajo inventario permanente), la Factura de Clientes, el Pago Recibido y el Depósito Bancario. Las ofertas y pedidos de venta son puramente informativos y no afectan la contabilidad.

SLIDE_07_Flujo_Contabilizacion_Automatica.png:

Descripción Técnica: Esquematiza la generación automática de asientos en segundo plano.
Punto Clave: Cuando el usuario final pulsa "Crear" en un documento operativo, el motor contable de SAP B1 consulta la determinación de cuentas de mayor y genera el registro en OJDT sin que el usuario tenga conocimientos avanzados de contabilidad.

SLIDE_08_Estructura_Cuenta_T_Debe_Haber_Saldo.png:

Descripción Técnica: Representación gráfica de la cuenta en T contable para un socio de negocios.
Punto Clave: Detalla cómo se acumulan las facturas en el Debe y los cobros en el Haber, derivando el saldo pendiente de cobro en tiempo real.

SLIDE_09_Comportamiento_Saldos_Tipos_Cuentas.png:

Descripción Técnica: Matriz de reglas de negocio para los cinco tipos de cuentas: Activo, Pasivo, Capital/Patrimonio, Gastos e Ingresos.
Punto Clave: Regla fundamental para validar la consistencia en el diseño de interfaces o agentes contables automatizados.

SLIDE_11_Efecto_Contable_Factura_Clientes.png:

Descripción Técnica: Análisis transaccional de una Factura de Clientes estándar en un entorno no permanente y exento de impuestos.
Punto Clave: Ilustra el asiento simétrico: Débito a la cuenta del Cliente (Activo se incrementa) y Crédito a la cuenta de Ventas (Ingresos se incrementan).


4. CASO DE NEGOCIO RESUELTO: IMPLEMENTACIÓN EN OEC COMPUTERS
Escenario de Consultoría:
La empresa distribuidora de equipos tecnológicos OEC Computers está migrando a SAP Business One 10.0. María, responsable del departamento contable, desea verificar el comportamiento contable ante una venta directa por servicios de consultoría técnica a un cliente corporativo por un valor neto de $1,000 USD (cliente exento de IVA y operación no sujeta a inventario).
Pasos Operativos y Trazabilidad Transaccional:
Creación del Documento:
Ruta: Ventas - Clientes > Factura de clientes.
Se selecciona el cliente C20000 - Microchips S.A. y se introduce una línea de servicio por $1,000.00.
Generación del Asiento Contable Automático:
Al presionar Crear, SAP Business One genera el asiento en la tabla OJDT:
Línea 1 (JDT1): Débito a la cuenta asociada del cliente 110000 - Clientes Locales por +$1,000.00 USD.
Efecto: Aumenta el Activo exigible de la empresa.
Línea 2 (JDT1): Crédito a la cuenta 410000 - Ingresos por Servicios por -$1,000.00 USD (en notación Haber).
Efecto: Aumenta el patrimonio neto mediante el reconocimiento de beneficios.
Auditoría del Mapa de Relaciones:
Al hacer clic derecho sobre la factura y seleccionar Mapa de relaciones, se visualiza el vínculo directo entre el documento Factura de clientes y el asiento contable Asiento Nº 104.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
En una empresa que opera bajo el esquema de inventario NO permanente, ¿cuál de los siguientes documentos comerciales de ventas genera un asiento en el Libro Mayor?
A) Oferta de venta
B) Pedido de cliente
C) Entrega
D) Factura de clientes
Respuesta Correcta: D
Justificación Técnica: En un sistema de inventario no permanente, las entregas no mueven cuentas de inventario ni costo de ventas. Las ofertas y pedidos son documentos provisionales de compromiso que nunca mueven el Libro Mayor. Por ende, únicamente la Factura de Clientes genera el asiento contable registrando la deuda y el ingreso.
Pregunta 2
Al registrar un Pago Recibido en efectivo de un cliente para cancelar una factura pendiente, ¿cuál es el efecto contable en los saldos?
A) Aumenta la cuenta de Caja (Debe) y Disminuye la cuenta de Clientes (Haber).
B) Aumenta la cuenta de Caja (Haber) y Aumenta la cuenta de Clientes (Debe).
C) Disminuye la cuenta de Caja (Debe) y Disminuye la cuenta de Ingresos (Haber).
D) Se genera un débito en la cuenta del Banco y un crédito en la cuenta de Costo de Ventas.
Respuesta Correcta: A
Justificación Técnica: La cuenta de Caja (Activo) recibe fondos, por lo que se debita y aumenta su saldo. La cuenta de Clientes (Activo exigible) se acredita por el cobro efectuado, disminuyendo el saldo pendiente del cliente.
Pregunta 3
¿Por qué motivo los Clientes y Proveedores no se crean directamente en el Plan de Cuentas de Mayor (OACT)?
A) Porque SAP Business One solo permite hasta 100 cuentas contables.
B) Porque se gestionan en el Maestro de Socios de Negocios (OCRD) y centralizan sus saldos en el Libro Mayor a través de Cuentas Asociadas (Reconciliation Accounts), evitando saturar el balance general con miles de cuentas individuales.
C) Porque los socios de negocios solo pueden tener movimientos en moneda extranjera.
D) Porque el plan de cuentas es exclusivo para activos fijos e inventarios.
Respuesta Correcta: B
Justificación Técnica: La arquitectura de SAP B1 desacopla el maestro de interlocutores comerciales de la estructura contable mediante cuentas asociadas de control, garantizando que el Balance General permanezca ordenado y consolidado.