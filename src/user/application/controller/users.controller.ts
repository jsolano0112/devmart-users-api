import { Request, Response, NextFunction } from 'express';
import { UserServiceContainer } from '../../infraestructure/user-service-container';
import { IUser, IUserCredentials } from '../../../shared/interfaces/users';

export class UserController {
  public async getById(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = request.params;
      const user = await UserServiceContainer.getUserById.run(Number(id));
      return response.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  public async create(
    request: Request<null, void, IUser>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      await UserServiceContainer.createUser.run(request.body);
      return response.status(200).json('User created.');
    } catch (error) {
      next(error);
    }
  }

  public async update(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = request.params;
      await UserServiceContainer.updateUser.run(request.body, Number(id));
      return response.status(200).json('User updated.');
    } catch (error) {
      next(error);
    }
  }

  public async auth(
    request: Request<null, void, IUserCredentials>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const credentials = await UserServiceContainer.authenticateUser.run(
        request.body,
      );
      return response.status(200).json(credentials);
    } catch (error) {
      next(error);
    }
  }

  public async refresh(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const credentials = await UserServiceContainer.refreshToken.run(
        request.body.refreshToken,
      );
      return response.status(200).json(credentials);
    } catch (error) {
      next(error);
    }
  }
}
