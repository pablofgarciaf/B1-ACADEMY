import os

buenas_dir = r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP\01_Revision_BUENAS'

for filename in os.listdir(buenas_dir):
    if filename.endswith('.webp'):
        # Formato actual: 001_Slide_05_10_AccBasics_11_AccBasics_Financial_Basics_ES.webp
        # Formato deseado: 10_AccBasics_11_AccBasics_Financial_Basics_ES_Slide_05.webp
        
        parts = filename.split('_Slide_')
        if len(parts) == 2:
            prefix_num = parts[0] # "001"
            rest = parts[1] # "05_10_AccBasics_11_AccBasics_Financial_Basics_ES.webp"
            
            # Separar el número del slide del nombre del pdf
            slide_num = rest[:2] # "05"
            pdf_name = rest[3:].replace('.webp', '') # "10_AccBasics_..."
            
            new_name = f"{pdf_name}_Slide_{slide_num}.webp"
            
            old_path = os.path.join(buenas_dir, filename)
            new_path = os.path.join(buenas_dir, new_name)
            
            os.rename(old_path, new_path)
            print(f"Renombrado: {new_name}")

print("¡Renombrado completado exitosamente!")
