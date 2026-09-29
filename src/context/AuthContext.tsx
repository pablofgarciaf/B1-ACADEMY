"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updatePassword as fbUpdatePassword,
  sendPasswordResetEmail,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  displayName: string;
  cedula: string;
  role: 'super' | 'admin' | 'docente' | 'estudiante' | 'consultor_premium' | 'regular';
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt?: string;
  assignedTracks?: string[];
  passwordChanged?: boolean;
  sandboxHoursUsed?: number;
  sandboxHoursLimit?: number;
  phone?: string;
  bio?: string;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  user: UserProfile | null; // Alias de retrocompatibilidad
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; role: string; passwordChanged?: boolean; error?: string }>;
  loginDemo: (role?: any) => void;
  logout: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  createStudent: (data: {
    name: string;
    email: string;
    cedula: string;
    role?: 'estudiante' | 'docente' | 'admin';
    assignedTracks?: string[];
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  getAllStudents: () => Promise<UserProfile[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MASTER_SUPERADMIN_EMAIL = 'pablofgarciaf@gmail.com';
const MASTER_SUPERADMIN_PASS = '1721790721';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Escuchar sesión en Firebase Auth y recuperar perfil desde Firestore
  useEffect(() => {
    // 1. Revisar sesión local de respaldo (por si Firebase Auth estuviera en offline o master bypass)
    const localSessionRaw = typeof window !== 'undefined' ? localStorage.getItem('sap_auth_session') : null;
    if (localSessionRaw) {
      try {
        const parsed = JSON.parse(localSessionRaw);
        if (parsed?.email) {
          setUserProfile(parsed);
        }
      } catch (e) {
        console.warn('Session parse error:', e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setCurrentUser(fbUser);
      if (fbUser && fbUser.email) {
        const cleanEmail = fbUser.email.toLowerCase().trim();
        try {
          const docSnap = await getDoc(doc(db, 'usuarios', cleanEmail));
          if (docSnap.exists()) {
            const prof = docSnap.data() as UserProfile;
            setUserProfile(prof);
            localStorage.setItem('sap_auth_session', JSON.stringify(prof));
          } else if (cleanEmail === MASTER_SUPERADMIN_EMAIL) {
            // Perfil de superadmin por defecto si aún no se había guardado
            const superProf: UserProfile = {
              uid: fbUser.uid,
              email: cleanEmail,
              name: 'Pablo F. García',
              displayName: 'Pablo F. García',
              cedula: '1721790721',
              role: 'super',
              status: 'active',
              createdAt: new Date().toISOString(),
              passwordChanged: true,
              assignedTracks: ['sap-b1-core', 'sap-loc-ec', 'b1-nomina', 'b1-rrhh', 'verticales-ecuador'],
            };
            setUserProfile(superProf);
            await setDoc(doc(db, 'usuarios', cleanEmail), superProf, { merge: true });
            localStorage.setItem('sap_auth_session', JSON.stringify(superProf));
          }
        } catch (err) {
          console.warn('Firestore profile fetch notice:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Función de Login robusta (Firebase Auth + Firestore Fallback para Superadmin)
  const login = async (emailInput: string, passInput: string): Promise<{ success: boolean; role: string; passwordChanged?: boolean; error?: string }> => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passInput.trim();

    // 1. Verificación Maestra de Superadmin
    const isMaster = cleanEmail === MASTER_SUPERADMIN_EMAIL && cleanPass === MASTER_SUPERADMIN_PASS;

    if (isMaster) {
      try {
        if (auth) {
          await signInWithEmailAndPassword(auth, cleanEmail, cleanPass).catch(() => {});
        }
      } catch (e) {
        // Ignorar si auth/configuration-not-found está en curso de activación
      }

      // Obtener o crear perfil en Firestore
      let prof: UserProfile;
      try {
        const docSnap = await getDoc(doc(db, 'usuarios', cleanEmail));
        if (docSnap.exists()) {
          prof = docSnap.data() as UserProfile;
        } else {
          prof = {
            uid: 'super-pablo-1721790721',
            email: cleanEmail,
            name: 'Pablo F. García',
            displayName: 'Pablo F. García',
            cedula: '1721790721',
            role: 'super',
            status: 'active',
            createdAt: new Date().toISOString(),
            passwordChanged: true,
            assignedTracks: ['sap-b1-core', 'sap-loc-ec', 'b1-nomina', 'b1-rrhh', 'verticales-ecuador'],
          };
          await setDoc(doc(db, 'usuarios', cleanEmail), prof, { merge: true });
        }
      } catch {
        prof = {
          uid: 'super-pablo-1721790721',
          email: cleanEmail,
          name: 'Pablo F. García',
          displayName: 'Pablo F. García',
          cedula: '1721790721',
          role: 'super',
          status: 'active',
          createdAt: new Date().toISOString(),
          passwordChanged: true,
          assignedTracks: ['sap-b1-core', 'sap-loc-ec', 'b1-nomina', 'b1-rrhh', 'verticales-ecuador'],
        };
      }

      setUserProfile(prof);
      localStorage.setItem('sap_auth_session', JSON.stringify(prof));
      return { success: true, role: 'super', passwordChanged: prof.passwordChanged ?? true };
    }

    // 2. Intento de autenticación normal en Firebase Auth
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      const userDoc = await getDoc(doc(db, 'usuarios', cleanEmail));
      
      if (userDoc.exists()) {
        const prof = userDoc.data() as UserProfile;
        if (prof.status === 'suspended') {
          await signOut(auth);
          return { success: false, role: '', error: 'Esta cuenta ha sido suspendida. Contacta a administración.' };
        }
        setUserProfile(prof);
        localStorage.setItem('sap_auth_session', JSON.stringify(prof));
        return { success: true, role: prof.role, passwordChanged: prof.passwordChanged ?? true };
      } else {
        // Si no existe perfil en Firestore, crearlo como estudiante
        const defaultStudentProf: UserProfile = {
          uid: cred.user.uid,
          email: cleanEmail,
          name: cleanEmail.split('@')[0],
          displayName: cleanEmail.split('@')[0],
          cedula: '',
          role: 'estudiante',
          status: 'active',
          createdAt: new Date().toISOString(),
          passwordChanged: false,
          assignedTracks: ['sap-b1-core'],
        };
        await setDoc(doc(db, 'usuarios', cleanEmail), defaultStudentProf);
        setUserProfile(defaultStudentProf);
        localStorage.setItem('sap_auth_session', JSON.stringify(defaultStudentProf));
        return { success: true, role: 'estudiante', passwordChanged: false };
      }
    } catch (err: any) {
      console.error('[Login Error]', err);
      // Fallback: verificar si existe en Firestore con contraseña igual a cédula
      try {
        const userDoc = await getDoc(doc(db, 'usuarios', cleanEmail));
        if (userDoc.exists()) {
          const prof = userDoc.data() as UserProfile;
          if (prof.cedula && prof.cedula.trim() === cleanPass) {
            setUserProfile(prof);
            localStorage.setItem('sap_auth_session', JSON.stringify(prof));
            return { success: true, role: prof.role, passwordChanged: prof.passwordChanged ?? false };
          }
        }
      } catch (dbErr) {
        console.warn('Firestore fallback notice:', dbErr);
      }

      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        return { success: false, role: '', error: 'Contraseña incorrecta. Recuerda que para estudiantes tu clave inicial es tu número de cédula.' };
      }
      if (err.code === 'auth/user-not-found') {
        return { success: false, role: '', error: 'No existe usuario registrado con este correo.' };
      }
      return { success: false, role: '', error: err.message || 'Error al iniciar sesión' };
    }
  };

  // Función de Logout
  const logout = async () => {
    try {
      if (auth) await signOut(auth);
    } catch (e) {
      console.warn('Signout warning:', e);
    }
    setUserProfile(null);
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sap_auth_session');
    }
  };

  // Creación de nuevos estudiantes por parte del Admin
  const createStudent = async (data: {
    name: string;
    email: string;
    cedula: string;
    role?: 'estudiante' | 'docente' | 'admin';
    assignedTracks?: string[];
    phone?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanCedula = data.cedula.trim();

    if (!cleanEmail || !cleanCedula || !data.name) {
      return { success: false, error: 'Nombre, correo y cédula son campos obligatorios.' };
    }

    try {
      let authUid = `stu-${Date.now()}`;

      // Intentar crear en Firebase Auth con clave = cédula
      try {
        if (auth) {
          const cred = await createUserWithEmailAndPassword(auth, cleanEmail, cleanCedula);
          authUid = cred.user.uid;
        }
      } catch (authErr: any) {
        if (authErr.code === 'auth/email-already-in-use') {
          console.log('El correo ya existe en Auth, actualizando perfil en Firestore...');
        } else {
          console.warn('Auth create notice (continuing in Firestore):', authErr.message);
        }
      }

      const newStudent: UserProfile = {
        uid: authUid,
        email: cleanEmail,
        name: data.name.trim(),
        displayName: data.name.trim(),
        cedula: cleanCedula,
        role: data.role || 'estudiante',
        status: 'active',
        createdAt: new Date().toISOString(),
        passwordChanged: false,
        assignedTracks: data.assignedTracks && data.assignedTracks.length > 0 
          ? data.assignedTracks 
          : ['sap-b1-core'],
        phone: data.phone?.trim() || '',
      };

      await setDoc(doc(db, 'usuarios', cleanEmail), newStudent, { merge: true });
      return { success: true };
    } catch (err: any) {
      console.error('[Create Student Error]', err);
      return { success: false, error: err.message || 'Error al registrar estudiante' };
    }
  };

  // Cambio de contraseña forzado (tras primer login con cédula)
  const changePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: 'No hay sesión activa.' };
    }
    if (newPassword.length < 8) {
      return { success: false, error: 'La nueva contraseña debe tener al menos 8 caracteres.' };
    }
    try {
      await fbUpdatePassword(currentUser, newPassword);
      // Actualizar flag en Firestore
      const emailKey = currentUser.email!.toLowerCase().trim();
      await updateDoc(doc(db, 'usuarios', emailKey), { passwordChanged: true });
      // Actualizar estado local
      setUserProfile((prev) => prev ? { ...prev, passwordChanged: true } : prev);
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('sap_auth_session');
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            localStorage.setItem('sap_auth_session', JSON.stringify({ ...parsed, passwordChanged: true }));
          } catch {}
        }
      }
      return { success: true };
    } catch (err: any) {
      console.error('[Change Password Error]', err);
      if (err.code === 'auth/requires-recent-login') {
        return { success: false, error: 'Por seguridad, cierra sesión, vuelve a ingresar y cambia tu contraseña.' };
      }
      return { success: false, error: err.message || 'Error al cambiar contraseña' };
    }
  };

  // Envío de correo de restablecimiento de contraseña
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Correo requerido.' };
    }
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return { success: true };
    } catch (err: any) {
      console.error('[Reset Password Error]', err);
      return { success: false, error: err.message || 'Error al enviar el correo de recuperación' };
    }
  };

  // Listar todos los estudiantes de la colección 'usuarios'
  const getAllStudents = async (): Promise<UserProfile[]> => {
    try {
      const q = query(collection(db, 'usuarios'));
      const snap = await getDocs(q);
      const list: UserProfile[] = [];
      snap.forEach((d) => {
        list.push(d.data() as UserProfile);
      });
      return list;
    } catch (err) {
      console.error('[Get All Students Error]', err);
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        user: userProfile,
        loading,
        login,
        loginDemo: (role) => {
          login('pablofgarciaf@gmail.com', '1721790721');
        },
        logout,
        changePassword,
        resetPassword,
        createStudent,
        getAllStudents,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
