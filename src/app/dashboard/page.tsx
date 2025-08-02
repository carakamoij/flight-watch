"use client";

import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { FlightForm } from "@/components/flight-form";
import { useTasks } from "@/hooks/useTasks";
import { getAirportName } from "@/lib/data";
import { Loader2, Plane, MapPin } from "lucide-react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";

export default function DashboardPage() {
	const { isAuthenticated, isLoading, user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push("/login");
		}
	}, [isLoading, isAuthenticated, router]);

	// Load tasks for the current user (must be before any conditional return)
	const {
		data: tasks,
		isLoading: isLoadingTasks,
		isError: hasTasksError,
	} = useTasks();

	if (!isAuthenticated) return null;
	console.log(tasks);
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="space-y-6"
		>
			<Card className="bg-gradient-card backdrop-blur-sm border-border/50 shadow-2xl container mx-auto max-w-4xl mt-4">
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
								{tasks == null || tasks.length === 0 ? (
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
									tasks.map((task, index) => (
										<Card key={index} className="bg-secondary/50 border-border">
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
					<FlightForm userEmail={user?.email ?? ""} />
				</CardContent>
			</Card>
		</motion.div>
	);
}
