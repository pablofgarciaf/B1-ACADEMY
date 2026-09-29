# Guion de Video: DOC 117 FinSetup Currencies

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 117 FinSetup Currencies.

## Contenido Principal (Visual: Diapositivas correspondientes)
DOCUMENTO TÉCNICO ATÓMICO: DOC_117_FinSetup_Currencies.md
1. METADATOS TÉCNICOS
Módulo SAP: Gestión Financiera / Configuración de Monedas y Contabilidad Multidivisa
Código de Unidad: UNIDAD_117_FIN_CURRENCIES
Nombre del Manual Original: 10_FinSetup_11_Currencies_Currencies_ES.pdf
Audiencia Objetivo: Directores Financieros, Consultores de Implementación SAP B1, Contadores Internacionales y Diseñadores de Arquitectura RAG


2. JSON ANTIGRAVITY MASTER SCHEMA
{

  "$schema": "https://antigravity.ai/schemas/sap-b1-v10-unit.json",

  "unit_id": "117_FIN_CURRENCIES",

  "title": "Configuración Financiera: Monedas, Contabilidad Paralela y Diferencias Cambiarias",

  "sap_module": "Financials / Setup",

  "version": "10.0",

  "database_tables": {

    "header_tables": [

      {

        "table": "OCRN",

        "description": "Definición de Monedas del Sistema y Formatos",

        "key_fields": ["CurrCode", "CurrName", "Decimals", "RoundSys"]

      },

      {

        "table": "ORTT",

        "description": "Tabla de Tipos de Cambio Oficiales",

        "key_fields": ["RateDate", "Currency", "Rate"]

      },

      {

        "table": "CINF",

        "description": "Información de la Sociedad (Almacena MainCurncy y SysCurrncy)"

      }

    ],

    "line_tables": [

      {

        "table": "JDT1",

        "description": "Líneas de Asiento Contable (Valores en BalDueDeb, BalSysDeb, BalFcDeb)"

      },

      {

        "table": "ITM1",

        "description": "Listas de Precios por Artículo (Moneda Principal y Monedas Adicionales)"

      }

    ]

  },

  "menu_paths": [

    {

      "action": "Definición de Monedas",

      "path": "Gestión -> Inicialización del sistema -> Configuración -> Finanzas -> Monedas"

    },

    {

      "action": "Tabla de Tipos de Cambio e Índices",

      "path": "Gestión -> Inicialización del sistema -> Tipos de cambio e índices"

    },

    {

      "action": "Diferencias de Tipo de Cambio (Revalorización)",

      "path": "Finanzas -> Diferencias de tipo de cambio"

    },

    {

      "action": "Diferencias de Conversión (Moneda del Sistema)",

      "path": "Finanzas -> Diferencias de conversión"

    }

  ],

  "business_rules_and_validations": {

    "parallel_currencies": {

      "local_currency": "Moneda oficial obligatoria en la que la entidad legal rinde cuentas e impuestos.",

      "system_currency": "Moneda paralela calculada en tiempo real en cada asiento contable, utilizada para consolidación de filiales o reporte a casas matrices e inversores extranjeros.",

      "immutability_rule": "¡CRÍTICO! Una vez registrada la primera transacción contable en la base de datos, la Moneda Local y la Moneda del Sistema quedan bloqueadas permanentemente y NO pueden modificarse bajo ninguna circunstancia."

    },

    "account_currency_types": {

      "local_currency_only": "Solo acepta transacciones en ML. El saldo se visualiza en ML y MS. Reconciliación en ML.",

      "specific_foreign_currency": "Solo acepta transacciones en la ME definida y en ML. Reconciliación en dicha ME.",

      "all_currencies": "Acepta asientos en cualquier divisa registrada en OCRN. Reconciliación en ML. Puede transicionar de ME a 'Todas las monedas', pero es un cambio IRREVERSIBLE."

    },

    "pricing_currencies": {

      "rule": "Una lista de precios permite fijar tarifas en hasta 3 divisas simultáneas: Moneda Primaria, Moneda Adicional 1 y Moneda Adicional 2. Si un documento comercial utiliza una divisa que coincide con una moneda adicional, toma dicho precio sin requerir conversión cambiaria."

    },

    "revaluation_routines": {

      "exchange_rate_diff": "Ajusta las partidas abiertas en Moneda Extranjera evaluándolas al tipo de cambio de cierre frente al tipo de cambio histórico en ML.",

      "conversion_diff": "Ajusta las cuentas evaluadas en Moneda del Sistema para reflejar la paridad exacta al cierre fiscal."

    }

  }

}


