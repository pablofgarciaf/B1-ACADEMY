const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const baseDir = "C:\\Users\\pablo\\OneDrive\\Desktop\\proyectos web\\sap academy\\public\\Capacitacion SAP";

async function extractPdfText() {
    const items = fs.readdirSync(baseDir);
    let count = 0;

    for (const item of items) {
        const modDir = path.join(baseDir, item);
        if (!fs.statSync(modDir).isDirectory()) continue;

        const files = fs.readdirSync(modDir);
        const pdfFile = files.find(f => f.toLowerCase().endsWith('.pdf'));

        if (!pdfFile) continue;

        const pdfPath = path.join(modDir, pdfFile);
        const dataBuffer = fs.readFileSync(pdfPath);

        let currentPage = 0;

        function render_page(pageData) {
            let render_options = {
                normalizeWhitespace: true,
                disableCombineTextItems: false
            };

            return pageData.getTextContent(render_options)
                .then(function(textContent) {
                    currentPage++;
                    let lastY = -1;
                    let text = `## Diapositiva ${currentPage}\n\n`;
                    for (let item of textContent.items) {
                        if (lastY !== item.transform[5] && lastY !== -1) {
                            text += '\n';
                        }
                        text += item.str + ' ';
                        lastY = item.transform[5];
                    }
                    return text + '\n\n---\n\n';
                });
        }

        let options = {
            pagerender: render_page
        };

        try {
            const data = await pdf(dataBuffer, options);
            const mdFileName = pdfFile.replace(/\.pdf$/i, '_slides.md');
            const mdFilePath = path.join(modDir, mdFileName);
            
            // Reemplazar saltos de línea innecesarios para que quede limpio
            let cleanText = data.text
                .replace(/\n{3,}/g, '\n\n') // Quita exceso de saltos
                .replace(/© 2020 SAP SE.*/g, '') // Quita copyright genérico
                .trim();

            fs.writeFileSync(mdFilePath, cleanText);
            console.log(`✅ Creado: ${mdFileName} en ${item}`);
            count++;
        } catch (err) {
            console.error(`❌ Error procesando ${pdfFile}: ${err.message}`);
        }
    }
    console.log(`\n¡Extracción de texto completada en ${count} PDFs!`);
}

extractPdfText();
