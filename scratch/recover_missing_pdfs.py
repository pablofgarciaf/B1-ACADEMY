import os
import zipfile
import fitz
import shutil

zip_path = r'C:\Users\pablo\Downloads\Capacitacion SAP-20260929T031458Z-1-001.zip'
base_cap = r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP'
md_dir = r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion_SAP_Markdowns_Limpios'

existing_pdfs = set()
for r, d, files in os.walk(base_cap):
    for f in files:
        if f.lower().endswith('.pdf'):
            existing_pdfs.add(f.lower())

with zipfile.ZipFile(zip_path, 'r') as z:
    zip_pdfs = [info for info in z.infolist() if info.filename.lower().endswith('.pdf')]
    
    missing = [info for info in zip_pdfs if os.path.basename(info.filename).lower() not in existing_pdfs]
    
    for info in missing:
        basename = os.path.basename(info.filename)
        folder_name = basename[:-4]
        
        # 1. Crear carpeta destino
        target_folder = os.path.join(base_cap, folder_name)
        os.makedirs(target_folder, exist_ok=True)
        
        # 2. Extraer el PDF
        pdf_path = os.path.join(target_folder, basename)
        with z.open(info.filename) as source, open(pdf_path, "wb") as target:
            shutil.copyfileobj(source, target)
        print(f"Extraído: {basename}")
        
        # 3. Extraer slides (texto)
        doc = fitz.open(pdf_path)
        md_text = ""
        
        # 4. Extraer imágenes
        img_dir = os.path.join(target_folder, "Imagenes_Diapositivas")
        os.makedirs(img_dir, exist_ok=True)
        images_count = 0
        
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text = page.get_text("text")
            
            # Guardar texto para _slides.md
            md_text += f"## Diapositiva {page_num + 1}\n\n{text}\n\n"
            
            # Filtro de basura
            text_lower = text.lower()
            skip_phrases = ["bienvenido al tema", "al finalizar este tema", "ha completado el tema", "le agradecemos el tiempo"]
            if any(p in text_lower for p in skip_phrases):
                continue
                
            clip_rect = fitz.Rect(46, 51, 494, 300)
            mat = fitz.Matrix(3.0, 3.0)
            pix = page.get_pixmap(matrix=mat, clip=clip_rect)
            
            img_path = os.path.join(img_dir, f"SLIDE_{page_num + 1:02d}.png")
            pix.save(img_path)
            images_count += 1
            
        slides_md_path = os.path.join(target_folder, f"{folder_name}_slides.md")
        with open(slides_md_path, "w", encoding="utf-8") as f:
            f.write(md_text)
            
        print(f"  -> Procesado: {images_count} imágenes y _slides.md creados.")

# 5. Mover el último MD huérfano (Routing)
routing_md_src = os.path.join(md_dir, "Production_RoutingProcess.md")
routing_md_dst = os.path.join(base_cap, "10_Production_42_Process_RoutingProductionProcess_ES", "Production_RoutingProcess.md")
if os.path.exists(routing_md_src):
    os.makedirs(os.path.dirname(routing_md_dst), exist_ok=True)
    shutil.move(routing_md_src, routing_md_dst)
    print("El último MD 'Production_RoutingProcess.md' ha sido movido a su carpeta.")

print("¡Proceso de recuperación completado!")
