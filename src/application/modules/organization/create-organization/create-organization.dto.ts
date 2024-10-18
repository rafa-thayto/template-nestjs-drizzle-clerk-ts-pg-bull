import { z } from 'zod';

export const createOrganizationDto = z.object({
  documentNumber: z.string().max(30),
  name: z.string().max(100),
});

export type CreateOrganizationDto = z.infer<typeof createOrganizationDto>;
