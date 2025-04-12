import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { IdDto, ListDto } from 'src/shared/dtos'
import { CreateTransactionDto } from './transactions.dto'

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name)
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string, { limit: take, offset: skip }: ListDto) {
    const transactions = await this.prisma.transaction.findMany({
      take,
      skip,
      where: {
        userId,
      },
      select: {
        id: true,
        projectId: true,
        amount: true,
        updatedAt: true,
      },
    })

    return { transactions }
  }

  async get(userId: string, { id }: IdDto) {
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id,
        userId,
      },
    })
    return { transaction }
  }

  async createTransaction(userId: string, { amount, projectId }: CreateTransactionDto) {
    try {
      const transaction = await this.prisma.$transaction(async (prisma) => {
        const project = await prisma.project.findUnique({
          where: {
            id: projectId,
          },
        })
        if (!project) throw new BadRequestException('Project does not exists')
        const transaction = await this.prisma.transaction.create({
          data: {
            amount,
            projectId,
            userId,
            // обновление суммы в project
          },
        })
        return { transaction }
      })
      return transaction
    } catch (e) {
      this.logger.debug(e)
      if (e instanceof HttpException) throw e
      throw new InternalServerErrorException('Something went wrong')
    }
  }
}
