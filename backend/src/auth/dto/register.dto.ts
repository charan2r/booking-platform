/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Jane Doe',
    description: 'User full name',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'jane44@example.com',
    description: 'Unique user email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123',
    minLength: 8,
    description: 'User password',
  })
  @MinLength(8)
  password: string;
}
