import type { User } from "../entities/User";

/**
 * Login credentials, can be extended with more fields if needed (e.g., rememberMe, etc.).
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Register credentials, can be extended with more fields if needed (e.g., confirmPassword, etc.).
 */
export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

/**
 * Authentication result returned by the auth repository after successful login or registration.
 */
export interface AuthResult {
  token: string;
  user: User;
}

/**
 * Port — defines the contract for any auth adapter (mock, REST API, Supabase, etc.).
 * Swap the infrastructure adapter without touching domain or application layers.
 */
export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResult>;
  register(credentials: RegisterCredentials): Promise<AuthResult>;
  getProfile(token: string): Promise<User>;
}
