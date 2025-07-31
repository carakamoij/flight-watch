import { jwtDecode, JwtPayload } from "jwt-decode";

export interface DecodedToken extends JwtPayload {
	isAdmin?: boolean;
	email?: string;
}

export function decodeJwt(token: string): DecodedToken {
	try {
		return jwtDecode<DecodedToken>(token);
	} catch {
		return {};
	}
}
