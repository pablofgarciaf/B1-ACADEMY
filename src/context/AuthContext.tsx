"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { auth } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import { onIdTokenChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, type User as FirebaseUser } from 'firebase/auth';

import { POLITICAS_VERSION } from '@/lib/legal-config';

export interface UserProfile {
  uid: string; email: string; name: string; displayName: string; cedula: string;
  role: 'super' | 'admin' | 'docente' | 'estudiante' | 'consultor_premium' | 'regular';
  status: 'active' | 'suspended'; createdAt: string; updatedAt?: string;
  assignedTeacherUids?: string[]; assignedTracks?: string[]; passwordChanged?: boolean; passwordSecurityVersion?: number; sandboxHoursUsed?: number;
  temporaryPasswordExpiresAt?: string;
  /** Server-managed permission; never accepted from a signup form. */
  privateAccountingEnabled?: boolean;
  sandboxHoursLimit?: number; phone?: string; bio?: string; simuladorLevel?: number;
  simuladorXP?: number; completedMissions?: number; avatar?: string; company?: string;
  moduleProgress?: Record<string, { completed: number; total: number; progress: number }>;
}

interface CreateStudentInput {
  name: string; email: string; temporaryPassword: string; cedula?: string;
  role?: 'estudiante' | 'docente' | 'admin'; assignedTracks?: string[]; phone?: string;
}

interface AuthContextType {
  currentUser: FirebaseUser | null; userProfile: UserProfile | null; user: UserProfile | null; loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; role: string; passwordChanged?: boolean; error?: string }>;
  logout: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; password: string; cedula?: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
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
      return 'El correo o la contraseña no son válidos. Revisa los datos o restablece tu contraseña.';
    }
    if (error.code === 'auth/too-many-requests') return 'Firebase bloqueó temporalmente los intentos. Espera unos minutos o restablece la contraseña.';
    if (error.code === 'auth/invalid-api-key') return 'El acceso no está disponible temporalmente. Intenta más tarde.';
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
  // Durante el registro, el perfil aún no existe: no se valida la sesión para no cerrarla a mitad de camino.
  const registeringRef = useRef(false);

  // onIdTokenChanged (no onAuthStateChanged): también se dispara cuando Firebase renueva el token cada hora,
  // así la cookie de sesión del servidor se renueva antes de caducar y el estudiante no es expulsado al login.
  useEffect(() => onIdTokenChanged(auth, async (fbUser) => {
    if (registeringRef.current) return;
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
      return { success: true, role: profile.role, passwordChanged: profile.passwordChanged !== false && profile.passwordSecurityVersion===2 };
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
    if (!currentUser || newPassword.length < 8) return { success: false, error: 'La nueva contraseña debe tener al menos 8 caracteres.' };
    registeringRef.current=true;
    try {
      const response=await authenticatedFetch('/api/auth/password',{method:'POST',body:JSON.stringify({password:newPassword})});
      if(!response.ok) return {success:false,error:(await response.json()).error||'No pudimos cambiar la contraseña.'};
      const credential=await signInWithEmailAndPassword(auth,currentUser.email!,newPassword);
      setCurrentUser(credential.user);
      setUserProfile(await establishServerSession(credential.user,true));
      return { success: true };
    } catch { return { success: false, error: 'No se pudo completar el acceso. Vuelve a iniciar sesión con tu nueva contraseña.' }; }
    finally {registeringRef.current=false;}
  };

  const resetPassword = async (email: string) => {
    try { await sendPasswordResetEmail(auth, email.trim().toLowerCase()); } catch(error) {
      if(!(error instanceof FirebaseError&&error.code==='auth/user-not-found'))return {success:false,error:error instanceof FirebaseError&&error.code==='auth/too-many-requests'?'Espera unos minutos antes de solicitar otro enlace.':'No se pudo enviar el enlace. Revisa tu conexión e intenta de nuevo.'};
    }
    return { success: true };
  };

  /** Public accounts use an independently chosen password, never an identity document. */
  const register = async (data: {name:string;email:string;password:string;cedula?:string;phone?:string}) => {
    try {
      const response=await fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,privacyAccepted:true,policyVersion:POLITICAS_VERSION})});
      const body=await response.json();
      return response.ok ? {success:true} : {success:false,error:body.error||'No se pudo crear la cuenta.'};
    }catch{return {success:false,error:'No hay conexión. Vuelve a intentarlo.'};}
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
