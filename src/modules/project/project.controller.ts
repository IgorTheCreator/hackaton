import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { ProjectService } from './project.service'
import { CreateProjectDto } from './project.dto'
import { User } from 'src/shared/decorators'
import { IPayload } from 'src/shared/interfaces'
import { ListDto, ListSwaggerDto } from 'src/shared/dtos'

@ApiBearerAuth()
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  create(@Body() dto: CreateProjectDto, @User() user: IPayload) {
    return this.projectService.create(user.id, dto)
  }

  @Get('')
  @ApiQuery({
    required: true,
    type: ListSwaggerDto,
  })
  @Get()
  list(@Query() query: ListDto) {
    return this.projectService.list(query)
  }
}
