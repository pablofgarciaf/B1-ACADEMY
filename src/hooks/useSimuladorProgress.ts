'use client';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const MODULE_NAMES: { [key: string]: string } = {
  '01_Finanzas': 'Finanzas',
  '02_Ventas': 'Ventas',
  '03_Compras': 'Compras',
  '04_Inventario': 'Inventario',
  '05_Produccion': 'Producción',
};

const TOTAL_SCREENS_PER_MODULE: { [key: string]: number } = {
  Finanzas: 8,
  Ventas: 8,
  Compras: 6,
  Inventario: 6,
  Producción: 6,
};

export function useSimuladorProgress() {
  const { userProfile } = useAuth();

  const addXP = async (xp: number) => {
    if (!userProfile?.email) return;

    try {
      const cleanEmail = userProfile.email.toLowerCase().trim();
      const currentXP = (userProfile.simuladorXP || 0) + xp;
      const newLevel = Math.floor(currentXP / 1000) + 1;

      await updateDoc(doc(db, 'usuarios', cleanEmail), {
        simuladorXP: currentXP,
        simuladorLevel: newLevel,
        updatedAt: new Date().toISOString(),
      });

      if (typeof window !== 'undefined') {
        const session = localStorage.getItem('sap_auth_session');
        if (session) {
          try {
            const parsed = JSON.parse(session);
            localStorage.setItem(
              'sap_auth_session',
              JSON.stringify({
                ...parsed,
                simuladorXP: currentXP,
                simuladorLevel: newLevel,
              })
            );
          } catch {}
        }
      }
    } catch (err) {
      console.error('Error adding XP:', err);
    }
  };

  const completeScreen = async (screenId: string, moduleId: string) => {
    if (!userProfile?.email) return;

    try {
      const cleanEmail = userProfile.email.toLowerCase().trim();
      const moduleName = MODULE_NAMES[moduleId] || 'Unknown';

      const currentProgress = userProfile.moduleProgress || {};
      const moduleData = currentProgress[moduleName] || {
        completed: 0,
        total: TOTAL_SCREENS_PER_MODULE[moduleName] || 8,
        progress: 0,
      };

      const newCompleted = Math.min(moduleData.completed + 1, moduleData.total);
      const newProgress = Math.round((newCompleted / moduleData.total) * 100);

      const updatedProgress = {
        ...currentProgress,
        [moduleName]: {
          completed: newCompleted,
          total: moduleData.total,
          progress: newProgress,
        },
      };

      const currentXP = (userProfile.simuladorXP || 0) + 10;
      const newLevel = Math.floor(currentXP / 1000) + 1;

      await updateDoc(doc(db, 'usuarios', cleanEmail), {
        moduleProgress: updatedProgress,
        simuladorXP: currentXP,
        simuladorLevel: newLevel,
        updatedAt: new Date().toISOString(),
      });

      if (typeof window !== 'undefined') {
        const session = localStorage.getItem('sap_auth_session');
        if (session) {
          try {
            const parsed = JSON.parse(session);
            localStorage.setItem(
              'sap_auth_session',
              JSON.stringify({
                ...parsed,
                moduleProgress: updatedProgress,
                simuladorXP: currentXP,
                simuladorLevel: newLevel,
              })
            );
          } catch {}
        }
      }
    } catch (err) {
      console.error('Error completing screen:', err);
    }
  };

  const completeMission = async (missionId: string, xpReward: number = 50) => {
    if (!userProfile?.email) return;

    try {
      const cleanEmail = userProfile.email.toLowerCase().trim();
      const currentXP = (userProfile.simuladorXP || 0) + xpReward;
      const newLevel = Math.floor(currentXP / 1000) + 1;
      const completedMissions = (userProfile.completedMissions || 0) + 1;

      await updateDoc(doc(db, 'usuarios', cleanEmail), {
        simuladorXP: currentXP,
        simuladorLevel: newLevel,
        completedMissions,
        updatedAt: new Date().toISOString(),
      });

      if (typeof window !== 'undefined') {
        const session = localStorage.getItem('sap_auth_session');
        if (session) {
          try {
            const parsed = JSON.parse(session);
            localStorage.setItem(
              'sap_auth_session',
              JSON.stringify({
                ...parsed,
                simuladorXP: currentXP,
                simuladorLevel: newLevel,
                completedMissions,
              })
            );
          } catch {}
        }
      }
    } catch (err) {
      console.error('Error completing mission:', err);
    }
  };

  return { addXP, completeScreen, completeMission };
}
