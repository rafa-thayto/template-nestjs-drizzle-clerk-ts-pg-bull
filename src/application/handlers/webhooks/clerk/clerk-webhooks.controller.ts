import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ClerkWebhooksService } from './clerk-webhooks.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class ClerkWebhooksController {
  private readonly logger = new Logger(ClerkWebhooksController.name);
  constructor(private readonly clerkWebhooksService: ClerkWebhooksService) {}

  @Post('/webhooks/clerk/users')
  async clerkUserHandler(@Body() dto: any) {
    this.logger.log('[Clerk Webhooks] User', dto);
    await this.clerkWebhooksService.users(dto);
  }

  @Post('/webhooks/clerk/organizations')
  async clerkOrganizationHandler(@Body() dto: any) {
    this.logger.log('[Clerk Webhooks] Organization', dto);
    await this.clerkWebhooksService.organizations(dto);
  }

  @Post('/webhooks/clerk/organization-memberships')
  async clerkOrganizationMembershipHandler(@Body() dto: any) {
    this.logger.log('[Clerk Webhooks] OrganizationMembership', dto);
    await this.clerkWebhooksService.organizationMemberships(dto);
  }
}
