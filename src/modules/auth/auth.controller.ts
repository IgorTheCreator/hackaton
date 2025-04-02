import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './auth.dto';
import { FastifyReply } from 'fastify';
import { Public, UserAgent } from 'src/shared/decorators';
import { RefreshToken } from './decorators';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // Регистрация
  @Post('signup')
  @Public()
  signup(@Body() body: CredentialsDto) {
    return this.authService.signup(body)
  }

  // Авторизация
  @Public()
  @Post('signin')
  async signin(@UserAgent() userAgent: string, @Res({ passthrough: true }) res: FastifyReply, @Body() body: CredentialsDto) {
    const { accessToken, refreshToken } = await this.authService.signin(body, userAgent)
    res.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: true
    })
    return { accessToken }
  }

  @Public()
  @Post('refresh')
  async refresh(@UserAgent() userAgent: string, @RefreshToken() cookieToken: string, @Res({ passthrough: true }) res: FastifyReply) {
    const { accessToken, refreshToken } = await this.authService.refresh(cookieToken, userAgent)
    res.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: true
    })
    return { accessToken }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) reply: FastifyReply, @RefreshToken() cookieToken: string) {
    reply.clearCookie('refreshToken')
    return this.authService.logout(cookieToken)
  }
}
