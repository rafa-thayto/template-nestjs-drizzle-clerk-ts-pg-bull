import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '@/infra/drizzle/drizzle.service';
import { userTable } from '@/infra/drizzle/schemas';

@Injectable()
export class ListUsersUseCase {
  constructor(private readonly db: DrizzleService) {}

  async exec() {
    const users = await this.db.database.select().from(userTable);

    const usersExist = users.length > 0;
    if (!usersExist) {
      throw new NotFoundException('Users not found');
    }

    return users;
  }
}
