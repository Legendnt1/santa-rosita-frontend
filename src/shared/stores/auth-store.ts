"use client";

import { create } from "zustand";
import type { User } from "@/modules/auth/domain/entities/User";

/**
 * Client-side auth state.
 * Source of truth is the httpOnly "auth_token" cookie (managed server-side).
 * This store holds the decoded user profile for UI rendering only.
 * Do NOT persist to localStorage — cookie drives the real session.
 */
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
}

/**
 * Client-side auth state.
 * Source of truth is the httpOnly "auth_token" cookie (managed server-side).
 * This store holds the decoded user profile for UI rendering only.
 * Do NOT persist to localStorage — cookie drives the real session.
 */
export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
}));
