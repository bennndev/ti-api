import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateOrganizationSchema = z.object({
  name: z.string().min(1).max(25).optional(),
  ruc: z.string().min(1).max(20).optional(),
  logo: z.string().max(255).optional(),
  country: z.string().min(1).max(48).optional(),
  status: z.boolean().optional(),
});

export class UpdateOrganizationDto extends createZodDto(updateOrganizationSchema) {}
