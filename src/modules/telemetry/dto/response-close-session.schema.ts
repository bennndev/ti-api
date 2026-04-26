import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const closeSessionResponseSchema = z.object({
  success: z.boolean(),
  groupId: z.number().int(),
  experienceId: z.number().int(),
  sessionId: z.string(),
  endReason: z.enum(['completed', 'abandoned', 'crashed', 'timeout', 'user_exit']),
  finalScore: z.number().nullable(),
  totalTimeSeconds: z.number().nullable(),
  scoreEventsCreated: z.number().int(),
});

export class CloseSessionResponseDto extends createZodDto(closeSessionResponseSchema) {}