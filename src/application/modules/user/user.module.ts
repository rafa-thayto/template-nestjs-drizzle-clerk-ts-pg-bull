import { Module } from '@nestjs/common';
import { FindUserController } from './find-user/find-user.controller';
import { CreateUserController } from './create-user/create-user.controller';
import { DeleteUserController } from './delete-user/delete-user.controller';
import { CreateUserUseCase } from './create-user/create-user.usecase';
import { DeleteUserUseCase } from './delete-user/delete-user.usecase';
import { FindUserUseCase } from './find-user/find-user.usecase';
import { ListUsersController } from './list-users/list-users.controller';
import { ListUsersUseCase } from './list-users/list-users.usecase';

@Module({
  imports: [],
  controllers: [
    CreateUserController,
    DeleteUserController,
    FindUserController,
    ListUsersController,
  ],
  providers: [
    FindUserUseCase,
    CreateUserUseCase,
    DeleteUserUseCase,
    ListUsersUseCase,
  ],
})
export class UserModule {}
