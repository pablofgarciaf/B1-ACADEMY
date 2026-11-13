'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Menu } from 'lucide-react';
import { useAdminLayout } from '@/components/admin/AdminLayoutContext';
import { ThemeToggle } from '@/components/site/ThemeToggle';

const DEFAULT_TITLES: Record<string, { title: string; description: string }> = {
  '/admin': {
    title: 'Consola Master de Alumnos & Progreso',
    description: 'Administra matrículas, credenciales con cédula, seguimiento de avances y habilitación laboral.',
  },
  '/admin/usuarios': {
    title: 'Gestión de Usuarios, Docentes y Estudiantes',
    description: 'Control de cuentas, perfiles de acceso administrativo, docentes de soporte y alumnos de la academia.',
  },
  '/admin/progress': {
    title: 'Consola Master de Alumnos & Progreso',
    description: 'Seguimiento individualizado por estudiante, módulos completados y desbloqueo de exámenes en 1 clic.',
  },
  '/admin/docentes': {
    title: 'Gestión de Profesores y Docentes',
    description: 'Crea y administra instructores autorizados para calificar laboratorios y guiar módulos de especialidad.',
  },
  '/admin/crm': {
    title: 'CRM Leads & Marcador de Clics',
    description: 'Seguimiento de prospectos corporativos, solicitudes de capacitación y analítica de clics (WhatsApp & TikTok).',
  },
  '/admin/log': {
    title: 'Bitácora de Seguridad & Logs del Sistema',
    description: 'Registro cronológico de desbloqueos de evaluaciones orales, cambios de credenciales y accesos.',
  },
};

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { header } = useAdminLayout();

  const fallback = DEFAULT_TITLES[pathname] || DEFAULT_TITLES['/admin'];
  const title = header.title || fallback.title;
  const description = header.description || fallback.description;

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#050811] text-slate-900 dark:text-slate-100 flex font-sans transition-colors duration-200">
      {/* 1. Sidebar a la izquierda (Fijo 100vh, logo arriba, usuario abajo, scroll solo en botones) */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. Contenedor Derecho: Header Fijo Completo + Main con scroll independiente */}
      <div className="flex-1 flex flex-col h-screen max-h-screen min-w-0 overflow-hidden">
        {/* HEADER 100% FIJO ARRIBA CON TÍTULO, DESCRIPCIÓN, BADGES Y BOTONES */}
        <header className="shrink-0 border-b border-slate-200/80 dark:border-blue-500/20 bg-white/95 dark:bg-[#090d1a]/95 backdrop-blur-md px-6 py-4 z-30 sticky top-0 shadow-sm dark:shadow-lg dark:shadow-blue-950/20 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto w-full">
            {/* Izquierda: Título Principal + Descripción */}
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white md:hidden cursor-pointer shrink-0"
                  title="Abrir menú"
                >
                  <Menu className="w-4 h-4" />
                </button>

                <h1 className="text-lg sm:text-2xl font-extrabold text-slate-950 dark:text-white font-display tracking-tight truncate">
                  {title}
                </h1>
              </div>

              {description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {description}
                </p>
              )}
            </div>

            {/* Derecha: Botones de Acción + Toggle de Tema Claro/Oscuro */}
            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              {header.actions}
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* CONTENIDO PRINCIPAL SCROLLEABLE (flex-1 min-h-0 overflow-y-auto) */}
        <main className="flex-1 min-h-0 overflow-y-auto bg-slate-100/60 dark:bg-[#050811] transition-colors">
          {children}
        </main>
      </div>
    </div>
  );
}
