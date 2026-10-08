# 🗺️ Roadmap de Marketing y Tareas Pendientes (SAP Academy)

## 📌 1. Tareas Pendientes (Ejecución Inmediata con Nuevo Dominio)
- [ ] **Actualización Masiva de Marcas de Agua:** Cuando el usuario provea el dominio final (ej. `sap.ec`), ejecutar el script `scripts/reemplazar_marcas_de_agua.py` para reemplazar "sap ecuador" en las 2,271 imágenes `.webp` de los manuales. 
  - *Instrucción para el Agente:* Solo necesito que el usuario me pase el dominio, yo abro el script, cambio la variable `NUEVO_DOMINIO`, lo ejecuto y listo.

## 📱 2. Estrategia de Contenido Vertical (Instagram Stories & Reels / TikTok)
- [ ] **Generador de Historias (1080x1920):** Crear un script en Python (Pillow/MoviePy) que tome las diapositivas horizontales (1920x1080) y las convierta en formato vertical. 
  - *Estrategia visual:* Fondo difuminado (blur) estético arriba y abajo, diapositiva centrada, e incluir stickers simulados o llamados a la acción ("Desliza el link", "Aprende SAP hoy").

## 🎥 3. Estrategia de Videos Largos y Útiles (YouTube & Categorías)
- [ ] **Videos Completos por Manual (Formato Masterclass):** En lugar de videos cortos inútiles, el script de video unirá **TODAS** las diapositivas de un manual completo.
  - *Estructura:* 
    1. **Intro:** Título del manual narrado con música de fondo.
    2. **Desarrollo:** Narración fluida de todas las láminas, pasando de una a otra (videos de 5 a 15 minutos).
    3. **Outro/CTA:** "Suscríbete a SAP Academy y entra a [Nuevo Dominio] para certificarte".
- [ ] **Videos Resumen por Categoría:** Tomar los conceptos clave de varios manuales y hacer un video tipo "Top 5 cosas que debes saber de SAP Business One".
