import os, json

sap_dir = r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP'
diapo_instances = []

for root, dirs, files in os.walk(sap_dir):
    if 'clase_sync.json' in files:
        mname = os.path.basename(root)
        try:
            with open(os.path.join(root, 'clase_sync.json'), 'r', encoding='utf-8') as f:
                items = json.load(f)
                for i, it in enumerate(items):
                    txt = it.get('script_text') or it.get('text') or ''
                    if 'diapositiva' in txt.lower():
                        diapo_instances.append((mname, it.get('slide_index', i+1), txt))
        except Exception:
            pass

print(f'Total occurrences of " diapositiva\: {len(diapo_instances)}')
for mname, s_idx, txt in diapo_instances[:25]:
 print(f'[{mname}] Slide {s_idx}: {txt[:100]}...')
