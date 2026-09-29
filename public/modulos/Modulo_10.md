# MÓDULO 10: CONTABILIDAD FINANCIERA, GESTIÓN BANCARIA Y ACTIVOS FIJOS 
**(SAP BUSINESS ONE 10.0 & ERP)**

**Tipo de Contenido:** Base de Conocimiento Operativa y Guía de Entrenamiento para Copiloto IA  
**Fuentes Oficiales Analizadas:** 10_AccBasics_11_Financial_Basics_ES.pdf, 10_AccBasics_12_Automatic_Journal_Entries_ES.pdf, 10_BankProcess_11_Handling_Payments_ES.pdf, 10_BankProcess_12_Payment_Wizard_ES.pdf, 10_BankProcess_21_BankReconcile_Overview_ES.pdf, 10_FixedAsset_11_Intro_ES.pdf, 10_FixedAsset_21_InitSettings.pdf y 10_FixedAsset_31_32_33_Lifecycle.pdf  
**Nivel:** Avanzado / Dirección Financiera, Tesorería, Contabilidad General y Control de Activos  
**Tiempo Estimado de Estudio:** 75 minutos (dividido en 4 lecciones integradas)

---

## Resumen Ejecutivo

La columna vertebral de un sistema ERP corporativo radica en su capacidad de transformar instantáneamente cada transacción operativa, logística y comercial en registros financieros fidedignos, auditables y estructurados bajo normas contables internacionales. En SAP Business One 10.0, el módulo de Finanzas no es una bandeja receptora pasiva al cierre del mes; es un motor en tiempo real que asegura la cuadratura del Balance General y el Estado de Resultados mediante reglas estrictas de determinación de cuentas y mecanismos de control de libros auxiliares (*subledgers*).

Este módulo aborda los cuatro pilares fundamentales de la contabilidad y la tesorería corporativa:
1. **Arquitectura Contable y Cuentas Asociadas:** Estructura jerárquica del Plan de Cuentas por cajones contables, la regla de inviolabilidad de las Cuentas Asociadas (*Control Accounts*) y los esquemas de determinación contable tradicional y avanzada.
2. **Gestión de Tesorería y Flujo en Dos Pasos:** El tratamiento de los medios de pago, el uso obligatorio de Cuentas Transitorias de Compensación (*Clearing Accounts*) para cheques y tarjetas, y su impacto en la liquidez y el control interno.
3. **Automatización de Pagos y Reconciliaciones:** La operación del Asistente de Pagos Masivos (*Payment Wizard*) para dispersión electrónica de fondos y la distinción analítica entre la Reconciliación Externa (banco contra mayor) y la Reconciliación Interna (partidas abiertas de DEBE y HABER).
4. **Ciclo de Vida Integral de Activos Fijos:** Gobierno del submódulo de activos bajo normas IFRS/fiscales a través de sus cuatro pilares de parametrización, el cálculo y ejecución de depreciaciones mensuales, y el tratamiento contable de las bajas por venta y desguace.

Dominar estos conceptos capacita al consultor y al copiloto de IA para diagnosticar inconsistencias financieras, proteger la trazabilidad contable y optimizar el capital de trabajo de la organización.

---

## ÍNDICE DEL MÓDULO

