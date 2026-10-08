import os
import glob
from PIL import Image, ImageDraw, ImageFont

# ==============================================================================
# SCRIPT MAGICO PARA REEMPLAZAR MARCAS DE AGUA EN SEGUNDOS
# ==============================================================================
# Instrucciones:
# Cuando compres el dominio final, simplemente cambia el valor de la variable
# NUEVO_DOMINIO y ejecuta este script.
#
# Comando para ejecutar:
# py scripts/reemplazar_marcas_de_agua.py
# ==============================================================================

NUEVO_DOMINIO = "www.tunuevodominio.com"  # <--- CAMBIA ESTO CUANDO COMPRES EL DOMINIO

# Configuración del rectángulo para tapar la marca de agua antigua
# Ajustaremos esta altura según en qué parte exacta esté el texto "sap ecuador"
ALTURA_FOOTER = 60 # Pixeles desde abajo hacia arriba que queremos tapar
COLOR_FONDO_FOOTER = (255, 255, 255) # Blanco (Si el footer de las diapositivas es de otro color, lo cambiamos)
COLOR_TEXTO = (100, 100, 100) # Gris oscuro

def procesar_imagenes():
    # Buscar todas las diapositivas .webp en todas las clases
    ruta_busqueda = 'public/Capacitacion SAP/*/Imagenes_Diapositivas/*.webp'
    imagenes = glob.glob(ruta_busqueda)
    
    if not imagenes:
        print("No se encontraron imágenes.")
        return

    print(f"🚀 ¡Iniciando! Se encontraron {len(imagenes)} imágenes para actualizar.")
    print(f"Dominio objetivo: {NUEVO_DOMINIO}\n")
    
    # Intentar cargar una fuente de Windows, o usar una por defecto
    try:
        fuente = ImageFont.truetype("arial.ttf", 30)
    except IOError:
        fuente = ImageFont.load_default()

    contador = 0
    for ruta_img in imagenes:
        try:
            # 1. Abrir la imagen original
            img = Image.open(ruta_img).convert("RGB")
            draw = ImageDraw.Draw(img)
            ancho, alto = img.size
            
            # 2. Dibujar un rectángulo sobre la marca de agua anterior (borrado mágico)
            # Coordenadas: [x0, y0, x1, y1]
            caja_footer = [0, alto - ALTURA_FOOTER, ancho, alto]
            draw.rectangle(caja_footer, fill=COLOR_FONDO_FOOTER)
            
            # 3. Calcular la posición para que el texto nuevo quede centrado
            # Usar textbbox para saber cuánto mide el texto
            bbox = draw.textbbox((0, 0), NUEVO_DOMINIO, font=fuente)
            ancho_texto = bbox[2] - bbox[0]
            alto_texto = bbox[3] - bbox[1]
            
            x_texto = (ancho - ancho_texto) / 2
            y_texto = alto - ALTURA_FOOTER + (ALTURA_FOOTER - alto_texto) / 2 - 5 # centrado vertical
            
            # 4. Escribir el nuevo dominio
            draw.text((x_texto, y_texto), NUEVO_DOMINIO, font=fuente, fill=COLOR_TEXTO)
            
            # 5. Guardar la imagen sobreescribiendo la anterior en alta calidad
            img.save(ruta_img, "WEBP", quality=95)
            contador += 1
            
            # Mostrar progreso cada 100 imágenes para no saturar la consola
            if contador % 100 == 0:
                print(f"✅ Procesadas {contador}/{len(imagenes)} imágenes...")
                
        except Exception as e:
            print(f"Error procesando {ruta_img}: {str(e)}")

    print("\n🎉 ¡PROCESO COMPLETADO! 🎉")
    print(f"Se actualizaron {contador} diapositivas en tiempo récord. Nada de miles de horas. 😎")

if __name__ == "__main__":
    procesar_imagenes()
