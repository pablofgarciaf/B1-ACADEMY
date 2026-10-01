# 📚 PLAN MAESTRO: CLASES MAGISTRALES PEDAGÓGICAS SAP BUSINESS ONE (121 MANUALES)

> **PROPÓSITO DE ESTE DOCUMENTO:**
> Este archivo es la **única fuente de verdad** y la **bitácora de progreso** para la transformación pedagógica de toda la academia SAP Business One.
> Si en algún momento la sesión se interrumpe o deseas alternar entre modelos de IA (Claude, ChatGPT, Antigravity), puedes copiar este documento íntegro para continuar exactamente en el manual pendiente.

---

## 🎯 1. Estándar Pedagógico No Negociable (Instrucciones para la IA)

Cualquier modelo de IA que elabore las lecciones debe cumplir estas **5 Reglas de Oro**:
1. **Rol del Instructor:** Actúas como un **Consultor Senior y Docente de Élite de SAP Business One**. Explicas la lógica operativa y empresarial detrás de cada módulo.
2. **PROHIBIDO leer números o encabezados mecánicos:** Nunca digas *'Diapositiva 1'*, *'3 Escenario empresarial'*, *'4 Herramientas de servicio'* ni leas el índice.
3. **PROHIBIDO leer viñetas de corrido sin puntuación:** Todo debe enseñarse mediante una narrativa fluida, con ejemplos de negocio (ej. clientes como *OEC Computers*), explicando el *por qué*, el *cómo* y su repercusión contable y operativa.
4. **Puntuación y Prosodia Impecable:** Cada frase debe terminar con su punto (`.`) y estar estructurada con comas para que la voz neuronal realice pausas de respiración y entonación didáctica natural.
5. **Curaduría Visual Inteligente:** Mantener las diapositivas que contengan diagramas de flujo, pantallas del sistema, flujos de documentos y tablas operativas. Cada diapositiva visual seleccionada debe tener entre 20 y 45 segundos de explicación clara.

---

## 🤖 2. Prompt Maestro para ChatGPT / Claude (Para Retomar Manuales)

Si vas a procesar un manual en ChatGPT o Claude, copia y pega el siguiente prompt:

```markdown
Eres un Consultor Senior y Docente Titular de SAP Business One.
Vamos a crear la clase magistral para el manual: [NOMBRE_DEL_MANUAL].
Toma como base las diapositivas y el contenido técnico en public/Capacitacion SAP/[NOMBRE_DEL_MANUAL]/.

Requisitos para el guion (clase_sync.json):
1. Redacta una explicación pedagógica magistral para cada diapositiva útil (sin leer títulos ni números de slide).
2. Explica la lógica empresarial real (impacto en Libro Mayor, tablas del sistema como OJDT/OITM/OCRD, procesos de negocio).
3. Puntuación perfecta con puntos y comas para pausas humanas del motor de voz.
4. Devuelve únicamente el archivo JSON con este formato:
[
  {
    "slide_index": 1,
    "image_file": "nombre_de_la_imagen.webp",
    "script_text": "Texto didáctico con puntuación perfecta..."
  }
]
```

---

## ⚙️ 3. Pipeline Técnico de Renderizado

Una vez generado el archivo `clase_sync.json` con los textos didácticos para el manual, se ejecuta:
```bash
python scratch/pedagogical_lesson_generator.py --manual "[NOMBRE_DEL_MANUAL]"
```

---

## 📋 4. Checklist Maestro de los 121 Manuales

