# 🎓 Malla Curricular de Mi Aula (borrador v0.1)

> Generada por `scripts/build_malla.mjs` desde los manuales. **Validada: los manuales aparecen exactamente una vez.**

**10 carreras · 31 módulos · ~162 clases maestras** (1 por manual + clases propias de la academia + 1 integradora por módulo).

## Reglas de la malla

- Cada manual pertenece a **un solo módulo** (su "casa"); un módulo puede ser prerrequisito de otras carreras.
- Cada clase explica **para qué** existe el tema, **qué dato aporta** el usuario, el **impacto contable/logístico** con ejemplo numérico y **cómo se verifica** en un informe.
- *Clases propias*: temas que los manuales no cubren (fundamentos contables, punto de equilibrio, verificación de informes, etc.).
- Los módulos marcados **propuesto** no tienen manuales de origen y requieren contenido propio.

## Certificación

- **porClase:** Quiz de comprensión: aprobación con 90 % o más.
- **porModulo:** Quizzes aprobados + defensa con Master B1 (mínimo 80 %).
- **porCarrera:** Todos los módulos de la carrera aprobados + defensa integradora (mínimo 80 %). Diploma con hash SHA-256 y QR.
- **consultorIntegral:** C01 completa + al menos 5 carreras de especialidad, incluidas C06 y C09. Examen en B1 Secure Exam Guard.

## Producción de contenido

- **Voz de los minivideos:** `es-MX-JorgeNeural`. Voz documentada en los videos de los manuales CS (docs/07); se mantiene por continuidad. Por verificar qué voz usan los demás videos. Alternativas a probar para acento ecuatoriano: es-EC-LuisNeural, es-EC-AndreaNeural (hay que confirmar que edge-tts las ofrezca).
- **Imágenes:** Ilustración 2D plana (sin texto) generada con Gemini; diagramas con cifras como SVG/HTML.

## Carreras y módulos

### C01 · Fundamentos y Usuario Experto B1 [OP]

Base común: entender el sistema, la contabilidad que lo mueve y los datos maestros.

#### M01 · Primer contacto con SAP Business One

- **Propósito:** Entender qué es un ERP, cómo se organiza SAP Business One y moverse por el sistema con soltura.
- **Pregunta de negocio:** ¿Dónde está la información de mi empresa y cómo la encuentro?
- **Requiere:** ninguno
- **Manuales de origen:**
  - 001 · `10_Intro_11_Overview_IntroSAPB1_ES`
  - 002 · `10_Intro_12_Overview_GettingStarted_ES`
  - 003 · `10_Overview_13_MDDoc_ES`
  - 117 · `CSL01_Introduction_ES`
  - 118 · `CSL01_Introduction_Solution_ES`
- **Clases propias de la academia:**
  - Qué es un ERP y para qué sirve a una empresa
  - Una empresa = una base de datos: arquitectura, HANA frente a SQL Server, nube frente a instalación local

#### M02 · Fundamentos contables para operar el ERP

- **Propósito:** Leer y predecir asientos: debe y haber, balance, estado de resultados y asientos automáticos.
- **Pregunta de negocio:** ¿Qué le pasa a la contabilidad cada vez que registro un documento?
- **Requiere:** ninguno
- **Manuales de origen:**
  - 026 · `10_AccBasics_11_AccBasics_Financial_Basics_ES`
  - 027 · `10_AccBasics_12_AccBasics_Automatic_Journal_Entries_ES`
- **Clases propias de la academia:**
  - Debe, haber, balance general y estado de resultados desde cero
  - IVA: crédito y débito fiscal en una factura

#### M03 · Socios de negocios y artículos: los datos maestros

- **Propósito:** Crear y mantener clientes, proveedores y artículos, y entender por qué su calidad define la de todos los informes.
- **Pregunta de negocio:** ¿Qué campo del maestro cambia qué informe?
- **Requiere:** M01
- **Manuales de origen:**
  - 057 · `10_ItemInv_11_Item_ItemMD_ES`
  - 058 · `10_ItemInv_12_Item_ItemGrp_ES`
  - 108 · `10_Sales_21_Cust_Customers_ES`
- **Clases propias de la academia:**
  - Calidad de datos maestros: qué campos alteran los informes

