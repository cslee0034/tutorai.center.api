import { Module } from '@nestjs/common';
import { JWTModule } from 'src/infrastructure/token/jwt.module';
import { AuthService } from './auth.service';

@Module({
  imports: [JWTModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
