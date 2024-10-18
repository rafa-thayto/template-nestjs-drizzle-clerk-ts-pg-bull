import { z } from 'zod';

export const createUserSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  phone: z.string(),
  phoneVerified: z.boolean(),
  email: z.string(),
  emailVerified: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  clerkId: z.string().optional(),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
