"use client";

import { startTransition, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Calendar, Euro, Mail, Loader2, MapPin, Save } from "lucide-react";
import { toast } from "sonner";
import { addDays, format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Switch } from "@/components/ui/switch";

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
import { useCreateTask, useUpdateTask } from "@/hooks/useTasks";
import { Slider } from "./ui/slider";

// const { mutateAsync: createTask, isPending: isCreating } = useCreateTask();

// const form = useForm<FlightForm>({
// 	resolver: zodResolver(flightSchema),
// 	defaultValues: {
// 		email: typeof userEmail === "string" ? userEmail : "",
// 		origin: "",
// 		destination: "",
// 		dateRange: {
// 			from: addDays(new Date(), 1),
// 			to: addDays(new Date(), 8),
// 		},
// 		priceThreshold: defaultSearchParams.priceThreshold,
// 		checkOutbound: defaultSearchParams.checkOutbound,
// 		checkReturn: defaultSearchParams.checkReturn,
// 	},
// });

// const onSubmit = (data: FlightForm) => {
// 	startTransition(async () => {
// 		try {
// 			const params: FlightSearchParams = {
// 				email: data.email,
// 				origin: data.origin,
// 				destination: data.destination,
// 				outboundDate: format(data.dateRange.from, "yyyy-MM-dd"),
// 				returnDate: format(data.dateRange.to, "yyyy-MM-dd"),
// 				priceThreshold: data.priceThreshold,
// 				checkOutbound: data.checkOutbound,
// 				checkReturn: data.checkReturn,
// 				currency: defaultSearchParams.currency,
// 			};
// 			await createTask(params as any); // Task/FlightSearchParams are compatible
// 			toast.success("Flight monitoring task saved successfully!");
// 			form.reset();
// 		} catch (error) {
// 			toast.error(
// 				error instanceof Error ? error.message : "Failed to save task"
// 			);
// 		}
// 	});
// };

