import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createAddressableSchema = z.object({
  experienceId: z.number().int().positive(),
  bundleUrl: z.string().url().max(500),
  version: z.string().min(1).max(20),
  sizeMb: z.number().positive(),
  catalogUrl: z.string().url().max(500),
  isActive: z.boolean().default(true),
});

export class CreateAddressableDto extends createZodDto(createAddressableSchema) {}