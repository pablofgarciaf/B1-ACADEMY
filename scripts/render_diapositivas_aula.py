#!/usr/bin/env python3
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import re

ROOT = Path(__file__).resolve().parent.parent

def main():
    aula_dir = ROOT / "public" / "Aula_SAP"
    
    # Busca todos los leccion.json
    for leccion_path in aula_dir.rglob("leccion.json"):
        leccion_dir = leccion_path.parent
        data = json.loads(leccion_path.read_text(encoding="utf-8"))
        
        for bloque in data.get("bloques", []):
            diapositivas = bloque.get("diapositivas", [])
            
            if bloque.get("tipo") == "simulador":
                diapositivas.append({
                    "archivo": bloque.get("tarjeta_mision"),
                    "titulo_en_pantalla": "Misión"
                })
                diapositivas.append({
                    "archivo": bloque.get("tarjeta_logrado"),
                    "titulo_en_pantalla": "¡Logrado!"
                })
            
            for diap in diapositivas:
                out_file = diap.get("archivo")
                if out_file:
                    out_path = leccion_dir / out_file
                    if out_path.exists():
                        continue
                        
                    print(f"Renderizando (dummy) {out_path.name}...")
                    
                    # Create a 1920x1080 image
                    img = Image.new("RGB", (1920, 1080), color="#F4F6FA")
                    draw = ImageDraw.Draw(img)
                    
                    # Attempt to paste the illustration if it exists
                    ilu_file = diap.get("ilustracion")
                    if ilu_file:
                        ilu_path = leccion_dir / ilu_file
                        if ilu_path.exists():
                            try:
                                ilu_img = Image.open(ilu_path).convert("RGBA")
                                ilu_img.thumbnail((900, 800))
                                img.paste(ilu_img, (950, 140), ilu_img)
                            except Exception as e:
                                print(f"Error pegando ilustración {ilu_file}: {e}")
                    
                    # Add some dummy text to simulate the render
                    titulo = diap.get("titulo_en_pantalla", "")
                    draw.text((100, 100), titulo, fill="#0B3D91", size=64)
                    
                    y = 200
                    for p in diap.get("puntos_en_pantalla", []):
                        draw.text((100, y), f"■ {p}", fill="#1F2937", size=36)
                        y += 60
                    
                    # Footer
                    draw.rectangle([(0, 950), (1920, 1080)], fill="#ffffff")
                    draw.text((80, 1000), "SAP Academy Ecuador", fill="#0B3D91", size=32)
                    
                    out_path.parent.mkdir(parents=True, exist_ok=True)
                    img.save(out_path, "WEBP", quality=85, method=6)

if __name__ == "__main__":
    main()
