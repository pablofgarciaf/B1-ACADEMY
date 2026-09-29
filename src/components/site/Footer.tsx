import React from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldCheck } from 'lucide-react';
import { ProtectedEmail } from '@/components/site/ProtectedEmail';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#050811] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sap-blue to-sky-400 p-0.5 shadow-sm">
                <div className="w-full h-full bg-[#0b1320] rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-sky-400" />
                </div>
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white font-display">
                SAP ACADEMY
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Academia Certificada de Capacitación y Consultoría Empresarial. Programa oficial sobre el ecosistema 
              <strong> B1 Academy & SAP Business One Ecuador</strong> con trazabilidad de calificaciones, simulador sandbox y conexión laboral.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white mb-4">
              5 Tracks de Especialización
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <li><Link href="/capacitacion#sap-b1-core" className="hover:text-sap-blue">1. SAP B1 Core & Finanzas NIIF</Link></li>
              <li><Link href="/capacitacion#sap-loc-ec" className="hover:text-sap-blue">2. Localización Ecuador SRI</Link></li>
              <li><Link href="/capacitacion#b1-nom-ec" className="hover:text-sap-blue">3. Nómina HCM & IESS</Link></li>
              <li><Link href="/capacitacion#b1-hcm-talent" className="hover:text-sap-blue">4. Gestión Humana Nine-Box</Link></li>
              <li><Link href="/capacitacion#sap-vert-exp" className="hover:text-sap-blue">5. Verticales Banano, Camarón & WMS</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white mb-4">
              Plataforma y Empleabilidad
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <li><Link href="/dashboard" className="hover:text-sap-blue">Mi Aula Virtual</Link></li>
              <li><Link href="/dashboard/calificaciones" className="hover:text-sap-blue">Boletín Oficial de Notas</Link></li>
              <li><Link href="/bolsa-empleo" className="hover:text-sap-blue">Bolsa de Empleo (Job-Ready)</Link></li>
              <li><Link href="/talento" className="hover:text-sap-blue">Portal para Empresas Contratantes</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white mb-4">
              Admisiones & Soporte
            </h4>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2.5">
              <p>Consultoría B2B y Matrículas:</p>
              <div>
                <ProtectedEmail user="admisiones" domain="sapacademy.es" />
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Ecuador (Quito / Guayaquil) & Conexión Global • Atención 24/7
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SAP Academy Ecuador. Certificación bajo estándares internacionales y SRI/IESS.</p>
          <div className="flex gap-6">
            <Link href="/capacitacion" className="hover:underline">Currículo Oficial</Link>
            <Link href="/dashboard" className="hover:underline">Expediente Alumno</Link>
            <Link href="/bolsa-empleo" className="hover:underline">Vacantes Activas</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
