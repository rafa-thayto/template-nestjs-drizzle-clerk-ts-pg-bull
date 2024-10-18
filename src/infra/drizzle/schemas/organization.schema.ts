import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import {
  json,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import userOrganizationTable from './user-organization.schema';

const organizationTable = pgTable(
  'organization',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    name: varchar('name', { length: 100 }).notNull(),
    documentNumber: varchar('document_number', { length: 30 }),
    country: varchar('country', { length: 2 }),
    imageUrl: text('image_url'),
    logoUrl: text('logo_url'),
    slug: varchar('slug', { length: 100 }).notNull(),
    clerkId: text('clerk_id').notNull(),

    metadata: json('metadata'),

    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
  },
  (table) => ({
    orgClerkIdIndex: uniqueIndex('org_clerk_id_idx').on(table.clerkId),
    orgDocCountryIdx: uniqueIndex('org_doc_country_idx').on(
      table.documentNumber,
      table.country,
    ),
  }),
);

export const organizationRelations = relations(
  organizationTable,
  ({ many }) => ({
    userOrganizations: many(userOrganizationTable),
  }),
);

export const insertOrganizationSchema = createInsertSchema(organizationTable);
export type InsertOrganizationDTO = z.infer<typeof insertOrganizationSchema>;

export const selectOrganizationSchema = createSelectSchema(organizationTable);
export type SelectOrganizationDTO = z.infer<typeof selectOrganizationSchema>;

export default organizationTable;
