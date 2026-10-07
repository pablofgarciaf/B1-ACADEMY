import Link from 'next/link';
import { RotateCcw, ShieldAlert } from 'lucide-react';

/**
 * Se muestra cuando el estudiante tiene sesión pero Firebase no respondió al validarla.
 * Antes se le mandaba al login, que lo devolvía de inmediato: un bucle sin salida.
 */
export default function SesionNoDisponible({ destino }: { destino: string }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070b14] px-4">
      <div className="max-w-md w-full rounded-3xl border border-amber-500/30 bg-white dark:bg-[#131a20] p-8 shadow-xl text-center space-y-4">
        <ShieldAlert className="w-10 h-10 mx-auto text-amber-500" aria-hidden="true" />
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">No pudimos confirmar tu sesión</h1>
        <p className="text-sm text-slate-600 dark:text-gray-300">
          El servicio de autenticación tardó en responder. Tu cuenta y tu progreso están a salvo: vuelve a intentarlo en unos segundos.
        </p>
        <a
          href={destino}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" /> Reintentar
        </a>
        <p>
          <Link href="/" className="text-xs font-semibold text-slate-500 dark:text-gray-400 hover:text-amber-600">Volver al inicio</Link>
        </p>
      </div>
    </main>
  );
}
