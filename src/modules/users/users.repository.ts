import { PrismaService } from '../../library/orm/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto;

    return await this.prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });
  }
}
