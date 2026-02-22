'use client';

import { Palette } from 'lucide-react';

import { useColorTheme } from '@/hooks/use-color-theme';
import { cn } from '@/lib/utils';

import { Button } from './ui/button';

export function ColorThemeToggle() {
  const { colorTheme, toggleColorTheme } = useColorTheme();

  return (
    <Button
      variant="default"
      size="icon"
      onClick={toggleColorTheme}
      className="relative"
      aria-label={`Switch to ${colorTheme === 'lime' ? 'maroon' : 'lime'} theme`}
      title={`Current: ${colorTheme === 'lime' ? 'Lime' : 'Maroon'} theme`}
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
