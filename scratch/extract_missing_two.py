import os
import fitz
import shutil
from PIL import Image, ImageDraw

base_dir = r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP'
buenas_dir = os.path.join(base_dir, '01_Revision_BUENAS')
malas_dir = os.path.join(base_dir, '02_Revision_MALAS_CUARENTENA')

target_pdfs = [
    r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP\10_Service_11_CSProcess\10_Service_11_CSProcess_Process_ES.pdf',
    r'C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP\10_Support_11_SupportProcTool_ES\10_Support_11_SupportProcTool_ES.pdf'
]

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

for idx, pdf_path in enumerate(target_pdfs, start=113): # Continuar la numeracion
    pdf_name = os.path.basename(pdf_path).replace('.pdf', '')
    
    mod_out_dir = os.path.join(os.path.dirname(pdf_path), 'Imagenes_Diapositivas')
    if os.path.exists(mod_out_dir):
        shutil.rmtree(mod_out_dir)
    os.makedirs(mod_out_dir, exist_ok=True)
    
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
            
            img.save(os.path.join(mod_out_dir, img_name), format="WEBP", quality=90)
            
            if is_good:
                img.save(os.path.join(buenas_dir, img_name), format="WEBP", quality=90)
            else:
                img.save(os.path.join(malas_dir, img_name), format="WEBP", quality=90)
                
        print(f"[{idx}] {pdf_name} procesado correctamente.")
    except Exception as e:
        print(f"Error: {e}")
