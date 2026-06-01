import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const userResponseSchema = z.object({
  id: z.number().int(),
  email: z.string().email(),
  username: z.string().nullable(),
  name: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  roleId: z.number().int().nullable(),
  orgId: z.number().int().nullable(),
  position: z.string().nullable(),
  phone: z.string().nullable(),
  specialtyId: z.number().int().nullable(),
  specialty: z.object({
    id: z.number(),
    code: z.string(),
    name: z.string(),
  }).nullable(),
  emailVerified: z.boolean(),
  status: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export class UserResponseDto extends createZodDto(userResponseSchema) {}