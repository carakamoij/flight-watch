import type { Airport } from "./types";

// Airport data for Malta ↔ Catania route
export const airports: Airport[] = [
	{
		name: "Malta International Airport",
		code: "MLA",
		city: "Luqa",
	},
	{
		name: "Catania-Fontanarossa Airport",
		code: "CTA",
		city: "Catania",
	},
];

export const getAirportByCode = (code: string): Airport | undefined => {
	return airports.find((airport) => airport.code === code);
};

export const getAirportName = (code: string): string => {
	const airport = airports.find((a) => a.code === code);
	return airport ? `${airport.city} (${airport.code})` : code;
};

// Default search parameters
export const defaultSearchParams = {
	priceThreshold: 25,
	currency: "EUR",
	checkOutbound: true,
	checkReturn: true,
};
