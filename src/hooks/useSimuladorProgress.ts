'use client';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export function useSimuladorProgress() {
  const { userProfile } = useAuth();

  const addXP = async (xp: number) => {
    if (!userProfile?.email) return;

    try {
      const cleanEmail = userProfile.email.toLowerCase().trim();
      const currentXP = (userProfile.simuladorXP || 0) + xp;
      const currentLevel = userProfile.simuladorLevel || 1;

      // Calcular nuevo nivel (cada 1000 XP = 1 nivel)
      const newLevel = Math.floor(currentXP / 1000) + 1;

      await updateDoc(doc(db, 'usuarios', cleanEmail), {
        simuladorXP: currentXP,
        simuladorLevel: newLevel,
        updatedAt: new Date().toISOString(),
      });

      // Actualizar localStorage
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

  const completeMission = async (missionId: string, xpReward: number = 50) => {
    if (!userProfile?.email) return;

    try {
      const cleanEmail = userProfile.email.toLowerCase().trim();
      const currentXP = (userProfile.simuladorXP || 0) + xpReward;
      const currentLevel = Math.floor(currentXP / 1000) + 1;
      const completedMissions = (userProfile.completedMissions || 0) + 1;

      await updateDoc(doc(db, 'usuarios', cleanEmail), {
        simuladorXP: currentXP,
        simuladorLevel: currentLevel,
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
                simuladorLevel: currentLevel,
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

  return { addXP, completeMission };
}
