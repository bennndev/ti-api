import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createScoreEventSchema = z.object({
  groupId: z.number().int().positive(),
  experienceId: z.number().int().positive(),
  sessionId: z.string().max(100),
  eventId: z.string().max(50),
  label: z.string().max(100).optional(),
  scoreDelta: z.number(),
  metadata: z.any().optional(),
});

export class CreateScoreEventDto extends createZodDto(createScoreEventSchema) {}