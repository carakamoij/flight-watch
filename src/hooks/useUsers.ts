"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getN8nApiUrl } from "../lib/n8nApiUrl";
import type { User, N8nResponse, UserApi } from "../lib/types";
import api from "../lib/api";
import { useAuth } from "./useAuth";

export function useUsers() {
	const { user } = useAuth();
	const queryClient = useQueryClient();

	const usersQuery = useQuery<User[], Error>({
		queryKey: ["users"],
		queryFn: async () => {
			if (!user?.token) throw new Error("Not authenticated");
			const response = await api.get<N8nResponse>(getN8nApiUrl("adminUsers"), {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			});
			console.log(response.data.success, response.data.users);
			if (!response.data?.success) {
				throw new Error(
					response.data?.message ||
						"Failed to fetch users. Please try again later."
				);
			}
			return (response.data.users as UserApi[]).map((user) => ({
				...user,
				isActive: user.is_active,
				isAdmin: user.is_admin,
				createdAt: user.created_at,
				updatedAt: user.updated_at,
			}));
		},
		enabled: !!user?.token || process.env.NEXT_PUBLIC_USE_MOCK_USERS === "true",
	});

	const updateUserMutation = useMutation({
		mutationFn: async (update: {
			id: string;
			is_active: boolean | null;
			is_admin: boolean | null;
		}) => {
			if (!user?.token) throw new Error("Not authenticated");
			const response = await api.patch<N8nResponse>(
				getN8nApiUrl("adminUsers"),
				// dynamic id url in n8n - bye
				// env.NEXT_PUBLIC_N8N_BASE_URL_TEST +
				// 	env.NEXT_PUBLIC_N8N_ADMIN_USERS_ENDPOINT, //+ `/${update.id}/edit`,
				//"https://n8n.carakamoij.cc/webhook-test/5cc573c8-e29e-4fa8-bc7e-9e48b74c28a4/admin/users/26/edit",
				update,
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			);
			console.log("updated user:", response.data);
			if (!response.data?.success) {
				throw new Error(
					response.data?.message ||
						"Failed to update user. Please try again later."
				);
			}
			return response.data;
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
