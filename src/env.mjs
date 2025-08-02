import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		// Server-side environment variables (none for this static app)
	},
	client: {
		NEXT_PUBLIC_N8N_BASE_URL: z.url().min(1),
		NEXT_PUBLIC_N8N_TASKS_ENDPOINT: z.string().min(1),
		NEXT_PUBLIC_N8N_AUTH_REGISTER_ENDPOINT: z.string().min(1),
		NEXT_PUBLIC_N8N_AUTH_LOGIN_ENDPOINT: z.string().min(1),
		NEXT_PUBLIC_N8N_ADMIN_USERS_ENDPOINT: z.string().min(1),
	},
	runtimeEnv: {
		NEXT_PUBLIC_N8N_BASE_URL: process.env.NEXT_PUBLIC_N8N_BASE_URL,
		NEXT_PUBLIC_N8N_TASKS_ENDPOINT: process.env.NEXT_PUBLIC_N8N_TASKS_ENDPOINT,
		NEXT_PUBLIC_N8N_AUTH_REGISTER_ENDPOINT:
			process.env.NEXT_PUBLIC_N8N_AUTH_REGISTER_ENDPOINT,
		NEXT_PUBLIC_N8N_AUTH_LOGIN_ENDPOINT:
			process.env.NEXT_PUBLIC_N8N_AUTH_LOGIN_ENDPOINT,
		NEXT_PUBLIC_N8N_ADMIN_USERS_ENDPOINT:
			process.env.NEXT_PUBLIC_N8N_ADMIN_USERS_ENDPOINT,
	},
});
