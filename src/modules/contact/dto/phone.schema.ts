import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createPhoneSchema = z.object({
  phone: z.string().regex(/^\d{7,15}$/, 'Phone must be 7-15 digits'),
  type: z.enum(['MOBILE', 'LANDLINE', 'WORK']).optional().default('MOBILE'),
  isPrimary: z.boolean().optional().default(false),
});

export class CreatePhoneDto extends createZodDto(createPhoneSchema) {}

export const updatePhoneSchema = z.object({
  phone: z.string().regex(/^\d{7,15}$/).optional(),
  type: z.enum(['MOBILE', 'LANDLINE', 'WORK']).optional(),
  isPrimary: z.boolean().optional(),
});

export class UpdatePhoneDto extends createZodDto(updatePhoneSchema) {}
