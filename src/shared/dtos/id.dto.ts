import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const IdSchema = z.object({
    id: z.string().uuid()
})

export class IdDto extends createZodDto(IdSchema) { }
