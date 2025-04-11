import { Injectable, OnModuleDestroy } from '@nestjs/common'
import Redis from 'ioredis'
import { ConfigService } from '../config/config.service'

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(private readonly configService: ConfigService) {
    super({
      host: configService.REDIS_HOST,
      port: configService.REDIS_PORT,
      password: configService.REDIS_PASSWORD,
    })
  }

  onModuleDestroy() {
    this.disconnect()
  }
}
