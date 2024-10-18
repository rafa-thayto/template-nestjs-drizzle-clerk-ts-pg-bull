import { createId } from '@paralleldrive/cuid2';
import { pgTable, text, varchar, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import wildcardTable from './wildcard.schema';

const emailTemplateTable = pgTable('email_template', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  title: varchar('title').notNull(),
  html: text('html').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const emailTemplateRelations = relations(
  emailTemplateTable,
  ({ many }) => ({
    wildcards: many(wildcardTable),
  }),
);

export const insertEmailTemplateSchema = createInsertSchema(emailTemplateTable);
export type InsertEmailTemplateDTO = z.infer<typeof insertEmailTemplateSchema>;

export const selectEmailTemplateSchema = createSelectSchema(emailTemplateTable);
export type SelectEmailTemplateDTO = z.infer<typeof selectEmailTemplateSchema>;

export default emailTemplateTable;