1. [Lección 10.1: Arquitectura del Plan de Cuentas, Determinación Contable y Cuentas Asociadas](#lección-101-arquitectura-del-plan-de-cuentas-determinación-contable-y-cuentas-asociadas)
2. [Lección 10.2: Gestión de Tesorería: Medios de Pago y Cuentas Transitorias de Compensación](#lección-102-gestión-de-tesorería-medios-de-pago-y-cuentas-transitorias-de-compensación)
3. [Lección 10.3: El Asistente de Pagos Masivos y Reconciliación Bancaria Externa e Interna](#lección-103-el-asistente-de-pagos-masivos-y-reconciliación-bancaria-externa-e-interna)
4. [Lección 10.4: Submódulo de Activos Fijos: Capitalización, Depreciación y Retiro](#lección-104-submódulo-de-activos-fijos-capitalización-depreciación-y-retiro)
5. [Matriz de Troubleshooting y Reglas Críticas para el Copiloto IA](#matriz-de-troubleshooting-y-reglas-críticas-para-el-copiloto-ia)
6. [Banco de Evaluación Situacional](#banco-de-evaluación-situacional)
7. [Guiones Humanizados para Locución IA (ElevenLabs)](#guiones-humanizados-para-locución-ia-elevenlabs)

---

## LECCIÓN 10.1: ARQUITECTURA DEL PLAN DE CUENTAS, DETERMINACIÓN CONTABLE Y CUENTAS ASOCIADAS

### 1. Los Cajones del Plan de Cuentas (Chart of Accounts Drawers)

SAP Business One organiza su contabilidad financiera mediante una estructura arbórea segmentada de hasta 10 niveles, organizada conceptualmente en **Cajones (*Drawers*)**. Cada cajón agrupa cuentas con un propósito financiero homogéneo, delimitando estrictamente el Balance General del Estado de Pérdidas y Ganancias (PyG):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ARQUITECTURA DEL PLAN DE CUENTAS                         │
├──────────────────────────────────────┬──────────────────────────────────────┤
│      [ BALANCE GENERAL ]             │   [ ESTADO DE PÉRDIDAS Y GANANCIAS ] │
│      (Cuentas Patrimoniales)         │   (Cuentas de Resultados / Ejercicio)│
├──────────────────────────────────────┼──────────────────────────────────────┤
│ ├── Cajón 1: Activo                  │ ├── Cajón 4: Ingresos Operacionales  │
│ ├── Cajón 2: Pasivo                  │ ├── Cajón 5: Costo de Ventas         │
│ └── Cajón 3: Patrimonio Neto/Capital │ ├── Cajón 6: Gastos Operativos       │
│                                      │ ├── Cajón 7: Ingresos/Gastos No Oper.│
│                                      │ └── Cajón 8: Impuestos y Extraord.   │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

#### ¿Por qué esta separación estructural es crítica en un ERP?
* **Arrastre de Saldos vs. Cierre de Ejercicio:** Las cuentas de los Cajones 1 al 3 acumulan saldo a lo largo del tiempo de manera continua (partidas de balance). Por el contrario, los Cajones 4 al 8 representan el flujo económico de un ejercicio fiscal concreto; al ejecutar el proceso de *Cierre de Período*, sus saldos son liquidados y trasladados a cero contra una cuenta de patrimonio (Utilidades Retenidas o Resultado del Ejercicio en el Cajón 3).
* **Nivel de Cuenta: Cuentas de Título vs. Cuentas Activas:**
  * **Cuentas de Título (Nivel 1 al 9):** Sirven exclusivamente para agrupar y organizar el árbol financiero. En ellas está técnicamente bloqueada cualquier contabilización manual o automática.
  * **Cuentas Activas / Imputables (Último Nivel):** Son las únicas cuentas en las que se permite registrar asientos contables. Se distinguen visualmente en color verde (si son cuentas estándar) o azul (si son cuentas asociadas).

| Cajón | Nombre Oficial | Naturaleza | Reporte Financiero Principal |
| :--- | :--- | :--- | :--- |
| **1** | **Activo** | Deudora (DEBE) | Balance General |
| **2** | **Pasivo** | Acreedora (HABER) | Balance General |
| **3** | **Patrimonio** | Acreedora (HABER) | Balance General |
| **4** | **Ingresos** | Acreedora (HABER) | Estado de Resultados (PyG) |
| **5** | **Costo de Ventas** | Deudora (DEBE) | Estado de Resultados (PyG) |
| **6** | **Gastos de Explotación** | Deudora (DEBE) | Estado de Resultados (PyG) |
| **7** | **Otros Ingresos y Gastos**| Mixta | Estado de Resultados (PyG) |
| **8** | **Impuestos y Extraordinarios**| Deudora (DEBE) | Estado de Resultados (PyG) |

---

### 2. Cuentas Asociadas (Control Accounts): El Vínculo con los Libros Auxiliares

En la gestión contable moderna, una empresa interactúa con cientos o miles de clientes y proveedores. Crear una cuenta contable individual en el Libro Mayor para cada cliente o proveedor desbordaría el Plan de Cuentas, destruiría la legibilidad del Balance y haría ingobernable la auditoría.

#### Principio Fundamental del Subledger (Libro Auxiliar)
* Los clientes (`Cxxxxx`) y proveedores (`Vxxxxx`) no son cuentas contables dentro del Plan de Cuentas. Son entidades maestras denominadas **Interlocutores Comerciales (IC)** que residen en el Libro Auxiliar (*Subledger*).
* La **Cuenta Asociada (*Control Account*)** es una cuenta del Libro Mayor designada específicamente para acumular de forma consolidada la totalidad de las deudas por cobrar o pasivos por pagar de un grupo homogéneo de Interlocutores Comerciales (ej. *110501 - Cuentas por Cobrar Comerciales Locales* o *210501 - Proveedores del Exterior*).

```
  [ FACTURA DE VENTA A/R AL CLIENTE C20000 POR $112 ]
                        │
                        ▼
  ┌──────────────────────────────────────────────────────────┐
  │ ASIENTO CONTABLE AUTOMÁTICO DE DIARIO:                   │
  │                                                          │
  │ • DEBE:  Cuenta Asociada Clientes Locales        $112    │
  │          └── Subcuenta Auxiliar C20000: $112             │
  │ • HABER: Cuenta IVA Débito Fiscal (Impuestos)     $12    │
  │ • HABER: Cuenta Ingresos por Ventas de Mercancía $100    │
  └──────────────────────────────────────────────────────────┘
```

#### Regla Estricta del Sistema: Bloqueo de Asientos Directos
> [!IMPORTANT]
> **Regla de Oro en SAP Business One:** Está técnicamente prohibido realizar asientos contables manuales imputando directamente el código numérico de una cuenta asociada. Si un usuario intenta hacerlo, SAP emitirá un error bloqueante: *"La cuenta es una cuenta asociada"*.
>
> **¿Por qué existe esta restricción?**  
> Si se permitiera debitar o acreditar una cuenta asociada mediante un asiento directo sin asociar el código del Interlocutor Comercial, el saldo del Libro Mayor (*General Ledger*) se descuadraría de forma irreversible respecto al saldo acumulado en el Reporte de Antigüedad de Saldos del módulo de Clientes o Proveedores (*Subledger*). En una auditoría, el Mayor contable debe ser idéntico al último centavo con la suma de las deudas de los auxiliares.

---

### 3. Determinación de Cuentas de Mayor: Tradicional vs. Avanzada

La determinación de cuentas de mayor es el cerebro contable que permite que los documentos de logística, compras y ventas generen asientos automáticos sin que el usuario operativo necesite conocimientos contables.

Ruta de acceso: `Gestión > Configuración > Finanzas > Determinación de cuentas de mayor`.

#### A. Determinación Tradicional
Opera asignando cuentas contables fijas para compras, ventas e inventario bajo una jerarquía predeterminada de tres niveles:
1. **Nivel Almacén:** Las cuentas contables se determinan según el almacén logístico de despacho o recepción.
2. **Nivel Grupo de Artículos:** Las cuentas se heredan de la categoría del artículo (ej. Línea Ferretería vs. Línea Lácteos).
3. **Nivel Datos Maestros de Artículo:** Se configuran cuentas particulares a nivel de la ficha de un ítem individual.

#### B. Determinación Avanzada de Cuentas de Mayor
Diseñada para empresas con matrices contables complejas. Permite definir reglas condicionales multidimensionales mediante una matriz flexible de prioridades:

* **Evaluación Multicriterio:** El sistema cruza múltiples variables en simultáneo antes de seleccionar la cuenta contable de ingresos, costo o inventario.
* **Criterios Combinables:** Grupo de Artículos, Código de Artículo, Almacén, Grupo de Interlocutor Comercial, Territorio de Entrega, País de Destino, Indicador de Impuestos y Campos Definidos por el Usuario (UDF).

```
Ejemplo de Regla Avanzada:
SI [Almacén = "01"] Y [Grupo = "Hardware"] Y [Territorio = "Exportación"] 
  ➔ Contabilizar Ingreso en Cuenta 410103 ("Ventas Extranjeras Hardware Exentas")
EN CUALQUIER OTRO CASO:
  ➔ Contabilizar en Cuenta Estándar 410101 ("Ventas Locales Generales")
```

| Dimensión Comparativa | Determinación Tradicional | Determinación Avanzada |
| :--- | :--- | :--- |
| **Criterios Evaluados** | 1 único criterio fijo (Almacén, Grupo o Artículo). | Múltiples criterios combinados de forma simultánea. |
| **Flexibilidad** | Rígida; requiere multiplicar almacenes o grupos si la contabilidad varía por territorio. | Altamente dinámica y escalable según las reglas del negocio. |
| **Priorización de Reglas**| Jerárquica estricta (Artículo > Grupo > Almacén). | Ponderación configurable de pesos y prioridades por regla. |
| **Complejidad de Mantenimiento** | Baja, apta para modelos de negocio estándar. | Media-Alta; exige estricta gobernanza en la parametrización. |

---

## LECCIÓN 10.2: GESTIÓN DE TESORERÍA: MEDIOS DE PAGO Y CUENTAS TRANSITORIAS DE COMPENSACIÓN

El submódulo de Gestión de Bancos controla las transacciones de cobro a clientes, pagos a proveedores y transferencias internas de fondos.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MEDIOS DE PAGO DISPONIBLES EN SAP                    │
├──────────────────────┬──────────────────────────────────────────────────────┤
│ 1. EFECTIVO          │ Afecta la caja física o cuenta de caja chica.        │
│ 2. CHEQUES           │ Registra títulos de crédito físicos en cartera.      │
│ 3. TARJETA DE CRÉDITO│ Registra los comprobantes/vouchers emitidos por POS. │
│ 4. TRANSFERENCIA     │ Afecta de forma directa la cuenta de Banco Propio.   │
└──────────────────────┴──────────────────────────────────────────────────────┘
```

---

### 1. El Flujo en Dos Pasos y las Cuentas de Compensación (Clearing Accounts)

¿Por qué SAP Business One implementa un flujo en dos etapas para cheques, tarjetas y efectivo en lugar de registrar directamente el ingreso en la cuenta corriente bancaria?

> [!NOTE]
> **Justificación Financiera y de Auditoría:**  
> Cuando un cliente entrega un cheque en la recepción de la empresa o realiza un pago con tarjeta de crédito en una sucursal, el dinero **no está inmediatamente disponible** en la cuenta bancaria de la sociedad. El cheque puede carecer de fondos o estar postfechado, y la operadora de tarjetas de crédito demora de 24 a 72 horas en dispersar los fondos netos de comisiones y retenciones. Si se contabilizara directamente contra la cuenta de Banco Propio, el saldo en el ERP reflejaría una liquidez irreal, imposibilitando la conciliación bancaria.

#### PASO 1: Registro del Cobro (Pago Recibido / *Incoming Payment*)
Se extingue la deuda del cliente en el libro auxiliar y el valor se traslada a custodia transitoria:
* **DEBE:** Cuenta Transitoria de Compensación (*Cheques en Cartera* o *Tarjetas por Cobrar*).
* **HABER:** Cuenta Asociada de Clientes (el saldo de la factura del cliente queda formalmente cancelado).

#### PASO 2: Depósito Bancario (Boleta de Depósito / *Deposit*)
Cuando el tesorero traslada los cheques a la ventanilla bancaria o la entidad liquida el lote de tarjetas:
* **DEBE:** Cuenta de Banco Propio (el dinero se incorpora formalmente al saldo bancario en libros).
* **HABER:** Cuenta Transitoria de Compensación (se liquida a cero la cuenta temporal).
* *(Opcional)* **DEBE:** Cuenta de Gastos Financieros / Comisiones Bancarias (por los cargos deducidos por el banco o la pasarela adquirente).

```
FLUJO CONTABLE EN DOS PASOS:

[ FACTURA A/R CLIENTE ] ──> Saldo Pendiente: $1.000
           │
           ▼
[ PASO 1: RECIBO DE COBRO ]
   DEBE:  110801 - Cheques en Cartera (Transitoria)    $1.000
   HABER: 110501 - Cta. Asociada Clientes (C20000)     $1.000 (Factura Cerrada)
           │
           ▼ (Traslado de los cheques al banco)
[ PASO 2: DEPÓSITO BANCARIO ]
   DEBE:  110101 - Banco Santander Cuenta Corriente    $1.000
   HABER: 110801 - Cheques en Cartera (Transitoria)    $1.000 (Cuenta Compensada en $0)
```

> [!TIP]
> **Excepción Operativa: Transferencia Bancaria Directa:**  
> Los cobros o pagos realizados por transferencia electrónica no requieren el paso de depósito bancario. Dado que la operación viaja de cuenta a cuenta en tiempo real, el sistema debita o acredita de forma directa la cuenta de Banco Propio en un solo paso.

---

## LECCIÓN 10.3: EL ASISTENTE DE PAGOS MASIVOS Y RECONCILIACIÓN BANCARIA EXTERNA E INTERNA

### 1. El Asistente de Pagos (Payment Wizard)

El Asistente de Pagos es una consola transaccional diseñada para optimizar los ciclos de cuentas por pagar y cobros recurrentes. Su objetivo es eliminar el registro individual y manual de egresos mediante la dispersión automatizada de cientos de transferencias o cheques en una única corrida operativa.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              FLUJO DE 6 ETAPAS DEL ASISTENTE DE PAGOS (PAYMENT WIZARD)      │
├─────────────────────────────────────────────────────────────────────────────┤
│ [1. Parámetros Generales]                                                   │
│      └── Nombre de la ejecución, fecha de proceso y selección: Cobro o Pago │
│ [2. Filtro de Interlocutores Comerciales]                                   │
│      └── Rango de códigos de proveedor, grupos o prioridades                │
│ [3. Filtro de Documentos]                                                   │
│      └── Vencimientos, cálculo de descuentos por pronto pago y tolerancias  │
│ [4. Métodos de Pago]                                                        │
│      └── Selección de vías activas (Cheque / Transferencia) y Banco Propio  │
│ [5. Informe de Recomendación (Payment Proposal)]                             │
│      └── Grilla interactiva: Selección, exclusión o ajuste manual de montos │
│ [6. Ejecución y Generación de Archivo Electrónico]                          │
│      └── Asientos contables automáticos + Generación de archivo bancario    │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Parámetros Críticos y Funciones Avanzadas:
* **Aprovechamiento de Descuentos por Pronto Pago:** En la Etapa 3, el asistente audita los términos de pago de las facturas abiertas. Si una factura califica para un descuento financiero (ej. 5% de descuento por pagar antes del día 15), el sistema sugiere el pago neto, contabilizando la deducción en la cuenta de ingresos por pronto pago.
* **Transacciones No Incluidas:** En la Etapa 5, el botón *Transacciones no incluidas* es el radar de diagnóstico obligatorio para el consultor. Detalla la causa exacta por la cual una factura vencida fue omitida (ej. Interlocutor comercial bloqueado para pagos, falta de cuenta bancaria asignada, factura en litigio o método de pago inactivo).
* **Orden de Pago (*Payment Order Run*):**
  * Modalidad avanzada donde el asistente procesa el lote y genera el archivo bancario plano (TXT o XML) para cargarlo en el portal web del banco emisor, **sin generar asientos contables de inmediato**.
  * Las facturas permanecen abiertas pero reservadas con un candado técnico. Los asientos de pago se disparan únicamente cuando el banco confirma formalmente el débito de los fondos, evitando reversiones contables masivas en caso de rechazos operativos.

---

### 2. Conciliación Bancaria: Reconciliación Externa vs. Interna

Uno de los errores conceptuales más frecuentes en la operación de SAP Business One es confundir la Reconciliación Externa con la Reconciliación Interna. Ambos procesos tienen objetivos y naturalezas completamente distintas:

| Parámetro | Reconciliación Externa | Reconciliación Interna |
| :--- | :--- | :--- |
| **Propósito Principal** | Verificar la exactitud del saldo contable frente a la realidad del extracto bancario oficial. | Emparejar y compensar partidas abiertas deudoras y acreedoras dentro del sistema. |
| **Cuentas Involucradas** | Cuenta de mayor del **Banco Propio** vs. el **Extracto Bancario** (*Bank Statement*). | La misma cuenta contable (ej. cuentas puente) o la ficha de un **Interlocutor Comercial**. |
| **Entidades Cruzadas** | Registros internos del ERP contra líneas del documento externo emitido por el banco. | Facturas con sus recibos de cobro, notas de crédito o devoluciones de mercancía. |
| **Consecuencia Operativa**| Detecta partidas en tránsito, cheques no cobrados, comisiones no contabilizadas o fraudes. | Limpia las facturas abiertas del estado de cuenta del cliente/proveedor; deja saldo cero en partidas saldadas. |
| **Mecanismo en SAP** | `Gestión de bancos > Reconciliación externa`. | `Finanzas > Reconciliación interna` o compensación automática al aplicar pagos. |

```
                    ┌──────────────────────────────────────┐
                    │ RECONCILIACIÓN EN SAP BUSINESS ONE   │
                    └──────────────────┬───────────────────┘
                                       │
           ┌───────────────────────────┴───────────────────────────┐
           ▼                                                       ▼
┌──────────────────────────────────────┐┌──────────────────────────────────────┐
│        RECONCILIACIÓN EXTERNA        ││        RECONCILIACIÓN INTERNA        │
│ • Libro Mayor de Banco en SAP        ││ • Factura de Proveedor A/P ($1.000)  │
│              VS.                     ││                  VS.                 │
│ • Extracto Oficial de la Entidad     ││ • Pago Efectuado Registrado ($1.000) │
│ ➔ Resultado: Control de Liquidez Real││ ➔ Resultado: Cierre de Partida Abierta│
└──────────────────────────────────────┘└──────────────────────────────────────┘
```

---

## LECCIÓN 10.4: SUBMÓDULO DE ACTIVOS FIJOS: CAPITALIZACIÓN, DEPRECIACIÓN Y RETIRO

> [!CAUTION]
> **Requisito Mandatorio de Activación:**  
> El submódulo de Activos Fijos nativo se habilita en:  
> `Gestión > Inicialización sistema > Detalles sociedad > Inicialización básica > Habilitar activos fijos`.  
> **Esta activación es irreversible.** Una vez tildada la casilla y guardados los cambios, la base de datos no puede revertirse a la condición anterior.

---

### 1. El Cuarteto de Definición del Activo Fijo

Para gestionar un activo fijo en SAP Business One se debe configurar una arquitectura de cuatro elementos interrelacionados:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LOS 4 PILARES DEL ACTIVO FIJO EN SAP                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. ÁREA DE DEPRECIACIÓN:                                                    │
│    Define el marco normativo de valuación (ej. IFRS/Local con impacto       │
│    en el libro mayor vs. Área Fiscal/Tributaria de carácter informativo).   │
│                                                                             │
│ 2. DETERMINACIÓN DE CUENTAS:                                                │
│    Asigna el paquete de cuentas contables: Costo Histórico (APC),           │
│    Depreciación Acumulada, Gasto de Depreciación y Resultado por Venta/Baja.│
│                                                                             │
│ 3. TIPO DE DEPRECIACIÓN:                                                    │
│    Define el algoritmo matemático (Lineal, Degresiva, Especial), la vida    │
│    útil (meses/días) y la base de cálculo de valor residual.                │
│                                                                             │
│ 4. CLASE DE ACTIVO (ASSET CLASS):                                           │
│    Plantilla maestra que integra los 3 elementos previos. Al asociar una    │
│    clase a un artículo tipo Activo Fijo, este hereda todas sus propiedades. │
└─────────────────────────────────────────────────────────────────────────────┘
```

* **Áreas de Depreciación (*Depreciation Areas*):** Permiten mantener valoraciones paralelas. Por ejemplo, una máquina puede depreciarse en 5 años bajo normativa tributaria local (Área Fiscal Informativa, que no genera asientos) y en 10 años con valor residual bajo normas IFRS (Área Contable Principal, que impacta el Libro Mayor).
* **Clase de Activo (*Asset Class*):** Categoriza los bienes de la empresa (ej. *Maquinaria Pesada*, *Mobiliario y Enseres*, *Vehículos de Flota*, *Equipos de Cómputo*). Evita que el usuario de compras deba seleccionar manualmente cuentas contables o vidas útiles al adquirir un activo.

---

### 2. El Ciclo de Vida Operativo del Activo Fijo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 CICLO DE VIDA DEL ACTIVO FIJO EN EL ERP                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ [1. CAPITALIZACIÓN]                                                         │
│      └── Factura de Proveedores (A/P) o Capitalización Directa (APC)        │
│ [2. DEPRECIACIÓN MENSUAL]                                                   │
│      └── Ejecución masiva (Depreciation Run) en orden cronológico estricto  │
│ [3. AJUSTES Y EVENTOS]                                                      │
│      └── Revalorización patrimonial, traslados o amortización extraordinaria│
│ [4. RETIRO O BAJA]                                                          │
│      └── Retiro por Venta (Factura A/R) o Retiro por Desguace (Scrapping)   │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### A. Capitalización (Adquisición)
* **Vía Factura de Proveedores (A/P):** El activo se adquiere seleccionando su código maestro en la factura de compras. El sistema debita automáticamente la cuenta de Balance de Activo Fijo (APC - *Acquisition and Production Cost*) en lugar de una cuenta de inventario corriente o gasto.
* **Vía Capitalización Directa:** Se utiliza para activos fabricados por la propia compañía, compras acumuladas en obras en proceso o aportes de capital de socios.

#### B. Ejecución de Depreciación (Depreciation Run)
La depreciación no se registra activo por activo; se procesa mediante una corrida masiva mensual en: `Finanzas > Activos fijos > Ejecución de depreciación`.

**Fórmula de Depreciación Lineal Estándar (*Straight Line*):**
$$\text{Depreciación Mensual} = \frac{\text{Costo de Adquisición (APC)} - \text{Valor Residual}}{\text{Vida Útil Total en Meses}}$$

**Asiento Contable Automático de la Corrida:**
* **DEBE:** Gasto por Depreciación de Activos Fijos (Pérdidas y Ganancias - Cajón 6).
* **HABER:** Depreciación Acumulada del Activo (Activo Complementario de Balance - Cajón 1, saldo acreedor que rebaja el valor del bien).

#### C. Retiro o Baja del Activo Fijo
Existen dos vías operativas para desincorporar un bien del patrimonio corporativo:

1. **Retiro por Venta a Terceros (Vía Factura de Clientes A/R):**
   * Al emitir una Factura de Clientes seleccionando el activo fijo, SAP Business One dispara automáticamente un documento de **Retiro**.
   * El sistema calcula el **Valor Neto en Libros (*Net Book Value - NBV*)**:
     $$\text{NBV} = \text{Costo Histórico (APC)} - \text{Depreciación Acumulada al Día de la Venta}$$
   * Cancela el costo original del activo en el HABER, liquida a cero la depreciación acumulada en el DEBE, reconoce el ingreso por cobrar del cliente y envía la diferencia a una cuenta de **Ganancia o Pérdida en Venta de Activos**.

2. **Retiro por Desguace (*Scrapping*):**
   * Se utiliza cuando el bien sufre daño total, robo, siniestro u obsolescencia tecnológica sin valor de reventa comercial.
   * Se procesa desde: `Finanzas > Activos fijos > Retiro`.
   * El sistema extingue el activo y envía el 100% de su Valor Neto en Libros residual como **Pérdida por Desincorporación de Activos Fijos** en el Estado de Resultados.

---

## MATRIZ DE TROUBLESHOOTING Y REGLAS CRÍTICAS PARA EL COPILOTO IA

### Problema 1: "El usuario intenta ingresar un asiento manual directamente contra la cuenta de Proveedores y SAP emite: 'La cuenta es una cuenta asociada'"
* **Causa Raíz:** La cuenta contable de mayor seleccionada está clasificada como *Cuenta asociada* en el Plan de Cuentas (`Finanzas > Plan de cuentas`). El motor contable de SAP bloquea imputaciones directas para evitar desalineaciones con los auxiliares.
* **Instrucción de Asesoría del Copiloto IA:**
  1. Explique didácticamente al usuario que una cuenta asociada consolida los saldos de los Interlocutores Comerciales y no admite registros directos huérfanos de socio de negocio.
  2. Indique que, en el formulario de **Asiento**, debe utilizar la columna **Código de IC** (presionando `TAB` para seleccionar el código del Proveedor o Cliente) en lugar de la columna *Cuenta de mayor*.
  3. Al seleccionar el Interlocutor Comercial, SAP acreditará o debitará su cuenta asociada correspondiente de forma automática, manteniendo intacta la cuadratura entre el Balance General y el reporte de Antigüedad de Saldos.

---

### Problema 2: "Al ejecutar el Asistente de Pagos no aparece una factura vencida que debería pagarse hoy"
* **Causa Raíz:** Existen cuatro motivos principales: (a) La factura se encuentra reservada en una corrida del Asistente de Pagos previa guardada en estado *Borrador/Guardado*; (b) La factura o el proveedor no tienen asignada una vía de pago activa para el banco propio emisor; (c) El documento está marcado como "Bloqueado para pagos"; o (d) El saldo de la factura no supera el importe mínimo de pago configurado.
* **Instrucción de Asesoría del Copiloto IA:**
  1. En el Paso 5 del Asistente de Pagos (*Informe de recomendación*), guíe al usuario para presionar el botón **Transacciones no incluidas**. Revise la columna de motivo de exclusión.
  2. Diríjase a `Gestión de bancos > Asistente de pagos`, seleccione la opción *Cargar ejecución de pago guardada* y compruebe si existe una corrida preliminar. Si existe, elimine la corrida borrador para liberar los documentos reservados.
  3. Verifique en los Datos Maestros del Proveedor (`Pestaña Ejecución de pago`) que la casilla de la vía de pago utilizada (ej. Transferencia Santander) esté tildada como activa y definida por defecto.

---

### Problema 3: "La ejecución de depreciación de activos fijos rechaza el procesamiento del mes actual"
* **Causa Raíz:** (a) El período contable correspondiente al mes que se desea procesar está con estatus *Bloqueado* o *Cierre del período*; o (b) Existe una discontinuidad cronológica: no se ha ejecutado la depreciación de uno o más meses calendario anteriores del ejercicio fiscal.
* **Instrucción de Asesoría del Copiloto IA:**
  1. Vaya a `Gestión > Inicialización sistema > Períodos contables`. Localice el subperíodo mensual correspondiente y confirme que su estatus sea **Activo**. Si está bloqueado, solicite al Administrador de Finanzas habilitarlo temporalmente.
  2. En `Finanzas > Activos fijos > Ejecución de depreciación`, revise el historial de ejecuciones. SAP Business One impone un orden cronológico estricto: no es posible calcular la depreciación de octubre si septiembre no ha sido procesado formalmente en el sistema. Ejecute los meses pendientes en secuencia.

---

### Problema 4: "Diferencia no conciliada en la reconciliación bancaria externa tras registrar un depósito de cheques"
* **Causa Raíz:** El usuario intentó realizar una reconciliación externa contra la cuenta transitoria de compensación (*Cheques en Cartera*) en lugar de la cuenta contable de *Banco Propio*, o se omitieron cargos por comisiones bancarias durante el depósito.
* **Instrucción de Asesoría del Copiloto IA:**
  1. Verifique en `Gestión de bancos > Reconciliación externa > Reconciliación` que la cuenta seleccionada en pantalla corresponda exactamente a la cuenta de mayor asociada al banco propio en el extracto, y no a una cuenta transitoria del cajón 1.
  2. Compruebe si el extracto bancario refleja un valor menor al depositado debido a impuestos o comisiones de remesa. De ser así, guíe al usuario para registrar la diferencia contra la cuenta de gastos financieros en la pestaña *Gastos* de la boleta de depósito.

---

## BANCO DE EVALUACIÓN SITUACIONAL

### Pregunta 1 (Gobernanza Contable y Libros Auxiliares)
Una compañía comercializadora cuenta con más de 2.500 clientes activos en su base de datos. El Director de Contabilidad solicita al equipo de sistemas que cree 2.500 cuentas contables individuales dentro del Cajón 1 del Plan de Cuentas para poder visualizar el saldo de cada cliente directamente al emitir el Balance de Comprobación. Como consultor experto de SAP Business One, ¿cuál es el dictamen profesional y la justificación técnica que debes entregar?

* A) Debe procederse de inmediato con la creación de las cuentas, ya que es la única forma en que las facturas de venta reconozcan a los clientes en el libro diario.
* B) Es una práctica inviable en SAP Business One; los clientes residen en el Libro Auxiliar (*Subledger*) y se consolidan en el Balance mediante Cuentas Asociadas (*Control Accounts*), las cuales mantienen la integridad contable y evitan la degradación del Plan de Cuentas. **[CORRECTA]**
* C) La solicitud debe implementarse creando las cuentas en el Cajón 4 (Ingresos) en lugar del Cajón 1, para que no afecten el Balance General.
* D) Solo se permite crear cuentas individuales para clientes corporativos si la sociedad utiliza la Determinación Avanzada de Cuentas.
* **Explicación Didáctica:** La opción B es la correcta. La arquitectura de SAP Business One separa rígidamente el Libro Mayor (*General Ledger*) del Libro Auxiliar (*Subledger*). Los clientes y proveedores son Interlocutores Comerciales identificados por códigos alfanuméricos en tablas maestras (`OCRD`). En el Plan de Cuentas solo se configuran cuentas asociadas colectivas. El detalle individual por cliente se audita a través del reporte de *Antigüedad de Saldos de Clientes*, el cual cuadra matemáticamente con la cuenta asociada sin necesidad de sobrecargar el árbol de cuentas.

---

### Pregunta 2 (Gestión Patrimonial y Retiro de Activos Fijos)
Una empresa de logística adquirió un camión de carga por un Costo Histórico de Adquisición (APC) de $40.000, fijando una vida útil de 40 meses sin valor residual. Tras 30 meses de operación y depreciación lineal regular acumulada por $30.000, la dirección decide vender el vehículo a otra empresa por un precio pactado de $14.000 antes de impuestos. El asistente contable emite una Factura de Clientes (A/R) seleccionando el artículo de Activo Fijo. ¿Cuál es el impacto financiero y contable automático que generará SAP Business One?

* A) Registra un ingreso ordinario por ventas de $14.000 en el Cajón 4 y mantiene el camión en el activo con su depreciación acumulada hasta el cierre del año.
* B) El sistema bloquea la factura porque las ventas de activos solo pueden efectuarse mediante un asiento de diario manual supervisado.
* C) Calcula un Valor Neto en Libros (NBV) de $10.000, da de baja el costo histórico ($40.000), extingue la depreciación acumulada ($30.000) y reconoce una Ganancia en Venta de Activos de $4.000 en los resultados del ejercicio. **[CORRECTA]**
* D) Envía los $14.000 íntegros a una cuenta de Desguace (*Scrapping*) en el Cajón 8 y da de baja el vehículo con pérdida neta.
* **Explicación Didáctica:** La opción C es la correcta. Al procesar una Factura A/R vinculada a un activo fijo, SAP Business One genera automáticamente un documento de Retiro. En este cálculo:
  $$\text{Valor Neto en Libros (NBV)} = \text{APC ($40.000)} - \text{Depreciación Acumulada ($30.000)} = \$10.000$$
  Dado que el precio de venta pactado es de $14.000, el sistema registra:
  $$\text{Resultado en Venta de Activos} = \text{Precio de Venta ($14.000)} - \text{NBV ($10.000)} = +\$4.000\text{ (Utilidad en Venta de Activos)}$$
  Simultáneamente, el activo queda completamente inactivo y con valor cero en el balance patrimonial.

