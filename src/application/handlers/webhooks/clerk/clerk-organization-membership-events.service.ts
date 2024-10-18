import { clerkOrganizationMembershipCreatedEventSchema } from '@/domain/events/clerk/organization-membership/organization-membership-created.event';
import { clerkOrganizationMembershipDeletedEventSchema } from '@/domain/events/clerk/organization-membership/organization-membership-deleted.event';
import { clerkOrganizationMembershipUpdatedEventSchema } from '@/domain/events/clerk/organization-membership/organization-membership-updated.event';
import { DrizzleService } from '@/infra/drizzle/drizzle.service';
import userOrganizationTable, {
  InsertUserOrganizationDTO,
} from '@/infra/drizzle/schemas/user-organization.schema';
import {
  Injectable,
  Logger,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class ClerkOrganizationMembershipEventsService {
  private readonly logger = new Logger(
    ClerkOrganizationMembershipEventsService.name,
  );
  constructor(private readonly drizzle: DrizzleService) {}

  async organizationMembershipCreated(event: unknown) {
    this.logger.log('[Clerk Webhooks] Creating organizationMembership', event);
    const { data } = clerkOrganizationMembershipCreatedEventSchema.parse(event);

    try {
      const user = await this.drizzle.query.userTable.findFirst({
        where: (userTable) =>
          eq(userTable.clerkId, data.public_user_data.user_id),
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const organization = await this.drizzle.query.organizationTable.findFirst(
        {
          where: (organizationTable) =>
            eq(organizationTable.clerkId, data.organization.id),
        },
      );
      if (!organization) {
        throw new NotFoundException('Organization not found');
      }

      const payload: InsertUserOrganizationDTO = {
        userId: user.id,
        organizationId: organization.id,
        externalUserId: data.public_user_data.user_id,
        externalOrganizationId: data.organization.id,
      };
      const organizationMembership = await this.drizzle
        .insert(userOrganizationTable)
        .values(payload)
        .returning();

      this.logger.log(
        '[Clerk Webhooks] OrganizationMembership created successfully',
        organizationMembership,
      );
    } catch (error) {
      this.logger.error(
        '[Clerk Webhooks] Error creating organizationMembership',
        error,
      );
      throw error;
    }
  }

  async organizationMembershipUpdated(event: unknown) {
    this.logger.log('[Clerk Webhooks] Updating organizationMembership', event);
    const dto = clerkOrganizationMembershipUpdatedEventSchema.parse(event);
    throw new NotImplementedException();
  }

  async organizationMembershipDeleted(event: unknown) {
    this.logger.log('[Clerk Webhooks] Deleting organizationMembership', event);
    try {
      const dto = clerkOrganizationMembershipDeletedEventSchema.parse(event);

      const foundOrganizationMembership =
        await this.drizzle.query.userOrganizationTable.findFirst({
          where: and(
            eq(
              userOrganizationTable.externalUserId,
              dto.data.public_user_data.user_id,
            ),
            eq(
              userOrganizationTable.externalOrganizationId,
              dto.data.organization.id,
            ),
          ),
        });

      if (!foundOrganizationMembership) {
        throw new NotFoundException('OrganizationMembership not found');
      }

      await this.drizzle
        .delete(userOrganizationTable)
        .where(eq(userOrganizationTable.id, foundOrganizationMembership.id));
      this.logger.log(
        '[Clerk Webhooks] OrganizationMembership deleted successfully',
        foundOrganizationMembership,
      );
    } catch (error) {
      this.logger.error(
        '[Clerk Webhooks] Error deleting organizationMembership',
        error,
      );
      throw error;
    }
  }
}
