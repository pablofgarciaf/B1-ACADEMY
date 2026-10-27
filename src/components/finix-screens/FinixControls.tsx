'use client';

import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useCompany } from '@/hooks/useCompany';

export type FinixUITheme = 'classic' | 'fiori';
export const FinixUIThemeContext = createContext<FinixUITheme>('classic');
export const useFinixUITheme = () => useContext(FinixUIThemeContext);

export const inputClass = 'w-full min-w-16 border border-[#999] bg-white px-2 py-1 text-[11px] text-[#222] focus:bg-[#FFFDE7] focus:outline-2 focus:outline-[#0055A5] disabled:bg-[#ECE9D8]';
export const buttonClass = 'border border-[#999] bg-[#F5F4EE] px-3 py-1 text-[#222] hover:bg-[#FFFDE7] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transform-none cursor-pointer';

export function NumberInput({
  value,
  onChange,
  className = inputClass,
  placeholder = '0.00',
  min,
  max,
  disabled,
  required,
  ariaLabel,
  autoSelect = true,
}: {
  value: number | undefined | null;
  onChange: (val: number) => void;
  className?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  required?: boolean;
  ariaLabel?: string;
  autoSelect?: boolean;
}) {
  const [localVal, setLocalVal] = useState<string>(() =>
    value !== undefined && value !== null && value !== 0 ? String(value) : (value === 0 ? '0' : '')
  );

  useEffect(() => {
    setLocalVal(prev => {
      const currentNum = prev === '' ? 0 : Number(prev.replace(',', '.'));
      if (value !== undefined && value !== null && value !== currentNum) {
        return value === 0 ? '' : String(value);
      }
      return prev;
    });
  }, [value]);

  return (
    <input
      type="text"
      inputMode="decimal"
      aria-label={ariaLabel}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
      className={`${className} text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
      value={localVal}
      onFocus={e => {
        if (autoSelect) e.target.select();
      }}
      onChange={e => {
        const raw = e.target.value;
        const cleaned = raw.replace(/[^0-9.,-]/g, '');
        setLocalVal(cleaned);
        const normalized = cleaned.replace(',', '.');
        if (normalized === '' || normalized === '-' || isNaN(Number(normalized))) {
          onChange(0);
        } else {
          let val = Number(normalized);
          if (max !== undefined && val > max) val = max;
          onChange(val);
        }
      }}
      onBlur={() => {
        const normalized = localVal.replace(',', '.');
        if (normalized === '' || isNaN(Number(normalized))) {
          setLocalVal('');
          onChange(0);
        } else {
          let num = Number(normalized);
          if (min !== undefined && num < min) num = min;
          if (max !== undefined && num > max) num = max;
          setLocalVal(num === 0 ? '' : String(num));
          onChange(num);
        }
      }}
    />
  );
}

export function Screen({ title, children }: { title?: string; children: ReactNode }) { 
  const theme = useFinixUITheme();
  if (theme === 'fiori') {
    return (
      <section className="finix-fiori-mode flex h-full min-h-80 flex-col overflow-auto bg-slate-50/70 dark:bg-[#111927] font-sans text-xs text-slate-800 dark:text-slate-100 p-4 sm:p-6 transition-colors">
        <div className="space-y-4 max-w-6xl mx-auto w-full">
          {title && (
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0055A5] dark:text-[#38bdf8] border border-blue-200/60 dark:border-blue-900/60">
                SAP Fiori Horizon
              </span>
            </div>
          )}
          {children}
        </div>
      </section>
    );
  }
  return (
    <section className="flex h-full min-h-80 flex-col overflow-auto bg-[#ECE9D8] font-[Tahoma,Arial,sans-serif] text-[11px] text-[#222]">
      <div className="space-y-3 p-3">{children}</div>
    </section>
  ); 
}

export function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) { 
  const theme = useFinixUITheme();
  if (theme === 'fiori') {
    return (
      <label className="block space-y-1.5">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-rose-600 font-bold">*</span>}
        </span>
        {children}
      </label>
    );
  }
  return (
    <label className="block space-y-1">
      <span className="font-semibold text-[#334155]">{label} {required && <span className="text-red-700">*</span>}</span>
      {children}
    </label>
  ); 
}

export function Busy() { 
  return (
    <span role="status" className="inline-flex items-center gap-2">
      <span aria-hidden="true" className="h-3 w-3 animate-spin rounded-full border-2 border-[#999] border-t-[#003366] motion-reduce:animate-none" />
      Procesando…
    </span>
  ); 
}

export function SaveButton({ disabled, label = 'Añadir' }: { disabled?: boolean; label?: string }) { 
  const c = useCompany(); 
  const theme = useFinixUITheme();
  if (theme === 'fiori') {
    return (
      <button 
        type="submit" 
        disabled={disabled || c.saving || c.loading} 
        className="border border-[#0055A5] bg-[#0055A5] hover:bg-[#004080] text-white font-bold px-5 py-2 text-xs rounded-xl shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer transition-all flex items-center gap-1.5"
      >
        {c.saving ? <Busy /> : label}
      </button>
    );
  }
  return (
    <button 
      type="submit" 
      disabled={disabled || c.saving || c.loading} 
      className="border border-[#c48a00] bg-gradient-to-b from-[#ffd25a] to-[#f0ab00] font-bold px-4 py-1 text-[#1d2d3e] hover:brightness-105 active:scale-95 disabled:opacity-50 cursor-pointer rounded-sm shadow-sm"
    >
      {c.saving ? <Busy /> : label}
    </button>
  ); 
}

export function Navigation({ count, index, onSelect, onNew }: { count: number; index: number; onSelect: (index: number) => void; onNew: () => void }) {
  const c = useCompany();
  const theme = useFinixUITheme();
  if (theme === 'fiori') {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center gap-1.5">
          <button 
            type="button" 
            aria-label="Documento anterior" 
            disabled={c.saving || !count || index === 0} 
            onClick={() => onSelect(index < 0 ? count - 1 : index - 1)} 
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 font-semibold text-xs text-slate-700 dark:text-slate-200 disabled:opacity-40 transition active:scale-95"
          >
            ◀ Ant
          </button>
          <button 
            type="button" 
            aria-label="Documento siguiente" 
            disabled={c.saving || !count || index >= count - 1} 
            onClick={() => onSelect(index + 1)} 
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 font-semibold text-xs text-slate-700 dark:text-slate-200 disabled:opacity-40 transition active:scale-95"
          >
            Sig ▶
          </button>
          <button 
            type="button" 
            disabled={c.saving} 
            onClick={onNew} 
            className="ml-1 px-3 py-1.5 rounded-lg border border-[#0055A5]/40 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-[#0055A5] dark:text-[#38bdf8] font-bold text-xs transition active:scale-95"
          >
            ⊕ Nuevo Registro
          </button>
        </div>
        <span className="font-semibold text-xs text-slate-600 dark:text-slate-300">
          {index < 0 ? '✨ Creación de nuevo registro' : `📄 ${index + 1} de ${count} · Registro activo`}
        </span>
        <button 
          type="button" 
          disabled={c.loading || c.saving} 
          onClick={() => { void c.refresh(); }} 
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 font-medium text-xs text-slate-600 dark:text-slate-300 transition active:scale-95"
        >
          Actualizar
        </button>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2 bg-[#D4D0C8] p-2 rounded border border-[#999]">
      <button type="button" aria-label="Documento anterior" disabled={c.saving || !count || index === 0} onClick={() => onSelect(index < 0 ? count - 1 : index - 1)} className={buttonClass}>◀</button>
      <button type="button" aria-label="Documento siguiente" disabled={c.saving || !count || index >= count - 1} onClick={() => onSelect(index + 1)} className={buttonClass}>▶</button>
      <button type="button" disabled={c.saving} onClick={onNew} className={buttonClass}>⊕ Nuevo</button>
      <span className="font-semibold text-[#1e293b]">{index < 0 ? 'Creación de nuevo registro' : `${index + 1} de ${count} · Registro en memoria`}</span>
      <button type="button" disabled={c.loading || c.saving} onClick={() => { void c.refresh(); }} className={buttonClass}>Actualizar datos</button>
    </div>
  );
}

export function Table({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) { 
  const theme = useFinixUITheme();
  if (theme === 'fiori') {
    return (
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
            <tr>
              {headers.map(h => (
                <th key={h} scope="col" className="p-3 text-slate-700 dark:text-slate-200">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className="p-3 text-slate-800 dark:text-slate-200">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={headers.length} className="p-6 text-center text-slate-500 italic">
                  Sin registros en la tabla. Registra el primero.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto border border-[#999]">
      <table className="w-full border-collapse bg-white text-left text-[11px]">
        <thead className="bg-[#D4D0C8] font-bold text-[#1e293b]">
          <tr>
            {headers.map(h => <th key={h} scope="col" className="border border-[#999] p-2">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-[#FFFDE7]">
              {row.map((cell, j) => <td key={j} className="border border-[#999] p-2">{cell}</td>)}
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={headers.length} className="p-4 text-center text-gray-500">Sin registros en la tabla. Registra el primero.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  ); 
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null); 
  const id = useId();
  const theme = useFinixUITheme();
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => dialog?.close(); }, []);
  if (theme === 'fiori') {
    return (
      <dialog ref={ref} onCancel={event => { event.preventDefault(); onClose(); }} aria-labelledby={id} className="finix-fiori-mode max-h-[85dvh] w-[min(95vw,850px)] overflow-auto border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 rounded-2xl font-sans text-xs text-slate-800 dark:text-slate-100 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-xs">
        <div className="mb-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 id={id} className="font-bold text-base text-slate-900 dark:text-white tracking-tight">{title}</h2>
          <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 font-medium text-xs text-slate-600 dark:text-slate-300 transition">
            Cerrar
          </button>
        </div>
        {children}
      </dialog>
    );
  }
  return (
    <dialog ref={ref} onCancel={event => { event.preventDefault(); onClose(); }} aria-labelledby={id} className="max-h-[85dvh] w-[min(95vw,850px)] overflow-auto border border-[#999] bg-[#ECE9D8] p-4 font-[Tahoma,Arial,sans-serif] text-[11px] text-[#222] shadow-xl backdrop:bg-black/50">
      <div className="mb-3 flex items-center justify-between border-b border-[#999] pb-2">
        <h2 id={id} className="font-bold text-sm text-[#0A246A]">{title}</h2>
        <button type="button" onClick={onClose} className={buttonClass}>Cerrar</button>
      </div>
      {children}
    </dialog>
  );
}

export interface FieldDefinition<T> { 
  key: keyof T; 
  label: string; 
  kind?: 'text' | 'number' | 'date' | 'email' | 'textarea' | 'checkbox' | 'select'; 
  options?: { value: string; label: string }[]; 
  required?: boolean; 
  tab?: string; 
  min?: number; 
  max?: number;
}

export function MasterForm<T extends object>({ title, initial, records, fields, onSave }: { title: string; initial: T; records: (T & { id: string })[]; fields: FieldDefinition<T>[]; onSave: (value: T) => Promise<string> }) {
  const c = useCompany(); 
  const [value, setValue] = useState<T>(initial); 
  const [index, setIndex] = useState(-1); 
  const [tab, setTab] = useState(fields[0]?.tab ?? 'General'); 
  const tabs = [...new Set(fields.map(f => f.tab ?? 'General'))];
  
  const reset = () => { setValue(initial); setIndex(-1); };

  const theme = useFinixUITheme();

  return (
    <Screen>
      <Navigation count={records.length} index={index} onNew={reset} onSelect={i => { setIndex(i); setValue(records[i]); }} />
      <div className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold ${
        theme === 'fiori'
          ? 'bg-slate-100/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
          : 'bg-slate-100 border-[#999]'
      }`}>
        <span>Estado: {index >= 0 ? `Registro existente ID #${records[index]?.id}` : 'Código automático al guardar'}</span>
        {index >= 0 && <span className="text-emerald-700 dark:text-emerald-400 font-bold">Modo edición habilitado</span>}
      </div>

      <div className={`flex flex-wrap gap-1.5 pb-2 ${theme === 'fiori' ? 'border-b border-slate-200 dark:border-slate-800' : 'border-b border-[#999]'}`}>
        {tabs.map(t => (
          <button 
            type="button" 
            key={t} 
            onClick={() => setTab(t)} 
            aria-pressed={tab === t} 
            className={
              theme === 'fiori'
                ? `px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
                    tab === t
                      ? 'bg-[#0055A5] text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`
                : `${buttonClass} ${tab === t ? 'bg-[#003366] text-white font-bold border-[#002244]' : ''}`
            }
          >
            {t}
          </button>
        ))}
      </div>

      <form 
        onSubmit={async event => { 
          event.preventDefault(); 
          try { 
            await onSave(value); 
            reset(); 
          } catch { 
            /* Provider error */ 
          } 
        }} 
        className="space-y-4"
      >
        <fieldset disabled={c.saving} className={`grid gap-4 sm:grid-cols-2 rounded-2xl border ${
          theme === 'fiori'
            ? 'bg-white dark:bg-slate-900 p-6 border-slate-200 dark:border-slate-800 shadow-xs'
            : 'bg-white p-4 border-[#999] shadow-inner'
        }`}>
          {fields.map(f => (
            <div key={String(f.key)} hidden={(f.tab ?? 'General') !== tab}>
              <Field label={f.label} required={f.required}>
                {f.kind === 'checkbox' ? (
                  <input 
                    type="checkbox" 
                    checked={Boolean(value[f.key])} 
                    onChange={e => setValue(v => ({ ...v, [f.key]: e.target.checked }))} 
                    className="w-4 h-4 accent-[#0055A5] rounded cursor-pointer"
                  />
                ) : f.kind === 'select' ? (
                  <select 
                    className={inputClass} 
                    required={f.required} 
                    value={String(value[f.key] ?? '')} 
                    onChange={e => setValue(v => ({ ...v, [f.key]: e.target.value }))}
                  >
                    {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : f.kind === 'textarea' ? (
                  <textarea 
                    className={inputClass} 
                    rows={3}
                    value={String(value[f.key] ?? '')} 
                    onChange={e => setValue(v => ({ ...v, [f.key]: e.target.value }))} 
                  />
                ) : (
                  <input 
                    className={inputClass} 
                    type={f.kind ?? 'text'} 
                    required={f.required} 
                    min={f.min ?? (f.kind === 'number' ? 0 : undefined)} 
                    max={f.max} 
                    step={f.kind === 'number' ? 'any' : undefined} 
                    value={String(value[f.key] ?? '')} 
                    onChange={e => setValue(v => ({ ...v, [f.key]: f.kind === 'number' ? Number(e.target.value) : e.target.value }))} 
                  />
                )}
              </Field>
            </div>
          ))}
        </fieldset>

        <div className={`flex items-center gap-3 pt-3 border-t ${theme === 'fiori' ? 'border-slate-200 dark:border-slate-800' : 'border-[#999]'}`}>
          <SaveButton label={index >= 0 ? 'Actualizar registro' : 'Añadir'} />
          <button 
            type="button" 
            disabled={c.saving} 
            onClick={reset} 
            className={
              theme === 'fiori'
                ? 'px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-xs text-slate-700 dark:text-slate-200 transition active:scale-95 disabled:opacity-50'
                : buttonClass
            }
          >
            Cancelar / Nuevo
          </button>
        </div>
      </form>
    </Screen>
  );
}

export { AccountCombobox } from './AccountCombobox';
