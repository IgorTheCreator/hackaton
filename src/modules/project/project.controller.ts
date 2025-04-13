import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  StreamableFile,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiQuery } from '@nestjs/swagger'
import { FastifyRequest } from 'fastify'
import { ProjectService } from './project.service'
import { CreateProjectDto, SetProjectStatusDto } from './project.dto'
import { Public, Roles, User } from 'src/shared/decorators'
import { IPayload } from 'src/shared/interfaces'
import { IdDto, ListDto, ListSwaggerDto } from 'src/shared/dtos'
import { LogoutGuard, RolesGuard } from '../auth/guards'
import { Role } from '@prisma/client'

@ApiBearerAuth()
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post('create')
  @UseGuards(LogoutGuard)
  create(@Body() dto: CreateProjectDto, @User() user: IPayload) {
    return this.projectService.create(user.id, dto)
  }

  @Get('')
  @ApiQuery({
    required: true,
    type: ListSwaggerDto,
  })
  @Get()
  @Public()
  list(@Query() query: ListDto) {
    return this.projectService.list(query)
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @Public()
  get(@Param() param: IdDto) {
    return this.projectService.get(param)
  }

  @Post(':id/image/')
  @UseGuards(LogoutGuard)
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @ApiConsumes('multipart/form-data')
  async uploadImage(@User() user: IPayload, @Req() request: FastifyRequest, @Param() param: IdDto) {
    const file = await request.file()
    const buffer = await file?.toBuffer()
    return this.projectService.uploadImage(user.id, param, buffer!)
  }

  @Get(':id/image')
  @Public()
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  async getImage(@Param() param: IdDto) {
    const buffer = await this.projectService.getImage(param)
    return new StreamableFile(buffer, {
      type: 'image/webp',
    })
  }

  @Post(":id/set-status")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async setStatus(@Body() body: SetProjectStatusDto, @Param() param: IdDto) {
    return this.projectService.setStatus(param, body)
  }
}
