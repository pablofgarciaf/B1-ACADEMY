'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, LogIn } from 'lucide-react';

interface SimuladorLoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export default function SimuladorLogin({ onLogin, isLoading = false, error }: SimuladorLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isLoading) await onLogin(email, password);
  }
  const inputClass = 'mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-400';
  return <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-950 via-slate-950 to-black p-4 text-white">
    <div className="w-full max-w-md space-y-7">
      <header className="text-center">
        <Link href="/" className="text-sm font-semibold text-sky-300 hover:underline">Finix Academy</Link>
        <h1 className="mt-4 text-3xl font-extrabold">Laboratorio Finix ERP</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">Practica procesos empresariales en un entorno educativo con tu cuenta personal.</p>
      </header>
      <section className="rounded-3xl border border-slate-700 bg-slate-800/50 p-6 shadow-2xl sm:p-8" aria-label="Acceso al simulador">
        <h2 className="flex items-center gap-2 text-xl font-bold"><LogIn className="h-5 w-5" aria-hidden="true" /> Iniciar sesión</h2>
        {error && <p role="alert" className="mt-5 rounded-xl border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <label className="block text-sm font-medium">Correo electrónico<input type="email" autoComplete="username" required value={email} onChange={event => setEmail(event.target.value)} className={inputClass} /></label>
          <label className="block text-sm font-medium">Contraseña<input type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} className={inputClass} /></label>
          <button type="submit" disabled={isLoading} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-bold hover:bg-blue-500 disabled:opacity-60">{isLoading ? 'Ingresando…' : 'Entrar al simulador'}<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
        </form>
        <p className="mt-6 text-sm text-slate-300">¿Necesitas crear una cuenta o recuperar tu contraseña? <Link href="/login?next=%2Fsimulador" className="font-semibold text-sky-300 underline">Ir al acceso del campus</Link></p>
      </section>
      <p className="text-center text-xs leading-relaxed text-slate-400">Simulador educativo. Las operaciones de práctica no se envían a sistemas empresariales ni fiscales reales.</p>
    </div>
  </main>;
}
