"use client";

import { useState, useEffect } from "react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Plane, Calendar, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { airports, defaultSearchParams, getAirportName } from "@/lib/data";
import type { FlightSearchParams, Task } from "@/lib/types";

const flightSchema = z
	.object({
		origin: z.string().min(1, "Please select origin airport"),
		destination: z.string().min(1, "Please select destination airport"),
		outboundDate: z.string().min(1, "Please enter outbound date"),
		returnDate: z.string().min(1, "Please enter return date"),
		priceThreshold: z.number().min(1, "Price threshold must be at least €1"),
		checkOutbound: z.boolean(),
		checkReturn: z.boolean(),
	})
	.refine((data) => data.checkOutbound || data.checkReturn, {
		message: "Please select at least one flight direction to monitor",
		path: ["checkOutbound"],
	})
	.refine((data) => new Date(data.returnDate) >= new Date(data.outboundDate), {
		message: "Return date must be on or after outbound date",
		path: ["returnDate"],
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
			origin: "",
			destination: "",
			outboundDate: "",
			returnDate: "",
			priceThreshold: defaultSearchParams.priceThreshold,
			checkOutbound: defaultSearchParams.checkOutbound,
			checkReturn: defaultSearchParams.checkReturn,
		},
	});

	// Watch form values for real-time validation
	const watchedValues = form.watch();

	// Real-time date validation
	useEffect(() => {
		if (watchedValues.outboundDate && watchedValues.returnDate) {
			const outbound = new Date(watchedValues.outboundDate);
			const returnDate = new Date(watchedValues.returnDate);

			if (returnDate < outbound) {
				form.setError("returnDate", {
					type: "manual",
					message: "Return date must be on or after outbound date",
				});
			} else {
				form.clearErrors("returnDate");
			}
		}
	}, [watchedValues.outboundDate, watchedValues.returnDate, form]);

	// Load existing tasks on component mount
	useEffect(() => {
		const loadExistingTasks = async () => {
			try {
				setIsLoadingTasks(true);
				setHasTasksError(false);
				const tasks = await n8nApi.getUserTasks(userEmail);
				setExistingTasks(tasks || []);

				// Pre-populate form with first existing task if available
				if (tasks && tasks.length > 0) {
					const task = tasks[0];
					form.setValue("origin", task.origin);
					form.setValue("destination", task.destination);
					form.setValue("outboundDate", task.outboundDate);
					form.setValue("returnDate", task.returnDate);
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
					email: userEmail,
					origin: data.origin,
					destination: data.destination,
					outboundDate: data.outboundDate,
					returnDate: data.returnDate,
					priceThreshold: data.priceThreshold,
					checkOutbound: data.checkOutbound,
					checkReturn: data.checkReturn,
					currency: defaultSearchParams.currency,
				};

				await n8nApi.createOrUpdateTask(params);
				toast.success("Flight monitoring task saved successfully!");

				// Reload tasks to show updated data
				const updatedTasks = await n8nApi.getUserTasks(userEmail);
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
				className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8"
			>
				{/* Header */}
				<div className="flex items-center gap-3 mb-8">
					<div className="bg-blue-500/20 w-12 h-12 rounded-full flex items-center justify-center">
						<Plane className="w-6 h-6 text-blue-400" />
					</div>
					<div>
						<h2 className="text-xl font-bold text-white">
							Flight Price Monitor
						</h2>
						<p className="text-slate-400 text-sm">
							Set up price alerts for your preferred routes
						</p>
					</div>
				</div>

				{/* Current Monitoring Tasks */}
				<div className="mb-8">
					<h3 className="text-lg font-semibold text-white mb-4">
						Current Monitoring Tasks
					</h3>

					{isLoadingTasks ? (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="w-6 h-6 animate-spin text-blue-400" />
							<span className="ml-2 text-slate-400">Loading tasks...</span>
						</div>
					) : hasTasksError ? (
						<div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
							<p className="text-red-400 text-sm">
								Failed to load existing tasks
							</p>
						</div>
					) : existingTasks.length === 0 ? (
						<div className="text-center py-8">
							<Plane className="w-12 h-12 text-slate-600 mx-auto mb-3" />
							<p className="text-slate-400 mb-1">
								No scheduled monitoring tasks found
							</p>
							<p className="text-slate-500 text-sm">
								Create your first flight price alert below
							</p>
						</div>
					) : (
						<div className="space-y-3">
							{existingTasks.map((task, index) => (
								<div
									key={index}
									className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30"
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<MapPin className="w-4 h-4 text-blue-400" />
											<span className="text-white">
												{getAirportName(task.origin)} →{" "}
												{getAirportName(task.destination)}
											</span>
										</div>
										<div className="text-slate-400 text-sm">
											€{task.priceThreshold} threshold
										</div>
									</div>
									<div className="mt-2 text-slate-400 text-sm">
										{task.outboundDate} to {task.returnDate}
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Flight Form */}
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* Airport Selection */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="origin"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-slate-300">
											Origin Airport
										</FormLabel>
										<FormControl>
											<Select
												value={field.value}
												onValueChange={field.onChange}
											>
												<SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
													<div className="flex items-center gap-2">
														<MapPin className="h-4 w-4 text-slate-400" />
														<SelectValue placeholder="Select origin" />
													</div>
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
										<FormLabel className="text-slate-300">
											Destination Airport
										</FormLabel>
										<FormControl>
											<Select
												value={field.value}
												onValueChange={field.onChange}
											>
												<SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
													<div className="flex items-center gap-2">
														<MapPin className="h-4 w-4 text-slate-400" />
														<SelectValue placeholder="Select destination" />
													</div>
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

						{/* Dates */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="outboundDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-slate-300">
											Outbound Date
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
												<Input
													{...field}
													type="date"
													className="pl-10 bg-slate-700/50 border-slate-600 text-white"
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
										<FormLabel className="text-slate-300">
											Return Date
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
												<Input
													{...field}
													type="date"
													className="pl-10 bg-slate-700/50 border-slate-600 text-white"
													disabled={isPending}
													min={watchedValues.outboundDate}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Price Threshold */}
						<FormField
							control={form.control}
							name="priceThreshold"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-slate-300">
										Price Threshold (€)
									</FormLabel>
									<FormControl>
										<div className="relative">
											<span className="absolute left-3 top-3 text-slate-400">
												€
											</span>
											<Input
												{...field}
												type="number"
												placeholder="100"
												className="pl-8 bg-slate-700/50 border-slate-600 text-white"
												disabled={isPending}
												onChange={(e) => field.onChange(Number(e.target.value))}
											/>
										</div>
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
									<FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-slate-600 p-4 bg-slate-700/30">
										<FormControl>
											<input
												type="checkbox"
												checked={field.value}
												onChange={field.onChange}
												className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel className="text-slate-300 font-medium">
												Monitor Outbound Flight
											</FormLabel>
											<p className="text-slate-400 text-sm">
												Get alerts for departure flights
											</p>
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="checkReturn"
								render={({ field }) => (
									<FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-slate-600 p-4 bg-slate-700/30">
										<FormControl>
											<input
												type="checkbox"
												checked={field.value}
												onChange={field.onChange}
												className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel className="text-slate-300 font-medium">
												Monitor Return Flight
											</FormLabel>
											<p className="text-slate-400 text-sm">
												Get alerts for return flights
											</p>
										</div>
									</FormItem>
								)}
							/>
						</div>

						{/* Submit Button */}
						<Button
							type="submit"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
							disabled={isPending}
						>
							{isPending ? (
								<div className="flex items-center gap-2">
									<Loader2 className="h-4 w-4 animate-spin" />
									Saving Flight Monitor...
								</div>
							) : (
								<div className="flex items-center gap-2">
									<Plane className="h-4 w-4" />
									Save Flight Monitor
								</div>
							)}
						</Button>
					</form>
				</Form>
			</motion.div>
		</div>
	);
}
