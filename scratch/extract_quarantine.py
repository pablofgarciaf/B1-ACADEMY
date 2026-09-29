import os
import fitz
import shutil
from PIL import Image, ImageDraw

base_dir = r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP'
old_review_dir = os.path.join(base_dir, 'Todas_Las_Imagenes_Review')
buenas_dir = os.path.join(base_dir, '01_Revision_BUENAS')
malas_dir = os.path.join(base_dir, '02_Revision_MALAS_CUARENTENA')
skip_folders = ['CS', '10_Support_11_SupportProcTool_ES']

# 1. Limpiar carpetas anteriores
if os.path.exists(old_review_dir):
    shutil.rmtree(old_review_dir)
if os.path.exists(buenas_dir):
    shutil.rmtree(buenas_dir)
if os.path.exists(malas_dir):
    shutil.rmtree(malas_dir)

os.makedirs(buenas_dir, exist_ok=True)
os.makedirs(malas_dir, exist_ok=True)

# Borrar carpetas locales Imagenes_Diapositivas de todos los módulos
for root, dirs, files in os.walk(base_dir):
    if any(s in root for s in skip_folders):
        continue
    if 'Imagenes_Diapositivas' in dirs:
        shutil.rmtree(os.path.join(root, 'Imagenes_Diapositivas'))

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

def create_separator_slide(text, out_path, is_mala=False):
    color = (80, 20, 20) if is_mala else (20, 80, 20)
    img = Image.new('RGB', (1280, 720), color=color)
    d = ImageDraw.Draw(img)
    d.text((50, 340), f"MODULO:\n{text}", fill=(255, 255, 255))
    img.save(out_path, format="WEBP")

pdfs = []
for root, dirs, files in os.walk(base_dir):
    if root in [buenas_dir, malas_dir]: continue
    if any(s in root for s in skip_folders): continue
    for file in files:
        if file.endswith('.pdf'):
            pdfs.append(os.path.join(root, file))

pdfs.sort()
total_pdfs = len(pdfs)
total_buenas = 0
total_malas = 0

for idx, pdf_path in enumerate(pdfs, start=1):
    pdf_name = os.path.basename(pdf_path).replace('.pdf', '')
    
    # Crear carpeta local del módulo
    mod_out_dir = os.path.join(os.path.dirname(pdf_path), 'Imagenes_Diapositivas')
    os.makedirs(mod_out_dir, exist_ok=True)
    
    # Separadores
    sep_name = f"{idx:03d}_00_SEPARADOR_{pdf_name}.webp"
    create_separator_slide(pdf_name, os.path.join(buenas_dir, sep_name), is_mala=False)
    create_separator_slide(pdf_name, os.path.join(malas_dir, sep_name), is_mala=True)
    
    try:
        clip_rect = get_slide_rect(pdf_path)
        doc = fitz.open(pdf_path)
        slide_area = (clip_rect.x1 - clip_rect.x0) * (clip_rect.y1 - clip_rect.y0)
        
        for slide_idx in range(len(doc)):
            page = doc.load_page(slide_idx)
            drawings = len(page.get_drawings())
            num_images = len(page.get_images())
            
            img_area = sum([(fitz.Rect(img['bbox']).x1 - fitz.Rect(img['bbox']).x0) * (fitz.Rect(img['bbox']).y1 - fitz.Rect(img['bbox']).y0) for img in page.get_image_info()])
            ratio = img_area / slide_area if slide_area > 0 else 0
            
            # SISTEMA DE CLASIFICACIÓN RELAJADO (PERMISIVO)
            is_good = False
            if drawings > 8:
                is_good = True
            elif num_images >= 2 and ratio >= 0.08:
                is_good = True
            elif ratio >= 0.15:
                is_good = True
                
            mat = fitz.Matrix(3.0, 3.0)
            pix = page.get_pixmap(matrix=mat, clip=clip_rect)
            mode = "RGBA" if pix.alpha else "RGB"
            img = Image.frombytes(mode, [pix.width, pix.height], pix.samples)
            
            img_name = f"{idx:03d}_Slide_{slide_idx+1:02d}_{pdf_name}.webp"
            
            # 1. Guardar SIEMPRE en la carpeta del módulo (por ahora tienen todas)
            img.save(os.path.join(mod_out_dir, img_name), format="WEBP", quality=90)
            
            # 2. Distribuir a la carpeta global correspondiente
            if is_good:
                img.save(os.path.join(buenas_dir, img_name), format="WEBP", quality=90)
                total_buenas += 1
            else:
                img.save(os.path.join(malas_dir, img_name), format="WEBP", quality=90)
                total_malas += 1
                
        print(f"[{idx}/{total_pdfs}] {pdf_name} -> Buenas: {total_buenas}, Malas: {total_malas}")
    except Exception as e:
        print(f"Error procesando {pdf_name}: {e}")

print(f"\n¡Proceso Completado!")
print(f"Total BUENAS (probables gráficos): {total_buenas}")
print(f"Total MALAS (probable texto plano): {total_malas}")
