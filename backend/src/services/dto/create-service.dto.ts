/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    example: 'Haircut',
    maxLength: 150,
    description: 'Service title',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @ApiProperty({
    example: 'A standard haircut session.',
    description: 'Service description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 60,
    minimum: 1,
    description: 'Service duration in minutes',
  })
  @IsNumber()
  @IsPositive()
  duration: number;

  @ApiProperty({
    example: 2500,
    minimum: 0,
    description: 'Service price',
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Whether this service can be booked',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
