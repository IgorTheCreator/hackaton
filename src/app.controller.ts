import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { Public, Roles, User } from './shared/decorators'
import { IPayload } from './shared/interfaces'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  @Public()
  ping(): string {
    return this.appService.ping()
  }

  @Get('test')
  @Roles('ADMIN', 'USER')
  test(@User() user: IPayload) {
    return user
  }
}
