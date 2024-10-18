import { z } from 'zod';

const findCompaniesDto = z.object({
  economicGroupId: z.string().optional(),
  legacyId: z.string().optional(),
  registrationNumber: z.string().optional(),
  active: z
    .string()
    .refine((value) => value === 'true' || value === 'false', {
      message: 'Value must be a boolean',
    })
    .transform((value) => value === 'true')
    .optional(),
});

export type FindUserParams = {
  email?: string;
  id?: string;
  clerkId?: string;
};

export type FindUserInput = {
  email?: string;
  id?: string;
  clerkId?: string;
};
