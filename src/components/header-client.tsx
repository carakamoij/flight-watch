"use client";
import { Header } from "@/components/header";
import AppLoading from "@/app/loading";
import { useAuth } from "@/hooks";

export function HeaderClient() {
	const { isLoading, isAuthenticated } = useAuth();
	if (isLoading) return <AppLoading />;
	if (!isAuthenticated) return null;
	return <Header />;
}
