import { Injectable } from '@nestjs/common'
import { ConfigService as NestJsConfigService } from '@nestjs/config'

@Injectable()
export class ConfigService {
  readonly APP_PORT: number
  readonly APP_HOST: string
  readonly CACHE_PORT: number
  readonly CACHE_HOST: string
  readonly CACHE_PASSWORD: string
  readonly JWT_SECRET_KEY: string
  readonly JWT_TOKEN_VALID: string
  readonly REFRESH_TOKEN_VALID_DAYS: number

  constructor(private readonly config: NestJsConfigService) {
    this.APP_PORT = this.config.get<number>('APP_PORT', 3015)
    this.APP_HOST = this.config.get<string>('APP_HOST', '127.0.0.1')

    this.CACHE_HOST = this.config.getOrThrow<string>('CACHE_HOST')
    this.CACHE_PORT = this.config.getOrThrow<number>('CACHE_PORT')
    this.CACHE_PASSWORD = this.config.getOrThrow<string>('CACHE_PASSWORD')

    this.JWT_SECRET_KEY = this.config.getOrThrow<string>('JWT_SECRET_KEY')
    this.JWT_TOKEN_VALID = this.config.getOrThrow<string>('JWT_TOKEN_VALID')
    this.REFRESH_TOKEN_VALID_DAYS = +this.config.getOrThrow<number>('REFRESH_TOKEN_VALID_DAYS')
  }
}
