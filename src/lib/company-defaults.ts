import { atsSchema } from './firestore-types';
import type { CommandData } from './company-commands';
import { today } from './company-calculations';
export function defaultATS(): CommandData<'sri'>['ats'] { return atsSchema.parse({ sustentoTributario: '01', tpIdProv: '01', idProv: '', tipoComprobante: '01', parteRel: false, fechaRegistro: today(), establecimiento: '001', puntoEmision: '001', secuencial: '', autorizacion: '', fechaEmision: today(), baseNoGraIva: 0, baseImponible: 0, baseImpGrav: 0, baseImpExe: 0, montoIce: 0, montoIva: 0, valRetBien10: 0, valRetServ20: 0, valorRetBienes: 0, valRetServ50: 0, valorRetServicios: 0, valRetServ100: 0, totbasesImpReemb: 0, pagoLocExt: '01', paisEfecPago: '593', aplicConvDobTrib: false, pagExtSujRetNorLeg: false, formasDePago: ['20'], tipoEmision: 'E', compensaciones: [], retencionesRecibidas: 0 }); }
export const retentionOptions = [
  { code: 'IR-BIENES', label: 'IR Bienes · 1%', tax: 'IR', rate: 1 }, { code: 'IR-SERVICIOS', label: 'IR Servicios · 2%', tax: 'IR', rate: 2 }, { code: 'IR-ARRIENDO', label: 'IR Arrendamiento · 8%', tax: 'IR', rate: 8 }, { code: 'IR-HONORARIOS', label: 'IR Honorarios · 10%', tax: 'IR', rate: 10 }, { code: 'IVA-BIENES', label: 'IVA Bienes · 30%', tax: 'IVA', rate: 30 }, { code: 'IVA-SERVICIOS', label: 'IVA Servicios · 70%', tax: 'IVA', rate: 70 }, { code: 'IVA-HONORARIOS', label: 'IVA Honorarios · 100%', tax: 'IVA', rate: 100 },
] as const;
export const levelNames = ['Aprendiz SAP', 'Analista SAP', 'Consultor Junior SAP', 'Consultor SAP', 'Consultor Senior SAP'];
