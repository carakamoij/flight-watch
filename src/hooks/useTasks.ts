// This file has been removed as it is no longer used in the new context-based auth flow.
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "../env.mjs";
import type { Task, N8nResponse } from "../lib/types";

interface CreateTaskData {
	email: string;
	from: string;
	to: string;
	startDate: string;
	endDate: string;
	priceThreshold: number;
}

export function useTasks(email?: string) {
	return useQuery({
		queryKey: ["tasks", email],
		queryFn: async () => {
			if (!email) throw new Error("Email is required");
			let response: Response;
			try {
				response = await fetch(
					`${env.NEXT_PUBLIC_N8N_BASE_URL}${
						env.NEXT_PUBLIC_N8N_TASKS_ENDPOINT
					}?email=${encodeURIComponent(email)}`
				);
			} catch (err) {
				if (process.env.NODE_ENV === "development") {
					console.warn("Fetch tasks failed (network error)", err);
				}
				throw new Error(
					"Could not connect to the task service. Please try again later."
				);
			}
			let result: N8nResponse | null = null;
			try {
				result = await response.json();
			} catch {}
			if (!response.ok) {
				if (process.env.NODE_ENV === "development") {
					console.warn("Fetch tasks failed (network/server)", {
						status: response.status,
					});
				}
				throw new Error(
					response.status === 404
						? "Task service is unavailable. Please try again later."
						: response.status === 403
						? "You are not authorized to view tasks. Please contact support."
						: "Could not connect to the task service. Please try again later."
				);
			}
			if (!result?.success) {
				throw new Error(
					result?.message || "Failed to fetch tasks. Please try again later."
				);
			}
			return result.tasks as Task[];
		},
		enabled: Boolean(email),
		staleTime: 2 * 60 * 1000, // 2 minutes
	});
}

export function useCreateTask() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (taskData: CreateTaskData) => {
			let response: Response;
			try {
				response = await fetch(
					`${env.NEXT_PUBLIC_N8N_BASE_URL}${env.NEXT_PUBLIC_N8N_SCHEDULE_ENDPOINT}`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(taskData),
					}
				);
			} catch (err) {
				if (process.env.NODE_ENV === "development") {
					console.warn("Create task failed (network error)", err);
				}
				throw new Error(
					"Could not connect to the task service. Please try again later."
				);
			}
			let result: N8nResponse | null = null;
			try {
				result = await response.json();
			} catch {}
			if (!response.ok) {
				if (process.env.NODE_ENV === "development") {
					console.warn("Create task failed (network/server)", {
						status: response.status,
					});
				}
				throw new Error(
					response.status === 404
						? "Task service is unavailable. Please try again later."
						: response.status === 403
						? "You are not authorized to create tasks. Please contact support."
						: "Could not connect to the task service. Please try again later."
				);
			}
			if (!result?.success) {
				throw new Error(
					result?.message || "Failed to create task. Please try again later."
				);
			}
			return result;
		},
		onSuccess: (_, variables) => {
			// Invalidate and refetch tasks for this user
			queryClient.invalidateQueries({
				queryKey: ["tasks", variables.email],
			});
		},
	});
}

export function useUpdateTask() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			taskId,
			updates,
		}: {
			taskId: string;
			updates: Partial<Task>;
		}) => {
			let response: Response;
			try {
				response = await fetch(
					`${env.NEXT_PUBLIC_N8N_BASE_URL}${env.NEXT_PUBLIC_N8N_SCHEDULE_ENDPOINT}/${taskId}`,
					{
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(updates),
					}
				);
			} catch (err) {
				if (process.env.NODE_ENV === "development") {
					console.warn("Update task failed (network error)", err);
				}
				throw new Error(
					"Could not connect to the task service. Please try again later."
				);
			}
			let result: N8nResponse | null = null;
			try {
				result = await response.json();
			} catch {}
			if (!response.ok) {
				if (process.env.NODE_ENV === "development") {
					console.warn("Update task failed (network/server)", {
						status: response.status,
					});
				}
				throw new Error(
					response.status === 404
						? "Task service is unavailable. Please try again later."
						: response.status === 403
						? "You are not authorized to update tasks. Please contact support."
						: "Could not connect to the task service. Please try again later."
				);
			}
			if (!result?.success) {
				throw new Error(
					result?.message || "Failed to update task. Please try again later."
				);
			}
			return result;
		},
		onSuccess: () => {
			// Invalidate tasks queries
			queryClient.invalidateQueries({
				queryKey: ["tasks"],
			});
		},
	});
}

export function useDeleteTask() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (taskId: string) => {
			let response: Response;
			try {
				response = await fetch(
					`${env.NEXT_PUBLIC_N8N_BASE_URL}${env.NEXT_PUBLIC_N8N_SCHEDULE_ENDPOINT}/${taskId}`,
					{
						method: "DELETE",
					}
				);
			} catch (err) {
				if (process.env.NODE_ENV === "development") {
					console.warn("Delete task failed (network error)", err);
				}
				throw new Error(
					"Could not connect to the task service. Please try again later."
				);
			}
			let result: N8nResponse | null = null;
			try {
				result = await response.json();
			} catch {}
			if (!response.ok) {
				if (process.env.NODE_ENV === "development") {
					console.warn("Delete task failed (network/server)", {
						status: response.status,
					});
				}
				throw new Error(
					response.status === 404
						? "Task service is unavailable. Please try again later."
						: response.status === 403
						? "You are not authorized to delete tasks. Please contact support."
						: "Could not connect to the task service. Please try again later."
				);
			}
			if (!result?.success) {
				throw new Error(
					result?.message || "Failed to delete task. Please try again later."
				);
			}
			return result;
		},
		onSuccess: () => {
			// Invalidate all tasks queries
			queryClient.invalidateQueries({
				queryKey: ["tasks"],
			});
		},
	});
}
