/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { SentryModule } from '@sentry/nestjs/setup';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UseCasesModule } from './application/modules/usecases.module';
import { ResendModule } from './infra/resend/resend.module';
import { EmailModule } from './infra/email/email.module';
import { DrizzleModule } from './infra/drizzle/drizzle.module';
import { ConfigModule } from './infra/config/config.module';
import { HandlersModule } from './application/handlers/handlers.module';
import { EnvironmentVariables } from './infra/config/configuration';
import { InvoiceModule } from './application/modules/invoice/invoice.module';
import { FileModule } from './application/modules/file/file.module';
import { EmailTemplateModule } from './application/modules/email-template/email-template.module';
import { R2Module } from './infra/r2/r2.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    UseCasesModule,
    ResendModule,
    EmailModule,
    R2Module,
    DrizzleModule.forRoot({
      useFactory: (configService: ConfigService<EnvironmentVariables>) =>
        configService.get('database', { infer: true })?.url!,
      inject: [ConfigService],
    }),
    ConfigModule,
    HandlersModule,
    InvoiceModule,
    FileModule,
    EmailTemplateModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => ({
        connection: new Redis(
          configService.get('redis', { infer: true })?.url!,
          {
            maxRetriesPerRequest: null,
          },
        ),
      }),
      inject: [ConfigService],
    }),

    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
