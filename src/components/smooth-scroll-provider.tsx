'use client';

import Lenis from 'lenis';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

type LenisInstance = InstanceType<typeof Lenis>;

interface SmoothScrollContextValue {
  lenis: LenisInstance | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

interface SmoothScrollProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function SmoothScrollProvider({
  children,
  enabled = true,
}: SmoothScrollProviderProps) {
  const lenisRef = useRef<LenisInstance | null>(null);
  const [lenisInstance, setLenisInstance] = useState<LenisInstance | null>(
    null,
  );

  // Check reduced-motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const shouldEnable = enabled && !prefersReducedMotion;

  // Pure DOM updates — no React state per scroll frame
  const onScroll = useCallback((instance: LenisInstance) => {
    const root = document.documentElement;
    root.style.setProperty('--scroll-y', String(instance.scroll));
    root.style.setProperty('--scroll-progress', String(instance.progress));
  }, []);

  useEffect(() => {
    if (!shouldEnable) return;

    const lenis = new Lenis({
      lerp: 0.07,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      syncTouch: true,
      autoRaf: true,
      autoResize: true,
      prevent: (node: HTMLElement) => {
        return (
          node.hasAttribute('data-lenis-prevent') ||
          node.closest('[data-lenis-prevent]') !== null ||
          node.classList.contains('overflow-auto') ||
          node.classList.contains('overflow-y-auto') ||
          node.closest('[data-radix-scroll-area-viewport]') !== null
        );
      },
    });

    // If the preloader hasn't finished, keep Lenis stopped until it signals
    const preloaderDone = document.body.classList.contains('preloader-done');

    if (!preloaderDone) {
      lenis.stop();
      const onPreloaderDone = () => {
        lenis.start();
        window.removeEventListener('preloader-done', onPreloaderDone);
      };
      window.addEventListener('preloader-done', onPreloaderDone);
    }

    lenis.on('scroll', onScroll);
    lenisRef.current = lenis;
    setLenisInstance(lenis);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, [shouldEnable, onScroll]);

  // Listen for reduced-motion changes at runtime
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        lenisRef.current?.destroy();
        lenisRef.current = null;
        setLenisInstance(null);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisInstance }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