#### M04 · Unidades de medida y empaque

- **Propósito:** Comprar, almacenar y vender en unidades distintas sin descuadrar el inventario.
- **Pregunta de negocio:** ¿Cómo compro en cajas, guardo en unidades y vendo en pallets?
- **Requiere:** M03
- **Manuales de origen:**
  - 059 · `10_ItemInv_21_UoM_Overview_ES`
  - 064 · `10_Item_22_UoM_Setup`
  - 065 · `10_Item_23_UoM_Weight`
  - 066 · `10_Item_24_UoM_Packaging`

### C02 · Compras e Importaciones [OP]

Del requerimiento al pago, con costo real de importación.

#### M05 · Ciclo de compras (Procure-to-Pay)

- **Propósito:** Controlar la compra desde la solicitud hasta el pago, con recepción parcial, devoluciones y la cuenta puente.
- **Pregunta de negocio:** ¿Qué recibimos, qué debemos y cuándo pagamos?
- **Requiere:** M03, M02
- **Manuales de origen:**
  - 098 · `10_Purch_11_Process_Process_ES`
  - 099 · `10_Purch_12_Process_Items_ES`
  - 100 · `10_Purch_13_Process_PurchaseReqQt`
  - 101 · `10_Purch_14_Process_Services`
  - 102 · `10_Purch_21_Issues_GRPO_ES`
  - 103 · `10_Purch_22_Issues_ReturnsCM_ES`
  - 119 · `CSL02_Procurement_Process_ES`
  - 120 · `CSL02_Procurement_Process_Solution_ES`

#### M06 · Costos de importación y portes (Landed Costs)

- **Propósito:** Incorporar fletes, seguros y aranceles al costo del artículo para conocer el margen real.
- **Pregunta de negocio:** ¿Cuánto me cuesta realmente lo que importé?
- **Requiere:** M05
- **Manuales de origen:**
  - 104 · `10_Purch_32_LandedCost_Freight`
  - 105 · `10_Purch_32_LandedCost_ManageLandedCosts`
- **Clases propias de la academia:**
  - Cómo el flete y los aranceles cambian el costo unitario y el margen

### C03 · Ventas y Estrategia de Precios [OP]

Del cliente al cobro, con precios y márgenes bajo control.

#### M07 · Ciclo de ventas (Order-to-Cash)

- **Propósito:** Llevar la venta de la oferta al cobro, con automatización, devoluciones y notas de crédito.
- **Pregunta de negocio:** ¿Qué prometimos, qué entregamos, qué facturamos y qué nos deben?
- **Requiere:** M03, M02
- **Manuales de origen:**
  - 106 · `10_Sales_11_Process_Overview_ES`
  - 107 · `10_Sales_12_Process_Order2Cash_ES`
  - 110 · `10_Sales_41_Process_Autom_ES`
  - 111 · `10_Sales_51_Issues_ReturnsExchange_ES`
  - 112 · `10_Sales_52_Issues_CM_ES`
- **Clases propias de la academia:**
  - Del pedido al cobro: qué registra cada documento y cómo comprobarlo (clase piloto: src/content/lessons/m03-c01-order-to-cash.md)

#### M08 · Precios, descuentos y márgenes

- **Propósito:** Definir listas de precios, descuentos y precios especiales sabiendo su efecto en el margen.
- **Pregunta de negocio:** ¿A qué precio vendo y cuánto gano en cada venta?
- **Requiere:** M07
- **Manuales de origen:**
  - 081 · `10_Pricing_11_Concept_PrConcept_ES`
  - 082 · `10_Pricing_21_Pricelist_CreatePricelist_ES`
  - 083 · `10_Pricing_22_Pricelist_UpdatePricelist_ES`
  - 084 · `10_Pricing_31_DiscSP_PerVolDisc_ES`
  - 085 · `10_Pricing_32_DiscSP_DiscGrp_ES`
  - 086 · `10_Pricing_33_DiscSP_SpPrBP_ES`
- **Clases propias de la academia:**
  - Margen frente a markup: cómo calcularlos y compararlos

### C04 · Logística, Inventarios y Bodegas [OP]

Existencias, valoración, trazabilidad y bodegas por ubicación.

#### M10 · Almacenes, movimientos e inventario físico

