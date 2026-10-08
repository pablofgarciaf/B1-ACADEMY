'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';

export interface SAPLoginScreenProps {
  onLoginSuccess: () => void;
  userEmail?: string;
}

const SESSION_KEY = 'sap_session_active';
const fieldClass = 'h-8 w-full border border-[#999] bg-white px-2 text-[11px] text-[#333] outline-none focus:bg-[#FFFDE7] focus:ring-2 focus:ring-[#1E3A5F] read-only:bg-[#ECE9D8] disabled:opacity-60';

export default function SAPLoginScreen({
  onLoginSuccess,
  userEmail = '',
}: SAPLoginScreenProps) {
  const id = useId();
  const [editedUsername, setEditedUsername] = useState<string | null>(null);
  const username = editedUsername ?? userEmail;
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('es-EC');
  const [checkingSession, setCheckingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submitting = useRef(false);
  const completed = useRef(false);
  const successCallback = useRef(onLoginSuccess);

  useEffect(() => {
    successCallback.current = onLoginSuccess;
  }, [onLoginSuccess]);

  useEffect(() => {
    let hasSession = false;
    try {
      hasSession = sessionStorage.getItem(SESSION_KEY) !== null;
    } catch (storageError: unknown) {
      setError(storageError instanceof Error
        ? 'El navegador bloqueó el almacenamiento de sesión. Habilítalo para continuar.'
        : 'No se pudo consultar la sesión. Inténtalo de nuevo.');
    }
    setCheckingSession(false);
    if (hasSession && !completed.current) {
      completed.current = true;
      successCallback.current();
    }
    return () => {
      if (timer.current !== null) clearTimeout(timer.current);
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (checkingSession || submitting.current || completed.current) return;
    if (!username.trim() || !password.trim()) {
      setError('Completa el nombre de usuario y la contraseña.');
      return;
    }
    setError(null);
    submitting.current = true;
    setIsSubmitting(true);

    timer.current = setTimeout(() => {
      timer.current = null;
      try {
        sessionStorage.setItem(SESSION_KEY, 'true');
      } catch (storageError: unknown) {
        setError(storageError instanceof Error
          ? 'No se pudo guardar la sesión. Habilita el almacenamiento del navegador e inténtalo de nuevo.'
          : 'No se pudo iniciar la sesión. Inténtalo de nuevo.');
        submitting.current = false;
        setIsSubmitting(false);
        return;
      }
      setPassword('');
      submitting.current = false;
      setIsSubmitting(false);
      completed.current = true;
      successCallback.current();
    }, 1500);
  }

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="relative isolate flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#1C1C1C] px-4 py-8 font-[Tahoma,Arial,sans-serif] text-[11px] text-[#333]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22180%22%20height=%22180%22%3E%3Cfilter%20id=%22n%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%22.85%22%20numOctaves=%223%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Cpath%20fill=%22white%22%20filter=%22url(%23n)%22%20d=%22M0%200h180v180H0z%22/%3E%3C/svg%3E')] opacity-[0.06]"
      />
      <div className="w-full max-w-[400px] border border-[#D4D0C8] bg-white p-6 shadow-xl sm:p-8">
        <header className="mb-7 flex items-center gap-3">
          <div aria-hidden="true" className="relative flex h-[50px] w-[50px] shrink-0 items-center justify-center bg-[#1E3A5F] text-[19px] font-bold text-white">
            <span>SAP</span>
            <svg viewBox="0 0 12 12" width="12" height="12" className="absolute bottom-0.5 right-0.5 fill-white">
              <path d="M6 0 12 6 6 12 0 6Z" />
            </svg>
          </div>
          <div>
            <h1 id={`${id}-title`} className="text-[16px] font-bold leading-6 text-[#1E3A5F]">SAP Business One</h1>
            <p className="text-[#666]">Release 10.0 | HANA</p>
          </div>
        </header>

        {checkingSession ? (
          <p role="status" className="flex min-h-[300px] items-center justify-center gap-2 text-[#666]">
            <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-[#D4D0C8] border-t-[#1E3A5F] motion-reduce:animate-none" />
            Comprobando sesión SAP…
          </p>
        ) : (
          <form onSubmit={handleSubmit} aria-busy={isSubmitting} aria-describedby={error ? `${id}-error` : undefined} className="space-y-4">
            <div>
              <label htmlFor={`${id}-server`} className="mb-1 block text-[#666]">Servidor</label>
              <input id={`${id}-server`} type="text" readOnly value="ACADEMIAEC01" className={fieldClass} />
            </div>
            <div>
              <label htmlFor={`${id}-database`} className="mb-1 block text-[#666]">Base de datos empresa</label>
              <input id={`${id}-database`} type="text" readOnly value="SAP_DEMO_EC" className={fieldClass} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor={`${id}-username`} className="block text-[#666]">
                  Nombre de usuario <span aria-hidden="true" className="text-red-700">*</span>
                </label>
                <div className="flex gap-1 text-[10px] text-[#666]">
                  <button type="button" onClick={() => { setEditedUsername(`super.${userEmail}`); if (!password) setPassword('1234'); }} className="text-blue-600 hover:underline">super</button>·
                  <button type="button" onClick={() => { setEditedUsername(`ventas.${userEmail}`); if (!password) setPassword('1234'); }} className="text-blue-600 hover:underline">ventas</button>·
                  <button type="button" onClick={() => { setEditedUsername(`compras.${userEmail}`); if (!password) setPassword('1234'); }} className="text-blue-600 hover:underline">compras</button>·
                  <button type="button" onClick={() => { setEditedUsername(`contabilidad.${userEmail}`); if (!password) setPassword('1234'); }} className="text-blue-600 hover:underline">contabilidad</button>
                </div>
              </div>
              <input
                id={`${id}-username`} name="username" type="text" autoComplete="username"
                required value={username} disabled={isSubmitting}
                onChange={(event) => setEditedUsername(event.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor={`${id}-password`} className="mb-1 block text-[#666]">
                Contraseña <span aria-hidden="true" className="text-red-700">*</span>
              </label>
              <input
                id={`${id}-password`} name="password" type="password" autoComplete="current-password"
                required value={password} disabled={isSubmitting}
                onChange={(event) => setPassword(event.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor={`${id}-language`} className="mb-1 block text-[#666]">Idioma</label>
              <select
                id={`${id}-language`} name="language" value={language} disabled={isSubmitting}
                onChange={(event) => setLanguage(event.target.value)} className={fieldClass}
              >
                <option value="es-EC">Español (Ecuador)</option>
                <option value="en">English</option>
              </select>
            </div>
            {error && <p id={`${id}-error`} role="alert" className="border border-red-200 bg-red-50 p-2 text-red-800">{error}</p>}
            <button
              type="submit" disabled={isSubmitting}
              className="flex h-[38px] w-full items-center justify-center gap-2 bg-[#1E3A5F] text-[13px] text-white transition-colors hover:bg-[#1A5276] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A5F] active:scale-95 disabled:cursor-wait disabled:opacity-60 disabled:active:scale-100 motion-reduce:transform-none motion-reduce:transition-none"
            >
              {isSubmitting && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" />}
              <span role="status" aria-live="polite">{isSubmitting ? 'Iniciando sesión SAP…' : 'Iniciar Sesión SAP'}</span>
            </button>
          </form>
        )}
        <footer className="mt-6 text-center text-[10px] text-[#999]">
          SAP Business One 10.0 | PL 22 | © SAP SE 2024
        </footer>
      </div>
    </section>
  );
}
