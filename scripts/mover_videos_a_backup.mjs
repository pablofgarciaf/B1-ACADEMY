import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public', 'Capacitacion SAP');
const backupDir = path.join(process.cwd(), '_backup_videos_descartados');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

console.log('Moviendo videos MP4 descartados fuera de public/...');

let moved = 0;
let totalBytes = 0;

function scanAndMove(dir, relPath = '') {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanAndMove(fullPath, path.join(relPath, item));
    } else if (item.endsWith('.mp4')) {
      const targetSubdir = path.join(backupDir, relPath);
      if (!fs.existsSync(targetSubdir)) {
        fs.mkdirSync(targetSubdir, { recursive: true });
      }
      const targetPath = path.join(targetSubdir, item);
      fs.renameSync(fullPath, targetPath);
      moved++;
      totalBytes += stat.size;
      console.log(`[MOVIDO] ${path.join(relPath, item)} -> ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
    }
  }
}

scanAndMove(publicDir);

console.log(`\n✅ Proceso completado:`);
console.log(`• Videos movidos: ${moved}`);
console.log(`• Espacio liberado en public/: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
console.log(`• Ubicación segura de respaldo: ${backupDir}`);
