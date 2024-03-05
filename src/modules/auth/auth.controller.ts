import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { Tokens } from './types/tokens.type';
import { AuthGuard } from '@nestjs/passport';
import { SignInDto } from './dto/signin.dto';
import { GetTokenUserId } from '../../common/decorator/get-token-user-id.decorator';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('local/signup')
  async signup(@Body() signUpDto: SignUpDto) {
    const createdUser = await this.usersService.create(signUpDto);
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  logout(@GetTokenUserId() userId: number): Promise<{ success: true }> {
    return this.authService.logout(userId);
  }
}
