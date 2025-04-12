import { ApiProperty } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const ListSchema = z
  .object({
    limit: z.coerce.number().int().min(0),
    offset: z.coerce.number().int().min(0),
  })
  .strict()

export class ListSwaggerDto {
  @ApiProperty({
    type: Number,
  })
  limit: number

  @ApiProperty({
    type: Number,
  })
  offset: number
}

export class ListDto extends createZodDto(ListSchema) {}
