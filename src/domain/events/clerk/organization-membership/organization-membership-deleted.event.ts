import { z } from 'zod';

export const clerkOrganizationMembershipDeletedEventSchema = z.object({
  data: z.object({
    created_at: z.number(),
    id: z.string(),
    object: z.literal('organization_membership'),
    organization: z.object({
      created_at: z.number(),
      created_by: z.string().optional(),
      id: z.string(),
      image_url: z.string().url(),
      name: z.string(),
      object: z.literal('organization'),
      public_metadata: z.record(z.any()),
      slug: z.string(),
      updated_at: z.number(),
    }),
    public_user_data: z.object({
      first_name: z.string(),
      identifier: z.string(),
      image_url: z.string().url(),
      last_name: z.string(),
      user_id: z.string(),
    }),
    role: z.string(),
    updated_at: z.number(),
  }),
  event_attributes: z.object({
    http_request: z.object({
      client_ip: z.string(),
      user_agent: z.string(),
    }),
  }),
  object: z.literal('event'),
  timestamp: z.number(),
  type: z.literal('organizationMembership.deleted'),
});
