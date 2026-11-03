'use client';
/**
 * /simulador/sap  — Simulador SAP multi-sistema con capturas reales de la KB
 *
 * Cada sistema tiene su propia visualización única:
 *   b1        → ventana SAP Business One (azul corporativo, módulos laterales)
 *   s4-sapgui → SAP GUI clásico (barra de menú, código de transacción)
 *   fiori     → SAP Fiori Launchpad (tiles, shell UI5)
 */
import { useEffect, useState, useCallback } from 'react';
import type { KBCard } from '@/types/kb-simulator';
import { PROCESO_NOMBRES, SISTEMA_NOMBRES, SISTEMA_CONFIG } from '@/types/kb-simulator';
import B1SimulatorView       from '@/components/simulador-sap/B1SimulatorView';
import FioriSimulatorView    from '@/components/simulador-sap/FioriSimulatorView';
import SapGuiSimulatorView   from '@/components/simulador-sap/SapGuiSimulatorView';

type Sistema = 'b1' | 's4-sapgui' | 'fiori';

interface KBApiResponse {
  total: number;
  page:  number;
  limit: number;
  cards: KBCard[];
}

// ──────────────────────────────────────────────────────────────────────────────
// Selector inicial (sistema + proceso)
// ──────────────────────────────────────────────────────────────────────────────
function SistemaSelector({
  sistemas,
  onSelect,
}: {
  sistemas: Record<string, string[]>;
  onSelect: (s: Sistema, p: string) => void;
}) {
  const [sel, setSel] = useState<Sistema>('b1');
  const procesos = sistemas[sel] ?? [];

  const cfg = SISTEMA_CONFIG[sel];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-white/70 text-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            KB con {Object.values(sistemas).flat().length} procesos · capturas reales 2024+
          </div>
          <h1 className="text-3xl font-bold text-white">Simulador SAP</h1>
          <p className="text-slate-400">Elige el sistema y el proceso que deseas practicar</p>
        </div>

        {/* Selector de sistema */}
        <div className="grid grid-cols-3 gap-3">
          {(['b1', 's4-sapgui', 'fiori'] as Sistema[]).map(s => {
            const c = SISTEMA_CONFIG[s];
            const active = sel === s;
            return (
              <button
                key={s}
                onClick={() => setSel(s)}
                className={`p-4 rounded-xl border-2 transition-all text-left space-y-1 ${
                  active
                    ? 'border-white bg-white/10 shadow-lg'
                    : 'border-white/10 bg-white/5 hover:border-white/30'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: c.color }}
                >
                  {s === 'b1' ? 'B1' : s === 'fiori' ? 'Fi' : 'S4'}
                </div>
                <div className="text-white font-medium text-sm">{c.label}</div>
                <div className="text-slate-400 text-xs">{(sistemas[s] ?? []).length} procesos</div>
              </button>
            );
          })}
        </div>

        {/* Selector de proceso */}
        <div className="space-y-3">
          <p className="text-slate-300 text-sm font-medium">
            Procesos disponibles en <span style={{ color: cfg.accent }}>{cfg.label}</span>:
          </p>
          <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
            {procesos.sort().map(p => (
              <button
                key={p}
                onClick={() => onSelect(sel, p)}
                className="flex items-center justify-between p-3.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all text-left group"
              >
                <span className="text-white font-medium text-sm">
                  {PROCESO_NOMBRES[p] ?? p}
                </span>
                <span className="text-slate-500 group-hover:text-white transition-colors">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Página principal
// ──────────────────────────────────────────────────────────────────────────────
export default function SimuladorSapPage() {
  const [sistemas, setSistemas]     = useState<Record<string, string[]> | null>(null);
  const [selected, setSelected]     = useState<{ sistema: Sistema; proceso: string } | null>(null);
  const [cards, setCards]           = useState<KBCard[]>([]);
  const [step, setStep]             = useState(0);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  // Cargar lista de sistemas/procesos al montar
  useEffect(() => {
    fetch('/api/kb?list=1')
      .then(r => r.json())
      .then((d: Record<string, string[]>) => setSistemas(d))
      .catch(() => setError('No se pudo cargar la KB'));
  }, []);

  // Cargar cards cuando se elige sistema+proceso (carga todas las páginas)
  const loadCards = useCallback(async (sistema: Sistema, proceso: string) => {
    setLoading(true);
    setError(null);
    setStep(0);
    try {
      // Primera página para saber el total
      const r0: KBApiResponse = await fetch(`/api/kb?sistema=${sistema}&proceso=${proceso}&page=0&limit=60`).then(r => r.json());
      let all: KBCard[] = r0.cards;
      const pages = Math.ceil(r0.total / 60);
      for (let p = 1; p < Math.min(pages, 5); p++) {
        const rp: KBApiResponse = await fetch(`/api/kb?sistema=${sistema}&proceso=${proceso}&page=${p}&limit=60`).then(r => r.json());
        all = all.concat(rp.cards);
      }
      setCards(all);
    } catch {
      setError('Error cargando pantallas del proceso');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelect = (sistema: Sistema, proceso: string) => {
    setSelected({ sistema, proceso });
    void loadCards(sistema, proceso);
  };

  const handleBack = () => {
    setSelected(null);
    setCards([]);
    setStep(0);
  };

  // ── pantalla de carga de lista
  if (!sistemas && !error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400">Cargando base de conocimiento…</p>
        </div>
      </div>
    );
  }

  if (error && !sistemas) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  // ── selector inicial
  if (!selected) {
    return <SistemaSelector sistemas={sistemas ?? {}} onSelect={handleSelect} />;
  }

  // ── cargando cards
  if (loading) {
    const cfg = SISTEMA_CONFIG[selected.sistema];
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: cfg.color }}>
        <div className="text-center text-white space-y-4">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Cargando pantallas de {PROCESO_NOMBRES[selected.proceso] ?? selected.proceso}…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error}</p>
        <button onClick={handleBack} className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20">
          ← Volver
        </button>
      </div>
    );
  }

  // ── vistas únicas por sistema
  const commonProps = {
    cards,
    proceso:      selected.proceso,
    procesoNombre: PROCESO_NOMBRES[selected.proceso] ?? selected.proceso,
    sistema:      selected.sistema,
    step,
    onStep:       setStep,
    onComplete:   handleBack,
  };

  return (
    <div className="relative">
      {/* Botón volver flotante */}
      <button
        onClick={handleBack}
        className="fixed top-4 left-4 z-50 px-3 py-1.5 bg-black/40 hover:bg-black/60 text-white text-xs rounded-full backdrop-blur border border-white/20 transition-all"
      >
        ← Salir
      </button>

      {selected.sistema === 'b1'        && <B1SimulatorView     {...commonProps} />}
      {selected.sistema === 's4-sapgui' && <SapGuiSimulatorView {...commonProps} />}
      {selected.sistema === 'fiori'     && <FioriSimulatorView  {...commonProps} />}
    </div>
  );
}
