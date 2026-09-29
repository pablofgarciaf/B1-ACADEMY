import os

directories = [
    r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\modulos',
    r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion_SAP_Todos_Los_Markdowns'
]

for dir_path in directories:
    if os.path.exists(dir_path):
        for filename in os.listdir(dir_path):
            if filename.endswith('.md'):
                file_path = os.path.join(dir_path, filename)
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                content = content.replace('LECCIA\"N', 'LECCIÓN')
                content = content.replace('VISIA\"N', 'VISIÓN')
                content = content.replace('ARQUITECTURA TA%CNICA', 'ARQUITECTURA TÉCNICA')
                content = content.replace('NAVEGACIA\"N', 'NAVEGACIÓN')
                content = content.replace('PERSONALIZACIA\"N', 'PERSONALIZACIÓN')
                content = content.replace('PRA?CTICO', 'PRÁCTICO')
                content = content.replace('CONFIGURACIA\"N', 'CONFIGURACIÓN')
                content = content.replace('AUDITORA?A', 'AUDITORÍA')
                content = content.replace('TROUBLESHOOTING', 'TROUBLESHOOTING')
                content = content.replace('CRA?TICAS', 'CRÍTICAS')
                content = content.replace('EVALUACIA\"N', 'EVALUACIÓN')
                content = content.replace('A?NDICE', 'ÍNDICE')
                content = content.replace('MA\"DULO', 'MÓDULO')
                content = content.replace('PropA3sito', 'Propósito')
                content = content.replace('TAccnica', 'Técnica')
                content = content.replace('BAsSQUEDAS', 'BÚSQUEDAS')
                content = content.replace('BAsqueda', 'Búsqueda')
                content = content.replace('MActodos', 'Métodos')
                content = content.replace('RApida', 'Rápida')
                content = content.replace('AnatomA-a', 'Anatomía')
                content = content.replace('AsignaciA3n', 'Asignación')
                content = content.replace('CreaciA3n', 'Creación')
                content = content.replace('ACA3mo', '¿Cómo')
                content = content.replace('AQuAc', '¿Qué')
                content = content.replace('APor quAc', '¿Por qué')
                content = content.replace('A', '')
                content = content.replace('A3', 'ó')
                content = content.replace('A-a', 'ía')
                content = content.replace('A-c', 'íc')
                content = content.replace('A-o', 'ío')
                content = content.replace('A-n', 'ín')
                content = content.replace('A-s', 'ís')
                content = content.replace('Ac', 'é')
                content = content.replace('A\u00a1', 'á')
                content = content.replace('A\u00a2', 'á')
                content = content.replace('A\u00a3', 'ú')
                
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
print('Fixed encodings')
