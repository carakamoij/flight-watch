// Login uses a React Query mutation for robust error handling and async state updates.
// It is used by AuthContext to update global auth state instantly after login.
// This hook is required for AuthContext and should not be removed.
"use client";

import { useMutation } from "@tanstack/react-query";
import { getN8nApiUrl } from "../lib/n8nApiUrl";
import type { N8nResponse } from "../lib/types";
import api from "../lib/api";

interface LoginData {
	email: string;
	secretKey: string;
	pin: string;
}

export function useLogin() {
	return useMutation<string, Error, LoginData>({
		mutationFn: async (data: LoginData): Promise<string> => {
			const response = await api.post<N8nResponse>(getN8nApiUrl("login"), data);
			if (!response.data?.success || !response.data?.token) {
				throw new Error(
					response.data?.message ||
						"Login failed. Please check your credentials and try again."
				);
			}
			return response.data.token;
		},
	});
}
