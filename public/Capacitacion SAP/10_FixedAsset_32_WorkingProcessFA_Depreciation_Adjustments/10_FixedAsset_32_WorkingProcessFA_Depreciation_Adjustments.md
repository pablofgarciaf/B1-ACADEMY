UNIDAD 045: EJECUCIÓN DE AMORTIZACIONES, AJUSTES Y CAMBIO DE EJERCICIO EN ACTIVOS FIJOS (SAP BUSINESS ONE 10.0)
Código de Manual: 10_FixedAsset_32_WorkingProcessFA_Depreciation_Adjustments
Módulo Oficial: Finanzas / Activos Fijos (Fixed Assets - Depreciation & Adjustments)
Versión de SAP: Business One 10.0
Audiencia Objetivo: Consultores Funcionales, Contadores Generales, Auditores y Agentes IA (Antigravity)
Carpeta Asociada: 045_10_FixedAsset_32_WorkingProcessFA_Depreciation_Adjustments


1. ESQUEMA TÉCNICO ANTIGRAVITY (JSON MASTER SCHEMA)
{

  "unit_id": "045",

  "topic": "Depreciation Runs, Adjustments, Revaluation & Fiscal Year Change",

  "sap_module": "FixedAssets_WorkingProcess",

  "operational_documents": {

    "depreciation_run": {

      "document": "Ejecución de amortización (Depreciation Run)",

      "table_header": "ODPR",

      "table_lines": "DPR1",

      "menu_path": "Finanzas > Activos fijos > Ejecución de amortización",

      "nature": "Proceso masivo en lote que materializa las amortizaciones planificadas en asientos contables reales (OJDT)"

    },

    "transfer": {

      "document": "Traslado de activo fijo (Transfer)",

      "table_header": "OXFR",

      "table_lines": "XFR1",

      "types": ["Traslado de activo (Asset Transfer)", "Traslado de clase de activo (Asset Class Transfer)"]

    },

    "manual_depreciation": {

      "document": "Amortización manual (Manual Depreciation)",

      "table_header": "ODEP",

      "table_lines": "DEP1",

      "types": ["Amortización normal", "Amortización no planificada (Deterioro)", "Amortización especial", "Apreciación / Revalorización positiva"]

    },

    "asset_revaluation": {

      "document": "Revalorización de activos fijos (Asset Revaluation)",

      "table_header": "OREV",

      "table_lines": "REV1",

      "use_case": "Ajuste al valor razonable de mercado (Fair Value Accounting)"

    },

    "fiscal_year_change": {

      "process": "Cambio de ejercicio (Fiscal Year Change)",

      "menu_path": "Finanzas > Activos fijos > Cambio de ejercicio",

      "mandatory_sequence": "Traspasa saldos finales y recalcula las amortizaciones planificadas para el nuevo ejercicio"

    }

  },

  "depreciation_run_mechanics": {

    "catch_up_principle": "Método de recuperación automática. Si no se ejecutaron corridas en meses previos, la corrida actual consolida acumulativamente todas las cuotas vencidas pendientes en un único asiento.",

    "repeat_run_rule": "Se puede repetir una corrida para el mismo periodo tantas veces como sea necesario; el sistema solo contabilizará el diferencial neto (delta) si los valores de los activos cambiaron.",

    "sequential_restriction": "No se puede ejecutar una corrida de amortización para un periodo anterior al último ya procesado formalmente."

  },

  "net_book_value_formula": "Valor_Neto_Contable = Costo_Adquisicion_APC - Amortizacion_Acumulada - Deterioros + Revalorizaciones"

}


2. DESARROLLO CONCEPTUAL Y FUNCIONAL EXHAUSTIVO
2.1 La Ejecución de Amortización (Depreciation Run - ODPR)
En SAP Business One, las cuotas de amortización que se visualizan en la pestaña Amortización de los datos maestros del activo son valores planificados estadísticos. No constituyen asientos contables automáticos día a día.

Para materializar el gasto contable en el balance y en pérdidas y ganancias, el contador debe procesar periódicamente la Ejecución de Amortización:

