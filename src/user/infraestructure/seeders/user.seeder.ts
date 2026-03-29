import bcrypt from 'bcryptjs';
import { User } from '../../domain/models/user.schema';

const SEED_PLAIN_PASSWORD = '123456Aa*';

export const seedUsers = async () => {
  console.log('🌱 Initializing user seeders...');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(SEED_PLAIN_PASSWORD, salt);

  const users = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      address: '742 Evergreen Terrace',
      mobilePhone: '3004567890',
      city: 'Springfield',
      zipCode: 110111,
      isActive: true,
      password: hashedPassword,
      isAdmin: true,
      failedLoginAttempts: 0,
      lockUntil: null,
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      address: 'Av. Principal 123',
      mobilePhone: '3119876543',
      city: 'Medellín',
      zipCode: 50010,
      isActive: true,
      password: hashedPassword,
      isAdmin: false,
      failedLoginAttempts: 0,
      lockUntil: null,
    },
    {
      id: 3,
      firstName: 'Carlos',
      lastName: 'González',
      email: 'carlos.gonzalez@example.com',
      address: 'Calle 8 #15-22',
      mobilePhone: '3123456789',
      city: 'Bogotá',
      zipCode: 110231,
      isActive: false,
      password: hashedPassword,
      isAdmin: false,
      failedLoginAttempts: 1,
      lockUntil: null,
    },
  ];

  await User.deleteMany({});
  console.log('🧽 Previous users deleted.');

  await User.insertMany(users);
  console.log(`✅ ${users.length} users inserted successfully.`);
};
