import { Module } from '@nestjs/common';
import { DrizzleModule } from '@/infra/drizzle/drizzle.module';
import { ClerkWebhooksController } from './clerk/clerk-webhooks.controller';
import { ClerkWebhooksService } from './clerk/clerk-webhooks.service';
import { ClerkUserEventsService } from './clerk/clerk-user-events.service';
import { ClerkOrganizationEventsService } from './clerk/clerk-organization-events.service';
import { ClerkOrganizationMembershipEventsService } from './clerk/clerk-organization-membership-events.service';

@Module({
  imports: [],
  controllers: [ClerkWebhooksController],
  providers: [
    ClerkWebhooksService,
    ClerkUserEventsService,
    ClerkOrganizationEventsService,
    ClerkOrganizationMembershipEventsService,
  ],
})
export class WebhooksModule {}
