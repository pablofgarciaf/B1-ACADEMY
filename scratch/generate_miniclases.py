import os
import json

base_dir = r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP'
out_file = r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\src\lib\manuals-120-data.ts'

skip_folders = ['01_Revision_BUENAS', '02_Revision_MALAS_CUARENTENA', 'para corregir']

categories = {
    '10_AccBasics': 'Accounting Basics',
    '10_BankProcess': 'Banking',
    '10_BinLoc': 'Bin Locations',
    '10_ControlReports': 'Financial Reports',
    '10_CostandBudget': 'Costing & Budgeting',
    '10_FinProcess': 'Financial Process',
    '10_FinSetup': 'Financial Setup',
    '10_FixedAsset': 'Fixed Assets',
    '10_Impl': 'Implementation & Setup',
    '10_Intro': 'Introduction',
    '10_Inven': 'Inventory',
    '10_Item': 'Item Master Data',
    '10_ItemInv': 'Item Master Data',
    '10_MRP': 'MRP',
    '10_Overview': 'Overview',
    '10_Pricing': 'Pricing',
    '10_Production': 'Production',
    '10_ProjectManage': 'Project Management',
    '10_Purch': 'Purchasing',
    '10_Sales': 'Sales',
    '10_Service': 'Service',
    '10_Support': 'Support',
    'CSI': 'Case Studies',
    'CSL': 'Case Studies'
}

def get_category(folder_name):
    for key, val in categories.items():
        if folder_name.startswith(key):
            return val
    return 'Other'

manuals = []

for root, dirs, files in os.walk(base_dir):
    if root == base_dir:
        for d in dirs:
            if d in skip_folders or d == '10_Service_11_CSProcess': # Evitar el duplicado vacio
                continue
            
            # Limpiar nombre para titulo
            title = d
            title = title.replace('_ES', '').replace('10_', '')
            parts = title.split('_')
            clean_title = ' '.join(parts)
            
            category = get_category(d)
            slug = d.lower().replace('_', '-')
            
            manuals.append({
                'id': d,
                'slug': slug,
                'title': clean_title,
                'category': category,
                'pdfPath': f'/Capacitacion SAP/{d}/{d}.pdf',
                'mdPath': f'/Capacitacion SAP/{d}/_slides.md',
                'imagesPath': f'/Capacitacion SAP/{d}/Imagenes_Diapositivas'
            })

# Agrupar por categoría
grouped = {}
for m in manuals:
    cat = m['category']
    if cat not in grouped:
        grouped[cat] = []
    grouped[cat].append(m)

# Generar TypeScript
ts_content = "export interface MiniClass {\n"
ts_content += "  id: string;\n"
ts_content += "  slug: string;\n"
ts_content += "  title: string;\n"
ts_content += "  category: string;\n"
ts_content += "  pdfPath: string;\n"
ts_content += "  mdPath: string;\n"
ts_content += "  imagesPath: string;\n"
ts_content += "}\n\n"

ts_content += "export const MINI_CLASSES: Record<string, MiniClass[]> = "
ts_content += json.dumps(grouped, indent=2, ensure_ascii=False)
ts_content += ";\n\n"

ts_content += "export const ALL_MINI_CLASSES: MiniClass[] = "
ts_content += json.dumps(manuals, indent=2, ensure_ascii=False)
ts_content += ";\n"

with open(out_file, 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Generated {len(manuals)} mini-classes grouped into {len(grouped)} categories.")
