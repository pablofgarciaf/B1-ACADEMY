"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserProfile } from '@/context/AuthContext';
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  ShieldCheck, 
  Search, 
  Filter, 
  Award, 
  BookOpen, 
  Briefcase, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  LogOut, 
  ChevronRight, 
  Layers, 
  Terminal, 
  Sparkles,
  X,
  Phone,
  Mail,
  KeyRound,
  FileCheck,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';
import { TRAINING_TRACKS } from '@/lib/courses-data';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';

export default function AdminStudentsPanel() {
  const router = useRouter();
  const { userProfile, loading: authLoading, logout, createStudent, getAllStudents } = useAuth();

  // ── ROUTE GUARD ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading) {
      if (!userProfile) {
        router.replace('/login');
        return;
      }
      if (userProfile.role !== 'super' && userProfile.role !== 'admin') {
        router.replace('/dashboard');
      }
    }
  }, [authLoading, userProfile, router]);
  // ─────────────────────────────────────────────────────────────────────────────

  const [activeTab, setActiveTab] = useState<'estudiantes' | 'metricas' | 'certificados'>('estudiantes');
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Estado del Modal de Creación de Estudiante
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCedula, setFormCedula] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<'estudiante' | 'docente' | 'admin'>('estudiante');
  const [formTracks, setFormTracks] = useState<string[]>([
    'sap-b1-core',
  ]);

  // Cargar estudiantes desde Firestore
  const loadStudents = useCallback(async () => {
    setLoadingList(true);
    const list = await getAllStudents();
    setStudents(list);
    setLoadingList(false);
  }, [getAllStudents]);

  useEffect(() => {
    if (!authLoading && userProfile && (userProfile.role === 'super' || userProfile.role === 'admin')) {
      loadStudents();
    }
  }, [authLoading, userProfile, loadStudents]);

  // Mostrar pantalla de carga mientras resuelve auth o redirect
  if (authLoading || !userProfile || (userProfile.role !== 'super' && userProfile.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#080d1a]">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <div className="w-10 h-10 rounded-full border-2 border-sap-blue border-t-transparent animate-spin" />
          <p className="text-xs font-mono">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Toggle asignación de track en el modal
  const handleToggleTrack = (trackId: string) => {
    setFormTracks(prev => 
      prev.includes(trackId) ? prev.filter(t => t !== trackId) : [...prev, trackId]
    );
  };

  // Crear estudiante
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');
    setCreateSuccess('');

    const res = await createStudent({
      name: formName,
      email: formEmail,
      temporaryPassword: formCedula,
      cedula: formCedula,
      phone: formPhone,
      role: formRole,
      assignedTracks: formTracks,
    });

    setCreateLoading(false);

    if (!res.success) {
      setCreateError(res.error || 'Error al registrar estudiante');
      return;
    }

    setCreateSuccess(`Usuario ${formEmail} creado. Comparte la clave temporal por un canal seguro.`);
    await loadStudents();
    
    // Resetear formulario
    setTimeout(() => {
      setFormName('');
      setFormEmail('');
      setFormCedula('');
      setFormPhone('');
      setShowCreateModal(false);
      setCreateSuccess('');
    }, 1800);
  };

  // Filtro de estudiantes
  const filteredStudents = students.filter(s => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (s.name || '').toLowerCase().includes(term) ||
      (s.email || '').toLowerCase().includes(term) ||
      (s.cedula || '').includes(term);
    const matchesRole = roleFilter === 'ALL' || s.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Métricas
  const totalStudents = students.filter(s => s.role === 'estudiante').length;
  const totalActivated = students.filter(s => s.passwordChanged === true && s.role === 'estudiante').length;
  const totalSuperAdmins = students.filter(s => s.role === 'super' || s.role === 'admin').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] selection:bg-sap-blue selection:text-white">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Banner Superior & Bienvenida */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-sm">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> 
                {userProfile?.role === 'super' ? 'Consola Superadmin' : 'Panel de Administración'}
              </span>
              <span className="text-xs font-mono text-slate-400">
                • Firestore Colección: <strong className="text-slate-600 dark:text-slate-300">usuarios</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
              Gestión de Estudiantes & Usuarios
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Administra matrículas, credenciales con cédula, seguimiento de avances y habilitación laboral.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-3 rounded-2xl bg-sap-blue hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-lg shadow-sap-blue/25 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Registrar Nuevo Estudiante</span>
            </button>

            <button
              onClick={loadStudents}
              className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
              title="Refrescar datos desde Firestore"
            >
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tarjetas de Métricas Ejecutivas (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-2 shadow-sm">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-xs uppercase tracking-wider font-bold">Total Usuarios</span>
              <Users className="w-4 h-4 text-sap-blue" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white font-display">
              {students.length}
            </p>
            <p className="text-[11px] text-slate-500">
              {totalStudents} Estudiantes • {totalSuperAdmins} Administradores
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-2 shadow-sm">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-xs uppercase tracking-wider font-bold">Estudiantes Activos</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-3xl font-black text-emerald-500 font-display">
              {totalActivated}
            </p>
            <p className="text-[11px] text-slate-500">
              Con contraseña personal creada
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-2 shadow-sm">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-xs uppercase tracking-wider font-bold">Tracks Activos</span>
              <Layers className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-3xl font-black text-purple-500 font-display">
              5
            </p>
            <p className="text-[11px] text-slate-500">
              SAP B1, SRI, Nómina, RRHH, Verticales
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-2 shadow-sm">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-xs uppercase tracking-wider font-bold">Manuales Oficiales</span>
              <BookOpen className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-3xl font-black text-amber-500 font-display">
              83
            </p>
            <p className="text-[11px] text-slate-500">
              Documentos Técnicos Bloques A-K
            </p>
          </div>
        </div>

        {/* Buscador & Filtros de la Tabla */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Input Buscador */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o cédula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sap-blue"
              />
            </div>

            {/* Selector de Rol */}
            <div className="flex gap-2 w-full sm:w-auto">
              {['ALL', 'estudiante', 'docente', 'admin', 'super'].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    roleFilter === role
                      ? 'bg-sap-blue text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  {role === 'ALL' ? 'Todos' : role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tabla de Estudiantes */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 font-mono uppercase tracking-wider text-[11px]">
                  <th className="pb-3 font-semibold">Estudiante / Cédula</th>
                  <th className="pb-3 font-semibold">Correo Electrónico</th>
                  <th className="pb-3 font-semibold">Rol</th>
                  <th className="pb-3 font-semibold">Tracks Asignados</th>
                  <th className="pb-3 font-semibold">Contraseña</th>
                  <th className="pb-3 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {loadingList ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      Cargando estudiantes desde Firestore...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No se encontraron estudiantes con ese criterio.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((stu) => (
                    <tr key={stu.email} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-sap-blue/10 text-sap-blue font-bold flex items-center justify-center text-xs">
                            {(stu.name || stu.displayName || 'E').charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {stu.name || stu.displayName || 'Estudiante'}
                            </p>
                            <p className="text-[11px] font-mono text-slate-400">
                              CI: {stu.cedula || 'Sin cédula'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 font-mono text-slate-600 dark:text-slate-300">
                        {stu.email}
                      </td>

                      <td className="py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          stu.role === 'super'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : stu.role === 'admin'
                            ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                            : 'bg-sap-blue/10 text-sap-blue border border-sap-blue/20'
                        }`}>
                          {stu.role.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(stu.assignedTracks || ['sap-b1-core']).map((tId) => (
                            <span key={tId} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-[10px] font-mono text-slate-600 dark:text-slate-400">
                              {tId}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                          stu.passwordChanged ? 'text-emerald-500' : 'text-amber-500'
                        }`}>
                          {stu.passwordChanged ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Creada
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5" /> Pendiente
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                          stu.status === 'active' ? 'text-emerald-500' : 'text-slate-400'
                        }`}>
                          {stu.status === 'active' ? 'Activo' : 'Suspendido'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL PARA REGISTRAR NUEVO ESTUDIANTE */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-sap-blue" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Registrar Nuevo Estudiante / Usuario
                </h3>
              </div>

              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            {createSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{createSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Ing. Andrea Morales"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sap-blue"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Contraseña temporal segura *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 12 caracteres"
                    minLength={12}
                    value={formCedula}
                    onChange={(e) => setFormCedula(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sap-blue font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="estudiante@empresa.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sap-blue"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="0991234567"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sap-blue"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Rol del Usuario
                </label>
                <select
                  value={formRole}
                  onChange={(e: any) => setFormRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sap-blue cursor-pointer"
                >
                  <option value="estudiante" className="dark:bg-slate-900">Estudiante (Acceso a Clases y Bolsa)</option>
                  <option value="docente" className="dark:bg-slate-900">Docente / Instructor</option>
                  <option value="admin" className="dark:bg-slate-900">Administrador</option>
                </select>
              </div>

              {/* Selección de Tracks asignados */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tracks de Formación Habilitados:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TRAINING_TRACKS.map((track) => (
                    <label
                      key={track.id}
                      className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 cursor-pointer transition-all ${
                        formTracks.includes(track.id)
                          ? 'border-sap-blue bg-sap-blue/5 text-sap-blue font-bold'
                          : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formTracks.includes(track.id)}
                        onChange={() => handleToggleTrack(track.id)}
                        className="rounded text-sap-blue focus:ring-0"
                      />
                      <span className="line-clamp-1">{track.shortTitle}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-6 py-2.5 rounded-xl bg-sap-blue hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-md shadow-sap-blue/20 cursor-pointer disabled:opacity-50"
                >
                  {createLoading ? 'Guardando en Firestore...' : 'Guardar y Activar Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
