import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateAddressableSchema = z.object({
  bundleUrl: z.string().url().max(500).optional(),
  version: z.string().min(1).max(20).optional(),
  sizeMb: z.number().positive().optional(),
  catalogUrl: z.string().url().max(500).optional(),
  isActive: z.boolean().optional(),
});

export class UpdateAddressableDto extends createZodDto(updateAddressableSchema) {}