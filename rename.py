import re

path = r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\src\lib\courses-data.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    (r'Vertical Bananera: Trazabilidad de Campo a Empacadora y Exportaci[óA3n]*n', 'Trazabilidad Avanzada y Exportación (Lotes y GlobalGAP)'),
    (r'Vertical Camaronera: Piscinas como Centros de Costo y Biomasa', 'Control de Costos por Lote y Biomasa (Centros de Costo Dinámicos)'),
    (r'Manufactura con Beas Manufacturing: [ÓA\"rdenes]* de Trabajo y Costeo ABC', 'Manufactura Avanzada (MES) y Costeo ABC'),
    (r'Gesti[óA3n]*n Avanzada de Bodegas: Produmex WMS y Radiofrecuencia', 'Automatización de Bodegas y Radiofrecuencia (WMS)')
]

for old, new in replacements:
    content = re.sub(old, new, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
