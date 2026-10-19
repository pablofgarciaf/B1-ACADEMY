/**
 * Utilidades de cálculo y resultados para pantallas de configuración y recursos.
 */

export function executionTime(tiempoPorUnidad: string, unidadesPorPeriodo: number): string {
  if (!tiempoPorUnidad) return '00:00:00';
  const parts = tiempoPorUnidad.split(':').map(n => Number(n) || 0);
  const totalSeconds = (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
  const units = Math.max(1, Number(unidadesPorPeriodo) || 1);
  const secs = Math.round(totalSeconds / units);
  const h = Math.floor(secs / 3600).toString().padStart(2, '0');
  const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}
