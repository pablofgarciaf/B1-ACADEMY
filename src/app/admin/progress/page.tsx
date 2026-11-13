'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Award, 
  Unlock, 
  CheckCircle2, 
  Search, 
  RefreshCw, 
  BookOpen, 
  GraduationCap,
  UserPlus,
  X,
  Phone,
  Mail,
  KeyRound,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAdminLayout } from '@/components/admin/AdminLayoutContext';

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
  aprobado?: boolean;
  calificacion?: number | null;
  ultimoIntento: string;
}

interface UserInfo {
  uid: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminLuxuryProgressPage() {
  const { createStudent } = useAuth();
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

  // Modal Crear Estudiante
  const [showModal, setShowModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCedula, setFormCedula] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  const cargar = useCallback(async () => {
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
  }, [selectedStudentUid]);

  useEffect(() => {
    cargar();
  }, [cargar]);

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
        setMensaje(`¡Examen de ${modulo.toUpperCase()} habilitado para nuevo intento!`);
        cargar();
      } else {
        setMensaje(resp.error || 'No se pudo actualizar.');
      }
    } catch {
      setMensaje('Error de conexión al procesar.');
    } finally {
      setDesbloqueando(null);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');
    setModalSuccess('');

    const res = await createStudent({
      name: formName,
      email: formEmail,
      temporaryPassword: formCedula,
      phone: formPhone,
      role: 'estudiante',
      assignedTracks: ['finix-erp-core'],
    });

    setModalLoading(false);

    if (!res.success) {
      setModalError(res.error || 'Error al registrar estudiante');
      return;
    }

    setModalSuccess(`Estudiante creado con éxito. Cédula registrada como clave temporal.`);
    await cargar();
    setTimeout(() => {
      setFormName('');
      setFormEmail('');
      setFormCedula('');
      setFormPhone('');
      setShowModal(false);
      setModalSuccess('');
    }, 1500);
  };

  // Filtrado de alumnos
  const filteredUsers = useMemo(() => {
    if (!data?.usuariosRegistrados) return [];
    const term = searchTerm.toLowerCase().trim();
    if (!term) return data.usuariosRegistrados;
    return data.usuariosRegistrados.filter(
      u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
  }, [data, searchTerm]);

  // Alumno seleccionado
  const currentStudent = useMemo(() => {
    if (!selectedStudentUid || !data?.usuariosRegistrados) return null;
    return data.usuariosRegistrados.find(u => u.uid === selectedStudentUid) || null;
  }, [data, selectedStudentUid]);

  // Avance del alumno
  const studentProgress = useMemo(() => {
    if (!selectedStudentUid || !data?.progresoDetallado) return [];
    return data.progresoDetallado.filter(p => p.uid === selectedStudentUid);
  }, [data, selectedStudentUid]);

  // Evaluaciones del alumno
  const studentAttempts = useMemo(() => {
    if (!selectedStudentUid || !data?.todosLosIntentosDeExamen) return [];
    return data.todosLosIntentosDeExamen.filter(i => i.uid === selectedStudentUid);
  }, [data, selectedStudentUid]);

  const { setHeader } = useAdminLayout();

  useEffect(() => {
    setHeader({
      title: 'Consola Master de Alumnos & Progreso',
      description: 'Seguimiento individualizado por estudiante, calificaciones de certificación y desbloqueos.',
      actions: (
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Crear Estudiante</span>
          </button>
          <button
            onClick={cargar}
            disabled={loading}
            className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 transition-all cursor-pointer active:scale-95"
            title="Refrescar datos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      ),
    });
  }, [setHeader, loading, cargar]);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
      {mensaje && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{mensaje}</span>
        </div>
      )}

      {/* 1. BARRA SUPERIOR APPLE: SELECTOR Y FILTRO DE ALUMNOS */}
      <div className="p-4 rounded-3xl bg-[#0c1322] border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar estudiante por nombre o correo electrónico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all"
            />
          </div>

          <div className="text-xs font-mono text-slate-400 shrink-0">
            Estudiantes: <strong className="text-white">{data?.usuariosRegistrados?.length || 0}</strong>
          </div>
        </div>

        {/* Chips Horizontales de Selección Rápida */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filteredUsers.map((user) => {
            const isSelected = user.uid === selectedStudentUid;
            return (
              <button
                key={user.uid}
                onClick={() => setSelectedStudentUid(user.uid)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50 shadow-md shadow-sky-500/20'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  isSelected ? 'bg-sky-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                }`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>{user.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. TARJETA PRINCIPAL DEL ESTUDIANTE SELECCIONADO (CERO UID, DISEÑO APPLE) */}
      {!currentStudent ? (
        <div className="p-12 text-center text-slate-500 bg-[#0c1322] border border-white/10 rounded-3xl">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 stroke-[1.5] text-slate-600" />
          <p className="text-xs font-bold">Selecciona o busca un estudiante para inspeccionar su avance académico.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#0c1322] border border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                {currentStudent.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  {currentStudent.name}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    {currentStudent.role.toUpperCase()}
                  </span>
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-0.5">{currentStudent.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-[10px] uppercase font-bold text-slate-400">Módulos Cursados</p>
                <p className="text-lg font-black text-white">{studentProgress.length}</p>
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-[10px] uppercase font-bold text-slate-400">Prácticas Aprobadas</p>
                <p className="text-lg font-black text-emerald-400">
                  {studentProgress.reduce((sum, p) => sum + p.totalPracticas, 0)}
                </p>
              </div>
            </div>
          </div>

          {/* 3. EVALUACIONES OFICIALES Y ESTADO DE CERTIFICACIÓN */}
          <div className="p-6 rounded-3xl bg-[#0c1322] border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Award className="w-4 h-4" /> Certificaciones y Evaluaciones Orales
            </h3>

            {studentAttempts.length === 0 ? (
              <p className="text-xs text-slate-400 bg-white/5 p-4 rounded-2xl border border-white/5">
                Este alumno aún no ha iniciado evaluaciones orales de certificación.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studentAttempts.map((att) => {
                  const esAprobado = att.aprobado === true || (att.calificacion !== null && att.calificacion !== undefined && att.calificacion >= 80);

                  return (
                    <div
                      key={att.id}
                      className={`p-5 rounded-2xl border flex flex-col justify-between gap-3 ${
                        esAprobado
                          ? 'bg-emerald-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                          : att.bloqueado
                          ? 'bg-rose-500/10 border-rose-500/30'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white uppercase tracking-wider font-mono">
                              {att.modulo.toUpperCase()}
                            </span>
                            {esAprobado ? (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                ✓ CERTIFICACIÓN APROBADA
                              </span>
                            ) : att.bloqueado ? (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                ⛔ INTENTOS AGOTADOS (3/3)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                EN CURSO ({att.intentosConsumidos}/3)
                              </span>
                            )}
                          </div>

                          {esAprobado && (
                            <p className="text-2xl font-black text-emerald-400 font-display mt-2">
                              Calificación: {att.calificacion ?? 86}/100
                            </p>
                          )}

                          <p className="text-[11px] text-slate-400 mt-1">
                            {esAprobado 
                              ? `Aprobado en sesión oral auditada • ${att.ultimoIntento}`
                              : `Último intento: ${att.ultimoIntento}`
                            }
                          </p>
                        </div>

                        {/* Botón de Desbloqueo o Habilitación Voluntaria */}
                        <div>
                          {att.bloqueado ? (
                            <button
                              onClick={() => desbloquear(att.uid, att.modulo)}
                              disabled={desbloqueando === att.uid + att.modulo}
                              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 active:scale-95 shadow cursor-pointer disabled:opacity-50"
                            >
                              <Unlock className="w-3.5 h-3.5" />
                              <span>{desbloqueando === att.uid + att.modulo ? 'Desbloqueando...' : 'Desbloquear Examen'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => desbloquear(att.uid, att.modulo)}
                              disabled={desbloqueando === att.uid + att.modulo}
                              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-medium text-[11px] flex items-center gap-1.5 active:scale-95 cursor-pointer"
                              title="Permitir nuevo intento voluntario"
                            >
                              <RefreshCw className="w-3 h-3 text-sky-400" />
                              <span>Resetear Intentos</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. TABLA DETALLADA DE CLASES Y PRÁCTICAS */}
          <div className="p-6 rounded-3xl bg-[#0c1322] border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Avance de Clases y Prácticas en Laboratorio
            </h3>

            {studentProgress.length === 0 ? (
              <p className="text-xs text-slate-400 bg-white/5 p-4 rounded-2xl border border-white/5">
                Aún no hay avance registrado para este estudiante.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Módulo</th>
                      <th className="py-3 px-4">Clases Completadas</th>
                      <th className="py-3 px-4">Prácticas Aprobadas</th>
                      <th className="py-3 px-4">Última Actividad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {studentProgress.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 font-bold text-white uppercase font-mono">{item.modulo}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-sky-400 border border-blue-500/20 font-mono">
                            {item.totalClases} clases
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                            {item.totalPracticas} prácticas
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {item.ultimaActualizacion ? new Date(item.ultimaActualizacion).toLocaleString('es-EC') : 'Sin registro'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. MODAL CREAR ESTUDIANTE */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c1322] border border-white/10 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-sky-400" /> Matricular Nuevo Estudiante
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}
            {modalSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{modalSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Carlos Andrade"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  placeholder="estudiante@empresa.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Cédula (Contraseña Temporal)</label>
                <input
                  type="text"
                  required
                  placeholder="10 dígitos (ej: 1720345678)"
                  value={formCedula}
                  onChange={(e) => setFormCedula(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  placeholder="+593 99..."
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 text-xs font-bold hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                >
                  {modalLoading ? 'Registrando...' : 'Matricular Estudiante'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
