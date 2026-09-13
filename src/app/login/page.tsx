"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { 
  KeyRound, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  GraduationCap,
  Lock
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, userProfile } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor completa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Credenciales inválidas.');
        setLoading(false);
        return;
      }

      setSuccessMsg(`¡Bienvenido! Redirigiendo a tu espacio...`);
      setTimeout(() => {
        if (res.role === 'super' || res.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error inesperado al iniciar sesión.');
      setLoading(false);
    }
  };

  const handleQuickSuperadmin = () => {
    setEmail('pablofgarciaf@gmail.com');
    setPassword('1721790721');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] selection:bg-sap-blue selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header del Formulario */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-sap-blue/30 bg-sap-blue/5 text-xs font-bold text-sap-blue">
              <ShieldCheck className="w-3.5 h-3.5" /> Portal Oficial • Ecosistema Heinsohn Ecuador
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
              Iniciar Sesión
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Accede a tu Aula Virtual, expediente académico o panel de administración.
            </p>
          </div>

          {/* Tarjeta de Formulario */}
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@empresa.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sap-blue transition-colors"
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Contraseña / Cédula
                  </label>
                  <span className="text-[11px] text-slate-400">
                    (Estudiantes: tu número de cédula)
                  </span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sap-blue transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Botón Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-sap-blue hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-md shadow-sap-blue/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <span>Autenticando...</span>
                ) : (
                  <>
                    <span>Entrar al Sistema</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Acceso Rápido Superadmin para Testing */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-3 text-center">
              <button
                type="button"
                onClick={handleQuickSuperadmin}
                className="w-full py-2.5 px-3 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-amber-500 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Cargar Credenciales Superadmin (Pablo F. García)
              </button>

              <p className="text-[11px] text-slate-500">
                ¿Eres un estudiante nuevo? Tu cuenta es generada por el administrador con tu cédula.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
