import type { CommandData } from './company-commands';
import type { CompanyState, DocumentLine, DocType } from './firestore-types';
import { round, totals, xmlEscape } from './company-calculations';
import { sriDetailsSchema } from './firestore-types';

export const sriLabels = { '01': 'Factura', '03': 'Liquidación de compra', '04': 'Nota de crédito', '05': 'Nota de débito', '06': 'Guía de remisión', '07': 'Comprobante de retención' } as const;
export const sriSourceTypes: Record<CommandData<'sri'>['docType'], readonly DocType[]> = {
  '01': ['invoice'], '03': ['vendor_invoice'], '04': ['credit_note'],
  '05': ['debit_note'], '06': ['delivery'], '07': ['vendor_invoice', 'debit_note'],
};
const tag = (name: string, value: string | number): string => `<${name}>${xmlEscape(String(value))}</${name}>`;
const group = (name: string, children: string): string => `<${name}>${children}</${name}>`;
const amount = (value: number): string => round(value).toFixed(2);
const fiscalDate = (value: string): string => value.split('-').reverse().join('/');
const identificationType = (value: string): string => value.length === 13 ? '04' : '05';
const rateCode = (rate: number): string => rate === 15 ? '4' : rate === 5 ? '5' : '0';

function taxes(lines: DocumentLine[], detail = false): string {
  return [0, 5, 15].filter(rate => lines.some(l => l.taxRate === rate)).map(rate => {
    const values = totals(lines.filter(l => l.taxRate === rate));
    return group(detail ? 'impuesto' : 'totalImpuesto', tag('codigo', '2') + tag('codigoPorcentaje', rateCode(rate)) +
      (detail ? tag('tarifa', amount(rate)) : '') + tag('baseImponible', amount(values.subtotal)) + tag('valor', amount(values.tax)));
  }).join('');
}

function details(lines: DocumentLine[], credit = false): string {
  return group('detalles', lines.map(line => group('detalle', tag(credit ? 'codigoInterno' : 'codigoPrincipal', line.itemCode) +
    tag('descripcion', line.description) + tag('cantidad', line.quantity.toFixed(6)) + tag('precioUnitario', line.price.toFixed(6)) +
    tag('descuento', amount(round(line.quantity * line.price) - totals([line]).subtotal)) + tag('precioTotalSinImpuesto', amount(totals([line]).subtotal)) +
    group('impuestos', taxes([line], true)))).join(''));
}

