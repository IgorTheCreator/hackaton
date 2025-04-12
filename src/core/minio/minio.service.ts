import { Client } from 'minio'
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'

@Injectable()
export class MinioService implements OnModuleInit {
  constructor(@Inject('MINIO') readonly minio: Client) {}

  async onModuleInit() {
    const exists = await this.minio.bucketExists('projects')
    if (!exists) {
      await this.minio.makeBucket('projects')
    }
  }
}
