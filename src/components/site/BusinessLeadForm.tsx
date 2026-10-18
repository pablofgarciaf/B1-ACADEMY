'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { trackConversion } from '@/lib/conversions';
import { useLegalConfiguration } from '@/lib/use-legal-configuration';

export function BusinessLeadForm() {
  const { publicIntakeAvailable, policyVersion } = useLegalConfiguration();
  const requestId = useRef('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    requestId.current ||= crypto.randomUUID();
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/business-leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        requestId: requestId.current, company: form.get('company'), name: form.get('name'), email: form.get('email'), phone: form.get('phone'),
        teamSize: form.get('teamSize'), needs: form.get('needs'), privacyAccepted: form.has('privacyAccepted'), policyVersion, marketingConsent: form.has('marketingConsent'), website: form.get('website'),
      }) });
      const data = await response.json();
      if (response.status===409) requestId.current='';
      if (!response.ok) throw new Error(data.error || 'No pudimos guardar la solicitud. Vuelve a intentarlo.');
      trackConversion('generate_lead', data.id, { method: 'business_form' });
      setResult(data.id);
    } catch (e) { setError(e instanceof Error ? e.message : 'No hay conexión. Vuelve a intentarlo; tus datos se conservan en el formulario.'); }
    finally { setBusy(false); }
  }
  const input = 'mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-white/20 dark:bg-slate-900 dark:text-white';
  if (!publicIntakeAvailable) return <section id="solicitud" className="mt-16 scroll-mt-24 rounded-3xl border border-sky-500/30 bg-white p-6 dark:bg-white/[0.03] sm:p-10">
    <h2 className="text-2xl font-bold">Formación para tu equipo</h2>
    <p role="status" className="mt-3 text-slate-600 dark:text-slate-300">La recepción de solicitudes estará disponible próximamente. Mientras tanto, puedes revisar las rutas y los contenidos sin dejar tus datos.</p>
    <Link href="/capacitacion" className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-finix-blue px-6 py-3 font-bold text-white">Explorar rutas de formación</Link>
  </section>;
  return <section id="solicitud" className="mt-16 scroll-mt-24 rounded-3xl border border-sky-500/30 bg-white p-6 shadow-sm dark:bg-white/[0.03] sm:p-10">
    <h2 className="text-2xl font-bold">Solicita formación para tu equipo</h2>
    <p className="mt-3 text-slate-600 dark:text-slate-300">Cuéntanos qué procesos necesitas mejorar. Revisaremos tu solicitud para definir una propuesta de capacitación. Enviarla no tiene costo ni implica contratar.</p>
    {result ? <div role="status" className="mt-6 rounded-xl border border-emerald-500/30 p-5"><h3 className="font-bold">Solicitud recibida</h3><p className="mt-2">Guardamos tu solicitud para revisión. Conserva esta referencia: <span className="font-mono">{result}</span>.</p><Link href="/capacitacion" className="mt-4 inline-block text-sky-500 underline">Explorar rutas mientras tanto</Link></div> : <form key={policyVersion} onSubmit={submit} className="mt-7 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="font-medium">Empresa<input name="company" required minLength={2} maxLength={120} autoComplete="organization" className={input} /></label>
        <label className="font-medium">Tu nombre<input name="name" required minLength={2} maxLength={100} autoComplete="name" className={input} /></label>
        <label className="font-medium">Correo de empresa (opcional)<input name="email" type="email" maxLength={254} autoComplete="email" className={input} /></label>
        <label className="font-medium">Teléfono (opcional)<input name="phone" type="tel" maxLength={25} autoComplete="tel" className={input} /></label>
      </div>
      <p className="text-sm text-slate-500">Indica al menos un medio de contacto: correo o teléfono.</p>
      <label className="block font-medium">Personas a capacitar<input name="teamSize" type="number" required min={1} max={10000} defaultValue={5} className={input} /></label>
      <label className="block font-medium">¿Qué necesita aprender tu equipo?<textarea name="needs" required minLength={10} maxLength={2000} rows={4} className={input} /></label>
      <div className="hidden" aria-hidden="true"><label>Sitio web<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="flex items-start gap-3 text-sm"><input name="privacyAccepted" type="checkbox" required className="mt-1 h-5 w-5" /><span>He leído la <Link href="/privacidad" className="text-sky-500 underline">política de privacidad</Link> y acepto el tratamiento para atender esta solicitud.</span></label>
      <label className="flex items-start gap-3 text-sm"><input name="marketingConsent" type="checkbox" className="mt-1 h-5 w-5" /><span>También quiero recibir otras propuestas y novedades de Finix Academy (opcional).</span></label>
      {error && <p role="alert" className="rounded-xl border border-red-500/40 p-3 text-red-600 dark:text-red-300">{error}</p>}
      <button type="submit" disabled={busy} className="min-h-12 rounded-xl bg-finix-blue px-6 py-3 font-bold text-white disabled:opacity-60">{busy ? 'Guardando solicitud…' : 'Enviar solicitud'}</button>
    </form>}
  </section>;
}
