import { Injectable } from '@nestjs/common'
import { MinioService } from 'src/core/minio/minio.service'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { IdDto } from 'src/shared/dtos'
import { IPayload } from 'src/shared/interfaces'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minioService: MinioService,
  ) { }

  async profile({ id, role }: IPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        role,
      },
      select: {
        id: true,
        email: true,
        level: true,
        levelProgress: true,
        name: true,
        badges: true,
        balance: true,
        co2Reduced: true,
        plasticReduced: true,
        treesSaved: true,
        createdAt: true
      },
    })
    const totalTransactionsSum = await this.prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId: id,
      },
    })
    return { user: { ...user, levelProgress: Math.floor(((user?.levelProgress || 0) % 1000) / 1000 * 100), totalTransactionsSum, badges: ["Спаситель планеты", "Переработчик пластика", "Водоочиститель"] } }
  }

  async uploadImage(userId: string, buffer: Buffer) {
    await this.minioService.minio.putObject('users', `${userId}.webp`, buffer)
    return { success: true }
  }

  async getImage({ id }: IdDto) {
    const image = await this.minioService.minio.getObject('users', `${id}.webp`)
    return image
  }
}
