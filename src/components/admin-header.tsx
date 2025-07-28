"use client";

import { Header } from "@/components/header";
import { useAuthQueryAdminMock } from "@/hooks";

export function AdminHeader() {
	// Use the mock admin hook to ensure admin context in dev
	useAuthQueryAdminMock();
	// Header will read user and isAdmin from the auth hook
	return <Header />;
}
