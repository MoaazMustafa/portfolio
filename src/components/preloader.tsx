'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Prevent scrolling during loading
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }

    // Wait for the page to fully load
    const handleLoad = () => {
      // Add a small delay to ensure everything is rendered
      setTimeout(() => {
        setIsAnimatingOut(true);
        // Remove preloader and restore scrolling after animation completes
        setTimeout(() => {
          setIsLoading(false);
          if (typeof document !== 'undefined') {
            document.body.style.overflow = 'unset';
          }
        }, 1000); // Match the animation duration
      }, 1500); // Small delay after load
    };

    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        // Page already loaded
        handleLoad();
      } else {
        // Wait for load event
        window.addEventListener('load', handleLoad);
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('load', handleLoad);
      }
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'unset';
      }
    };
  }, []);

  if (!isMounted || !isLoading) return null;

  return (
    <>
      {/* Preloader Overlay */}
      <div
        className={cn(
          'bg-background fixed inset-0 z-100 flex items-center justify-center transition-opacity duration-1000',
          isAnimatingOut && 'opacity-0',
        )}
      >
        {/* Logo that will scale up to fill screen */}
        <div
          className={cn(
            'font-orbitron flex items-center text-5xl font-black tracking-tight transition-all duration-1000 sm:text-6xl lg:text-7xl',
            isAnimatingOut && 'scale-[20] opacity-0',
          )}
          style={{
            transitionTimingFunction: isAnimatingOut
              ? 'cubic-bezier(0.33, 1, 0.68, 1)'
              : 'ease-in-out',
          }}
        >
          <span className="text-foreground">M</span>
          <span className="text-primary">M</span>
        </div>

        {/* Optional: Loading indicator dots */}
        <div
          className={cn(
            'absolute bottom-20 flex gap-2 transition-opacity duration-300',
            isAnimatingOut && 'opacity-0',
          )}
        >
          <div className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]" />
          <div className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]" />
          <div className="bg-primary h-2 w-2 animate-bounce rounded-full" />
        </div>
      </div>
    </>
  );
}
