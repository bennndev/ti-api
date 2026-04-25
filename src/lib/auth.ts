import { betterAuth } from 'better-auth/minimal';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DIRECT_URL! }),
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID!,
      teamId: process.env.APPLE_TEAM_ID!,
      keyId: process.env.APPLE_KEY_ID!,
      privateKey: process.env.APPLE_PRIVATE_KEY!,
    },
  },
  user: {
    additionalFields: {
      orgId: { type: 'number' },
      roleId: { type: 'number' },
      username: { type: 'string' },
      documentType: { type: 'string' },
      documentNumber: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      preferredLanguage: { type: 'string' },
    },
  },
});
