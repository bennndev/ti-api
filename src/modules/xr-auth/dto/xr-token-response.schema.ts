import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const xrTokenResponseSchema = z.object({
  token: z.string(),
  expiresAt: z.string().datetime(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().nullable(),
    orgId: z.number().nullable(),
    roleId: z.number().nullable(),
  }),
});

export class XrTokenResponseDto extends createZodDto(xrTokenResponseSchema) {}