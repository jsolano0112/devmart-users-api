import { UserRepository } from '../../user/domain/repositories/user-repository';

export class RepositoryContainer {
  public readonly users: UserRepository;

  constructor() {
    this.users = new UserRepository();
  }
}
