// This file has been removed as it is no longer used in the new context-based auth flow.
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "../env.mjs";
import type { User, N8nResponse } from "../lib/types";
import { useAuth } from "./useAuth";

export function useUsers() {
	const { user } = useAuth();
	const queryClient = useQueryClient();

	const usersQuery = useQuery<User[]>({
		queryKey: ["users"],
		queryFn: async () => {
			if (!user?.token) throw new Error("Not authenticated");
			let response: Response;
			try {
				response = await fetch(
					`${env.NEXT_PUBLIC_N8N_BASE_URL}/webhook/users`,
					{
						headers: {
							Authorization: `Bearer ${user.token}`,
						},
					}
				);
			} catch (err) {
				if (process.env.NODE_ENV === "development") {
					console.warn("Fetch users failed (network error)", err);
				}
				throw new Error(
					"Could not connect to the user service. Please try again later."
				);
			}
			let result: N8nResponse | null = null;
			try {
				result = await response.json();
			} catch {}
			if (!response.ok) {
				if (process.env.NODE_ENV === "development") {
					console.warn("Fetch users failed (network/server)", {
						status: response.status,
					});
				}
				throw new Error(
					response.status === 404
						? "User service is unavailable. Please try again later."
						: response.status === 403
						? "You are not authorized to view users. Please contact support."
						: "Could not connect to the user service. Please try again later."
				);
			}
			if (!result?.success) {
				throw new Error(
					result?.message || "Failed to fetch users. Please try again later."
				);
			}
			return result.users as User[];
		},
		enabled: !!user?.token || process.env.NEXT_PUBLIC_USE_MOCK_USERS === "true",
	});

	const updateUserMutation = useMutation({
		mutationFn: async (update: {
			id: string;
			is_active?: boolean;
			is_admin?: boolean;
		}) => {
			if (!user?.token) throw new Error("Not authenticated");
			let response: Response;
			try {
				response = await fetch(
					`${env.NEXT_PUBLIC_N8N_BASE_URL}/webhook/users/${update.id}`,
					{
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${user.token}`,
						},
						body: JSON.stringify(update),
					}
				);
			} catch (err) {
				if (process.env.NODE_ENV === "development") {
					console.warn("Update user failed (network error)", err);
				}
				throw new Error(
					"Could not connect to the user service. Please try again later."
				);
			}
			let result: N8nResponse | null = null;
			try {
				result = await response.json();
			} catch {}
			if (!response.ok) {
				if (process.env.NODE_ENV === "development") {
					console.warn("Update user failed (network/server)", {
						status: response.status,
					});
				}
				throw new Error(
					response.status === 404
						? "User service is unavailable. Please try again later."
						: response.status === 403
						? "You are not authorized to update users. Please contact support."
						: "Could not connect to the user service. Please try again later."
				);
			}
			if (!result?.success) {
				throw new Error(
					result?.message || "Failed to update user. Please try again later."
				);
			}
			return result;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});

	return {
		...usersQuery,
		updateUser: updateUserMutation.mutateAsync,
		isUpdating: updateUserMutation.isPending,
	};
}
