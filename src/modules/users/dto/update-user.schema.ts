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
  phone: z.string().regex(/^\d{7,15}$/).optional(),
  position: z.string().min(1).max(100).optional(),
  specialtyId: z.number().int().positive().optional(),
});

export class UpdateUserDto extends createZodDto(updateUserSchema) {}