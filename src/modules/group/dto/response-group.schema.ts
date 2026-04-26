import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const groupResponseSchema = z.object({
  id: z.number().int(),
  orgId: z.number().int(),
  courseId: z.number().int(),
  name: z.string(),
  code: z.string(),
  status: z.enum(['ACTIVE', 'DISSOLVED']),
  startDate: z.string().datetime().nullable(),
  endDate: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export class GroupResponseDto extends createZodDto(groupResponseSchema) {}