"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Plane, Calendar, Euro, Mail, Loader2, MapPin, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Switch } from "@/components/ui/switch";
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
import { addDays, format } from "date-fns";

const flightSchema = z
	.object({
		email: z.string().email("Please enter a valid email address"),
		origin: z.string().min(1, "Please select origin airport"),
		destination: z.string().min(1, "Please select destination airport"),
		dateRange: z.object({
			from: z.date({ message: "Please select departure date" }),
			to: z.date({ message: "Please select return date" }),
		}),
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
			dateRange: {
				from: addDays(new Date(), 1),
				to: addDays(new Date(), 8),
			},
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
					outboundDate: format(data.dateRange.from, "yyyy-MM-dd"),
					returnDate: format(data.dateRange.to, "yyyy-MM-dd"),
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
					dateRange: {
						from: addDays(new Date(), 1),
						to: addDays(new Date(), 8),
					},
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
		<div className="max-w-4xl mx-auto px-4">
			{/* Header Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="text-center mb-8"
			>
				<motion.div
					initial={{ scale: 0.8 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.1, duration: 0.2 }}
					className="flex items-center justify-center gap-3 mb-4"
				>
					<div className="rounded-full bg-blue-500/10 p-3 border border-blue-500/20">
						<Plane className="h-8 w-8 text-blue-400" />
					</div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
						Flight Price Watcher
					</h1>
				</motion.div>
				<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
					Monitor Ryanair flight prices and get email alerts when prices drop below your threshold
				</p>
			</motion.div>

			{/* Main Form Card */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3, delay: 0.2 }}
			>
				<Card className="backdrop-blur-sm bg-card/50 border shadow-2xl">
					<CardHeader className="pb-6">
						<motion.div
							initial={{ scale: 0.8 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.3, duration: 0.2 }}
							className="text-center"
						>
							<CardTitle className="text-xl text-foreground mb-2">Create Price Alert</CardTitle>
							<CardDescription className="text-muted-foreground">
								Set up monitoring for your desired flight route
							</CardDescription>
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
								{/* Flight Route Section */}
								<div className="space-y-4">
									<div className="text-center border-b border-border pb-4">
										<h3 className="text-lg font-semibold text-foreground flex items-center justify-center gap-2">
											<MapPin className="h-5 w-5 text-blue-400" />
											Flight Route
										</h3>
										<p className="text-muted-foreground text-sm mt-1">Select your departure and destination airports</p>
									</div>

									<div className="flex items-center gap-4">
										<div className="flex-1">
											<FormField
												control={form.control}
												name="origin"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-foreground font-medium">From</FormLabel>
														<FormControl>
															<Select
																value={field.value}
																onValueChange={field.onChange}
															>
																<SelectTrigger className="h-12 bg-input border-border hover:bg-accent transition-colors">
																	<div className="flex items-center gap-2">
																		<MapPin className="h-4 w-4 text-blue-400" />
																		<SelectValue placeholder="Select origin airport" />
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

										<div className="flex flex-col items-center pt-6">
											<motion.button
												type="button"
												onClick={() => {
													const origin = form.getValues("origin");
													const destination = form.getValues("destination");
													form.setValue("origin", destination);
													form.setValue("destination", origin);
												}}
												className="p-3 rounded-full bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-200"
												whileHover={{ scale: 1.1, rotate: 180 }}
												whileTap={{ scale: 0.9 }}
												disabled={!form.getValues("origin") && !form.getValues("destination")}
											>
												<ArrowLeftRight className="h-4 w-4 text-blue-400" />
											</motion.button>
										</div>

										<div className="flex-1">
											<FormField
												control={form.control}
												name="destination"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-foreground font-medium">To</FormLabel>
														<FormControl>
															<Select
																value={field.value}
																onValueChange={field.onChange}
															>
																<SelectTrigger className="h-12 bg-input border-border hover:bg-accent transition-colors">
																	<div className="flex items-center gap-2">
																		<MapPin className="h-4 w-4 text-green-400" />
																		<SelectValue placeholder="Select destination airport" />
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
									</div>
								</div>

								{/* Travel Dates Section */}
								<div className="space-y-4">
									<div className="text-center border-b border-border pb-4">
										<h3 className="text-lg font-semibold text-foreground flex items-center justify-center gap-2">
											<Calendar className="h-5 w-5 text-purple-400" />
											Travel Dates
										</h3>
										<p className="text-muted-foreground text-sm mt-1">Select your travel dates</p>
									</div>

									<FormField
										control={form.control}
										name="dateRange"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-foreground font-medium">Travel Period</FormLabel>
												<FormControl>
													<DateRangePicker
														value={field.value}
														onChange={field.onChange}
														disabled={isPending}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Price Threshold Section */}
								<div className="space-y-4">
									<div className="text-center border-b border-border pb-4">
										<h3 className="text-lg font-semibold text-foreground flex items-center justify-center gap-2">
											<Euro className="h-5 w-5 text-green-400" />
											Price Alert Settings
										</h3>
										<p className="text-muted-foreground text-sm mt-1">Set your price threshold and monitoring preferences</p>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<FormField
											control={form.control}
											name="priceThreshold"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-foreground font-medium">Maximum Price (€)</FormLabel>
													<FormControl>
														<div className="relative">
															<Euro className="absolute left-3 top-3 h-4 w-4 text-green-400" />
															<Input
																{...field}
																type="number"
																placeholder="25"
																className="pl-10 h-12 bg-input border-border text-foreground"
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
													<FormLabel className="text-foreground font-medium">Email for Alerts</FormLabel>
													<FormControl>
														<div className="relative">
															<Mail className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
															<Input
																{...field}
																type="email"
																className="pl-10 h-12 bg-input border-border text-foreground"
																disabled={isPending}
																readOnly
															/>
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>

								{/* Flight Direction Section */}
								<div className="space-y-4">
									<div className="text-center border-b border-border pb-4">
										<h3 className="text-lg font-semibold text-foreground flex items-center justify-center gap-2">
											<Plane className="h-5 w-5 text-orange-400" />
											Monitor Directions
										</h3>
										<p className="text-muted-foreground text-sm mt-1">Choose which flight directions to monitor</p>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="checkOutbound"
											render={({ field }) => (
												<FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-card/50">
													<div className="space-y-0.5">
														<FormLabel className="text-foreground font-medium">
															Monitor Outbound
														</FormLabel>
														<p className="text-muted-foreground text-sm">
															Get alerts for departure flights
														</p>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="checkReturn"
											render={({ field }) => (
												<FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-card/50">
													<div className="space-y-0.5">
														<FormLabel className="text-foreground font-medium">
															Monitor Return
														</FormLabel>
														<p className="text-muted-foreground text-sm">
															Get alerts for return flights
														</p>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>
									<FormMessage />
								</div>

								{/* Submit Button */}
								<motion.div
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<Button
										type="submit"
										className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
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

			{/* Information Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3, delay: 0.4 }}
				className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
			>
				<Card className="bg-card/30 backdrop-blur-sm border border-border/50">
					<CardContent className="p-6 text-center">
						<div className="rounded-full bg-blue-500/10 p-3 border border-blue-500/20 mx-auto mb-4 w-fit">
							<Mail className="h-6 w-6 text-blue-400" />
						</div>
						<h3 className="font-semibold text-foreground mb-2">Email Alerts</h3>
						<p className="text-muted-foreground text-sm">
							Get notified instantly when flight prices drop below your threshold
						</p>
					</CardContent>
				</Card>

				<Card className="bg-card/30 backdrop-blur-sm border border-border/50">
					<CardContent className="p-6 text-center">
						<div className="rounded-full bg-purple-500/10 p-3 border border-purple-500/20 mx-auto mb-4 w-fit">
							<Calendar className="h-6 w-6 text-purple-400" />
						</div>
						<h3 className="font-semibold text-foreground mb-2">Real-time Monitoring</h3>
						<p className="text-muted-foreground text-sm">
							Continuous price checking to catch the best deals
						</p>
					</CardContent>
				</Card>

				<Card className="bg-card/30 backdrop-blur-sm border border-border/50">
					<CardContent className="p-6 text-center">
						<div className="rounded-full bg-green-500/10 p-3 border border-green-500/20 mx-auto mb-4 w-fit">
							<Euro className="h-6 w-6 text-green-400" />
						</div>
						<h3 className="font-semibold text-foreground mb-2">Save Money</h3>
						<p className="text-muted-foreground text-sm">
							Never miss a price drop and save on your travel expenses
						</p>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}
