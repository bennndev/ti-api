import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const departmentResponseSchema = z.object({
  id: z.number().int(),
  orgId: z.number().int(),
  name: z.string(),
  description: z.string(),
  status: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export class DepartmentResponseDto extends createZodDto(departmentResponseSchema) {}