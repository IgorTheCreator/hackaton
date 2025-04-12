import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { ProjectService } from './project.service'
import { CreateProjectDto } from './project.dto'
import { User } from 'src/shared/decorators'
import { IPayload } from 'src/shared/interfaces'
import { ListDto } from 'src/shared/dtos'

@ApiBearerAuth()
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post("create")
  create(@Body() dto: CreateProjectDto, @User() user: IPayload) {
    return this.projectService.create(user.id, dto)
  }

  @Get()
  list(@Query() query: ListDto) {
    return this.projectService.list(query)
  }

}
