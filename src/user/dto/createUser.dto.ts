import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    example: "john_doe",
    description: "Username (must be unique)",
  })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    example: "securePassword123!",
    description: "Password (min 8 chars)",
    minLength: 8,
  })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    example: "john@example.com",
    description: "Valid email address",
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}