import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BotonConfigurarCookies } from '@/components/legal/CookieConsent';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#050811] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Logo */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="w-10 h-10 relative group-hover:scale-105 transition-transform flex-shrink-0">
                <Image
                  src="/b1-academy-logo.webp"
                  alt="B1"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-[#0a6ed1] to-sky-600 dark:from-white dark:via-sky-200 dark:to-[#0a6ed1] bg-clip-text text-transparent font-display">
                  ACADEMY
                </span>
                <span className="text-[9px] tracking-wide text-slate-500 dark:text-slate-400 font-semibold">
                  Escuela de capacitación
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Campus virtual independiente especializado en <strong>procesos empresariales con SAP Business One</strong>.
              Rutas formativas, evaluaciones propias, simulador educativo y oportunidades laborales cuando existan vacantes publicadas.
            </p>
          </div>

          {/* Col 2: Carreras */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white mb-4">
              Explora el programa
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <li><Link href="/capacitacion" className="hover:text-finix-blue">Rutas de especialidad</Link></li>
              <li><Link href="/manuales" className="hover:text-finix-blue">Manuales y atlas</Link></li>
              <li><Link href="/simulador" className="hover:text-finix-blue">Laboratorio ERP</Link></li>
              <li><Link href="/verificar" className="hover:text-finix-blue">Verificar una constancia</Link></li>
            </ul>
          </div>

          {/* Col 3: Plataforma */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white mb-4">
              Plataforma
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <li><Link href="/mi-aula" className="hover:text-amber-500 font-bold text-amber-600 dark:text-amber-400">🎓 Mi Aula Virtual</Link></li>
              <li><Link href="/simulador" className="hover:text-finix-blue">🚀 Simulador SAP Business One</Link></li>
              <li><Link href="/manuales" className="hover:text-finix-blue">📖 Manuales & Atlas Visual</Link></li>
              <li><Link href="/bolsa-empleo" className="hover:text-finix-blue">💼 Bolsa de Empleo (Job-Ready)</Link></li>
            </ul>
          </div>

          {/* Col 4: Soporte */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white mb-4">
              Admisiones & Soporte
            </h4>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2.5">
              <p>¿Necesitas orientación? Explora las rutas o consulta la ayuda del sitio.</p>
              <p><Link href="/empresas#solicitud" className="text-finix-blue underline">Solicitar formación para empresas</Link></p>
              <p className="text-[11px] text-slate-500 pt-1">
                Formación y constancias emitidas por B1 Academy.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} B1 Academy. Formación profesional en SAP Business One.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/mi-aula" className="hover:underline">Mi Aula Virtual</Link>
            <Link href="/simulador" className="hover:underline">Simulador</Link>
            <Link href="/manuales" className="hover:underline">Manuales & Atlas</Link>
            <Link href="/bolsa-empleo" className="hover:underline">Vacantes Activas</Link>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <nav aria-label="Información legal" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <Link href="/privacidad" className="hover:underline">Privacidad y datos personales</Link>
            <Link href="/terminos" className="hover:underline">Términos y condiciones</Link>
            <Link href="/cookies" className="hover:underline">Política de cookies</Link>
            <BotonConfigurarCookies className="hover:underline" />
          </nav>
          <p className="text-[11px] text-center sm:text-right max-w-xl">
            Las constancias de B1 Academy corresponden a este programa de formación y pueden verificarse por código.
          </p>
        </div>
      </div>
    </footer>
  );
}
