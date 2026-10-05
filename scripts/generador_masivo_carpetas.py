#!/usr/bin/env python3
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def sanitize(text):
    text = text.replace(" ", "_").replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u").replace("ñ", "n")
    return re.sub(r'[^A-Za-z0-9_]', '', text)

def main():
    malla_path = ROOT / "src/content/malla/malla.json"
    if not malla_path.exists():
        print("Malla no encontrada")
        return
        
    malla = json.loads(malla_path.read_text(encoding="utf-8"))
    aula_dir = ROOT / "public" / "Aula_SAP"
    aula_dir.mkdir(parents=True, exist_ok=True)
    
    for mod in malla.get("modulos", []):
        mod_id = mod.get("id")
        # Ya tenemos M01, lo saltamos para no sobreescribir
        if mod_id == "M01": continue
        
        titulo_mod = sanitize(mod.get("name", "Modulo"))[:36]
        mod_dir = aula_dir / f"{mod_id}_{titulo_mod}"
        mod_dir.mkdir(parents=True, exist_ok=True)
        
        # Calcular cuantas lecciones
        num_lecciones = mod.get("baseClasses", 0) + mod.get("extraClasses", 0) + mod.get("integratorClass", 0)
        if num_lecciones == 0: num_lecciones = 1
        
        lecciones_lista = []
        
        for i in range(1, num_lecciones + 1):
            lec_id = f"{mod_id}-L{i:02d}"
            titulo_lec = f"Leccion {i}"
            lec_dir = mod_dir / f"{lec_id}_{sanitize(titulo_lec)}"
            lec_dir.mkdir(parents=True, exist_ok=True)
            
            b01 = lec_dir / "B01_video"
            b01.mkdir(exist_ok=True)
            
            leccion_data = {
                "id": lec_id,
                "modulo": mod_id,
                "titulo": titulo_lec,
                "pregunta_central": f"¿Cómo resolver el reto {i}?",
                "objetivos": ["Aprender", "Practicar"],
                "duracion_estimada_min": 10,
                "fuentes": [],
                "bloques": [
                    {
                        "id": "B01",
                        "tipo": "video",
                        "titulo": "Introduccion",
                        "diapositivas": [
                            {
                                "archivo": f"B01_video/{lec_id}_B01_D01.webp",
                                "tipo": "portada",
                                "titulo_en_pantalla": f"{mod_id} Intro",
                                "puntos_en_pantalla": [],
                                "narracion": "Bienvenidos a esta nueva leccion. Aqui aprenderemos los conceptos fundamentales para operar el sistema correctamente y entender su flujo de inicio a fin. Además, ten en cuenta que este concepto es fundamental para poder dominar las herramientas que ofrece SAP Business One en el día a día operativo."
                            }
                        ]
                    }
                ]
            }
            (lec_dir / "leccion.json").write_text(json.dumps(leccion_data, indent=2, ensure_ascii=False), encoding="utf-8")
            lecciones_lista.append(lec_id)
            
        (mod_dir / "modulo.json").write_text(json.dumps({"id": mod_id, "lecciones": lecciones_lista}, indent=2), encoding="utf-8")

if __name__ == "__main__":
    main()
