"""
Script definitivo para generar manuals-120-data.ts
con títulos 100% en español, resúmenes extraídos del contenido real,
y estructura compatible con la UI existente.
"""
import os
import json
import re

base_dir = r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP'
out_file = r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\src\lib\manuals-120-data.ts'

skip_folders = ['01_Revision_BUENAS', '02_Revision_MALAS_CUARENTENA', 'para corregir', '10_Service_11_CSProcess']

# ═══════════════════════════════════════════════════════════════════
# TÍTULOS MANUALES EN ESPAÑOL (escritos a mano, uno por uno)
# ═══════════════════════════════════════════════════════════════════
MANUAL_TITLES = {
    # --- CONTABILIDAD BÁSICA ---
    '10_AccBasics_11_AccBasics_Financial_Basics_ES': 'Conceptos Financieros Básicos',
    '10_AccBasics_12_AccBasics_Automatic_Journal_Entries_ES': 'Asientos Contables Automáticos',
    
    # --- GESTIÓN BANCARIA Y PAGOS ---
    '10_BankProcess_11_Handling_Payments_ES': 'Gestión de Pagos Recibidos y Emitidos',
    '10_BankProcess_12_Payments_Payment Wizard_ES': 'Asistente de Pagos (Payment Wizard)',
    '10_BankProcess_21_BankReconcile_Overview_ES': 'Reconciliación Bancaria',
    
    # --- UBICACIONES EN ALMACÉN (BIN LOCATIONS) ---
    '10_BinLoc_11_Overview_Overview_ES': 'Ubicaciones de Almacén: Visión General',
    '10_BinLoc_12_Setup_Setup': 'Ubicaciones de Almacén: Configuración',
    '10_BinLoc_13_Process_Process': 'Ubicaciones de Almacén: Proceso Operativo',
    '10_BinLoc_14_Process_Weight': 'Ubicaciones de Almacén: Gestión por Peso',
    '10_BinLoc_15_Reporting_Reporting': 'Ubicaciones de Almacén: Informes',
    '10_BinLoc_16_Serial_Serial': 'Ubicaciones de Almacén: Números de Serie',
    
    # --- INFORMES FINANCIEROS ---
    '10_ControlReports_11_FinReports_FinReports_ES': 'Informes Financieros del Sistema',
    '10_ControlReports_21_CashReports_cashflow_ES': 'Informe de Flujo de Caja',
    '10_ControlReports_22_CashReports_Aging_ES': 'Antigüedad de Saldos (Aging Report)',
    '10_ControlReports_23_CashReports_Dunning': 'Proceso de Reclamaciones (Dunning)',
    
    # --- COSTOS Y PRESUPUESTOS ---
    '10_CostandBudget_11_CostAcc_CostAcc_ES': 'Contabilidad de Costos',
    '10_CostandBudget_12_CostAcc_MultiDimensions_ES': 'Centros de Costo: Múltiples Dimensiones',
    '10_CostandBudget_13_CostAcc_CostAdjustment': 'Ajuste de Costos de Inventario',
    '10_CostandBudget_21_Budget_Budget': 'Gestión de Presupuestos',
    
    # --- PROCESOS FINANCIEROS ---
    '10_FinProcess_11_PostJE_PostJE_ES': 'Registro de Asientos Contables',
    '10_FinProcess_12_PostJE_template_ES': 'Plantillas de Asientos Recurrentes',
    '10_FinProcess_13_PostJE_voucher_ES': 'Documentos Preliminares (Vouchers)',
    '10_FinProcess_21_PostPeriods_PostPeriods_ES': 'Periodos Contables y Ejercicios',
    '10_FinProcess_22_PostPeriods_PeriodClose': 'Cierre de Periodo Contable',
    '10_FinProcess_31_InternalRecon_InternalRecon_ES': 'Reconciliación Interna de Cuentas',
    
    # --- CONFIGURACIÓN FINANCIERA ---
    '10_FinSetup_11_COA_COAConcepts_ES': 'Plan de Cuentas: Conceptos Fundamentales',
    '10_FinSetup_11_Currencies_Currencies_ES': 'Configuración de Monedas y Tipos de Cambio',
    '10_FinSetup_12_COA_ManageCOA': 'Gestión del Plan de Cuentas',
    '10_FinSetup_21_DefaultGLAcc_DefaultGLAccOveriew_ES': 'Cuentas de Mayor por Defecto: Visión General',
    '10_FinSetup_22_DefaultGLAcc_Traditional': 'Cuentas de Mayor por Defecto: Modo Tradicional',
    '10_FinSetup_23_DefaultGLAcc_Advanced': 'Cuentas de Mayor por Defecto: Modo Avanzado',
    
    # --- ACTIVOS FIJOS ---
    '10_FixedAsset_11_FixedAsset_Intro_ES': 'Activos Fijos: Introducción',
    '10_FixedAsset_12_FixedAsset_Intro_Virtual_Asset_ES': 'Activos Fijos Virtuales',
    '10_FixedAsset_21_FixedAsset_InitSettings': 'Activos Fijos: Configuración Inicial',
    '10_FixedAsset_31_WorkingProcessFA_Activate_AssetMD': 'Activos Fijos: Activación y Datos Maestros',
    '10_FixedAsset_32_WorkingProcessFA_Depreciation_Adjustments': 'Activos Fijos: Depreciación y Ajustes',
    '10_FixedAsset_33_WorkingProcessFA_Retirement_Monitoring': 'Activos Fijos: Bajas y Monitoreo',
    
    # --- IMPLEMENTACIÓN Y CONFIGURACIÓN ---
    '10_Impl_11_CustomTools_Queries_ES': 'Consultas Personalizadas (Queries)',
    '10_Impl_12_CustomTools_Alerts_ES': 'Sistema de Alertas Automáticas',
    '10_Impl_13_CustomTools_ApprovalProcesses_ES': 'Procesos de Aprobación',
    '10_Impl_14_CustomTools_UserDefinedFields_ES': 'Campos Definidos por el Usuario (UDF)',
    '10_Impl_15_CustomTools_UserDefinedValues_ES': 'Valores Definidos por el Usuario (UDV)',
    '10_Impl_16_CustomTools_UserDefinedTables_ES': 'Tablas Definidas por el Usuario (UDT)',
    '10_Impl_17_CustomTools_IntroAnalytics_ES': 'Introducción a SAP Analytics',
    '10_Impl_21_ImplTools_ImplementationMethodology_ES': 'Metodología de Implementación SAP',
    '10_Impl_22_ImplTools_ExpressWizard_ES': 'Asistente Express de Configuración',
    '10_Impl_23_ImplTools_Key_Settings_ES': 'Configuraciones Clave del Sistema',
    '10_Impl_25_ImplTools_OpeningBalances': 'Carga de Saldos Iniciales',
    '10_Impl_26_ImplTools_QuickCopy': 'Copia Rápida entre Compañías (Quick Copy)',
    '10_Impl_31_ImportfromExcel': 'Importación de Datos desde Excel',
    '10_Impl_31_SystemSetup_Users_Groups_ES': 'Configuración de Usuarios y Grupos',
    '10_Impl_32_SystemSetup_GeneralAuthorizations_ES': 'Autorizaciones Generales del Sistema',
    '10_Impl_32_Using_Data_Trans_Workbench': 'Uso del Data Transfer Workbench (DTW)',
    '10_Impl_33_Importing_Docs_using_DTW': 'Importación de Documentos con DTW',
    '10_Impl_33_SystemSetup_DataOwnership_ES': 'Propiedad de los Datos (Data Ownership)',
    '10_Impl_34_SystemSetup_DocumentMasterDataNumbering_ES': 'Numeración de Documentos y Datos Maestros',
    '10_Impl_35_SystemSetup_UIConfigurationTemplates_ES': 'Plantillas de Configuración de Interfaz (UI)',
    '10_Impl_36_SystemSetup_Print_layouts': 'Diseños de Impresión (Print Layouts)',
    '10_Impl_39_SystemSetup_EmailPrefrences': 'Preferencias de Correo Electrónico',
    
    # --- INTRODUCCIÓN ---
    '10_Intro_11_Overview_IntroSAPB1_ES': 'Introducción a SAP Business One',
    '10_Intro_12_Overview_GettingStarted_ES': 'Primeros Pasos en SAP Business One',
    
    # --- INVENTARIOS ---
    '10_Inven_13_WM_PhyInv': 'Inventario Físico: Conteo y Ajuste',
    '10_Inven_21_PNP_PNPSales': 'Proceso de Picking y Packing: Ventas',
    '10_Inven_22_PNP_PNPProduction': 'Proceso de Picking y Packing: Producción',
    '10_Inven_23_PNP_PNPTTransfer': 'Proceso de Picking y Packing: Transferencias',
    
    # --- DATOS MAESTROS DE ARTÍCULO ---
    '10_ItemInv_11_Item_ItemMD_ES': 'Datos Maestros de Artículos',
    '10_ItemInv_12_Item_ItemGrp_ES': 'Grupos de Artículos',
    '10_ItemInv_21_UoM_Overview_ES': 'Unidades de Medida: Visión General',
    '10_ItemInv_31_WM_WH_ES': 'Gestión de Almacenes',
    '10_ItemInv_32_WM_GM_ES': 'Movimientos de Mercancía',
    '10_ItemInv_41_Valuation_ValMethods_ES': 'Métodos de Valoración de Inventario',
    '10_ItemInv_51_SNBatch_SNBatch_ES': 'Gestión de Series y Lotes',
    '10_Item_22_UoM_Setup': 'Unidades de Medida: Configuración',
    '10_Item_23_UoM_Weight': 'Unidades de Medida: Gestión por Peso',
    '10_Item_24_UoM_Packaging': 'Unidades de Medida: Empaquetado',
    '10_Item_42_SNBatch_Valuation': 'Series y Lotes: Valoración',
    
    # --- PLANIFICACIÓN MRP ---
    '10_MRP_11_MRP_Process_ES': 'Planificación de Necesidades (MRP): Proceso',
    '10_MRP_12_ConsumeForecast': 'Pronósticos de Consumo y Demanda',
    '10_MRP_13_MRP_BOM': 'MRP y Listas de Materiales (BOM)',
    
    # --- VISIÓN GENERAL ---
    '10_Overview_13_MDDoc_ES': 'Documentos y Datos Maestros: Conceptos Generales',
    
    # --- PRECIOS ---
    '10_Pricing_11_Concept_PrConcept_ES': 'Determinación de Precios: Conceptos',
    '10_Pricing_21_Pricelist_CreatePricelist_ES': 'Creación de Listas de Precios',
    '10_Pricing_22_Pricelist_UpdatePricelist_ES': 'Actualización de Listas de Precios',
    '10_Pricing_31_DiscSP_PerVolDisc_ES': 'Descuentos por Período y Volumen',
    '10_Pricing_32_DiscSP_DiscGrp_ES': 'Grupos de Descuento',
    '10_Pricing_33_DiscSP_SpPrBP_ES': 'Precios Especiales para Socios de Negocio',
    
    # --- PRODUCCIÓN ---
    '10_Production_11_Overview_Overview_ES': 'Producción: Visión General',
    '10_Production_21_Resources_Resources_ES': 'Recursos de Producción',
    '10_Production_22_Resources_Capacity_ES': 'Capacidad de Recursos',
    '10_Production_31_BOM_BOM_ES': 'Lista de Materiales (BOM)',
    '10_Production_41_Process_BasicProductionProcess_ES': 'Proceso Básico de Orden de Producción',
    '10_Production_42_Process_ByProductsandAdditional': 'Subproductos y Costos Adicionales',
    '10_Production_42_Process_RoutingProductionProcess_ES': 'Rutas de Producción (Routing)',
    '10_Production_51_Accounting_Accounting': 'Contabilización de Órdenes de Producción',
    '10_Production_52_Accounting_Cost': 'Análisis de Costos de Producción',
    
    # --- GESTIÓN DE PROYECTOS ---
    '10_ProjectManage_11_ProjectManage': 'Gestión de Proyectos',
    '10_ProjectManage_11_ProjectManage_Billing': 'Facturación de Proyectos',
    
    # --- COMPRAS ---
    '10_Purch_11_Process_Process_ES': 'Proceso de Compras: Visión General',
    '10_Purch_12_Process_Items_ES': 'Compras: Artículos y Documentos',
    '10_Purch_13_Process_PurchaseReqQt': 'Solicitudes de Compra y Cotizaciones',
    '10_Purch_14_Process_Services': 'Compras de Servicios',
    '10_Purch_21_Issues_GRPO_ES': 'Entrada de Mercancías (GRPO)',
    '10_Purch_22_Issues_ReturnsCM_ES': 'Devoluciones y Notas de Crédito (Compras)',
    '10_Purch_32_LandedCost_Freight': 'Costos de Importación: Fletes',
    '10_Purch_32_LandedCost_ManageLandedCosts': 'Gestión de Costos de Importación (Landed Costs)',
    
    # --- VENTAS ---
    '10_Sales_11_Process_Overview_ES': 'Proceso de Ventas: Visión General',
    '10_Sales_12_Process_Order2Cash_ES': 'De Pedido a Cobro (Order to Cash)',
    '10_Sales_21_Cust_Customers_ES': 'Datos Maestros de Clientes',
    '10_Sales_31_CRM_CRM_ES': 'Gestión de Relaciones con Clientes (CRM)',
    '10_Sales_41_Process_Autom_ES': 'Automatización del Proceso de Ventas',
    '10_Sales_51_Issues_ReturnsExchange_ES': 'Devoluciones y Cambios (Ventas)',
    '10_Sales_52_Issues_CM_ES': 'Notas de Crédito (Ventas)',
    
    # --- SERVICIOS ---
    '10_Service_11_CSProcess_Process_ES': 'Gestión de Llamadas de Servicio',
    
    # --- SOPORTE ---
    '10_Support_11_SupportProcTool_ES': 'Herramientas de Soporte y Diagnóstico',
    
    # --- CASOS PRÁCTICOS ---
    'CSI08_Query Practice_Solutions': 'Práctica de Consultas SQL: Soluciones',
    'CSI08_Query_Practice': 'Práctica de Consultas SQL',
    'CSL01_Introduction_ES': 'Caso Práctico: Introducción',
    'CSL01_Introduction_Solution_ES': 'Caso Práctico: Introducción (Solución)',
    'CSL02_Procurement_Process_ES': 'Caso Práctico: Proceso de Aprovisionamiento',
    'CSL02_Procurement_Process_Solution_ES': 'Caso Práctico: Aprovisionamiento (Solución)',
}

