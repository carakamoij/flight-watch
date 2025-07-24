"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Plane, Calendar, Euro, Mail, Loader2, MapPin } from "lucide-react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { n8nApi } from "@/lib/api";
import { airports, defaultSearchParams } from "@/lib/data";
import type { FlightSearchParams } from "@/lib/types";

const flightSchema = z
	.object({
		email: z.string().email("Please enter a valid email address"),
		origin: z.string().min(1, "Please select origin airport"),
		destination: z.string().min(1, "Please select destination airport"),
		outboundDate: z.string().min(1, "Please enter outbound date"),
		returnDate: z.string().min(1, "Please enter return date"),
		priceThreshold: z.number().min(1, "Price threshold must be at least €1"),
		checkOutbound: z.boolean(),
		checkReturn: z.boolean(),
		currency: z.string(),
	})
	.refine((data) => data.checkOutbound || data.checkReturn, {
		message: "Please select at least one flight direction to monitor",
		path: ["checkOutbound"],
	});

type FlightForm = z.infer<typeof flightSchema>;

interface FlightFormProps {
	userEmail: string;
}

export function FlightForm({ userEmail }: FlightFormProps) {
	const [isPending, startTransition] = useTransition();

	const form = useForm<FlightForm>({
		resolver: zodResolver(flightSchema),
		defaultValues: {
			email: userEmail,
			origin: "",
			destination: "",
			outboundDate: "",
			returnDate: "",
			priceThreshold: defaultSearchParams.priceThreshold,
			checkOutbound: defaultSearchParams.checkOutbound,
			checkReturn: defaultSearchParams.checkReturn,
			currency: defaultSearchParams.currency,
		},
	});

	const onSubmit = (data: FlightForm) => {
		startTransition(async () => {
			try {
				const params: FlightSearchParams = {
					email: data.email,
					origin: data.origin,
					destination: data.destination,
					outboundDate: data.outboundDate,
					returnDate: data.returnDate,
					priceThreshold: data.priceThreshold,
					checkOutbound: data.checkOutbound,
					checkReturn: data.checkReturn,
					currency: data.currency,
				};

				await n8nApi.createOrUpdateTask(params);
				toast.success("Flight price alert created successfully!");

				// Reset form for new search
				form.reset({
					email: userEmail,
					origin: "",
					destination: "",
					outboundDate: "",
					returnDate: "",
					priceThreshold: defaultSearchParams.priceThreshold,
					checkOutbound: defaultSearchParams.checkOutbound,
					checkReturn: defaultSearchParams.checkReturn,
					currency: defaultSearchParams.currency,
				});
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "Failed to create alert"
				);
			}
		});
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<Card>
				<CardHeader>
					<motion.div
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.1, duration: 0.2 }}
						className="flex items-center gap-2"
					>
						<div className="rounded-full bg-primary/10 p-2">
							<Plane className="h-5 w-5 text-primary" />
						</div>
						<div>
							<CardTitle>Create Price Alert</CardTitle>
							<CardDescription>
								Monitor Ryanair flight prices and get email alerts when prices
								drop
							</CardDescription>
						</div>
					</motion.div>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<motion.form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2, duration: 0.3 }}
						>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="origin"
									render={({ field }) => (
										<FormItem>
											<FormLabel>From</FormLabel>
											<FormControl>
												<Select
													value={field.value}
													onValueChange={field.onChange}
												>
													<SelectTrigger>
														<div className="flex items-center gap-2">
															<MapPin className="h-4 w-4 text-muted-foreground" />
															<SelectValue placeholder="Select origin" />
														</div>
													</SelectTrigger>
													<SelectContent>
														{airports.map((airport) => (
															<SelectItem
																key={airport.name}
																value={airport.name}
															>
																{airport.name} ({airport.code})
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="destination"
									render={({ field }) => (
										<FormItem>
											<FormLabel>To</FormLabel>
											<FormControl>
												<Select
													value={field.value}
													onValueChange={field.onChange}
												>
													<SelectTrigger>
														<div className="flex items-center gap-2">
															<MapPin className="h-4 w-4 text-muted-foreground" />
															<SelectValue placeholder="Select destination" />
														</div>
													</SelectTrigger>
													<SelectContent>
														{airports.map((airport) => (
															<SelectItem
																key={airport.name}
																value={airport.name}
															>
																{airport.name} ({airport.code})
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="outboundDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Outbound Date</FormLabel>
											<FormControl>
												<div className="relative">
													<Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
													<Input
														{...field}
														type="date"
														className="pl-10"
														disabled={isPending}
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="returnDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Return Date</FormLabel>
											<FormControl>
												<div className="relative">
													<Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
													<Input
														{...field}
														type="date"
														className="pl-10"
														disabled={isPending}
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="priceThreshold"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Price Alert Threshold</FormLabel>
										<FormControl>
											<div className="relative">
												<Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
												<Input
													{...field}
													type="number"
													placeholder="25"
													className="pl-10"
													disabled={isPending}
													onChange={(e) =>
														field.onChange(Number(e.target.value))
													}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email for Alerts</FormLabel>
										<FormControl>
											<div className="relative">
												<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
												<Input
													{...field}
													type="email"
													className="pl-10"
													disabled={isPending}
													readOnly
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<motion.div
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<Button
									type="submit"
									className="w-full"
									disabled={isPending}
									size="lg"
								>
									{isPending ? (
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											className="flex items-center gap-2"
										>
											<Loader2 className="h-4 w-4 animate-spin" />
											Creating Alert...
										</motion.div>
									) : (
										<motion.span
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											className="flex items-center gap-2"
										>
											<Plane className="h-4 w-4" />
											Create Price Alert
										</motion.span>
									)}
								</Button>
							</motion.div>
						</motion.form>
					</Form>
				</CardContent>
			</Card>
		</motion.div>
	);
}