---

### Pregunta 3 (Control de Tesorería y Cuentas de Compensación)
El cajero de una distribuidora minorista recibe cobros diarios de clientes mediante cheques cruzados y cupones de tarjeta de crédito. El tesorero de la empresa exige que estos cobros no impacten de inmediato el saldo disponible de la cuenta de Banco Propio en el sistema contable hasta que los fondos hayan sido liquidados formalmente por la entidad financiera. ¿Qué diseño funcional de SAP Business One garantiza este requerimiento de control interno?

* A) Desactivar el módulo de cobros e instruir que las facturas queden abiertas indefinidamente hasta que el extracto bancario llegue al final del mes.
* B) Implementar el Flujo en Dos Pasos: los pagos recibidos se debitan contra Cuentas de Compensación transitorias (*Cheques en Cartera* o *Tarjetas por Cobrar*) y solo se transfieren a la cuenta de Banco Propio al registrar el documento formal de Depósito Bancario. **[CORRECTA]**
* C) Registrar los cobros como órdenes de venta preliminares y confirmarlas únicamente cuando el dinero figure en la cuenta corriente.
* D) Realizar los cobros exclusivamente mediante el Asistente de Pagos en modalidad de Transferencia Bancaria Directa.
* **Explicación Didáctica:** La opción B es la correcta. El flujo en dos pasos de SAP Business One está diseñado específicamente para salvaguardar el principio de liquidez real. En el Paso 1 (Pago Recibido), se salda la cuenta por cobrar del cliente y se carga una cuenta transitoria de custodia (*Clearing Account*). En el Paso 2 (Depósito Bancario), se traslada el valor a la cuenta de Banco Propio y se descarga la cuenta transitoria, permitiendo auditar en todo momento los valores en tránsito que aún no son fondos disponibles.

