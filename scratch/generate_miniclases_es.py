import os
import json
import re

base_dir = r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP'
out_file = r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\src\lib\manuals-120-data.ts'

skip_folders = ['01_Revision_BUENAS', '02_Revision_MALAS_CUARENTENA', 'para corregir']

categories_es = {
    '10_AccBasics': 'Contabilidad Básica',
    '10_BankProcess': 'Gestión Bancaria y Pagos',
    '10_BinLoc': 'Ubicaciones en Almacén',
    '10_ControlReports': 'Informes Financieros',
    '10_CostandBudget': 'Costos y Presupuestos',
    '10_FinProcess': 'Procesos Financieros',
    '10_FinSetup': 'Configuración Financiera',
    '10_FixedAsset': 'Activos Fijos',
    '10_Impl': 'Implementación del Sistema',
    '10_Intro': 'Introducción a SAP B1',
    '10_Inven': 'Inventarios',
    '10_Item': 'Maestros de Artículo',
    '10_ItemInv': 'Gestión de Inventario',
    '10_MRP': 'Planificación (MRP)',
    '10_Overview': 'Visión General',
    '10_Pricing': 'Precios',
    '10_Production': 'Producción',
    '10_ProjectManage': 'Proyectos',
    '10_Purch': 'Compras',
    '10_Sales': 'Ventas',
    '10_Service': 'Servicios',
    '10_Support': 'Soporte',
    'CSI': 'Casos Prácticos',
    'CSL': 'Casos Prácticos'
}

