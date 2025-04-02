import 'dotenv/config'
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './core/config/config.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { UtilsModule } from './shared/utils/utils.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard, RolesGuard } from './modules/auth/guards';
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: process.env.JWT_TOKEN_VALID
      }
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.stdout.isTTY ? {
          target: 'pino-pretty',
        } : undefined
      }
    }),
    ConfigModule,
    PrismaModule,
    AuthModule,
    UtilsModule,
    JwtModule
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
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
