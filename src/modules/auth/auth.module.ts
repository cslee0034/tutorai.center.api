import { Module, forwardRef } from '@nestjs/common';
import { JWTModule } from '../../library/token/jwt.module';
import { JWTPassportModule } from '../../library/token/passport.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.contoller';
import { AuthService } from './auth.service';

@Module({
  imports: [JWTModule, JWTPassportModule, forwardRef(() => UsersModule)],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
