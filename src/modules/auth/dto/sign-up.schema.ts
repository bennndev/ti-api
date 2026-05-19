import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { patterns, messages } from '@/modules/common/validators';

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().regex(patterns.PASSWORD, messages.PASSWORD),
  name: z.string().regex(patterns.NAME, messages.NAME),
  lastName: z.string().regex(patterns.NAME, messages.NAME),
  username: z.string().regex(patterns.USERNAME, messages.USERNAME).optional(),
});

export class SignUpDto extends createZodDto(signUpSchema) {}
