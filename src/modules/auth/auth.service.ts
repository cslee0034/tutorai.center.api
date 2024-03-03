import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(signUpDto: SignUpDto) {
    const createdUser = await this.usersService.create(signUpDto);
    return createdUser;
  }
}
