/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    example: 'John Doe',
    maxLength: 100,
    description: 'Customer full name',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  customerName: string;

  @ApiProperty({
    example: 'john55@example.com',
    description: 'Customer email address',
  })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({
    example: '+94771234567',
    maxLength: 20,
    description: 'Customer phone number',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  customerPhone: string;

  @ApiProperty({
    example: '2a8b4c8f-4d0f-4f6d-9f77-8a0f4cf79011',
    format: 'uuid',
    description: 'Service ID to book',
  })
  @IsUUID()
  serviceId: string;

  @ApiProperty({
    example: '2026-08-15',
    format: 'date',
    description: 'Booking date',
  })
  @IsDateString()
  bookingDate: string;

  @ApiProperty({
    example: '14:30',
    pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
    description: 'Booking time in HH:mm format',
  })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'bookingTime must use HH:mm format',
  })
  bookingTime: string;

  @ApiPropertyOptional({
    example: 'Please call before arrival.',
    description: 'Additional booking notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
