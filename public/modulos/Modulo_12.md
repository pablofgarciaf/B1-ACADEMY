# MÓDULO 12: METODOLOGÍA DE IMPLEMENTACIÓN (AIP), PARAMETRIZACIONES IRREVERSIBLES Y QUICK COPY
**(SAP BUSINESS ONE 10.0 & ERP)**

**Tipo de Contenido:** Base de Conocimiento Operativa y Guía de Entrenamiento para Copiloto IA  
**Fuentes Oficiales Analizadas:** 10_Impl_21_ImplTools_ImplementationMethodology_ES.pdf, 10_Impl_23_ImplTools_Key_Settings_ES.pdf y 10_Impl_26_ImplTools_QuickCopy.pdf  
**Nivel:** Avanzado / Dirección de Proyectos de TI, Consultoría de Preventa, Cutover y Migración de Configuraciones  
**Tiempo Estimado de Estudio:** 65 minutos (dividido en 4 lecciones integradas)

---

## Resumen Ejecutivo

La implementación exitosa de SAP Business One 10.0 trasciende la mera instalación de un software; constituye un proceso estructurado de transformación operativa y financiera. Este módulo aborda en profundidad la metodología oficial **AIP (Accelerated Implementation Program)** de SAP, detallando las cinco fases que mitigan los riesgos de desviación de alcance (*scope creep*) y garantizan la alineación estratégica del negocio. Asimismo, analiza con rigor las **parametrizaciones estructurales e irreversibles** del sistema (como la moneda local/sistema, el inventario permanente y la gestión de costes por almacén), cuyas implicaciones en la base de datos exigen una formalización ejecutiva ineludible previa al primer registro contable. Finalmente, se domina la herramienta **Quick Copy** para la migración ágil y consistente de configuraciones entre ambientes (*Test* a *Producción*), junto con la planificación cronológica y secuencial de un **Cutover** milimétrico que asegura la continuidad operativa y el cuadre contable íntegro desde el primer minuto del *Go-Live*.

---

## ÍNDICE DEL MÓDULO

