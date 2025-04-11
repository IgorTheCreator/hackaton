import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const ListSchema = z
  .object({
    limit: z.number().int().min(0),
    offset: z.number().int().min(0),
  })
  .strict()

export class ListDto extends createZodDto(ListSchema) {}
