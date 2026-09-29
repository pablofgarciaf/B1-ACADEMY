# Guion de Video: DOC 116 FinProcess InternalReconciliation

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 116 FinProcess InternalReconciliation.

## Contenido Principal (Visual: Diapositivas correspondientes)
DOCUMENTO TÉCNICO ATÓMICO: DOC_116_FinProcess_InternalReconciliation.md
1. METADATOS TÉCNICOS
Módulo SAP: Gestión Financiera / Contabilidad de Socios de Negocios y Mayor
Código de Unidad: UNIDAD_116_FIN_INTERNAL_RECONCILIATION
Nombre del Manual Original: 10_FinProcess_31_InternalRecon_InternalRecon_ES.pdf
Audiencia Objetivo: Consultores Financieros Senior, Contadores Generales, Auditores de Cartera y Desarrolladores de Integración / Service Layer


2. JSON ANTIGRAVITY MASTER SCHEMA
{

  "$schema": "https://antigravity.ai/schemas/sap-b1-v10-unit.json",

  "unit_id": "116_FIN_INTERNAL_RECON",

  "title": "Proceso Financiero: Reconciliación Interna de Socios de Negocios y Cuentas de Mayor",

  "sap_module": "Financials / Business Partners",

  "version": "10.0",

  "database_tables": {

    "header_tables": [

      {

        "table": "OITR",

        "description": "Cabecera de Reconciliación Interna",

        "key_fields": ["ReconNum", "ReconDate", "ReconType", "IsCard", "SrcObjType", "CancelAbs"]

      },

      {

        "table": "OJDT",

        "description": "Cabecera de Asientos Contables generados por diferencias cambiarias o cruces"

      }

    ],

    "line_tables": [

      {

        "table": "ITR1",

        "description": "Líneas de Transacciones Reconciliadas Internamente",

        "key_fields": ["ReconNum", "LineSeq", "TransId", "TransRowId", "SrcObjAbs", "ReconSum", "ReconSumSys", "ReconSumFC"]

      },

      {

        "table": "JDT1",

        "description": "Líneas de Asiento Contable (Apuntes en Debe/Haber asociados)"

      }

    ]

  },

  "menu_paths": [

    {

      "action": "Reconciliación Interna de Socios de Negocios",

      "path": "Socios de Negocios -> Reconciliación Interna -> Reconciliación"

    },

    {

      "action": "Gestión de Reconciliaciones Anteriores (IC)",

      "path": "Socios de Negocios -> Reconciliación Interna -> Gestionar reconciliaciones anteriores"

    },

    {

      "action": "Reconciliación Interna de Cuentas de Mayor",

      "path": "Finanzas -> Reconciliación Interna -> Reconciliación"

    },

    {

      "action": "Gestión de Reconciliaciones Anteriores (Mayor)",

      "path": "Finanzas -> Reconciliación Interna -> Gestionar reconciliaciones anteriores"

    }

  ],

  "business_rules_and_validations": {

    "definition": "Confrontación y compensación de posiciones abiertas del Debe con posiciones del Haber en una misma cuenta o entre cuentas asociadas.",

    "recon_types": {

      "system_recon": {

        "description": "Ejecutada automáticamente por SAP B1 al aplicar pagos a facturas, abonos o cancelación de documentos.",

        "statuses": ["Total (Saldo abierto = 0.00)", "Parcial (Saldo residual abierto en el documento)"]

      },

      "user_recon": {

        "classes": [

          "Manual: Selección individual de partidas, permite saldar importes dispares o marcar múltiples ICs.",

          "Automática: Ejecución masiva por prioridades y tolerancias parametrizadas.",

          "Semiautomática: Recomendaciones inteligentes basadas en coincidencia de importe y fecha."

        ]

      }

    },

    "currency_rules": {

      "rule": "La reconciliación se realiza estrictamente en una única moneda (la moneda de la cuenta o del IC). Si es 'Todas las monedas' o 'Moneda Local', se reconcilia en ML. Si es ME, se reconcilia en dicha ME.",

      "balancing_constraint": "Todas las reconciliaciones deben balancear a cero tanto en Moneda Local (ML) como en Moneda del Sistema (MS).",

      "exchange_rate_differences": "Si se reconcilia en ME y existen fluctuaciones en los tipos de cambio entre la fecha del documento base y el pago, el sistema genera automáticamente un asiento por Diferencia de Tipo de Cambio.",

      "conversion_differences": "Si la Moneda del Sistema difiere de la Moneda Local, el sistema crea automáticamente un asiento por Diferencia de Conversión en MS."

    },

    "connected_business_partners": {

      "rule": "Permite compensar saldos cruzados entre una entidad que actúa simultáneamente como Cliente y Proveedor (casilla 'Considerar IC conectados'), generando un asiento compensatorio automático (Crédito a Cliente, Débito a Proveedor)."

    },

    "reversal_policy": {

      "rule": "La cancelación de una reconciliación interna en 'Gestionar reconciliaciones anteriores' disuelve el vínculo, pero NO cancela automáticamente los asientos contables de diferencias cambiarias generados. Estos deben anularse manualmente en el Libro Mayor si es requerido."

    }

  }

}


