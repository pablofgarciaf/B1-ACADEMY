"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, X } from 'lucide-react';

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1424] p-8 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <button
          onClick={onClose}
          aria-label="Cerrar ventana de acceso"
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-sap-blue/10 text-sap-blue flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 id="auth-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
            {user ? "Mi Perfil de Acceso" : "Acceso a B1 Academy"}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {user ? "Sesión activa en el ecosistema SAP" : "Inicia sesión con tu cuenta personal"}
          </p>
        </div>

        {user ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/5 text-xs space-y-2">
              <p><strong>Nombre:</strong> {user.displayName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p>
                <strong>Rol Actual:</strong>{" "}
                <span className={user.role === 'consultor_premium' ? 'text-amber-500 font-bold' : 'text-sap-blue font-bold'}>
                  {user.role === 'consultor_premium' ? 'Consultor Premium' : 'Usuario Regular'}
                </span>
              </p>
              <p><strong>Sandbox:</strong> {user.sandboxHoursUsed}h / {user.sandboxHoursLimit}h disponibles</p>
            </div>
            <button
              onClick={() => { logout(); onClose(); }}
              className="w-full py-3 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <Link href="/login" onClick={onClose} className="flex min-h-[44px] w-full items-center justify-center rounded-xl bg-sap-blue px-4 py-3 text-sm font-bold text-white transition-all hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sap-blue active:scale-95">
              Iniciar sesión de forma segura
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
