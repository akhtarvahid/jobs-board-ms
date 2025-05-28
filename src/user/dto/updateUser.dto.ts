import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'New username',
    required: false,
  })
  readonly username: string;

  @ApiProperty({
    example: "It's beginning to build the world!",
    description: 'User biography',
    required: false,
  })
  readonly bio: string;

  @ApiProperty({
    example: 'http://unsplash.com/hair-color.png',
    description: 'Profile image URL',
    required: false,
  })
  readonly image: string;
}

export class UpdateUserDtoWrapper {
  @ApiProperty({
    type: UpdateUserDto,
  })
  @ValidateNested()
  user: UpdateUserDto;
}