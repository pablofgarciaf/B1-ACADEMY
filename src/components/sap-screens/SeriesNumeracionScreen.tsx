'use client';
import { useEffect, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { Screen, Field, Table, inputClass, buttonClass } from './SAPControls';

/** Tipos de documento que admiten series de numeración en Finix ERP. */
const TIPOS_DOC = [
  { code: 'facturas',    label: 'Facturas de clientes' },
  { code: 'pedidos',     label: 'Pedidos de clientes' },
  { code: 'entregas',    label: 'Entregas' },
  { code: 'nc_cliente',  label: 'Notas de crédito (clientes)' },
  { code: 'compras',     label: 'Pedidos de compra' },
  { code: 'grpo',        label: 'Entradas de mercancía' },
  { code: 'factprov',    label: 'Facturas de proveedores' },
  { code: 'nc_prov',     label: 'Notas de crédito (proveedores)' },
  { code: 'asientos',    label: 'Asientos contables' },
  { code: 'activos',     label: 'Activos fijos' },
  { code: 'nc_activos',  label: 'Bajas de activos fijos' },
];

interface Serie {
  id: string;
  docType: string;
  nombre: string;
  prefijo: string;
  inicio: number;
  fin: number;
  actual: number;
  porDefecto: boolean;
  bloqueada: boolean;
  grupo: number; // grupo de autorización
}

function uid() { return Math.random().toString(36).slice(2, 9); }

export default function SeriesNumeracionScreen({ docType: docTypeProp }: { docType?: string }) {
  const c = useCompany();
  const p = c.data.profile;

  // Las series se guardan en profile.docSeries (array)
  const seriesGuardadas: Serie[] = (p as unknown as Record<string, unknown>)?.docSeries as Serie[] ?? [];

  const [tipoSel, setTipoSel] = useState<string>(docTypeProp ?? 'facturas');
  const [series, setSeries] = useState<Serie[]>([]);
  const [editando, setEditando] = useState<Serie | null>(null);
  const [nueva, setNueva] = useState(false);

  useEffect(() => {
    setSeries(seriesGuardadas.filter(s => s.docType === tipoSel));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoSel, seriesGuardadas.length]);

  const empty = (): Serie => ({
    id: uid(), docType: tipoSel, nombre: '', prefijo: '',
    inicio: 1, fin: 999999, actual: 1, porDefecto: false, bloqueada: false, grupo: 1,
  });

  const guardar = async () => {
    if (!editando) return;
    // Merge editando en la lista completa (otras series de otros tipos + las actuales)
    const todasMenos = seriesGuardadas.filter(s => s.id !== editando.id);
    const nuevaLista = [...todasMenos, editando];
    try {
      await c.save({ action: 'docSeriesSave', data: { series: nuevaLista } });
      setEditando(null);
      setNueva(false);
    } catch { /* error visible en barra de estado del contexto */ }
  };

  const eliminar = async (id: string) => {
    const nuevaLista = seriesGuardadas.filter(s => s.id !== id);
    await c.save({ action: 'docSeriesSave', data: { series: nuevaLista } });
  };

  const tipoLabel = TIPOS_DOC.find(t => t.code === tipoSel)?.label ?? tipoSel;

  return (
    <Screen title="Series de numeración de documentos">
      <div className="space-y-3">
        {/* Selector de tipo de documento */}
        <div className="flex flex-wrap items-center gap-2">
          <Field label="Tipo de documento">
            <select className={inputClass} value={tipoSel} onChange={e => { setTipoSel(e.target.value); setEditando(null); setNueva(false); }}>
              {TIPOS_DOC.map(t => <option key={t.code} value={t.code}>{t.label}</option>)}
            </select>
          </Field>
          <div className="pt-5">
            <button type="button" className={buttonClass} onClick={() => { setNueva(true); setEditando(empty()); }}>+ Nueva serie</button>
          </div>
        </div>

        {/* Tabla de series del tipo seleccionado */}
        <Table
          headers={['Nombre', 'Prefijo', 'Inicio', 'Fin', 'Actual', 'Por defecto', 'Grp. auth.', '']}
          rows={series.map(s => [
            <span key="n" className="font-semibold">{s.nombre || '—'}</span>,
            <span key="p" className="font-mono">{s.prefijo || '(sin prefijo)'}</span>,
            <span key="i">{s.inicio}</span>,
            <span key="f">{s.fin}</span>,
            <span key="a" className="text-[#1565C0] font-bold">{s.actual}</span>,
            <span key="d">{s.porDefecto ? '✓' : ''}</span>,
            <span key="g">{s.grupo}</span>,
            <div key="acc" className="flex gap-1">
              <button type="button" className={buttonClass} onClick={() => { setEditando({ ...s }); setNueva(false); }}>Editar</button>
              <button type="button" className={`${buttonClass} text-red-700`} onClick={() => eliminar(s.id)}>✕</button>
            </div>,
          ])}
        />
        {series.length === 0 && !nueva && (
          <p className="text-sm text-gray-500 italic">No hay series definidas para {tipoLabel}.</p>
        )}

        {/* Formulario de edición / nueva serie */}
        {editando && (
          <div className="border border-[#9fb1c7] rounded-sm bg-[#f7f8fa] p-3 space-y-2 max-w-xl">
            <h4 className="font-bold text-[#003366]">{nueva ? 'Nueva serie' : 'Editar serie'} — {tipoLabel}</h4>
            <div className="grid sm:grid-cols-2 gap-2">
              <Field label="Nombre de la serie" required>
                <input required className={inputClass} value={editando.nombre} onChange={e => setEditando(v => v ? { ...v, nombre: e.target.value } : v)} />
              </Field>
              <Field label="Prefijo (opcional)">
                <input maxLength={10} className={inputClass} value={editando.prefijo} onChange={e => setEditando(v => v ? { ...v, prefijo: e.target.value.toUpperCase() } : v)} />
              </Field>
              <Field label="Número inicial">
                <input type="number" min={1} className={inputClass} value={editando.inicio} onChange={e => setEditando(v => v ? { ...v, inicio: Number(e.target.value) } : v)} />
              </Field>
              <Field label="Número final">
                <input type="number" min={1} className={inputClass} value={editando.fin} onChange={e => setEditando(v => v ? { ...v, fin: Number(e.target.value) } : v)} />
              </Field>
              <Field label="Próximo número">
                <input type="number" min={editando.inicio} max={editando.fin} className={inputClass} value={editando.actual} onChange={e => setEditando(v => v ? { ...v, actual: Number(e.target.value) } : v)} />
              </Field>
              <Field label="Grupo de autorización">
                <input type="number" min={1} max={10} className={inputClass} value={editando.grupo} onChange={e => setEditando(v => v ? { ...v, grupo: Number(e.target.value) } : v)} />
              </Field>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input type="checkbox" className="accent-[#f0ab00]" checked={editando.porDefecto} onChange={e => setEditando(v => v ? { ...v, porDefecto: e.target.checked } : v)} />
                Serie por defecto para este tipo
              </label>
              <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input type="checkbox" className="accent-[#c62828]" checked={editando.bloqueada} onChange={e => setEditando(v => v ? { ...v, bloqueada: e.target.checked } : v)} />
                Bloqueada
              </label>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={guardar} disabled={c.saving || !editando.nombre} className={`${buttonClass} font-bold`}>Añadir</button>
              <button type="button" onClick={() => { setEditando(null); setNueva(false); }} className={buttonClass}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </Screen>
  );
}
