"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
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
import { useAuth } from "@/hooks";

const loginSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm() {
	const [isPending, startTransition] = useTransition();
	const { login } = useAuth();

	const form = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = (data: LoginForm) => {
		startTransition(async () => {
			try {
				await login(data.email, data.password);
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
							Enter your email and secret password to access the flight watcher
						</CardDescription>
					</CardHeader>
					<CardContent>
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
															disabled={isPending}
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
												<FormLabel>Secret Password</FormLabel>
												<FormControl>
													<div className="relative">
														<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
														<Input
															{...field}
															type="password"
															name="password"
															autoComplete="current-password"
															placeholder="Enter secret password"
															className="pl-10"
															disabled={isPending}
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
											disabled={isPending}
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
					</CardContent>
				</div>
			</motion.div>
		</div>
	);
}
