import { clerkUserCreatedEventSchema } from '@/domain/events/clerk/user/user-created.event';
import { clerkUserDeletedEventSchema } from '@/domain/events/clerk/user/user-deleted.event';
import { clerkUserUpdatedEventSchema } from '@/domain/events/clerk/user/user-updated.event';
import { DrizzleService } from '@/infra/drizzle/drizzle.service';
import userTable, { InsertUserDTO } from '@/infra/drizzle/schemas/user.schema';
import dayjs from '@/lib/dayjs';
import {
  Injectable,
  Logger,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';

@Injectable()
export class ClerkUserEventsService {
  private readonly logger = new Logger(ClerkUserEventsService.name);
  constructor(private readonly drizzle: DrizzleService) {}

  async userCreated(event: unknown) {
    this.logger.log('[Clerk Webhooks] Creating user', event);
    const { data } = clerkUserCreatedEventSchema.parse(event);

    try {
      const newUser: InsertUserDTO = {
        id: createId(),
        name: data.first_name + ' ' + data.last_name,
        email: data.email_addresses[0]?.email_address || '',
        phone: data.phone_numbers[0]?.phone_number || null,
        phoneVerified: false,
        emailVerified: false,
        clerkId: data.id,
        createdAt: dayjs(data.created_at).toISOString(),
        updatedAt: dayjs(data.updated_at).toISOString(),
      };
      const user = await this.drizzle
        .insert(userTable)
        .values(newUser)
        .returning();

      this.logger.log('[Clerk Webhooks] User created successfully', user);
    } catch (error) {
      this.logger.error('[Clerk Webhooks] Error creating user', error);
      throw error;
    }
  }

  async userUpdated(event: unknown) {
    this.logger.log('[Clerk Webhooks] Updating user', event);
    const dto = clerkUserUpdatedEventSchema.parse(event);
    throw new NotImplementedException();
  }

  async userDeleted(event: unknown) {
    this.logger.log('[Clerk Webhooks] Deleting user', event);
    try {
      const dto = clerkUserDeletedEventSchema.parse(event);

      const foundUser = await this.drizzle.query.userTable.findFirst({
        where: eq(userTable.clerkId, dto.data.id),
      });

      if (!foundUser) {
        throw new NotFoundException('User not found');
      }

      await this.drizzle
        .delete(userTable)
        .where(eq(userTable.id, foundUser.id));
      this.logger.log('[Clerk Webhooks] User deleted successfully', foundUser);
    } catch (error) {
      this.logger.error('[Clerk Webhooks] Error deleting user', error);
      throw error;
    }
  }
}
