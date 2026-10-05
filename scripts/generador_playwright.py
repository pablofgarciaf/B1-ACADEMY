import json
import os
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

TEMPLATE = """
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body, html {
            margin: 0; padding: 0;
            width: 1920px; height: 1080px;
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #F4F6FA 0%, #E2E8F0 100%);
            overflow: hidden;
            color: #1F2937;
            display: flex;
        }
        .container {
            width: 100%; height: 100%;
            display: flex;
            position: relative;
        }
        .left-panel {
            flex: 0 0 55%;
            padding: 120px 80px 120px 140px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .right-panel {
            flex: 0 0 45%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        h1 {
            font-family: 'Montserrat', sans-serif;
            font-weight: 800;
            font-size: 110px;
            color: #0B3D91;
            margin: 0 0 60px 0;
            line-height: 1.1;
            letter-spacing: -2px;
        }
        ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        li {
            font-size: 50px;
            font-weight: 600;
            margin-bottom: 40px;
            display: flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.6);
            padding: 25px 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.03);
            border: 1px solid rgba(255,255,255,0.8);
        }
        li svg {
            margin-right: 30px;
            color: #2563EB;
            width: 50px;
            height: 50px;
            flex-shrink: 0;
        }
        .footer-left {
            position: absolute;
            bottom: 60px;
            left: 140px;
            font-size: 30px;
            font-weight: 600;
            color: #64748B;
        }
        .footer-right {
            position: absolute;
            bottom: 60px;
            right: 140px;
            font-size: 35px;
            font-weight: 800;
            color: #0B3D91;
            font-family: 'Montserrat', sans-serif;
        }
        .illustration-bg {
            position: absolute;
            width: 800px;
            height: 800px;
            background: radial-gradient(circle, rgba(37,99,235,0.1) 0%, rgba(37,99,235,0) 70%);
            border-radius: 50%;
            z-index: 0;
        }
        .icon-container {
            z-index: 1;
            width: 450px;
            height: 450px;
            background: white;
            border-radius: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 40px 80px rgba(11, 61, 145, 0.1), inset 0 0 0 10px rgba(37, 99, 235, 0.05);
            transform: rotate(-5deg);
        }
        .icon-container svg {
            width: 250px;
            height: 250px;
            color: #0B3D91;
            stroke-width: 1.5;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="left-panel">
            <h1>{titulo}</h1>
            <ul>
                {lista_html}
            </ul>
        </div>
        <div class="right-panel">
            <div class="illustration-bg"></div>
            <div class="icon-container">
                <i data-lucide="{lucide_icon}"></i>
            </div>
        </div>
        <div class="footer-left">SAP Academy Ecuador</div>
        <div class="footer-right">{modulo_leccion}</div>
    </div>
    <script>
        lucide.createIcons();
    </script>
</body>
</html>
"""

async def generar_imagen(page, titulo, puntos, modulo_leccion, output_path):
    lista_html = ""
    for p in puntos:
        lista_html += f'<li><i data-lucide="check-circle"></i>{p}</li>'
    
    # Mapeo simple de iconos según palabras clave
    icon = "layers"
    tl = titulo.lower()
    if 'misión' in tl or 'simulador' in tl: icon = "target"
    elif 'logrado' in tl or 'cumplida' in tl: icon = "award"
    elif 'resumen' in tl or 'aprendimos' in tl: icon = "book-open"
    elif 'datos' in tl or 'maestro' in tl: icon = "database"
    elif 'erp' in tl or 'sistema' in tl: icon = "server"
    elif 'finanzas' in tl or 'conta' in tl: icon = "pie-chart"
    elif 'compra' in tl: icon = "shopping-cart"
    elif 'venta' in tl: icon = "trending-up"
    elif 'inventario' in tl or 'almacén' in tl: icon = "package"

    html = TEMPLATE.replace("{titulo}", titulo)
    html = html.replace("{lista_html}", lista_html)
    html = html.replace("{lucide_icon}", icon)
    html = html.replace("{modulo_leccion}", modulo_leccion)
    
    await page.set_content(html, wait_until="networkidle")
    # Dar tiempo para que lucide renderice los SVG y se carguen fuentes
    await page.wait_for_timeout(200)
    
    temp_path = str(output_path).replace(".webp", ".png")
    await page.screenshot(path=temp_path, type="png")
    
    from PIL import Image
    import os
    img = Image.open(temp_path)
    img.save(output_path, "WEBP", quality=90)
    os.remove(temp_path)
    
    print(f"Generado: {output_path}")

async def main():
    base_dir = Path("public/Aula_SAP")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Pantalla exacta 1920x1080
        context = await browser.new_context(viewport={"width": 1920, "height": 1080})
        page = await context.new_page()

        # Iterar módulos
        for mod_dir in sorted(base_dir.glob("M*")):
            if not mod_dir.is_dir(): continue
            mod_prefix = mod_dir.name[:3] # M01, M02...
            
            for lec_dir in sorted(mod_dir.glob("M*-L*")):
                if not lec_dir.is_dir(): continue
                lec_json = lec_dir / "leccion.json"
                if not lec_json.exists(): continue
                
                try:
                    data = json.loads(lec_json.read_text(encoding='utf-8'))
                except:
                    continue
                
                # Para el footer, ej: M01 · L01
                mod_lec_str = f"{mod_prefix} · {lec_dir.name.split('_')[0].split('-')[1]}"
                
                for bloque in data.get("bloques", []):
                    b_id = bloque.get("id", "B0X")
                    
                    if bloque.get("tipo") == "video":
                        for diap in bloque.get("diapositivas", []):
                            archivo_rel = diap.get("archivo", "")
                            if not archivo_rel: continue
                            
                            titulo = diap.get("titulo_en_pantalla", "")
                            puntos = diap.get("puntos_en_pantalla", [])
                            
                            # Guardaremos como .webp
                            out_name = Path(archivo_rel).with_suffix(".webp").name
                            out_dir = lec_dir / Path(archivo_rel).parent
                            out_dir.mkdir(parents=True, exist_ok=True)
                            out_path = out_dir / out_name
                            
                            # Solo generamos si no existe
                            if not out_path.exists():
                                await generar_imagen(page, titulo, puntos, mod_lec_str, str(out_path))
                                
                    elif bloque.get("tipo") == "simulador":
                        # Mision
                        m_titulo = "Misión del Simulador"
                        m_puntos = [bloque.get("mision", "Sigue las instrucciones")]
                        m_file = lec_dir / f"{b_id}_simulador" / f"{mod_prefix}-{lec_dir.name.split('_')[0].split('-')[1]}_{b_id}_mision.webp"
                        m_file.parent.mkdir(parents=True, exist_ok=True)
                        if not m_file.exists():
                            await generar_imagen(page, m_titulo, m_puntos, mod_lec_str, str(m_file))
                        
                        # Logrado
                        l_titulo = "¡Misión Cumplida!"
                        l_puntos = ["Has completado el ejercicio exitosamente"]
                        l_file = lec_dir / f"{b_id}_simulador" / f"{mod_prefix}-{lec_dir.name.split('_')[0].split('-')[1]}_{b_id}_logrado.webp"
                        if not l_file.exists():
                            await generar_imagen(page, l_titulo, l_puntos, mod_lec_str, str(l_file))

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
