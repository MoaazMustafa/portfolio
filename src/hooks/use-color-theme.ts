'use client';

import { useEffect, useState } from 'react';

export type ColorTheme = 'lime' | 'maroon';

const COLOR_THEMES = {
  lime: {
    primary: '#acec00',
    shades: {
      50: '#cdf06a',
      100: '#c6f051',
      200: '#bff038',
      300: '#b9f11d',
      400: '#aee80c',
      500: '#acec00',
      600: '#8bbc06',
      700: '#7aa503',
      800: '#688d01',
      900: '#567500',
    },
    rgb: 'rgba(172, 236, 0, 1)',
    orbHue: 75,
  },
  maroon: {
    primary: '#800000',
    shades: {
      50: '#ffe5e5',
      100: '#ffcccc',
      200: '#ffb3b3',
      300: '#ff9999',
      400: '#ff6666',
      500: '#800000',
      600: '#660000',
      700: '#4d0000',
      800: '#330000',
      900: '#1a0000',
    },
    rgb: 'rgba(128, 0, 0, 1)',
    orbHue: 250,
  },
} as const;

export function useColorTheme() {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    if (typeof window === 'undefined') return 'lime';
    const stored = localStorage.getItem('color-theme') as ColorTheme;
    return stored === 'lime' || stored === 'maroon' ? stored : 'lime';
  });

  useEffect(() => {
    // Load theme from localStorage
    const stored = localStorage.getItem('color-theme') as ColorTheme;
    if (stored && (stored === 'lime' || stored === 'maroon')) {
      setColorTheme(stored);
      applyColorTheme(stored);
    } else {
      // Apply default lime theme if no stored preference
      applyColorTheme('lime');
    }
  }, []);

  const toggleColorTheme = () => {
    const newTheme: ColorTheme = colorTheme === 'lime' ? 'maroon' : 'lime';
    localStorage.setItem('color-theme', newTheme);
    // Reload after 1 second
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  const setTheme = (theme: ColorTheme) => {
    localStorage.setItem('color-theme', theme);
    // Reload after 1 second
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return {
    colorTheme,
    toggleColorTheme,
    setColorTheme: setTheme,
    currentColors: COLOR_THEMES[colorTheme],
  };
}

function applyColorTheme(theme: ColorTheme) {
  const colors = COLOR_THEMES[theme];
  const root = document.documentElement;

  // Apply CSS custom properties
  root.style.setProperty('--color-theme-primary', colors.primary);
  root.style.setProperty('--color-theme-primary-rgb', colors.rgb);
  root.style.setProperty('--color-theme-orb-hue', colors.orbHue.toString());

  // Apply all shades
  Object.entries(colors.shades).forEach(([shade, value]) => {
    root.style.setProperty(`--color-theme-primary-${shade}`, value);
  });

  // Update data attribute for easier CSS targeting
  root.setAttribute('data-color-theme', theme);
}
