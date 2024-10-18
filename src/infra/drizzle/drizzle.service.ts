import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as schema from './schemas';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig, EnvironmentVariables } from '../config/configuration';

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  public db: ReturnType<typeof drizzle<typeof schema>>;

  constructor(private config: ConfigService<EnvironmentVariables>) {}

  onModuleInit() {
    try {
      this.pool = new Pool({
        connectionString: this.config.get<DatabaseConfig>('database', {
          infer: true,
        }).url,
      });

      this.db = drizzle(this.pool, { schema });
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  onModuleDestroy() {
    this.pool.end();
  }

  // Proxy methods to allow direct usage of db commands
  public get query() {
    return this.db.query as typeof this.db.query;
  }

  public get select() {
    return this.db.select.bind(this.db) as typeof this.db.select;
  }

  public get insert() {
    return this.db.insert.bind(this.db) as typeof this.db.insert;
  }

  public get update() {
    return this.db.update.bind(this.db) as typeof this.db.update;
  }

  public get delete() {
    return this.db.delete.bind(this.db) as typeof this.db.delete;
  }

  public get transaction() {
    return this.db.transaction.bind(this.db) as typeof this.db.transaction;
  }

  // Getter to expose the db instance
  public get database() {
    return this.db;
  }
}
