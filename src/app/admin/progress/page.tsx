'use client';

import React, { useEffect, useState } from 'react';
import { Award, Lock, Unlock, CheckCircle2, AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProgresoItem {
  id: string;
  uid: string;
  estudiante: string;
  correo: string;
  modulo: string;
  totalClases: number;
  clasesCompletadas: string[];
  totalPracticas: number;
  practicasAprobadas: string[];
  ultimaActualizacion: string | null;
}

interface IntentoItem {
  id: string;
  uid: string;
  estudiante: string;
  correo: string;
  modulo: string;
  intentosConsumidos: number;
  bloqueado: boolean;
  ultimoIntento: string;
}

export default function AdminProgressPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    alumnosConIntentosBloqueados: IntentoItem[];
    todosLosIntentosDeExamen: IntentoItem[];
    progresoDetallado: ProgresoItem[];
  } | null>(null);
  const [desbloqueando, setDesbloqueando] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const cargar = async () => {
    setLoading(true);
    setMensaje(null);
    try {
      const res = await fetch('/api/admin/progreso');
      const json = await res.json();
      setData(json);
    } catch {
      setMensaje('Error al consultar datos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const desbloquear = async (uid: string, modulo: string) => {
    setDesbloqueando(uid);
    setMensaje(null);
    try {
      const res = await fetch('/api/admin/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, moduleId: modulo }),
      });
      const resp = await res.json();
      if (resp.success) {
        setMensaje(`¡Examen de ${modulo} desbloqueado exitosamente!`);
        cargar();
      } else {
        setMensaje(resp.error || 'No se pudo desbloquear.');
      }
    } catch {
      setMensaje('Error de conexión al desbloquear.');
    } finally {
      setDesbloqueando(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Cabecera */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/admin" className="text-gray-400 hover:text-white flex items-center gap-1 text-xs">
                <ArrowLeft className="w-3.5 h-3.5" /> Ir al Panel Admin
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" />
              Avance Real de Estudiantes y Desbloqueo de Evaluaciones
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Traduce automáticamente los UIDs de Firebase a Nombre y Correo real para que sepas exactamente a quién desbloquear.
            </p>
          </div>

          <button
            onClick={cargar}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 active:scale-95 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refrescar Datos</span>
          </button>
        </div>

        {mensaje && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{mensaje}</span>
          </div>
        )}

        {/* Sección: Alumnos con Intentos o Bloqueados */}
        <div className="rounded-2xl border border-red-500/30 bg-[#0c1220] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Alumnos con Intentos Consumidos / Examen Bloqueado
            </h2>
            <span className="text-xs text-gray-400 font-mono">
              {data?.todosLosIntentosDeExamen?.length || 0} registros encontrados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 font-mono uppercase text-[10px]">
                  <th className="p-3">Estudiante</th>
                  <th className="p-3">Correo Real</th>
                  <th className="p-3 text-center">Módulo</th>
                  <th className="p-3 text-center">Intentos</th>
                  <th className="p-3">Último Intento</th>
                  <th className="p-3 text-right">Acción de Desbloqueo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {loading ? (
                  <tr><td colSpan={6} className="p-6 text-center text-gray-500">Cargando intentos de Firebase...</td></tr>
                ) : !data?.todosLosIntentosDeExamen || data.todosLosIntentosDeExamen.length === 0 ? (
                  <tr><td colSpan={6} className="p-6 text-center text-emerald-400">¡Nadie tiene intentos bloqueados! Todos los alumnos pueden rendir normalmente.</td></tr>
                ) : (
                  data.todosLosIntentosDeExamen.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02]">
                      <td className="p-3 font-bold text-white">{item.estudiante}</td>
                      <td className="p-3 font-mono text-amber-300">{item.correo}</td>
                      <td className="p-3 text-center font-bold text-blue-400 uppercase">{item.modulo}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded font-bold font-mono ${item.bloqueado ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-gray-800 text-gray-300'}`}>
                          {item.intentosConsumidos} / 3 {item.bloqueado ? 'BLOQUEADO' : ''}
                        </span>
                      </td>
                      <td className="p-3 text-gray-400 text-[11px]">{item.ultimoIntento}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => desbloquear(item.uid, item.modulo)}
                          disabled={desbloqueando === item.uid}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 active:scale-95 shadow cursor-pointer disabled:opacity-50"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>{desbloqueando === item.uid ? 'Desbloqueando...' : 'Desbloquear Ahora'}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sección: Progreso General de Clases y Prácticas */}
        <div className="rounded-2xl border border-gray-800 bg-[#0c1220] p-5 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Progreso de Clases y Prácticas Guardadas
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 font-mono uppercase text-[10px]">
                  <th className="p-3">Estudiante</th>
                  <th className="p-3">Correo</th>
                  <th className="p-3 text-center">Módulo</th>
                  <th className="p-3 text-center">Clases Listas</th>
                  <th className="p-3 text-center">Prácticas Aprobadas</th>
                  <th className="p-3">Último Avance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {loading ? (
                  <tr><td colSpan={6} className="p-6 text-center text-gray-500">Cargando registros...</td></tr>
                ) : !data?.progresoDetallado || data.progresoDetallado.length === 0 ? (
                  <tr><td colSpan={6} className="p-6 text-center text-gray-500">Aún no hay avances registrados.</td></tr>
                ) : (
                  data.progresoDetallado.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02]">
                      <td className="p-3 font-bold text-white">{p.estudiante}</td>
                      <td className="p-3 font-mono text-gray-300">{p.correo}</td>
                      <td className="p-3 text-center font-bold text-blue-400 uppercase">{p.modulo}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold font-mono">
                          {p.totalClases} clases
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono">
                          {p.totalPracticas} prácticas
                        </span>
                      </td>
                      <td className="p-3 text-gray-400 text-[11px]">
                        {p.ultimaActualizacion ? new Date(p.ultimaActualizacion).toLocaleString('es-EC') : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
