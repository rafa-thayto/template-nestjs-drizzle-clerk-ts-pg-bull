import { z } from 'zod';

export const clerkUserDeletedEventSchema = z.object({
  data: z.object({
    deleted: z.boolean(),
    id: z.string(),
    object: z.literal('user'),
  }),
  event_attributes: z.object({
    http_request: z.object({
      client_ip: z.string(),
      user_agent: z.string(),
    }),
  }),
  object: z.literal('event'),
  timestamp: z.number(),
  type: z.literal('user.deleted'),
});
