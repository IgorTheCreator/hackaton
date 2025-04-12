import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { CreateProjectDto } from './project.dto'
import { IdDto, ListDto } from 'src/shared/dtos'
import { EsgRatingCategory } from '@prisma/client'
import { MinioService } from 'src/core/minio/minio.service'
import { MemoryStorageFile } from '@blazity/nest-file-fastify'

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private readonly minioService: MinioService,
  ) { }

  async create (userId: string, dto: CreateProjectDto) {
    const { environmentalScore, socialScore, governanceScore, overallScore } =
      this.calculateESGRating(dto)

    const project = await this.prisma.project.create({
      data: {
        title: dto.title,
        description: dto.description,
        userId,
        type: dto.type,
        location: dto.location,
        endDate: dto.endDate,
        purpose: dto.purpose,
        goalFunding: dto.goalFunding,
        shortDescription: dto.shortDescription,
        startDate: dto.startDate,
        esg: {
          create: {
            ratingDate: new Date(),
            overallScore,
            environmentalScore,
            socialScore,
            governanceScore,
            ratingCategory: this.getRatingCategory(overallScore),
            ...this.extractEnvironmentalData(dto),
            ...this.extractSocialData(dto),
            ...this.extractGovernanceData(dto),
          },
        },
      },
      include: {
        esg: true,
      },
    })

    return {
      project: {
        ...project,
        esg: {
          ...project.esg,
          ratingCategory: this.getRatingCategory(overallScore),
        },
      },
    }
  }

  private calculateESGRating (dto: CreateProjectDto) {
    const environmentalScore = this.calculateEnvironmentalScore(dto)
    const socialScore = this.calculateSocialScore(dto)
    const governanceScore = this.calculateGovernanceScore(dto)

    const overallScore = environmentalScore + socialScore + governanceScore

    return {
      environmentalScore,
      socialScore,
      governanceScore,
      overallScore: Math.round(overallScore),
    }
  }

  private calculateEnvironmentalScore (dto: CreateProjectDto): number {
    let score = 0

    if (dto.environmental.mainImpact) {
      const { type, value } = dto.environmental.mainImpact
      const mainImpactScores: Record<string, [number, number]> = {
        CO2Reduction: [10, 15],
        TreesPlanted: [100, 15],
        WaterCleaned: [1000, 10],
        WasteRecycled: [10, 10],
        LandRestored: [1, 10],
      }

      if (mainImpactScores[type]) {
        const [divisor, maxScore] = mainImpactScores[type]
        score += this.calculateScore(value, divisor, maxScore)
      }
    }

    score += this.addBooleanScore(dto.environmental.renewableEnergyUsed, 5)
    score += this.addBooleanScore(dto.environmental.waterMinimized, 5)
    score += this.addBooleanScore(!!dto.environmental.biodiversityImpact, 5)
    score += this.calculateScore(dto.environmental.landRestored || 0, 1, 5)
    score += this.calculateScore(
      dto.environmental.wasteRecycled && dto.environmental.mainImpact?.type !== 'WasteRecycled'
        ? dto.environmental.wasteRecycled
        : 0,
      10,
      5,
    )
    score += this.calculateScore(
      dto.environmental.waterSaved && dto.environmental.mainImpact?.type !== 'WaterCleaned'
        ? dto.environmental.waterSaved
        : 0,
      1000,
      5,
    )

    return Math.min(score, 50)
  }

  private calculateSocialScore (dto: CreateProjectDto): number {
    let score = 0

    score += this.calculateScore(
      dto.social.jobsCreated?.enabled ? dto.social.jobsCreated.count || 0 : 0,
      5,
      5,
    )
    score += this.calculateScore(
      dto.social.communityEngagement?.enabled ? dto.social.communityEngagement.count || 0 : 0,
      50,
      5,
    )
    score += this.addBooleanScore(dto.social.resourceAccess?.enabled, 5)
    score += this.calculateScore(dto.social.educationPrograms || 0, 10, 5)

    return Math.min(score, 30)
  }

  private calculateGovernanceScore (dto: CreateProjectDto): number {
    let score = 0

    score += this.addBooleanScore(dto.governance.financialTransparency, 5)
    score += this.addBooleanScore(dto.governance.regularReports, 5)
    score += this.addBooleanScore(dto.governance.riskManagement, 2)
    score += this.addBooleanScore(dto.governance.stakeholderEngagement, 1)

    return Math.min(score, 20)
  }

  private extractEnvironmentalData (dto: CreateProjectDto) {
    const { mainImpact } = dto.environmental
    return {
      co2Reduction:
        dto.environmental.co2Reduction ||
        (mainImpact?.type === 'CO2Reduction' ? mainImpact.value : null),
      treesPlanted:
        dto.environmental.treesPlanted ||
        (mainImpact?.type === 'TreesPlanted' ? Math.floor(mainImpact.value) : null),
      waterSaved:
        dto.environmental.waterSaved ||
        (mainImpact?.type === 'WaterCleaned' ? mainImpact.value : null),
      wasteRecycled:
        dto.environmental.wasteRecycled ||
        (mainImpact?.type === 'WasteRecycled' ? mainImpact.value : null),
      renewableEnergyUsed: dto.environmental.renewableEnergyUsed || false,
      waterMinimized: dto.environmental.waterMinimized || false,
      biodiversityImpact: dto.environmental.biodiversityImpact,
    }
  }

  private extractSocialData (dto: CreateProjectDto) {
    return {
      jobsCreated: dto.social.jobsCreated?.enabled ? dto.social.jobsCreated.count : null,
      communityEngagement: dto.social.communityEngagement?.enabled
        ? dto.social.communityEngagement.count
        : null,
      resourceAccess: dto.social.resourceAccess?.enabled
        ? dto.social.resourceAccess.description
        : null,
      educationPrograms: dto.social.educationPrograms,
    }
  }

  private extractGovernanceData (dto: CreateProjectDto) {
    return {
      financialTransparency: dto.governance.financialTransparency || false,
      regularReports: dto.governance.regularReports || false,
      riskManagement: dto.governance.riskManagement || false,
      stakeholderEngagement: dto.governance.stakeholderEngagement || false,
    }
  }

  private calculateScore (value: number, divisor: number, maxScore: number): number {
    return Math.min(Math.floor(value / divisor), maxScore)
  }

  private addBooleanScore (condition: boolean | undefined, score: number): number {
    return condition ? score : 0
  }

  private getRatingCategory (score: number): EsgRatingCategory {
    if (score >= 80) return EsgRatingCategory.A
    if (score >= 60) return EsgRatingCategory.B
    if (score >= 40) return EsgRatingCategory.C
    return EsgRatingCategory.D
  }

  async list ({ limit: take, offset: skip }: ListDto) {
    let list = await this.prisma.project.findMany({
      take,
      skip,
      orderBy: {
        esg: {
          ratingCategory: 'asc',
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        currentFunding: true,
        goalFunding: true,
        type: true,
        endDate: true,
        transactions: {
          distinct: 'userId',
          select: {
            id: true,
          },
        },
        esg: {
          select: {
            co2Reduction: true,
            overallScore: true,
            ratingCategory: true,
            ratingDate: true,
          },
        },
      },
    })

    list = list.map((item: any) => {
      const donators = item.transactions.length
      delete item.transactions
      const data = { ...item, donators }
      return {
        ...data,
      }
    })

    return { list }
  }

  async get ({ id }: IdDto) {
    const project = await this.prisma.project.findUnique({
      where: {
        id,
      },
    })
    return { project }
  }

  async uploadImage ({ id }: IdDto, image: MemoryStorageFile) {
    const a = await this.minioService.minio.putObject('projects', `${id}.png`, image.buffer)
    return a
  }
}
