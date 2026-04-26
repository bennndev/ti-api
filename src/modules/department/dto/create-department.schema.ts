import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createDepartmentSchema = z.object({
  orgId: z.number().int().positive(),
  name: z.string().min(1).max(25),
  description: z.string().min(1),
  status: z.boolean().default(true),
});

export class CreateDepartmentDto extends createZodDto(createDepartmentSchema) {}