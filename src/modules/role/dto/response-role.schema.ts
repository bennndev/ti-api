import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const roleResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  code: z.string(),
  description: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export class RoleResponseDto extends createZodDto(roleResponseSchema) {}