import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateGroupSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  code: z.string().min(1).max(20).optional(),
  status: z.enum(['ACTIVE', 'DISSOLVED']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export class UpdateGroupDto extends createZodDto(updateGroupSchema) {}