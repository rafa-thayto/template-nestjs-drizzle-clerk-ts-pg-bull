import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq, or, sql } from 'drizzle-orm';
import { FindUserInput } from './find-user.dto';
import { userTable } from '@/infra/drizzle/schemas';
import { DrizzleService } from '@/infra/drizzle/drizzle.service';

@Injectable()
export class FindUserUseCase {
  constructor(private readonly db: DrizzleService) {}

  async exec({ email, id, clerkId }: FindUserInput) {
    const inputProvided = email || id || clerkId;

    if (!inputProvided) {
      throw new BadRequestException(
        'At least one of email, id, or clerkId must be provided',
      );
    }

    const foundUser = (
      await this.db.database
        .select()
        .from(userTable)
        .where(
          or(
            eq(userTable.email, email || ''),
            eq(userTable.id, id || ''),
            eq(userTable.clerkId, clerkId || ''),
          ),
        )
        .limit(1)
    )[0];

    const userNotFound = !foundUser;
    if (userNotFound) {
      throw new NotFoundException('User not found');
    }
    return foundUser;
  }
}
