import {
  boolean,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import addressTable from './address.schema';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import userOrganizationTable from './user-organization.schema';

const userTable = pgTable(
  'user',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    name: varchar('name', { length: 255 }).notNull(),
    phone: varchar('contact_phone', { length: 255 }).unique(),
    phoneVerified: boolean('phone_verified').notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    clerkId: text('clerk_id').notNull(),

    createdAt: timestamp('created_at', { mode: 'string' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userClerkIdIndex: uniqueIndex('user_clerk_id_idx').on(table.clerkId),
  }),
);

export const userRelations = relations(userTable, ({ many }) => ({
  userOrganizations: many(userOrganizationTable),
}));

// export const userRelations = relations(userTable, ({ many }) => ({
//   addresses: many(addressTable),
// }));

export const insertUserSchema = createInsertSchema(userTable);
export type InsertUserDTO = z.infer<typeof selectUserSchema>;

export const selectUserSchema = createSelectSchema(userTable);
export type SelectUserDTO = z.infer<typeof selectUserSchema>;

export default userTable;
