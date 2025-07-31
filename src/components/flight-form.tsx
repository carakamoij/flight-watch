"use client";

import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { unknown, z } from "zod";
import { motion } from "framer-motion";
import {
	Plane,
	Calendar,
	Euro,
	Mail,
	Loader2,
	MapPin,
	Save,
} from "lucide-react";
import { toast } from "sonner";
import { addDays, format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Switch } from "@/components/ui/switch-copy";
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
// import { n8nApi } from "@/lib/api";
import { airports, defaultSearchParams, getAirportName } from "@/lib/data";
import type { FlightSearchParams, Task } from "@/lib/types";
import { Slider } from "./ui/slider";

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
	const [existingTasks, setExistingTasks] = useState<Task[]>([]);
	const [isLoadingTasks, setIsLoadingTasks] = useState(true);
	const [hasTasksError, setHasTasksError] = useState(false);

	const form = useForm<FlightForm>({
		resolver: zodResolver(flightSchema),
		defaultValues: {
			email: typeof userEmail === "string" ? userEmail : "",
			origin: "",
			destination: "",
			dateRange: {
				from: addDays(new Date(), 1),
				to: addDays(new Date(), 8),
			},
			priceThreshold: defaultSearchParams.priceThreshold,
			checkOutbound: defaultSearchParams.checkOutbound,
			checkReturn: defaultSearchParams.checkReturn,
		},
	});

	// Load existing tasks on component mount
	useEffect(() => {
		const loadExistingTasks = async () => {
			try {
				setIsLoadingTasks(true);
				setHasTasksError(false);
				const tasks: Task[] = []; //await n8nApi.getTasks(userEmail);
				setExistingTasks(tasks || []);

				// Pre-populate form with first existing task if available
				if (tasks && tasks.length > 0) {
					const task = tasks[0];
					form.setValue("origin", task.origin);
					form.setValue("destination", task.destination);
					form.setValue("dateRange", {
						from: new Date(task.outboundDate),
						to: new Date(task.returnDate),
					});
					form.setValue("priceThreshold", task.priceThreshold);
					form.setValue("checkOutbound", task.checkOutbound);
					form.setValue("checkReturn", task.checkReturn);
				}
			} catch (error) {
				console.error("Error loading tasks:", error);
				setHasTasksError(true);
			} finally {
				setIsLoadingTasks(false);
			}
		};

		loadExistingTasks();
	}, [userEmail, form]);

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
					currency: defaultSearchParams.currency,
				};

				//await n8nApi.createOrUpdateTask(params);
				toast.success("Flight monitoring task saved successfully!");

				// Reload tasks to show updated data
				const updatedTasks: Task[] = []; //= await n8nApi.getTasks(userEmail);
				setExistingTasks(updatedTasks || []);
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "Failed to save task"
				);
			}
		});
	};

	return (
		<div className="max-w-4xl mx-auto p-6">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				<Card className="bg-gradient-card backdrop-blur-sm border-border/50 shadow-2xl">
					<CardHeader className="pb-4">
						<div className="flex items-center gap-3">
							<div className="bg-primary/15 w-10 h-10 rounded-full flex items-center justify-center border border-primary/20">
								<Plane className="w-5 h-5 text-primary" />
							</div>
							<div>
								<CardTitle className="text-lg font-bold text-foreground">
									Flight Price Monitor
								</CardTitle>
								<CardDescription className="text-muted-foreground text-sm">
									Set up price alerts for your preferred routes
								</CardDescription>
							</div>
						</div>
					</CardHeader>

					<CardContent className="space-y-6">
						{/* Current Monitoring Tasks */}
						<div>
							<h3 className="text-lg font-semibold text-foreground mb-3">
								Current Monitoring Tasks
							</h3>

							{isLoadingTasks ? (
								<div className="flex items-center justify-center py-6">
									<Loader2 className="w-5 h-5 animate-spin text-primary" />
									<span className="ml-2 text-muted-foreground">
										Loading tasks...
									</span>
								</div>
							) : (
								<div className="space-y-2">
									{existingTasks.length === 0 ? (
										<div className="text-center py-6">
											<Plane className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" />
											<p className="text-foreground mb-1">
												No scheduled monitoring tasks found
											</p>
											<p className="text-muted-foreground text-sm">
												Create your first flight price alert below
											</p>
										</div>
									) : (
										existingTasks.map((task, index) => (
											<Card
												key={index}
												className="bg-secondary/50 border-border"
											>
												<CardContent className="p-3">
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-3">
															<MapPin className="w-4 h-4 text-primary" />
															<span className="text-foreground">
																{getAirportName(task.origin)} →{" "}
																{getAirportName(task.destination)}
															</span>
														</div>
														<div className="text-muted-foreground text-sm">
															€{task.priceThreshold} threshold
														</div>
													</div>
													<div className="mt-2 text-muted-foreground text-sm">
														{task.outboundDate} to {task.returnDate}
													</div>
												</CardContent>
											</Card>
										))
									)}
									{hasTasksError && (
										<Card className="bg-destructive/10 border-destructive/20">
											<CardContent className="p-4 text-center">
												<p className="text-destructive text-sm">
													Failed to load existing tasks
												</p>
											</CardContent>
										</Card>
									)}
								</div>
							)}
						</div>

						{/* Flight Form */}
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6"
							>
								{/* Airport Selection */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="origin"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-foreground flex items-center gap-2">
													<MapPin className="h-4 w-4 text-primary" />
													Origin Airport
												</FormLabel>
												<FormControl>
													<Select
														value={field.value}
														onValueChange={field.onChange}
													>
														<SelectTrigger className="w-full bg-input border-border text-foreground hover:bg-accent hover:ring-2 hover:ring-ring/20 focus:ring-2 focus:ring-ring transition-all duration-200">
															<SelectValue placeholder="Select origin" />
														</SelectTrigger>
														<SelectContent>
															{airports.map((airport) => (
																<SelectItem
																	key={airport.code}
																	value={airport.code}
																>
																	{airport.city} ({airport.code})
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
												<FormLabel className="text-foreground flex items-center gap-2">
													<MapPin className="h-4 w-4 text-primary" />
													Destination Airport
												</FormLabel>
												<FormControl>
													<Select
														value={field.value}
														onValueChange={field.onChange}
													>
														<SelectTrigger className="w-full bg-input border-border text-foreground hover:bg-accent hover:ring-2 hover:ring-ring/20 focus:ring-2 focus:ring-ring transition-all duration-200">
															<SelectValue placeholder="Select destination" />
														</SelectTrigger>
														<SelectContent>
															{airports.map((airport) => (
																<SelectItem
																	key={airport.code}
																	value={airport.code}
																>
																	{airport.city} ({airport.code})
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

								{/* Date Range and Price Threshold */}
								<div className="flex flex-col md:flex-row gap-4 mb-2">
									<div className="flex-1">
										<FormField
											control={form.control}
											name="dateRange"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-foreground flex items-center gap-2">
														<Calendar className="h-4 w-4 text-primary" />
														Travel Dates
													</FormLabel>
													<FormControl>
														<DateRangePicker
															value={field.value}
															onChange={field.onChange}
															placeholder="Select travel dates"
															minDate={new Date()}
															disabled={isPending}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="flex-1 flex items-center">
										<FormField
											control={form.control}
											name="priceThreshold"
											render={({ field }) => (
												<FormItem className="w-full">
													<FormLabel className="text-foreground flex items-center gap-2">
														<Euro className="h-4 w-4 text-primary" />
														Price Threshold (€)
													</FormLabel>
													<FormControl>
														<div className="flex flex-col gap-2 px-2 py-3">
															<Slider
																min={10}
																max={100}
																step={1}
																value={[field.value ?? 25]}
																onValueChange={([val]) => field.onChange(val)}
																disabled={isPending}
															/>
															<div className="flex justify-between text-xs text-muted-foreground">
																<span>€10</span>
																<span>€100</span>
															</div>
															<div className="text-center text-sm font-medium text-primary">
																{field.value ? `€${field.value}` : "€25"}
															</div>
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>

								{/* Email Address */}
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-foreground flex items-center gap-2">
												<Mail className="h-4 w-4 text-primary" />
												Email Address
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													type="email"
													placeholder="your@email.com"
													className="bg-input border-border text-foreground hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-all duration-200"
													disabled={isPending}
													value={field.value || ""}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Monitor Options */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="checkOutbound"
										render={({ field }) => (
											<FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-secondary/50">
												<div className="space-y-0.5">
													<FormLabel className="text-foreground font-medium">
														Monitor Outbound Flight
													</FormLabel>
													<p className="text-muted-foreground text-sm">
														Get alerts for departure flights
													</p>
												</div>
												<div className="flex items-center gap-3">
													<span className="text-sm text-muted-foreground">
														{field.value ? "Enabled" : "Disabled"}
													</span>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
															disabled={isPending}
															variant="primary"
														/>
													</FormControl>
												</div>
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="checkReturn"
										render={({ field }) => (
											<FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-secondary/50">
												<div className="space-y-0.5">
													<FormLabel className="text-foreground font-medium">
														Monitor Return Flight
													</FormLabel>
													<p className="text-muted-foreground text-sm">
														Get alerts for return flights
													</p>
												</div>
												<div className="flex items-center gap-3">
													<span className="text-sm text-muted-foreground">
														{field.value ? "Enabled" : "Disabled"}
													</span>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
															disabled={isPending}
															variant="accent"
														/>
													</FormControl>
												</div>
											</FormItem>
										)}
									/>
								</div>

								{/* Submit Button */}
								<motion.div
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									transition={{ type: "spring", stiffness: 400, damping: 17 }}
								>
									<Button
										type="submit"
										className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg shadow-lg transition-colors duration-200"
										disabled={isPending}
										size="lg"
									>
										{isPending ? (
											<div className="flex items-center gap-3">
												<Loader2 className="h-5 w-5 animate-spin" />
												Saving Flight Monitor...
											</div>
										) : (
											<div className="flex items-center gap-3">
												<Save className="h-5 w-5" />
												Save Flight Monitor
											</div>
										)}
									</Button>
								</motion.div>
							</form>
						</Form>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}
