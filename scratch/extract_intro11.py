import fitz

doc = fitz.open(r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP\10_Intro_11_Overview_IntroSAPB1_ES\10_Intro_11_Overview_IntroSAPB1_ES.pdf')

with open(r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\scratch\intro11_extracted.txt', 'w', encoding='utf-8') as out:
    for i, page in enumerate(doc):
        text = page.get_text().strip()
        out.write(f'=== PAGE {i+1} ===\n{text}\n\n')
print('Extracted successfully!')
