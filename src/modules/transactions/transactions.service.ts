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
import { ProjectType, TransactionType } from '@prisma/client'

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name)
  constructor(private readonly prisma: PrismaService) { }

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
        type: true,
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

  async create(userId: string, { amount, projectId, type }: CreateTransactionDto) {
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
            include: {
              esg: true
            }
          })
          if (!project) throw new BadRequestException('Project does not exists')
          let savedValueData
          if (project.type == ProjectType.TreePlanting) {
            savedValueData = { treesSaved: { increment: (project.esg?.treesPlanted || 0) * amount / project.goalFunding } }
          }
          else if (project.type == ProjectType.WaterCleanup) {
            savedValueData = { waterCleaned: { increment: project.esg?.waterSaved || 0 * amount / project.goalFunding } }
          }
          else if (project.type == ProjectType.WasteRecycling) {
            savedValueData = { plasticReduced: { increment: project.esg?.wasteRecycled || 0 * amount / project.goalFunding } }
          }
          else if (project.type == ProjectType.RenewableEnergy) {
            savedValueData = { co2Reduced: { increment: project.esg?.co2Reduction || 0 * amount / project.goalFunding } }
          }

          const user = await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              balance: {
                decrement: amount,
              },
              ...savedValueData
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
          const user = await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              balance: {
                increment: amount,
              },
              levelProgress: {
                increment: amount
              }
            },
          })
          const currentLevel = Math.floor(user.levelProgress / 1000);

          if (currentLevel !== user.level) {
            await prisma.user.update({
              where: {
                id: user.id
              },
              data: {
                level: currentLevel
              }
            })
          }
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

  async totalInvested() {
    const totalInvested = await this.prisma.transaction.aggregate({
      where: {
        type: TransactionType.refill
      },
      _sum: {
        amount: true,
      },
    })
    return { totalInvested: totalInvested._sum.amount ?? 0 }
  }
}
