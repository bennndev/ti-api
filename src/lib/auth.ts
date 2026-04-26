import 'dotenv/config';
import { betterAuth } from 'better-auth/minimal';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
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
      orgId: { type: 'number', required: false },
      roleId: { type: 'number', required: false },
      username: { type: 'string', required: false },
      documentType: { type: 'string', required: false },
      documentNumber: { type: 'string', required: false },
      firstName: { type: 'string', required: false },
      lastName: { type: 'string', required: false },
      preferredLanguage: { type: 'string', required: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const data = { ...user };
          if (!data.username) {
            data.username = data.email?.split('@')[0] ?? 'user';
          }
          return { data };
        },
      },
    },
  },
});
