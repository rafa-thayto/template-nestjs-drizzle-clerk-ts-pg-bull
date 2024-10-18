import {
  ClerkConfig,
  EnvironmentVariables,
} from '@/infra/config/configuration';
import { DrizzleService } from '@/infra/drizzle/drizzle.service';
import { createClerkClient } from '@clerk/clerk-sdk-node';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthUser } from '../decorators/auth-user.decorator';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger(ClerkAuthGuard.name);
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly drizzle: DrizzleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const clerkClient = createClerkClient({
      secretKey: this.configService.get<ClerkConfig>('clerk')?.clerkSecretKey,
      publishableKey:
        this.configService.get<ClerkConfig>('clerk')?.clerkPubishableKey,
    });

    try {
      // TODO: add types
      // Request & {
      //   cookies: Record<string, string>;
      //   user: Record<string, any>;
      // }
      const request = context.switchToHttp().getRequest();
      const sessToken = request.cookies.__session;
      const authorizationHeader = request.headers['authorization']?.replace(
        'Bearer ',
        '',
      );
      const token = sessToken || authorizationHeader;

      if (!token) {
        throw new UnauthorizedException('Token not found. User must sign in.');
      }

      const verifiedToken = await clerkClient.verifyToken(token);
      console.log('verifiedToken', verifiedToken);

      // TODO: adjust user id in user creation to use our own id instead of clerk's id
      const user = await this.drizzle.query.userOrganizationTable.findFirst({
        where: (userOrganizationTable, { eq, and }) =>
          and(
            eq(
              userOrganizationTable.externalUserId,
              verifiedToken.id as string,
            ),
            eq(
              userOrganizationTable.externalOrganizationId,
              verifiedToken.orgId as string,
            ),
          ),
      });

      if (!user) {
        throw new UnauthorizedException('Invalid authentication token');
      }

      request.user = {
        id: user.id,
        orgId: user.organizationId,
      } as AuthUser;

      return true;
    } catch (error) {
      this.logger.error('ClerkAuthGuard error', error);
      throw new UnauthorizedException('Invalid authentication token');
    }
  }
}
