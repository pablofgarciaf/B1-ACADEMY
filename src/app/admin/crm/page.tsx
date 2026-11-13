'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Target, 
  MessageCircle, 
  Video, 
  TrendingUp, 
  Users, 
  Building2, 
  Phone, 
  Mail, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  Search, 
  RefreshCw,
  Plus,
  Send,
  Sparkles,
  BarChart3,
  Calendar
} from 'lucide-react';
import { useAdminLayout } from '@/components/admin/AdminLayoutContext';

interface BusinessLead {
  id: string;
  company: string;
  name: string;
  email: string;
  phone: string;
  teamSize?: string;
  needs?: string;
  status: 'new' | 'in_review' | 'contacted' | 'closed';
  createdAt: string;
  source?: string;
}

export default function AdminCrmPage() {
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

  const [leads, setLeads] = useState<BusinessLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Métricas de Clics y Canales (WhatsApp, TikTok, Directo) - Reales
  const [metrics, setMetrics] = useState({
    whatsappClicksTotal: 0,
    whatsappClicksToday: 0,
    tiktokVisitorsTotal: 0,
    tiktokLeads: 0,
    directVisitors: 0,
  });

  const loadLeads = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch('/api/admin/business-leads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (e) {
      console.error('Error cargando leads:', e);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!authLoading && userProfile && (userProfile.role === 'super' || userProfile.role === 'admin')) {
      loadLeads();
    }
  }, [authLoading, userProfile, loadLeads]);

  const handleUpdateStatus = async (id: string, newStatus: 'new' | 'in_review' | 'contacted' | 'closed') => {
    if (!currentUser) return;
    setUpdatingId(id);
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch('/api/admin/business-leads', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = leads.filter(l => {
    const term = searchQuery.toLowerCase();
    const matchesSearch = 
      (l.name || '').toLowerCase().includes(term) ||
      (l.company || '').toLowerCase().includes(term) ||
      (l.email || '').toLowerCase().includes(term) ||
      (l.phone || '').includes(term);
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const { setHeader } = useAdminLayout();

  useEffect(() => {
    setHeader({
      title: 'CRM Leads & Marcador de Clics',
      description: 'Seguimiento de prospectos corporativos, solicitudes de capacitación y analítica de clics (WhatsApp & TikTok).',
      actions: (
        <button
          onClick={loadLeads}
          className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-200 text-xs font-bold transition flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Refrescar CRM</span>
        </button>
      ),
    });
  }, [setHeader, leads.length, loadLeads]);

  const countNew = leads.filter(l => l.status === 'new').length;
  const countInReview = leads.filter(l => l.status === 'in_review').length;
  const countContacted = leads.filter(l => l.status === 'contacted').length;
  const countClosed = leads.filter(l => l.status === 'closed').length;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Marcador de Clics: WhatsApp, TikTok y Conversiones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Clics WhatsApp */}
        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4" /> Clics a WhatsApp
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
              +{metrics.whatsappClicksToday} hoy
            </span>
          </div>
          <p className="text-3xl font-black text-white font-display">{metrics.whatsappClicksTotal}</p>
          <p className="text-[11px] text-slate-400">
            Contactos directos iniciados desde la web pública y landing de cursos.
          </p>
        </div>

        {/* Tráfico TikTok */}
        <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <Video className="w-4 h-4" /> Tráfico TikTok
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300">
              Campaña Activa
            </span>
          </div>
          <p className="text-3xl font-black text-white font-display">{metrics.tiktokVisitorsTotal}</p>
          <p className="text-[11px] text-slate-400">
            Visitantes provenientes de videos de demostración del simulador en TikTok.
          </p>
        </div>

        {/* Prospectos Nuevos */}
        <div className="p-5 rounded-2xl border border-sky-500/30 bg-sky-500/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Solicitudes Nuevas
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300">
              Por Contactar
            </span>
          </div>
          <p className="text-3xl font-black text-white font-display">{countNew}</p>
          <p className="text-[11px] text-slate-400">
            Formularios de empresas y profesionales esperando propuesta.
          </p>
        </div>

        {/* Leads Cerrados / Matriculados */}
        <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> Matriculados
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300">
              Cierres Exitosos
            </span>
          </div>
          <p className="text-3xl font-black text-white font-display">{countClosed}</p>
          <p className="text-[11px] text-slate-400">
            Empresas y alumnos convertidos con matrícula en la academia.
          </p>
        </div>
      </div>

      {/* Buscador & Filtros de Leads */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#0c1322] p-4 rounded-2xl border border-white/10">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nombre, empresa, email o teléfono..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-[#070b14] border border-white/10 text-slate-300 focus:outline-none focus:border-sky-500 w-full sm:w-auto"
          >
            <option value="ALL">Todos los estados</option>
            <option value="new">Nuevos ({countNew})</option>
            <option value="in_review">En Revisión ({countInReview})</option>
            <option value="contacted">Contactados ({countContacted})</option>
            <option value="closed">Cerrados ({countClosed})</option>
          </select>
        </div>
      </div>

      {/* Tabla de Leads */}
      <div className="rounded-2xl border border-white/10 bg-[#0c1322] overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
            <p className="text-xs">Cargando solicitudes comerciales...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No hay solicitudes que coincidan con la búsqueda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Prospecto / Empresa</th>
                  <th className="py-3 px-4">Contacto</th>
                  <th className="py-3 px-4">Equipo</th>
                  <th className="py-3 px-4">Requerimiento</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acción Rápida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                {filtered.map((lead) => {
                  const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
                  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(lead.name)},%20te%20escribimos%20de%20B1%20Academy%20respecto%20a%20tu%20solicitud%20de%20capacitaci%C3%B3n.` : null;

                  return (
                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{lead.name}</p>
                          <p className="text-[11px] text-sky-400 font-medium truncate flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> {lead.company || 'Particular / Individual'}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 space-y-0.5 text-[11px]">
                        <p className="text-slate-300 flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-slate-500" /> {lead.email}
                        </p>
                        <p className="text-slate-400 font-mono flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-500" /> {lead.phone || '—'}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-400">
                        {lead.teamSize || '1 persona'}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <p className="text-[11px] text-slate-400 line-clamp-2">
                          {lead.needs || 'Interés general en capacitación SAP Business One.'}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={lead.status}
                          disabled={updatingId === lead.id}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value as any)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                            lead.status === 'new' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' :
                            lead.status === 'in_review' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                            lead.status === 'contacted' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' :
                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          <option value="new" className="bg-[#0c1322] text-sky-400">Nuevo</option>
                          <option value="in_review" className="bg-[#0c1322] text-amber-400">En Revisión</option>
                          <option value="contacted" className="bg-[#0c1322] text-indigo-400">Contactado</option>
                          <option value="closed" className="bg-[#0c1322] text-emerald-400">Cerrado / Matriculado</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {waUrl ? (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold transition active:scale-95"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-500">—</span>
                        )}
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
