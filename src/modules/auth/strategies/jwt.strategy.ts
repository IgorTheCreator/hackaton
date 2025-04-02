import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from 'src/core/config/config.service'
import { IPayload } from 'src/shared/interfaces'
import { PrismaService } from 'src/core/prisma/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWT_SECRET_KEY,
    })
  }

  async validate(payload: IPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    })
    if (!user) {
      throw new UnauthorizedException()
    }
    return payload
  }
}
