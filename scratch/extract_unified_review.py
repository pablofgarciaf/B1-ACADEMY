import os
import fitz
import shutil
from PIL import Image, ImageDraw, ImageFont

base_dir = r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP'
review_dir = os.path.join(base_dir, 'Todas_Las_Imagenes_Review')

# Limpiar el entorno
for root, dirs, files in os.walk(base_dir):
    if 'Imagenes_Diapositivas' in dirs:
        dir_to_remove = os.path.join(root, 'Imagenes_Diapositivas')
        shutil.rmtree(dir_to_remove)

if os.path.exists(review_dir):
    shutil.rmtree(review_dir)
os.makedirs(review_dir, exist_ok=True)

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
            return fitz.Rect(best_rect.x0+2, best_rect.y0+2, best_rect.x1-2, best_rect.y1-2)
    return doc.load_page(0).rect

def create_separator_slide(text, out_path):
    img = Image.new('RGB', (1280, 720), color=(30, 30, 30))
    d = ImageDraw.Draw(img)
    d.text((50, 340), f"MODULO:\n{text}", fill=(255, 255, 255), align="left")
    img.save(out_path, format="WEBP")

pdfs = []
for root, dirs, files in os.walk(base_dir):
    if root == review_dir: continue
    for file in files:
        if file.endswith('.pdf'):
            pdfs.append(os.path.join(root, file))

pdfs.sort()
total_pdfs = len(pdfs)
total_extracted = 0

for idx, pdf_path in enumerate(pdfs, start=1):
    pdf_name = os.path.basename(pdf_path).replace('.pdf', '')
    sep_name = f"{idx:03d}_00_SEPARADOR_{pdf_name}.webp"
    sep_path = os.path.join(review_dir, sep_name)
    create_separator_slide(pdf_name, sep_path)
    
    try:
        clip_rect = get_slide_rect(pdf_path)
        doc = fitz.open(pdf_path)
        slide_area = (clip_rect.x1 - clip_rect.x0) * (clip_rect.y1 - clip_rect.y0)
        
        for slide_idx in range(len(doc)):
            page = doc.load_page(slide_idx)
            
            drawings = len(page.get_drawings())
            num_images = len(page.get_images())
            
            # Calcular el área real ocupada por imágenes (screenshots)
            img_area = 0
            for img in page.get_image_info():
                r = fitz.Rect(img['bbox'])
                img_area += (r.x1 - r.x0) * (r.y1 - r.y0)
                
            ratio = img_area / slide_area if slide_area > 0 else 0
            
            # NUEVA HEURÍSTICA PERFECCIONADA:
            is_graphic = False
            
            # 1. Si la diapositiva es un dibujo vectorial complejo (ej. Forecast Concept tiene 20+)
            # Subimos el umbral de 8 a 15 para omitir recuadros de texto adornados (como la mala del COA)
            if drawings >= 15:
                is_graphic = True
                
            # 2. Si la diapositiva tiene capturas de pantalla reales (SAP B1 screenshots)
            # Ignoramos el logo (ratio bajo) y validamos si la imagen ocupa más del 15% del slide
            elif num_images >= 2 and ratio > 0.15:
                is_graphic = True
                
            if is_graphic:
                mat = fitz.Matrix(3.0, 3.0)
                pix = page.get_pixmap(matrix=mat, clip=clip_rect)
                img_name = f"{idx:03d}_{slide_idx+1:02d}_{pdf_name}.webp"
                img_path = os.path.join(review_dir, img_name)
                
                mode = "RGBA" if pix.alpha else "RGB"
                img = Image.frombytes(mode, [pix.width, pix.height], pix.samples)
                img.save(img_path, format="WEBP", quality=90)
                total_extracted += 1
                
        print(f"[{idx}/{total_pdfs}] Procesado: {pdf_name}")
    except Exception as e:
        print(f"Error procesando {pdf_name}: {e}")

print(f"\n¡Completado! {total_extracted} imágenes extraídas en total.")
