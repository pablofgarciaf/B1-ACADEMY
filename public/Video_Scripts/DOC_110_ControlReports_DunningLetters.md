# Guion de Video: DOC 110 ControlReports DunningLetters

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 110 ControlReports DunningLetters.

## Contenido Principal (Visual: Diapositivas correspondientes)
DOC_110_ControlReports_DunningLetters.md
BASE DE CONOCIMIENTO TÉCNICA ANTIGRAVITY - SAP BUSINESS ONE 10.0
Módulo de Ventas y Finanzas: Asistente y Cartas de Reclamación de Deudas (Dunning System)

METADATOS TÉCNICOS
Código de Documento: DOC_110_ControlReports_DunningLetters
Archivo Fuente Original: 10_ControlReports_23_CashReports_Dunning.pdf (File ID: 1jPCIvAeybp0-2LahVAV_IczCMargWgQR)
Módulo SAP Business One: Ventas - Clientes / Asistente de Reclamaciones (Sales - A/R -> Dunning Wizard) y Gestión / Configuración / Interlocutores Comerciales / Condiciones de Reclamación (Administration -> Setup -> Business Partners -> Dunning Terms)
Audiencia Objetivo: Especialistas de Cobranzas, Administradores de Cuentas por Cobrar, Abogados de Crédito y Agentes de IA Antigravity.
Versión de SAP B1 Soportada: 10.0 (SQL Server & SAP HANA).


JSON ANTIGRAVITY MASTER SCHEMA
{

  "$schema": "https://antigravity.ai/schemas/sap_b1_dunning_system_v10.json",

  "unit_id": "110_ControlReports_DunningLetters",

  "module": "Sales & Financials",

  "submodule": "Credit Control / Dunning Management",

  "database_tables": {

    "dunning_terms": "ODUN",

    "dunning_levels": "DUN1",

    "dunning_wizard_history": "ODWZ",

    "dunning_history_lines": "DWZ1",

    "business_partners": "OCRD",

    "customer_invoices": "OINV",

    "service_invoices_fee_interest": "OINV",

    "service_invoices_lines": "INV1",

    "journal_entries": "OJDT",

    "journal_lines": "JDT1"

  },

  "menu_paths": {

    "dunning_wizard": "Ventas - Clientes -> Asistente de reclamaciones",

    "dunning_terms_setup": "Gestión -> Definiciones -> Interlocutores comerciales -> Condiciones de reclamación",

    "dunning_letters_layout": "Gestión -> Definición general -> Gestor de informes y de layout",

    "dunning_tracking_bp": "Interlocutores comerciales -> Datos maestros socio de negocios -> Ficha Contabilidad / Ficha Condiciones de pago"

  },

  "dunning_escalation_structure": {

    "level_1_friendly_reminder": {

      "effective_after_days": 30,

      "fee_amount": 5.00,

      "interest_rate_applied": false,

      "tone": "Recordatorio informativo de vencimiento de pago"

    },

    "level_2_formal_warning": {

      "effective_after_days": 10,

      "fee_amount": 10.00,

      "interest_rate_applied": true,

      "tone": "Advertencia formal con cargo de tasa administrativa e interés moratorio"

    },

    "level_3_pre_legal_notice": {

      "effective_after_days": 10,

      "fee_amount": 25.00,

      "interest_rate_applied": true,

      "tone": "Aviso prejudicial con suspensión de despachos y pase a asesoría jurídica"

    }

  },

  "automatic_posting_mechanics": {

    "service_invoice_creation": "Si la casilla 'Contabilización automática' está activa, la ejecución del asistente genera automáticamente una Factura de Clientes de Servicio (Service A/R Invoice) que debita la cuenta del cliente y acredita las cuentas de ingresos por intereses moratorios y tasas de reclamación.",

    "gl_determination_link": "Cuentas por defecto tomadas de Determinación de Cuentas de Mayor o configuradas específicamente en la ventana de Condiciones de Reclamación."

  },

  "critical_controls": {

    "block_negative_dunning": "El asistente evalúa exclusivamente saldos deudores netos vencidos; permite visualizar facturas abiertas de proveedores conectados para análisis de compensación, pero sin mezclarlas en la carta del cliente.",

    "dunning_level_lock": "El maestro de clientes (OCRD) almacena el último nivel de reclamación enviado y la fecha de última ejecución, impidiendo el envío anticipado del siguiente nivel antes de que transcurran los días de espera configurados."

  }

}


