'use client';
import { useEffect, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { Screen, Field, Table, inputClass, buttonClass } from './SAPControls';

interface Moneda { codigo: string; nombre: string; simbolo: string; tasaCambio: number; activa: boolean }
interface TasaCambio { fecha: string; moneda: string; tasa: number }

const MONEDAS_BASE: Moneda[] = [
  { codigo: 'USD', nombre: 'Dólar estadounidense', simbolo: '$', tasaCambio: 1, activa: true },
  { codigo: 'EUR', nombre: 'Euro', simbolo: '€', tasaCambio: 0.92, activa: false },
  { codigo: 'COP', nombre: 'Peso colombiano', simbolo: '$', tasaCambio: 4200, activa: false },
  { codigo: 'PEN', nombre: 'Sol peruano', simbolo: 'S/', tasaCambio: 3.78, activa: false },
];

export default function MonedasScreen() {
  const c = useCompany();
  const p = c.data.profile;
  const config = (p as unknown as Record<string, unknown>)?.currencies as { monedaLocal: string; monedaSistema: string; monedas: Moneda[]; tasas: TasaCambio[] } | undefined;

  const [monedaLocal, setMonedaLocal] = useState('USD');
  const [monedaSistema, setMonedaSistema] = useState('USD');
  const [monedas, setMonedas] = useState<Moneda[]>(MONEDAS_BASE);
  const [nuevaTasa, setNuevaTasa] = useState({ fecha: new Date().toISOString().slice(0, 10), moneda: 'EUR', tasa: 0.92 });

  useEffect(() => {
    if (config) {
      setMonedaLocal(config.monedaLocal ?? 'USD');
      setMonedaSistema(config.monedaSistema ?? 'USD');
      setMonedas(config.monedas ?? MONEDAS_BASE);
    }
  }, [config]);

  const guardar = async () => {
    await c.save({ action: 'currenciesSave', data: { monedaLocal, monedaSistema, monedas, tasas: config?.tasas ?? [] } });
  };

  const activarMoneda = (codigo: string, activa: boolean) => {
    setMonedas(ms => ms.map(m => m.codigo === codigo ? { ...m, activa } : m));
  };

  const agregarTasa = async () => {
    const tasas = [...(config?.tasas ?? []), nuevaTasa];
    await c.save({ action: 'currenciesSave', data: { monedaLocal, monedaSistema, monedas, tasas } });
  };

  const monedasActivas = monedas.filter(m => m.activa || m.codigo === 'USD');

  return (
    <Screen title="Monedas y tipos de cambio">
      <div className="space-y-4">
        {/* Moneda local y de sistema */}
        <div className="grid sm:grid-cols-2 gap-3 max-w-lg">
          <Field label="Moneda local">
            <select className={inputClass} value={monedaLocal} onChange={e => setMonedaLocal(e.target.value)}>
              {monedas.map(m => <option key={m.codigo} value={m.codigo}>{m.codigo} — {m.nombre}</option>)}
            </select>
          </Field>
          <Field label="Moneda del sistema">
            <select className={inputClass} value={monedaSistema} onChange={e => setMonedaSistema(e.target.value)}>
              {monedas.map(m => <option key={m.codigo} value={m.codigo}>{m.codigo} — {m.nombre}</option>)}
            </select>
          </Field>
        </div>
        <p className="text-xs text-gray-500 -mt-1">En Ecuador la moneda local y del sistema son ambas USD. Si opera con otras monedas, active las divisas en la tabla inferior.</p>

        {/* Tabla de monedas disponibles */}
        <h3 className="font-bold text-[#003366]">Divisas activas</h3>
        <Table
          headers={['Código', 'Nombre', 'Símbolo', 'Tasa de cambio (vs USD)', 'Activa']}
          rows={monedas.map(m => [
            <span key="c" className="font-mono font-bold">{m.codigo}</span>,
            <span key="n">{m.nombre}</span>,
            <span key="s">{m.simbolo}</span>,
            <input key="t" type="number" step="0.0001" min={0.0001} className={`${inputClass} w-24`} value={m.tasaCambio}
              onChange={e => setMonedas(ms => ms.map(x => x.codigo === m.codigo ? { ...x, tasaCambio: Number(e.target.value) } : x))}
              disabled={m.codigo === 'USD'} />,
            <input key="a" type="checkbox" className="accent-[#f0ab00] w-4 h-4" checked={m.activa || m.codigo === 'USD'}
              disabled={m.codigo === 'USD'} onChange={e => activarMoneda(m.codigo, e.target.checked)} />,
          ])}
        />

        {/* Diferencia de tipo de cambio */}
        {monedasActivas.length > 1 && (
          <div className="border-t pt-3">
            <h3 className="font-bold text-[#003366] mb-2">Registrar tasa de cambio del día</h3>
            <div className="flex flex-wrap gap-2 items-end">
              <Field label="Fecha"><input type="date" className={inputClass} value={nuevaTasa.fecha} onChange={e => setNuevaTasa(v => ({ ...v, fecha: e.target.value }))} /></Field>
              <Field label="Moneda">
                <select className={inputClass} value={nuevaTasa.moneda} onChange={e => setNuevaTasa(v => ({ ...v, moneda: e.target.value }))}>
                  {monedas.filter(m => m.codigo !== 'USD').map(m => <option key={m.codigo} value={m.codigo}>{m.codigo}</option>)}
                </select>
              </Field>
              <Field label="Tasa (vs USD)"><input type="number" step="0.0001" min={0.0001} className={`${inputClass} w-24`} value={nuevaTasa.tasa} onChange={e => setNuevaTasa(v => ({ ...v, tasa: Number(e.target.value) }))} /></Field>
              <div className="pb-0.5"><button type="button" className={buttonClass} onClick={agregarTasa}>Registrar tasa</button></div>
            </div>
          </div>
        )}

        <div className="pt-1">
          <button type="button" onClick={guardar} disabled={c.saving} className={`${buttonClass} font-bold`}>Guardar configuración de monedas</button>
        </div>
      </div>
    </Screen>
  );
}
