import { z } from 'zod';

export const clerkUserCreatedEventSchema = z.object({
  data: z.object({
    created_at: z.number(),
    email_addresses: z.array(
      z
        .object({
          email_address: z.string().email(),
          id: z.string(),
          linked_to: z.array(z.any()), // Adjust as per actual data structure
          object: z.literal('email_address'),
          verification: z.object({
            status: z.enum(['verified', 'unverified', 'pending']), // Adjust with possible statuses
            strategy: z.string(),
          }),
        })
        .optional(),
    ),
    external_accounts: z.array(z.any()), // Adjust as per actual data structure
    external_id: z.string().nullable().optional(),
    first_name: z.string(),
    id: z.string(),
    image_url: z.string().url(),
    last_name: z.string(),
    last_sign_in_at: z.number().nullable(),
    object: z.literal('user'),
    password_enabled: z.boolean(),
    phone_numbers: z.array(
      z
        .object({
          default_second_factor: z.boolean(),
          id: z.string(),
          linked_to: z.array(z.string()),
          object: z.any(),
          phone_number: z.string(),
          reserved_for_second_factor: z.boolean(),
          verification: z.object({
            attempts: z.number(),
            status: z.string(),
            type: z.string(),
          }),
        })
        .optional(),
    ), // Adjust as per actual data structure
    primary_email_address_id: z.string(),
    primary_phone_number_id: z.null(),
    primary_web3_wallet_id: z.null(),
    private_metadata: z.record(z.any()),
    profile_image_url: z.string().url(),
    public_metadata: z.record(z.any()),
    two_factor_enabled: z.boolean(),
    unsafe_metadata: z.record(z.any()),
    updated_at: z.number(),
    username: z.string().nullable(),
    web3_wallets: z.array(z.any()), // Adjust as per actual data structure
  }),
  event_attributes: z.object({
    http_request: z.object({
      client_ip: z.string(),
      user_agent: z.string(),
    }),
  }),
  object: z.literal('event'),
  timestamp: z.number(),
  type: z.literal('user.created'),
});
