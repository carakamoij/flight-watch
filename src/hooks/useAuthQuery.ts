"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "../env.mjs";
import type { AuthUser } from "../lib/types";
import { useEffect, useMemo } from "react";

const AUTH_TOKEN_KEY = "flight-watcher-auth";
const TOKEN_EXPIRY_DAYS = 7;

// Session verification with n8n
async function verifySession(token: string): Promise<boolean> {
	try {
		const response = await fetch(
			`${env.NEXT_PUBLIC_N8N_BASE_URL}/webhook/auth/verify`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return response.ok;
	} catch {
		return false;
	}
}

function getStoredUser(): AuthUser | null {
	if (typeof window === "undefined") return null;

	try {
		const stored = localStorage.getItem(AUTH_TOKEN_KEY);
		if (!stored) return null;

		const user: AuthUser = JSON.parse(stored);

		// Check if token is expired
		const daysSinceLogin =
			(Date.now() - user.loginTime) / (1000 * 60 * 60 * 24);
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

	// Auth state query with session verification
	const authQuery = useQuery({
		queryKey: ["auth"],
		queryFn: async () => {
			const storedUser = getStoredUser();
			if (!storedUser) return null;

			// Verify session with n8n backend
			const isValid = await verifySession(storedUser.token);
			if (!isValid) {
				localStorage.removeItem(AUTH_TOKEN_KEY);
				return null;
			}

			return storedUser;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchOnWindowFocus: true, // Verify on window focus
	});

	// Login mutation
	const loginMutation = useMutation({
		mutationFn: async ({
			email,
			password,
			pin,
		}: {
			email: string;
			password: string;
			pin?: string;
		}) => {
			// Call n8n authentication endpoint
			const response = await fetch(
				`${env.NEXT_PUBLIC_N8N_BASE_URL}/webhook/auth/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email,
						secretKey: password,
						pin,
					}),
				}
			);

			if (!response.ok) {
				const error = await response
					.json()
					.catch(() => ({ message: "Authentication failed" }));
				throw new Error(error.message || "Invalid credentials");
			}

			const { token, user } = await response.json();

			// Store JWT token securely
			const newUser: AuthUser = {
				email: user.email || email,
				token, // JWT token from n8n
				loginTime: Date.now(),
				isAdmin: user.isAdmin ?? user.is_admin, // support both for now
			};

			localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(newUser));
			return newUser;
		},
		onSuccess: (user) => {
			// Update the auth query cache
			queryClient.setQueryData(["auth"], user);
		},
	});

	// Logout mutation
	const logoutMutation = useMutation({
		mutationFn: async () => {
			localStorage.removeItem(AUTH_TOKEN_KEY);
		},
		onSuccess: () => {
			// Clear the auth query cache
			queryClient.setQueryData(["auth"], null);
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

// DEV ONLY: Use this to force isAdmin=true and isAuthenticated=true for all users
export function useAuthQueryAdminMock() {
	const mockUser = useMemo(
		() => ({
			id: "1",
			email: "admin@example.com",
			token: "mock-token",
			loginTime: Date.now(),
			isAdmin: true,
			is_active: true,
			tasksCount: 5,
		}),
		[]
	);
	return {
		isAuthenticated: true,
		isLoading: false,
		user: mockUser,
	};
}
