"use client";

import { AdminHeader } from "@/components/admin-header";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppLoading from "@/app/loading";
import { useAuth } from "@/hooks";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && (!isAuthenticated || !user?.isAdmin)) {
			router.replace("/login");
		}
	}, [isAuthenticated, isLoading, user, router]);

	if (isLoading) return <AppLoading />;
	if (!user?.isAdmin) return null;

	return (
		<>
			<AdminHeader />
			{children}
		</>
	);
}