- **Propósito:** Controlar existencias entre almacenes, traslados, consignación y conteos.
- **Pregunta de negocio:** ¿Qué hay, dónde está y cuánto vale?
- **Requiere:** M03, M04
- **Manuales de origen:**
  - 060 · `10_ItemInv_31_WM_WH_ES`
  - 061 · `10_ItemInv_32_WM_GM_ES`
  - 068 · `10_Inven_13_WM_PhyInv`
  - 069 · `10_Inven_21_PNP_PNPSales`
  - 070 · `10_Inven_22_PNP_PNPProduction`
  - 071 · `10_Inven_23_PNP_PNPTTransfer`

#### M11 · Valoración de inventario, lotes y series

- **Propósito:** Elegir y entender el método de valoración y la trazabilidad por lote y serie.
- **Pregunta de negocio:** ¿Cómo decide el método de costeo cuánto gano y cuánto impuesto pago?
- **Requiere:** M10
- **Manuales de origen:**
  - 062 · `10_ItemInv_41_Valuation_ValMethods_ES`
  - 063 · `10_ItemInv_51_SNBatch_SNBatch_ES`
  - 067 · `10_Item_42_SNBatch_Valuation`
- **Clases propias de la academia:**
  - Cómo el método de valoración cambia el costo de ventas y el impuesto

#### M12 · Ubicaciones en almacén (Bin Locations)

- **Propósito:** Operar bodegas grandes por pasillo, estantería y casilla.
- **Pregunta de negocio:** ¿En qué casilla exacta está lo que el cliente necesita hoy?
- **Requiere:** M10
- **Manuales de origen:**
  - 072 · `10_BinLoc_11_Overview_Overview_ES`
  - 073 · `10_BinLoc_12_Setup_Setup`
  - 074 · `10_BinLoc_13_Process_Process`
  - 075 · `10_BinLoc_14_Process_Weight`
  - 076 · `10_BinLoc_15_Reporting_Reporting`
  - 077 · `10_BinLoc_16_Serial_Serial`

### C05 · Producción y Planificación (MRP) [ARQ]

Recetas, órdenes, costo de fabricación y planificación de necesidades.

#### M13 · Producción: recetas, recursos y órdenes

- **Propósito:** Modelar listas de materiales y recursos y ejecutar órdenes de producción.
- **Pregunta de negocio:** ¿Qué necesito para fabricar y cuánto me cuesta?
- **Requiere:** M10
- **Manuales de origen:**
  - 087 · `10_Production_11_Overview_Overview_ES`
  - 088 · `10_Production_21_Resources_Resources_ES`
  - 089 · `10_Production_22_Resources_Capacity_ES`
  - 090 · `10_Production_31_BOM_BOM_ES`
  - 091 · `10_Production_41_Process_BasicProductionProcess_ES`
  - 092 · `10_Production_42_Process_ByProductsandAdditional`
  - 093 · `10_Production_42_Process_RoutingProductionProcess_ES`

#### M14 · Contabilidad y costo de producción

- **Propósito:** Seguir el costo desde las materias primas hasta el producto terminado y sus desviaciones.
- **Pregunta de negocio:** ¿Por qué el costo real no coincide con el estándar?
- **Requiere:** M13, M16
- **Manuales de origen:**
  - 094 · `10_Production_51_Accounting_Accounting`
  - 095 · `10_Production_52_Accounting_Cost`

#### M15 · Planificación de necesidades (MRP)

- **Propósito:** Calcular qué comprar o fabricar, cuánto y cuándo, usando demanda y pronósticos.
- **Pregunta de negocio:** ¿Qué debo pedir hoy para no quedarme sin stock ni sobrecomprar?
- **Requiere:** M13, M05
- **Manuales de origen:**
  - 078 · `10_MRP_11_MRP_Process_ES`
  - 079 · `10_MRP_12_ConsumeForecast`
  - 080 · `10_MRP_13_MRP_BOM`

### C06 · Contabilidad y Finanzas [ARQ]

Plan de cuentas, asientos, cierres, tesorería y activos fijos.

#### M16 · Plan de cuentas, monedas y determinación de cuentas

