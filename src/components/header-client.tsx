"use client";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks";

export function HeaderClient() {
	const { user } = useAuth();
	return <Header userEmail={user?.email ?? ""} />;
}
