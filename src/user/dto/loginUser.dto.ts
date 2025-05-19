import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'Registered email address',
    required: true
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'securePassword123!',
    description: 'Account password',
    required: true
  })
  @IsNotEmpty()
  readonly password: string;
}