---

### Pregunta 4 (Dispersión Masiva y Asistente de Pagos)
Una corporación multinacional programa pagar los viernes más de 400 facturas a proveedores mediante transferencias electrónicas a través del Asistente de Pagos (*Payment Wizard*). Sin embargo, la gerencia de tesorería teme que si el portal bancario rechaza la transmisión de algunas transferencias por inconsistencias en los códigos de cuenta del banco, el ERP quede desfasado con pagos registrados contablemente que nunca salieron del banco. ¿Qué funcionalidad avanzada de SAP Business One resuelve esta contingencia operativa?

* A) Marcar todas las facturas como pagadas manualmente y reconciliarlas internamente una por una.
* B) Ejecutar el Asistente de Pagos bajo la opción de Orden de Pago (*Payment Order Run*), lo cual genera el archivo electrónico bancario para su envío sin crear asientos contables de inmediato, difiriendo la contabilización hasta la confirmación de débito del banco. **[CORRECTA]**
* C) Dividir el pago masivo en 400 ejecuciones individuales del asistente para detectar los fallos uno a uno.
* D) Activar la casilla de Reconciliación Externa en el Paso 2 del Asistente de Pagos.
* **Explicación Didáctica:** La opción B es la correcta. La *Orden de Pago (Payment Order Run)* permite crear el archivo de dispersión bancaria para transmitirlo a la plataforma de banca en línea sin generar los asientos de pago definitivo ni cerrar contablemente las facturas. Los documentos quedan temporalmente bloqueados contra pagos duplicados. Una vez que el extracto o la confirmación de transferencias exitosas es devuelta por el banco, se autoriza la ejecución contable final, evitando asientos de reversión por transferencias rechazadas.

