export interface RedisConfig {
  url: string;
}

export interface DatabaseConfig {
  url: string;
}

export interface ResendConfig {
  apiKey: string;
}

export interface ClerkConfig {
  clerkPubishableKey: string;
  clerkSecretKey: string;
}

export interface CloudflareConfig {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface EnvironmentVariables {
  appUrl: string;
  port: number;
  jwtSecretKey: string;
  database: DatabaseConfig;
  redis: RedisConfig;
  resend: ResendConfig;
  clerk: ClerkConfig;
  cloudflare: CloudflareConfig;
}

export default (): EnvironmentVariables => ({
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    url: process.env.DB_URL || '',
  },
  redis: {
    url: process.env.REDIS_URL || '',
  },
  jwtSecretKey: process.env.JWT_SECRET_KEY || '',
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
  },
  clerk: {
    clerkPubishableKey: process.env.CLERK_PUBLISHABLE_KEY || '',
    clerkSecretKey: process.env.CLERK_SECRET_KEY || '',
  },
  cloudflare: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || '',
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
  },
});