3. DESARROLLO CONCEPTUAL Y FUNCIONAL DETALLADO
3.1 Naturaleza y Propósito de la Reconciliación Interna
En SAP Business One, la Reconciliación Interna representa el mecanismo contable mediante el cual se compensan y cancelan partidas abiertas entre sí dentro de una misma cuenta de mayor o de una cuenta auxiliar de socio de negocios. A diferencia de la Reconciliación Externa (que compara la cuenta de banco propio contra el extracto bancario remitido por una institución externa), la reconciliación interna opera exclusivamente dentro del libro contable de la empresa.

El principio financiero base exige que:

En cuentas de Clientes (CardType = 'C'): Un cargo en el Debe (Factura de Clientes OINV) debe ser cancelado por un crédito en el Haber (Cobro / Pago Recibido ORCT o Abono ORIN).
En cuentas de Proveedores (CardType = 'S'): Un abono en el Haber (Factura de Proveedores OPCH) debe ser cancelado por un débito en el Debe (Pago Efectuado OVPM o Devolución / Abono ORPC).
3.2 Reconciliaciones del Sistema vs. Reconciliaciones de Usuario
Reconciliaciones del Sistema (Automáticas):
Se producen de manera transparente cuando un usuario crea un pago seleccionando explícitamente una o más facturas.
Se ejecutan en cancelaciones directas de documentos.
Se ejecutan en cuentas puente provisionales del sistema de inventario permanente (ej. Cuenta de Asignación / Compensación de existencias al conciliar la Entrada de Mercancías OPDN contra la Factura OPCH, y en Cuentas de Anticipos).
Pueden ser Totales (el pago salda el 100% de la factura) o Parciales (queda un saldo vivo en OpenBal).
Reconciliaciones de Usuario:
Ocurren cuando las transacciones quedaron desconectadas. Ejemplos clásicos:
Un cliente realiza un pago bancario "a cuenta" sin identificar la factura.
Se realiza un anticipo a un proveedor antes de emitir la factura.
Acuerdos de pagos fijos mensuales acumulativos.
Modalidades:
Manual: El usuario marca manualmente las casillas de verificación, ajusta el campo Importe a Reconciliar para compensaciones parciales y procesa la transacción.
Automática: Se definen rangos de códigos, fechas y reglas de prioridad (ej. saldar primero las más antiguas).
Semiautomática: El sistema sugiere coincidencias de importes y fechas, permitiendo al usuario aprobar con un clic.
3.3 Reconciliación de Socios de Negocios Conectados (Cliente - Proveedor)
Cuando una empresa comercializa con un socio que funge a la vez como cliente y proveedor (ej. un fabricante que también compra consumibles a la empresa), se habilitan dos maestros de IC vinculados mediante el campo Connected Card (OCRD.FatherCard / relación de contraparte). Al activar la casilla Considerar IC conectados en la reconciliación manual:

El sistema presenta en una única matriz las facturas de ventas pendientes y las facturas de compras pendientes.
Al reconciliar, se genera un Asiento Contable Automático de Compensación (OJDT):
Haber (Crédito): Cuenta asociada del Cliente (reduce la cuenta por cobrar).
Debe (Débito): Cuenta asociada del Proveedor (reduce la cuenta por pagar).
La deuda mutua queda saldada sin movimiento de dinero en cuentas bancarias.
3.4 Manejo Multidivisa y Asientos de Ajuste
Toda reconciliación debe cuadrar en Moneda Local y Moneda del Sistema. Cuando intervienen transacciones en Moneda Extranjera (ME):

