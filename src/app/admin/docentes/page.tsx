'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserProfile } from '@/context/AuthContext';
import { 
  UserCheck, 
  UserPlus, 
  Search, 
  Mail, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  ChevronRight, 
  TrendingUp,
  X,
  Sparkles,
  Award
} from 'lucide-react';
import { useAdminLayout } from '@/components/admin/AdminLayoutContext';

export default function AdminDocentesPage() {
  const router = useRouter();
  const { userProfile, loading: authLoading, createStudent, getAllStudents } = useAuth();

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

  const [docentes, setDocentes] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCedula, setFormCedula] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadDocentes = useCallback(async () => {
    setLoading(true);
    try {
      const all = await getAllStudents();
      setDocentes(all.filter(u => u.role === 'docente'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getAllStudents]);

  useEffect(() => {
    if (!authLoading && userProfile && (userProfile.role === 'super' || userProfile.role === 'admin')) {
      loadDocentes();
    }
  }, [authLoading, userProfile, loadDocentes]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await createStudent({
      name: formName,
      email: formEmail,
      temporaryPassword: formCedula,
      phone: formPhone,
      role: 'docente',
    });

    setSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Error al registrar docente');
      return;
    }

    setSuccessMsg(`Docente ${formEmail} registrado con éxito.`);
    await loadDocentes();
    setTimeout(() => {
      setShowModal(false);
      setSuccessMsg('');
    }, 1500);
  };

  const filtered = docentes.filter(d => {
    const term = searchTerm.toLowerCase();
    return (
      (d.name || '').toLowerCase().includes(term) ||
      (d.email || '').toLowerCase().includes(term) ||
      (d.cedula || '').includes(term)
    );
  });

  const { setHeader } = useAdminLayout();

  useEffect(() => {
    setHeader({
      title: 'Gestión de Profesores y Docentes',
      description: 'Crea y administra instructores autorizados para calificar laboratorios y guiar módulos de especialidad.',
      actions: (
        <button
          onClick={() => {
            setFormName('');
            setFormEmail('');
            setFormCedula('');
            setFormPhone('');
            setErrorMsg('');
            setSuccessMsg('');
            setShowModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Crear Profesor / Docente</span>
        </button>
      ),
    });
  }, [setHeader, docentes.length]);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">

      {/* Buscador */}
      <div className="bg-[#0c1322] p-4 rounded-2xl border border-white/10 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-500 shrink-0" />
        <input
          type="text"
          placeholder="Buscar profesor por nombre, correo o cédula..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs bg-transparent text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Grid de Profesores */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-xs">Cargando docentes...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center border border-white/10 rounded-2xl bg-[#0c1322] text-slate-500 text-xs">
          No hay docentes registrados aún. Puedes crear uno con el botón superior.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => (
            <div key={d.uid} className="p-5 rounded-2xl border border-white/10 bg-[#0c1322] hover:border-emerald-500/30 transition-all space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
                    {(d.name || d.email).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{d.name || 'Sin Nombre'}</h4>
                    <p className="text-[11px] text-slate-400">{d.email}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  DOCENTE
                </span>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-1.5 text-[11px] text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Cédula:</span>
                  <span className="font-mono text-slate-300">{d.cedula || '—'}</span>
                </div>
                {d.phone && (
                  <div className="flex items-center justify-between">
                    <span>Teléfono:</span>
                    <span className="text-slate-300">{d.phone}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Estado:</span>
                  <span className={d.passwordChanged ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {d.passwordChanged ? 'Activo' : 'Clave pendiente'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0c1322] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Registrar Nuevo Docente</h3>
                  <p className="text-[11px] text-slate-400">Asignará rol de profesor</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
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
                  placeholder="Ej. Ing. Carlos Mendoza"
                  className="w-full mt-1 px-3.5 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="profesor@b1academy.com"
                  className="w-full mt-1 px-3.5 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Cédula (Clave Inicial) *</label>
                <input
                  type="text"
                  required
                  value={formCedula}
                  onChange={(e) => setFormCedula(e.target.value)}
                  placeholder="1722334455"
                  className="w-full mt-1 px-3.5 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="+593 99..."
                  className="w-full mt-1 px-3.5 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

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
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-white rounded-xl bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Creando...' : 'Crear Docente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
