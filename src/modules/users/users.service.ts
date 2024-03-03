import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';
import { UserEntity } from './entities/user.entity';
import { EncryptService } from '../encrypt/encrypt.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptService: EncryptService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existUser = await this.userRepository.findOneByEmail(
      createUserDto.email,
    );

    if (existUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    try {
      createUserDto.password = await this.encryptService.hash(
        createUserDto.password,
      );

      return new UserEntity(await this.userRepository.create(createUserDto));
    } catch (error) {
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
