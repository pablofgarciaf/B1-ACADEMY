import os
import fitz  # PyMuPDF

base_dir = r"C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP"
exclude_folder = "10_Support_11_SupportProcTool_ES"

def is_useless_slide(text):
    text_lower = text.lower()
    # Solo ignoramos portadas y cierres explícitos para no perder diagramas puros
    skip_phrases = [
        "bienvenido al tema", 
        "al finalizar este tema", 
        "ha completado el tema",
        "le agradecemos el tiempo"
    ]
    for phrase in skip_phrases:
        if phrase in text_lower:
            return True
    return False

def extract_slide_images():
    processed_pdfs = 0
    extracted_images = 0
    
    for root, dirs, files in os.walk(base_dir):
        if exclude_folder in root:
            continue
            
        pdf_files = [f for f in files if f.lower().endswith('.pdf')]
        
        for pdf_file in pdf_files:
            pdf_path = os.path.join(root, pdf_file)
            img_dir = os.path.join(root, "Imagenes_Diapositivas")
            
            if not os.path.exists(img_dir):
                os.makedirs(img_dir)
                
            try:
                doc = fitz.open(pdf_path)
                
                for page_num in range(len(doc)):
                    page = doc.load_page(page_num)
                    text = page.get_text("text")
                    
                    # Filtro menos agresivo (sin importar si hay poco texto)
                    if is_useless_slide(text):
                        continue
                        
                    clip_rect = fitz.Rect(46, 51, 494, 300)
                    mat = fitz.Matrix(3.0, 3.0)
                    pix = page.get_pixmap(matrix=mat, clip=clip_rect)
                    
                    img_filename = f"SLIDE_{page_num + 1:02d}.png"
                    img_path = os.path.join(img_dir, img_filename)
                    
                    pix.save(img_path)
                    extracted_images += 1
                    
                processed_pdfs += 1
            except Exception as e:
                pass

    print(f"¡Listo! PDFs: {processed_pdfs} | Imágenes: {extracted_images}")

if __name__ == "__main__":
    extract_slide_images()
