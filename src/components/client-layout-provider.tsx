'use client';

import NextTopLoader from 'nextjs-toploader';
import type { ReactNode } from 'react';

import ClickSpark from '@/components/ui/Spark';
import { useColorTheme } from '@/hooks';

interface ClientLayoutProviderProps {
  children: ReactNode;
}

export function ClientLayoutProvider({ children }: ClientLayoutProviderProps) {
  const { currentColors } = useColorTheme();

  return (
    <>
      <NextTopLoader
        color={currentColors.primary}
        shadow={`0 0 10px ${currentColors.primary}, 0 0 5px ${currentColors.primary}`}
        height={4}
        showSpinner
        showForHashAnchor
      />
      <ClickSpark
        sparkColor={currentColors.primary}
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
        {children}
      </ClickSpark>
    </>
  );
}
