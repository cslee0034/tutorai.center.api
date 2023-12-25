import { Module } from '@nestjs/common';
import { JWTModule } from 'src/infrastructure/token/jwt.module';

@Module({
  imports: [JWTModule],
  providers: [],
  exports: [],
})
export class AuthModule {}
