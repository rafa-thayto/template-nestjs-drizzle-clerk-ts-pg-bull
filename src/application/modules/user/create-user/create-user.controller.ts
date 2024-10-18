import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserUseCase } from './create-user.usecase';
import { CreateUserDTO } from './create-user.dto';
import { Response } from 'src/core/dtos/response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller()
export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post('/user')
  async createUser(@Body() body: CreateUserDTO) {
    const user = await this.createUserUseCase.exec(body);
    return new Response(user);
  }
}
