#!/usr/bin/env python3
import os
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent

def main():
    aula_dir = ROOT / "public" / "Aula_SAP"
    for png_file in aula_dir.rglob("*.png"):
        webp_file = png_file.with_suffix(".webp")
        if not webp_file.exists():
            print(f"Convirtiendo {png_file.name} a {webp_file.name}")
            img = Image.open(png_file).convert("RGB")
            img.save(webp_file, "WEBP", quality=85, method=6)
        # png_file.unlink() # Opcionalmente borrar el PNG

if __name__ == "__main__":
    main()
