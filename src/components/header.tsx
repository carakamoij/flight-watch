"use client";

import { motion } from "framer-motion";
import { LogOut, Plane, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

import { useAuthQueryAdminMock, useAuthQuery } from "@/hooks";
import { usePathname } from "next/navigation";

export function Header() {
	const { theme, setTheme } = useTheme();
	const { user } = useAuthQueryAdminMock();
	const { logout } = useAuthQuery();
	const pathname = usePathname();

	// Determine if we should show the admin/dashboard link
	const isAdmin = user?.isAdmin;
	const isOnAdmin = pathname.startsWith("/admin");

	const handleLogout = () => {
		if (typeof logout === "function") {
			logout(); // use mutate, not mutateAsync
		} else {
			// fallback: clear localStorage and reload
			localStorage.removeItem("flight-watcher-auth");
			window.location.reload();
		}
	};

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	return (
		<motion.header
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="sticky top-0 z-50 border-b border-header-700/50 bg-header/80 backdrop-blur-sm supports-[backdrop-filter]:bg-header-900/80"
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
							{user?.isAdmin && pathname.startsWith("/admin") ? (
								<h1 className="text-xl font-semibold">Admin Panel</h1>
							) : user?.email ? (
								<>
									<h1 className="text-xl font-semibold">
										Flight Price Watcher
									</h1>
									<p className="text-sm text-muted-foreground">
										Monitoring flights for {user.email}
									</p>
								</>
							) : (
								<h1 className="text-xl font-semibold">Flight Price Watcher</h1>
							)}
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.3 }}
						className="flex items-center gap-2"
					>
						{isAdmin && user?.email && (
							<span className="text-sm text-muted-foreground font-mono">
								{user.email}
							</span>
						)}

						{/* Admin/dashboard button for admins */}
						{isAdmin && (
							<Button asChild variant="secondary" size="sm" className="px-3">
								<a href={isOnAdmin ? "/dashboard" : "/admin"}>
									{isOnAdmin ? "Dashboard" : "Admin Panel"}
								</a>
							</Button>
						)}
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
