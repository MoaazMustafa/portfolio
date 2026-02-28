'use client';

import { useEffect, useState } from 'react';

import VaporizeTextCycle, { Tag } from '@/components/ui/vapour-text-effect';
import { cn } from '@/lib/utils';

interface PreloaderProps {
  children?: React.ReactNode;
}

export function Preloader({ children }: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [fontSize, setFontSize] = useState('128px');

  // Responsive font size to match: text-6xl sm:text-7xl lg:text-8xl xl:text-9xl
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateFontSize = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setFontSize('128px'); // xl
      } else if (width >= 1024) {
        setFontSize('85px'); // lg
      } else if (width >= 640) {
        setFontSize('64px'); // sm
      } else if (width >= 480) {
        setFontSize('44px'); // xs
      } else if (width >= 375) {
        setFontSize('34px'); // small mobile
      } else {
        setFontSize('26px'); // very small mobile
      }
    };

    updateFontSize();
    window.addEventListener('resize', updateFontSize);
    return () => window.removeEventListener('resize', updateFontSize);
  }, []);

  useEffect(() => {
    // Prevent scrolling during loading
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }

    // Start fade out after vapor animation completes
    const animationTimeout = setTimeout(() => {
      setIsAnimatingOut(true);
      // Hide preloader completely after fade out
      setTimeout(() => {
        setIsHidden(true);
        setIsLoading(false);
        if (typeof document !== 'undefined') {
          document.body.style.overflow = 'unset';
          document.body.classList.add('preloader-done');
        }
      }, 800); // Slightly shorter than animation for smoother feel
    }, 2500); // Vapor animation duration

    return () => {
      clearTimeout(animationTimeout);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'unset';
      }
    };
  }, []);

  return (
    <>
      {/* Preloader Overlay - uses visibility and opacity for smooth transition */}
      <div
        className={cn(
          'bg-background fixed inset-0 z-100 flex items-center justify-center will-change-[opacity,visibility]',
          'transition-[opacity,visibility] duration-700 ease-out',
          isAnimatingOut && 'pointer-events-none opacity-0',
          isHidden && 'invisible',
        )}
        aria-hidden={isHidden}
      >
        {/* Vapor effect animation */}
        <div className="xs:h-16 h-12 w-full max-w-[1200px] px-4 sm:h-[100px] lg:h-[130px] xl:h-[170px]">
          <VaporizeTextCycle
            texts={['Moaaz Mustafa']}
            font={{
              fontFamily: 'Georgia, Times New Roman, serif',
              fontSize: fontSize,
              fontWeight: 300,
            }}
            color="primary"
            spread={8}
            density={8}
            animation={{
              vaporizeDuration: 2,
              fadeInDuration: 0,
              waitDuration: 0,
            }}
            direction="left-to-right"
            alignment="center"
            tag={Tag.H1}
          />
        </div>
      </div>

      {/* Content - always rendered but with fade-in effect */}
      <div
        className={cn(
          'transition-opacity duration-500 ease-out',
          isLoading ? 'opacity-0' : 'opacity-100',
        )}
      >
        {children}
      </div>
    </>
  );
}
