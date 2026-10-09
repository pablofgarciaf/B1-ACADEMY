"use client";
import { usePathname } from 'next/navigation';
import FeniChat from './FeniChat';

export default function HelpWidget() {
  const pathname = usePathname();

  if (pathname.startsWith('/simulador') || pathname.startsWith('/manuales/')) {
    return null;
  }

  return <FeniChat />;
}
