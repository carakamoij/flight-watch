import { env } from "../env.mjs";

/**
 * Returns the full n8n API URL for a given endpoint key.
 * @param endpointKey One of: 'register', 'login', , 'tasks' or 'adminUsers'
 * @returns Full URL string
 */
export function getN8nApiUrl(
	endpointKey: "register" | "login" | "schedule" | "tasks" | "adminUsers"
) {
	const base = env.NEXT_PUBLIC_N8N_BASE_URL.replace(/\/$/, "");
	switch (endpointKey) {
		case "register":
			return base + env.NEXT_PUBLIC_N8N_AUTH_REGISTER_ENDPOINT;
		case "login":
			return base + env.NEXT_PUBLIC_N8N_AUTH_LOGIN_ENDPOINT;
		case "tasks":
			return base + env.NEXT_PUBLIC_N8N_TASKS_ENDPOINT;
		case "adminUsers":
			return base + env.NEXT_PUBLIC_N8N_ADMIN_USERS_ENDPOINT;

		default:
			throw new Error("Unknown n8n endpoint key: " + endpointKey);
	}
}
