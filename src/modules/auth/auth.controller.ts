import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/request/signup.dto';
import { Tokens } from './types/tokens.type';
import { AuthGuard } from '@nestjs/passport';
import { GetTokenUserId } from '../../common/decorator/get-token-user-id.decorator';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/request/login.dto';
import { EncryptService } from '../encrypt/encrypt.service';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TokensResponseDto } from './dto/response/token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly encryptService: EncryptService,
  ) {}

  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: TokensResponseDto })
  @ApiForbiddenResponse()
  @ApiInternalServerErrorResponse()
  async signup(@Body() signUpDto: SignUpDto): Promise<Tokens> {
    const createdUser = await this.usersService.create(signUpDto);

    const tokens = await this.authService.generateToken(
      createdUser.id,
      createdUser.email,
    );

    await this.authService.login(createdUser.id, tokens.refreshToken);

    return tokens;
  }

  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TokensResponseDto })
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  async login(@Body() loginDto: LoginDto): Promise<Tokens> {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    await this.encryptService.compareAndThrow(loginDto.password, user.password);

    const tokens = await this.authService.generateToken(user.id, user.email);

    await this.authService.login(user.id, tokens.refreshToken);

    return tokens;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  @ApiInternalServerErrorResponse()
  async logout(@GetTokenUserId() id: number): Promise<{ success: boolean }> {
    const success = await this.authService.logout(id);
    return { success };
  }
}
