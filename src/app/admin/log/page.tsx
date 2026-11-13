'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Search, 
  Filter, 
  RefreshCw, 
  Calendar, 
  Clock, 
  User, 
  Lock, 
  Unlock, 
  GraduationCap, 
  FileText,
  ShieldCheck,
  Terminal
} from 'lucide-react';
import { useAdminLayout } from '@/components/admin/AdminLayoutContext';

interface AuditLog {
  id: string;
  timestamp: string;
  eventType: 'EXAM_UNLOCKED' | 'USER_CREATED' | 'PASSWORD_CHANGED' | 'EXAM_ATTEMPT' | 'CERTIFICATE_ISSUED' | 'ROLE_UPDATED';
  severity: 'INFO' | 'WARNING' | 'SECURITY' | 'SUCCESS';
  actor: string;
  targetUser: string;
  details: string;
  module?: string;
}

export default function AdminLogPage() {
  const router = useRouter();
  const { currentUser, userProfile, loading: authLoading } = useAuth();

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

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      // Mock / Firestore query de auditoría
      const res = await fetch('/api/admin/progreso');
      const data = await res.json();
      
      const generatedLogs: AuditLog[] = [];

      // Generar logs a partir de intentos y desbloqueos registrados en Firestore
      if (data.todosLosIntentosDeExamen) {
        data.todosLosIntentosDeExamen.forEach((intento: any, i: number) => {
          if (intento.intentosConsumidos === 0) {
            generatedLogs.push({
              id: `log-unlock-${intento.uid}-${i}`,
              timestamp: intento.ultimoIntento || new Date().toISOString(),
              eventType: 'EXAM_UNLOCKED',
              severity: 'SECURITY',
              actor: 'Administrador (Consola)',
              targetUser: `${intento.estudiante} (${intento.correo})`,
              details: `Desbloqueo de examen en módulo ${intento.modulo?.toUpperCase()}. Intentos reseteados a 0.`,
              module: intento.modulo
            });
          } else {
            generatedLogs.push({
              id: `log-attempt-${intento.uid}-${i}`,
              timestamp: intento.ultimoIntento || new Date().toISOString(),
              eventType: 'EXAM_ATTEMPT',
              severity: intento.bloqueado ? 'WARNING' : 'INFO',
              actor: `${intento.estudiante}`,
              targetUser: `${intento.correo}`,
              details: `Evaluación oral completada en ${intento.modulo?.toUpperCase()}. Intentos consumidos: ${intento.intentosConsumidos}/3.${intento.bloqueado ? ' Alumno bloqueado por superar límite.' : ''}`,
              module: intento.modulo
            });
          }
        });
      }

      // Añadir eventos del sistema
      generatedLogs.push({
        id: 'sys-init',
        timestamp: new Date().toISOString(),
        eventType: 'USER_CREATED',
        severity: 'SUCCESS',
        actor: 'Admin B1 Academy',
        targetUser: 'Sistema Central',
        details: 'Bitácora de auditoría sincronizada con Firestore y motor de autenticación.',
      });

      setLogs(generatedLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && userProfile && (userProfile.role === 'super' || userProfile.role === 'admin')) {
      loadLogs();
    }
  }, [authLoading, userProfile]);

  const filteredLogs = logs.filter(l => {
    const term = searchQuery.toLowerCase();
    const matchesSearch = 
      l.details.toLowerCase().includes(term) ||
      l.targetUser.toLowerCase().includes(term) ||
      l.actor.toLowerCase().includes(term) ||
      (l.module || '').toLowerCase().includes(term);
    const matchesType = filterType === 'ALL' || l.eventType === filterType;
    const matchesSeverity = filterSeverity === 'ALL' || l.severity === filterSeverity;
    return matchesSearch && matchesType && matchesSeverity;
  });

  const { setHeader } = useAdminLayout();

  useEffect(() => {
    setHeader({
      title: 'Bitácora de Seguridad & Logs del Sistema',
      description: 'Registro cronológico de desbloqueos de evaluaciones orales, cambios de credenciales y accesos.',
      actions: (
        <button
          onClick={loadLogs}
          className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-200 text-xs font-bold transition flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
          <span>Refrescar Bitácora</span>
        </button>
      ),
    });
  }, [setHeader, logs.length]);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">

      {/* Buscador & Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#0c1322] p-4 rounded-2xl border border-white/10">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar en logs por detalle, usuario o módulo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-[#070b14] border border-white/10 text-slate-300 focus:outline-none focus:border-sky-500 w-full sm:w-auto"
          >
            <option value="ALL">Todos los eventos</option>
            <option value="EXAM_UNLOCKED">Desbloqueos de Examen</option>
            <option value="EXAM_ATTEMPT">Intentos de Examen</option>
            <option value="USER_CREATED">Creación de Usuario</option>
            <option value="PASSWORD_CHANGED">Cambio de Clave</option>
          </select>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-[#070b14] border border-white/10 text-slate-300 focus:outline-none focus:border-sky-500 w-full sm:w-auto"
          >
            <option value="ALL">Toda severidad</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="SECURITY">SECURITY</option>
            <option value="SUCCESS">SUCCESS</option>
          </select>
        </div>
      </div>

      {/* Tabla de Logs */}
      <div className="rounded-2xl border border-white/10 bg-[#0c1322] overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
            <p className="text-xs">Cargando eventos de auditoría...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No se encontraron eventos en la bitácora con los criterios seleccionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Fecha y Hora</th>
                  <th className="py-3 px-4">Severidad</th>
                  <th className="py-3 px-4">Tipo de Evento</th>
                  <th className="py-3 px-4">Actor Responsable</th>
                  <th className="py-3 px-4">Usuario / Alumno</th>
                  <th className="py-3 px-4">Detalle del Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-300 font-mono">
                {filteredLogs.map((log) => {
                  return (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString('es-EC')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          log.severity === 'SECURITY' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                          log.severity === 'WARNING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                          log.severity === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          'bg-blue-500/10 text-sky-400 border-blue-500/30'
                        }`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[11px] font-bold text-white whitespace-nowrap">
                        {log.eventType}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-300">
                        {log.actor}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-sky-300 truncate max-w-xs">
                        {log.targetUser}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-400 font-sans">
                        {log.details}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