Diferencias de Tipo de Cambio (Exchange Rate Differences): Si el tipo de cambio varió entre la fecha de la factura y la fecha del cobro/pago, el sistema genera automáticamente un asiento que imputa la ganancia o pérdida cambiaria realizada contra las cuentas configuradas en la Determinación Contable.
Diferencias de Conversión (Conversion Differences): Si la Moneda del Sistema es distinta de la Moneda Local, se ajusta el contravalor en MS para que el balance en dicha moneda cierre exactamente en 0.00.


4. CASO DE NEGOCIO RESUELTO: OEC COMPUTERS
Contexto
OEC Computers mantiene relaciones comerciales con Maxi-Teq. Maxi-Teq es cliente corporativo de servidores, pero a la vez es proveedor de componentes de red.

Saldo como Cliente (C20000): Factura de Ventas INV 1042 por un total de $3,500.00 USD.
Saldo como Proveedor (V10500): Factura de Proveedores PCH 8021 por un total de $2,000.00 USD.

Ambas compañías acuerdan saldar $2,000.00 de la deuda cruzada sin intercambio bancario, y que Maxi-Teq liquide los $1,500.00 restantes mediante transferencia.
Procedimiento en Pantalla
Menú: Socios de Negocios -> Reconciliación Interna -> Reconciliación.
Parámetros: Tipo de Reconciliación = Manual. Marcar casilla Considerar IC conectados.
Seleccionar interlocutor C20000. El sistema carga automáticamente a V10500.
Clic en Reconciliar.
En la grilla:
Fila PCH 8021: Importe Saldo = -$2,000.00. Marcar y fijar Importe a reconciliar = -$2,000.00.
Fila INV 1042: Importe Saldo = $3,500.00. Marcar y editar el campo Importe a Reconciliar fijando exactamente $2,000.00.
Diferencia = 0.00.
Clic en el botón Reconciliar.
Resultado:
Se crea la Reconciliación Interna Nº 80045.
Se genera el Asiento automático:
Débito a Proveedores (V10500): $2,000.00 (Cancela pasivo).
Crédito a Clientes (C20000): $2,000.00 (Reduce activo por cobrar).
La factura INV 1042 pasa a estado Abierto con saldo residual de $1,500.00 para posterior cobro bancario.


5. BANCO DE EVALUACIÓN SITUACIONAL
Pregunta 1
Situación: Un contador registró un cobro de un cliente marcando la opción "Pago a cuenta" sin vincularlo a ninguna factura pendiente. Dos meses después, el informe de antigüedad de saldos muestra la factura vencida con mora y el pago como un crédito no aplicado. ¿Cómo debe corregirse esta situación en SAP Business One?

A) Cancelar el cobro original y registrarlo nuevamente vinculando la factura.
B) Ejecutar una Reconciliación Interna de Usuario (clase Manual) para el socio de negocios, vinculando la factura con el pago a cuenta.
C) Crear un Asiento Contable manual entre la cuenta de clientes y el banco.
D) Ejecutar el Asistente de Pagos en modo reclasificación.
Respuesta Correcta: B
Justificación Técnica: Los pagos a cuenta no vinculan documentos base en la DI-API ni en la base de datos. Para vincular transacciones abiertas del mismo socio de negocios sin alterar los libros de caja/bancos, se utiliza la Reconciliación Interna de Usuario (OITR), la cual compensa el débito de la factura con el crédito del pago a cuenta sin generar nuevos movimientos de efectivo.
Pregunta 2
Situación: Al cancelar una reconciliación interna manual previa mediante "Gestionar reconciliaciones anteriores", el usuario nota que las facturas vuelven a estar abiertas, pero existía un asiento de diferencia de tipo de cambio generado durante la reconciliación original. ¿Qué ocurre con dicho asiento contable?

A) El sistema lo cancela automáticamente en el mismo proceso.
B) El asiento de diferencia de tipo de cambio permanece intacto en el Libro Mayor y debe cancelarse manualmente si se requiere eliminar su impacto.
C) El sistema bloquea la cancelación de la reconciliación si hubo diferencias de cambio.
D) El asiento se reasigna a la cuenta de resultados del ejercicio actual.
Respuesta Correcta: B
Justificación Técnica: Según las reglas del núcleo contable de SAP B1, cancelar una reconciliación interna solo elimina la relación en OITR/ITR1, liberando el saldo de las partidas. Los asientos contables registrados por diferencias cambiarias (OJDT) no se anulan de forma refleja; si son erróneos, el usuario debe ir a Finanzas -> Asiento y ejecutar la cancelación formal del asiento.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
