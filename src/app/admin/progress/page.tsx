'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { 
  Users, 
  Award, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Search, 
  RefreshCw, 
  BookOpen, 
  LayoutDashboard, 
  Check, 
  ChevronRight,
  TrendingUp,
  Filter,
  GraduationCap
} from 'lucide-react';
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

interface UserInfo {
  uid: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminLuxuryProgressPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    usuariosRegistrados: UserInfo[];
    todosLosIntentosDeExamen: IntentoItem[];
    progresoDetallado: ProgresoItem[];
  } | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentUid, setSelectedStudentUid] = useState<string | null>(null);
  const [desbloqueando, setDesbloqueando] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const cargar = async () => {
    setLoading(true);
    setMensaje(null);
    try {
      const res = await fetch('/api/admin/progreso');
      const json = await res.json();
      setData(json);
      if (!selectedStudentUid && json.usuariosRegistrados?.length > 0) {
        setSelectedStudentUid(json.usuariosRegistrados[0].uid);
      }
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
    setDesbloqueando(uid + modulo);
    setMensaje(null);
    try {
      const res = await fetch('/api/admin/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, moduleId: modulo }),
      });
      const resp = await res.json();
      if (resp.success) {
        setMensaje(`¡Examen de ${modulo.toUpperCase()} desbloqueado exitosamente!`);
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

  // Filtrado de estudiantes
  const filteredUsers = useMemo(() => {
    if (!data?.usuariosRegistrados) return [];
    const term = searchTerm.toLowerCase().trim();
    if (!term) return data.usuariosRegistrados;
    return data.usuariosRegistrados.filter(
      u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
  }, [data, searchTerm]);

  // Estudiante actualmente seleccionado
  const currentStudent = useMemo(() => {
    if (!selectedStudentUid || !data?.usuariosRegistrados) return null;
    return data.usuariosRegistrados.find(u => u.uid === selectedStudentUid) || null;
  }, [data, selectedStudentUid]);

  // Avance del estudiante seleccionado agrupado por módulos
  const studentProgress = useMemo(() => {
    if (!selectedStudentUid || !data?.progresoDetallado) return [];
    return data.progresoDetallado.filter(p => p.uid === selectedStudentUid);
  }, [data, selectedStudentUid]);

  // Intentos de examen del estudiante seleccionado
  const studentAttempts = useMemo(() => {
    if (!selectedStudentUid || !data?.todosLosIntentosDeExamen) return [];
    return data.todosLosIntentosDeExamen.filter(i => i.uid === selectedStudentUid);
  }, [data, selectedStudentUid]);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-16 border-b border-white/10 bg-[#0a101d] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white flex items-center gap-2">
              Consola Master de Alumnos & Progreso
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                PRODUCCIÓN
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Seguimiento individual por estudiante, clases y desbloqueo de exámenes</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={cargar}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-2 active:scale-95 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refrescar</span>
          </button>
          <Link
            href="/admin"
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition active:scale-95"
          >
            Matrículas & Usuarios
          </Link>
        </div>
      </header>

      {mensaje && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-2.5 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{mensaje}</span>
        </div>
      )}

      {/* Main Container con Sidebar Estilo EnergyEngine */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR DE ESTUDIANTES */}
        <aside className="w-80 shrink-0 border-r border-white/10 bg-[#090e1a] flex flex-col">
          {/* Buscador */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar alumno o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>{filteredUsers.length} Alumnos</span>
              <span className="text-[10px] uppercase tracking-wider text-amber-500/80 font-bold">Selecciona uno</span>
            </div>
          </div>

          {/* Lista scrolleable de estudiantes */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {loading && !data ? (
              <div className="p-6 text-center text-xs text-slate-500">Cargando alumnos...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">No se encontraron estudiantes.</div>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = user.uid === selectedStudentUid;
                const hasBlock = data?.todosLosIntentosDeExamen?.some(i => i.uid === user.uid && i.bloqueado);

                return (
                  <button
                    key={user.uid}
                    onClick={() => setSelectedStudentUid(user.uid)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                      isSelected ? 'bg-amber-500/10 border-l-4 border-amber-500' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-500/30">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs font-bold truncate ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                          {user.name}
                        </p>
                        {hasBlock && (
                          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" title="Examen bloqueado" />
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-slate-400 truncate">{user.email}</p>
                    </div>
                    {isSelected && <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 mt-2" />}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* PANEL DERECHO: DETALLE DEL ESTUDIANTE SELECCIONADO */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {!currentStudent ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
              <Users className="w-12 h-12 mb-3 stroke-[1.5]" />
              <p className="text-sm font-semibold">Selecciona un estudiante en el panel izquierdo para ver su avance.</p>
            </div>
          ) : (
            <>
              {/* Tarjeta del Estudiante */}
              <div className="p-6 rounded-3xl bg-[#0c1322] border border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                    {currentStudent.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      {currentStudent.name}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                        {currentStudent.role.toUpperCase()}
                      </span>
                    </h2>
                    <p className="text-xs font-mono text-amber-300">{currentStudent.email}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">UID: {currentStudent.uid}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Módulos con Avance</p>
                    <p className="text-base font-black text-white">{studentProgress.length}</p>
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Total Prácticas</p>
                    <p className="text-base font-black text-emerald-400">
                      {studentProgress.reduce((sum, p) => sum + p.totalPracticas, 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sección de Exámenes y Desbloqueos */}
              <div className="p-6 rounded-3xl bg-[#0c1322] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Award className="w-4 h-4" /> Evaluaciones y Estado de Intentos del Alumno
                  </h3>
                </div>

                {studentAttempts.length === 0 ? (
                  <p className="text-xs text-slate-400 bg-white/5 p-4 rounded-2xl border border-white/5">
                    Este estudiante no tiene intentos registrados ni bloqueos activos. Puede rendir cualquier examen normalmente.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {studentAttempts.map((att) => (
                      <div
                        key={att.id}
                        className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                          att.bloqueado
                            ? 'bg-red-500/10 border-red-500/30'
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-white uppercase">{att.modulo}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Intentos: <strong className={att.bloqueado ? 'text-red-400' : 'text-slate-200'}>{att.intentosConsumidos}/3</strong>
                            {att.bloqueado ? ' • BLOQUEADO' : ''}
                          </p>
                          <p className="text-[10px] text-slate-500">Último: {att.ultimoIntento}</p>
                        </div>

                        <button
                          onClick={() => desbloquear(att.uid, att.modulo)}
                          disabled={desbloqueando === att.uid + att.modulo}
                          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 active:scale-95 shadow cursor-pointer disabled:opacity-50"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>{desbloqueando === att.uid + att.modulo ? 'Desbloqueando...' : 'Desbloquear Examen'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Detalle por Módulos: Clases y Prácticas */}
              <div className="p-6 rounded-3xl bg-[#0c1322] border border-white/10 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Progreso Académico Detallado
                </h3>

                {studentProgress.length === 0 ? (
                  <p className="text-xs text-slate-400 bg-white/5 p-4 rounded-2xl border border-white/5">
                    Aún no hay clases ni prácticas registradas para este estudiante.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 font-mono uppercase text-[10px]">
                          <th className="pb-3">Módulo</th>
                          <th className="pb-3 text-center">Clases Listas</th>
                          <th className="pb-3 text-center">Prácticas Aprobadas</th>
                          <th className="pb-3 text-right">Última Actividad</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {studentProgress.map((p) => (
                          <tr key={p.id}>
                            <td className="py-3 font-bold text-white uppercase">{p.modulo}</td>
                            <td className="py-3 text-center">
                              <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 font-bold font-mono">
                                {p.totalClases} clases
                              </span>
                            </td>
                            <td className="py-3 text-center">
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold font-mono">
                                {p.totalPracticas} prácticas
                              </span>
                            </td>
                            <td className="py-3 text-right text-slate-400 text-[11px]">
                              {p.ultimaActualizacion ? new Date(p.ultimaActualizacion).toLocaleDateString('es-EC') : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
