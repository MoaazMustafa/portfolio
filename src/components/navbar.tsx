'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import GlassSurface from '@/components/ui/glass-surface';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/contact', label: 'Contact' },
  { href: '/gallery', label: 'Gallery' },
];

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const currentScrollY = window.scrollY;

  //     // Hide on scroll down, show on scroll up
  //     if (currentScrollY > lastScrollY && currentScrollY > 100) {
  //       setIsVisible(false);
  //     } else {
  //       setIsVisible(true);
  //     }

  //     setLastScrollY(currentScrollY);
  //   };

  //   window.addEventListener('scroll', handleScroll, { passive: true });
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, [lastScrollY]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 right-0 left-0 z-50 flex w-screen items-center justify-center px-5 pt-4 transition-all duration-300 sm:px-8 lg:px-12',
          isVisible ? 'translate-y-0' : '-translate-y-full',
        )}
      >
        <GlassSurface
          borderRadius={50}
          backgroundOpacity={0.7}
          saturation={0.7}
          borderWidth={0.07}
          brightness={50}
          blur={11}
          displace={0.5}
          distortionScale={-180}
          redOffset={0}
          greenOffset={0}
          blueOffset={0}
          opacity={0.8}
          mixBlendMode="screen"
          className="w-full!"
        >
          <div className="flex h-10 w-full items-center justify-between px-4 sm:h-12 sm:px-6 lg:px-8">
            {/* Logo */}
            <Link
              href="/"
              className="group relative ml-4 flex items-center"
              aria-label="Home"
            >
              <div className="relative">
                <span className="font-orbitron text-foreground group-hover:text-primary text-lg font-black tracking-tight transition-all duration-300 sm:text-2xl">
                  M
                </span>
                <div className="from-primary to-primary/50 absolute -bottom-1 left-0 h-0.5 w-0 bg-linear-to-r transition-all duration-300 group-hover:w-full" />
              </div>
              <div className="relative">
                <span className="font-orbitron text-primary group-hover:text-foreground text-lg font-black tracking-tight transition-all duration-300 sm:text-2xl">
                  M
                </span>
                <div className="bg-primary/20 absolute -inset-1 -z-10 rounded opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group relative overflow-hidden px-4 py-2 text-sm font-medium transition-colors duration-200',
                      isActive
                        ? 'text-primary from-primary/20 to-primary/5 ring-primary/20 hover:ring-primary/40 relative rounded-xl bg-linear-to-br ring-1 transition-all duration-300'
                        : 'text-foreground hover:text-primary',
                    )}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                      e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                    }}
                  >
                    {/* Spotlight effect */}
                    <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: `radial-gradient(200px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), color-mix(in srgb, var(--color-theme-primary) 15%, transparent), transparent 80%)`,
                        }}
                      />
                    </span>
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              {/* Single CTA Button */}
              <Link href="/contact" className="hidden sm:block">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Let&apos;s Talk
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </GlassSurface>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'bg-background/95 fixed inset-0 z-40 backdrop-blur-lg transition-all duration-300 md:hidden',
          isMobileMenuOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
        )}
      >
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-3xl font-bold transition-all duration-300',
                  isActive
                    ? 'text-primary scale-110'
                    : 'text-foreground hover:text-primary hover:scale-105',
                  isMobileMenuOpen
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-4 opacity-0',
                )}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms',
                }}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Mobile CTA */}
          <Link href="/contact" className="mt-8">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 px-8 shadow-lg"
            >
              Let&apos;s Talk
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
