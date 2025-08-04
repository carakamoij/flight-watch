"use client";

import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";
import {
	useEffect,
	useState,
	useCallback,
	startTransition,
	useRef,
} from "react";
import { motion } from "framer-motion";
import { FlightForm } from "@/components/flight-form";
import { useTasks } from "@/hooks/useTasks";
import { Loader2, Plane } from "lucide-react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { DashboardTasksPagination } from "@/components/dashboard-tasks-pagination";
import { Task } from "@/lib/types";
import { toast } from "sonner";

export default function DashboardPage() {
	const { isAuthenticated, isLoading, user } = useAuth();
	const {
		isLoading: isLoadingTasks,
		data: tasks,
		isError: tasksError,
		deleteTask,
	} = useTasks();
	const router = useRouter();
	const [highlightTaskId, setHighlightTaskId] = useState<number | null>(null);
	const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
	const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
	const [task, setTask] = useState<Task | null>(null);
	const lastDeletedTaskId = useRef<number | null>(null);

	// Callback to be passed to FlightForm to notify of new task
	const handleTaskSaved = useCallback((taskId: number) => {
		setHighlightTaskId(taskId);
		setSelectedTaskId(null); // Clear selection after save
		setTask(null); // Clear form
	}, []);

	// Handle modify task
	const handleModifyTask = useCallback((taskToModify: Task) => {
		setTask(taskToModify);
		setSelectedTaskId(taskToModify.id);
	}, []);

	//handle delete task. handle duplicate toast using a ref to track last deleted task ID
	async function handleDeleteTask(taskId: number) {
		console.log("handleDeleteTask called with ID:", taskId);
		startTransition(async () => {
			try {
				setDeletingTaskId(taskId);
				lastDeletedTaskId.current = taskId;
				await deleteTask(taskId);

				// Show toast here - only once per unique task ID
				if (lastDeletedTaskId.current === taskId) {
					toast.success("Task deleted successfully");
					lastDeletedTaskId.current = null; // Reset to prevent duplicates
				}
			} catch (error) {
				console.log("deleteTask failed:", error);
				lastDeletedTaskId.current = null; // Reset on error
				toast.error(
					error instanceof Error ? error.message : "Failed to delete task"
				);
			} finally {
				setDeletingTaskId(null);
			}
		});
	}

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push("/login");
		}
	}, [isLoading, isAuthenticated, router]);

	if (!isAuthenticated) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="space-y-6"
		>
			<Card className="bg-gradient-card backdrop-blur-sm border-border/50 shadow-2xl container mx-auto max-w-4xl mt-4">
				<CardHeader className="pb-2">
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
							<DashboardTasksPagination
								tasks={tasks ?? []}
								isError={tasksError}
								highlightTaskId={highlightTaskId}
								deletingTaskId={deletingTaskId}
								selectedTaskId={selectedTaskId}
								onModifyTask={handleModifyTask}
								onDeleteTask={handleDeleteTask}
							/>
						)}
					</div>
					{/* Divider */}
					<div className="my-6">
						<hr className="border-t border-border/40" />
					</div>
					{/* Flight Form */}
					<motion.div
						key={task ? task.id : "add"}
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 8 }}
						transition={{ duration: 0.25, ease: "easeOut" }}
					>
						<h3 className="text-lg font-semibold text-foreground mb-3">
							{task ? "Edit Flight Monitor" : "Add New Flight Monitor"}
						</h3>
						<FlightForm
							userEmail={user?.email ?? ""}
							onTaskSaved={handleTaskSaved}
							task={task}
							onClearSelection={() => {
								setTask(null);
								setSelectedTaskId(null);
							}}
						/>
					</motion.div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
