import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import userTable from './user.schema';
import organizationTable from './organization.schema';

const userOrganizationTable = pgTable(
  'user_organization',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id),
    externalUserId: text('external_user_id'),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizationTable.id),
    externalOrganizationId: text('external_organization_id'),
    createdAt: timestamp('created_at', { mode: 'string' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    orgExternalUserIdIndex: index('user_org_external_user_id_idx').on(
      table.externalUserId,
    ),
    orgExternalOrganizationIdIndex: index(
      'user_org_external_organization_id_idx',
    ).on(table.externalOrganizationId),
    uniqueUserOrganization: uniqueIndex('unique_user_organization').on(
      table.userId,
      table.organizationId,
    ),
  }),
);

export const userOrganizationRelations = relations(
  userOrganizationTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [userOrganizationTable.userId],
      references: [userTable.id],
    }),
    organization: one(organizationTable, {
      fields: [userOrganizationTable.organizationId],
      references: [organizationTable.id],
    }),
  }),
);

export const insertUserOrganizationSchema = createInsertSchema(
  userOrganizationTable,
);
export type InsertUserOrganizationDTO = z.infer<
  typeof insertUserOrganizationSchema
>;

export const selectUserOrganizationSchema = createSelectSchema(
  userOrganizationTable,
);
export type SelectUserOrganizationDTO = z.infer<
  typeof selectUserOrganizationSchema
>;

export default userOrganizationTable;
