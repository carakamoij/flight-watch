// Standard response type for all n8n webhook responses
export type N8nResponse = {
	success: boolean;
	error?: string;
	message: string;
	token?: string; // Optional token for auth responses
	[key: string]: unknown; // for extra fields if needed
};
export type Task = {
	id: string;
	email: string;
	origin: string; // Airport name like "Luqa"
	destination: string; // Airport name like "Catania"
	outboundDate: string; // YYYY-MM-DD format
	returnDate: string; // YYYY-MM-DD format
	priceThreshold: number;
	checkOutbound: boolean;
	checkReturn: boolean;
	currency: string;
	createdAt: string; // ISO string
	isActive: boolean;
};

export type n8nTask = Task & {
	lastCheckedAt: string; // <-- NEW
	outboundPrice: number | null; // <-- NEW
	returnPrice: number | null; // <-- NEW
	apiCalls: number; // <-- NEW
};

export type Airport = {
	name: string;
	code: string;
	city: string;
};

export type AuthUser = {
	email: string;
	token: string;
	isAdmin: boolean;
};

export type FlightSearchParams = {
	email: string;
	origin: string;
	destination: string;
	outboundDate: string;
	returnDate: string;
	priceThreshold: number;
	checkOutbound: boolean;
	checkReturn: boolean;
	currency: string;
};

export type User = {
	id: string;
	email: string;
	is_active: boolean;
	isAdmin: boolean;
	tasksCount: number;
	created_at?: string;
	updated_at?: string;
};
