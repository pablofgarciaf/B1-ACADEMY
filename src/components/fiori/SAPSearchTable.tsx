"use client";

import React from 'react';
import { Search, X, ChevronLeft, ChevronRight, Plus, UserPlus, Edit2, FileText } from 'lucide-react';

export interface Column {
  key: string;
  label: string;
  width?: string;
}

export interface SAPSearchTableProps {
  title: string;
  columns: Column[];
  data: any[];
  onClose?: () => void;
}

export const SAPSearchTable = ({ title, columns, data, onClose }: SAPSearchTableProps) => {
  return (
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4 sm:p-8 z-50 font-sans">
      <div className="bg-white w-full max-w-6xl h-full max-h-[800px] flex flex-col shadow-2xl overflow-hidden rounded-sm">
        
        {/* Header Bar */}
        <div className="bg-[#32363a] h-10 flex items-center justify-between px-4 text-white shrink-0">
          <span className="text-sm font-semibold uppercase">{title}</span>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex px-4 pt-4 border-b border-[#d9d9d9] bg-[#f4f4f5]">
          <button className="px-6 py-2 border-b-2 border-[#008FD3] text-[#008FD3] text-sm font-semibold uppercase">
            Búsqueda Básica
          </button>
          <button className="px-6 py-2 border-b-2 border-transparent text-slate-500 hover:text-slate-700 text-sm font-semibold uppercase">
            Búsqueda Avanzada
          </button>
        </div>

        {/* Search Input Area */}
        <div className="p-4 bg-white border-b border-[#d9d9d9] flex gap-2">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Búsqueda de texto completo" 
              className="w-full border border-[#d9d9d9] px-3 py-2 text-sm focus:outline-none focus:border-[#008FD3] focus:ring-1 focus:ring-[#008FD3]"
            />
          </div>
          <button className="bg-[#008FD3] hover:bg-[#007cc0] text-white px-8 py-2 font-semibold text-sm flex items-center">
            <Search className="w-4 h-4 mr-2" /> Buscar
          </button>
        </div>

        {/* Table Data */}
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f2f4f7] text-[#32363a] sticky top-0 border-b border-[#d9d9d9]">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className="px-4 py-3 font-semibold uppercase text-xs truncate" style={{ width: col.width }}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rIdx) => (
                <tr 
                  key={rIdx} 
                  className={`border-b border-[#e5e5e5] hover:bg-[#e5f0fa] cursor-pointer ${rIdx === 0 ? 'bg-[#008FD3] text-white hover:bg-[#007cc0]' : 'text-[#32363a]'}`}
                >
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-4 py-3 truncate">
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination & Actions Footer */}
        <div className="p-4 bg-[#f2f4f7] border-t border-[#d9d9d9] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            Página 1 de 249 (2486 resultados)
          </div>
          
          <div className="flex gap-2">
            <button className="bg-[#008FD3] text-white p-2 hover:bg-[#007cc0]">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="bg-[#008FD3] text-white p-2 hover:bg-[#007cc0]">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-[#d9d9d9] flex flex-wrap justify-center sm:justify-end gap-2">
          <button className="bg-[#008FD3] hover:bg-[#007cc0] text-white px-4 py-2 text-xs font-semibold flex items-center gap-2 uppercase">
            <Search className="w-4 h-4" /> Información de fidelización
          </button>
          <button className="bg-[#008FD3] hover:bg-[#007cc0] text-white px-4 py-2 text-xs font-semibold flex items-center gap-2 uppercase">
            <UserPlus className="w-4 h-4" /> Crear cliente
          </button>
          <button className="bg-[#008FD3] hover:bg-[#007cc0] text-white px-4 py-2 text-xs font-semibold flex items-center gap-2 uppercase">
            <Edit2 className="w-4 h-4" /> Editar cliente
          </button>
          <button className="bg-[#008FD3] hover:bg-[#007cc0] text-white px-4 py-2 text-xs font-semibold flex items-center gap-2 uppercase">
            <Plus className="w-4 h-4" /> Añadir a recibo
          </button>
          <button onClick={onClose} className="bg-slate-400 hover:bg-slate-500 text-white px-8 py-2 text-xs font-semibold flex items-center gap-2 uppercase">
            <X className="w-4 h-4" /> Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
