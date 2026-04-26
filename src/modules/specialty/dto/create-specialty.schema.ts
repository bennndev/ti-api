import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createSpecialtySchema = z.object({
  departmentId: z.number().int().positive(),
  name: z.string().min(1).max(25),
  code: z.string().min(1).max(10),
  description: z.string().min(1),
  image: z.string().max(255).optional(),
  status: z.boolean().default(true),
});

export class CreateSpecialtyDto extends createZodDto(createSpecialtySchema) {}