import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createOrganizationSchema = z.object({
  name: z.string().min(1).max(25),
  logo: z.string().max(255).optional().default(''),
  country: z.string().min(1).max(48),
  ruc: z.string().min(1).max(20),
});

export class CreateOrganizationDto extends createZodDto(createOrganizationSchema) {}
