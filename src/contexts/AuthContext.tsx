"use client";

import React, {
	createContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import { env } from "../env.mjs";
import type { AuthUser } from "../lib/types";

const AUTH_TOKEN_KEY = "flight-watcher-auth";
const TOKEN_EXPIRY_DAYS = 7;

export interface AuthContextType {
	user: AuthUser | null;
	login: (email: string, password: string, pin?: string) => Promise<void>;
	logout: () => void;
	isAuthenticated: boolean;
	isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

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

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Initialize user state from localStorage on mount
		const storedUser = getStoredUser();
		setUser(storedUser);
		setIsLoading(false);
	}, []);

	const login = async (
		email: string,
		password: string,
		pin?: string
	): Promise<void> => {
		// TODO: Remove this client-side validation when backend is ready
		// Backend will validate secret key (salted/hashed) and PIN
		// Secret key will be stored in backend, not in client env vars
		if (password !== env.NEXT_PUBLIC_APP_SECRET) {
			throw new Error("Invalid credentials");
		}

		// TODO: Add PIN validation when backend is ready
		// PIN will be validated against user's individual PIN in backend
		if (pin) {
			console.log("PIN provided:", pin);
		}

		const newUser: AuthUser = {
			email,
			token: generateToken(email),
			loginTime: Date.now(),
		};

		localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(newUser));
		setUser(newUser);
	};

	const logout = (): void => {
		localStorage.removeItem(AUTH_TOKEN_KEY);
		setUser(null);
	};

	const value = {
		user,
		login,
		logout,
		isAuthenticated: user !== null,
		isLoading,
	};

	return React.createElement(AuthContext.Provider, { value }, children);
}
