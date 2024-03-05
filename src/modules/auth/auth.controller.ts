import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { Tokens } from './types/tokens.type';
import { AuthGuard } from '@nestjs/passport';
import { SignInDto } from './dto/signin.dto';
import { GetTokenUserId } from '../../common/decorator/get-token-user-id.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/signup')
  signup(@Body() signUpDto: SignUpDto): Promise<Tokens> {
    return this.authService.signup(signUpDto);
  }

  @Post('local/signin')
  signin(@Body() signInDto: SignInDto): Promise<Tokens> {
    return this.authService.signin(signInDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  logout(@GetTokenUserId() userId: number): Promise<{ success: true }> {
    return this.authService.logout(userId);
  }
}
