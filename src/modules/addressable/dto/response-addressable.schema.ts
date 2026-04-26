import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const addressableResponseSchema = z.object({
  id: z.number().int(),
  experienceId: z.number().int(),
  bundleUrl: z.string(),
  version: z.string(),
  sizeMb: z.number(),
  catalogUrl: z.string(),
  isActive: z.boolean(),
  updatedAt: z.string().datetime(),
});

export class AddressableResponseDto extends createZodDto(addressableResponseSchema) {}

export const addressableUnityResponseSchema = z.object({
  experienceId: z.number().int(),
  currentVersion: z.string(),
  bundleUrl: z.string(),
  catalogUrl: z.string(),
  sizeMb: z.number(),
  updatedAt: z.string().datetime(),
});

export class AddressableUnityResponseDto extends createZodDto(addressableUnityResponseSchema) {}