1. [Lección 12.1: Las 5 Fases de la Metodología de Implementación Acelerada (AIP)](#lección-121-las-5-fases-de-la-metodología-de-implementación-acelerada-aip)
2. [Lección 12.2: Parametrizaciones Clave e Irreversibles del Sistema (Decisiones Críticas de Arranque)](#lección-122-parametrizaciones-clave-e-irreversibles-del-sistema-decisiones-críticas-de-arranque)
3. [Lección 12.3: La Herramienta Quick Copy: Migración de Configuraciones entre Empresas (*.qdf)](#lección-123-la-herramienta-quick-copy-migración-de-configuraciones-entre-empresas-qdf)
4. [Lección 12.4: Gestión de Ambientes (Demo, Test, Training y Producción) y Plan de Cutover](#lección-124-gestión-de-ambientes-demo-test-training-y-producción-y-plan-de-cutover)
5. [Matriz de Troubleshooting y Reglas Críticas para el Copiloto IA](#matriz-de-troubleshooting-y-reglas-críticas-para-el-copiloto-ia)
6. [Banco de Evaluación Situacional](#banco-de-evaluación-situacional)
7. [Guiones Humanizados para Locución IA (ElevenLabs)](#guiones-humanizados-para-locución-ia-elevenlabs)

---

## LECCIÓN 12.1: LAS 5 FASES DE LA METODOLOGÍA DE IMPLEMENTACIÓN ACELERADA (AIP)

### 1. El Porqué de una Metodología Estructurada en Proyectos ERP
Un proyecto de implementación de ERP no es un esfuerzo tecnológico aislado de TI; es una reingeniería de los procesos de negocio de la compañía. Sin un marco de trabajo riguroso, los proyectos enfrentan riesgos críticos: desbordamiento del presupuesto, retrasos en el cronograma y resistencia al cambio por parte de los usuarios.

La metodología oficial **Accelerated Implementation Program (AIP)** de SAP fue diseñada específicamente para optimizar los tiempos de despliegue en pequeñas y medianas empresas, garantizando entregables claros, hitos de control (*Milestones*) y puntos formales de aprobación contractual que blindan la relación entre el Partner implementador y el Cliente.

```
[ FASE 1: PREPARACIÓN ]
         │  ──> Acta de constitución, kick-off, aprovisionamiento y plan de trabajo
         ▼
[ FASE 2: BLUEPRINT ]
         │  ──> Levantamiento de procesos (As-Is vs. To-Be), gaps y diseño conceptual
         ▼
[ FASE 3: REALIZACIÓN ]
         │  ──> Parametrización en ambiente TEST, layouts Crystal, FMS, perfiles y DTW piloto
         ▼
[ FASE 4: PREPARACIÓN FINAL ]
         │  ──> Capacitación a usuarios finales, pruebas UAT, congelamiento y CUTOVER
         ▼
[ FASE 5: GO-LIVE Y SOPORTE ]
            ──> Salida en vivo oficial, soporte presencial en piso y pase a mantenimiento
```

---

### 2. Matriz de Fases, Entregables e Hitos de Cierre (Milestones)

| Fase AIP | Objetivo Estratégico | Entregables Principales | Hito de Cierre (*Milestone*) |
| :--- | :--- | :--- | :--- |
| **1. Preparación del Proyecto** | Alinear expectativas, definir el alcance contractual, estructurar el equipo de trabajo y aprovisionar la infraestructura inicial. | • Acta de Constitución del Proyecto (*Project Charter*).<br>• Cronograma de trabajo detallado y matriz de gobernanza (RACI).<br>• Entornos de servidores (físicos o nube) e instalación de bases iniciales. | **Reunión de Kick-Off Formal Aprobada** y firma del acta de inicio por ambas partes. |
| **2. Business Blueprint (Diseño Conceptual)** | Comprender los requerimientos de negocio de la empresa y mapear cómo operarán en el estándar de SAP Business One. | • Documento de *Business Blueprint* detallado.<br>• Análisis de Brechas (*Gap Analysis*) y definición de personalizaciones/Add-ons.<br>• Matriz de requerimientos por área funcional (Finanzas, Compras, Ventas, Inventario). | **Firma de Aceptación del Blueprint** por el comité directivo (congelamiento de alcance). |
| **3. Realización** | Construir, parametrizar e integrar la solución completa en un ambiente controlado de pruebas. | • Base de datos TEST parametrizada al 100%.<br>• Formatos de impresión oficiales en Crystal Reports.<br>• Búsquedas Formateadas (FMS), campos de usuario (UDF) y flujos de aprobación.<br>• Cargas preliminares de datos con DTW para pruebas piloto. | **Aprobación de la Configuración** por los líderes de área (*Key Users*) tras pruebas unitarias. |
| **4. Preparación Final** | Garantizar que los usuarios estén capacitados, el sistema probado integralmente y los datos listos para migrar. | • Pruebas de Aceptación de Usuario (*UAT - User Acceptance Testing*).<br>• Manuales de usuario y sesiones de capacitación completadas.<br>• Simulacro de migración de datos.<br>• Plan detallado de Cutover hora por hora. | **Decisión Ejecutiva Go / No-Go** y autorización de paso a producción firmada. |
| **5. Go-Live y Soporte** | Realizar el encendido operativo del sistema productivo, estabilizar la operación y transferir al soporte continuo. | • Base de producción operando en vivo.<br>• Soporte presencial de piso (*Floor Support*) durante las primeras semanas.<br>• Acompañamiento en el primer cierre contable mensual.<br>• Entrega de documentación técnica final. | **Acta de Cierre de Proyecto** y pase formal al área de Soporte Técnico (Niveles N1/N2). |

---

### 3. Roles Clave y Gobernanza del Proyecto
* **Comité Directivo (*Steering Committee*):** Máxima instancia decisoria (Patrocinador Ejecutivo, Director Financiero y Gerente de Cuenta del Partner). Resuelve discrepancias de alcance, aprueba cambios presupuestarios y emite el dictamen *Go / No-Go*.
* **Gerentes de Proyecto (PM Partner & PM Cliente):** Custodios del cronograma, asignación de recursos, gestión de riesgos y seguimiento riguroso de los hitos de AIP.
* **Superusuarios (*Key Users*):** Expertos funcionales de cada departamento del cliente. Participan en el diseño del Blueprint, validan las pruebas de realización y son los responsables directos de capacitar a los usuarios finales de su área.

---

## LECCIÓN 12.2: PARAMETRIZACIONES CLAVE E IRREVERSIBLES DEL SISTEMA (DECISIONES CRÍTICAS DE ARRANQUE)

### 1. El Porqué de la Irreversibilidad en la Base de Datos
En SAP Business One, la integridad de los datos financieros y logísticos es inviolable. Por diseño de motor relacional y cumplimiento de normativas de auditoría internacional (NIIF/IFRS, GAAP y leyes fiscales locales), ciertas decisiones de parametrización determinan la estructura de las tablas centrales (`OACT`, `OITM`, `OITW`, `OINM`, `OJDT`). 

Una vez que se genera el **primer asiento contable** o el **primer movimiento de mercancías**, los campos de configuración en la tabla de administración del sistema (`OADM`) quedan bloqueados a nivel de motor de datos y código de la aplicación. Revertirlos de forma manual mediante consultas SQL directas está estrictamente prohibido por SAP (Nota SAP 896891), ya que anula la garantía del soporte y causa corrupción irreversible en los libros mayores.

---

### 2. Matriz de Parametrizaciones Irreversibles del Sistema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ MATRIZ DE DECISIONES CRÍTICAS DE ARRANQUE (BLOQUEO PERMANENTE)              │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. MONEDA LOCAL Y MONEDA DEL SISTEMA (Detalles Sociedad):                    │
│    Inmodificables tras el primer asiento contable en el libro mayor.        │
│                                                                             │
│ 2. UTILIZAR SISTEMA DE INVENTARIO PERMANENTE (Inicialización Básica):       │
│    Inactivable una vez asentado el primer movimiento de inventario.         │
│                                                                             │
│ 3. GESTIONAR COSTES DE ARTÍCULO POR ALMACÉN (Inicialización Básica):        │
│    Fija de forma permanente si el coste se calcula por bodega o general.    │
│                                                                             │
│ 4. HABILITAR ACTIVOS FIJOS (Inicialización Básica):                         │
│    Bloqueo definitivo de la casilla al activarse; crea tablas fijas.        │
│                                                                             │
│ 5. PERMITIR MÁS DE UN TIPO DE DOCUMENTO POR SERIE (Inicialización Básica):  │
│    Bloqueo irreversible de la opción tras crearse transacciones.            │
│                                                                             │
│ 6. PROGRAMACIÓN MÚLTIPLE EN LLAMADAS DE SERVICIO (Param. de Documento):     │
│    Altera la estructura de la interfaz técnica de visitas permanentemente.  │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Análisis Detallado de Cada Configuración:

1. **Moneda Local y Moneda del Sistema (`Gestión > Inicialización sistema > Detalles sociedad`):**
   * *Función:* La Moneda Local es la divisa legal del país donde opera la sociedad; la Moneda del Sistema es la divisa paralela utilizada para reportes de consolidación corporativa (típicamente USD o EUR).
   * *Impacto Financiero:* Cada transacción en SAP B1 guarda internamente los montos en moneda local, moneda del sistema y moneda extranjera. Modificar alguna de las dos generaría una inconsistencia histórica insalvable en los saldos acumulados de balance.
2. **Utilizar Sistema de Inventario Permanente (`Detalles sociedad > Ficha Inicialización básica`):**
   * *Función:* Determina si cada movimiento logístico (entradas, entregas, facturas de clientes con entrega, devoluciones) genera automáticamente un asiento contable en tiempo real afectando las cuentas de existencias, variación y coste de mercancías vendidas (CMV).
   * *Impacto Operativo:* Si no se utiliza, el inventario se gestiona de forma periódica por conteos manuales. Una vez activado y transaccionado, no puede desmarcarse jamás, ya que rompería la trazabilidad de la auditoría contable.
3. **Gestionar Costes de Artículo por Almacén (`Detalles sociedad > Ficha Inicialización básica`):**
   * *Función:* Define si el coste unitario del producto (Promedio Ponderado, FIFO o Estándar) se calcula de manera unificada a nivel de toda la empresa (`OITM.AvgPrice`) o de forma individualizada para cada almacén (`OITW.AvgPrice`).
   * *Impacto en Costos:* Vital para empresas con sucursales distantes que incurren en fletes dispares. Cambiar esta definición después del arranque requeriría recalcular el historial de capas de stock en todas las bodegas, operación no permitida por el motor de SAP.
4. **Habilitar Activos Fijos (`Detalles sociedad > Ficha Inicialización básica`):**
   * *Función:* Habilita el submódulo integral de Activos Fijos nativo de SAP Business One (gestión de vida útil, áreas de amortización y corrida automática de depreciaciones contables).
   * *Impacto Técnico:* Una vez marcada y grabada la configuración, la casilla queda inhabilitada de forma irreversible para proteger la coherencia de los subledgers contables.
5. **Permitir Más de un Tipo de Documento por Serie (`Detalles sociedad > Ficha Inicialización básica`):**
   * *Función:* Permite compartir una misma serie numérica de folios entre múltiples tipos de comprobantes fiscales (por ejemplo, numerar correlativamente Facturas y Notas de Crédito bajo una misma serie legal).
   * *Impacto Fiscal:* En muchos países con facturación electrónica estricta, esta opción debe analizarse minuciosamente antes del encendido para evitar el rechazo de folios por la autoridad tributaria.
6. **Programación Múltiple en Servicio (`Gestión > Inicialización sistema > Parametrizaciones de documento > Pestaña Por documento > Llamada de servicio`):**
   * *Función:* Convierte la pestaña de resolución técnica de la llamada de servicio de un formato de asignación simple a una grilla multidimensional de múltiples técnicos, fechas y duraciones.
   * *Impacto Operativo:* No admite reversión tras ser activada debido al cambio de estructura en las tablas subyacentes.

> [!WARNING]
> **Protocolo de Consultoría Obligatorio:** Antes de crear el primer registro en la base de datos de Producción, el Consultor Líder debe emitir un **Acta de Parametrizaciones Irreversibles**, la cual debe ser firmada formalmente por el Director Financiero (CFO) y el Contador General del cliente. Nunca proceda sin este respaldo documental.

---

### 3. La Directriz de Oro sobre Stock Negativo
En `Gestión > Inicialización sistema > Parametrizaciones de documento > Ficha General`, SAP permite configurar la respuesta ante stock negativo: *Bloquear*, *Advertencia* o *Sin advertencia*.

* **Regla Técnica:** En cualquier empresa que opere con **Inventario Permanente**, el bloqueo de stock negativo debe ser **estricto y obligatorio** a nivel de empresa o almacén.
* **Causa:** Permitir stock negativo provoca que el sistema calcule salidas valorizadas en cero o con costes desfasados. Cuando entra la mercancía real a un costo distinto, se generan desviaciones contables irreversibles que distorsionan el coste de ventas y arruinan la auditoría fiscal del inventario.

---

## LECCIÓN 12.3: LA HERRAMIENTA QUICK COPY: MIGRACIÓN DE CONFIGURACIONES ENTRE EMPRESAS (*.QDF)

### 1. ¿Qué es Quick Copy y Cuándo se Utiliza?
Ubicada en: `Gestión > Inicialización sistema > Centro de implementación > Tareas de implementación > Gestión de datos > Copiar datos entre empresas`.

Quick Copy es la solución nativa de SAP Business One diseñada para extraer, transportar y replicar estructuras de configuración, personalizaciones, datos maestros y definiciones operativas entre bases de datos de SAP B1 sin necesidad de reconfigurar manualmente desde cero.

```
COPIA DIRECTA                                 COPIA INDIRECTA
┌────────────────────────┐                   ┌────────────────────────┐
│ Empresa Origen         │                   │ Empresa Origen         │
│ (Ambiente Configurado) │                   │ (Ambiente Configurado) │
└───────────┬────────────┘                   └───────────┬────────────┘
            │                                            │
            │ (Mismo servidor e instancia)               ▼ (Exporta metadatos)
            │                                    [ ARCHIVO *.QDF ]
            │                                            │
            ▼                                            ▼ (Importa archivo)
┌────────────────────────┐                   ┌────────────────────────┐
│ Empresa Destino        │                   │ Empresa Destino        │
│ (Base Limpia / Nueva)  │                   │ (En otro servidor/nube)│
└────────────────────────┘                   └────────────────────────┘
```

* **Copia Directa:** Se ejecuta entre dos bases de datos que residen en la misma instancia de base de datos (SQL Server o SAP HANA) y comparten exactamente la misma versión y nivel de parche (*Patch Level*).
* **Copia Indirecta (Archivo `*.qdf`):** Exporta los objetos seleccionados a un archivo comprimido propietario (`Quick Copy Data File - *.qdf`). Es la modalidad estándar para trasladar configuraciones desde los servidores de laboratorio del Partner hacia los servidores productivos del Cliente en la nube o en instalaciones locales (*On-Premise*).

---

### 2. Métodos de Copia y Manejo de Conflictos
Al ejecutar el asistente de Quick Copy, el consultor debe seleccionar la estrategia de resolución de duplicados en la base de datos de destino:

1. **Añadir nuevos registros y actualizar existentes:**
   * Inserta los códigos que no existen en el destino y sobreescribe aquellos coincidentes si se detectaron modificaciones en el origen.
   * *Uso típico:* Actualizaciones y ajustes menores realizados en la base de pruebas que deben replicarse en una base que ya tiene configuraciones base.
2. **Añadir nuevos registros sin actualizar existentes:**
   * Inserta únicamente los registros faltantes. Si un código ya existe en el destino, se omite y se conserva su valor local intacto.
   * *Uso típico:* Migraciones seguras donde no se desea alterar parametrizaciones particulares ya establecidas en la empresa destino.
3. **Manejo de Errores durante la Ejecución:**
   * *Detener copia en el primer error:* Opción altamente recomendada para entornos de Cutover productivo; garantiza que cualquier fallo de integridad relacional sea corregido antes de continuar.
   * *Ignorar errores y copiar registros válidos:* Utilizada únicamente en laboratorios preliminares para medir el volumen de registros exitosos frente a incidencias.

---

### 3. Archivos de Proyecto (*.xml) y Gestión de Dependencias
* **Archivos de Proyecto (`*.xml`):** Quick Copy permite guardar la selección de categorías y ramas del árbol de objetos (por ejemplo: solo Finanzas, Campos de Usuario UDF y Formatos de Crystal Reports) en una plantilla XML. Esto garantiza la repetibilidad de despliegues en clientes con múltiples sociedades filiales sin riesgo de olvidar casillas.
* **Integridad Referencial y Objetos Dependientes:**
  * En SAP Business One, los objetos no viven aislados. Por ejemplo, la *Determinación de Cuentas de Mayor* no puede existir si previamente no existen las cuentas en el *Plan de Cuentas*, los *Códigos de Impuesto* y las *Monedas*.
  * Quick Copy cuenta con la opción crítica: **"Copiar objetos dependientes automáticamente"**. Al mantenerla tildada, el asistente analiza el árbol relacional y arrastra de manera transparente todos los prerequisitos necesarios para evitar fallos de claves foráneas.

---

### 4. Cuadro Comparativo: Quick Copy vs. Data Transfer Workbench (DTW)

| Criterio | Quick Copy (*.qdf) | Data Transfer Workbench - DTW (*.csv) |
| :--- | :--- | :--- |
| **Propósito Principal** | Migración de configuraciones, parametrizaciones del sistema, personalizaciones y layouts entre bases de datos SAP B1. | Carga masiva de datos maestros complejos, históricos, saldos contables y de inventario desde sistemas legados externos. |
| **Origen de los Datos** | Exclusivamente otra base de datos de SAP Business One. | Archivos planos (.CSV, .TXT) preparados a partir de plantillas Excel oficiales (DI API / OData). |
| **Objetos que Procesa** | Plan de cuentas, formatos Crystal Reports, consultas FMS, usuarios, autorizaciones, parametrizaciones generales y tablas de configuración. | Catálogo masivo de Artículos, Interlocutores Comerciales con múltiples contactos y direcciones, listas de precios, saldos iniciales. |
| **Manejo de Dependencias** | Automático e integrado mediante validación cruzada interna en el archivo *.qdf. | Manual: El consultor debe respetar una estricta precedencia secuencial de carga en los archivos CSV. |

---

## LECCIÓN 12.4: GESTIÓN DE AMBIENTES (DEMO, TEST, TRAINING Y PRODUCCIÓN) Y PLAN DE CUTOVER

### 1. El Paisaje de Bases de Datos (*Database Landscape*)
Para garantizar una implementación profesional sin disrupciones operativas, el ecosistema de bases de datos debe segregarse en cuatro ambientes bien definidos:

```
┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐
│ BASE DEMO            │   │ BASE TEST            │   │ BASE TRAINING        │
│ (Datos ficticios SAP)│   │ (Configuración real  │   │ (Clon de TEST para   │
│ Para explorar flujos │   │  para validar UAT)   │   │  capacitar usuarios) │
└──────────────────────┘   └──────────┬───────────┘   └──────────────────────┘
                                      │
                                      │ (Quick Copy de parametrización validada)
                                      ▼
                           ┌──────────────────────┐
                           │ BASE DE PRODUCCIÓN   │
                           │ (Operación real      │
                           │  limpia para Cutover)│
                           └──────────────────────┘
```

1. **Base DEMO (Ej. `SBODemoES`):** Base precargada suministrada por SAP con transacciones ficticias. Sirve para demostraciones de preventa, exploración libre y validación de conceptos iniciales sin contaminar otros ambientes.
2. **Base TEST (Pruebas / Calidad):** El laboratorio principal. Aquí se parametriza el sistema según el *Business Blueprint*, se diseñan los reportes Crystal, se programan las FMS y se realizan las pruebas integrales de usuario (UAT).
3. **Base TRAINING (Capacitación):** Clon exacto de la base TEST generado semanas antes del arranque. Los usuarios finales practican los flujos operativos reales ingresando pedidos, facturas y cobros ficticios sin alterar la configuración pura de TEST.
4. **Base PRODUCCIÓN:** Entorno de vida real. Es una base de datos limpia de transacciones de prueba, donde solo residen las configuraciones oficiales trasladadas vía Quick Copy y los saldos migrados en el Cutover.

---

### 2. El Plan de Cutover (Cronograma Crítico de Paso a Producción)
El **Cutover** es la fase culminante de la Fase 4 de AIP. Consiste en la ventana de tiempo (generalmente el fin de semana previo al Go-Live) en la que se detiene el sistema anterior, se extraen los balances finales y se inicializa la base productiva de SAP Business One.

```
CRONOGRAMA DE EJECUCIÓN DEL FIN DE SEMANA DE CUTOVER:
═══════════════════════════════════════════════════════════════════════════════
[ DÍA -3: VIERNES ] ──> LEGACY FREEZE (Congelamiento de sistemas anteriores)
                         • Corte de pedidos y facturación a las 18:00 hrs.
                         • Cierre contable preliminar en sistema legado.
                         • Extracción de balances finales y existencias físicas.
───────────────────────────────────────────────────────────────────────────────
[ DÍA -2: SÁBADO ]  ──> DEPURACIÓN Y GENERACIÓN DE PLANTILLAS DTW
                         • Validación de existencias contra conteo físico.
                         • Cuadre de saldos de clientes y proveedores al centavo.
                         • Homologación de códigos en plantillas .CSV de DTW.
───────────────────────────────────────────────────────────────────────────────
[ DÍA -1: DOMINGO ] ──> CARGA SECUENCIAL Y CONCILIACIÓN EN PRODUCCIÓN
                         1. Creación de BD Producción limpia en SLD.
                         2. Configuración de Parametrizaciones Irreversibles.
                         3. Quick Copy completo desde BD TEST.
                         4. Carga DTW de Maestros (Cuentas -> ICs -> Artículos).
                         5. Carga DTW de Saldos Iniciales (Stock -> Cartera -> Asiento).
                         6. Conciliación y Cuadre Contable (Cuenta Transitoria en 0).
───────────────────────────────────────────────────────────────────────────────
[ DÍA 0: LUNES ]    ──> GO-LIVE OPERATIVO (Encendido del sistema)
                         • Habilitación de usuarios y contraseñas.
                         • Pruebas de emisión fiscal y facturación electrónica.
                         • Acompañamiento presencial en piso (Floor Support).
═══════════════════════════════════════════════════════════════════════════════
```

---

### 3. Secuencia Estricta de Carga de Datos en Cutover (DTW)

Para evitar fallos de integridad referencial durante la carga en la base de producción, se debe seguir rigurosamente este orden de precedencia:

#### Bloque A: Datos Maestros Estructurales
1. **Plan de Cuentas (`ChartOfAccounts`):** Base de toda la contabilización.
2. **Dimensiones y Centros de Beneficio (`ProfitCenters`):** Estructura de control analítico de costos.
3. **Grupos de Artículos y Listas de Precios:** Reglas de costeo y listas comerciales.
4. **Interlocutores Comerciales (`BusinessPartners`):** Clientes y Proveedores con sus contactos y direcciones.
5. **Artículos (`Items`):** Maestro de productos vinculados a sus grupos de artículos y listas de precios.
6. **Listas de Materiales / BOM (`ProductTrees`):** Estructuras de ensamble o fabricación.

#### Bloque B: Saldos Iniciales de Operación
1. **Saldos Iniciales de Inventario:**
   * Se cargan mediante documentos de *Entrada de Mercancías* (`InventoryGenEntries`) a fecha de corte.
   * *Valoración:* Cada artículo entra con su cantidad física real y su coste unitario histórico verificado.
   * *Contrapartida Contable:* Se imputa contra la **Cuenta Transitoria de Saldos Iniciales** (ej. `999999 - Contrapartida de Apertura`).
2. **Cartera Abierta de Clientes y Proveedores (Cuentas por Cobrar y por Pagar):**
   * Se cargan mediante comprobantes de saldo tipo *Factura de Servicio* (`Invoices` / `PurchaseInvoices`) con la referencia del número de factura original y fechas de vencimiento reales.
   * *Línea de Servicio:* Se imputa la línea contra la **Cuenta Transitoria de Saldos Iniciales** (`999999`). Al crearse la factura, SAP debita la cuenta de control de clientes (o acredita proveedores) y compensa la cuenta transitoria.
3. **Asiento Contable de Apertura de Balance General (`JournalEntries`):**
   * Se registra el asiento con los saldos de bancos, caja, activos fijos, pasivos financieros y patrimonio a la fecha de corte.
   * La contrapartida de cuadre del asiento es la **Cuenta Transitoria de Saldos Iniciales** (`999999`).
   * **Regla de Oro de Auditoría:** Si la migración es perfecta, el saldo final de la cuenta transitoria `999999` debe quedar exactamente en **CERO (0.00)**.

---

## MATRIZ DE TROUBLESHOOTING Y REGLAS CRÍTICAS PARA EL COPILOTO IA

### Problema 1: "Quick Copy falla con error de dependencias al intentar copiar la Determinación de Cuentas de Mayor"
* **Causa Raíz:** Se intentó migrar la determinación de cuentas contables sin haber copiado previamente el Plan de Cuentas, las Definiciones de Impuestos (IVA/Retenciones) o los Códigos de Monedas en la base de datos de destino.
* **Instrucción de Asesoría del Copiloto:**
  1. En el árbol de selección de Quick Copy, marcar la categoría raíz **Finanzas** completa para incluir el catálogo contable y las tablas fiscales.
  2. Asegurar que en el paso de opciones de copia esté tildada la casilla **"Copiar objetos dependientes automáticamente"**.
  3. Si la falla persiste, exportar primero únicamente el Plan de Cuentas y Monedas, aplicarlo en destino y posteriormente ejecutar una segunda pasada con la Determinación de Cuentas.

---

### Problema 2: "El cliente solicita formalmente desactivar el inventario permanente dos meses después del Go-Live"
* **Causa Raíz:** La parametrización de Inventario Permanente es estructural e irreversible en SAP Business One una vez que se han asentado movimientos de stock en la tabla `OINM`.
* **Instrucción de Asesoría del Copiloto:**
  1. Explicar formal y técnicamente a la gerencia del cliente que SAP Business One bloquea esa modificación a nivel de código y base de datos para garantizar el principio de partida doble y auditoría fiscal.
  2. Aclarar que ninguna consulta o modificación directa en base de datos (`UPDATE OADM`) está permitida, ya que anula la garantía de soporte de SAP (Nota SAP 896891) y corrompe los balances.
  3. La única alternativa técnica soportada por SAP consiste en crear una **nueva base de datos limpia**, configurarla sin inventario permanente y realizar un nuevo proceso formal de **Cutover** (cierre de saldos y migración).

---

### Problema 3: "La cuenta transitoria de saldos iniciales (999999) arroja un saldo residual tras finalizar el Cutover"
* **Causa Raíz:** Existe una discrepancia entre los saldos auxiliares cargados y el asiento de balance general:
  * El inventario valorizado cargado difiere del saldo contable de existencias del sistema anterior.
  * O la cartera de clientes/proveedores no coincide con la cuenta de control del balance general legado.
  * O se ingresó un documento de saldo afectando una cuenta contable ordinaria en vez de la cuenta puente.
* **Instrucción de Asesoría del Copiloto:**
  1. Emitir un informe de Balance de Sumas y Saldos filtrando exclusivamente la cuenta transitoria `999999`.
  2. Cotejar:
     * Subtotal de Entradas de Inventario vs. Saldo de la cuenta de inventario en el balance anterior.
     * Subtotal de Facturas de Clientes vs. Saldo de la cuenta de control de clientes anterior.
     * Subtotal de Facturas de Proveedores vs. Saldo de la cuenta de control de proveedores anterior.
  3. Identificar la diferencia y registrar un asiento contable de ajuste justificado con la aprobación formal del Contador General.

---

### Problema 4: "Quick Copy no transfiere Búsquedas Formateadas (FMS) o arroja error de campos de usuario faltantes"
* **Causa Raíz:** Las Búsquedas Formateadas hacen referencia a Campos Definidos por el Usuario (UDF) o Tablas de Usuario (UDT) que aún no existen en la base de destino.
* **Instrucción de Asesoría del Copiloto:**
  1. Al exportar en Quick Copy, seleccionar en la categoría **Herramientas de personalización** las opciones de *Campos definidos por el usuario (UDF)* y *Tablas definidas por el usuario (UDT)* antes de copiar las consultas FMS.
  2. Ejecutar la copia asegurando que los usuarios de destino estén desconectados, ya que la creación de UDFs requiere acceso exclusivo a la estructura de la base de datos.

---

## BANCO DE EVALUACIÓN SITUACIONAL

**Pregunta 1 (Gobernanza de Proyectos y Fases AIP)**  
Una compañía de distribución masiva se encuentra en la Fase 4 de la metodología AIP. Durante el fin de semana de corte, el Gerente de Operaciones solicita que los vendedores continúen facturando en el sistema anterior hasta el mediodía del lunes para no frenar los despachos matutinos. ¿Cómo debe proceder el Director de Proyecto del Partner?  
* A) Aceptar la solicitud, permitiendo que el sistema legado facture hasta el lunes y luego cargar esas facturas manualmente en SAP B1 a mitad de semana.  
* B) Rechazar categóricamente la solicitud y hacer cumplir el congelamiento de sistemas (*Legacy Freeze*), explicando que cualquier transacción en el sistema legado posterior al corte invalida los saldos iniciales de cartera, inventario y balance que se están migrando en el Cutover. **[CORRECTA]**  
* C) Pausar la salida en vivo por tres meses para permitir que el cliente agote todo su inventario en el software anterior.  
* D) Desactivar el módulo de facturación en SAP Business One durante la primera semana para que solo opere inventario.  
* **Explicación de la IA:** La respuesta correcta es la B. El *Legacy Freeze* es innegociable durante el Cutover. Si se permiten transacciones en el sistema anterior después de la extracción de datos, los saldos cargados en SAP B1 nacerán desfasados respecto a la realidad física y financiera, destruyendo la reconciliación contable del Go-Live.

---

**Pregunta 2 (Herramientas de Configuración y Despliegue)**  
Un consultor finalizó con éxito las pruebas de aceptación (UAT) en la base de datos TEST. Ahora debe trasladar hacia la nueva empresa productiva: los formatos de facturas impresas en Crystal Reports, las búsquedas formateadas (FMS), la parametrización de autorizaciones de usuarios y las definiciones de impuestos. ¿Cuál es la herramienta idónea dentro de SAP Business One para ejecutar esta labor con máxima eficiencia e integridad?  
* A) Data Transfer Workbench (DTW) mediante plantillas CSV.  
* B) La utilidad nativa Quick Copy (*Copiar datos entre empresas*), ya sea por copia directa o archivo `*.qdf`. **[CORRECTA]**  
* C) La herramienta de Importar desde Excel básica del menú Gestión.  
* D) Exportar tablas de base de datos directamente vía SQL Server Management Studio mediante scripts `INSERT INTO`.  
* **Explicación de la IA:** La respuesta correcta es la B. Quick Copy es la herramienta nativa de SAP diseñada específicamente para migrar configuraciones, layouts de Crystal Reports, parametrizaciones de usuario y metadatos entre bases de datos SAP B1. DTW está orientada a datos maestros y transaccionales masivos (no layouts ni autorizaciones), y las inserciones directas por SQL violan las políticas de soporte de SAP.

