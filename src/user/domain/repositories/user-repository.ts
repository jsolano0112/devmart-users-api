import { IUpdateUser, IUser } from '../../../shared/interfaces/users';
import { User } from '../models/user.schema';

export class UserRepository {
  public async getUserById(id: number) {
    try {
      return await User.findOne({ id });
    } catch (error) {
      throw error;
    }
  }

  public async getUserByEmail(email: string) {
    try {
      const user = await User.findOne({ email: email });
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async createUser(user: IUser): Promise<void> {
    try {
      const newUser = new User(user);
      await newUser.save();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async updateUser(id: number, user: IUpdateUser): Promise<void> {
    try {
      await User.findOneAndUpdate({ id }, { $set: user }, { new: true });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
