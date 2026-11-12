'use client';

import React, { useState } from 'react';
import { Award, CheckCircle2, Lock, Unlock, AlertTriangle } from 'lucide-react';

interface StudentProgressData {
  uid: string;
  name: string;
  email: string;
  role: string;
  modulesProgress?: Record<string, {
    classesCompleted: number;
    practicesCount: number;
    isExamBlocked: boolean;
    attempts: number;
  }>;
}

interface AdminProgressPanelProps {
  students: StudentProgressData[];
  loading: boolean;
  onRefresh: () => void;
  currentUserToken?: string | null;
}

const MODULOS_LABEL: Record<string, string> = {
  'mod-1': 'Módulo 1: Introducción ERP & B1',
  'mod-2': 'Módulo 2: Maestros & Socios',
  'mod-3': 'Módulo 3: Activos Fijos',
  'mod-4': 'Módulo 4: Seguridad & Auditoría',
  'mod-5': 'Módulo 5: RRHH & Empleados',
  'mod-6': 'Módulo 6: Nómina & Ley Laboral',
  'mod-7': 'Módulo 7: Ventas & Clientes',
  'mod-8': 'Módulo 8: Compras & Stock',
  'mod-9': 'Módulo 9: Contabilidad & Finanzas',
};

export default function AdminProgressPanel({ students, loading, onRefresh, currentUserToken }: AdminProgressPanelProps) {
  const [selectedModule, setSelectedModule] = useState<string>('mod-1');
  const [unblockingUid, setUnblockingUid] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const handleUnlockExam = async (uid: string, moduleId: string) => {
    if (!currentUserToken) return;
    setUnblockingUid(uid);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUserToken}`,
        },
        body: JSON.stringify({ uid, moduleId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al desbloquear');
      setMsg({ type: 'ok', text: `Examen de ${moduleId} desbloqueado exitosamente.` });
      onRefresh();
    } catch (err) {
      setMsg({ type: 'err', text: err instanceof Error ? err.message : 'Error al desbloquear' });
    } finally {
      setUnblockingUid(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Selector de módulo para ver avances */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            Filtrar Avance por Módulo:
          </span>
        </div>
        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white cursor-pointer"
        >
          {Object.entries(MODULOS_LABEL).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {msg && (
        <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${msg.type === 'ok' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
          {msg.type === 'ok' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Tabla de Avances */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 font-mono uppercase tracking-wider text-[11px]">
              <th className="p-3 font-semibold">Estudiante</th>
              <th className="p-3 font-semibold">Correo</th>
              <th className="p-3 font-semibold text-center">Clases Completadas</th>
              <th className="p-3 font-semibold text-center">Prácticas Aprobadas</th>
              <th className="p-3 font-semibold text-center">Intentos de Examen</th>
              <th className="p-3 font-semibold text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  Cargando avances en tiempo real desde Firestore...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No hay estudiantes registrados.
                </td>
              </tr>
            ) : (
              students.map((stu) => {
                const prog = stu.modulesProgress?.[selectedModule] || {
                  classesCompleted: 0,
                  practicesCount: 0,
                  isExamBlocked: false,
                  attempts: 0,
                };

                return (
                  <tr key={stu.uid} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {stu.name}
                    </td>
                    <td className="p-3 font-mono text-slate-500 dark:text-slate-400">
                      {stu.email}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-bold font-mono">
                        {prog.classesCompleted} clases
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold font-mono">
                        {prog.practicesCount} prácticas
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold font-mono ${prog.isExamBlocked ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'}`}>
                        {prog.isExamBlocked ? <Lock className="w-3 h-3 text-red-400" /> : null}
                        {prog.attempts} / 3 {prog.isExamBlocked ? '(Bloqueado)' : ''}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {prog.attempts > 0 || prog.isExamBlocked ? (
                        <button
                          type="button"
                          disabled={unblockingUid === stu.uid}
                          onClick={() => handleUnlockExam(stu.uid, selectedModule)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
                        >
                          <Unlock className="w-3 h-3" />
                          <span>{unblockingUid === stu.uid ? 'Desbloqueando...' : 'Desbloquear Examen'}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Sin bloqueo</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
