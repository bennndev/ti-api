import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const scoreEventItemSchema = z.object({
  eventId: z.string().max(50),
  label: z.string().max(100).optional(),
  scoreDelta: z.number(),
  metadata: z.any().optional(),
});

export const closeSessionSchema = z.object({
  groupId: z.number().int().positive(),
  experienceId: z.number().int().positive(),
  sessionId: z.string().max(100),
  endReason: z.enum(['completed', 'abandoned', 'crashed', 'timeout', 'user_exit']),
  finalScore: z.number().min(0).max(100).optional(),
  totalTimeSeconds: z.number().int().nonnegative().optional(),
  startedAtUtc: z.string().datetime().optional(),
  endedAtUtc: z.string().datetime().optional(),
  deviceType: z.enum(['VR_HEADSET', 'DESKTOP', 'MOBILE', 'TABLET']).optional(),
  platform: z.string().max(50).optional(),
  ipAddress: z.string().max(45).optional(),
  scoreEvents: z.array(scoreEventItemSchema).optional(),
});

export class CloseSessionDto extends createZodDto(closeSessionSchema) {}