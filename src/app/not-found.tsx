import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-[#080d1a] p-8">
      <ShieldCheck className="mb-4 w-12 h-12 text-sap-blue" />
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
        404 – Página no encontrada
      </h1>
      <p className="text-center text-slate-600 dark:text-slate-400 mb-6 max-w-md">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <Link
        href="/"
        className="rounded-full bg-sap-blue px-6 py-2 text-sm font-medium text-white hover:bg-sap-blue/90 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
