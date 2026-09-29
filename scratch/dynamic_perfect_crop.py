import os
import fitz
import shutil

base_dir = r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP'
skip_folders = ['CS', '10_Support_11_SupportProcTool_ES']

def get_slide_rect(pdf_path):
    doc = fitz.open(pdf_path)
    for i in range(min(3, len(doc))):
        page = doc.load_page(i)
        largest_area = 0
        best_rect = None
        for d in page.get_drawings():
            r = d['rect']
            area = (r.x1 - r.x0) * (r.y1 - r.y0)
            if area > largest_area and area < (page.rect.width * page.rect.height * 0.95):
                largest_area = area
                best_rect = r
        if best_rect and largest_area > (page.rect.width * page.rect.height * 0.25):
            # +2/-2 pt of padding inwards to perfectly exclude the black border stroke
            return fitz.Rect(best_rect.x0+2, best_rect.y0+2, best_rect.x1-2, best_rect.y1-2)
    return None

total_extracted = 0
total_deleted = 0

for root, dirs, files in os.walk(base_dir):
    # Saltamos las carpetas excluidas
    if any(s in root for s in skip_folders):
        continue
        
    for file in files:
        if file.endswith('.pdf'):
            pdf_path = os.path.join(root, file)
            out_dir = os.path.join(root, 'Imagenes_Diapositivas')
            
            # Borrar las anteriores si existen
            if os.path.exists(out_dir):
                shutil.rmtree(out_dir)
                total_deleted += 1
                
            os.makedirs(out_dir, exist_ok=True)
            
            try:
                # Calcular el recorte dinámico EXACTO para este PDF
                clip_rect = get_slide_rect(pdf_path)
                
                if not clip_rect:
                    print(f'Omitido {file}: No se encontró un marco de diapositiva válido.')
                    continue
                    
                doc = fitz.open(pdf_path)
                extracted = 0
                
                for i in range(len(doc)):
                    page = doc.load_page(i)
                    drawings = len(page.get_drawings())
                    images = len(page.get_images())
                    
                    # Filtro heurístico: Sólo extraer si tiene > 8 vectores o > 2 imágenes
                    if drawings > 8 or images > 2:
                        mat = fitz.Matrix(3.0, 3.0) # Ultra HD
                        pix = page.get_pixmap(matrix=mat, clip=clip_rect)
                        
                        img_path = os.path.join(out_dir, f'SLIDE_DIAGRAMA_{i+1:02d}.png')
                        pix.save(img_path)
                        extracted += 1
                        total_extracted += 1
                        
                print(f'{file}: extraídos {extracted} diagramas (con medidas dinámicas).')
            except Exception as e:
                print(f'Error en {file}: {e}')

print(f'\nTotal de carpetas purgadas: {total_deleted}')
print(f'Total global de imágenes perfectas extraídas (Cálculo Dinámico): {total_extracted}')
