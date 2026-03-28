import { Exception } from "../../../shared/helpers/exception-message";
import { RepositoryContainer } from "../../../shared/infraestructure/respository-container";
import { IUser } from "../../../shared/interfaces/users";
import bcrypt from 'bcryptjs';

export class CreateUser {
  constructor(private repo: RepositoryContainer) {}

  async run(user: IUser): Promise<void> {
    const existingUser = await this.repo.users.getUserByEmail(user.email);
    if (existingUser) throw new Exception('The user already exists.', 409);

    // await validateEmailDomain(user.email);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    //TODO: NOTIFICATION
    this.repo.users.createUser(user);
  }
}
