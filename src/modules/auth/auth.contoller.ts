import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { Tokens } from './types/tokens.type';
import { AuthGuard } from '@nestjs/passport';
import { SignInDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/signup')
  signup(@Body() signUpDto: SignUpDto): Promise<Tokens> {
    return this.authService.signup(signUpDto);
  }

  @Post('local/signin')
  signin(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('local/test')
  test(@Req() req: Request) {
    console.log(req);
    return;
  }
}
