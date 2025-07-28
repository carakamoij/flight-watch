import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "../env.mjs";
import type { User } from "../lib/types";
import { useAuthQuery } from "./useAuthQuery";
import { mockUsers } from "../data/mock-users";

export function useUsers() {
	const { user } = useAuthQuery();
	const queryClient = useQueryClient();

	const usersQuery = useQuery<User[]>({
		queryKey: ["users"],
		queryFn: async () => {
			if (process.env.NEXT_PUBLIC_USE_MOCK_USERS === "true") {
				return mockUsers;
			}
			if (!user?.token) throw new Error("Not authenticated");
			const res = await fetch(`${env.NEXT_PUBLIC_N8N_BASE_URL}/webhook/users`, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			});
			if (!res.ok) throw new Error("Failed to fetch users");
			return res.json();
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
			const res = await fetch(
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
			if (!res.ok) throw new Error("Failed to update user");
			return res.json();
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
