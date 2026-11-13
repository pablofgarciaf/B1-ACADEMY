'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface AdminHeaderConfig {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

interface AdminLayoutContextType {
  header: AdminHeaderConfig;
  setHeader: (h: Partial<AdminHeaderConfig>) => void;
}

const defaultHeader: AdminHeaderConfig = {
  title: 'Consola Master de Alumnos & Progreso',
  description: '',
  actions: null,
};

const AdminLayoutContext = createContext<AdminLayoutContextType>({
  header: defaultHeader,
  setHeader: () => {},
});

export function AdminLayoutProvider({ children }: { children: React.ReactNode }) {
  const [header, setHeaderState] = useState<AdminHeaderConfig>(defaultHeader);

  const setHeader = useCallback((h: Partial<AdminHeaderConfig>) => {
    setHeaderState(prev => {
      if (
        prev.title === h.title &&
        prev.description === h.description &&
        prev.actions === h.actions
      ) {
        return prev;
      }
      return { ...prev, ...h };
    });
  }, []);

  const value = useMemo(() => ({ header, setHeader }), [header, setHeader]);

  return (
    <AdminLayoutContext.Provider value={value}>
      {children}
    </AdminLayoutContext.Provider>
  );
}

export function useAdminLayout() {
  return useContext(AdminLayoutContext);
}
