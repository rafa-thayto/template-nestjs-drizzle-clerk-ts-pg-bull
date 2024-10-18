import { insertCustomerSchema } from '@/infra/drizzle/schemas/customer.schema';
import { z } from 'zod';

export const createCustomersSyncSchema = z.object({
  customers: z.array(insertCustomerSchema),
});

export type CreateCustomersSyncDTO = z.infer<typeof createCustomersSyncSchema>;
