import { Controller, Get } from '@nestjs/common';
import { ListUsersUseCase } from './list-users.usecase';
import { Response } from 'src/core/dtos/response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('v1')
export class ListUsersController {
  constructor(private readonly listUsersUseCase: ListUsersUseCase) {}

  @Get('/users')
  async getUsers() {
    const users = await this.listUsersUseCase.exec();
    return new Response({ success: true, users });
  }
}
