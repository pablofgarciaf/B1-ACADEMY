'use client';

import { useState, useRef, useEffect, useMemo, useId } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import type { AccountingAccount } from '@/lib/firestore-types';

export interface AccountOption {
  code: string;
  name: string;
  category?: string;
  postable?: boolean;
}

const CATEGORY_STYLES: Record<string, { label: string; badge: string }> = {
  asset: { label: 'Activo', badge: 'bg-blue-100 text-blue-800 border-blue-200' },
  liability: { label: 'Pasivo', badge: 'bg-red-100 text-red-800 border-red-200' },
  equity: { label: 'Patrimonio', badge: 'bg-amber-100 text-amber-800 border-amber-200' },
  income: { label: 'Ingreso', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  cost: { label: 'Costo', badge: 'bg-orange-100 text-orange-800 border-orange-200' },
  expense: { label: 'Gasto', badge: 'bg-purple-100 text-purple-800 border-purple-200' },
};

function normalizar(texto: string): string {
  return (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function AccountCombobox({
  value,
  onChange,
  accounts,
  disabled = false,
  required = false,
  ariaLabel = 'Seleccionar cuenta contable',
  placeholder = 'Código o nombre de cuenta...',
}: {
  value: string;
  onChange: (accountCode: string) => void;
  accounts: AccountOption[];
  disabled?: boolean;
  required?: boolean;
  ariaLabel?: string;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Ordenar numéricamente por código contable
  const sortedAccounts = useMemo(() => {
    return [...accounts]
      .filter(a => a.postable !== false)
      .sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
  }, [accounts]);

  // Cuenta actualmente seleccionada
  const selectedAccount = useMemo(() => {
    return sortedAccounts.find(a => a.code === value);
  }, [sortedAccounts, value]);

  // Filtrado reactivo en tiempo real
  const filteredAccounts = useMemo(() => {
    if (!search.trim()) return sortedAccounts.slice(0, 100);
    const query = normalizar(search);
    return sortedAccounts
      .filter(a => {
        const c = normalizar(a.code);
        const n = normalizar(a.name);
        return c.includes(query) || n.includes(query);
      })
      .slice(0, 60);
  }, [sortedAccounts, search]);

  // Cerrar al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Si hay una cuenta seleccionada, restaurar su nombre en el input de búsqueda
        if (selectedAccount) {
          setSearch(`${selectedAccount.code} · ${selectedAccount.name}`);
        } else {
          setSearch('');
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedAccount]);

  // Sincronizar texto de búsqueda cuando cambia el valor desde afuera
  useEffect(() => {
    if (selectedAccount) {
      setSearch(`${selectedAccount.code} · ${selectedAccount.name}`);
    } else if (!value) {
      setSearch('');
    }
  }, [selectedAccount, value]);

  const handleSelect = (account: AccountOption) => {
    onChange(account.code);
    setSearch(`${account.code} · ${account.name}`);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredAccounts.length - 1 ? prev + 1 : prev));
      scrollSelectedIntoView(selectedIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
      scrollSelectedIntoView(selectedIndex - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredAccounts[selectedIndex]) {
        handleSelect(filteredAccounts[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === 'Tab') {
      // Si hay una coincidencia exacta o resaltada, seleccionarla al pasar con Tab
      if (filteredAccounts[selectedIndex]) {
        handleSelect(filteredAccounts[selectedIndex]);
      }
      setIsOpen(false);
    }
  };

  const scrollSelectedIntoView = (index: number) => {
    if (!listRef.current) return;
    const items = listRef.current.getElementsByTagName('li');
    if (items[index]) {
      items[index].scrollIntoView({ block: 'nearest' });
    }
  };

  const listboxId = useId();

  return (
    <div ref={containerRef} className="relative w-full min-w-[220px]">
      <div className="flex items-center border border-[#999] bg-white rounded-[2px] focus-within:border-[#0055A5] focus-within:ring-1 focus-within:ring-[#0055A5] focus-within:bg-[#FFFDE7]">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-label={ariaLabel}
          disabled={disabled}
          required={required && !value}
          value={search}
          placeholder={placeholder}
          onFocus={() => {
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onChange={e => {
            setSearch(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
            // Si el usuario borra todo, deseleccionar
            if (!e.target.value.trim()) {
              onChange('');
            }
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent px-2 py-1 text-[11px] text-[#222] outline-none placeholder:text-gray-400 disabled:bg-[#ECE9D8]"
        />

        {value && !disabled && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => {
              onChange('');
              setSearch('');
              inputRef.current?.focus();
            }}
            className="p-1 text-gray-400 hover:text-red-600 transition"
            title="Borrar selección"
          >
            <X size={12} />
          </button>
        )}

        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => {
            setIsOpen(!isOpen);
            inputRef.current?.focus();
          }}
          className="px-1.5 py-1 text-gray-500 hover:text-[#0055A5] transition border-l border-gray-200"
          title="Ver plan de cuentas"
        >
          <ChevronDown size={13} className={`transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Menú flotante desplegable */}
      {isOpen && !disabled && (
        <div className="absolute left-0 top-full z-50 mt-0.5 w-[360px] max-w-[90vw] bg-white border-2 border-[#0055A5] shadow-2xl rounded-sm overflow-hidden text-[11px] animate-in fade-in duration-100 font-[Tahoma,Arial,sans-serif]">
          <div className="flex items-center justify-between bg-[#0055A5] text-white px-2 py-1 font-bold text-[10px]">
            <span className="flex items-center gap-1">
              <Search size={10} />
              Plan de Cuentas NIIF SuperCías
            </span>
            <span className="text-[9px] opacity-80">{filteredAccounts.length} cuentas disponibles</span>
          </div>

          <ul id={listboxId} role="listbox" ref={listRef} className="max-h-56 overflow-y-auto divide-y divide-gray-100">
            {filteredAccounts.length === 0 ? (
              <li className="p-3 text-center text-gray-500 italic">
                No se encontraron cuentas con &quot;{search}&quot;.
              </li>
            ) : (
              filteredAccounts.map((account, idx) => {
                const isSelected = account.code === value;
                const isHighlighted = idx === selectedIndex;
                const cat = CATEGORY_STYLES[account.category || 'asset'] || { label: 'General', badge: 'bg-gray-100 text-gray-800 border-gray-200' };

                return (
                  <li
                    key={account.code}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => handleSelect(account)}
                    className={`flex items-center justify-between gap-2 px-2.5 py-1.5 cursor-pointer transition select-none ${
                      isHighlighted
                        ? 'bg-[#EBF3FB] text-[#003366]'
                        : isSelected
                        ? 'bg-blue-50/70 font-semibold'
                        : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[#0055A5] text-[11px]">
                          {account.code}
                        </span>
                        <span className="text-gray-700 font-medium truncate" title={account.name}>
                          {account.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className={`text-[9px] px-1 py-0.2 rounded border font-semibold ${cat.badge}`}>
                        {cat.label}
                      </span>
                      {isSelected && <Check size={12} className="text-[#0055A5] font-bold" />}
                    </div>
                  </li>
                );
              })
            )}
          </ul>

          <div className="bg-[#ECE9D8] px-2 py-1 text-[9.5px] text-gray-600 border-t border-gray-300 flex justify-between items-center">
            <span>Usa <strong>↑ ↓</strong> para navegar, <strong>Enter</strong> o <strong>Tab</strong> para elegir</span>
            <span className="font-mono">FeNi ERP</span>
          </div>
        </div>
      )}
    </div>
  );
}
