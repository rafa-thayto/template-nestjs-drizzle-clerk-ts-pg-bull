import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '@/infra/drizzle/drizzle.service';
import { userTable } from '@/infra/drizzle/schemas';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly db: DrizzleService) {}

  async exec(userId: string) {
    const result = await this.db.db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId));

    const foundUser = result.length > 0 ? result[0] : null;

    const userNotFound = !foundUser;
    if (userNotFound) {
      throw new NotFoundException('User not found');
    }

    const deletedUser = await this.db
      .delete(userTable)
      .where(eq(userTable.id, userId));

    return deletedUser;
  }
}
