"use client";

import React, { createContext, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { decodeJwt } from "@/lib/jwt";
import type { AuthUser } from "../lib/types";
import { useLogin } from "@/hooks/useLogin";

const AUTH_TOKEN_KEY = "flight-watcher-auth";

interface AuthContextType {
	user: AuthUser | null;
	isAuthenticated: boolean;
	login: (params: {
		email: string;
		secretKey: string;
		pin: string;
	}) => Promise<void>;
	logout: () => void;
	isLoading: boolean;
	loginError: Error | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useLocalStorage<string | null>(
		AUTH_TOKEN_KEY,
		null
	);
	// Use the useLoginMutation hook.
	const {
		mutateAsync: loginMutation,
		isPending: isLoading,
		error: loginError,
	} = useLogin();

	const login = async ({
		email,
		secretKey,
		pin,
	}: {
		email: string;
		secretKey: string;
		pin: string;
	}) => {
		try {
			const token = await loginMutation({ email, secretKey, pin });
			setToken(token);
		} catch (error) {
			error = error instanceof Error ? error : new Error("Login failed");
			throw error;
		}
	};

	// Derive user from token
	const user = React.useMemo(() => {
		if (!token) return null;
		const decoded = decodeJwt(token);
		if (!decoded || (decoded.exp && Date.now() / 1000 > decoded.exp))
			return null;
		return {
			token,
			isAdmin: !!decoded.isAdmin,
			email: decoded.email || "",
		} as AuthUser;
	}, [token]);

	// Logout function
	const logout = () => {
		setToken(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
				login,
				logout,
				isLoading,
				loginError,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
