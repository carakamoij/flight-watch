import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		// Server-side environment variables (none for this static app)
	},
	client: {
		NEXT_PUBLIC_N8N_BASE_URL: z.string().url(),
		NEXT_PUBLIC_N8N_SCHEDULE_ENDPOINT: z.string().min(1),
		NEXT_PUBLIC_N8N_TASKS_ENDPOINT: z.string().min(1),
		NEXT_PUBLIC_APP_SECRET: z.string().min(8),
	},
	runtimeEnv: {
		NEXT_PUBLIC_N8N_BASE_URL: process.env.NEXT_PUBLIC_N8N_BASE_URL,
		NEXT_PUBLIC_N8N_SCHEDULE_ENDPOINT:
			process.env.NEXT_PUBLIC_N8N_SCHEDULE_ENDPOINT,
		NEXT_PUBLIC_N8N_TASKS_ENDPOINT: process.env.NEXT_PUBLIC_N8N_TASKS_ENDPOINT,
		NEXT_PUBLIC_APP_SECRET: process.env.NEXT_PUBLIC_APP_SECRET,
	},
});
