import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const userGroupResponseSchema = z.object({
  userId: z.string(),
  groupId: z.number().int(),
  roleInGroup: z.enum(['LEADER', 'MEMBER']).nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'REMOVED']),
  joinedAt: z.string().datetime(),
});

export class UserGroupResponseDto extends createZodDto(userGroupResponseSchema) {}