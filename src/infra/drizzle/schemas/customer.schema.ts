import { index, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import organizationTable from './organization.schema';

const customerTable = pgTable(
  'customer',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    customerName: varchar('customer_name', { length: 100 }).notNull(),
    documentNumber: varchar('document_number', { length: 15 }).notNull(),
    documentType: text('document_type', { enum: ['cpf', 'cnpj'] }).notNull(), // cpf or cnpj

    organizationId: text('organization_id').references(
      () => organizationTable.id,
    ),

    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
  },
  (t) => ({
    documentNumberIndex: index().on(t.documentNumber),
    customerNameIndex: index().on(t.customerName),
  }),
);

export const insertCustomerSchema = createInsertSchema(customerTable);
export type InsertCustomerDTO = z.infer<typeof insertCustomerSchema>;

export const selectCustomerSchema = createSelectSchema(customerTable);
export type SelectCustomerDTO = z.infer<typeof selectCustomerSchema>;

export default customerTable;
