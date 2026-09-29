import fs from 'fs';
import path from 'path';

const sourceDir = path.join(process.cwd(), 'public', 'Capacitacion SAP');
const targetFile = path.join(process.cwd(), 'src', 'config', 'manualZones.ts');

function generateZones() {
    const items = fs.readdirSync(sourceDir);
    const zones: Record<string, string[]> = {};

    items.forEach(item => {
        const stats = fs.statSync(path.join(sourceDir, item));
        if (stats.isDirectory()) {
            // e.g. "10_AccBasics_11_AccBasics_Financial_Basics_ES" -> "10_AccBasics"
            // e.g. "mal 10_BinLoc_11..." -> "10_BinLoc"
            let prefix = item.split('_').slice(0, 2).join('_');
            if (item.startsWith('mal ')) {
                prefix = item.split(' ')[1].split('_').slice(0, 2).join('_');
            }
            if (item.startsWith('CSI') || item.startsWith('CSL')) {
                prefix = item.split('_')[0];
            }

            if (!zones[prefix]) {
                zones[prefix] = [];
            }
            zones[prefix].push(item);
        }
    });

    let tsContent = `// Archivo generado automáticamente\n\n`;
    tsContent += `export const manualZones: Record<string, string[]> = {\n`;
    
    for (const [zone, manuals] of Object.entries(zones)) {
        tsContent += `  "${zone}": [\n`;
        manuals.forEach(m => {
            tsContent += `    "${m}",\n`;
        });
        tsContent += `  ],\n`;
    }
    tsContent += `};\n\n`;
    
    tsContent += `export function getZoneForManual(manualName: string): string | null {\n`;
    tsContent += `  for (const [zone, manuals] of Object.entries(manualZones)) {\n`;
    tsContent += `    if (manuals.includes(manualName)) return zone;\n`;
    tsContent += `  }\n`;
    tsContent += `  return null;\n`;
    tsContent += `}\n`;

    fs.mkdirSync(path.dirname(targetFile), { recursive: true });
    fs.writeFileSync(targetFile, tsContent, 'utf-8');
    console.log(`Generated ${targetFile} with ${Object.keys(zones).length} zones.`);
}

generateZones();
