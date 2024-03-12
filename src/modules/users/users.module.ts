import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { EncryptModule } from '../encrypt/encrypt.module';
import { PrismaModule } from '../../library/orm/prisma.module';

@Module({
  imports: [PrismaModule, EncryptModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
