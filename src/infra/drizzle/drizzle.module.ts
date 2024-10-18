import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schemas';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PG_CONNECTION } from '@/core/constants';
import { DrizzleService } from './drizzle.service';

@Global()
@Module({})
export class DrizzleModule {
  static forRoot(options: DrizzleModuleOptions): DynamicModule {
    const connectionProvider: Provider = {
      provide: PG_CONNECTION,
      useFactory: async (...args: any[]) => {
        const connectionString = await options.useFactory(...args);
        const pool = new Pool({
          connectionString,
          ssl: { rejectUnauthorized: false },
        });
        return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
      },
      inject: options.inject || [],
    };

    return {
      module: DrizzleModule,
      providers: [connectionProvider, DrizzleService],
      exports: [PG_CONNECTION, DrizzleService],
      global: true,
    };
  }
}
