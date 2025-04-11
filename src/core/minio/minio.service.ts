import { Client } from 'minio'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class MinioService {
  constructor(@Inject('MINIO') readonly minio: Client) {}
}
