import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async generateToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email: email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.access.secret'),
        expiresIn: this.configService.get<string>('jwt.access.expiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refresh.secret'),
        expiresIn: this.configService.get<string>('jwt.refresh.expiresIn'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async signup(signUpDto: SignUpDto) {
    const createdUser = await this.usersService.create(signUpDto);
    return createdUser;
  }
}
