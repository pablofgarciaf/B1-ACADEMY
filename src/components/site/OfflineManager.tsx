"use client";

import { useEffect } from 'react';
import { manualZones, getZoneForManual } from '@/config/manualZones';

export default function OfflineManager({ currentManualId }: { currentManualId: string }) {
  useEffect(() => {
    if (!('caches' in window)) return;

    const cacheZone = async () => {
      const zone = getZoneForManual(currentManualId);
      if (!zone) return;

      const manualsInZone = manualZones[zone];
      const cache = await caches.open(`sap-manuals-zone-${zone}`);

      // We add the URLs for the markdown files and a placeholder for images
      // In a real scenario we would fetch the list of images per manual from an API
      const urlsToCache = manualsInZone.map(manual => `/Capacitacion_SAP_Markdowns_Limpios/${manual.replace('.pdf', '')}.md`);
      
      try {
        await cache.addAll(urlsToCache);
        console.log(`[OfflineManager] Precargada la zona ${zone} exitosamente para modo offline.`);
      } catch (err) {
        console.warn('[OfflineManager] Error cacheando recursos:', err);
      }
    };

    // Usar requestIdleCallback para que no bloquee el hilo principal
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => cacheZone());
    } else {
      setTimeout(cacheZone, 2000);
    }
  }, [currentManualId]);

  return null; // Este componente no renderiza nada, solo maneja caché
}
