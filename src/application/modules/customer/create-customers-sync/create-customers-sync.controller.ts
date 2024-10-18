import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateCustomersSyncDTO } from './create-customers-sync.dto';
import { CreateCustomersSyncUseCase } from './create-customers-sync.usecase';
import { Response } from 'src/core/dtos/response.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@/core/decorators/auth-user.decorator';
import { ClerkAuthGuard } from '@/core/guards/clerk-auth.guard';

@ApiTags('Customers')
@Controller('v1')
export class CreateCustomersSyncController {
  constructor(
    private readonly createCusomersSyncUseCase: CreateCustomersSyncUseCase,
  ) {}

  @Post('/customers/sync')
  @UseGuards(ClerkAuthGuard)
  async createCustomersSync(
    @Body() body: CreateCustomersSyncDTO,
    @AuthUser() user: AuthUser,
  ) {
    await this.createCusomersSyncUseCase.exec(body, user);
    return new Response({ message: 'Customers created successfully' });
  }
}
