import 'dotenv/config'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from './core/config/config.module'
import { PrismaModule } from './core/prisma/prisma.module'
import { AuthModule } from './modules/auth/auth.module'
import { APP_GUARD, APP_PIPE } from '@nestjs/core'
import { ZodValidationPipe } from 'nestjs-zod'
import { UtilsModule } from './shared/utils/utils.module'
import { JwtAuthGuard, RolesGuard } from './modules/auth/guards'
import { CacheInMemoryModule } from './core/cache-in-memory/cache-in-memory.module'
import { ProjectModule } from './modules/project/project.module'
import { MinioModule } from './core/minio/minio.module'
import { RedisModule } from './core/redis/redis.module'
import { UserModule } from './modules/user/user.module'
import { TransactionsModule } from './modules/transactions/transactions.module'
import { SocketModule } from './modules/socket/socket.module';
@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    UtilsModule,
    CacheInMemoryModule,
    ProjectModule,
    MinioModule,
    RedisModule,
    UserModule,
    TransactionsModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
