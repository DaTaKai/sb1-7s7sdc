import { useState, useCallback } from 'react';
import { Theme, ThemeKey } from '../types';

const themes: Record<ThemeKey, Theme> = {
  default: {
    name: 'Light',
    background: 'bg-gradient-to-br from-indigo-50 to-purple-50',
    text: 'text-gray-900',
    primary: 'bg-indigo-600 text-white',
    secondary: 'bg-gray-200',
    accent: 'text-indigo-600',
    surface: 'bg-white',
  },
  dark: {
    name: 'Dark',
    background: 'bg-gradient-to-br from-gray-900 to-gray-800',
    text: 'text-gray-100',
    primary: 'bg-purple-600 text-white',
    secondary: 'bg-gray-700',
    accent: 'text-purple-400',
    surface: 'bg-gray-800',
  },
  sepia: {
    name: 'Sepia',
    background: 'bg-gradient-to-br from-amber-50 to-orange-50',
    text: 'text-amber-900',
    primary: 'bg-amber-800 text-amber-50',
    secondary: 'bg-amber-100',
    accent: 'text-amber-800',
    surface: 'bg-amber-50',
  },
  forest: {
    name: 'Forest',
    background: 'bg-gradient-to-br from-emerald-100 to-green-50',
    text: 'text-emerald-900',
    primary: 'bg-emerald-700 text-white',
    secondary: 'bg-emerald-100',
    accent: 'text-emerald-700',
    surface: 'bg-emerald-50',
  },
  ocean: {
    name: 'Ocean',
    background: 'bg-gradient-to-br from-blue-100 to-cyan-50',
    text: 'text-blue-900',
    primary: 'bg-blue-600 text-white',
    secondary: 'bg-blue-100',
    accent: 'text-blue-600',
    surface: 'bg-blue-50',
  },
};

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('default');

  const toggleTheme = useCallback((theme: ThemeKey) => {
    setCurrentTheme(theme);
  }, []);

  return {
    theme: themes[currentTheme],
    currentTheme,
    toggleTheme,
    themes,
  };
}