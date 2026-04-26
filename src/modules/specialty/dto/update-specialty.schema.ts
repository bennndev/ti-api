import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateSpecialtySchema = z.object({
  name: z.string().min(1).max(25).optional(),
  code: z.string().min(1).max(10).optional(),
  description: z.string().optional(),
  image: z.string().max(255).optional(),
  status: z.boolean().optional(),
});

export class UpdateSpecialtyDto extends createZodDto(updateSpecialtySchema) {}