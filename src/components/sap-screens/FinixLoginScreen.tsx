'use client';

import { useId, useState, useRef } from 'react';

export interface FinixLoginScreenProps {
  userEmail?: string;
  defaultRole?: string;
  onSuccess?: () => void;
  onLoginSuccess?: () => void;
}

const fieldClass = 'w-full border border-[#7F9DB9] bg-white px-2 py-1 text-[11px] text-black focus:bg-[#FFFDE7] focus:outline-2 focus:outline-[#0055A5] disabled:bg-[#ECE9D8] disabled:text-[#666]';

export default function FinixLoginScreen({ userEmail = 'estudiante@finix.ec', defaultRole = 'super', onSuccess, onLoginSuccess }: FinixLoginScreenProps) {
  const id = useId();
  const [username, setEditedUsername] = useState<string>(`${defaultRole}.${userEmail}`);
  const [password, setPassword] = useState<string>('1234');
  const [language, setLanguage] = useState<string>('es-EC');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingSession] = useState<boolean>(false);

  const effectiveSuccess = onSuccess || onLoginSuccess;
  const successCallback = useRef(effectiveSuccess);
  successCallback.current = effectiveSuccess;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    if (!username.trim()) {
      setError('Introduce un nombre de usuario válido.');
      return;
    }
    if (!password) {
      setError('Introduce la contraseña.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      if (!successCallback.current) {
        window.location.href = '/simulador';
        return;
      }
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
          <div aria-hidden="true" className="relative flex h-[50px] w-[50px] shrink-0 items-center justify-center bg-gradient-to-br from-[#001833] to-[#0055A5] text-[20px] font-bold text-white rounded">
            <span>🐦‍🔥</span>
          </div>
          <div>
            <h1 id={`${id}-title`} className="text-[16px] font-bold leading-6 text-[#002244]">Finix ERP Cloud</h1>
            <p className="text-[#666]">Release 2026.1 · Ecuador SRI & NIIF PYMES</p>
          </div>
        </header>

        {checkingSession ? (
          <p role="status" className="flex min-h-[300px] items-center justify-center gap-2 text-[#666]">
            <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-[#D4D0C8] border-t-[#1E3A5F] motion-reduce:animate-none" />
            Comprobando sesión Finix ERP…
          </p>
        ) : (
          <form onSubmit={handleSubmit} aria-busy={isSubmitting} aria-describedby={error ? `${id}-error` : undefined} className="space-y-4">
            <div>
              <label htmlFor={`${id}-server`} className="mb-1 block text-[#666]">Servidor Cloud</label>
              <input id={`${id}-server`} type="text" readOnly value="FINIX-CLOUD-EC01" className={fieldClass} />
            </div>
            <div>
              <label htmlFor={`${id}-database`} className="mb-1 block text-[#666]">Base de datos empresa</label>
              <input id={`${id}-database`} type="text" readOnly value="FINIX_CORP_EC" className={fieldClass} />
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
              className="flex h-[38px] w-full items-center justify-center gap-2 bg-[#003366] text-[13px] text-white transition-colors hover:bg-[#002244] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003366] active:scale-95 disabled:cursor-wait disabled:opacity-60 disabled:active:scale-100 motion-reduce:transform-none motion-reduce:transition-none"
            >
              {isSubmitting && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" />}
              <span role="status" aria-live="polite">{isSubmitting ? 'Iniciando sesión en Finix ERP…' : 'Iniciar Sesión en Finix ERP'}</span>
            </button>
          </form>
        )}
        <footer className="mt-6 text-center text-[10px] text-[#999]">
          Finix ERP 2026 | Cloud Edition | Facturación SRI & SuperCías Ecuador
        </footer>
      </div>
    </section>
  );
}

export { FinixLoginScreen as SAPLoginScreen };
