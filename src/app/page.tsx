"use client";

import { motion } from "framer-motion";

import { LoginForm } from "@/components/login-form";
import { FlightForm } from "@/components/flight-form";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks";

export default function HomePage() {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					className="flex items-center gap-3"
				>
					<div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
					<span className="text-muted-foreground">Loading...</span>
				</motion.div>
			</div>
		);
	}

	if (!user) {
		return <LoginForm />;
	}

	return (
		<div className="min-h-screen">
			<Header userEmail={user.email} />
			<main className="py-8 px-4">
				<FlightForm userEmail={user.email} />
			</main>
		</div>
	);
}
