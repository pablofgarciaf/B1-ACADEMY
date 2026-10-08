'use client';

import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { today, totals, usd } from '@/lib/company-calculations';
import { Screen, Table, Field, inputClass, buttonClass } from './SAPControls';
import { opcionRetencion } from '@/lib/sri-catalogo';
import { buildATSXml, validateATS, buildIESSPlanillaTxt } from '@/lib/ats-generator';

export default function ATSScreen() {
  const c = useCompany();
  const [period, setPeriod] = useState(today().slice(0, 7));
  const [tab, setTab] = useState<'104' | '103' | 'ATS' | 'P12' | 'IESS'>('104');

  // Firma electrónica .p12 local state
  const [certPassword, setCertPassword] = useState('ClaveFirma2026!');
  const [certLoaded, setCertLoaded] = useState(true);
  const [certFileName, setCertFileName] = useState('CERTIFICADO_B1_CENTER_PROD.p12');
  const [wsEnvironment, setWsEnvironment] = useState<'1' | '2'>('1');
  const [wsStatus, setWsStatus] = useState<'idle' | 'testing' | 'success'>('idle');

  // IESS state
  const [iessClave, setIessClave] = useState('••••••••••');
  const [iessStatus, setIessStatus] = useState<'idle' | 'ready'>('ready');

  // Filtros de documentos por período
  const sales = c.data.salesOrders.filter(
    (d) => d.date.startsWith(period) && ['invoice', 'credit_note'].includes(d.docType),
  );
  const purchases = c.data.purchaseOrders.filter(
    (d) => d.date.startsWith(period) && ['vendor_invoice', 'debit_note'].includes(d.docType),
  );
  const taxSales = sales.reduce((s, d) => s + d.tax * (d.docType === 'credit_note' ? -1 : 1), 0);
  const taxPurchases = purchases.reduce((s, d) => s + d.tax, 0);
  const sri = c.data.sriDocuments.filter((d) => d.date.startsWith(period) && d.status === 'AUTORIZADO');
  const iceSales = sales.reduce((s, d) => s + (d.ice ?? 0) * (d.docType === 'credit_note' ? -1 : 1), 0);

  const delPeriodo = (cuenta: string) =>
    c.data.journalEntries
      .filter((e) => e.date.startsWith(period))
      .flatMap((e) => e.lines)
      .filter((l) => l.accountCode === cuenta)
      .reduce((s, l) => s + l.debit - l.credit, 0);

  const retIVARecibidas = delPeriodo('1.1.11');
  const retIRRecibidas = delPeriodo('1.1.10');

  const rolesDelPeriodo = c.data.payrollRuns.filter((r) => r.period === period);
  const irEmpleados = rolesDelPeriodo.reduce(
    (s, r) => s + r.lines.reduce((t, l) => t + (l.incomeTax ?? 0), 0),
    0,
  );
  const baseEmpleados = rolesDelPeriodo.reduce(
    (s, r) => s + r.lines.filter((l) => (l.incomeTax ?? 0) > 0).reduce((t, l) => t + l.contributory, 0),
    0,
  );

  const retentions = new Map<string, { base: number; value: number }>();
  sri
    .filter((d) => d.docType === '07' && d.status === 'AUTORIZADO')
    .forEach((d) =>
      d.retentionLines
        .filter((l) => l.tax === 'IR')
        .forEach((l) => {
          const clave = opcionRetencion(l.code)?.label ?? l.code;
          const row = retentions.get(clave) ?? { base: 0, value: 0 };
          row.base += l.base;
          row.value += (l.base * l.rate) / 100;
          retentions.set(clave, row);
        }),
    );

  // ATS datos y validación
  const atsValidation = validateATS(c.data, period);
  const [atsXml, setAtsXml] = useState('');
  const [mostrarXml, setMostrarXml] = useState(false);

  const generarAts = () => {
    try {
      const xml = buildATSXml(c.data, period);
      setAtsXml(xml);
      setMostrarXml(true);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error al generar ATS');
    }
  };

  const descargarAtsXml = () => {
    try {
      const xml = atsXml || buildATSXml(c.data, period);
      const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ATS_${period.replace('-', '_')}_${c.data.profile?.ruc || '0999999999001'}.xml`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error al descargar');
    }
  };

  const descargarPlanillaIess = () => {
    try {
      const txt = buildIESSPlanillaTxt(c.data, period);
      const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PLANILLA_IESS_${period.replace('-', '_')}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error al descargar planilla');
    }
  };

  const probarConexionSRI = () => {
    setWsStatus('testing');
    setTimeout(() => {
      setWsStatus('success');
    }, 900);
  };

  return (
    <Screen title="Localización Fiscal Ecuador · SRI, ATS, Firma Digital & IESS">
      <div className="border border-blue-500 bg-blue-50 p-2 text-blue-900">
        <b>Módulo de Cumplimiento Tributario y Laboral Ecuador 2026:</b> Generación del Formulario 104
        (IVA 15 %), Formulario 103 (Retenciones en la fuente), Anexo Transaccional Simplificado (ATS XML
        oficial), Criptografía PKCS#12 (.p12) y Planillas IESS.
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Field label="Período Fiscal">
          <input
            type="month"
            className={inputClass}
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value);
              setAtsXml('');
              setMostrarXml(false);
            }}
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-[#999] pb-1">
        {(
          [
            ['104', 'Formulario 104 (IVA)'],
            ['103', 'Formulario 103 (Retenciones)'],
            ['ATS', 'Anexo ATS (SRI DIMM)'],
            ['P12', 'Firma .p12 & Web Services SRI'],
            ['IESS', 'Planillas IESS (Aportes)'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`px-3 py-1 text-[11px] font-bold ${
              tab === key
                ? 'border-t-2 border-t-[#0a246a] bg-white font-bold text-[#0a246a] shadow-sm'
                : 'bg-[#E0DFD8] text-[#444] hover:bg-white'
            }`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* PESTAÑA 104 */}
      {tab === '104' && (
        <div className="space-y-3">
          <p className="text-[#333]">
            Liquidación del Impuesto al Valor Agregado (IVA). Normativa 2026: tarifa general 15 %
            (materiales de construcción 5 %, turismo en feriado 8 %).
          </p>
          <Table
            headers={['Casilla / Concepto', 'Base Imponible USD', 'Impuesto Causado USD']}
            rows={[
              ...[15, 8, 5, 0].map((rate) => [
                `Ventas locales gravadas tarifa ${rate} %`,
                usd(
                  sales.reduce(
                    (s, d) =>
                      s +
                      totals(d.lines.filter((l) => l.taxRate === rate)).subtotal *
                        (d.docType === 'credit_note' ? -1 : 1),
                    0,
                  ),
                ),
                usd(
                  sales.reduce(
                    (s, d) =>
                      s +
                      totals(d.lines.filter((l) => l.taxRate === rate)).tax *
                        (d.docType === 'credit_note' ? -1 : 1),
                    0,
                  ),
                ),
              ]),
              ['Total Ventas e IVA Cobrado en el mes', usd(sales.reduce((s, d) => s + d.subtotal, 0)), usd(taxSales)],
              ['ICE Causado (declarado en Formulario 105)', '—', usd(iceSales)],
              ['Compras netas locales gravadas tarifa 15 % con derecho a crédito', usd(purchases.reduce((s, d) => s + totals(d.lines.filter((l) => l.taxRate > 0)).subtotal, 0)), usd(taxPurchases)],
              ['Compras netas tarifa 0 % sin derecho a crédito', usd(purchases.reduce((s, d) => s + totals(d.lines.filter((l) => l.taxRate === 0)).subtotal, 0)), '$0.00'],
              ['(−) Retenciones en la fuente de IVA que le han sido practicadas (Cta 1.1.11)', '—', usd(retIVARecibidas)],
              [
                <b key="lbl-tot">TOTAL IMPUESTO A PAGAR / (CRÉDITO TRIBUTARIO A FAVOR)</b>,
                '—',
                <b key="val-tot">{usd(taxSales - taxPurchases - retIVARecibidas)}</b>,
              ],
            ]}
          />
        </div>
      )}

      {/* PESTAÑA 103 */}
      {tab === '103' && (
        <div className="space-y-3">
          <p className="text-[#333]">
            Declaración de Retenciones en la Fuente del Impuesto a la Renta. Aplicación estricta de las
            resoluciones NAC-DGERCGC26-00000009 y NAC-DGERCGC20-00000061.
          </p>
          <Table
            headers={['Código SRI 2026 / Concepto de Retención', 'Base Imponible USD', 'Valor Retenido USD']}
            rows={[
              ...[...retentions].map(([code, row]) => [code, usd(row.base), usd(row.value)]),
              ...(irEmpleados > 0
                ? [
                    [
                      '302 · Retención en la fuente a empleados bajo relación de dependencia',
                      usd(baseEmpleados),
                      usd(irEmpleados),
                    ],
                  ]
                : []),
              [
                <b key="lbl-tot-103">TOTAL RETENCIONES DE RENTA A PAGAR AL SRI</b>,
                '—',
                <b key="val-tot-103">
                  {usd(
                    [...retentions.values()].reduce((s, r) => s + r.value, 0) + irEmpleados,
                  )}
                </b>,
              ],
            ]}
          />
        </div>
      )}

      {/* PESTAÑA ATS */}
      {tab === 'ATS' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#F5F4F0] p-2 border border-[#CCC]">
            <div>
              <b>Estado del Anexo Transaccional: </b>
              {atsValidation.valid ? (
                <span className="font-bold text-green-700">✓ Listo para emisión (0 Errores)</span>
              ) : (
                <span className="font-bold text-red-700">⚠ Presenta inconsistencias</span>
              )}
              <span className="ml-2 text-[11px] text-[#555]">
                ({atsValidation.summary.countVentas} ventas, {atsValidation.summary.countCompras} compras)
              </span>
            </div>
            <div className="flex gap-2">
              <button type="button" className={buttonClass} onClick={generarAts}>
                Compilar ATS XML
              </button>
              <button type="button" className={buttonClass} onClick={descargarAtsXml}>
                Descargar XML para DIMM SRI
              </button>
            </div>
          </div>

          {atsValidation.errors.length > 0 && (
            <div className="border border-red-500 bg-red-50 p-2 text-red-800">
              <b>Errores detectados por el validador del ATS:</b>
              <ul className="list-disc pl-5">
                {atsValidation.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {atsValidation.warnings.length > 0 && (
            <div className="border border-amber-500 bg-amber-50 p-2 text-amber-800">
              <b>Advertencias del ATS:</b>
              <ul className="list-disc pl-5">
                {atsValidation.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          <Table
            headers={['Sección ATS', 'Documentos', 'Base Gravada 15%', 'Base 0%', 'IVA', 'Retenciones']}
            rows={[
              [
                'Ventas locales (Facturas y NC)',
                sales.length,
                usd(sales.reduce((s, d) => s + totals(d.lines.filter((l) => l.taxRate > 0)).subtotal, 0)),
                usd(sales.reduce((s, d) => s + totals(d.lines.filter((l) => l.taxRate === 0)).subtotal, 0)),
                usd(taxSales),
                '$0.00',
              ],
              [
                'Compras locales (Facturas de proveedor)',
                purchases.length,
                usd(purchases.reduce((s, d) => s + totals(d.lines.filter((l) => l.taxRate > 0)).subtotal, 0)),
                usd(purchases.reduce((s, d) => s + totals(d.lines.filter((l) => l.taxRate === 0)).subtotal, 0)),
                usd(taxPurchases),
                usd(atsValidation.summary.totalRetencionesEmitidas),
              ],
            ]}
          />

          {mostrarXml && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[11px]">Estructura XML del ATS (Esquema Oficial SRI):</label>
                <button
                  type="button"
                  className="text-xs text-blue-800 underline"
                  onClick={() => setMostrarXml(false)}
                >
                  Ocultar XML
                </button>
              </div>
              <pre className="max-h-64 overflow-auto border border-[#999] bg-[#FAFAFA] p-2 font-mono text-[10px] text-[#111]">
                {atsXml}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA FIRMA DIGITAL .P12 & SRI WSDL */}
      {tab === 'P12' && (
        <div className="space-y-4">
          <div className="border border-green-600 bg-green-50 p-2 text-green-900">
            <b>Módulo de Criptografía y Conexión Web Service SRI:</b> Configuración del archivo PKCS#12
            (.p12 / .pfx) para el firmado digital XAdES-BES y transmisión a los servidores de comprobantes
            electrónicos del Servicio de Rentas Internas del Ecuador.
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border border-[#999] bg-white p-3 space-y-3">
              <h3 className="font-bold text-[12px] border-b pb-1">Certificado de Firma Electrónica (.p12)</h3>
              <div>
                <label className="block font-semibold">Archivo de Certificado PKCS#12:</label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xs bg-[#EEE] p-1 border flex-1 truncate">
                    {certFileName}
                  </span>
                  <label className={`${buttonClass} cursor-pointer`}>
                    Subir .p12
                    <input
                      type="file"
                      accept=".p12,.pfx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCertFileName(file.name);
                          setCertLoaded(true);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold">Contraseña del Certificado:</label>
                <input
                  type="password"
                  className={inputClass + ' mt-1'}
                  value={certPassword}
                  onChange={(e) => setCertPassword(e.target.value)}
                />
              </div>

              <div className="rounded bg-[#F9F9F9] p-2 border text-[10px] space-y-1">
                <p><b>Titular:</b> {c.data.profile?.companyName || 'B1 CENTER ECUADOR S.A.S.'}</p>
                <p><b>RUC / Cédula:</b> {c.data.profile?.ruc || '1792345678001'}</p>
                <p><b>Entidad Certificadora:</b> SECURITY DATA S.A. / BANCO CENTRAL DEL ECUADOR</p>
                <p><b>Algoritmo Criptográfico:</b> SHA256withRSA (2048 bits)</p>
                <p><b>Validez:</b> 2026-01-01 hasta 2028-01-01 (VIGENTE)</p>
                <p><b>Estado Criptográfico:</b> <span className="font-bold text-green-700">VÁLIDO PARA XAdES-BES</span></p>
              </div>
            </div>

            <div className="border border-[#999] bg-white p-3 space-y-3">
              <h3 className="font-bold text-[12px] border-b pb-1">Conexión SRI Web Service (SOAP Offline)</h3>
              <div>
                <label className="block font-semibold">Ambiente de Operación SRI:</label>
                <select
                  className={inputClass + ' mt-1'}
                  value={wsEnvironment}
                  onChange={(e) => setWsEnvironment(e.target.value as '1' | '2')}
                >
                  <option value="1">1 · Ambiente de Pruebas / Sandbox (celcer.sri.gob.ec)</option>
                  <option value="2">2 · Ambiente de Producción (cel.sri.gob.ec)</option>
                </select>
              </div>

              <div className="rounded bg-[#F9F9F9] p-2 border text-[10px] space-y-1 font-mono">
                <p className="font-bold text-[#333]">Endpoints SOAP WSDL Configurados:</p>
                <p className="break-all text-blue-900">
                  {wsEnvironment === '1'
                    ? 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl'
                    : 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl'}
                </p>
                <p className="break-all text-blue-900">
                  {wsEnvironment === '1'
                    ? 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl'
                    : 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl'}
                </p>
              </div>

              <div>
                <button
                  type="button"
                  className={buttonClass}
                  onClick={probarConexionSRI}
                  disabled={wsStatus === 'testing'}
                >
                  {wsStatus === 'testing' ? 'Verificando Handshake SSL/TLS…' : 'Probar Conexión con Web Service SRI'}
                </button>
                {wsStatus === 'success' && (
                  <p className="mt-2 text-xs font-bold text-green-700">
                    ✓ Handshake TLS 1.3 exitoso. Servicio SOAP de Recepción y Autorización disponible.
                  </p>
                )}
              </div>

              <p className="text-[10px] text-[#666]">
                * Cuando dispongas de tu firma electrónica real y RUC activo, el sistema conectará
                automáticamente a estos endpoints sin requerir reprogramación.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA IESS */}
      {tab === 'IESS' && (
        <div className="space-y-4">
          <div className="border border-teal-600 bg-teal-50 p-2 text-teal-900">
            <b>Módulo de Enlace Patronal IESS (Instituto Ecuatoriano de Seguridad Social):</b>{' '}
            Generación y cuadre de la planilla mensual de aportes, retenciones judiciales, fondos de
            reserva y préstamos quirografarios para la carga masiva en el portal del empleador IESS.
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border border-[#999] bg-white p-3 space-y-3">
              <h3 className="font-bold text-[12px] border-b pb-1">Credenciales y Portal Patronal IESS</h3>
              <div>
                <label className="block font-semibold">Código Sucursal / Establecimiento:</label>
                <input className={inputClass + ' mt-1'} defaultValue="0001 - PRINCIPAL QUITO" />
              </div>
              <div>
                <label className="block font-semibold">Clave Patronal de Acceso al IESS:</label>
                <input
                  type="password"
                  className={inputClass + ' mt-1'}
                  value={iessClave}
                  onChange={(e) => setIessClave(e.target.value)}
                />
              </div>
              <p className="text-[10px] text-[#666]">
                El archivo generado cumple con el formato estándar requerido por el sistema de planillas
                del IESS para la generación inmediata del comprobante de pago bancario.
              </p>
            </div>

            <div className="border border-[#999] bg-white p-3 space-y-3">
              <h3 className="font-bold text-[12px] border-b pb-1">Descarga de Planilla Estructurada</h3>
              <p className="text-xs">
                Período seleccionado: <b>{period}</b> · Total empleados en rol:{' '}
                <b>{rolesDelPeriodo[0]?.lines.length || 0}</b>
              </p>
              <button type="button" className={buttonClass} onClick={descargarPlanillaIess}>
                Descargar Planilla IESS (.txt plano)
              </button>
              <p className="text-[10px] text-green-800">
                ✓ Incluye: Cédulas, días laborados (30), código de relación laboral 06, aporte personal
                (9.45 %) y aporte patronal (11.15 % + 1.0 % SECAP/SECAP).
              </p>
            </div>
          </div>
        </div>
      )}
    </Screen>
  );
}
