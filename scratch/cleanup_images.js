const fs = require('fs');
const path = require('path');

const baseDir = "C:\\Users\\pablo\\OneDrive\\Desktop\\proyectos web\\sap academy\\public\\Capacitacion SAP";

const items = fs.readdirSync(baseDir);
let processedCount = 0;

for (const item of items) {
    const modDir = path.join(baseDir, item);
    
    // Skip if it's not a directory
    if (!fs.statSync(modDir).isDirectory()) continue;

    const imgDir = path.join(modDir, 'Imagenes_Diapositivas');
    
    // Si no existe la carpeta Imagenes_Diapositivas, la ignoramos
    if (!fs.existsSync(imgDir)) continue;

    const todasDir = path.join(imgDir, 'Todas');
    const sugDir = path.join(imgDir, 'Sugeridas');
    const noSugDir = path.join(imgDir, 'No_Sugeridas');

    let modified = false;

    // 1. Mover archivos de "Todas" a "Imagenes_Diapositivas" y borrar "Todas"
    if (fs.existsSync(todasDir)) {
        const files = fs.readdirSync(todasDir);
        for (const file of files) {
            const oldPath = path.join(todasDir, file);
            const newPath = path.join(imgDir, file);
            fs.renameSync(oldPath, newPath);
        }
        fs.rmSync(todasDir, { recursive: true, force: true });
        modified = true;
    }

    // 2. Eliminar "Sugeridas"
    if (fs.existsSync(sugDir)) {
        fs.rmSync(sugDir, { recursive: true, force: true });
        modified = true;
    }

    // 3. Eliminar "No_Sugeridas"
    if (fs.existsSync(noSugDir)) {
        fs.rmSync(noSugDir, { recursive: true, force: true });
        modified = true;
    }

    if (modified) {
        console.log(`✅ Procesado y limpiado: ${item}`);
        processedCount++;
    }
}

console.log(`\n¡Limpieza completada! Se actualizaron ${processedCount} carpetas.`);
