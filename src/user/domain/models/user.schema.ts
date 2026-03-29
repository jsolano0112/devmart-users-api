import { connection, model, Schema } from 'mongoose';
import { IUser } from '../../../shared/interfaces/users';


const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: false },
  mobilePhone: { type: String, required: false },
  city: { type: String, required: false },
  zipCode: { type: Number, required: false },
  isActive: { type: Boolean, default: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
});

export const User = model<IUser>('User', userSchema);
