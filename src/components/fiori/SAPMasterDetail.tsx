"use client";

import React, { useState } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';

export interface MasterDetailItem {
  id: string;
  title: string;
  subtitle?: string;
}

export interface SAPMasterDetailProps {
  pageTitle: string;
  items: MasterDetailItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  onBack?: () => void;
  children: React.ReactNode;
}

export const SAPMasterDetail = ({ pageTitle, items, selectedId, onSelect, onBack, children }: SAPMasterDetailProps) => {
  return (
    <div className="w-full h-full flex flex-col bg-[#f2f4f7]">
      {/* Sub-header */}
      <div className="h-12 bg-white border-b border-[#d9d9d9] flex items-center px-4 shrink-0">
        <button 
          onClick={onBack}
          className="p-1.5 hover:bg-slate-100 rounded mr-2 text-[#008FD3] flex items-center"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span className="font-black italic bg-[#008FD3] text-white px-1 rounded-sm text-[10px] leading-tight">SAP</span>
        </button>
        <h2 className="text-[#32363a] font-normal text-lg">{pageTitle}</h2>
      </div>

      {/* Layout Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Master List */}
        <div className="w-80 bg-white border-r border-[#d9d9d9] flex flex-col">
          <div className="p-3 border-b border-[#d9d9d9] flex items-center justify-between text-sm text-[#32363a] font-semibold bg-[#f4f4f5]">
            <span>{pageTitle} ({items.length})</span>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`w-full text-left p-3 border-b border-[#e5e5e5] transition-colors ${
                  selectedId === item.id 
                    ? 'bg-[#e5f0fa] border-l-4 border-l-[#008FD3]' 
                    : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                }`}
              >
                <div className="text-[13px] text-[#32363a] uppercase">{item.title}</div>
                {item.subtitle && <div className="text-xs text-slate-500 mt-1">{item.subtitle}</div>}
              </button>
            ))}
          </div>

          <div className="p-2 border-t border-[#d9d9d9] bg-white flex justify-end">
            <button className="w-8 h-8 flex items-center justify-center text-[#008FD3] hover:bg-[#e5f0fa] rounded">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Detail View */}
        <div className="flex-1 overflow-y-auto bg-[#f2f4f7] p-6 relative">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-[#d9d9d9] overflow-hidden min-h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
