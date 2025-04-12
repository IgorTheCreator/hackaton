import { FastifyRequest } from 'fastify'
import { Controller, Get, Param, Post, Req, StreamableFile, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { Public, User } from 'src/shared/decorators'
import { IPayload } from 'src/shared/interfaces'
import { ApiBearerAuth, ApiConsumes, ApiParam } from '@nestjs/swagger'
import { LogoutGuard } from '../auth/guards'
import { IdDto } from 'src/shared/dtos'

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(LogoutGuard)
  profile(@User() user: IPayload) {
    return this.userService.profile(user)
  }

  @Post('image')
  @UseGuards(LogoutGuard)
  @ApiConsumes('multipart/form-data')
  async uploadImage(@User() user: IPayload, @Req() request: FastifyRequest) {
    const file = await request.file()
    const buffer = await file?.toBuffer()
    return this.userService.uploadImage(user.id, buffer!)
  }

  @Get(':id/image')
  @Public()
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  async getImage(@Param() param: IdDto) {
    console.log(param)
    const buffer = await this.userService.getImage(param)
    return new StreamableFile(buffer, {
      type: 'image/webp',
    })
  }
}
