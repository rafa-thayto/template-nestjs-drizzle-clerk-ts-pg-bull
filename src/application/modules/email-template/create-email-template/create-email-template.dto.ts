import { z } from 'zod';
import { insertWildcardSchema } from '@/infra/drizzle/schemas/wildcard.schema';

export const wildcardSchema = insertWildcardSchema.pick({
  type: true,
  label: true,
});

export const createEmailTemplateSchema = z.object({
  title: z.string(),
  html: z.string(),
  wildcards: z.array(wildcardSchema),
});

export type CreateEmailTemplateDTO = z.infer<typeof createEmailTemplateSchema>;

export type UpsertEmailTemplateDTO = Omit<
  CreateEmailTemplateDTO,
  'wildcards'
> & {
  id?: string;
  wildcards: {
    id?: string;
    label: string;
    type: string;
  }[];
};
