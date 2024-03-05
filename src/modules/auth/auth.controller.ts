import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/request/signup.dto';
import { Tokens } from './types/tokens.type';
import { AuthGuard } from '@nestjs/passport';
import { GetTokenUserId } from '../../common/decorator/get-token-user-id.decorator';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/request/login.dto';
import { EncryptService } from '../encrypt/encrypt.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly encryptService: EncryptService,
  ) {}

  @Post('local/signup')
  async signup(@Body() signUpDto: SignUpDto) {
    const createdUser = await this.usersService.create(signUpDto);

    const tokens = await this.authService.generateToken(
      createdUser.id,
      createdUser.email,
    );

    await this.authService.login(createdUser.id, tokens.refreshToken);

    return tokens;
  }

  @Post('local/login')
  async login(@Body() loginDto: LoginDto): Promise<Tokens> {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    await this.encryptService.compareAndThrow(loginDto.password, user.password);

    const tokens = await this.authService.generateToken(user.id, user.email);

    await this.authService.login(user.id, tokens.refreshToken);

    return tokens;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  logout(@GetTokenUserId() userId: number): Promise<{ success: true }> {
    return this.authService.logout(userId);
  }
}
