import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState } from '../types';

// Check system preference on initial load
const getInitialDarkMode = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('app-storage');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.state?.isDarkMode ?? false;
      } catch {
        return false;
      }
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isDarkMode: getInitialDarkMode(),
      toggleDarkMode: () => set((state) => {
        const newDarkMode = !state.isDarkMode;
        // Apply theme immediately to document
        if (typeof document !== 'undefined') {
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        return { isDarkMode: newDarkMode };
      }),
    }),
    {
      name: 'app-storage',
    }
  )
);