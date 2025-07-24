import { env } from "../env.mjs";
import type { Task, FlightSearchParams } from "./types";

// API client for n8n webhooks
export class N8nApi {
	private static instance: N8nApi;

	static getInstance(): N8nApi {
		if (!N8nApi.instance) {
			N8nApi.instance = new N8nApi();
		}
		return N8nApi.instance;
	}

	private getBaseUrl(): string {
		return env.NEXT_PUBLIC_N8N_BASE_URL;
	}

	async createOrUpdateTask(params: FlightSearchParams): Promise<Task> {
		const url = `${this.getBaseUrl()}${env.NEXT_PUBLIC_N8N_SCHEDULE_ENDPOINT}`;

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(params),
		});

		if (!response.ok) {
			throw new Error(`Failed to create/update task: ${response.statusText}`);
		}

		return response.json();
	}

	async getTasks(email: string): Promise<Task[]> {
		const url = `${this.getBaseUrl()}${
			env.NEXT_PUBLIC_N8N_TASKS_ENDPOINT
		}?email=${encodeURIComponent(email)}`;

		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch tasks: ${response.statusText}`);
		}

		const data = await response.json();
		return Array.isArray(data) ? data : [];
	}
}

export const n8nApi = N8nApi.getInstance();
