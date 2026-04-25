import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const organizationResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
  ruc: z.string(),
  logo: z.string(),
  country: z.string(),
  status: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export class OrganizationResponseDto extends createZodDto(organizationResponseSchema) {}