Ejecución por Área de Valoración: Se ejecuta seleccionando el Área Principal (ej. GAAP). Las áreas adicionales (ej. IFRS) también pueden ejecutarse para actualizar sus reportes analíticos sin generar asientos en el libro mayor.
Ventana de Vista Previa (Preview): Antes de contabilizar, el sistema agrupa los importes calculados por Clase de Activo y muestra el desglose cuenta por cuenta.
Mecanismo de Recuperación (Catch-Up): Si la empresa no ejecutó la amortización durante enero, febrero y marzo, al lanzar la corrida en abril, SAP B1 calcula el gasto acumulado de los 4 meses y genera un asiento compensatorio en abril sin bloquear el cierre contable.
Repetición de Corridas (Repeat Run): Si tras ejecutar una corrida de amortización se realiza un ajuste retroactivo en un activo (ej. una capitalización tardía), se puede volver a ejecutar la amortización para el mismo mes; el motor detecta la diferencia y contabiliza únicamente el delta.
2.2 Asiento Contable Generado por la Amortización
Dependiendo de la configuración del Área de Amortización:

Método Indirecto (Estándar recomendado):
Debe: 680000 - Gasto de Amortización de Activos Fijos (Pérdidas y Ganancias).
Haber: 159000 - Amortización Acumulada (Cuenta compensatoria de activo).
Efecto Patrimonial: El valor histórico en la cuenta principal de activo permanece intacto en $60,000, mientras que la cuenta de amortización acumulada refleja los créditos acumulados (-$2,000), mostrando en el balance un Valor Neto Contable (VNC) de $58,000.
Opción de Desglose en Documentos: Mediante Parametrizaciones de documento > Ejecución de amortización, el usuario puede elegir si desea que el asiento resuma una línea por clase de activo o si desglosa una línea individual por cada activo físico.
2.3 Documentos de Ajuste Durante el Ciclo de Vida del Activo
A. Traslado de Activo Fijo (Transfer - OXFR)
Se utiliza en tres escenarios operativos:

Error de Asignación: El activo se capitalizó por error en el maestro incorrecto.
Cambio de Clase de Activo: Un activo en proceso de montaje (Activos fijos en curso) finaliza su construcción y se reclasifica formalmente a Maquinaria y Equipo, migrando sus cuentas contables y comenzando a amortizar.
Traslado Parcial: Transferencia de un porcentaje del valor hacia otro activo.
B. Amortización Manual (Manual Depreciation - ODEP)
Permite registrar ajustes puntuales fuera del cálculo lineal estándar:

Amortización No Planificada (Deterioro / Impairment): Pérdida súbita e irreversible de valor económico (ej. un camión que sufre un accidente de tránsito o una máquina que queda obsoleta por cambio tecnológico).
Apreciación (Reversal of Impairment): Reversión positiva de una depreciación no planificada previa si las condiciones que originaron el deterioro desaparecen.
C. Revalorización de Activos Fijos (Asset Revaluation - OREV)
Bajo normas contables NIIF / IFRS (Modelo de Revalorización), los activos pueden ajustarse para reflejar su Valor Razonable de Mercado (Fair Value).

Si el valor de tasación pericial supera el valor en libros, se registra un incremento en el activo debitando la cuenta del bien y acreditando la Reserva de Revalorización en el Patrimonio Neto.
2.4 El Proceso de Cambio de Ejercicio (Fiscal Year Change)
Al finalizar el año calendario contable, el módulo de activos fijos exige ejecutar el Cambio de Ejercicio:

Ruta: Finanzas > Activos fijos > Cambio de ejercicio.
Operación del Sistema:
Consolida los valores de cierre del año saliente (costo histórico, amortizaciones acumuladas, bajas).
Traslada dichos saldos como saldos iniciales del nuevo ejercicio fiscal.
Recalcula automáticamente la tabla de amortizaciones planificadas para los próximos 12 meses.
Requisito previo: El nuevo periodo contable debe estar previamente creado en Periodos contables.


3. ATLAS DIDÁCTICO: EL CICLO COMPLETO DE VIDA DEL ACTIVO FIJO
┌────────────────────────────────────────────────────────────────────────┐

│                        CICLO DE VIDA DEL ACTIVO FIJO                   │

└───────────────────────────────────┬────────────────────────────────────┘

                                    │

1. ALTA / PUESTA EN MARCHA          ▼

   • Factura Proveedor (OPCH) o Capitalización Directa (OACQ)

   • Estado: Nuevo ──> Activo (Inicia depreciación)

                                    │

2. AMORTIZACIÓN MENSUAL             ▼

   • Ejecución de Amortización (ODPR)

   • Asiento: Debe Gasto Amortización | Haber Amortización Acumulada

   • Saldo en Libros: VNC = Costo Histórico - Amortización Acumulada

                                    │

3. AJUSTES Y REVALORIZACIONES       ▼

   • Deterioros / Accidentes: Amortización Manual (ODEP)

   • Ajuste a Valor de Mercado: Revalorización (OREV)

   • Reclasificación: Traslado de Activo (OXFR)

                                    │

