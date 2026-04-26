import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createActivityLogSchema = z.object({
  userId: z.string(),
  orgId: z.number().int().positive(),
  action: z.string().min(1).max(100),
  entity: z.string().max(50).nullish(),
  entityId: z.number().int().positive().nullish(),
  metadata: z.any().nullish(),
  ipAddress: z.string().max(45).nullish(),
});

export class CreateActivityLogDto extends createZodDto(createActivityLogSchema) {}

// Batch creation for fire-and-forget
export const createActivityLogBatchSchema = z.object({
  events: z.array(createActivityLogSchema),
});

export class CreateActivityLogBatchDto extends createZodDto(createActivityLogBatchSchema) {}