| # | Código del Manual | Diapositivas | Estado |
| :--- | :--- | :---: | :---: |
| 1 | `10_AccBasics_11_AccBasics_Financial_Basics_ES` | 13 | [x] Completado (Clase Pedagógica) |
| 2 | `10_AccBasics_12_AccBasics_Automatic_Journal_Entries_ES` | 12 | [x] Completado (Clase Pedagógica) |
| 3 | `10_BankProcess_11_Handling_Payments_ES` | 17 | [x] Completado (Clase Pedagógica) |
| 4 | `10_BankProcess_12_Payments_Payment Wizard_ES` | 10 | [x] Completado (Clase Pedagógica) |
| 5 | `10_BankProcess_21_BankReconcile_Overview_ES` | 14 | [x] Completado (Clase Pedagógica) |
| 6 | `10_BinLoc_11_Overview_Overview_ES` | 22 | [x] Completado (Clase Pedagógica) |
| 7 | `10_BinLoc_12_Setup_Setup` | 43 | [x] Completado (Clase Pedagógica) |
| 8 | `10_BinLoc_13_Process_Process` | 53 | [x] Completado (Clase Pedagógica) |
| 9 | `10_BinLoc_14_Process_Weight` | 12 | [x] Completado (Clase Pedagógica) |
| 10 | `10_BinLoc_15_Reporting_Reporting` | 20 | [x] Completado (Clase Pedagógica) |
| 11 | `10_BinLoc_16_Serial_Serial` | 30 | [x] Completado (Clase Pedagógica) |
| 12 | `10_ControlReports_11_FinReports_FinReports_ES` | 30 | [x] Completado (Clase Pedagógica) |
| 13 | `10_ControlReports_21_CashReports_cashflow_ES` | 10 | [x] Completado (Clase Pedagógica) |
| 14 | `10_ControlReports_22_CashReports_Aging_ES` | 9 | [x] Completado (Clase Pedagógica) |
| 15 | `10_ControlReports_23_CashReports_Dunning` | 11 | [x] Completado (Clase Pedagógica) |
| 16 | `10_CostandBudget_11_CostAcc_CostAcc_ES` | 15 | [x] Completado (Clase Pedagógica) |
| 17 | `10_CostandBudget_12_CostAcc_MultiDimensions_ES` | 10 | [x] Completado (Clase Pedagógica) |
| 18 | `10_CostandBudget_13_CostAcc_CostAdjustment` | 11 | [x] Completado (Clase Pedagógica) |
| 19 | `10_CostandBudget_21_Budget_Budget` | 22 | [x] Completado (Clase Pedagógica) |
| 20 | `10_FinProcess_11_PostJE_PostJE_ES` | 16 | [x] Completado (Clase Pedagógica) |
| 21 | `10_FinProcess_12_PostJE_template_ES` | 7 | [x] Completado (Clase Pedagógica) |
| 22 | `10_FinProcess_13_PostJE_voucher_ES` | 10 | [x] Completado (Clase Pedagógica) |
| 23 | `10_FinProcess_21_PostPeriods_PostPeriods_ES` | 7 | [x] Completado (Clase Pedagógica) |
| 24 | `10_FinProcess_22_PostPeriods_PeriodClose` | 18 | [x] Completado (Clase Pedagógica) |
| 25 | `10_FinProcess_31_InternalRecon_InternalRecon_ES` | 26 | [x] Completado (Clase Pedagógica) |
| 26 | `10_FinSetup_11_COA_COAConcepts_ES` | 14 | [x] Completado (Clase Pedagógica) |
| 27 | `10_FinSetup_11_Currencies_Currencies_ES` | 21 | [x] Completado (Clase Pedagógica) |
| 28 | `10_FinSetup_12_COA_ManageCOA` | 8 | [x] Completado (Clase Pedagógica) |
| 29 | `10_FinSetup_21_DefaultGLAcc_DefaultGLAccOveriew_ES` | 9 | [x] Completado (Clase Pedagógica) |
| 30 | `10_FinSetup_22_DefaultGLAcc_Traditional` | 9 | [x] Completado (Clase Pedagógica) |
| 31 | `10_FinSetup_23_DefaultGLAcc_Advanced` | 20 | [x] Completado (Clase Pedagógica) |
| 32 | `10_FixedAsset_11_FixedAsset_Intro_ES` | 16 | [x] Completado (Clase Pedagógica) |
| 33 | `10_FixedAsset_12_FixedAsset_Intro_Virtual_Asset_ES` | 10 | [x] Completado (Clase Pedagógica) |
| 34 | `10_FixedAsset_21_FixedAsset_InitSettings` | 32 | [x] Completado (Clase Pedagógica) |
| 35 | `10_FixedAsset_31_WorkingProcessFA_Activate_AssetMD` | 13 | [x] Completado (Clase Pedagógica) |
| 36 | `10_FixedAsset_32_WorkingProcessFA_Depreciation_Adjustments` | 21 | [x] Completado (Clase Pedagógica) |
| 37 | `10_FixedAsset_33_WorkingProcessFA_Retirement_Monitoring` | 13 | [x] Completado (Clase Pedagógica) |
| 38 | `10_Impl_11_CustomTools_Queries_ES` | 36 | [x] Completado (Clase Pedagógica) |
| 39 | `10_Impl_12_CustomTools_Alerts_ES` | 23 | [x] Completado (Clase Pedagógica) |
| 40 | `10_Impl_13_CustomTools_ApprovalProcesses_ES` | 33 | [x] Completado (Clase Pedagógica) |
| 41 | `10_Impl_14_CustomTools_UserDefinedFields_ES` | 28 | [x] Completado (Clase Pedagógica) |
| 42 | `10_Impl_15_CustomTools_UserDefinedValues_ES` | 21 | [x] Completado (Clase Pedagógica) |
| 43 | `10_Impl_16_CustomTools_UserDefinedTables_ES` | 21 | [x] Completado (Clase Pedagógica) |
| 44 | `10_Impl_17_CustomTools_IntroAnalytics_ES` | 45 | [x] Completado (Clase Pedagógica) |
| 45 | `10_Impl_21_ImplTools_ImplementationMethodology_ES` | 34 | [x] Completado (Clase Pedagógica)|
| 46 | `10_Impl_22_ImplTools_ExpressWizard_ES` | 19 | [x] Completado (Clase Pedagógica) |
| 47 | `10_Impl_23_ImplTools_Key_Settings_ES` | 30 | [x] Completado (Clase Pedagógica) |
| 48 | `10_Impl_25_ImplTools_OpeningBalances` | 27 | [x] Completado (Clase Pedagógica) |
| 49 | `10_Impl_26_ImplTools_QuickCopy` | 24 | [x] Completado (Clase Pedagógica) |
| 50 | `10_Impl_31_ImportfromExcel` | 40 | [x] Completado (Clase Pedagógica) |
| 51 | `10_Impl_31_SystemSetup_Users_Groups_ES` | 30 | [x] Completado (Clase Pedagógica) |
| 52 | `10_Impl_32_SystemSetup_GeneralAuthorizations_ES` | 30 | [x] Completado (Clase Pedagógica) |
| 53 | `10_Impl_32_Using_Data_Trans_Workbench` | 42 | [x] Completado (Clase Pedagógica) |
| 54 | `10_Impl_33_Importing_Docs_using_DTW` | 17 | [x] Completado (Clase Pedagógica) |
| 55 | `10_Impl_33_SystemSetup_DataOwnership_ES` | 32 | [x] Completado (Clase Pedagógica)|
| 56 | `10_Impl_34_SystemSetup_DocumentMasterDataNumbering_ES` | 23 | [x] Completado (Clase Pedagógica)|
| 57 | `10_Impl_35_SystemSetup_UIConfigurationTemplates_ES` | 27 | [x] Completado (Clase Pedagógica)|
| 58 | `10_Impl_36_SystemSetup_Print_layouts` | 17 | [x] Completado (Clase Pedagógica)|
| 59 | `10_Impl_39_SystemSetup_EmailPrefrences` | 27 | [x] Completado (Clase Pedagógica)|
| 60 | `10_Intro_11_Overview_IntroSAPB1_ES` | 19 | [x] Completado (Clase Pedagógica)|
| 61 | `10_Intro_12_Overview_GettingStarted_ES` | 29 | [x] Completado (Clase Pedagógica)|
| 62 | `10_Inven_13_WM_PhyInv` | 21 | [x] Completado (Clase Pedagógica)|
| 63 | `10_Inven_21_PNP_PNPSales` | 19 | [x] Completado (Clase Pedagógica)|
| 64 | `10_Inven_22_PNP_PNPProduction` | 11 | [x] Completado (Clase Pedagógica)|
| 65 | `10_Inven_23_PNP_PNPTTransfer` | 9 | [x] Completado (Clase Pedagógica)|
| 66 | `10_ItemInv_11_Item_ItemMD_ES` | 13 | [x] Completado (Clase Pedagógica)|
| 67 | `10_ItemInv_12_Item_ItemGrp_ES` | 10 | [x] Completado (Clase Pedagógica)|
| 68 | `10_ItemInv_21_UoM_Overview_ES` | 12 | [x] Completado (Clase Pedagógica)|
| 69 | `10_ItemInv_31_WM_WH_ES` | 10 | [x] Completado (Clase Pedagógica)|
| 70 | `10_ItemInv_32_WM_GM_ES` | 15 | [x] Completado (Clase Pedagógica)|
| 71 | `10_ItemInv_41_Valuation_ValMethods_ES` | 24 | [x] Completado (Clase Pedagógica)|
| 72 | `10_ItemInv_51_SNBatch_SNBatch_ES` | 11 | [x] Completado (Clase Pedagógica)|
| 73 | `10_Item_22_UoM_Setup` | 17 | [x] Completado (Clase Pedagógica)|
| 74 | `10_Item_23_UoM_Weight` | 14 | [x] Completado (Clase Pedagógica)|
| 75 | `10_Item_24_UoM_Packaging` | 17 | [x] Completado (Clase Pedagógica)|
| 76 | `10_Item_42_SNBatch_Valuation` | 26 | [x] Completado (Clase Pedagógica)|
| 77 | `10_MRP_11_MRP_Process_ES` | 26 | [x] Completado (Clase Pedagógica)|
| 78 | `10_MRP_12_ConsumeForecast` | 26 | [x] Completado (Clase Pedagógica)|
| 79 | `10_MRP_13_MRP_BOM` | 28 | [x] Completado (Clase Pedagógica)|
| 80 | `10_Overview_13_MDDoc_ES` | 14 | [x] Completado (Clase Pedagógica)|
| 81 | `10_Pricing_11_Concept_PrConcept_ES` | 28 | [x] Completado (Clase Pedagógica)|
| 82 | `10_Pricing_21_Pricelist_CreatePricelist_ES` | 19 | [x] Completado (Clase Pedagógica)|
| 83 | `10_Pricing_22_Pricelist_UpdatePricelist_ES` | 29 | [x] Completado (Clase Pedagógica)|
| 84 | `10_Pricing_31_DiscSP_PerVolDisc_ES` | 12 | [x] Completado (Clase Pedagógica)|
| 85 | `10_Pricing_32_DiscSP_DiscGrp_ES` | 26 | [x] Completado (Clase Pedagógica)|
| 86 | `10_Pricing_33_DiscSP_SpPrBP_ES` | 9 | [x] Completado (Clase Pedagógica)|
| 87 | `10_Production_11_Overview_Overview_ES` | 8 | [x] Completado (Clase Pedagógica)|
| 88 | `10_Production_21_Resources_Resources_ES` | 12 | [x] Completado (Clase Pedagógica)|
| 89 | `10_Production_22_Resources_Capacity_ES` | 15 | [x] Completado (Clase Pedagógica)|
| 90 | `10_Production_31_BOM_BOM_ES` | 15 | [x] Completado (Clase Pedagógica)|
| 91 | `10_Production_41_Process_BasicProductionProcess_ES` | 12 | [x] Completado (Clase Pedagógica)|
| 92 | `10_Production_42_Process_ByProductsandAdditional` | 9 | [x] Completado (Clase Pedagógica)|
| 93 | `10_Production_42_Process_RoutingProductionProcess_ES` | 14 | [x] Completado (Clase Pedagógica)|
| 94 | `10_Production_51_Accounting_Accounting` | 11 | [x] Completado (Clase Pedagógica)|
| 95 | `10_Production_52_Accounting_Cost` | 11 | [x] Completado (Clase Pedagógica)|
| 96 | `10_ProjectManage_11_ProjectManage` | 31 | [x] Completado (Clase Pedagógica)|
| 97 | `10_ProjectManage_11_ProjectManage_Billing` | 13 | [x] Completado (Clase Pedagógica)|
| 98 | `10_Purch_11_Process_Process_ES` | 12 | [x] Completado (Clase Pedagógica)|
| 99 | `10_Purch_12_Process_Items_ES` | 25 | [x] Completado (Clase Pedagógica)|
| 100 | `10_Purch_13_Process_PurchaseReqQt` | 16 | [x] Completado (Clase Pedagógica)|
| 101 | `10_Purch_14_Process_Services` | 15 | [x] Completado (Clase Pedagógica) |
| 102 | `10_Purch_21_Issues_GRPO_ES` | 10 | [x] Completado (Clase Pedagógica) |
| 103 | `10_Purch_22_Issues_ReturnsCM_ES` | 15 | [x] Completado (Clase Pedagógica) |
| 104 | `10_Purch_32_LandedCost_Freight` | 30 | [x] Completado (Clase Pedagógica) |
| 105 | `10_Purch_32_LandedCost_ManageLandedCosts` | 31 | [x] Completado (Clase Pedagógica) |
| 106 | `10_Sales_11_Process_Overview_ES` | 14 | [x] Completado (Clase Pedagógica) |
| 107 | `10_Sales_12_Process_Order2Cash_ES` | 16 | [x] Completado (Clase Pedagógica) |
| 108 | `10_Sales_21_Cust_Customers_ES` | 15 | [x] Completado (Clase Pedagógica) |
| 109 | `10_Sales_31_CRM_CRM_ES` | 19 | [x] Completado (Clase Pedagógica) |
| 110 | `10_Sales_41_Process_Autom_ES` | 30 | [x] Completado (Clase Pedagógica) |
| 111 | `10_Sales_51_Issues_ReturnsExchange_ES` | 16 | [x] Completado (Clase Pedagógica) |
| 112 | `10_Sales_52_Issues_CM_ES` | 15 | [x] Completado (Clase Pedagógica)|
| 113 | `10_Service_11_CSProcess` | 0 | ⚪ Sin diapositivas (Caso Práctico / SQL) |
| 114 | `10_Service_11_CSProcess_Process_ES` | 28 | [x] Completado (Clase Pedagógica)|
| 115 | `10_Support_11_SupportProcTool_ES` | 28 | [x] Completado (Clase Pedagógica)|
| 116 | `CSI08_Query Practice_Solutions` | 0 | ⚪ Sin diapositivas (Caso Práctico / SQL) |
| 117 | `CSI08_Query_Practice` | 0 | ⚪ Sin diapositivas (Caso Práctico / SQL) |
| 118 | `CSL01_Introduction_ES` | 0 | ⚪ Sin diapositivas (Caso Práctico / SQL) |
| 119 | `CSL01_Introduction_Solution_ES` | 0 | ⚪ Sin diapositivas (Caso Práctico / SQL) |
| 120 | `CSL02_Procurement_Process_ES` | 0 | ⚪ Sin diapositivas (Caso Práctico / SQL) |
| 121 | `CSL02_Procurement_Process_Solution_ES` | 0 | ⚪ Sin diapositivas (Caso Práctico / SQL) |

---

## 🔗 Enlaces Relacionados (Obsidian Vault)

- [[06_LMS_Architecture]] - Arquitectura general del LMS y flujo de lecciones.
- [[06_Manuales]] - Catálogo e índice de los 120 manuales SAP Business One.
- [[07_Reconstruccion_Manuales_CS]] - Reconstrucción técnica de manuales prácticos CS.
- [[08_B1_Secure_Exam_App]] - Arquitectura de evaluación segura y aplicación de certificación.
- [[09_Simulador_Integral_Desktop]] - Simulador integral de escritorio SAP B1 y atlas visual.

