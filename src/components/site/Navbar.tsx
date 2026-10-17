"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  Award,
  Users,
  Layers,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  LogIn,
  LogOut,
  User,
  Building2,
  FileText
} from 'lucide-react';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ecosistemaOpen,setEcosistemaOpen]=useState(false);
  const ecosystemButton=useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { userProfile, logout } = useAuth();

  const isSuperOrAdmin = userProfile?.role === 'super' || userProfile?.role === 'admin';

  const navLinks = [
    { name: 'Mi Aula', href: '/mi-aula', icon: GraduationCap, highlight: true },
    { name: 'Manuales & Atlas', href: '/manuales', icon: BookOpen },
    { name: 'Simulador', href: '/simulador', icon: Briefcase },
    { name: 'Bolsa de Empleo', href: '/bolsa-empleo', icon: Briefcase },
  ];

  const ecosistemaLinks = [
    { name: 'Blog', href: '/blog', icon: FileText },
    { name: 'Empresas', href: '/empresas', icon: Building2 },
    { name: 'Consultores', href: '/consultores', icon: Users },
    { name: 'Talento', href: '/talento', icon: Award },
  ];

  if (isSuperOrAdmin) {
    navLinks.push({ name: 'Panel Admin', href: '/admin', icon: ShieldCheck });
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#080d1a]/85 border-b border-slate-200 dark:border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3.5 group">
          <div className="w-11 h-11 relative group-hover:scale-105 transition-transform flex-shrink-0">
            <Image src="/finix-mark.svg" alt="" width={44} height={44} className="object-contain" priority />
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <span className="text-base sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-[#0a6ed1] to-sky-600 dark:from-white dark:via-sky-200 dark:to-[#0a6ed1] bg-clip-text text-transparent font-display">
              FINIX ACADEMY
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 font-semibold">
              FINIX ERP
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex min-h-[44px] items-center gap-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-finix-blue ${isActive
                  ? 'text-finix-blue dark:text-sky-400 font-bold'
                  : 'hover:text-finix-blue dark:hover:text-sky-300'
                  }`}
              >
                <Icon className="w-4 h-4 opacity-75" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          {/* Ecosistema Dropdown */}
          <div className="relative group" onMouseEnter={()=>setEcosistemaOpen(true)} onMouseLeave={e=>{if(!e.currentTarget.contains(document.activeElement))setEcosistemaOpen(false);}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setEcosistemaOpen(false);}} onKeyDown={e=>{if(e.key==='Escape'){setEcosistemaOpen(false);ecosystemButton.current?.focus();}}}>
            <button ref={ecosystemButton} aria-expanded={ecosistemaOpen} aria-controls="ecosistema-links" onClick={()=>setEcosistemaOpen(v=>!v)} className="flex min-h-[44px] items-center gap-1.5 rounded-lg transition-colors hover:text-finix-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-finix-blue dark:hover:text-sky-300">
              <Sparkles className="w-4 h-4 opacity-75" />
              <span>Ecosistema</span>
              <ChevronDown className="w-3 h-3 opacity-70 group-hover:rotate-180 transition-transform" />
            </button>
            <div id="ecosistema-links" className={"absolute top-full right-0 mt-2 w-48 transition-all duration-200 transform origin-top-right "+(ecosistemaOpen?"opacity-100 visible":"opacity-0 invisible")}>
              <div className="py-2 bg-white dark:bg-[#0b1320] rounded-xl shadow-xl border border-slate-100 dark:border-white/10 overflow-hidden relative before:absolute before:-top-4 before:left-0 before:w-full before:h-4">
                {ecosistemaLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      className={`flex min-h-[44px] items-center gap-2.5 px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-finix-blue ${isActive
                        ? 'text-finix-blue dark:text-sky-400 bg-slate-50 dark:bg-white/5 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-finix-blue dark:hover:text-sky-300'}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* Actions, Auth & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {userProfile ? (
            <div className="flex items-center gap-2">
              <Link
                href={isSuperOrAdmin ? "/admin" : "/dashboard"}
                className="hidden sm:flex items-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-white/10 hover:border-finix-blue text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <div className="w-5 h-5 rounded-md bg-finix-blue text-white flex items-center justify-center text-[10px] font-bold">
                  {(userProfile.name || 'U').charAt(0)}
                </div>
                <span className="line-clamp-1 max-w-[120px]">{userProfile.name?.split(' ')[0]}</span>
                {isSuperOrAdmin && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 text-[10px] font-mono font-bold">
                    Super
                  </span>
                )}
              </Link>
              <button
                onClick={() => logout()}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-rose-500/10 hover:text-rose-500 text-slate-500 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              aria-label="Iniciar Sesión"
              className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold text-white bg-finix-blue hover:bg-sky-600 shadow-md shadow-finix-blue/20 transition-all active:scale-95 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden whitespace-nowrap sm:inline">Iniciar Sesión</span>
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
            aria-label={mobileMenuOpen?"Cerrar menú":"Abrir menú"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#080d1a]/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3 h-[calc(100vh-5rem)] overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                <Icon className="w-4 h-4 text-finix-blue" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-100 dark:border-white/5">
            <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Ecosistema</div>
            {ecosistemaLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  <Icon className="w-4 h-4 text-finix-blue" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex flex-col gap-2">
            {userProfile ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left p-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-bold text-rose-500 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión ({userProfile.email})</span>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-finix-blue text-white text-xs font-bold"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
