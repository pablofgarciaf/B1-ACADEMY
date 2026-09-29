# Guion de Video: DOC 004 BankProcess Payment Wizard

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 004 BankProcess Payment Wizard.

## Contenido Principal (Visual: Diapositivas correspondientes)
UNIDAD 004: ASISTENTE DE PAGOS MASIVOS (PAYMENT WIZARD) EN SAP BUSINESS ONE 10.0
Código de Manual: 10_BankProcess_12_Payments_Payment Wizard_ES
Módulo Oficial: Gestión de Bancos (Banking)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Responsables de Tesorería, Contadores y Agentes IA (Antigravity)
Carpeta Asociada: 004_10_BankProcess_12_Payments_Payment_Wizard_ES


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "004",

  "topic": "Payment Wizard & Payment Order Runs",

  "sap_module": "Banking_Automation",

  "database_tables": {

    "wizard_runs": "OPWZ",

    "wizard_rows": "PWZ1",

    "payment_methods": "OPYM",

    "house_banks": "ODSC",

    "house_bank_accounts": "OACT",

    "electronic_file_manager": "OEFM"

  },

  "menu_paths": [

    "Gestión de bancos > Asistente de pagos",

    "Gestión > Definición > Gestión de bancos > Vías de pago",

    "Gestión > Definición > Gestión de bancos > Bancos propios",

    "Gestión > Definición > Gestión de bancos > Cuentas de banco propio",

    "Gestión de bancos > Informes de banco > Informe de órdenes de pago"

  ],

  "wizard_steps": [

    { "step": 1, "name": "Selección de ejecución de pago", "desc": "Crear nueva ejecución o cargar una grabada previamente" },

    { "step": 2, "name": "Parámetros generales", "desc": "Fecha de ejecución, fecha de próxima ejecución prevista, tipo (pago/cobro), medios (cheque/transferencia)" },

    { "step": 3, "name": "Criterios de selección de Interlocutores Comerciales", "desc": "Rango de códigos de clientes/proveedores, grupos y propiedades" },

    { "step": 4, "name": "Parámetros de selección de documentos", "desc": "Rango de fechas de contabilización/vencimiento, tolerancias de días" },

    { "step": 5, "name": "Vías de pago (Payment Methods)", "desc": "Selección de vías activas asociadas a bancos propios" },

    { "step": 6, "name": "Informe de recomendaciones", "desc": "Partidas sugeridas, inclusión/exclusión manual, transacciones no incluidas" },

    { "step": 7, "name": "Opciones de grabado y ejecución", "desc": "Grabar criterios / Grabar recomendaciones / Ejecutar orden de pago / Ejecutar pagos" }

  ],

  "execution_options": {

    "Save_Selection_Criteria": "Graba filtros sin reservar partidas. Las facturas quedan disponibles para pagos manuales.",

    "Save_Recommendations": "Reserva partidas para esta ejecución exclusivamente. Bloquea las facturas para otros pagos.",

    "Execute_Payment_Order_Run": "Genera archivo bancario pero NO crea asientos. Mantiene facturas abiertas hasta confirmación bancaria.",

    "Execute_Payment_Run": "Crea documentos de pago definitivos, asientos contables en OJDT y cierra facturas.",

    "Execute_Payment_Run_Server": "Planifica la ejecución en segundo plano en el servidor para horas no pico."

  }

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 Propósito y Alcance del Asistente de Pagos
El Asistente de Pagos (Payment Wizard) es el motor de procesamiento masivo en lotes de SAP Business One, diseñado para automatizar los flujos de cobros y pagos de alto volumen. Elimina la necesidad de registrar individualmente los desembolsos a proveedores o los cobros de clientes, consolidando facturas pendientes y generando ficheros bancarios electrónicos normalizados.

Capacidades funcionales del asistente:

Pagos a Proveedores: Procesa pagos mediante Transferencia Bancaria y emisión de Cheques en lote.
Cobros de Clientes: Procesa domiciliaciones bancarias (adeudos directos) por Transferencia Bancaria.
Consolidación Inteligente: Agrupa automáticamente múltiples facturas de un mismo proveedor en un único pago o cheque, reduciendo comisiones bancarias (a menos que el socio de negocios tenga configurada la opción de Pago Único factura por factura).
2.2 Vías de Pago (Payment Methods) como Instrumento Central de Control
La configuración de Vías de Pago (OPYM) en Gestión > Definición > Gestión de bancos > Vías de pago define las reglas operativas de tesorería:

Tipo y Medio: Determina si la vía es de salida (Pago efectuado) o entrada (Cobro recibido), y el medio (Cheque o Transferencia).
Asignación de Banco Propio: Vincula la vía a una cuenta corriente bancaria de la empresa (ODSC / OACT).
Reglas de Validación y Restricciones:
Monto mínimo y máximo por pago.
Validación obligatoria de IBAN / Código SWIFT / Cuenta bancaria del tercero.
Requisito de dirección completa del proveedor.
Cuentas Provisionales de Tránsito: Permite asociar una cuenta contable transitoria en lugar del banco directo para pagos diferidos.
2.3 Ejecución de Orden de Pago (Payment Order Run) vs Ejecución Definitiva
Una de las funcionalidades avanzadas más valoradas en auditoría corporativa es la Ejecución de Orden de Pago:

