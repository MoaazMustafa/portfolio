'use client';

import { Palette } from 'lucide-react';

import { useColorTheme } from '@/hooks/use-color-theme';
import { cn } from '@/lib/utils';

import { Button } from './ui/button';

export function ColorThemeToggle() {
  const { colorTheme, toggleColorTheme } = useColorTheme();

  const nextThemeLabel =
    colorTheme === 'lime'
      ? 'maroon'
      : colorTheme === 'maroon'
        ? 'lime'
        : 'lime';

  return (
    <Button
      variant="default"
      size="icon"
      onClick={toggleColorTheme}
      className="relative"
      aria-label={`Switch to ${nextThemeLabel} theme`}
      title={`Current: ${colorTheme.charAt(0).toUpperCase() + colorTheme.slice(1)} theme`}
    >
      <Palette
        className={cn(
          'h-5 w-5 transition-all duration-300',
          // colorTheme === 'lime' ? 'text-[#acec00]' : 'text-[#800000]',
        )}
      />
      <span className="sr-only">Toggle color theme</span>
    </Button>
  );
}
