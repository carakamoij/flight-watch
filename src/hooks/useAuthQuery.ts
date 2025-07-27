"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { env } from '../env.mjs';
import type { AuthUser } from '../lib/types';

const AUTH_TOKEN_KEY = "flight-watcher-auth";
const TOKEN_EXPIRY_DAYS = 7;

function generateToken(email: string): string {
  // Simple token generation (email + timestamp hash)
  const timestamp = Date.now().toString();
  const payload = `${email}:${timestamp}`;
  return btoa(payload);
}

function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!stored) return null;

    const user: AuthUser = JSON.parse(stored);

    // Check if token is expired
    const daysSinceLogin = (Date.now() - user.loginTime) / (1000 * 60 * 60 * 24);
    if (daysSinceLogin > TOKEN_EXPIRY_DAYS) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      return null;
    }

    return user;
  } catch {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    return null;
  }
}

export function useAuthQuery() {
  const queryClient = useQueryClient();

  // Auth state query
  const authQuery = useQuery({
    queryKey: ['auth'],
    queryFn: () => {
      return getStoredUser();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      // Validate against the shared secret password
      if (password !== env.NEXT_PUBLIC_APP_SECRET) {
        throw new Error("Invalid credentials");
      }

      const newUser: AuthUser = {
        email,
        token: generateToken(email),
        loginTime: Date.now(),
      };

      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(newUser));
      return newUser;
    },
    onSuccess: (user) => {
      // Update the auth query cache
      queryClient.setQueryData(['auth'], user);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    },
    onSuccess: () => {
      // Clear the auth query cache
      queryClient.setQueryData(['auth'], null);
      // Optionally clear all queries
      queryClient.clear();
    },
  });

  return {
    user: authQuery.data,
    isLoading: authQuery.isLoading,
    isAuthenticated: authQuery.data !== null,
    login: loginMutation.mutateAsync,
    logout: () => logoutMutation.mutate(),
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
  };
}
