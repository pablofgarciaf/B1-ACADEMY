import type { CompanyState } from './firestore-types';
import { round, totals, xmlEscape } from './company-calculations';
import { opcionRetencion } from './sri-catalogo';

/** Marcador que el validador rechaza: el ATS real exige la autorización del comprobante del proveedor. */
export const ATS_AUTORIZACION_PENDIENTE = '0000000000';

const tag = (name: string, value: string | number): string => `<${name}>${xmlEscape(String(value))}</${name}>`;
const amount = (value: number): string => round(value).toFixed(2);
const fiscalDate = (value: string): string => value.split('-').reverse().join('/');

export interface ATSValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    period: string;
    totalVentas: number;
    totalCompras: number;
    totalIvaVentas: number;
    totalIvaCompras: number;
    totalRetencionesEmitidas: number;
    totalRetencionesRecibidas: number;
    countVentas: number;
    countCompras: number;
  };
}

/**
 * Generador Oficial del Anexo Transaccional Simplificado (ATS) para el SRI del Ecuador.
 * Cumple con la ficha técnica y especificación XML del DIMM / SRI en línea.
 */
export function buildATSXml(state: CompanyState, period: string): string {
  const profile = state.profile;
  if (!profile) throw new Error('Datos de la empresa requeridos para generar el ATS.');

  const [anio, mes] = period.split('-');
  if (!anio || !mes) throw new Error('Período inválido (formato esperado AAAA-MM).');

  // Filtrar transacciones del período fiscal
  const sales = state.salesOrders.filter(
    (d) => d.date.startsWith(period) && ['invoice', 'credit_note'].includes(d.docType),
  );
  const purchases = state.purchaseOrders.filter(
    (d) => d.date.startsWith(period) && ['vendor_invoice', 'debit_note'].includes(d.docType),
  );
  const sriRetentions = state.sriDocuments.filter(
    (d) => d.date.startsWith(period) && d.docType === '07' && d.status === 'AUTORIZADO',
  );

  const totalVentas = sales.reduce(
    (s, d) => s + d.total * (d.docType === 'credit_note' ? -1 : 1),
    0,
  );

  // Cabecera Informante
  const header =
    tag('TipoIDInformante', 'R') +
    tag('IdInformante', profile.ruc) +
    tag('razonSocial', profile.companyName) +
    tag('Anio', anio) +
    tag('Mes', mes) +
    tag('numEstabRuc', '001') +
    tag('totalVentas', amount(Math.max(0, totalVentas))) +
    tag('codigoOperativo', 'IVA');

  // Sección Compras
  let comprasXml = '';
  if (purchases.length > 0) {
    const itemsCompras = purchases.map((purchase) => {
      const vendor = state.vendors.find((v) => v.cardCode === purchase.cardCode);
      const ruc = vendor?.ruc || '0999999999001';
      const tpIdProv = ruc.length === 13 ? '01' : '02';
      const tipoProv = ruc.length === 13 && ruc.endsWith('001') && !ruc.startsWith('099') && !ruc.startsWith('179') ? '01' : '02';
      const base0 = totals(purchase.lines.filter((l) => l.taxRate === 0)).subtotal;
      const baseGravada = totals(purchase.lines.filter((l) => l.taxRate > 0)).subtotal;
      const iva = purchase.tax;

      // Buscar si tiene comprobante de retención emitido
      const retDoc = sriRetentions.find((r) => r.sourceDocumentId === purchase.id);
      const airLines = retDoc?.retentionLines.filter((l) => l.tax === 'IR') || [];
      const ivaRetLines = retDoc?.retentionLines.filter((l) => l.tax === 'IVA') || [];

      const valRetBien10 = ivaRetLines.filter((l) => l.rate === 10).reduce((s, l) => s + round((l.base * l.rate) / 100), 0);
      const valRetServ20 = ivaRetLines.filter((l) => l.rate === 20).reduce((s, l) => s + round((l.base * l.rate) / 100), 0);
      const valorRetBienes = ivaRetLines.filter((l) => l.rate === 30 || l.rate === 70).reduce((s, l) => s + round((l.base * l.rate) / 100), 0);
      const valRetServ50 = ivaRetLines.filter((l) => l.rate === 50).reduce((s, l) => s + round((l.base * l.rate) / 100), 0);
      const valorRetServicios = ivaRetLines.filter((l) => l.rate === 100).reduce((s, l) => s + round((l.base * l.rate) / 100), 0);

      let airXml = '';
      if (airLines.length > 0) {
        airXml = `<air>${airLines
          .map((l) => {
            const codSRI = opcionRetencion(l.code)?.codigo || l.code.replace('IR-', '');
            return (
              '<detalleAir>' +
              tag('codRetAir', codSRI) +
              tag('baseImpAir', amount(l.base)) +
              tag('porcentajeAir', amount(l.rate)) +
              tag('valRetAir', amount(round((l.base * l.rate) / 100))) +
              '</detalleAir>'
            );
          })
          .join('')}</air>`;
      }

      const pagoExterior =
        '<pagoExterior>' +
        tag('pagoLocExt', '01') +
        tag('paisEfecPago', 'NA') +
        tag('aplicConvDobTrib', 'NA') +
        tag('pagExtSujRetNorLeg', 'NA') +
        '</pagoExterior>';

      const formasPago =
        '<formasDePago>' +
        tag('formaPago', '20') +
        '</formasDePago>';

      const numDoc = (purchase.reference || '001-001-000000001').replace(/-/g, '').padStart(15, '0');
      const estab = numDoc.slice(0, 3) || '001';
      const ptoEmi = numDoc.slice(3, 6) || '001';
      const secuencial = numDoc.slice(6) || '000000001';

      return (
        '<detalleCompras>' +
        tag('codSustento', '01') +
        tag('tpIdProv', tpIdProv) +
        tag('idProv', ruc) +
        tag('tipoComprobante', purchase.docType === 'debit_note' ? '05' : '01') +
        tag('tipoProv', tipoProv) +
        tag('denominacionProv', vendor?.name || 'PROVEEDOR LOCAL') +
        tag('parteRel', 'NO') +
        tag('fechaRegistro', fiscalDate(purchase.date)) +
        tag('establecimiento', estab) +
        tag('puntoEmision', ptoEmi) +
        tag('secuencial', secuencial) +
        tag('fechaEmision', fiscalDate(purchase.date)) +
        tag('autorizacion', /^(\d{10}|\d{37}|\d{49})$/.test(retDoc?.claveAcceso ?? '') ? retDoc!.claveAcceso : ATS_AUTORIZACION_PENDIENTE) +
        tag('baseNoGraIva', '0.00') +
        tag('baseImponible', amount(base0)) +
        tag('baseImpGrav', amount(baseGravada)) +
        tag('baseImpExe', '0.00') +
        tag('montoIce', amount(purchase.ice || 0)) +
        tag('montoIva', amount(iva)) +
        tag('valRetBien10', amount(valRetBien10)) +
        tag('valRetServ20', amount(valRetServ20)) +
        tag('valorRetBienes', amount(valorRetBienes)) +
        tag('valRetServ50', amount(valRetServ50)) +
        tag('valorRetServicios', amount(valorRetServicios)) +
        tag('valRetServ100', '0.00') +
        tag('totbasesImpReemb', '0.00') +
        pagoExterior +
        formasPago +
        airXml +
        '</detalleCompras>'
      );
    }).join('');
    comprasXml = `<compras>${itemsCompras}</compras>`;
  }

  // Sección Ventas
  let ventasXml = '';
  if (sales.length > 0) {
    const itemsVentas = sales.map((sale) => {
      const customer = state.customers.find((c) => c.cardCode === sale.cardCode);
      const ruc = customer?.ruc || '9999999999999';
      const tpIdCliente = ruc === '9999999999999' ? '07' : ruc.length === 13 ? '04' : '05';
      const base0 = totals(sale.lines.filter((l) => l.taxRate === 0)).subtotal;
      const baseGravada = totals(sale.lines.filter((l) => l.taxRate > 0)).subtotal;
      const iva = sale.tax;

      return (
        '<detalleVentas>' +
        tag('tpIdCliente', tpIdCliente) +
        tag('idCliente', ruc) +
        tag('parteRelVtas', 'NO') +
        tag('tipoComprobante', '18') +
        tag('tipoEmision', 'E') +
        tag('numeroComprobantes', '1') +
        tag('baseNoGraIva', '0.00') +
        tag('baseImponible', amount(base0)) +
        tag('baseImpGrav', amount(baseGravada)) +
        tag('montoIva', amount(iva)) +
        tag('montoIce', amount(sale.ice || 0)) +
        tag('valorRetIva', '0.00') +
        tag('valorRetRenta', '0.00') +
        '<formasDePago>' +
        tag('formaPago', '20') +
        '</formasDePago>' +
        '</detalleVentas>'
      );
    }).join('');
    ventasXml = `<ventas>${itemsVentas}</ventas>`;
  }

  // Ventas por Establecimiento
  const ventasEstablecimiento =
    '<ventasEstablecimiento>' +
    '<ventaEst>' +
    tag('codEstab', '001') +
    tag('ventasEstab', amount(Math.max(0, totalVentas))) +
    tag('ivaComp', '0.00') +
    '</ventaEst>' +
    '</ventasEstablecimiento>';

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<iva>
  ${header}
  ${comprasXml}
  ${ventasXml}
  ${ventasEstablecimiento}
</iva>`.replace(/\n\s*\n/g, '\n');
}

/**
 * Validador estricto del Anexo Transaccional Simplificado (ATS) según el estándar del SRI.
 */
export function validateATS(state: CompanyState, period: string): ATSValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const profile = state.profile;
  if (!profile) {
    errors.push('Falta inicializar la empresa con RUC y razón social.');
    return {
      valid: false,
      errors,
      warnings,
      summary: {
        period,
        totalVentas: 0,
        totalCompras: 0,
        totalIvaVentas: 0,
        totalIvaCompras: 0,
        totalRetencionesEmitidas: 0,
        totalRetencionesRecibidas: 0,
        countVentas: 0,
        countCompras: 0,
      },
    };
  }

  if (!/^\d{10}001$/.test(profile.ruc)) {
    errors.push(`El RUC de la empresa (${profile.ruc}) no cumple la estructura oficial de 13 dígitos terminada en 001.`);
  }

  const sales = state.salesOrders.filter(
    (d) => d.date.startsWith(period) && ['invoice', 'credit_note'].includes(d.docType),
  );
  const purchases = state.purchaseOrders.filter(
    (d) => d.date.startsWith(period) && ['vendor_invoice', 'debit_note'].includes(d.docType),
  );
  const sriDocs = state.sriDocuments.filter((d) => d.date.startsWith(period));

  const totalVentas = sales.reduce((s, d) => s + d.subtotal * (d.docType === 'credit_note' ? -1 : 1), 0);
  const totalIvaVentas = sales.reduce((s, d) => s + d.tax * (d.docType === 'credit_note' ? -1 : 1), 0);
  const totalCompras = purchases.reduce((s, d) => s + d.subtotal, 0);
  const totalIvaCompras = purchases.reduce((s, d) => s + d.tax, 0);

  const retEmitidas = sriDocs
    .filter((d) => d.docType === '07' && d.status === 'AUTORIZADO')
    .reduce((s, d) => s + d.totalRetention, 0);
  const retRecibidas = sriDocs.reduce((s, d) => s + (d.ats?.retencionesRecibidas || 0), 0);

  // Validaciones de consistencia
  for (const p of purchases) {
    const vendor = state.vendors.find((v) => v.cardCode === p.cardCode);
    if (!vendor) errors.push(`Factura de proveedor ${p.docNumber} no tiene proveedor registrado.`);
    else if (!vendor.ruc || vendor.ruc.length < 10) {
      errors.push(`Proveedor ${vendor.name} (${vendor.cardCode}) tiene RUC/Cédula inválido: ${vendor.ruc}.`);
    }
  }

  for (const p of purchases) {
    const retDoc = sriDocs.find((r) => r.docType === '07' && r.sourceDocumentId === p.id);
    if (!/^(\d{10}|\d{37}|\d{49})$/.test(retDoc?.claveAcceso ?? '')) {
      warnings.push(
        `Compra ${p.docNumber}: falta el número de autorización del comprobante del proveedor (10, 37 o 49 dígitos); el DIMM rechazará el anexo hasta registrarlo.`,
      );
    }
  }

  for (const s of sales) {
    const customer = state.customers.find((c) => c.cardCode === s.cardCode);
    if (!customer) errors.push(`Factura de venta ${s.docNumber} no tiene cliente registrado.`);
    else if (!customer.ruc) {
      warnings.push(`Cliente ${customer.name} no tiene RUC; se reportará con Consumidor Final (9999999999999).`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    summary: {
      period,
      totalVentas: round(totalVentas),
      totalCompras: round(totalCompras),
      totalIvaVentas: round(totalIvaVentas),
      totalIvaCompras: round(totalIvaCompras),
      totalRetencionesEmitidas: round(retEmitidas),
      totalRetencionesRecibidas: round(retRecibidas),
      countVentas: sales.length,
      countCompras: purchases.length,
    },
  };
}

/**
 * Generador de archivo plano para planillas IESS (.txt estructurado).
 */
export function buildIESSPlanillaTxt(state: CompanyState, period: string): string {
  const profile = state.profile;
  const payroll = state.payrollRuns.find((r) => r.period === period);
  if (!payroll) return 'NO HAY NÓMINA LIQUIDADA EN ESTE PERÍODO';

  const ruc = (profile?.ruc || '0999999999001').padEnd(13, ' ');
  const lines: string[] = [];

  // Formato estándar IESS para cargue masivo de planillas
  // [Tipo Reg (1)][RUC Empleador (13)][Período (6)][Cédula (10)][Días (2)][Sueldo Imponible (10)][Aporte Personal (8)][Aporte Patronal (8)]
  for (const line of payroll.lines) {
    const emp = state.employees.find((e) => e.employeeCode === line.employeeCode);
    const cedula = (emp?.identification || '0999999999').padStart(10, '0').slice(0, 10);
    const dias = String(line.days || 30).padStart(2, '0');
    const sueldo = line.income.toFixed(2).padStart(10, '0');
    const personal = line.personalIESS.toFixed(2).padStart(8, '0');
    const patronal = line.employerIESS.toFixed(2).padStart(8, '0');

    lines.push(`1${ruc}${period.replace('-', '')}${cedula}${dias}${sueldo}${personal}${patronal}06NOR`);
  }

  return lines.join('\r\n');
}
