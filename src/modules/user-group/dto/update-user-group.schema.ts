import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateUserGroupSchema = z.object({
  roleInGroup: z.enum(['LEADER', 'MEMBER']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'REMOVED']).optional(),
});

export class UpdateUserGroupDto extends createZodDto(updateUserGroupSchema) {}