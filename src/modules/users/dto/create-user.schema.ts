import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  lastName: z.string().max(50).optional(),
  username: z.string().min(3).max(30).optional(),
  orgId: z.number().int().positive(),
  roleId: z.number().int().positive(),
  documentType: z.string().max(4).optional(),
  documentNumber: z.string().max(20).optional(),
  preferredLanguage: z.string().max(10).optional(),
});

export class CreateUserDto extends createZodDto(createUserSchema) {}