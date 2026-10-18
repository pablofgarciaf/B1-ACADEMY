'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ShieldCheck, ShieldX } from 'lucide-react';
import { useLegalConfiguration } from '@/lib/use-legal-configuration';

interface CertificateResult {
  code: string;
  status: 'valid' | 'revoked';
  title: string;
  holderName: string;
  issuedAt: string;
}

export function VerificationForm({ code }: { code: string }) {
  const { publicIntakeAvailable, policyVersion } = useLegalConfiguration();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<CertificateResult | null | undefined>(undefined);

  useEffect(()=>{setPrivacyAccepted(false);setMarketingAccepted(false);setResult(undefined);},[policyVersion]);

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setResult(undefined);
    try {
      const response = await fetch('/api/certificates/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ code, requesterName: name, requesterEmail: email, requesterPhone: phone, privacyAccepted, marketingAccepted, policyVersion }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo verificar el certificado.');
      setResult(data.certificate);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo verificar el certificado.');
    } finally {
      setBusy(false);
    }
  }

  if (!publicIntakeAvailable) return <section role="status" className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-gray-800 dark:bg-[#131a20] sm:p-8">
    <h2 className="text-xl font-bold">Verificación disponible próximamente</h2>
    <p className="mt-3 text-slate-600 dark:text-gray-300">Conserva el código de tu constancia y vuelve a consultar cuando se habilite el servicio. Por ahora no solicitamos tus datos de contacto.</p>
  </section>;

  return (
    <div className="space-y-6">
      <form onSubmit={verify} className="rounded-3xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#131a20] p-6 sm:p-8 shadow-xl space-y-5">
        <p className="text-sm text-slate-600 dark:text-gray-300">Código: <strong className="font-mono break-all">{code}</strong></p>
        <p className="text-sm text-slate-600 dark:text-gray-300">Por privacidad, solicitamos tus datos antes de mostrar los datos mínimos del certificado. Dispones de 5 consultas diarias por medio de contacto y 30 por conexión.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold">Tu nombre
            <input value={name} onChange={event => setName(event.target.value)} required minLength={2} maxLength={100} autoComplete="name" className="mt-2 w-full rounded-xl border border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 px-4 py-3 text-sm" />
          </label>
          <label className="block text-sm font-semibold">Correo de contacto (preferiblemente empresarial)
            <input type="email" value={email} onChange={event => setEmail(event.target.value)} required={!phone} maxLength={254} autoComplete="email" className="mt-2 w-full rounded-xl border border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 px-4 py-3 text-sm" />
          </label>
          <label className="block text-sm font-semibold">O teléfono de contacto
            <input type="tel" value={phone} onChange={event => setPhone(event.target.value)} required={!email} minLength={7} maxLength={24} autoComplete="tel" className="mt-2 w-full rounded-xl border border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 px-4 py-3 text-sm" />
          </label>
        </div>
        <p className="text-xs text-slate-600 dark:text-gray-400">Usamos tu nombre, el medio de contacto que indiques y un identificador técnico de conexión para registrar esta consulta y limitar abusos. Consulta la <Link href="/privacidad" className="underline">política de privacidad</Link>. Esta consulta no exige aceptar cookies analíticas.</p>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" checked={privacyAccepted} onChange={event => setPrivacyAccepted(event.target.checked)} required className="mt-1" />
          <span>He leído el aviso y autorizo el tratamiento de mis datos para verificar este certificado.</span>
        </label>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" checked={marketingAccepted} onChange={event => setMarketingAccepted(event.target.checked)} className="mt-1" />
          <span>Opcional: autorizo a Finix Academy a contactarme por el medio indicado para ofrecerme sus servicios. Puedo verificar el certificado sin aceptar esta opción.</span>
        </label>
        <button type="submit" disabled={busy} className="rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-60 px-5 py-3 text-white text-sm font-bold">{busy ? 'Verificando…' : 'Verificar certificado'}</button>
        {error && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>}
      </form>

      {result === null && <section role="status" className="rounded-3xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#131a20] p-6 sm:p-8 space-y-3">
        <ShieldX className="w-8 h-8 text-slate-400" aria-hidden="true" />
        <h2 className="text-xl font-bold">No encontramos este certificado</h2>
        <p className="text-sm text-slate-600 dark:text-gray-400">Revisa que el código coincida exactamente con el documento.</p>
      </section>}
      {result && <section role="status" className={`rounded-3xl border bg-white dark:bg-[#131a20] p-6 sm:p-8 shadow-xl space-y-5 ${result.status === 'valid' ? 'border-emerald-500/40' : 'border-red-500/40'}`}>
        <div className="flex items-center gap-3">
          {result.status === 'valid' ? <ShieldCheck className="w-8 h-8 text-emerald-600" aria-hidden="true" /> : <ShieldX className="w-8 h-8 text-red-600" aria-hidden="true" />}
          <div><p className="text-xs font-bold uppercase tracking-wider">{result.status === 'valid' ? 'Certificado auténtico y vigente' : 'Certificado revocado'}</p><h2 className="text-xl sm:text-2xl font-bold">{result.title}</h2></div>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {result.holderName && <div><dt className="text-xs text-slate-500">Titular</dt><dd className="font-semibold">{result.holderName}</dd></div>}
          {result.issuedAt && <div><dt className="text-xs text-slate-500">Fecha de emisión</dt><dd className="font-semibold">{new Date(result.issuedAt).toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' })}</dd></div>}
          <div className="sm:col-span-2"><dt className="text-xs text-slate-500">Código</dt><dd className="font-mono text-xs break-all">{result.code}</dd></div>
        </dl>
      </section>}
    </div>
  );
}