# ═══════════════════════════════════════════════════════════════════
# CATEGORÍAS EN ESPAÑOL
# ═══════════════════════════════════════════════════════════════════
CATEGORIES = {
    '10_AccBasics': {'name': 'Contabilidad Básica', 'icon': '📊', 'order': 3},
    '10_BankProcess': {'name': 'Gestión Bancaria y Pagos', 'icon': '🏦', 'order': 4},
    '10_BinLoc': {'name': 'Ubicaciones en Almacén (Bin Locations)', 'icon': '📦', 'order': 14},
    '10_ControlReports': {'name': 'Informes Financieros y Control', 'icon': '📈', 'order': 5},
    '10_CostandBudget': {'name': 'Costos y Presupuestos', 'icon': '💰', 'order': 6},
    '10_FinProcess': {'name': 'Procesos Financieros', 'icon': '🔄', 'order': 7},
    '10_FinSetup': {'name': 'Configuración Financiera', 'icon': '⚙️', 'order': 8},
    '10_FixedAsset': {'name': 'Activos Fijos', 'icon': '🏢', 'order': 9},
    '10_Impl': {'name': 'Implementación y Configuración', 'icon': '🛠️', 'order': 2},
    '10_Intro': {'name': 'Introducción a SAP Business One', 'icon': '🎓', 'order': 1},
    '10_Inven': {'name': 'Inventarios y Movimientos', 'icon': '📋', 'order': 13},
    '10_Item': {'name': 'Datos Maestros de Artículo', 'icon': '🏷️', 'order': 11},
    '10_ItemInv': {'name': 'Gestión de Inventario y Artículos', 'icon': '📦', 'order': 10},
    '10_MRP': {'name': 'Planificación de Materiales (MRP)', 'icon': '📐', 'order': 15},
    '10_Overview': {'name': 'Visión General del Sistema', 'icon': '🗺️', 'order': 1},
    '10_Pricing': {'name': 'Determinación de Precios', 'icon': '🏷️', 'order': 16},
    '10_Production': {'name': 'Producción', 'icon': '🏭', 'order': 17},
    '10_ProjectManage': {'name': 'Gestión de Proyectos', 'icon': '📊', 'order': 18},
    '10_Purch': {'name': 'Compras y Aprovisionamiento', 'icon': '🛒', 'order': 19},
    '10_Sales': {'name': 'Ventas', 'icon': '💼', 'order': 20},
    '10_Service': {'name': 'Gestión de Servicios', 'icon': '🔧', 'order': 21},
    '10_Support': {'name': 'Herramientas de Soporte', 'icon': '🆘', 'order': 22},
    'CSI': {'name': 'Casos Prácticos y Ejercicios', 'icon': '✏️', 'order': 23},
    'CSL': {'name': 'Casos Prácticos y Ejercicios', 'icon': '✏️', 'order': 23},
}

