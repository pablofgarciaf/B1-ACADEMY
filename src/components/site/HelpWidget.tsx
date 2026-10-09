"use client";
import { usePathname } from 'next/navigation';
import FeNiChat from './FeNiChat';

export default function HelpWidget() {
  const pathname = usePathname();

  if (pathname.startsWith('/simulador') || pathname.startsWith('/manuales/')) {
    return null;
  }

  return <FeNiChat />;
}
