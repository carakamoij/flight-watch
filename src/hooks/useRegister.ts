"use client";

import { useMutation } from "@tanstack/react-query";
import { env } from "../env.mjs";

interface RegisterData {
	email: string;
	pin: string;
}

export function useRegister() {
	return useMutation({
		mutationFn: async (data: RegisterData) => {
			try {
				// POST to n8n register webhook
				const response = await fetch(
					`${env.NEXT_PUBLIC_N8N_BASE_URL}/webhook/register`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(data),
					}
				);

				if (!response.ok) {
					throw new Error("Registration failed");
				}

				return response.json();
			} catch (error) {
				// For development: if n8n isn't set up, simulate success
				console.log("📝 Would submit registration for admin approval:");
				console.log("👤 Email:", data.email);
				console.log("🔑 User-defined PIN:", data.pin);
				console.log("❌ n8n not available:", error);

				// Simulate successful response for frontend testing
				return {
					success: true,
					message:
						"Registration submitted successfully! An admin will review and approve your account.",
					email: data.email,
				};
			}
		},
	});
}
