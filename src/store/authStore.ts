import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState } from '../types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      otpSent: false,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      setOtpSent: (otpSent) => set({ otpSent }),
      logout: () => set({ user: null, otpSent: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);