4. CIERRE ANUAL                     ▼

   • Proceso: Cambio de Ejercicio (Fiscal Year Change)

   • Traspaso de saldos y proyección del siguiente ejercicio

                                    │

5. DESINCORPORACIÓN FINAL           ▼

   • Venta a Tercero o Desguace/Siniestro: Baja de Activo (ORET)

   • Estado: Inactivo (Saldo VNC = $0.00)


4. CASO DE NEGOCIO RESUELTO: DEPRECIACIÓN Y CAMBIO DE AÑO EN OEC COMPUTERS
Escenario de Consultoría:
El camión TRUCK-001 de OEC Computers fue capitalizado el 1 de enero por $6,000.00 USD a 36 meses ($166.67/mes; $2,000.00/año).

Al llegar diciembre, el contador Bryce debe contabilizar la amortización de todo el ejercicio y preparar los libros para el siguiente año fiscal.
En octubre, el camión sufrió una avería en el motor que generó un peritaje de desvalorización extraordinaria de $500.00 USD.
Ejecución Operativa en SAP Business One:
Registro del Deterioro:
Bryce abre Amortización manual (ODEP), selecciona Amortización no planificada, elige TRUCK-001 por $500.00 USD e imputa contra la cuenta de pérdidas por deterioro.
Ejecución de Amortización Anual:
Bryce ejecuta Finanzas > Activos fijos > Ejecución de amortización para el área GAAP al periodo 12-2026.
El sistema aplica el método catch-up y contabiliza los $2,000.00 USD de amortización ordinaria anual.
El Valor Neto Contable al 31 de diciembre queda en:
$$\text{VNC} = $6,000.00 - $2,000.00\text{ (Ordinaria)} - $500.00\text{ (Deterioro)} = $3,500.00\text{ USD}$$
Cambio de Ejercicio:
Bryce ingresa a Finanzas > Activos fijos > Cambio de ejercicio, selecciona pasar de 2026 a 2027 y pulsa Ejecutar.
El sistema traslada el saldo inicial de $3,500.00 a 2027 y recalcula las cuotas mensuales para los 24 meses restantes de vida útil.


5. BANCO DE EVALUACIÓN SITUACIONAL Y EXAMEN DE CERTIFICACIÓN
Pregunta 1
¿Qué sucede si una empresa olvida ejecutar las corridas mensuales de amortización durante varios meses y lanza la Ejecución de Amortización en el cuarto mes?
A) El sistema emite un bloqueo contable y obliga a abrir periodos pasados.
B) El sistema utiliza el principio de recuperación (Catch-Up), acumulando y contabilizando todas las amortizaciones planificadas no ejecutadas de los periodos previos en un único asiento en la fecha especificada.
C) Las cuotas de los meses no ejecutados se pierden definitivamente.
D) Se borra la ficha del activo fijo.
Respuesta Correcta: B
Justificación Técnica: La arquitectura de activos fijos de SAP Business One incorpora el método catch-up para garantizar que la depreciación acumulada se regularice en el balance sin obligar a reabrir periodos contables cerrados.
Pregunta 2
Si después de contabilizar una Ejecución de Amortización para el mes de marzo se descubre que se capitalizó un activo con fecha retroactiva a marzo, ¿cómo se procede en SAP B1?
A) Se debe revertir manualmente el asiento del libro diario con un contra-asiento.
B) Se puede volver a ejecutar la corrida de amortización para el mes de marzo (Repeat Run); el sistema detectará el cambio y contabilizará únicamente el valor diferencial (delta).
C) Es obligatorio esperar al cierre del ejercicio anual.
D) Se debe eliminar la clase de activo fija.
Respuesta Correcta: B
Justificación Técnica: SAP Business One permite repetir la ejecución de amortización tantas veces como sea necesario para un mismo periodo, registrando exclusivamente las variaciones incrementales.
Pregunta 3
¿Cuál es la función obligatoria del proceso "Cambio de Ejercicio" (Fiscal Year Change) en el módulo de Activos Fijos de SAP Business One?
A) Imprimir las etiquetas de código de barras para los activos.
B) Calcular los valores de cierre de todas las transacciones del activo en el año saliente, fijarlos como valores de inicio del nuevo año y recalcular las amortizaciones planificadas para el nuevo ejercicio fiscal.
C) Facturar a los clientes las cuotas de depreciación.
D) Cambiar la moneda local de la sociedad.
Respuesta Correcta: B
Justificación Técnica: El cambio de ejercicio traslada formalmente los saldos históricos al nuevo periodo fiscal y proyecta la tabla de amortización para el nuevo año de operaciones.