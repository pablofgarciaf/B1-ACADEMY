// ═══════════════════════════════════════════════════════
// SLIDE UTILS — Conecta manuales SAP con slides reales
// ═══════════════════════════════════════════════════════

import { ALL_MANUALS } from './manuals-120-data';
import { SYSTEM_SLIDES_INDEX } from './system-slides-index';

export interface RealSlide {
  id: string;
  slideNum: number;
  filename: string;
  imageUrl: string;
  manualId: string;
  manualTitle: string;
}

/**
 * Obtiene las URLs de slides sistema (SAP UI real) de un manual específico.
 * @param manualId — ID del manual (ej: "CSL01_Introduction_Solution_ES")
 * @param maxSlides — máximo de slides a devolver (default: 30)
 */
export function getSystemSlideUrls(manualId: string, maxSlides = 30): RealSlide[] {
  const manual = ALL_MANUALS.find(m => m.id === manualId);
  if (!manual) return [];

  const systemFiles = SYSTEM_SLIDES_INDEX[manualId];
  if (!systemFiles || systemFiles.length === 0) return [];

  return systemFiles.slice(0, maxSlides).map((filename, idx) => {
    const match = filename.match(/_Slide_(\d+)_/i);
    const slideNum = match ? parseInt(match[1]) : idx + 1;
    return {
      id: `${manualId}_slide_${slideNum}`,
      slideNum,
      filename,
      imageUrl: `${manual.imagesPath}/${filename}`,
      manualId,
      manualTitle: manual.title,
    };
  });
}

/**
 * Obtiene slides sistema de varios manuales (por número de manual).
 * Útil para la "Pantalla ERP" — usa relatedManualNumbers del simulation.
 * @param manualNumbers — array de números de manual (ej: [1, 5, 23])
 * @param maxPerManual — slides máximas por manual (default: 15)
 */
export function getSystemSlidesForManuals(manualNumbers: number[], maxPerManual = 15): RealSlide[] {
  const slides: RealSlide[] = [];

  for (const num of manualNumbers) {
    const manual = ALL_MANUALS.find(m => m.number === num);
    if (!manual) continue;
    const manualSlides = getSystemSlideUrls(manual.id, maxPerManual);
    slides.push(...manualSlides);
  }

  return slides;
}

/**
 * Verifica si un manual tiene slides sistema disponibles.
 */
export function hasSystemSlides(manualId: string): boolean {
  const files = SYSTEM_SLIDES_INDEX[manualId];
  return !!(files && files.length > 0);
}
