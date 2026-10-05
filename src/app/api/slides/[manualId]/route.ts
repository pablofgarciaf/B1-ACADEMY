import { NextRequest, NextResponse } from 'next/server';
import { ALL_SLIDES_INDEX } from '@/lib/all-slides-index';
import { ALL_MANUALS } from '@/lib/manuals-120-data';

/**
 * GET /api/slides/[manualId]
 * Devuelve las URLs de todas las slides de un manual
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ manualId: string }> }
) {
  const { manualId } = await params;

  const manual = ALL_MANUALS.find(m => m.id === manualId || m.slug === manualId);
  if (!manual) {
    return NextResponse.json({ error: 'Manual no encontrado' }, { status: 404 });
  }

  const filenames = ALL_SLIDES_INDEX[manual.id];
  if (!filenames || filenames.length === 0) {
    return NextResponse.json({ slides: [], total: 0 });
  }

  const slides = filenames.map((filename, idx) => {
    const match = filename.match(/_Slide_(\d+)_/i);
    const slideNum = match ? parseInt(match[1]) : idx + 1;
    return {
      id: `${manual.id}_${slideNum}`,
      slideNum,
      filename,
      url: `${manual.imagesPath}/${filename}`,
    };
  });

  return NextResponse.json({
    manualId: manual.id,
    title: manual.title,
    category: manual.category,
    totalSlides: slides.length,
    slides,
  });
}
