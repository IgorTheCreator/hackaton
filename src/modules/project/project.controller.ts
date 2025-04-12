import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger'
import { ProjectService } from './project.service'
import { CreateProjectDto } from './project.dto'
import { Public, User } from 'src/shared/decorators'
import { IPayload } from 'src/shared/interfaces'
import { IdDto, ListDto, ListSwaggerDto } from 'src/shared/dtos'
import { LogoutGuard } from '../auth/guards'

@ApiBearerAuth()
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

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
}
