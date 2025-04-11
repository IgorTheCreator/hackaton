import * as Minio from 'minio'
import { Global, Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';


@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'MINIO',
      inject: [ConfigService],
      useFactory: () => {
        return new Minio.Client({

        })
      }
    },
    MinioService],
  exports: [MinioService],
})
export class MinioModule { }
