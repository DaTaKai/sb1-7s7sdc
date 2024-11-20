import React from 'react';
import { Theme } from '../types';

interface ProgressBarProps {
  current: number;
  total: number;
  theme: Theme;
}

export function ProgressBar({ current, total, theme }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className={`w-full ${theme.secondary} rounded-full h-2.5 mb-6`}>
      <div
        className={`${theme.primary} h-2.5 rounded-full transition-all duration-300 ease-in-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}