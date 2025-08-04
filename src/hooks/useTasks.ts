// This file has been removed as it is no longer used in the new context-based auth flow.
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getN8nApiUrl } from "../lib/n8nApiUrl";
import type { Task, N8nResponse, TaskApi } from "../lib/types";
import api from "../lib/api";
import { useAuth } from "./useAuth";

export function useTasks() {
	const { user } = useAuth();
	const queryClient = useQueryClient();

	const tasksQuery = useQuery<Task[], Error>({
		queryKey: ["tasks", user?.email],
		queryFn: async () => {
			if (!user?.token) throw new Error("Not authenticated");
			const response = await api.get<N8nResponse>(getN8nApiUrl("tasks"), {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				params: { email: user.email },
			});
			if (!response.data?.success) {
				throw new Error(
					response.data?.message ||
						"Failed to fetch tasks. Please try again later."
				);
			}

			return ((response.data.tasks || []) as TaskApi[]).map((task) => ({
				...task,
				id: task.id, // Ensure id is a number
				outboundDate: task.outbound_date, // YYYY-MM-DD format
				returnDate: task.return_date, // YYYY-MM-DD format
				priceThreshold: task.price_threshold,
				checkOutbound: task.check_outbound,
				checkReturn: task.check_return,
				isActive: task.is_active,
				createdAt: task.created_at,
			}));
		},
		enabled: !!user?.token,
		staleTime: 2 * 60 * 1000,
	});

	const useCreateTask = useMutation({
		mutationFn: async (task: Task) => {
			if (!user?.token) throw new Error("Not authenticated");
			const response = await api.post<N8nResponse>(
				getN8nApiUrl("tasks"),
				task,
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			);
			if (!response.data?.success) {
				throw new Error(
					response.data?.message ||
						"Failed to create task. Please try again later."
				);
			}
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
	});

	const useUpdateTask = useMutation({
		mutationFn: async (task: Task) => {
			if (!user?.token) throw new Error("Not authenticated");
			const response = await api.put<N8nResponse>(getN8nApiUrl("tasks"), task, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			});
			if (!response.data?.success) {
				throw new Error(
					response.data?.message ||
						"Failed to update task. Please try again later."
				);
			}
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
	});

	const useDeleteTask = useMutation({
		mutationFn: async (id: number) => {
			if (!user?.token) throw new Error("Not authenticated");
			const response = await api.delete<N8nResponse>(getN8nApiUrl("tasks"), {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				data: { id },
			});
			if (!response.data?.success) {
				throw new Error(
					response.data?.message ||
						"Failed to delete task. Please try again later."
				);
			}
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
	});

	return {
		...tasksQuery,
		createTask: useCreateTask.mutateAsync,
		updateTask: useUpdateTask.mutateAsync,
		deleteTask: useDeleteTask.mutateAsync,
		isLoadingTasks: tasksQuery.isLoading,
		isError: tasksQuery.isError,
		error: tasksQuery.error,
	};
}