- **Propósito:** Estructurar el plan de cuentas y definir a qué cuenta va cada transacción.
- **Pregunta de negocio:** ¿Por qué este documento contabilizó en esta cuenta?
- **Requiere:** M02
- **Manuales de origen:**
  - 045 · `10_FinSetup_11_COA_COAConcepts_ES`
  - 046 · `10_FinSetup_11_Currencies_Currencies_ES`
  - 047 · `10_FinSetup_12_COA_ManageCOA`
  - 048 · `10_FinSetup_21_DefaultGLAcc_DefaultGLAccOveriew_ES`
  - 049 · `10_FinSetup_22_DefaultGLAcc_Traditional`
  - 050 · `10_FinSetup_23_DefaultGLAcc_Advanced`

#### M17 · Asientos, períodos y cierre contable

- **Propósito:** Registrar asientos, plantillas y vouchers, y cerrar períodos y conciliaciones internas.
- **Pregunta de negocio:** ¿Cómo cierro el mes con la certeza de que todo cuadra?
- **Requiere:** M16
- **Manuales de origen:**
  - 039 · `10_FinProcess_11_PostJE_PostJE_ES`
  - 040 · `10_FinProcess_12_PostJE_template_ES`
  - 041 · `10_FinProcess_13_PostJE_voucher_ES`
  - 042 · `10_FinProcess_21_PostPeriods_PostPeriods_ES`
  - 043 · `10_FinProcess_22_PostPeriods_PeriodClose`
  - 044 · `10_FinProcess_31_InternalRecon_InternalRecon_ES`

#### M18 · Tesorería: cobros, pagos y conciliación bancaria

- **Propósito:** Gestionar medios de pago, pagos masivos y conciliar contra el extracto del banco.
- **Pregunta de negocio:** ¿Cuánta caja tengo realmente y qué falta conciliar?
- **Requiere:** M17
- **Manuales de origen:**
  - 028 · `10_BankProcess_11_Handling_Payments_ES`
  - 029 · `10_BankProcess_12_Payments_Payment Wizard_ES`
  - 030 · `10_BankProcess_21_BankReconcile_Overview_ES`

#### M19 · Activos fijos

- **Propósito:** Capitalizar, depreciar, ajustar y dar de baja activos con su impacto contable.
- **Pregunta de negocio:** ¿Cuánto vale hoy cada activo y cuándo deja de ser útil?
- **Requiere:** M16
- **Manuales de origen:**
  - 051 · `10_FixedAsset_11_FixedAsset_Intro_ES`
  - 052 · `10_FixedAsset_12_FixedAsset_Intro_Virtual_Asset_ES`
  - 053 · `10_FixedAsset_21_FixedAsset_InitSettings`
  - 054 · `10_FixedAsset_31_WorkingProcessFA_Activate_AssetMD`
  - 055 · `10_FixedAsset_32_WorkingProcessFA_Depreciation_Adjustments`
  - 056 · `10_FixedAsset_33_WorkingProcessFA_Retirement_Monitoring`

### C07 · Control de Gestión, Costos y Analítica [ARQ]

Leer y verificar informes, costear, presupuestar y consultar datos.

#### M20 · Informes financieros y de caja

- **Propósito:** Leer balances, flujo de caja, antigüedad de saldos y cobranza, y saber comprobarlos.
- **Pregunta de negocio:** ¿Puedo confiar en este informe?
- **Requiere:** M17
- **Manuales de origen:**
  - 031 · `10_ControlReports_11_FinReports_FinReports_ES`
  - 032 · `10_ControlReports_21_CashReports_cashflow_ES`
  - 033 · `10_ControlReports_22_CashReports_Aging_ES`
  - 034 · `10_ControlReports_23_CashReports_Dunning`
- **Clases propias de la academia:**
  - Cómo verificar un informe: cuadre de auxiliares contra mayor

#### M21 · Costos, dimensiones y presupuestos

- **Propósito:** Analizar costos por centro y dimensión, ajustar costos y controlar presupuestos.
- **Pregunta de negocio:** ¿Qué áreas y productos generan o consumen margen?
- **Requiere:** M20
- **Manuales de origen:**
  - 035 · `10_CostandBudget_11_CostAcc_CostAcc_ES`
  - 036 · `10_CostandBudget_12_CostAcc_MultiDimensions_ES`
  - 037 · `10_CostandBudget_13_CostAcc_CostAdjustment`
  - 038 · `10_CostandBudget_21_Budget_Budget`
