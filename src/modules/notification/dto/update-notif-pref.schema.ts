import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateNotifPrefSchema = z.object({
  preferences: z.record(z.string(), z.boolean()),
});

export class UpdateNotifPrefDto extends createZodDto(updateNotifPrefSchema) {}
