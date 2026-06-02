import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createEmailSchema = z.object({
  email: z.string().email(),
  type: z.enum(['PERSONAL', 'WORK', 'BILLING']).optional().default('PERSONAL'),
  isPrimary: z.boolean().optional().default(false),
});

export class CreateEmailDto extends createZodDto(createEmailSchema) {}

export const updateEmailSchema = z.object({
  email: z.string().email().optional(),
  type: z.enum(['PERSONAL', 'WORK', 'BILLING']).optional(),
  isPrimary: z.boolean().optional(),
});

export class UpdateEmailDto extends createZodDto(updateEmailSchema) {}
