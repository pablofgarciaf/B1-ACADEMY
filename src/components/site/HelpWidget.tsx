"use client";
import { usePathname } from 'next/navigation';
import FiniChat from './FiniChat';

export default function HelpWidget() {
  const pathname = usePathname();

  if (pathname.startsWith('/simulador') || pathname.startsWith('/manuales/')) {
    return null;
  }

  return <FiniChat />;
}
