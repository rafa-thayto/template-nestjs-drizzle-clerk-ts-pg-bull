import { clerkOrganizationCreatedEventSchema } from '@/domain/events/clerk/organization/organization-created.event';
import { clerkOrganizationDeletedEventSchema } from '@/domain/events/clerk/organization/organization-deleted.event';
import { clerkOrganizationUpdatedEventSchema } from '@/domain/events/clerk/organization/organization-updated.event';
import { DrizzleService } from '@/infra/drizzle/drizzle.service';
import organizationTable, {
  InsertOrganizationDTO,
} from '@/infra/drizzle/schemas/organization.schema';
import dayjs from '@/lib/dayjs';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class ClerkOrganizationEventsService {
  private readonly logger = new Logger(ClerkOrganizationEventsService.name);
  constructor(private readonly drizzle: DrizzleService) {}

  async organizationCreated(event: unknown) {
    this.logger.log('[Clerk Webhooks] Creating organization', event);
    const { data } = clerkOrganizationCreatedEventSchema.parse(event);

    try {
      const newOrganization: InsertOrganizationDTO = {
        name: data.name,
        slug: data.slug,
        clerkId: data.id,
        metadata: data.public_metadata,
        imageUrl: data.image_url,
        createdAt: dayjs(data.created_at).toISOString(),
        updatedAt: dayjs(data.updated_at).toISOString(),
      };
      const organization = await this.drizzle
        .insert(organizationTable)
        .values(newOrganization)
        .returning();

      this.logger.log(
        '[Clerk Webhooks] Organization created successfully',
        organization,
      );
    } catch (error) {
      this.logger.error('[Clerk Webhooks] Error creating organization', error);
      throw error;
    }
  }

  async organizationUpdated(event: unknown) {
    try {
      this.logger.log('[Clerk Webhooks] Updating organization', event);
      const { data } = clerkOrganizationUpdatedEventSchema.parse(event);

      const newOrganization: InsertOrganizationDTO = {
        name: data.name,
        slug: data.slug,
        clerkId: data.id,
        metadata: data.public_metadata,
        imageUrl: data.image_url,
        createdAt: dayjs(data.created_at).toISOString(),
        updatedAt: dayjs(data.updated_at).toISOString(),
      };

      const organization = await this.drizzle
        .update(organizationTable)
        .set(newOrganization)
        .where(eq(organizationTable.clerkId, data.id))
        .returning();

      this.logger.log(
        '[Clerk Webhooks] Organization updated successfully',
        organization,
      );
    } catch (error) {
      this.logger.error('[Clerk Webhooks] Error deleting organization', error);
      throw error;
    }
  }

  async organizationDeleted(event: unknown) {
    this.logger.log('[Clerk Webhooks] Deleting organization', event);
    try {
      const dto = clerkOrganizationDeletedEventSchema.parse(event);

      const foundOrganization =
        await this.drizzle.query.organizationTable.findFirst({
          where: eq(organizationTable.clerkId, dto.data.id),
        });

      if (!foundOrganization) {
        throw new NotFoundException('Organization not found');
      }

      await this.drizzle
        .delete(organizationTable)
        .where(eq(organizationTable.id, foundOrganization.id));
      this.logger.log(
        '[Clerk Webhooks] Organization deleted successfully',
        foundOrganization,
      );
    } catch (error) {
      this.logger.error('[Clerk Webhooks] Error deleting organization', error);
      throw error;
    }
  }
}
