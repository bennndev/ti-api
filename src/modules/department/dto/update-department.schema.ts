import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateDepartmentSchema = z.object({
  name: z.string().min(1).max(25).optional(),
  description: z.string().optional(),
  status: z.boolean().optional(),
});

export class UpdateDepartmentDto extends createZodDto(updateDepartmentSchema) {}