- **Clases propias de la academia:**
  - Costos fijos y variables: cómo clasificarlos en cuentas y centros de costo
  - Punto de equilibrio y margen de contribución con datos del sistema

#### M22 · Consultas y analítica

- **Propósito:** Construir consultas propias y entender la capa analítica y los indicadores.
- **Pregunta de negocio:** ¿Cómo obtengo la respuesta que ningún informe estándar me da?
- **Requiere:** M01
- **Manuales de origen:**
  - 004 · `10_Impl_11_CustomTools_Queries_ES`
  - 010 · `10_Impl_17_CustomTools_IntroAnalytics_ES`
  - 115 · `CSI08_Query Practice_Solutions`
  - 116 · `CSI08_Query_Practice`
- **Clases propias de la academia:**
  - Indicadores gerenciales: rotación de inventario, DSO/DPO y clasificación ABC

### C08 · Servicio al Cliente y Proyectos [OP]

CRM, postventa con SLA y proyectos con facturación por hitos.

#### M09 · CRM y servicio postventa

- **Propósito:** Gestionar oportunidades, tarjetas de equipo, contratos de servicio y llamadas con SLA.
- **Pregunta de negocio:** ¿Cómo cuido al cliente antes y después de la venta?
- **Requiere:** M07
- **Manuales de origen:**
  - 109 · `10_Sales_31_CRM_CRM_ES`
  - 113 · `10_Service_11_CSProcess_Process_ES`

#### M23 · Gestión de proyectos y facturación por hitos

- **Propósito:** Controlar etapas, presupuesto y facturación de proyectos con visión de rentabilidad.
- **Pregunta de negocio:** ¿Está siendo rentable este proyecto hoy, no al final del mes?
- **Requiere:** M07, M05
- **Manuales de origen:**
  - 096 · `10_ProjectManage_11_ProjectManage`
  - 097 · `10_ProjectManage_11_ProjectManage_Billing`

### C09 · Consultoría, Implementación y Administración [ARQ]

Implementar, migrar, asegurar, personalizar y dar soporte.

#### M24 · Metodología y arranque de implementación

- **Propósito:** Planificar una implementación, configurar los parámetros clave y cargar saldos de apertura.
- **Pregunta de negocio:** ¿Qué decisiones de arranque no tienen marcha atrás?
- **Requiere:** M01
- **Manuales de origen:**
  - 011 · `10_Impl_21_ImplTools_ImplementationMethodology_ES`
  - 012 · `10_Impl_22_ImplTools_ExpressWizard_ES`
  - 013 · `10_Impl_23_ImplTools_Key_Settings_ES`
  - 014 · `10_Impl_25_ImplTools_OpeningBalances`
  - 015 · `10_Impl_26_ImplTools_QuickCopy`

#### M25 · Migración de datos (DTW y Excel)

- **Propósito:** Cargar datos maestros y documentos desde Excel sin duplicar saldos.
- **Pregunta de negocio:** ¿Cómo migro la historia de la empresa sin corromper la contabilidad?
- **Requiere:** M24
- **Manuales de origen:**
  - 016 · `10_Impl_31_ImportfromExcel`
  - 019 · `10_Impl_32_Using_Data_Trans_Workbench`
  - 020 · `10_Impl_33_Importing_Docs_using_DTW`

#### M26 · Usuarios, autorizaciones y numeración

- **Propósito:** Controlar quién ve y hace qué, y cómo se numeran documentos y maestros.
- **Pregunta de negocio:** ¿Quién puede ver qué dato de mi empresa?
- **Requiere:** M24
- **Manuales de origen:**
  - 017 · `10_Impl_31_SystemSetup_Users_Groups_ES`
  - 018 · `10_Impl_32_SystemSetup_GeneralAuthorizations_ES`
  - 021 · `10_Impl_33_SystemSetup_DataOwnership_ES`
  - 022 · `10_Impl_34_SystemSetup_DocumentMasterDataNumbering_ES`

#### M27 · Campos, valores y tablas definidos por el usuario

