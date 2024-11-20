import React from 'react';
import { Palette } from 'lucide-react';
import { ThemeKey } from '../types';

interface ThemeSelectorProps {
  currentTheme: ThemeKey;
  onThemeChange: (theme: ThemeKey) => void;
  themes: Record<ThemeKey, { name: string }>;
}

export function ThemeSelector({ currentTheme, onThemeChange, themes }: ThemeSelectorProps) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative group">
        <button
          className="p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
          aria-label="Change theme"
        >
          <Palette className="w-5 h-5" />
        </button>
        
        <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          {(Object.keys(themes) as ThemeKey[]).map((themeKey) => (
            <button
              key={themeKey}
              onClick={() => onThemeChange(themeKey)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                currentTheme === themeKey ? 'font-semibold' : ''
              }`}
            >
              {themes[themeKey].name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}