3. DESARROLLO CONCEPTUAL Y FUNCIONAL DETALLADO
3.1 Arquitectura de Doble Moneda Paralela (ML y MS)
SAP Business One posee un motor contable nativo multidivisa capaz de gestionar balances financieros en dos monedas de forma simultánea e instantánea:

Moneda Local (Local Currency - ML):
Es la moneda de curso legal del país de localización de la empresa (ej. GBP en Reino Unido, USD en Ecuador/EE.UU., EUR en España).
Rige la contabilidad fiscal oficial y la liquidación de impuestos.
Moneda del Sistema (System Currency - MS):
Es una divisa fija definida a nivel de empresa en Detalles de la Sociedad (CINF.SysCurrncy).
En cada apunte contable (JDT1), el sistema calcula y almacena de forma paralela los valores en ML y en MS en tiempo real según el tipo de cambio del día (ORTT).
Permite consolidar balances corporativos transnacionales sin requerir conversiones manuales ni scripts externos.
3.2 Clasificación de Monedas en Cuentas y Socios de Negocios
Al dar de alta una Cuenta de Mayor (OACT) o un Socio de Negocios (OCRD), se debe elegir una de las 3 opciones de moneda:

Moneda Local: La cuenta solo recibe apuntes en la divisa nacional. Si un proveedor está configurado en ML, cualquier factura en ME debe convertirse a ML antes de asentar.
Moneda Extranjera Específica (ej. USD): La cuenta opera en dicha moneda extranjera y en moneda local. Permite consultar el saldo tanto en ME como en ML y MS. La reconciliación interna se ejecuta obligatoriamente en esa ME.
Todas las Monedas: Diseñada para cuentas bancarias multidivisa o socios de negocios globales. Permite registrar transacciones en cualquier moneda activa en el catálogo OCRN. La reconciliación interna se realiza en Moneda Local. Regla de oro: Es posible convertir una cuenta de Moneda Específica a "Todas las Monedas", pero una vez guardada, no se puede revertir.
3.3 Gestión de Monedas en Listas de Precios
Cada lista de precios (OPLN/ITM1) admite hasta 3 columnas de moneda:

Moneda Primaria: Generalmente la moneda local o la divisa estándar de catálogo.
Moneda Adicional 1: Tarifa fija en divisa extranjera (ej. USD para exportaciones a Norteamérica).
Moneda Adicional 2: Tarifa fija alternativa (ej. EUR para la Unión Europea).

Comportamiento en Ventas: Si se emite una factura a un cliente cuya moneda asignada es USD, el sistema verifica primero si la lista de precios asignada tiene cargado un valor en la columna de Moneda Adicional USD. Si existe, toma ese precio exacto pactado (evitando desfases por fluctuación diaria). Si la columna está vacía, toma el precio primario y lo divide/multiplica por el tipo de cambio oficial del día de contabilización (ORTT.Rate).
3.4 Procesos de Cierre: Diferencias de Cambio y Conversión
Diferencias de Tipo de Cambio (Exchange Rate Differences):
Ventana: Finanzas -> Diferencias de tipo de cambio.
Evalúa todas las cuentas e interlocutores con saldo en Moneda Extranjera al tipo de cambio de la fecha de corte.
Genera propuestas de asientos de ganancia o pérdida no realizada, equilibrando el saldo en Moneda Local contra cuentas de resultados.
Diferencias de Conversión (Conversion Differences):
Ventana: Finanzas -> Diferencias de conversión.
Aplica cuando la Moneda del Sistema es distinta de la Moneda Local.
Revalúa los saldos de la Moneda del Sistema al tipo de cambio de cierre para que los reportes consolidados corporativos reflejen el valor razonable exacto.


