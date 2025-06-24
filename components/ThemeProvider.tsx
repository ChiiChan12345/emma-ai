'use client';

import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Permanently set dark theme
    const root = window.document.documentElement;
    
    // Remove any existing theme classes
    root.removeAttribute('data-theme');
    root.classList.remove('light', 'dark');
    
    // Apply dark theme permanently
    root.setAttribute('data-theme', 'dark');
    root.classList.add('dark');
  }, []);

  return <>{children}</>;
}

// Simplified hook that always returns dark theme
export const useTheme = () => {
  return {
    theme: 'dark' as const,
    setTheme: () => {}, // No-op function since theme is fixed
  };
}; 