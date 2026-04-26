import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const courseResponseSchema = z.object({
  id: z.number().int(),
  specialtyId: z.number().int(),
  name: z.string(),
  description: z.string(),
  image: z.string().nullable(),
  status: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export class CourseResponseDto extends createZodDto(courseResponseSchema) {}