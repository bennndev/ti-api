import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const scoreEventResponseSchema = z.object({
  id: z.number().int(),
  groupId: z.number().int(),
  experienceId: z.number().int(),
  sessionId: z.string(),
  eventId: z.string(),
  label: z.string().nullable(),
  scoreDelta: z.number(),
  metadata: z.unknown().nullable(),
  occurredAt: z.string().datetime(),
});

export class ScoreEventResponseDto extends createZodDto(scoreEventResponseSchema) {}