"use client";
import { Header } from "@/components/header";
import AppLoading from "@/app/loading";
import { useAuthQuery } from "@/hooks";

export function HeaderClient() {
	const { isLoading, isAuthenticated } = useAuthQuery();
	if (isLoading) return <AppLoading />;
	if (!isAuthenticated) return null;
	return <Header />;
}
