import { FindUserParams } from './find-user.dto';
import { FindUserUseCase } from './find-user.usecase';
import { Controller, Get, Query } from '@nestjs/common';
import { Response } from 'src/core/dtos/response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('v1')
export class FindUserController {
  constructor(private readonly findUserUseCase: FindUserUseCase) {}

  @Get('/user')
  async findUser(@Query() query: FindUserParams) {
    const user = await this.findUserUseCase.exec(query);
    return new Response(user);
  }
}