- **Propósito:** Extender el sistema con campos, valores y tablas propias sin romper el soporte.
- **Pregunta de negocio:** ¿Cómo adapto SAP a lo que mi negocio necesita registrar?
- **Requiere:** M26
- **Manuales de origen:**
  - 007 · `10_Impl_14_CustomTools_UserDefinedFields_ES`
  - 008 · `10_Impl_15_CustomTools_UserDefinedValues_ES`
  - 009 · `10_Impl_16_CustomTools_UserDefinedTables_ES`

#### M28 · Alertas, aprobaciones y plantillas del sistema

- **Propósito:** Automatizar avisos y aprobaciones y personalizar impresión, correo y pantallas.
- **Pregunta de negocio:** ¿Cómo hago que el sistema avise y controle por excepción?
- **Requiere:** M26
- **Manuales de origen:**
  - 005 · `10_Impl_12_CustomTools_Alerts_ES`
  - 006 · `10_Impl_13_CustomTools_ApprovalProcesses_ES`
  - 023 · `10_Impl_35_SystemSetup_UIConfigurationTemplates_ES`
  - 024 · `10_Impl_36_SystemSetup_Print_layouts`
  - 025 · `10_Impl_39_SystemSetup_EmailPrefrences`

#### M29 · Soporte técnico y plataforma RSP

- **Propósito:** Diagnosticar, documentar y escalar incidentes con el modelo N1/N2/N3.
- **Pregunta de negocio:** ¿Cuándo es un error del sistema y cuándo es un error de uso?
- **Requiere:** M24
- **Manuales de origen:**
  - 114 · `10_Support_11_SupportProcTool_ES`

### C10 · Localización Ecuador (SRI) [ARQ] — propuesto

Comprobantes electrónicos, retenciones y ATS (no cubierto por los manuales).

#### M30 · Facturación electrónica y retenciones SRI *(propuesto)*

- **Propósito:** Emitir comprobantes electrónicos y aplicar retenciones en la fuente en SAP B1.
- **Pregunta de negocio:** ¿Cómo cumplo con el SRI sin trabajo manual?
- **Requiere:** M07, M16

#### M31 · ATS y formularios SRI *(propuesto)*

- **Propósito:** Generar el ATS y cruzarlo contra los formularios 103 y 104.
- **Pregunta de negocio:** ¿Mis declaraciones coinciden con mi contabilidad?
- **Requiere:** M30

## Índice inverso: manual → módulo