---

**Pregunta 3 (Decisiones Críticas de Arranque e Irreversibilidad)**  
El Gerente Financiero de una empresa comercializadora configuró e inició operaciones en SAP Business One con inventario permanente y valoración de coste Promedio Ponderado consolidado a nivel de empresa. Tras 3 meses de operación, apertura una sucursal en una zona franca y exige al consultor que cambie la parametrización a "Gestionar costes de artículo por almacén". ¿Cuál es la respuesta técnica y legal correcta que debe brindar el consultor?  
* A) Acceder a Detalles de Sociedad en Inicialización Básica y cambiar la casilla inmediatamente, ya que el sistema lo permite en cualquier momento.  
* B) Explicar que dicha parametrización es estructural e irreversible una vez asentado el primer movimiento de inventario, por lo que el sistema bloquea el cambio; la única vía soportada si el cambio es imprescindible es crear una nueva sociedad limpia y ejecutar un nuevo Cutover. **[CORRECTA]**  
* C) Ejecutar un script SQL de actualización (`UPDATE OADM SET ByWh = 'Y'`) fuera de horario laboral.  
* D) Crear una nueva lista de precios en moneda extranjera para simular el costo por almacén.  
* **Explicación de la IA:** La respuesta correcta es la B. "Gestionar costes por almacén" es una parametrización irreversible. Almacena el historial en `OITW` de forma completamente distinta a `OITM`. Modificarla requeriría reestructurar todas las capas de stock pasadas. La base de datos lo bloquea y SAP prohíbe terminantemente alterarlo por backend, siendo la única solución técnica formal una nueva base de datos.