def clean_title(t):
    # Extract the descriptive part from the messy folder name
    # e.g., "10_AccBasics_11_AccBasics_Financial_Basics_ES" -> "Financial Basics"
    # Match everything after the second block of letters
    m = re.search(r'^\d+_[A-Za-z]+_\d+_[A-Za-z]+_(.+)_ES$', t)
    if m:
        t = m.group(1)
    else:
        m2 = re.search(r'^\d+_[A-Za-z]+_\d+_(.+)_ES$', t)
        if m2:
            t = m2.group(1)
        else:
            t = t.replace('_ES', '')
            t = re.sub(r'^\d+_[A-Za-z]+_\d+_?', '', t)
            
    t = t.replace('_', ' ')
    
    # English to Spanish translations for common manual names
    translations = {
        'Financial Basics': 'Conceptos Financieros Básicos',
        'Automatic Journal Entries': 'Asientos Contables Automáticos',
        'Handling Payments': 'Gestión de Pagos',
        'Payment Wizard': 'Asistente de Pagos',
        'BankReconcile': 'Reconciliación Bancaria',
        'Overview': 'Visión General',
        'Setup': 'Configuración',
        'Process': 'Proceso',
        'Weight': 'Peso',
        'Reporting': 'Informes',
        'Serial': 'Números de Serie',
        'FinReports': 'Informes Financieros',
        'CashReports cashflow': 'Flujo de Caja',
        'CashReports Aging': 'Antigüedad de Saldos',
        'CashReports Dunning': 'Reclamaciones (Dunning)',
        'CostAcc': 'Contabilidad de Costos',
        'MultiDimensions': 'Múltiples Dimensiones',
        'CostAdjustment': 'Ajuste de Costos',
        'Budget': 'Presupuesto',
        'PostJE': 'Registro de Asientos Contables',
        'template': 'Plantillas',
        'voucher': 'Documento Preliminar',
        'PostPeriods': 'Periodos Contables',
        'PeriodClose': 'Cierre de Periodo',
        'InternalRecon': 'Reconciliación Interna',
        'COAConcepts': 'Conceptos del Plan de Cuentas',
        'Currencies': 'Monedas',
        'ManageCOA': 'Gestión del Plan de Cuentas',
        'DefaultGLAccOveriew': 'Cuentas de Mayor por Defecto',
        'Traditional': 'Tradicional',
        'Advanced': 'Avanzado',
        'FixedAsset Intro': 'Introducción a Activos Fijos',
        'FixedAsset Intro Virtual Asset': 'Activos Virtuales',
        'InitSettings': 'Configuraciones Iniciales',
        'WorkingProcessFA Activate AssetMD': 'Activación de Datos Maestros',
        'WorkingProcessFA Depreciation Adjustments': 'Ajustes de Depreciación',
        'WorkingProcessFA Retirement Monitoring': 'Monitoreo de Bajas',
        'Queries': 'Consultas (Queries)',
        'Alerts': 'Alertas',
        'ApprovalProcesses': 'Procesos de Aprobación',
        'UserDefinedFields': 'Campos Definidos por Usuario (UDF)',
        'UserDefinedValues': 'Valores Definidos por Usuario',
        'UserDefinedTables': 'Tablas Definidas por Usuario',
        'IntroAnalytics': 'Introducción a Analíticas',
        'ImplementationMethodology': 'Metodología de Implementación',
        'ExpressWizard': 'Asistente Express',
        'Key Settings': 'Configuraciones Clave',
        'OpeningBalances': 'Saldos Iniciales',
        'QuickCopy': 'Copia Rápida (Quick Copy)',
        'ImportfromExcel': 'Importación desde Excel',
        'Users Groups': 'Usuarios y Grupos',
        'GeneralAuthorizations': 'Autorizaciones Generales',
        'Using Data Trans Workbench': 'Uso del DTW',
        'Importing Docs using DTW': 'Importación usando DTW',
        'DataOwnership': 'Propiedad de los Datos',
        'DocumentMasterDataNumbering': 'Numeración de Documentos',
        'UIConfigurationTemplates': 'Plantillas de Interfaz UI',
        'Print layouts': 'Diseños de Impresión',
        'EmailPrefrences': 'Preferencias de Correo',
        'IntroSAPB1': 'Introducción a SAP B1',
        'GettingStarted': 'Primeros Pasos',
        'PhyInv': 'Inventario Físico',
        'PNPSales': 'Ventas',
        'PNPProduction': 'Producción',
        'PNPTTransfer': 'Transferencias',
        'ItemMD': 'Datos Maestros de Artículo',
        'ItemGrp': 'Grupos de Artículos',
        'ValMethods': 'Métodos de Valoración',
        'SNBatch': 'Series y Lotes',
        'Packaging': 'Empaquetado',
        'ConsumeForecast': 'Consumo de Pronósticos',
        'BOM': 'Lista de Materiales (BOM)',
        'MDDoc': 'Documentos Maestros',
        'PrConcept': 'Concepto de Precios',
        'CreatePricelist': 'Creación de Listas de Precios',
        'UpdatePricelist': 'Actualización de Listas de Precios',
        'PerVolDisc': 'Descuentos por Volumen',
        'DiscGrp': 'Grupos de Descuento',
        'SpPrBP': 'Precios Especiales para Socios',
        'Resources': 'Recursos',
        'Capacity': 'Capacidad',
        'BasicProductionProcess': 'Proceso Básico de Producción',
        'ByProductsandAdditional': 'Subproductos y Adicionales',
        'RoutingProductionProcess': 'Rutas de Producción (Routing)',
        'Accounting': 'Contabilidad de Producción',
        'Cost': 'Costos de Producción',
        'ProjectManage': 'Gestión de Proyectos',
        'ProjectManage Billing': 'Facturación de Proyectos',
        'PurchaseReqQt': 'Solicitud y Oferta de Compra',
        'Services': 'Servicios',
        'GRPO': 'Entrada de Mercancías (GRPO)',
        'ReturnsCM': 'Devoluciones y Notas de Crédito',
        'Freight': 'Fletes',
        'ManageLandedCosts': 'Gestión de Costos de Importación',
        'Order2Cash': 'De Pedido a Cobro (Order to Cash)',
        'Customers': 'Datos Maestros de Clientes',
        'CRM': 'Gestión de Relaciones (CRM)',
        'Autom': 'Automatización',
        'ReturnsExchange': 'Devoluciones y Cambios',
        'CM': 'Notas de Crédito (Ventas)',
        'SupportProcTool': 'Herramienta de Soporte',
        'Query Practice': 'Práctica de Consultas SQL',
        'Query Practice Solutions': 'Solución de Práctica SQL',
        'Introduction': 'Introducción',
        'Introduction Solution': 'Solución de Introducción',
        'Procurement Process': 'Proceso de Aprovisionamiento',
        'Procurement Process Solution': 'Solución de Aprovisionamiento'
    }
    
    for eng, esp in translations.items():
        if t == eng or t.endswith(eng):
            return esp
    return t

manuals = []
for root, dirs, files in os.walk(base_dir):
    if root == base_dir:
        for d in dirs:
            if d in skip_folders or d == '10_Service_11_CSProcess': continue
            clean_t = clean_title(d)
            cat = 'General'
            for key, val in categories_es.items():
                if d.startswith(key):
                    cat = val
                    break
            slug = d.lower().replace('_', '-')
            manuals.append({
                'id': d, 'slug': slug, 'title': clean_t, 'category': cat,
                'pdfPath': f'/Capacitacion SAP/{d}/{d}.pdf',
                'mdPath': f'/Capacitacion SAP/{d}/_slides.md',
                'imagesPath': f'/Capacitacion SAP/{d}/Imagenes_Diapositivas'
            })

grouped = {}
for m in manuals:
    grouped.setdefault(m['category'], []).append(m)

ts = "export interface MiniClass {\n  id: string;\n  slug: string;\n  title: string;\n  category: string;\n  pdfPath: string;\n  mdPath: string;\n  imagesPath: string;\n}\n\n"
ts += "export const MINI_CLASSES: Record<string, MiniClass[]> = " + json.dumps(grouped, indent=2, ensure_ascii=False) + ";\n\n"
ts += "export const ALL_MINI_CLASSES: MiniClass[] = " + json.dumps(manuals, indent=2, ensure_ascii=False) + ";\n"

with open(out_file, 'w', encoding='utf-8') as f: f.write(ts)
