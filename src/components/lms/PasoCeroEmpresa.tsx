'use client';

import { useState } from 'react';
import { Building2, BookOpen, MousePointerClick, Award, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { initializeCompany } from '@/lib/firestore-company';

/**
 * Paso 0 de Mi Aula: antes de la primera clase, el estudiante crea su empresa de práctica.
 * Todas las prácticas del curso se registran en ella (es la misma empresa del Simulador integral).
 */
export default function PasoCeroEmpresa({ onLista }: { onLista: () => void }) {
  const { currentUser, userProfile } = useAuth();
  const [nombre, setNombre] = useState('');
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState('');
  const nombreAlumno = (userProfile?.displayName || userProfile?.name || '').split(' ')[0];

  const crear = async () => {
    const limpio = nombre.trim();
    if (limpio.length < 2) { setError('Escribe al menos 2 caracteres.'); return; }
    if (!currentUser?.email) { setError('Tu sesión no está lista. Recarga la página.'); return; }
    setCreando(true); setError('');
    try { await initializeCompany(currentUser.uid, currentUser.email, limpio); onLista(); }
    catch { setError('No se pudo crear la empresa. Revisa tu conexión e inténtalo de nuevo.'); }
    finally { setCreando(false); }
  };

  const pasos = [
    { icon: BookOpen, titulo: 'Escuchas la clase', texto: 'El Tutor IA explica cada lámina con voz.' },
    { icon: MousePointerClick, titulo: 'Practicas en SAP', texto: 'Abres la ventana en el menú y registras los datos de la ficha del ejercicio.' },
    { icon: Award, titulo: 'Te certificas', texto: 'Apruebas prácticas y evaluación: obtienes tu certificado verificable.' },
  ];

  return (
    <main className="min-h-dvh bg-[#070b14] text-gray-100 flex items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full rounded-3xl border border-amber-500/30 bg-[#0e1620] p-6 sm:p-10 shadow-2xl space-y-7">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Paso 0 · Antes de empezar</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            {nombreAlumno ? `${nombreAlumno}, crea tu empresa de práctica` : 'Crea tu empresa de práctica'}
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            En SAP Business One todo ocurre dentro de una empresa. La tuya será tu espacio personal: cada práctica que
            hagas en el curso queda registrada en ella. Puedes llamarla como quieras, por ejemplo <strong>Mi Empresa</strong> o <strong>Pruebas</strong>.
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

        <form
          onSubmit={(e) => { e.preventDefault(); void crear(); }}
          className="rounded-2xl border border-gray-800 bg-black/30 p-4 space-y-3"
        >
          <label htmlFor="nombre-empresa" className="flex items-center gap-2 text-sm font-semibold">
            <Building2 className="w-4 h-4 text-amber-400" aria-hidden="true" /> Nombre de tu empresa
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="nombre-empresa"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Mi Empresa"
              maxLength={80}
              autoFocus
              className="flex-1 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={creando}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold disabled:opacity-60 transition-all active:scale-95"
            >
              {creando ? 'Creando…' : <>Crear y empezar <ArrowRight className="w-4 h-4" aria-hidden="true" /></>}
            </button>
          </div>
          {error && <p role="alert" className="text-xs text-rose-300">{error}</p>}
        </form>
      </div>
    </main>
  );
}