def get_category(folder_name):
    for key in sorted(CATEGORIES.keys(), key=len, reverse=True):
        if folder_name.startswith(key):
            return CATEGORIES[key]
    return {'name': 'General', 'icon': '📄', 'order': 99}

def extract_summary(folder_path, folder_name):
    """Extract first meaningful content from _slides.md to create a summary."""
    slides_files = [f for f in os.listdir(folder_path) if f.endswith('_slides.md')]
    if not slides_files:
        return 'Manual de capacitación oficial de SAP Business One.'
    
    try:
        with open(os.path.join(folder_path, slides_files[0]), 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find 'Diapositiva 2' which usually contains the objectives
        match = re.search(r'## Diapositiva 2\s*\n(.*?)(?=\n---|\n## Diapositiva 3)', content, re.DOTALL)
        if match:
            text = match.group(1).strip()
            # Clean up
            text = text.replace('PUBLIC', '').replace('\r\n', ' ').replace('\n', ' ')
            text = re.sub(r'\s+', ' ', text).strip()
            # Extract objectives if present
            obj_match = re.search(r'(?:podrá|objetivos|aprenderá|tema)(.*?)(?:\d+\s*$|$)', text, re.IGNORECASE)
            if obj_match:
                summary = obj_match.group(1).strip()
                if len(summary) > 40:
                    return summary[:200].strip() + ('...' if len(summary) > 200 else '')
            if len(text) > 40:
                return text[:200].strip() + ('...' if len(text) > 200 else '')
        
        # Fallback: use first paragraph of slide 1
        match = re.search(r'## Diapositiva 1\s*\n(.*?)(?=\n---)', content, re.DOTALL)
        if match:
            text = match.group(1).strip()
            text = text.replace('PUBLIC', '').replace('\r\n', ' ').replace('\n', ' ')
            text = re.sub(r'\s+', ' ', text).strip()
            if len(text) > 40:
                return text[:200].strip() + ('...' if len(text) > 200 else '')
    except Exception:
        pass
    
    return 'Manual de capacitación oficial de SAP Business One.'

# ═══════════════════════════════════════════════════════════════════
# GENERAR DATOS
# ═══════════════════════════════════════════════════════════════════
manuals = []
counter = 1

for d in sorted(os.listdir(base_dir)):
    dp = os.path.join(base_dir, d)
    if not os.path.isdir(dp) or d in skip_folders:
        continue
    
    cat_info = get_category(d)
    title = MANUAL_TITLES.get(d, d)
    summary = extract_summary(dp, d)
    
    # Find actual slides md filename
    slides_files = [f for f in os.listdir(dp) if f.endswith('_slides.md')]
    md_filename = slides_files[0] if slides_files else '_slides.md'
    
    # Count images
    img_dir = os.path.join(dp, 'Imagenes_Diapositivas')
    num_slides = len([f for f in os.listdir(img_dir) if f.endswith('.webp')]) if os.path.exists(img_dir) else 0
    
    manuals.append({
        'id': d,
        'number': counter,
        'slug': d.lower().replace('_', '-').replace(' ', '-'),
        'title': title,
        'category': cat_info['name'],
        'categoryIcon': cat_info['icon'],
        'categoryOrder': cat_info['order'],
        'summary': summary,
        'totalSlides': num_slides,
        'pdfPath': f'/Capacitacion SAP/{d}/{d}.pdf',
        'mdPath': f'/Capacitacion SAP/{d}/{md_filename}',
        'imagesPath': f'/Capacitacion SAP/{d}/Imagenes_Diapositivas',
    })
    counter += 1

# Sort by category order then by number
manuals.sort(key=lambda m: (m['categoryOrder'], m['number']))

# Re-number after sort
for i, m in enumerate(manuals):
    m['number'] = i + 1

# Group by category
grouped = {}
for m in manuals:
    cat = m['category']
    if cat not in grouped:
        grouped[cat] = []
    grouped[cat].append(m)

# ═══════════════════════════════════════════════════════════════════
# GENERAR TYPESCRIPT
# ═══════════════════════════════════════════════════════════════════
ts = '''// ═══════════════════════════════════════════════════════════════════
// BASE DE DATOS DE MANUALES SAP ACADEMY - AUTO-GENERADO
// Títulos en español, resúmenes extraídos del contenido real
// ═══════════════════════════════════════════════════════════════════

export interface ManualItem {
  id: string;
  number: number;
  slug: string;
  title: string;
  category: string;
  categoryIcon: string;
  categoryOrder: number;
  summary: string;
  totalSlides: number;
  pdfPath: string;
  mdPath: string;
  imagesPath: string;
}

export interface CategoryGroup {
  name: string;
  icon: string;
  order: number;
  manuals: ManualItem[];
}

'''

# Export all manuals flat array
ts += 'export const ALL_MANUALS: ManualItem[] = '
ts += json.dumps(manuals, indent=2, ensure_ascii=False)
ts += ';\n\n'

# Export grouped by category
category_groups = []
for cat_name in sorted(grouped.keys(), key=lambda c: grouped[c][0]['categoryOrder']):
    items = grouped[cat_name]
    category_groups.append({
        'name': cat_name,
        'icon': items[0]['categoryIcon'],
        'order': items[0]['categoryOrder'],
        'manuals': items,
    })

ts += 'export const MANUAL_CATEGORIES: CategoryGroup[] = '
ts += json.dumps(category_groups, indent=2, ensure_ascii=False)
ts += ';\n\n'

# Export category names for filters
cat_names = [cg['name'] for cg in category_groups]
ts += 'export const CATEGORY_NAMES: string[] = '
ts += json.dumps(cat_names, ensure_ascii=False)
ts += ';\n'

with open(out_file, 'w', encoding='utf-8') as f:
    f.write(ts)

print(f"✅ Generados {len(manuals)} manuales en {len(grouped)} categorías")
for cg in category_groups:
    print(f"   {cg['icon']} {cg['name']}: {len(cg['manuals'])} manuales")
