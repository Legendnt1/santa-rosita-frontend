import { MockAuthRepository } from "./adapters/MockAuthRepository";

/**
 * Singleton auth repository instance.
 * Swap MockAuthRepository → ApiAuthRepository here when the real API is ready.
 */
export const authRepository = new MockAuthRepository();
