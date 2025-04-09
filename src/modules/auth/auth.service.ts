import { randomUUID } from 'node:crypto'
import { add } from 'date-fns'
import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { CredentialsDto } from './auth.dto'
import { UtilsService } from 'src/shared/utils/utils.service'
import { ConfigService } from 'src/core/config/config.service'
import { IPayload } from 'src/shared/interfaces'
import { JwtService } from '@nestjs/jwt'
import { CacheInMemoryService } from 'src/core/cache-in-memory/cache-in-memory.service'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly cacheInMemoryService: CacheInMemoryService,
  ) {}

  async signup({ email, password }: CredentialsDto, userAgent: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })
    if (existingUser) {
      throw new ConflictException('User already exists')
    }
    const hashedPassword = await this.utils.hashData(password)
    await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    })
    return this.signin({ email, password }, userAgent)
  }

  async signin({ email, password }: CredentialsDto, userAgent: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
        role: true,
      },
    })
    if (!existingUser) {
      throw new BadRequestException('Invalid credentials')
    }
    const isValid = await this.utils.compare(password, existingUser.password)
    if (!isValid) {
      throw new BadRequestException('Invalid credentials')
    }
    const payload: IPayload = { id: existingUser.id, role: existingUser.role }
    const accessToken = await this.jwt.signAsync(payload)
    const refreshToken = await this.getRefreshToken(existingUser.id, userAgent)
    return { accessToken, refreshToken }
  }

  async refresh(refreshToken: string, userAgent: string) {
    const token = await this.prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
        expiresAt: {
          gte: new Date(),
        },
      },
      select: {
        userId: true,
        user: {
          select: {
            role: true,
          },
        },
      },
    })
    if (!token) {
      throw new BadRequestException('Invalid refresh token')
    }
    await this.prisma.refreshToken.delete({
      where: {
        token: refreshToken,
      },
    })
    const newRefreshToken = await this.getRefreshToken(token.userId, userAgent)

    const payload = { id: token.userId, role: token.user.role }
    const accessToken = await this.jwt.signAsync(payload)
    return { accessToken, refreshToken: newRefreshToken }
  }

  async getRefreshToken(userId: string, userAgent: string) {
    const _token = await this.prisma.refreshToken.findFirst({
      where: {
        userId,
        userAgent,
      },
    })
    const token = _token?.token ?? ''
    const newRefreshToken = await this.prisma.refreshToken.upsert({
      where: {
        token,
      },
      update: {
        token: randomUUID(),
        expiresAt: add(new Date(), { days: this.config.REFRESH_TOKEN_VALID_DAYS }),
      },
      create: {
        token: randomUUID(),
        expiresAt: add(new Date(), { days: this.config.REFRESH_TOKEN_VALID_DAYS }),
        userId,
        userAgent,
      },
      select: {
        token: true,
        expiresAt: true,
      },
    })

    return newRefreshToken
  }

  async logout(accessToken: string, refreshToken: string) {
    this.cacheInMemoryService.cache.set(accessToken, accessToken)
    await this.prisma.refreshToken
      .delete({
        where: {
          token: refreshToken,
        },
      })
      .catch(() => {
        this.logger.warn('Refresh token not found')
      })
    return { success: true }
  }
}
