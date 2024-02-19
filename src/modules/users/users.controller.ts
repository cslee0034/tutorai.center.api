import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiResponse({
    status: 200,
    description: 'Signed up user record',
  })
  @ApiOperation({
    summary: 'Create one user',
  })
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.userService.signup(createUserDto);
    return newUser;
  }
}
