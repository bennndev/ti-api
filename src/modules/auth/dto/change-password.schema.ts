import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { patterns, messages } from '@/modules/common/validators';

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).regex(patterns.PASSWORD, messages.PASSWORD),
});

export class ChangePasswordDto extends createZodDto(changePasswordSchema) {}
