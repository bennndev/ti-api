import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { patterns, messages } from '@/modules/common/validators';

export const createOrganizationSchema = z.object({
  name: z.string().min(1).max(25).regex(patterns.NAME, messages.NAME),
  ruc: z.string().regex(patterns.RUC_DOC, messages.RUC),
  logo: z.string().max(255).optional().default(''),
  country: z.string().min(1).max(48),
});

export class CreateOrganizationDto extends createZodDto(createOrganizationSchema) {}