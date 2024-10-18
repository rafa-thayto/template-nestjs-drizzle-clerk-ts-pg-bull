import { DeleteUserUseCase } from './delete-user.usecase';
import { Controller, Delete, Param } from '@nestjs/common';
import { Response } from 'src/core/dtos/response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('v1')
export class DeleteUserController {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}

  @Delete('/user/:userId')
  async deleteUser(@Param('userId') userId: string) {
    await this.deleteUserUseCase.exec(userId);
    return new Response({ success: true, message: 'User deleted' });
  }
}
