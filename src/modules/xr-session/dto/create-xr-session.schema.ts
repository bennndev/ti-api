import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createXRSessionBodySchema = z.object({
  groupId: z.number().int().positive(),
  deviceType: z.string().max(50).optional(),
  platform: z.string().max(100).optional(),
  ipAddress: z.string().max(45).optional(),
});

export class CreateXRSessionBodyDto extends createZodDto(createXRSessionBodySchema) {}