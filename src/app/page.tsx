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
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					className="flex items-center gap-3"
				>
					<div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
					<span className="text-slate-300">Loading...</span>
				</motion.div>
			</div>
		);
	}

	if (!user) {
		return <LoginForm onLoginSuccess={handleLoginSuccess} />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
			<Header userEmail={user.email} onLogout={handleLogout} />
			<main className="py-8">
				<FlightForm userEmail={user.email} />
			</main>
		</div>
	);
}
