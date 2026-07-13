/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Service } from '../services/entities/service.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking.dto';
import { BookingStatus } from './entities/booking.entity';
import { BookingsQueryDto } from './dto/bookings-query.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  // Create a new booking
  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const service = await this.serviceRepository.findOne({
      where: {
        id: createBookingDto.serviceId,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (!service.isActive) {
      throw new BadRequestException(
        'Bookings cannot be created for an inactive service',
      );
    }

    this.validateBookingDate(
      createBookingDto.bookingDate,
      createBookingDto.bookingTime,
    );

    const duplicateBooking = await this.bookingRepository.findOne({
      where: {
        serviceId: createBookingDto.serviceId,
        bookingDate: createBookingDto.bookingDate,
        bookingTime: createBookingDto.bookingTime,
        status: Not(BookingStatus.CANCELLED),
      },
    });

    if (duplicateBooking) {
      throw new ConflictException(
        'This service is already booked for the selected date and time',
      );
    }

    const booking = this.bookingRepository.create({
      customerName: createBookingDto.customerName,
      customerEmail: createBookingDto.customerEmail,
      customerPhone: createBookingDto.customerPhone,
      serviceId: createBookingDto.serviceId,
      service,
      bookingDate: createBookingDto.bookingDate,
      bookingTime: createBookingDto.bookingTime,
      notes: createBookingDto.notes ?? null,
      status: BookingStatus.PENDING,
    });

    return this.bookingRepository.save(booking);
  }

  // Get all bookings
  async findAll(query: BookingsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.service', 'service')
      .orderBy('booking.bookingDate', 'ASC')
      .addOrderBy('booking.bookingTime', 'ASC')
      .skip(skip)
      .take(limit);

    if (query.status) {
      queryBuilder.andWhere('booking.status = :status', {
        status: query.status,
      });
    }

    if (query.search?.trim()) {
      const search = `%${query.search.trim()}%`;

      queryBuilder.andWhere(
        `(
        booking.customerName ILIKE :search
        OR booking.customerEmail ILIKE :search
        OR booking.customerPhone ILIKE :search
        OR service.title ILIKE :search
      )`,
        { search },
      );
    }

    const [bookings, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data: bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  // Get a booking by ID
  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: {
        id,
      },
      relations: {
        service: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  // Update the status of a booking
  async updateStatus(
    id: string,
    updateBookingStatusDto: UpdateBookingStatusDto,
  ): Promise<Booking> {
    const booking = await this.findOne(id);
    const newStatus = updateBookingStatusDto.status;

    if (
      booking.status === BookingStatus.CANCELLED &&
      newStatus === BookingStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'Cancelled bookings cannot be marked as completed',
      );
    }

    booking.status = newStatus;

    return this.bookingRepository.save(booking);
  }

  // Cancel a booking
  async cancel(id: string): Promise<Booking> {
    const booking = await this.findOne(id);

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('A completed booking cannot be cancelled');
    }

    booking.status = BookingStatus.CANCELLED;

    return this.bookingRepository.save(booking);
  }

  // Validate booking date and time
  private validateBookingDate(bookingDate: string, bookingTime: string): void {
    const bookingDateTime = new Date(`${bookingDate}T${bookingTime}:00`);

    if (Number.isNaN(bookingDateTime.getTime())) {
      throw new BadRequestException('Invalid booking date or booking time');
    }

    const now = new Date();

    if (bookingDateTime.getTime() < now.getTime()) {
      throw new BadRequestException(
        'Booking date and time cannot be in the past',
      );
    }
  }
}
