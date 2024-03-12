import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { EncryptModule } from '../encrypt/encrypt.module';
import { JWTModule } from '../../library/token/jwt.module';
import { RedisModule } from '../../library/cache/cache.redis.module';

@Module({
  imports: [JWTModule, RedisModule, EncryptModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
