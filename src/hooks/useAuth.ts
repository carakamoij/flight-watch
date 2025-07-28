// Replaced by TanStack Query hooks. Legacy code below is commented out for reference.
/*
"use client";

import { useContext } from "react";
import { AuthContext, type AuthContextType } from "../contexts/AuthContext";

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

export function useAuthQuery() {
	const { user, isAuthenticated, isLoading } = useAuth();
	return { isAuthenticated, isLoading, user };
}

// DEV ONLY: Use this to force isAdmin=true for all users
export function useAuthQueryAdminMock() {
	const { user, isAuthenticated, isLoading } = useAuth();
	const userWithAdmin = user ? { ...user, isAdmin: true } : undefined;
	return { isAuthenticated, isLoading, user: userWithAdmin };
}
*/
// All authentication logic is now handled by TanStack Query hooks in useAuthQuery.ts
