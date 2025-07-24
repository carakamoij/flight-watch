"use client";

import { motion } from "framer-motion";
import { LogOut, Plane, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { authService } from "@/lib/auth";

interface HeaderProps {
	userEmail: string;
	onLogout: () => void;
}

export function Header({ userEmail, onLogout }: HeaderProps) {
	const { theme, setTheme } = useTheme();

	const handleLogout = () => {
		authService.logout();
		onLogout();
	};

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	return (
		<motion.header
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60"
		>
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<motion.div
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.1, duration: 0.2 }}
						className="flex items-center gap-2"
					>
						<div className="rounded-lg bg-primary/10 p-2">
							<Plane className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h1 className="text-xl font-semibold">Flight Price Watcher</h1>
							<p className="text-sm text-muted-foreground">
								Monitoring flights for {userEmail}
							</p>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.3 }}
						className="flex items-center gap-2"
					>
						<Button
							variant="ghost"
							size="icon"
							onClick={toggleTheme}
							className="rounded-full"
						>
							{theme === "dark" ? (
								<Sun className="h-4 w-4" />
							) : (
								<Moon className="h-4 w-4" />
							)}
						</Button>

						<Button
							variant="outline"
							onClick={handleLogout}
							className="flex items-center gap-2"
						>
							<LogOut className="h-4 w-4" />
							Logout
						</Button>
					</motion.div>
				</div>
			</div>
		</motion.header>
	);
}
