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
  
  // 1. Obtener Markdown de texto (_slides.md)
  const manualDir = path.join(process.cwd(), 'public', 'Capacitacion SAP', manualId);
  let content = "No se pudo cargar el contenido de texto para este manual.";
  
  if (fs.existsSync(manualDir)) {
    // Buscar archivo *_slides.md dentro de la carpeta del manual
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

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200 selection:bg-amber-500/30">
      <OfflineManager currentManualId={manualId} />
      
      <header className="sticky top-0 z-40 border-b border-gray-800 bg-[#131a20]/90 backdrop-blur-lg px-6 py-4">
        <h1 className="text-xl font-medium text-white">{displayTitle}</h1>
        <p className="text-sm text-gray-400">
          {manualData?.category || 'Manual SAP Business One'} • {images.length} diapositivas
        </p>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        <ManualViewer content={content} images={images} />
      </main>
    </div>
  );
}
