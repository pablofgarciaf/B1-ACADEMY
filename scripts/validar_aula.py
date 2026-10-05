#!/usr/bin/env python3
import json
import re
import os
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent

# Expresiones regulares
RE_MODULO_DIR = re.compile(r"^M\d{2}_[a-zA-Z0-9_]+$")
RE_LECCION_DIR = re.compile(r"^M\d{2}-L\d{2}_[a-zA-Z0-9_]+$")
RE_BLOQUE_DIR = re.compile(r"^B\d{2}_(video|simulador)$")
RE_DIAPOSITIVA = re.compile(r"^M\d{2}-L\d{2}_B\d{2}_D\d{2}\.webp$")
RE_MISION = re.compile(r"^M\d{2}-L\d{2}_B\d{2}_mision\.webp$")
RE_LOGRADO = re.compile(r"^M\d{2}-L\d{2}_B\d{2}_logrado\.webp$")

def main():
    reporte = ["# Reporte de Validación de Aula SAP\n"]
    errores = []
    
    aula_dir = ROOT / "public" / "Aula_SAP"
    catalog_path = ROOT / "public" / "sap_ui_catalog.json"
    empresa_path = aula_dir / "_global" / "empresa_ficticia.json"
    
    # Cargar catálogos
    try:
        catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
        screen_ids = []
        for mod in catalog.get("modules", {}).values():
            for screen in mod.get("screens", []):
                screen_ids.append(screen["id"])
    except Exception as e:
        errores.append(f"Error cargando sap_ui_catalog.json: {e}")
        screen_ids = []

    try:
        empresa = json.loads(empresa_path.read_text(encoding="utf-8"))
        clientes = [c["codigo"] for c in empresa.get("clientes", [])]
        proveedores = [c["codigo"] for c in empresa.get("proveedores", [])]
        articulos = [c["codigo"] for c in empresa.get("articulos", [])]
        datos_empresa = set(clientes + proveedores + articulos)
    except Exception as e:
        errores.append(f"Error cargando empresa_ficticia.json: {e}")
        datos_empresa = set()

    tabla = ["| Lección | Bloques | Diapositivas | Minutos | Errores |", "|---|---|---|---|---|"]
    
    # Validar carpetas de módulo
    for mod_dir in aula_dir.iterdir():
        if not mod_dir.is_dir() or mod_dir.name.startswith("_"): continue
        if not RE_MODULO_DIR.match(mod_dir.name) or len(mod_dir.name) > 40:
            errores.append(f"Nombre de módulo inválido: {mod_dir.name}")
            
        for lec_dir in mod_dir.iterdir():
            if not lec_dir.is_dir() or lec_dir.name.endswith(".json"): continue
            if not RE_LECCION_DIR.match(lec_dir.name) or len(lec_dir.name) > 45:
                errores.append(f"Nombre de lección inválido: {lec_dir.name}")
                
            leccion_json_path = lec_dir / "leccion.json"
            if not leccion_json_path.exists():
                errores.append(f"Falta leccion.json en {lec_dir.name}")
                continue
                
            err_leccion = 0
            diap_count = 0
            bloque_count = 0
            minutos = 0
            
            try:
                leccion = json.loads(leccion_json_path.read_text(encoding="utf-8"))
                minutos = leccion.get("duracion_estimada_min", 0)
                
                # Revisar cada bloque
                for bloque in leccion.get("bloques", []):
                    bloque_count += 1
                    if bloque.get("tipo") == "simulador":
                        diap_count += 2
                        sid = bloque.get("screenId")
                        if sid not in screen_ids:
                            errores.append(f"{leccion['id']}: screenId '{sid}' no existe en catálogo.")
                            err_leccion += 1
                            
                        # Validar datos usados
                        du = bloque.get("datos_a_usar", {})
                        for k, v in du.items():
                            if k in ["cliente", "proveedor", "articulo"]:
                                if v not in datos_empresa:
                                    errores.append(f"{leccion['id']}: dato {v} no existe en empresa_ficticia.")
                                    err_leccion += 1
                                    
                        mision_w = len(bloque.get("narracion_mision", "").split())
                        if not (20 <= mision_w <= 50):
                            errores.append(f"{leccion['id']}: narracion_mision fuera de rango (20-50). Tiene {mision_w}.")
                            err_leccion += 1
                            
                    elif bloque.get("tipo") == "video":
                        for diap in bloque.get("diapositivas", []):
                            diap_count += 1
                            nw = len(diap.get("narracion", "").split())
                            if not (45 <= nw <= 90):
                                errores.append(f"{leccion['id']} {diap['archivo']}: narracion fuera de rango (45-90). Tiene {nw}.")
                                err_leccion += 1
                                
                            # Chequear archivo
                            diap_path = lec_dir / diap.get("archivo", "")
                            if not diap_path.exists():
                                errores.append(f"Diapositiva faltante: {diap_path}")
                                err_leccion += 1
                            else:
                                if diap_path.suffix == ".webp":
                                    sz = diap_path.stat().st_size
                                    if sz > 400 * 1024:
                                        errores.append(f"Archivo > 400KB: {diap_path}")
                                        err_leccion += 1
                                    try:
                                        img = Image.open(diap_path)
                                        if img.size != (1920, 1080):
                                            errores.append(f"Dimensiones incorrectas {img.size} en {diap_path}")
                                            err_leccion += 1
                                    except: pass
            except Exception as e:
                errores.append(f"JSON inválido en {lec_dir.name}: {e}")
                err_leccion += 1
                
            tabla.append(f"| {lec_dir.name} | {bloque_count} | {diap_count} | {minutos} | {err_leccion} |")

    reporte.append("## Errores detectados\n")
    if errores:
        for e in errores:
            reporte.append(f"- {e}")
    else:
        reporte.append("¡Cero errores de validación!")
        
    reporte.append("\n## Resumen de Módulos\n")
    reporte.extend(tabla)
    
    rep_dir = aula_dir / "_reportes"
    rep_dir.mkdir(exist_ok=True)
    (rep_dir / "reporte_M01.md").write_text("\n".join(reporte), encoding="utf-8")
    
    print("\n".join(reporte))

if __name__ == "__main__":
    main()
