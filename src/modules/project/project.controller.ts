import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { ProjectService } from './project.service'
import { CreateProjectDto } from './project.dto'
import { User } from 'src/shared/decorators'
import { IPayload } from 'src/shared/interfaces'

@ApiBearerAuth()
@Controller("projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post("create")
  create (@Body() dto: CreateProjectDto, @User() user: IPayload) {
    return this.projectService.create(user.id, dto)
  }

  @Get()
  list () {
    return this.projectService.list()
  }
}