/** Unsigned training XML, based on the SRI document structures. Never submits to SRI. */
export function buildSRIXml(state: CompanyState, data: CommandData<'sri'>, accessKey: string, sequential: number): string {
  const profile = state.profile;
  if (!profile) throw new Error('Empresa requerida.');
  const partner = [...state.customers, ...state.vendors].find(p => p.cardCode === data.partnerCode);
  const source = [...state.salesOrders, ...state.purchaseOrders].find(d => d.id === data.sourceDocumentId);
  if (!partner || !source || source.cardCode !== partner.cardCode || !sriSourceTypes[data.docType].includes(source.docType)) {
    throw new Error('Selecciona un documento de sustento compatible con el comprobante y el beneficiario.');
  }
  const d = sriDetailsSchema.parse(data.details);
  const modified = [...state.salesOrders, ...state.purchaseOrders].find(doc => doc.id === source.baseDocumentId);
  const electronicBase = state.sriDocuments.find(doc => doc.sourceDocumentId === modified?.id && doc.docType === '01');
  const supportNumber = electronicBase?.number ?? d.supportNumber;
  const supportDate = modified?.date ?? d.supportDate;
  if (['04', '05'].includes(data.docType) && (!supportNumber || !supportDate || !d.reason)) throw new Error('Completa número, fecha y motivo del comprobante modificado.');
  if (data.docType === '07' && !d.supportNumber) throw new Error('Ingresa el número fiscal del comprobante del proveedor.');
  const roots = { '01': 'factura', '03': 'liquidacionCompra', '04': 'notaCredito', '05': 'notaDebito', '06': 'guiaRemision', '07': 'comprobanteRetencion' } as const;
  const tributary = group('infoTributaria', tag('ambiente', '1') + tag('tipoEmision', '1') + tag('razonSocial', profile.companyName) +
    tag('ruc', profile.ruc) + tag('claveAcceso', accessKey) + tag('codDoc', data.docType) + tag('estab', data.series.slice(0, 3)) +
    tag('ptoEmi', data.series.slice(4)) + tag('secuencial', String(sequential).padStart(9, '0')) + tag('dirMatriz', d.matrixAddress));
  const dateAddress = tag('fechaEmision', fiscalDate(data.date)) + tag('dirEstablecimiento', d.establishmentAddress);
  const accounting = tag('obligadoContabilidad', d.accountingRequired ? 'SI' : 'NO');
  const buyer = tag('tipoIdentificacionComprador', identificationType(partner.ruc)) + tag('razonSocialComprador', partner.name) + tag('identificacionComprador', partner.ruc);
  const subtotal = tag('totalSinImpuestos', amount(source.subtotal));
  const discount = tag('totalDescuento', amount(source.lines.reduce((sum, line) => sum + round(line.quantity * line.price) - totals([line]).subtotal, 0)));
  const totalTaxes = group('totalConImpuestos', taxes(source.lines));
  const payments = group('pagos', group('pago', tag('formaPago', data.ats.formasDePago[0] || '20') + tag('total', amount(source.total))));
  let content = '';
  switch (data.docType) {
    case '01':
      content = group('infoFactura', dateAddress + accounting + buyer + tag('direccionComprador', partner.address || 'Dirección de práctica') + subtotal + discount + totalTaxes + tag('propina', '0.00') + tag('importeTotal', amount(source.total)) + tag('moneda', 'DOLAR') + payments) + details(source.lines);
      break;
    case '03':
      content = group('infoLiquidacionCompra', dateAddress + accounting + tag('tipoIdentificacionProveedor', identificationType(partner.ruc)) + tag('razonSocialProveedor', partner.name) + tag('identificacionProveedor', partner.ruc) + tag('direccionProveedor', partner.address || 'Dirección de práctica') + subtotal + discount + totalTaxes + tag('importeTotal', amount(source.total)) + tag('moneda', 'DOLAR') + payments) + details(source.lines);
      break;
    case '04':
      content = group('infoNotaCredito', dateAddress + buyer + accounting + tag('codDocModificado', '01') + tag('numDocModificado', supportNumber) + tag('fechaEmisionDocSustento', fiscalDate(supportDate)) + subtotal + tag('valorModificacion', amount(source.total)) + tag('moneda', 'DOLAR') + totalTaxes + tag('motivo', d.reason)) + details(source.lines, true);
      break;
    case '05':
      content = group('infoNotaDebito', dateAddress + buyer + accounting + tag('codDocModificado', '01') + tag('numDocModificado', supportNumber) + tag('fechaEmisionDocSustento', fiscalDate(supportDate)) + subtotal + group('impuestos', taxes(source.lines, true)) + tag('valorTotal', amount(source.total)) + payments) + group('motivos', group('motivo', tag('razon', d.reason) + tag('valor', amount(source.subtotal))));
      break;
    case '06': {
      if (![d.departureAddress, d.destinationAddress, d.carrierName, d.carrierId, d.plate, d.transportStart, d.transportEnd, d.reason].every(Boolean) || d.transportEnd < d.transportStart) throw new Error('Completa transportista, placa, direcciones, motivo y fechas de traslado válidas.');
      const deliveryDetails = group('detalles', source.lines.map(l => group('detalle', tag('codigoInterno', l.itemCode) + tag('descripcion', l.description) + tag('cantidad', l.quantity.toFixed(6)))).join(''));
      content = group('infoGuiaRemision', tag('dirEstablecimiento', d.establishmentAddress) + tag('dirPartida', d.departureAddress) + tag('razonSocialTransportista', d.carrierName) + tag('tipoIdentificacionTransportista', identificationType(d.carrierId)) + tag('rucTransportista', d.carrierId) + accounting + tag('fechaIniTransporte', fiscalDate(d.transportStart)) + tag('fechaFinTransporte', fiscalDate(d.transportEnd)) + tag('placa', d.plate)) + group('destinatarios', group('destinatario', tag('identificacionDestinatario', partner.ruc) + tag('razonSocialDestinatario', partner.name) + tag('dirDestinatario', d.destinationAddress) + tag('motivoTraslado', d.reason) + (d.route ? tag('ruta', d.route) : '') + deliveryDetails));
      break;
    }
    case '07': {
      const numericCodes: Record<string, string> = { 'IR-BIENES': '312', 'IR-SERVICIOS': '307', 'IR-ARRIENDO': '320', 'IR-HONORARIOS': '303', 'IVA-BIENES': '1', 'IVA-SERVICIOS': '2', 'IVA-HONORARIOS': '3' };
      const retained = group('retenciones', data.retentionLines.map(l => group('retencion', tag('codigo', l.tax === 'IR' ? '1' : '2') + tag('codigoRetencion', numericCodes[l.code] ?? l.code) + tag('baseImponible', amount(l.base)) + tag('porcentajeRetener', amount(l.rate)) + tag('valorRetenido', amount(l.base * l.rate / 100)))).join(''));
      const supportTax = group('impuestosDocSustento', [0, 5, 15].filter(rate => source.lines.some(l => l.taxRate === rate)).map(rate => { const values = totals(source.lines.filter(l => l.taxRate === rate)); return group('impuestoDocSustento', tag('codImpuestoDocSustento', '2') + tag('codigoPorcentaje', rateCode(rate)) + tag('baseImponible', amount(values.subtotal)) + tag('tarifa', amount(rate)) + tag('valorImpuesto', amount(values.tax))); }).join(''));
      const ats = data.ats;
      content = group('infoCompRetencion', dateAddress + accounting + tag('tipoIdentificacionSujetoRetenido', identificationType(partner.ruc)) + tag('parteRel', ats.parteRel ? 'SI' : 'NO') + tag('razonSocialSujetoRetenido', partner.name) + tag('identificacionSujetoRetenido', partner.ruc) + tag('periodoFiscal', data.date.slice(5, 7) + '/' + data.date.slice(0, 4))) + group('docsSustento', group('docSustento', tag('codSustento', ats.sustentoTributario || '01') + tag('codDocSustento', source.docType === 'debit_note' ? '05' : '01') + tag('numDocSustento', d.supportNumber.replaceAll('-', '')) + tag('fechaEmisionDocSustento', fiscalDate(source.date)) + tag('fechaRegistroContable', fiscalDate(ats.fechaRegistro)) + tag('pagoLocExt', ats.pagoLocExt) + (ats.pagoLocExt === '02' ? tag('paisEfecPago', ats.paisEfecPago) + tag('aplicConvDobTrib', ats.aplicConvDobTrib ? 'SI' : 'NO') + tag('pagExtSujRetNorLeg', ats.pagExtSujRetNorLeg ? 'SI' : 'NO') : '') + subtotal + tag('importeTotal', amount(source.total)) + supportTax + retained + payments));
      break;
    }
  }
  const additional = '<infoAdicional><campoAdicional nombre="SIMULADO">Ejercicio académico sin firma ni validez tributaria</campoAdicional></infoAdicional>';
  return `<?xml version="1.0" encoding="UTF-8"?>\n<!-- SIMULACIÓN EDUCATIVA. No enviar al SRI. -->\n<${roots[data.docType]} id="comprobante" version="${data.docType === '07' ? '2.0.0' : data.docType === '05' ? '1.0.0' : '1.1.0'}">${tributary}${content}${additional}</${roots[data.docType]}>`.replaceAll('><', '>\n<');
}
