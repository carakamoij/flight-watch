"use client";

import { useState, startTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { UserPlus, Loader2 } from "lucide-react";
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
import { useRegister } from "@/hooks";
import { toast } from "sonner";
import { N8nResponse } from "@/lib/types";

const registerSchema = z.object({
	email: z.string().min(1, "Email is required").email(),
	pin: z
		.string()
		.min(6, "PIN must be exactly 6 digits")
		.max(6, "PIN must be exactly 6 digits")
		.regex(/^\d{6}$/, "PIN must contain only numbers"),
	secretKey: z.string().min(1, "Secret key is required"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
	const [isSuccess, setIsSuccess] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [pinInputType, setPinInputType] = useState<"text" | "password">("text");
	const [pinTimeoutId, setPinTimeoutId] = useState<NodeJS.Timeout | null>(null);
	const { mutateAsync: register, isPending } = useRegister();

	const form = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: "",
			secretKey: "",
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
		// Only trigger validation if the form has been submitted at least once
		if (form.formState.isSubmitted) {
			form.trigger("pin");
		}
	};

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (pinTimeoutId) {
				clearTimeout(pinTimeoutId);
			}
		};
	}, [pinTimeoutId]);

	const onSubmit = async (data: RegisterFormData) => {
		setFormError(null);
		startTransition(async () => {
			try {
				console.log("[RegisterForm] Submitting registration", data);
				await register(data); // throws on !response.ok
				setIsSuccess(true);
				toast.success("Registration submitted successfully!");
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: typeof error === "string"
						? error
						: "Registration failed.";
				// Prefer error.message from thrown error (from useRegister)
				setFormError(message);
				toast.error(message);
			}
		});
	};

	if (isSuccess) {
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
								<div className="rounded-full bg-green-500/10 p-3">
									<UserPlus className="h-6 w-6 text-green-600" />
								</div>
							</motion.div>
							<CardTitle className="text-2xl text-center">
								Registration Submitted!
							</CardTitle>
							<CardDescription className="text-center">
								Your registration has been submitted successfully. An admin will
								review and approve your account before you can sign in.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="text-center text-sm text-muted-foreground space-y-2">
									<p>
										You&apos;ll receive an email notification once your account
										has been approved.
									</p>
									<p>
										In the meantime, you can try logging in if you already have
										an approved account.
									</p>
								</div>
								<Button asChild className="w-full">
									<Link href="/login">Go to Login Page</Link>
								</Button>
								<Button
									variant="outline"
									className="w-full"
									onClick={() => setIsSuccess(false)}
								>
									Register Another Account
								</Button>
								<div className="text-center mt-4">
									<p className="text-sm text-muted-foreground">
										Need help?{" "}
										<a
											href="mailto:support@flightwatcher.carakamoij.cc"
											className="text-primary underline"
										>
											Contact support
										</a>
									</p>
								</div>
							</div>
						</CardContent>
					</div>
				</motion.div>
			</div>
		);
	}

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
								<UserPlus className="h-6 w-6 text-primary" />
							</div>
						</motion.div>
						<CardTitle className="text-2xl text-center">
							Create Account
						</CardTitle>
						<CardDescription className="text-center">
							Enter your email and create a 6-digit PIN for your account
						</CardDescription>
						{formError && (
							<div className="mt-2 text-center text-sm text-red-600 font-medium">
								{formError}
								{formError && (
									<span className="block mt-1 text-xs text-muted-foreground">
										Need help?{" "}
										<a
											href="mailto:support@flightwatcher.carakamoij.cc"
											className="text-primary underline"
										>
											Contact support
										</a>
									</span>
								)}
							</div>
						)}
					</CardHeader>
					<CardContent className="mt-4">
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
												<FormLabel>Email Address</FormLabel>
												<FormControl>
													<Input
														{...field}
														type="email"
														placeholder="your@email.com"
														disabled={isPending}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</motion.div>

								{/* Secret Key field with extra spacing */}
								<motion.div
									className="mt-4"
									variants={{
										hidden: { opacity: 0, y: 20 },
										visible: { opacity: 1, y: 0 },
									}}
								>
									<FormField
										control={form.control}
										name="secretKey"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Secret Key</FormLabel>
												<FormControl>
													<Input
														{...field}
														type="password"
														placeholder="Enter the shared secret key"
														disabled={isPending}
													/>
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
												<FormLabel>Create Your 6-Digit PIN</FormLabel>
												<FormControl>
													<Input
														{...field}
														type={pinInputType}
														placeholder="123456"
														maxLength={6}
														disabled={isPending}
														className="text-center font-mono text-lg tracking-widest"
														onChange={(e) => {
															handlePinChange(e.target.value);
														}}
													/>
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
													Creating Account...
												</motion.div>
											) : (
												<motion.span
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
												>
													Create Account
												</motion.span>
											)}
										</Button>
									</motion.div>
								</motion.div>
							</motion.form>
						</Form>

						<div className="text-center mt-6">
							<p className="text-sm text-muted-foreground">
								Already have an account?{" "}
								<Link
									href="/login"
									className="font-medium text-primary hover:underline"
								>
									Sign in
								</Link>
							</p>
						</div>
					</CardContent>
				</div>
			</motion.div>
		</div>
	);
}
