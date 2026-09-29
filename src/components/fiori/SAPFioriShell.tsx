"use client";

import React from 'react';
import { Bell, Search, User, Menu, Settings, HelpCircle } from 'lucide-react';

export const SAPFioriShell = ({ children, title = "SAP Customer Checkout manager" }: { children: React.ReactNode, title?: string }) => {
  return (
    <div className="w-full aspect-[16/9] min-h-[500px] max-h-[75vh] flex flex-col bg-[#f2f4f7] font-sans text-[#32363a] rounded-lg overflow-hidden border border-slate-300 shadow-xl relative">
      {/* Fiori Launchpad Header */}
      <header className="h-12 bg-[#354a5f] flex items-center justify-between px-4 text-white shrink-0">
        <div className="flex items-center space-x-4">
          {/* Menu Icon */}
          <button className="p-1.5 hover:bg-white/10 rounded">
            <Menu className="w-5 h-5" />
          </button>
          
          {/* SAP Logo Fake */}
          <div className="text-xl font-bold tracking-tighter flex items-center">
            <span className="text-[#008FD3] bg-white px-1.5 py-0.5 rounded-sm mr-2 text-sm leading-none font-black italic">SAP</span>
          </div>

          <h1 className="text-sm font-medium hidden md:block">{title}</h1>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-1.5 hover:bg-white/10 rounded">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#d97706] rounded-full"></span>
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded">
            <Settings className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded">
            <HelpCircle className="w-4 h-4" />
          </button>
          <button className="ml-2 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold border border-white/30">
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative">
        {children}
      </main>
    </div>
  );
};
