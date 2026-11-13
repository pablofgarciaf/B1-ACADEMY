'use client';

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
  MoreVertical, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  Sparkles,
  X,
  Phone,
  Mail,
  KeyRound,
  FileCheck,
  TrendingUp,
  UserCheck,
  Shield,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { SPECIALTY_DIPLOMAS } from '@/lib/curriculum-data';
import { useAdminLayout } from '@/components/admin/AdminLayoutContext';

export default function AdminUsuariosPage() {
  const router = useRouter();
  const { currentUser, userProfile, loading: authLoading, createStudent, getAllStudents } = useAuth();

  // Guard
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

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalRole, setModalRole] = useState<'estudiante' | 'docente' | 'admin'>('estudiante');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCedula, setFormCedula] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formTracks, setFormTracks] = useState<string[]>(['finix-erp-core']);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  const loadData = useCallback(async () => {
    setLoadingList(true);
    try {
      const list = await getAllStudents();
      setUsers(list);
    } catch (e) {
      console.error('Error cargando usuarios:', e);
    } finally {
      setLoadingList(false);
    }
  }, [getAllStudents]);

  useEffect(() => {
    if (!authLoading && userProfile && (userProfile.role === 'super' || userProfile.role === 'admin')) {
      loadData();
    }
  }, [authLoading, userProfile, loadData]);

  const handleOpenModal = (role: 'estudiante' | 'docente' | 'admin') => {
    setModalRole(role);
    setFormName('');
    setFormEmail('');
    setFormCedula('');
    setFormPhone('');
    setFormTracks(role === 'estudiante' ? ['finix-erp-core'] : []);
    setCreateError('');
    setCreateSuccess('');
    setShowModal(true);
  };

  const handleToggleTrack = (trackId: string) => {
    setFormTracks(prev =>
      prev.includes(trackId) ? prev.filter(t => t !== trackId) : [...prev, trackId]
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');
    setCreateSuccess('');

    const res = await createStudent({
      name: formName,
      email: formEmail,
      temporaryPassword: formCedula,
      phone: formPhone,
      role: modalRole,
      assignedTracks: formTracks,
    });

    setCreateLoading(false);

    if (!res.success) {
      setCreateError(res.error || 'Error al registrar usuario');
      return;
    }

    setCreateSuccess(`Usuario ${formEmail} creado exitosamente.`);
    await loadData();
    setTimeout(() => {
      setShowModal(false);
      setCreateSuccess('');
    }, 1500);
  };

  const filteredUsers = users.filter(u => {
    // Solo usuarios del sistema (super y admin), NUNCA estudiantes
    if (u.role !== 'super' && u.role !== 'admin') return false;
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (u.name || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term) ||
      (u.cedula || '').includes(term);
    return matchesSearch;
  });

  const countSuper = users.filter(u => u.role === 'super').length;
  const countAdmin = users.filter(u => u.role === 'admin').length;
  const countTotal = countSuper + countAdmin;

  const { setHeader } = useAdminLayout();

  useEffect(() => {
    setHeader({
      title: 'Usuarios del Sistema & Permisos',
      description: 'Control de cuentas y perfiles de acceso administrativo a la consola de gestión.',
      actions: (
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleOpenModal('admin')}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Shield className="w-4 h-4" />
            <span>+ Crear Administrador</span>
          </button>
          <button
            onClick={loadData}
            className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 transition-all cursor-pointer"
            title="Refrescar lista"
          >
            <TrendingUp className="w-4 h-4" />
          </button>
        </div>
      ),
    });
  }, [setHeader, loadData]);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Tarjetas Métricas con Soporte Dual Claro (Blanco/Glass) y Oscuro (Azul petróleo/Negro) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl border border-amber-500/30 bg-amber-50/80 dark:bg-amber-500/10 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Superadministradores</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-display">{countSuper}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Control total del ecosistema</p>
        </div>

        <div className="p-5 rounded-3xl border border-slate-200/90 dark:border-blue-500/20 bg-white/80 dark:bg-[#0c1322] backdrop-blur-md shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Administradores de Gestión</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-sky-300 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-display">{countAdmin}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Gestión de alumnos y matrículas</p>
        </div>

        <div className="p-5 rounded-3xl border border-slate-200/90 dark:border-blue-500/20 bg-white/80 dark:bg-[#0c1322] backdrop-blur-md shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Usuarios del Sistema</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-sky-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-display">{countTotal}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Operadores con acceso a consola</p>
        </div>
      </div>

      {/* Buscador de Administradores */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-[#0c1322] p-4 rounded-2xl border border-slate-200/90 dark:border-blue-500/20 shadow-sm transition-colors">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-sky-400" />
          <input
            type="text"
            placeholder="Buscar administrador por nombre, correo electrónico o cédula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-sky-400"
          />
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-blue-500/20 bg-white dark:bg-[#0c1322] overflow-hidden shadow-sm transition-colors">
        {loadingList ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            <p className="text-xs">Cargando administradores del sistema...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No se encontraron administradores con los términos de búsqueda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Usuario</th>
                  <th className="py-3 px-4">Cédula / Identificación</th>
                  <th className="py-3 px-4">Rol en Sistema</th>
                  <th className="py-3 px-4">Estado Clave</th>
                  <th className="py-3 px-4">Diplomas</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                {filteredUsers.map((u) => {
                  const isSuper = u.role === 'super';
                  const isAdmin = u.role === 'admin';
                  const isDocente = u.role === 'docente';

                  return (
                    <tr key={u.uid} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSuper ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            isAdmin ? 'bg-blue-500/20 text-sky-400 border border-blue-500/30' :
                            isDocente ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            'bg-slate-800 text-slate-300 border border-white/10'
                          }`}>
                            {(u.name || u.email || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate">{u.name || 'Sin Nombre'}</p>
                            <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                        {u.cedula || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isSuper ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                          isAdmin ? 'bg-blue-500/10 text-sky-400 border-blue-500/30' :
                          isDocente ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          'bg-slate-800/60 text-slate-300 border-slate-700'
                        }`}>
                          {u.role?.toUpperCase() || 'ESTUDIANTE'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {u.passwordChanged ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Clave Activa
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-400">
                            <Clock className="w-3.5 h-3.5" /> Clave Inicial
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] text-slate-400 font-mono">
                          {u.assignedTracks?.length || 0} diplomas
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/progress?uid=${u.uid}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-sky-400 text-[11px] font-bold transition"
                        >
                          Ver Avance <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Creación */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0c1322] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-sky-400 flex items-center justify-center font-bold">
                  {modalRole === 'estudiante' ? <GraduationCap className="w-5 h-5" /> :
                   modalRole === 'docente' ? <UserCheck className="w-5 h-5 text-emerald-400" /> :
                   <Shield className="w-5 h-5 text-amber-400" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {modalRole === 'estudiante' ? 'Registrar Nuevo Estudiante' :
                     modalRole === 'docente' ? 'Registrar Nuevo Docente / Profesor' :
                     'Registrar Nuevo Administrador'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Se activarán las credenciales en la academia
                  </p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            {createSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{createSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full mt-1 px-3.5 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="estudiante@empresa.com"
                  className="w-full mt-1 px-3.5 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Cédula (Clave Inicial) *</label>
                  <input
                    type="text"
                    required
                    value={formCedula}
                    onChange={(e) => setFormCedula(e.target.value)}
                    placeholder="1722334455"
                    className="w-full mt-1 px-3.5 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300">WhatsApp / Teléfono</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+593 99..."
                    className="w-full mt-1 px-3.5 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {modalRole === 'estudiante' && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-300">Diplomas Asignados:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                    {SPECIALTY_DIPLOMAS.map((dip) => (
                      <label
                        key={dip.id}
                        className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 cursor-pointer transition-all ${
                          formTracks.includes(dip.id)
                            ? 'border-sky-500 bg-sky-500/10 text-sky-300 font-bold'
                            : 'border-white/10 text-slate-400 hover:bg-white/5'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formTracks.includes(dip.id)}
                          onChange={() => handleToggleTrack(dip.id)}
                          className="rounded text-sky-500 focus:ring-0"
                        />
                        <span className="line-clamp-1">{dip.role}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white rounded-xl border border-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-5 py-2 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  {createLoading ? 'Creando...' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
