import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BotonConfigurarCookies } from '@/components/legal/CookieConsent';
import { ProtectedEmail } from '@/components/site/ProtectedEmail';

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
                  alt="B1 Academy Logo" 
                  width={40} 
                  height={40} 
                  className="object-contain dark:hidden" 
                />
                <Image 
                  src="/b1-academy-logo-dark.webp" 
                  alt="B1 Academy Logo" 
                  width={40} 
                  height={40} 
                  className="object-contain hidden dark:block" 
                />
              </div>
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-[#0a6ed1] to-sky-600 dark:from-white dark:via-sky-200 dark:to-[#0a6ed1] bg-clip-text text-transparent font-display">
                  B1 ACADEMY
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 font-semibold">
                  SAP BUSINESS ONE
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Campus virtual independiente especializado en <strong>SAP Business One 10.0 (HANA)</strong>. 
              Rutas formativas, evaluaciones propias, simulador transaccional integral y conexión laboral.
            </p>
          </div>

          {/* Col 2: Carreras */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white mb-4">
              4 Carreras de la Escuela
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <li><Link href="/mi-aula" className="hover:text-sap-blue">1. Fundamentos & Núcleo ERP</Link></li>
              <li><Link href="/mi-aula" className="hover:text-sap-blue">2. Finanzas NIIF & Tesorería</Link></li>
              <li><Link href="/mi-aula" className="hover:text-sap-blue">3. Logística, SCM & Ventas</Link></li>
              <li><Link href="/mi-aula" className="hover:text-sap-blue">4. MRP, Producción & Consultoría</Link></li>
            </ul>
          </div>

          {/* Col 3: Plataforma */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white mb-4">
              Plataforma y Acreditación
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <li><Link href="/mi-aula" className="hover:text-amber-500 font-bold text-amber-600 dark:text-amber-400">🎓 Mi Aula Virtual</Link></li>
              <li><Link href="/simulador" className="hover:text-sap-blue">🚀 Simulador SAP B1</Link></li>
              <li><Link href="/manuales" className="hover:text-sap-blue">📖 Manuales & Atlas Visual</Link></li>
              <li><Link href="/bolsa-empleo" className="hover:text-sap-blue">💼 Bolsa de Empleo (Job-Ready)</Link></li>
            </ul>
          </div>

          {/* Col 4: Soporte */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white mb-4">
              Admisiones & Soporte
            </h4>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2.5">
              <p>Consultoría Académica y Matrículas:</p>
              <div>
                <ProtectedEmail user="admisiones" domain="sapacademy.es" />
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Acreditación propia de B1 Academy • Atención digital
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
            B1 Academy es independiente y no está afiliada a SAP SE. SAP y SAP Business One son marcas registradas de SAP SE. Los certificados
            de B1 Academy no son certificaciones oficiales de SAP.
          </p>
        </div>
      </div>
    </footer>
  );
}
