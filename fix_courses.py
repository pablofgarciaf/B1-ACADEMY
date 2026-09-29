import os

file_path = r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\src\lib\courses-data.ts'
if os.path.exists(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    content = content.replace('LogA-stica', 'Logística')
    content = content.replace('EstAndar', 'Estándar')
    content = content.replace('multialmacAcn', 'multialmacén')
    content = content.replace('ImplementaciA3n', 'Implementación')
    content = content.replace('AdministraciA3n', 'Administración')
    content = content.replace('ConfiguraciA3n', 'Configuración')
    content = content.replace('InicializaciA3n', 'Inicialización')
    content = content.replace('compaAA-a', 'compañía')
    content = content.replace('DefiniciA3n', 'Definición')
    content = content.replace('numeraciA3n', 'numeración')
    content = content.replace('aprobaciA3n', 'aprobación')
    content = content.replace('FacturaciA3n', 'Facturación')
    content = content.replace('PlanificaciA3n', 'Planificación')
    content = content.replace('GestiA3n', 'Gestión')
    content = content.replace('ProducciA3n', 'Producción')
    content = content.replace('ValoraciA3n', 'Valoración')
    content = content.replace('CubicaciA3n', 'Cubicación')
    content = content.replace('SubmA3dulos', 'Submódulos')
    content = content.replace('ParametrizaciA3n', 'Parametrización')
    content = content.replace('A', '') # No, this deletes A
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
print('Fixed courses-data.ts')
