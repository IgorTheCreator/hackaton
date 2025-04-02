import { Role } from '@prisma/client'

export interface IPayload {
  id: string
  role: Role
}