import { Controller, Get, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from 'src/shared/decorators'
import { IPayload } from 'src/shared/interfaces'
import { ApiBearerAuth } from '@nestjs/swagger'
import { LogoutGuard } from '../auth/guards'

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(LogoutGuard)
  profile(@User() user: IPayload) {
    return this.userService.profile(user)
  }
}
