'use client';

import React, { useState, useEffect } from 'react';
import { LogOut, Play, Trophy, Zap, Award, Clock, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface DashboardProps {
  user: {
    displayName: string;
    email: string;
    avatar?: string;
    company?: string;
    level: number;
    xp: number;
    totalMissions: number;
    completedMissions: number;
  };
  onStartSimulator: () => void;
  onLogout: () => void;
}

interface ModuleProgress {
  [key: string]: {
    completed: number;
    total: number;
    progress: number;
  };
}

export default function SimuladorDashboard({
  user,
  onStartSimulator,
  onLogout,
}: DashboardProps) {
  const { userProfile } = useAuth();
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress>({
    Finanzas: { completed: 0, total: 8, progress: 0 },
    Ventas: { completed: 0, total: 8, progress: 0 },
    Inventario: { completed: 0, total: 6, progress: 0 },
    Producción: { completed: 0, total: 6, progress: 0 },
  });

  useEffect(() => {
    // Cargar progreso desde el perfil del usuario
    if (userProfile?.moduleProgress) {
      setModuleProgress(userProfile.moduleProgress);
    }
  }, [userProfile]);

  const xpToNextLevel = (user.level + 1) * 1000;
  const progressPercent = (user.xp % 1000) / 10;
  const completionPercent = (user.completedMissions / user.totalMissions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-xl bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-white">SAP Academy</h1>
              <p className="text-xs text-slate-400">Simulador Virtual</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition"
          >
            <LogOut size={18} />
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome section */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">
                ¡Bienvenido, {user.displayName}! 👋
              </h2>
              <p className="text-slate-400">
                {user.company && `${user.company} • `}
                {user.email}
              </p>
            </div>
          </div>

          {/* Main CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={onStartSimulator}
              className="group relative w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl p-6 shadow-2xl shadow-blue-600/50 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
              <div className="relative flex items-center justify-between">
                <div className="text-left">
                  <p className="text-xs font-semibold text-blue-100 mb-1">Simulador Interactivo</p>
                  <h3 className="text-xl font-bold">Simulador Virtual SAP</h3>
                </div>
                <div className="bg-white/20 backdrop-blur p-3 rounded-xl">
                  <Play size={28} className="text-white fill-white" />
                </div>
              </div>
            </button>

          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Level */}
          <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 transition">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="text-yellow-400" size={24} />
              <span className="text-xs font-semibold text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full">
                Nivel
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{user.level}</p>
            <p className="text-sm text-slate-400 mt-2">Nivel actual</p>
          </div>

          {/* XP */}
          <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/50 transition">
            <div className="flex items-center justify-between mb-4">
              <Zap className="text-purple-400" size={24} />
              <span className="text-xs font-semibold text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full">
                XP
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{user.xp}</p>
            <progress className="kai-progress kai-progress-purple mt-3" value={progressPercent} max="100" aria-label="Progreso de experiencia" />
            <p className="text-xs text-slate-400 mt-2">
              {user.xp % 1000} / 1000 XP para siguiente nivel
            </p>
          </div>

          {/* Missions */}
          <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-green-500/50 transition">
            <div className="flex items-center justify-between mb-4">
              <Target className="text-green-400" size={24} />
              <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
                Misiones
              </span>
            </div>
            <p className="text-3xl font-bold text-white">
              {user.completedMissions}/{user.totalMissions}
            </p>
            <progress className="kai-progress kai-progress-green mt-3" value={completionPercent} max="100" aria-label="Misiones completadas" />
            <p className="text-xs text-slate-400 mt-2">
              {Math.round(completionPercent)}% completado
            </p>
          </div>

          {/* Time */}
          <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition">
            <div className="flex items-center justify-between mb-4">
              <Clock className="text-cyan-400" size={24} />
              <span className="text-xs font-semibold text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full">
                Sesiones
              </span>
            </div>
            <p className="text-3xl font-bold text-white">
              {Math.floor(Math.random() * 50) + 10}h
            </p>
            <p className="text-sm text-slate-400 mt-2">Tiempo de práctica</p>
          </div>
        </div>

        {/* Recent activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Modules progress */}
          <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-blue-400" size={20} />
              <h3 className="text-lg font-bold text-white">Progreso por Módulo</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(moduleProgress).map(([name, data]) => (
                <div key={name}>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-medium text-slate-300">{name}</p>
                    <p className="text-xs text-slate-400">
                      {data.completed}/{data.total} ({data.progress}%)
                    </p>
                  </div>
                  <progress className="kai-progress kai-progress-blue" value={data.progress} max="100" aria-label={`Progreso de ${name}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Award className="text-yellow-400" size={20} />
              <h3 className="text-lg font-bold text-white">Insignias</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { emoji: '🚀', name: 'Rápido' },
                { emoji: '🎯', name: 'Precisión' },
                { emoji: '⭐', name: 'Estrella' },
                { emoji: '🔥', name: 'En fuego' },
                { emoji: '🏆', name: 'Campeón' },
                { emoji: '💎', name: 'Elite' },
              ].map((badge) => (
                <div
                  key={badge.name}
                  className="flex flex-col items-center gap-2 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition cursor-pointer"
                  title={badge.name}
                >
                  <span className="text-2xl">{badge.emoji}</span>
                  <p className="text-xs text-slate-400 text-center">{badge.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
