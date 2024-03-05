import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Tokens } from './types/tokens.type';
import { RedisService } from '../../library/cache/cache.redis.service';
import { SignInDto } from './dto/signin.dto';
import { EncryptService } from '../encrypt/encrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
    private readonly encryptService: EncryptService,
  ) {}

  async signup(signUpDto: SignUpDto): Promise<Tokens> {
    const createdUser = await this.usersService.create(signUpDto);

    const tokens = await this.generateToken(createdUser.id, createdUser.email);

    return tokens;
  }

  async signin(signInDto: SignInDto): Promise<Tokens> {
    const existingUser = await this.usersService.findOneByEmail(
      signInDto.email,
    );

    if (!existingUser) {
      throw new HttpException(
        'User not have been created',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isMatchingPassword = await this.encryptService.compare(
      signInDto.password,
      existingUser.password,
    );

    if (!isMatchingPassword) {
      throw new HttpException(
        `User's password do not match`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const tokens = await this.generateToken(
      existingUser.id,
      existingUser.email,
    );

    return tokens;
  }

  async logout(userId: number): Promise<{ success: true }> {
    try {
      await this.redisService.del(
        `${this.configService.get<number>('jwt.refresh.prefix')}${userId}`,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to logout',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { success: true };
  }

  async generateToken(id: number, email: string): Promise<Tokens> {
    const payload = {
      id: id,
      email: email,
    };

    try {
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

      await this.redisService.set(
        `${this.configService.get<number>('jwt.refresh.prefix')}${id}`,
        refreshToken,
        this.configService.get<number>('jwt.refresh.expiresIn'),
      );

      return { accessToken, refreshToken };
    } catch (error) {
      throw new HttpException(
        'Failed to create token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
