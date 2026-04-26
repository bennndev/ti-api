import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const activityLogResponseSchema = z.object({
  id: z.number().int(),
  userId: z.string(),
  orgId: z.number().int(),
  action: z.string(),
  entity: z.string().nullable(),
  entityId: z.number().int().nullable(),
  metadata: z.any().nullable(),
  ipAddress: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export class ActivityLogResponseDto extends createZodDto(activityLogResponseSchema) {}