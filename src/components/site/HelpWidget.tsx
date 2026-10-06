"use client";
import { usePathname } from 'next/navigation';
import SapiChat from './SapiChat';

export default function HelpWidget() {
  const pathname = usePathname();

  // Estas pantallas ya incluyen un tutor contextual propio. Mostrar también
  // SAPI crea dos asistentes superpuestos y deja el botón detrás del escritorio.
  if (pathname.startsWith('/simulador') || pathname.startsWith('/manuales/')) {
    return null;
  }

  return <SapiChat />;
}
