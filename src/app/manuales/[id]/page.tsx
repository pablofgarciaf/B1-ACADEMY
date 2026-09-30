import fs from 'fs';
import path from 'path';
import ManualViewer from '@/components/site/ManualViewer';
import OfflineManager from '@/components/site/OfflineManager';
import { ALL_MANUALS } from '@/lib/manuals-120-data';

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'public', 'Capacitacion SAP');
  const skipDirs = ['01_Revision_BUENAS', '02_Revision_MALAS_CUARENTENA', 'para corregir', '10_Service_11_CSProcess'];
  const items = fs.readdirSync(dir)
    .filter(i => {
      if (skipDirs.includes(i)) return false;
      return fs.statSync(path.join(dir, i)).isDirectory();
    });
  return items.map(id => ({ id }));
}

export default async function ManualPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const manualId = decodeURIComponent(resolvedParams.id);
  
  // Buscar datos del manual en la base de datos
  const manualData = ALL_MANUALS.find(m => m.id === manualId);
  const displayTitle = manualData?.title || manualId.replace(/_/g, ' ');
  
  const manualDir = path.join(process.cwd(), 'public', 'Capacitacion SAP', manualId);
  
  // 1. Obtener Markdown de texto (_slides.md) (Fallback por si no hay JSON)
  let content = "No se pudo cargar el contenido de texto para este manual.";
  if (fs.existsSync(manualDir)) {
    const files = fs.readdirSync(manualDir);
    const slidesFile = files.find(f => f.endsWith('_slides.md'));
    if (slidesFile) {
      content = fs.readFileSync(path.join(manualDir, slidesFile), 'utf-8');
    }
  }

  // 2. Obtener imágenes de diapositivas
  const imagesDir = path.join(manualDir, 'Imagenes_Diapositivas');
  let images: string[] = [];
  if (fs.existsSync(imagesDir)) {
    images = fs.readdirSync(imagesDir)
      .filter(f => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp'))
      .sort() // Ordenar alfabéticamente para mantener secuencia de slides
      .map(f => `/Capacitacion SAP/${manualId}/Imagenes_Diapositivas/${f}`);
  }

  // 3. Verificar si existe el video generado por la IA
  let videoUrl: string | undefined = undefined;
  if (fs.existsSync(path.join(manualDir, 'clase_video.mp4'))) {
    videoUrl = `/Capacitacion SAP/${manualId}/clase_video.mp4`;
  }

  // 4. Leer los metadatos de sincronización (JSON Teleprompter)
  let syncData = null;
  const syncFile = path.join(manualDir, 'clase_sync.json');
  if (fs.existsSync(syncFile)) {
    try {
      syncData = JSON.parse(fs.readFileSync(syncFile, 'utf-8'));
    } catch (e) {
      console.error("Error parseando clase_sync.json:", e);
    }
  }

  return (
    <div className="h-screen max-h-screen flex flex-col bg-[#0a0a0f] text-gray-200 selection:bg-amber-500/30 overflow-hidden">
      <OfflineManager currentManualId={manualId} />
      
      <header className="shrink-0 border-b border-gray-800 bg-[#131a20]/90 backdrop-blur-lg px-6 py-2.5 flex items-center justify-between">
        <div>
          <h1 className="text-base sm:text-lg font-medium text-white leading-tight">{displayTitle}</h1>
          <p className="text-xs text-gray-400">
            {manualData?.category || 'Módulo SAP'} • {videoUrl ? 'Clase Interactiva Disponible' : `${images.length} diapositivas`}
          </p>
        </div>
        <a 
          href="/manuales" 
          className="text-xs font-semibold text-gray-300 hover:text-white bg-gray-800/80 hover:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-700 transition-all flex items-center gap-1.5 active:scale-95"
        >
          ← Volver a Biblioteca
        </a>
      </header>

      <main className="flex-1 min-h-0 overflow-hidden p-2.5 sm:p-4 max-w-[1700px] w-full mx-auto">
        <ManualViewer 
          manualId={manualId} 
          content={content} 
          images={images} 
          videoUrl={videoUrl} 
          syncData={syncData} 
        />
      </main>
    </div>
  );
}
