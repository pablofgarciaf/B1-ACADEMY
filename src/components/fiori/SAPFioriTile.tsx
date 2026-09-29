"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface SAPFioriTileProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  numberInfo?: string | number;
  onClick?: () => void;
}

export const SAPFioriTile = ({ title, subtitle, icon: Icon, numberInfo, onClick }: SAPFioriTileProps) => {
  return (
    <button 
      onClick={onClick}
      className="w-44 h-44 bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col items-start justify-between hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-[#008FD3] text-left group"
    >
      <div className="w-full">
        <h3 className="text-[#32363a] font-normal leading-tight text-[15px]">{title}</h3>
        {subtitle && (
          <p className="text-[#6a6d70] text-xs mt-1">{subtitle}</p>
        )}
      </div>

      <div className="w-full flex items-end justify-between text-[#008FD3]">
        {Icon ? (
          <Icon strokeWidth={1.5} className="w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity" />
        ) : <div />}
        
        {numberInfo !== undefined && (
          <span className="text-3xl font-light leading-none">{numberInfo}</span>
        )}
      </div>
    </button>
  );
};