---

**Pregunta 4 (Metodología de Cutover y Cuadre de Saldos Iniciales)**  
Durante la carga de saldos iniciales en el fin de semana de Cutover, el consultor debe migrar las facturas pendientes de cobro de clientes provenientes del sistema anterior. ¿Cuál es el procedimiento contable y operativo estándar en SAP Business One?  
* A) Cargar facturas de clientes de tipo Servicio mediante DTW, imputando el valor de la línea a la cuenta transitoria de saldos iniciales (999999), conservando las fechas de vencimiento y folios originales. **[CORRECTA]**  
* B) Cargar notas de crédito masivas para rebajar el inventario y compensar las cuentas por pagar.  
* C) Realizar un asiento contable simple debitando la cuenta de cada cliente y acreditando la cuenta de ingresos por ventas del mes en curso.  
* D) Registrar un pago recibido en efectivo por cada cliente y luego anularlo para generar saldo a favor.  
* **Explicación de la IA:** La respuesta correcta es la A. Las facturas de servicio permiten reflejar el saldo pendiente por cobrar sin mover inventario. Al asociar la línea a la cuenta transitoria (999999), el sistema debita la cuenta de control de clientes (`OACT`) y acredita la cuenta puente. Esto deja la cartera abierta lista para recibir cobranzas futuras en el módulo de Gestión de Bancos, respetando los vencimientos y la correlación legal del documento anterior.

