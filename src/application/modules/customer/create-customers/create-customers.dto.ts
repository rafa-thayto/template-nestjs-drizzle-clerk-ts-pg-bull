import { insertCustomerSchema } from '@/infra/drizzle/schemas/customer.schema';
import { z } from 'zod';

export const createCustomersSchema = z.object({
  customers: z.array(insertCustomerSchema),
});

export type CreateCustomersDTO = z.infer<typeof createCustomersSchema>;
