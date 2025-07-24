"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { LoginForm } from "@/components/login-form";
import { FlightForm } from "@/components/flight-form";
import { Header } from "@/components/header";
import { authService } from "@/lib/auth";

export default function HomePage() {
	const [user, setUser] = useState<{ email: string } | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check if user is already authenticated
		const currentUser = authService.getCurrentUser();
		setUser(currentUser);
		setIsLoading(false);
	}, []);

	const handleLoginSuccess = () => {
		const currentUser = authService.getCurrentUser();
		setUser(currentUser);
	};

	const handleLogout = () => {
		setUser(null);
	};

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
		return <LoginForm onLoginSuccess={handleLoginSuccess} />;
	}

	return (
		<div className="min-h-screen bg-background">
			<Header userEmail={user.email} onLogout={handleLogout} />
			<main className="py-8 px-4">
				<FlightForm userEmail={user.email} />
			</main>
		</div>
	);
}