---

**Pregunta 5 (Resolución de Conflictos e Integridad en Quick Copy)**  
Al intentar transferir la *Determinación de Cuentas de Mayor* entre la base TEST y la base de PRODUCCIÓN mediante Quick Copy, el proceso se interrumpe arrojando un error de "Clave foránea no encontrada / Objeto inexistente". ¿Cuál es la causa del problema y cómo debe remediarse?  
* A) El servidor no tiene suficiente memoria RAM para procesar el archivo `*.qdf`.  
* B) Se intentó transferir la determinación de cuentas sin haber copiado previamente el Plan de Cuentas, las monedas o los códigos de impuestos requeridos por las cuentas de mayor. Se soluciona marcando la categoría Finanzas completa y tildando "Copiar objetos dependientes automáticamente". **[CORRECTA]**  
* C) Quick Copy no es compatible con el módulo de Finanzas y debe usarse DTW obligatoriamente.  
* D) La base de producción debe configurarse previamente con una licencia de desarrollador SDK.  
* **Explicación de la IA:** La respuesta correcta es la B. La determinación de cuentas depende estrictamente de la existencia previa del catálogo de cuentas (`OACT`), códigos de impuestos (`OVTG`) y monedas (`OCRN`). Al no encontrar estos registros en el destino, el motor relacional aborta la operación para proteger la integridad referencial. Activar la copia automática de dependencias resuelve el árbol de precedencia.

