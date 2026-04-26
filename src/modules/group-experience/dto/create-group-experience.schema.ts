import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const groupExperienceStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'] as const;
export const deviceTypes = ['VR_HEADSET', 'DESKTOP', 'MOBILE', 'TABLET'] as const;

export const createGroupExperienceSchema = z.object({
  groupId: z.number().int().positive(),
  experienceId: z.number().int().positive(),
  mandatory: z.boolean().default(false),
});

export class CreateGroupExperienceDto extends createZodDto(createGroupExperienceSchema) {}