import { env } from "@/env.mjs";
import axios from "axios";
import { useAuth } from "@/hooks";

const api = axios.create({
	baseURL: env.NEXT_PUBLIC_N8N_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 10000, // optional
});

// Auto-handle 401s globally
api.interceptors.response.use(
	(response) => response,
	(error) => {
		console.log("API request failed:", error);
		if (error.response?.status === 401) {
			// Call logout from AuthContext if available
			try {
				const { logout } = useAuth?.() || {};
				if (typeof logout === "function") {
					logout();
				}
			} catch (e) {
				// If useAuth is called outside provider, ignore
			}
		}
		if (typeof error === "object" && error.response?.data?.message) {
			error.message = error.response.data.message; //override error message with message returned by API.
		}
		return Promise.reject(error);
	}
);

api.interceptors.response.use((response) => {
	// Optionally: log successful responses
	console.log(response.status);
	return response;
});

export default api;
