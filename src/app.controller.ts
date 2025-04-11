import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { Public, Roles, User } from './shared/decorators'
import { IPayload } from './shared/interfaces'
import { ApiBearerAuth } from '@nestjs/swagger'

@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  @Public()
  ping(): string {
    return this.appService.ping()
  }

  @Get('test')
  @Roles('USER')
  test(@User() user: IPayload) {
    return user
  }
}
