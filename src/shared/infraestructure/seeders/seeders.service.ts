
import { seedUsers } from '../../../user/infraestructure/seeders/user.seeder';
import { dbConnection } from '../db/mongodb.config';

(async () => {
  await dbConnection();
  await seedUsers();
  console.log('✅ All seeders completed.');
  process.exit(0);
})();
