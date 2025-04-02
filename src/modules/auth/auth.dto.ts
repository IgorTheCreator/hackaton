import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const CredentialsSchema = z.object({
  email: z.string().email().describe('Электронная почта'),
  password: z.string().min(8).describe('Пароль'),
}).strict()

export class CredentialsDto extends createZodDto(CredentialsSchema) { }