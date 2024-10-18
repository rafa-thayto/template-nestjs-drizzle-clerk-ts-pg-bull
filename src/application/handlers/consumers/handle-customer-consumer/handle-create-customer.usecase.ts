import { DrizzleService } from '@/infra/drizzle/drizzle.service';
import { Injectable } from '@nestjs/common';
import { customerTable } from '@/infra/drizzle/schemas';
import { CreateCustomersDTO } from '@/application/modules/customer/create-customers/create-customers.dto';
import { InsertCustomerDTO } from '@/infra/drizzle/schemas/customer.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class HandleCreateCustomerUseCase {
  constructor(private readonly drizzle: DrizzleService) {}

  async exec(data: CreateCustomersDTO) {
    const customersWithErrors: CreateCustomersDTO['customers'] = [];
    const createdCustomers: CreateCustomersDTO['customers'] = [];

    const customers = data.customers;
    for (const customerData of customers) {
      try {
        await this.drizzle.insert(customerTable).values(customerData);
        createdCustomers.push(customerData);
      } catch (error: any) {
        customersWithErrors.push(customerData);
        continue;
      }
    }

    return true;
  }

  private async isDocumentNumberUnique(
    documentNumber: string,
  ): Promise<boolean> {
    const existingCustomer = await this.drizzle
      .select()
      .from(customerTable)
      .where(eq(customerTable.documentNumber, documentNumber))
      .limit(1);
    return existingCustomer.length === 0;
  }
}
