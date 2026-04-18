import type { IAuthRepository, LoginCredentials, AuthResult } from "../../domain/repositories/IAuthRepository";

export class LoginUseCase {
  constructor(private readonly repo: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthResult> {
    if (!credentials.email || !credentials.password) {
      throw new Error("auth.errors.required");
    }
    return this.repo.login(credentials);
  }
}
