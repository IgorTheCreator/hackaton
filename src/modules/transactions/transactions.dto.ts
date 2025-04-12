import { TransactionType } from '@prisma/client'
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const CreateTransactionSchema = z.object({
  amount: z.number().int().min(100),
  projectId: z.string().uuid().optional(),
  type: z.nativeEnum(TransactionType),
})

export class CreateTransactionDto extends createZodDto(CreateTransactionSchema) {}
