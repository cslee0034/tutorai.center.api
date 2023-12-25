import { Module } from '@nestjs/common';
import { JWTModule } from 'src/infrastructure/token/jwt.module';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [JWTModule, UserModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