| # | Manual | Módulo |
|---:|---|---|
| 1 | `10_Intro_11_Overview_IntroSAPB1_ES` | M01 |
| 2 | `10_Intro_12_Overview_GettingStarted_ES` | M01 |
| 3 | `10_Overview_13_MDDoc_ES` | M01 |
| 4 | `10_Impl_11_CustomTools_Queries_ES` | M22 |
| 5 | `10_Impl_12_CustomTools_Alerts_ES` | M28 |
| 6 | `10_Impl_13_CustomTools_ApprovalProcesses_ES` | M28 |
| 7 | `10_Impl_14_CustomTools_UserDefinedFields_ES` | M27 |
| 8 | `10_Impl_15_CustomTools_UserDefinedValues_ES` | M27 |
| 9 | `10_Impl_16_CustomTools_UserDefinedTables_ES` | M27 |
| 10 | `10_Impl_17_CustomTools_IntroAnalytics_ES` | M22 |
| 11 | `10_Impl_21_ImplTools_ImplementationMethodology_ES` | M24 |
| 12 | `10_Impl_22_ImplTools_ExpressWizard_ES` | M24 |
| 13 | `10_Impl_23_ImplTools_Key_Settings_ES` | M24 |
| 14 | `10_Impl_25_ImplTools_OpeningBalances` | M24 |
| 15 | `10_Impl_26_ImplTools_QuickCopy` | M24 |
| 16 | `10_Impl_31_ImportfromExcel` | M25 |
| 17 | `10_Impl_31_SystemSetup_Users_Groups_ES` | M26 |
| 18 | `10_Impl_32_SystemSetup_GeneralAuthorizations_ES` | M26 |
| 19 | `10_Impl_32_Using_Data_Trans_Workbench` | M25 |
| 20 | `10_Impl_33_Importing_Docs_using_DTW` | M25 |
| 21 | `10_Impl_33_SystemSetup_DataOwnership_ES` | M26 |
| 22 | `10_Impl_34_SystemSetup_DocumentMasterDataNumbering_ES` | M26 |
| 23 | `10_Impl_35_SystemSetup_UIConfigurationTemplates_ES` | M28 |
| 24 | `10_Impl_36_SystemSetup_Print_layouts` | M28 |
| 25 | `10_Impl_39_SystemSetup_EmailPrefrences` | M28 |
| 26 | `10_AccBasics_11_AccBasics_Financial_Basics_ES` | M02 |
| 27 | `10_AccBasics_12_AccBasics_Automatic_Journal_Entries_ES` | M02 |
| 28 | `10_BankProcess_11_Handling_Payments_ES` | M18 |
| 29 | `10_BankProcess_12_Payments_Payment Wizard_ES` | M18 |
| 30 | `10_BankProcess_21_BankReconcile_Overview_ES` | M18 |
| 31 | `10_ControlReports_11_FinReports_FinReports_ES` | M20 |
| 32 | `10_ControlReports_21_CashReports_cashflow_ES` | M20 |
| 33 | `10_ControlReports_22_CashReports_Aging_ES` | M20 |
| 34 | `10_ControlReports_23_CashReports_Dunning` | M20 |
| 35 | `10_CostandBudget_11_CostAcc_CostAcc_ES` | M21 |
| 36 | `10_CostandBudget_12_CostAcc_MultiDimensions_ES` | M21 |
| 37 | `10_CostandBudget_13_CostAcc_CostAdjustment` | M21 |
| 38 | `10_CostandBudget_21_Budget_Budget` | M21 |
| 39 | `10_FinProcess_11_PostJE_PostJE_ES` | M17 |
| 40 | `10_FinProcess_12_PostJE_template_ES` | M17 |
| 41 | `10_FinProcess_13_PostJE_voucher_ES` | M17 |
| 42 | `10_FinProcess_21_PostPeriods_PostPeriods_ES` | M17 |
| 43 | `10_FinProcess_22_PostPeriods_PeriodClose` | M17 |
| 44 | `10_FinProcess_31_InternalRecon_InternalRecon_ES` | M17 |
| 45 | `10_FinSetup_11_COA_COAConcepts_ES` | M16 |
| 46 | `10_FinSetup_11_Currencies_Currencies_ES` | M16 |
| 47 | `10_FinSetup_12_COA_ManageCOA` | M16 |
| 48 | `10_FinSetup_21_DefaultGLAcc_DefaultGLAccOveriew_ES` | M16 |
| 49 | `10_FinSetup_22_DefaultGLAcc_Traditional` | M16 |
| 50 | `10_FinSetup_23_DefaultGLAcc_Advanced` | M16 |
| 51 | `10_FixedAsset_11_FixedAsset_Intro_ES` | M19 |
| 52 | `10_FixedAsset_12_FixedAsset_Intro_Virtual_Asset_ES` | M19 |
| 53 | `10_FixedAsset_21_FixedAsset_InitSettings` | M19 |
| 54 | `10_FixedAsset_31_WorkingProcessFA_Activate_AssetMD` | M19 |
| 55 | `10_FixedAsset_32_WorkingProcessFA_Depreciation_Adjustments` | M19 |
| 56 | `10_FixedAsset_33_WorkingProcessFA_Retirement_Monitoring` | M19 |
| 57 | `10_ItemInv_11_Item_ItemMD_ES` | M03 |
| 58 | `10_ItemInv_12_Item_ItemGrp_ES` | M03 |
| 59 | `10_ItemInv_21_UoM_Overview_ES` | M04 |
| 60 | `10_ItemInv_31_WM_WH_ES` | M10 |
| 61 | `10_ItemInv_32_WM_GM_ES` | M10 |
| 62 | `10_ItemInv_41_Valuation_ValMethods_ES` | M11 |
| 63 | `10_ItemInv_51_SNBatch_SNBatch_ES` | M11 |
| 64 | `10_Item_22_UoM_Setup` | M04 |
| 65 | `10_Item_23_UoM_Weight` | M04 |
| 66 | `10_Item_24_UoM_Packaging` | M04 |
| 67 | `10_Item_42_SNBatch_Valuation` | M11 |
| 68 | `10_Inven_13_WM_PhyInv` | M10 |
| 69 | `10_Inven_21_PNP_PNPSales` | M10 |
| 70 | `10_Inven_22_PNP_PNPProduction` | M10 |
| 71 | `10_Inven_23_PNP_PNPTTransfer` | M10 |
| 72 | `10_BinLoc_11_Overview_Overview_ES` | M12 |
| 73 | `10_BinLoc_12_Setup_Setup` | M12 |
| 74 | `10_BinLoc_13_Process_Process` | M12 |
| 75 | `10_BinLoc_14_Process_Weight` | M12 |
| 76 | `10_BinLoc_15_Reporting_Reporting` | M12 |
| 77 | `10_BinLoc_16_Serial_Serial` | M12 |
| 78 | `10_MRP_11_MRP_Process_ES` | M15 |
| 79 | `10_MRP_12_ConsumeForecast` | M15 |
| 80 | `10_MRP_13_MRP_BOM` | M15 |
| 81 | `10_Pricing_11_Concept_PrConcept_ES` | M08 |
| 82 | `10_Pricing_21_Pricelist_CreatePricelist_ES` | M08 |
| 83 | `10_Pricing_22_Pricelist_UpdatePricelist_ES` | M08 |
| 84 | `10_Pricing_31_DiscSP_PerVolDisc_ES` | M08 |
| 85 | `10_Pricing_32_DiscSP_DiscGrp_ES` | M08 |
| 86 | `10_Pricing_33_DiscSP_SpPrBP_ES` | M08 |
| 87 | `10_Production_11_Overview_Overview_ES` | M13 |
| 88 | `10_Production_21_Resources_Resources_ES` | M13 |
| 89 | `10_Production_22_Resources_Capacity_ES` | M13 |
| 90 | `10_Production_31_BOM_BOM_ES` | M13 |
| 91 | `10_Production_41_Process_BasicProductionProcess_ES` | M13 |
| 92 | `10_Production_42_Process_ByProductsandAdditional` | M13 |
| 93 | `10_Production_42_Process_RoutingProductionProcess_ES` | M13 |
| 94 | `10_Production_51_Accounting_Accounting` | M14 |
| 95 | `10_Production_52_Accounting_Cost` | M14 |
| 96 | `10_ProjectManage_11_ProjectManage` | M23 |
| 97 | `10_ProjectManage_11_ProjectManage_Billing` | M23 |
| 98 | `10_Purch_11_Process_Process_ES` | M05 |
| 99 | `10_Purch_12_Process_Items_ES` | M05 |
| 100 | `10_Purch_13_Process_PurchaseReqQt` | M05 |
| 101 | `10_Purch_14_Process_Services` | M05 |
| 102 | `10_Purch_21_Issues_GRPO_ES` | M05 |
| 103 | `10_Purch_22_Issues_ReturnsCM_ES` | M05 |
| 104 | `10_Purch_32_LandedCost_Freight` | M06 |
| 105 | `10_Purch_32_LandedCost_ManageLandedCosts` | M06 |
| 106 | `10_Sales_11_Process_Overview_ES` | M07 |
| 107 | `10_Sales_12_Process_Order2Cash_ES` | M07 |
| 108 | `10_Sales_21_Cust_Customers_ES` | M03 |
| 109 | `10_Sales_31_CRM_CRM_ES` | M09 |
| 110 | `10_Sales_41_Process_Autom_ES` | M07 |
| 111 | `10_Sales_51_Issues_ReturnsExchange_ES` | M07 |
| 112 | `10_Sales_52_Issues_CM_ES` | M07 |
| 113 | `10_Service_11_CSProcess_Process_ES` | M09 |
| 114 | `10_Support_11_SupportProcTool_ES` | M29 |
| 115 | `CSI08_Query Practice_Solutions` | M22 |
| 116 | `CSI08_Query_Practice` | M22 |
| 117 | `CSL01_Introduction_ES` | M01 |
| 118 | `CSL01_Introduction_Solution_ES` | M01 |
| 119 | `CSL02_Procurement_Process_ES` | M05 |
| 120 | `CSL02_Procurement_Process_Solution_ES` | M05 |
