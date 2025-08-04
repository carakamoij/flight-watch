"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationPrevious,
	PaginationNext,
	PaginationLink,
} from "./ui/pagination";
import {
	MapPin,
	Edit,
	Trash2,
	X,
	ArrowRight,
	ArrowLeft,
	ArrowLeftRight,
	Check,
} from "lucide-react";
import { Button } from "./ui/button";
import { getAirportName } from "@/lib/data";
import { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

function formatDate(date: string) {
	// Accepts YYYY-MM-DD or ISO, returns DD-MM-YYYY
	if (!date) return "";
	try {
		const d = new Date(date);
		if (isNaN(d.getTime())) return date;
		return d.toLocaleDateString("en-GB").replace(/\//g, "-");
	} catch {
		return date;
	}
}

interface DashboardTasksPaginationProps {
	tasks: Task[];
	isError: boolean;
	highlightTaskId?: number | null;
	deletingTaskId?: number | null;
	selectedTaskId?: number | null;
	onModifyTask: (task: Task) => void;
	onDeleteTask: (taskId: number) => void;
}

const HIGHLIGHT_DURATION = 2500; // ms

function getTasksPerPage() {
	if (typeof window !== "undefined") {
		return window.matchMedia("(max-width: 639px)").matches ? 3 : 5;
	}
	return 5;
}

export function DashboardTasksPagination({
	tasks,
	isError,
	highlightTaskId,
	deletingTaskId,
	selectedTaskId,
	onModifyTask,
	onDeleteTask,
}: DashboardTasksPaginationProps) {
	const [page, setPage] = useState(1);
	const [tasksPerPage, setTasksPerPage] = useState(getTasksPerPage());

	useEffect(() => {
		function handleResize() {
			setTasksPerPage(getTasksPerPage());
		}
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const totalPages = tasks ? Math.ceil(tasks.length / tasksPerPage) : 1;
	const paginatedTasks = React.useMemo(
		() =>
			tasks ? tasks.slice((page - 1) * tasksPerPage, page * tasksPerPage) : [],
		[tasks, page, tasksPerPage]
	);

	// Track highlight state for animation
	const [highlighted, setHighlighted] = useState<number | null>(null);

	// Track delete countdown state
	const [deletingTask, setDeletingTask] = useState<{
		id: number;
		countdown: number;
		intervalId?: NodeJS.Timeout;
	} | null>(null);

	useEffect(() => {
		if (highlightTaskId) {
			//setPage(1); // Go to first page where new task should be
			setHighlighted(highlightTaskId);

			// Clear highlight after duration
			const timeout = setTimeout(() => {
				setHighlighted(null);
			}, HIGHLIGHT_DURATION);

			return () => clearTimeout(timeout);
		}
	}, [highlightTaskId]);

	// Handle delete button click
	const handleDeleteClick = (taskId: number) => {
		setDeletingTask({
			id: taskId,
			countdown: 3,
		});

		// Start countdown
		const intervalId = setInterval(() => {
			setDeletingTask((current) => {
				if (!current || current.id !== taskId) return current;

				const newCount = current.countdown - 1;
				if (newCount <= 0) {
					clearInterval(intervalId);

					// Execute delete
					onDeleteTask(taskId);
					return null;
				}

				return { ...current, countdown: newCount };
			});
		}, 1000);

		setDeletingTask((current) => (current ? { ...current, intervalId } : null));
	};

	// Handle cancel delete
	const handleCancelDelete = () => {
		if (deletingTask?.intervalId) {
			clearInterval(deletingTask.intervalId);
		}
		setDeletingTask(null);
	};

	// Handle modify task
	const handleModifyTask = (task: Task) => {
		onModifyTask(task);
	};

	return (
		<div>
			<div className="space-y-1">
				{paginatedTasks.map((task) => {
					const isHighlighted = highlighted === task.id;
					const isDeleting = deletingTask?.id === task.id;
					const isBeingDeleted = deletingTaskId === task.id;
					const isSelected = selectedTaskId === task.id;

					return (
						<div
							key={task.id}
							className={`rounded-lg transition-all duration-1000 ${
								isHighlighted ? "bg-yellow-100/20" : "bg-transparent"
							}`}
						>
							<Card
								className={cn(
									"bg-secondary/50 border-border py-2 px-3 rounded-lg shadow-none transition-all duration-200",
									{
										"blur-xs": isBeingDeleted,
										"ring-2 ring-primary ring-offset-2 ring-offset-background":
											isSelected,
										"ring-2 ring-green-500 ring-offset-2 ring-offset-background":
											isHighlighted,
									}
								)}
							>
								<CardContent className="p-0 flex flex-col sm:flex-row sm:items-center justify-center sm:justify-between min-h-0 h-auto gap-1 sm:gap-3">
									{/* Route and dates - mobile: stacked, desktop: inline */}
									<div className="flex items-center gap-2 justify-center text-center sm:justify-start sm:text-left w-full">
										{isHighlighted ? (
											<Check className="w-4 h-4 text-green-500 transition-all duration-300" />
										) : (
											<MapPin
												className={cn(
													"w-4 h-4",
													isSelected ? "text-primary" : "text-primary"
												)}
											/>
										)}
										<span
											className={cn(
												"font-medium",
												isSelected ? "text-foreground" : "text-foreground"
											)}
										>
											{getAirportName(task.origin)}{" "}
											{/* Direction arrows logic with lucide-react icons */}
											{task.checkOutbound && task.checkReturn ? (
												<span className="mx-1" title="Outbound & Return">
													<ArrowLeftRight className="inline w-4 h-4 text-primary" />
												</span>
											) : task.checkOutbound ? (
												<span className="mx-1" title="Outbound only">
													<ArrowRight className="inline w-4 h-4 text-primary" />
												</span>
											) : task.checkReturn ? (
												<span className="mx-1" title="Return only">
													<ArrowLeft className="inline w-4 h-4 text-primary" />
												</span>
											) : null}
											{getAirportName(task.destination)}
										</span>
									</div>
									<div
										className={cn(
											"text-xs mt-1 sm:mt-0 w-full text-center sm:text-left",
											isSelected
												? "text-muted-foreground"
												: "text-muted-foreground"
										)}
									>
										<span>
											{formatDate(task.outboundDate)} to{" "}
											{formatDate(task.returnDate)}
										</span>
										<span className="text-xs ms-1 mt-1 sm:mt-0">{`<€${task.priceThreshold}`}</span>
									</div>
									{/* Action buttons */}
									<div className="flex items-center justify-center w-full ms-0 mt-1 sm:justify-end sm:w-auto sm:ms-auto sm:mt-0">
										{isDeleting ? (
											<div className="flex items-center">
												<Button
													variant="outline"
													size="sm"
													onClick={handleCancelDelete}
													className="h-7 px-2 text-xs"
												>
													<X className="w-3 h-3 mr-1" />
													Cancel Deletion ({deletingTask?.countdown})
												</Button>
											</div>
										) : (
											<div className="flex items-center gap-1">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleModifyTask(task)}
													className="h-7 px-2 text-xs text-primary border-primary/20 hover:bg-primary/10"
												>
													<Edit className="w-3 h-3 mr-1" />
													Modify
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleDeleteClick(task.id)}
													className="h-7 px-2 text-xs text-destructive border-destructive/20 hover:bg-destructive/10"
												>
													<Trash2 className="w-3 h-3 mr-1" />
													Delete
												</Button>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						</div>
					);
				})}
			</div>
			{totalPages > 1 && (
				<Pagination className="mt-2">
					<PaginationContent>
						{page > 1 && (
							<PaginationItem>
								<PaginationPrevious
									href="#"
									onClick={(e) => {
										e.preventDefault();
										setPage((p) => Math.max(1, p - 1));
									}}
									aria-disabled={page === 1}
								/>
							</PaginationItem>
						)}
						{Array.from({ length: totalPages }).map((_, i) => (
							<PaginationItem key={i}>
								<PaginationLink
									href="#"
									isActive={page === i + 1}
									onClick={(e) => {
										e.preventDefault();
										setPage(i + 1);
									}}
								>
									{i + 1}
								</PaginationLink>
							</PaginationItem>
						))}
						{page < totalPages && (
							<PaginationItem>
								<PaginationNext
									href="#"
									onClick={(e) => {
										e.preventDefault();
										setPage((p) => Math.min(totalPages, p + 1));
									}}
									aria-disabled={page === totalPages}
								/>
							</PaginationItem>
						)}
					</PaginationContent>
				</Pagination>
			)}
			{isError && (
				<Card className="bg-destructive/10 border-destructive/20 mt-2">
					<CardContent className="p-2 text-center">
						<p className="text-destructive text-sm">
							Failed to load existing tasks
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
