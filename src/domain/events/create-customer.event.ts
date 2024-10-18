import { InsertCustomerDTO } from '@/infra/drizzle/schemas/customer.schema';

export interface CreateCustomerEvent {
  batchId: string;
  customers: InsertCustomerDTO[];
}
