import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '@/infra/drizzle/drizzle.service';
import { CreateOrganizationDto } from './create-organization.dto';
import { organizationTable } from '@/infra/drizzle/schemas';

@Injectable()
export class CreateOrganizationUseCase {
  constructor(private readonly db: DrizzleService) {}

  async exec(dto: CreateOrganizationDto) {
    const organization = await this.db
      .insert(organizationTable)
      .values(dto as any)
      .returning();

    const orgExists = organization.length > 0;
    if (!orgExists) {
      throw new NotFoundException('Creditors not found');
    }

    return organization;
  }
}
