import { Injectable, Logger } from '@nestjs/common';
import { CreateCustomersSyncDTO } from './create-customers-sync.dto';
import { DrizzleService } from '@/infra/drizzle/drizzle.service';
import { customerTable } from '@/infra/drizzle/schemas';
import { AuthUser } from '@/core/decorators/auth-user.decorator';

@Injectable()
export class CreateCustomersSyncUseCase {
  private readonly logger = new Logger(CreateCustomersSyncUseCase.name);
  constructor(private readonly drizzle: DrizzleService) {}

  async exec(data: CreateCustomersSyncDTO, user: AuthUser) {
    this.logger.log('CreateCreditorUseCase', data);
    const customer = data.customers.map((customer) => ({
      ...customer,
      organizationId: user.orgId,
    }));
    this.drizzle.db.transaction(async (tx) => {
      await tx.insert(customerTable).values(customer);
      throw new Error('Not implemented');
      // const customers = await this.drizzle
      //   .insert(customerTable)
      //   .values(data.customers)
      //   .returning();
    });
  }
}
