
import bcrypt from 'bcryptjs';
import { RepositoryContainer } from '../../../shared/infraestructure/respository-container';
import { IUpdateUser } from '../../../shared/interfaces/users';
import { Exception } from '../../../shared/helpers/exception-message';

export class UpdateUser {
  constructor(private repo: RepositoryContainer) {}

  async run(user: IUpdateUser, id: number): Promise<void> {
    const dbUser = await this.repo.users.getUserById(id);
    if (!dbUser) throw new Exception('User not found.', 404);
    if (dbUser.email !== user.email) {
      const existingUser = await this.repo.users.getUserByEmail(user.email);
      if (existingUser) throw new Exception('The user already exists.', 409);
      // await validateEmailDomain(user.email);
    }

    if (user.password != '' && user.password != null) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
    }

    const userUpdated: IUpdateUser = {
      failedLoginAttempts: user.failedLoginAttempts,
      lockUntil: user.lockUntil,
      email: user.email ? user.email : dbUser.email,
      firstName: user.firstName ? user.firstName : dbUser.firstName,
      lastName: user.lastName ? user.lastName : dbUser.lastName,
      city: user.city ? user.city : dbUser.city,
      mobilePhone: user.mobilePhone ? user.mobilePhone : dbUser.mobilePhone,
      address: user.address ? user.address : dbUser.address,
      zipCode: user.zipCode ? user.zipCode : dbUser.zipCode,
      isActive: user.isActive,
      isAdmin: dbUser.isAdmin,
      password: user.password ? user.password : dbUser.password,
    };
    await this.repo.users.updateUser(id, userUpdated);
  }
}
