"use client";

import { useTransition, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Loader2, Hash } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useAuthQuery } from "@/hooks/useAuthQuery";

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1, "Secret key is required"),
	pin: z
		.string()
		.min(6, "PIN must be exactly 6 digits")
		.max(6, "PIN must be exactly 6 digits")
		.regex(/^\d{6}$/, "PIN must contain only numbers"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm() {
	const [isPending, startTransition] = useTransition();
	const [pinInputType, setPinInputType] = useState<"text" | "password">("text");
	const [pinTimeoutId, setPinTimeoutId] = useState<NodeJS.Timeout | null>(null);
	const { login, isLoginLoading } = useAuthQuery();

	const isLoading = isPending || isLoginLoading;

	const form = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
			pin: "",
		},
	});

	const handlePinChange = (value: string) => {
		// Clear existing timeout
		if (pinTimeoutId) {
			clearTimeout(pinTimeoutId);
		}

		// Show the digits while typing
		setPinInputType("text");

		// Set timeout to hide digits after 1 second of no typing
		const timeoutId = setTimeout(() => {
			setPinInputType("password");
		}, 1000);

		setPinTimeoutId(timeoutId);

		// Update form value
		form.setValue("pin", value);
	};

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (pinTimeoutId) {
				clearTimeout(pinTimeoutId);
			}
		};
	}, [pinTimeoutId]);

	const onSubmit = (data: LoginForm) => {
		startTransition(async () => {
			try {
				// Use the new JWT-based authentication via n8n
				await login({
					email: data.email,
					password: data.password, // This is the secret key
					pin: data.pin,
				});
				toast.success("Successfully logged in!");
			} catch (error) {
				toast.error(error instanceof Error ? error.message : "Login failed");
			}
		});
	};

	return (
		<div className="min-h-screen">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="flex min-h-screen items-center justify-center p-4"
			>
				<div className="w-full max-w-md bg-gradient-card backdrop-blur-sm border-border/50 shadow-2xl rounded-2xl py-6">
					<CardHeader className="space-y-1">
						<motion.div
							initial={{ scale: 0.8 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.1, duration: 0.2 }}
							className="flex items-center justify-center mb-4"
						>
							<div className="rounded-full bg-primary/10 p-3">
								<LogIn className="h-6 w-6 text-primary" />
							</div>
						</motion.div>
						<CardTitle className="text-2xl text-center">Welcome back</CardTitle>
						<CardDescription className="text-center">
							Enter your email, secret key, and PIN to access the flight watcher
						</CardDescription>
					</CardHeader>
					<CardContent className="mt-3">
						<Form {...form}>
							<motion.form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
								initial="hidden"
								animate="visible"
								variants={{
									hidden: {},
									visible: { transition: { staggerChildren: 0.13 } },
								}}
							>
								<motion.div
									variants={{
										hidden: { opacity: 0, y: 20 },
										visible: { opacity: 1, y: 0 },
									}}
								>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<div className="relative">
														<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
														<Input
															{...field}
															type="email"
															name="email"
															autoComplete="email"
															placeholder="your.email@example.com"
															className="pl-10"
															disabled={isLoading}
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</motion.div>

								<motion.div
									variants={{
										hidden: { opacity: 0, y: 20 },
										visible: { opacity: 1, y: 0 },
									}}
								>
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Secret Key</FormLabel>
												<FormControl>
													<div className="relative">
														<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
														<Input
															{...field}
															type="password"
															name="password"
															autoComplete="current-password"
															placeholder="Enter secret key"
															className="pl-10"
															disabled={isLoading}
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</motion.div>

								<motion.div
									variants={{
										hidden: { opacity: 0, y: 20 },
										visible: { opacity: 1, y: 0 },
									}}
								>
									<FormField
										control={form.control}
										name="pin"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Your 6-Digit PIN</FormLabel>
												<FormControl>
													<div className="relative">
														<Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
														<Input
															{...field}
															type={pinInputType}
															placeholder="123456"
															maxLength={6}
															disabled={isLoading}
															className="pl-10 text-center font-mono text-lg tracking-widest"
															onChange={(e) => {
																handlePinChange(e.target.value);
															}}
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</motion.div>

								<motion.div
									variants={{
										hidden: { opacity: 0, y: 20 },
										visible: { opacity: 1, y: 0 },
									}}
								>
									<motion.div
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<Button
											type="submit"
											className="w-full h-12 mt-2"
											disabled={isLoading}
										>
											{isPending ? (
												<motion.div
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													className="flex items-center gap-2"
												>
													<Loader2 className="h-4 w-4 animate-spin" />
													Signing in...
												</motion.div>
											) : (
												<motion.span
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
												>
													Sign in
												</motion.span>
											)}
										</Button>
									</motion.div>
								</motion.div>
							</motion.form>
						</Form>

						{/* Register Link */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
							className="text-center mt-6"
						>
							<p className="text-sm text-muted-foreground">
								Don&apos;t have an account?{" "}
								<Link
									href="/register"
									className="font-medium text-primary hover:underline"
								>
									Create one
								</Link>
							</p>
						</motion.div>
					</CardContent>
				</div>
			</motion.div>
		</div>
	);
}
