'use client';

import { useEffect } from 'react';

/**
 * Silently registers the service worker for PWA / offline support.
 * Renders nothing — mount inside a layout.
 */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator))
      return;

    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
      /* Fail silently — SW is a progressive enhancement */
    });
  }, []);

  return null;
}
