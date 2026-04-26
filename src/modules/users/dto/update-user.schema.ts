import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  lastName: z.string().max(50).optional(),
  username: z.string().min(3).max(30).optional(),
  documentType: z.string().max(4).optional(),
  documentNumber: z.string().max(20).optional(),
  preferredLanguage: z.string().max(10).optional(),
  status: z.boolean().optional(),
});

export class UpdateUserDto extends createZodDto(updateUserSchema) {}