
import bcrypt from 'bcryptjs';
import { RepositoryContainer } from '../../../shared/infraestructure/respository-container';
import { Exception } from '../../../shared/helpers/exception-message';
import { IUserCredentials, IUserCredentialsResponse } from '../../../shared/interfaces/users';
import { generateToken } from '../../../shared/infraestructure/auth/jwt-service';

export class AuthenticateUser {
  private MAX_ATTEMPTS = 3;
  private LOCK_TIME = 5 * 60 * 1000; // 5 min

  constructor(private repo: RepositoryContainer) {}

  async run(user: IUserCredentials): Promise<IUserCredentialsResponse> {
    const existingUser = await this.repo.users.getUserByEmail(user.email);
    if (existingUser == null) throw new Exception('The email is not registered.', 401);

    if (existingUser.lockUntil && existingUser.lockUntil > new Date()) {
      const remaining = Math.ceil(
        (existingUser.lockUntil.getTime() - Date.now()) / 60000,
      );
      throw new Exception(
        `Account locked. Try again in ${remaining} minutes.`,
        403,
      );
    }

    const isMatch = await bcrypt.compare(user.password, existingUser.password);
    if (!isMatch) {
      existingUser.failedLoginAttempts =
        (existingUser.failedLoginAttempts || 0) + 1;

      if (existingUser.failedLoginAttempts >= this.MAX_ATTEMPTS) {
        existingUser.lockUntil = new Date(Date.now() + this.LOCK_TIME);
        existingUser.failedLoginAttempts = 0;
      }

      await this.repo.users.updateUser(existingUser.id, existingUser);

      throw new Exception('Invalid credentials', 401);
    } else {
      existingUser.failedLoginAttempts = 0;
      existingUser.lockUntil = null;
      await this.repo.users.updateUser(existingUser.id, existingUser);
    }

    const tokens = generateToken({
      uuid: existingUser._id.toString(),
      email: existingUser.email,
      isAdmin: existingUser.isAdmin,
    });

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
