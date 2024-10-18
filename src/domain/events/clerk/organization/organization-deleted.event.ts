import { z } from 'zod';

export const clerkOrganizationDeletedEventSchema = z.object({
  data: z.object({
    deleted: z.boolean(),
    id: z.string(),
    object: z.literal('organization'),
  }),
  event_attributes: z.object({
    http_request: z.object({
      client_ip: z.string(),
      user_agent: z.string(),
    }),
  }),
  object: z.literal('event'),
  timestamp: z.number(),
  type: z.literal('organization.deleted'),
});
