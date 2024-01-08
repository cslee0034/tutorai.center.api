import { Module } from '@nestjs/common';
import { JWTModule } from 'src/infrastructure/token/jwt.module';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [JWTModule, UsersModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
