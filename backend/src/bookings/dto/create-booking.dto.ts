/* eslint-disable prettier/prettier */
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
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  customerPhone: string;

  @IsUUID()
  serviceId: string;

  @IsDateString()
  bookingDate: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'bookingTime must use HH:mm format',
  })
  bookingTime: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
