'use client';

import { cn } from '@/lib/utils';

interface GlowEffectProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowEffect({
  children,
  className,
  glowColor = 'var(--color-theme-primary)',
}: GlowEffectProps) {
  return (
    <div className={cn('group relative', className)}>
      <div
        className="absolute -inset-0.5 rounded-xl opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-60"
        style={{ background: glowColor }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export function AnimatedGradientBorder({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative overflow-hidden rounded-xl p-px', className)}>
      <div
        className="absolute inset-0 animate-spin rounded-xl"
        style={{
          background:
            'conic-gradient(from 0deg, transparent, var(--color-theme-primary), transparent, transparent)',
          animationDuration: '4s',
        }}
      />
      <div className="bg-background relative rounded-xl">{children}</div>
    </div>
  );
}
