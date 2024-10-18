import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client } from 'pg';
import * as schema from './schemas';
import drizzleConfig from '$/drizzle.config';
import 'dotenv/config';

const initMigration = async () => {
  if (!process.env.DB_MIGRATING) {
    throw new Error(
      'You must set DB_MIGRATING to "true" when running migrations',
    );
  }

  const client = new Client({
    connectionString: process.env.DB_URL,
  });

  try {
    await client.connect();
    console.log('DB: Connected to database');
    const db = drizzle(client, {
      logger: true,
      schema,
    });
    console.log(schema);

    console.log('DB: Starting migrations');
    await migrate(db, {
      migrationsFolder: drizzleConfig.out!,
    })
      .then(() => {
        console.log('DB: Migrated database');
      })
      .catch((error) => {
        console.error(error, 'DB: Failed to migrate database');
        throw error;
      });
    console.log('DB: Finished migrations');
  } catch (error) {
    console.error(error, `DB: Failed to connect to database`);
    throw new Error(`Failed to migrate database ${String(error)}`);
  } finally {
    await client.end();
    console.log('DB: Disconnected from database');
  }
};

initMigration();
