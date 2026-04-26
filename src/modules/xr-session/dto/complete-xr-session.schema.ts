import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const completeXRSessionSchema = z.object({
  finalScore: z.number().optional(),
  totalTimeSeconds: z.number().int().positive().optional(),
  totalCorrect: z.number().int().nonnegative().optional(),
  totalIncorrect: z.number().int().nonnegative().optional(),
  totalQuestions: z.number().int().positive().optional(),
  cases: z.array(z.object({
    caseNumber: z.number().int().positive(),
    failureName: z.string(),
    typeCorrect: z.boolean(),
    causeCorrect: z.boolean(),
    recommendationCorrect: z.boolean(),
    caseTimeSeconds: z.number().int().positive(),
  })).optional(),
  interactionsCount: z.number().int().nonnegative().optional(),
  pauseCount: z.number().int().nonnegative().optional(),
  errorCount: z.number().int().nonnegative().optional(),
  rating: z.number().int().min(1).max(5).optional(),
});

export class CompleteXRSessionDto extends createZodDto(completeXRSessionSchema) {}