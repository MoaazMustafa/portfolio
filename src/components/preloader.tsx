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

    // Simulate loading time (2 seconds)
    const timer = setTimeout(() => {
      setIsAnimatingOut(true);
      // Remove preloader and restore scrolling after animation completes
      setTimeout(() => {
        setIsLoading(false);
        if (typeof document !== 'undefined') {
          document.body.style.overflow = 'unset';
        }
      }, 1000); // Match the animation duration
    }, 2000);

    return () => {
      clearTimeout(timer);
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
          'bg-background fixed inset-0 z-100 flex items-center justify-center transition-transform duration-1000',
          isAnimatingOut && '-translate-y-full',
        )}
        style={{
          transitionTimingFunction: isAnimatingOut
            ? 'cubic-bezier(0.33, 1, 0.68, 1)'
            : 'ease-in-out',
        }}
      >
        {/* Logo that will animate to navbar */}
        <div
          className={cn(
            'font-orbitron flex items-center text-5xl font-black tracking-tight transition-all duration-1000 sm:text-6xl lg:text-7xl',
          )}
        >
          <span
            className={cn(
              'text-foreground transition-colors duration-500',
              isAnimatingOut && 'text-foreground',
            )}
          >
            M
          </span>
          <span
            className={cn(
              'text-primary transition-colors duration-500',
              isAnimatingOut && 'text-primary',
            )}
          >
            M
          </span>
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

      {/* Page Content Wrapper - Animates up with preloader */}
      <style jsx global>{`
        #main-content,
        nav,
        footer {
          transform: ${isAnimatingOut ? 'translateY(0)' : 'translateY(100vh)'};
          transition: transform 1000ms cubic-bezier(0.33, 1, 0.68, 1);
        }
      `}</style>
    </>
  );
}
