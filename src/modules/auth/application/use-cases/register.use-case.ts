import type { IAuthRepository, RegisterCredentials, AuthResult } from "../../domain/repositories/IAuthRepository";

export class RegisterUseCase {
  constructor(private readonly repo: IAuthRepository) {}

  async execute(credentials: RegisterCredentials): Promise<AuthResult> {
    if (!credentials.name || !credentials.email || !credentials.password) {
      throw new Error("auth.errors.required");
    }
    return this.repo.register(credentials);
  }
}
