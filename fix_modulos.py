import os

dir_path = r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\modulos'
if os.path.exists(dir_path):
    for filename in os.listdir(dir_path):
        if filename.endswith('.md'):
            file_path = os.path.join(dir_path, filename)
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Safe replacement for ElevenLabs
            if '## GUIONES HUMANIZADOS' in content:
                content = content.split('## GUIONES HUMANIZADOS')[0].rstrip() + '\n'
            elif '## GUIONES' in content:
                content = content.split('## GUIONES')[0].rstrip() + '\n'
            
            # Safe fixes for the encoding
            content = content.replace('LECCIA\"N', 'LECCIÓN')
            content = content.replace('VISIA\"N', 'VISIÓN')
            content = content.replace('ARQUITECTURA TA%CNICA', 'ARQUITECTURA TÉCNICA')
            content = content.replace('NAVEGACIA\"N', 'NAVEGACIÓN')
            content = content.replace('PERSONALIZACIA\"N', 'PERSONALIZACIÓN')
            content = content.replace('PRA?CTICO', 'PRÁCTICO')
            content = content.replace('CONFIGURACIA\"N', 'CONFIGURACIÓN')
            content = content.replace('AUDITORA?A', 'AUDITORÍA')
            content = content.replace('CRA?TICAS', 'CRÍTICAS')
            content = content.replace('EVALUACIA\"N', 'EVALUACIÓN')
            content = content.replace('A?NDICE', 'ÍNDICE')
            content = content.replace('MA\"DULO', 'MÓDULO')
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
print('Fixed modulos safely')
