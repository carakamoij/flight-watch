"use client";

import { AdminHeader } from "@/components/admin-header";
import { useAuthQueryAdminMock } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppLoading from "@/app/loading";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, isAuthenticated, isLoading } = useAuthQueryAdminMock();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && (!isAuthenticated || !user?.isAdmin)) {
			router.replace("/dashboard");
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
