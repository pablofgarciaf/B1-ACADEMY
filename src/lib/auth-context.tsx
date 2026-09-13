"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginDemo: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  loginDemo: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Lectura inicial de sesión guardada
    const saved = typeof window !== 'undefined' ? localStorage.getItem('sap_user_session') : null;
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing user session", e);
      }
    }
  }, []);

  const loginDemo = (role: UserRole) => {
    const demoUser: UserProfile = {
      uid: `usr_${Math.random().toString(36).substring(7)}`,
      email: role === 'consultor_premium' ? 'consultor.senior@sapacademy.es' : 'alumno.regular@sapacademy.es',
      displayName: role === 'consultor_premium' ? 'Lic. Alejandro Torres (Consultor)' : 'Carlos Ramírez (Alumno Regular)',
      role: role,
      createdAt: new Date().toISOString(),
      specialties: role === 'consultor_premium' ? ['FICO', 'BTP'] : ['MM'],
      sandboxHoursUsed: role === 'consultor_premium' ? 14 : 5,
      sandboxHoursLimit: role === 'consultor_premium' ? 999 : 20,
      isAvailableForHiring: role === 'consultor_premium',
      certifications: role === 'consultor_premium' ? [
        {
          id: 'cert-sap-fico-2026',
          courseId: 'FICO',
          courseName: 'SAP FICO Master Architecture',
          issuedAt: '2026-08-15',
          hashVerification: 'sha256-a9f8b7e6d5c4b3a2',
          verified: true,
        }
      ] : [],
    };

    setUser(demoUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sap_user_session', JSON.stringify(demoUser));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sap_user_session');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
