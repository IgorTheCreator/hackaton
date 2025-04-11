import { Module } from '@nestjs/common'
import { ProjectService } from './project.service'
import { ProjectController } from './project.controller'

@Module({
  imports: [],
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
