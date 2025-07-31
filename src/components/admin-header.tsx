// This file has been removed as it is no longer used in the new context-based auth flow.
"use client";

import AppLoading from "@/app/loading";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks";

export function AdminHeader() {
	// Header will read user and isAdmin from the auth hook
	const { isLoading, isAuthenticated } = useAuth();
	if (isLoading) return <AppLoading />;
	if (!isAuthenticated) return null;
	return <Header />;
}
