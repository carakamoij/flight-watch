"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "../env.mjs";
import type { Task } from "../lib/types";

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

			const response = await fetch(
				`${env.NEXT_PUBLIC_N8N_BASE_URL}${
					env.NEXT_PUBLIC_N8N_TASKS_ENDPOINT
				}?email=${encodeURIComponent(email)}`
			);

			if (!response.ok) {
				throw new Error("Failed to fetch tasks");
			}

			return response.json() as Promise<Task[]>;
		},
		enabled: Boolean(email),
		staleTime: 2 * 60 * 1000, // 2 minutes
	});
}

export function useCreateTask() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (taskData: CreateTaskData) => {
			const response = await fetch(
				`${env.NEXT_PUBLIC_N8N_BASE_URL}${env.NEXT_PUBLIC_N8N_SCHEDULE_ENDPOINT}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(taskData),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to create task");
			}

			return response.json();
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
			const response = await fetch(
				`${env.NEXT_PUBLIC_N8N_BASE_URL}${env.NEXT_PUBLIC_N8N_SCHEDULE_ENDPOINT}/${taskId}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(updates),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to update task");
			}

			return response.json();
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
			const response = await fetch(
				`${env.NEXT_PUBLIC_N8N_BASE_URL}${env.NEXT_PUBLIC_N8N_SCHEDULE_ENDPOINT}/${taskId}`,
				{
					method: "DELETE",
				}
			);

			if (!response.ok) {
				throw new Error("Failed to delete task");
			}

			return response.json();
		},
		onSuccess: () => {
			// Invalidate all tasks queries
			queryClient.invalidateQueries({
				queryKey: ["tasks"],
			});
		},
	});
}
