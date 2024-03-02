import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MaxLength(30)
  name: string;

  @ApiProperty()
  @MaxLength(30)
  password: string;
}
