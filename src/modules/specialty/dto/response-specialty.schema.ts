import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const specialtyResponseSchema = z.object({
  id: z.number().int(),
  departmentId: z.number().int(),
  name: z.string(),
  code: z.string(),
  description: z.string(),
  image: z.string().nullable(),
  status: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export class SpecialtyResponseDto extends createZodDto(specialtyResponseSchema) {}