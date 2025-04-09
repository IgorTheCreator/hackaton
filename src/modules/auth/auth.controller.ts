import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CredentialsDto } from './auth.dto'
import { FastifyReply } from 'fastify'
import { AccessToken, Public, User, UserAgent } from 'src/shared/decorators'
import { RefreshToken } from './decorators'
import { IPayload } from 'src/shared/interfaces'
export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // Регистрация
  @Public()
  @Post('signup')
  signup(
    @UserAgent() userAgent: string,
    @Body() body: CredentialsDto
  ) {
    return this.authService.signup(body, userAgent)
  }

  // Авторизация
  @Public()
  @Post('signin')
  async signin(
    @UserAgent() userAgent: string,
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() body: CredentialsDto,
  ) {
    const { accessToken, refreshToken } = await this.authService.signin(body, userAgent)
    res.setCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken.token, {
      httpOnly: true,
      path: '/',
      sameSite: true,
      expires: refreshToken.expiresAt,
    })
    return { accessToken }
  }

  @Public()
  @Post('refresh')
  async refresh(
    @UserAgent() userAgent: string,
    @RefreshToken() cookieToken: string,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const { accessToken, refreshToken } = await this.authService.refresh(cookieToken, userAgent)
    res.setCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken.token, {
      httpOnly: true,
      path: '/',
      sameSite: true,
      expires: new Date(refreshToken.expiresAt),
    })
    return { accessToken }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @Res({ passthrough: true }) reply: FastifyReply,
    @RefreshToken() cookieToken: string,
    @User() user: IPayload,
    @AccessToken() accessToken: string
  ) {
    reply.clearCookie(REFRESH_TOKEN_COOKIE_NAME)
    return this.authService.logout(user.sessionId, accessToken, cookieToken)
  }
}
