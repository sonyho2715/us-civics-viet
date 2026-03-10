'use client';

import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { darkMode, setDarkMode } = useSettingsStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting for client mount
  useEffect(() => {
    setMounted(true);

    // On first visit (no stored settings), default to system color scheme preference
    try {
      const stored = localStorage.getItem('civics-settings');
      if (!stored) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDark);
      }
    } catch {
      // localStorage not available
    }
  }, []);

  // Apply dark class to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode, mounted]);

  // Prevent flash of unstyled content
  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
