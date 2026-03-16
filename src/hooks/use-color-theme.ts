'use client';

import { useEffect, useState } from 'react';

export type ColorTheme = 'lime' | 'maroon' | 'custom';

type ThemeShades = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

type ThemeConfig = {
  primary: string;
  shades: ThemeShades;
  rgb: string;
  orbHue: number;
};

type ThemeChangedDetail = {
  theme: ColorTheme;
  customColor: string;
};

const COLOR_THEME_STORAGE_KEY = 'color-theme';
const CUSTOM_COLOR_STORAGE_KEY = 'color-theme-custom';
const DEFAULT_CUSTOM_COLOR = '#3b82f6';
const COLOR_THEME_CHANGED_EVENT = 'color-theme-changed';

const isValidHex = (value: string) => /^#([0-9a-fA-F]{6})$/.test(value);

function hexToRgb(hex: string) {
  const cleanedHex = hex.replace('#', '');
  const value = Number.parseInt(cleanedHex, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function blendHex(baseHex: string, targetHex: string, ratio: number) {
  const base = hexToRgb(baseHex);
  const target = hexToRgb(targetHex);
  const mix = (a: number, b: number) =>
    Math.round(a + (b - a) * Math.max(0, Math.min(1, ratio)));

  return rgbToHex(
    mix(base.r, target.r),
    mix(base.g, target.g),
    mix(base.b, target.b),
  );
}

function getHueFromHex(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  if (delta === 0) return 0;

  let hue = 0;
  if (max === rn) hue = ((gn - bn) / delta) % 6;
  else if (max === gn) hue = (bn - rn) / delta + 2;
  else hue = (rn - gn) / delta + 4;

  return Math.round((hue * 60 + 360) % 360);
}

function createCustomThemeConfig(baseHex: string): ThemeConfig {
  const safeHex = isValidHex(baseHex) ? baseHex : DEFAULT_CUSTOM_COLOR;
  const { r, g, b } = hexToRgb(safeHex);

  return {
    primary: safeHex,
    shades: {
      50: blendHex(safeHex, '#ffffff', 0.9),
      100: blendHex(safeHex, '#ffffff', 0.78),
      200: blendHex(safeHex, '#ffffff', 0.64),
      300: blendHex(safeHex, '#ffffff', 0.5),
      400: blendHex(safeHex, '#ffffff', 0.28),
      500: safeHex,
      600: blendHex(safeHex, '#000000', 0.12),
      700: blendHex(safeHex, '#000000', 0.24),
      800: blendHex(safeHex, '#000000', 0.38),
      900: blendHex(safeHex, '#000000', 0.54),
    },
    rgb: `rgba(${r}, ${g}, ${b}, 1)`,
    orbHue: getHueFromHex(safeHex),
  };
}

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
} satisfies Record<Exclude<ColorTheme, 'custom'>, ThemeConfig>;

function getThemeConfig(theme: ColorTheme, customColor: string): ThemeConfig {
  if (theme === 'custom') {
    return createCustomThemeConfig(customColor);
  }

  return COLOR_THEMES[theme];
}

export function useColorTheme() {
  const [mounted, setMounted] = useState(false);
  const [colorTheme, setColorTheme] = useState<ColorTheme>('lime');
  const [customColor, setCustomColorState] = useState<string>(DEFAULT_CUSTOM_COLOR);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(COLOR_THEME_STORAGE_KEY) as ColorTheme;
    const storedCustomColor = localStorage.getItem(CUSTOM_COLOR_STORAGE_KEY) || '';
    
    if (stored === 'lime' || stored === 'maroon' || stored === 'custom') {
      setColorTheme(stored);
    }
    
    if (isValidHex(storedCustomColor)) {
      setCustomColorState(storedCustomColor);
    }
  }, []);

  useEffect(() => {
    const readAndApplyTheme = () => {
      const stored = localStorage.getItem(COLOR_THEME_STORAGE_KEY) as ColorTheme;
      const storedCustomColor = localStorage.getItem(CUSTOM_COLOR_STORAGE_KEY);
      const safeCustomColor =
        storedCustomColor && isValidHex(storedCustomColor)
          ? storedCustomColor
          : DEFAULT_CUSTOM_COLOR;

      setCustomColorState(safeCustomColor);

      if (
        stored &&
        (stored === 'lime' || stored === 'maroon' || stored === 'custom')
      ) {
        setColorTheme(stored);
        applyColorTheme(stored, safeCustomColor);
      } else {
        applyColorTheme('lime', safeCustomColor);
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === COLOR_THEME_STORAGE_KEY ||
        event.key === CUSTOM_COLOR_STORAGE_KEY
      ) {
        readAndApplyTheme();
      }
    };

    const handleThemeChanged = (
      event: Event,
    ) => {
      const customEvent = event as CustomEvent<ThemeChangedDetail>;
      const detail = customEvent.detail;
      if (!detail) {
        readAndApplyTheme();
        return;
      }

      setColorTheme(detail.theme);
      setCustomColorState(detail.customColor);
      applyColorTheme(detail.theme, detail.customColor);
    };

    // Load theme from localStorage once on mount.
    readAndApplyTheme();

    window.addEventListener('storage', handleStorage);
    window.addEventListener(COLOR_THEME_CHANGED_EVENT, handleThemeChanged);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(COLOR_THEME_CHANGED_EVENT, handleThemeChanged);
    };
  }, []);

  const broadcastThemeChange = (theme: ColorTheme, color: string) => {
    window.dispatchEvent(
      new CustomEvent<ThemeChangedDetail>(COLOR_THEME_CHANGED_EVENT, {
        detail: {
          theme,
          customColor: color,
        },
      }),
    );
  };

  const toggleColorTheme = () => {
    const newTheme: ColorTheme =
      colorTheme === 'custom' ? 'lime' : colorTheme === 'lime' ? 'maroon' : 'lime';
    localStorage.setItem(COLOR_THEME_STORAGE_KEY, newTheme);
    setColorTheme(newTheme);
    applyColorTheme(newTheme, customColor);
    broadcastThemeChange(newTheme, customColor);
  };

  const setTheme = (theme: ColorTheme) => {
    localStorage.setItem(COLOR_THEME_STORAGE_KEY, theme);
    setColorTheme(theme);
    applyColorTheme(theme, customColor);
    broadcastThemeChange(theme, customColor);
  };

  const setCustomColor = (color: string) => {
    if (!isValidHex(color)) {
      return;
    }

    localStorage.setItem(CUSTOM_COLOR_STORAGE_KEY, color);
    setCustomColorState(color);

    if (colorTheme === 'custom') {
      applyColorTheme('custom', color);
      broadcastThemeChange('custom', color);
    }
  };

  return {
    colorTheme,
    customColor,
    toggleColorTheme,
    setColorTheme: setTheme,
    setCustomColor,
    currentColors: getThemeConfig(colorTheme, customColor),
  };
}

function applyColorTheme(theme: ColorTheme, customColor: string) {
  const colors = getThemeConfig(theme, customColor);
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
