import os
import sys
import json
import asyncio
import subprocess
import edge_tts
from mutagen.mp3 import MP3

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

MANUAL_NAME = '10_Intro_11_Overview_IntroSAPB1_ES'
BASE_DIR = os.path.join('public', 'Capacitacion SAP', MANUAL_NAME)
IMG_DIR = os.path.join(BASE_DIR, 'Imagenes_Diapositivas')
OUTPUT_VIDEO = os.path.join(BASE_DIR, 'clase_video.mp4')
SYNC_FILE = os.path.join(BASE_DIR, 'clase_sync.json')

# 19 Guiones Magistrales Pedagógicos (Consultor Senior / Docente de Élite)
# Cero menciones a 'diapositiva', cero textos repetitivos, explicaciones profundas de negocio
SCRIPTS = [
    # Slide 1 (060_Slide_01)
    " Bienvenidos a este curso integral sobre SAP Business One versión diez punto cero. En esta sesión abordaremos la visión estratégica de la plataforma líder en el mercado mundial para empresas en expansión. Comprenderemos su arquitectura el funcionamiento de sus módulos centrales y cómo transforma la gestión operativa y financiera en un entorno unificado y en tiempo real.\,
 
 # Slide 2 (060_Slide_02)
 \El objetivo central de este módulo es dominar los fundamentos que definen a SAP Business One como la columna vertebral de un negocio. Aprenderemos a identificar el valor de operar con procesos empresariales completamente integrados examinaremos las capacidades analíticas de la herramienta y conoceremos su alcance como plataforma digital moderna para acelerar la toma de decisiones.\,
 
 # Slide 3 (060_Slide_03)
 \Pensemos en el desafío habitual de la dirección general en una compañía en crecimiento: la información está dispersa en hojas de cálculo aisladas los pedidos de ventas tardan en llegar a compras y el control de inventario sufre retrasos constantes. Ante este escenario la empresa necesita un sistema de gestión empresarial que estandarice las operaciones reduzca la fricción administrativa y establezca una base sólida para competir en la economía digital.\,
 
 # Slide 4 (060_Slide_04)
 \Hoy en día la transformación digital ya no es un proyecto futuro sino una exigencia cotidiana. Vivimos en un ecosistema interconectado donde clientes y proveedores demandan inmediatez y trazabilidad absoluta. Para mantener la rentabilidad las empresas deben disponer de datos confiables en el momento exacto conectando no solo sus oficinas internas sino toda su cadena de valor.\,
 
 # Slide 5 (060_Slide_05)
 \SAP Business One es la solución de gestión empresarial diseñada específicamente para pequeñas y medianas empresas con el respaldo de más de setenta mil clientes y casi un millón de usuarios a nivel global. Su gran fortaleza radica en que centraliza finanzas compras almacenes ventas y soporte en una única base de datos eliminando la duplicidad de registros y permitiendo que toda la organización hable el mismo idioma.\,
 
 # Slide 6 (060_Slide_06)
 \La plataforma está concebida para incorporar tecnologías disruptivas sin complejidad innecesaria. Permite procesar grandes volúmenes de datos con analítica avanzada operar en la nube o en servidores propios conectar a la fuerza laboral mediante aplicaciones móviles y enlazar dispositivos de internet de las cosas como básculas industriales o sensores de almacén directamente con las transacciones operativas.\,
 
 # Slide 7 (060_Slide_07)
 \El núcleo digital de SAP Business One abarca de forma nativa todo el ciclo operativo. Desde la gestión de relaciones con clientes y pedidos en ventas pasando por el aprovisionamiento y facturación en compras el control de inventarios multialmacén la planificación de materiales y producción hasta la contabilidad general con contabilizaciones automáticas en el libro mayor. Cada documento registrado alimenta de inmediato los estados financieros sin necesidad de interfaces intermedias.\,
 
 # Slide 8 (060_Slide_08)
 \Analicemos un ciclo operativo real: un cliente solicita equipos personalizados. El sistema evalúa la disponibilidad y corre el asistente de planificación de materiales para determinar los componentes faltantes. Se generan automáticamente las solicitudes de compra a proveedores y las órdenes de fabricación. Al recibirse los materiales y ensamblar el producto la entrega registra los números de serie crea la tarjeta de equipo del cliente con su garantía y habilita el módulo de servicio para gestionar cualquier eventualidad postventa bajo acuerdos de nivel de servicio garantizados.\,
 
 # Slide 9 (060_Slide_09)
 \En cuanto a su infraestructura técnica SAP Business One ofrece flexibilidad total. Puede ejecutarse sobre el motor relacional tradicional Microsoft SQL Server o sobre la base de datos columnar en memoria SAP HANA la cual procesa analítica masiva en cuestión de milisegundos. Además el ecosistema cuenta con la potente interfaz Service Layer basada en servicios REST el kit de desarrollo de software y el marco de integración para conectarse con cualquier aplicación externa.\,
 
 # Slide 10 (060_Slide_10)
 \Las empresas pueden elegir el modelo de despliegue que mejor se ajuste a su estrategia financiera. El modelo On-Premise utiliza infraestructura interna y licencias perpetuas optimizando el gasto de capital a largo plazo y garantizando control total de los servidores locales. Por su parte el modelo Cloud funciona bajo suscripción mensual reduciendo la inversión inicial y ofreciendo acceso seguro vía navegador web desde cualquier lugar sin depender de un departamento de tecnologías interno.\,
 
 # Slide 11 (060_Slide_11)
 \Para corporaciones con filiales o tiendas en línea SAP Business One incluye soluciones de integración empresarial preconfiguradas. Permite consolidar balances y armonizar catálogos entre casas matrices que utilizan SAP S/4HANA y subsidiarias con Business One. Asimismo el centro de integración facilita la sincronización automática con plataformas de comercio electrónico como Shopify o Magento y con operadores logísticos internacionales como DHL o FedEx.\,
 
 # Slide 12 (060_Slide_12)
 \Gracias a la red mundial de socios tecnológicos de SAP existen cientos de soluciones complementarias certificadas. Estas soluciones agregan funcionalidades especializadas para industrias verticales como manufactura pesada alimentos y bebidas con trazabilidad sanitaria distribución mayorista construcción y retail asegurando que el sistema se adapte con precisión milimétrica a las normas particulares de cada sector.\,
 
 # Slide 13 (060_Slide_13)
 \La movilidad es un elemento fundamental para la productividad del personal comercial y de campo. Mediante las aplicaciones oficiales para dispositivos iOS y Android los consultores de ventas pueden consultar listas de precios verificar existencias de bodega y emitir cotizaciones directamente frente al cliente. Del mismo modo los técnicos de mantenimiento tienen acceso inmediato al historial de incidentes y firmas digitales en sitio.\,
 
 # Slide 14 (060_Slide_14)
 \El entorno analítico de la versión SAP HANA transforma los datos transaccionales en inteligencia estratégica. El panel de trabajo estilo Fiori en HTML5 despliega indicadores clave de desempeño gráficos interactivos y alertas tempranas configuradas según el rol del usuario. Además la capa semántica permite que los gerentes consulten información financiera y operativa en Microsoft Excel utilizando nombres de negocio comprensibles sin requerir conocimientos de programación.\,
 
 # Slide 15 (060_Slide_15)
 \Para la presentación formal de documentos legales y auditorías el sistema integra de manera nativa SAP Crystal Reports. Esta herramienta permite diseñar tanto la diagramación visual de facturas cheques y guías de remisión como informes analíticos de alta complejidad con subinformes condicionales exportables a formatos PDF hojas de cálculo o enviados automáticamente por correo electrónico.\,
 
 # Slide 16 (060_Slide_16)
 \El Cliente Web de SAP Business One representa la evolución moderna de la experiencia de usuario. Diseñado bajo los estándares estéticos de SAP Fiori permite gestionar el ciclo completo de ventas crear ofertas procesar pedidos de clientes dar seguimiento a actividades comerciales y analizar gráficos dinámicos desde cualquier navegador web moderno tanto en computadoras de escritorio como en tabletas.\,
 
 # Slide 17 (060_Slide_17)
 \La presencia internacional del software está respaldada por cincuenta localizaciones legales nativas y soporte para veintiocho idiomas operando con éxito en más de ciento setenta países. Esto garantiza el cumplimiento estricto de las exigencias tributarias locales retenciones de impuestos facturación electrónica y formatos contables oficiales en cada país donde tu empresa decida expandirse.\,
 
 # Slide 18 (060_Slide_18)
 \Para acompañar el ciclo de vida de la implementación SAP y su red de canales ofrecen centros de recursos especializados. Entre ellos destacan el portal PartnerEdge para documentación técnica avanzada el SAP Help Portal con guías operativas detalladas cursos oficiales en Learning Hub y canales audiovisuales continuos que mantienen actualizados a consultores y usuarios clave.\,
 
 # Slide 19 (060_Slide_19)
 \En conclusión SAP Business One consolida todas las áreas de una organización en un único sistema robusto escalable y en tiempo real. Su capacidad de operar en nube o local la potencia de cálculo en memoria con SAP HANA y su flexibilidad de integración lo convierten en la solución definitiva para impulsar el crecimiento rentable y el control total de cualquier empresa moderna.\
]

