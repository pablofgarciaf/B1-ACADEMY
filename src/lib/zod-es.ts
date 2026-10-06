import type { ZodIssue } from 'zod';

/** Nombres de campo en español para los mensajes de validación de importaciones. */
const CAMPOS: Record<string, string> = {
  name: 'Nombre', ruc: 'RUC/Cédula', email: 'Correo', phone: 'Teléfono', city: 'Ciudad', address: 'Dirección',
  paymentTermsDays: 'Días de crédito', creditLimit: 'Cupo de crédito', group: 'Grupo', kind: 'Tipo de socio',
  type: 'Tipo de artículo', price: 'Precio', price2: 'Precio mayorista', price3: 'Precio distribuidor',
  purchasePrice: 'Precio de compra', maxDiscount: 'Descuento máximo', minStock: 'Stock mínimo', maxStock: 'Stock máximo',
  reorderPoint: 'Punto de reorden', costingMethod: 'Método de costeo', standardCost: 'Costo estándar', active: 'Activo',
};

/** Traduce un error de validación de zod a un mensaje claro en español. */
export function mensajeValidacion(issue: ZodIssue, saltarPrimero = true): string {
  const ruta = (saltarPrimero ? issue.path.slice(1) : issue.path).map(String);
  const campo = ruta.length ? ruta.map(p => CAMPOS[p] ?? p).join(' › ') : 'Dato';
  let detalle = issue.message;
  if (issue.code === 'invalid_string' || detalle === 'Invalid') detalle = issue.path.includes('ruc') ? 'debe tener 10 dígitos (cédula) o 13 (RUC)' : issue.path.includes('email') ? 'no es un correo válido' : 'formato no válido';
  else if (issue.code === 'invalid_type') detalle = issue.received === 'undefined' ? 'es obligatorio' : issue.expected === 'number' ? 'debe ser un número' : `tipo no válido (se esperaba ${issue.expected})`;
  else if (issue.code === 'too_small') detalle = issue.type === 'string' ? `debe tener al menos ${issue.minimum} caracteres` : `debe ser mayor o igual a ${issue.minimum}`;
  else if (issue.code === 'too_big') detalle = issue.type === 'string' ? `admite máximo ${issue.maximum} caracteres` : `debe ser menor o igual a ${issue.maximum}`;
  else if (issue.code === 'invalid_enum_value') detalle = `debe ser uno de: ${issue.options.join(', ')}`;
  return `${campo}: ${detalle}`;
}
