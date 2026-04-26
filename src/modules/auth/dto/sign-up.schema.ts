import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  lastName: z.string().min(1).max(50),
  username: z.string().min(3).max(30).optional(),
});

export class SignUpDto extends createZodDto(signUpSchema) {}
