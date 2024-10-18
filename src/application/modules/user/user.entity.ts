export class UserEntity {
  id: string;
  name: string;
  phone: string;
  phoneVerified: boolean;
  email: string;
  emailVerified: boolean;
  clerkId: string;

  constructor(user: {
    id: string;
    name: string;
    phone: string;
    phoneVerified: boolean;
    email: string;
    emailVerified: boolean;
    clerkId: string;
  }) {
    this.id = user.id;
    this.name = user.name;
    this.phone = user.phone;
    this.phoneVerified = user.phoneVerified;
    this.email = user.email;
    this.emailVerified = user.emailVerified;
    this.clerkId = user.clerkId;
  }
}
