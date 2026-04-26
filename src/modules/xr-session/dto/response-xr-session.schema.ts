import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const xrSessionResponseSchema = z.object({
  session_id: z.string(),
  started_at: z.string().datetime(),
  experience_id: z.number().int(),
  attempt_number: z.number().int(),
});

export class XRSessionResponseDto extends createZodDto(xrSessionResponseSchema) {}

export const xrSessionCompleteResponseSchema = z.object({
  session_id: z.string(),
  completed_at: z.string().datetime(),
  group_experience_updated: z.object({
    status: z.string(),
    final_score: z.number().nullable(),
    attempts: z.number().int(),
    time_spent: z.number().nullable(),
  }),
  experience_stats_updated: z.object({
    avg_score: z.number().nullable(),
    total_completions: z.number().int(),
    total_attempts: z.number().int(),
    difficulty_rating: z.number().nullable(),
  }),
});

export class XRSessionCompleteResponseDto extends createZodDto(xrSessionCompleteResponseSchema) {}