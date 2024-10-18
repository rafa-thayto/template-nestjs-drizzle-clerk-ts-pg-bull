import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '@/infra/drizzle/drizzle.service';
import { customerTable } from '@/infra/drizzle/schemas';

@Injectable()
export class ListCustomersUseCase {
  constructor(private readonly db: DrizzleService) {}

  async exec() {
    const customers = await this.db.database.select().from(customerTable);

    const customersExist = customers.length > 0;

    if (!customersExist) {
      throw new NotFoundException('Customers not found');
    }

    return customers;
  }
}
