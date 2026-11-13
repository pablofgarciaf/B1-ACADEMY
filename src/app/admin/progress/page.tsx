'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  UserPlus, 
  RefreshCw, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Unlock, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Phone, 
  Mail, 
  CreditCard, 
  Eye, 
  Edit3, 
  Calendar, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAdminLayout } from '@/components/admin/AdminLayoutContext';

export interface UserInfo {
  uid: string;
  name: string;
  email: string;
  role: string;
  cedula?: string;
  phone?: string;
  status?: string;
  createdAt?: string;
  assignedTracks?: string[];
}

export interface ProgresoItem {
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

export interface IntentoItem {
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

export default function AdminLuxuryProgressPage() {
  const { createStudent } = useAuth();
  const { setHeader } = useAdminLayout();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    usuariosRegistrados: UserInfo[];
    todosLosIntentosDeExamen: IntentoItem[];
    progresoDetallado: ProgresoItem[];
  } | null>(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'certified' | 'blocked'>('all');
  const [selectedStudent, setSelectedStudent] = useState<UserInfo | null>(null);
  const [desbloqueando, setDesbloqueando] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  // Modal Crear
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCedula, setFormCedula] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  // 1. Cargar datos con caché en memoria local (sessionStorage)
  const cargar = async (forceRefresh = false) => {
    setLoading(true);
    setMensaje(null);

    // Si no es forzado, revisar sessionStorage para rapidez instantánea
    if (!forceRefresh) {
      const cached = sessionStorage.getItem('finix_admin_progress_cache');
      const cachedTime = sessionStorage.getItem('finix_admin_progress_time');
      if (cached && cachedTime && Date.now() - Number(cachedTime) < 60000) {
        try {
          setData(JSON.parse(cached));
          setLoading(false);
          return;
        } catch {
          sessionStorage.removeItem('finix_admin_progress_cache');
        }
      }
    }

    try {
      const res = await fetch(`/api/admin/progreso${forceRefresh ? '?refresh=true' : ''}`);
      const json = await res.json();
      if (json.exito) {
        setData(json);
        sessionStorage.setItem('finix_admin_progress_cache', JSON.stringify(json));
        sessionStorage.setItem('finix_admin_progress_time', String(Date.now()));
      }
    } catch {
      setMensaje('Error de conexión al cargar datos de alumnos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  // Header administrativo
  useEffect(() => {
    setHeader({
      title: 'Consola Master de Alumnos & Progreso',
      description: 'Gestión académica de estudiantes, avance por módulo, calificaciones de certificación y credenciales.',
      actions: (
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Crear Estudiante</span>
          </button>
          <button
            onClick={() => cargar(true)}
            disabled={loading}
            className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 transition-all cursor-pointer active:scale-95"
            title="Refrescar datos (burlar caché)"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      ),
    });
  }, [setHeader, loading]);

  // Lista ordenada alfabéticamente de estudiantes (incluye super y admin si tienen avance o módulos cursados)
  const sortedStudents = useMemo(() => {
    if (!data?.usuariosRegistrados) return [];

    const uidsWithProgressOrAttempts = new Set<string>();
    (data.progresoDetallado || []).forEach(p => {
      if (p.totalClases > 0 || p.totalPracticas > 0) uidsWithProgressOrAttempts.add(p.uid);
    });
    (data.todosLosIntentosDeExamen || []).forEach(i => {
      if (i.aprobado || i.calificacion !== null || i.intentosConsumidos > 0) uidsWithProgressOrAttempts.add(i.uid);
    });

    return [...data.usuariosRegistrados]
      .filter(u => 
        u.role === 'estudiante' || 
        u.role === 'student' || 
        uidsWithProgressOrAttempts.has(u.uid) ||
        u.role === 'super' // Super siempre visible para auditoría y pruebas
      )
      .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
  }, [data]);

  // Filtrado de estudiantes
  const filteredStudents = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return sortedStudents.filter(u => {
      const matchSearch = !term || 
        u.name.toLowerCase().includes(term) || 
        u.email.toLowerCase().includes(term) || 
        (u.cedula && u.cedula.includes(term));
      
      if (!matchSearch) return false;

      if (statusFilter === 'all') return true;

      // Buscar si tiene certificación o bloqueo
      const studentAttempts = (data?.todosLosIntentosDeExamen || []).filter(i => i.uid === u.uid);
      const isCertified = studentAttempts.some(i => i.aprobado === true || (i.calificacion && i.calificacion >= 70));
      const isBlocked = studentAttempts.some(i => i.bloqueado);

      if (statusFilter === 'certified') return isCertified;
      if (statusFilter === 'blocked') return isBlocked;
      if (statusFilter === 'active') return !isBlocked;

      return true;
    });
  }, [sortedStudents, searchTerm, statusFilter, data]);

  // Desbloqueo / Reset
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
        sessionStorage.removeItem('finix_admin_progress_cache');
        await cargar(true);
      } else {
        setMensaje(resp.error || 'No se pudo actualizar.');
      }
    } catch {
      setMensaje('Error de conexión.');
    } finally {
      setDesbloqueando(null);
    }
  };

  // Crear Estudiante
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

    setModalSuccess('Estudiante creado con éxito. Cédula registrada como clave temporal.');
    sessionStorage.removeItem('finix_admin_progress_cache');
    await cargar(true);
    setTimeout(() => {
      setFormName('');
      setFormEmail('');
      setFormCedula('');
      setFormPhone('');
      setShowCreateModal(false);
      setModalSuccess('');
    }, 1200);
  };

  // Métricas rápidas
  const totalStudents = sortedStudents.length;

  return (
    <div className="flex flex-col h-full w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-4">
      {mensaje && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-2xl text-xs text-emerald-400 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{mensaje}</span>
          </div>
          <button onClick={() => setMensaje(null)} className="text-emerald-400 hover:text-white p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. SECCIÓN FIJA SUPERIOR: FILTRO ESBELTO ESTILO FINIX ACADEMY (Azul eléctrico / Blanco en Claro - Negro / Azul en Oscuro) */}
      <div className="shrink-0 bg-white dark:bg-[#0c1322] p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-blue-500/20 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] space-y-3 transition-colors">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Campo de Búsqueda */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-sky-400" size={15} />
            <input
              type="text"
              placeholder="Buscar por Nombre, Correo o Cédula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 h-10 rounded-xl border border-slate-300 dark:border-blue-500/30 bg-slate-50 dark:bg-[#070b14] focus:bg-white dark:focus:bg-[#090e1c] text-slate-900 dark:text-white text-xs font-medium transition-all w-full shadow-inner focus:outline-none focus:border-blue-600 dark:focus:border-sky-400"
            />
          </div>

          {/* Filtro de Estado & Contador */}
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="h-10 px-3.5 rounded-xl border border-slate-300 dark:border-blue-500/30 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-600 dark:focus:border-sky-400 shadow-inner"
            >
              <option value="all">TODOS LOS ESTADOS</option>
              <option value="active">EN FORMACIÓN / ACTIVOS</option>
              <option value="certified">CERTIFICADOS (APROBADO)</option>
              <option value="blocked">BLOQUEADOS (INTENTOS AGOTADOS)</option>
            </select>

            <div className="px-3.5 h-10 rounded-xl bg-blue-50 dark:bg-[#070b14] border border-blue-200/80 dark:border-blue-500/30 flex items-center justify-center text-xs font-mono text-slate-700 dark:text-slate-300">
              Total: <strong className="ml-1.5 text-blue-600 dark:text-sky-400 font-bold">{filteredStudents.length} / {totalStudents}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TABLA CON ENCABEZADOS FIJOS (STICKY) Y DESPLAZAMIENTO VERTICAL */}
      <div className="flex-1 min-h-0 bg-white dark:bg-[#0c1322] rounded-2xl border border-slate-200/90 dark:border-blue-500/20 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden transition-colors">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-blue-600 dark:border-sky-400 border-t-transparent animate-spin" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Cargando directorio de estudiantes...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400 text-xs font-semibold uppercase">
            No se encontraron estudiantes que coincidan con los filtros.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              {/* ENCABEZADOS DE TABLA FIJOS ARRIBA: AZUL ELÉCTRICO CON BLANCO EN CLARO - NEGRO CON AZUL Y CIAN EN OSCURO */}
              <thead className="sticky top-0 z-20 shadow-sm">
                <tr className="text-[11px] font-black uppercase tracking-wider bg-blue-600 text-white dark:bg-[#081026] dark:text-sky-300 border-b border-blue-700 dark:border-blue-500/30 transition-colors">
                  <th className="px-5 py-3.5 text-left">Nombre</th>
                  <th className="px-4 py-3.5 text-left">Cédula</th>
                  <th className="px-4 py-3.5 text-left">Correo</th>
                  <th className="px-4 py-3.5 text-center">Aprobados</th>
                  <th className="px-4 py-3.5 text-center">En Proceso</th>
                  <th className="px-5 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-xs">
                {filteredStudents.map((student) => {
                  const studentProgress = (data?.progresoDetallado || []).filter(p => p.uid === student.uid);
                  const studentAttempts = (data?.todosLosIntentosDeExamen || []).filter(i => i.uid === student.uid);

                  // Módulos Aprobados (evaluación aprobada o calificación >= 70)
                  const aprobadosCount = studentAttempts.filter(
                    att => att.aprobado === true || (att.calificacion !== null && att.calificacion !== undefined && att.calificacion >= 70)
                  ).length;

                  // Módulos en Proceso (progreso con lecciones/prácticas o intentos sin aprobar)
                  const modulosConAvance = new Set(studentProgress.map(p => p.modulo));
                  studentAttempts.forEach(att => {
                    const esAprobado = att.aprobado === true || (att.calificacion !== null && att.calificacion !== undefined && att.calificacion >= 70);
                    if (!esAprobado) modulosConAvance.add(att.modulo);
                  });
                  // Descontar los ya aprobados
                  const enProcesoCount = Math.max(0, modulosConAvance.size - aprobadosCount);

                  const isBlocked = studentAttempts.some(i => i.bloqueado);
                  const isSuper = student.role === 'super';

                  return (
                    <tr 
                      key={student.uid} 
                      className="hover:bg-blue-50/60 dark:hover:bg-[#10182b] transition-colors group cursor-pointer"
                      onClick={() => setSelectedStudent(student)}
                    >
                      {/* Nombre */}
                      <td className="px-5 py-3.5 font-sans">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shadow-md shrink-0 ${
                            isSuper 
                              ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-bold' 
                              : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                          }`}>
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-blue-600 dark:group-hover:text-sky-300 transition-colors flex items-center gap-1.5 truncate">
                            <span>{student.name}</span>
                            {isSuper && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 uppercase">
                                SUPER
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Cédula */}
                      <td className="px-4 py-3.5 font-semibold text-slate-700 dark:text-slate-300">
                        {student.cedula || '—'}
                      </td>

                      {/* Correo */}
                      <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-[200px]">
                        {student.email}
                      </td>

                      {/* Aprobados (número limpio) */}
                      <td className="px-4 py-3.5 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                          aprobadosCount > 0 
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30' 
                            : 'text-slate-400'
                        }`}>
                          {aprobadosCount}
                        </span>
                      </td>

                      {/* En Proceso (número limpio) */}
                      <td className="px-4 py-3.5 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                          enProcesoCount > 0 
                            ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-sky-300 border border-blue-200 dark:border-blue-500/30' 
                            : 'text-slate-400'
                        }`}>
                          {enProcesoCount}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-5 py-3.5 text-right font-sans" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-white/10 transition-colors"
                            title="Ver Ficha y Evaluaciones"
                          >
                            <Eye className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                          </button>

                          {isBlocked && (
                            <button
                              onClick={() => desbloquear(student.uid, 'mod-1')}
                              disabled={desbloqueando === student.uid + 'mod-1'}
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] transition-all flex items-center gap-1 active:scale-95"
                              title="Desbloquear Examen Oral"
                            >
                              <Unlock className="w-3 h-3" />
                              <span>{desbloqueando === student.uid + 'mod-1' ? '...' : 'Desbloquear'}</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. POPUP MODAL BONITO CON FICHA COMPLETA DEL ESTUDIANTE */}
      {selectedStudent && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedStudent(null); }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Cabecera del Popup */}
            <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg">
                  {selectedStudent.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    {selectedStudent.name}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
                      Estudiante
                    </span>
                  </h3>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedStudent.email}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all active:scale-95 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contenido Scrolleable del Popup */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Información Personal y Credenciales */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Cédula
                  </div>
                  <p className="text-xs font-bold font-mono text-slate-800 dark:text-white">
                    {selectedStudent.cedula || 'No registrada'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    <Phone className="w-3.5 h-3.5 text-sky-400" /> Teléfono
                  </div>
                  <p className="text-xs font-bold font-mono text-slate-800 dark:text-white">
                    {selectedStudent.phone || 'No registrado'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" /> Registro
                  </div>
                  <p className="text-[11px] font-bold font-mono text-slate-800 dark:text-white">
                    {selectedStudent.createdAt ? new Date(selectedStudent.createdAt).toLocaleDateString('es-EC') : 'Vigente'}
                  </p>
                </div>
              </div>

              {/* Certificaciones y Exámenes Orales */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Award className="w-4 h-4" /> Evaluaciones Orales y Certificación
                </h4>

                {(() => {
                  const attempts = (data?.todosLosIntentosDeExamen || []).filter(i => i.uid === selectedStudent.uid);
                  if (attempts.length === 0) {
                    return (
                      <p className="text-xs text-slate-400 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/5">
                        El estudiante aún no ha rendido evaluaciones orales de certificación.
                      </p>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {attempts.map((att) => {
                        const esAprobado = att.aprobado === true || (att.calificacion !== null && att.calificacion !== undefined && att.calificacion >= 70);

                        return (
                          <div 
                            key={att.id}
                            className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                              esAprobado
                                ? 'bg-emerald-500/10 border-emerald-500/30'
                                : att.bloqueado
                                ? 'bg-rose-500/10 border-rose-500/30'
                                : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-slate-900 dark:text-white uppercase font-mono">
                                  {att.modulo.toUpperCase()}
                                </span>
                                {esAprobado ? (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    ✓ APROBADO ({att.calificacion ?? 86}/100)
                                  </span>
                                ) : att.bloqueado ? (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                    ⛔ BLOQUEADO (3/3)
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                    EN CURSO ({att.intentosConsumidos}/3)
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                {esAprobado ? `Certificación validada • ${att.ultimoIntento}` : `Último intento: ${att.ultimoIntento}`}
                              </p>
                            </div>

                            <button
                              onClick={() => desbloquear(att.uid, att.modulo)}
                              disabled={desbloqueando === att.uid + att.modulo}
                              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 active:scale-95 shadow cursor-pointer disabled:opacity-50"
                            >
                              <Unlock className="w-3.5 h-3.5" />
                              <span>{desbloqueando === att.uid + att.modulo ? 'Procesando...' : (att.bloqueado ? 'Desbloquear Examen' : 'Resetear Intentos')}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Avance en Laboratorios y Módulos */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Avance por Módulo & Laboratorio
                </h4>

                {(() => {
                  const progressList = (data?.progresoDetallado || []).filter(p => p.uid === selectedStudent.uid);
                  if (progressList.length === 0) {
                    return (
                      <p className="text-xs text-slate-400 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/5">
                        Sin actividad en laboratorios todavía.
                      </p>
                    );
                  }

                  return (
                    <div className="border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 dark:bg-white/5 text-[10px] font-bold text-slate-500 uppercase">
                          <tr>
                            <th className="py-2.5 px-3">Módulo</th>
                            <th className="py-2.5 px-3">Clases</th>
                            <th className="py-2.5 px-3">Prácticas Aprobadas</th>
                            <th className="py-2.5 px-3">Última Conexión</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                          {progressList.map(item => (
                            <tr key={item.id}>
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white uppercase">{item.modulo}</td>
                              <td className="py-2.5 px-3">{item.totalClases} lecciones</td>
                              <td className="py-2.5 px-3 font-bold text-emerald-500">{item.totalPracticas} prácticas</td>
                              <td className="py-2.5 px-3 text-slate-400 font-mono text-[10px]">
                                {item.ultimaActualizacion ? new Date(item.ultimaActualizacion).toLocaleString('es-EC') : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Pie del modal */}
            <div className="p-4 border-t border-slate-100 dark:border-white/10 flex justify-end bg-slate-50/50 dark:bg-white/[0.02]">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white text-xs font-bold hover:bg-slate-300 dark:hover:bg-white/20 transition-all cursor-pointer"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL CREAR ESTUDIANTE */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c1322] border border-white/10 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" /> Matricular Nuevo Estudiante
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white p-1">
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  placeholder="+593 99..."
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 text-xs font-bold hover:bg-white/5 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
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
