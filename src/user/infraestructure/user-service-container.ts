import { RepositoryContainer } from '../../shared/infraestructure/respository-container';
import { AuthenticateUser } from '../application/use-cases/authenticate-user.use.case';
import { CreateUser } from '../application/use-cases/create-user.use-case';
import { GetUserById } from '../application/use-cases/get-user.use.case';
import { RefreshToken } from '../application/use-cases/refresh-token.use.case';
import { UpdateUser } from '../application/use-cases/update-user.use-case';

const repositories = new RepositoryContainer();

export const UserServiceContainer = {
  getUserById: new GetUserById(repositories),
  createUser: new CreateUser(repositories),
  updateUser: new UpdateUser(repositories),
  authenticateUser: new AuthenticateUser(repositories),
  refreshToken: new RefreshToken(repositories),
};
