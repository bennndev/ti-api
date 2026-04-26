import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateGroupExperienceSchema = z.object({
  finalScore: z.number().min(0).max(100).optional(),
  attempts: z.number().int().nonnegative().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED']).optional(),
  mandatory: z.boolean().optional(),
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  timeSpent: z.number().int().nonnegative().optional(),
  interactionsCount: z.number().int().nonnegative().optional(),
  pauseCount: z.number().int().nonnegative().optional(),
  skipCount: z.number().int().nonnegative().optional(),
  deviceType: z.enum(['VR_HEADSET', 'DESKTOP', 'MOBILE', 'TABLET']).optional(),
  platform: z.string().max(50).optional(),
  ipAddress: z.string().max(45).optional(),
  sessionId: z.string().max(100).optional(),
  errorCount: z.number().int().nonnegative().optional(),
});

export class UpdateGroupExperienceDto extends createZodDto(updateGroupExperienceSchema) {}