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
import { TransactionType } from '@prisma/client'

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
        project: {
          select: {
            title: true,
          },
        },
        amount: true,
        // type
        // status
        updatedAt: true,
      },
    })
    const transactionsResponse = transactions.map((transaction) => {
      return {
        id: transaction.id,
        project: transaction.project?.title,
        date: transaction.updatedAt,
        // type
        // status
      }
    })
    return { transactions: transactionsResponse }
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

  async createTransaction(userId: string, { amount, projectId, type }: CreateTransactionDto) {
    try {
      const transaction = await this.prisma.$transaction(async (prisma) => {
        let transaction
        if (type === TransactionType.donation) {
          const project = await prisma.project.findUnique({
            where: {
              id: projectId ?? '-1',
              endDate: {
                gte: new Date(),
              },
            },
          })
          if (!project) throw new BadRequestException('Project does not exists')
          const user = await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              balance: {
                decrement: amount,
              },
            },
            select: {
              balance: true,
            },
          })
          if (user.balance < 0) throw new BadRequestException('Not Enough Money')
          transaction = await this.prisma.transaction.create({
            data: {
              amount,
              projectId,
              userId,
              type,
            },
          })
          await prisma.project.update({
            where: {
              id: projectId,
            },
            data: {
              currentFunding: {
                increment: amount,
              },
            },
          })
        } else if (type === TransactionType.refill) {
          transaction = await prisma.transaction.create({
            data: {
              amount,
              type,
              userId,
            },
          })
          await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              balance: {
                increment: amount,
              },
            },
          })
        }

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
