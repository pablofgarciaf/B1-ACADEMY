import os
import sys
import json

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

BASE_DIR = os.path.join("public", "Capacitacion SAP")
DOC_PLAN = os.path.join("docs", "PLAN_MAESTRO_LECCIONES_PEDAGOGICAS.md")

skip = ["01_Revision_BUENAS", "02_Revision_MALAS_CUARENTENA", "para corregir"]
dirs = [d for d in os.listdir(BASE_DIR) if os.path.isdir(os.path.join(BASE_DIR, d)) and d not in skip]
dirs.sort()

perfect_manuals = []
no_slides_manuals = []
incomplete_manuals = []

print(f"=== AUDITORÍA EXHAUSTIVA DE PARIDAD 1 A 1 (121 MANUALES) ===\n")

for idx, d in enumerate(dirs, 1):
    manual_dir = os.path.join(BASE_DIR, d)
    img_dir = os.path.join(manual_dir, "Imagenes_Diapositivas")
    video_path = os.path.join(manual_dir, "clase_video.mp4")
    sync_path = os.path.join(manual_dir, "clase_sync.json")

    # 1. Conteo de imágenes
    num_imgs = 0
    if os.path.exists(img_dir):
        imgs = [f for f in os.listdir(img_dir) if f.endswith(('.webp', '.png', '.jpg'))]
        num_imgs = len(imgs)

    if num_imgs == 0:
        no_slides_manuals.append(d)
        continue

    # 2. Comprobar video
    has_video = os.path.exists(video_path) and os.path.getsize(video_path) > 100000
    video_mb = round(os.path.getsize(video_path) / (1024 * 1024), 2) if has_video else 0

    # 3. Comprobar JSON de sincronización
    has_sync = os.path.exists(sync_path)
    sync_slides = 0
    total_duration = 0.0
    if has_sync:
        try:
            with open(sync_path, "r", encoding="utf-8") as f:
                sync_data = json.load(f)
            sync_slides = len(sync_data)
            if sync_data:
                total_duration = sync_data[-1].get("end_time", 0.0)
        except Exception:
            pass

    # 4. Validación de paridad
    if has_video and has_sync and sync_slides == num_imgs:
        perfect_manuals.append({
            "name": d,
            "slides": num_imgs,
            "video_mb": video_mb,
            "duration": total_duration
        })
    else:
        incomplete_manuals.append({
            "name": d,
            "imgs": num_imgs,
            "has_video": has_video,
            "video_mb": video_mb,
            "sync_slides": sync_slides,
            "diff": num_imgs - sync_slides
        })

print(f"📊 RESUMEN AUDITORÍA:")
print(f"  ✅ Manuales con Paridad Perfecta (100% video y diapositivas): {len(perfect_manuals)}")
print(f"  ⚪ Manuales de Caso Práctico / SQL (sin diapositivas gráficas): {len(no_slides_manuals)}")
print(f"  ❌ Manuales Incompletos o con discrepancias: {len(incomplete_manuals)}\n")

if incomplete_manuals:
    print("DETALLE DE MANUALES DISCREPANTES:")
    for item in incomplete_manuals:
        print(f"  - {item['name']}: {item['imgs']} imágenes en carpeta vs {item['sync_slides']} en sync. Video: {item['video_mb']} MB (Faltan: {item['diff']})")
else:
    print("🎉 ¡TODOS LOS MANUALES CON DIAPOSITIVAS TIENEN PARIDAD 100% PERFECTA!")

# Actualizar el PLAN_MAESTRO en docs
if os.path.exists(DOC_PLAN):
    with open(DOC_PLAN, "r", encoding="utf-8") as f:
        plan_content = f.read()
    
    plan_lines = plan_content.splitlines()
    new_plan_lines = []
    for line in plan_lines:
        for p in perfect_manuals:
            if f"`{p['name']}`" in line:
                line = line.replace("[ ] Pendiente", "[x] Completado (Clase Pedagógica)")
        for n in no_slides_manuals:
            if f"`{n}`" in line:
                line = line.replace("[ ] Pendiente", "⚪ Sin diapositivas (Caso Práctico / SQL)")
        new_plan_lines.append(line)
        
    with open(DOC_PLAN, "w", encoding="utf-8") as f:
        f.write("\n".join(new_plan_lines) + "\n")
    print(f"\n[OK] Bitácora {DOC_PLAN} sincronizada con la auditoría.")
