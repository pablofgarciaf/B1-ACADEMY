"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, UserCheck, X, Sparkles } from 'lucide-react';

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, loginDemo, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1424] p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-sap-blue/10 text-sap-blue flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {user ? "Mi Perfil de Acceso" : "Simulador de Roles de Usuario"}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {user ? "Sesión activa en el ecosistema SAP" : "Selecciona el rol para probar la plataforma"}
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
            <button
              onClick={() => { loginDemo('regular'); onClose(); }}
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] hover:border-sap-blue/50 text-left transition-all active:scale-95 cursor-pointer group"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm text-slate-900 dark:text-white">Acceso Usuario Regular</span>
                <span className="text-xs text-sap-blue font-semibold">149€/mes</span>
              </div>
              <p className="text-xs text-slate-500">Operatividad, catálogo general y 20h de sandbox mensual.</p>
            </button>

            <button
              onClick={() => { loginDemo('consultor_premium'); onClose(); }}
              className="w-full p-4 rounded-2xl border-2 border-sap-blue/60 bg-sap-blue/5 hover:border-sap-blue text-left transition-all active:scale-95 cursor-pointer group relative"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Consultor Premium
                </span>
                <span className="text-xs text-amber-500 font-bold">399€/mes</span>
              </div>
              <p className="text-xs text-slate-500">Certificación avanzada, sandbox ilimitado y bolsa de empleo destacada.</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