En un flujo convencional, ejecutar el asistente genera asientos contables de inmediato. Si el banco rechaza la remesa por falta de fondos o datos erróneos, la contabilidad queda desfasada respecto al extracto bancario.
Con la Ejecución de Orden de Pago:
El asistente genera el archivo bancario magnético (formato SEPA, MT101 o formato local vía Electronic File Manager - EFM).
No se crea ningún asiento contable y las facturas de proveedores permanecen en estado Abierto.
Las partidas quedan reservadas mediante los informes de órdenes de pago (OPWZ).
Una vez que el banco confirma la ejecución exitosa de la remesa, el usuario carga la ejecución grabada y realiza la Ejecución de Pago Definitiva, cerrando las facturas en la fecha bancaria real.


3. ATLAS DIDÁCTICO: FASES DEL ASISTENTE DE PAGOS
Flujo de Entradas y Salidas del Asistente:
Entradas: Facturas de proveedores, abonos de compras, facturas de clientes, notas de crédito y asientos abiertos.
Filtros: Vencimiento, vías de pago de socios de negocios y bancos propios disponibles.
Salidas: Asientos contables (OJDT), documentos de pago (OVPM/ORCT), cheques impresos y fichero de pago bancario electrónico.
Matriz de Criterios de Selección (Pasos 1 al 5):
Esquema de parametrización: Fecha de próxima ejecución (para capturar facturas que vencerán antes del siguiente ciclo) y ventana de tolerancia de vencimiento.
Gestión del Informe de Recomendaciones (Paso 6):
Lista editable donde el tesorero desmarca facturas en litigio o añade líneas manuales hacia cuentas de mayor sin factura.


4. CASO DE NEGOCIO RESUELTO: REMESA MENSUAL DE PROVEEDORES EN OEC COMPUTERS
Escenario de Consultoría:
María, jefa de contabilidad de OEC Computers, debe pagar a fin de mes 45 facturas vencidas a 12 proveedores locales que suman un total de $32,450.00 USD. Todos los proveedores aceptan transferencia bancaria directa.
Configuración Previa:
Se define la vía de pago TRANSF_NAC (Transferencia Bancaria Nacional) asignada a la cuenta de banco propio Banco Guayaquil Cta. Cte. Nº 102030.
En la ficha Ejecución de pago de cada proveedor en OCRD, se marca la casilla Incluir en TRANSF_NAC y se establece como vía por defecto.
Ejecución del Asistente de Pagos:
Paso 1: Se nombra la ejecución como PAGOS_PROV_SEPT_2026.
Paso 2: Fecha de ejecución: 2026-09-30. Próxima ejecución: 2026-10-15.
Paso 3 y 4: Se seleccionan todos los proveedores locales con facturas vencidas al 30 de septiembre.
Paso 5: Se selecciona la vía TRANSF_NAC.
Paso 6 (Recomendaciones): El sistema propone 12 pagos consolidados (uno por cada proveedor agrupando sus respectivas facturas). María detecta que una factura de $450 del proveedor P10002 tiene una discrepancia comercial y desmarca la casilla de esa línea.
Paso 7 (Ejecución): María selecciona Ejecutar ejecución de pago.
Resultados Obtenidos:
Se generan 12 documentos de pago efectuado en OVPM.
Se cierran 44 facturas de proveedores.
Se genera el archivo bancario plano en formato electrónico mediante EFM listo para subir a la banca online.
Tiempo de operación: Menos de 3 minutos frente a horas de digitación manual.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Cuál es la principal ventaja operativa de utilizar la opción "Ejecución de orden de pago" en lugar de "Ejecutar ejecución de pago" en el Asistente de Pagos?
A) Permite pagar facturas que no tienen número fiscal asignado.
B) Genera el fichero de pago bancario electrónico pero no crea asientos contables ni cierra facturas hasta recibir la confirmación oficial del banco.
C) Aplica automáticamente una retención del 50% en todas las líneas.
D) Transfiere los fondos de forma instantánea mediante la red SWIFT sin intervención humana.
Respuesta Correcta: B
Justificación Técnica: La ejecución de orden de pago genera el medio bancario sin alterar los saldos del libro mayor, evitando desajustes contables en caso de rechazo bancario de transferencias.
Pregunta 2
Si un proveedor tiene 5 facturas pendientes de pago y se procesa en el Asistente de Pagos con parametrización estándar, ¿cuántos documentos de pago se generan para ese proveedor?
A) Exactamente 5 pagos individuales.
B) Un único documento de pago consolidado que agrupa las 5 facturas, a menos que en el maestro del interlocutor comercial se haya seleccionado la opción de "Pago único".
C) Ninguno, el asistente solo procesa de a una factura por corrida.
D) Depende exclusivamente del número de almacenes involucrados.
Respuesta Correcta: B
Justificación Técnica: Por defecto, el Asistente de Pagos consolida todas las facturas abiertas de un mismo socio de negocios en un solo pago para optimizar costos de transacción bancaria.
Pregunta 3
¿Qué ocurre con las facturas incluidas en una ejecución del asistente de pago que se guarda bajo la opción "Grabar recomendaciones"?
A) Se cancelan definitivamente del sistema.
B) Quedan reservadas exclusivamente para esa ejecución y quedan bloqueadas para pagos manuales u otras corridas del asistente.
C) Se envían al correo electrónico del proveedor.
D) Pasan a ser consideradas activos fijos.
Respuesta Correcta: B
Justificación Técnica: La opción Grabar recomendaciones bloquea las partidas abiertas asociadas para garantizar que ningún otro usuario las pague manualmente en paralelo mientras se revisa la propuesta.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
