import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const groupRoles = ['LEADER', 'MEMBER'] as const;
export const userGroupStatuses = ['ACTIVE', 'INACTIVE', 'REMOVED'] as const;

export const createUserGroupSchema = z.object({
  userId: z.string().min(1),
  groupId: z.number().int().positive(),
  roleInGroup: z.enum(groupRoles).default('MEMBER'),
  status: z.enum(userGroupStatuses).default('ACTIVE'),
});

export class CreateUserGroupDto extends createZodDto(createUserGroupSchema) {}