import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const groupStatuses = ['ACTIVE', 'DISSOLVED'] as const;

export const createGroupSchema = z.object({
  orgId: z.number().int().positive(),
  courseId: z.number().int().positive(),
  name: z.string().min(1).max(50),
  code: z.string().min(1).max(20),
  status: z.enum(groupStatuses).default('ACTIVE'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export class CreateGroupDto extends createZodDto(createGroupSchema) {}