/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from './entities/booking.entity';

describe('BookingsController', () => {
  let controller: BookingsController;
  let bookingsService: {
    create: jest.Mock;
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

  beforeEach(async () => {
    bookingsService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: bookingsService,
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
  });

  describe('create', () => {
    it('should create a booking', async () => {
      const createdBooking = {
        id: '74437fb3-d1bc-421a-aefe-1144c9a9637f',
        ...createBookingDto,
        status: BookingStatus.PENDING,
      };

      bookingsService.create.mockResolvedValue(createdBooking);

      await expect(controller.create(createBookingDto)).resolves.toBe(
        createdBooking,
      );
      expect(bookingsService.create).toHaveBeenCalledWith(createBookingDto);
    });
  });
});
