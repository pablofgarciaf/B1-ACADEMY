#!/usr/bin/env python3
import json
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent

def main():
    aula_dir = ROOT / "public" / "Aula_SAP"
    
    # Busca todos los leccion.json
    for leccion_path in aula_dir.rglob("leccion.json"):
        leccion_dir = leccion_path.parent
        data = json.loads(leccion_path.read_text(encoding="utf-8"))
        
        for bloque in data.get("bloques", []):
            for diap in bloque.get("diapositivas", []):
                ilu_path_rel = diap.get("ilustracion")
                if ilu_path_rel:
                    ilu_path = leccion_dir / ilu_path_rel
                    if ilu_path.exists():
                        continue
                    
                    print(f"Generando DUMMY {ilu_path.name}...")
                    
                    img = Image.new("RGB", (1600, 900), color="#cccccc")
                    draw = ImageDraw.Draw(img)
                    draw.line((0, 0, 1600, 900), fill="#999999", width=5)
                    draw.line((0, 900, 1600, 0), fill="#999999", width=5)
                    
                    ilu_path.parent.mkdir(parents=True, exist_ok=True)
                    img.save(ilu_path, "WEBP", quality=85, method=6)

if __name__ == "__main__":
    main()
