const fs = require('fs');
const path = require('path');

const mdDir = path.join('C:\\Users\\pablo\\OneDrive\\Desktop\\proyectos web\\sap academy\\public\\Capacitacion_SAP_Markdowns_Limpios');

const files = fs.readdirSync(mdDir);

let renamedCount = 0;

for (const file of files) {
  if (!file.endsWith('.md')) continue;
  
  const filePath = path.join(mdDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Try to find the original folder name using regex
  // It usually looks like 10_AccBasics_11_AccBasics_Financial_Basics_ES
  let originalName = null;
  
  const unitIdMatch = content.match(/"unit_id":\s*"([^"]+)"/);
  if (unitIdMatch && unitIdMatch[1].match(/[A-Za-z]/)) {
     originalName = unitIdMatch[1];
  }
  
  if (!originalName) {
    const codMatch = content.match(/(?:Código|C.digo) de Manual:\s*([^\s\r\n]+)/);
    if (codMatch) originalName = codMatch[1];
  }
  
  if (!originalName) {
    const carpetaMatch = content.match(/(?:Carpeta Asociada|Original):\s*([^\s\r\n]+)/);
    if (carpetaMatch) originalName = carpetaMatch[1];
  }

  if (originalName) {
    // Strip prefixes like "092_" or "001_" if present, to match the original folder exactly.
    // E.g., "092_10_Sales_41_Process_Autom_ES" -> "10_Sales_41_Process_Autom_ES"
    let cleanName = originalName.replace(/^\d{3}_/, '');
    
    // Add .md extension
    const newName = cleanName + '.md';
    const newPath = path.join(mdDir, newName);
    
    if (filePath !== newPath) {
      console.log(`Renaming ${file} -> ${newName}`);
      fs.renameSync(filePath, newPath);
      renamedCount++;
    }
  } else {
    console.log(`Could not find mapping for ${file}`);
  }
}

console.log(`\nSuccessfully renamed ${renamedCount} files.`);
