import {
  Injectable,
  NotImplementedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ClerkUserEventsService } from './clerk-user-events.service';
import { ClerkEventTypes } from '@/domain/enums/clerk';
import { ClerkOrganizationEventsService } from './clerk-organization-events.service';
import { ClerkOrganizationMembershipEventsService } from './clerk-organization-membership-events.service';

@Injectable()
export class ClerkWebhooksService {
  constructor(
    private readonly clerkUserEventsService: ClerkUserEventsService,
    private readonly clerkOrganizationEventsService: ClerkOrganizationEventsService,
    private readonly clerkOrganizationMembershipEventsService: ClerkOrganizationMembershipEventsService,
  ) {}

  async users(dto: { type: string }) {
    switch (dto.type) {
      case ClerkEventTypes.USER_CREATED:
        return this.clerkUserEventsService.userCreated(dto);
      case ClerkEventTypes.USER_UPDATED:
        return this.clerkUserEventsService.userUpdated(dto);
      case ClerkEventTypes.USER_DELETED:
        return this.clerkUserEventsService.userDeleted(dto);
      default:
        throw new UnprocessableEntityException(
          `Event: ${dto.type} not accepted`,
        );
    }
  }

  async organizations(dto: { type: string }) {
    switch (dto.type) {
      case ClerkEventTypes.ORGANIZATION_CREATED:
        return this.clerkOrganizationEventsService.organizationCreated(dto);
      case ClerkEventTypes.ORGANIZATION_UPDATED:
        return this.clerkOrganizationEventsService.organizationUpdated(dto);
      case ClerkEventTypes.ORGANIZATION_DELETED:
        return this.clerkOrganizationEventsService.organizationDeleted(dto);
      default:
        throw new UnprocessableEntityException(
          `Event: ${dto.type} not accepted`,
        );
    }
  }

  async organizationMemberships(dto: { type: string }) {
    switch (dto.type) {
      case ClerkEventTypes.ORGANIZATION_MEMBERSHIP_CREATED:
        return this.clerkOrganizationMembershipEventsService.organizationMembershipCreated(
          dto,
        );
      case ClerkEventTypes.ORGANIZATION_MEMBERSHIP_UPDATED:
        return this.clerkOrganizationMembershipEventsService.organizationMembershipUpdated(
          dto,
        );
      case ClerkEventTypes.ORGANIZATION_MEMBERSHIP_DELETED:
        return this.clerkOrganizationMembershipEventsService.organizationMembershipDeleted(
          dto,
        );
      default:
        throw new UnprocessableEntityException(
          `Event: ${dto.type} not accepted`,
        );
    }
  }
}
