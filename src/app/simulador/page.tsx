'use client';

import React, { useState, useEffect } from 'react';
import SAPDesktopShell from '@/components/desktop/SAPDesktopShell';
import SimuladorLogin from '@/components/simulador/SimuladorLogin';
import SimuladorDashboard from '@/components/simulador/SimuladorDashboard';
import { useAuth } from '@/context/AuthContext';

export default function SimuladorPage() {
  const { userProfile, logout, login } = useAuth();
  const [showSimulator, setShowSimulator] = useState(false);
  const [catalog, setCatalog] = useState<any>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const response = await fetch('/sap_ui_catalog.json');
        const data = await response.json();
        setCatalog(data);
      } catch (error) {
        console.error('Error loading SAP catalog:', error);
      }
    };

    loadCatalog();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setIsLoginLoading(true);
    setLoginError(null);
    try {
      const result = await login(email, password);
      if (!result.success) {
        setLoginError(result.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      setLoginError('Error al iniciar sesión');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowSimulator(false);
  };

  if (!userProfile) {
    return (
      <SimuladorLogin
        onLogin={handleLogin}
        isLoading={isLoginLoading}
        error={loginError}
      />
    );
  }

  if (!showSimulator) {
    const userData = userProfile as any;
    return (
      <SimuladorDashboard
        user={{
          displayName: userProfile.displayName || 'Estudiante',
          email: userProfile.email,
          avatar: userData.avatar,
          company: userData.company,
          level: userData.simuladorLevel || 1,
          xp: userData.simuladorXP || 0,
          totalMissions: 120,
          completedMissions: userData.completedMissions || 0,
        }}
        onStartSimulator={() => setShowSimulator(true)}
        onLogout={handleLogout}
      />
    );
  }

  if (catalog) {
    return (
      <div className="w-full h-screen">
        <SAPDesktopShell catalog={catalog} />
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-blue-300 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white">Cargando Simulador...</p>
      </div>
    </div>
  );
}
