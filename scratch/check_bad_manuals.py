import os, json

manuals = [
    '10_Impl_12_CustomTools_Alerts_ES',
    '10_Impl_17_CustomTools_IntroAnalytics_ES',
    '10_Impl_21_ImplTools_ImplementationMethodology_ES',
    '10_Impl_23_ImplTools_Key_Settings_ES',
    '10_Impl_26_ImplTools_QuickCopy',
    '10_Impl_31_ImportfromExcel',
    '10_Impl_31_SystemSetup_Users_Groups_ES',
    '10_Impl_33_Importing_Docs_using_DTW',
    '10_Impl_35_SystemSetup_UIConfigurationTemplates_ES',
    '10_Intro_11_Overview_IntroSAPB1_ES',
    '10_MRP_13_MRP_BOM',
    '10_Purch_32_LandedCost_Freight'
]

sap_dir = r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP'
for m in manuals:
    p = os.path.join(sap_dir, m, 'clase_sync.json')
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as f:
            items = json.load(f)
            bad = []
            for i, it in enumerate(items):
                txt = it.get('script_text', '')
                if 'examinamos la arquitectura' in txt:
                    bad.append((it.get('slide_index', i+1), txt[:75]))
            print(f'=== {m} (Total slides: {len(items)}, Dummy: {len(bad)}) ===')
            for s_idx, b in bad:
                print(f'    Slide {s_idx}: {b}')
