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
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-[#070b14] text-slate-100 flex font-sans">
      {/* 1. Sidebar a la izquierda (Fijo 100vh, logo arriba, usuario abajo, scroll solo en botones) */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. Contenedor Derecho: Header Fijo Completo + Main con scroll independiente */}
      <div className="flex-1 flex flex-col h-screen max-h-screen min-w-0 overflow-hidden">
        {/* HEADER 100% FIJO ARRIBA CON TÍTULO, DESCRIPCIÓN, BADGES Y BOTONES */}
        <header className="shrink-0 border-b border-white/10 bg-[#0c1322]/95 backdrop-blur-md px-6 py-4 z-30 sticky top-0 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto w-full">
            {/* Izquierda: Título Principal + Descripción (Sin badges molestos, misma altura que la derecha) */}
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white md:hidden cursor-pointer shrink-0"
                  title="Abrir menú"
                >
                  <Menu className="w-4 h-4" />
                </button>

                <h1 className="text-lg sm:text-2xl font-extrabold text-white font-display tracking-tight truncate">
                  {title}
                </h1>
              </div>

              {description && (
                <p className="text-xs text-slate-400 line-clamp-1">
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
        <main className="flex-1 min-h-0 overflow-y-auto bg-[#070b14]">
          {children}
        </main>
      </div>
    </div>
  );
}
