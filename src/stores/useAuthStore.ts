/**
 * Auth Store (Zustand) — PRD Section 7.4 Store 1
 *
 * Mengelola state autentikasi, info user, dan session timeout.
 * Sesi kedaluwarsa setelah 30 menit tanpa aktivitas (FR-1.5).
 */

import {create} from 'zustand';

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 menit

interface User {
  email: string;
  smartAccountAddress: string;
  eoaAddress: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  lastActivityTimestamp: number;
  sessionExpired: boolean;

  // Actions
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  refreshActivity: () => void;
  checkSessionExpiry: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isLoading: false,
  user: null,
  lastActivityTimestamp: Date.now(),
  sessionExpired: false,

  login: (user: User) => {
    set({
      isAuthenticated: true,
      isLoading: false,
      user,
      lastActivityTimestamp: Date.now(),
      sessionExpired: false,
    });
  },

  logout: () => {
    set({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      sessionExpired: false,
    });
  },

  setLoading: (loading: boolean) => {
    set({isLoading: loading});
  },

  refreshActivity: () => {
    set({lastActivityTimestamp: Date.now(), sessionExpired: false});
  },

  checkSessionExpiry: () => {
    const {lastActivityTimestamp, isAuthenticated} = get();
    if (!isAuthenticated) {
      return false;
    }
    const elapsed = Date.now() - lastActivityTimestamp;
    const expired = elapsed > SESSION_TIMEOUT_MS;
    if (expired) {
      set({sessionExpired: true});
    }
    return expired;
  },
}));
