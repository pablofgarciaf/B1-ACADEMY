# Guion de Video: DOC 003 BankProcess Handling Payments

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 003 BankProcess Handling Payments.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 003: GESTIÓN DE BANCOS - GESTIÓN DE PAGOS Y COBROS (SAP BUSINESS ONE 10.0)
Código de Manual: 10_BankProcess_11_Handling_Payments_ES
Módulo Oficial: Gestión de Bancos (Banking)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Contadores, Tesoreros, Arquitectos de Datos y Agentes IA (Antigravity)
Carpeta Asociada: 003_10_BankProcess_11_Handling_Payments_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "003",

  "topic": "Handling Payments (Incoming and Outgoing Payments & Deposits)",

  "sap_module": "Banking",

  "database_tables": {

    "incoming_payments": {

      "header": "ORCT",

      "invoices_paid": "RCT2",

      "cash": "RCT1",

      "checks": "RCT3",

      "credit_cards": "RCT4",

      "bank_transfer": "ORCT (TrsfrAcct, TrsfrSum, TrsfrDate, TrsfrRef)"

    },

    "outgoing_payments": {

      "header": "OVPM",

      "invoices_paid": "VPM2",

      "cash": "VPM1",

      "checks": "VPM3",

      "credit_cards": "VPM4"

    },

    "deposits": {

      "header": "ODPS",

      "checks_deposited": "DPS1",

      "credit_cards_deposited": "DPS2"

    }

  },

  "menu_paths": [

    "Gestión de bancos > Pagos recibidos > Pagos recibidos",

    "Gestión de bancos > Pagos efectuados > Pagos efectuados",

    "Gestión de bancos > Depósitos > Depósito"

  ],

  "payment_means_matrix": {

    "Cash": {

      "type": "Efectivo",

      "incoming_flow": "Paso 1: Cobro -> Debe: Cuenta Compensación Caja (Transitoria) | Haber: Cliente\nPaso 2: Depósito -> Debe: Banco Propio | Haber: Cuenta Compensación Caja",

      "outgoing_flow": "Debe: Proveedor | Haber: Cuenta de Caja o Banco Directo"

    },

    "Checks": {

      "type": "Cheques",

      "incoming_flow": "Paso 1: Cobro -> Debe: Cheques Recibidos (Compensación) | Haber: Cliente\nPaso 2: Depósito de Cheques -> Debe: Banco Propio | Haber: Cheques Recibidos",

      "outgoing_flow": "Debe: Proveedor | Haber: Banco Propio o Cheques Emitidos"

    },

    "Credit_Card": {

      "type": "Tarjeta de Crédito",

      "incoming_flow": "Paso 1: Cobro -> Debe: Tarjeta de Crédito (Compensación) | Haber: Cliente\nPaso 2: Depósito Tarjeta -> Debe: Banco Propio | Haber: Tarjeta de Crédito",

      "outgoing_flow": "Debe: Proveedor | Haber: Tarjeta de Crédito Pasivo"

    },

    "Bank_Transfer": {

      "type": "Transferencia Bancaria",

      "incoming_flow": "Paso Único: Cobro Directo -> Debe: Banco Propio (Directo sin cuenta puente) | Haber: Cliente",

      "outgoing_flow": "Paso Único: Pago Directo -> Debe: Proveedor | Haber: Banco Propio (Directo)"

    }

  },

  "document_features": {

    "overdue_indicator": "Un asterisco (*) tras la fecha de la factura indica que ya ha vencido (DueDate <= CurrentDate)",

    "payment_on_account": "Casilla 'Pago a cuenta': permite registrar cobros/anticipos sin aplicar a ninguna factura específica",

    "cash_discount": "Aplica automáticamente descuentos financieros por pronto pago según la condición pactada en el maestro OCRD"

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Arquitectura del Módulo de Gestión de Bancos
El módulo de Gestión de Bancos en SAP Business One administra la tesorería de la empresa mediante el procesamiento de Cobros (Pagos recibidos de clientes), Pagos (Pagos efectuados a proveedores) y Depósitos (Movimientos de regularización de fondos líquidos al banco propio).

La interfaz de cobros y pagos posee una estructura simétrica de tres paneles:

Cabecera del Documento: Código de Socio de Negocios (CardCode), Razón Social, Fecha de Contabilización, Fecha de Vencimiento, Fecha de Documento y Moneda.
Tabla Central de Documentos Pendientes: Muestra las facturas abiertas (FA/IN), notas de crédito (NC/CN) y asientos manuales (AS/JE) del tercero. Permite selección total o abono parcial.
Pie de Pantalla: Totales acumulados, descuentos por pronto pago calculados y campo de comentarios contables.
2.2 Proceso en Dos Pasos vs Proceso Directo
A. Flujo en Dos Pasos (Efectivo, Cheques y Tarjetas de Crédito):
En la mayoría de las localizaciones contables, el dinero recibido en el punto de venta o en ventanilla física no está inmediatamente disponible en la cuenta corriente del banco. Por tanto, SAP Business One implementa un esquema de Cuentas de Compensación (Clearing / Cuentas Transitorias):

Paso 1 (Recepción del Pago): Se registra el documento de Cobro (ORCT). El deudor se acredita (cerrando la factura total o parcialmente) y se debita la Cuenta de Caja Chica, Cheques en Cartera o Vouchers de Tarjeta.
Paso 2 (Depósito Bancario): Al final de la jornada o según la remesa bancaria, el tesorero registra un Depósito (ODPS). El sistema acredita la cuenta de compensación y debita la Cuenta Corriente Bancaria del Banco Propio.
B. Flujo Directo (Transferencia Bancaria):
A diferencia de los medios físicos, una transferencia bancaria ingresa de manera directa a la cuenta bancaria de la empresa:

El asiento se genera en un solo paso: $$\text{Debe: Cuenta de Banco Propio} \quad \longleftrightarrow \quad \text{Haber: Cuenta Asociada de Clientes}$$
No se utiliza cuenta puente de compensación salvo que la empresa configure cuentas provisionales de tránsito en la parametrización de bancos propios.
2.3 Pagos Parciales, Descuentos por Pronto Pago y Pagos a Cuenta
Pagos Parciales: El usuario puede modificar el campo Pago Total en la línea de la factura. El sistema mantiene la factura en estado "Abierto" (DocStatus = 'O') y actualiza el campo PaidToDate en INV1/OINV.
Descuento por Pronto Pago: Si la fecha del cobro coincide con la ventana de descuento por pronto pago configurada en las condiciones de pago (OCTG), SAP Business One deduce el porcentaje pactado y genera automáticamente el asiento por la diferencia en la cuenta de descuento concedido.
Pago a Cuenta: Si un cliente entrega un anticipo sin especificar factura de referencia, se tilda la casilla Pago a cuenta. El asiento debita el medio de cobro y acredita la cuenta del cliente, dejando una partida abierta en el balance del tercero lista para ser reconciliada internamente a futuro.


3. ATLAS DIDÁCTICO: SECUENCIA DE DIAPOSITIVAS OPERATIVAS
En este tema se identifican los siguientes diagramas de flujo operativos:

Diagrama de Medios de Pago en 2 Pasos (Efectivo, Cheques, Tarjetas):
Factura de Clientes $\rightarrow$ Cobro (Debe: Cuenta Compensación / Haber: Cliente) $\rightarrow$ Depósito (Debe: Banco Propio / Haber: Cuenta Compensación).
Diagrama de Transferencia Bancaria Directa:
Factura de Clientes $\rightarrow$ Cobro (Debe: Banco Propio / Haber: Cliente) $\rightarrow$ Conciliación en extracto bancario.
Estructura de la Tabla de Pagos:
Visualización de las columnas: Casilla de Selección (Sel.), Número de Documento, Cuota/Plazo, Vencimiento con asterisco (*), Total Documento, Saldo Vencido, % Descuento y Pago Total.
Ciclo de Cancelaciones y Reversiones:
Reglas para anulación de depósitos, cheques devueltos / protestados y reapertura automática de facturas canceladas.


4. CASO DE NEGOCIO RESUELTO: GESTIÓN DE TESORERÍA EN OEC COMPUTERS
Escenario de Consultoría:
María, contable de OEC Computers, realiza el cierre vespertino de caja. Durante el día se registraron las siguientes operaciones:

Cobro al cliente C20000 con cheque por $1,500.00 USD para liquidar la factura 105.
Cobro al cliente C30000 por transferencia bancaria directa por $800.00 USD para liquidar la factura 106.
Depósito de los cheques en cartera a la cuenta del Banco Central.
Trazabilidad Transaccional en SAP Business One:
Transacción 1 (Cobro con Cheque):
Ruta: Gestión de bancos > Pagos recibidos > Pagos recibidos.
Medio de pago: Cheque.
Asiento generado:
Debe: 112000 - Cheques Recibidos en Cartera = +$1,500.00
Haber: 110000 - Clientes Locales (C20000) = -$1,500.00
Estado de la factura 105: Pasa a estado Cerrado (DocStatus = 'C').
Transacción 2 (Cobro por Transferencia Directa):
Medio de pago: Transferencia bancaria.
Asiento generado:
Debe: 111000 - Banco Propio Cta. Cte. = +$800.00
Haber: 110000 - Clientes Locales (C30000) = -$800.00
Estado de la factura 106: Pasa a estado Cerrado.
Transacción 3 (Depósito Bancario):
Ruta: Gestión de bancos > Depósitos > Depósito.
Se selecciona la pestaña Cheque, se marca el cheque de $1,500.00 y se asigna la cuenta de banco de destino.
Asiento generado:
Debe: 111000 - Banco Propio Cta. Cte. = +$1,500.00
Haber: 112000 - Cheques Recibidos en Cartera = -$1,500.00
Saldo final de Cheques en Cartera: $0.00 USD (Compensada).


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál de los siguientes medios de pago en Pagos Recibidos NO utiliza habitualmente una cuenta puente de compensación en el flujo estándar de SAP Business One?
A) Efectivo
B) Cheque
C) Tarjeta de crédito
D) Transferencia bancaria
Respuesta Correcta: D
Justificación Técnica: Las transferencias bancarias se acreditan directamente en la cuenta bancaria de la empresa al momento de registrar el cobro, por lo que el asiento debita directamente el banco propio y acredita al deudor, sin requerir un paso posterior de depósito.
Pregunta 2
En la ventana de Pagos Recibidos o Pagos Efectuados, ¿qué indica la presencia de un asterisco (*) junto a la fecha de vencimiento de un documento?
A) Que el documento tiene retención de impuestos.
B) Que la factura ya ha vencido (la fecha de vencimiento es anterior o igual a la fecha actual).
C) Que el cliente tiene un límite de crédito excedido.
D) Que la factura es en moneda extranjera.
Respuesta Correcta: B
Justificación Técnica: El asterisco es el indicador visual nativo en SAP Business One que alerta al usuario de que la partida se encuentra en mora o con vencimiento caducado.
Pregunta 3
Si se registra un Pago Recibido marcando la opción "Pago a cuenta", ¿cuál es el estado resultante de las facturas del cliente?
A) Se cierran automáticamente las facturas más antiguas.
B) Se genera un error que bloquea la contabilización.
C) Las facturas del cliente permanecen abiertas y el pago queda como una partida de crédito no asignada en la cuenta del cliente.
D) El sistema distribuye el importe de forma proporcional entre todas las líneas de balance.
Respuesta Correcta: C
Justificación Técnica: La opción Pago a cuenta no aplica fondos contra ninguna factura específica. Por tanto, las facturas pendientes continúan abiertas y el cobro queda registrado en el haber del interlocutor comercial hasta que se realice una reconciliación interna posterior.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