4. CASO DE NEGOCIO RESUELTO: OEC COMPUTERS
Contexto
OEC Computers opera en el Reino Unido (Moneda Local = GBP). Sin embargo, sus principales inversionistas se encuentran en Alemania y requieren que los estados financieros se reporten en Euros (Moneda del Sistema = EUR). Asimismo, OEC adquiere servidores a un fabricante en California (Moneda IC = USD).

Operación 1 (Factura de Proveedor OPCH):
Proveedor: V70000 (Moneda: USD).
Importe: $10,000.00 USD.
Fecha de Factura: 01 de Octubre. Tipo de cambio: 1 USD = 0.80 GBP. Tipo de cambio EUR: 1 EUR = 0.88 GBP.
Asiento: Crédito a Proveedores por $10,000.00 USD, equivalente a £8,000.00 GBP (ML) y €9,090.91 EUR (MS).
Operación 2 (Pago Efectuado OVPM):
Fecha de Pago: 30 de Octubre. Tipo de cambio: 1 USD = 0.75 GBP.
Al transferir los $10,000.00 USD, el contravalor en libras es de £7,500.00 GBP.
Resultado del Sistema:
OEC Computers pagó £7,500.00 GBP por una obligación valorada inicialmente en £8,000.00 GBP.
El sistema genera automáticamente durante el pago un crédito de £500.00 GBP en la cuenta Ganancia de Diferencia de Cambio Realizada.
La deuda con el proveedor queda reconciliada en $0.00 USD y en £0.00 GBP.


5. BANCO DE EVALUACIÓN SITUACIONAL
Pregunta 1
Situación: Una subsidiaria en México de una multinacional estadounidense implementa SAP Business One. Legalmente debe presentar cuentas en Pesos Mexicanos (MXN), pero la casa matriz exige consolidar diariamente en Dólares Estadounidenses (USD). ¿Cómo debe configurarse la base de datos en la Inicialización Básica?

A) Moneda Local: USD; Moneda del Sistema: MXN.
B) Moneda Local: MXN; Moneda del Sistema: USD.
C) Moneda Local: MXN; Moneda del Sistema: MXN, y ejecutar un script de exportación a Excel.
D) Moneda Local: Todas las Monedas; Moneda del Sistema: USD.
Respuesta Correcta: B
Justificación Técnica: La Moneda Local debe corresponder a la moneda fiscal obligatoria del país (MXN en México). La Moneda del Sistema se configura en USD, lo que permite que SAP Business One registre de forma paralela e instantánea cada línea de asiento en MXN y USD en tiempo real, permitiendo emitir balances de comprobación y estados de resultados directamente en USD sin conversiones manuales.
Pregunta 2
Situación: Un consultor junior intenta cambiar la Moneda del Sistema de una empresa en producción porque la casa matriz cambió de país de radicación. Al entrar a Detalles de la Sociedad, el campo aparece en gris bloqueado. ¿Por qué ocurre esto?

A) Porque el usuario no tiene permisos de Superusuario.
B) Porque no se ha cerrado el período contable anterior.
C) Porque una vez que se asienta la primera transacción contable o de inventario, la Moneda Local y la Moneda del Sistema son estrictamente inmutables en la base de datos de SAP B1.
D) Porque debe desmarcarse primero la casilla de inventario permanente.
Respuesta Correcta: C
Justificación Técnica: La arquitectura de base de datos de SAP Business One (CINF) congela de forma irreversible los campos MainCurncy y SysCurrncy en cuanto existe al menos un registro en OJDT o tablas transaccionales, debido a que toda la estructura de recálculos de saldo histórico depende de la paridad original fijada en las transacciones.

## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
