"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { KeyRound, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { userProfile, loading: authLoading, changePassword } = useAuth();

  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Si no hay sesion -> /login. Si ya cambio clave -> destino correcto.
  useEffect(() => {
    if (!authLoading) {
      if (!userProfile) {
        router.replace('/login');
        return;
      }
      if (userProfile.passwordChanged === true) {
        if (userProfile.role === 'super' || userProfile.role === 'admin') {
          router.replace('/admin');
        } else {
          router.replace('/dashboard');
        }
      }
    }
  }, [authLoading, userProfile, router]);

  if (authLoading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#080d1a]">
        <div className="w-10 h-10 rounded-full border-2 border-sap-blue border-t-transparent animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPass.length < 8) {
      setErrorMsg('La contrasena debe tener minimo 8 caracteres.');
      return;
    }
    if (newPass !== confirmPass) {
      setErrorMsg('Las contrasenas no coinciden. Vuelve a escribirlas.');
      return;
    }

    setSubmitting(true);
    const res = await changePassword(newPass);
    setSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Error al cambiar contrasena.');
      return;
    }

    setSuccessMsg('Contrasena creada exitosamente! Redirigiendo...');
    setTimeout(() => {
      if (userProfile.role === 'super' || userProfile.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }, 1200);
  };

  const strength = newPass.length === 0 ? 0 : newPass.length < 8 ? 1 : newPass.length < 12 ? 2 : 3;
  const strengthLabel = ['', 'Muy corta', 'Aceptable', 'Segura'];
  const strengthColor = ['', 'bg-rose-500', 'bg-amber-400', 'bg-emerald-500'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] selection:bg-sap-blue selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sap-blue/10 border border-sap-blue/20 mb-2">
              <Lock className="w-8 h-8 text-sap-blue" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
              Crea tu Contrasena Personal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
              Hola, <strong className="text-slate-700 dark:text-slate-300">{userProfile.name}</strong>. Por seguridad, debes crear una contrasena propia antes de acceder a tu aula virtual.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Cambio obligatorio primer acceso
            </div>
          </div>

          <div className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-xl space-y-6">
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nueva Contrasena
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Minimo 8 caracteres"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sap-blue transition-colors"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {newPass.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3].map((s) => (
                        <div key={s} className={`h-1 flex-1 rounded-full transition-all ${strength >= s ? strengthColor[strength] : 'bg-slate-200 dark:bg-white/10'}`} />
                      ))}
                    </div>
                    <span className={`text-[10px] font-bold ${strength === 1 ? 'text-rose-500' : strength === 2 ? 'text-amber-400' : 'text-emerald-500'}`}>
                      {strengthLabel[strength]}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Confirmar Contrasena
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Repite la contrasena"
                    required
                    className={`w-full pl-10 pr-10 py-3 rounded-xl border bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none transition-colors ${confirmPass && confirmPass !== newPass ? 'border-rose-400 focus:border-rose-400' : 'border-slate-200 dark:border-white/10 focus:border-sap-blue'}`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPass && confirmPass !== newPass && (
                  <p className="text-[10px] text-rose-500 font-semibold">Las contrasenas no coinciden</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting || !newPass || !confirmPass}
                className="w-full py-3.5 px-4 rounded-xl bg-sap-blue hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-md shadow-sap-blue/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {submitting ? (
                  <span>Guardando contrasena...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Activar Contrasena y Continuar</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-[11px] text-slate-400">
              Tu cedula ya no funcionara como contrasena despues de este paso.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
