import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { patterns, messages } from '@/modules/common/validators';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().regex(patterns.PASSWORD, messages.PASSWORD),
  name: z.string().regex(patterns.NAME, messages.NAME),
  lastName: z.string().regex(patterns.NAME, messages.NAME).optional(),
  username: z.string().regex(patterns.USERNAME, messages.USERNAME).optional(),
  orgId: z.number().int().positive(),
  roleId: z.number().int().positive(),
  documentType: z.string().max(4).optional(),
  documentNumber: z.string().max(20).optional(),
  preferredLanguage: z.string().max(10).optional(),
});

export class CreateUserDto extends createZodDto(createUserSchema) {}