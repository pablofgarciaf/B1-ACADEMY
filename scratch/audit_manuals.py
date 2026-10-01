import os
import glob

base_dir = os.path.join("public", "Capacitacion SAP")
skip = ["01_Revision_BUENAS", "02_Revision_MALAS_CUARENTENA", "para corregir"]

dirs = [d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d)) and d not in skip]
dirs.sort()

ready_for_video = []
missing_images = []
missing_slides = []

for d in dirs:
    d_path = os.path.join(base_dir, d)
    img_dir = os.path.join(d_path, "Imagenes_Diapositivas")
    has_img = os.path.exists(img_dir) and len([f for f in os.listdir(img_dir) if f.endswith(('.webp', '.png', '.jpg'))]) > 0
    slides = glob.glob(os.path.join(d_path, "*_slides.md"))
    has_video = os.path.exists(os.path.join(d_path, "clase_video.mp4"))
    
    if not has_img:
        missing_images.append(d)
    elif not slides:
        missing_slides.append(d)
    else:
        ready_for_video.append((d, has_video))

print(f"Total manuales evaluados: {len(dirs)}")
print(f"Listos con imagenes y slides: {len(ready_for_video)}")
print(f"Ya tienen video: {sum(1 for _, v in ready_for_video if v)}")
print(f"Pendientes por generar video: {sum(1 for _, v in ready_for_video if not v)}")
print(f"Sin imagenes: {len(missing_images)} ({missing_images[:5]})")
print(f"Sin slides.md: {len(missing_slides)}")
