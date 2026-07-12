/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Service } from '../../services/entities/service.entity';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

@Entity('bookings')
@Index(
  'IDX_prevent_duplicate_bookings',
  ['serviceId', 'bookingDate', 'bookingTime'],
  {
    unique: true,
    where: `"status" != 'CANCELLED'`,
  },
)
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  customerName: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  customerEmail: string;

  @Column({
    type: 'varchar',
    length: 30,
  })
  customerPhone: string;

  @Column({
    type: 'uuid',
  })
  serviceId: string;

  @ManyToOne(() => Service, (service) => service.bookings, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'serviceId',
  })
  service: Service;

  @Column({
    type: 'date',
  })
  bookingDate: string;

  @Column({
    type: 'time',
  })
  bookingTime: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes: string | null;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;
}
