import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const userResponseSchema = z.object({
  id: z.number().int(),
  email: z.string().email(),
  username: z.string().nullable(),
  name: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  roleId: z.number().int().nullable(),
  orgId: z.number().int().nullable(),
  emailVerified: z.boolean(),
  createdAt: z.date(),
});

export class UserResponseDto extends createZodDto(userResponseSchema) {}
