import json
import re

with open('src/lib/manuals-120-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Match items in ALL_MANUALS array only (first 120 items)
match_all = re.search(r'export const ALL_MANUALS: ManualItem\[\] = \[(.*?)\];\s*export const', content, re.DOTALL)
if not match_all:
    print('ALL_MANUALS not found')
    exit()

block = match_all.group(1)
items = re.findall(r'\{\s*"id":\s*"([^"]+)",\s*"number":\s*(\d+),\s*"slug":\s*"([^"]+)",\s*"title":\s*"([^"]+)",\s*"category":\s*"([^"]+)"', block)
print(f'Total unique manuals in ALL_MANUALS: {len(items)}')

theoretical = []
practical = []

for m_id, num, slug, title, cat in items:
    lower_id = m_id.lower()
    lower_title = title.lower()
    # Check if purely conceptual / theoretical
    is_theo = any(k in lower_id or k in lower_title for k in [
        'intro_11', 'overview_overview', 'financial_basics', 'concept', 
        'currencies', 'finreports', 'cashreports', 'costacc_costacc', 
        'supportproctool', 'visión general'
    ])
    if 'gettingstarted' in lower_id:
        is_theo = False
    
    if is_theo:
        theoretical.append((num, m_id, title, cat))
    else:
        practical.append((num, m_id, title, cat))

print(f'\nTotal Practicos / Transaccionales: {len(practical)}')
print(f'Total Teoricos / Conceptuales: {len(theoretical)}')

print('\n--- EJEMPLOS TEORICOS (Sin simulador transaccional, con aviso pedagogico): ---')
for num, m_id, title, cat in theoretical[:8]:
    print(f'  {num}. [{cat}] {title}')

print('\n--- EJEMPLOS PRACTICOS (Con simulador especifico de SAP B1): ---')
for num, m_id, title, cat in practical[:8]:
    print(f'  {num}. [{cat}] {title}')
