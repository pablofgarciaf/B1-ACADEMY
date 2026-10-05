import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

async function main() {
  const aulaDir = path.join(ROOT, 'public', 'Aula_SAP');
  const templatePath = path.join(aulaDir, '_global', 'plantilla_diapositiva.html');
  const templateHtml = await fs.readFile(templatePath, 'utf8');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  async function renderSlide(leccionDir, diap, leccionId, slideIndex, totalSlides) {
    const destPath = path.join(leccionDir, diap.archivo);
    
    // Check if it exists
    try {
      await fs.access(destPath);
      return; // Already exists
    } catch (e) {}

    console.log(`Renderizando ${destPath}...`);

    let layout = "layout-normal";
    if (diap.tipo === "portada") layout = "layout-portada";
    if (diap.tipo === "mision" || diap.tipo === "logrado") layout = "layout-mision";

    let contentHtml = '';
    if (diap.puntos_en_pantalla && diap.puntos_en_pantalla.length > 0) {
      contentHtml = `<ul class="bullets">` + 
        diap.puntos_en_pantalla.map(p => `<li>${p}</li>`).join('') + 
        `</ul>`;
    }

    let imgUrl = "";
    if (diap.ilustracion) {
      const imgPath = path.join(leccionDir, diap.ilustracion);
      try {
        const ext = path.extname(imgPath).substring(1);
        const imgBuffer = await fs.readFile(imgPath);
        imgUrl = `data:image/${ext};base64,${imgBuffer.toString('base64')}`;
      } catch (e) {
        console.warn(`WARNING: Imagen ${diap.ilustracion} no encontrada para ${diap.archivo}`);
      }
    }

    const titleParts = leccionId.split('-');
    const mStr = titleParts[0];
    const lStr = titleParts[1];

    let html = templateHtml
      .replace(/\{\{TIPO_LAYOUT\}\}/g, layout)
      .replace(/\{\{TITULO\}\}/g, diap.titulo_en_pantalla || "")
      .replace(/\{\{SUBTITULO\}\}/g, "") // Podemos poner la pregunta central aquí si es portada
      .replace(/\{\{CONTENIDO\}\}/g, contentHtml)
      .replace(/\{\{IMAGEN_SRC\}\}/g, imgUrl)
      .replace(/\{\{PIE_IZQ\}\}/g, "SAP Academy Ecuador")
      .replace(/\{\{PIE_DER\}\}/g, `${mStr} · ${lStr} · ${slideIndex}/${totalSlides}`);

    await page.setContent(html, { waitUntil: 'networkidle' });
    
    // For local webfonts like Inter, it might take a moment if from google fonts, wait
    await page.waitForTimeout(500);

    await fs.mkdir(path.dirname(destPath), { recursive: true });
    
    const buffer = await page.screenshot({ type: 'jpeg', quality: 85 });
    // Playwright natively doesn't support webp direct screenshot in some versions, 
    // but newer versions do. Let's try to convert via sharp, or just save as jpeg 
    // and rename to webp (which is bad), wait, playwright DOES support 'png' and 'jpeg'.
    // The prompt says "convierte a WebP calidad 85". 
    // I can just output it using the Sharp library or just command line.
    // Let's use sharp if it's available, if not, I'll use python.
    
    // To make it easy, I'll save as PNG and convert using python later or write a python script.
    // Actually, I can use a python script to do the Playwright rendering if I install playwright in python.
    // Let's just output PNG here, and run a python script to convert, or just see if we can do webp.
    // Actually wait, I will write the validation and conversion in Python.
    
    await fs.writeFile(destPath.replace('.webp', '.png'), await page.screenshot({ type: 'png' }));
    console.log(` -> OK (PNG guardado, requiere conversión a webp)`);
  }

  // Iterate over lessons
  const modulesDir = await fs.readdir(aulaDir);
  for (const mod of modulesDir) {
    if (mod.startsWith('M') && !mod.endsWith('.json')) {
      const modDir = path.join(aulaDir, mod);
      const stats = await fs.stat(modDir);
      if (stats.isDirectory()) {
        const lecciones = await fs.readdir(modDir);
        for (const lec of lecciones) {
          const lecDir = path.join(modDir, lec);
          const stat2 = await fs.stat(lecDir);
          if (stat2.isDirectory()) {
            const jsonPath = path.join(lecDir, 'leccion.json');
            try {
              const data = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
              let totalDiaps = 0;
              data.bloques.forEach(b => {
                if (b.diapositivas) totalDiaps += b.diapositivas.length;
                if (b.tipo === "simulador") totalDiaps += 2; // mision + logrado
              });
              
              let currentDiap = 1;
              for (const bloque of data.bloques) {
                if (bloque.diapositivas) {
                  for (const diap of bloque.diapositivas) {
                    await renderSlide(lecDir, diap, data.id, currentDiap++, totalDiaps);
                  }
                }
                if (bloque.tipo === "simulador") {
                  // Mision
                  await renderSlide(lecDir, {
                    archivo: bloque.tarjeta_mision,
                    tipo: "mision",
                    titulo_en_pantalla: "Misión en SAP",
                    puntos_en_pantalla: [bloque.mision]
                  }, data.id, currentDiap++, totalDiaps);
                  
                  // Logrado
                  await renderSlide(lecDir, {
                    archivo: bloque.tarjeta_logrado,
                    tipo: "logrado",
                    titulo_en_pantalla: "¡Misión Cumplida!",
                    puntos_en_pantalla: ["Has completado la actividad correctamente."]
                  }, data.id, currentDiap++, totalDiaps);
                }
              }
            } catch(e) {}
          }
        }
      }
    }
  }

  await browser.close();
}

main().catch(console.error);