async def build_masterclass():
 images = sorted([f for f in os.listdir(IMG_DIR) if f.endswith(('.webp', '.png', '.jpg'))])
 print(f'Total imágenes encontradas: {len(images)}')
 print(f'Total guiones pedagógicos: {len(SCRIPTS)}')
 assert len(images) == len(SCRIPTS), 'El número de imágenes y guiones debe ser idéntico'

 temp_files = []
 video_clips = []
 sync_data = []
 current_time = 0.0

 for idx, (img_name, script_text) in enumerate(zip(images, SCRIPTS), 1):
 print(f'\n--- Procesando Slide {idx}/{len(SCRIPTS)} ---')
 img_path = os.path.join(IMG_DIR, img_name)
 audio_file = f'temp_intro11_aud_{idx}.mp3'
 video_clip = f'temp_intro11_vid_{idx}.mp4'

 # 1. Generar audio con Edge-TTS
 comm = edge_tts.Communicate(script_text, 'es-MX-JorgeNeural')
 await comm.save(audio_file)
 audio_duration = MP3(audio_file).info.length
 clip_duration = audio_duration + 0.6 # Pausa docente de respiración

 # 2. Renderizar video clip con ffmpeg en 1080p
 cmd_ffmpeg = [
 'ffmpeg', '-y', '-loop', '1', '-framerate', '25',
 '-i', img_path, '-i', audio_file,
 '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black',
 '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '26',
 '-af', 'apad=pad_dur=0.6', '-c:a', 'aac', '-b:a', '128k', '-ar', '44100', '-pix_fmt', 'yuv420p',
 '-t', str(clip_duration), video_clip
 ]
 subprocess.run(cmd_ffmpeg, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

 start_t = round(current_time, 2)
 end_t = round(current_time + clip_duration, 2)
 current_time += clip_duration

 sync_data.append({
 'slide_index': idx,
 'image_file': img_name,
 'script_text': script_text,
 'start_time': start_t,
 'end_time': end_t
 })

 temp_files.extend([audio_file, video_clip])
 video_clips.append(video_clip)
 print(f'✓ Slide {idx} renderizada ({audio_duration:.1f}s | {start_t}s -> {end_t}s)')

 # Concatenar video final
 concat_list = 'concat_intro11.txt'
 with open(concat_list, 'w', encoding='utf-8') as f:
 for vc in video_clips:
 f.write(f\file {vc} \n\)

 print('\nConcatenando video final clase_video.mp4...')
 cmd_concat = ['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', concat_list, '-c', 'copy', OUTPUT_VIDEO]
 subprocess.run(cmd_concat, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

 # Guardar clase_sync.json
 with open(SYNC_FILE, 'w', encoding='utf-8') as f:
 json.dump(sync_data, f, ensure_ascii=False, indent=2)

 # Limpiar temporales
 temp_files.append(concat_list)
 for tf in temp_files:
 if os.path.exists(tf):
 try: os.remove(tf)
 except: pass

 print(f'\n🎉 ¡CLASE PEDAGÓGICA INTRO 11 FINALIZADA EXITOSAMENTE!')
 print(f'Duración total: {current_time:.1f} segundos ({current_time/60:.2f} minutos)')
 print(f'Video guardado en: {OUTPUT_VIDEO}')
 print(f'Sync guardado en: {SYNC_FILE}')

if __name__ == '__main__':
 asyncio.run(build_masterclass())
