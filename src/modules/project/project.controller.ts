import { Controller } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { ProjectService } from './project.service'

@ApiBearerAuth()
@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
}
