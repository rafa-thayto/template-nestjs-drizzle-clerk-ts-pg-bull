import { Body, Controller, Post } from '@nestjs/common';
import { CreateCustomersDTO } from './create-customers.dto';
import { CreateCustomersUseCase } from './create-customers.usecase';
import { Response } from 'src/core/dtos/response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Customers')
@Controller('v1')
export class CreateCustomersController {
  constructor(private readonly createCusomersUseCase: CreateCustomersUseCase) {}

  @Post('/customers')
  async createCustomers(@Body() body: CreateCustomersDTO) {
    const batch = await this.createCusomersUseCase.exec(body);
    return new Response({ integrationCode: batch.integrationCode });
  }
}
