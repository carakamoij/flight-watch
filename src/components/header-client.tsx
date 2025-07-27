"use client";
import { Header } from "@/components/header";
import { useAuthQuery } from "@/hooks";

export function HeaderClient() {
	const { user } = useAuthQuery();
	return <Header userEmail={user?.email ?? ""} />;
}
