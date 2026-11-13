'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  UserCheck, 
  Target, 
  Activity, 
  LogOut,
  X,
  FileCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/site/ThemeToggle';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { userProfile, logout } = useAuth();

  const navLinks = [
    { href: '/admin', label: 'B1 Administrativo', icon: LayoutDashboard },
    { href: '/admin/usuarios', label: 'Usuarios del Sistema', icon: Users },
    { href: '/admin/progress', label: 'Estudiantes & Avance', icon: GraduationCap },
    { href: '/admin/docentes', label: 'Profesores / Docentes', icon: UserCheck },
    { href: '/admin/crm', label: 'CRM Leads & Clics', icon: Target },
    { href: '/admin/log', label: 'Bitácora & Logs', icon: Activity },
  ];

  return (
    <>
      {/* Backdrop en móvil */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden" 
        />
      )}

      {/* Sidebar fijo: altura de pantalla 100vh, logo fijo arriba, usuario fijo abajo, scroll SOLO en botones */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col h-screen max-h-screen shrink-0
        bg-white dark:bg-[#070b14]
        border-r border-slate-200/80 dark:border-blue-500/20 text-slate-800 dark:text-white shadow-xl dark:shadow-2xl
        transition-all duration-300 ease-out md:static md:translate-x-0
        ${isOpen ? 'translate-x-0 w-72' : '-translate-x-full md:w-64'}
      `}>
        {/* 1. TÍTULO / LOGO FIJO ARRIBA (shrink-0: no se mueve) */}
        <div className="h-16 shrink-0 flex items-center justify-between px-5 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/30 border border-blue-400/40">
              B1
            </div>
            <div>
              <p className="text-xs font-black tracking-wider text-slate-900 dark:text-white uppercase font-display">B1 ACADEMY</p>
              <p className="text-[9px] font-mono tracking-widest text-blue-600 dark:text-sky-400 uppercase font-bold">Panel Central</p>
            </div>
          </Link>

          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. BOTONES DEL MEDIO (flex-1 min-h-0 overflow-y-auto: scrollea de forma independiente si crecen) */}
        <nav className="flex-1 min-h-0 space-y-1 p-3 overflow-y-auto overflow-x-hidden">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all
                  ${isActive 
                    ? 'bg-blue-50 dark:bg-gradient-to-r dark:from-blue-600/30 dark:to-indigo-600/20 text-blue-600 dark:text-sky-300 border border-blue-200 dark:border-blue-500/40 shadow-sm shadow-blue-500/10 dark:shadow-blue-500/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                  }
                `}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="truncate">{link.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-sky-400 shadow-[0_0_8px_rgba(37,99,235,0.8)] dark:shadow-[0_0_8px_rgba(56,189,248,0.8)] shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 3. USUARIO FIJO ABAJO (shrink-0 mt-auto: nunca se mueve, siempre al pie del sidebar) */}
        <div className="shrink-0 p-3 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] mt-auto">
          <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-between gap-2">
            <div className="min-w-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-xs shrink-0 shadow-sm">
                {(userProfile?.name || 'P').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{userProfile?.name || 'Pablo'}</p>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono uppercase font-semibold">{userProfile?.role || 'SUPER'}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <ThemeToggle />
              <button 
                onClick={logout}
                title="Cerrar sesión"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition shrink-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
