import { Controller, Get, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { Public, Roles, User } from './shared/decorators'
import { IPayload } from './shared/interfaces'
import { LogoutGuard } from './modules/auth/guards'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('ping')
  @Public()
  ping(): string {
    return this.appService.ping()
  }

  @Get('test')
  @Roles('USER')
  @UseGuards(LogoutGuard)
  test(@User() user: IPayload) {
    return user
  }
}
