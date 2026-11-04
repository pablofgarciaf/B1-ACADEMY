/**
 * Caché en memoria para respuestas de IA (FeNi AI / Advisor).
 *
 * ESTRATEGIA:
 * - LRU (Least-Recently-Used) + TTL de 24 h.
 * - Vive en el módulo → persiste dentro del mismo contenedor serverless.
 * - Solo cachea respuestas reales del modelo (no fallbacks de error).
 * - Clave semántica: normaliza la pregunta + contexto.
 *
 * "Respuestas útiles en caché": cuando FeNi ya respondió bien
 * "¿Cómo hago una factura?" el caché la devuelve en <1 ms la próxima vez.
 */

const MAX_ENTRIES = 500;
const TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

interface Entry { response: string; ts: number }

class AIResponseCache {
  private readonly map = new Map<string, Entry>();

  get(key: string): string | null {
    const entry = this.map.get(key);
    if (!entry) return null;
    if (Date.now() - entry.ts > TTL_MS) {
      this.map.delete(key);
      return null;
    }
    // LRU: mover al final (más reciente)
    this.map.delete(key);
    this.map.set(key, entry);
    return entry.response;
  }

  set(key: string, response: string): void {
    // Solo cachear respuestas con contenido real
    if (!response || response.length < 30) return;
    if (this.map.has(key)) this.map.delete(key);
    // LRU eviction: borrar el más viejo cuando se llena
    if (this.map.size >= MAX_ENTRIES) {
      const oldest = this.map.keys().next().value;
      if (oldest) this.map.delete(oldest);
    }
    this.map.set(key, { response, ts: Date.now() });
  }

  get size() { return this.map.size; }
}

export const aiCache = new AIResponseCache();

/**
 * Construye la clave de caché normalizando texto.
 * Incluir contexto (screen, módulo) para que el mismo "¿cómo lo hago?"
 * en distintas pantallas no devuelva la respuesta equivocada.
 */
export function buildCacheKey(...parts: string[]): string {
  return parts
    .map(p =>
      p.toLowerCase()
       .trim()
       .replace(/[^\w\s]/g, '') // quitar puntuación
       .replace(/\s+/g, ' ')
       .slice(0, 200)           // limitar longitud de cada parte
    )
    .join('||');
}
