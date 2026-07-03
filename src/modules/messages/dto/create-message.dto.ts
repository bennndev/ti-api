import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createMessageSchema = z.object({
  content: z.string().min(1).max(2000),
});

export class CreateMessageDto extends createZodDto(createMessageSchema) {}
