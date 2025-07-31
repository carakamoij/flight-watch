// Registration uses a React Query mutation because it is a one-off async operation
// that does not need to update global auth state instantly. Login uses context for instant state.
// This hook is required for register-form.tsx and should not be removed.
"use client";

import { useMutation } from "@tanstack/react-query";
import { getN8nApiUrl } from "../lib/n8nApiUrl";
import type { N8nResponse } from "../lib/types";
import api from "../lib/api";

interface RegisterData {
	email: string;
	pin: string;
}

export function useRegister() {
	return useMutation<N8nResponse, Error, RegisterData>({
		mutationFn: async (data: RegisterData): Promise<N8nResponse> => {
			const response = await api.post<N8nResponse>(
				getN8nApiUrl("register"),
				data
			);
			if (!response.data?.success) {
				throw new Error(
					response.data?.message ||
						"Registration failed. Please check your details and try again."
				);
			}
			return response.data;
		},
	});
}