---

### Pregunta 5 (Determinación Contable Avanzada en Escenarios Complejos)
Una compañía vende repuestos industriales. Cuando un repuesto es despachado desde el Almacén Principal de la Casa Matriz a un cliente local, la venta debe contabilizarse en la cuenta *410101 - Ventas Nacionales*. No obstante, cuando el mismo repuesto es despachado desde una Sucursal Fronteriza y el cliente pertenece al grupo *Clientes Zona Franca*, la ley exige que el ingreso se registre en la cuenta *410199 - Ventas Exentas de Régimen Especial*. Si la empresa utilizara únicamente la Determinación Tradicional de Cuentas, ¿con qué limitación se encontraría y cómo se resuelve en SAP Business One 10.0?

* A) La Determinación Tradicional no puede evaluar simultáneamente el Almacén y el Grupo de Interlocutor Comercial; la limitación se resuelve activando la Determinación Avanzada de Cuentas de Mayor y configurando una regla matricial con ambas prioridades. **[CORRECTA]**
* B) Debe crearse un código de artículo duplicado en el maestro para cada combinación posible de almacén y cliente.
* C) La Determinación Tradicional resuelve el caso sin problemas configurando el Grupo de Artículos.
* D) El usuario de facturación debe seleccionar manualmente la cuenta contable en cada línea de la factura de clientes antes de crearla.
* **Explicación Didáctica:** La opción A es la correcta. En la determinación tradicional, el sistema exige elegir un único criterio de fijación de cuentas (por Almacén, por Grupo de Artículos o por Artículo), haciendo imposible cruzar condiciones mixtas entre el almacén logístico de despacho y la tipología fiscal del cliente. La Determinación Avanzada de Cuentas de Mayor permite estructurar reglas basadas en matrices multidimensionales (Almacén + Grupo de IC + Territorio + Código de Artículo), garantizando la correcta imputación automática sin necesidad de duplicar artículos maestros ni exigir digitación manual al usuario.

---
