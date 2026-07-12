/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  // Create a new service
  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const service = this.serviceRepository.create({
      ...createServiceDto,
      price: createServiceDto.price.toString(),
      isActive: createServiceDto.isActive ?? true,
    });

    return this.serviceRepository.save(service);
  }

  // Get all services
  async findAll(): Promise<Service[]> {
    return this.serviceRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // Get a service by ID
  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }

  // Update a service
  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    const service = await this.findOne(id);

    if (updateServiceDto.title !== undefined) {
      service.title = updateServiceDto.title;
    }

    if (updateServiceDto.description !== undefined) {
      service.description = updateServiceDto.description;
    }

    if (updateServiceDto.duration !== undefined) {
      service.duration = updateServiceDto.duration;
    }

    if (updateServiceDto.price !== undefined) {
      service.price = updateServiceDto.price.toString();
    }

    if (updateServiceDto.isActive !== undefined) {
      service.isActive = updateServiceDto.isActive;
    }

    return this.serviceRepository.save(service);
  }

  // Delete a service
  async remove(id: string): Promise<{ message: string }> {
    const service = await this.findOne(id);

    await this.serviceRepository.remove(service);

    return {
      message: 'Service deleted successfully',
    };
  }
}
