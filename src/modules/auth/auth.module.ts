import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from 'src/core/config/config.module';
import { ConfigService } from 'src/core/config/config.service';
import { JwtStrategy } from './strategies';

@Module({
  imports: [
    UtilsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        global: true,
        secret: config.JWT_SECRET_KEY,
        signOptions: { expiresIn: config.JWT_TOKEN_VALID },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule { }
