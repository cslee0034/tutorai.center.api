import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class SignUpDto extends CreateUserDto {
  @ApiProperty({
    example: 'example@email.com',
    description: `The user's email address`,
  })
  email: string;

  @ApiProperty({ example: 'example_name', description: `The user's name` })
  name: string;

  @ApiProperty({
    example: 'example_password',
    description: `The user's password`,
  })
  password: string;
}
