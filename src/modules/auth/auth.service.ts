import { randomUUID } from 'node:crypto'
import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { CredentialsDto } from './auth.dto'
import { UtilsService } from 'src/shared/utils/utils.service'
import { ConfigService } from 'src/core/config/config.service'
import { IPayload } from 'src/shared/interfaces'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  async signup({ email, password }: CredentialsDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      })
      if (existingUser) {
        throw new ConflictException('User already exists')
      }
      const hashedPassword = await this.utils.hashData(password)
      const { id } = await this.prisma.user.create({
        data: {
          email,
          username: email,
          password: hashedPassword,
        },
        select: {
          id: true,
        },
      })
      return { id }
    } catch (e) {
      this.logger.error(e)
      if (e instanceof HttpException) throw e
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async signin({ email, password }: CredentialsDto, userAgent: string) {
    try {
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
    } catch (e) {
      this.logger.error(e)
      if (e instanceof HttpException) throw e
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async refresh(refreshToken: string, userAgent: string) {
    try {
      const token = await this.prisma.refreshToken.findUnique({
        where: {
          token: refreshToken,
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
    } catch (e) {
      this.logger.error(e)
      if (e instanceof HttpException) throw e
      throw new InternalServerErrorException('Something went wrong')
    }
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
        expiresAt: new Date(
          new Date().setDate(new Date().getDate() + this.config.REFRESH_TOKEN_VALID_DAYS),
        ).toISOString(),
      },
      create: {
        token: randomUUID(),
        expiresAt: new Date(
          new Date().setDate(new Date().getDate() + this.config.REFRESH_TOKEN_VALID_DAYS),
        ).toISOString(),
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

  async logout(refreshToken: string) {
    await this.prisma.refreshToken
      .delete({
        where: {
          token: refreshToken,
        },
      })
      .catch(() => {
        this.logger.log('Refresh token not found')
      })
  }
}
