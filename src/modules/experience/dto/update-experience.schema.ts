import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateExperienceSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().optional(),
  image: z.string().max(255).optional(),
  duration: z.number().int().positive().optional(),
  score: z.number().optional(),
  attempts: z.number().int().positive().optional(),
  order: z.number().int().nonnegative().optional(),
});

export class UpdateExperienceDto extends createZodDto(updateExperienceSchema) {}