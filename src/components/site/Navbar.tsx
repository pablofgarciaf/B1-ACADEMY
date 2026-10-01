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
  const pathname = usePathname();
  const { userProfile, logout } = useAuth();

  const isSuperOrAdmin = userProfile?.role === 'super' || userProfile?.role === 'admin';

  const navLinks = [
    { name: 'Campus', href: '/campus', icon: GraduationCap, highlight: true },
    { name: 'Manuales & Atlas', href: '/manuales', icon: BookOpen },
    { name: '🚀 Simulador', href: '/simulador', icon: Briefcase },
    { name: 'Mi Aula', href: '/mi-aula', icon: Layers },
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
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 relative group-hover:scale-105 transition-transform flex-shrink-0">
            <Image src="/b1-academy-logo.webp" alt="B1 Academy Logo" width={44} height={44} className="object-contain dark:hidden" priority />
            <Image src="/b1-academy-logo-dark.webp" alt="B1 Academy Logo" width={44} height={44} className="object-contain hidden dark:block" priority />
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-[#0a6ed1] to-sky-600 dark:from-white dark:via-sky-200 dark:to-[#0a6ed1] bg-clip-text text-transparent font-display">
              B1 ACADEMY
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 font-semibold">
              SAP BUSINESS ONE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 transition-colors ${isActive
                  ? 'text-sap-blue dark:text-sky-400 font-bold'
                  : 'hover:text-sap-blue dark:hover:text-sky-300'
                  }`}
              >
                <Icon className="w-4 h-4 opacity-75" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          {/* Ecosistema Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 transition-colors hover:text-sap-blue dark:hover:text-sky-300">
              <Sparkles className="w-4 h-4 opacity-75" />
              <span>Ecosistema</span>
              <ChevronDown className="w-3 h-3 opacity-70 group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute top-full right-0 mt-4 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
              <div className="py-2 bg-white dark:bg-[#0b1320] rounded-xl shadow-xl border border-slate-100 dark:border-white/10 overflow-hidden relative before:absolute before:-top-4 before:left-0 before:w-full before:h-4">
                {ecosistemaLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${isActive
                        ? 'text-sap-blue dark:text-sky-400 bg-slate-50 dark:bg-white/5 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-sap-blue dark:hover:text-sky-300'}`}
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
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {userProfile ? (
            <div className="flex items-center gap-2">
              <Link
                href={isSuperOrAdmin ? "/admin" : "/dashboard"}
                className="hidden sm:flex items-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-white/10 hover:border-sap-blue text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <div className="w-5 h-5 rounded-md bg-sap-blue text-white flex items-center justify-center text-[10px] font-bold">
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sap-blue hover:bg-sky-600 shadow-md shadow-sap-blue/20 transition-all active:scale-95 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Iniciar Sesión</span>
            </Link>
          )}

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
        <div className="md:hidden border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#080d1a]/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3 h-[calc(100vh-5rem)] overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                <Icon className="w-4 h-4 text-sap-blue" />
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
                  <Icon className="w-4 h-4 text-sap-blue" />
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
                className="w-full text-center py-2.5 rounded-xl bg-sap-blue text-white text-xs font-bold"
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
