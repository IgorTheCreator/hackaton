import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiQuery } from '@nestjs/swagger'
import { ProjectService } from './project.service'
import { CreateProjectDto } from './project.dto'
import { Public, User } from 'src/shared/decorators'
import { IPayload } from 'src/shared/interfaces'
import { IdDto, ListDto, ListSwaggerDto } from 'src/shared/dtos'
import { LogoutGuard } from '../auth/guards'
import { FileFieldsInterceptor, MemoryStorageFile, StorageFile, UploadedFiles } from '@blazity/nest-file-fastify'

@ApiBearerAuth()
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post('create')
  @UseGuards(LogoutGuard)
  create (@Body() dto: CreateProjectDto, @User() user: IPayload) {
    return this.projectService.create(user.id, dto)
  }

  @Get('')
  @ApiQuery({
    required: true,
    type: ListSwaggerDto,
  })
  @Get()
  @Public()
  list (@Query() query: ListDto) {
    return this.projectService.list(query)
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @Public()
  get (@Param() param: IdDto) {
    return this.projectService.get(param)
  }

  @Post('upload-image/:id')
  @UseGuards(LogoutGuard)
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  uploadImage (
    @Param() param: IdDto,
    @UploadedFiles()
    files: { image?: StorageFile },
  ) {
    console.log(files)
  }
}