---

## GUIONES HUMANIZADOS PARA LOCUCIÓN IA (ELEVENLABS)

A continuación se presentan los parámetros JSON estructurados para inyectar directamente en las APIs de generación de voz de ElevenLabs. Los textos han sido diseñados con un enfoque pedagógico, empático, corporativo y de liderazgo consultivo.

```json
[
  {
    "scene": "01_el_arte_de_la_metodologia_aip",
    "voicePrompt": "Voz masculina madura, enérgica y ejecutiva. Tono de liderazgo corporativo, inspirador y didáctico.",
    "text": "Instalar un software lo hace cualquiera; transformar la operación de una compañía requiere una metodología impecable. Con el programa de implementación acelerada de SAP, conocido como AIP, cada fase tiene un propósito vital. Desde el primer levantamiento de procesos en el Blueprint hasta el corte final de datos, cada paso está diseñado para mitigar riesgos, controlar el presupuesto y asegurar que tu empresa despegue con absoluta seguridad y sin sobresaltos operativos.",
    "durationEstimate": "24s"
  },
  {
    "scene": "02_las_decisiones_irreversibles",
    "voicePrompt": "Voz femenina firme, pausada y analítica. Tono preventivo, formal y de consultoría financiera de alto nivel.",
    "text": "En el arranque de un ERP existen decisiones que no admiten marcha atrás. Activar el inventario permanente o definir si el coste se gestionará por almacén son elecciones estructurales que quedan grabadas de por vida en la base de datos tras el primer movimiento contable. Por eso, en el ecosistema SAP, las parametrizaciones críticas jamás se improvisan: se analizan a fondo y se firman en acta conjunta con la dirección financiera.",
    "durationEstimate": "25s"
  },
  {
    "scene": "03_la_potencia_de_quick_copy",
    "voicePrompt": "Voz masculina dinámica, moderna y tecnológica. Tono ágil, claro y motivador enfocado en eficiencia de TI.",
    "text": "¿Por qué volver a configurar a mano cientos de pantallas cuando ya lo hiciste a la perfección en tu entorno de pruebas? Con la herramienta Quick Copy empaquetas tus reportes de Crystal, tus búsquedas formateadas, tus permisos y tus reglas de negocio en un solo archivo con extensión QDF, y los trasladas a producción en cuestión de minutos. Eso es estandarización, consistencia técnica y cero margen de error.",
    "durationEstimate": "23s"
  },
  {
    "scene": "04_el_dia_del_cutover",
    "voicePrompt": "Voz femenina asertiva, rigurosa y estratégica. Tono de control de misión, alta precisión y rigor contable.",
    "text": "El fin de semana de Cutover es el momento de la verdad en todo proyecto SAP. Congelar el sistema legado, cargar datos maestros en estricta precedencia y migrar saldos de inventario y cartera contra la cuenta transitoria requiere una disciplina milimétrica. Cuando el lunes por la mañana los usuarios ingresan al sistema y la cuenta puente de apertura marca exactamente cero, sabes que la ingeniería del proyecto fue perfecta.",
    "durationEstimate": "26s"
  }
]
```
