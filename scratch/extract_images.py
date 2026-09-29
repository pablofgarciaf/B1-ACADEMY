import os
import fitz  # PyMuPDF

base_dir = r"C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP"
exclude_folder = "10_Support_11_SupportProcTool_ES"

def is_useless_slide(text):
    text_lower = text.lower()
    # Frases clave que delatan una diapositiva inútil (portadas, objetivos, cierres)
    skip_phrases = [
        "bienvenido al tema", 
        "al finalizar este tema", 
        "ha completado el tema",
        "le agradecemos el tiempo",
        "objetivos"
    ]
    
    # Si la página casi no tiene texto, suele ser un separador o portada
    if len(text.strip()) < 20:
        return True
        
    for phrase in skip_phrases:
        if phrase in text_lower:
            return True
            
    return False

def extract_slide_images():
    processed_pdfs = 0
    extracted_images = 0
    
    for root, dirs, files in os.walk(base_dir):
        # Ignorar la carpeta que pidió el usuario
        if exclude_folder in root:
            continue
            
        pdf_files = [f for f in files if f.lower().endswith('.pdf')]
        
        for pdf_file in pdf_files:
            pdf_path = os.path.join(root, pdf_file)
            img_dir = os.path.join(root, "Imagenes_Diapositivas")
            
            # Asegurar que existe la carpeta
            if not os.path.exists(img_dir):
                os.makedirs(img_dir)
                
            try:
                doc = fitz.open(pdf_path)
                
                for page_num in range(len(doc)):
                    page = doc.load_page(page_num)
                    text = page.get_text("text")
                    
                    # 1. Filtro inteligente de basura
                    if is_useless_slide(text):
                        continue
                        
                    # 2. Recorte de la parte superior (la imagen de la diapositiva)
                    # El formato de SAP suele tener la diapo en el 55% superior
                    rect = page.rect
                    clip_rect = fitz.Rect(0, 0, rect.width, rect.height * 0.55)
                    
                    # 3. Renderizar imagen en alta resolución (2x = ~150dpi)
                    mat = fitz.Matrix(2.0, 2.0)
                    pix = page.get_pixmap(matrix=mat, clip=clip_rect)
                    
                    # 4. Guardar archivo
                    img_filename = f"SLIDE_{page_num + 1:02d}.png"
                    img_path = os.path.join(img_dir, img_filename)
                    
                    pix.save(img_path)
                    extracted_images += 1
                    
                print(f"[OK] Imágenes recortadas: {pdf_file}")
                processed_pdfs += 1
            except Exception as e:
                print(f"[ERROR] Fallo en {pdf_path}: {str(e)}")

    print(f"\n¡Magia completada! {processed_pdfs} PDFs analizados.")
    print(f"Se crearon {extracted_images} imágenes útiles en total.")

if __name__ == "__main__":
    extract_slide_images()
