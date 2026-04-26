import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const validatePinSchema = z.object({
  pin: z.string().length(6).regex(/^\d+$/, 'PIN must be 6 digits'),
  deviceId: z.string().min(1).max(100).optional(),
});

export class ValidatePinDto extends createZodDto(validatePinSchema) {}