import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const experienceTypes = ['VR', 'VIDEO', 'DOCUMENT', 'SLIDES', 'INDUCTION'] as const;
export const experienceStatuses = ['AVAILABLE', 'INACTIVE'] as const;

export const createExperienceSchema = z.object({
  courseId: z.number().int().positive(),
  name: z.string().min(1).max(50),
  description: z.string().min(1),
  type: z.enum(experienceTypes),
  image: z.string().max(255).optional(),
  duration: z.number().int().positive(),
  score: z.number().min(0).max(100),
  attempts: z.number().int().positive().default(1),
  order: z.number().int().nonnegative(),
  status: z.enum(experienceStatuses).default('AVAILABLE'),
});

export class CreateExperienceDto extends createZodDto(createExperienceSchema) {}