import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createCourseSchema = z.object({
  specialtyId: z.number().int().positive(),
  name: z.string().min(1).max(50),
  description: z.string().min(1),
  image: z.string().max(255).optional(),
  status: z.boolean().default(true),
});

export class CreateCourseDto extends createZodDto(createCourseSchema) {}