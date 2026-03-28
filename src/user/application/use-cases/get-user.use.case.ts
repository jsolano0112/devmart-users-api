import { Exception } from "../../../shared/helpers/exception-message";
import { RepositoryContainer } from "../../../shared/infraestructure/respository-container";
import { IUserResponse } from "../../../shared/interfaces/users";

export class GetUserById {
  constructor(private repo: RepositoryContainer) {}

  async run(id: number): Promise<IUserResponse> {
    const user = await this.repo.users.getUserById(id);
    if (!user) throw new Exception('User not found.', 404);
    const {
      firstName,
      lastName,
      email,
      zipCode,
      mobilePhone,
      address,
      city,
      lockUntil,
      failedLoginAttempts,
    } = user;
    return {
      id,
      firstName,
      lastName,
      email,
      zipCode,
      mobilePhone,
      address,
      city,
      lockUntil,
      failedLoginAttempts,
    };
  }
}
