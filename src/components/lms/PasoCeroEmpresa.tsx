'use client';

import { useState } from 'react';
import { Building2, BookOpen, MousePointerClick, Award, ArrowRight, Users, Package, Warehouse } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { crearB1Center, EMPRESA_CURSO } from '@/lib/b1-center';

/**
 * Paso 0 de Mi Aula: antes de la primera clase, el estudiante recibe SU empresa del curso, "B1 Center",
 * con clientes, proveedores, artículos, bodegas y stock de prueba. Todas las prácticas del curso ocurren en ella.
 */
export default function PasoCeroEmpresa({ onLista }: { onLista: () => void }) {
  const { currentUser, userProfile } = useAuth();
  const [creando, setCreando] = useState(false);
  const [avance, setAvance] = useState('');
  const [error, setError] = useState('');
  const nombreAlumno = (userProfile?.displayName || userProfile?.name || '').split(' ')[0];

  const crear = async () => {
    if (!currentUser) { setError('Tu sesión no está lista. Recarga la página.'); return; }
    setCreando(true); setError('');
    try { await crearB1Center(currentUser.uid, setAvance); onLista(); }
    catch { setError('No se pudo terminar de crear tu empresa. Revisa tu conexión y vuelve a intentarlo.'); }
    finally { setCreando(false); }
  };

  const pasos = [
    { icon: BookOpen, titulo: 'Escuchas la clase', texto: 'El Tutor IA explica cada lámina con voz.' },
    { icon: MousePointerClick, titulo: 'Practicas en tu B1 Center', texto: 'Registras clientes, artículos y documentos reales en tu empresa.' },
    { icon: Award, titulo: 'Te certificas', texto: 'Apruebas prácticas y evaluación: obtienes tu certificado verificable.' },
  ];
  const contenido = [
    { icon: Users, texto: '5 clientes y 4 proveedores' },
    { icon: Package, texto: '12 artículos con precio y costo' },
    { icon: Warehouse, texto: '2 bodegas con stock inicial' },
  ];

  return (
    <main className="min-h-dvh bg-[#070b14] text-gray-100 flex items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full rounded-3xl border border-amber-500/30 bg-[#0e1620] p-6 sm:p-10 shadow-2xl space-y-7">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Paso 0 · Antes de empezar</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            {nombreAlumno ? `${nombreAlumno}, recibe tu empresa ${EMPRESA_CURSO}` : `Recibe tu empresa ${EMPRESA_CURSO}`}
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            En SAP Business One todo ocurre dentro de una empresa. <strong>{EMPRESA_CURSO}</strong> es tu empresa del curso:
            es solo tuya, viene con datos de prueba y en ella harás todas las prácticas. Lo que registres queda guardado
            y lo usarás en las clases siguientes.
          </p>
        </div>

        <ol className="grid sm:grid-cols-3 gap-3">
          {pasos.map(({ icon: Icono, titulo, texto }, i) => (
            <li key={titulo} className="rounded-2xl bg-black/30 border border-gray-800 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300">
                <span className="h-6 w-6 rounded-lg bg-amber-500/15 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <Icono className="w-4 h-4" aria-hidden="true" />
              </div>
              <p className="text-sm font-bold">{titulo}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{texto}</p>
            </li>
          ))}
        </ol>

        <div className="rounded-2xl border border-gray-800 bg-black/30 p-4 space-y-4">
          <p className="flex items-center gap-2 text-sm font-semibold"><Building2 className="w-4 h-4 text-amber-400" aria-hidden="true" /> Tu {EMPRESA_CURSO} incluye</p>
          <ul className="grid sm:grid-cols-3 gap-2">
            {contenido.map(({ icon: Icono, texto }) => (
              <li key={texto} className="flex items-center gap-2 text-xs text-gray-300"><Icono className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" /> {texto}</li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => void crear()}
            disabled={creando}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold disabled:opacity-60 transition-all active:scale-95"
          >
            {creando ? (avance || 'Preparando…') : <>Crear mi {EMPRESA_CURSO} y empezar <ArrowRight className="w-4 h-4" aria-hidden="true" /></>}
          </button>
          {error && <p role="alert" className="text-xs text-rose-300">{error}</p>}
        </div>
      </div>
    </main>
  );
}
