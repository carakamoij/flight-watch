import { env } from "../env.mjs"
import type { AuthUser } from "./types"

const AUTH_TOKEN_KEY = 'flight-watcher-auth';
const TOKEN_EXPIRY_DAYS = 7;

// Simple client-side authentication
export class AuthService {
  private static instance: AuthService;
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  login(email: string, password: string): boolean {
    // Validate against the shared secret password
    if (password !== env.NEXT_PUBLIC_APP_SECRET) {
      throw new Error('Invalid credentials');
    }

    const user: AuthUser = {
      email,
      token: this.generateToken(email),
      loginTime: Date.now(),
    };

    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(user));
    return true;
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  getCurrentUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!stored) return null;

      const user: AuthUser = JSON.parse(stored);
      
      // Check if token is expired
      const daysSinceLogin = (Date.now() - user.loginTime) / (1000 * 60 * 60 * 24);
      if (daysSinceLogin > TOKEN_EXPIRY_DAYS) {
        this.logout();
        return null;
      }

      return user;
    } catch {
      this.logout();
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  private generateToken(email: string): string {
    // Simple token generation (email + timestamp hash)
    const timestamp = Date.now().toString();
    const payload = `${email}:${timestamp}`;
    return btoa(payload);
  }
}

export const authService = AuthService.getInstance();
