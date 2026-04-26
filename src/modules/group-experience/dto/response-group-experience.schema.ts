import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const groupExperienceResponseSchema = z.object({
  groupId: z.number().int(),
  experienceId: z.number().int(),
  finalScore: z.number().nullable(),
  attempts: z.number().int(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED']),
  mandatory: z.boolean(),
  startedAt: z.string().datetime().nullable(),
  completedAt: z.string().datetime().nullable(),
  timeSpent: z.number().int().nullable(),
  interactionsCount: z.number().int(),
  pauseCount: z.number().int(),
  skipCount: z.number().int(),
  deviceType: z.enum(['VR_HEADSET', 'DESKTOP', 'MOBILE', 'TABLET']).nullable(),
  platform: z.string().nullable(),
  ipAddress: z.string().nullable(),
  sessionId: z.string().nullable(),
  errorCount: z.number().int(),
  endReason: z.enum(['completed', 'abandoned', 'crashed', 'timeout', 'user_exit']).nullable(),
  endedAt: z.string().datetime().nullable(),
  totalTimeSeconds: z.number().int().nullable(),
});

export class GroupExperienceResponseDto extends createZodDto(groupExperienceResponseSchema) {}