DESARROLLO CONCEPTUAL Y FUNCIONAL
1. Arquitectura del Proceso de Reclamación (Dunning Process)
El envío de estados de cuenta pasivos no siempre es suficiente para recuperar la cartera vencida. Para evitar que las deudas se conviertan en incobrables (Bad Debts), SAP Business One 10.0 integra un motor proactivo denominado Asistente de Reclamaciones (Dunning Wizard).

El sistema de reclamación automatiza:

El rastreo de todas las facturas impagas y transacciones vencidas de los clientes.
La emisión de cartas impresas o digitales con diferentes Niveles de Severidad Escalonada.
El cálculo y facturación automática de Tasas de Reclamación Administrativas e Intereses Bancarios Moratorios que se cargan directamente al estado de cuenta del cliente.
2. Configuración de Condiciones de Reclamación (Dunning Terms)
En Gestión -> Definiciones -> Interlocutores comerciales -> Condiciones de reclamación:

Definición de Niveles de Reclamación (DUN1): Se pueden establecer hasta 10 niveles progresivos. Cada nivel define:
Efectivo Después de (Effective After): Número de días que deben transcurrir tras el vencimiento de la factura (para el Nivel 1) o tras el envío de la carta precedente (para los niveles 2 en adelante).
Tasa de Reclamación (Fee): Monto fijo administrativo por emitir la gestión de cobranza.
Aplicar Interés (Charge Interest): Casilla que habilita el devengo de intereses moratorios.
Cálculo de Intereses Bancarios:
Se especifica el Tipo de Interés Anual (%). El sistema calcula el interés prorrateado por cada día exacto de atraso: $$\text{Interés Moratorio} = \text{Saldo Vencido} \times \left(\frac{\text{Tasa Anual %}}{360 \text{ ó } 365}\right) \times \text{Días de Atraso}$$
3. Contabilización Automática de Tasas e Intereses
Una de las funcionalidades avanzadas de SAP B1 es la Contabilización Automática:

Si se activa en las condiciones de reclamación (o a nivel de cada socio en OCRD.DunningAuto):
Al finalizar la corrida del asistente, SAP Business One genera automáticamente una Factura de Clientes de Servicio (OINV tipo Servicio).
Asiento Contable Generado:
Debe: Cuenta del Cliente (OCRD) por el total de tasas + intereses.
Haber: Cuenta de Ingresos por Intereses de Reclamación.
Haber: Cuenta de Ingresos por Tasas de Reclamación.
De esta manera, el balance financiero del cliente se actualiza automáticamente con los recargos sin requerir digitación manual.
4. Proveedores Conectados en el Asistente de Reclamaciones
Durante la ejecución del Asistente, en el Paso 2 (Parámetros) se puede marcar la casilla Considerar los proveedores conectados:

Si un cliente moroso es simultáneamente proveedor de la empresa (por ejemplo, Maxi Teq), el informe de recomendación del Asistente mostrará en pantalla las facturas de proveedor abiertas que OEC Computers le adeuda.
Control de Seguridad: Esta visualización es meramente informativa para el analista de crédito; no altera el texto legal de la carta de cobro del cliente ni compensa deudas unilateralmente sin un acuerdo formal de conciliación.


CASO DE NEGOCIO RESUELTO: OEC COMPUTERS
Contexto: La empresa Maxi Teq tiene facturas vencidas por $45,000.00 desde hace 42 días en OEC Computers. Además, OEC Computers le debe a Maxi Teq $8,000.00 por servicios de mantenimiento técnico. María, la Contadora, debe ejecutar el Asistente de Reclamaciones aplicando el Nivel 2 de morosidad con cargo de intereses.

Ejecución Operativa:

