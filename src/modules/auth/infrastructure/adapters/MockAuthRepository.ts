import type {
  IAuthRepository,
  LoginCredentials,
  RegisterCredentials,
  AuthResult,
} from "../../domain/repositories/IAuthRepository";
import type { User } from "../../domain/entities/User";

/**
 * Fake in-memory store so register persists within the same process session.
 * Replace this entire class with a real API adapter (REST/Supabase) in Phase 2.
 */
const registeredUsers: Map<string, { passwordHash: string; user: User }> = new Map([
  [
    "demo@santarosita.pe",
    {
      passwordHash: "demo1234",
      user: { id: "usr_demo", name: "Demo User", email: "demo@santarosita.pe", role: "customer" },
    },
  ],
]);

function buildFakeJwt(user: User): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({ sub: user.id, email: user.email, role: user.role, iat: Date.now() })
  );
  // Signature is intentionally fake — swap with real JWT signing in production.
  const signature = btoa(`mock_sig_${user.id}`);
  return `${header}.${payload}.${signature}`;
}

function decodePayload(token: string): { sub: string; email: string } | null {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export class MockAuthRepository implements IAuthRepository {
  async login({ email, password }: LoginCredentials): Promise<AuthResult> {
    await new Promise((r) => setTimeout(r, 600)); // simulate network latency

    const entry = registeredUsers.get(email.toLowerCase());
    if (!entry || entry.passwordHash !== password) {
      throw new Error("auth.errors.invalidCredentials");
    }

    return { token: buildFakeJwt(entry.user), user: entry.user };
  }

  async register({ name, email, password }: RegisterCredentials): Promise<AuthResult> {
    await new Promise((r) => setTimeout(r, 700));

    const key = email.toLowerCase();
    if (registeredUsers.has(key)) {
      throw new Error("auth.errors.emailTaken");
    }

    const user: User = {
      id: `usr_${Date.now()}`,
      name,
      email: key,
      role: "customer",
    };

    registeredUsers.set(key, { passwordHash: password, user });

    return { token: buildFakeJwt(user), user };
  }

  async getProfile(token: string): Promise<User> {
    const payload = decodePayload(token);
    if (!payload) throw new Error("auth.errors.invalidToken");

    const entry = registeredUsers.get(payload.email);
    if (!entry) throw new Error("auth.errors.userNotFound");

    return entry.user;
  }
}
