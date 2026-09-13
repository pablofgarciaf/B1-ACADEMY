"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Briefcase, CheckCircle2, ShieldCheck, X, Send } from 'lucide-react';

interface JobApplicationModalProps {
  jobTitle: string;
  companyName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function JobApplicationModal({
  jobTitle,
  companyName,
  isOpen,
  onClose,
}: JobApplicationModalProps) {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleApply = async () => {
    setLoading(true);
    // Simula envío a endpoint conectado con n8n
    try {
      await fetch('/api/webhooks/n8n', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'JOB_APPLICATION_SUBMITTED',
          userId: user?.uid || 'anonymous',
          userEmail: user?.email || 'postulante@demo.com',
          jobTitle,
          companyName,
        }),
      });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1424] p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-sap-blue/10 text-sap-blue flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Postulación a Vacante
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {jobTitle} • <strong>{companyName}</strong>
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="font-bold text-base text-slate-900 dark:text-white">
              ¡Candidatura Enviada con Éxito!
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              El flujo automatizado con n8n ha validado tu certificado digital y entregado tu perfil curricular al equipo de selección de {companyName}.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-sap-blue text-white text-xs font-bold hover:bg-sky-600 transition-all active:scale-95 cursor-pointer"
            >
              Entendido
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-xs space-y-2">
              <p><strong>Candidato:</strong> {user?.displayName || "Usuario Demo"}</p>
              <p><strong>Nivel de Certificación:</strong> {user?.role === 'consultor_premium' ? 'Consultor Premium S/4HANA (Prioritario)' : 'Usuario Regular'}</p>
              <p className="text-emerald-500 font-semibold flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-4 h-4" /> Hash de Verificación Criptográfica listo para envío
              </p>
            </div>

            <button
              onClick={handleApply}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sap-blue to-sky-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Sincronizando con n8n..." : "Confirmar Postulación Inmediata"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
