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
}

export type Airport = {
  name: string;
  code?: string; // Optional IATA code for reference
}

export type AuthUser = {
  email: string;
  token: string;
  loginTime: number;
}

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
}
