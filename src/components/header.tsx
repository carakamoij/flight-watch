"use client";

import { motion } from "framer-motion";
import { LogOut, Plane, Moon, Sun, Menu } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks";
import { usePathname } from "next/navigation";

export function Header() {
	const { theme, setTheme } = useTheme();
	const { user, logout } = useAuth();
	const pathname = usePathname();

	// Determine if we should show the admin/dashboard link
	const isAdmin = user?.isAdmin;
	const isOnAdmin = pathname.startsWith("/admin");

	const handleLogout = () => {
		logout(); // use mutate, not mutateAsync
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
									<p className="text-sm text-muted-foreground hidden sm:block">
										Monitoring flights for {user.email}
									</p>
								</>
							) : (
								<h1 className="text-xl font-semibold">Flight Price Watcher</h1>
							)}
						</div>
					</motion.div>

					{/* Desktop/tablet button group: visible from md and up */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.3 }}
						className="hidden md:flex items-center gap-2"
					>
						{isAdmin && user?.email && (
							<span className="text-sm text-muted-foreground font-mono">
								{user.email}
							</span>
						)}
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

					{/* Mobile menu: visible below md */}
					<div className="flex md:hidden items-center gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<motion.button
									type="button"
									className="rounded-full bg-transparent p-0 border-0"
									whileTap={{ scale: 0.9 }}
									initial={{ rotate: 0 }}
									animate={{ rotate: theme === "dark" ? 180 : 0 }}
									transition={{ type: "spring", stiffness: 300, damping: 20 }}
								>
									<motion.span
										initial={{ rotate: 0 }}
										animate={{ rotate: theme === "dark" ? 180 : 0 }}
										transition={{ type: "spring", stiffness: 300, damping: 20 }}
									>
										<Menu className="h-5 w-5" />
									</motion.span>
								</motion.button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" asChild>
								<motion.div
									initial={{ opacity: 0, scale: 0.95, y: -10 }}
									animate={{ opacity: 1, scale: 1, y: 0 }}
									exit={{ opacity: 0, scale: 0.95, y: -10 }}
									transition={{
										duration: 0.2,
										type: "spring",
										stiffness: 300,
										damping: 25,
									}}
								>
									{isAdmin && user?.email && (
										<DropdownMenuLabel>{user.email}</DropdownMenuLabel>
									)}
									{isAdmin && (
										<DropdownMenuItem asChild>
											<a href={isOnAdmin ? "/dashboard" : "/admin"}>
												{isOnAdmin ? "Dashboard" : "Admin Panel"}
											</a>
										</DropdownMenuItem>
									)}
									<DropdownMenuItem onClick={toggleTheme}>
										{theme === "dark" ? "Light Mode" : "Dark Mode"}
									</DropdownMenuItem>
									<DropdownMenuItem onClick={handleLogout}>
										<LogOut className="h-4 w-4 mr-2" />
										Logout
									</DropdownMenuItem>
								</motion.div>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</motion.header>
	);
}
