import os
import shutil
import fitz
import re

base_cap_dir = r"C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion SAP"
source_md_dir = r"C:\Users\pablo\OneDrive\Desktop\proyectos web\sap academy\public\Capacitacion_SAP_Markdowns_Limpios"

# 1. MOVER MDs
pdf_map = {}
# Mapeamos nombre del pdf (sin extensión) a la ruta de su carpeta
for root, dirs, files in os.walk(base_cap_dir):
    for f in files:
        if f.lower().endswith('.pdf'):
            pdf_map[f[:-4]] = root

md_files = [f for f in os.listdir(source_md_dir) if f.endswith('.md')]
moved = 0

# Intentamos coincidencia exacta primero
for md in md_files:
    basename = md[:-3]
    if basename in pdf_map:
        src = os.path.join(source_md_dir, md)
        dst = os.path.join(pdf_map[basename], md)
        shutil.move(src, dst)
        moved += 1

print(f"MDs exactos movidos: {moved}")

# Para los restantes, intentamos un matching heurístico básico (palabras clave)
remaining_mds = [f for f in os.listdir(source_md_dir) if f.endswith('.md')]
print(f"Quedan {len(remaining_mds)} MDs por mover.")

def normalize(text):
    return set(re.sub(r'[^a-zA-Z0-9]', ' ', text).lower().split())

for md in remaining_mds:
    md_words = normalize(md.replace('DOC_', '').replace('.md', ''))
    best_match = None
    best_score = 0
    for pdf_base, folder_path in pdf_map.items():
        pdf_words = normalize(pdf_base)
        score = len(md_words.intersection(pdf_words))
        if score > best_score and score >= 2:  # Al menos 2 palabras clave comunes
            best_score = score
            best_match = (pdf_base, folder_path)
            
    if best_match:
        pdf_base, folder_path = best_match
        src = os.path.join(source_md_dir, md)
        # Renombramos el MD para que coincida con el PDF!
        new_md_name = pdf_base + ".md"
        dst = os.path.join(folder_path, new_md_name)
        shutil.move(src, dst)
        print(f"Heurística: Movido {md} -> {new_md_name}")

# 2. EXTRAER IMAGENES DE LA CARPETA OMITIDA
omitted_pdf = "10_Support_11_SupportProcTool_ES"
if omitted_pdf in pdf_map:
    target_dir = pdf_map[omitted_pdf]
    pdf_path = os.path.join(target_dir, omitted_pdf + ".pdf")
    img_dir = os.path.join(target_dir, "Imagenes_Diapositivas")
    os.makedirs(img_dir, exist_ok=True)
    
    try:
        doc = fitz.open(pdf_path)
        extracted = 0
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text = page.get_text("text").lower()
            skip_phrases = ["bienvenido al tema", "al finalizar este tema", "ha completado el tema", "le agradecemos el tiempo"]
            if any(p in text for p in skip_phrases):
                continue
                
            clip_rect = fitz.Rect(46, 51, 494, 300)
            mat = fitz.Matrix(3.0, 3.0)
            pix = page.get_pixmap(matrix=mat, clip=clip_rect)
            
            img_path = os.path.join(img_dir, f"SLIDE_{page_num + 1:02d}.png")
            pix.save(img_path)
            extracted += 1
            
        print(f"Extracción completada para el archivo omitido: {extracted} imágenes extraídas.")
    except Exception as e:
        print(f"Error extrayendo omitido: {e}")
