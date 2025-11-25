import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import type { UserType } from "@/types/user.type";

interface State {
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  user: UserType | null;
  isInitialized: boolean;
}

interface Actions {
  setAuthenticated: (isAuthenticated: boolean) => void;
  setUser: (user: UserType | null) => void;
  updateUser: (updates: Partial<UserType>) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
  setIsInitialized?: (isInitialized: boolean) => void;
  checkAuthStatus: () => void;
  setAuth: (user: UserType) => void;
}

export const useAuthStore = create<State & Actions>()(
  immer((set, get) => ({
    isAuthenticated: false,
    error: null,
    isLoading: false,
    user: null,
    isInitialized: false,
    setAuthenticated: (isAuthenticated) =>
      set((state) => {
        state.isAuthenticated = isAuthenticated;
      }),
    setUser: (user) =>
      set((state) => {
        state.user = user;
      }),
    updateUser: (updates) =>
      set((state) => {
        if (state.user) {
          Object.assign(state.user, updates);
        }
      }),
    setError: (error) =>
      set((state) => {
        state.error = error;
      }),
    setLoading: (isLoading) =>
      set((state) => {
        state.isLoading = isLoading;
      }),
    logout: () =>
      set((state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isInitialized = true;
      }),
    setIsInitialized: (isInitialized) =>
      set((state) => {
        state.isInitialized = isInitialized;
      }),
    checkAuthStatus: () => {
      const state = get();
      if (state.user) {
        set({ isAuthenticated: true, isInitialized: true });
      }
    },
    setAuth: (user) =>
      set((state) => {
        state.user = user;
        state.isAuthenticated = true;
        state.isInitialized = true;
      }),
  }))
);
