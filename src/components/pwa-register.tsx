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

    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      });

      if ('caches' in window) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => caches.delete(cacheName));
        });
      }

      return;
    }

    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
      /* Fail silently — SW is a progressive enhancement */
    });
  }, []);

  return null;
}
