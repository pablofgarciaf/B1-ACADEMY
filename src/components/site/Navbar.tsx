"use client";

import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { ThemeToggle } from '@/components/site/ThemeToggle';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Explorar Tracks', href: '/capacitacion', icon: Layers },
    { name: 'Mi Aula Virtual', href: '/dashboard', icon: BookOpen },
    { name: 'Bolsa de Empleo', href: '/bolsa-empleo', icon: Briefcase },
    { name: 'Directorio Talento', href: '/talento', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#080d1a]/85 border-b border-slate-200 dark:border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#003c71] via-[#0a6ed1] to-sky-400 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0b1320] rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-sky-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-[#0a6ed1] to-sky-600 dark:from-white dark:via-sky-200 dark:to-[#0a6ed1] bg-clip-text text-transparent font-display">
              SAP ACADEMY
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 font-semibold">
              Ecosistema Heinsohn Ecuador
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? 'text-sap-blue dark:text-sky-400 font-bold'
                    : 'hover:text-sap-blue dark:hover:text-sky-300'
                }`}
              >
                <Icon className="w-4 h-4 opacity-75" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions & Theme Toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/capacitacion"
            className="hidden sm:inline-flex px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sap-blue to-sky-600 hover:from-sky-600 hover:to-sap-blue shadow-md shadow-sap-blue/25 transition-all active:scale-95 cursor-pointer"
          >
            Ver 5 Tracks de Formación
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#080d1a]/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <Icon className="w-4 h-4 text-sap-blue" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <Link
            href="/capacitacion"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center w-full py-2.5 rounded-xl text-xs font-bold text-white bg-sap-blue"
          >
            Ver Catálogo de Especialidades
          </Link>
        </div>
      )}
    </header>
  );
}
