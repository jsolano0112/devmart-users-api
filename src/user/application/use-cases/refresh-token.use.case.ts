import { Exception } from "../../../shared/helpers/exception-message";
import { generateToken, verifyRefreshToken } from "../../../shared/infraestructure/auth/jwt-service";
import { RepositoryContainer } from "../../../shared/infraestructure/respository-container";
import { IUserCredentialsResponse } from "../../../shared/interfaces/users";

export class RefreshToken {
  constructor(private repo: RepositoryContainer) {}

  async run(refreshToken: string): Promise<IUserCredentialsResponse> {
    if (!refreshToken) {
      throw new Exception('missing token', 400);
    }

    const payload = verifyRefreshToken(refreshToken);

    const existingUser = await this.repo.users.getUserByEmail(payload.email);
    const tokens = generateToken(payload);

    return {
      email: existingUser.email,
      id: existingUser.id,
      firstname: existingUser.firstName,
      lastname: existingUser.lastName,
      isAdmin: existingUser.isAdmin,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
