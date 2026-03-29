'use client';

import { useEffect, useRef } from 'react';

import { useSmoothScroll } from '@/components/smooth-scroll-provider';

export function ScrollBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const { lenis } = useSmoothScroll();

  // Lenis-driven progress tracking (preferred when Lenis is active)
  useEffect(() => {
    if (!lenis) return;

    const handleScroll = () => {
      const progress = lenis.progress * 100;
      if (barRef.current) {
        barRef.current.style.setProperty('--p', `${progress}vh`);
        barRef.current.style.top = `${progress}vh`;
      }
    };

    lenis.on('scroll', handleScroll);
    return () => lenis.off('scroll', handleScroll);
  }, [lenis]);

  // Fallback: native scroll listener when Lenis is not active (reduced-motion, SSR)
  useEffect(() => {
    if (lenis) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      if (barRef.current) {
        barRef.current.style.setProperty('--p', `${progress}vh`);
        barRef.current.style.top = `${progress}vh`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lenis]);

  return <div ref={barRef} className="scroll-bar" aria-hidden="true" />;
}
