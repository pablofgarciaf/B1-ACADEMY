import fitz

doc = fitz.open(r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP\10_Intro_11_Overview_IntroSAPB1_ES\10_Intro_11_Overview_IntroSAPB1_ES.pdf')
print(f'Total pages in PDF: {len(doc)}')

for i, page in enumerate(doc):
    text = page.get_text().strip()
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    preview = ' // '.join(lines[:5])
    print(f'Page {i+1}: {preview[:150]}')
