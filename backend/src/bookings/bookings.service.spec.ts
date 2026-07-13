/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking, BookingStatus } from './entities/booking.entity';
import { Service } from '../services/entities/service.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

describe('BookingsService', () => {
  let service: BookingsService;
  let bookingRepository: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };
  let serviceRepository: {
    findOne: jest.Mock;
  };

  const createBookingDto: CreateBookingDto = {
    customerName: 'Jane Doe',
    customerEmail: 'jane@example.com',
    customerPhone: '+94771234567',
    serviceId: '9f28bb76-46cc-49f8-a48b-5c8b6f9f57db',
    bookingDate: '2000-01-15',
    bookingTime: '10:30',
    notes: 'Window seat if possible',
  };

  const activeService = {
    id: createBookingDto.serviceId,
    title: 'Consultation',
    isActive: true,
  } as Service;

  beforeEach(async () => {
    bookingRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    serviceRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: bookingRepository,
        },
        {
          provide: getRepositoryToken(Service),
          useValue: serviceRepository,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  describe('create', () => {
    it('should create a booking', async () => {
      const booking = {
        customerName: createBookingDto.customerName,
        customerEmail: createBookingDto.customerEmail,
        customerPhone: createBookingDto.customerPhone,
        serviceId: createBookingDto.serviceId,
        service: activeService,
        bookingDate: createBookingDto.bookingDate,
        bookingTime: createBookingDto.bookingTime,
        notes: createBookingDto.notes,
        status: BookingStatus.PENDING,
      } as Booking;

      serviceRepository.findOne.mockResolvedValue(activeService);
      bookingRepository.findOne.mockResolvedValue(null);
      bookingRepository.create.mockReturnValue(booking);
      bookingRepository.save.mockResolvedValue(booking);

      const result = await service.create(createBookingDto);

      expect(result).toBe(booking);
      expect(bookingRepository.create).toHaveBeenCalledWith({
        customerName: createBookingDto.customerName,
        customerEmail: createBookingDto.customerEmail,
        customerPhone: createBookingDto.customerPhone,
        serviceId: createBookingDto.serviceId,
        service: activeService,
        bookingDate: createBookingDto.bookingDate,
        bookingTime: createBookingDto.bookingTime,
        notes: createBookingDto.notes,
        status: BookingStatus.PENDING,
      });
      expect(bookingRepository.save).toHaveBeenCalledWith(booking);
    });

    it('should throw NotFoundException when service is not found', async () => {
      serviceRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createBookingDto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should throw ConflictException when booking already exists', async () => {
      serviceRepository.findOne.mockResolvedValue(activeService);
      bookingRepository.findOne.mockResolvedValue({ id: 'booking-id' });

      await expect(service.create(createBookingDto)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });
});
