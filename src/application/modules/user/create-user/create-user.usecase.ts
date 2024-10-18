import { DrizzleService } from '@/infra/drizzle/drizzle.service';
import { userTable } from '@/infra/drizzle/schemas';
import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly drizzle: DrizzleService) {}

  async exec(data: CreateUserDTO) {
    const newUser = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      phoneVerified: false,
      emailVerified: false,
      clerkId: data.id ?? '',
    };

    await this.drizzle.insert(userTable).values(newUser);

    return newUser;
  }
}
