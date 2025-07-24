import type { Airport } from "./types";

// Airport data for Malta ↔ Catania route
export const airports: Airport[] = [
	{
		name: "Luqa",
		code: "MLA",
	},
	{
		name: "Catania",
		code: "CTA",
	},
];

// Default search parameters
export const defaultSearchParams = {
	priceThreshold: 25,
	currency: "EUR",
	checkOutbound: true,
	checkReturn: true,
};
