import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BotonConfigurarCookies } from '@/components/legal/CookieConsent';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050811] text-slate-300 py-14">
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
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-sky-200 to-[#0a6ed1] bg-clip-text text-transparent font-display">
                  ACADEMY
                </span>
                <span className="text-[9px] tracking-wide text-slate-400 font-semibold">
                  Escuela de capacitación
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Campus virtual independiente especializado en <strong className="text-white">procesos empresariales con SAP Business One</strong>.
              Rutas formativas, evaluaciones propias, simulador educativo y oportunidades laborales cuando existan vacantes publicadas.
            </p>
          </div>

          {/* Col 2: Carreras */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">
              Explora el programa
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/capacitacion" className="hover:text-sky-400">Rutas de especialidad</Link></li>
              <li><Link href="/manuales" className="hover:text-sky-400">Manuales y atlas</Link></li>
              <li><Link href="/simulador" className="hover:text-sky-400">Laboratorio ERP</Link></li>
              <li><Link href="/verificar" className="hover:text-sky-400">Verificar una constancia</Link></li>
            </ul>
          </div>

          {/* Col 3: Plataforma */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">
              Plataforma
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/mi-aula" className="hover:text-amber-400 font-bold text-amber-400">🎓 Mi Aula Virtual</Link></li>
              <li><Link href="/simulador" className="hover:text-sky-400">🚀 Simulador SAP Business One</Link></li>
              <li><Link href="/manuales" className="hover:text-sky-400">📖 Manuales & Atlas Visual</Link></li>
              <li><Link href="/bolsa-empleo" className="hover:text-sky-400">💼 Bolsa de Empleo (Job-Ready)</Link></li>
            </ul>
          </div>

          {/* Col 4: Soporte */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">
              Admisiones & Soporte
            </h4>
            <div className="text-xs text-slate-400 space-y-2.5">
              <p>¿Necesitas orientación? Explora las rutas o consulta la ayuda del sitio.</p>
              <p><Link href="/empresas#solicitud" className="text-sky-400 underline hover:text-sky-300">Solicitar formación para empresas</Link></p>
              <p className="text-[11px] text-slate-500 pt-1">
                Formación y constancias emitidas por B1 Academy.
              </p>
            </div>
          </div>
        </div>

        {/* Sección 1: Copyright y Enlaces Legales */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} B1 Academy. Formación profesional en SAP Business One.</p>
          <nav aria-label="Información legal" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <Link href="/privacidad" className="hover:text-white hover:underline">Privacidad y datos personales</Link>
            <Link href="/terminos" className="hover:text-white hover:underline">Términos y condiciones</Link>
            <Link href="/cookies" className="hover:text-white hover:underline">Política de cookies</Link>
            <BotonConfigurarCookies className="hover:text-white hover:underline" />
          </nav>
        </div>

        {/* Sección 2: Licencia SinergIA Tech */}
        <div className="mt-4 pt-4 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p className="text-[11px]">
            Licencia operativa y tecnología provista por <strong className="text-slate-300 font-semibold">SinergIA Tech</strong>.
          </p>
          <p className="text-[11px] text-center sm:text-right text-slate-500">
            Simulador y plataforma de evaluación para formación ejecutiva.
          </p>
        </div>
      </div>
    </footer>
  );
}
