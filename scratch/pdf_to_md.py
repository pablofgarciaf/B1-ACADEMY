import os
import glob
import fitz  # PyMuPDF

base_dir = r"C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP"

def extract_pdf_text():
    count = 0
    folders = [f for f in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, f))]
    
    for folder in folders:
        mod_dir = os.path.join(base_dir, folder)
        pdf_files = glob.glob(os.path.join(mod_dir, "*.pdf"))
        
        if not pdf_files:
            continue
            
        pdf_path = pdf_files[0]
        md_file_name = os.path.basename(pdf_path).replace('.pdf', '_slides.md').replace('.PDF', '_slides.md')
        md_file_path = os.path.join(mod_dir, md_file_name)
        
        try:
            doc = fitz.open(pdf_path)
            md_content = f"# Transcripción por Diapositiva: {folder}\n\n"
            
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                text = page.get_text("text")
                
                # Limpiar saltos de línea innecesarios
                lines = text.split('\n')
                clean_lines = [line.strip() for line in lines if line.strip() and not line.startswith('© 2020 SAP SE')]
                clean_text = ' '.join(clean_lines)
                
                md_content += f"## Diapositiva {page_num + 1}\n\n{clean_text}\n\n---\n\n"
                
            with open(md_file_path, 'w', encoding='utf-8') as f:
                f.write(md_content)
                
            print(f"✅ Creado: {md_file_name} en {folder}")
            count += 1
        except Exception as e:
            print(f"❌ Error procesando {pdf_path}: {str(e)}")

    print(f"\n¡Extracción de texto completada en {count} PDFs!")

if __name__ == "__main__":
    extract_pdf_text()
