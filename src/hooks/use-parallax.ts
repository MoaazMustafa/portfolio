'use client';

import { useEffect, useRef, useState } from 'react';

import { useSmoothScroll } from '@/components/smooth-scroll-provider';

export type ParallaxIntensity = 'subtle' | 'medium' | 'strong';

const INTENSITY_MAP: Record<ParallaxIntensity, number> = {
  subtle: 0.05,
  medium: 0.12,
  strong: 0.22,
};

interface UseParallaxOptions {
  /** Parallax intensity preset */
  intensity?: ParallaxIntensity;
  /** Custom speed factor (overrides intensity preset) */
  speed?: number;
  /** Direction of the parallax movement */
  direction?: 'up' | 'down';
  /** Only animate when element is in viewport */
  inViewOnly?: boolean;
}

interface ParallaxResult {
  ref: React.RefObject<HTMLDivElement | null>;
  style: React.CSSProperties;
}

export function useParallax({
  intensity = 'subtle',
  speed,
  direction = 'up',
  inViewOnly = true,
}: UseParallaxOptions = {}): ParallaxResult {
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);
  const [isInView, setIsInView] = useState(!inViewOnly);
  const { lenis } = useSmoothScroll();

  const factor = speed ?? INTENSITY_MAP[intensity];
  const sign = direction === 'up' ? -1 : 1;

  // Reduced-motion check: return identity transform
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  // IntersectionObserver for viewport gating
  useEffect(() => {
    if (!inViewOnly || prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: '100px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inViewOnly, prefersReducedMotion]);

  // Subscribe to Lenis scroll events for offset calculation
  useEffect(() => {
    if (!lenis || prefersReducedMotion) return;

    const handleScroll = () => {
      const el = ref.current;
      if (!el || !isInView) return;

      const rect = el.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const distance = elementCenter - viewportCenter;

      setOffset(distance * factor * sign);
    };

    lenis.on('scroll', handleScroll);
    return () => lenis.off('scroll', handleScroll);
  }, [lenis, factor, sign, isInView, prefersReducedMotion]);

  const style: React.CSSProperties = prefersReducedMotion
    ? {}
    : {
        transform: `translate3d(0, ${offset}px, 0)`,
        willChange: isInView ? 'transform' : 'auto',
      };

  return { ref, style };
}