Verificación de Condiciones de Reclamación de OEC Computers:
Condición asignada a clientes mayoristas: MAYORISTAS_STD.
Parámetros del Nivel 1: Efectivo tras 30 días, Tasa $5.00, Sin intereses. (Carta 1 ya enviada hace 12 días).
Parámetros del Nivel 2: Efectivo tras 10 días de la Carta 1, Tasa $15.00, Interés anual 12%. Contabilización automática activa.
Ejecución del Asistente de Reclamaciones:
Ruta: Ventas - Clientes -> Asistente de reclamaciones.
Paso 1: Nueva ejecución RECLAM_2026_09.
Paso 2: Selección de clientes C10000 a C90000. Marca la casilla Considerar proveedores conectados.
Paso 3: Análisis de partidas abiertas. El sistema detecta que la Carta 1 de Maxi Teq fue enviada el 12 de septiembre (hace 12 días, superando los 10 días requeridos), por lo que califica para Carta de Reclamación Nivel 2.
Paso 4: Visualización de proveedores conectados. Se muestran las facturas de proveedor de Maxi Teq por $8,000.00. María valida que la deuda neta a favor de OEC Computers sigue siendo de $37,000.00 y autoriza la emisión de la carta.
Generación de Documentos y Asientos:
El asistente genera e imprime la Carta de Reclamación Nivel 2 dirigida al Director Financiero de Maxi Teq.
Simultáneamente, se crea la Factura de Clientes de Servicio Nº 10452:
Tasa administrativa: $15.00.
Interés moratorio (12% anual sobre $45,000.00 durante 42 días): $630.00.
Total Facturado: $645.00.
Asiento Contable en OJDT: Débito a Deudores Comerciales (Maxi Teq) por $645.00 con crédito a Ingresos por Intereses Moratorios ($630.00) e Ingresos por Gestión de Cobro ($15.00).
El maestro OCRD de Maxi Teq queda registrado con Nivel de Reclamación: 2 y fecha de ejecución registrada.


BANCO DE EVALUACIÓN SITUACIONAL (TIPO CERTIFICACIÓN SAP)
Pregunta 1
Enunciado: Una empresa que opera con SAP Business One desea que al enviar una carta de reclamación de Nivel 2 a clientes morosos, los gastos administrativos de cobranza ($25.00) y los intereses moratorios calculados se carguen automáticamente en la cuenta corriente del cliente en el libro mayor. ¿Qué configuración debe habilitarse para que esto suceda?

A) Debe ejecutarse manualmente un Asiento Contable en OJDT antes de imprimir la carta.
B) En la definición de las Condiciones de Reclamación (ODUN), debe activarse la opción de "Contabilización automática" y asignarse las cuentas de ingresos para intereses y tasas, lo que generará una Factura de Servicio al procesar el Asistente.
C) Se debe modificar el código del cliente en OCRD cambiándolo temporalmente a tipo Proveedor.
D) El sistema solo puede contabilizar tasas si la empresa utiliza SAP HANA con Pervasive Analytics.
Respuesta Correcta: B
Justificación Técnica: Si la opción de Contabilización Automática está activa en las Condiciones de Reclamación, el Asistente genera de forma automática una Factura de Clientes tipo Servicio (Service A/R Invoice) que contabiliza de inmediato la deuda por tasas e intereses en la cuenta del cliente y en los ingresos financieros de la sociedad.
Pregunta 2
Enunciado: Durante la ejecución del Asistente de Reclamaciones, el analista marca la opción "Considerar los proveedores conectados". ¿Qué efecto tiene esta selección en las cartas de reclamación emitidas a los clientes?

A) Cancela automáticamente las facturas de proveedores contra las de clientes mediante una conciliación interna forzada.
B) Muestra las operaciones abiertas de los proveedores conectados en el informe de recomendación del Asistente para que el usuario evalúe la posición neta, pero los saldos se presentan por separado y no modifican el cálculo de la deuda ni el texto de la carta de reclamación del cliente.
C) Convierte la carta de reclamación en una orden de pago bancario en OVPM.
D) Genera una factura de reserva en el módulo de compras.
Respuesta Correcta: B
Justificación Técnica: Los saldos de proveedores conectados se despliegan en la consola del Asistente como información de apoyo gerencial para la toma de decisiones, pero el sistema mantiene estrictamente separados los libros auxiliares y no altera el contenido ni las tasas calculadas en la carta de reclamación del cliente.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
