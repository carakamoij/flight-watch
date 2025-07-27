"use client";

import { useAuthQuery } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { FlightForm } from "@/components/flight-form";
import { TanStackQueryTest } from "@/components/tanstack-query-test";
import AppLoading from "@/app/loading";

export default function DashboardPage() {
	const { isAuthenticated, isLoading, user } = useAuthQuery();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push("/login");
		}
	}, [isAuthenticated, isLoading, router]);

	if (isLoading) return <AppLoading />;
	if (!isAuthenticated) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="space-y-6"
		>
			{/* TanStack Query Test Component - Remove this after testing */}
			<TanStackQueryTest />

			<FlightForm userEmail={user?.email ?? ""} />
		</motion.div>
	);
}