// return (
// 	<Form {...form}>
// 		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
// 			{/* Airport Selection */}
// 			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// 				<FormField
// 					control={form.control}
// 					name="origin"
// 					render={({ field }) => (
// 						<FormItem>
// 							<FormLabel className="text-foreground flex items-center gap-2">
// 								<MapPin className="h-4 w-4 text-primary" />
// 								Origin Airport
// 							</FormLabel>
// 							<FormControl>
// 								<Select value={field.value} onValueChange={field.onChange}>
// 									<SelectTrigger className="w-full bg-input border-border text-foreground hover:bg-accent hover:ring-2 hover:ring-ring/20 focus:ring-2 focus:ring-ring transition-all duration-200">
// 										<SelectValue placeholder="Select origin" />
// 									</SelectTrigger>
// 									<SelectContent>
// 										{airports.map((airport) => (
// 											<SelectItem key={airport.code} value={airport.code}>
// 												{airport.city} ({airport.code})
// 											</SelectItem>
// 										))}
// 									</SelectContent>
// 								</Select>
// 							</FormControl>
// 							<FormMessage />
// 						</FormItem>
// 					)}
// 				/>
// 				<FormField
// 					control={form.control}
// 					name="destination"
// 					render={({ field }) => (
// 						<FormItem>
// 							<FormLabel className="text-foreground flex items-center gap-2">
// 								<MapPin className="h-4 w-4 text-primary" />
// 								Destination Airport
// 							</FormLabel>
// 							<FormControl>
// 								<Select value={field.value} onValueChange={field.onChange}>
// 									<SelectTrigger className="w-full bg-input border-border text-foreground hover:bg-accent hover:ring-2 hover:ring-ring/20 focus:ring-2 focus:ring-ring transition-all duration-200">
// 										<SelectValue placeholder="Select destination" />
// 									</SelectTrigger>
// 									<SelectContent>
// 										{airports.map((airport) => (
// 											<SelectItem key={airport.code} value={airport.code}>
// 												{airport.city} ({airport.code})
// 											</SelectItem>
// 										))}
// 									</SelectContent>
// 								</Select>
// 							</FormControl>
// 							<FormMessage />
// 						</FormItem>
// 					)}
// 				/>
// 			</div>
// 			{/* Date Range and Price Threshold */}
// 			<div className="flex flex-col md:flex-row gap-4 mb-2">
// 				<div className="flex-1">
// 					<FormField
// 						control={form.control}
// 						name="dateRange"
// 						render={({ field }) => (
// 							<FormItem>
// 								<FormLabel className="text-foreground flex items-center gap-2">
// 									<Calendar className="h-4 w-4 text-primary" />
// 									Travel Dates
// 								</FormLabel>
// 								<FormControl>
// 									<DateRangePicker
// 										value={field.value}
// 										onChange={field.onChange}
// 										placeholder="Select travel dates"
// 										minDate={new Date()}
// 										disabled={isPending || isCreating}
// 									/>
// 								</FormControl>
// 								<FormMessage />
// 							</FormItem>
// 						)}
// 					/>
// 				</div>
// 				<div className="flex-1 flex items-center">
// 					<FormField
// 						control={form.control}
// 						name="priceThreshold"
// 						render={({ field }) => (
// 							<FormItem className="w-full">
// 								<FormLabel className="text-foreground flex items-center gap-2">
// 									<Euro className="h-4 w-4 text-primary" />
// 									Price Threshold (€)
// 								</FormLabel>
// 								<FormControl>
// 									<div className="flex flex-col gap-2 px-2 py-3">
// 										<Slider
// 											min={10}
// 											max={100}
// 											step={1}
// 											value={[field.value ?? 25]}
// 											onValueChange={([val]) => field.onChange(val)}
// 											disabled={isPending || isCreating}
// 										/>
// 										<div className="flex justify-between text-xs text-muted-foreground">
// 											<span>€10</span>
// 											<span>€100</span>
// 										</div>
// 										<div className="text-center text-sm font-medium text-primary">
// 											{field.value ? `€${field.value}` : "€25"}
// 										</div>
// 									</div>
// 								</FormControl>
// 								<FormMessage />
// 							</FormItem>
// 						)}
// 					/>
// 				</div>
// 			</div>
// 			{/* Email Address */}
// 			<FormField
// 				control={form.control}
// 				name="email"
// 				render={({ field }) => (
// 					<FormItem>
// 						<FormLabel className="text-foreground flex items-center gap-2">
// 							<Mail className="h-4 w-4 text-primary" />
// 							Email Address
// 						</FormLabel>
// 						<FormControl>
// 							<Input
// 								{...field}
// 								type="email"
// 								placeholder="your@email.com"
// 								className="bg-input border-border text-foreground hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-all duration-200"
// 								disabled
// 								value={field.value || ""}
// 							/>
// 						</FormControl>
// 						<FormMessage />
// 					</FormItem>
// 				)}
// 			/>
// 			{/* Monitor Options */}
// 			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// 				<FormField
// 					control={form.control}
// 					name="checkOutbound"
// 					render={({ field }) => (
// 						<FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-secondary/50">
// 							<div className="space-y-0.5">
// 								<FormLabel className="text-foreground font-medium">
// 									Monitor Outbound Flight
// 								</FormLabel>
// 								<p className="text-muted-foreground text-sm">
// 									Get alerts for departure flights
// 								</p>
// 							</div>
// 							<div className="flex items-center gap-3">
// 								<span className="text-sm text-muted-foreground">
// 									{field.value ? "Enabled" : "Disabled"}
// 								</span>
// 								<FormControl>
// 									<Switch
// 										checked={field.value}
// 										onCheckedChange={field.onChange}
// 										disabled={isPending || isCreating}
// 										variant="default"
// 									/>
// 								</FormControl>
// 							</div>
// 						</FormItem>
// 					)}
// 				/>
// 				<FormField
// 					control={form.control}
// 					name="checkReturn"
// 					render={({ field }) => (
// 						<FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-secondary/50">
// 							<div className="space-y-0.5">
// 								<FormLabel className="text-foreground font-medium">
// 									Monitor Return Flight
// 								</FormLabel>
// 								<p className="text-muted-foreground text-sm">
// 									Get alerts for return flights
// 								</p>
// 							</div>
// 							<div className="flex items-center gap-3">
// 								<span className="text-sm text-muted-foreground">
// 									{field.value ? "Enabled" : "Disabled"}
// 								</span>
// 								<FormControl>
// 									<Switch
// 										checked={field.value}
// 										onCheckedChange={field.onChange}
// 										disabled={isPending || isCreating}
// 										variant="accent"
// 									/>
// 								</FormControl>
// 							</div>
// 						</FormItem>
// 					)}
// 				/>
// 			</div>
// 			{/* Submit Button */}
// 			<motion.div
// 				whileHover={{ scale: 1.02 }}
// 				whileTap={{ scale: 0.98 }}
// 				transition={{ type: "spring", stiffness: 400, damping: 17 }}
// 			>
// 				<Button
// 					type="submit"
// 					className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg shadow-lg transition-colors duration-200"
// 					disabled={isPending || isCreating}
// 					size="lg"
// 				>
// 					{isPending || isCreating ? (
// 						<div className="flex items-center gap-3">
// 							<Loader2 className="h-5 w-5 animate-spin" />
// 							Saving Flight Monitor...
// 						</div>
// 					) : (
// 						<div className="flex items-center gap-3">
// 							<Save className="h-5 w-5" />
// 							Save Flight Monitor
// 						</div>
// 					)}
// 				</Button>
// 			</motion.div>
// 		</form>
// 	</Form>
// );

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
	//const [isPending, startTransition] = useTransition();
	const { mutateAsync: createTask, isPending: isCreating } = useCreateTask();
	const { mutateAsync: updateTask, isPending: isUpdating } = useUpdateTask();
	const isPending = isCreating || isUpdating;
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
				await createTask(params as unknown as Task);
				toast.success("Flight monitoring task saved successfully!");
				form.reset();
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "Failed to save task"
				);
			}
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger className="w-full bg-input border-border text-foreground hover:bg-accent hover:ring-2 hover:ring-ring/20 focus:ring-2 focus:ring-ring transition-all duration-200">
											<SelectValue placeholder="Select origin" />
										</SelectTrigger>
										<SelectContent>
											{airports.map((airport) => (
												<SelectItem key={airport.code} value={airport.code}>
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
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger className="w-full bg-input border-border text-foreground hover:bg-accent hover:ring-2 hover:ring-ring/20 focus:ring-2 focus:ring-ring transition-all duration-200">
											<SelectValue placeholder="Select destination" />
										</SelectTrigger>
										<SelectContent>
											{airports.map((airport) => (
												<SelectItem key={airport.code} value={airport.code}>
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
											disabled={isPending || isCreating}
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
												disabled={isPending || isCreating}
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
									disabled
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
											disabled={isPending || isCreating}
											variant="default"
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
											disabled={isPending || isCreating}
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
						disabled={isPending || isCreating}
						size="lg"
					>
						{isPending || isCreating ? (
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
	);
}
