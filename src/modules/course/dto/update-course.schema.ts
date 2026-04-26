import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateCourseSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().optional(),
  image: z.string().max(255).optional(),
  status: z.boolean().optional(),
});

export class UpdateCourseDto extends createZodDto(updateCourseSchema) {}