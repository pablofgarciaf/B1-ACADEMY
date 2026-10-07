import { atsSchema } from './firestore-types';
import type { CommandData } from './company-commands';
import { today } from './company-calculations';
import { RETENCIONES_2026 } from './sri-catalogo';
export function defaultATS(): CommandData<'sri'>['ats'] { return atsSchema.parse({ sustentoTributario: '01', tpIdProv: '01', idProv: '', tipoComprobante: '01', parteRel: false, fechaRegistro: today(), establecimiento: '001', puntoEmision: '001', secuencial: '', autorizacion: '', fechaEmision: today(), baseNoGraIva: 0, baseImponible: 0, baseImpGrav: 0, baseImpExe: 0, montoIce: 0, montoIva: 0, valRetBien10: 0, valRetServ20: 0, valorRetBienes: 0, valRetServ50: 0, valorRetServicios: 0, valRetServ100: 0, totbasesImpReemb: 0, pagoLocExt: '01', paisEfecPago: '593', aplicConvDobTrib: false, pagExtSujRetNorLeg: false, formasDePago: ['20'], tipoEmision: 'E', compensaciones: [], retencionesRecibidas: 0 }); }
/** Opciones de retención para las pantallas: salen de la tabla SRI 2026 (sri-catalogo.ts), única fuente. */
export const retentionOptions = RETENCIONES_2026.map(o => ({ code: o.id, label: o.label, tax: o.tax, rate: o.rate }));
export const levelNames = ['Aprendiz SAP', 'Analista SAP', 'Consultor Junior SAP', 'Consultor SAP', 'Consultor Senior SAP'];
