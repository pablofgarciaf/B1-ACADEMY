"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updatePassword as fbUpdatePassword, type User as FirebaseUser } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

export interface UserProfile {
  uid: string; email: string; name: string; displayName: string; cedula: string;
  role: 'super' | 'admin' | 'docente' | 'estudiante' | 'consultor_premium' | 'regular';
  status: 'active' | 'suspended'; createdAt: string; updatedAt?: string;
  assignedTracks?: string[]; passwordChanged?: boolean; sandboxHoursUsed?: number;
  sandboxHoursLimit?: number; phone?: string; bio?: string; simuladorLevel?: number;
  simuladorXP?: number; completedMissions?: number; avatar?: string; company?: string;
  moduleProgress?: Record<string, { completed: number; total: number; progress: number }>;
}

interface CreateStudentInput {
  name: string; email: string; temporaryPassword: string;
  role?: 'estudiante' | 'docente' | 'admin'; assignedTracks?: string[]; phone?: string;
}

interface AuthContextType {
  currentUser: FirebaseUser | null; userProfile: UserProfile | null; user: UserProfile | null; loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; role: string; passwordChanged?: boolean; error?: string }>;
  logout: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  createStudent: (data: CreateStudentInput) => Promise<{ success: boolean; error?: string }>;
  getAllStudents: () => Promise<UserProfile[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** El servidor respondió y rechazó al usuario (perfil inválido o inactivo): solo este caso cierra la sesión. */
class SessionRejectedError extends Error {}

async function establishServerSession(user: FirebaseUser, forceRefresh = false): Promise<UserProfile> {
  // Sin forzar refresco: Firebase reutiliza el token vigente y solo sale a la red cuando expira.
  const idToken = await user.getIdToken(forceRefresh);
  const response = await fetch('/api/auth/session', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken }),
  });
  if (!response.ok) {
    const result = await response.json().catch(() => null) as { error?: string } | null;
    const message = result?.error ?? 'No se pudo validar el perfil en el servidor.';
    // 401/403 = rechazo real. 5xx = falla temporal del servidor: no expulsar al usuario.
    throw response.status === 401 || response.status === 403 ? new SessionRejectedError(message) : new Error(message);
  }
  return ((await response.json()) as { profile: UserProfile }).profile;
}

function getLoginErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    if (['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found', 'auth/invalid-login-credentials'].includes(error.code)) {
      return 'Firebase rechazó ese correo o contraseña. Revisa que la cuenta exista en este proyecto y que el password sea el recién creado.';
    }
    if (error.code === 'auth/too-many-requests') return 'Firebase bloqueó temporalmente los intentos. Espera unos minutos o restablece la contraseña.';
    if (error.code === 'auth/invalid-api-key') return 'La API key pública de Firebase no corresponde al proyecto.';
  }
  if (error instanceof Error && error.message) return error.message;
  return 'No fue posible iniciar sesión.';
}

async function authenticatedFetch(path: string, init?: RequestInit) {
  const user = auth.currentUser;
  if (!user) throw new Error('No hay sesión autenticada.');
  const idToken = await user.getIdToken();
  return fetch(path, { ...init, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}`, ...init?.headers } });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, async (fbUser) => {
    setCurrentUser(fbUser);
    if (!fbUser) {
      setUserProfile(null);
      await fetch('/api/auth/session', { method: 'DELETE' }).catch(() => undefined);
      setLoading(false);
      return;
    }
    try { setUserProfile(await establishServerSession(fbUser)); }
    catch (error) {
      // Un corte de red no debe expulsar al estudiante: la cookie de sesión del servidor sigue válida.
      if (error instanceof SessionRejectedError) { setUserProfile(null); await signOut(auth).catch(() => undefined); }
      else if (process.env.NODE_ENV === 'development') console.warn('Sesión no revalidada (red):', error);
    }
    finally { setLoading(false); }
  }), []);

  const login = async (emailInput: string, passInput: string) => {
    let credentialUser: FirebaseUser | null = null;
    try {
      const credential = await signInWithEmailAndPassword(auth, emailInput.trim(), passInput);
      credentialUser = credential.user;
      const profile = await establishServerSession(credential.user, true);
      if (profile.status !== 'active') throw new Error('Inactive');
      setCurrentUser(credential.user); setUserProfile(profile);
      return { success: true, role: profile.role, passwordChanged: profile.passwordChanged ?? true };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Login error:', error);
      await signOut(auth).catch(() => undefined);
      return {
        success: false,
        role: '',
        error: credentialUser ? getLoginErrorMessage(error) : getLoginErrorMessage(error),
      };
    }
  };

  const logout = async () => {
    await Promise.all([signOut(auth).catch(() => undefined), fetch('/api/auth/session', { method: 'DELETE' }).catch(() => undefined)]);
    setCurrentUser(null); setUserProfile(null);
  };

  const createStudent = async (data: CreateStudentInput) => {
    try {
      const response = await authenticatedFetch('/api/admin/users', { method: 'POST', body: JSON.stringify(data) });
      const result = (await response.json()) as { error?: string };
      return response.ok ? { success: true } : { success: false, error: result.error ?? 'No fue posible registrar al estudiante.' };
    } catch { return { success: false, error: 'No fue posible registrar al estudiante.' }; }
  };

  const changePassword = async (newPassword: string) => {
    if (!currentUser || newPassword.length < 12) return { success: false, error: 'La nueva contraseña debe tener al menos 12 caracteres.' };
    try {
      await fbUpdatePassword(currentUser, newPassword);
      await updateDoc(doc(db, 'usuarios', currentUser.uid), { passwordChanged: true });
      setUserProfile((previous) => previous ? { ...previous, passwordChanged: true } : previous);
      await establishServerSession(currentUser);
      return { success: true };
    } catch { return { success: false, error: 'No fue posible cambiar la contraseña. Vuelve a iniciar sesión.' }; }
  };

  const resetPassword = async (email: string) => {
    try { await sendPasswordResetEmail(auth, email.trim().toLowerCase()); } catch { /* Respuesta uniforme: evita enumerar cuentas. */ }
    return { success: true };
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      });
      const result = (await response.json()) as { error?: string };
      return response.ok ? { success: true } : { success: false, error: result.error ?? 'No fue posible crear la cuenta.' };
    } catch { return { success: false, error: 'No fue posible crear la cuenta.' }; }
  };

  const getAllStudents = async () => {
    try {
      const response = await authenticatedFetch('/api/admin/users');
      if (!response.ok) return [];
      return ((await response.json()) as { users: UserProfile[] }).users;
    } catch { return []; }
  };

  return <AuthContext.Provider value={{ currentUser, userProfile, user: userProfile, loading, login, logout, changePassword, resetPassword, register, createStudent, getAllStudents }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
