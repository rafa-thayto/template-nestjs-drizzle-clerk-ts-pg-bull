import { Controller, Get } from '@nestjs/common';
import { ListCustomersUseCase } from './list-customers.usecase';
import { Response } from 'src/core/dtos/response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Customers')
@Controller('v1')
export class ListCustomersController {
  constructor(private readonly listCustomersUseCase: ListCustomersUseCase) {}

  @Get('/customers')
  async listCustomers() {
    const customers = await this.listCustomersUseCase.exec();
    return new Response({ success: true, customers });
  }
}
