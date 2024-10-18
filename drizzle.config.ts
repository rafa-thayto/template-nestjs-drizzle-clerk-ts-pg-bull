import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/infra/drizzle/schemas.ts',
  out: './src/infra/drizzle/migrations',
  dbCredentials: {
    url: process.env.DB_URL!,
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
});
