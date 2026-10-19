'use client';
import { useEffect, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { Screen, Field, buttonClass } from './FinixControls';

interface Widget { id: string; tipo: string; titulo: string; visible: boolean }
interface PlantillaCockpit { id: string; nombre: string; widgets: Widget[] }

const WIDGETS_DISPONIBLES = [
  { tipo: 'actividades',    titulo: 'Actividades y tareas pendientes' },
  { tipo: 'ventas_mes',     titulo: 'Ventas del mes' },
  { tipo: 'cobros_vencer',  titulo: 'Cobros por vencer' },
  { tipo: 'pagos_vencer',   titulo: 'Pagos por vencer' },
  { tipo: 'stock_critico',  titulo: 'Artículos con stock crítico' },
  { tipo: 'oportunidades',  titulo: 'Embudo de oportunidades' },
  { tipo: 'gastos_cc',      titulo: 'Gastos por centro de coste' },
  { tipo: 'kpis',           titulo: 'KPIs gerenciales' },
  { tipo: 'ultimas_facturas','titulo': 'Últimas facturas emitidas' },
];

function uid() { return 'wgt-' + Math.random().toString(36).slice(2, 7); }

export default function CockpitScreen() {
  const c = useCompany();
  const p = c.data.profile;
  const data = (p as unknown as Record<string, unknown>)?.cockpit as { plantillas: PlantillaCockpit[]; plantillaActiva: string } | undefined;

  const [plantillas, setPlantillas] = useState<PlantillaCockpit[]>([]);
  const [activa, setActiva] = useState<string>('');
  const [plantillaSel, setPlantillaSel] = useState<PlantillaCockpit | null>(null);
  const [nuevaPlantilla, setNuevaPlantilla] = useState({ nombre: '' });
  const [modoNueva, setModoNueva] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPlantillas(data?.plantillas ?? []);
    setActiva(data?.plantillaActiva ?? '');
    if (data?.plantillas?.length) {
      const pl = data.plantillas.find(p => p.id === data.plantillaActiva) ?? data.plantillas[0];
      setPlantillaSel(pl ? { ...pl, widgets: [...pl.widgets] } : null);
    }
  }, [data]);

  const guardar = async (pls: PlantillaCockpit[], act: string) => {
    setError(null);
    try {
      await c.save({ action: 'cockpitSave', data: { plantillas: pls, plantillaActiva: act } });
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudo guardar la plantilla. Intenta nuevamente.');
      return false;
    }
  };

  const crearPlantilla = async () => {
    if (!nuevaPlantilla.nombre.trim() || c.saving) return;
    if (plantillas.some(p => p.nombre.trim().toLocaleLowerCase() === nuevaPlantilla.nombre.trim().toLocaleLowerCase())) { setError('Ya existe una plantilla con ese nombre. Selecciónala para editarla.'); return; }
    const pl: PlantillaCockpit = { id: uid(), nombre: nuevaPlantilla.nombre.trim(), widgets: [] };
    const pls = [...plantillas, pl];
    if (!await guardar(pls, activa)) return;
    setPlantillas(pls);
    setPlantillaSel(pl);
    setModoNueva(false);
    setNuevaPlantilla({ nombre: '' });
  };

  const toggleWidget = (tipo: string) => {
    if (!plantillaSel) return;
    const existe = plantillaSel.widgets.find(w => w.tipo === tipo);
    let widgets: Widget[];
    if (existe) {
      widgets = plantillaSel.widgets.filter(w => w.tipo !== tipo);
    } else {
      const info = WIDGETS_DISPONIBLES.find(w => w.tipo === tipo)!;
      widgets = [...plantillaSel.widgets, { id: uid(), tipo, titulo: info.titulo, visible: true }];
    }
    setPlantillaSel(v => v ? { ...v, widgets } : v);
  };

  const asignarYGuardar = async () => {
    if (!plantillaSel) return;
    const pls = plantillas.map(p => p.id === plantillaSel.id ? plantillaSel : p);
    if (!await guardar(pls, plantillaSel.id)) return;
    setActiva(plantillaSel.id);
    setPlantillas(pls);
  };

  return (
    <Screen title="Cockpit — Plantillas y widgets">
      <div className="space-y-3">
        <div className="rounded border border-[#9fb1c7] bg-white p-3 text-sm text-[#003366]">
          <strong>Personaliza tu espacio de trabajo</strong>
          <p className="mt-1">1. Crea una plantilla. 2. Elige los widgets. 3. Asígnala y guarda para dejarla como predeterminada.</p>
        </div>
        {error && <p role="alert" className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-800">{error}</p>}
        {/* Selector de plantillas */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-semibold text-[#003366]">Plantillas:</span>
          {plantillas.map(pl => (
            <button key={pl.id} type="button"
              onClick={() => setPlantillaSel({ ...pl, widgets: [...pl.widgets] })}
              className={`px-3 py-1 text-sm border rounded-sm ${plantillaSel?.id === pl.id ? 'bg-[#003366] text-white border-[#003366]' : 'bg-white border-[#9fb1c7] hover:bg-[#e8f1fb]'} ${activa === pl.id ? 'ring-2 ring-[#f0ab00]' : ''}`}>
              {pl.nombre} {activa === pl.id ? '★' : ''}
            </button>
          ))}
          <button type="button" className={buttonClass} onClick={() => setModoNueva(true)}>+ Nueva plantilla</button>
        </div>

        {modoNueva && (
          <div className="flex gap-2 items-end max-w-sm">
            <Field label="Nombre de la plantilla">
              <input className="h-6 w-full px-1.5 bg-white border border-[#a9b7c8] rounded-[2px] text-xs focus:outline-none focus:border-[#f0ab00]"
                value={nuevaPlantilla.nombre} onChange={e => setNuevaPlantilla({ nombre: e.target.value })} placeholder="Mi plantilla" />
            </Field>
            <div className="pb-0.5 flex gap-1">
              <button type="button" onClick={crearPlantilla} disabled={!nuevaPlantilla.nombre.trim() || c.saving} className={`${buttonClass} font-bold`}>Crear</button>
              <button type="button" onClick={() => setModoNueva(false)} className={buttonClass}>✕</button>
            </div>
          </div>
        )}

        {plantillaSel && (
          <div className="space-y-2">
            <h3 className="font-bold text-[#003366]">Plantilla: {plantillaSel.nombre}</h3>
            <p className="text-xs text-gray-500">Selecciona los widgets que aparecerán en el cockpit de esta plantilla:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {WIDGETS_DISPONIBLES.map(w => {
                const activo = !!plantillaSel.widgets.find(x => x.tipo === w.tipo);
                return (
                  <label key={w.tipo}
                    className={`flex items-start gap-2 p-2 border rounded-sm cursor-pointer transition-colors ${activo ? 'bg-[#e8f4ea] border-[#4caf50]' : 'bg-white border-[#cdd6e1] hover:bg-[#e8f1fb]'}`}>
                    <input type="checkbox" className="mt-0.5 accent-[#f0ab00]" checked={activo} onChange={() => toggleWidget(w.tipo)} />
                    <div>
                      <p className="text-sm font-semibold text-[#1d2d3e]">{w.titulo}</p>
                      <p className="text-xs text-gray-500">{w.tipo}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="pt-1 flex gap-2">
              <button type="button" onClick={asignarYGuardar} disabled={c.saving} className={`${buttonClass} font-bold`}>
                Asignar plantilla y guardar
              </button>
            </div>

            {plantillaSel.widgets.length > 0 && (
              <div className="mt-2 border border-[#cdd6e1] rounded-sm bg-white p-2">
                <p className="text-xs font-semibold text-[#003366] mb-1">Vista previa de la distribución:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {plantillaSel.widgets.map(w => (
                    <div key={w.id} className="border border-[#cdd6e1] rounded-sm p-2 bg-[#f4f6f9] text-center">
                      <p className="text-xs font-semibold text-[#003366]">{w.titulo}</p>
                      <p className="text-[10px] text-gray-400 mt-1">Widget seleccionado; esta vista muestra su ubicación.</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {plantillas.length === 0 && !modoNueva && (
          <p className="text-sm text-gray-500 italic">No hay plantillas de cockpit. Crea una con el botón &quot;+ Nueva plantilla&quot;.</p>
        )}
      </div>
    </Screen>
  );
}
