import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const experienceResponseSchema = z.object({
  id: z.number().int(),
  courseId: z.number().int(),
  name: z.string(),
  description: z.string(),
  type: z.enum(['VR', 'VIDEO', 'DOCUMENT', 'SLIDES', 'INDUCTION']),
  image: z.string().nullable(),
  duration: z.number().int(),
  score: z.number(),
  attempts: z.number().int(),
  order: z.number().int(),
  avgScore: z.number().nullable(),
  avgTimeSpent: z.number().int().nullable(),
  totalCompletions: z.number().int(),
  totalAttempts: z.number().int(),
  difficultyRating: z.number().nullable(),
  status: z.enum(['AVAILABLE', 'INACTIVE']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export class ExperienceResponseDto extends createZodDto(experienceResponseSchema) {}