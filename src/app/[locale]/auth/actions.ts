"use server";

import { cookies } from "next/headers";
import { authRepository } from "@/modules/auth/infrastructure/auth-repository.instance";
import { LoginUseCase } from "@/modules/auth/application/use-cases/login.use-case";
import { RegisterUseCase } from "@/modules/auth/application/use-cases/register.use-case";
import { AUTH_COOKIE, COOKIE_OPTIONS } from "@/shared/lib/auth";
import type { User } from "@/modules/auth/domain/entities/User";

/**
 * Action result type for authentication actions. It can contain either an error message or the authenticated user.
 * This type is used as the return type for login and register actions to provide a consistent structure for handling results in the UI.
 */
export interface ActionResult {
  error?: string;
  user?: User;
}

/**
 * Login action that handles user authentication. It uses the LoginUseCase to perform the login operation and manages the authentication token in cookies.
 * @param email - The email of the user trying to log in.
 * @param password - The password of the user trying to log in.
 * @returns An ActionResult containing either an error message or the authenticated user.
 */
export async function loginAction(
  email: string,
  password: string
): Promise<ActionResult> {
  try {
    const useCase = new LoginUseCase(authRepository);
    const { token, user } = await useCase.execute({ email, password });

    const store = await cookies();
    store.set(AUTH_COOKIE, token, COOKIE_OPTIONS);

    return { user };
  } catch (err) {
    const key = err instanceof Error ? err.message : "auth.errors.unknown";
    return { error: key };
  }
}

/**
 * Register action that handles user registration. It uses the RegisterUseCase to perform the registration operation and manages the authentication token in cookies.
 * @param name - The name of the user trying to register.
 * @param email - The email of the user trying to register.
 * @param password  - The password of the user trying to register.
 * @returns An ActionResult containing either an error message or the authenticated user.
 */
export async function registerAction(
  name: string,
  email: string,
  password: string
): Promise<ActionResult> {
  try {
    const useCase = new RegisterUseCase(authRepository);
    const { token, user } = await useCase.execute({ name, email, password });

    const store = await cookies();
    store.set(AUTH_COOKIE, token, COOKIE_OPTIONS);

    return { user };
  } catch (err) {
    const key = err instanceof Error ? err.message : "auth.errors.unknown";
    return { error: key };
  }
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
}
